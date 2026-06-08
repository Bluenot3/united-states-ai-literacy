const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE = import.meta.env.DEV
    ? RAW_API_BASE || 'http://localhost:3001'
    : /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(RAW_API_BASE)
        ? ''
        : RAW_API_BASE;

type Message = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

export type AiProxyHealth = {
    status: string;
    version?: string;
    features?: {
        aiProxy?: boolean;
        aiProvider?: string;
        aiProviders?: {
            text?: string;
            image?: string;
            video?: string;
        };
        aiModels?: {
            text?: string | null;
            image?: string | null;
            video?: string | null;
        };
        videoProxy?: boolean;
    };
};

export type AiVideoResult = {
    id: string | null;
    status: string;
    state?: string;
    url: string | null;
    provider?: string;
    model?: string;
    raw?: unknown;
};

let aiHealthCache: AiProxyHealth | null = null;

function buildMessages(config: any): Message[] {
    const messages: Message[] = [];

    if (config?.config?.systemInstruction) {
        messages.push({ role: 'system', content: config.config.systemInstruction });
    }

    if (Array.isArray(config?.history)) {
        for (const item of config.history) {
            messages.push({
                role: item.role === 'model' ? 'assistant' : 'user',
                content: item.parts?.map((part: any) => part.text || '').join('') || '',
            });
        }
    }

    const contents = config?.contents;

    if (typeof contents === 'string') {
        messages.push({ role: 'user', content: contents });
    } else if (contents?.parts) {
        messages.push({
            role: contents.role === 'model' ? 'assistant' : 'user',
            content: contents.parts.map((part: any) => part.text || '').join(''),
        });
    } else if (contents && typeof contents === 'object') {
        messages.push({
            role: contents.role === 'model' ? 'assistant' : 'user',
            content: contents.parts
                ? contents.parts.map((part: any) => part.text || '').join('')
                : JSON.stringify(contents),
        });
    }

    if (messages.length === 0) {
        messages.push({ role: 'user', content: JSON.stringify(config ?? {}) });
    }

    return messages;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await import('./supabase').then(m => m.supabase.auth.getSession());
    const token = session?.access_token;

    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function readProxyError(response: Response, fallback: string): Promise<string> {
    const errorBody = await response.text();

    if (!errorBody) {
        return fallback;
    }

    try {
        const parsed = JSON.parse(errorBody);
        return parsed.error || parsed.message || errorBody;
    } catch {
        return errorBody;
    }
}

export async function getAiProxyHealth(force = false): Promise<AiProxyHealth> {
    if (aiHealthCache && !force) {
        return aiHealthCache;
    }

    if (!API_BASE) {
        throw new Error('AI proxy backend is not configured.');
    }

    const response = await fetch(`${API_BASE}/api/health`);

    if (!response.ok) {
        throw new Error('Backend health check failed.');
    }

    const health = await response.json();

    if (!health?.features?.aiProxy) {
        throw new Error('AI proxy is not configured on the server.');
    }

    aiHealthCache = health;
    return health;
}

async function proxyChatCompletion(messages: Message[], temperature = 0.7, maxTokens = 2048): Promise<string> {
    if (!API_BASE) {
        throw new Error('AI proxy backend is not configured.');
    }

    const authHeaders = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE}/api/ai/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
        },
        body: JSON.stringify({
            messages,
            temperature,
            maxTokens,
        }),
    });

    if (!response.ok) {
        throw new Error(await readProxyError(response, `AI proxy request failed with status ${response.status}`));
    }

    const data = await response.json();
    return data.text || '';
}

