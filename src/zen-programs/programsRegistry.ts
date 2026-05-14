import { getCurriculumByProgramId } from './curriculum';
import { vanguardProgramManifest } from './adapters/vanguardAdapter';
import { isAdminEmail } from '../services/adminAccess';
import type {
    ProgramArsenalReadiness,
    ProgramAvailabilityConfig,
    ProgramDashboardCard,
    ProgramInfo,
    ProgramManifest,
} from './types';

const createDashboardCard = (
    card: Omit<ProgramDashboardCard, 'id' | 'programId'>,
    programId: ProgramManifest['programId'],
): ProgramDashboardCard => ({
    ...card,
    id: card.slug,
    programId,
});

const programAvailability = {
    aiPioneer: {
        availabilityStatus: 'available',
        published: true,
        adminPreviewEnabled: true,
        publicLabel: 'Available',
        adminLabel: 'Published',
        publishControlsEnabled: false,
        arsenalReadyStatus: 'staging',
        arsenalMergeNotes: [
            'Build-first Hugging Face launch curriculum is staged in ZEN before Arsenal ingestion.',
            'Keep route and dashboard behavior stable until Arsenal merge planning starts.',
        ],
    },
    homeschool: {
        availabilityStatus: 'coming-soon',
        published: false,
        adminPreviewEnabled: true,
        publicLabel: 'Coming Soon',
        adminLabel: 'Unpublished',
        publishControlsEnabled: false,
        arsenalReadyStatus: 'staging',
        arsenalMergeNotes: ['Needs final content packaging, entitlement wiring, and publish persistence before public launch.'],
    },
    blockchain: {
        availabilityStatus: 'coming-soon',
        published: false,
        adminPreviewEnabled: true,
        publicLabel: 'Coming Soon',
        adminLabel: 'Unpublished',
        publishControlsEnabled: false,
        arsenalReadyStatus: 'staging',
        arsenalMergeNotes: ['Keep wallet and credential flows simulation-first until live wallet infrastructure exists.'],
    },
    trainer: {
        availabilityStatus: 'coming-soon',
        published: false,
        adminPreviewEnabled: true,
        publicLabel: 'Coming Soon',
        adminLabel: 'Unpublished',
        publishControlsEnabled: false,
        arsenalReadyStatus: 'staging',
        arsenalMergeNotes: ['Facilitator resources need admin publish controls and cohort delivery metadata before release.'],
    },
    arsenalBuilderLabs: {
        availabilityStatus: 'coming-soon',
        published: false,
        adminPreviewEnabled: true,
        publicLabel: 'Coming Soon',
        adminLabel: 'Unpublished',
        publishControlsEnabled: false,
        arsenalReadyStatus: 'staging',
        arsenalMergeNotes: ['Remain staged in ZEN until the actual Arsenal merge path is approved.'],
    },
    hermes: {
        availabilityStatus: 'available',
        published: true,
        adminPreviewEnabled: true,
        publicLabel: 'Available',
        adminLabel: 'Published',
        publishControlsEnabled: false,
        arsenalReadyStatus: 'staging',
        arsenalMergeNotes: ['Preserves current free/open-source positioning while centralizing availability metadata.'],
    },
} satisfies Record<string, ProgramAvailabilityConfig>;

