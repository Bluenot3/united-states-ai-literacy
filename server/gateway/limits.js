/**
 * ZEN AI Gateway — rate limiting, budget caps, and response caching.
 *
 * All state is in-process and bounded. That is the right trade for a single
 * app server: no new infrastructure, no dependency, and a restart simply
 * resets the windows. If this ever runs multi-instance, swap the three Maps
 * for Redis — the call sites are narrow on purpose.
 *
 * Why budgets and not just rate limits: a classroom of 30 students hitting a
 * shared key can burn real money in minutes. Rate limits bound *speed*;
 * the daily spend cap bounds *damage*.
 */

const num = (name, fallback) => {
    const value = Number(process.env[name]);
    return Number.isFinite(value) && value > 0 ? value : fallback;
};

export const LIMITS = {
    perMinute: num('GATEWAY_RPM_PER_USER', 12),
    perDay: num('GATEWAY_RPD_PER_USER', 400),
    dailyUsdPerUser: num('GATEWAY_DAILY_USD_PER_USER', 1.5),
    dailyUsdGlobal: num('GATEWAY_DAILY_USD_GLOBAL', 100),
    imagesPerDay: num('GATEWAY_IMAGES_PER_DAY', 25),
};

const MINUTE = 60_000;
const DAY = 24 * 60 * 60 * 1000;
const MAX_TRACKED_USERS = 20_000;

/** @type {Map<string, {minuteStart:number, minuteCount:number, dayStart:number, dayCount:number, imageCount:number, usd:number}>} */
const buckets = new Map();
const globalDay = { start: Date.now(), usd: 0 };

function bucketFor(key) {
    const now = Date.now();
    let bucket = buckets.get(key);

    if (!bucket) {
        // Bound memory: if we somehow track a huge number of identities, drop
        // the oldest-inserted entries. Map preserves insertion order.
        if (buckets.size >= MAX_TRACKED_USERS) {
            const oldest = buckets.keys().next().value;
            if (oldest !== undefined) buckets.delete(oldest);
        }
        bucket = { minuteStart: now, minuteCount: 0, dayStart: now, dayCount: 0, imageCount: 0, usd: 0 };
        buckets.set(key, bucket);
    }

    if (now - bucket.minuteStart >= MINUTE) {
        bucket.minuteStart = now;
        bucket.minuteCount = 0;
    }
    if (now - bucket.dayStart >= DAY) {
        bucket.dayStart = now;
        bucket.dayCount = 0;
        bucket.imageCount = 0;
        bucket.usd = 0;
    }
    if (now - globalDay.start >= DAY) {
        globalDay.start = now;
        globalDay.usd = 0;
    }

    return bucket;
}

/**
 * Checked before a provider call. Returns a retryAfter (seconds) so the route
 * can set a real Retry-After header.
 *
 * @returns {{ok: true} | {ok: false, status: number, error: string, retryAfter?: number}}
 */
export function checkLimits(identity, { kind = 'chat' } = {}) {
    const bucket = bucketFor(identity);

    if (globalDay.usd >= LIMITS.dailyUsdGlobal) {
        return {
            ok: false,
            status: 503,
            error: 'The program AI budget for today has been reached. Lessons still work — the offline fallbacks are in place. Try again tomorrow.',
            retryAfter: Math.ceil((globalDay.start + DAY - Date.now()) / 1000),
        };
    }

    if (bucket.usd >= LIMITS.dailyUsdPerUser) {
        return {
            ok: false,
            status: 429,
            error: 'You have used your AI allowance for today. It resets in 24 hours.',
            retryAfter: Math.ceil((bucket.dayStart + DAY - Date.now()) / 1000),
        };
    }

    if (bucket.minuteCount >= LIMITS.perMinute) {
        return {
            ok: false,
            status: 429,
            error: 'Slow down a moment — too many requests in the last minute.',
            retryAfter: Math.ceil((bucket.minuteStart + MINUTE - Date.now()) / 1000),
        };
    }

    if (bucket.dayCount >= LIMITS.perDay) {
        return {
            ok: false,
            status: 429,
            error: 'You have hit the daily request limit for this program.',
            retryAfter: Math.ceil((bucket.dayStart + DAY - Date.now()) / 1000),
        };
    }

    if (kind === 'image' && bucket.imageCount >= LIMITS.imagesPerDay) {
        return {
            ok: false,
            status: 429,
            error: 'You have generated the maximum number of images for today.',
            retryAfter: Math.ceil((bucket.dayStart + DAY - Date.now()) / 1000),
        };
    }

    return { ok: true };
}

/** Called once a request is admitted (before the upstream call). */
export function recordRequest(identity, { kind = 'chat' } = {}) {
    const bucket = bucketFor(identity);
    bucket.minuteCount += 1;
    bucket.dayCount += 1;
    if (kind === 'image') bucket.imageCount += 1;
}

/** Called after the upstream call, once real cost is known. */
export function recordSpend(identity, usd) {
    if (!Number.isFinite(usd) || usd <= 0) return;
    const bucket = bucketFor(identity);
    bucket.usd += usd;
    globalDay.usd += usd;
}

export function usageFor(identity) {
    const bucket = bucketFor(identity);
    return {
        requestsThisMinute: bucket.minuteCount,
        requestsToday: bucket.dayCount,
        imagesToday: bucket.imageCount,
        usdToday: Number(bucket.usd.toFixed(4)),
        limits: {
            perMinute: LIMITS.perMinute,
            perDay: LIMITS.perDay,
            imagesPerDay: LIMITS.imagesPerDay,
            dailyUsdPerUser: LIMITS.dailyUsdPerUser,
        },
        programUsdToday: Number(globalDay.usd.toFixed(4)),
    };
}

/* ── Response cache ─────────────────────────────────────────────────── */

const CACHE_TTL_MS = num('GATEWAY_CACHE_TTL_MS', 10 * 60 * 1000);
const CACHE_MAX = num('GATEWAY_CACHE_MAX', 500);

/** @type {Map<string, {expires: number, value: any}>} */
const cache = new Map();

/**
 * Thirty students working the same lesson send near-identical prompts. Caching
 * deterministic (low-temperature) calls cuts both cost and latency hard.
 */
export function cacheGet(key) {
    const hit = cache.get(key);
    if (!hit) return null;
    if (hit.expires < Date.now()) {
        cache.delete(key);
        return null;
    }
    // Refresh LRU position.
    cache.delete(key);
    cache.set(key, hit);
    return hit.value;
}

export function cacheSet(key, value) {
    if (cache.size >= CACHE_MAX) {
        const oldest = cache.keys().next().value;
        if (oldest !== undefined) cache.delete(oldest);
    }
    cache.set(key, { expires: Date.now() + CACHE_TTL_MS, value });
}

export const cacheStats = () => ({ entries: cache.size, max: CACHE_MAX, ttlMs: CACHE_TTL_MS });

/** Test seam — resets all counters. */
export function __resetLimits() {
    buckets.clear();
    cache.clear();
    globalDay.start = Date.now();
    globalDay.usd = 0;
}
