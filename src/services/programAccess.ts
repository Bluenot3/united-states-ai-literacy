// Per-program access helper. Resolves access from Supabase
// `program_entitlements` with admin allowlist bypass and legacy
// `user_profiles.is_entitled` fallback for backward compatibility while
// Codex finishes wiring program-scoped entitlement everywhere.

import { supabase } from '../lib/supabase';
import { isAdminEmail } from './adminAccess';

export type ProgramKey = 'pioneer' | 'vanguard';

export const PROGRAM_KEYS: ProgramKey[] = ['pioneer', 'vanguard'];

export interface ProgramEntitlement {
    id: string;
    user_id: string;
    program_key: ProgramKey;
    status: 'active' | 'trialing' | 'pending' | 'past_due' | 'canceled' | 'revoked' | 'expired';
    source: string;
    access_starts_at: string | null;
    access_ends_at: string | null;
    note?: string | null;
    updated_at?: string;
}

const ACTIVE_STATUSES = new Set(['active', 'trialing']);

function isWindowOpen(starts: string | null, ends: string | null): boolean {
    const now = Date.now();
    if (starts && new Date(starts).getTime() > now) return false;
    if (ends && new Date(ends).getTime() <= now) return false;
    return true;
}

export function normalizeProgramKey(value: string | null | undefined): ProgramKey | null {
    const v = (value ?? '').toLowerCase();
    if (v === 'pioneer' || v === 'ai-pioneer') return 'pioneer';
    if (v === 'vanguard') return 'vanguard';
    return null;
}

/**
 * Canonical per-program access check used by route gating and admin UI.
 * Order of precedence:
 *   1. Admin email allowlist (all programs).
 *   2. Active/trialing row in `program_entitlements` for that program.
 *   3. Legacy `user_profiles.is_entitled` fallback (treated as Vanguard-only
 *      so a single global flag never silently unlocks Pioneer).
 */
export async function hasProgramAccess(
    userId: string | undefined | null,
    email: string | undefined | null,
    programKey: ProgramKey,
): Promise<boolean> {
    if (isAdminEmail(email)) return true;
    if (!userId) return false;

    try {
        const { data, error } = await supabase
            .from('program_entitlements')
            .select('status, access_starts_at, access_ends_at')
            .eq('user_id', userId)
            .eq('program_key', programKey)
            .maybeSingle();

        if (!error && data) {
            if (ACTIVE_STATUSES.has(data.status as string)
                && isWindowOpen(data.access_starts_at, data.access_ends_at)) {
                return true;
            }
        }
    } catch (err) {
        // Network/RLS error — fall through to legacy check.
        console.warn('[programAccess] entitlement lookup failed:', err);
    }

    // Legacy global flag — Vanguard only, never Pioneer.
    if (programKey !== 'vanguard') return false;
    try {
        const { data } = await supabase
            .from('user_profiles')
            .select('is_entitled')
            .eq('id', userId)
            .maybeSingle();
        return data?.is_entitled === true;
    } catch {
        return false;
    }
}

export async function listMyEntitlements(userId: string): Promise<ProgramEntitlement[]> {
    try {
        const { data, error } = await supabase
            .from('program_entitlements')
            .select('*')
            .eq('user_id', userId);
        if (error) return [];
        return (data ?? []) as ProgramEntitlement[];
    } catch {
        return [];
    }
}

/** Admin RPC wrapper. RLS / SECURITY DEFINER enforces `is_zen_admin()`. */
export async function adminGrantProgramAccess(input: {
    userId: string;
    programKey: ProgramKey;
    source?: string;
    accessEndsAt?: string | null;
    note?: string | null;
}) {
    return supabase.rpc('grant_program_access', {
        _user_id: input.userId,
        _program_key: input.programKey,
        _source: input.source ?? 'admin',
        _access_ends_at: input.accessEndsAt ?? null,
        _note: input.note ?? null,
    });
}

export async function adminRevokeProgramAccess(input: {
    userId: string;
    programKey: ProgramKey;
    note?: string | null;
}) {
    return supabase.rpc('revoke_program_access', {
        _user_id: input.userId,
        _program_key: input.programKey,
        _note: input.note ?? null,
    });
}
