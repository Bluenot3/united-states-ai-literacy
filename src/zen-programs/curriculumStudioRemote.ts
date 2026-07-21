import {
    upsertOverride,
    type ContentOverride,
} from '../services/contentOverrides';
import { supabase } from '../lib/supabase';
import { emptyProgramOverride, type ProgramStudioOverride } from './curriculumStudioStore';

const STUDIO_MODULE_ID = '__curriculum_studio__';
const DRAFT_SECTION_ID = '__draft__';
const PUBLISHED_SECTION_ID = '__published__';
const DOCUMENT_KIND = 'curriculum_studio_document';

type StudioStage = 'draft' | 'published';

const sectionIdForStage = (stage: StudioStage) => (
    stage === 'published' ? PUBLISHED_SECTION_ID : DRAFT_SECTION_ID
);

const isOverride = (value: unknown): value is ProgramStudioOverride => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const candidate = value as ProgramStudioOverride;
    return Boolean(candidate.sectionBlocks && typeof candidate.sectionBlocks === 'object')
        && Array.isArray(candidate.customSections);
};

const documentFromRow = (row: ContentOverride | undefined): ProgramStudioOverride | null => {
    if (!row || row.payload?.kind !== DOCUMENT_KIND) return null;
    const document = row.payload.document;
    if (!isOverride(document)) return null;

    return {
        sectionBlocks: document.sectionBlocks ?? {},
        customSections: document.customSections ?? [],
        sectionModes: document.sectionModes ?? {},
        sectionTitles: document.sectionTitles ?? {},
    };
};

const fetchRows = async (programId: string): Promise<ContentOverride[]> => {
    const { data, error } = await supabase
        .from('content_overrides')
        .select('*')
        .eq('program_id', programId)
        .eq('module_id', STUDIO_MODULE_ID)
        .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data ?? []) as ContentOverride[];
};

export const loadCurriculumStudioDraft = async (programId: string): Promise<ProgramStudioOverride | null> => {
    const rows = await fetchRows(programId);
    const draft = documentFromRow(rows.find((row) => row.section_id === DRAFT_SECTION_ID));
    if (draft) return draft;
    return documentFromRow(rows.find((row) => row.section_id === PUBLISHED_SECTION_ID && row.is_published));
};

export const loadPublishedCurriculumStudio = async (programId: string): Promise<ProgramStudioOverride | null> => {
    const rows = await fetchRows(programId);
    return documentFromRow(rows.find((row) => row.section_id === PUBLISHED_SECTION_ID && row.is_published));
};

const saveDocument = async (
    programId: string,
    document: ProgramStudioOverride,
    stage: StudioStage,
): Promise<ContentOverride> => {
    const rows = await fetchRows(programId);
    const sectionId = sectionIdForStage(stage);
    const existing = rows.find((row) => row.section_id === sectionId);
    const saved = await upsertOverride({
        id: existing?.id,
        program_id: programId,
        module_id: STUDIO_MODULE_ID,
        section_id: sectionId,
        position: 'append_module',
        block_type: 'rich_text',
        payload: {
            kind: DOCUMENT_KIND,
            schemaVersion: 1,
            document: document ?? emptyProgramOverride(),
        },
        sort_order: stage === 'published' ? 0 : 1,
        is_published: stage === 'published',
    });

    if (!saved) throw new Error(`Unable to save Curriculum Studio ${stage} document.`);
    return saved;
};

export const saveCurriculumStudioDraft = (
    programId: string,
    document: ProgramStudioOverride,
) => saveDocument(programId, document, 'draft');

export const publishCurriculumStudio = async (
    programId: string,
    document: ProgramStudioOverride,
): Promise<ContentOverride> => {
    await saveDocument(programId, document, 'draft');
    return saveDocument(programId, document, 'published');
};
