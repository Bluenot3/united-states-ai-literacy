import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_KEY =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_KEY ||
    'public-anon-key-placeholder';

if (
    SUPABASE_URL === 'https://placeholder.supabase.co' ||
    SUPABASE_KEY === 'public-anon-key-placeholder'
) {
    console.warn('Supabase is not fully configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY for real auth and data.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
