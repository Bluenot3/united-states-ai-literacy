/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
    readonly VITE_ENABLE_DEMO_LOGIN?: string;
    readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
    readonly VITE_STRIPE_VANGUARD_PAYMENT_LINK_URL?: string;
    readonly VITE_STRIPE_AI_PIONEER_PAYMENT_LINK_URL?: string;
    readonly VITE_SUPABASE_KEY?: string;
    readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_PROJECT_ID?: string;
    readonly VITE_VANGUARD_SUPABASE_URL?: string;
    readonly VITE_VANGUARD_SUPABASE_PUBLISHABLE_KEY?: string;
    readonly VITE_PROGRAM_REGISTRATION_ADAPTER?: 'supabase' | 'mock';
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
