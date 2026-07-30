import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import Stripe from 'stripe';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { createGatewayRouter } from './gateway/index.js';
import { configuredProviders as gatewayConfiguredProviders } from './gateway/providers.js';
import {
    sendEmail,
    buildWelcomeEmail,
    buildCertificateEmail,
    buildFinalCertificateEmail,
    buildSubscriptionWelcomeEmail,
} from './emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`), override: false });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: false });
dotenv.config();

const app = express();
const PORT = Number(process.env.API_PORT || 3001);
const ADMIN_SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const DEFAULT_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4173',
];

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;


const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const adminSessions = new Map();

// Entitlements are now managed in Supabase via user_profiles table

function generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
}

function normalizeOrigin(origin) {
    if (!origin || typeof origin !== 'string') {
        return null;
    }

    try {
        const url = new URL(origin);
        return `${url.protocol}//${url.host}`;
    } catch {
        return null;
    }
}

function getAllowedOrigins() {
    const configuredOrigins = (process.env.CORS_ORIGINS || '')
        .split(',')
        .map((origin) => normalizeOrigin(origin.trim()))
        .filter(Boolean);

    if (configuredOrigins.length > 0) {
        return [...new Set(configuredOrigins)];
    }

    return DEFAULT_ALLOWED_ORIGINS;
}

function isAdminBypassConfigured() {
    return Boolean(process.env.ADMIN_BYPASS_USERNAME && process.env.ADMIN_BYPASS_PASSWORD);
}

function cleanupExpiredAdminSessions(now = Date.now()) {
    for (const [token, session] of adminSessions.entries()) {
        if (session.expiresAt <= now) {
            adminSessions.delete(token);
        }
    }
}

function getTrustedOrigin(candidateOrigin) {
    const allowedOrigins = getAllowedOrigins();
    const normalizedOrigin = normalizeOrigin(candidateOrigin);

    if (normalizedOrigin && allowedOrigins.includes(normalizedOrigin)) {
        return normalizedOrigin;
    }

    return allowedOrigins[0] || DEFAULT_ALLOWED_ORIGINS[0];
}

function isValidEmail(value) {
    return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function requireStripe(res) {
    if (stripe) {
        return true;
    }

    res.status(503).json({
        error: 'Stripe is not configured on the server.',
    });

    return false;
}

app.disable('x-powered-by');

app.use(cors({
    origin(origin, callback) {
        const allowedOrigins = getAllowedOrigins();
        const normalizedOrigin = normalizeOrigin(origin);

        if (!origin || (normalizedOrigin && allowedOrigins.includes(normalizedOrigin))) {
            callback(null, true);
            return;
        }

        callback(new Error('Origin not allowed by CORS.'));
    },
    credentials: true,
}));

app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});

app.use((req, res, next) => {
    if (req.path === '/api/stripe/webhook') {
        next();
        return;
    }

    express.json({ limit: '1mb' })(req, res, next);
});

const adminSessionCleanupTimer = setInterval(() => cleanupExpiredAdminSessions(), 15 * 60 * 1000);
adminSessionCleanupTimer.unref?.();

app.post('/api/admin/bypass', (req, res) => {
    if (!isAdminBypassConfigured()) {
        res.status(503).json({
            success: false,
            error: 'Admin bypass is not configured on the server.',
        });
        return;
    }

    const { username, password, userEmail } = req.body;
    const validUsername = process.env.ADMIN_BYPASS_USERNAME;
    const validPassword = process.env.ADMIN_BYPASS_PASSWORD;

    if (!isValidEmail(userEmail)) {
        res.status(400).json({
            success: false,
            error: 'A valid user email is required.',
        });
        return;
    }

    if (username === validUsername && password === validPassword) {
        const token = generateSessionToken();

        adminSessions.set(token, {
            userEmail,
            isAdmin: true,
            createdAt: Date.now(),
            expiresAt: Date.now() + ADMIN_SESSION_TTL_MS,
        });

        console.log(`Admin bypass granted for ${userEmail}`);
        res.json({
            success: true,
            is_admin: true,
            token,
        });
        return;
    }

    console.warn(`Admin bypass denied for ${userEmail}`);
    res.status(401).json({
        success: false,
        error: 'Invalid admin credentials.',
    });
});

