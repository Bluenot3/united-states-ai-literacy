import React, { useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { useSidebar } from '../contexts/SidebarContext';
import zenMonogramLogoWebp from '../assets/branding/zen-monogram-signature.webp';
import zenMonogramLogoAvif from '../assets/branding/zen-monogram-signature.avif';
import { ZenModuleGlyph } from './zen';
import type { ZenGlyphName } from './zen';

const moduleInfo = [
    {
        id: 1 as const,
        title: 'Module 1',
        subtitle: 'AI Foundations',
        color: 'from-zen-gold via-zen-gold-light to-brand-cyan',
        icon: 'module1' as ZenGlyphName,
    },
    {
        id: 2 as const,
        title: 'Module 2',
        subtitle: 'Agents & Automation',
        color: 'from-brand-cyan via-zen-quantum to-zen-emerald',
        icon: 'module2' as ZenGlyphName,
    },
    {
        id: 3 as const,
        title: 'Module 3',
        subtitle: 'Personal Intelligence',
        color: 'from-zen-emerald via-teal-400 to-brand-cyan',
        icon: 'module3' as ZenGlyphName,
    },
    {
        id: 4 as const,
        title: 'Module 4',
        subtitle: 'Systems Mastery',
        color: 'from-zen-gold via-amber-400 to-rose-400',
        icon: 'module4' as ZenGlyphName,
    },
];

const primaryLinks = [
    { to: '/dashboard', label: 'Dashboard', hint: 'Overview and momentum', icon: 'dashboard' as ZenGlyphName },
    { to: '/docs', label: 'Docs Library', hint: 'Reference layer and playbooks', icon: 'research' as ZenGlyphName },
    { to: '/guide', label: 'Starter Guide', hint: 'Orientation and setup path', icon: 'guide' as ZenGlyphName },
    { to: '/hub', label: 'Program Hub', hint: 'Navigate the broader ecosystem', icon: 'programs' as ZenGlyphName },
    { to: '/profile', label: 'Profile', hint: 'Identity and progress record', icon: 'identity' as ZenGlyphName },
];

/** Tooltip wrapper that appears on the right side when sidebar is collapsed */
const Tooltip: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="group/tip relative flex items-center">
        {children}
        <div className="pointer-events-none absolute left-full ml-3 z-[200] hidden group-hover/tip:flex items-center whitespace-nowrap rounded-xl border border-zen-gold/20 bg-zen-navy/95 px-3 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-xl">
            {label}
            <div className="absolute right-full mr-0 border-4 border-transparent border-r-zen-navy/95" />
        </div>
    </div>
);