const programReadiness = {
    aiPioneer: {
        contentStatus: 'Build-first curriculum staged',
        entitlementStatus: 'Frontend soft entitlements active',
        billingStatus: 'Tier foundation prepared; no hard gate',
        routeStatus: '/programs/pioneer preserved',
        publicAvailability: 'Published',
        mergeReadinessNotes: [
            'Starter templates and completion gates render from curriculum metadata.',
            'Ready for a later Arsenal ingestion adapter after publish persistence exists.',
        ],
    },
    homeschool: {
        contentStatus: 'Placeholder registry metadata',
        entitlementStatus: 'Tier requirement metadata active',
        billingStatus: 'Family tier mapped; no hard gate',
        routeStatus: '/programs/homeschool preserved',
        publicAvailability: 'Coming soon',
        mergeReadinessNotes: ['Needs full content QA and publish persistence before public release.'],
    },
    blockchain: {
        contentStatus: 'Placeholder registry metadata',
        entitlementStatus: 'Tier requirement metadata active',
        billingStatus: 'Paid tier metadata mapped; no hard gate',
        routeStatus: '/programs/web3 preserved',
        publicAvailability: 'Coming soon',
        mergeReadinessNotes: ['Do not imply live wallet, chain write, or production credential issuance.'],
    },
    trainer: {
        contentStatus: 'Placeholder registry metadata',
        entitlementStatus: 'Educator tier metadata active',
        billingStatus: 'Educator tier mapped; no hard gate',
        routeStatus: '/programs/t3 preserved',
        publicAvailability: 'Coming soon',
        mergeReadinessNotes: ['Needs facilitator resource packaging and admin grant tooling before launch.'],
    },
    arsenalBuilderLabs: {
        contentStatus: 'Builder lab metadata staged',
        entitlementStatus: 'Builder/Pro/Business/Org metadata active',
        billingStatus: 'Tier foundation prepared; no hard gate',
        routeStatus: '/programs/arena preserved',
        publicAvailability: 'Coming soon',
        mergeReadinessNotes: ['Keep separate from Arsenal until explicit merge pass.'],
    },
    hermes: {
        contentStatus: 'Existing program metadata preserved',
        entitlementStatus: 'Free access metadata active',
        billingStatus: 'No paid requirement',
        routeStatus: '/programs/hermes preserved',
        publicAvailability: 'Published',
        mergeReadinessNotes: ['Centralized metadata only; product behavior preserved.'],
    },
} satisfies Record<string, ProgramArsenalReadiness>;

