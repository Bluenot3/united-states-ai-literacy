import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { programManifests } from './programsRegistry';
import type {
    ArsenalReadyStatus,
    ProgramAvailabilityConfig,
    ProgramAvailabilityStatus,
    ProgramDashboardCard,
    ProgramManifest,
} from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const ADMIN_TOKEN_KEY = 'zenBillingAdminToken';

export interface ProgramPublishSetting {
    programId: string;
    availabilityStatus: ProgramAvailabilityStatus;
    published: boolean;
    adminPreviewEnabled: boolean;
    publicLabel: string | null;
    adminLabel: string | null;
    arsenalReadyStatus: ArsenalReadyStatus;
    arsenalMergeNotes: string;
    updatedBy: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    metadata: Record<string, unknown>;
}

export interface ProgramPublishUpdate {
    availabilityStatus: ProgramAvailabilityStatus;
    published: boolean;
    adminPreviewEnabled: boolean;
    publicLabel: string;
    adminLabel: string;
    arsenalReadyStatus: ArsenalReadyStatus;
    arsenalMergeNotes: string;
    metadata?: Record<string, unknown>;
}

interface ServerProgramPublishSetting {
    programId?: string;
    program_id?: string;
    availabilityStatus?: ProgramAvailabilityStatus;
    availability_status?: ProgramAvailabilityStatus;
    published?: boolean;
    adminPreviewEnabled?: boolean;
    admin_preview_enabled?: boolean;
    publicLabel?: string | null;
    public_label?: string | null;
    adminLabel?: string | null;
    admin_label?: string | null;
    arsenalReadyStatus?: ArsenalReadyStatus;
    arsenal_ready_status?: ArsenalReadyStatus;
    arsenalMergeNotes?: string | null;
    arsenal_merge_notes?: string | null;
    updatedBy?: string | null;
    updated_by?: string | null;
    createdAt?: string | null;
    created_at?: string | null;
    updatedAt?: string | null;
    updated_at?: string | null;
    metadata?: Record<string, unknown>;
}

interface ProgramPublishSettingsResponse {
    settings?: ServerProgramPublishSetting[];
    fallback?: boolean;
    error?: string;
}

interface ProgramPublishUpdateResponse {
    setting?: ServerProgramPublishSetting;
    error?: string;
}

const mapServerSetting = (setting: ServerProgramPublishSetting): ProgramPublishSetting | null => {
    const programId = setting.programId ?? setting.program_id;
    const availabilityStatus = setting.availabilityStatus ?? setting.availability_status;
    const arsenalReadyStatus = setting.arsenalReadyStatus ?? setting.arsenal_ready_status;

    if (!programId || !availabilityStatus || !arsenalReadyStatus) {
        return null;
    }

    return {
        programId,
        availabilityStatus,
        published: setting.published === true,
        adminPreviewEnabled: (setting.adminPreviewEnabled ?? setting.admin_preview_enabled) === true,
        publicLabel: setting.publicLabel ?? setting.public_label ?? null,
        adminLabel: setting.adminLabel ?? setting.admin_label ?? null,
        arsenalReadyStatus,
        arsenalMergeNotes: setting.arsenalMergeNotes ?? setting.arsenal_merge_notes ?? '',
        updatedBy: setting.updatedBy ?? setting.updated_by ?? null,
        createdAt: setting.createdAt ?? setting.created_at ?? null,
        updatedAt: setting.updatedAt ?? setting.updated_at ?? null,
        metadata: setting.metadata ?? {},
    };
};

const splitMergeNotes = (notes: string): string[] => (
    notes
        .split(/\r?\n/)
        .map((note) => note.trim())
        .filter(Boolean)
);

