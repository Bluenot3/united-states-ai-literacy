import type { ProgramProgressRecord } from './programRegistrationAdapter';
import type { ProgramProgress } from './types';

export const PROGRAM_PROGRESS_MODULE_KEY = '__program__';
export const PROGRAM_PROGRESS_LESSON_KEY = '__aggregate__';

const stringArray = (value: unknown): string[] => (
    Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : []
);

const stringRecord = (value: unknown): Record<string, string> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

    return Object.fromEntries(
        Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
    );
};

const nullableString = (value: unknown): string | null => (typeof value === 'string' ? value : null);

const timestamp = (value: string | null | undefined): number => {
    if (!value) return 0;
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

export const progressFromRecord = (record: ProgramProgressRecord | undefined): ProgramProgress | null => {
    if (!record) return null;
    const root = record.metadata?.progress;
    const value = root && typeof root === 'object' && !Array.isArray(root)
        ? root as Record<string, unknown>
        : record.metadata ?? {};

    return {
        completedSections: stringArray(value.completedSections),
        completedLabs: stringArray(value.completedLabs),
        exploredResources: stringArray(value.exploredResources),
        reflections: stringRecord(value.reflections),
        lastViewedSection: nullableString(value.lastViewedSection) ?? '',
        startedAt: nullableString(value.startedAt),
        lastActiveAt: nullableString(value.lastActiveAt) ?? record.lastActivityAt ?? null,
    };
};

export const findAggregateProgressRecord = (records: ProgramProgressRecord[]) => (
    records.find((record) => (
        record.moduleKey === PROGRAM_PROGRESS_MODULE_KEY
        && record.lessonKey === PROGRAM_PROGRESS_LESSON_KEY
    ))
);

export const mergeProgramProgress = (local: ProgramProgress, remote: ProgramProgress | null): ProgramProgress => {
    if (!remote) return local;

    const localIsNewest = timestamp(local.lastActiveAt) >= timestamp(remote.lastActiveAt);
    const startedCandidates = [local.startedAt, remote.startedAt]
        .filter((value): value is string => Boolean(value))
        .sort((a, b) => timestamp(a) - timestamp(b));

    return {
        completedSections: [...new Set([...(remote.completedSections ?? []), ...(local.completedSections ?? [])])],
        completedLabs: [...new Set([...(remote.completedLabs ?? []), ...(local.completedLabs ?? [])])],
        exploredResources: [...new Set([...(remote.exploredResources ?? []), ...(local.exploredResources ?? [])])],
        reflections: localIsNewest
            ? { ...(remote.reflections ?? {}), ...(local.reflections ?? {}) }
            : { ...(local.reflections ?? {}), ...(remote.reflections ?? {}) },
        lastViewedSection: localIsNewest
            ? local.lastViewedSection || remote.lastViewedSection
            : remote.lastViewedSection || local.lastViewedSection,
        startedAt: startedCandidates[0] ?? null,
        lastActiveAt: localIsNewest ? local.lastActiveAt ?? remote.lastActiveAt : remote.lastActiveAt ?? local.lastActiveAt,
    };
};

export const progressMetadata = (progress: ProgramProgress): Record<string, unknown> => ({
    schemaVersion: 1,
    progress: {
        completedSections: progress.completedSections,
        completedLabs: progress.completedLabs ?? [],
        exploredResources: progress.exploredResources ?? [],
        reflections: progress.reflections ?? {},
        lastViewedSection: progress.lastViewedSection,
        startedAt: progress.startedAt,
        lastActiveAt: progress.lastActiveAt ?? null,
    },
});
