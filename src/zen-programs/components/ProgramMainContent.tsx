import React, { useEffect, useRef } from 'react';
import type { ProgramSection, ProgramInfo, ProgramProgress } from '../types';
import { saveProgramProgress } from '../types';
import { getAccentClasses } from '../programsRegistry';
import ProgramSectionRenderer from './ProgramSectionRenderer';

interface ProgramMainContentProps {
    sections: ProgramSection[];
    activeSection: string;
    setActiveSection: (sectionId: string) => void;
    program: ProgramInfo;
    progress: ProgramProgress;
    setProgress: (progress: ProgramProgress) => void;
}

const ProgramMainContent: React.FC<ProgramMainContentProps> = ({
    sections,
    activeSection,
    setActiveSection,
    program,
    progress,
    setProgress
}) => {
    const colors = getAccentClasses(program.accentColor);
    const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

    // Flatten sections for easier navigation
    const flattenSections = (secs: ProgramSection[]): ProgramSection[] => {
        return secs.reduce<ProgramSection[]>((acc, sec) => {
            acc.push(sec);
            if (sec.subSections) {
                acc.push(...flattenSections(sec.subSections));
            }
            return acc;
        }, []);
    };

    const allSections = flattenSections(sections);
    const currentIndex = allSections.findIndex(s => s.id === activeSection);
    const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
    const nextSection = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

    // Get current section content
    const findSection = (secs: ProgramSection[], id: string): ProgramSection | null => {
        for (const sec of secs) {
            if (sec.id === id) return sec;
            if (sec.subSections) {
                const found = findSection(sec.subSections, id);
                if (found) return found;
            }
        }
        return null;
    };

    const currentSection = findSection(sections, activeSection);

    // Mark section as completed when viewed
    useEffect(() => {
        if (activeSection && !progress.completedSections.includes(activeSection)) {
            const newProgress = {
                ...progress,
                completedSections: [...progress.completedSections, activeSection],
                lastViewedSection: activeSection,
                startedAt: progress.startedAt || new Date().toISOString()
            };
            setProgress(newProgress);
            saveProgramProgress(program.id, activeSection);
        }
    }, [activeSection]);

    const handleNavigation = (sectionId: string) => {
        setActiveSection(sectionId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!currentSection) {
        return (
            <main className="flex-1 min-w-0">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft-lg border border-white/50 p-8">
                    <p className="text-center text-brand-text-light">Select a section from the sidebar</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 min-w-0">
            <article className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft-lg border border-white/50 p-6 sm:p-8 lg:p-10">
                {/* Section header */}
                <header className="mb-8 pb-6 border-b border-brand-shadow-dark/10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white text-2xl shadow-md`}>
                            {currentSection.icon || '📄'}
                        </span>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-brand-text-light">
                                {program.name}
                            </p>
                            <h2 className="text-2xl font-bold text-brand-text">{currentSection.title}</h2>
                        </div>
                    </div>
                </header>

                {/* Section content */}
                <div className="prose prose-lg max-w-none">
                    <ProgramSectionRenderer content={currentSection.content} />
                </div>

                {/* Navigation buttons */}
                <footer className="mt-10 pt-6 border-t border-brand-shadow-dark/10 flex items-center justify-between gap-4">
                    {prevSection ? (
                        <button
                            onClick={() => handleNavigation(prevSection.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-brand-text-light hover:text-brand-text hover:bg-brand-bg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="hidden sm:inline">{prevSection.title}</span>
                            <span className="sm:hidden">Previous</span>
                        </button>
                    ) : (
                        <div />
                    )}

                    {nextSection ? (
                        <button
                            onClick={() => handleNavigation(nextSection.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r ${colors.gradient} text-white font-semibold shadow-md hover:shadow-lg transition-all`}
                        >
                            <span className="hidden sm:inline">{nextSection.title}</span>
                            <span className="sm:hidden">Next</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ) : (
                        <div className={`px-6 py-3 rounded-lg bg-gradient-to-r ${colors.gradient} text-white font-semibold shadow-md`}>
                            🎉 Course Complete!
                        </div>
                    )}
                </footer>
            </article>
        </main>
    );
};

export default ProgramMainContent;
