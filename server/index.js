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
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;


const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const adminSessions = new Map();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_CHAT_MODEL = 'gpt-4o-mini';
const OPENAI_IMAGE_MODEL = 'dall-e-2';
const AI_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const AI_TEXT_RATE_LIMIT = 30;
const AI_IMAGE_RATE_LIMIT = 6;
const aiRateLimits = new Map();

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

function requireStripe(res) {
    if (stripe) {
        return true;
    }

    res.status(503).json({
        error: 'Stripe is not configured on the server.',
    });

    return false;
}

async function requireAuthenticatedUser(req, res) {
    if (!supabase) {
        res.status(503).json({ error: 'Privileged Supabase access is not configured on the server.' });
        return null;
    }

    const authorization = req.headers.authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
    if (!token) {
        res.status(401).json({ error: 'A Supabase access token is required.' });
        return null;
    }

    let data;
    let error;
    try {
        ({ data, error } = await supabase.auth.getUser(token));
    } catch (authError) {
        console.error('Supabase Auth verification failed:', authError?.message || authError);
        res.status(503).json({ error: 'The Supabase session could not be verified.' });
        return null;
    }
    if (error || !data?.user?.id || !data.user.email) {
        res.status(401).json({ error: 'The Supabase session is invalid or expired.' });
        return null;
    }

    return data.user;
}

function hasOpenAccessWindow(entitlement, now = Date.now()) {
    const startsAt = entitlement.access_starts_at
        ? Date.parse(entitlement.access_starts_at)
        : null;
    const endsAt = entitlement.access_ends_at
        ? Date.parse(entitlement.access_ends_at)
        : null;

    return (startsAt === null || (Number.isFinite(startsAt) && startsAt <= now))
        && (endsAt === null || (Number.isFinite(endsAt) && endsAt > now));
}

async function requirePaidAiUser(req, res) {
    const authenticatedUser = await requireAuthenticatedUser(req, res);
    if (!authenticatedUser) return null;

    const normalizedEmail = authenticatedUser.email.trim().toLowerCase();
    let adminResult;
    let entitlementResult;
    try {
        [adminResult, entitlementResult] = await Promise.all([
            supabase
                .from('admin_allowlist')
                .select('email')
                .ilike('email', normalizedEmail)
                .limit(5),
            supabase
                .from('program_entitlements')
                .select('program_key,status,access_starts_at,access_ends_at')
                .eq('user_id', authenticatedUser.id)
                .in('status', ['active', 'trialing']),
        ]);
    } catch (accessError) {
        console.error('Canonical AI access lookup failed:', accessError?.message || accessError);
        res.status(503).json({ error: 'Program access could not be verified.' });
        return null;
    }

    const isAdmin = !adminResult.error && (adminResult.data ?? []).some(
        (row) => row.email?.trim().toLowerCase() === normalizedEmail,
    );
    const isEntitled = !entitlementResult.error && (entitlementResult.data ?? []).some(
        (row) => (row.program_key === 'pioneer' || row.program_key === 'vanguard')
            && hasOpenAccessWindow(row),
    );

    if (isAdmin || isEntitled) {
        return authenticatedUser;
    }

    if (adminResult.error || entitlementResult.error) {
        console.error('Canonical AI access lookup failed:', {
            admin: adminResult.error?.message,
            entitlement: entitlementResult.error?.message,
        });
        res.status(503).json({ error: 'Program access could not be verified.' });
        return null;
    }

    res.status(403).json({ error: 'An active Pioneer or Vanguard entitlement is required.' });
    return null;
}

function applyAiRateLimit(res, userId, bucket, limit) {
    const now = Date.now();
    const key = `${bucket}:${userId}`;
    const existing = aiRateLimits.get(key);
    const entry = !existing || existing.resetAt <= now
        ? { count: 0, resetAt: now + AI_RATE_LIMIT_WINDOW_MS }
        : existing;

    if (entry.count >= limit) {
        const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
        res.setHeader('Retry-After', String(retryAfterSeconds));
        res.setHeader('X-RateLimit-Limit', String(limit));
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)));
        res.status(429).json({ error: 'AI request limit reached. Please try again shortly.' });
        return false;
    }

    entry.count += 1;
    aiRateLimits.set(key, entry);
    res.setHeader('X-RateLimit-Limit', String(limit));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, limit - entry.count)));
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)));
    return true;
}

