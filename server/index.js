import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import Stripe from 'stripe';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
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

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_CHAT_MODEL = 'gpt-4o-mini';
const OPENAI_IMAGE_MODEL = 'dall-e-2';

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

async function createOpenAIChatCompletion(messages, temperature = 0.7, maxTokens = 2048) {
    if (!OPENAI_API_KEY) {
        throw new Error('OpenAI is not configured on the server.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            messages,
            temperature,
            max_tokens: maxTokens,
            model: OPENAI_CHAT_MODEL
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || `OpenAI request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

async function createOpenAIImageGeneration(prompt) {
    if (!OPENAI_API_KEY) {
        throw new Error('OpenAI is not configured on the server.');
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            prompt,
            n: 1,
            size: '512x512',
            model: OPENAI_IMAGE_MODEL
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || `OpenAI image request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.data?.[0]?.url || '';
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

    const { userEmail } = req.body;

    if (!isValidEmail(userEmail)) {
        res.status(400).json({ error: 'A valid email is required.' });
        return;
    }

    if (!process.env.STRIPE_PRICE_ID) {
        res.status(503).json({ error: 'STRIPE_PRICE_ID is not configured.' });
        return;
    }

    try {
        const trustedOrigin = getTrustedOrigin(req.headers.origin);
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer_email: userEmail,
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            success_url: `${trustedOrigin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${trustedOrigin}/paywall?canceled=true`,
            metadata: { userEmail },
        });

        console.log(`Checkout session created for ${userEmail}`);
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

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const userEmail = session.customer_email || session.metadata?.userEmail;

                if (userEmail && supabase) {
                    // Fetch user profile so we can personalise the email
                    const { data: profile } = await supabase
                        .from('user_profiles')
                        .select('name')
                        .eq('email', userEmail)
                        .single();

                    await supabase.from('user_profiles').update({
                        is_entitled: true,
                        stripe_customer_id: session.customer,
                        stripe_subscription_id: session.subscription
                    }).eq('email', userEmail);
                    console.log(`Entitlement granted for ${userEmail} via Supabase`);

                    // Send subscription welcome email
                    await sendEmail(
                        userEmail,
                        buildSubscriptionWelcomeEmail({ name: profile?.name, email: userEmail })
                    );
                }
                break;
            }

            case 'customer.subscription.deleted':
            case 'customer.subscription.updated': {
                const subscription = event.data.object;

                if (supabase) {
                    const isEntitled = ['active', 'trialing'].includes(subscription.status);
                    await supabase.from('user_profiles').update({
                        is_entitled: isEntitled
                    }).eq('stripe_subscription_id', subscription.id);
                    console.log(`Subscription ${subscription.status} for sub ${subscription.id} via Supabase`);
                }
                break;
            }

            default:
                console.log(`Unhandled Stripe event: ${event.type}`);
        }

        res.json({ received: true });
    },
);

app.post('/api/ai/generate', async (req, res) => {
    const { messages, temperature, maxTokens } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: 'messages must be a non-empty array.' });
        return;
    }

    try {
        const text = await createOpenAIChatCompletion(messages, temperature, maxTokens);
        res.json({ text });
    } catch (error) {
        console.error('AI generation error:', error);
        res.status(503).json({ error: error.message });
    }
});

app.post('/api/ai/image', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'prompt must be a valid string.' });
        return;
    }

    try {
        const url = await createOpenAIImageGeneration(prompt);
        res.json({ url });
    } catch (error) {
        console.error('AI image generation error:', error);
        res.status(503).json({ error: error.message });
    }
});

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
    res.json({
        status: 'ok',
        version: process.env.npm_package_version || '3.1.0',
        timestamp: new Date().toISOString(),
        features: {
            stripe: Boolean(stripe),
            adminBypass: isAdminBypassConfigured(),
            aiProxy: Boolean(OPENAI_API_KEY),
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
