import {
    getProgramAccessDecision,
    getProgramByKey,
    getProgramCatalog,
    getVisibleProgramsForUser,
    type ProgramAccessDecision,
    type ProgramCatalogItem,
    type ProgramKey,
    type UserProgramState,
} from './programIntegrationContract';

export type ArsenalBridgeOwner = 'arsenal' | 'zen-program-ecosystem';
export type ArsenalBridgeSurface =
    | 'discovery'
    | 'registration'
    | 'progress-summary'
    | 'admin-release'
    | 'entitlement'
    | 'vault-artifacts'
    | 'hugging-face-publish-links'
    | 'curriculum-runtime'
    | 'lessons'
    | 'module-navigation'
    | 'deep-progress';

export interface ArsenalProgramBridgeItem {
    programKey: ProgramKey;
    slug: string;
    title: string;
    roleInArsenal: string;
    canonicalCurriculumOwner: ArsenalBridgeOwner;
    arsenalOwns: ArsenalBridgeSurface[];
    ecosystemOwns: ArsenalBridgeSurface[];
    status: ProgramCatalogItem['status'];
    registrationRoute: string;
    overviewRoute: string;
    launchRoute: string;
    embeddedRoute: string;
    currentCtaRoute: string;
    currentCtaLabel: string;
    accessBadge: string;
    releaseControl: {
        adminControlled: boolean;
        unlockPolicy: string;
        currentStatus: ProgramCatalogItem['status'];
    };
    summaryMetrics: {
        modulesCount: number;
        progressPercent: number;
        estimatedDuration: string;
        registrationStatus: UserProgramState['registrationStatus'];
        accessLevel: UserProgramState['accessLevel'];
    };
    artifactLinks: {
        vaultRoute: string;
        huggingFacePublishRoute: string;
        credentialRoute: string;
    };
    primaryArtifacts: string[];
    integrationNotes: string[];
}

const activeProgramKeys = new Set<ProgramKey>(['vanguard', 'ai-pioneer']);

const roleCopy: Record<ProgramKey, string> = {
    vanguard: 'Arsenal-native operator pathway for agents, RAG, governance, automation systems, and production-minded AI workflows.',
    'ai-pioneer': 'Arsenal-native youth builder pathway for AI literacy, responsible building, Gradio apps, and Hugging Face deployment proof.',
    'homeschool-kit': 'Staged family pathway that Arsenal can expose after release controls and content readiness are approved.',
    'web3-literacy': 'Staged trust and credential literacy pathway that must remain simulation-first until wallet and registry integrations are real.',
    'train-a-trainer': 'Staged facilitator pathway for cohort delivery, assessment readiness, and trainer evidence.',
};

const artifactCopy: Record<ProgramKey, string[]> = {
    vanguard: [
        'Agent workflow architecture',
        'RAG or knowledge system deployment',
        'Governance and evaluation evidence',
        'Portfolio-ready operating brief',
    ],
    'ai-pioneer': [
        'Responsible AI reflection',
        'Gradio or Streamlit app files',
        'Live Hugging Face Space URL',
        'Showcase-ready portfolio proof',
    ],
    'homeschool-kit': ['Weekly plan', 'Capstone project record', 'Portfolio evidence'],
    'web3-literacy': ['Wallet safety notes', 'Credential simulation proof', 'Trust model reflection'],
    'train-a-trainer': ['Facilitation plan', 'Cohort readiness notes', 'Assessment evidence'],
};

const bridgeNotes: Record<ProgramKey, string[]> = {
    vanguard: [
        'Do not replace the existing Vanguard module routes or dashboard behavior.',
        'Arsenal should summarize progress and artifacts, then hand off to the existing Vanguard runtime for deep work.',
    ],
    'ai-pioneer': [
        'Do not rebuild AI Pioneer or duplicate its curriculum engine.',
        'Arsenal should register, gate, and route learners into the existing AI Pioneer program experience.',
    ],
    'homeschool-kit': ['Keep muted until content readiness and admin release controls are confirmed.'],
    'web3-literacy': ['Keep simulation-first until live wallet, chain write, issuer, and registry paths exist.'],
    'train-a-trainer': ['Keep staged until facilitator resources and cohort administration are ready.'],
};

const bridgeSelfTests = () => {
    console.assert(activeProgramKeys.has('vanguard') && activeProgramKeys.has('ai-pioneer'), 'Active Arsenal bridge programs are incomplete.');
    getProgramCatalog().forEach((program) => {
        console.assert(Boolean(roleCopy[program.programKey]), `Missing Arsenal role copy for ${program.programKey}.`);
        console.assert((artifactCopy[program.programKey] ?? []).length > 0, `Missing artifact copy for ${program.programKey}.`);
    });
};

bridgeSelfTests();

