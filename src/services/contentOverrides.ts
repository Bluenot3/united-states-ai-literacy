// Admin Content Overlay — CMS layer for Pioneer module pages.
// Additive: if the table is empty (or Supabase isn't reachable), all reads
// return [] and every page renders exactly as before.
import { supabase } from '../lib/supabase';

export type OverridePosition = 'before' | 'after' | 'replace' | 'hide' | 'append_module';
export type OverrideBlockType =
    | 'rich_text'
    | 'embed_url'
    | 'video'
    | 'image'
    | 'html'
    | 'link_card'
    | 'divider';

export interface ContentOverride {
    id: string;
    program_id: string;
    module_id: string;
    section_id: string | null;
    position: OverridePosition;
    block_type: OverrideBlockType;
    payload: Record<string, any>;
    sort_order: number;
    is_published: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export type ContentOverrideDraft = Omit<
    ContentOverride,
    'id' | 'created_at' | 'updated_at' | 'created_by'
> & { id?: string };

const TABLE = 'content_overrides';

export async function fetchOverridesForModule(
    programId: string,
    moduleId: string,
): Promise<ContentOverride[]> {
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .eq('program_id', programId)
            .eq('module_id', moduleId)
            .order('sort_order', { ascending: true });
        if (error) {
            if (import.meta.env.DEV) console.warn('[content-overrides] fetch error', error.message);
            return [];
        }
        return (data ?? []) as ContentOverride[];
    } catch (err) {
        if (import.meta.env.DEV) console.warn('[content-overrides] fetch threw', err);
        return [];
    }
}

export async function fetchAllOverrides(): Promise<ContentOverride[]> {
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .order('program_id', { ascending: true })
            .order('module_id', { ascending: true })
            .order('sort_order', { ascending: true });
        if (error) {
            if (import.meta.env.DEV) console.warn('[content-overrides] fetchAll error', error.message);
            return [];
        }
        return (data ?? []) as ContentOverride[];
    } catch (err) {
        if (import.meta.env.DEV) console.warn('[content-overrides] fetchAll threw', err);
        return [];
    }
}

export async function upsertOverride(draft: ContentOverrideDraft): Promise<ContentOverride | null> {
    const row = {
        ...(draft.id ? { id: draft.id } : {}),
        program_id: draft.program_id,
        module_id: draft.module_id,
        section_id: draft.section_id,
        position: draft.position,
        block_type: draft.block_type,
        payload: draft.payload ?? {},
        sort_order: draft.sort_order ?? 0,
        is_published: draft.is_published ?? false,
    };
    const { data, error } = await supabase
        .from(TABLE)
        .upsert(row)
        .select()
        .maybeSingle();
    if (error) {
        console.error('[content-overrides] upsert failed', error);
        return null;
    }
    return data as ContentOverride;
}

export async function deleteOverride(id: string): Promise<boolean> {
    const { error } = await supabase.from(TABLE).delete().eq('id', id);
    if (error) {
        console.error('[content-overrides] delete failed', error);
        return false;
    }
    return true;
}

export async function setPublished(id: string, isPublished: boolean): Promise<boolean> {
    const { error } = await supabase.from(TABLE).update({ is_published: isPublished }).eq('id', id);
    if (error) {
        console.error('[content-overrides] publish toggle failed', error);
        return false;
    }
    return true;
}

// Grouping helpers used by the renderer -----------------------------------
export interface ModuleOverrideBuckets {
    // section_id -> position -> ContentOverride[]
    bySection: Map<string, Partial<Record<OverridePosition, ContentOverride[]>>>;
    // rows with position === 'append_module'
    appendedSections: ContentOverride[];
    // rows with section_id == null and no matching section (module-level ambient)
    moduleLevel: ContentOverride[];
}

export function bucketOverrides(rows: ContentOverride[]): ModuleOverrideBuckets {
    const bySection = new Map<string, Partial<Record<OverridePosition, ContentOverride[]>>>();
    const appendedSections: ContentOverride[] = [];
    const moduleLevel: ContentOverride[] = [];
    for (const row of rows) {
        if (row.position === 'append_module') {
            appendedSections.push(row);
            continue;
        }
        if (!row.section_id) {
            moduleLevel.push(row);
            continue;
        }
        const entry = bySection.get(row.section_id) ?? {};
        const list = entry[row.position] ?? [];
        list.push(row);
        entry[row.position] = list;
        bySection.set(row.section_id, entry);
    }
    // sort each bucket by sort_order
    for (const entry of bySection.values()) {
        for (const key of Object.keys(entry) as OverridePosition[]) {
            entry[key]!.sort((a, b) => a.sort_order - b.sort_order);
        }
    }
    appendedSections.sort((a, b) => a.sort_order - b.sort_order);
    return { bySection, appendedSections, moduleLevel };
}
