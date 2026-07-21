import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE = import.meta.env.DEV
    ? RAW_API_BASE || 'http://localhost:3001'
    : /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(RAW_API_BASE)
        ? ''
        : RAW_API_BASE;
type CheckoutProgramKey = 'pioneer' | 'vanguard';

interface BillingContextType {
    entitled: boolean;
    isAdminBypass: boolean;
    loading: boolean;
    error: string | null;
    checkEntitlement: () => Promise<boolean>;
    adminBypass: (username: string, password: string) => Promise<boolean>;
    createCheckoutSession: (programKey: CheckoutProgramKey, returnPath?: string) => Promise<string | null>;
    clearAdminBypass: () => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);
const ADMIN_TOKEN_KEY = 'zenBillingAdminToken';

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated, isAdmin, adminLoading } = useAuth();
    const [entitled, setEntitled] = useState(false);
    const [isAdminBypass, setIsAdminBypass] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [adminToken, setAdminToken] = useState<string | null>(() => sessionStorage.getItem(ADMIN_TOKEN_KEY));

    const readSupabaseEntitlement = useCallback(async (): Promise<boolean> => {
        if (!user?.id) {
            return false;
        }

        const { data, error: entitlementError } = await supabase
            .from('program_entitlements')
            .select('status,access_starts_at,access_ends_at')
            .eq('user_id', user.id)
            .in('status', ['active', 'trialing']);

        if (entitlementError) {
            console.warn('Supabase entitlement check failed:', entitlementError);
            return false;
        }

        const now = Date.now();
        return (data ?? []).some((row) => (
            (!row.access_starts_at || Date.parse(row.access_starts_at) <= now)
            && (!row.access_ends_at || Date.parse(row.access_ends_at) > now)
        ));
    }, [user?.id]);

    const checkEntitlement = useCallback(async (): Promise<boolean> => {
        if (!user?.email) {
            setEntitled(false);
            setIsAdminBypass(false);
            setLoading(false);
            return false;
        }

        if (adminLoading) {
            setLoading(true);
            return false;
        }

        if (isAdmin) {
            setEntitled(true);
            setIsAdminBypass(true);
            setError(null);
            setLoading(false);
            return true;
        }

        if (import.meta.env.DEV && user.email === 'preview@zenai.world') {
            setEntitled(true);
            setIsAdminBypass(true);
            setLoading(false);
            return true;
        }

        setLoading(true);
        setError(null);

        try {
            if (!API_BASE) {
                const directEntitled = await readSupabaseEntitlement();
                setEntitled(directEntitled);
                setIsAdminBypass(false);
                return directEntitled;
            }

            const params = new URLSearchParams({ email: user.email });

            if (adminToken) {
                params.append('token', adminToken);
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) throw new Error('Supabase session token unavailable.');
            const response = await fetch(`${API_BASE}/api/billing/status?${params.toString()}`, {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            const data = await response.json();
            const nextEntitled = data.entitled === true;

            setEntitled(nextEntitled);
            setIsAdminBypass(data.is_admin === true);
            return nextEntitled;
        } catch (requestError) {
            console.error('Failed to check entitlement:', requestError);
            const directEntitled = await readSupabaseEntitlement();
            setError(null);
            setEntitled(directEntitled);
            setIsAdminBypass(false);
            return directEntitled;
        } finally {
            setLoading(false);
        }
    }, [adminLoading, adminToken, isAdmin, readSupabaseEntitlement, user?.email]);

    useEffect(() => {
        if (adminLoading) {
            setLoading(true);
            return;
        }

        if (isAuthenticated && user?.email) {
            void checkEntitlement();
            return;
        }

        setEntitled(false);
        setIsAdminBypass(false);
        setLoading(false);
    }, [adminLoading, checkEntitlement, isAuthenticated, user?.email]);

    const adminBypass = useCallback(async (username: string, password: string): Promise<boolean> => {
        if (!user?.email) {
            return false;
        }

        if (!API_BASE) {
            setError('Internal admin access requires the API service. Signed-in admin emails can continue without this form.');
            return false;
        }

        try {
            setError(null);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                setError('Your Supabase session has expired. Sign in again.');
                return false;
            }
            const response = await fetch(`${API_BASE}/api/admin/bypass`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    username,
                    password,
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
            return true;
        } catch (requestError) {
            console.error('Admin bypass API error:', requestError);
            setError('Admin bypass is unavailable. Check the API server configuration.');
            return false;
        }
    }, [user?.email]);

    const createCheckoutSession = useCallback(async (
        programKey: CheckoutProgramKey,
        returnPath?: string,
    ): Promise<string | null> => {
        if (!user?.email) {
            const currentPath = typeof window !== 'undefined'
                ? `${window.location.pathname}${window.location.search}`
                : '/paywall';
            const loginReturnPath = currentPath.startsWith('/') && !currentPath.startsWith('//')
                ? currentPath
                : '/paywall';
            setError('Sign in before checkout so program access can attach to your account.');
            return `/login?return_to=${encodeURIComponent(loginReturnPath)}`;
        }

        if (adminLoading) {
            setError('Your account access is still loading. Please try again.');
            return null;
        }

        if (isAdmin) {
            setEntitled(true);
            setIsAdminBypass(true);
            setError(null);
            return returnPath && returnPath.startsWith('/') ? returnPath : '/programs';
        }

        if (!API_BASE) {
            setError('Secure checkout is temporarily unavailable. No payment was taken.');
            return null;
        }

        try {
            setError(null);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) throw new Error('Supabase session token unavailable.');
            const response = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    programKey,
                    returnPath,
                }),
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
    }, [adminLoading, isAdmin, user?.email]);

    const clearAdminBypass = useCallback(() => {
        setAdminToken(null);
        setIsAdminBypass(false);
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    }, []);

    const value: BillingContextType = {
        entitled,
        isAdminBypass,
        loading,
        error,
        checkEntitlement,
        adminBypass,
        createCheckoutSession,
        clearAdminBypass,
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
