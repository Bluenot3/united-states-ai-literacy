import { supabase } from '../lib/supabase';
import {
    getProgramByKey,
    type CampaignUtm,
    type ProgramAccessLevel,
    type ProgramKey,
    type RegistrationStatus,
    type UserProgramState,
} from './programIntegrationContract';

export interface ProgramRegistrationInput {
    userId: string;
    email?: string | null;
    displayName?: string | null;
    programKey: ProgramKey;
    source?: string | null;
    referralCode?: string | null;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_content?: string | null;
    utm_term?: string | null;
    metadata?: Record<string, unknown>;
}

export interface AdminRegistrationFilters {
    programKey?: ProgramKey;
    status?: RegistrationStatus;
    email?: string;
    source?: string;
}

export interface AdminRegistrationStatusInput {
    userId: string;
    programKey: ProgramKey;
    status: Exclude<RegistrationStatus, 'none'>;
}

export interface AdminProgramAccessGrantInput {
    userId: string;
    programKey: ProgramKey;
    accessLevel: Exclude<ProgramAccessLevel, 'none' | 'waitlist'>;
    grantedBy?: string | null;
    reason?: string | null;
    expiresAt?: string | null;
}

export interface ProgramProgressRecord {
    userId: string;
    programKey: ProgramKey;
    moduleKey?: string | null;
    lessonKey?: string | null;
    progressPercent: number;
    status: 'not_started' | 'started' | 'completed';
    lastActivityAt?: string | null;
    metadata?: Record<string, unknown>;
}

export interface ProgramProgressInput {
    userId: string;
    programKey: ProgramKey;
    moduleKey?: string | null;
    lessonKey?: string | null;
    progressPercent?: number;
    status?: ProgramProgressRecord['status'];
    metadata?: Record<string, unknown>;
}

export interface ProgramRegistrationAdapter {
    mode: 'mock' | 'supabase';
    getCurrentUserProgramStates(userId: string): Promise<UserProgramState[]>;
    registerForProgram(input: ProgramRegistrationInput): Promise<UserProgramState>;
    getRegistrationForProgram(userId: string, programKey: ProgramKey): Promise<UserProgramState | null>;
    adminListRegistrations(filters?: AdminRegistrationFilters): Promise<UserProgramState[]>;
    adminUpdateRegistrationStatus(input: AdminRegistrationStatusInput): Promise<UserProgramState>;
    adminGrantProgramAccess(input: AdminProgramAccessGrantInput): Promise<UserProgramState>;
    getUserProgramProgress(userId: string, programKey: ProgramKey): Promise<ProgramProgressRecord[]>;
    updateProgramProgress(input: ProgramProgressInput): Promise<ProgramProgressRecord>;
    markLessonStarted(input: ProgramProgressInput): Promise<ProgramProgressRecord>;
    markLessonCompleted(input: ProgramProgressInput): Promise<ProgramProgressRecord>;
}

const REGISTRATION_STORAGE_KEY = 'zenPrograms.registrationAdapter.v1';
const PROGRESS_STORAGE_KEY = 'zenPrograms.progressAdapter.v1';

type StoredRegistration = UserProgramState & {
    displayName?: string | null;
    referralCode?: string | null;
    metadata?: Record<string, unknown>;
    updatedAt: string;
};

const isBrowser = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const readJson = <T,>(key: string, fallback: T): T => {
    if (!isBrowser()) {
        return fallback;
    }

    try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) as T : fallback;
    } catch {
        return fallback;
    }
};

