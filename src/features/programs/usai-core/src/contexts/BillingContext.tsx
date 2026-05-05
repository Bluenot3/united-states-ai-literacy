import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface BillingContextType {
    entitled: boolean;
    isAdminBypass: boolean;
    loading: boolean;
    error: string | null;
    checkEntitlement: () => Promise<void>;
    adminBypass: (username: string, password: string) => Promise<boolean>;
    createCheckoutSession: () => Promise<string | null>;
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

    const checkEntitlement = useCallback(async () => {
        if (!user?.email) {
            setEntitled(false);
            setIsAdminBypass(false);
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
            const data = await response.json();

            setEntitled(data.entitled === true);
            setIsAdminBypass(data.is_admin === true);
        } catch (requestError) {
            console.error('Failed to check entitlement:', requestError);
            setError('Unable to check subscription status right now.');
            setEntitled(false);
            setIsAdminBypass(false);
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
            return true;
        } catch (requestError) {
            console.error('Admin bypass API error:', requestError);
            setError('Admin bypass is unavailable. Check the API server configuration.');
            return false;
        }
    }, [user?.email]);

    const createCheckoutSession = useCallback(async (): Promise<string | null> => {
        if (!user?.email) {
            return null;
        }

        try {
            setError(null);
            const response = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: user.email }),
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