const stateByProgramKey = (states: UserProgramState[]) => (
    new Map(states.map((state) => [state.programKey, state]))
);

const resolveCurrentCta = (
    program: ProgramCatalogItem,
    decision: ProgramAccessDecision,
): Pick<ArsenalProgramBridgeItem, 'currentCtaLabel' | 'currentCtaRoute'> => {
    if (decision.canLaunchFullProgram) {
        return {
            currentCtaLabel: decision.ctaLabel,
            currentCtaRoute: program.launchRoute,
        };
    }

    if (decision.canRegister) {
        return {
            currentCtaLabel: decision.ctaLabel,
            currentCtaRoute: `/programs/${program.slug}/register`,
        };
    }

    if (decision.canViewPreview) {
        return {
            currentCtaLabel: decision.ctaLabel,
            currentCtaRoute: `/programs/${program.slug}`,
        };
    }

    return {
        currentCtaLabel: decision.ctaLabel,
        currentCtaRoute: '/programs',
    };
};

export const getArsenalProgramBridgeItem = ({
    program,
    userState,
    isAuthenticated,
    isAdmin,
}: {
    program: ProgramCatalogItem;
    userState?: UserProgramState | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
}): ArsenalProgramBridgeItem => {
    const decision = getProgramAccessDecision({ program, userState, isAuthenticated, isAdmin });
    const cta = resolveCurrentCta(program, decision);

    return {
        programKey: program.programKey,
        slug: program.slug,
        title: program.title,
        roleInArsenal: roleCopy[program.programKey],
        canonicalCurriculumOwner: 'zen-program-ecosystem',
        arsenalOwns: [
            'discovery',
            'registration',
            'progress-summary',
            'admin-release',
            'entitlement',
            'vault-artifacts',
            'hugging-face-publish-links',
        ],
        ecosystemOwns: ['curriculum-runtime', 'lessons', 'module-navigation', 'deep-progress'],
        status: program.status,
        registrationRoute: `/programs/${program.slug}/register`,
        overviewRoute: `/programs/${program.slug}`,
        launchRoute: program.launchRoute,
        embeddedRoute: program.embeddedRoute,
        currentCtaLabel: cta.currentCtaLabel,
        currentCtaRoute: cta.currentCtaRoute,
        accessBadge: decision.badgeLabel,
        releaseControl: {
            adminControlled: true,
            unlockPolicy: program.fullAccessRequiresEnrollment
                ? 'Full launch requires enrollment, facilitator access, admin access, or an Arsenal access grant.'
                : 'Program can launch through public preview rules.',
            currentStatus: program.status,
        },
        summaryMetrics: {
            modulesCount: program.modulesCount,
            progressPercent: userState?.progressPercent ?? 0,
            estimatedDuration: program.estimatedDuration,
            registrationStatus: userState?.registrationStatus ?? 'none',
            accessLevel: userState?.accessLevel ?? 'none',
        },
        artifactLinks: {
            vaultRoute: `/vault?program=${encodeURIComponent(program.programKey)}`,
            huggingFacePublishRoute: `/publish/hugging-face?program=${encodeURIComponent(program.programKey)}`,
            credentialRoute: `/creds?program=${encodeURIComponent(program.programKey)}`,
        },
        primaryArtifacts: artifactCopy[program.programKey],
        integrationNotes: bridgeNotes[program.programKey],
    };
};

export const getArsenalProgramBridgeCatalog = ({
    userProgramStates = [],
    isAuthenticated = false,
    isAdmin = false,
}: {
    userProgramStates?: UserProgramState[];
    isAuthenticated?: boolean;
    isAdmin?: boolean;
} = {}): ArsenalProgramBridgeItem[] => {
    const states = stateByProgramKey(userProgramStates);

    return getVisibleProgramsForUser(userProgramStates, isAdmin).map((program) => getArsenalProgramBridgeItem({
        program,
        userState: states.get(program.programKey),
        isAuthenticated,
        isAdmin,
    }));
};

export const getActiveArsenalProgramBridgeCatalog = (input?: Parameters<typeof getArsenalProgramBridgeCatalog>[0]) => (
    getArsenalProgramBridgeCatalog(input).filter((item) => activeProgramKeys.has(item.programKey))
);

export const getArsenalProgramBridgeByKey = (
    programKey: ProgramKey,
    input?: Omit<Parameters<typeof getArsenalProgramBridgeItem>[0], 'program'>,
): ArsenalProgramBridgeItem | null => {
    const program = getProgramByKey(programKey);

    if (!program) {
        return null;
    }

    return getArsenalProgramBridgeItem({
        program,
        userState: input?.userState,
        isAuthenticated: input?.isAuthenticated ?? false,
        isAdmin: input?.isAdmin ?? false,
    });
};
