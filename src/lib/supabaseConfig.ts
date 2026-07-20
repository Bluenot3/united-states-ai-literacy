const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY = 'public-anon-key-placeholder';

/**
 * Lovable Cloud injects its own VITE_SUPABASE_* variables at build time.
 * These explicit Vanguard variables keep the application attached to the
 * canonical ZEN Vanguard project even when that injection is present.
 */
export const SUPABASE_URL =
    import.meta.env.VITE_VANGUARD_SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL ||
    PLACEHOLDER_URL;

export const SUPABASE_PUBLISHABLE_KEY =
    import.meta.env.VITE_VANGUARD_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_KEY ||
    PLACEHOLDER_KEY;

export const isSupabaseConfigured = (
    SUPABASE_URL !== PLACEHOLDER_URL &&
    SUPABASE_PUBLISHABLE_KEY !== PLACEHOLDER_KEY
);

function isOpaqueSupabaseApiKey(value: string): boolean {
    return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

/** Supabase's modern publishable keys belong in `apikey`, not a bearer header. */
export function createSupabaseFetch(supabaseKey: string): typeof fetch {
    return (input, init) => {
        const headers = new Headers(
            typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
        );

        if (init?.headers) {
            new Headers(init.headers).forEach((value, key) => headers.set(key, value));
        }

        if (
            isOpaqueSupabaseApiKey(supabaseKey) &&
            headers.get('Authorization') === `Bearer ${supabaseKey}`
        ) {
            headers.delete('Authorization');
        }

        headers.set('apikey', supabaseKey);
        return fetch(input, { ...init, headers });
    };
}
