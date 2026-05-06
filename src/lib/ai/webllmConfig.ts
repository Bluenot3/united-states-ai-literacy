// Model ID verified from @mlc-ai/web-llm@0.2.83 prebuiltAppConfig.model_list after install.
// Qwen2-0.5B is the smallest instruct model in the bundled catalog, making it the safest first local browser model.
export const WEBLLM_CONFIG = {
    defaultModel: 'Qwen2-0.5B-Instruct-q4f16_1-MLC',
    maxInputChars: 4000,
    maxOutputTokens: 500,
    temperature: 0.4,
    requireUserActivation: true,
    enableProgress: true,
    requestTimeoutMs: 60000,
} as const;

export const WEBLLM_FLAGS = {
    enableWebLLM: import.meta.env.VITE_ENABLE_WEBLLM === 'true',
    enableAutoRoute: import.meta.env.VITE_ENABLE_WEBLLM_AUTO_ROUTE === 'true',
    enableTemplateFallback: import.meta.env.VITE_ENABLE_TEMPLATE_AI_FALLBACK !== 'false',
} as const;

