import React, { Suspense, useRef } from 'react';
import CompletionModal from '../components/CompletionModal';
import VanguardModuleFrame from '../components/vanguard/VanguardModuleFrame';
import { useModuleExperience } from '../hooks/useModuleExperience';

import { curriculumData } from '../modules/module3/data/curriculumData';
import Header from '../modules/module3/components/Header';
import Sidebar from '../modules/module3/components/Sidebar';
import MainContent from '../modules/module3/components/MainContent';
import ScrollProgressBar from '../modules/module3/components/ScrollProgressBar';
import ModuleFooter from '../components/vanguard/ModuleFooter';
import CommandPalette from '../modules/module3/components/CommandPalette';
import CompletionCelebration from '../modules/module3/components/CompletionCelebration';

const GeminiChat = React.lazy(() => import('../modules/module3/components/GeminiChat'));

class Module3ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Module 3 Crash:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-50 p-8 font-mono text-red-900">
                    <h1 className="mb-4 text-2xl font-bold">Module 3 Crashed</h1>
                    <div className="max-h-[50vh] overflow-auto rounded border border-red-200 bg-white p-4">
                        <p className="font-bold text-red-600">{this.state.error?.toString()}</p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const MODULE_ID = 3;

const Module3Page: React.FC = () => {
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const {
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
    } = useModuleExperience({
        moduleId: MODULE_ID,
        sections: curriculumData.sections,
        sectionRefs,
    });

    if (!user) {
        return null;
    }

    return (
        <Module3ErrorBoundary>
            <VanguardModuleFrame
                moduleNumber={MODULE_ID}
                title="Personal Intelligence & Cognitive Systems"
                subtitle="Build a second-brain workflow for research, retrieval, decision support, and personal operating leverage without losing rigor, provenance, or speed."
                accentClassName="from-emerald-500 via-teal-500 to-cyan-400"
                chipLabels={['RAG systems', 'Decision support', 'Knowledge capture']}
                completedSections={moduleProgress.completedSections.length}
                totalSections={totalSections}
                header={(
                    <>
                        <ScrollProgressBar />
                        <Header
                            onCommandPaletteToggle={() => setIsCommandPaletteOpen(true)}
                            completedSections={moduleProgress.completedSections.length}
                            totalSections={totalSections}
                        />
                    </>
                )}
                sidebar={<Sidebar sections={curriculumData.sections} activeSection={activeSection} />}
                footer={<ModuleFooter currentModule={3} />}
            >
                <MainContent
                    title={curriculumData.title}
                    sections={curriculumData.sections}
                    sectionRefs={sectionRefs}
                    visibleSections={visibleSections}
                />
            </VanguardModuleFrame>

            <Suspense fallback={null}>
                <GeminiChat />
            </Suspense>
            <CommandPalette
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
                sections={flattenedSections}
            />
            {isModuleComplete && <CompletionCelebration />}
            {showCompletionModal && (
                <CompletionModal
                    moduleId={MODULE_ID}
                    moduleName="Personal Intelligence & Cognitive Systems"
                    onClose={() => setShowCompletionModal(false)}
                />
            )}
        </Module3ErrorBoundary>
    );
};

export default Module3Page;