function getConfiguredProgramPriceId(programKey) {
    if (programKey === 'pioneer') return process.env.STRIPE_PIONEER_PRICE_ID || null;
    if (programKey === 'vanguard') return process.env.STRIPE_VANGUARD_PRICE_ID || null;
    return null;
}

function normalizeProgramReturnPath(programKey, candidatePath) {
    if (typeof candidatePath !== 'string'
        || candidatePath.length === 0
        || candidatePath.length > 500
        || !candidatePath.startsWith('/')
        || candidatePath.startsWith('//')) {
        return null;
    }

    let parsed;
    try {
        parsed = new URL(candidatePath, 'https://checkout.zen.local');
    } catch {
        return null;
    }

    if (parsed.origin !== 'https://checkout.zen.local') return null;

    const pathname = parsed.pathname.toLowerCase();
    const matchesProgram = programKey === 'pioneer'
        ? pathname === '/programs/pioneer'
            || pathname.startsWith('/programs/pioneer/')
            || pathname === '/programs/ai-pioneer'
            || pathname.startsWith('/programs/ai-pioneer/')
        : pathname === '/dashboard'
            || pathname === '/vanguard'
            || pathname.startsWith('/vanguard/')
            || /^\/module\/[1-4](?:\/|$)/.test(pathname)
            || pathname === '/programs/vanguard'
            || pathname.startsWith('/programs/vanguard/');

    if (!matchesProgram) return null;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

function stripeObjectId(value) {
    if (typeof value === 'string') return value;
    return value && typeof value.id === 'string' ? value.id : null;
}

function parseCheckoutReference(value) {
    const match = typeof value === 'string'
        ? value.match(/^(pioneer|vanguard)_([0-9a-f]{32})$/i)
        : null;
    if (!match) return null;
    const compactId = match[2].toLowerCase();
    return {
        programKey: match[1].toLowerCase(),
        userId: `${compactId.slice(0, 8)}-${compactId.slice(8, 12)}-${compactId.slice(12, 16)}-${compactId.slice(16, 20)}-${compactId.slice(20)}`,
    };
}

async function validatePaidProgramCheckoutSession(session) {
    if (session.payment_link) {
        return { accepted: false, reason: 'payment_link_not_supported' };
    }
    if (session.mode !== 'payment') {
        throw new Error(`Checkout ${session.id} is not a one-time payment session.`);
    }
    if (session.metadata?.purchase_mode !== 'payment') {
        throw new Error(`Checkout ${session.id} is missing one-time purchase metadata.`);
    }

    const programKey = session.metadata?.program_key;
    const userId = session.metadata?.user_id;
    const reference = parseCheckoutReference(session.client_reference_id);
    const expectedReference = programKey && userId
        ? `${programKey}_${String(userId).replaceAll('-', '')}`
        : null;

    if ((programKey !== 'pioneer' && programKey !== 'vanguard')
        || !reference
        || reference.programKey !== programKey
        || reference.userId !== userId
        || session.client_reference_id !== expectedReference) {
        throw new Error(`Checkout ${session.id} has inconsistent program or account metadata.`);
    }

    const expectedPriceId = getConfiguredProgramPriceId(programKey);
    if (!expectedPriceId) {
        throw new Error(`No Stripe price is configured for ${programKey}.`);
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
    if (lineItems.has_more || lineItems.data.length !== 1) {
        throw new Error(`Checkout ${session.id} must contain exactly one program line item.`);
    }

    const [lineItem] = lineItems.data;
    if (lineItem.quantity !== 1 || lineItem.price?.id !== expectedPriceId) {
        throw new Error(`Checkout ${session.id} does not match the configured ${programKey} price.`);
    }

    const paymentIntentId = stripeObjectId(session.payment_intent);
    if (!paymentIntentId) {
        throw new Error(`Checkout ${session.id} is missing its PaymentIntent.`);
    }

    return {
        accepted: true,
        programKey,
        userId,
        priceId: expectedPriceId,
        paymentIntentId,
    };
}

async function applyStripeProgramEntitlementEvent({
    event,
    action,
    userId,
    programKey,
    paymentIntentId,
    stripeObjectId: eventObjectId,
    checkoutSessionId = null,
    customerId = null,
    priceId = null,
    amountTotal = null,
    currency = null,
    note = null,
    restoreEligible = true,
}) {
    const { data, error } = await supabase.rpc('apply_stripe_program_entitlement_event', {
        _event_id: event.id,
        _event_type: event.type,
        _event_created_at: new Date(event.created * 1000).toISOString(),
        _stripe_object_id: eventObjectId,
        _action: action,
        _user_id: userId,
        _program_key: programKey,
        _payment_intent_id: paymentIntentId,
        _checkout_session_id: checkoutSessionId,
        _stripe_customer_id: customerId,
        _stripe_price_id: priceId,
        _amount_total: amountTotal,
        _currency: currency,
        _note: note,
        _restore_eligible: restoreEligible,
    });
    if (error) throw new Error(`Stripe entitlement event failed: ${error.message}`);
    return data;
}

async function findProgramEntitlementIdentity(paymentIntentId) {
    const { data: currentRows, error: currentError } = await supabase
        .from('program_entitlements')
        .select('user_id,program_key')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .limit(2);
    if (currentError) throw currentError;
    if ((currentRows ?? []).length > 1) {
        throw new Error(`PaymentIntent ${paymentIntentId} maps to multiple program entitlements.`);
    }
    if (currentRows?.[0]) return currentRows[0];

    const { data: ledgerRows, error: ledgerError } = await supabase
        .from('stripe_webhook_events')
        .select('user_id,program_key')
        .eq('payment_intent_id', paymentIntentId)
        .not('user_id', 'is', null)
        .not('program_key', 'is', null)
        .order('stripe_created_at', { ascending: false })
        .limit(1);
    if (ledgerError) throw ledgerError;
    if (ledgerRows?.[0]) return ledgerRows[0];

    // Negative events can arrive before checkout.session.completed. Recover the
    // identity only from the one exact server-created Checkout Session so the
    // later checkout event cannot regrant a refunded or disputed purchase.
    const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId, limit: 2 });
    if (sessions.has_more || sessions.data.length !== 1) return null;
    const [session] = sessions.data;
    if (session.payment_status !== 'paid' || session.payment_link) return null;
    try {
        const validation = await validatePaidProgramCheckoutSession(session);
        if (!validation.accepted || validation.paymentIntentId !== paymentIntentId) return null;
        return { user_id: validation.userId, program_key: validation.programKey };
    } catch (validationError) {
        console.warn(`Ignoring Stripe lifecycle event with an unverified Checkout Session: ${validationError.message}`);
        return null;
    }
}

