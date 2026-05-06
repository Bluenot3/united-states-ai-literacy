import { WEBLLM_CONFIG, WEBLLM_FLAGS } from './webllmConfig';
import type { ProgramAITaskType } from './templateFallbacks';

export type WebLLMRole = 'system' | 'user' | 'assistant';

export interface WebLLMMessage {
    role: WebLLMRole;
    content: string;
}

export interface WebLLMStatus {
    supported: boolean;
    initialized: boolean;
    initializing: boolean;
    progress: number;
    progressText: string;
    currentModel: string | null;
    error: string | null;
}

interface GenerateWithWebLLMInput {
    messages: WebLLMMessage[];
    taskType: ProgramAITaskType;
    moduleId?: string;
    maxTokens?: number;
    temperature?: number;
}

type WebLLMEngine = {
    chat: {
        completions: {
            create: (request: {
                messages: WebLLMMessage[];
                temperature?: number;
                max_tokens?: number;
            }) => Promise<{ choices?: Array<{ message?: { content?: string } }> }>;
        };
    };
    unload?: () => Promise<void>;
    interruptGenerate?: () => Promise<void>;
};

let engine: WebLLMEngine | null = null;
let initializePromise: Promise<WebLLMStatus> | null = null;
let status: WebLLMStatus = {
    supported: false,
    initialized: false,
    initializing: false,
    progress: 0,
    progressText: 'Not initialized',
    currentModel: null,
    error: null,
};

const getNavigatorWithGpu = () => (
    typeof navigator === 'undefined'
        ? null
        : navigator as Navigator & { gpu?: unknown }
);

const setStatus = (patch: Partial<WebLLMStatus>) => {
    status = { ...status, ...patch };
    return status;
};

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
    });

    try {
        return await Promise.race([promise, timeoutPromise]);
    } finally {
        if (timeoutId) clearTimeout(timeoutId);
    }
};

export function isWebLLMSupported() {
    if (!WEBLLM_FLAGS.enableWebLLM) {
        setStatus({
            supported: false,
            error: 'WebLLM is disabled by VITE_ENABLE_WEBLLM.',
        });
        return false;
    }

    if (typeof window === 'undefined') {
        setStatus({ supported: false, error: 'WebLLM only runs in the browser.' });
        return false;
    }

    if (!getNavigatorWithGpu()?.gpu) {
        setStatus({ supported: false, error: 'WebGPU is not available in this browser.' });
        return false;
    }

    setStatus({ supported: true, error: null });
    return true;
}

export async function initializeWebLLM() {
    if (!isWebLLMSupported()) {
        return getWebLLMStatus();
    }

    if (engine && status.initialized) {
        return getWebLLMStatus();
    }

    if (initializePromise) {
        return initializePromise;
    }

    initializePromise = (async () => {
        setStatus({
            initializing: true,
            initialized: false,
            progress: 0,
            progressText: 'Loading WebLLM runtime',
            currentModel: WEBLLM_CONFIG.defaultModel,
            error: null,
        });

        try {
            const webllm = await import('@mlc-ai/web-llm');
            const createdEngine = await withTimeout(
                webllm.CreateMLCEngine(WEBLLM_CONFIG.defaultModel, {
                    initProgressCallback: (progress: { progress?: number; text?: string }) => {
                        setStatus({
                            progress: Math.round((progress.progress ?? 0) * 100),
                            progressText: progress.text ?? 'Loading local model',
                        });
                    },
                }),
                WEBLLM_CONFIG.requestTimeoutMs,
                'WebLLM initialization',
            );

            engine = createdEngine as WebLLMEngine;
            return setStatus({
                supported: true,
                initialized: true,
                initializing: false,
                progress: 100,
                progressText: 'Local AI ready',
                currentModel: WEBLLM_CONFIG.defaultModel,
                error: null,
            });
        } catch (error) {
            engine = null;
            return setStatus({
                initialized: false,
                initializing: false,
                progressText: 'Local AI unavailable',
                error: error instanceof Error ? error.message : 'Failed to initialize WebLLM.',
            });
        } finally {
            initializePromise = null;
        }
    })();

    return initializePromise;
}

export async function generateWithWebLLM({
    messages,
    taskType: _taskType,
    moduleId: _moduleId,
    maxTokens,
    temperature,
}: GenerateWithWebLLMInput) {
    if (!engine || !status.initialized) {
        throw new Error('WebLLM is not initialized.');
    }

    const safeMessages = messages.map((message) => ({
        role: message.role,
        content: message.content.slice(0, WEBLLM_CONFIG.maxInputChars),
    }));

    const response = await withTimeout(
        engine.chat.completions.create({
            messages: safeMessages,
            temperature: temperature ?? WEBLLM_CONFIG.temperature,
            max_tokens: Math.min(maxTokens ?? WEBLLM_CONFIG.maxOutputTokens, WEBLLM_CONFIG.maxOutputTokens),
        }),
        WEBLLM_CONFIG.requestTimeoutMs,
        'WebLLM generation',
    );

    const text = response.choices?.[0]?.message?.content?.trim();
    if (!text) {
        throw new Error('WebLLM returned an empty response.');
    }

    return {
        text,
        model: status.currentModel ?? WEBLLM_CONFIG.defaultModel,
    };
}

export function getWebLLMStatus() {
    return { ...status, supported: isWebLLMSupported() };
}

export async function unloadWebLLM() {
    if (engine?.interruptGenerate) {
        await engine.interruptGenerate().catch(() => undefined);
    }

    if (engine?.unload) {
        await engine.unload().catch(() => undefined);
    }

    engine = null;
    initializePromise = null;
    setStatus({
        initialized: false,
        initializing: false,
        progress: 0,
        progressText: 'Unloaded',
        currentModel: null,
        error: null,
    });
}

