import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    bucketOverrides,
    fetchOverridesForModule,
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