async function resolvePaymentIntentForStripeObject(object) {
    const directPaymentIntentId = stripeObjectId(object.payment_intent);
    if (directPaymentIntentId) return directPaymentIntentId;

    const chargeId = stripeObjectId(object.charge);
    if (!chargeId) return null;
    const charge = await stripe.charges.retrieve(chargeId);
    return stripeObjectId(charge.payment_intent);
}

async function getDisputeRestoreEligibility(paymentIntentId, currentDisputeId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['latest_charge'],
    });
    const latestCharge = typeof paymentIntent.latest_charge === 'string'
        ? await stripe.charges.retrieve(paymentIntent.latest_charge)
        : paymentIntent.latest_charge;
    const fullyRefunded = Boolean(latestCharge?.refunded)
        || (Number.isFinite(latestCharge?.amount)
            && latestCharge.amount > 0
            && latestCharge.amount_refunded >= latestCharge.amount);

    const disputes = await stripe.disputes.list({ payment_intent: paymentIntentId, limit: 100 });
    if (disputes.has_more) {
        throw new Error(`PaymentIntent ${paymentIntentId} has too many disputes to reconcile safely.`);
    }
    const blockingStatuses = new Set([
        'needs_response',
        'under_review',
        'warning_needs_response',
        'warning_under_review',
        'lost',
    ]);
    const hasOtherBlockingDispute = disputes.data.some((dispute) => (
        dispute.id !== currentDisputeId && blockingStatuses.has(dispute.status)
    ));

    return {
        eligible: !fullyRefunded && !hasOtherBlockingDispute,
        reason: fullyRefunded
            ? 'payment_fully_refunded'
            : hasOtherBlockingDispute
                ? 'another_dispute_blocks_access'
                : null,
    };
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

const aiRateLimitCleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of aiRateLimits.entries()) {
        if (entry.resetAt <= now) aiRateLimits.delete(key);
    }
}, AI_RATE_LIMIT_WINDOW_MS);
aiRateLimitCleanupTimer.unref?.();

app.post('/api/admin/bypass', async (req, res) => {
    if (!isAdminBypassConfigured()) {
        res.status(503).json({
            success: false,
            error: 'Admin bypass is not configured on the server.',
        });
        return;
    }

    const authenticatedUser = await requireAuthenticatedUser(req, res);
    if (!authenticatedUser) return;

    const userEmail = authenticatedUser.email.trim().toLowerCase();
    const { data: adminRows, error: adminLookupError } = await supabase
        .from('admin_allowlist')
        .select('email')
        .ilike('email', userEmail)
        .limit(5);
    if (adminLookupError) {
        res.status(503).json({ success: false, error: 'Admin access could not be verified.' });
        return;
    }
    if (!(adminRows ?? []).some((row) => row.email?.trim().toLowerCase() === userEmail)) {
        res.status(403).json({ success: false, error: 'This account is not an administrator.' });
        return;
    }

    const { username, password } = req.body;
    const validUsername = process.env.ADMIN_BYPASS_USERNAME;
    const validPassword = process.env.ADMIN_BYPASS_PASSWORD;

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

app.get('/api/billing/status', async (req, res) => {
    const authenticatedUser = await requireAuthenticatedUser(req, res);
    if (!authenticatedUser) return;
    const userEmail = authenticatedUser.email;
    const adminToken = req.query.token;

    let isAdmin = false;

    if (typeof adminToken === 'string' && adminSessions.has(adminToken)) {
        const session = adminSessions.get(adminToken);

        if (session.expiresAt > Date.now()
            && session.userEmail.toLowerCase() === userEmail.toLowerCase()) {
            isAdmin = true;
        } else {
            adminSessions.delete(adminToken);
        }
    }

    if (supabase && userEmail) {
        supabase.from('program_entitlements')
            .select('status,access_starts_at,access_ends_at')
            .eq('user_id', authenticatedUser.id)
            .in('status', ['active', 'trialing'])
            .then(({ data, error }) => {
            if (error) throw error;
            const now = Date.now();
            const entitled = (data ?? []).some((row) => (
                (!row.access_starts_at || Date.parse(row.access_starts_at) <= now)
                && (!row.access_ends_at || Date.parse(row.access_ends_at) > now)
            ));
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

    const authenticatedUser = await requireAuthenticatedUser(req, res);
    if (!authenticatedUser) return;
    const { programKey: rawProgramKey, returnPath } = req.body;
    const userEmail = authenticatedUser.email;
    const userId = authenticatedUser.id;

    const normalizedKey = typeof rawProgramKey === 'string' ? rawProgramKey.toLowerCase() : '';
    const programKey = normalizedKey === 'pioneer' || normalizedKey === 'vanguard'
        ? normalizedKey
        : null;

    if (!programKey) {
        res.status(400).json({ error: 'A valid Pioneer or Vanguard program key is required.' });
        return;
    }

    const safeReturnPath = normalizeProgramReturnPath(programKey, returnPath);
    if (!safeReturnPath) {
        res.status(400).json({ error: 'The checkout return path does not match the selected program.' });
        return;
    }

    const priceId = getConfiguredProgramPriceId(programKey);

    if (!priceId) {
        res.status(503).json({ error: 'No Stripe price configured for this program.' });
        return;
    }

    const { data: existingEntitlement, error: entitlementLookupError } = await supabase
        .from('program_entitlements')
        .select('status,source,access_starts_at,access_ends_at')
        .eq('user_id', userId)
        .eq('program_key', programKey)
        .maybeSingle();
    if (entitlementLookupError) {
        res.status(503).json({ error: 'Program access could not be verified before checkout.' });
        return;
    }
    if (existingEntitlement
        && ['active', 'trialing'].includes(existingEntitlement.status)
        && hasOpenAccessWindow(existingEntitlement)) {
        res.status(409).json({ error: 'This account already has access to the selected program. No payment was started.' });
        return;
    }
    if (existingEntitlement && existingEntitlement.source !== 'stripe') {
        res.status(409).json({ error: 'This program access is managed by an administrator. No payment was started.' });
        return;
    }

    try {
        const trustedOrigin = getTrustedOrigin(req.headers.origin);
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            submit_type: 'pay',
            customer_email: userEmail,
            client_reference_id: `${programKey}_${userId.replaceAll('-', '')}`,
            customer_creation: 'always',
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${trustedOrigin}/billing/success?session_id={CHECKOUT_SESSION_ID}&program=${programKey}`,
            cancel_url: `${trustedOrigin}/paywall?canceled=true&program=${programKey}`,
            metadata: {
                userEmail,
                user_id: userId,
                program_key: programKey,
                purchase_mode: 'payment',
                return_to: safeReturnPath,
            },
            payment_intent_data: {
                metadata: {
                    user_id: userId,
                    program_key: programKey,
                },
            },
        });

        console.log(`Checkout session created for ${userEmail} (program=${programKey}, mode=payment)`);
        res.json({ url: session.url, sessionId: session.id, mode: 'payment' });
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

        if (!supabase) {
            res.status(503).send('Privileged Supabase access is not configured.');
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

        try {
        switch (event.type) {
            case 'checkout.session.completed':
            case 'checkout.session.async_payment_succeeded': {
                const session = event.data.object;
                if (session.payment_link) {
                    console.warn(`Ignoring Payment Link checkout ${session.id}; program access requires an authenticated server-created Checkout Session.`);
                    break;
                }
                if (session.payment_status !== 'paid') {
                    console.log(`Checkout ${session.id} is awaiting payment confirmation.`);
                    break;
                }
                const validation = await validatePaidProgramCheckoutSession(session);
                if (!validation.accepted) break;
                const {
                    userId, programKey, priceId, paymentIntentId,
                } = validation;

                const { data: authLookup, error: authLookupError } = await supabase.auth.admin.getUserById(userId);
                const authUser = authLookup?.user;
                if (authLookupError || !authUser?.email) {
                    throw new Error(`No Supabase Auth account found for paid checkout user ${userId}.`);
                }

                const paidEmail = String(session.customer_details?.email || session.customer_email || '').trim().toLowerCase();
                if (paidEmail && paidEmail !== authUser.email.toLowerCase()) {
                    throw new Error('Paid checkout email does not match the authenticated Supabase account.');
                }
                const metadataEmail = String(session.metadata?.userEmail || '').trim().toLowerCase();
                if (!metadataEmail || metadataEmail !== authUser.email.toLowerCase()) {
                    throw new Error('Checkout metadata email does not match the authenticated Supabase account.');
                }

                const { data: profile, error: profileLookupError } = await supabase
                    .from('user_profiles')
                    .select('id, name')
                    .eq('id', userId)
                    .maybeSingle();
                if (profileLookupError) throw profileLookupError;
                if (!profile?.id) throw new Error(`No Supabase profile found for paid checkout user ${userId}.`);

                const result = await applyStripeProgramEntitlementEvent({
                    event,
                    action: 'grant',
                    userId,
                    programKey,
                    paymentIntentId,
                    stripeObjectId: session.id,
                    checkoutSessionId: session.id,
                    customerId: stripeObjectId(session.customer),
                    priceId,
                    amountTotal: session.amount_total,
                    currency: session.currency,
                    note: 'Verified one-time Stripe checkout.',
                });
                if (result?.applied) {
                    await sendEmail(
                        authUser.email,
                        buildWelcomeEmail({ name: profile.name, email: authUser.email }),
                    ).catch((emailError) => console.error('Purchase welcome email failed:', emailError));
                }
                break;
            }

            case 'charge.refunded': {
                const charge = event.data.object;
                const isFullRefund = charge.refunded === true
                    || (Number.isFinite(charge.amount) && charge.amount > 0 && charge.amount_refunded >= charge.amount);
                if (!isFullRefund) {
                    console.log(`Ignoring partial refund for charge ${charge.id}; access remains active.`);
                    break;
                }
                const paymentIntentId = await resolvePaymentIntentForStripeObject(charge);
                if (!paymentIntentId) throw new Error(`Refunded charge ${charge.id} has no PaymentIntent.`);
                const identity = await findProgramEntitlementIdentity(paymentIntentId);
                if (!identity) {
                    console.log(`Ignoring refund for unrelated PaymentIntent ${paymentIntentId}.`);
                    break;
                }
                await applyStripeProgramEntitlementEvent({
                    event,
                    action: 'revoke',
                    userId: identity.user_id,
                    programKey: identity.program_key,
                    paymentIntentId,
                    stripeObjectId: charge.id,
                    customerId: stripeObjectId(charge.customer),
                    amountTotal: charge.amount,
                    currency: charge.currency,
                    note: 'Stripe payment fully refunded.',
                });
                break;
            }

            case 'charge.dispute.created':
            case 'charge.dispute.closed':
            case 'charge.dispute.funds_reinstated': {
                const dispute = event.data.object;
                const paymentIntentId = await resolvePaymentIntentForStripeObject(dispute);
                if (!paymentIntentId) throw new Error(`Dispute ${dispute.id} has no PaymentIntent.`);
                const identity = await findProgramEntitlementIdentity(paymentIntentId);
                if (!identity) {
                    console.log(`Ignoring dispute for unrelated PaymentIntent ${paymentIntentId}.`);
                    break;
                }

                const disputeWon = (event.type === 'charge.dispute.closed'
                    && ['won', 'warning_closed', 'prevented'].includes(dispute.status))
                    || event.type === 'charge.dispute.funds_reinstated';
                const disputeLost = event.type === 'charge.dispute.closed' && dispute.status === 'lost';
                if (event.type === 'charge.dispute.closed' && !disputeWon && !disputeLost) {
                    console.log(`Ignoring dispute ${dispute.id} closed with non-final status ${dispute.status}.`);
                    break;
                }
                const restoreCheck = disputeWon
                    ? await getDisputeRestoreEligibility(paymentIntentId, dispute.id)
                    : { eligible: true, reason: null };
                await applyStripeProgramEntitlementEvent({
                    event,
                    action: disputeWon ? 'restore' : 'revoke',
                    userId: identity.user_id,
                    programKey: identity.program_key,
                    paymentIntentId,
                    stripeObjectId: dispute.id,
                    amountTotal: dispute.amount,
                    currency: dispute.currency,
                    note: disputeWon
                        ? restoreCheck.eligible
                            ? 'Stripe dispute resolved without a remaining refund or dispute block.'
                            : `Stripe dispute restore blocked: ${restoreCheck.reason}.`
                        : disputeLost
                            ? 'Stripe dispute lost.'
                            : 'Stripe dispute opened.',
                    restoreEligible: restoreCheck.eligible,
                });
                break;
            }

            default:
                console.log(`Unhandled Stripe event: ${event.type}`);
        }

        } catch (error) {
            console.error(`Stripe webhook ${event.id} failed:`, error);
            res.status(500).json({ received: false, error: 'Entitlement fulfillment failed.' });
            return;
        }

        res.json({ received: true });
    },
);

app.post('/api/ai/generate', async (req, res) => {
    const authenticatedUser = await requirePaidAiUser(req, res);
    if (!authenticatedUser) return;
    const { messages, temperature, maxTokens } = req.body;

    const messagesAreValid = Array.isArray(messages)
        && messages.length > 0
        && messages.length <= 40
        && messages.every((message) => (
            message
            && ['system', 'user', 'assistant'].includes(message.role)
            && typeof message.content === 'string'
            && message.content.length > 0
        ));
    const messageCharacters = messagesAreValid
        ? messages.reduce((total, message) => total + message.content.length, 0)
        : 0;

    if (!messagesAreValid || messageCharacters > 50_000) {
        res.status(400).json({ error: 'messages must contain 1-40 valid text messages (50,000 characters maximum).' });
        return;
    }

    if (!applyAiRateLimit(res, authenticatedUser.id, 'text', AI_TEXT_RATE_LIMIT)) return;

    const safeTemperature = Number.isFinite(Number(temperature))
        ? Math.min(2, Math.max(0, Number(temperature)))
        : 0.7;
    const safeMaxTokens = Number.isFinite(Number(maxTokens))
        ? Math.min(4096, Math.max(1, Math.floor(Number(maxTokens))))
        : 2048;

    try {
        const text = await createOpenAIChatCompletion(messages, safeTemperature, safeMaxTokens);
        res.json({ text });
    } catch (error) {
        console.error('AI generation error:', error);
        res.status(503).json({ error: error.message });
    }
});

app.post('/api/ai/image', async (req, res) => {
    const authenticatedUser = await requirePaidAiUser(req, res);
    if (!authenticatedUser) return;
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.length > 4_000) {
        res.status(400).json({ error: 'prompt must be a valid string (4,000 characters maximum).' });
        return;
    }

    if (!applyAiRateLimit(res, authenticatedUser.id, 'image', AI_IMAGE_RATE_LIMIT)) return;

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
 * Authenticated convenience endpoint for the signed-in user's own address.
 * Body: { name? }
 */
app.post('/api/email/welcome', async (req, res) => {
    const authenticatedUser = await requireAuthenticatedUser(req, res);
    if (!authenticatedUser) return;
    const { name } = req.body;
    const email = authenticatedUser.email;

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
 * Sends only a durable certificate owned by the signed-in Supabase user.
 * Body: { certificateId }
 */
app.post('/api/email/certificate', async (req, res) => {
    const authenticatedUser = await requireAuthenticatedUser(req, res);
    if (!authenticatedUser) return;
    const { certificateId } = req.body;

    if (!certificateId || typeof certificateId !== 'string') {
        res.status(400).json({ error: 'A valid certificateId is required.' });
        return;
    }

    const { data: certificate, error: certificateLookupError } = await supabase
        .from('program_certificates')
        .select('id,certificate_type,module_number,display_name,fingerprint_sha256')
        .eq('id', certificateId)
        .eq('user_id', authenticatedUser.id)
        .maybeSingle();
    if (certificateLookupError) {
        res.status(503).json({ error: 'Certificate ownership could not be verified.' });
        return;
    }
    if (!certificate) {
        res.status(403).json({ error: 'Certificate not found for this account.' });
        return;
    }

    const email = authenticatedUser.email;
    const name = certificate.display_name;
    const moduleNumber = certificate.certificate_type === 'final' ? 'final' : certificate.module_number;
    const moduleName = certificate.certificate_type === 'final'
        ? 'ZEN Vanguard Final Certification'
        : `Vanguard Module ${certificate.module_number}`;
    const certificateHash = certificate.fingerprint_sha256;

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
            supabasePrivileged: Boolean(supabase),
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
