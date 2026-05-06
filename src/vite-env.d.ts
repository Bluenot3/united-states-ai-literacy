/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
    readonly VITE_ENABLE_DEMO_LOGIN?: string;
    readonly VITE_ENABLE_WEBLLM?: string;
    readonly VITE_ENABLE_WEBLLM_AUTO_ROUTE?: string;
    readonly VITE_ENABLE_TEMPLATE_AI_FALLBACK?: string;
    readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
    readonly VITE_SUPABASE_KEY?: string;
    readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
    readonly VITE_SUPABASE_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