const nonVanguardProgramManifests: ProgramManifest[] = [
    {
        programId: 'ai-pioneer',
        slug: 'pioneer',
        legacyIds: ['pioneer'],
        name: 'AI Pioneer Program',
        description: 'Build-first AI literacy for ages 11-18 where students launch a real Hugging Face Space by week 4 or week 5.',
        audience: 'Youth ages 11-18',
        level: 'Beginner',
        duration: '8-week core, expandable to 16, 21, or 26 weeks',
        status: 'active',
        featured: true,
        sourceOfTruth: 'curriculumData',
        route: {
            primary: '/programs/pioneer',
            dashboard: '/programs/pioneer',
            curriculum: '/programs/pioneer',
        },
        dashboardCard: createDashboardCard({
            slug: 'pioneer',
            name: 'AI Pioneer Program',
            description: 'Build-first AI literacy for ages 11-18 where students launch a real Hugging Face Space by week 4 or week 5.',
            route: '/programs/pioneer',
            ctaLabel: 'Enter',
            isDisabled: false,
            status: 'active',
            featured: true,
            accentColor: 'blue',
            badge: 'Best place to start',
            icon: 'PI',
            audience: 'Ages 11-18, first-time builders, clubs, schools',
            level: 'Beginner',
            duration: '6 modules; week 4/5 launch',
            spotlight: 'Students launch a live AI-powered Hugging Face Space by week 4 or week 5.',
            skills: ['AI basics', 'Responsible AI', 'Prompt literacy', 'Agent basics', 'API key safety', 'Hugging Face deployment'],
            outcomes: [
                'Explain AI fundamentals, responsible AI, and prompt literacy in plain language.',
                'Build with Gradio while handling API keys as secrets.',
                'Deploy two live Hugging Face Spaces and collect portfolio-ready showcase proof.',
            ],
            starterSteps: [
                'Start with the overview, then finish Module 1 before touching advanced tools.',
                'Use OPENAI_API_KEY and COHERE_API_KEY only as Hugging Face Space Secrets, never in code, README files, screenshots, chat, public repos, or localStorage.',
                'Launch the dual-app Gradio Spaces by week 4 or week 5.',
                'Document finished projects with the public Space URLs, screenshots, prompt examples, and what you learned.',
            ],
            availability: programAvailability.aiPioneer,
            arsenalReadiness: programReadiness.aiPioneer,
        }, 'ai-pioneer'),
        credential: {
            name: 'ZEN AI Pioneer Certificate + blockchain-verified ZEN Card',
            requirements: [
                'Complete the core AI Pioneer path.',
                'Publish and submit a live AI-powered Hugging Face Space URL.',
                'Submit portfolio or showcase proof for review.',
                'Submit a responsible AI reflection and credential evidence checklist.',
            ],
        },
        progress: {
            source: 'curriculum-sections',
            storageKeyPrefix: 'zenPrograms.pioneer',
        },
        access: {
            programId: 'ai-pioneer',
            accessLevel: 'full',
            includedTiers: ['builder', 'pro', 'org'],
            previewTiers: ['free', 'starter', 'educator', 'family', 'business'],
            freePreview: true,
            upgradeTier: 'builder',
            lockedReason: 'Full AI Pioneer access is included in Builder, Pro, and Org tiers. Starter keeps the self-guided lite path.',
            featureIds: ['ai-pioneer-full', 'hugging-face-templates', 'portfolio-resources'],
        },
        availability: programAvailability.aiPioneer,
        arsenalReadiness: programReadiness.aiPioneer,
        coreOutput: 'A live AI-powered Hugging Face Space with portfolio/showcase proof.',
        keyOutcomes: [
            'AI fundamentals',
            'Responsible AI',
            'Prompt literacy',
            'Agent basics',
            'API key safety',
            'Gradio or Streamlit app building',
            'Hugging Face Space deployment',
            'Portfolio/showcase proof',
        ],
        metadata: {
            launchMilestone: 'Live Hugging Face Space by week 4 or week 5',
            starterTemplatePath: 'src/zen-programs/curriculum/pioneer/starterTemplates.ts',
            completionGatesPath: 'src/zen-programs/curriculum/pioneer/completionGates.ts',
        },
    },
    {
        programId: 'homeschool-kit',
        slug: 'homeschool',
        legacyIds: ['homeschool'],
        name: 'Homeschool Kit',
        description: 'Structured AI curriculum with routines, projects, and portfolio-ready records.',
        audience: 'Families, micro-schools, and students ages 11-18',
        level: 'Beginner to intermediate',
        duration: 'Flexible pacing: 8, 16, 26, or 36 weeks',
        status: 'active',
        featured: false,
        sourceOfTruth: 'curriculumData',
        route: {
            primary: '/programs/homeschool',
            dashboard: '/programs/homeschool',
            curriculum: '/programs/homeschool',
        },
        dashboardCard: createDashboardCard({
            slug: 'homeschool',
            name: 'Homeschool Kit',
            description: 'Structured AI curriculum with routines, projects, and portfolio-ready records.',
            route: '/programs/homeschool',
            ctaLabel: 'Enter',
            isDisabled: false,
            status: 'active',
            featured: false,
            accentColor: 'emerald',
            badge: null,
            icon: 'HS',
            audience: 'Families, micro-schools, and students ages 11-18',
            level: 'Beginner to intermediate',
            duration: '8, 16, 26, or 36 weeks',
            spotlight: 'A flexible pacing kit for capstone AI projects and transcript-friendly records.',
            skills: ['Planning', 'Project-based learning', 'Portfolio building', 'Transcript evidence'],
            outcomes: [
                'Run a repeatable weekly AI learning rhythm without guesswork.',
                'Build a capstone AI project with portfolio-ready records.',
                'Translate projects into credits, reflections, and external proof of work.',
            ],
            starterSteps: [
                'Set your weekly rhythm before choosing advanced projects.',
                'Keep one running portfolio document for screenshots and reflections.',
                'Review the Starter Guide before the first deployment task.',
            ],
            availability: programAvailability.homeschool,
            arsenalReadiness: programReadiness.homeschool,
        }, 'homeschool-kit'),
        credential: {
            name: 'ZEN Homeschool AI Certificate + optional ZEN Card',
            requirements: [
                'Complete the selected pacing path.',
                'Submit a capstone AI project.',
                'Maintain portfolio-ready records.',
            ],
        },
        progress: {
            source: 'curriculum-sections',
            storageKeyPrefix: 'zenPrograms.homeschool',
        },
        access: {
            programId: 'homeschool-kit',
            accessLevel: 'full',
            includedTiers: ['family', 'org'],
            previewTiers: ['free', 'starter', 'builder', 'pro', 'educator', 'business'],
            freePreview: true,
            upgradeTier: 'family',
            lockedReason: 'Homeschool Kit is packaged for Family / Homeschool and Org tiers.',
            featureIds: ['parent-guide', 'student-records', 'capstone-materials'],
        },
        availability: programAvailability.homeschool,
        arsenalReadiness: programReadiness.homeschool,
        coreOutput: 'Capstone AI project plus portfolio-ready records.',
        keyOutcomes: ['Flexible AI pacing', 'Capstone AI project', 'Portfolio-ready records'],
    },
    {
        programId: 'blockchain-literacy',
        slug: 'web3',
        legacyIds: ['web3'],
        name: 'Blockchain Literacy',
        description: 'Wallet safety, on-chain credential literacy, and practical trust systems without the hype.',
        audience: 'Teens, adults, and educators',
        level: 'Beginner to intermediate',
        duration: '4 modules, concept-to-application',
        status: 'active',
        featured: false,
        sourceOfTruth: 'curriculumData',
        route: {
            primary: '/programs/web3',
            dashboard: '/programs/web3',
            curriculum: '/programs/web3',
        },
        dashboardCard: createDashboardCard({
            slug: 'web3',
            name: 'Blockchain Literacy',
            description: 'Wallet safety, on-chain credential literacy, and practical trust systems without the hype.',
            route: '/programs/web3',
            ctaLabel: 'Enter',
            isDisabled: false,
            status: 'active',
            featured: false,
            accentColor: 'cyan',
            badge: null,
            icon: 'W3',
            audience: 'Teens, adults, educators',
            level: 'Beginner to intermediate',
            duration: '4 modules, concept-to-application',
            spotlight: 'Understand wallets, credentials, and ZEN Card/SBT simulation before real wallet risk.',
            skills: ['Wallet safety', 'Identity systems', 'Verifiable credentials', 'Trust models'],
            outcomes: [
                'Practice wallet safety and on-chain credential literacy.',
                'Use ZEN Card and SBT simulation without requiring a real wallet connection.',
                'Understand how verifiable proof can support AI education and hiring.',
            ],
            starterSteps: [
                'Do not start by buying anything. Start with identity and safety.',
                'Practice with simulations before touching anything permanent.',
                'Connect the credential lessons back to your portfolio and proof of work.',
            ],
            availability: programAvailability.blockchain,
            arsenalReadiness: programReadiness.blockchain,
        }, 'blockchain-literacy'),
        credential: {
            name: 'ZEN Blockchain Badge + ZEN Card',
            requirements: [
                'Complete wallet safety and credential literacy modules.',
                'Complete ZEN Card or SBT simulation.',
                'Do not require a real wallet connection unless a live wallet flow is explicitly implemented.',
            ],
            dryRunOnly: true,
        },
        progress: {
            source: 'curriculum-sections',
            storageKeyPrefix: 'zenPrograms.web3',
        },
        access: {
            programId: 'blockchain-literacy',
            accessLevel: 'full',
            includedTiers: ['starter', 'builder', 'pro', 'educator', 'family', 'business', 'org'],
            previewTiers: ['free'],
            freePreview: true,
            upgradeTier: 'starter',
            lockedReason: 'Blockchain Literacy is available on paid tiers, with preview access on Free.',
            featureIds: ['wallet-safety', 'credential-literacy', 'zen-card-simulation'],
            notes: ['Does not require real wallet connection unless a future live wallet flow is implemented.'],
        },
        availability: programAvailability.blockchain,
        arsenalReadiness: programReadiness.blockchain,
        coreOutput: 'Wallet safety plus on-chain credential literacy and ZEN Card/SBT simulation.',
        keyOutcomes: ['Wallet safety', 'On-chain credential literacy', 'ZEN Card/SBT simulation'],
        notes: ['Registry metadata keeps wallet work simulation-first unless the product route implements a real wallet connection.'],
    },
    {
        programId: 'train-the-trainer',
        slug: 't3',
        legacyIds: ['t3'],
        name: 'Train-the-Trainer',
        description: 'Certification readiness for educators and facilitators delivering ZEN programs at scale.',
        audience: 'Educators, mentors, facilitators, and program leaders',
        level: 'Intermediate',
        duration: '4 modules, implementation-focused',
        status: 'active',
        featured: false,
        sourceOfTruth: 'curriculumData',
        route: {
            primary: '/programs/t3',
            dashboard: '/programs/t3',
            curriculum: '/programs/t3',
        },
        dashboardCard: createDashboardCard({
            slug: 't3',
            name: 'Train-the-Trainer',
            description: 'Certification readiness for educators and facilitators delivering ZEN programs at scale.',
            route: '/programs/t3',
            ctaLabel: 'Enter',
            isDisabled: false,
            status: 'active',
            featured: false,
            accentColor: 'amber',
            badge: null,
            icon: 'T3',
            audience: 'Educators, mentors, facilitators, program leaders',
            level: 'Intermediate',
            duration: '4 modules, implementation-focused',
            spotlight: 'Turn content knowledge into a cohort delivery playbook and facilitator readiness path.',
            skills: ['Facilitation', 'Assessment', 'Safety protocols', 'Program operations'],
            outcomes: [
                'Build a cohort delivery playbook for repeatable facilitation.',
                'Use rubrics, safety guardrails, and accessibility practices.',
                'Prepare for ZEN Certified AI Literacy Facilitator review.',
            ],
            starterSteps: [
                'Review the safety standards before adapting any lesson.',
                'Map your delivery context: in-person, hybrid, or online.',
                'Use the rubric and documentation sections as your implementation backbone.',
            ],
            availability: programAvailability.trainer,
            arsenalReadiness: programReadiness.trainer,
        }, 'train-the-trainer'),
        credential: {
            name: 'ZEN Certified AI Literacy Facilitator',
            requirements: [
                'Complete the facilitator curriculum.',
                'Assemble a cohort delivery playbook.',
                'Prepare facilitation evidence for certification review.',
            ],
        },
        progress: {
            source: 'curriculum-sections',
            storageKeyPrefix: 'zenPrograms.t3',
        },
        access: {
            programId: 'train-the-trainer',
            accessLevel: 'full',
            includedTiers: ['educator', 'org'],
            previewTiers: ['free', 'starter', 'builder', 'pro', 'family', 'business'],
            freePreview: true,
            upgradeTier: 'educator',
            lockedReason: 'Train-the-Trainer is included in Educator and Org tiers.',
            featureIds: ['facilitator-resources', 'rubrics', 'cohort-delivery-materials'],
        },
        availability: programAvailability.trainer,
        arsenalReadiness: programReadiness.trainer,
        coreOutput: 'Cohort delivery playbook plus facilitator certification readiness.',
        keyOutcomes: ['Cohort delivery playbook', 'Facilitator certification readiness', 'Safe program operations'],
    },
    {
        programId: 'arsenal-builder-labs',
        slug: 'arena',
        legacyIds: ['arena'],
        name: 'Arsenal Builder Labs',
        description: 'Builder labs for agents, automations, public Arsenal pages, and monetized tools.',
        audience: 'Builders, students, creators, operators, and entrepreneurs',
        level: 'Intermediate',
        duration: '4 modules, experimentation-focused',
        status: 'beta',
        featured: false,
        sourceOfTruth: 'curriculumData',
        route: {
            primary: '/programs/arena',
            dashboard: '/programs/arena',
            curriculum: '/programs/arena',
        },
        dashboardCard: createDashboardCard({
            slug: 'arena',
            name: 'Arsenal Builder Labs',
            description: 'Builder labs for agents, automations, public Arsenal pages, and monetized tools.',
            route: '/programs/arena',
            ctaLabel: 'Enter',
            isDisabled: false,
            status: 'beta',
            featured: false,
            accentColor: 'pink',
            badge: 'Builder lab',
            icon: 'AB',
            audience: 'Builders, students, creators, operators, entrepreneurs',
            level: 'Intermediate',
            duration: '4 modules, experimentation-focused',
            spotlight: 'Build agents, automations, public Arsenal pages, and monetized tools.',
            skills: ['Agent building', 'Automation design', 'Public pages', 'Tool monetization'],
            outcomes: [
                'Create agents and automations tied to practical workflows.',
                'Prepare public Arsenal pages or tool surfaces for launch.',
                'Package builder work into portfolio and monetization-ready proof.',
            ],
            starterSteps: [
                'Define a single buyer or user workflow before building.',
                'Ship one small public proof surface before expanding scope.',
                'Use Vanguard operating standards for security and evaluation.',
            ],
            availability: programAvailability.arsenalBuilderLabs,
            arsenalReadiness: programReadiness.arsenalBuilderLabs,
        }, 'arsenal-builder-labs'),
        credential: {
            name: 'Arsenal Builder Badge / future ZEN Card',
            requirements: [
                'Build at least one agent, automation, public Arsenal page, or monetized tool.',
                'Document launch evidence and user workflow.',
                'Use future ZEN Card evidence only when credential infrastructure exists.',
            ],
        },
        progress: {
            source: 'curriculum-sections',
            storageKeyPrefix: 'zenPrograms.arena',
        },
        access: {
            programId: 'arsenal-builder-labs',
            accessLevel: 'full',
            includedTiers: ['builder', 'pro', 'business', 'org'],
            previewTiers: ['free', 'starter', 'educator', 'family'],
            freePreview: true,
            upgradeTier: 'builder',
            lockedReason: 'Arsenal Builder Labs is included in Builder, Pro, Business, and Org tiers while beta access is active.',
            featureIds: ['builder-labs', 'workflow-agents', 'public-arsenal-pages'],
            notes: ['This metadata is non-enforcing until entitlement gates are wired.'],
        },
        availability: programAvailability.arsenalBuilderLabs,
        arsenalReadiness: programReadiness.arsenalBuilderLabs,
        coreOutput: 'Agents, automations, public Arsenal pages, and monetized tools.',
        keyOutcomes: ['Agents', 'Automations', 'Public Arsenal pages', 'Monetized tools'],
        notes: ['Uses the existing /programs/arena route to preserve route behavior.'],
    },
    {
        programId: 'hermes',
        slug: 'hermes',
        legacyIds: ['hermes'],
        name: 'Hermes Agent Ops',
        description: 'Deploy and master the free, open-source Hermes AI Agent.',
        audience: 'Builders, operators, and anyone who wants a personal AI agent for free',
        level: 'Beginner to advanced',
        duration: '6 modules, hands-on deployment',
        status: 'active',
        featured: false,
        sourceOfTruth: 'curriculumData',
        route: {
            primary: '/programs/hermes',
            dashboard: '/programs/hermes',
            curriculum: '/programs/hermes',
        },
        dashboardCard: createDashboardCard({
            slug: 'hermes',
            name: 'Hermes Agent Ops',
            description: 'Deploy and master the free, open-source Hermes AI Agent.',
            route: '/programs/hermes',
            ctaLabel: 'Enter',
            isDisabled: false,
            status: 'active',
            featured: false,
            accentColor: 'orange',
            badge: 'Free & Open Source',
            icon: 'HA',
            audience: 'Builders, operators, and anyone who wants a personal AI agent for free',
            level: 'Beginner to advanced',
            duration: '6 modules, hands-on deployment',
            spotlight: 'Your own AI agent that learns, remembers, and works across every platform for $0.',
            skills: ['Self-hosted AI agents', 'Multi-platform gateway', 'Persistent memory', 'Tool orchestration', 'Local LLM integration'],
            outcomes: [
                'Deploy a fully operational Hermes Agent on your own hardware or a low-cost VPS.',
                'Connect your agent to messaging platforms with unified memory.',
                'Build custom tools, wire up MCP servers, and run autonomous scheduled workflows.',
            ],
            starterSteps: [
                'Install Hermes Agent with a single command and run your first conversation.',
                'Connect at least one messaging platform via the gateway before moving to advanced tools.',
                'Set up Ollama for free local inference before paying for any API keys.',
            ],
            availability: programAvailability.hermes,
            arsenalReadiness: programReadiness.hermes,
        }, 'hermes'),
        credential: {
            name: 'Hermes Agent Ops Completion Badge',
            requirements: [
                'Deploy a Hermes Agent.',
                'Connect at least one gateway.',
                'Document a working autonomous workflow.',
            ],
        },
        progress: {
            source: 'curriculum-sections',
            storageKeyPrefix: 'zenPrograms.hermes',
        },
        access: {
            programId: 'hermes',
            accessLevel: 'full',
            includedTiers: ['free', 'starter', 'builder', 'pro', 'educator', 'family', 'business', 'org'],
            previewTiers: ['free'],
            freePreview: true,
            lockedReason: 'Hermes Agent Ops is currently treated as free and open-source program access.',
            featureIds: ['self-hosted-agents', 'gateway-operations', 'local-llm-integration'],
        },
        availability: programAvailability.hermes,
        arsenalReadiness: programReadiness.hermes,
        coreOutput: 'A self-hosted Hermes agent with connected tools and workflow evidence.',
        keyOutcomes: ['Self-hosted agents', 'Gateway operations', 'Persistent memory', 'Tool orchestration'],
    },
];

