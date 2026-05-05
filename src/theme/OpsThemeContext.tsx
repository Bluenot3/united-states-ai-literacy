import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { opsCssVars } from './ops-tokens';

interface OpsThemeContextType {
    isOpsMode: boolean;
    toggleOpsMode: () => void;
    enableOpsMode: () => void;
    disableOpsMode: () => void;
}

const OpsThemeContext = createContext<OpsThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'zen-ops-mode';

export const OpsThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpsMode, setIsOpsMode] = useState(() => {
        // Initialize from localStorage
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored === 'true';
        }
        return false;
    });

    // Apply/remove ops-mode class and CSS variables
    useEffect(() => {
        const html = document.documentElement;

        if (isOpsMode) {
            html.classList.add('ops-mode');
            // Apply CSS variables
            Object.entries(opsCssVars).forEach(([key, value]) => {
                html.style.setProperty(key, value);
            });
        } else {
            html.classList.remove('ops-mode');
            // Remove CSS variables
            Object.keys(opsCssVars).forEach((key) => {
                html.style.removeProperty(key);
            });
        }

        // Persist to localStorage
        localStorage.setItem(STORAGE_KEY, String(isOpsMode));
    }, [isOpsMode]);

    const toggleOpsMode = useCallback(() => {
        setIsOpsMode(prev => !prev);
    }, []);

    const enableOpsMode = useCallback(() => {
        setIsOpsMode(true);
    }, []);

    const disableOpsMode = useCallback(() => {
        setIsOpsMode(false);
    }, []);

    return (
        <OpsThemeContext.Provider value={{ isOpsMode, toggleOpsMode, enableOpsMode, disableOpsMode }}>
            {children}
        </OpsThemeContext.Provider>
    );
};

export const useOpsTheme = (): OpsThemeContextType => {
    const context = useContext(OpsThemeContext);
    if (!context) {
        throw new Error('useOpsTheme must be used within an OpsThemeProvider');
    }
    return context;
};

// Optional hook that doesn't throw if outside provider (for gradual adoption)
export const useOpsThemeSafe = (): OpsThemeContextType | null => {
    return useContext(OpsThemeContext) ?? null;
};

export default OpsThemeContext;
