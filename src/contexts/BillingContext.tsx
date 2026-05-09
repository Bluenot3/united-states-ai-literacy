import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getProgramAccessRequirement } from '../zen-programs/programsRegistry';
import {
    defaultUserEntitlementState,
    resolveProgramAccess,
    type EntitlementDecision,
    type ProgramEntitlement,
    type SubscriptionTier,
    type UserEntitlementState,
} from '../entitlements';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface BillingContextType {
    entitled: boolean;
    isAdminBypass: boolean;
    tier: SubscriptionTier;
    entitlementState: UserEntitlementState;
    billingStatus: string;
    loading: boolean;
    error: string | null;
    checkEntitlement: () => Promise<void>;
    adminBypass: (username: string, password: string) => Promise<boolean>;
    createCheckoutSession: (tier?: SubscriptionTier) => Promise<string | null>;
    clearAdminBypass: () => void;
    evaluateAccess: (programId: string) => EntitlementDecision;
    hasProgramAccess: (programId: string) => boolean;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);
const ADMIN_TOKEN_KEY = 'zenBillingAdminToken';
const LOCAL_PREVIEW_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);
const IS_LOCAL_PREVIEW_HOST = typeof window !== 'undefined' && LOCAL_PREVIEW_HOSTS.has(window.location.hostname);
const PREVIEW_BILLING_BYPASS_ENABLED = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_LOGIN === 'true' || IS_LOCAL_PREVIEW_HOST;
const SUBSCRIPTION_TIERS: SubscriptionTier[] = ['free', 'starter', 'builder', 'pro', 'educator', 'family', 'business', 'org'];

interface BillingStatusResponse {
    entitled?: boolean;
    is_admin?: boolean;
    tier?: string;
    subscription_tier?: string;
    billing_status?: string;
    program_entitlements?: ServerProgramEntitlement[];
}

interface ServerProgramEntitlement {
    programId?: string;
    program_id?: string;
    accessLevel?: ProgramEntitlement['accessLevel'];
    access_level?: ProgramEntitlement['accessLevel'];
    status?: ProgramEntitlement['status'];
    source?: ProgramEntitlement['source'];
    tier?: SubscriptionTier;
    startsAt?: string;
    starts_at?: string;
    expiresAt?: string | null;
    expires_at?: string | null;
    reason?: string;
    metadata?: ProgramEntitlement['metadata'];
}

const isSubscriptionTier = (value: unknown): value is SubscriptionTier => (
    typeof value === 'string' && SUBSCRIPTION_TIERS.includes(value as SubscriptionTier)
);

const deriveTier = (
    serverTier: string | undefined,
    entitled: boolean,
    isAdmin: boolean,
): SubscriptionTier => {
    if (isAdmin) {
        return 'pro';
    }

    if (isSubscriptionTier(serverTier)) {
        return serverTier;
    }

    return entitled ? 'pro' : 'free';
};

