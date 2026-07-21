import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    bucketOverrides,
    fetchOverridesForModule,
    fetchPublishedQuizOverride,
    type ContentOverride,
    type ModuleOverrideBuckets,
} from '../services/contentOverrides';
import { useAdmin } from '../contexts/AdminContext';

const EVENT = 'zen:content-overrides-changed';

export function notifyContentOverridesChanged() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT));
    }
}

interface UseContentOverridesResult {
    rows: ContentOverride[];
    visibleRows: ContentOverride[];
    buckets: ModuleOverrideBuckets;
    loading: boolean;
    isAdmin: boolean;
    refresh: () => Promise<void>;
}

/**
 * Fetch content overrides for a specific program+module.
 * - Students see only published rows.
 * - Admins see all rows (drafts are visually tagged elsewhere).
 * - If the table is empty or the request fails, buckets are empty and
 *   the module renders exactly as before.
 */
export function useContentOverrides(programId: string, moduleId: string): UseContentOverridesResult {
    const { isAdminAuthenticated } = useAdmin();
    const [rows, setRows] = useState<ContentOverride[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        const data = await fetchOverridesForModule(programId, moduleId);
        setRows(data);
        setLoading(false);
    }, [programId, moduleId]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    useEffect(() => {
        const handler = () => { void refresh(); };
        window.addEventListener(EVENT, handler);
        return () => window.removeEventListener(EVENT, handler);
    }, [refresh]);

    const visibleRows = useMemo(
        () => (isAdminAuthenticated ? rows : rows.filter((r) => r.is_published)),
        [rows, isAdminAuthenticated],
    );

    const buckets = useMemo(() => bucketOverrides(visibleRows), [visibleRows]);

    return { rows, visibleRows, buckets, loading, isAdmin: isAdminAuthenticated, refresh };
}

export interface PublishedQuizOverrideState {
    override: ContentOverride | null;
    loading: boolean;
    error: boolean;
}

export function usePublishedQuizOverride(quizId: string, enabled = true): PublishedQuizOverrideState {
    const [override, setOverride] = useState<ContentOverride | null>(null);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState(false);

    const refresh = useCallback(async () => {
        if (!enabled || !quizId) {
            setOverride(null);
            setLoading(false);
            setError(false);
            return;
        }
        setLoading(true);
        setError(false);
        try {
            setOverride(await fetchPublishedQuizOverride(quizId));
        } catch {
            setOverride(null);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [enabled, quizId]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    useEffect(() => {
        if (!enabled) return undefined;
        const handler = () => { void refresh(); };
        window.addEventListener(EVENT, handler);
        return () => window.removeEventListener(EVENT, handler);
    }, [enabled, refresh]);

    return { override, loading, error };
}