const writeJson = <T,>(key: string, value: T) => {
    if (!isBrowser()) {
        return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
};

const registrationKey = (userId: string, programKey: ProgramKey) => `${userId}::${programKey}`;

const toUtm = (input: ProgramRegistrationInput): CampaignUtm => ({
    utm_source: input.utm_source ?? undefined,
    utm_medium: input.utm_medium ?? undefined,
    utm_campaign: input.utm_campaign ?? undefined,
    utm_content: input.utm_content ?? undefined,
    utm_term: input.utm_term ?? undefined,
});

const nowIso = () => new Date().toISOString();

const createEmptyRegistration = (userId: string, programKey: ProgramKey): UserProgramState => ({
    userId,
    programKey,
    registrationStatus: 'none',
    accessLevel: 'none',
    progressPercent: 0,
    lastActivityAt: null,
});

const sortStates = (states: UserProgramState[]) => (
    [...states].sort((a, b) => a.programKey.localeCompare(b.programKey))
);

export const createMockProgramRegistrationAdapter = (): ProgramRegistrationAdapter => ({
    mode: 'mock',

    async getCurrentUserProgramStates(userId) {
        const registrations = readJson<Record<string, StoredRegistration>>(REGISTRATION_STORAGE_KEY, {});
        return sortStates(Object.values(registrations).filter((registration) => registration.userId === userId));
    },

    async registerForProgram(input) {
        const registrations = readJson<Record<string, StoredRegistration>>(REGISTRATION_STORAGE_KEY, {});
        const key = registrationKey(input.userId, input.programKey);
        const existing = registrations[key];

        if (existing && existing.registrationStatus !== 'cancelled') {
            return existing;
        }

        const state: StoredRegistration = {
            userId: input.userId,
            email: input.email,
            displayName: input.displayName,
            programKey: input.programKey,
            registrationStatus: 'waitlisted',
            accessLevel: 'waitlist',
            progressPercent: existing?.progressPercent ?? 0,
            lastActivityAt: nowIso(),
            source: input.source ?? 'standalone-local',
            referralCode: input.referralCode,
            utm: toUtm(input),
            metadata: input.metadata ?? {},
            updatedAt: nowIso(),
        };

        registrations[key] = state;
        writeJson(REGISTRATION_STORAGE_KEY, registrations);
        return state;
    },

    async getRegistrationForProgram(userId, programKey) {
        const registrations = readJson<Record<string, StoredRegistration>>(REGISTRATION_STORAGE_KEY, {});
        return registrations[registrationKey(userId, programKey)] ?? null;
    },

    async adminListRegistrations(filters = {}) {
        const registrations = Object.values(readJson<Record<string, StoredRegistration>>(REGISTRATION_STORAGE_KEY, {}));

        return sortStates(registrations.filter((registration) => {
            if (filters.programKey && registration.programKey !== filters.programKey) return false;
            if (filters.status && registration.registrationStatus !== filters.status) return false;
            if (filters.email && !registration.email?.toLowerCase().includes(filters.email.toLowerCase())) return false;
            if (filters.source && registration.source !== filters.source) return false;
            return true;
        }));
    },

    async adminUpdateRegistrationStatus(input) {
        const registrations = readJson<Record<string, StoredRegistration>>(REGISTRATION_STORAGE_KEY, {});
        const key = registrationKey(input.userId, input.programKey);
        const existing = registrations[key] ?? createEmptyRegistration(input.userId, input.programKey);
        const next: StoredRegistration = {
            ...existing,
            registrationStatus: input.status,
            accessLevel: input.status === 'enrolled' ? 'enrolled' : existing.accessLevel === 'none' ? 'waitlist' : existing.accessLevel,
            lastActivityAt: nowIso(),
            updatedAt: nowIso(),
        };

        registrations[key] = next;
        writeJson(REGISTRATION_STORAGE_KEY, registrations);
        return next;
    },

    async adminGrantProgramAccess(input) {
        const registrations = readJson<Record<string, StoredRegistration>>(REGISTRATION_STORAGE_KEY, {});
        const key = registrationKey(input.userId, input.programKey);
        const existing = registrations[key] ?? createEmptyRegistration(input.userId, input.programKey);
        const next: StoredRegistration = {
            ...existing,
            registrationStatus: input.accessLevel === 'enrolled' || input.accessLevel === 'facilitator' ? 'enrolled' : existing.registrationStatus,
            accessLevel: input.accessLevel,
            lastActivityAt: nowIso(),
            metadata: {
                ...(existing as StoredRegistration).metadata,
                grantReason: input.reason ?? null,
                grantedBy: input.grantedBy ?? null,
                expiresAt: input.expiresAt ?? null,
            },
            updatedAt: nowIso(),
        };

        registrations[key] = next;
        writeJson(REGISTRATION_STORAGE_KEY, registrations);
        return next;
    },

    async getUserProgramProgress(userId, programKey) {
        const progress = readJson<Record<string, ProgramProgressRecord>>(PROGRESS_STORAGE_KEY, {});
        return Object.values(progress).filter((record) => record.userId === userId && record.programKey === programKey);
    },

    async updateProgramProgress(input) {
        const progress = readJson<Record<string, ProgramProgressRecord>>(PROGRESS_STORAGE_KEY, {});
        const key = `${input.userId}::${input.programKey}::${input.moduleKey ?? ''}::${input.lessonKey ?? ''}`;
        const existing = progress[key];
        const next: ProgramProgressRecord = {
            userId: input.userId,
            programKey: input.programKey,
            moduleKey: input.moduleKey ?? existing?.moduleKey ?? null,
            lessonKey: input.lessonKey ?? existing?.lessonKey ?? null,
            progressPercent: Math.max(0, Math.min(100, input.progressPercent ?? existing?.progressPercent ?? 0)),
            status: input.status ?? existing?.status ?? 'started',
            lastActivityAt: nowIso(),
            metadata: {
                ...(existing?.metadata ?? {}),
                ...(input.metadata ?? {}),
            },
        };

        progress[key] = next;
        writeJson(PROGRESS_STORAGE_KEY, progress);
        return next;
    },

    async markLessonStarted(input) {
        return this.updateProgramProgress({ ...input, status: 'started', progressPercent: input.progressPercent ?? 1 });
    },

    async markLessonCompleted(input) {
        return this.updateProgramProgress({ ...input, status: 'completed', progressPercent: 100 });
    },
});

const rowToProgramState = (row: Record<string, unknown>): UserProgramState => ({
    userId: String(row.user_id),
    email: row.email ? String(row.email) : null,
    programKey: row.program_key as ProgramKey,
    registrationStatus: (row.status as RegistrationStatus | undefined) ?? 'waitlisted',
    accessLevel: (row.access_level as ProgramAccessLevel | undefined) ?? (row.status === 'enrolled' ? 'enrolled' : 'waitlist'),
    progressPercent: Number(row.progress_percent ?? 0),
    lastActivityAt: row.last_activity_at ? String(row.last_activity_at) : row.updated_at ? String(row.updated_at) : null,
    source: row.source ? String(row.source) : null,
    utm: (row.utm as CampaignUtm | null) ?? undefined,
});

const rowToProgramProgress = (row: Record<string, unknown>): ProgramProgressRecord => ({
    userId: String(row.user_id),
    programKey: row.program_key as ProgramKey,
    moduleKey: row.module_key ? String(row.module_key) : null,
    lessonKey: row.lesson_key ? String(row.lesson_key) : null,
    progressPercent: Number(row.progress_percent ?? 0),
    status: (row.status as ProgramProgressRecord['status'] | undefined) ?? 'not_started',
    lastActivityAt: row.last_activity_at ? String(row.last_activity_at) : null,
    metadata: (row.metadata as Record<string, unknown> | null) ?? {},
});

const inferAccessLevelFromRegistration = (status: RegistrationStatus): ProgramAccessLevel => (
    status === 'enrolled' ? 'enrolled' : status === 'none' || status === 'cancelled' ? 'none' : 'waitlist'
);

export const createSupabaseProgramRegistrationAdapter = (): ProgramRegistrationAdapter => ({
    mode: 'supabase',

    async getCurrentUserProgramStates(userId) {
        const { data, error } = await supabase
            .from('program_registrations')
            .select('user_id,email,program_key,status,source,utm,updated_at')
            .eq('user_id', userId);

        if (error) throw error;
        return sortStates((data ?? []).map(rowToProgramState));
    },

    async registerForProgram(input) {
        const existing = await this.getRegistrationForProgram(input.userId, input.programKey);

        if (existing && existing.registrationStatus !== 'cancelled') {
            return existing;
        }

        const program = getProgramByKey(input.programKey);
        const row = {
            user_id: input.userId,
            program_key: input.programKey,
            status: 'waitlisted',
            email: input.email ?? null,
            display_name: input.displayName ?? null,
            source: input.source ?? null,
            referral_code: input.referralCode ?? null,
            utm: toUtm(input),
            metadata: {
                ...(input.metadata ?? {}),
                program_slug: program?.slug,
            },
            updated_at: nowIso(),
        };

        const { data, error } = await supabase
            .from('program_registrations')
            .upsert(row, { onConflict: 'user_id,program_key' })
            .select('user_id,email,program_key,status,source,utm,updated_at')
            .single();

        if (error) throw error;
        return rowToProgramState(data);
    },

    async getRegistrationForProgram(userId, programKey) {
        const { data, error } = await supabase
            .from('program_registrations')
            .select('user_id,email,program_key,status,source,utm,updated_at')
            .eq('user_id', userId)
            .eq('program_key', programKey)
            .maybeSingle();

        if (error) throw error;
        return data ? rowToProgramState(data) : null;
    },

    async adminListRegistrations(filters = {}) {
        let query = supabase
            .from('program_registrations')
            .select('user_id,email,program_key,status,source,utm,updated_at')
            .order('updated_at', { ascending: false });

        if (filters.programKey) query = query.eq('program_key', filters.programKey);
        if (filters.status) query = query.eq('status', filters.status);
        if (filters.email) query = query.ilike('email', `%${filters.email}%`);
        if (filters.source) query = query.eq('source', filters.source);

        const { data, error } = await query;
        if (error) throw error;
        return (data ?? []).map(rowToProgramState);
    },

    async adminUpdateRegistrationStatus(input) {
        const { data, error } = await supabase
            .from('program_registrations')
            .update({
                status: input.status,
                updated_at: nowIso(),
                invited_at: input.status === 'invited' ? nowIso() : undefined,
                enrolled_at: input.status === 'enrolled' ? nowIso() : undefined,
                cancelled_at: input.status === 'cancelled' ? nowIso() : undefined,
            })
            .eq('user_id', input.userId)
            .eq('program_key', input.programKey)
            .select('user_id,email,program_key,status,source,utm,updated_at')
            .single();

        if (error) throw error;

        return {
            ...rowToProgramState(data),
            accessLevel: inferAccessLevelFromRegistration(input.status),
        };
    },

    async adminGrantProgramAccess(input) {
        const { error } = await supabase.from('program_access_grants').upsert({
            user_id: input.userId,
            program_key: input.programKey,
            access_level: input.accessLevel,
            granted_by: input.grantedBy ?? null,
            reason: input.reason ?? null,
            expires_at: input.expiresAt ?? null,
            updated_at: nowIso(),
        }, { onConflict: 'user_id,program_key' });

        if (error) throw error;

        return {
            userId: input.userId,
            programKey: input.programKey,
            registrationStatus: input.accessLevel === 'enrolled' || input.accessLevel === 'facilitator' ? 'enrolled' : 'waitlisted',
            accessLevel: input.accessLevel,
            progressPercent: 0,
            lastActivityAt: nowIso(),
        };
    },

    async getUserProgramProgress(userId, programKey) {
        const { data, error } = await supabase
            .from('program_user_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('program_key', programKey);

        if (error) throw error;
        return (data ?? []).map(rowToProgramProgress);
    },

    async updateProgramProgress(input) {
        const row = {
            user_id: input.userId,
            program_key: input.programKey,
            module_key: input.moduleKey ?? null,
            lesson_key: input.lessonKey ?? null,
            progress_percent: input.progressPercent ?? 0,
            status: input.status ?? 'started',
            last_activity_at: nowIso(),
            metadata: input.metadata ?? {},
            updated_at: nowIso(),
        };

        const { data, error } = await supabase
            .from('program_user_progress')
            .upsert(row, { onConflict: 'user_id,program_key,module_key,lesson_key' })
            .select('*')
            .single();

        if (error) throw error;
        return rowToProgramProgress(data);
    },

    async markLessonStarted(input) {
        return this.updateProgramProgress({ ...input, status: 'started', progressPercent: input.progressPercent ?? 1 });
    },

    async markLessonCompleted(input) {
        return this.updateProgramProgress({ ...input, status: 'completed', progressPercent: 100 });
    },
});

export const isProgramSupabaseAdapterConfigured = () => (
    import.meta.env.VITE_PROGRAM_REGISTRATION_ADAPTER === 'supabase'
    && Boolean(import.meta.env.VITE_SUPABASE_URL)
    && Boolean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_KEY)
);

export const createProgramRegistrationAdapter = (): ProgramRegistrationAdapter => (
    isProgramSupabaseAdapterConfigured()
        ? createSupabaseProgramRegistrationAdapter()
        : createMockProgramRegistrationAdapter()
);

export const programRegistrationAdapter = createProgramRegistrationAdapter();
