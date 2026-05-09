export type SubscriptionTier =
    | 'free'
    | 'starter'
    | 'builder'
    | 'pro'
    | 'educator'
    | 'family'
    | 'business'
    | 'org';

export type TierId = SubscriptionTier;

export type ProgramAccessLevel = 'none' | 'preview' | 'lite' | 'full' | 'admin';

export type ProgramEntitlementStatus =
    | 'active'
    | 'trialing'
    | 'inactive'
    | 'expired'
    | 'revoked'
    | 'preview';

export type EntitlementSource =
    | 'tier'
    | 'stripe'
    | 'admin'
    | 'cohort'
    | 'legacy'
    | 'preview'
    | 'manual';

export interface ProgramEntitlement {
    programId: string;
    accessLevel: ProgramAccessLevel;
    status: ProgramEntitlementStatus;
    source: EntitlementSource;
    tier?: SubscriptionTier;
    startsAt?: string;
    expiresAt?: string | null;
    reason?: string;
    metadata?: Record<string, string | number | boolean | null>;
}

export interface FeatureEntitlement {
    featureId: string;
    status: ProgramEntitlementStatus;
    source: EntitlementSource;
    tier?: SubscriptionTier;
    startsAt?: string;
    expiresAt?: string | null;
    limit?: number | null;
    metadata?: Record<string, string | number | boolean | null>;
}

export interface UserEntitlementState {
    tier: SubscriptionTier;
    isBillingEntitled: boolean;
    isAdmin: boolean;
    programEntitlements: ProgramEntitlement[];
    featureEntitlements: FeatureEntitlement[];
    source: 'billing-context' | 'server' | 'preview' | 'local' | 'unknown';
    updatedAt?: string | null;
}

export interface EntitlementDecision {
    allowed: boolean;
    accessLevel: ProgramAccessLevel;
    status: ProgramEntitlementStatus;
    requiredTiers: SubscriptionTier[];
    matchedTier?: SubscriptionTier;
    matchedEntitlement?: ProgramEntitlement;
    previewAvailable: boolean;
    locked: boolean;
    reason: string;
    upgradeTier?: SubscriptionTier;
}

export interface ProgramAccessRequirement {
    programId: string;
    accessLevel: ProgramAccessLevel;
    includedTiers: SubscriptionTier[];
    previewTiers?: SubscriptionTier[];
    freePreview?: boolean;
    upgradeTier?: SubscriptionTier;
    lockedReason?: string;
    featureIds?: string[];
    notes?: string[];
}

export interface TierDefinition {
    id: TierId;
    label: string;
    description: string;
    isPaid: boolean;
    rank: number;
    programAccess: Record<string, ProgramAccessLevel>;
    featureIds: string[];
    ctaLabel?: string;
    isOrgTier?: boolean;
}
