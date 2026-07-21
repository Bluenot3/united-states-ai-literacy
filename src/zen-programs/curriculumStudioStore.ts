// Curriculum Studio override store.
// Admin-authored blocks are layered on top of the shipped curriculum data so
// admins can extend any program section (or add whole new sections) without
// touching code. Browser storage is retained as an offline draft/backup; the
// published source of truth is synchronized through Supabase.
import type { ProgramContentItem, ProgramCurriculum, ProgramSection } from './types';

export interface StudioBlock {
    id: string;
    item: ProgramContentItem;
}

export interface StudioCustomSection {
    id: string;
    title: string;
    icon?: string;
}

export interface ProgramStudioOverride {
    sectionBlocks: Record<string, StudioBlock[]>;
    customSections: StudioCustomSection[];
    sectionModes: Record<string, 'append' | 'replace'>;
    sectionTitles: Record<string, string>;
}

export type StudioState = Record<string, ProgramStudioOverride>;

const STORAGE_KEY = 'zenCurriculumStudio.v1';
export const CURRICULUM_STUDIO_EVENT = 'zen-curriculum-studio-updated';

export const createStudioId = (prefix = 'blk') =>
    `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const emptyProgramOverride = (): ProgramStudioOverride => ({
    sectionBlocks: {},
    customSections: [],
    sectionModes: {},
    sectionTitles: {},
});

export function loadStudioState(): StudioState {
    if (typeof window === 'undefined') return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw) as unknown;
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
        return parsed as StudioState;
    } catch {
        return {};
    }
}

export function saveStudioState(state: StudioState): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(CURRICULUM_STUDIO_EVENT));
}

export function getProgramOverride(state: StudioState, programId: string): ProgramStudioOverride {
    const override = state[programId];
    if (!override) return emptyProgramOverride();
    return {
        sectionBlocks: override.sectionBlocks ?? {},
        customSections: override.customSections ?? [],
        sectionModes: override.sectionModes ?? {},
        sectionTitles: override.sectionTitles ?? {},
    };
}

export function exportStudioJson(): string {
    return JSON.stringify(loadStudioState(), null, 2);
}

export function importStudioJson(json: string): StudioState {
    const parsed = JSON.parse(json) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Invalid Curriculum Studio backup file.');
    }
    const state = parsed as StudioState;
    saveStudioState(state);
    return state;
}

export function resetProgramOverride(programId: string): StudioState {
    const state = loadStudioState();
    delete state[programId];
    saveStudioState(state);
    return state;
}

const applyToSections = (
    sections: ProgramSection[],
    override: ProgramStudioOverride,
): ProgramSection[] =>
    sections.map((section) => {
        const authoredItems = (override.sectionBlocks[section.id] ?? []).map((block) => block.item);
        const replaceBaseline = override.sectionModes[section.id] === 'replace';

        return {
            ...section,
            title: override.sectionTitles[section.id]?.trim() || section.title,
            content: replaceBaseline
                ? authoredItems
                : authoredItems.length
                    ? [...section.content, ...authoredItems]
                    : section.content,
            subSections: section.subSections ? applyToSections(section.subSections, override) : section.subSections,
        };
    });

export function applyProgramStudioOverride(
    curriculum: ProgramCurriculum,
    override: ProgramStudioOverride,
): ProgramCurriculum {
    const hasSectionBlocks = Object.values(override.sectionBlocks).some((blocks) => blocks?.length > 0);
    const hasSectionChanges = Object.keys(override.sectionModes).length > 0
        || Object.keys(override.sectionTitles).length > 0;

    if (!hasSectionBlocks && !hasSectionChanges && override.customSections.length === 0) {
        return curriculum;
    }

    const sections = applyToSections(curriculum.sections, override);
    const customSections: ProgramSection[] = override.customSections.map((custom) => ({
        id: custom.id,
        title: custom.title || 'Untitled section',
        icon: custom.icon || '🧩',
        content: (override.sectionBlocks[custom.id] ?? []).map((block) => block.item),
    }));

    return { ...curriculum, sections: [...sections, ...customSections] };
}

export function applyStudioOverrides(programId: string, curriculum: ProgramCurriculum): ProgramCurriculum {
    return applyProgramStudioOverride(curriculum, getProgramOverride(loadStudioState(), programId));
}