export const programManifests: ProgramManifest[] = [
    vanguardProgramManifest,
    ...nonVanguardProgramManifests,
];

const flattenProgramSections = (sections: { subSections?: unknown[] }[]): unknown[] => (
    sections.reduce<unknown[]>((allSections, section) => {
        allSections.push(section);

        if (Array.isArray(section.subSections)) {
            allSections.push(...flattenProgramSections(section.subSections as { subSections?: unknown[] }[]));
        }

        return allSections;
    }, [])
);

const toProgramInfo = (card: ProgramDashboardCard): ProgramInfo => ({
    id: card.slug,
    programId: card.programId,
    slug: card.slug,
    name: card.name,
    description: card.description,
    route: card.route,
    ctaLabel: card.ctaLabel,
    isDisabled: card.isDisabled,
    status: card.status,
    featured: card.featured,
    accentColor: card.accentColor,
    badge: card.badge,
    icon: card.icon,
    audience: card.audience,
    level: card.level,
    duration: card.duration,
    spotlight: card.spotlight,
    skills: card.skills,
    outcomes: card.outcomes,
    starterSteps: card.starterSteps,
    access: card.access,
    availability: card.availability,
    arsenalReadiness: card.arsenalReadiness,
});

export const getProgramDashboardCards = (): ProgramDashboardCard[] => (
    programManifests.map((program) => program.dashboardCard)
);

