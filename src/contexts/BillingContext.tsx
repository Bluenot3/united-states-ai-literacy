import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { isAdminEmail } from '../services/adminAccess';

const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE = import.meta.env.DEV
    ? RAW_API_BASE || 'http://localhost:3001'
    : /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(RAW_API_BASE)
        ? ''
        : RAW_API_BASE;
const STRIPE_PAYMENT_LINKS = {
    vanguard: import.meta.env.VITE_STRIPE_VANGUARD_PAYMENT_LINK_URL || 'https://buy.stripe.com/5kQ4gze1Og8R31a3V9gEg09',
    pioneer: import.meta.env.VITE_STRIPE_AI_PIONEER_PAYMENT_LINK_URL || 'https://buy.stripe.com/dRmbJ16zmbSBgS063hgEg0a',
};

interface BillingContextType {
    entitled: boolean;
    isAdminBypass: boolean;
    loading: boolean;
    error: string | null;
    checkEntitlement: () => Promise<boolean>;
    adminBypass: (username: string, password: string) => Promise<boolean>;
    createCheckoutSession: (returnPath?: string) => Promise<string | null>;
    clearAdminBypass: () => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);
const ADMIN_TOKEN_KEY = 'zenBillingAdminToken';

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [entitled, setEntitled] = useState(false);
    const [isAdminBypass, setIsAdminBypass] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [adminToken, setAdminToken] = useState<string | null>(() => sessionStorage.getItem(ADMIN_TOKEN_KEY));

    const readSupabaseEntitlement = useCallback(async (): Promise<boolean> => {
        if (!user?.id) {
            return false;
        }

        const { data, error: profileError } = await supabase
            .from('user_profiles')
            .select('is_entitled')
            .eq('id', user.id)
            .maybeSingle();

        if (profileError) {
            console.warn('Supabase entitlement check failed:', profileError);
            return false;
        }

        return data?.is_entitled === true;
    }, [user?.id]);

    const checkEntitlement = useCallback(async (): Promise<boolean> => {
        if (!user?.email) {
            setEntitled(false);
            setIsAdminBypass(false);
            setLoading(false);
            return false;
        }

        if (isAdminEmail(user.email)) {
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

        if (sessionStorage.getItem('zen_arsenal_embedded') === 'true') {
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

            const response = await fetch(`${API_BASE}/api/billing/status?${params.toString()}`);
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
    }, [adminToken, readSupabaseEntitlement, user?.email]);

    useEffect(() => {
        if (isAuthenticated && user?.email) {
            void checkEntitlement();
            return;
        }

        setEntitled(false);
        setIsAdminBypass(false);
        setLoading(false);
    }, [checkEntitlement, isAuthenticated, user?.email]);

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
            return true;
        } catch (requestError) {
            console.error('Admin bypass API error:', requestError);
            setError('Admin bypass is unavailable. Check the API server configuration.');
            return false;
        }
    }, [user?.email]);

    const getPaymentLinkForPath = useCallback((returnPath?: string): string | null => {
        const normalizedPath = returnPath?.toLowerCase() ?? '';

        if (normalizedPath.includes('/pioneer') || normalizedPath.includes('/ai-pioneer')) {
            return STRIPE_PAYMENT_LINKS.pioneer;
        }

        if (normalizedPath.includes('/vanguard')) {
            return STRIPE_PAYMENT_LINKS.vanguard;
        }

        return STRIPE_PAYMENT_LINKS.vanguard || STRIPE_PAYMENT_LINKS.pioneer || null;
    }, []);

    const createCheckoutSession = useCallback(async (returnPath?: string): Promise<string | null> => {
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

        if (isAdminEmail(user.email)) {
            setEntitled(true);
            setIsAdminBypass(true);
            setError(null);
            return returnPath && returnPath.startsWith('/') ? returnPath : '/programs';
        }

        if (!API_BASE) {
            const fallbackLink = getPaymentLinkForPath(returnPath);
            if (fallbackLink) {
                setError(null);
                return fallbackLink;
            }

            setError('Checkout is not configured for this program yet.');
            return null;
        }

        try {
            setError(null);
            const programKey = (() => {
                const p = (returnPath || '').toLowerCase();
                if (p.includes('/pioneer') || p.includes('/ai-pioneer')) return 'pioneer';
                if (p.includes('/vanguard') || p.startsWith('/dashboard') || p.startsWith('/module')) return 'vanguard';
                return null;
            })();
            const response = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail: user.email,
                    userId: user.id,
                    programKey,
                    returnPath,
                }),
            });

            const data = await response.json();

            if (data.url) {
                return data.url;
            }

            const fallbackLink = getPaymentLinkForPath(returnPath);
            if (fallbackLink) {
                return fallbackLink;
            }

            setError(data.error || 'Failed to create checkout session.');
            return null;
        } catch (requestError) {
            console.error('Checkout session error:', requestError);
            const fallbackLink = getPaymentLinkForPath(returnPath);
            if (fallbackLink) {
                setError(null);
                return fallbackLink;
            }

            setError('Failed to start checkout.');
            return null;
        }
    }, [getPaymentLinkForPath, user?.email]);

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