const GlobalSidebar: React.FC = () => {
    const { user, logout, getModuleProgress } = useAuth();
    const { openSettings } = useTheme();
    const { isCollapsed, toggle } = useSidebar();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const currentPath = location.pathname;

    const moduleCompletion = useMemo(() => {
        return moduleInfo.reduce<Record<number, number>>((accumulator, module) => {
            const progress = getModuleProgress(module.id);
            const estimatedTotalSections = module.id === 1 ? 50 : module.id === 4 ? 60 : 40;
            accumulator[module.id] = Math.min(100, Math.round((progress.completedSections.length / estimatedTotalSections) * 100));
            return accumulator;
        }, {});
    }, [getModuleProgress, user]);

    const handleNavigate = () => {
        setIsMobileOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    /* ─────────────────────────────────────────────────────────
       COLLAPSED — icon rail (w-16 = 64px)
    ───────────────────────────────────────────────────────── */
    const iconRail = (
        <aside className="fixed left-0 top-0 z-[55] hidden h-screen w-16 flex-col items-center overflow-hidden border-r border-zen-gold/10 bg-[linear-gradient(180deg,rgba(6,11,24,0.98)_0%,rgba(15,23,42,0.96)_52%,rgba(6,11,24,0.98)_100%)] shadow-[20px_0_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl lg:flex">

            {/* Logo + Expand button */}
            <div className="flex w-full flex-col items-center gap-2 border-b border-zen-gold/10 py-4">
                <Tooltip label="ZEN Vanguard">
                    <NavLink to="/hub" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[1rem] border border-zen-gold/24 bg-[radial-gradient(circle_at_28%_22%,rgba(201,168,76,0.32),rgba(6,11,24,0.92)_58%)] shadow-[0_8px_20px_rgba(2,6,23,0.5)]">
                        <picture>
                            <source srcSet={zenMonogramLogoAvif} type="image/avif" />
                            <source srcSet={zenMonogramLogoWebp} type="image/webp" />
                            <img src={zenMonogramLogoWebp} alt="ZEN" width={32} height={32} className="h-8 w-8 object-contain" />
                        </picture>
                    </NavLink>
                </Tooltip>

                {/* Expand button */}
                <Tooltip label="Expand navigation">
                    <button
                        onClick={toggle}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-zen-gold/25 bg-zen-gold/[0.10] text-zen-gold/90 shadow-[0_2px_8px_rgba(201,168,76,0.12)] transition hover:border-zen-gold/50 hover:bg-zen-gold/[0.20] hover:text-zen-gold hover:shadow-[0_4px_14px_rgba(201,168,76,0.22)] active:scale-95"
                        aria-label="Expand navigation sidebar"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </Tooltip>
            </div>

            {/* Icon navigation */}
            <nav className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto py-3 w-full px-2">

                {/* Workspace links */}
                {primaryLinks.map((link) => {
                    const isActive = currentPath === link.to || currentPath.startsWith(link.to + '/');
                    return (
                        <Tooltip key={link.to} label={link.label}>
                            <NavLink
                                to={link.to}
                                onClick={handleNavigate}
                                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                                    isActive
                                        ? 'border-zen-gold/30 bg-zen-gold/[0.12] text-zen-gold'
                                        : 'border-transparent text-slate-500 hover:border-zen-gold/15 hover:bg-zen-gold/[0.06] hover:text-zen-gold/80'
                                }`}
                            >
                                <ZenModuleGlyph name={link.icon} className="h-4 w-4" />
                            </NavLink>
                        </Tooltip>
                    );
                })}

                {/* Divider */}
                <div className="my-1 h-px w-8 bg-zen-gold/10" />

                {/* Module links */}
                {moduleInfo.map((module) => {
                    const isActive = currentPath.startsWith(`/module/${module.id}`);
                    const pct = moduleCompletion[module.id] ?? 0;
                    return (
                        <Tooltip key={module.id} label={`${module.title} - ${module.subtitle} (${pct}%)`}>
                            <NavLink
                                to={`/module/${module.id}`}
                                onClick={handleNavigate}
                                className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                                    isActive
                                        ? `border-zen-gold/30 bg-gradient-to-br ${module.color} text-zen-navy shadow-[0_6px_16px_rgba(0,0,0,0.3)]`
                                        : 'border-white/[0.06] bg-white/[0.02] text-slate-400 hover:border-zen-gold/20 hover:text-zen-gold/70'
                                }`}
                            >
                                <ZenModuleGlyph name={module.icon} className="h-4 w-4" />
                                {/* Completion dot */}
                                {pct > 0 && (
                                    <div className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-zen-navy ${pct >= 100 ? 'bg-emerald-400' : 'bg-zen-gold'}`} />
                                )}
                            </NavLink>
                        </Tooltip>
                    );
                })}
            </nav>

            {/* User avatar at bottom */}
            {user && (
                <div className="border-t border-zen-gold/10 py-4">
                    <Tooltip label={`${user.name} — ${user.totalPoints || 0} XP`}>
                        <button
                            onClick={handleLogout}
                            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-zen-surface ring-2 ring-zen-gold/15 transition hover:ring-zen-gold/30"
                        >
                            <img
                                src={user.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || 'User'}`}
                                alt={user.name || 'User'}
                                className="h-10 w-10 object-cover"
                            />
                        </button>
                    </Tooltip>
                </div>
            )}
        </aside>
    );

    /* ─────────────────────────────────────────────────────────
       EXPANDED — icon + label rail (w-52 = 208px)
       Same icons as the collapsed rail, now with labels.
    ───────────────────────────────────────────────────────── */
    const expandedRail = (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-zen-void/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-[55] flex h-screen w-52 flex-col overflow-hidden border-r border-zen-gold/10 bg-[linear-gradient(180deg,rgba(6,11,24,0.98)_0%,rgba(15,23,42,0.96)_52%,rgba(6,11,24,0.98)_100%)] text-white shadow-[20px_0_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header: logo + brand name + collapse button */}
                <div className="flex items-center gap-3 border-b border-zen-gold/10 px-3 py-4">
                    <NavLink
                        to="/hub"
                        onClick={handleNavigate}
                        className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[0.85rem] border border-zen-gold/24 bg-[radial-gradient(circle_at_28%_22%,rgba(201,168,76,0.32),rgba(6,11,24,0.92)_58%)] shadow-[0_6px_16px_rgba(2,6,23,0.5)]"
                    >
                        <picture>
                            <source srcSet={zenMonogramLogoAvif} type="image/avif" />
                            <source srcSet={zenMonogramLogoWebp} type="image/webp" />
                            <img src={zenMonogramLogoWebp} alt="ZEN" width={28} height={28} className="h-7 w-7 object-contain" />
                        </picture>
                    </NavLink>
                    <div className="min-w-0 flex-1">
                        <p className="font-display text-sm font-semibold leading-tight tracking-[0.04em] text-[#f6e2ac]">ZEN Vanguard</p>
                        <p className="mt-0.5 text-[9px] uppercase tracking-[0.22em] text-zen-gold/55">AI Literacy</p>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); toggle(); }}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-zen-gold/25 bg-zen-gold/[0.10] text-zen-gold/90 transition hover:border-zen-gold/50 hover:bg-zen-gold/[0.20] hover:text-zen-gold active:scale-95"
                        title="Collapse to icon rail"
                        aria-label="Collapse navigation to icon rail"
                    >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Navigation links */}
                <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3 [scrollbar-width:none]">
                    <p className="mb-1 px-2.5 text-[9px] font-bold uppercase tracking-[0.28em] text-slate-600">Workspace</p>
                    {primaryLinks.map((link) => {
                        const isActive = currentPath === link.to || currentPath.startsWith(link.to + '/');
                        return (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={handleNavigate}
                                className={`flex items-center gap-3 rounded-xl border px-2.5 py-2.5 transition ${
                                    isActive
                                        ? 'border-zen-gold/25 bg-zen-gold/[0.10] text-zen-gold'
                                        : 'border-transparent text-slate-400 hover:border-zen-gold/12 hover:bg-zen-gold/[0.06] hover:text-slate-200'
                                }`}
                            >
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
                                    isActive ? 'bg-zen-gold/20 text-zen-gold' : 'bg-white/[0.04] text-slate-500'
                                }`}>
                                    <ZenModuleGlyph name={link.icon} className="h-3.5 w-3.5" />
                                </span>
                                <span className="text-[13px] font-medium leading-none">{link.label}</span>
                            </NavLink>
                        );
                    })}

                    <div className="mx-2.5 my-2 h-px bg-zen-gold/10" />

                    <p className="mb-1 px-2.5 text-[9px] font-bold uppercase tracking-[0.28em] text-slate-600">Modules</p>
                    {moduleInfo.map((module) => {
                        const isActive = currentPath.startsWith(`/module/${module.id}`);
                        const pct = moduleCompletion[module.id] ?? 0;
                        return (
                            <NavLink
                                key={module.id}
                                to={`/module/${module.id}`}
                                onClick={handleNavigate}
                                className={`flex items-center gap-3 rounded-xl border px-2.5 py-2.5 transition ${
                                    isActive
                                        ? 'border-zen-gold/25 bg-zen-gold/[0.10]'
                                        : 'border-transparent hover:border-zen-gold/12 hover:bg-zen-gold/[0.06]'
                                }`}
                            >
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${module.color} shadow-sm`}>
                                    <ZenModuleGlyph name={module.icon} className="h-3.5 w-3.5 text-zen-navy" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className={`truncate text-[12px] font-semibold leading-tight ${isActive ? 'text-zen-gold' : 'text-slate-300'}`}>{module.title}</p>
                                    <div className="mt-1 flex items-center gap-1.5">
                                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                                            <div className={`h-full rounded-full bg-gradient-to-r ${module.color}`} style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="text-[9px] tabular-nums text-slate-600">{pct}%</span>
                                    </div>
                                </div>
                            </NavLink>
                        );
                    })}

                    <div className="mx-2.5 my-2 h-px bg-zen-gold/10" />

                    {/* Settings */}
                    <button
                        onClick={() => { openSettings(); setIsMobileOpen(false); }}
                        className="flex items-center gap-3 rounded-xl border border-transparent px-2.5 py-2.5 text-slate-400 transition hover:border-zen-gold/12 hover:bg-zen-gold/[0.06] hover:text-slate-200"
                    >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-slate-500">
                            <ZenModuleGlyph name="telemetry" className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-[13px] font-medium leading-none">Settings</span>
                    </button>
                </nav>

                {/* User footer */}
                {user && (
                    <div className="border-t border-zen-gold/10 px-2 py-3">
                        <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
                            <img
                                src={user.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || 'User'}`}
                                alt={user.name || 'User'}
                                className="h-8 w-8 shrink-0 rounded-full ring-2 ring-zen-gold/15"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[12px] font-semibold text-white">{user.name || 'Learner'}</p>
                                <p className="text-[10px] text-zen-gold">{user.totalPoints || 0} XP</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="shrink-0 rounded-lg border border-white/[0.06] px-2 py-1 text-[10px] font-semibold text-slate-500 transition hover:border-rose-400/30 hover:text-rose-400"
                            >
                                Out
                            </button>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );

    return (
        <>
            {/* Mobile hamburger — always shown */}
            <button
                onClick={() => setIsMobileOpen((open) => !open)}
                className="fixed left-4 top-4 z-50 rounded-2xl border border-zen-gold/20 bg-zen-navy/95 p-3 text-zen-gold shadow-zen-card backdrop-blur-xl lg:hidden"
                aria-label="Toggle navigation"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMobileOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Desktop: collapsed = icon rail, expanded = icon+label rail */}
            {isCollapsed ? iconRail : expandedRail}
        </>
    );
};

export default GlobalSidebar;