export const mergeProgramPublishSetting = (
    program: ProgramManifest,
    setting: ProgramPublishSetting | undefined,
): ProgramManifest => {
    if (!setting) {
        return program;
    }

    const availability: ProgramAvailabilityConfig = {
        ...program.availability,
        availabilityStatus: setting.availabilityStatus,
        published: setting.published,
        adminPreviewEnabled: setting.adminPreviewEnabled,
        publicLabel: setting.publicLabel || program.availability.publicLabel,
        adminLabel: setting.adminLabel || program.availability.adminLabel,
        publishControlsEnabled: true,
        arsenalReadyStatus: setting.arsenalReadyStatus,
        arsenalMergeNotes: splitMergeNotes(setting.arsenalMergeNotes).length > 0
            ? splitMergeNotes(setting.arsenalMergeNotes)
            : program.availability.arsenalMergeNotes,
    };

    const dashboardCard: ProgramDashboardCard = {
        ...program.dashboardCard,
        availability,
        arsenalReadiness: {
            ...program.dashboardCard.arsenalReadiness,
            publicAvailability: availability.publicLabel,
            mergeReadinessNotes: availability.arsenalMergeNotes,
        },
    };

    return {
        ...program,
        availability,
        dashboardCard,
        arsenalReadiness: {
            ...program.arsenalReadiness,
            publicAvailability: availability.publicLabel,
            mergeReadinessNotes: availability.arsenalMergeNotes,
        },
    };
};

const getAuthHeaders = async (): Promise<HeadersInit> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    // @ts-expect-error - Local Supabase auth type definitions lag the runtime client.
    const sessionResult = await supabase.auth.getSession();
    const token = sessionResult.data.session?.access_token;
    const adminToken = sessionStorage.getItem(ADMIN_TOKEN_KEY);

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (adminToken) {
        headers['x-admin-token'] = adminToken;
    }

    return headers;
};

export async function fetchProgramPublishSettings(admin = false): Promise<ProgramPublishSetting[]> {
    const headers = admin ? await getAuthHeaders() : undefined;
    const response = await fetch(`${API_BASE}${admin ? '/api/admin/program-publish-settings' : '/api/program-publish-settings'}`, {
        headers,
    });
    const data = await response.json() as ProgramPublishSettingsResponse;

    if (!response.ok) {
        throw new Error(data.error || 'Unable to load program publish settings.');
    }

    return (data.settings ?? [])
        .map(mapServerSetting)
        .filter((setting): setting is ProgramPublishSetting => Boolean(setting));
}

export async function updateProgramPublishSetting(
    programId: string,
    update: ProgramPublishUpdate,
): Promise<ProgramPublishSetting> {
    const response = await fetch(`${API_BASE}/api/admin/program-publish-settings/${encodeURIComponent(programId)}`, {
        method: 'PATCH',
        headers: await getAuthHeaders(),
        body: JSON.stringify({
            availability_status: update.availabilityStatus,
            published: update.published,
            admin_preview_enabled: update.adminPreviewEnabled,
            public_label: update.publicLabel,
            admin_label: update.adminLabel,
            arsenal_ready_status: update.arsenalReadyStatus,
            arsenal_merge_notes: update.arsenalMergeNotes,
            metadata: update.metadata ?? { source: 'admin-settings' },
        }),
    });
    const data = await response.json() as ProgramPublishUpdateResponse;

    if (!response.ok || !data.setting) {
        throw new Error(data.error || 'Unable to update program publish settings.');
    }

    const mappedSetting = mapServerSetting(data.setting);

    if (!mappedSetting) {
        throw new Error('Program publish settings update returned an invalid setting.');
    }

    return mappedSetting;
}

export function useProgramPublishSettings(admin = false) {
    const [settings, setSettings] = useState<ProgramPublishSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            setSettings(await fetchProgramPublishSettings(admin));
        } catch (requestError) {
            console.warn('Falling back to registry program publish metadata:', requestError);
            setSettings([]);
            setError(requestError instanceof Error ? requestError.message : 'Unable to load program publish settings.');
        } finally {
            setLoading(false);
        }
    }, [admin]);

    useEffect(() => {
        void reload();
    }, [reload]);

    const settingsByProgramId = useMemo(() => (
        new Map(settings.map((setting) => [setting.programId, setting]))
    ), [settings]);

    const mergedProgramManifests = useMemo(() => (
        programManifests.map((program) => mergeProgramPublishSetting(program, settingsByProgramId.get(program.programId)))
    ), [settingsByProgramId]);

    const getProgramManifestById = useCallback((id: string): ProgramManifest | undefined => (
        mergedProgramManifests.find((program) => (
            program.programId === id || program.slug === id || program.legacyIds?.includes(id)
        ))
    ), [mergedProgramManifests]);

    return {
        settings,
        settingsByProgramId,
        programManifests: mergedProgramManifests,
        programDashboardCards: mergedProgramManifests.map((program) => program.dashboardCard),
        getProgramManifestById,
        loading,
        error,
        reload,
        usingRegistryFallback: settings.length === 0,
    };
}