export const programs: ProgramInfo[] = getProgramDashboardCards().map(toProgramInfo);

export const getProgramById = (id: string): ProgramInfo | undefined => {
    const manifest = programManifests.find((program) => (
        program.programId === id || program.slug === id || program.legacyIds?.includes(id)
    ));

    return manifest ? toProgramInfo(manifest.dashboardCard) : undefined;
};

export const getProgramManifestById = (id: string): ProgramManifest | undefined => (
    programManifests.find((program) => (
        program.programId === id || program.slug === id || program.legacyIds?.includes(id)
    ))
);

export const getProgramBySlug = (slug: string): ProgramInfo | undefined => {
    const manifest = programManifests.find((program) => program.slug === slug);
    return manifest ? toProgramInfo(manifest.dashboardCard) : undefined;
};

export const calculateTrackableItems = (programOrId: ProgramManifest | string): number => {
    const program = typeof programOrId === 'string' ? getProgramManifestById(programOrId) : programOrId;

    if (!program) {
        return 0;
    }

    if (program.progress.trackableItems !== undefined) {
        return program.progress.trackableItems;
    }

    if (program.progress.moduleTotals) {
        return Object.values(program.progress.moduleTotals).reduce((total, count) => total + count, 0);
    }

    if (program.progress.source === 'curriculum-sections') {
        const curriculum = getCurriculumByProgramId(program.slug);
        return curriculum ? flattenProgramSections(curriculum.sections).length : 0;
    }

    return 0;
};

