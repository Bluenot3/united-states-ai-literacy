import { programs } from './programsRegistry';
import type { ProgramInfo } from './types';

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

export const ACTIVE_PUBLIC_PROGRAM_KEYS = ['vanguard', 'ai-pioneer'] as const satisfies readonly ProgramKey[];
const ACTIVE_PUBLIC_PROGRAM_KEY_SET = new Set<ProgramKey>(ACTIVE_PUBLIC_PROGRAM_KEYS);

export const isActivePublicProgramKey = (programKey: ProgramKey): boolean => (
    ACTIVE_PUBLIC_PROGRAM_KEY_SET.has(programKey)
);

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

const registryIdToProgramKey: Record<string, ProgramKey> = {
    pioneer: 'ai-pioneer',
    vanguard: 'vanguard',
    homeschool: 'homeschool-kit',
    web3: 'web3-literacy',
    t3: 'train-a-trainer',
};

const programKeyToRegistryId: Record<ProgramKey, string> = {
    'ai-pioneer': 'pioneer',
    vanguard: 'vanguard',
    'homeschool-kit': 'homeschool',
    'web3-literacy': 'web3',
    'train-a-trainer': 't3',
};

const slugAliases: Record<string, ProgramKey> = {
    pioneer: 'ai-pioneer',
    'ai-pioneer': 'ai-pioneer',
    vanguard: 'vanguard',
    homeschool: 'homeschool-kit',
    'homeschool-kit': 'homeschool-kit',
    web3: 'web3-literacy',
    'web3-literacy': 'web3-literacy',
    'blockchain-literacy': 'web3-literacy',
    t3: 'train-a-trainer',
    'train-a-trainer': 'train-a-trainer',
    'train-the-trainer': 'train-a-trainer',
};

const programKeyDefaults: Record<ProgramKey, Pick<ProgramCatalogItem, 'status' | 'registrationEnabled' | 'previewEnabled' | 'fullAccessRequiresEnrollment' | 'visibility' | 'credentialLabel'>> = {
    'ai-pioneer': {
        status: 'preview',
        registrationEnabled: true,
        previewEnabled: true,
        fullAccessRequiresEnrollment: true,
        visibility: 'public',
        credentialLabel: 'ZEN AI Pioneer Certificate + verified ZEN Card',
    },
    vanguard: {
        status: 'preview',
        registrationEnabled: true,
        previewEnabled: true,
        fullAccessRequiresEnrollment: true,
        visibility: 'public',
        credentialLabel: 'ZEN Vanguard Intelligence Architect Certificate',
    },
    'homeschool-kit': {
        status: 'waitlist',
        registrationEnabled: false,
        previewEnabled: false,
        fullAccessRequiresEnrollment: true,
        visibility: 'public',
        credentialLabel: 'Homeschool portfolio record',
    },
    'web3-literacy': {
        status: 'waitlist',
        registrationEnabled: false,
        previewEnabled: false,
        fullAccessRequiresEnrollment: true,
        visibility: 'public',
        credentialLabel: 'Web3 literacy completion record',
    },
    'train-a-trainer': {
        status: 'waitlist',
        registrationEnabled: false,
        previewEnabled: false,
        fullAccessRequiresEnrollment: true,
        visibility: 'public',
        credentialLabel: 'Train-a-Trainer facilitator credential',
    },
};

const moduleCountForProgram = (program: ProgramInfo) => {
    const match = program.duration.match(/\d+/);
    return match ? Math.max(1, Number(match[0])) : 1;
};

const slugForProgramKey = (programKey: ProgramKey) => programKey;

const launchRouteForProgram = (program: ProgramInfo, programKey: ProgramKey) => {
    if (programKey === 'vanguard') {
        return '/dashboard';
    }

    return `/programs/${program.id}/launch`;
};

const embeddedRouteForProgram = (program: ProgramInfo, programKey: ProgramKey) => {
    if (programKey === 'vanguard') {
        return '/module/1';
    }

    return program.route;
};

export const toProgramKey = (programIdOrSlug: string): ProgramKey | null => {
    const normalized = programIdOrSlug.trim().toLowerCase();

    return registryIdToProgramKey[normalized] ?? slugAliases[normalized] ?? null;
};

const toProgramCatalogItem = (program: ProgramInfo): ProgramCatalogItem | null => {
    const programKey = registryIdToProgramKey[program.id];

    if (!programKey) {
        return null;
    }

    const defaults = programKeyDefaults[programKey];

    return {
        programKey,
        slug: slugForProgramKey(programKey),
        title: program.name,
        shortDescription: program.description,
        audience: program.audience,
        status: defaults.status,
        visibility: defaults.status === 'draft' ? 'admin' : defaults.visibility,
        registrationEnabled: defaults.registrationEnabled,
        previewEnabled: defaults.previewEnabled,
        fullAccessRequiresEnrollment: defaults.fullAccessRequiresEnrollment,
        launchRoute: launchRouteForProgram(program, programKey),
        embeddedRoute: embeddedRouteForProgram(program, programKey),
        modulesCount: moduleCountForProgram(program),
        estimatedDuration: program.duration,
        credentialLabel: defaults.credentialLabel,
        metadata: {
            registryId: program.id,
            route: program.route,
            accentColor: program.accentColor,
            badge: program.badge,
            icon: program.icon,
            skills: program.skills,
            starterSteps: program.starterSteps,
            keyOutcomes: program.outcomes,
            spotlight: program.spotlight,
            level: program.level,
            coreOutput: program.outcomes[0] ?? program.spotlight,
        },
    };
};

