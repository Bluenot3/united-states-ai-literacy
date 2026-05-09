import {
    vanguardCanonicalSections,
    vanguardCompletionHookTodos,
    vanguardCrossModuleDependencies,
    vanguardManifest,
    vanguardMiniApps,
    vanguardWrapperSections,
} from '../manifests/vanguardManifest';
import type { ProgramManifest } from '../types';

const vanguardLessonCount = vanguardManifest.modules.reduce((moduleTotal, module) => (
    moduleTotal + module.sections.reduce((sectionTotal, section) => sectionTotal + section.lessons.length, 0)
), 0);

const vanguardTrackableItems = Object.values(vanguardManifest.trackableTotals).reduce(
    (total, count) => total + count,
    0,
);

const vanguardAvailability = {
    availabilityStatus: 'private-beta',
    published: true,
    adminPreviewEnabled: true,
    publicLabel: 'Private Beta',
    adminLabel: 'Published Private Beta',
    publishControlsEnabled: false,
    arsenalReadyStatus: 'merge-ready',
    arsenalMergeNotes: [
        'Vanguard is stabilized through the bridge manifest and should remain a staged ZEN program until Arsenal ingestion is explicitly started.',
        'Wrapper sections, completion modes, trackable totals, and CREDS dry-run boundaries are manifest-backed.',
    ],
} satisfies ProgramManifest['availability'];

const vanguardArsenalReadiness = {
    contentStatus: 'Manifest-backed Vanguard curriculum stabilized',
    entitlementStatus: 'Pro/Business/Org metadata active; no hard route gate',
    billingStatus: 'Tier foundation prepared; legacy entitlement compatibility preserved',
    routeStatus: '/dashboard and /module/1-4 preserved',
    publicAvailability: 'Private beta',
    mergeReadinessNotes: [
        '4 modules and 8 canonical sections are represented in the Vanguard manifest.',
        'Trackable totals are manifest-backed at 38 / 27 / 25 / 24.',
        'CREDS remains a dry-run credential simulation, not a production issuer pipeline.',
    ],
} satisfies ProgramManifest['arsenalReadiness'];

export const vanguardProgramManifest: ProgramManifest = {
    programId: 'vanguard',
    slug: 'vanguard',
    legacyIds: [],
    name: 'ZEN Vanguard',
    description: 'Professional operator track for adults, career changers, and technical builders.',
    audience: 'Adults, workforce learners, founders, operators',
    level: 'Intermediate to advanced',
    duration: '4 modules, self-paced',
    status: 'active',
    featured: true,
    sourceOfTruth: 'vanguardManifest',
    route: {
        primary: '/dashboard',
        dashboard: '/dashboard',
        curriculum: '/module/1',
    },
    dashboardCard: {
        id: 'vanguard',
        programId: 'vanguard',
        slug: 'vanguard',
        name: 'ZEN Vanguard',
        description: 'Professional operator track for adults, career changers, and technical builders.',
        route: '/dashboard',
        ctaLabel: 'Open Vanguard Dashboard',
        isDisabled: false,
        status: 'active',
        featured: true,
        accentColor: 'purple',
        badge: 'Flagship',
        icon: 'VA',
        audience: 'Adults, workforce learners, founders, operators',
        level: 'Intermediate to advanced',
        duration: '4 modules, self-paced',
        spotlight: 'From AI user to production-minded deployer.',
        skills: ['AI foundations', 'Agents and automation', 'Deployment patterns', 'Governance'],
        outcomes: [
            'Build a durable mental model of how modern AI systems work.',
            'Design tool-using agents and simple automations with human review.',
            'Ship projects with better security, evaluation, and delivery discipline.',
        ],
        starterSteps: [
            'Read the Starter Guide to learn the shared language of AI, LLMs, and automation.',
            'Pick one module and finish it end-to-end before exploring everything else.',
            'Treat every lab like a production exercise: define the goal, build, test, document.',
        ],
        availability: vanguardAvailability,
        arsenalReadiness: vanguardArsenalReadiness,
    },
    credential: {
        name: 'ZEN Vanguard Intelligence Architect Certificate',
        description: vanguardManifest.credentialBoundary,
        requirements: [
            'Complete all four Vanguard modules.',
            'Complete module-level tracked sections and required portfolio artifacts.',
            'Use CREDS as dry-run credential simulation until production issuer infrastructure exists.',
        ],
        dryRunOnly: true,
    },
    progress: {
        source: 'vanguard-manifest',
        trackableItems: vanguardTrackableItems,
        moduleTotals: vanguardManifest.trackableTotals,
        storageKeyPrefix: 'vanguard',
    },
    access: {
        programId: 'vanguard',
        accessLevel: 'full',
        includedTiers: ['pro', 'business', 'org'],
        previewTiers: ['free', 'starter', 'builder', 'educator', 'family'],
        freePreview: true,
        upgradeTier: 'pro',
        lockedReason: 'Vanguard is the Pro operator track, with Business and Org access available for teams.',
        featureIds: ['vanguard-full', 'advanced-templates', 'automation-labs', 'advanced-arsenal-tools'],
        notes: ['Metadata only; current routes remain ungated until the entitlement guard pass.'],
    },
    availability: vanguardAvailability,
    arsenalReadiness: vanguardArsenalReadiness,
    coreOutput: 'Production-minded AI systems portfolio with module artifacts, governance notes, and dry-run credential evidence.',
    keyOutcomes: [
        'Technical intuition for AI systems behavior and failure modes.',
        'RAG, agents, automation, and governance execution patterns.',
        'Professional portfolio artifacts backed by explicit progress totals.',
    ],
    notes: [
        vanguardManifest.bridgePurpose,
        vanguardManifest.credentialBoundary,
    ],
    metadata: {
        moduleCount: vanguardManifest.modules.length,
        canonicalSectionCount: vanguardCanonicalSections.length,
        wrapperSectionCount: vanguardWrapperSections.length,
        lessonCount: vanguardLessonCount,
        miniAppCount: vanguardMiniApps.length,
        completionHookTodoCount: vanguardCompletionHookTodos.length,
        crossModuleDependencyCount: vanguardCrossModuleDependencies.length,
        mergeBlockers: vanguardManifest.mergeBlockers,
        credentialBoundary: vanguardManifest.credentialBoundary,
    },
};
