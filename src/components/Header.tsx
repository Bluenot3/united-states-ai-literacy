import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSidebar } from '../contexts/SidebarContext';
import { ZenModuleGlyph } from './zen';
import type { ZenGlyphName } from './zen';

type PageMeta = {
    title: string;
    eyebrow: string;
    icon: ZenGlyphName;
};

const getPageMeta = (pathname: string): PageMeta => {
    if (pathname.includes('/command-center')) return { title: 'ZEN Ecosystem Command Center', eyebrow: 'Ecosystem', icon: 'network' };
    if (pathname.includes('/dashboard')) return { title: 'Vanguard Dashboard', eyebrow: 'Command Deck', icon: 'dashboard' };
    if (pathname.includes('/programs/hermes')) return { title: 'Hermes Agent Ops', eyebrow: 'Open Source Agent', icon: 'programs' };
    if (pathname.includes('/hub')) return { title: 'Program Hub', eyebrow: 'Workspace', icon: 'programs' };
    if (pathname.includes('/docs')) return { title: 'Docs Library', eyebrow: 'Reference Layer', icon: 'research' };
    if (pathname.includes('/guide')) return { title: 'Starter Guide', eyebrow: 'Orientation', icon: 'guide' };
    if (pathname.includes('/profile')) return { title: 'Profile', eyebrow: 'Identity', icon: 'identity' };
    if (pathname.includes('/certificate')) return { title: 'Certificate', eyebrow: 'Verification', icon: 'certificate' };
    return { title: 'ZEN Vanguard', eyebrow: 'Program Surface', icon: 'identity' };
};

const Header: React.FC = () => {
    const { user } = useAuth();
    const { pathname } = useLocation();
    const { isCollapsed, toggle } = useSidebar();
    const pageMeta = getPageMeta(pathname);

    const completedModules = user
        ? Object.values(user.modules).filter((m) => m.certificateId).length
        : 0;
    const completionPercent = Math.round((completedModules / 4) * 100);

    return (
        <header className="sticky top-0 z-30 w-full max-w-full overflow-x-hidden border-b border-zen-border bg-[linear-gradient(180deg,rgba(5,10,24,0.98)_0%,rgba(8,14,29,0.95)_100%)] backdrop-blur-2xl">
            <div className="relative min-w-0 max-w-full px-4 py-3 lg:px-6">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-10 top-0 h-16 w-44 rounded-full bg-zen-gold/[0.06] blur-3xl" />
                    <div className="absolute right-12 top-0 h-16 w-52 rounded-full bg-brand-cyan/[0.06] blur-3xl" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zen-gold/20 to-transparent" />
                </div>

                <div className="relative flex min-w-0 items-center justify-between gap-4">
                    {/* Left: page identity */}
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Sidebar toggle — visible when sidebar is collapsed */}
                        {isCollapsed && (
                            <button
                                onClick={toggle}
                                title="Expand sidebar"
                                className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-zen-gold/15 bg-zen-gold/[0.06] text-zen-gold/70 transition hover:border-zen-gold/30 hover:text-zen-gold"
                                aria-label="Expand sidebar"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}

                        <div className="ml-10 lg:ml-0 flex items-center gap-3 min-w-0">
                            <span className="zen-glyph-frame hidden sm:inline-flex text-[#f1d280]">
                                <ZenModuleGlyph name={pageMeta.icon} className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="zen-eyebrow-chip">{pageMeta.eyebrow}</span>
                                </div>
                                <h1 className="font-display text-base font-semibold tracking-tight text-[#f7e6b6] sm:text-lg leading-tight mt-0.5 truncate">
                                    {pageMeta.title}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Right: compact stats */}
                    {user && (
                        <div className="hidden sm:flex items-center gap-2 shrink-0">
                            <div className="zen-panel rounded-[1.2rem] px-3 py-2 flex items-center gap-2">
                                <ZenModuleGlyph name="progress" className="h-3.5 w-3.5 text-zen-gold shrink-0" />
                                <div>
                                    <p className="text-[9px] font-semibold uppercase tracking-wider text-zen-gold/70">XP</p>
                                    <p className="font-display text-base font-semibold text-[#f7e4b0] leading-none">{user.totalPoints || 0}</p>
                                </div>
                            </div>

                            <div className="zen-panel rounded-[1.2rem] px-3 py-2 flex items-center gap-2">
                                <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-zen-gold via-zen-gold-light to-brand-cyan p-[1.5px] shadow-[0_8px_16px_rgba(2,6,23,0.38)] shrink-0">
                                    <div className="flex h-full w-full items-center justify-center rounded-[0.6rem] bg-zen-navy text-[10px] font-bold text-zen-gold">
                                        {completionPercent}%
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Modules</p>
                                    <p className="font-display text-base font-semibold text-[#f7e4b0] leading-none">{completedModules}/4</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-0.5 bg-zen-surface">
                <div
                    className="h-full bg-gradient-to-r from-zen-gold via-zen-gold-light to-brand-cyan transition-all duration-1000"
                    style={{ width: `${completionPercent}%` }}
                />
            </div>
        </header>
    );
};

export default Header;
