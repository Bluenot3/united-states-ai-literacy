import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useOpsThemeSafe } from '../theme/OpsThemeContext';

// ============================================
// SETTINGS PANEL - SIMPLIFIED WITH LIGHT/DARK MODE
// ============================================

const SettingsPanel: React.FC = () => {
    const { mode, settings, toggleMode, updateSettings, isSettingsOpen, closeSettings, isDark } = useTheme();
    const opsTheme = useOpsThemeSafe();
    const panelRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeSettings();
        };
        if (isSettingsOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isSettingsOpen, closeSettings]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                closeSettings();
            }
        };
        if (isSettingsOpen) {
            setTimeout(() => window.addEventListener('click', handleClickOutside), 100);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [isSettingsOpen, closeSettings]);

    if (!isSettingsOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with animated blur */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md animate-fade-in" />

            {/* Settings Panel */}
            <div
                ref={panelRef}
                className={`relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl animate-spring-in ${isDark
                    ? 'bg-slate-900/95 border border-slate-700/50'
                    : 'bg-white/95 border border-slate-200/50'
                    }`}
                style={{ backdropFilter: 'blur(40px)' }}
            >
                {/* Header */}
                <div className={`sticky top-0 z-10 px-8 py-6 border-b ${isDark ? 'border-slate-700/50 bg-slate-900/95' : 'border-slate-200/50 bg-white/95'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Settings
                            </h2>
                            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Customize your experience
                            </p>
                        </div>
                        <button
                            onClick={closeSettings}
                            className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">

                    {/* Appearance Section */}
                    <section>
                        <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            <span className="text-2xl">🎨</span>
                            Appearance
                        </h3>
                        <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Choose your preferred color scheme
                        </p>

                        {/* Light/Dark Mode Toggle */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Light Mode Card */}
                            <button
                                onClick={() => toggleMode()}
                                className={`relative p-6 rounded-2xl text-left transition-all duration-300 group overflow-hidden ${!isDark
                                    ? 'ring-2 ring-brand-primary ring-offset-2 scale-[1.02] bg-gradient-to-br from-slate-50 to-white'
                                    : 'bg-slate-800 hover:bg-slate-750 hover:scale-[1.01]'
                                    }`}
                            >
                                {/* Active indicator */}
                                {!isDark && (
                                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center animate-spring-in">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}

                                {/* Sun icon */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${!isDark ? 'bg-amber-100 text-amber-500' : 'bg-slate-700 text-slate-400'
                                    }`}>
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>

                                <h4 className={`font-bold text-base mb-1 ${!isDark ? 'text-slate-900' : 'text-slate-300'}`}>
                                    Light Mode
                                </h4>
                                <p className={`text-xs leading-relaxed ${!isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                    Clean and bright interface
                                </p>
                            </button>

                            {/* Dark Mode Card */}
                            <button
                                onClick={() => toggleMode()}
                                className={`relative p-6 rounded-2xl text-left transition-all duration-300 group overflow-hidden ${isDark
                                    ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900 scale-[1.02] bg-gradient-to-br from-slate-800 to-slate-900'
                                    : 'bg-slate-100 hover:bg-slate-150 hover:scale-[1.01]'
                                    }`}
                            >
                                {/* Active indicator */}
                                {isDark && (
                                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center animate-spring-in">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}

                                {/* Moon icon */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-200 text-slate-500'
                                    }`}>
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                </div>

                                <h4 className={`font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-slate-700'}`}>
                                    Dark Mode
                                </h4>
                                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Easy on the eyes at night
                                </p>
                            </button>
                        </div>
                    </section>

                    {/* Divider */}
                    <div className={`h-px ${isDark ? 'bg-slate-700/50' : 'bg-slate-200'}`} />

                    {/* Preferences */}
                    <section>
                        <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            <span className="text-2xl">⚙️</span>
                            Preferences
                        </h3>
                        <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Fine-tune your learning environment
                        </p>

                        <div className="space-y-4">
                            {/* Reduced Motion Toggle */}
                            <SettingsToggle
                                label="Reduce Motion"
                                description="Minimize animations for accessibility"
                                icon="🎯"
                                enabled={settings.reducedMotion}
                                onChange={(val) => updateSettings({ reducedMotion: val })}
                                isDark={isDark}
                            />

                            {/* Sound Toggle */}
                            <SettingsToggle
                                label="Sound Effects"
                                description="Play audio feedback for interactions"
                                icon="🔊"
                                enabled={settings.soundEnabled}
                                onChange={(val) => updateSettings({ soundEnabled: val })}
                                isDark={isDark}
                            />

                            {/* Compact Mode Toggle */}
                            <SettingsToggle
                                label="Compact Mode"
                                description="Reduce spacing for more content"
                                icon="📐"
                                enabled={settings.compactMode}
                                onChange={(val) => updateSettings({ compactMode: val })}
                                isDark={isDark}
                            />

                            {/* High Contrast Mode Toggle */}
                            <SettingsToggle
                                label="High Contrast"
                                description="Maximize contrast for readability"
                                icon="🌗"
                                enabled={settings.highContrast}
                                onChange={(val) => updateSettings({ highContrast: val })}
                                isDark={isDark}
                            />

                            {/* Enhanced Visibility Toggle */}
                            <SettingsToggle
                                label="Enhanced Visibility"
                                description="Improve text clarity and spacing"
                                icon="👁️"
                                enabled={settings.visionMode}
                                onChange={(val) => updateSettings({ visionMode: val })}
                                isDark={isDark}
                            />

                            {/* Ops Mode Toggle - Premium Feature */}
                            {opsTheme && (
                                <div className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-[1.01] ${opsTheme.isOpsMode
                                    ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30'
                                    : isDark ? 'bg-slate-800/50' : 'bg-slate-50'
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">🎖️</span>
                                        <div>
                                            <p className={`font-medium ${isDark || opsTheme.isOpsMode ? 'text-white' : 'text-slate-900'}`}>
                                                Ops Mode
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
                                                    Premium
                                                </span>
                                            </p>
                                            <p className={`text-xs ${isDark || opsTheme.isOpsMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                Military-grade operator console aesthetic
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => opsTheme.toggleOpsMode()}
                                        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${opsTheme.isOpsMode
                                            ? 'bg-gradient-to-r from-violet-500 to-cyan-500'
                                            : isDark ? 'bg-slate-700' : 'bg-slate-300'
                                            }`}
                                    >
                                        <div
                                            className={`absolute top-1 w-6 h-6 rounded-full shadow-md transition-all duration-300 bg-white ${opsTheme.isOpsMode ? 'left-7' : 'left-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Divider */}
                    <div className={`h-px ${isDark ? 'bg-slate-700/50' : 'bg-slate-200'}`} />

                    {/* About */}
                    <section>
                        <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            <span className="text-2xl">✨</span>
                            About
                        </h3>
                        <div className={`p-5 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                                    Z
                                </div>
                                <div>
                                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>ZEN Vanguard</h4>
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>AI Professionals Program v2.0</p>
                                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>© 2024 ZEN AI Co. All rights reserved.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className={`sticky bottom-0 px-8 py-5 border-t flex justify-end gap-3 ${isDark ? 'border-slate-700/50 bg-slate-900/95' : 'border-slate-200/50 bg-white/95'
                    }`}>
                    <button
                        onClick={closeSettings}
                        className="px-6 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 bg-gradient-to-r from-brand-primary to-purple-600 text-white shadow-lg shadow-brand-primary/25"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================
// SETTINGS TOGGLE COMPONENT
// ============================================

interface SettingsToggleProps {
    label: string;
    description: string;
    icon: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    isDark: boolean;
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({ label, description, icon, enabled, onChange, isDark }) => {
    return (
        <div className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-[1.01] ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'
            }`}>
            <div className="flex items-center gap-4">
                <span className="text-2xl">{icon}</span>
                <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{label}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
                </div>
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${enabled
                    ? 'bg-brand-primary'
                    : isDark ? 'bg-slate-700' : 'bg-slate-300'
                    }`}
            >
                <div
                    className={`absolute top-1 w-6 h-6 rounded-full shadow-md transition-all duration-300 bg-white ${enabled ? 'left-7' : 'left-1'
                        }`}
                />
            </button>
        </div>
    );
};

export default SettingsPanel;