async function proxyImageGeneration(prompt: string): Promise<string> {
    if (!API_BASE) {
        throw new Error('AI proxy backend is not configured.');
    }

    const authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_BASE}/api/ai/image`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
        },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        throw new Error(await readProxyError(response, `AI image proxy request failed with status ${response.status}`));
    }

    const data = await response.json();
    return data.url || '';
}

export async function proxyVideoGeneration(prompt: string, options: { aspectRatio?: string; duration?: number; resolution?: string } = {}): Promise<AiVideoResult> {
    if (!API_BASE) {
        throw new Error('AI proxy backend is not configured.');
    }

    const authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_BASE}/api/ai/video`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
        },
        body: JSON.stringify({
            prompt,
            aspectRatio: options.aspectRatio,
            duration: options.duration,
            resolution: options.resolution,
        }),
    });

    if (!response.ok) {
        throw new Error(await readProxyError(response, `AI video proxy request failed with status ${response.status}`));
    }

    return response.json();
}

const IMAGE_MODELS = ['gemini-2.5-flash-image', 'gemini-2.0-flash-image', 'dall-e-2', 'dall-e-3'];

function isImageRequest(config: any): boolean {
    if (IMAGE_MODELS.includes(config?.model)) {
        return true;
    }

    return config?.config?.responseModalities?.some?.((mode: string) => mode.toUpperCase() === 'IMAGE') === true;
}

class ProxyAIClient {
    models = {
        generateContent: async (config: any) => {
            if (isImageRequest(config)) {
                try {
                    const prompt = typeof config.contents === 'string' 
                        ? config.contents 
                        : config.contents?.parts?.map((p: any) => p.text).join(' ') || 
                          (Array.isArray(config.contents) ? config.contents.map((p: any) => p.parts?.map((x:any)=>x.text).join(' ')).join(' ') : "futuristic art");

                    const url = await proxyImageGeneration(prompt);
                    
                    return {
                        text: url,
                        response: { text: () => url },
                        candidates: [
                            {
                                content: {
                                    parts: [{ text: url }],
                                },
                            },
                        ],
                    };
                } catch (e: any) {
                    console.error("Image gen failed:", e);
                    const errorText = `Image generation error: ${e.message}`;
                    return {
                        text: errorText,
                        response: { text: () => errorText },
                        candidates: [{ content: { parts: [{ text: errorText }] } }],
                    };
                }
            }

            const messages = buildMessages(config);
            const temperature = config?.config?.temperature ?? 0.7;
            const maxTokens = config?.config?.maxOutputTokens ?? 2048;
            const text = await proxyChatCompletion(messages, temperature, maxTokens);

            return {
                text,
                response: {
                    text: () => text,
                },
                candidates: [
                    {
                        content: {
                            parts: [{ text }],
                        },
                    },
                ],
            };
        },
    };

    chats = {
        create: (config: any) => {
            const history: Message[] = [];

            if (config?.config?.systemInstruction) {
                history.push({ role: 'system', content: config.config.systemInstruction });
            }

            return {
                sendMessage: async (message: string | { message: string }) => {
                    const userText = typeof message === 'string' ? message : message.message;
                    history.push({ role: 'user', content: userText });

                    const text = await proxyChatCompletion(history);
                    history.push({ role: 'assistant', content: text });

                    return { text };
                },
            };
        },
    };

    media = {
        generateVideo: proxyVideoGeneration,
    };

    getGenerativeModel(config: { model: string }) {
        return {
            startChat: (chatConfig?: any) => this.chats.create(chatConfig),
            generateContent: async (prompt: any) => {
                const resolvedConfig =
                    typeof prompt === 'string'
                        ? { model: config.model, contents: prompt }
                        : { model: config.model, ...prompt };

                return this.models.generateContent(resolvedConfig);
            },
        };
    }
}

let aiClientInstance: ProxyAIClient | null = null;

export async function getAiClient(): Promise<any> {
    if (aiClientInstance) {
        return aiClientInstance;
    }

    try {
        await getAiProxyHealth();
        aiClientInstance = new ProxyAIClient();
    } catch (error) {
        console.error('AI proxy unavailable. Ensure server is running and configured.', error);
        throw new Error('AI Generation service is currently unavailable. Please verify API configurations or subscription status.');
    }

    return aiClientInstance;
}

export function clearAiClient(): void {
    aiClientInstance = null;
    aiHealthCache = null;
}

export function isImageSimulationMode(): boolean {
    return false;
}
