/**
 * StickySectionNavCard
 *
 * The in-module navigation + control panel.
 * Lives in the LEFT sidebar column of VanguardModuleFrame.
 *
 * What it does:
 *  - Shows all sections in the current module (scrollable list)
 *  - Highlights the active section, marks completed ones
 *  - Quick-jump buttons (prev / top / current / bottom / next)
 *  - Module switcher (M1 → M4) with completion gating
 *  - Progress bar
 *  - Search / filter sections
 *  - AI chat prompt at the bottom
 *  - Minimize to a small pill (ONLY this panel collapses — content area is untouched)
 *  - Draggable when user scrolls it into sticky mode
 *
 * What it does NOT do:
 *  - It never collapses or hides the course content
 *  - It never affects the page grid layout
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Types ─────────────────────────────────────────────────────────────── */

type NavSection = {
    id: string;
    title: string;
    subSections?: NavSection[];
    icon?: string;
};

interface StickySectionNavCardProps<TSection extends NavSection> {
    sections: TSection[];
    activeSection: string;
    completedSections: string[];
    moduleLabel: string;
    accentClassName: string;
    activeAccentClassName: string;
    onNavigate: (sectionId: string) => void;
    renderIcon?: (section: TSection, isActive: boolean) => React.ReactNode;
    compact?: boolean;
    moduleNumber?: number;
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */

const flattenSections = <T extends NavSection>(sections: T[]): T[] => {
    const out: T[] = [];
    const walk = (items: T[]) => items.forEach((s) => { out.push(s); if (s.subSections?.length) walk(s.subSections as T[]); });
    walk(sections);
    return out;
};

const buildParentMap = <T extends NavSection>(
    sections: T[], parentId?: string, map: Record<string, string | undefined> = {},
): Record<string, string | undefined> => {
    sections.forEach((s) => {
        map[s.id] = parentId;
        if (s.subSections?.length) buildParentMap(s.subSections as T[], s.id, map);
    });
    return map;
};

const filterSections = <T extends NavSection>(sections: T[], q: string): T[] => {
    const lq = q.trim().toLowerCase();
    if (!lq) return sections;
    return sections.reduce<T[]>((acc, s) => {
        const kids = s.subSections?.length ? filterSections(s.subSections as T[], lq) : [];
        const self = s.title.toLowerCase().includes(lq);
        if (!self && !kids.length) return acc;
        acc.push({ ...s, subSections: self ? s.subSections : kids });
        return acc;
    }, []);
};

/* ─── Drag hook ──────────────────────────────────────────────────────────── */

function useDrag() {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const dragging = useRef(false);
    const origin = useRef({ x: 0, y: 0 });
    const startOffset = useRef({ x: 0, y: 0 });

    const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
        origin.current = { x: e.clientX, y: e.clientY };
        startOffset.current = { ...offset };
    }, [offset]);

    const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return;
        setOffset({
            x: startOffset.current.x + (e.clientX - origin.current.x),
            y: startOffset.current.y + (e.clientY - origin.current.y),
        });
    }, []);

    const onPointerUp = useCallback(() => { dragging.current = false; }, []);
    const reset = useCallback(() => setOffset({ x: 0, y: 0 }), []);

    return { offset, onPointerDown, onPointerMove, onPointerUp, reset };
}

/* ─── Small reusable icon components ───────────────────────────────────── */

