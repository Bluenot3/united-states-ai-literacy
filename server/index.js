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
    'http://localhost:4174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4173',
    'http://127.0.0.1:4174',
];

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const hasSupabaseServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;


const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const adminSessions = new Map();
const ADMIN_EMAILS = new Set(['royaltokens@gmail.com', 'huxley@zenai.biz']);
const SUBSCRIPTION_TIERS = new Set(['free', 'starter', 'builder', 'pro', 'educator', 'family', 'business', 'org']);
const PROGRAM_IDS = new Set([
    'ai-pioneer',
    'vanguard',
    'homeschool-kit',
    'blockchain-literacy',
    'train-the-trainer',
    'arsenal-builder-labs',
    'hermes',
]);
const PROGRAM_AVAILABILITY_STATUSES = new Set(['available', 'unavailable', 'coming-soon', 'draft', 'private-beta']);
const ARSENAL_READY_STATUSES = new Set(['not-started', 'staging', 'merge-ready', 'merged']);
const TIER_PRICE_ENV = {
    starter: 'STRIPE_PRICE_STARTER',
    builder: 'STRIPE_PRICE_BUILDER',
    pro: 'STRIPE_PRICE_PRO',
    educator: 'STRIPE_PRICE_EDUCATOR',
    family: 'STRIPE_PRICE_FAMILY',
    business: 'STRIPE_PRICE_BUSINESS',
    org: 'STRIPE_PRICE_ORG',
};
const EXTENDED_BILLING_COLUMNS = [
    'id',
    'email',
    'is_entitled',
    'subscription_tier',
    'billing_status',
    'stripe_customer_id',
    'stripe_subscription_id',
    'entitlement_overrides',
].join(',');

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

function normalizeEmail(value) {
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function isAdminEmail(value) {
    return ADMIN_EMAILS.has(normalizeEmail(value));
}

function getBearerToken(req) {
    const header = req.get('authorization') || '';
    const [scheme, token] = header.split(' ');

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
        return null;
    }

    return token;
}

async function getAdminFromRequest(req) {
    const bearerToken = getBearerToken(req);

    if (bearerToken && supabase) {
        const { data, error } = await supabase.auth.getUser(bearerToken);
        const user = data?.user;

        if (!error && user?.email && isAdminEmail(user.email)) {
            return {
                id: user.id,
                email: user.email,
                source: 'supabase-auth',
            };
        }
    }

    const adminToken = req.get('x-admin-token') || req.query.token;

    if (typeof adminToken === 'string' && adminSessions.has(adminToken)) {
        const session = adminSessions.get(adminToken);

        if (session.expiresAt > Date.now() && isAdminEmail(session.userEmail)) {
            return {
                id: null,
                email: session.userEmail,
                source: 'admin-bypass',
            };
        }

        adminSessions.delete(adminToken);
    }

    return null;
}

