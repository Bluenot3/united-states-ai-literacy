export type ProgramContentItem =
    | ProgramTextContentItem
    | ProgramResourceContentItem
    | ProgramLabContentItem
    | ProgramCalloutContentItem
    | ProgramCodeContentItem
    | ProgramMediaContentItem
    | ProgramEmbedContentItem
    | ProgramHtmlContentItem
    | ProgramDividerContentItem;

export interface ProgramTextContentItem {
    type: 'paragraph' | 'heading' | 'list' | 'quote';
    content: string | string[];
}

export interface ProgramResourceContentItem {
    type: 'resource';
    title: string;
    href?: string;
    content?: string | string[];
    what?: string;
    why?: string;
    status?: 'Ready' | 'External' | 'Requires key' | 'Demo' | 'Optional';
    embed?: boolean;
    instructions?: string[];
    completionHint?: string;
    interactive?: 'ai-signal-loop' | 'ai-or-not-check' | 'ai-coach-console' | 'ai-vocab-quest' | 'neural-network-lab' | 'computer-vision-lab' | 'model-behavior-mixer' | 'prompt-formula-builder' | 'prompt-upgrader' | 'prompt-power-meter' | 'prompt-library' | 'prompt-remix' | 'particle-lab' | 'api-orb' | 'mission-badges' | 'image-recipe-builder' | 'diffusion-lab' | 'media-quality-lens' | 'generative-media-lab' | 'prompt-architect' | 'pioneer-studio' | 'chatbot-anatomy' | 'deepfake-check' | 'prediction-engine' | 'token-budget' | 'persona-agent' | 'model-fit-router';
}

export interface ProgramLabContentItem {
    type: 'lab';
    id: string;
    title: string;
    objective: string;
    steps: string[];
    expectedOutput: string;
    reflectionPrompt?: string;
}

export interface ProgramCalloutContentItem {
    type: 'callout';
    title?: string;
    content: string | string[];
    tone?: 'info' | 'success' | 'warning';
}

export interface ProgramCodeContentItem {
    type: 'code';
    content: string;
    title?: string;
    language?: string;
}

export interface ProgramMediaContentItem {
    type: 'image' | 'video';
    src: string;
    alt?: string;
    caption?: string;
}

export interface ProgramEmbedContentItem {
    type: 'embed';
    url: string;
    title?: string;
    height?: number;
}

export interface ProgramHtmlContentItem {
    type: 'html';
    content: string;
    title?: string;
    height?: number;
}

export interface ProgramDividerContentItem {
    type: 'divider';
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
    exploredResources?: string[];
    completedLabs?: string[];
    reflections?: Record<string, string>;
    lastActiveAt?: string | null;
}

const emptyProgress = (): ProgramProgress => ({
    completedSections: [],
    lastViewedSection: '',
    startedAt: null,
    exploredResources: [],
    completedLabs: [],
    reflections: {},
    lastActiveAt: null,
});

export const getProgramProgress = (programId: string): ProgramProgress => {
    const key = `zenPrograms.${programId}.progress`;
    const stored = localStorage.getItem(key);

    if (stored) {
        try {
            return { ...emptyProgress(), ...JSON.parse(stored) };
        } catch {
            return emptyProgress();
        }
    }

    return emptyProgress();
};

export const saveProgramProgress = (programId: string, sectionId: string, markComplete = true): void => {
    const key = `zenPrograms.${programId}.progress`;
    const progress = getProgramProgress(programId);

    if (!progress.startedAt) {
        progress.startedAt = new Date().toISOString();
    }

    if (markComplete && !progress.completedSections.includes(sectionId)) {
        progress.completedSections.push(sectionId);
    }

    progress.lastViewedSection = sectionId;
    progress.lastActiveAt = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(progress));
};

export const saveProgramResourceExplored = (programId: string, resourceId: string): ProgramProgress => {
    const key = `zenPrograms.${programId}.progress`;
    const progress = getProgramProgress(programId);
    progress.exploredResources = progress.exploredResources ?? [];

    if (!progress.exploredResources.includes(resourceId)) {
        progress.exploredResources.push(resourceId);
    }

    progress.lastActiveAt = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(progress));
    return progress;
};

export const saveProgramLabComplete = (programId: string, labId: string, reflection?: string): ProgramProgress => {
    const key = `zenPrograms.${programId}.progress`;
    const progress = getProgramProgress(programId);
    progress.completedLabs = progress.completedLabs ?? [];
    progress.reflections = progress.reflections ?? {};

    if (!progress.completedLabs.includes(labId)) {
        progress.completedLabs.push(labId);
    }

    if (reflection?.trim()) {
        progress.reflections[labId] = reflection.trim();
    }

    progress.lastActiveAt = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(progress));
    return progress;
};

export const resetProgramProgress = (programId: string): void => {
    const key = `zenPrograms.${programId}.progress`;
    localStorage.removeItem(key);
};
