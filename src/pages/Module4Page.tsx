import React, { Suspense, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompletionModal from '../components/CompletionModal';
import VanguardModuleFrame from '../components/vanguard/VanguardModuleFrame';
import { EditModeProvider } from '../components/content-overlay/EditModeContext';
import { useModuleExperience } from '../hooks/useModuleExperience';
import { useContentOverrides } from '../hooks/useContentOverrides';

import { curriculumData } from '../modules/module4/data/curriculumData';
import Header from '../modules/module4/components/Header';
import Sidebar from '../modules/module4/components/Sidebar';
import MainContent from '../modules/module4/components/MainContent';
import ScrollProgressBar from '../modules/module4/components/ScrollProgressBar';
import ModuleFooter from '../components/vanguard/ModuleFooter';
import CommandPalette from '../modules/module3/components/CommandPalette';
import CompletionCelebration from '../modules/module3/components/CompletionCelebration';
import { generateFinalCertification, getCertificatesByUser } from '../services/CertificateService';

const GeminiChat = React.lazy(() => import('../modules/module4/components/GeminiChat'));

const MODULE_ID = 4;

class Module4ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Module 4 Crash:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-50 p-8 font-mono text-red-900">
                    <h1 className="mb-4 text-2xl font-bold">Module 4 Crashed</h1>
                    <div className="max-h-[50vh] overflow-auto rounded border border-red-200 bg-white p-4">
                        <p className="font-bold text-red-600">{this.state.error?.toString()}</p>
                        <pre className="mt-2 text-xs text-slate-500">{this.state.error?.stack}</pre>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const Module4Page: React.FC = () => {
    const navigate = useNavigate();
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const [issuedFinalCertificateId, setIssuedFinalCertificateId] = useState<string | null>(null);
    const [isClaimingFinalCertificate, setIsClaimingFinalCertificate] = useState(false);
    const [finalCertificateError, setFinalCertificateError] = useState<string | null>(null);
    const { rows: contentOverrideRows } = useContentOverrides('vanguard', 'module4');
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

    const finalCertificateId = user?.finalCertificationId ?? issuedFinalCertificateId;

    const handleRequestFinalCertificate = async () => {
        if (!user || !moduleProgress.certificateId || isClaimingFinalCertificate) {
            return;
        }

        setIsClaimingFinalCertificate(true);
        setFinalCertificateError(null);

        try {
            const certificate = await generateFinalCertification(
                user.name,
                user.email,
                getCertificatesByUser(user.email),
            );
            setIssuedFinalCertificateId(certificate.id);
            navigate(`/certificate/${encodeURIComponent(certificate.id)}`);
        } catch (error) {
            console.error('Failed to issue the Vanguard certificate:', error);
            setFinalCertificateError(
                'Your Vanguard credential could not be issued yet. Confirm all four module credentials are claimed, then try again.',
            );
        } finally {
            setIsClaimingFinalCertificate(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <Module4ErrorBoundary>
            <EditModeProvider programId="vanguard" moduleId="module4">
                <VanguardModuleFrame
                moduleNumber={MODULE_ID}
                title="AI Systems Mastery & Professional Integration"
                subtitle="Move from builder to operator by learning how to evaluate, govern, secure, and scale AI systems that can survive real users, real data, and real accountability."
                accentClassName="from-amber-500 via-orange-500 to-rose-500"
                chipLabels={['MLOps thinking', 'Governance', 'Production readiness']}
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
                        currentModule={4}
                        canAdvance={Boolean(moduleProgress.certificateId)}
                        certificateId={moduleProgress.certificateId}
                        readyToClaim={allSectionsComplete}
                        onRequestCertificate={() => setShowCompletionModal(true)}
                        finalCertificateId={finalCertificateId}
                        onRequestFinalCertificate={handleRequestFinalCertificate}
                        isFinalCertificateLoading={isClaimingFinalCertificate}
                        finalCertificateError={finalCertificateError}
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
                    sections={flattenedSections.filter((section) => unlockedSectionIds.has(section.id))}
                />
                {isModuleComplete && <CompletionCelebration />}
                {showCompletionModal && (
                    <CompletionModal
                        moduleId={MODULE_ID}
                        moduleName="AI Systems Mastery & Professional Integration"
                        completedSections={completedSectionCount}
                        totalSections={totalSections}
                        onClose={() => setShowCompletionModal(false)}
                    />
                )}
            </EditModeProvider>
        </Module4ErrorBoundary>
    );
};

export default Module4Page;
