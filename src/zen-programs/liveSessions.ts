import { supabase } from '../lib/supabase';
import type { ProgramKey } from './programIntegrationContract';

export type LiveSessionStatus = 'scheduled' | 'cancelled' | 'completed';

export interface ProgramLiveSession {
    id: string;
    programKey: ProgramKey;
    title: string;
    description: string | null;
    startsAt: string;
    endsAt: string;
    timezone: string;
    meetingUrl: string | null;
    capacity: number | null;
    registeredCount: number;
    status: LiveSessionStatus;
    isRegistered: boolean;
    registrationOpen: boolean;
}

export interface AdminLiveSessionInput {
    id?: string;
    programKey: ProgramKey;
    title: string;
    description?: string | null;
    startsAt: string;
    endsAt: string;
    timezone: string;
    meetingUrl?: string | null;
    capacity?: number | null;
    status?: LiveSessionStatus;
}

const toSession = (row: Record<string, unknown>): ProgramLiveSession => ({
    id: String(row.id),
    programKey: row.program_key as ProgramKey,
    title: String(row.title),
    description: row.description ? String(row.description) : null,
    startsAt: String(row.starts_at),
    endsAt: String(row.ends_at),
    timezone: String(row.timezone || 'UTC'),
    meetingUrl: row.meeting_url ? String(row.meeting_url) : null,
    capacity: row.capacity == null ? null : Number(row.capacity),
    registeredCount: Number(row.registered_count ?? 0),
    status: row.status as LiveSessionStatus,
    isRegistered: row.is_registered === true,
    registrationOpen: row.registration_open == null
        ? row.status === 'scheduled' && Date.parse(String(row.starts_at)) > Date.now()
        : row.registration_open === true,
});

export const listProgramLiveSessions = async (programKey: ProgramKey): Promise<ProgramLiveSession[]> => {
    const { data, error } = await supabase.rpc('list_program_live_sessions', {
        _program_key: programKey,
    });
    if (error) throw error;
    return (data ?? []).map((row: Record<string, unknown>) => toSession(row));
};

export const registerForLiveSession = async (sessionId: string): Promise<void> => {
    const { error } = await supabase.rpc('register_for_live_session', { _session_id: sessionId });
    if (error) throw error;
};

export const cancelLiveSessionRegistration = async (sessionId: string): Promise<void> => {
    const { error } = await supabase.rpc('cancel_live_session_registration', { _session_id: sessionId });
    if (error) throw error;
};

export const adminListLiveSessions = async (): Promise<ProgramLiveSession[]> => {
    const [{ data: sessions, error }, { data: registrations, error: registrationsError }] = await Promise.all([
        supabase.from('program_live_sessions').select('*').order('starts_at', { ascending: true }),
        supabase.from('program_live_session_registrations').select('session_id,status'),
    ]);
    if (error) throw error;
    if (registrationsError) throw registrationsError;

    const counts = new Map<string, number>();
    (registrations ?? []).forEach((registration) => {
        if (registration.status !== 'registered' && registration.status !== 'attended') return;
        counts.set(registration.session_id, (counts.get(registration.session_id) ?? 0) + 1);
    });

    return (sessions ?? []).map((row) => toSession({
        ...row,
        registered_count: counts.get(row.id) ?? 0,
        is_registered: false,
    }));
};

export const adminSaveLiveSession = async (input: AdminLiveSessionInput): Promise<void> => {
    const row = {
        ...(input.id ? { id: input.id } : {}),
        program_key: input.programKey,
        title: input.title,
        description: input.description ?? null,
        starts_at: input.startsAt,
        ends_at: input.endsAt,
        timezone: input.timezone,
        meeting_url: input.meetingUrl ?? null,
        capacity: input.capacity ?? null,
        status: input.status ?? 'scheduled',
        updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('program_live_sessions').upsert(row);
    if (error) throw error;
};
