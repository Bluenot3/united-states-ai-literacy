import type {
    EntitlementDecision,
    ProgramAccessLevel,
    ProgramAccessRequirement,
    ProgramEntitlement,
    ProgramEntitlementStatus,
    SubscriptionTier,
    TierDefinition,
    TierId,
    UserEntitlementState,
} from './types';

const ACCESS_LEVEL_WEIGHT: Record<ProgramAccessLevel, number> = {
    none: 0,
    preview: 1,
    lite: 2,
    full: 3,
    admin: 4,
};

const ACTIVE_STATUSES: ProgramEntitlementStatus[] = ['active', 'trialing'];

export const tierDefinitions: Record<TierId, TierDefinition> = {
    free: {
        id: 'free',
        label: 'Free',
        description: 'Ecosystem dashboard, program previews, limited templates, and limited Arsenal access.',
        isPaid: false,
        rank: 0,
        programAccess: {
            hermes: 'full',
            'ai-pioneer': 'preview',
            vanguard: 'preview',
            'homeschool-kit': 'preview',
            'blockchain-literacy': 'preview',
            'train-the-trainer': 'preview',
            'arsenal-builder-labs': 'preview',
        },
        featureIds: ['ecosystem-dashboard', 'program-previews', 'limited-templates', 'limited-arsenal-access'],
        ctaLabel: 'Preview programs',
    },
    starter: {
        id: 'starter',
        label: 'Starter',
        description: 'AI Pioneer lite, basic templates, and limited agents.',
        isPaid: true,
        rank: 10,
        programAccess: {
            hermes: 'full',
            'ai-pioneer': 'lite',
            'blockchain-literacy': 'full',
            vanguard: 'preview',
            'homeschool-kit': 'preview',
            'train-the-trainer': 'preview',
            'arsenal-builder-labs': 'preview',
        },
        featureIds: ['ai-pioneer-lite', 'basic-templates', 'limited-agents'],
        ctaLabel: 'Start building',
    },
    builder: {
        id: 'builder',
        label: 'Builder',
        description: 'Full AI Pioneer, Hugging Face starter templates, portfolio resources, and Arsenal Builder Labs when active.',
        isPaid: true,
        rank: 20,
        programAccess: {
            hermes: 'full',
            'ai-pioneer': 'full',
            'blockchain-literacy': 'full',
            'arsenal-builder-labs': 'full',
            vanguard: 'preview',
            'homeschool-kit': 'preview',
            'train-the-trainer': 'preview',
        },
        featureIds: ['ai-pioneer-full', 'hugging-face-templates', 'portfolio-resources', 'builder-labs'],
        ctaLabel: 'Unlock Builder',
    },
    pro: {
        id: 'pro',
        label: 'Pro',
        description: 'Vanguard, advanced templates, automation labs, and advanced Arsenal tools.',
        isPaid: true,
        rank: 30,
        programAccess: {
            hermes: 'full',
            vanguard: 'full',
            'ai-pioneer': 'full',
            'blockchain-literacy': 'full',
            'arsenal-builder-labs': 'full',
            'homeschool-kit': 'preview',
            'train-the-trainer': 'preview',
        },
        featureIds: ['vanguard-full', 'advanced-templates', 'automation-labs', 'advanced-arsenal-tools'],
        ctaLabel: 'Upgrade to Pro',
    },
    educator: {
        id: 'educator',
        label: 'Educator',
        description: 'Train-the-Trainer, facilitator resources, rubrics, and cohort delivery materials.',
        isPaid: true,
        rank: 40,
        programAccess: {
            hermes: 'full',
            'train-the-trainer': 'full',
            'ai-pioneer': 'lite',
            'homeschool-kit': 'preview',
            'blockchain-literacy': 'full',
            vanguard: 'preview',
            'arsenal-builder-labs': 'preview',
        },
        featureIds: ['facilitator-resources', 'rubrics', 'cohort-delivery-materials'],
        ctaLabel: 'Unlock Educator',
    },
    family: {
        id: 'family',
        label: 'Family / Homeschool',
        description: 'Homeschool Kit, parent/facilitator guide, student records, and capstone materials.',
        isPaid: true,
        rank: 40,
        programAccess: {
            hermes: 'full',
            'homeschool-kit': 'full',
            'ai-pioneer': 'lite',
            'blockchain-literacy': 'full',
            vanguard: 'preview',
            'train-the-trainer': 'preview',
            'arsenal-builder-labs': 'preview',
        },
        featureIds: ['parent-guide', 'student-records', 'capstone-materials'],
        ctaLabel: 'Unlock Family',
    },
    business: {
        id: 'business',
        label: 'Business',
        description: 'Smart business automation materials, workflow agents, and team resources.',
        isPaid: true,
        rank: 50,
        programAccess: {
            hermes: 'full',
            vanguard: 'full',
            'arsenal-builder-labs': 'full',
            'blockchain-literacy': 'full',
            'ai-pioneer': 'preview',
            'homeschool-kit': 'preview',
            'train-the-trainer': 'preview',
        },
        featureIds: ['business-automation', 'workflow-agents', 'team-resources'],
        ctaLabel: 'Unlock Business',
    },
    org: {
        id: 'org',
        label: 'Org / Cohort',
        description: 'Bulk enrollment, cohort dashboards, reporting, and custom support.',
        isPaid: true,
        rank: 60,
        programAccess: {
            hermes: 'full',
            vanguard: 'full',
            'ai-pioneer': 'full',
            'homeschool-kit': 'full',
            'blockchain-literacy': 'full',
            'train-the-trainer': 'full',
            'arsenal-builder-labs': 'full',
        },
        featureIds: ['bulk-enrollment', 'cohort-dashboards', 'reporting', 'custom-support'],
        ctaLabel: 'Talk to ZEN',
        isOrgTier: true,
    },
};

