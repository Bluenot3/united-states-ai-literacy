/**
 * ZEN AI Gateway — the single AI entry point for the US AI Literacy platform.
 *
 * Mounted at /api/gateway/v1. Every AI call from every program should come
 * through here rather than talking to a provider directly, so that safety,
 * limits, budgets, caching, failover and usage accounting are enforced in one
 * auditable place.
 *
 *   POST /chat    { task?, messages[], temperature?, maxTokens?, cache? }
 *   POST /image   { prompt, size? }
 *   GET  /models  what this deployment can actually serve
 *   GET  /usage   the caller's own consumption against the caps
 *   GET  /health  liveness + configuration summary (no secrets)
 *
 * Identity: the gateway prefers a Supabase user id supplied by the caller and
 * falls back to a hashed client fingerprint. Both are only ever used as a
 * rate-limit key — see resolveIdentity for the caveat.
 */

import crypto from 'crypto';
import express from 'express';

import {
    configuredProviders,
    getProvider,
    isProviderConfigured,
    ProviderError,
} from './providers.js';
import {
    DEFAULT_TASK,
    describeRegistry,
    estimateCost,
    estimateTokens,
    isTask,
    resolveRoute,
} from './registry.js';
import {
    cacheGet,
    cacheSet,
    cacheStats,
    checkLimits,
    LIMITS,
    recordRequest,
    recordSpend,
    usageFor,
} from './limits.js';
import {
    moderateWithProvider,
    sanitizeImagePrompt,
    sanitizeMessages,
} from './policy.js';

const REQUEST_TIMEOUT_MS = Number(process.env.GATEWAY_TIMEOUT_MS || 45_000);

const hash = (value) => crypto.createHash('sha256').update(String(value)).digest('hex').slice(0, 32);

/**
 * Rate-limit identity.
 *
 * NOTE: `x-zen-user` is client-asserted and therefore spoofable. It is good
 * enough to keep honest classroom traffic in its own bucket, but it is NOT an
 * authorisation signal. The IP fallback is what actually bounds an attacker.
 * If/when the app forwards a verified Supabase JWT, verify it here and prefer
 * the verified subject.
 */
function resolveIdentity(req) {
    const asserted = String(req.get('x-zen-user') || '').trim();
    if (asserted && asserted.length <= 128) return `u:${hash(asserted)}`;

    const forwarded = String(req.get('x-forwarded-for') || '').split(',')[0].trim();
    return `ip:${hash(forwarded || req.ip || 'unknown')}`;
}

function logLine(entry) {
    // One structured line per call — greppable, no prompt content.
    console.log(JSON.stringify({ svc: 'zen-gateway', ...entry }));
}

function failure(res, status, error, extra = {}) {
    if (extra.retryAfter) res.set('Retry-After', String(extra.retryAfter));
    return res.status(status).json({ error, ...extra });
}

