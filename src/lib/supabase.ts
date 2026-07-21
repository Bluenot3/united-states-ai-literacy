import { createClient } from '@supabase/supabase-js';
import {
    createSupabaseFetch,
    isSupabaseConfigured,
    SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_URL,
} from './supabaseConfig';

if (
    !isSupabaseConfigured
) {
    console.warn('Supabase is not fully configured. Set the Vanguard Supabase URL and publishable key for real auth and data.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
        fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
    },
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});
