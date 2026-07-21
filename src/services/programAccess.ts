// Per-program access helper. Resolves access from Supabase
// `program_entitlements` with admin allowlist bypass and legacy
// `user_profiles.is_entitled` fallback for backward compatibility while
// Codex finishes wiring program-scoped entitlement everywhere.

import { supabase } from '../lib/supabase';

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
    _email: string | undefined | null,
    programKey: ProgramKey,
): Promise<boolean> {
    if (!userId) return false;

    try {
        const { data, error } = await supabase.rpc('has_program_access', {
            _user_id: userId,
            _program_key: programKey,
        });
        if (error) {
            console.warn('[programAccess] canonical access lookup failed:', error.message);
            return false;
        }
        return data === true;
    } catch (err) {
        // Network/RLS error — fall through to legacy check.
        console.warn('[programAccess] canonical access lookup failed:', err);
        return false;
    }

    // Legacy global entitlements are backfilled into program_entitlements by
    // migration. Never let a mutable/global profile flag unlock another course.
    return false;
}

export interface VerifiedQuizAttemptResult {
    correct: number;
    incorrect: number;
    total: number;
    passed: boolean;
    attemptedAt: string;
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

export async function submitVanguardQuizAttempt(
    quizId: string,
    selectedOptionIndexes: number[],
): Promise<VerifiedQuizAttemptResult> {
    const { data, error } = await supabase.rpc('submit_vanguard_quiz_attempt', {
        p_quiz_id: quizId,
        p_selected_option_indexes: selectedOptionIndexes,
    });
    if (error) throw error;

    const row = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | undefined;
    if (!row) throw new Error('Quiz verification returned no result.');

    return {
        correct: Number(row.correct_count ?? 0),
        incorrect: Number(row.incorrect_count ?? 0),
        total: Number(row.total_count ?? 0),
        passed: row.passed === true,
        attemptedAt: String(row.attempted_at ?? new Date().toISOString()),
    };
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
