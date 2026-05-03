export interface ProgramContentItem {
    type: 'paragraph' | 'heading' | 'list' | 'quote';
    content: string | string[];
}

export interface ProgramSection {
    id: string;
    title: string;
    icon?: string;
    content: ProgramContentItem[];
    subSections?: ProgramSection[];
}

export interface ProgramCurriculum {
    title: string;
    description: string;
    sections: ProgramSection[];
}

export interface ProgramInfo {
    id: string;
    name: string;
    description: string;
    route: string;
    accentColor: 'purple' | 'blue' | 'emerald' | 'amber' | 'cyan' | 'pink' | 'orange';
    badge: string | null;
    icon: string;
    audience: string;
    level: string;
    duration: string;
    spotlight: string;
    skills: string[];
    outcomes: string[];
    starterSteps: string[];
}

export interface ProgramProgress {
    completedSections: string[];
    lastViewedSection: string;
    startedAt: string | null;
}

export const getProgramProgress = (programId: string): ProgramProgress => {
    const key = `zenPrograms.${programId}.progress`;
    const stored = localStorage.getItem(key);

    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return { completedSections: [], lastViewedSection: '', startedAt: null };
        }
    }

    return { completedSections: [], lastViewedSection: '', startedAt: null };
};

export const saveProgramProgress = (programId: string, sectionId: string): void => {
    const key = `zenPrograms.${programId}.progress`;
    const progress = getProgramProgress(programId);

    if (!progress.startedAt) {
        progress.startedAt = new Date().toISOString();
    }

    if (!progress.completedSections.includes(sectionId)) {
        progress.completedSections.push(sectionId);
    }

    progress.lastViewedSection = sectionId;
    localStorage.setItem(key, JSON.stringify(progress));
};

export const resetProgramProgress = (programId: string): void => {
    const key = `zenPrograms.${programId}.progress`;
    localStorage.removeItem(key);
};
