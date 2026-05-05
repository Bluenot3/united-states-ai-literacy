const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

type Message = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

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

async function proxyChatCompletion(messages: Message[], temperature = 0.7, maxTokens = 2048): Promise<string> {
    const { data: { session } } = await import('./supabase').then(m => m.supabase.auth.getSession());
    const token = session?.access_token;
    
    const response = await fetch(`${API_BASE}/api/ai/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
            messages,
            temperature,
            maxTokens,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || `AI proxy request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.text || '';
}

async function proxyImageGeneration(prompt: string): Promise<string> {
    const { data: { session } } = await import('./supabase').then(m => m.supabase.auth.getSession());
    const token = session?.access_token;

    const response = await fetch(`${API_BASE}/api/ai/image`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || `AI image proxy request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.url || '';
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
        const response = await fetch(`${API_BASE}/api/health`);

        if (!response.ok) {
            throw new Error('Backend health check failed.');
        }

        aiClientInstance = new ProxyAIClient();
    } catch (error) {
        console.error('AI proxy unavailable. Ensure server is running and configured.', error);
        throw new Error('AI Generation service is currently unavailable. Please verify API configurations or subscription status.');
    }

    return aiClientInstance;
}

export function clearAiClient(): void {
    aiClientInstance = null;
}

export function isImageSimulationMode(): boolean {
    return false;
}
