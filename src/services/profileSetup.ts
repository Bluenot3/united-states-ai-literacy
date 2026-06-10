// Lightweight client-side profile setup store.
// NOTE: Persistence is localStorage-only for now. Backend (Supabase user_profiles)
// wiring is a Codex item. The UI shape below is what should be persisted server-side.

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

export function loadProfile(userId?: string | null): ZenProfile | null {
    if (!userId || typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(key(userId));
        return raw ? (JSON.parse(raw) as ZenProfile) : null;
    } catch {
        return null;
    }
}

export function saveProfile(userId: string, profile: ZenProfile): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key(userId), JSON.stringify({ ...profile, updatedAt: new Date().toISOString() }));
}

export function isProfileComplete(p: ZenProfile | null | undefined): boolean {
    if (!p) return false;
    return Boolean(p.displayName && p.username && p.track && p.country && p.experience && p.goal && p.program);
}
