import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================
// SIMPLE LIGHT/DARK MODE SYSTEM
// ============================================

export type ThemeMode = 'light' | 'dark';

export interface Settings {
    mode: ThemeMode;
    reducedMotion: boolean;
    soundEnabled: boolean;
    compactMode: boolean;
    highContrast: boolean;
    visionMode: boolean; // Enhanced Visibility
}

const defaultSettings: Settings = {
    mode: 'light',
    reducedMotion: false,
    soundEnabled: true,
    compactMode: false,
    highContrast: false,
    visionMode: false,
};

// ============================================
// CONTEXT
// ============================================

interface ThemeContextType {
    mode: ThemeMode;
    settings: Settings;
    toggleMode: () => void;
    setMode: (mode: ThemeMode) => void;
    updateSettings: (updates: Partial<Settings>) => void;
    isSettingsOpen: boolean;
    openSettings: () => void;
    closeSettings: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(() => {
        const saved = localStorage.getItem('zen-vanguard-settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    });
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const isDark = settings.mode === 'dark';

    // Apply theme mode to document
    useEffect(() => {
        const root = document.documentElement;

        if (isDark) {
            root.classList.add('dark');
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            root.classList.remove('dark');
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }

        // Apply reduced motion if enabled
        if (settings.reducedMotion) {
            root.classList.add('reduce-motion');
        } else {
            root.classList.remove('reduce-motion');
        }

        // Apply compact mode
        if (settings.compactMode) {
            root.classList.add('compact-mode');
        } else {
            root.classList.remove('compact-mode');
        }

        // Apply High Contrast Mode
        if (settings.highContrast) {
            root.classList.add('high-contrast');
            document.body.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
            document.body.classList.remove('high-contrast');
        }

        // Apply Enhanced Visibility (Vision Mode)
        if (settings.visionMode) {
            root.classList.add('vision-mode');
            document.body.classList.add('vision-mode');
        } else {
            root.classList.remove('vision-mode');
            document.body.classList.remove('vision-mode');
        }
    }, [isDark, settings.reducedMotion, settings.compactMode, settings.highContrast, settings.visionMode]);

    // Persist settings
    useEffect(() => {
        localStorage.setItem('zen-vanguard-settings', JSON.stringify(settings));
    }, [settings]);

    const toggleMode = () => {
        setSettings(prev => ({ ...prev, mode: prev.mode === 'light' ? 'dark' : 'light' }));
    };

    const setMode = (mode: ThemeMode) => {
        setSettings(prev => ({ ...prev, mode }));
    };

    const updateSettings = (updates: Partial<Settings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    };

    const openSettings = () => setIsSettingsOpen(true);
    const closeSettings = () => setIsSettingsOpen(false);

    return (
        <ThemeContext.Provider value={{
            mode: settings.mode,
            settings,
            toggleMode,
            setMode,
            updateSettings,
            isSettingsOpen,
            openSettings,
            closeSettings,
            isDark,
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

// ============================================
// HOOK
// ============================================

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
