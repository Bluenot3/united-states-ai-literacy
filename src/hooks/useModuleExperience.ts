import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { useAuth } from './useAuth';
import {
    isShippedVanguardQuizId,
    parsePublicQuizPayload,
    quizCompletionKey,
    type ContentOverride,
} from '../services/contentOverrides';

type TrackableSection = {
    id: string;
    title: string;
    content?: unknown;
    subSections?: TrackableSection[];
};

type TrackableContentBlock = {
    component?: string;
    interactiveId?: string;
};

interface UseModuleExperienceOptions<TSection extends TrackableSection> {
    moduleId: 1 | 2 | 3 | 4;
    sections: TSection[];
    initialSectionId?: string;
    sectionRefs?: MutableRefObject<Record<string, HTMLElement | null>>;
    publishedOverrides?: ContentOverride[];
}

const OBSERVER_DELAY_MS = 120;

export const useModuleExperience = <TSection extends TrackableSection>({
    moduleId,
    sections,
    initialSectionId = 'overview',
    sectionRefs,
    publishedOverrides = [],
}: UseModuleExperienceOptions<TSection>) => {
    const {
        user,
        updateModuleProgress,
        addPoints,
        updateLastViewedSection,
        getModuleProgress,
        isAdmin,
    } = useAuth();

    const initialModuleProgress = getModuleProgress(moduleId);
    const initialTrackedSection = initialModuleProgress.lastViewedSection || initialSectionId;

    const [activeSection, setActiveSection] = useState<string>(initialTrackedSection);
    const [visibleSections, setVisibleSections] = useState<Set<string>>(
        () => new Set([initialTrackedSection]),
    );
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [isModuleComplete, setIsModuleComplete] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    const hasInteracted = useRef(false);
    const isInitialIntersection = useRef(true);

    const moduleProgress = getModuleProgress(moduleId);
    const adminPreview = isAdmin;

    const sectionSuppression = useMemo(() => {
        const rowsBySection = new Map<string, ContentOverride[]>();
        publishedOverrides
            .filter((row) => row.is_published && row.section_id)
            .forEach((row) => {
                const rows = rowsBySection.get(row.section_id as string) ?? [];
                rows.push(row);
                rowsBySection.set(row.section_id as string, rows);
            });

        const directlyHidden = new Set<string>();
        const directlyReplaced = new Set<string>();
        rowsBySection.forEach((rows, sectionId) => {
            if (rows.some((row) => row.position === 'hide')) directlyHidden.add(sectionId);
            if (rows.some((row) => row.position === 'replace')) directlyReplaced.add(sectionId);
        });

        const hiddenForLearners = new Set<string>();
        const suppressedQuizSections = new Set<string>();
        const collect = (nestedSections: TSection[], ancestorSuppressed = false) => {
            nestedSections.forEach((section) => {
                const isDirectlyHidden = directlyHidden.has(section.id);
                const isDirectlyReplaced = directlyReplaced.has(section.id);
                const isHiddenForLearners = ancestorSuppressed || isDirectlyHidden;
                const isQuizSuppressed = ancestorSuppressed || isDirectlyHidden || isDirectlyReplaced;

                // A replacement stays visible at its attachment point, while
                // its original descendants and all attached quizzes do not.
                if (isHiddenForLearners) hiddenForLearners.add(section.id);
                if (isQuizSuppressed) suppressedQuizSections.add(section.id);
                if (section.subSections?.length) {
                    collect(section.subSections as TSection[], isQuizSuppressed);
                }
            });
        };
        collect(sections);
        return { hiddenForLearners, suppressedQuizSections };
    }, [publishedOverrides, sections]);
    const hiddenSectionIds = useMemo(
        () => adminPreview ? new Set<string>() : sectionSuppression.hiddenForLearners,
        [adminPreview, sectionSuppression.hiddenForLearners],
    );

    const flattenedSections = useMemo(() => {
        const allSections: (TSection & { parentTitle?: string })[] = [];

        const recurse = (nestedSections: TSection[], parentTitle?: string) => {
            nestedSections.forEach((section) => {
                if (hiddenSectionIds.has(section.id)) return;
                allSections.push({ ...section, parentTitle });

                if (section.subSections?.length) {
                    recurse(section.subSections as TSection[], section.title);
                }
            });
        };

        recurse(sections);

        return allSections;
    }, [hiddenSectionIds, sections]);

    const totalSections = flattenedSections.length;
    const curriculumSectionIds = useMemo(
        () => new Set(flattenedSections.map((section) => section.id)),
        [flattenedSections],
    );
    const completedSectionIds = useMemo(
        () => new Set(
            moduleProgress.completedSections.filter((sectionId) => curriculumSectionIds.has(sectionId)),
        ),
        [curriculumSectionIds, moduleProgress.completedSections],
    );
    const completedSectionCount = completedSectionIds.size;
    const firstIncompleteSectionIndex = flattenedSections.findIndex(
        (section) => !completedSectionIds.has(section.id),
    );
    const publishedQuizRows = useMemo(() => publishedOverrides.flatMap((row) => {
        if (!row.is_published || row.block_type !== 'quiz') return [];
        const quiz = parsePublicQuizPayload(row.payload);
        return quiz ? [{ row, quiz }] : [];
    }), [publishedOverrides]);
    const effectivePublishedQuizRows = useMemo(() => publishedQuizRows.filter(({ row }) => {
        if (row.position === 'append_module') return flattenedSections.length > 0;
        if (!row.section_id || !curriculumSectionIds.has(row.section_id)) return false;
        return !sectionSuppression.suppressedQuizSections.has(row.section_id);
    }), [curriculumSectionIds, flattenedSections.length, publishedQuizRows, sectionSuppression.suppressedQuizSections]);
    const publishedQuizCompletionIds = useMemo(
        () => effectivePublishedQuizRows.map(({ row, quiz }) => quizCompletionKey(row, quiz.quiz_id)),
        [effectivePublishedQuizRows],
    );
    const allPublishedQuizzesComplete = publishedQuizCompletionIds.every(
        (quizId) => moduleProgress.completedInteractives.includes(quizId),
    );
    const allSectionsComplete = totalSections > 0
        && firstIncompleteSectionIndex === -1
        && allPublishedQuizzesComplete;
    const unlockedSectionIds = useMemo(() => {
        if (adminPreview) {
            return new Set(flattenedSections.map((section) => section.id));
        }

        const lastUnlockedIndex = firstIncompleteSectionIndex === -1
            ? flattenedSections.length - 1
            : firstIncompleteSectionIndex;

        return new Set(
            flattenedSections
                .slice(0, Math.max(lastUnlockedIndex + 1, 0))
                .map((section) => section.id),
        );
    }, [adminPreview, firstIncompleteSectionIndex, flattenedSections]);

    useEffect(() => {
        if (!user || unlockedSectionIds.has(activeSection)) {
            return;
        }

        const fallbackSection = firstIncompleteSectionIndex >= 0
            ? flattenedSections[firstIncompleteSectionIndex]
            : flattenedSections.find((section) => unlockedSectionIds.has(section.id));
        if (!fallbackSection) {
            return;
        }

        setActiveSection(fallbackSection.id);
        setVisibleSections(new Set([fallbackSection.id]));
        updateLastViewedSection(moduleId, fallbackSection.id);
    }, [activeSection, firstIncompleteSectionIndex, flattenedSections, moduleId, unlockedSectionIds, updateLastViewedSection, user]);

    useEffect(() => {
        const handleInteraction = () => {
            hasInteracted.current = true;
        };

        window.addEventListener('pointerdown', handleInteraction, { passive: true });
        window.addEventListener('keydown', handleInteraction);
        window.addEventListener('wheel', handleInteraction, { passive: true });
        window.addEventListener('touchstart', handleInteraction, { passive: true });

        return () => {
            window.removeEventListener('pointerdown', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            window.removeEventListener('wheel', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setIsCommandPaletteOpen((previous) => !previous);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        setIsModuleComplete(Boolean(user && allSectionsComplete));
    }, [allSectionsComplete, user]);

    useEffect(() => {
        if (user && allSectionsComplete && !moduleProgress.certificateId) {
            setShowCompletionModal(true);
        }
    }, [allSectionsComplete, moduleProgress.certificateId, user]);

    useEffect(() => {
        if (!user) {
            return;
        }

        let observer: IntersectionObserver | null = null;
        let observedElements: HTMLElement[] = [];

        const markVisibleSection = (sectionId: string, shouldActivate: boolean) => {
            setVisibleSections((previous) => {
                if (previous.has(sectionId)) {
                    return previous;
                }

                const next = new Set(previous);
                next.add(sectionId);
                return next;
            });

            if (shouldActivate) {
                setActiveSection(sectionId);
                updateLastViewedSection(moduleId, sectionId);
            }

        };

        const setupTimer = window.setTimeout(() => {
            observer = new IntersectionObserver(
                (entries) => {
                    if (!hasInteracted.current) {
                        return;
                    }

                    const intersectingEntries = entries
                        .filter((entry) => entry.isIntersecting)
                        .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

                    if (intersectingEntries.length === 0) {
                        return;
                    }

                    if (isInitialIntersection.current) {
                        isInitialIntersection.current = false;
                    }

                    intersectingEntries.forEach((entry, index) => {
                        markVisibleSection(entry.target.id, index === 0);
                    });
                },
                {
                    rootMargin: '-12% 0px -62% 0px',
                    threshold: [0.15, 0.35, 0.55],
                },
            );

            observedElements = flattenedSections
                .filter((section) => unlockedSectionIds.has(section.id))
                .map((section) => sectionRefs?.current[section.id] ?? document.getElementById(section.id))
                .filter(Boolean) as HTMLElement[];

            observedElements.forEach((element) => observer?.observe(element));
        }, OBSERVER_DELAY_MS);

        return () => {
            window.clearTimeout(setupTimer);
            observedElements.forEach((element) => observer?.unobserve(element));
            observer?.disconnect();
        };
    }, [
        flattenedSections,
        moduleId,
        sectionRefs,
        unlockedSectionIds,
        updateLastViewedSection,
        user,
    ]);

    const activeSectionRecord = flattenedSections.find((section) => section.id === activeSection);
    const requiredQuizIds = useMemo(() => {
        const originalSuppressed = sectionSuppression.suppressedQuizSections.has(activeSection);
        const originalQuizIds = !originalSuppressed && Array.isArray(activeSectionRecord?.content)
            ? (activeSectionRecord.content as TrackableContentBlock[])
                .filter((block) => block.component === 'SectionQuiz' && block.interactiveId)
                .map((block) => block.interactiveId as string)
            : [];
        const lastSectionId = flattenedSections[flattenedSections.length - 1]?.id;

        const required = originalQuizIds.map((quizId) => {
            const replacement = effectivePublishedQuizRows.find(({ quiz }) => quiz.quiz_id === quizId);
            return replacement ? quizCompletionKey(replacement.row, quizId) : quizId;
        });

        effectivePublishedQuizRows.forEach(({ row, quiz }) => {
            if (isShippedVanguardQuizId(quiz.quiz_id)) return;
            const belongsToActiveSection = row.section_id === activeSection
                || (row.position === 'append_module' && activeSection === lastSectionId);
            if (belongsToActiveSection) required.push(quizCompletionKey(row, quiz.quiz_id));
        });

        return [...new Set(required)];
    }, [activeSection, activeSectionRecord, effectivePublishedQuizRows, flattenedSections, sectionSuppression.suppressedQuizSections]);
    const missingRequiredQuizIds = requiredQuizIds.filter(
        (quizId) => !moduleProgress.completedInteractives.includes(quizId),
    );
    const canCompleteActiveSection = unlockedSectionIds.has(activeSection) && missingRequiredQuizIds.length === 0;

    const completeActiveSection = useCallback(() => {
        if (
            !user
            || !activeSection
            || !unlockedSectionIds.has(activeSection)
            || !canCompleteActiveSection
            || moduleProgress.completedSections.includes(activeSection)
        ) return;
        updateModuleProgress(moduleId, activeSection, 'section');
        addPoints(moduleId, 10);
    }, [
        activeSection,
        addPoints,
        canCompleteActiveSection,
        moduleId,
        moduleProgress.completedSections,
        unlockedSectionIds,
        updateModuleProgress,
        user,
    ]);

    const activeSectionTitle = flattenedSections.find((section) => section.id === activeSection)?.title ?? activeSection;

    return {
        user,
        moduleProgress,
        activeSection,
        activeSectionTitle,
        completeActiveSection,
        canCompleteActiveSection,
        missingRequiredQuizIds,
        visibleSections,
        flattenedSections,
        totalSections,
        completedSectionCount,
        hiddenSectionIds,
        unlockedSectionIds,
        allSectionsComplete,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isModuleComplete,
        showCompletionModal,
        setShowCompletionModal,
    };
};