const mapProgramEntitlements = (grants: ServerProgramEntitlement[] | undefined): ProgramEntitlement[] => (
    (grants ?? []).reduce<ProgramEntitlement[]>((mappedGrants, grant) => {
        const programId = grant.programId ?? grant.program_id;

        if (!programId) {
            return mappedGrants;
        }

        const mappedGrant: ProgramEntitlement = {
            programId,
            accessLevel: grant.accessLevel ?? grant.access_level ?? 'full',
            status: grant.status ?? 'active',
            source: grant.source ?? 'manual',
            expiresAt: grant.expiresAt ?? grant.expires_at ?? null,
            metadata: grant.metadata ?? {},
        };

        if (grant.tier) {
            mappedGrant.tier = grant.tier;
        }

        const startsAt = grant.startsAt ?? grant.starts_at;
        if (startsAt) {
            mappedGrant.startsAt = startsAt;
        }

        if (grant.reason) {
            mappedGrant.reason = grant.reason;
        }

        mappedGrants.push(mappedGrant);
        return mappedGrants;
    }, [])
);

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [entitled, setEntitled] = useState(false);
    const [isAdminBypass, setIsAdminBypass] = useState(false);
    const [serverTier, setServerTier] = useState<SubscriptionTier | null>(null);
    const [billingStatus, setBillingStatus] = useState('inactive');
    const [programEntitlements, setProgramEntitlements] = useState<ProgramEntitlement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [adminToken, setAdminToken] = useState<string | null>(() => sessionStorage.getItem(ADMIN_TOKEN_KEY));

    const checkEntitlement = useCallback(async () => {
        if (PREVIEW_BILLING_BYPASS_ENABLED && user?.email) {
            setEntitled(true);
            setIsAdminBypass(false);
            setServerTier('pro');
            setBillingStatus('preview');
            setProgramEntitlements([]);
            setError(null);
            setLoading(false);
            return;
        }

        if (!user?.email) {
            setEntitled(false);
            setIsAdminBypass(false);
            setServerTier(null);
            setBillingStatus('inactive');
            setProgramEntitlements([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({ email: user.email });

            if (adminToken) {
                params.append('token', adminToken);
            }

            const response = await fetch(`${API_BASE}/api/billing/status?${params.toString()}`);
            const data = await response.json() as BillingStatusResponse;
            const nextEntitled = data.entitled === true;
            const nextIsAdmin = data.is_admin === true;
            const nextTier = deriveTier(data.subscription_tier ?? data.tier, nextEntitled, nextIsAdmin);

            setEntitled(nextEntitled);
            setIsAdminBypass(nextIsAdmin);
            setServerTier(nextTier);
            setBillingStatus(data.billing_status ?? (nextEntitled ? 'active' : 'inactive'));
            setProgramEntitlements(mapProgramEntitlements(data.program_entitlements));
        } catch (requestError) {
            console.error('Failed to check entitlement:', requestError);
            setError('Unable to check subscription status right now.');
            setEntitled(false);
            setIsAdminBypass(false);
            setServerTier(null);
            setBillingStatus('inactive');
            setProgramEntitlements([]);
        } finally {
            setLoading(false);
        }
    }, [adminToken, user?.email]);

    useEffect(() => {
        if (isAuthenticated && user?.email) {
            void checkEntitlement();
            return;
        }

        setEntitled(false);
        setIsAdminBypass(false);
        setServerTier(null);
        setBillingStatus('inactive');
        setProgramEntitlements([]);
        setLoading(false);
    }, [checkEntitlement, isAuthenticated, user?.email]);

    const adminBypass = useCallback(async (username: string, password: string): Promise<boolean> => {
        if (!user?.email) {
            return false;
        }

        try {
            setError(null);
            const response = await fetch(`${API_BASE}/api/admin/bypass`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password,
                    userEmail: user.email,
                }),
            });

            const data = await response.json();

            if (!data.success || !data.token) {
                setError(data.error || 'Admin bypass is unavailable.');
                return false;
            }

            setAdminToken(data.token);
            sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
            setIsAdminBypass(true);
            setEntitled(true);
            setServerTier('pro');
            setBillingStatus('admin_bypass');
            return true;
        } catch (requestError) {
            console.error('Admin bypass API error:', requestError);
            setError('Admin bypass is unavailable. Check the API server configuration.');
            return false;
        }
    }, [user?.email]);

    const createCheckoutSession = useCallback(async (tier?: SubscriptionTier): Promise<string | null> => {
        if (!user?.email) {
            return null;
        }

        try {
            setError(null);
            const response = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: user.email, tier }),
            });

            const data = await response.json();

            if (data.url) {
                return data.url;
            }

            setError(data.error || 'Failed to create checkout session.');
            return null;
        } catch (requestError) {
            console.error('Checkout session error:', requestError);
            setError('Failed to start checkout.');
            return null;
        }
    }, [user?.email]);

    const clearAdminBypass = useCallback(() => {
        setAdminToken(null);
        setIsAdminBypass(false);
        setServerTier(entitled ? 'pro' : null);
        setBillingStatus(entitled ? 'active' : 'inactive');
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    }, [entitled]);

    const tier = useMemo<SubscriptionTier>(() => (
        serverTier ?? (entitled ? 'pro' : 'free')
    ), [entitled, serverTier]);

    const entitlementState = useMemo<UserEntitlementState>(() => ({
        ...defaultUserEntitlementState,
        tier,
        isBillingEntitled: entitled,
        isAdmin: isAdminBypass,
        programEntitlements,
        featureEntitlements: [],
        source: PREVIEW_BILLING_BYPASS_ENABLED ? 'preview' : 'billing-context',
        updatedAt: null,
    }), [entitled, isAdminBypass, programEntitlements, tier]);

    const evaluateAccess = useCallback((programId: string): EntitlementDecision => {
        const requirement = getProgramAccessRequirement(programId);

        if (!requirement) {
            return {
                allowed: true,
                accessLevel: 'full',
                status: 'active',
                requiredTiers: [],
                matchedTier: tier,
                previewAvailable: true,
                locked: false,
                reason: 'No program access requirement is defined.',
            };
        }

        return resolveProgramAccess(requirement, entitlementState);
    }, [entitlementState, tier]);

    const hasProgramAccess = useCallback((programId: string): boolean => (
        evaluateAccess(programId).allowed
    ), [evaluateAccess]);

    const value: BillingContextType = {
        entitled,
        isAdminBypass,
        tier,
        entitlementState,
        billingStatus,
        loading,
        error,
        checkEntitlement,
        adminBypass,
        createCheckoutSession,
        clearAdminBypass,
        evaluateAccess,
        hasProgramAccess,
    };

    return (
        <BillingContext.Provider value={value}>
            {children}
        </BillingContext.Provider>
    );
};

export const useBilling = (): BillingContextType => {
    const context = useContext(BillingContext);

    if (!context) {
        throw new Error('useBilling must be used within a BillingProvider');
    }

    return context;
};

export { BillingContext };
