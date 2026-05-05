import { useEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { useAuth } from './useAuth';

type TrackableSection = {
    id: string;
    title: string;
    subSections?: TrackableSection[];
};

interface UseModuleExperienceOptions<TSection extends TrackableSection> {
    moduleId: 1 | 2 | 3 | 4;
    sections: TSection[];
    initialSectionId?: string;
    sectionRefs?: MutableRefObject<Record<string, HTMLElement | null>>;
}

const OBSERVER_DELAY_MS = 120;

export const useModuleExperience = <TSection extends TrackableSection>({
    moduleId,
    sections,
    initialSectionId = 'overview',
    sectionRefs,
}: UseModuleExperienceOptions<TSection>) => {
    const {
        user,
        updateModuleProgress,
        addPoints,
        updateLastViewedSection,
        getModuleProgress,
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

    const flattenedSections = useMemo(() => {
        const allSections: (TSection & { parentTitle?: string })[] = [];

        const recurse = (nestedSections: TSection[], parentTitle?: string) => {
            nestedSections.forEach((section) => {
                allSections.push({ ...section, parentTitle });

                if (section.subSections?.length) {
                    recurse(section.subSections as TSection[], section.title);
                }
            });
        };

        recurse(sections);

        return allSections;
    }, [sections]);

    const totalSections = flattenedSections.length;

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
        if (user && !isModuleComplete && moduleProgress.completedSections.length >= totalSections) {
            setIsModuleComplete(true);
        }
    }, [isModuleComplete, moduleProgress.completedSections.length, totalSections, user]);

    useEffect(() => {
        if (user && !moduleProgress.certificateId && moduleProgress.completedSections.length >= totalSections * 0.9) {
            setShowCompletionModal(true);
        }
    }, [moduleProgress, totalSections, user]);

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

            if (!moduleProgress.completedSections.includes(sectionId)) {
                updateModuleProgress(moduleId, sectionId, 'section');
                addPoints(moduleId, 10);
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
        addPoints,
        flattenedSections,
        moduleId,
        moduleProgress.completedSections,
        sectionRefs,
        updateLastViewedSection,
        updateModuleProgress,
        user,
    ]);

    return {
        user,
        moduleProgress,
        activeSection,
        visibleSections,
        flattenedSections,
        totalSections,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isModuleComplete,
        showCompletionModal,
        setShowCompletionModal,
    };
};
