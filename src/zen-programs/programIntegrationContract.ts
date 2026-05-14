import { calculateTrackableItems, programManifests } from './programsRegistry';
import type { ProgramManifest } from './types';

export type ProgramKey =
    | 'ai-pioneer'
    | 'vanguard'
    | 'homeschool-kit'
    | 'web3-literacy'
    | 'train-a-trainer';

export type ProgramStatus =
    | 'draft'
    | 'waitlist'
    | 'preview'
    | 'open'
    | 'live'
    | 'archived';

export type RegistrationStatus =
    | 'none'
    | 'waitlisted'
    | 'invited'
    | 'enrolled'
    | 'cancelled';

export type ProgramAccessLevel =
    | 'none'
    | 'preview'
    | 'waitlist'
    | 'enrolled'
    | 'facilitator'
    | 'admin';

export type ProgramVisibility = 'public' | 'authenticated' | 'private' | 'admin';

export interface ProgramCatalogItem {
    programKey: ProgramKey;
    slug: string;
    title: string;
    shortDescription: string;
    audience: string;
    status: ProgramStatus;
    visibility: ProgramVisibility;
    registrationEnabled: boolean;
    previewEnabled: boolean;
    fullAccessRequiresEnrollment: boolean;
    launchRoute: string;
    embeddedRoute: string;
    modulesCount: number;
    estimatedDuration: string;
    credentialLabel: string;
    metadata: Record<string, unknown>;
}

export interface CampaignUtm {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
}

export interface UserProgramState {
    userId: string;
    email?: string | null;
    programKey: ProgramKey;
    registrationStatus: RegistrationStatus;
    accessLevel: ProgramAccessLevel;
    progressPercent: number;
    lastActivityAt?: string | null;
    source?: string | null;
    utm?: CampaignUtm;
}

export interface ProgramAccessDecision {
    canViewOverview: boolean;
    canRegister: boolean;
    canViewPreview: boolean;
    canLaunchFullProgram: boolean;
    reason: string;
    ctaLabel: string;
    badgeLabel: string;
}