export const calculateProgramProgress = (
    programOrId: ProgramManifest | string,
    completedItems: number,
): { completedItems: number; totalItems: number; percent: number } => {
    const totalItems = calculateTrackableItems(programOrId);
    const boundedCompletedItems = Math.max(0, Math.min(completedItems, totalItems));
    const percent = totalItems > 0 ? Math.round((boundedCompletedItems / totalItems) * 100) : 0;

    return {
        completedItems: boundedCompletedItems,
        totalItems,
        percent,
    };
};

export const getCredentialRequirements = (programOrId: ProgramManifest | string): string[] => {
    const program = typeof programOrId === 'string' ? getProgramManifestById(programOrId) : programOrId;
    return program?.credential.requirements ?? [];
};

export const getProgramAccessRequirement = (programOrId: ProgramManifest | string) => {
    const program = typeof programOrId === 'string' ? getProgramManifestById(programOrId) : programOrId;
    return program?.access;
};

type ProgramLookup = ProgramManifest | ProgramDashboardCard | ProgramInfo | string;
type UserLike = { email?: string | null } | null | undefined;

const getProgramLookupId = (program: Exclude<ProgramLookup, string>): string => {
    if ('programId' in program && program.programId) {
        return program.programId;
    }

    if ('slug' in program && program.slug) {
        return program.slug;
    }

    return 'id' in program ? program.id : '';
};

