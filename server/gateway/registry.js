/**
 * ZEN AI Gateway — model registry and task routing.
 *
 * The gateway never lets a caller name a raw provider model. Clients ask for a
 * *task* ("coach", "quick", "reason", "image") and the registry decides which
 * concrete model serves it. That keeps lesson code stable when models change,
 * and stops a compromised client from steering spend onto an expensive model.
 *
 * Costs are USD per 1M tokens and are used for budget accounting only — they
 * are deliberately conservative (round up) so the budget guard errs toward
 * cutting a learner off rather than overspending.
 */

/** @typedef {'openai'|'gemini'} ProviderId */

export const TASKS = /** @type {const} */ ([
    'quick',   // short classroom turns: hints, rewrites, one-line feedback
    'coach',   // the default conversational tutor voice
    'reason',  // multi-step explanation, comparison tables, code reading
    'image',   // image generation for the creative modules
]);

/**
 * Ordered candidates per task. The router walks the list and takes the first
 * entry whose provider actually has credentials configured, so a deployment
 * with only one provider key still works.
 */
const ROUTES = {
    quick: [
        { provider: 'openai', model: 'gpt-4o-mini', inputCost: 0.15, outputCost: 0.60, maxOutput: 800 },
        { provider: 'gemini', model: 'gemini-2.0-flash', inputCost: 0.10, outputCost: 0.40, maxOutput: 800 },
    ],
    coach: [
        { provider: 'openai', model: 'gpt-4o-mini', inputCost: 0.15, outputCost: 0.60, maxOutput: 1600 },
        { provider: 'gemini', model: 'gemini-2.0-flash', inputCost: 0.10, outputCost: 0.40, maxOutput: 1600 },
    ],
    reason: [
        { provider: 'openai', model: 'gpt-4o', inputCost: 2.50, outputCost: 10.00, maxOutput: 2400 },
        { provider: 'gemini', model: 'gemini-2.0-flash', inputCost: 0.10, outputCost: 0.40, maxOutput: 2400 },
    ],
    image: [
        { provider: 'openai', model: 'gpt-image-1', inputCost: 0, outputCost: 0, perCall: 0.02 },
        { provider: 'openai', model: 'dall-e-3', inputCost: 0, outputCost: 0, perCall: 0.04 },
    ],
};

/**
 * Legacy aliases. `/api/ai/generate` callers that predate the gateway send no
 * task at all; they land on `coach`.
 */
export const DEFAULT_TASK = 'coach';

export const isTask = (value) => TASKS.includes(value);

/**
 * @param {string} task
 * @param {(provider: ProviderId) => boolean} isConfigured
 * @returns {{provider: ProviderId, model: string, inputCost: number, outputCost: number, perCall?: number, maxOutput?: number} | null}
 */
export function resolveRoute(task, isConfigured) {
    const candidates = ROUTES[isTask(task) ? task : DEFAULT_TASK] || [];
    return candidates.find((candidate) => isConfigured(candidate.provider)) || null;
}

/** Public, non-sensitive description of what this deployment can serve. */
export function describeRegistry(isConfigured) {
    return TASKS.map((task) => {
        const route = resolveRoute(task, isConfigured);
        return {
            task,
            available: Boolean(route),
            provider: route?.provider ?? null,
            model: route?.model ?? null,
        };
    });
}

/**
 * Estimated USD cost of a single call. Token counts are approximate (see
 * estimateTokens) so this is an accounting aid, not a billing source.
 */
export function estimateCost(route, { inputTokens = 0, outputTokens = 0, calls = 1 }) {
    if (!route) return 0;
    if (route.perCall) return route.perCall * calls;
    return (inputTokens / 1_000_000) * route.inputCost + (outputTokens / 1_000_000) * route.outputCost;
}

/**
 * Cheap token estimate — ~4 characters per token for English prose. Good
 * enough for budget guarding without shipping a tokenizer to the server.
 */
export function estimateTokens(text) {
    if (!text) return 0;
    return Math.ceil(String(text).length / 4);
}