export interface ProgramAccessDecisionInput {
    program: ProgramCatalogItem;
    userState?: UserProgramState | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const supportedProgramIds = new Set(['ai-pioneer', 'vanguard', 'homeschool-kit', 'blockchain-literacy', 'train-the-trainer']);

const programIdToProgramKey: Record<string, ProgramKey> = {
    'ai-pioneer': 'ai-pioneer',
    vanguard: 'vanguard',
    'homeschool-kit': 'homeschool-kit',
    'blockchain-literacy': 'web3-literacy',
    'train-the-trainer': 'train-a-trainer',
};

const programKeyToProgramIds: Record<ProgramKey, string[]> = {
    'ai-pioneer': ['ai-pioneer', 'pioneer'],
    vanguard: ['vanguard'],
    'homeschool-kit': ['homeschool-kit', 'homeschool'],
    'web3-literacy': ['blockchain-literacy', 'web3'],
    'train-a-trainer': ['train-the-trainer', 't3'],
};

const programKeyDefaults: Record<ProgramKey, Pick<ProgramCatalogItem, 'status' | 'registrationEnabled' | 'previewEnabled' | 'fullAccessRequiresEnrollment' | 'visibility'>> = {
    'ai-pioneer': {
        status: 'preview',
        registrationEnabled: true,
        previewEnabled: true,
        fullAccessRequiresEnrollment: true,
        visibility: 'public',
    },
    vanguard: {
        status: 'preview',
        registrationEnabled: true,
        previewEnabled: true,
        fullAccessRequiresEnrollment: true,
        visibility: 'public',
    },
    'homeschool-kit': {
        status: 'waitlist',
        registrationEnabled: true,
        previewEnabled: false,
        fullAccessRequiresEnrollment: true,
        visibility: 'public',
    },
    'web3-literacy': {
        status: 'waitlist',
        registrationEnabled: true,
        previewEnabled: false,
        fullAccessRequiresEnrollment: true,
        visibility: 'public',
    },
    'train-a-trainer': {
        status: 'waitlist',
        registrationEnabled: true,
        previewEnabled: false,
        fullAccessRequiresEnrollment: true,
        visibility: 'public',
    },
};

const availabilityToProgramStatus = (program: ProgramManifest, programKey: ProgramKey): ProgramStatus => {
    const availability = program.availability.availabilityStatus;

    if (availability === 'draft' || availability === 'unavailable') {
        return 'draft';
    }

    if (availability === 'available' && program.availability.published) {
        return programKey === 'vanguard' ? 'preview' : programKeyDefaults[programKey].status;
    }

    if (availability === 'private-beta') {
        return 'preview';
    }

    return programKeyDefaults[programKey].status;
};

const routeForProgram = (program: ProgramManifest, mode: 'launch' | 'embedded') => {
    if (program.programId === 'vanguard') {
        return mode === 'launch' ? '/dashboard' : '/module/1';
    }

    return mode === 'launch'
        ? `/programs/${program.slug}/launch`
        : program.route.dashboard ?? program.route.primary;
};

export const toProgramKey = (programIdOrSlug: string): ProgramKey | null => {
    const normalized = programIdOrSlug.trim().toLowerCase();
    const direct = programIdToProgramKey[normalized];

    if (direct) {
        return direct;
    }

    return (Object.entries(programKeyToProgramIds).find(([, ids]) => ids.includes(normalized))?.[0] as ProgramKey | undefined) ?? null;
};

export const toProgramCatalogItem = (program: ProgramManifest): ProgramCatalogItem | null => {
    if (!supportedProgramIds.has(program.programId)) {
        return null;
    }

    const programKey = programIdToProgramKey[program.programId];
    const defaults = programKeyDefaults[programKey];
    const status = availabilityToProgramStatus(program, programKey);
    const modulesCount = typeof program.metadata?.moduleCount === 'number'
        ? program.metadata.moduleCount
        : Math.max(1, Object.keys(program.progress.moduleTotals ?? {}).length || (calculateTrackableItems(program) > 0 ? 1 : 0));

    return {
        programKey,
        slug: program.slug,
        title: program.name,
        shortDescription: program.description,
        audience: program.audience,
        status,
        visibility: status === 'draft' ? 'admin' : defaults.visibility,
        registrationEnabled: defaults.registrationEnabled,
        previewEnabled: defaults.previewEnabled || status === 'preview',
        fullAccessRequiresEnrollment: defaults.fullAccessRequiresEnrollment,
        launchRoute: routeForProgram(program, 'launch'),
        embeddedRoute: routeForProgram(program, 'embedded'),
        modulesCount,
        estimatedDuration: program.duration,
        credentialLabel: program.credential.name,
        metadata: {
            programId: program.programId,
            legacyIds: program.legacyIds ?? [],
            sourceOfTruth: program.sourceOfTruth,
            coreOutput: program.coreOutput,
            keyOutcomes: program.keyOutcomes,
            route: program.route,
            availability: program.availability,
            arsenalReadiness: program.arsenalReadiness,
            accentColor: program.dashboardCard.accentColor,
            badge: program.dashboardCard.badge,
            icon: program.dashboardCard.icon,
            skills: program.dashboardCard.skills,
            starterSteps: program.dashboardCard.starterSteps,
            notes: program.notes ?? [],
            internalMetadata: program.metadata ?? {},
        },
    };
};

export const getProgramCatalog = (): ProgramCatalogItem[] => (
    programManifests
        .map(toProgramCatalogItem)
        .filter((program): program is ProgramCatalogItem => Boolean(program))
);

export const getProgramBySlug = (slug: string): ProgramCatalogItem | undefined => (
    getProgramCatalog().find((program) => program.slug === slug)
);

export const getProgramByKey = (programKey: ProgramKey): ProgramCatalogItem | undefined => (
    getProgramCatalog().find((program) => program.programKey === programKey)
);

export const getProgramAccessDecision = ({
    program,
    userState,
    isAuthenticated,
    isAdmin,
}: ProgramAccessDecisionInput): ProgramAccessDecision => {
    if (isAdmin) {
        return {
            canViewOverview: true,
            canRegister: false,
            canViewPreview: true,
            canLaunchFullProgram: true,
            reason: 'Admin preview can inspect every staged program without publishing it.',
            ctaLabel: 'Admin preview',
            badgeLabel: 'Admin preview',
        };
    }

    if (program.status === 'draft') {
        return {
            canViewOverview: false,
            canRegister: false,
            canViewPreview: false,
            canLaunchFullProgram: false,
            reason: 'This program is still in draft and is hidden from normal users.',
            ctaLabel: 'Unavailable',
            badgeLabel: 'Draft',
        };
    }

    if (program.status === 'archived') {
        const alreadyEnrolled = userState?.registrationStatus === 'enrolled' || userState?.accessLevel === 'enrolled';

        return {
            canViewOverview: alreadyEnrolled,
            canRegister: false,
            canViewPreview: alreadyEnrolled,
            canLaunchFullProgram: alreadyEnrolled,
            reason: alreadyEnrolled ? 'Archived access remains available for enrolled users.' : 'This program is archived.',
            ctaLabel: alreadyEnrolled ? 'Launch program' : 'Archived',
            badgeLabel: 'Archived',
        };
    }

    const registered = userState?.registrationStatus === 'waitlisted' || userState?.registrationStatus === 'invited';
    const enrolled = userState?.registrationStatus === 'enrolled'
        || userState?.accessLevel === 'enrolled'
        || userState?.accessLevel === 'facilitator';
    const canLaunchFullProgram = enrolled && (program.status === 'open' || program.status === 'live');
    const canRegister = isAuthenticated && program.registrationEnabled && !registered && !enrolled;
    const canViewPreview = program.previewEnabled && (program.status === 'preview' || program.status === 'waitlist' || program.status === 'open' || program.status === 'live');

    if (canLaunchFullProgram) {
        return {
            canViewOverview: true,
            canRegister: false,
            canViewPreview: true,
            canLaunchFullProgram: true,
            reason: 'Enrollment or an access grant unlocks the full program.',
            ctaLabel: 'Launch program',
            badgeLabel: 'Enrolled',
        };
    }

    if (registered) {
        return {
            canViewOverview: true,
            canRegister: false,
            canViewPreview,
            canLaunchFullProgram: false,
            reason: 'Registration is recorded. Full curriculum opens after enrollment or admin unlock.',
            ctaLabel: canViewPreview ? 'Continue preview' : 'You are on the list',
            badgeLabel: 'Waitlisted',
        };
    }

    if (!isAuthenticated) {
        return {
            canViewOverview: true,
            canRegister: program.registrationEnabled,
            canViewPreview,
            canLaunchFullProgram: false,
            reason: 'Users can review the overview and register interest without a separate course login.',
            ctaLabel: program.registrationEnabled ? 'Register interest' : 'Preview',
            badgeLabel: program.status === 'preview' ? 'Preview' : 'Waitlist',
        };
    }

    return {
        canViewOverview: true,
        canRegister,
        canViewPreview,
        canLaunchFullProgram: false,
        reason: program.status === 'preview'
            ? 'Preview is available, but full curriculum remains gated until enrollment or unlock.'
            : 'Join the waitlist to be notified when enrollment opens.',
        ctaLabel: canRegister ? 'Join waitlist' : canViewPreview ? 'Continue preview' : 'Registration closed',
        badgeLabel: program.status === 'preview' ? 'Preview' : 'Waitlist',
    };
};

export const getVisibleProgramsForUser = (
    userProgramStates: UserProgramState[] = [],
    isAdmin = false,
): ProgramCatalogItem[] => {
    if (isAdmin) {
        return getProgramCatalog();
    }

    const statesByProgramKey = new Map(userProgramStates.map((state) => [state.programKey, state]));

    return getProgramCatalog().filter((program) => {
        const decision = getProgramAccessDecision({
            program,
            userState: statesByProgramKey.get(program.programKey),
            isAuthenticated: userProgramStates.length > 0,
            isAdmin,
        });

        return decision.canViewOverview;
    });
};

export const parseProgramCampaignParams = (searchParams: URLSearchParams): CampaignUtm & { source?: string; referralCode?: string } => ({
    source: searchParams.get('source') ?? searchParams.get('src') ?? undefined,
    referralCode: searchParams.get('ref') ?? searchParams.get('referralCode') ?? undefined,
    utm_source: searchParams.get('utm_source') ?? undefined,
    utm_medium: searchParams.get('utm_medium') ?? undefined,
    utm_campaign: searchParams.get('utm_campaign') ?? undefined,
    utm_content: searchParams.get('utm_content') ?? undefined,
    utm_term: searchParams.get('utm_term') ?? undefined,
});
