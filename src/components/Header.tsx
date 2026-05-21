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
        <header className="sticky top-0 z-30 border-b border-zen-gold/[0.08] bg-[linear-gradient(180deg,rgba(4,8,20,0.99)_0%,rgba(6,11,24,0.97)_100%)] backdrop-blur-[28px] backdrop-saturate-150">
            <div className="relative px-4 py-2 lg:px-5">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-8 top-0 h-10 w-36 rounded-full bg-zen-gold/[0.05] blur-2xl" />
                    <div className="absolute right-10 top-0 h-10 w-40 rounded-full bg-brand-cyan/[0.04] blur-2xl" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zen-gold/[0.16] to-transparent" />
                </div>

                <div className="relative flex items-center justify-between gap-3">
                    {/* Left: page identity */}
                    <div className="flex items-center gap-2.5 min-w-0">
                        {isCollapsed && (
                            <button
                                onClick={toggle}
                                title="Expand sidebar"
                                className="hidden lg:flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zen-gold/12 bg-zen-gold/[0.05] text-zen-gold/60 transition hover:border-zen-gold/25 hover:text-zen-gold"
                                aria-label="Expand sidebar"
                            >
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}

                        <div className="ml-10 lg:ml-0 flex items-center gap-2.5 min-w-0">
                            <span className="hidden sm:inline-flex items-center justify-center rounded-[0.65rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-[0.45rem] text-[#f1d280] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_6px_14px_rgba(2,6,23,0.22)]">
                                <ZenModuleGlyph name={pageMeta.icon} className="h-3.5 w-3.5" />
                            </span>
                            <div className="min-w-0">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-zen-gold/[0.18] bg-[linear-gradient(180deg,rgba(240,214,142,0.09),rgba(240,214,142,0.03))] px-2.5 py-[0.28rem] text-[9px] font-bold uppercase tracking-[0.26em] text-[#f5d88d] before:h-[5px] before:w-[5px] before:rounded-full before:bg-[#f5d88d] before:shadow-[0_0_10px_rgba(245,216,141,0.5)] before:content-['']">
                                    {pageMeta.eyebrow}
                                </span>
                                <h1 className="font-display text-[0.92rem] font-semibold tracking-tight text-[#f7e6b6] leading-tight mt-[0.2rem] truncate">
                                    {pageMeta.title}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Right: compact stats */}
                    {user && (
                        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                            <div className="flex items-center gap-1.5 rounded-[0.9rem] border border-zen-gold/[0.13] bg-[linear-gradient(180deg,rgba(12,20,38,0.92),rgba(8,14,29,0.88))] px-2.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_20px_rgba(2,6,23,0.38)] backdrop-blur-md">
                                <ZenModuleGlyph name="progress" className="h-3 w-3 text-zen-gold shrink-0" />
                                <div>
                                    <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-zen-gold/60 leading-none">XP</p>
                                    <p className="font-display text-[0.82rem] font-semibold text-[#f7e4b0] leading-none mt-[2px]">{user.totalPoints || 0}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 rounded-[0.9rem] border border-zen-gold/[0.13] bg-[linear-gradient(180deg,rgba(12,20,38,0.92),rgba(8,14,29,0.88))] px-2.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_20px_rgba(2,6,23,0.38)] backdrop-blur-md">
                                <div className="h-6 w-6 rounded-[0.5rem] bg-gradient-to-br from-zen-gold via-zen-gold-light to-brand-cyan p-[1px] shadow-[0_4px_10px_rgba(2,6,23,0.3)] shrink-0">
                                    <div className="flex h-full w-full items-center justify-center rounded-[0.42rem] bg-zen-navy text-[8px] font-bold text-zen-gold">
                                        {completionPercent}%
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-slate-500 leading-none">Modules</p>
                                    <p className="font-display text-[0.82rem] font-semibold text-[#f7e4b0] leading-none mt-[2px]">{completedModules}/4</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress bar — razor thin */}
            <div className="h-px bg-zen-void">
                <div
                    className="h-full bg-gradient-to-r from-zen-gold via-zen-gold-light to-brand-cyan transition-all duration-1000 shadow-[0_0_6px_rgba(201,168,76,0.4)]"
                    style={{ width: `${completionPercent}%` }}
                />
            </div>
        </header>
    );
};

export default Header;
