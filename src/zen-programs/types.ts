import type { ProgramAccessRequirement } from '../entitlements/types';

export type ProgramContentItem =
    | ProgramTextContentItem
    | ProgramCodeContentItem
    | ProgramTemplateContentItem
    | ProgramChecklistContentItem
    | ProgramCalloutContentItem
    | ProgramResourceContentItem;

export interface ProgramTextContentItem {
    type: 'paragraph' | 'heading' | 'list' | 'quote';
    content: string | string[];
}

export interface ProgramCodeContentItem {
    type: 'code';
    content: string;
    title?: string;
    filename?: string;
    language?: string;
}

export interface ProgramTemplateContentItem {
    type: 'template';
    templateId: string;
    content?: string;
}

export interface ProgramChecklistContentItem {
    type: 'checklist';
    content: string[];
    title?: string;
}

export interface ProgramCalloutContentItem {
    type: 'callout';
    content: string | string[];
    title?: string;
    tone?: 'info' | 'warning' | 'success';
}

export interface ProgramResourceContentItem {
    type: 'resource';
    title: string;
    content?: string | string[];
    href?: string;
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

export type ProgramStatus = 'active' | 'beta' | 'coming-soon' | 'archived';

export type ProgramSourceOfTruth =
    | 'curriculumData'
    | 'vanguardManifest'
    | 'registry-placeholder'
    | 'external';

export type ProgramAvailabilityStatus =
    | 'available'
    | 'unavailable'
    | 'coming-soon'
    | 'draft'
    | 'private-beta';

export type ArsenalReadyStatus = 'not-started' | 'staging' | 'merge-ready' | 'merged';

export interface ProgramAvailabilityConfig {
    availabilityStatus: ProgramAvailabilityStatus;
    published: boolean;
    adminPreviewEnabled: boolean;
    publicLabel: string;
    adminLabel: string;
    publishControlsEnabled: boolean;
    arsenalReadyStatus: ArsenalReadyStatus;
    arsenalMergeNotes: string[];
}

export interface ProgramArsenalReadiness {
    contentStatus: string;
    entitlementStatus: string;
    billingStatus: string;
    routeStatus: string;
    publicAvailability: string;
    mergeReadinessNotes: string[];
}

export interface ProgramCredential {
    name: string;
    description?: string;
    requirements: string[];
    dryRunOnly?: boolean;
}

export interface ProgramProgressConfig {
    source: 'vanguard-manifest' | 'curriculum-sections' | 'manual' | 'none';
    trackableItems?: number;
    moduleTotals?: Record<string, number>;
    storageKeyPrefix?: string;
}

export interface ProgramRouteConfig {
    primary: string;
    dashboard?: string;
    curriculum?: string;
    legacy?: string[];
    external?: string;
}

export interface ProgramDashboardCard {
    id: string;
    programId: string;
    slug: string;
    name: string;
    description: string;
    route: string;
    ctaLabel: string;
    isDisabled: boolean;
    status: ProgramStatus;
    featured: boolean;
    accentColor: ProgramInfo['accentColor'];
    badge: string | null;
    icon: string;
    audience: string;
    level: string;
    duration: string;
    spotlight: string;
    skills: string[];
    outcomes: string[];
    starterSteps: string[];
    access?: ProgramAccessRequirement;
    availability: ProgramAvailabilityConfig;
    arsenalReadiness: ProgramArsenalReadiness;
}

export interface ProgramManifest {
    programId: string;
    slug: string;
    legacyIds?: string[];
    name: string;
    description: string;
    audience: string;
    level: string;
    duration: string;
    status: ProgramStatus;
    featured: boolean;
    sourceOfTruth: ProgramSourceOfTruth;
    route: ProgramRouteConfig;
    dashboardCard: ProgramDashboardCard;
    credential: ProgramCredential;
    progress: ProgramProgressConfig;
    access?: ProgramAccessRequirement;
    availability: ProgramAvailabilityConfig;
    arsenalReadiness: ProgramArsenalReadiness;
    coreOutput: string;
    keyOutcomes: string[];
    notes?: string[];
    metadata?: Record<string, string | number | boolean | string[]>;
}

export interface ProgramInfo {
    id: string;
    programId?: string;
    slug?: string;
    name: string;
    description: string;
    route: string;
    ctaLabel?: string;
    isDisabled?: boolean;
    status?: ProgramStatus;
    featured?: boolean;
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
    access?: ProgramAccessRequirement;
    availability?: ProgramAvailabilityConfig;
    arsenalReadiness?: ProgramArsenalReadiness;
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