export const getProgramCatalog = (): ProgramCatalogItem[] => (
    programs
        .map(toProgramCatalogItem)
        .filter((program): program is ProgramCatalogItem => Boolean(program))
);

export const getProgramBySlug = (slug: string): ProgramCatalogItem | undefined => {
    const normalized = slug.trim().toLowerCase();
    const direct = getProgramCatalog().find((program) => program.slug === normalized);

    if (direct) {
        return direct;
    }

    const key = toProgramKey(normalized);
    return key ? getProgramByKey(key) : undefined;
};

export const getProgramByKey = (programKey: ProgramKey): ProgramCatalogItem | undefined => (
    getProgramCatalog().find((program) => program.programKey === programKey)
);

export const getVisibleProgramsForUser = (
    userProgramStates: UserProgramState[] = [],
    isAdmin = false,
): ProgramCatalogItem[] => {
    const statesByProgramKey = new Map(userProgramStates.map((state) => [state.programKey, state]));

    return getProgramCatalog().filter((program) => {
        if (isAdmin) {
            return true;
        }

        if (!isActivePublicProgramKey(program.programKey)) {
            return false;
        }

        const state = statesByProgramKey.get(program.programKey);

        if (program.status === 'draft') {
            return false;
        }

        if (program.status === 'archived') {
            return state?.registrationStatus === 'enrolled' || state?.accessLevel === 'enrolled';
        }

        return program.visibility === 'public' || Boolean(state);
    });
};

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
            reason: 'Admin preview enabled.',
            ctaLabel: 'Admin preview',
            badgeLabel: 'Admin',
        };
    }

    if (!isActivePublicProgramKey(program.programKey)) {
        return {
            canViewOverview: false,
            canRegister: false,
            canViewPreview: false,
            canLaunchFullProgram: false,
            reason: 'This program is staged behind Arsenal admin release controls.',
            ctaLabel: 'Restricted',
            badgeLabel: 'Admin staged',
        };
    }

    if (program.status === 'draft') {
        return {
            canViewOverview: false,
            canRegister: false,
            canViewPreview: false,
            canLaunchFullProgram: false,
            reason: 'This program is still staged for release.',
            ctaLabel: 'Coming soon',
            badgeLabel: 'Draft',
        };
    }

    const enrolledAccess = userState?.registrationStatus === 'enrolled'
        || userState?.accessLevel === 'enrolled'
        || userState?.accessLevel === 'facilitator'
        || userState?.accessLevel === 'admin';
    const isRegistered = userState?.registrationStatus === 'waitlisted'
        || userState?.registrationStatus === 'invited'
        || userState?.accessLevel === 'waitlist';

    if (program.status === 'archived' && !enrolledAccess) {
        return {
            canViewOverview: false,
            canRegister: false,
            canViewPreview: false,
            canLaunchFullProgram: false,
            reason: 'This program is archived.',
            ctaLabel: 'Archived',
            badgeLabel: 'Archived',
        };
    }

    const canLaunchFullProgram = enrolledAccess && (program.status === 'open' || program.status === 'live');
    const canRegister = isAuthenticated && program.registrationEnabled && !isRegistered && !enrolledAccess;

    if (canLaunchFullProgram) {
        return {
            canViewOverview: true,
            canRegister: false,
            canViewPreview: true,
            canLaunchFullProgram: true,
            reason: 'Enrollment or access grant found.',
            ctaLabel: 'Launch program',
            badgeLabel: 'Enrolled',
        };
    }

    if (isRegistered) {
        return {
            canViewOverview: true,
            canRegister: false,
            canViewPreview: program.previewEnabled,
            canLaunchFullProgram: false,
            reason: 'Registration is recorded. Full access remains gated until enrollment opens.',
            ctaLabel: program.previewEnabled ? 'Continue preview' : 'You are on the list',
            badgeLabel: 'Waitlisted',
        };
    }

    if (!isAuthenticated) {
        return {
            canViewOverview: true,
            canRegister: program.registrationEnabled,
            canViewPreview: program.previewEnabled,
            canLaunchFullProgram: false,
            reason: 'Public overview is available. Registration uses Arsenal identity after merge.',
            ctaLabel: program.registrationEnabled ? 'Register interest' : 'Preview only',
            badgeLabel: program.status === 'preview' ? 'Preview' : 'Public',
        };
    }

    return {
        canViewOverview: true,
        canRegister,
        canViewPreview: program.previewEnabled,
        canLaunchFullProgram: false,
        reason: program.fullAccessRequiresEnrollment
            ? 'Full program access requires enrollment or an admin grant.'
            : 'Preview access is available.',
        ctaLabel: canRegister ? 'Join waitlist' : 'Preview program',
        badgeLabel: program.status === 'waitlist' ? 'Waitlist' : 'Preview',
    };
};

export const parseProgramCampaignParams = (searchParams: URLSearchParams): CampaignUtm & { source?: string; referralCode?: string } => ({
    source: searchParams.get('source') ?? searchParams.get('src') ?? undefined,
    referralCode: searchParams.get('ref') ?? searchParams.get('referral') ?? undefined,
    utm_source: searchParams.get('utm_source') ?? undefined,
    utm_medium: searchParams.get('utm_medium') ?? undefined,
    utm_campaign: searchParams.get('utm_campaign') ?? undefined,
    utm_content: searchParams.get('utm_content') ?? undefined,
    utm_term: searchParams.get('utm_term') ?? undefined,
});

export const getRegistryProgramIdForProgramKey = (programKey: ProgramKey): string => programKeyToRegistryId[programKey];
