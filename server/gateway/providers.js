/**
 * ZEN AI Gateway — provider adapters.
 *
 * Every provider exposes the same shape so the router does not care who serves
 * a request:
 *   chat({ messages, temperature, maxTokens, model, signal }) -> { text, usage }
 *   image({ prompt, size, model, signal })                    -> { url, b64 }
 *
 * Adapters use global fetch (Node 18+, which package.json already requires) so
 * the gateway adds no dependencies.
 */

const OPENAI_BASE = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const GEMINI_BASE = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';

const keys = {
    openai: () => process.env.OPENAI_API_KEY || '',
    gemini: () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
};

export const isProviderConfigured = (provider) => Boolean(keys[provider]?.());

export const configuredProviders = () => Object.keys(keys).filter(isProviderConfigured);

/** Upstream failures carry status + provider so the route can map them sanely. */
export class ProviderError extends Error {
    constructor(message, { provider, status = 502, retryable = false } = {}) {
        super(message);
        this.name = 'ProviderError';
        this.provider = provider;
        this.status = status;
        this.retryable = retryable;
    }
}

async function readError(response, provider) {
    let detail = '';
    try {
        const body = await response.json();
        detail = body?.error?.message || body?.message || '';
    } catch {
        try { detail = await response.text(); } catch { /* body already consumed */ }
    }

    // 429 and 5xx are worth retrying on the next provider; 4xx are our fault.
    const retryable = response.status === 429 || response.status >= 500;
    return new ProviderError(
        detail || `${provider} request failed with status ${response.status}`,
        { provider, status: response.status, retryable },
    );
}

/* ── OpenAI ─────────────────────────────────────────────────────────── */

const openai = {
    async chat({ messages, temperature, maxTokens, model, signal }) {
        const response = await fetch(`${OPENAI_BASE}/chat/completions`, {
            method: 'POST',
            signal,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${keys.openai()}`,
            },
            body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens }),
        });

        if (!response.ok) throw await readError(response, 'openai');

        const data = await response.json();
        return {
            text: data.choices?.[0]?.message?.content || '',
            usage: {
                inputTokens: data.usage?.prompt_tokens ?? null,
                outputTokens: data.usage?.completion_tokens ?? null,
            },
        };
    },

    async image({ prompt, size, model, signal }) {
        const response = await fetch(`${OPENAI_BASE}/images/generations`, {
            method: 'POST',
            signal,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${keys.openai()}`,
            },
            body: JSON.stringify({ model, prompt, n: 1, size }),
        });

        if (!response.ok) throw await readError(response, 'openai');

        const data = await response.json();
        const first = data.data?.[0] || {};
        return { url: first.url || null, b64: first.b64_json || null };
    },
};

/* ── Google Gemini ──────────────────────────────────────────────────── */

const gemini = {
    async chat({ messages, temperature, maxTokens, model, signal }) {
        // Gemini keeps the system prompt out of the turn list.
        const system = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n');
        const contents = messages
            .filter((m) => m.role !== 'system')
            .map((m) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            }));

        const response = await fetch(
            `${GEMINI_BASE}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(keys.gemini())}`,
            {
                method: 'POST',
                signal,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
                    generationConfig: { temperature, maxOutputTokens: maxTokens },
                }),
            },
        );

        if (!response.ok) throw await readError(response, 'gemini');

        const data = await response.json();
        const text = (data.candidates?.[0]?.content?.parts || [])
            .map((part) => part.text || '')
            .join('');

        return {
            text,
            usage: {
                inputTokens: data.usageMetadata?.promptTokenCount ?? null,
                outputTokens: data.usageMetadata?.candidatesTokenCount ?? null,
            },
        };
    },

    async image() {
        throw new ProviderError('Image generation is not wired for Gemini in this gateway.', {
            provider: 'gemini',
            status: 501,
        });
    },
};

export const PROVIDERS = { openai, gemini };

export function getProvider(id) {
    const provider = PROVIDERS[id];
    if (!provider) {
        throw new ProviderError(`Unknown provider "${id}".`, { provider: id, status: 500 });
    }
    return provider;
}