const getProgramManifestFromLookup = (programOrId: ProgramLookup): ProgramManifest | undefined => (
    typeof programOrId === 'string'
        ? getProgramManifestById(programOrId)
        : getProgramManifestById(getProgramLookupId(programOrId))
);

export const getProgramAvailability = (programOrId: ProgramLookup) => (
    typeof programOrId === 'string'
        ? getProgramManifestById(programOrId)?.availability
        : programOrId.availability ?? getProgramManifestFromLookup(programOrId)?.availability
);

export const getProgramArsenalReadiness = (programOrId: ProgramLookup) => (
    typeof programOrId === 'string'
        ? getProgramManifestById(programOrId)?.arsenalReadiness
        : programOrId.arsenalReadiness ?? getProgramManifestFromLookup(programOrId)?.arsenalReadiness
);

export const isProgramPubliclyAvailable = (programOrId: ProgramLookup): boolean => {
    const availability = getProgramAvailability(programOrId);

    if (!availability?.published) {
        return false;
    }

    return availability.availabilityStatus === 'available' || availability.availabilityStatus === 'private-beta';
};

export const canAdminPreviewProgram = (user: UserLike, programOrId: ProgramLookup): boolean => {
    const availability = getProgramAvailability(programOrId);
    return Boolean(availability?.adminPreviewEnabled && isAdminEmail(user?.email));
};

