import React, { useRef } from 'react';
import CompletionModal from '../components/CompletionModal';
import VanguardModuleFrame from '../components/vanguard/VanguardModuleFrame';
import { useModuleExperience } from '../hooks/useModuleExperience';
import { EditModeProvider } from '../components/content-overlay/EditModeContext';
import { useContentOverrides } from '../hooks/useContentOverrides';

import { curriculumData } from '../modules/module1/data/curriculumData';
import Header from '../modules/module1/components/Header';
import Sidebar from '../modules/module1/components/Sidebar';
import MainContent from '../modules/module1/components/MainContent';
import ScrollProgressBar from '../modules/module1/components/ScrollProgressBar';
import ModuleFooter from '../components/vanguard/ModuleFooter';
import CommandPalette from '../modules/module1/components/CommandPalette';
import CompletionCelebration from '../modules/module1/components/CompletionCelebration';

class Module1ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Module 1 Crash:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-50 p-8 font-mono text-red-900">
                    <h1 className="mb-4 text-2xl font-bold">Module 1 Crashed</h1>
                    <div className="max-h-[50vh] overflow-auto rounded border border-red-200 bg-white p-4">
                        <p className="font-bold text-red-600">{this.state.error?.toString()}</p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const Module1Page: React.FC = () => {
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const { rows: contentOverrideRows } = useContentOverrides('vanguard', 'module1');
    const publishedOverrides = React.useMemo(
        () => contentOverrideRows.filter((row) => row.is_published),
        [contentOverrideRows],
    );
    const {
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
    } = useModuleExperience({
        moduleId: 1,
        sections: curriculumData.sections,
        sectionRefs,
        publishedOverrides,
    });

    if (!user) {
        return null;
    }

    return (
        <Module1ErrorBoundary>
            <EditModeProvider programId="vanguard" moduleId="module1">
                <VanguardModuleFrame
                    moduleNumber={1}
                    title="AI Foundations"
                    subtitle="Learn the mental models behind modern AI, separate real capability from hype, and build the technical confidence needed for the more advanced Vanguard labs."
                    accentClassName="from-violet-500 via-fuchsia-500 to-cyan-400"
                    chipLabels={['AI literacy', 'LLM fundamentals', 'Prompt judgment']}
                    completedSections={completedSectionCount}
                    totalSections={totalSections}
                    header={(
                        <>
                            <ScrollProgressBar />
                            <Header
                                onCommandPaletteToggle={() => setIsCommandPaletteOpen(true)}
                                completedSections={completedSectionCount}
                                totalSections={totalSections}
                            />
                        </>
                    )}
                    sidebar={<Sidebar sections={curriculumData.sections} activeSection={activeSection} unlockedSectionIds={unlockedSectionIds} />}
                    activeSectionTitle={activeSectionTitle}
                    activeSectionComplete={moduleProgress.completedSections.includes(activeSection)}
                    canCompleteActiveSection={canCompleteActiveSection}
                    completionBlockedReason={missingRequiredQuizIds.length > 0 ? 'Pass the section quiz to clear this checkpoint.' : undefined}
                    onCompleteActiveSection={completeActiveSection}
                    footer={(
                        <ModuleFooter
                            currentModule={1}
                            canAdvance={Boolean(moduleProgress.certificateId)}
                            certificateId={moduleProgress.certificateId}
                            readyToClaim={allSectionsComplete}
                            onRequestCertificate={() => setShowCompletionModal(true)}
                        />
                    )}
                >
                    <MainContent
                        title={curriculumData.title}
                        sections={curriculumData.sections}
                        sectionRefs={sectionRefs}
                        visibleSections={visibleSections}
                        unlockedSectionIds={unlockedSectionIds}
                        hiddenSectionIds={hiddenSectionIds}
                    />
                </VanguardModuleFrame>

                <CommandPalette
                    isOpen={isCommandPaletteOpen}
                    onClose={() => setIsCommandPaletteOpen(false)}
                    sections={flattenedSections.filter((section) => unlockedSectionIds.has(section.id))}
                />
                {isModuleComplete && <CompletionCelebration />}
                {showCompletionModal && (
                    <CompletionModal
                        moduleId={1}
                        moduleName="AI Foundations"
                        completedSections={completedSectionCount}
                        totalSections={totalSections}
                        onClose={() => setShowCompletionModal(false)}
                    />
                )}
            </EditModeProvider>
        </Module1ErrorBoundary>
    );
};

export default Module1Page;
