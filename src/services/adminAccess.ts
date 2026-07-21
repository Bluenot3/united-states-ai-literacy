import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/supabaseConfig';

/** Resolve admin authority from the same Supabase allowlist used by RLS. */
export async function getCanonicalAdminStatus(): Promise<boolean> {
    if (!isSupabaseConfigured) return false;

    try {
        const { data, error } = await supabase.rpc('is_zen_admin');
        if (error) {
            console.warn('[adminAccess] canonical admin lookup failed:', error.message);
            return false;
        }
        return data === true;
    } catch (error) {
        console.warn('[adminAccess] canonical admin lookup failed:', error);
        return false;
    }
}