app.get('/api/billing/status', (req, res) => {
    const userEmail = req.query.email;
    const adminToken = req.query.token;

    if (!isValidEmail(userEmail)) {
        res.status(400).json({ error: 'Email required.' });
        return;
    }

    let isAdmin = false;

    if (typeof adminToken === 'string' && adminSessions.has(adminToken)) {
        const session = adminSessions.get(adminToken);

        if (session.expiresAt > Date.now()) {
            isAdmin = true;
        } else {
            adminSessions.delete(adminToken);
        }
    }

    let entitled = false;

    if (supabase && userEmail) {
        supabase.from('user_profiles').select('is_entitled').eq('email', userEmail).single().then(({ data }) => {
            if (data) {
                entitled = data.is_entitled === true;
            }
            res.json({
                entitled: isAdmin || entitled,
                is_admin: isAdmin,
                email: userEmail,
            });
        }).catch(() => {
            res.json({ entitled: isAdmin, is_admin: isAdmin, email: userEmail });
        });
        return;
    }

    res.json({
        entitled: isAdmin,
        is_admin: isAdmin,
        email: userEmail,
    });
});

app.post('/api/stripe/create-checkout-session', async (req, res) => {
    if (!requireStripe(res)) {
        return;
    }

    const { userEmail, userId, programKey: rawProgramKey, returnPath } = req.body;

    if (!isValidEmail(userEmail)) {
        res.status(400).json({ error: 'A valid email is required.' });
        return;
    }

    // Per-program price lookup, with global STRIPE_PRICE_ID as backward-compat fallback.
    const normalizedKey = (rawProgramKey || '').toLowerCase();
    const programKey = normalizedKey === 'pioneer' || normalizedKey === 'ai-pioneer'
        ? 'pioneer'
        : normalizedKey === 'vanguard'
            ? 'vanguard'
            : null;
    const priceId = (programKey === 'pioneer' && process.env.STRIPE_PIONEER_PRICE_ID)
        || (programKey === 'vanguard' && process.env.STRIPE_VANGUARD_PRICE_ID)
        || process.env.STRIPE_PRICE_ID;

    if (!priceId) {
        res.status(503).json({ error: 'No Stripe price configured for this program.' });
        return;
    }

    try {
        const trustedOrigin = getTrustedOrigin(req.headers.origin);
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer_email: userEmail,
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${trustedOrigin}/billing/success?session_id={CHECKOUT_SESSION_ID}&program=${programKey ?? ''}`,
            cancel_url: `${trustedOrigin}/paywall?canceled=true${programKey ? `&program=${programKey}` : ''}`,
            metadata: {
                userEmail,
                user_id: userId || '',
                program_key: programKey || '',
                return_to: returnPath || '',
            },
            subscription_data: {
                metadata: {
                    userEmail,
                    user_id: userId || '',
                    program_key: programKey || '',
                },
            },
        });

        console.log(`Checkout session created for ${userEmail} (program=${programKey || 'unspecified'})`);
        res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post(
    '/api/stripe/webhook',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
        if (!requireStripe(res)) {
            return;
        }

        const signature = req.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!webhookSecret) {
            res.status(503).send('Stripe webhook secret is not configured.');
            return;
        }

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
        } catch (error) {
            console.error('Webhook signature verification failed:', error.message);
            res.status(400).send(`Webhook Error: ${error.message}`);
            return;
        }

        // Helper: upsert program_entitlements when we know the program key.
        const upsertProgramEntitlement = async ({
            userId, programKey, status, session, subscription,
        }) => {
            if (!supabase || !userId || !programKey) return;
            const payload = {
                user_id: userId,
                program_key: programKey,
                status,
                source: 'stripe',
                stripe_customer_id: session?.customer ?? subscription?.customer ?? null,
                stripe_checkout_session_id: session?.id ?? null,
                stripe_subscription_id: session?.subscription ?? subscription?.id ?? null,
                stripe_payment_intent_id: session?.payment_intent ?? null,
                stripe_price_id: subscription?.items?.data?.[0]?.price?.id ?? null,
                amount_total: session?.amount_total ?? null,
                currency: session?.currency ?? subscription?.currency ?? null,
                access_starts_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            const { error } = await supabase
                .from('program_entitlements')
                .upsert(payload, { onConflict: 'user_id,program_key' });
            if (error) console.error('program_entitlements upsert failed:', error.message);
            else console.log(`Entitlement ${status} for user=${userId} program=${programKey}`);
        };

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const userEmail = session.customer_email || session.metadata?.userEmail;
                const programKey = (session.metadata?.program_key || '').toLowerCase() || null;
                let userId = session.metadata?.user_id || null;

                if (userEmail && supabase) {
                    const { data: profile } = await supabase
                        .from('user_profiles')
                        .select('id, name')
                        .eq('email', userEmail)
                        .maybeSingle();
                    if (!userId && profile?.id) userId = profile.id;

                    // Legacy global flag — kept for backward compatibility.
                    await supabase.from('user_profiles').update({
                        is_entitled: true,
                        stripe_customer_id: session.customer,
                        stripe_subscription_id: session.subscription,
                    }).eq('email', userEmail);

                    // Per-program entitlement (the canonical record).
                    if (programKey === 'pioneer' || programKey === 'vanguard') {
                        await upsertProgramEntitlement({
                            userId, programKey, status: 'active', session,
                        });
                    } else {
                        console.warn(`checkout.session.completed without program_key metadata for ${userEmail}`);
                    }

                    await sendEmail(
                        userEmail,
                        buildSubscriptionWelcomeEmail({ name: profile?.name, email: userEmail }),
                    );
                }
                break;
            }

            case 'customer.subscription.deleted':
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                if (!supabase) break;

                const nextStatus = subscription.status === 'active' ? 'active'
                    : subscription.status === 'trialing' ? 'trialing'
                    : subscription.status === 'past_due' ? 'past_due'
                    : 'canceled';
                const isEntitled = ['active', 'trialing'].includes(subscription.status);

                await supabase.from('user_profiles').update({ is_entitled: isEntitled })
                    .eq('stripe_subscription_id', subscription.id);

                const programKey = (subscription.metadata?.program_key || '').toLowerCase();
                const userId = subscription.metadata?.user_id || null;
                if ((programKey === 'pioneer' || programKey === 'vanguard') && userId) {
                    await upsertProgramEntitlement({
                        userId, programKey, status: nextStatus, subscription,
                    });
                } else {
                    // Best-effort: update existing row by subscription id.
                    await supabase.from('program_entitlements')
                        .update({ status: nextStatus, updated_at: new Date().toISOString() })
                        .eq('stripe_subscription_id', subscription.id);
                }
                console.log(`Subscription ${subscription.status} for sub ${subscription.id}`);
                break;
            }

            default:
                console.log(`Unhandled Stripe event: ${event.type}`);
        }

        res.json({ received: true });
    },
);

// ─── ZEN AI Gateway ────────────────────────────────────────────────────────
// Every AI call for every program routes through here: classroom safety
// guardrails, per-user rate limits and spend caps, caching, provider failover,
// and usage accounting all live in server/gateway/.

const gatewayRouter = createGatewayRouter();

app.use('/api/gateway/v1', gatewayRouter);

// Back-compat: /api/ai/generate and /api/ai/image stay live so existing lesson
// code keeps working, but they now inherit every gateway protection instead of
// calling OpenAI directly.

app.use('/api/ai', gatewayRouter);

// ─── Email endpoints ───────────────────────────────────────────────────────

/**
 * POST /api/email/welcome
 * Called from the frontend after a successful signup.
 * Body: { email, name? }
 */
app.post('/api/email/welcome', async (req, res) => {
    const { email, name } = req.body;

    if (!isValidEmail(email)) {
        res.status(400).json({ error: 'A valid email is required.' });
        return;
    }

    try {
        const result = await sendEmail(email, buildWelcomeEmail({ name, email }));
        res.json({ sent: true, id: result?.id ?? null });
    } catch (error) {
        console.error('Welcome email error:', error);
        res.status(502).json({ error: 'Unable to send welcome email.' });
    }
});

/**
 * POST /api/email/certificate
 * Called from the frontend when a module certificate is earned.
 * Body: { email, name?, moduleName, moduleNumber, certificateId, certificateHash }
 */
app.post('/api/email/certificate', async (req, res) => {
    const { email, name, moduleName, moduleNumber, certificateId, certificateHash } = req.body;

    if (!isValidEmail(email) || !moduleName || !certificateId) {
        res.status(400).json({ error: 'A valid email, moduleName, and certificateId are required.' });
        return;
    }

    const template = moduleNumber === 'final'
        ? buildFinalCertificateEmail({ name, email, certificateId, certificateHash })
        : buildCertificateEmail({ name, email, moduleName, moduleNumber, certificateId, certificateHash });

    try {
        const result = await sendEmail(email, template);
        res.json({ sent: true, id: result?.id ?? null });
    } catch (error) {
        console.error('Certificate email error:', error);
        res.status(502).json({ error: 'Unable to send certificate email.' });
    }
});

app.get('/api/health', (_req, res) => {
    const gatewayProviders = gatewayConfiguredProviders();
    res.json({
        status: 'ok',
        version: process.env.npm_package_version || '3.1.0',
        timestamp: new Date().toISOString(),
        features: {
            stripe: Boolean(stripe),
            adminBypass: isAdminBypassConfigured(),
            aiProxy: gatewayProviders.length > 0,
            aiGateway: {
                mounted: '/api/gateway/v1',
                providers: gatewayProviders,
            },
            email: Boolean(process.env.RESEND_API_KEY),
            supabase: Boolean(supabase),
        },
    });
});

// Serve frontend static files
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback for React Router (must be the last route)
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZEN Vanguard API server listening on http://localhost:${PORT}`);
});