export const canOpenProgram = (user: UserLike, programOrId: ProgramLookup): boolean => (
    isProgramPubliclyAvailable(programOrId) || canAdminPreviewProgram(user, programOrId)
);

export const getAccentClasses = (color: ProgramInfo['accentColor']) => {
    const classes = {
        purple: {
            gradient: 'from-purple-500 via-purple-600 to-violet-600',
            bg: 'bg-purple-500',
            text: 'text-purple-400',
            border: 'border-purple-500/30',
            shadow: 'shadow-glowing',
            ring: 'ring-purple-500/20',
        },
        blue: {
            gradient: 'from-blue-500 via-blue-600 to-cyan-600',
            bg: 'bg-blue-500',
            text: 'text-blue-400',
            border: 'border-blue-500/30',
            shadow: 'shadow-glowing-blue',
            ring: 'ring-blue-500/20',
        },
        emerald: {
            gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
            bg: 'bg-emerald-500',
            text: 'text-emerald-400',
            border: 'border-emerald-500/30',
            shadow: 'shadow-glowing-green',
            ring: 'ring-emerald-500/20',
        },
        amber: {
            gradient: 'from-amber-500 via-amber-600 to-orange-600',
            bg: 'bg-amber-500',
            text: 'text-amber-400',
            border: 'border-amber-500/30',
            shadow: 'shadow-glowing-amber',
            ring: 'ring-amber-500/20',
        },
        cyan: {
            gradient: 'from-cyan-500 via-cyan-600 to-blue-600',
            bg: 'bg-cyan-500',
            text: 'text-cyan-400',
            border: 'border-cyan-500/30',
            shadow: 'shadow-glowing-cyan',
            ring: 'ring-cyan-500/20',
        },
        pink: {
            gradient: 'from-pink-500 via-pink-600 to-rose-600',
            bg: 'bg-pink-500',
            text: 'text-pink-400',
            border: 'border-pink-500/30',
            shadow: 'shadow-glowing',
            ring: 'ring-pink-500/20',
        },
        orange: {
            gradient: 'from-orange-500 via-orange-600 to-red-600',
            bg: 'bg-orange-500',
            text: 'text-orange-400',
            border: 'border-orange-500/30',
            shadow: 'shadow-glowing-amber',
            ring: 'ring-orange-500/20',
        },
    };

    return classes[color];
};