const CheckIcon = () => (
    <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3" aria-hidden="true">
        <path d="M3 8.5l3.5 3.5 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ─── Main Component ─────────────────────────────────────────────────────── */

const StickySectionNavCard = <TSection extends NavSection>({
    sections,
    activeSection,
    completedSections,
    moduleLabel,
    accentClassName,
    activeAccentClassName,
    onNavigate,
    renderIcon,
    moduleNumber,
}: StickySectionNavCardProps<TSection>) => {
    const navigate = useNavigate();
    const drag = useDrag();
    const containerRef = useRef<HTMLDivElement>(null);

    /* ── State ────────────────────────────────────────────────────────── */
    const [isMinimized, setIsMinimized] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [expandedParents, setExpandedParents] = useState<Set<string>>(() => new Set());
    const [optimisticSection, setOptimisticSection] = useState<string | null>(null);
    const [isFloating, setIsFloating] = useState(false);
    const [floatLeft, setFloatLeft] = useState(0);
    const [floatWidth, setFloatWidth] = useState(0);

    /* ── Derived values ───────────────────────────────────────────────── */
    const allSections = useMemo(() => flattenSections(sections), [sections]);
    const parentMap = useMemo(() => buildParentMap(sections), [sections]);
    const resolved = optimisticSection ?? activeSection;
    const activeIdx = allSections.findIndex((s) => s.id === resolved);
    const activeTitle = allSections[activeIdx]?.title ?? 'Overview';
    const prevId = activeIdx > 0 ? allSections[activeIdx - 1]?.id : undefined;
    const nextId = activeIdx >= 0 && activeIdx < allSections.length - 1 ? allSections[activeIdx + 1]?.id : undefined;
    const firstId = allSections[0]?.id;
    const lastId = allSections[allSections.length - 1]?.id;
    const pct = allSections.length > 0 ? Math.round((completedSections.length / allSections.length) * 100) : 0;
    const filtered = useMemo(() => filterSections(sections, searchQuery), [sections, searchQuery]);

    /* ── Sync optimistic on real change ──────────────────────────────── */
    useEffect(() => { setOptimisticSection(null); }, [activeSection]);

    /* ── Auto-expand parents of active section ───────────────────────── */
    useEffect(() => {
        setExpandedParents((prev) => {
            const next = new Set(prev);
            let pid = parentMap[resolved];
            let changed = false;
            while (pid) { if (!next.has(pid)) { next.add(pid); changed = true; } pid = parentMap[pid]; }
            return changed ? next : prev;
        });
    }, [parentMap, resolved]);

    /* ── Floating / sticky detection ─────────────────────────────────── */
    useEffect(() => {
        const el = containerRef.current;
        if (!el || typeof window === 'undefined') return;
        let raf = 0;
        const check = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                if (window.innerWidth < 1024) { setIsFloating(false); return; }
                const rect = el.getBoundingClientRect();
                const shouldFloat = rect.top <= 16;
                setIsFloating(shouldFloat);
                if (shouldFloat) {
                    // Capture the column's left and width BEFORE going fixed
                    setFloatLeft(rect.left);
                    setFloatWidth(el.offsetWidth);
                }
            });
        };
        check();
        window.addEventListener('scroll', check, { passive: true });
        window.addEventListener('resize', check);
        return () => {
            window.removeEventListener('scroll', check);
            window.removeEventListener('resize', check);
            cancelAnimationFrame(raf);
        };
    }, []);

    // Reset drag when floating changes to prevent jump
    useEffect(() => { drag.reset(); }, [isFloating]); // eslint-disable-line

    /* ── Navigation helpers ───────────────────────────────────────────── */
    const goTo = (id?: string) => {
        if (!id) return;
        setOptimisticSection(id);
        onNavigate(id);
    };

    const toggleParent = (id: string) => {
        setExpandedParents((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    /* ── Section list renderer ────────────────────────────────────────── */
    const renderLinks = (items: TSection[], depth = 0): React.ReactNode =>
        items.map((s) => {
            const isActive = resolved === s.id;
            const isDone = completedSections.includes(s.id);
            const hasKids = Boolean(s.subSections?.length);
            const isExpanded = expandedParents.has(s.id) || searchQuery.trim().length > 0;

            return (
                <li key={s.id}>
                    <div className="flex items-center gap-1 py-0.5">
                        {/* Expand toggle */}
                        {hasKids ? (
                            <button
                                type="button"
                                onClick={() => toggleParent(s.id)}
                                className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-600 transition hover:text-slate-300"
                                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                            >
                                <svg viewBox="0 0 16 16" fill="none" className={`h-2.5 w-2.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        ) : (
                            <span className="w-5 shrink-0" />
                        )}

                        {/* Section button */}
                        <button
                            type="button"
                            onClick={() => goTo(s.id)}
                            style={{ paddingLeft: `${0.4 + depth * 0.6}rem` }}
                            className={[
                                'flex flex-1 items-center gap-2 overflow-hidden rounded-xl border px-2.5 py-2 text-left text-sm transition-all duration-150',
                                isActive
                                    ? `border-white/20 bg-gradient-to-r ${activeAccentClassName} text-white shadow-md`
                                    : isDone
                                        ? 'border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-200 hover:bg-emerald-500/[0.14]'
                                        : 'border-white/[0.06] bg-white/[0.025] text-slate-300 hover:border-white/15 hover:bg-white/[0.06] hover:text-white',
                            ].join(' ')}
                        >
                            {/* Icon */}
                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg transition-all ${
                                isActive ? 'bg-white/20 text-white'
                                    : isDone ? 'bg-emerald-400/20 text-emerald-400'
                                        : 'bg-white/[0.05] text-slate-600'
                            }`}>
                                {isDone && !isActive
                                    ? <CheckIcon />
                                    : renderIcon
                                        ? renderIcon(s, isActive)
                                        : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                            </span>

                            {/* Title */}
                            <span className="min-w-0 flex-1 truncate text-[0.78rem] font-medium leading-5">{s.title}</span>

                            {/* Done tick */}
                            {isDone && !isActive && (
                                <span className="shrink-0 text-emerald-400 opacity-70"><CheckIcon /></span>
                            )}
                        </button>
                    </div>

                    {/* Children */}
                    {hasKids && isExpanded && (
                        <ul className="ml-5 border-l border-white/[0.06] pl-1.5">
                            {renderLinks(s.subSections as TSection[], depth + 1)}
                        </ul>
                    )}
                </li>
            );
        });

    /* ── Floating position styles ────────────────────────────────────── */
    const cardStyle: React.CSSProperties = isFloating
        ? {
            position: 'fixed',
            top: Math.max(8, Math.min(window.innerHeight - 240, 16 + drag.offset.y)),
            left: Math.max(8, Math.min(window.innerWidth - (floatWidth || 300) - 8, floatLeft + drag.offset.x)),
            width: floatWidth,
            maxHeight: 'calc(100vh - 24px)',
            zIndex: 9999,
        }
        : { maxHeight: 'calc(100vh - 8rem)', position: 'relative' };

    /* ── Minimized pill ──────────────────────────────────────────────── */
    if (isMinimized) {
        // When floating, keep the pill fixed so it doesn't jump back to document flow
        const pillStyle: React.CSSProperties = isFloating
            ? {
                position: 'fixed',
                top: Math.max(8, Math.min(window.innerHeight - 80, 16 + drag.offset.y)),
                left: Math.max(8, Math.min(window.innerWidth - (floatWidth || 300) - 8, floatLeft + drag.offset.x)),
                width: floatWidth,
                zIndex: 9999,
            }
            : {};

        return (
            <div
                ref={containerRef}
                className="w-full"
                style={isFloating ? { minHeight: 60 } : undefined}
            >
                <button
                    type="button"
                    onClick={() => setIsMinimized(false)}
                    title="Expand navigation panel"
                    style={pillStyle}
                    className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.12] bg-[linear-gradient(135deg,rgba(12,20,38,0.92)_0%,rgba(8,15,28,0.88)_100%)] px-4 py-3 text-left shadow-[0_8px_30px_rgba(2,6,23,0.45)] backdrop-blur-2xl transition hover:border-white/[0.22]"
                >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r ${accentClassName} shadow-md`}>
                        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-white" aria-hidden="true">
                            <path d="M4 6h12M4 10h8M4 14h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-slate-500">{moduleLabel}</p>
                        <p className="truncate text-sm font-semibold text-white">{activeTitle}</p>
                    </div>
                    <div className="shrink-0 text-right">
                        <span className={`inline-block rounded-full bg-gradient-to-r ${accentClassName} px-2.5 py-0.5 text-[10px] font-bold text-white`}>{pct}%</span>
                        <p className="mt-0.5 text-[9px] text-slate-600">{activeIdx + 1}&thinsp;/&thinsp;{allSections.length}</p>
                    </div>
                    {/* Expand hint */}
                    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0 text-slate-600" aria-hidden="true">
                        <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        );
    }

    /* ── Full panel ──────────────────────────────────────────────────── */
    return (
        <div
            ref={containerRef}
            className="w-full"
            style={isFloating ? { minHeight: floatWidth > 0 ? '200px' : undefined } : undefined}
        >
            <div
                className="flex flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.11] bg-[linear-gradient(165deg,rgba(12,20,38,0.93)_0%,rgba(8,15,28,0.89)_100%)] shadow-[0_20px_60px_rgba(2,6,23,0.55),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-2xl"
                style={cardStyle}
                onPointerMove={isFloating ? drag.onPointerMove : undefined}
                onPointerUp={isFloating ? drag.onPointerUp : undefined}
            >
                {/* Accent glow at top */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-12 overflow-hidden rounded-t-[1.5rem]">
                    <div className={`absolute inset-0 bg-gradient-to-r ${accentClassName} opacity-[0.10]`} />
                </div>

                {/* ══ DRAG HANDLE + HEADER ════════════════════════════ */}
                <div
                    className={`relative flex items-center gap-2.5 border-b border-white/[0.08] px-3.5 py-3 ${isFloating ? 'cursor-grab active:cursor-grabbing select-none' : 'cursor-default'}`}
                    onPointerDown={isFloating ? drag.onPointerDown : undefined}
                >
                    {/* Grip indicator — only shown when floating */}
                    {isFloating && (
                        <div className="flex shrink-0 flex-col gap-[3px] opacity-60" aria-hidden="true">
                            {[0, 1, 2].map((r) => (
                                <div key={r} className="flex gap-[3px]">
                                    <div className="h-[3.5px] w-[3.5px] rounded-full bg-slate-400" />
                                    <div className="h-[3.5px] w-[3.5px] rounded-full bg-slate-400" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Module + panel label */}
                    <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-600">{moduleLabel}</p>
                        <p className="text-[13px] font-bold text-slate-100">Navigation</p>
                    </div>

                    {/* Header actions — RIGHT side */}
                    <div className="flex shrink-0 items-center gap-1.5">
                        {/* Reset position — only shown when floating */}
                        {isFloating && (
                            <button
                                type="button"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => { e.stopPropagation(); drag.reset(); }}
                                title="Reset panel position"
                                className="flex h-7 w-7 items-center justify-center rounded-xl border border-white/[0.08] bg-transparent text-slate-600 transition hover:border-white/15 hover:text-slate-300"
                            >
                                <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                                    <path d="M4 10a6 6 0 1 0 1.5-3.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                                    <path d="M4 5.5V10h4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        )}

                        {/* Search */}
                        <button
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => { setShowSearch((v) => !v); if (showSearch) setSearchQuery(''); }}
                            title={showSearch ? 'Close search' : 'Search sections'}
                            className={`flex h-7 w-7 items-center justify-center rounded-xl border transition-all ${
                                showSearch
                                    ? 'border-white/25 bg-white/[0.14] text-white'
                                    : 'border-white/[0.08] bg-transparent text-slate-500 hover:border-white/15 hover:text-slate-300'
                            }`}
                        >
                            <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                                <circle cx="8.5" cy="8.5" r="4.75" stroke="currentColor" strokeWidth="1.7" />
                                <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                            </svg>
                        </button>

                        {/* Minimize — collapses ONLY this panel, course content unaffected */}
                        <button
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => setIsMinimized(true)}
                            title="Minimize this panel"
                            className="flex h-7 w-7 items-center justify-center rounded-xl border border-white/[0.08] bg-transparent text-slate-500 transition hover:border-white/15 hover:text-slate-300"
                        >
                            <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                                <path d="M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ══ SCROLLABLE BODY ═════════════════════════════════ */}
                <div
                    className="flex flex-1 flex-col overflow-hidden"
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3.5 py-3 [scrollbar-color:rgba(255,255,255,0.08)_transparent] [scrollbar-width:thin]">

                        {/* ── Module Switcher ──────────────────────── */}
                        {moduleNumber !== undefined && (
                            <div>
                                <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.28em] text-slate-600">Switch Module</p>
                                <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-black/20 p-1">
                                    {/* Prev */}
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/module/${moduleNumber - 1}`)}
                                        disabled={moduleNumber <= 1}
                                        title="Previous module"
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.10] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                                    >
                                        <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                                            <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    {/* M1–M4 */}
                                    {[1, 2, 3, 4].map((n) => {
                                        const isCurrent = n === moduleNumber;
                                        const isPast = n < moduleNumber;
                                        const isLocked = n > moduleNumber && pct < 100;
                                        return (
                                            <button
                                                key={n}
                                                type="button"
                                                onClick={() => !isLocked && navigate(`/module/${n}`)}
                                                disabled={isLocked}
                                                title={isLocked ? `Complete Module ${n - 1} to unlock` : `Go to Module ${n}`}
                                                className={[
                                                    'flex flex-1 items-center justify-center rounded-lg border py-2 text-[11px] font-bold uppercase tracking-wide transition-all',
                                                    isCurrent
                                                        ? `border-white/20 bg-gradient-to-r ${accentClassName} text-white shadow-[0_3px_10px_rgba(0,0,0,0.4)]`
                                                        : isPast
                                                            ? 'border-white/10 bg-white/[0.08] text-slate-200 hover:bg-white/[0.14]'
                                                            : isLocked
                                                                ? 'cursor-not-allowed border-white/[0.04] text-slate-700'
                                                                : 'border-white/[0.08] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200',
                                                ].join(' ')}
                                            >
                                                M{n}
                                            </button>
                                        );
                                    })}
                                    {/* Next */}
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/module/${moduleNumber + 1}`)}
                                        disabled={moduleNumber >= 4 || pct < 100}
                                        title={pct < 100 ? 'Complete this module to unlock the next' : 'Next module'}
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.10] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                                    >
                                        <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                                            <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Progress ─────────────────────────────── */}
                        <div>
                            <div className="mb-1.5 flex items-center justify-between gap-2">
                                <p className="text-[11px] text-slate-500">
                                    <span className="font-bold tabular-nums text-slate-300">{Math.max(activeIdx + 1, 1)}</span>
                                    {' '}/{' '}
                                    <span className="tabular-nums">{allSections.length}</span>
                                    {' '}sections
                                </p>
                                <span className={`rounded-full bg-gradient-to-r ${accentClassName} px-2.5 py-0.5 text-[10px] font-bold tabular-nums text-white`}>
                                    {pct}%
                                </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                                <div
                                    className={`h-full rounded-full bg-gradient-to-r ${accentClassName} transition-[width] duration-500`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>

                        {/* ── Quick Nav ────────────────────────────── */}
                        <div>
                            <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.28em] text-slate-600">Jump To</p>
                            <div className="flex items-center gap-1">
                                {([
                                    { id: prevId, label: 'Previous section', icon: 'M12 5l-5 5 5 5' },
                                    { id: firstId, label: 'First section', icon: 'M10 14V6M7 9l3-3 3 3' },
                                    { id: resolved, label: 'Current section', current: true },
                                    { id: lastId, label: 'Last section', icon: 'M10 6v8M7 11l3 3 3-3' },
                                    { id: nextId, label: 'Next section', icon: 'M8 5l5 5-5 5' },
                                ] as Array<{ id?: string; label: string; icon?: string; current?: boolean }>).map(({ id, label, icon, current }) => (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => goTo(id)}
                                        disabled={!id}
                                        title={label}
                                        aria-label={label}
                                        className={[
                                            'flex h-8 flex-1 items-center justify-center rounded-xl border transition-all duration-150',
                                            current
                                                ? `border-white/15 bg-gradient-to-r ${accentClassName} text-white shadow-md`
                                                : 'border-white/[0.07] bg-white/[0.03] text-slate-500 hover:border-white/15 hover:bg-white/[0.08] hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-20',
                                        ].join(' ')}
                                    >
                                        {current ? (
                                            <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                                                <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
                                                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                                                <path d={icon} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        <span className="sr-only">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Search bar ───────────────────────────── */}
                        {showSearch && (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-600">
                                    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                                        <circle cx="8.5" cy="8.5" r="4.75" stroke="currentColor" strokeWidth="1.7" />
                                        <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Find a section…"
                                    autoFocus
                                    className="w-full rounded-xl border border-white/[0.10] bg-white/[0.05] py-2 pl-9 pr-8 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-white/20 focus:bg-white/[0.08]"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-2 flex items-center text-slate-500 hover:text-slate-300"
                                        aria-label="Clear search"
                                    >
                                        <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                                            <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        )}

                        {/* ── Section List ─────────────────────────── */}
                        <div>
                            <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.28em] text-slate-600">Sections</p>
                            {allSections.length > 0 ? (
                                <ul className="space-y-0.5">
                                    {renderLinks(filtered)}
                                </ul>
                            ) : null}
                            {searchQuery && filtered.length === 0 && (
                                <div className="rounded-xl border border-dashed border-white/[0.08] px-4 py-5 text-center">
                                    <p className="text-sm font-semibold text-slate-400">No matches</p>
                                    <p className="mt-1 text-xs text-slate-600">Try a different term</p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* ── AI Chat Row (pinned at bottom) ───────────── */}
                    <div className="shrink-0 border-t border-white/[0.07] px-3.5 py-3">
                        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.28em] text-slate-600">Ask AI About This Module</p>
                        <button
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-xl border border-white/[0.09] bg-white/[0.04] px-3 py-2.5 text-left transition hover:border-white/[0.16] hover:bg-white/[0.07]"
                        >
                            <span className="text-base leading-none" aria-hidden="true">🤖</span>
                            <span className="flex-1 text-sm italic text-slate-500">Ask anything about this module…</span>
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r ${accentClassName} text-white shadow-sm`}>
                                <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3" aria-hidden="true">
                                    <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </button>
                        {isFloating && (
                            <p className="mt-2 text-center text-[9px] text-slate-600">Drag the header bar to reposition · click ↺ to reset</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StickySectionNavCard;
