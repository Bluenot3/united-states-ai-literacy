import React, { Suspense, useRef } from 'react';
import CompletionModal from '../components/CompletionModal';
import VanguardModuleFrame from '../components/vanguard/VanguardModuleFrame';
import { EditModeProvider } from '../components/content-overlay/EditModeContext';
import { useModuleExperience } from '../hooks/useModuleExperience';
import { useContentOverrides } from '../hooks/useContentOverrides';

import { curriculumData } from '../modules/module2/data/curriculumData';
import Header from '../modules/module2/components/Header';
import Sidebar from '../modules/module2/components/Sidebar';
import MainContent from '../modules/module2/components/MainContent';
import ScrollProgressBar from '../modules/module2/components/ScrollProgressBar';
import ModuleFooter from '../components/vanguard/ModuleFooter';
import CommandPalette from '../modules/module1/components/CommandPalette';
import CompletionCelebration from '../modules/module1/components/CompletionCelebration';

const GeminiChat = React.lazy(() => import('../modules/module2/components/GeminiChat'));

class Module2ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Module 2 Crash:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-50 p-8 font-mono text-red-900">
                    <h1 className="mb-4 text-2xl font-bold">Module 2 Crashed</h1>
                    <div className="max-h-[50vh] overflow-auto rounded border border-red-200 bg-white p-4">
                        <p className="font-bold text-red-600">{this.state.error?.toString()}</p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const MODULE_ID = 2;

const Module2Page: React.FC = () => {
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const { rows: contentOverrideRows } = useContentOverrides('vanguard', 'module2');
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
        moduleId: MODULE_ID,
        sections: curriculumData.sections,
        sectionRefs,
        publishedOverrides,
    });

    if (!user) {
        return null;
    }

    return (
        <Module2ErrorBoundary>
            <EditModeProvider programId="vanguard" moduleId="module2">
                <VanguardModuleFrame
                moduleNumber={MODULE_ID}
                title="Agents & Automation Frameworks"
                subtitle="Turn model outputs into real systems by learning agent design, tool usage, orchestration, memory, security, and the delivery patterns behind useful AI automation."
                accentClassName="from-sky-500 via-cyan-500 to-emerald-400"
                chipLabels={['Agents', 'Automation', 'API-backed workflows']}
                completedSections={completedSectionCount}
                totalSections={totalSections}
                bleed={false}
                header={(
                    <>
                        <ScrollProgressBar />
                        <Header />
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
                        currentModule={2}
                        canAdvance={Boolean(moduleProgress.certificateId)}
                        certificateId={moduleProgress.certificateId}
                        readyToClaim={allSectionsComplete}
                        onRequestCertificate={() => setShowCompletionModal(true)}
                    />
                )}
            >
                <MainContent sections={curriculumData.sections} sectionRefs={sectionRefs} visibleSections={visibleSections} unlockedSectionIds={unlockedSectionIds} hiddenSectionIds={hiddenSectionIds} />
                </VanguardModuleFrame>

                <Suspense fallback={null}>
                    <GeminiChat />
                </Suspense>
                <CommandPalette
                    isOpen={isCommandPaletteOpen}
                    onClose={() => setIsCommandPaletteOpen(false)}
                    sections={flattenedSections.filter((section) => unlockedSectionIds.has(section.id)) as any}
                />
                {isModuleComplete && <CompletionCelebration />}
                {showCompletionModal && (
                    <CompletionModal
                        moduleId={MODULE_ID}
                        moduleName="Agents & Automation Frameworks"
                        completedSections={completedSectionCount}
                        totalSections={totalSections}
                        onClose={() => setShowCompletionModal(false)}
                    />
                )}
            </EditModeProvider>
        </Module2ErrorBoundary>
    );
};

export default Module2Page;