export function createGatewayRouter() {
    const router = express.Router();

    router.use(express.json({ limit: '256kb' }));

    /* ── Health ─────────────────────────────────────────────────────── */

    router.get('/health', (_req, res) => {
        const providers = configuredProviders();
        res.json({
            status: providers.length ? 'ok' : 'degraded',
            service: 'zen-ai-gateway',
            version: 1,
            providers,
            tasks: describeRegistry(isProviderConfigured),
            cache: cacheStats(),
            limits: LIMITS,
            moderation: process.env.GATEWAY_MODERATION === 'on',
        });
    });

    router.get('/models', (_req, res) => {
        res.json({ tasks: describeRegistry(isProviderConfigured) });
    });

    router.get('/usage', (req, res) => {
        res.json(usageFor(resolveIdentity(req)));
    });

    /* ── Chat ───────────────────────────────────────────────────────── */

    // '/generate' is the pre-gateway path name. Keeping it as an alias lets the
    // same router be mounted at /api/ai for back-compat with no URL rewriting.
    router.post(['/chat', '/generate'], async (req, res) => {
        const started = Date.now();
        const identity = resolveIdentity(req);
        const requestId = crypto.randomUUID();
        const { task: rawTask, messages, temperature, maxTokens, cache: allowCache = true } = req.body || {};
        const task = isTask(rawTask) ? rawTask : DEFAULT_TASK;

        const gate = checkLimits(identity, { kind: 'chat' });
        if (!gate.ok) {
            logLine({ requestId, identity, task, outcome: 'rate_limited', status: gate.status });
            return failure(res, gate.status, gate.error, { retryAfter: gate.retryAfter });
        }

        const sanitized = sanitizeMessages(messages);
        if (!sanitized.ok) {
            // The crisis intercept is a *successful* response, not an error:
            // the learner gets reviewed copy and no provider is contacted.
            if (sanitized.error === 'crisis_intercept') {
                logLine({ requestId, identity, task, outcome: 'crisis_intercept' });
                return res.json({ text: sanitized.response, intercepted: true, requestId });
            }
            logLine({ requestId, identity, task, outcome: 'rejected', status: sanitized.status });
            return failure(res, sanitized.status, sanitized.error);
        }

        const route = resolveRoute(task, isProviderConfigured);
        if (!route) {
            logLine({ requestId, identity, task, outcome: 'unconfigured' });
            return failure(res, 503, 'No AI provider is configured on this server.');
        }

        const boundedMax = Math.min(Number(maxTokens) || route.maxOutput || 1200, route.maxOutput || 1200);
        const temp = Math.min(Math.max(Number(temperature) ?? 0.7, 0), 1.5);

        // Only deterministic-ish calls are cacheable; a creative turn should
        // stay fresh or every learner sees the same sentence.
        const cacheable = allowCache !== false && temp <= 0.35;
        const cacheKey = cacheable
            ? `chat:${task}:${route.model}:${temp}:${boundedMax}:${hash(JSON.stringify(sanitized.messages))}`
            : null;

        if (cacheKey) {
            const hit = cacheGet(cacheKey);
            if (hit) {
                logLine({ requestId, identity, task, model: route.model, outcome: 'cache_hit', ms: Date.now() - started });
                return res.json({ ...hit, cached: true, requestId });
            }
        }

        const lastUserTurn = [...sanitized.messages].reverse().find((m) => m.role === 'user')?.content || '';
        const moderation = await moderateWithProvider(lastUserTurn);
        if (moderation.flagged) {
            logLine({ requestId, identity, task, outcome: 'moderation_blocked', categories: moderation.categories });
            return failure(res, 422, 'That message is outside what this classroom assistant will discuss. Try rephrasing it around the lesson.');
        }

        recordRequest(identity, { kind: 'chat' });

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const provider = getProvider(route.provider);
            const result = await provider.chat({
                messages: sanitized.messages,
                temperature: temp,
                maxTokens: boundedMax,
                model: route.model,
                signal: controller.signal,
            });

            const inputTokens = result.usage?.inputTokens
                ?? sanitized.messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
            const outputTokens = result.usage?.outputTokens ?? estimateTokens(result.text);
            const usd = estimateCost(route, { inputTokens, outputTokens });
            recordSpend(identity, usd);

            const payload = {
                text: result.text,
                task,
                provider: route.provider,
                model: route.model,
                notices: sanitized.notices,
                usage: { inputTokens, outputTokens, estimatedUsd: Number(usd.toFixed(6)) },
            };

            if (cacheKey) cacheSet(cacheKey, payload);

            logLine({
                requestId, identity, task, model: route.model,
                outcome: 'ok', ms: Date.now() - started, inputTokens, outputTokens, usd: Number(usd.toFixed(6)),
            });

            return res.json({ ...payload, requestId });
        } catch (error) {
            const isAbort = error?.name === 'AbortError';
            const status = isAbort ? 504 : (error instanceof ProviderError ? Math.min(error.status, 503) : 502);
            logLine({
                requestId, identity, task, model: route.model,
                outcome: isAbort ? 'timeout' : 'provider_error', status, ms: Date.now() - started,
            });

            // Never surface a raw upstream body — it can echo prompt content
            // or key fragments back to the browser.
            return failure(res, status, isAbort
                ? 'The AI provider took too long to answer. Try again.'
                : 'The AI provider could not answer right now. The lesson still works without it.');
        } finally {
            clearTimeout(timer);
        }
    });

    /* ── Image ──────────────────────────────────────────────────────── */

    router.post('/image', async (req, res) => {
        const started = Date.now();
        const identity = resolveIdentity(req);
        const requestId = crypto.randomUUID();

        const gate = checkLimits(identity, { kind: 'image' });
        if (!gate.ok) {
            logLine({ requestId, identity, task: 'image', outcome: 'rate_limited', status: gate.status });
            return failure(res, gate.status, gate.error, { retryAfter: gate.retryAfter });
        }

        const sanitized = sanitizeImagePrompt(req.body?.prompt);
        if (!sanitized.ok) {
            logLine({ requestId, identity, task: 'image', outcome: 'rejected', status: sanitized.status });
            return failure(res, sanitized.status, sanitized.error);
        }

        const route = resolveRoute('image', isProviderConfigured);
        if (!route) {
            return failure(res, 503, 'Image generation is not configured on this server.');
        }

        const allowedSizes = new Set(['256x256', '512x512', '1024x1024']);
        const size = allowedSizes.has(req.body?.size) ? req.body.size : '1024x1024';

        recordRequest(identity, { kind: 'image' });

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const provider = getProvider(route.provider);
            const result = await provider.image({
                prompt: sanitized.prompt,
                size,
                model: route.model,
                signal: controller.signal,
            });

            const usd = estimateCost(route, { calls: 1 });
            recordSpend(identity, usd);

            logLine({
                requestId, identity, task: 'image', model: route.model,
                outcome: 'ok', ms: Date.now() - started, usd: Number(usd.toFixed(6)),
            });

            return res.json({
                url: result.url,
                b64: result.b64,
                provider: route.provider,
                model: route.model,
                requestId,
            });
        } catch (error) {
            const isAbort = error?.name === 'AbortError';
            const status = isAbort ? 504 : 502;
            logLine({ requestId, identity, task: 'image', outcome: isAbort ? 'timeout' : 'provider_error', status });
            return failure(res, status, 'Image generation is unavailable right now.');
        } finally {
            clearTimeout(timer);
        }
    });

    return router;
}

export default createGatewayRouter;
