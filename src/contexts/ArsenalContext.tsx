import React, { createContext, useContext, useEffect, useState } from 'react';

interface ArsenalContextType {
    isEmbedded: boolean;
    programId: string | null;
    emitProgress: (module_id: string, lesson_id: string, section_id: string, section_order: number, status: 'started' | 'completed') => void;
    emitArtifact: (module_id: string, lesson_id: string, artifact_title: string, artifact_url: string, artifact_type: 'app' | 'project') => void;
    emitCompletion: () => void;
}

const ArsenalContext = createContext<ArsenalContextType | undefined>(undefined);

export const ArsenalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isEmbedded, setIsEmbedded] = useState(false);
    const [programId, setProgramId] = useState<string | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const urlArsenalLaunch = searchParams.get('arsenal_launch') === '1';
        const urlProgramId = searchParams.get('program') || searchParams.get('program_id');
        
        const isUrlEmbedded = urlArsenalLaunch || (urlProgramId === 'pioneer' || urlProgramId === 'vanguard');

        if (isUrlEmbedded) {
            sessionStorage.setItem('zen_arsenal_embedded', 'true');
            if (urlProgramId) {
                sessionStorage.setItem('zen_arsenal_program', urlProgramId);
            }
        }

        const sessionEmbedded = sessionStorage.getItem('zen_arsenal_embedded') === 'true';
        const sessionProgramId = sessionStorage.getItem('zen_arsenal_program');

        setIsEmbedded(sessionEmbedded);
        setProgramId(sessionProgramId);
    }, []);

    const emitProgress = (module_id: string, lesson_id: string, section_id: string, section_order: number, status: 'started' | 'completed') => {
        if (!isEmbedded) return;
        window.parent.postMessage({
            type: "zen_program_progress_updated",
            program_id: programId,
            module_id,
            lesson_id,
            section_id,
            section_order,
            status,
            completed_at: status === 'completed' ? new Date().toISOString() : undefined,
            external_event_id: crypto.randomUUID()
        }, "*");
    };

    const emitArtifact = (module_id: string, lesson_id: string, artifact_title: string, artifact_url: string, artifact_type: 'app' | 'project') => {
        if (!isEmbedded) return;
        window.parent.postMessage({
            type: "zen_program_artifact_submitted",
            program_id: programId,
            module_id,
            lesson_id,
            artifact_title,
            artifact_url,
            artifact_type,
            completed_at: new Date().toISOString(),
            external_event_id: crypto.randomUUID()
        }, "*");
    };

    const emitCompletion = () => {
        if (!isEmbedded) return;
        window.parent.postMessage({
            type: "zen_program_completed",
            program_id: programId,
            completed_at: new Date().toISOString(),
            external_event_id: crypto.randomUUID()
        }, "*");
    };

    return (
        <ArsenalContext.Provider value={{ isEmbedded, programId, emitProgress, emitArtifact, emitCompletion }}>
            {isEmbedded && (
                <div className="fixed bottom-4 right-4 z-50 rounded-full border border-zen-gold/20 bg-zen-navy/90 px-4 py-2 text-xs font-semibold text-zen-gold shadow-lg backdrop-blur-xl pointer-events-none">
                    Running inside Arsenal
                </div>
            )}
            {children}
        </ArsenalContext.Provider>
    );
};

export const useArsenal = (): ArsenalContextType => {
    const context = useContext(ArsenalContext);
    if (!context) {
        throw new Error('useArsenal must be used within an ArsenalProvider');
    }
    return context;
};
