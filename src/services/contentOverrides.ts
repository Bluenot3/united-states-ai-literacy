// Admin Content Overlay — additive CMS layer for course module pages.
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
    | 'divider'
    | 'quiz';

export interface PublicQuizQuestion {
    question: string;
    options: string[];
    explanation?: string;
}

export interface PublicQuizPayload {
    quiz_id: string;
    questions: PublicQuizQuestion[];
    passing_percent?: number;
}

export const SHIPPED_VANGUARD_QUIZ_IDS = new Set([
    'quiz-1-1',
    'quiz-1-2',
    'quiz-1-exit',
    'quiz-2-1',
    'quiz-2-2',
    'quiz-3-1',
    'quiz-3-2',
    'quiz-4-1',
    'quiz-4-2',
]);

export function isShippedVanguardQuizId(quizId: string): boolean {
    return SHIPPED_VANGUARD_QUIZ_IDS.has(quizId);
}

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

function cleanPublicQuizQuestion(value: unknown): PublicQuizQuestion | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const record = value as Record<string, unknown>;
    const question = typeof record.question === 'string' ? record.question.trim() : '';
    const options = Array.isArray(record.options)
        ? record.options
            .filter((option): option is string => typeof option === 'string')
            .map((option) => option.trim())
            .filter(Boolean)
        : [];
    if (!question || options.length < 2) return null;
    const explanation = typeof record.explanation === 'string'
        ? record.explanation.trim()
        : '';
    return explanation ? { question, options, explanation } : { question, options };
}

/**
 * Parse the learner-visible portion of a quiz override. This deliberately
 * ignores every property except prompts, options, explanations and threshold.
 */
export function parsePublicQuizPayload(payload: unknown): PublicQuizPayload | null {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
    const record = payload as Record<string, unknown>;
    const quizId = typeof record.quiz_id === 'string' ? record.quiz_id.trim() : '';
    if (!quizId || !Array.isArray(record.questions)) return null;

    const questions = record.questions
        .map(cleanPublicQuizQuestion)
        .filter((question): question is PublicQuizQuestion => Boolean(question));
    const passingPercent = Number(record.passing_percent);

    return {
        quiz_id: quizId,
        questions,
        ...(Number.isFinite(passingPercent) && passingPercent >= 1 && passingPercent <= 100
            ? { passing_percent: Math.round(passingPercent) }
            : {}),
    };
}

export function buildPublicQuizPayload(
    quizId: string,
    questions: PublicQuizQuestion[],
    passingPercent: number,
): PublicQuizPayload {
    return {
        quiz_id: quizId.trim(),
        questions: questions.map((question) => ({
            question: question.question.trim(),
            options: question.options.map((option) => option.trim()),
            ...(question.explanation?.trim() ? { explanation: question.explanation.trim() } : {}),
        })),
        passing_percent: Math.min(100, Math.max(1, Math.round(passingPercent))),
    };
}

export function quizCompletionKey(override: ContentOverride, quizId: string): string {
    return `${quizId}@${override.updated_at}`;
}

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

export async function fetchPublishedQuizOverride(quizId: string): Promise<ContentOverride | null> {
    if (!quizId) return null;
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .eq('program_id', 'vanguard')
            .eq('block_type', 'quiz')
            .eq('is_published', true)
            .contains('payload', { quiz_id: quizId })
            .limit(1)
            .maybeSingle();
        if (error) {
            throw error;
        }
        return data as ContentOverride | null;
    } catch (err) {
        if (import.meta.env.DEV) console.warn('[content-overrides] quiz fetch threw', err);
        throw err;
    }
}

export interface PublishVanguardQuizOverrideInput {
    id?: string;
    moduleId: string;
    sectionId: string | null;
    position: OverridePosition;
    sortOrder: number;
    quizId: string;
    questions: PublicQuizQuestion[];
    correctOptionIndexes: number[];
    passingPercent: number;
}

/**
 * Atomically publishes public quiz copy and its private scoring definition.
 * Correct option indexes are RPC inputs only and are never placed in the
 * content_overrides payload returned to learners.
 */
export async function publishVanguardQuizOverride(
    input: PublishVanguardQuizOverrideInput,
): Promise<ContentOverride | null> {
    const { data, error } = await supabase
        .rpc('publish_vanguard_quiz_override', {
            p_override_id: input.id ?? null,
            p_module_id: input.moduleId,
            p_section_id: input.sectionId,
            p_position: input.position,
            p_sort_order: input.sortOrder,
            p_quiz_id: input.quizId,
            p_questions: input.questions,
            p_correct_option_indexes: input.correctOptionIndexes,
            p_passing_percent: input.passingPercent,
        })
        .maybeSingle();
    if (error) {
        console.error('[content-overrides] quiz publish failed', error);
        return null;
    }
    return data as ContentOverride | null;
}

export async function removeVanguardQuizOverride(id: string): Promise<boolean> {
    const { error } = await supabase.rpc('remove_vanguard_quiz_override', {
        p_override_id: id,
    });
    if (error) {
        console.error('[content-overrides] quiz remove failed', error);
        return false;
    }
    return true;
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
