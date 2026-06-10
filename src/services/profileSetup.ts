// ZEN Builder profile persistence.
// Writes to Supabase `program_profiles` (RLS: self read/write) and mirrors
// to localStorage for offline / migration fallback. Reads prefer Supabase
// and fall back to localStorage if the row isn't there yet.

import { supabase } from '../lib/supabase';

export type ZenTrack = 'explorer' | 'builder' | 'founder';
export type ZenExperience = 'beginner' | 'some-ai' | 'builder';
export type ZenGoal = 'build-apps' | 'learn-prompting' | 'launch-agent' | 'portfolio' | 'other';
export type ZenProgramSlug = 'pioneer' | 'vanguard';

export interface ZenProfile {
    displayName: string;
    username: string;
    bio: string;
    program: ZenProgramSlug;
    track: ZenTrack;
    country: string;
    organization?: string;
    experience: ZenExperience;
    goal: ZenGoal;
    missionBadge?: string;
    updatedAt: string;
}

const key = (userId: string) => `zenProfile:${userId}`;

function fromRow(row: Record<string, unknown> | null | undefined): ZenProfile | null {
    if (!row) return null;
    return {
        displayName: (row.display_name as string) ?? '',
        username: (row.username as string) ?? '',
        bio: (row.bio as string) ?? '',
        program: ((row.program as string) === 'vanguard' ? 'vanguard' : 'pioneer'),
        track: ((row.track as string) ?? 'explorer') as ZenTrack,
        country: (row.country as string) ?? '',
        organization: (row.organization as string) ?? '',
        experience: ((row.experience_level as string) ?? 'beginner') as ZenExperience,
        goal: ((row.goal as string) ?? 'build-apps') as ZenGoal,
        missionBadge: (row.mission_badge as string) ?? '',
        updatedAt: (row.updated_at as string) ?? new Date().toISOString(),
    };
}

function toRow(userId: string, p: ZenProfile): Record<string, unknown> {
    return {
        user_id: userId,
        display_name: p.displayName,
        username: p.username,
        bio: p.bio,
        program: p.program,
        track: p.track,
        country: p.country,
        organization: p.organization ?? null,
        experience_level: p.experience,
        goal: p.goal,
        mission_badge: p.missionBadge ?? null,
    };
}

export function loadProfile(userId?: string | null): ZenProfile | null {
    if (!userId || typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(key(userId));
        return raw ? (JSON.parse(raw) as ZenProfile) : null;
    } catch {
        return null;
    }
}

export async function loadProfileAsync(userId?: string | null): Promise<ZenProfile | null> {
    if (!userId) return null;
    try {
        const { data, error } = await supabase
            .from('program_profiles')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        if (!error && data) {
            const profile = fromRow(data);
            if (profile && typeof window !== 'undefined') {
                window.localStorage.setItem(key(userId), JSON.stringify(profile));
            }
            return profile;
        }
    } catch (err) {
        console.warn('[profileSetup] supabase load failed, using localStorage:', err);
    }
    return loadProfile(userId);
}

export function saveProfile(userId: string, profile: ZenProfile): void {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(
            key(userId),
            JSON.stringify({ ...profile, updatedAt: new Date().toISOString() }),
        );
    }
    // Fire-and-forget upsert to Supabase (RLS: user can upsert own row).
    void supabase
        .from('program_profiles')
        .upsert(toRow(userId, profile), { onConflict: 'user_id' })
        .then(({ error }) => {
            if (error) console.warn('[profileSetup] supabase upsert failed:', error.message);
        });
}

export function isProfileComplete(p: ZenProfile | null | undefined): boolean {
    if (!p) return false;
    return Boolean(p.displayName && p.username && p.track && p.country && p.experience && p.goal && p.program);
}