export const defaultUserEntitlementState: UserEntitlementState = {
    tier: 'free',
    isBillingEntitled: false,
    isAdmin: false,
    programEntitlements: [],
    featureEntitlements: [],
    source: 'unknown',
    updatedAt: null,
};

export const getTierDefinition = (tier: SubscriptionTier): TierDefinition => tierDefinitions[tier];

export const isAccessLevelAtLeast = (
    actual: ProgramAccessLevel,
    required: ProgramAccessLevel,
): boolean => ACCESS_LEVEL_WEIGHT[actual] >= ACCESS_LEVEL_WEIGHT[required];

export const isProgramEntitlementActive = (entitlement: ProgramEntitlement): boolean => (
    ACTIVE_STATUSES.includes(entitlement.status)
);

export const getTierProgramAccess = (
    tier: SubscriptionTier,
    programId: string,
): ProgramAccessLevel => tierDefinitions[tier].programAccess[programId] ?? 'none';

export const resolveProgramAccess = (
    requirement: ProgramAccessRequirement,
    state: UserEntitlementState = defaultUserEntitlementState,
): EntitlementDecision => {
    const requiredAccessLevel = requirement.accessLevel;
    const explicitEntitlement = state.programEntitlements.find((entitlement) => (
        entitlement.programId === requirement.programId
    ));

    if (state.isAdmin) {
        return {
            allowed: true,
            accessLevel: 'admin',
            status: 'active',
            requiredTiers: requirement.includedTiers,
            matchedTier: state.tier,
            matchedEntitlement: explicitEntitlement,
            previewAvailable: true,
            locked: false,
            reason: 'Admin access grants all program access.',
            upgradeTier: requirement.upgradeTier,
        };
    }

    if (explicitEntitlement?.status === 'revoked') {
        return {
            allowed: false,
            accessLevel: 'none',
            status: 'revoked',
            requiredTiers: requirement.includedTiers,
            matchedEntitlement: explicitEntitlement,
            previewAvailable: false,
            locked: true,
            reason: explicitEntitlement.reason ?? requirement.lockedReason ?? 'Program access has been revoked.',
            upgradeTier: requirement.upgradeTier,
        };
    }

    if (explicitEntitlement && isProgramEntitlementActive(explicitEntitlement)) {
        const allowed = isAccessLevelAtLeast(explicitEntitlement.accessLevel, requiredAccessLevel);

        return {
            allowed,
            accessLevel: explicitEntitlement.accessLevel,
            status: explicitEntitlement.status,
            requiredTiers: requirement.includedTiers,
            matchedEntitlement: explicitEntitlement,
            previewAvailable: allowed || explicitEntitlement.accessLevel === 'preview' || explicitEntitlement.accessLevel === 'lite',
            locked: !allowed,
            reason: allowed
                ? 'Explicit program entitlement grants access.'
                : requirement.lockedReason ?? 'Program requires a higher access level.',
            upgradeTier: requirement.upgradeTier,
        };
    }

    const tierAccessLevel = getTierProgramAccess(state.tier, requirement.programId);
    const tierIncluded = requirement.includedTiers.includes(state.tier);
    const allowed = tierIncluded && isAccessLevelAtLeast(tierAccessLevel, requiredAccessLevel);
    const previewAvailable = allowed
        || requirement.freePreview === true
        || requirement.previewTiers?.includes(state.tier) === true
        || tierAccessLevel === 'preview'
        || tierAccessLevel === 'lite';

    return {
        allowed,
        accessLevel: allowed ? tierAccessLevel : previewAvailable ? tierAccessLevel === 'none' ? 'preview' : tierAccessLevel : 'none',
        status: allowed ? 'active' : previewAvailable ? 'preview' : 'inactive',
        requiredTiers: requirement.includedTiers,
        matchedTier: allowed || previewAvailable ? state.tier : undefined,
        previewAvailable,
        locked: !allowed,
        reason: allowed
            ? `${tierDefinitions[state.tier].label} includes this program.`
            : requirement.lockedReason ?? 'Program requires a different subscription tier.',
        upgradeTier: requirement.upgradeTier,
    };
};