async function requireAdmin(req, res) {
    const admin = await getAdminFromRequest(req);

    if (admin) {
        return admin;
    }

    res.status(401).json({ error: 'Admin authentication required.' });
    return null;
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

function normalizeTier(value, fallback = 'free') {
    return SUBSCRIPTION_TIERS.has(value) ? value : fallback;
}

function getTierPriceId(tier) {
    const normalizedTier = normalizeTier(tier, 'pro');

    if (normalizedTier === 'free') {
        return null;
    }

    if (normalizedTier === 'pro') {
        return process.env.STRIPE_PRICE_PRO || process.env.STRIPE_PRICE_ID || null;
    }

    const envName = TIER_PRICE_ENV[normalizedTier];
    return envName ? process.env[envName] || null : null;
}

function getTierForPriceId(priceId, fallbackTier = 'free') {
    if (!priceId) {
        return normalizeTier(fallbackTier);
    }

    for (const [tier, envName] of Object.entries(TIER_PRICE_ENV)) {
        if (process.env[envName] && process.env[envName] === priceId) {
            return tier;
        }
    }

    if (process.env.STRIPE_PRICE_ID && process.env.STRIPE_PRICE_ID === priceId) {
        return 'pro';
    }

    return normalizeTier(fallbackTier);
}

function getSubscriptionPriceId(subscription) {
    return subscription?.items?.data?.[0]?.price?.id || null;
}

function getBillingStatusForSubscription(status) {
    return typeof status === 'string' && status.length > 0 ? status : 'inactive';
}

function isActiveSubscriptionStatus(status) {
    return ['active', 'trialing'].includes(status);
}

function isSchemaCompatibilityError(error) {
    return ['42703', '42P01', 'PGRST204'].includes(error?.code);
}

function normalizeProgramPublishSetting(row) {
    return {
        programId: row.program_id,
        availabilityStatus: row.availability_status,
        published: row.published === true,
        adminPreviewEnabled: row.admin_preview_enabled === true,
        publicLabel: row.public_label || null,
        adminLabel: row.admin_label || null,
        arsenalReadyStatus: row.arsenal_ready_status,
        arsenalMergeNotes: row.arsenal_merge_notes || '',
        updatedBy: row.updated_by || null,
        createdAt: row.created_at || null,
        updatedAt: row.updated_at || null,
        metadata: row.metadata || {},
    };
}

async function fetchProgramPublishSettings() {
    if (!supabase) {
        return { data: [], error: new Error('Supabase is not configured.') };
    }

    const { data, error } = await supabase
        .from('program_publish_settings')
        .select('program_id,availability_status,published,admin_preview_enabled,public_label,admin_label,arsenal_ready_status,arsenal_merge_notes,updated_by,created_at,updated_at,metadata')
        .order('program_id', { ascending: true });

    if (error) {
        return { data: [], error };
    }

    return { data: (data || []).map(normalizeProgramPublishSetting), error: null };
}

function validateProgramPublishUpdate(programId, input) {
    if (!PROGRAM_IDS.has(programId)) {
        return { error: 'Unknown programId.' };
    }

    const update = {};

    if ('availability_status' in input) {
        if (!PROGRAM_AVAILABILITY_STATUSES.has(input.availability_status)) {
            return { error: 'Invalid availability_status.' };
        }
        update.availability_status = input.availability_status;
    }

    if ('published' in input) {
        if (typeof input.published !== 'boolean') {
            return { error: 'published must be a boolean.' };
        }
        update.published = input.published;
    }

    if ('admin_preview_enabled' in input) {
        if (typeof input.admin_preview_enabled !== 'boolean') {
            return { error: 'admin_preview_enabled must be a boolean.' };
        }
        update.admin_preview_enabled = input.admin_preview_enabled;
    }

    for (const field of ['public_label', 'admin_label', 'arsenal_merge_notes']) {
        if (field in input) {
            if (input[field] !== null && typeof input[field] !== 'string') {
                return { error: `${field} must be a string or null.` };
            }
            update[field] = input[field] === null ? null : input[field].slice(0, field === 'arsenal_merge_notes' ? 4000 : 120);
        }
    }

    if ('arsenal_ready_status' in input) {
        if (!ARSENAL_READY_STATUSES.has(input.arsenal_ready_status)) {
            return { error: 'Invalid arsenal_ready_status.' };
        }
        update.arsenal_ready_status = input.arsenal_ready_status;
    }

    if ('metadata' in input) {
        if (typeof input.metadata !== 'object' || input.metadata === null || Array.isArray(input.metadata)) {
            return { error: 'metadata must be an object.' };
        }
        update.metadata = input.metadata;
    }

    return { update };
}

async function updateBillingProfileByEmail(userEmail, billingUpdate) {
    if (!supabase || !userEmail) {
        return;
    }

    const { error } = await supabase
        .from('user_profiles')
        .update(billingUpdate)
        .eq('email', userEmail);

    if (!error) {
        return;
    }

    if (!isSchemaCompatibilityError(error)) {
        console.error('Supabase billing profile update failed:', error);
        return;
    }

    const legacyUpdate = {
        is_entitled: billingUpdate.is_entitled === true,
    };

    if ('stripe_customer_id' in billingUpdate) {
        legacyUpdate.stripe_customer_id = billingUpdate.stripe_customer_id;
    }

    if ('stripe_subscription_id' in billingUpdate) {
        legacyUpdate.stripe_subscription_id = billingUpdate.stripe_subscription_id;
    }

    const { error: legacyError } = await supabase
        .from('user_profiles')
        .update(legacyUpdate)
        .eq('email', userEmail);

    if (!legacyError) {
        return;
    }

    if (isSchemaCompatibilityError(legacyError)) {
        const { error: booleanOnlyError } = await supabase
            .from('user_profiles')
            .update({ is_entitled: billingUpdate.is_entitled === true })
            .eq('email', userEmail);

        if (booleanOnlyError) {
            console.error('Boolean-only Supabase billing profile update failed:', booleanOnlyError);
        }
        return;
    }

    if (legacyError) {
        console.error('Legacy Supabase billing profile update failed:', legacyError);
    }
}

async function updateBillingProfileBySubscriptionId(subscriptionId, billingUpdate) {
    if (!supabase || !subscriptionId) {
        return;
    }

    const { error } = await supabase
        .from('user_profiles')
        .update(billingUpdate)
        .eq('stripe_subscription_id', subscriptionId);

    if (!error) {
        return;
    }

    if (!isSchemaCompatibilityError(error)) {
        console.error('Supabase subscription update failed:', error);
        return;
    }

    const { error: legacyError } = await supabase
        .from('user_profiles')
        .update({ is_entitled: billingUpdate.is_entitled === true })
        .eq('stripe_subscription_id', subscriptionId);

    if (legacyError) {
        console.error('Legacy Supabase subscription update failed:', legacyError);
    }
}

async function fetchBillingProfile(userEmail) {
    if (!supabase || !userEmail) {
        return null;
    }

    const extendedResult = await supabase
        .from('user_profiles')
        .select(EXTENDED_BILLING_COLUMNS)
        .eq('email', userEmail)
        .maybeSingle();

    if (!extendedResult.error) {
        return extendedResult.data;
    }

    if (!isSchemaCompatibilityError(extendedResult.error)) {
        console.error('Supabase billing status lookup failed:', extendedResult.error);
        return null;
    }

    const legacyResult = await supabase
        .from('user_profiles')
        .select('id,email,is_entitled')
        .eq('email', userEmail)
        .maybeSingle();

    if (legacyResult.error) {
        console.error('Legacy Supabase billing status lookup failed:', legacyResult.error);
        return null;
    }

    return legacyResult.data;
}

async function fetchActiveProgramEntitlements(userId) {
    if (!supabase || !userId) {
        return [];
    }

    const { data, error } = await supabase
        .from('program_entitlements')
        .select('program_id,access_level,source,status,expires_at,metadata')
        .eq('user_id', userId)
        .in('status', ['active', 'trialing']);

    if (error) {
        if (!isSchemaCompatibilityError(error)) {
            console.error('Supabase program entitlement lookup failed:', error);
        }
        return [];
    }

    const now = Date.now();

    return (data || [])
        .filter((grant) => !grant.expires_at || new Date(grant.expires_at).getTime() > now)
        .map((grant) => ({
            programId: grant.program_id,
            accessLevel: grant.access_level || 'full',
            status: grant.status || 'active',
            source: grant.source || 'manual',
            expiresAt: grant.expires_at || null,
            metadata: grant.metadata || {},
        }));
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

app.get('/api/billing/status', async (req, res) => {
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

    const profile = await fetchBillingProfile(userEmail);
    const programEntitlements = profile?.id ? await fetchActiveProgramEntitlements(profile.id) : [];
    const profileTier = normalizeTier(profile?.subscription_tier, profile?.is_entitled ? 'pro' : 'free');
    const tier = isAdmin ? 'pro' : profileTier;
    const entitled = isAdmin || profile?.is_entitled === true;

    res.json({
        entitled,
        is_admin: isAdmin,
        email: userEmail,
        tier,
        subscription_tier: tier,
        billing_status: isAdmin ? 'admin_bypass' : profile?.billing_status || (entitled ? 'active' : 'inactive'),
        stripe_customer_id: profile?.stripe_customer_id || null,
        program_entitlements: programEntitlements,
        entitlement_overrides: profile?.entitlement_overrides || {},
    });
});

app.get('/api/program-publish-settings', async (_req, res) => {
    const { data, error } = await fetchProgramPublishSettings();

    if (!error) {
        res.json({ settings: data });
        return;
    }

    if (isSchemaCompatibilityError(error)) {
        res.json({
            settings: [],
            fallback: true,
            error: 'Program publish settings table is not available yet.',
        });
        return;
    }

    console.error('Program publish settings lookup failed:', error);
    res.status(503).json({ error: 'Unable to load program publish settings.' });
});

app.get('/api/admin/program-publish-settings', async (req, res) => {
    const admin = await requireAdmin(req, res);

    if (!admin) {
        return;
    }

    const { data, error } = await fetchProgramPublishSettings();

    if (!error) {
        res.json({ settings: data, admin: { email: admin.email, source: admin.source } });
        return;
    }

    if (isSchemaCompatibilityError(error)) {
        res.json({
            settings: [],
            fallback: true,
            admin: { email: admin.email, source: admin.source },
            error: 'Program publish settings table is not available yet.',
        });
        return;
    }

    console.error('Admin program publish settings lookup failed:', error);
    res.status(503).json({ error: 'Unable to load admin program publish settings.' });
});

app.patch('/api/admin/program-publish-settings/:programId', async (req, res) => {
    const admin = await requireAdmin(req, res);

    if (!admin) {
        return;
    }

    if (!supabase || !hasSupabaseServiceRole) {
        res.status(503).json({ error: 'Supabase service role is required for program publishing writes.' });
        return;
    }

    const programId = req.params.programId;
    const { update, error } = validateProgramPublishUpdate(programId, req.body || {});

    if (error || !update) {
        res.status(400).json({ error: error || 'Invalid update payload.' });
        return;
    }

    const payload = {
        program_id: programId,
        ...update,
        updated_by: admin.id,
    };

    const { data, error: upsertError } = await supabase
        .from('program_publish_settings')
        .upsert(payload, { onConflict: 'program_id' })
        .select('program_id,availability_status,published,admin_preview_enabled,public_label,admin_label,arsenal_ready_status,arsenal_merge_notes,updated_by,created_at,updated_at,metadata')
        .single();

    if (upsertError) {
        if (isSchemaCompatibilityError(upsertError)) {
            res.status(503).json({ error: 'Program publish settings table is not available yet.' });
            return;
        }

        console.error('Program publish settings update failed:', upsertError);
        res.status(500).json({ error: 'Unable to update program publish settings.' });
        return;
    }

    res.json({
        setting: normalizeProgramPublishSetting(data),
        admin: { email: admin.email, source: admin.source },
    });
});

app.post('/api/stripe/create-checkout-session', async (req, res) => {
    if (!requireStripe(res)) {
        return;
    }

    const { userEmail, tier: requestedTier } = req.body;

    if (!isValidEmail(userEmail)) {
        res.status(400).json({ error: 'A valid email is required.' });
        return;
    }

    const checkoutTier = requestedTier ? normalizeTier(requestedTier, 'pro') : 'pro';
    const priceId = requestedTier ? getTierPriceId(checkoutTier) : process.env.STRIPE_PRICE_ID || getTierPriceId('pro');

    if (!priceId) {
        const requiredEnv = requestedTier && checkoutTier !== 'pro'
            ? TIER_PRICE_ENV[checkoutTier]
            : 'STRIPE_PRICE_ID';

        res.status(503).json({ error: `${requiredEnv} is not configured.` });
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
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${trustedOrigin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${trustedOrigin}/paywall?canceled=true`,
            metadata: { userEmail, tier: checkoutTier },
            subscription_data: {
                metadata: { userEmail, tier: checkoutTier },
            },
        });

        console.log(`Checkout session created for ${userEmail} (${checkoutTier})`);
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
                    let subscription = null;
                    let subscriptionPriceId = null;
                    let billingStatus = 'active';

                    if (typeof session.subscription === 'string') {
                        try {
                            subscription = await stripe.subscriptions.retrieve(session.subscription);
                            subscriptionPriceId = getSubscriptionPriceId(subscription);
                            billingStatus = getBillingStatusForSubscription(subscription.status);
                        } catch (error) {
                            console.error('Unable to retrieve checkout subscription for tier mapping:', error.message);
                        }
                    }

                    const fallbackTier = normalizeTier(session.metadata?.tier, 'pro');
                    const subscriptionTier = getTierForPriceId(subscriptionPriceId, fallbackTier);

                    // Fetch user profile so we can personalise the email
                    const { data: profile } = await supabase
                        .from('user_profiles')
                        .select('name')
                        .eq('email', userEmail)
                        .single();

                    await updateBillingProfileByEmail(userEmail, {
                        is_entitled: true,
                        subscription_tier: subscriptionTier,
                        billing_status: billingStatus,
                        stripe_customer_id: session.customer,
                        stripe_subscription_id: session.subscription,
                        billing_metadata: {
                            stripe_session_id: session.id,
                            stripe_price_id: subscriptionPriceId,
                            source: 'checkout.session.completed',
                            updated_at: new Date().toISOString(),
                        },
                    });
                    console.log(`Entitlement granted for ${userEmail} via Supabase (${subscriptionTier})`);

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
                    const isEntitled = isActiveSubscriptionStatus(subscription.status);
                    const subscriptionPriceId = getSubscriptionPriceId(subscription);
                    const subscriptionTier = isEntitled ? getTierForPriceId(subscriptionPriceId, 'pro') : 'free';

                    await updateBillingProfileBySubscriptionId(subscription.id, {
                        is_entitled: isEntitled,
                        subscription_tier: subscriptionTier,
                        billing_status: getBillingStatusForSubscription(subscription.status),
                        stripe_customer_id: subscription.customer,
                        stripe_subscription_id: subscription.id,
                        billing_metadata: {
                            stripe_price_id: subscriptionPriceId,
                            source: event.type,
                            updated_at: new Date().toISOString(),
                        },
                    });
                    console.log(`Subscription ${subscription.status} for sub ${subscription.id} via Supabase (${subscriptionTier})`);
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
