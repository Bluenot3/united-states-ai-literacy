/**
 * AI Pioneer Program — mission console.
 *
 * A Pioneer-only experience layer built on top of the same curriculum and
 * progress records the shared program dashboard uses. Nothing is removed:
 * every section, concept mission, interactive app, lab, callout, media
 * block and code note still renders — it is just presented as a world map,
 * arcade decks, and build quests instead of a document.
 *
 * Audience: ages 11-18. The interface leans on progressive reveal, one
 * obvious next action, visible reward, and plain language.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useArsenal } from '../../contexts/ArsenalContext';
import StudioMediaBlock from '../components/StudioMediaBlocks';
import { getCurriculumByProgramId } from '../curriculum';
import {
    LearningConceptVisualizer,
    getConceptMissionPods,
    renderHighlightedText,
    renderPioneerInteractive,
    repaired,
    repairedList,
    type ConceptMissionPod,
} from './pioneerKit';
import {
    getProgramProgress,
    saveProgramLabComplete,
    saveProgramProgress,
    saveProgramResourceExplored,
    type ProgramCalloutContentItem,
    type ProgramContentItem,
    type ProgramLabContentItem,
    type ProgramProgress,
    type ProgramResourceContentItem,
    type ProgramSection,
    type ProgramTextContentItem,
} from '../types';
import {
    AtlasRoute,
    BadgeMedal,
    CelebrationBurst,
    CountUp,
    PioneerCrest,
    PowerCore,
    RankSigil,
    StreakEmber,
    WorldGlyph,
} from './PioneerGraphics';
import {
    PIONEER_WORLDS,
    XP_PER_APP,
    XP_PER_LAB,
    XP_PER_SECTION,
    appsIn,
    buildPioneerState,
    buildQuestSteps,
    labsIn,
    leavesOf,
    resolveNextAction,
    type PioneerState,
    type PioneerWorld,
    type WorldState,
} from './pioneerGame';
import ZenLiveEmbed from './ZenLiveEmbed';
import { liveLabsForSection } from './zenLiveLabs';
import {
    CornerCartouche,
    EngravedMedallion,
    GuillocheBand,
    GuillocheWatermark,
    Microprint,
    SecurityThread,
} from './ZenTreasuryGraphics';
import './pioneerArcade.css';
import './zenTreasury.css';

const PROGRAM_ID = 'pioneer';

/* ══════════════════════════════════════════════════════════════════════
   Small persisted helper: build-quest step ticks.
   These are personal scratch marks, so localStorage is the right home.
   ══════════════════════════════════════════════════════════════════════ */

const STEP_KEY = 'zenPrograms.pioneer.questSteps';

const readStepTicks = (): Record<string, number[]> => {
    try {
        return JSON.parse(localStorage.getItem(STEP_KEY) ?? '{}');
    } catch {
        return {};
    }
};

const useStepTicks = () => {
    const [ticks, setTicks] = useState<Record<string, number[]>>(readStepTicks);

    const toggle = useCallback((labId: string, index: number) => {
        setTicks((current) => {
            const existing = current[labId] ?? [];
            const next = existing.includes(index)
                ? existing.filter((value) => value !== index)
                : [...existing, index];
            const updated = { ...current, [labId]: next };
            try {
                localStorage.setItem(STEP_KEY, JSON.stringify(updated));
            } catch {
                /* storage full or blocked — ticks stay in memory for this session */
            }
            return updated;
        });
    }, []);

    return { ticks, toggle };
};

/* ══════════════════════════════════════════════════════════════════════
   Shared bits of chrome
   ══════════════════════════════════════════════════════════════════════ */

/** "3 missions" / "1 mission" — small thing, but teens notice sloppy copy. */
const count = (value: number, singular: string, plural = `${singular}s`) => (
    `${value} ${value === 1 ? singular : plural}`
);

const worldVars = (world: PioneerWorld): React.CSSProperties => ({
    ['--pa-world' as string]: world.rgb,
    ['--pa-world-2' as string]: world.rgbAlt,
    // The treasury layer reads its own names so the two systems can be used
    // together on the same element without either owning the other's vars.
    ['--zt-rgb' as string]: world.rgb,
    ['--zt-rgb-alt' as string]: world.rgbAlt,
});

const AmbientField: React.FC<{ world: PioneerWorld }> = ({ world }) => (
    <div className="pa-field" aria-hidden="true">
        <div
            className="pa-aurora"
            style={{ top: '-14%', left: '-8%', width: '46vw', height: '46vw', background: `rgba(${world.rgb}, 0.30)` }}
        />
        <div
            className="pa-aurora pa-aurora-b"
            style={{ top: '18%', right: '-12%', width: '40vw', height: '40vw', background: `rgba(${world.rgbAlt}, 0.24)` }}
        />
        <div
            className="pa-aurora pa-aurora-c"
            style={{ top: '62%', left: '22%', width: '52vw', height: '52vw', background: 'rgba(59, 130, 246, 0.16)' }}
        />
        <div className="pa-starfield" />
        <div className="absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,0.045)] [--grid-size:44px]" />
        <div className="pa-scanlines" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,transparent_10%,rgba(2,6,23,.55)_70%)]" />
    </div>
);

const Chip: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({
    children,
    className = '',
    title,
}) => (
    <span
        title={title}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${className}`}
    >
        {children}
    </span>
);

const XpChip: React.FC<{ amount: number; earned?: boolean }> = ({ amount, earned = false }) => (
    <Chip
        className={earned
            ? 'border-emerald-300/40 bg-emerald-400/15 text-emerald-100'
            : 'border-white/15 bg-white/[0.06] text-slate-200'}
        title={earned ? 'Already earned' : 'Available to earn'}
    >
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden="true">
            <path d="M6 0.5 L7.4 4.2 L11.3 4.5 L8.3 7 L9.3 10.9 L6 8.7 L2.7 10.9 L3.7 7 L0.7 4.5 L4.6 4.2 Z" fill="currentColor" />
        </svg>
        {earned ? `+${amount} earned` : `+${amount} XP`}
    </Chip>
);

/** Floating "+N XP" flourish that fires the moment progress is recorded. */
interface XpToast { id: number; amount: number; label: string; }

const XpToastStack: React.FC<{ toasts: XpToast[] }> = ({ toasts }) => (
    <div className="pointer-events-none fixed bottom-28 right-4 z-[70] flex flex-col items-end gap-2 sm:right-8" aria-live="polite">
        {toasts.map((toast) => (
            <div
                key={toast.id}
                className="pa-xp-gain rounded-2xl border border-emerald-300/45 bg-[linear-gradient(135deg,rgba(6,78,59,.96),rgba(2,6,23,.96))] px-4 py-2.5 shadow-[0_18px_44px_rgba(0,0,0,.6)]"
            >
                <p className="text-sm font-black text-emerald-100">+{toast.amount} XP</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200/80">{toast.label}</p>
            </div>
        ))}
    </div>
);

/* ══════════════════════════════════════════════════════════════════════
   Top HUD
   ══════════════════════════════════════════════════════════════════════ */

const TopHUD: React.FC<{
    state: PioneerState;
    world: PioneerWorld;
    onOpenAtlas: () => void;
    atlasActive: boolean;
}> = ({ state, world, onOpenAtlas, atlasActive }) => (
    <header
        className="pa-edge sticky top-0 z-40 border-b border-white/10 bg-[rgba(4,7,15,0.86)] backdrop-blur-2xl"
        style={worldVars(world)}
    >
        <div className="mx-auto flex w-full max-w-[1680px] items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-5">
            <Link
                to="/programs"
                className="group flex shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-200 transition hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
            >
                <svg viewBox="0 0 16 16" className="h-3 w-3 transition group-hover:-translate-x-0.5" aria-hidden="true">
                    <path d="M10 2 L4 8 L10 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="hidden sm:inline">Programs</span>
            </Link>

            <button
                type="button"
                onClick={onOpenAtlas}
                className={`flex min-w-0 items-center gap-2.5 rounded-2xl border px-2.5 py-1.5 text-left transition sm:gap-3 sm:px-3 ${
                    atlasActive
                        ? 'border-white/20 bg-white/[0.08]'
                        : 'border-transparent hover:border-white/15 hover:bg-white/[0.05]'
                }`}
                title="Back to the world atlas"
            >
                <PioneerCrest rgb={world.rgb} rgbAlt={world.rgbAlt} rank={state.rank.index} className="h-9 w-9 shrink-0 sm:h-11 sm:w-11" />
                <span className="min-w-0">
                    <span className="block truncate text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 sm:tracking-[0.26em]">
                        AI Pioneer Program
                    </span>
                    <span className="block truncate text-sm font-black tracking-tight text-white sm:text-base">
                        Mission Console
                    </span>
                </span>
            </button>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
                {/* XP + rank meter */}
                <div className="hidden min-w-[190px] rounded-2xl border border-white/12 bg-black/40 px-3 py-1.5 md:block lg:min-w-[240px]">
                    <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: `rgb(${world.rgb})` }}>
                            {state.rank.rank.name}
                        </span>
                        <span className="pa-tabular text-[11px] font-bold text-slate-300">
                            <CountUp value={state.xp} /> / {state.totalXp.toLocaleString()} XP
                        </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${state.rank.toNextPercent}%`,
                                background: `linear-gradient(90deg, rgb(${world.rgb}), rgb(${world.rgbAlt}))`,
                                boxShadow: `0 0 14px rgba(${world.rgb}, .7)`,
                            }}
                        />
                    </div>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        {state.rank.next ? `${state.rank.xpToNext} XP to ${state.rank.next.name}` : 'Max rank reached'}
                    </p>
                </div>

                <div className="flex items-center gap-1.5 rounded-2xl border border-white/12 bg-black/40 px-2.5 py-2">
                    <StreakEmber active={state.streakDays > 0} className="h-4 w-4" />
                    <span className="pa-tabular text-xs font-black text-white">{state.streakDays > 0 ? 'Active' : 'Idle'}</span>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-white/12 bg-black/40 px-2.5 py-1.5">
                    <RankSigil rank={state.rank.index} rgb={world.rgb} className="h-7 w-7" />
                    <div className="hidden leading-tight sm:block">
                        <p className="pa-tabular text-sm font-black text-white">{state.percent}%</p>
                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">Cleared</p>
                    </div>
                </div>
            </div>
        </div>

        {/* The desktop HUD hides the XP meter on small screens, so give phones
            their own compact rank strip — reward feedback is the whole point. */}
        <div className="flex items-center gap-2.5 border-t border-white/8 px-3 pb-2 pt-1.5 md:hidden">
            <span className="text-[9px] font-black uppercase tracking-[0.18em]" style={{ color: `rgb(${world.rgb})` }}>
                {state.rank.rank.name}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                        width: `${state.rank.toNextPercent}%`,
                        background: `linear-gradient(90deg, rgb(${world.rgb}), rgb(${world.rgbAlt}))`,
                    }}
                />
            </div>
            <span className="pa-tabular text-[10px] font-bold text-slate-400">
                {state.rank.next ? `${state.rank.xpToNext} XP to ${state.rank.next.name}` : 'Max rank'}
            </span>
        </div>

        <div className="h-[3px] bg-black/60">
            <div
                className="h-full transition-all duration-700"
                style={{
                    width: `${state.percent}%`,
                    background: `linear-gradient(90deg, rgb(${world.rgb}), rgb(${world.rgbAlt}), #ffffff)`,
                    boxShadow: `0 0 18px rgba(${world.rgb}, .8)`,
                }}
            />
        </div>
    </header>
);

/* ══════════════════════════════════════════════════════════════════════
   World rail (left navigation)
   ══════════════════════════════════════════════════════════════════════ */

const WorldRail: React.FC<{
    state: PioneerState;
    activeSectionId: string;
    activeWorldIndex: number;
    completedSections: Set<string>;
    onSelect: (sectionId: string) => void;
}> = ({ state, activeSectionId, activeWorldIndex, completedSections, onSelect }) => (
    <nav className="pa-glass pa-edge overflow-hidden rounded-[1.6rem]" style={worldVars(state.worlds[activeWorldIndex]?.world ?? PIONEER_WORLDS[0])}>
        <div className="border-b border-white/8 px-4 py-3.5">
            <p className="text-[9px] font-black uppercase tracking-[0.28em] text-slate-400">World Atlas</p>
            <p className="mt-0.5 text-sm font-black text-white">
                {state.worlds.filter((w) => w.cleared).length}/{state.worlds.length} worlds cleared
            </p>
        </div>

        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-2.5">
            {state.worlds.map((worldState) => {
                const { world, module, index } = worldState;
                const isActiveWorld = index === activeWorldIndex;

                return (
                    <div
                        key={module.id}
                        className={`mb-2 overflow-hidden rounded-[1.15rem] border transition ${
                            isActiveWorld ? 'border-white/18 bg-white/[0.05]' : 'border-white/8 bg-black/25'
                        }`}
                        style={worldVars(world)}
                    >
                        <button
                            type="button"
                            onClick={() => onSelect(module.id)}
                            className="flex w-full items-center gap-2.5 px-2.5 py-2.5 text-left transition hover:bg-white/[0.06]"
                        >
                            <WorldGlyph
                                kind={world.glyph}
                                rgb={world.rgb}
                                rgbAlt={world.rgbAlt}
                                charge={worldState.percent}
                                dormant={!worldState.unlocked}
                                className="h-10 w-10 shrink-0"
                            />
                            <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-1.5">
                                    <span
                                        className="text-[10px] font-black uppercase tracking-[0.2em]"
                                        style={{ color: `rgb(${world.rgb})` }}
                                    >
                                        {world.codename}
                                    </span>
                                    {worldState.cleared && (
                                        <span className="rounded-full bg-emerald-400/20 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] text-emerald-200">
                                            Clear
                                        </span>
                                    )}
                                </span>
                                <span className="mt-0.5 block truncate text-[11px] font-bold text-slate-300">
                                    {worldState.completedSections}/{worldState.sections.length} quests
                                </span>
                            </span>
                            <span className="pa-tabular shrink-0 text-xs font-black text-white">{worldState.percent}%</span>
                        </button>

                        <div className="space-y-1 px-2 pb-2">
                            {worldState.sections.map((section, sectionIndex) => {
                                const done = completedSections.has(section.id);
                                const active = section.id === activeSectionId;

                                return (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => onSelect(section.id)}
                                        className={`flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-[12px] font-bold transition ${
                                            active
                                                ? 'border-white/25 bg-white/[0.12] text-white'
                                                : done
                                                    ? 'border-emerald-300/20 bg-emerald-400/[0.08] text-emerald-100/90 hover:bg-emerald-400/[0.14]'
                                                    : 'border-transparent text-slate-300 hover:bg-white/[0.07] hover:text-white'
                                        }`}
                                    >
                                        <span
                                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[9px] font-black ${
                                                done ? 'text-slate-950' : 'bg-white/[0.08] text-slate-200'
                                            }`}
                                            style={done ? { background: `rgb(${world.rgb})` } : undefined}
                                        >
                                            {done ? (
                                                <svg viewBox="0 0 14 14" className="h-3 w-3" aria-hidden="true">
                                                    <path d="M3 7.5 L6 10.5 L11.5 4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ) : (
                                                sectionIndex + 1
                                            )}
                                        </span>
                                        <span className="min-w-0 flex-1 truncate">{repaired(section.title).replace(/^Section \d+:\s*/i, '')}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    </nav>
);

/* ══════════════════════════════════════════════════════════════════════
   Atlas — the four-world journey map
   ══════════════════════════════════════════════════════════════════════ */

const AtlasMap: React.FC<{
    state: PioneerState;
    activeWorldIndex: number;
    onSelect: (sectionId: string) => void;
}> = ({ state, activeWorldIndex, onSelect }) => (
    <section
        className="pa-glass pa-edge relative overflow-hidden rounded-[1.9rem] p-5 sm:p-7"
        style={worldVars(state.worlds[activeWorldIndex]?.world ?? PIONEER_WORLDS[0])}
    >
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">The route</p>
                <h2 className="pa-title-lift mt-1.5 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                    Four worlds. One credential.
                </h2>
            </div>
            <Chip className="border-white/15 bg-white/[0.06] text-slate-200">
                {state.sectionsDone}/{state.sectionsTotal} quests cleared
            </Chip>
        </div>

        {/* Route ribbon: a single glowing line whose filled portion tracks how
            far along the four-world path the learner has travelled. */}
        <div className="mt-5 hidden h-14 xl:block">
            <AtlasRoute
                charges={state.worlds.map((world) => world.percent)}
                colors={state.worlds.map((world) => world.world.rgb)}
                labels={state.worlds.map((world) => world.world.codename)}
                className="h-full w-full"
            />
        </div>

        <div className="relative mt-3">
            <div className="relative grid items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {state.worlds.map((worldState) => {
                    const { world, module, index } = worldState;
                    const isActive = index === activeWorldIndex;

                    return (
                        <button
                            key={module.id}
                            type="button"
                            onClick={() => onSelect(module.id)}
                            style={worldVars(world)}
                            className={`pa-holo pa-sheen group relative flex flex-col overflow-hidden rounded-[1.5rem] border p-4 text-left transition duration-300 hover:-translate-y-1.5 ${
                                isActive
                                    ? 'border-white/30 bg-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,.5)]'
                                    : 'border-white/10 bg-black/40 hover:border-white/22'
                            }`}
                        >
                            <div
                                className="pointer-events-none absolute inset-0 opacity-70"
                                style={{ background: `radial-gradient(120% 80% at 50% -20%, rgba(${world.rgb}, .22), transparent 62%)` }}
                            />

                            <div className="relative flex items-start justify-between gap-3">
                                <WorldGlyph
                                    kind={world.glyph}
                                    rgb={world.rgb}
                                    rgbAlt={world.rgbAlt}
                                    charge={worldState.percent}
                                    dormant={!worldState.unlocked}
                                    className={`h-16 w-16 shrink-0 ${isActive ? 'pa-float' : ''}`}
                                />
                                <div className="text-right">
                                    <p className="pa-tabular text-2xl font-black leading-none text-white">{worldState.percent}%</p>
                                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">complete</p>
                                </div>
                            </div>

                            <p
                                className="relative mt-3.5 text-[11px] font-black uppercase tracking-[0.28em]"
                                style={{ color: `rgb(${world.rgb})` }}
                            >
                                World {index + 1} · {world.codename}
                            </p>
                            <h3 className="pa-title-lift relative mt-1 text-base font-black leading-snug text-white">
                                {repaired(module.title).replace(/^Module \d+:\s*/i, '')}
                            </h3>
                            <p className="relative mt-1.5 text-[11px] font-semibold leading-5 text-slate-400">{world.tagline}</p>

                            <div className="relative mt-3.5 flex flex-wrap gap-1.5">
                                <Chip className="border-white/12 bg-black/40 text-slate-300">{count(worldState.sections.length, 'quest')}</Chip>
                                <Chip className="border-white/12 bg-black/40 text-slate-300">{count(worldState.apps.length, 'app')}</Chip>
                                <Chip className="border-white/12 bg-black/40 text-slate-300">{count(worldState.labs.length, 'build')}</Chip>
                            </div>

                            <div className="relative mt-auto pt-3.5">
                                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${worldState.percent}%`,
                                            background: `linear-gradient(90deg, rgb(${world.rgb}), rgb(${world.rgbAlt}))`,
                                            boxShadow: `0 0 12px rgba(${world.rgb}, .65)`,
                                        }}
                                    />
                                </div>
                                <p className="mt-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/70 transition group-hover:text-white">
                                    {worldState.cleared
                                        ? 'Revisit world →'
                                        : worldState.percent > 0
                                            ? 'Continue world →'
                                            : 'Enter world →'}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    </section>
);

/* ══════════════════════════════════════════════════════════════════════
   Trophy case
   ══════════════════════════════════════════════════════════════════════ */

const TrophyCase: React.FC<{ state: PioneerState; world: PioneerWorld }> = ({ state, world }) => {
    const earned = state.badges.filter((badge) => badge.earned).length;

    return (
        <section className="pa-glass pa-edge overflow-hidden rounded-[1.9rem] p-5 sm:p-6" style={worldVars(world)}>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Trophy case</p>
                    <h2 className="pa-title-lift mt-1.5 text-xl font-black tracking-tight text-white sm:text-2xl">
                        {earned} of {state.badges.length} unlocked
                    </h2>
                </div>
                <Chip className={world.chip}>{state.rank.rank.name} · Tier {state.rank.index + 1}</Chip>
            </div>

            <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">{state.rank.rank.blurb}</p>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {state.badges.map((badge) => (
                    <div
                        key={badge.id}
                        className={`pa-holo relative overflow-hidden rounded-[1.15rem] border p-3 text-center transition ${
                            badge.earned
                                ? 'border-white/20 bg-white/[0.07]'
                                : 'border-white/8 bg-black/35'
                        }`}
                        style={worldVars(world)}
                    >
                        <BadgeMedal
                            glyph={badge.glyph}
                            earned={badge.earned}
                            rgb={world.rgb}
                            rgbAlt={world.rgbAlt}
                            className={`mx-auto h-12 w-12 ${badge.earned ? 'pa-float' : 'opacity-70'}`}
                        />
                        <p className={`mt-2 text-[11px] font-black leading-tight ${badge.earned ? 'text-white' : 'text-slate-400'}`}>
                            {badge.name}
                        </p>
                        <p className="mt-1 text-[10px] font-semibold leading-4 text-slate-500">{badge.hint}</p>
                        {!badge.earned && badge.progress > 0 && (
                            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${badge.progress}%`, background: `rgba(${world.rgb}, .8)` }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

/* ══════════════════════════════════════════════════════════════════════
   World briefing (module view)
   ══════════════════════════════════════════════════════════════════════ */

const WorldBriefing: React.FC<{
    worldState: WorldState;
    completedSections: Set<string>;
    completedLabs: Set<string>;
    exploredApps: Set<string>;
    summaryOf: (section: ProgramSection) => string;
    onSelect: (sectionId: string) => void;
}> = ({ worldState, completedSections, completedLabs, exploredApps, summaryOf, onSelect }) => {
    const { world, module, index } = worldState;
    const openSection = worldState.sections.find((section) => !completedSections.has(section.id));
    const nextSection = openSection ?? worldState.sections[0];

    return (
        <div className="grid gap-4" style={worldVars(world)}>
            <section className="zt-plate relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
                <GuillocheWatermark rgb={world.rgb} opacity={0.18} />
                <GuillocheBand rgb={world.rgb} className="pointer-events-none absolute inset-x-0 top-0 h-8 opacity-75" />
                <SecurityThread rgb={world.rgb} label={`${world.codename} · ZEN AI PIONEER`} className="pointer-events-none absolute inset-x-0 bottom-0 h-4" />
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: `radial-gradient(90% 120% at 88% -20%, rgba(${world.rgb}, .2), transparent 58%)` }}
                />
                <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Chip className={world.chip}>World {index + 1}</Chip>
                            <Chip className="border-white/12 bg-black/40 text-slate-300">{count(worldState.sections.length, 'quest')}</Chip>
                            {worldState.apps.length > 0 && (
                                <Chip className="border-white/12 bg-black/40 text-slate-300">{count(worldState.apps.length, 'app')}</Chip>
                            )}
                            {worldState.labs.length > 0 && (
                                <Chip className="border-white/12 bg-black/40 text-slate-300">{count(worldState.labs.length, 'build quest')}</Chip>
                            )}
                            {worldState.cleared && (
                                <Chip className="border-emerald-300/40 bg-emerald-400/15 text-emerald-100">World cleared</Chip>
                            )}
                        </div>

                        <p className="zt-ovi mt-5 text-xs font-black uppercase tracking-[0.4em]">
                            {world.codename}
                        </p>
                        <h1 className="pa-title-lift mt-2 max-w-3xl text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">
                            {repaired(module.title).replace(/^Module \d+:\s*/i, '')}
                        </h1>
                        <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-300">{world.tagline}.</p>
                        <p className="mt-1.5 max-w-2xl text-[13px] font-medium italic leading-6 text-slate-500">{world.craft}</p>

                        <div className="mt-6 flex flex-wrap items-center gap-2.5">
                            <button
                                type="button"
                                onClick={() => onSelect(nextSection.id)}
                                className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black text-slate-950 shadow-[0_16px_38px_rgba(0,0,0,.45)] transition hover:-translate-y-0.5"
                                style={{ background: `linear-gradient(90deg, #ffffff, rgb(${world.rgb}))` }}
                            >
                                {worldState.cleared ? 'Replay world' : worldState.completedSections > 0 ? 'Continue world' : 'Start world'}
                                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true">
                                    <path d="M3 8 H12 M8.5 4 L12.5 8 L8.5 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <span className="text-xs font-bold text-slate-400">
                                {openSection
                                    ? `Next up: ${repaired(openSection.title).replace(/^Section \d+:\s*/i, '')}`
                                    : 'Every quest here is sealed — jump back in any time.'}
                            </span>
                        </div>
                    </div>

                    <div className="relative flex shrink-0 items-center justify-center">
                        <EngravedMedallion
                            rgb={world.rgb}
                            rgbAlt={world.rgbAlt}
                            charge={worldState.percent}
                            className="pa-float h-44 w-44 sm:h-56 sm:w-56"
                        >
                            <WorldGlyph
                                kind={world.glyph}
                                rgb={world.rgb}
                                rgbAlt={world.rgbAlt}
                                bare
                                className="h-1/2 w-1/2"
                            />
                        </EngravedMedallion>
                    </div>
                </div>

                {/* Module intro content lives here so nothing from the curriculum is lost. */}
                {module.content.length > 0 && (
                    <div className="relative mt-7 grid gap-2.5 sm:grid-cols-2">
                        {module.content
                            .filter((item): item is ProgramCalloutContentItem | ProgramTextContentItem => (
                                item.type === 'callout' || item.type === 'paragraph' || item.type === 'list'
                            ))
                            .slice(0, 4)
                            .map((item, itemIndex) => (
                                <div key={itemIndex} className="rounded-[1.15rem] border border-white/10 bg-black/35 p-3.5">
                                    {item.type === 'callout' && item.title && (
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: `rgb(${world.rgb})` }}>
                                            {repaired(item.title)}
                                        </p>
                                    )}
                                    <div className="mt-1.5 space-y-1.5 text-[13px] font-semibold leading-6 text-slate-300">
                                        {repairedList(item.content as string | string[]).map((line) => (
                                            <p key={line}>{renderHighlightedText(line)}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </section>

            {/* Quest cards */}
            <section className="grid gap-3.5 md:grid-cols-2">
                {worldState.sections.map((section, sectionIndex) => {
                    const done = completedSections.has(section.id);
                    const apps = appsIn(section);
                    const labs = labsIn(section);
                    const appsDone = apps.filter((app) => exploredApps.has(app.title)).length;
                    const labsDone = labs.filter((lab) => completedLabs.has(lab.id)).length;
                    const questPercent = Math.round(
                        (((appsDone + labsDone + (done ? 1 : 0)) / Math.max(1, apps.length + labs.length + 1)) * 100),
                    );

                    return (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => onSelect(section.id)}
                            className="pa-glass pa-sheen group relative overflow-hidden rounded-[1.7rem] p-5 text-left transition duration-300 hover:-translate-y-1.5 hover:border-white/25"
                            style={worldVars(world)}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <CornerCartouche
                                        value={String(sectionIndex + 1).padStart(2, '0')}
                                        rgb={world.rgb}
                                        className="h-12 w-12 shrink-0"
                                    />
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.24em] text-slate-400">Quest {sectionIndex + 1}</p>
                                        <p className="pa-tabular text-[11px] font-bold text-slate-400">{questPercent}% charged</p>
                                    </div>
                                </div>
                                {done ? (
                                    <Chip className="border-emerald-300/40 bg-emerald-400/15 text-emerald-100">Sealed</Chip>
                                ) : (
                                    <Chip className="border-white/15 bg-white/[0.06] text-slate-200">Open</Chip>
                                )}
                            </div>

                            <h3 className="pa-title-lift mt-4 text-xl font-black leading-snug tracking-tight text-white">
                                {repaired(section.title).replace(/^Section \d+:\s*/i, '')}
                            </h3>
                            <p className="mt-2 line-clamp-3 text-[13px] font-semibold leading-6 text-slate-400">{summaryOf(section)}</p>

                            <div className="mt-4 flex flex-wrap gap-1.5">
                                {apps.length > 0 && (
                                    <Chip className="border-white/12 bg-black/40 text-slate-300">
                                        {appsDone}/{apps.length} apps
                                    </Chip>
                                )}
                                {labs.length > 0 && (
                                    <Chip className="border-white/12 bg-black/40 text-slate-300">
                                        {labsDone}/{labs.length} builds
                                    </Chip>
                                )}
                                <XpChip amount={apps.length * XP_PER_APP + labs.length * XP_PER_LAB + XP_PER_SECTION} earned={done} />
                            </div>

                            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: `${questPercent}%`,
                                        background: `linear-gradient(90deg, rgb(${world.rgb}), rgb(${world.rgbAlt}))`,
                                    }}
                                />
                            </div>
                        </button>
                    );
                })}
            </section>

            {/* Boss builds */}
            {worldState.labs.length > 0 && (
                <section className="pa-glass pa-edge overflow-hidden rounded-[1.9rem] p-5 sm:p-6">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Build quests in this world</p>
                            <h2 className="pa-title-lift mt-1.5 text-xl font-black tracking-tight text-white sm:text-2xl">
                                The proof you walk away with.
                            </h2>
                        </div>
                        <Chip className={world.chip}>
                            {worldState.completedLabs}/{worldState.labs.length} shipped
                        </Chip>
                    </div>

                    <div className="mt-5 grid gap-2.5 md:grid-cols-2">
                        {worldState.labs.map((lab) => {
                            const done = completedLabs.has(lab.id);
                            return (
                                <div
                                    key={lab.id}
                                    className={`relative overflow-hidden rounded-[1.25rem] border p-4 ${
                                        done ? 'border-emerald-300/30 bg-emerald-400/[0.09]' : 'border-white/10 bg-black/35'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <h4 className="text-sm font-black leading-snug text-white">{repaired(lab.title)}</h4>
                                        <XpChip amount={XP_PER_LAB} earned={done} />
                                    </div>
                                    <p className="mt-2 text-[12px] font-semibold leading-6 text-slate-400">{repaired(lab.objective)}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════════════
   Objective rail (Learn → Play → Build → Prove)
   ══════════════════════════════════════════════════════════════════════ */

const ObjectiveRail: React.FC<{
    steps: ReturnType<typeof buildQuestSteps>;
    world: PioneerWorld;
}> = ({ steps, world }) => (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" style={worldVars(world)}>
        {steps.map((step, index) => (
            <div
                key={step.key}
                className={`relative overflow-hidden rounded-[1.1rem] border px-3 py-2.5 transition ${
                    step.done ? 'border-white/22 bg-white/[0.08]' : 'border-white/10 bg-black/35'
                }`}
            >
                <div className="flex items-center gap-2">
                    <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black ${
                            step.done ? 'text-slate-950' : 'bg-white/[0.08] text-slate-300'
                        }`}
                        style={step.done ? { background: `rgb(${world.rgb})` } : undefined}
                    >
                        {step.done ? (
                            <svg viewBox="0 0 14 14" className="h-3 w-3" aria-hidden="true">
                                <path d="M3 7.5 L6 10.5 L11.5 4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            index + 1
                        )}
                    </span>
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white">{step.label}</p>
                </div>
                <p className="mt-1.5 truncate text-[11px] font-semibold text-slate-400">{step.detail}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${step.percent}%`, background: `rgba(${world.rgb}, .85)` }}
                    />
                </div>
            </div>
        ))}
    </div>
);

/* ══════════════════════════════════════════════════════════════════════
   Arcade cabinet — one interactive app
   ══════════════════════════════════════════════════════════════════════ */

const AppCabinet: React.FC<{
    item: ProgramResourceContentItem;
    world: PioneerWorld;
    explored: boolean;
    onExplore: () => void;
    defaultOpen?: boolean;
}> = ({ item, world, explored, onExplore, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);
    const interactive = item.interactive ? renderPioneerInteractive(item, onExplore) : null;
    const externalOnly = !item.interactive && Boolean(item.href);

    return (
        <article className="pa-cabinet pa-holo" style={worldVars(world)}>
            <div className="pa-cabinet-bezel relative flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="flex min-w-0 items-center gap-2.5">
                    <span className="pa-led shrink-0" />
                    <div className="min-w-0">
                        <h4 className="pa-text-lift truncate text-sm font-black tracking-tight text-white sm:text-base">
                            {repaired(item.title)}
                        </h4>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <Chip className="border-white/15 bg-black/40 text-slate-300">{item.status ?? 'External'}</Chip>
                            {item.interactive && <Chip className={world.chip}>Playable</Chip>}
                            <XpChip amount={XP_PER_APP} earned={explored} />
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {explored && (
                        <Chip className="border-emerald-300/40 bg-emerald-400/15 text-emerald-100">
                            <svg viewBox="0 0 14 14" className="h-2.5 w-2.5" aria-hidden="true">
                                <path d="M3 7.5 L6 10.5 L11.5 4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Cleared
                        </Chip>
                    )}
                    {(interactive || item.instructions?.length || item.href) && (
                        <button
                            type="button"
                            onClick={() => setOpen((value) => !value)}
                            aria-expanded={open}
                            className="rounded-full px-4 py-1.5 text-xs font-black text-slate-950 shadow-[0_10px_26px_rgba(0,0,0,.4)] transition hover:-translate-y-0.5"
                            style={{ background: `linear-gradient(90deg, #ffffff, rgb(${world.rgb}))` }}
                        >
                            {open ? 'Close' : interactive ? 'Play' : 'Open'}
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4">
                <div className="grid gap-2.5 md:grid-cols-2">
                    <div className="rounded-[1rem] border border-white/10 bg-black/40 p-3.5">
                        <p className="text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: `rgb(${world.rgb})` }}>
                            What it is
                        </p>
                        <p className="mt-1.5 text-[13px] font-semibold leading-6 text-slate-300">
                            {renderHighlightedText(item.what ?? 'A tool or app connected to this quest.')}
                        </p>
                    </div>
                    <div className="rounded-[1rem] border border-emerald-300/20 bg-emerald-400/[0.07] p-3.5">
                        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-emerald-200">Why it matters</p>
                        <p className="mt-1.5 text-[13px] font-semibold leading-6 text-emerald-50/90">
                            {renderHighlightedText(item.why ?? 'It turns the idea into something you can test.')}
                        </p>
                    </div>
                </div>

                {open && (
                    <div className="pa-rise mt-3.5">
                        {item.instructions?.length ? (
                            <ol className="mb-3.5 grid gap-2 sm:grid-cols-2">
                                {item.instructions.map((instruction, index) => (
                                    <li
                                        key={instruction}
                                        className="flex items-start gap-2.5 rounded-[1rem] border border-white/10 bg-black/35 p-3 text-[12px] font-semibold leading-6 text-slate-300"
                                    >
                                        <span
                                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black text-slate-950"
                                            style={{ background: `rgb(${world.rgb})` }}
                                        >
                                            {index + 1}
                                        </span>
                                        <span>{renderHighlightedText(instruction)}</span>
                                    </li>
                                ))}
                            </ol>
                        ) : null}

                        {interactive}

                        {item.href && (
                            <a
                                href={item.href}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/[0.07] px-4 py-2.5 text-xs font-black text-white transition hover:bg-white/[0.14]"
                            >
                                Open the real tool
                                <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
                                    <path d="M6 3 H13 V10 M13 3 L4 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                        )}
                    </div>
                )}

                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5 border-t border-white/8 pt-3.5">
                    <p className="max-w-xl text-[11px] font-semibold leading-5 text-slate-500">
                        {item.completionHint
                            ? renderHighlightedText(item.completionHint)
                            : externalOnly
                                ? 'Open the tool, try it once, then mark it cleared.'
                                : 'Play with it until you can explain what changed, then mark it cleared.'}
                    </p>
                    <button
                        type="button"
                        onClick={onExplore}
                        disabled={explored}
                        className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                            explored
                                ? 'cursor-default border border-emerald-300/30 bg-emerald-400/15 text-emerald-100'
                                : 'border border-white/20 bg-white/[0.08] text-white hover:-translate-y-0.5 hover:bg-white/[0.16]'
                        }`}
                    >
                        {explored ? 'Cleared' : `Mark cleared · +${XP_PER_APP} XP`}
                    </button>
                </div>
            </div>
        </article>
    );
};

/* ══════════════════════════════════════════════════════════════════════
   Mission pod — a concept plus the apps that teach it
   ══════════════════════════════════════════════════════════════════════ */

const keywordTone: Record<string, string> = {
    cyan: 'border-cyan-300/35 bg-cyan-400/12 text-cyan-100',
    violet: 'border-violet-300/35 bg-violet-400/12 text-violet-100',
    rose: 'border-rose-300/35 bg-rose-400/12 text-rose-100',
    emerald: 'border-emerald-300/35 bg-emerald-400/12 text-emerald-100',
    amber: 'border-amber-300/35 bg-amber-400/12 text-amber-100',
};

const MissionPod: React.FC<{
    pod: ConceptMissionPod;
    index: number;
    world: PioneerWorld;
    exploredApps: Set<string>;
    onExplore: (title: string) => void;
}> = ({ pod, index, world, exploredApps, onExplore }) => {
    const cleared = pod.resources.filter((resource) => exploredApps.has(resource.title)).length;
    const percent = Math.round((cleared / Math.max(1, pod.resources.length)) * 100);
    const [openKeyword, setOpenKeyword] = useState<string | null>(null);

    return (
        <section className="zt-plate relative overflow-hidden rounded-[1.8rem]" style={worldVars(world)}>
            <GuillocheBand rgb={world.rgb} className="pointer-events-none absolute inset-x-0 top-0 h-6 opacity-55" />
            <div
                className="pointer-events-none absolute inset-0"
                style={{ background: `radial-gradient(80% 100% at 100% 0%, rgba(${world.rgb}, .16), transparent 55%)` }}
            />

            <div className="relative border-b border-white/8 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3.5">
                        <CornerCartouche
                            value={String(index + 1).padStart(2, '0')}
                            rgb={world.rgb}
                            className="h-13 w-13 shrink-0"
                            />
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">Mission {index + 1}</p>
                            <h3 className="pa-title-lift mt-1 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                                {repaired(pod.title)}
                            </h3>
                            <p className="mt-1.5 text-sm font-semibold leading-6 text-slate-400">{repaired(pod.subtitle)}</p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        <PowerCore
                            percent={percent}
                            rgb={world.rgb}
                            rgbAlt={world.rgbAlt}
                            label={`${cleared}`}
                            sublabel={`OF ${pod.resources.length}`}
                            className="h-20 w-20"
                        />
                    </div>
                </div>

                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-[1.2rem] border border-white/10 bg-black/40 p-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: `rgb(${world.rgb})` }}>
                            In plain language
                        </p>
                        <p className="mt-2 text-[14px] font-semibold leading-7 text-slate-200">
                            {renderHighlightedText(pod.plainLanguage)}
                        </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-emerald-300/20 bg-emerald-400/[0.07] p-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-emerald-200">Why you care</p>
                        <p className="mt-2 text-[14px] font-semibold leading-7 text-emerald-50/90">
                            {renderHighlightedText(pod.whyItMatters)}
                        </p>
                    </div>
                </div>

                {/* Keyword cards — tap to flip open the definition */}
                <div className="mt-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">Word cards · tap to reveal</p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                        {pod.keywords.map((keyword) => {
                            const open = openKeyword === keyword.term;
                            return (
                                <button
                                    key={keyword.term}
                                    type="button"
                                    onClick={() => setOpenKeyword(open ? null : keyword.term)}
                                    className={`pa-holo group max-w-full rounded-[1rem] border px-3.5 py-2.5 text-left transition hover:-translate-y-0.5 ${
                                        keywordTone[keyword.tone] ?? keywordTone.cyan
                                    } ${open ? 'w-full sm:w-[22rem]' : ''}`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-[13px] font-black tracking-tight">{keyword.term}</span>
                                        <svg
                                            viewBox="0 0 12 12"
                                            className={`h-2.5 w-2.5 transition ${open ? 'rotate-180' : ''}`}
                                            aria-hidden="true"
                                        >
                                            <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    {open && (
                                        <span className="pa-rise mt-1.5 block text-[12px] font-semibold leading-5 opacity-90">
                                            {repaired(keyword.definition)}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Mission steps */}
                <div className="mt-4 grid gap-2 lg:grid-cols-3">
                    {pod.steps.map((step, stepIndex) => (
                        <div key={step} className="flex items-start gap-2.5 rounded-[1rem] border border-white/10 bg-black/35 p-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.09] text-[10px] font-black text-white">
                                {stepIndex + 1}
                            </span>
                            <span className="text-[12px] font-semibold leading-6 text-slate-300">{renderHighlightedText(step)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative grid gap-3.5 p-5 sm:p-6">
                {pod.resources.map((resource, resourceIndex) => (
                    <AppCabinet
                        key={resource.title}
                        item={resource}
                        world={world}
                        explored={exploredApps.has(resource.title)}
                        onExplore={() => onExplore(resource.title)}
                        defaultOpen={resourceIndex === 0 && cleared === 0}
                    />
                ))}
            </div>
        </section>
    );
};

/* ══════════════════════════════════════════════════════════════════════
   Build quest (lab)
   ══════════════════════════════════════════════════════════════════════ */

const BuildQuest: React.FC<{
    lab: ProgramLabContentItem;
    world: PioneerWorld;
    complete: boolean;
    ticks: number[];
    reflection: string;
    onTick: (index: number) => void;
    onReflection: (value: string) => void;
    onComplete: () => void;
}> = ({ lab, world, complete, ticks, reflection, onTick, onReflection, onComplete }) => {
    const done = ticks.length;
    const percent = Math.round((done / Math.max(1, lab.steps.length)) * 100);

    return (
        <article
            className={`pa-glass pa-edge relative overflow-hidden rounded-[1.8rem] p-5 sm:p-6 ${
                complete ? 'border-emerald-300/30' : ''
            }`}
            style={worldVars(world)}
        >
            <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'radial-gradient(70% 90% at 100% 0%, rgba(16,185,129,.16), transparent 58%)' }}
            />

            <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <Chip className="border-emerald-300/40 bg-emerald-400/15 text-emerald-100">Build quest</Chip>
                        <XpChip amount={XP_PER_LAB} earned={complete} />
                        {complete && <Chip className="border-white/18 bg-white/[0.07] text-white">Shipped</Chip>}
                    </div>
                    <h3 className="pa-title-lift mt-3 text-2xl font-black tracking-[-0.03em] text-white">{repaired(lab.title)}</h3>
                    <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-slate-300">
                        <span className="font-black text-white">Objective — </span>
                        {renderHighlightedText(lab.objective)}
                    </p>
                </div>

                <PowerCore
                    percent={complete ? 100 : percent}
                    rgb="52, 211, 153"
                    rgbAlt="45, 212, 191"
                    label={`${complete ? lab.steps.length : done}`}
                    sublabel={`OF ${lab.steps.length}`}
                    className="h-20 w-20 shrink-0"
                />
            </div>

            <div className="relative mt-5 grid gap-2">
                {lab.steps.map((step, index) => {
                    const ticked = complete || ticks.includes(index);
                    return (
                        <button
                            key={step}
                            type="button"
                            onClick={() => onTick(index)}
                            className={`group flex items-start gap-3 rounded-[1.1rem] border p-3.5 text-left transition ${
                                ticked
                                    ? 'border-emerald-300/30 bg-emerald-400/[0.09]'
                                    : 'border-white/10 bg-black/35 hover:border-white/22 hover:bg-white/[0.05]'
                            }`}
                        >
                            <span
                                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[10px] font-black transition ${
                                    ticked
                                        ? 'border-emerald-200/50 bg-emerald-300 text-emerald-950'
                                        : 'border-white/20 bg-white/[0.06] text-slate-300 group-hover:border-white/40'
                                }`}
                            >
                                {ticked ? (
                                    <svg viewBox="0 0 14 14" className="h-3 w-3" aria-hidden="true">
                                        <path d="M3 7.5 L6 10.5 L11.5 4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </span>
                            <span className={`text-[13px] font-semibold leading-7 ${ticked ? 'text-emerald-50/85' : 'text-slate-300'}`}>
                                {renderHighlightedText(step)}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="relative mt-4 rounded-[1.2rem] border border-white/10 bg-black/40 p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: `rgb(${world.rgb})` }}>
                    What good looks like
                </p>
                <p className="mt-2 text-[13px] font-semibold leading-7 text-slate-300">
                    {renderHighlightedText(lab.expectedOutput)}
                </p>
            </div>

            {lab.reflectionPrompt && (
                <div className="relative mt-3.5">
                    <label className="text-[9px] font-black uppercase tracking-[0.22em] text-emerald-200" htmlFor={`reflect-${lab.id}`}>
                        Field log
                    </label>
                    <p className="mt-1.5 text-[13px] font-semibold leading-6 text-slate-400">
                        {renderHighlightedText(lab.reflectionPrompt)}
                    </p>
                    <div className="mt-2.5 overflow-hidden rounded-[1rem] border border-emerald-300/25 bg-[#02050b] shadow-[inset_0_0_36px_rgba(16,185,129,.09)]">
                        <div className="flex items-center gap-2 border-b border-emerald-300/15 px-3.5 py-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,.9)]" />
                            <span className="font-jetbrains text-[10px] uppercase tracking-[0.18em] text-emerald-300/70">
                                reflection.log
                            </span>
                        </div>
                        <textarea
                            id={`reflect-${lab.id}`}
                            value={reflection}
                            onChange={(event) => onReflection(event.target.value)}
                            rows={3}
                            placeholder="Write what you built, what broke, and what you would change."
                            className="w-full resize-y bg-transparent px-3.5 py-3 font-jetbrains text-[13px] leading-6 text-emerald-100 outline-none placeholder:text-emerald-200/30"
                        />
                    </div>
                </div>
            )}

            <div className="relative mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
                <p className="text-[11px] font-semibold text-slate-500">
                    {complete
                        ? 'Shipped. This build counts toward your credential evidence.'
                        : `${done}/${lab.steps.length} steps ticked. Ship it when the evidence exists.`}
                </p>
                <button
                    type="button"
                    onClick={onComplete}
                    disabled={complete}
                    className={`rounded-full px-5 py-2.5 text-sm font-black transition ${
                        complete
                            ? 'cursor-default border border-emerald-300/30 bg-emerald-400/15 text-emerald-100'
                            : 'bg-gradient-to-r from-emerald-200 to-teal-300 text-emerald-950 shadow-[0_14px_34px_rgba(16,185,129,.32)] hover:-translate-y-0.5'
                    }`}
                >
                    {complete ? 'Build shipped' : `Ship build · +${XP_PER_LAB} XP`}
                </button>
            </div>
        </article>
    );
};

/* ══════════════════════════════════════════════════════════════════════
   Quest dock (sticky bottom bar)
   ══════════════════════════════════════════════════════════════════════ */

const QuestDock: React.FC<{
    world: PioneerWorld;
    complete: boolean;
    percent: number;
    previous: ProgramSection | null;
    next: ProgramSection | null;
    onGo: (id: string) => void;
    onComplete: () => void;
}> = ({ world, complete, percent, previous, next, onGo, onComplete }) => (
    <div className="sticky bottom-3 z-30 mt-1" style={worldVars(world)}>
        <div className="pa-glass pa-edge flex flex-wrap items-center gap-3 rounded-[1.5rem] px-4 py-3.5">
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Quest charge</p>
                    <p className="pa-tabular text-[11px] font-black text-white">{percent}%</p>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                            width: `${percent}%`,
                            background: `linear-gradient(90deg, rgb(${world.rgb}), rgb(${world.rgbAlt}))`,
                            boxShadow: `0 0 12px rgba(${world.rgb}, .6)`,
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {previous && (
                    <button
                        type="button"
                        onClick={() => onGo(previous.id)}
                        className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-xs font-black text-white transition hover:bg-white/[0.13]"
                    >
                        Back
                    </button>
                )}
                <button
                    type="button"
                    onClick={onComplete}
                    disabled={complete}
                    className={`rounded-full px-5 py-2.5 text-xs font-black transition ${
                        complete
                            ? 'cursor-default border border-emerald-300/30 bg-emerald-400/15 text-emerald-100'
                            : 'bg-gradient-to-r from-emerald-200 to-teal-300 text-emerald-950 shadow-[0_14px_32px_rgba(16,185,129,.3)] hover:-translate-y-0.5'
                    }`}
                >
                    {complete ? 'Quest sealed' : `Seal quest · +${XP_PER_SECTION} XP`}
                </button>
                {next && (
                    <button
                        type="button"
                        onClick={() => onGo(next.id)}
                        className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black text-slate-950 shadow-[0_14px_32px_rgba(0,0,0,.4)] transition hover:-translate-y-0.5"
                        style={{ background: `linear-gradient(90deg, #ffffff, rgb(${world.rgb}))` }}
                    >
                        Next quest
                        <svg viewBox="0 0 16 16" className="h-3 w-3 transition group-hover:translate-x-0.5" aria-hidden="true">
                            <path d="M3 8 H12 M8.5 4 L12.5 8 L8.5 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════════════════════
   Rank-up celebration
   ══════════════════════════════════════════════════════════════════════ */

const RankUpOverlay: React.FC<{
    rankName: string;
    blurb: string;
    tier: number;
    xp: number;
    nextRank: string | null;
    xpToNext: number;
    world: PioneerWorld;
    onClose: () => void;
}> = ({ rankName, blurb, tier, xp, nextRank, xpToNext, world, onClose }) => (
    <div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-6 backdrop-blur-md"
        style={worldVars(world)}
        role="dialog"
        aria-modal="true"
        aria-label={`Rank up: ${rankName}`}
    >
        {/* Burst sits above the card (and is click-through) so the confetti
            reads over the panel instead of vanishing behind it. */}
        <CelebrationBurst seed={tier} className="z-20" />

        <div className="pa-pop pa-glass pa-edge relative z-10 w-full max-w-md rounded-[2rem] p-8 text-center">
            <div className="relative mx-auto h-32 w-32">
                <span
                    className="pa-pulse absolute inset-0 rounded-full blur-2xl"
                    style={{ background: `rgba(${world.rgb}, .55)` }}
                />
                <RankSigil rank={tier} rgb={world.rgb} className="pa-float relative h-32 w-32" />
            </div>

            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: `rgb(${world.rgb})` }}>
                Rank up
            </p>
            <h2 className="pa-title-lift mt-2 text-5xl font-black tracking-[-0.05em] text-white">{rankName}</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">{blurb}</p>

            <div className="mt-5 flex items-center justify-center gap-2">
                <Chip className={world.chip}>Tier {tier + 1}</Chip>
                <Chip className="border-white/15 bg-white/[0.06] text-slate-200">
                    <CountUp value={xp} /> XP total
                </Chip>
            </div>

            {nextRank && (
                <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    {xpToNext} XP to {nextRank}
                </p>
            )}

            <button
                type="button"
                onClick={onClose}
                autoFocus
                className="mt-6 w-full rounded-full px-6 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5"
                style={{ background: `linear-gradient(90deg, #ffffff, rgb(${world.rgb}))` }}
            >
                Keep going
            </button>
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════════════════════ */

const emptyProgress: ProgramProgress = {
    completedSections: [],
    completedLabs: [],
    exploredResources: [],
    reflections: {},
    lastViewedSection: '',
    startedAt: null,
    lastActiveAt: null,
};

const PioneerDashboardPage: React.FC = () => {
    // getCurriculumByProgramId layers Studio overrides and hands back a fresh
    // object each call, so hold it steady — otherwise every keystroke in a
    // reflection box would rebuild the whole world/XP model.
    const curriculum = useMemo(() => getCurriculumByProgramId(PROGRAM_ID), []);
    const { emitProgress, emitCompletion } = useArsenal();

    const [progress, setProgress] = useState<ProgramProgress>(() => getProgramProgress(PROGRAM_ID));
    const [activeSection, setActiveSection] = useState('');
    const [reflectionDrafts, setReflectionDrafts] = useState<Record<string, string>>({});
    const [toasts, setToasts] = useState<XpToast[]>([]);
    const [rankUp, setRankUp] = useState<{ name: string; blurb: string; tier: number } | null>(null);
    const { ticks, toggle } = useStepTicks();
    const previousRank = useRef<number | null>(null);
    const toastId = useRef(0);

    const modules = curriculum?.sections ?? [];

    const state = useMemo(() => buildPioneerState(modules, progress), [modules, progress]);

    const completedSections = useMemo(() => new Set(progress.completedSections ?? []), [progress.completedSections]);
    const completedLabs = useMemo(() => new Set(progress.completedLabs ?? []), [progress.completedLabs]);
    const exploredApps = useMemo(() => new Set(progress.exploredResources ?? []), [progress.exploredResources]);

    const allLeafSections = useMemo(() => state.worlds.flatMap((world) => world.sections), [state.worlds]);

    /* Restore last position. */
    useEffect(() => {
        if (!modules.length) return;
        const stored = getProgramProgress(PROGRAM_ID);
        setProgress(stored);
        setActiveSection(stored.lastViewedSection || modules[0].id);
        setReflectionDrafts(stored.reflections ?? {});
    }, [modules.length]);

    /* Fire the rank-up celebration when the tier actually increases. */
    useEffect(() => {
        if (previousRank.current === null) {
            previousRank.current = state.rank.index;
            return;
        }
        if (state.rank.index > previousRank.current) {
            setRankUp({ name: state.rank.rank.name, blurb: state.rank.rank.blurb, tier: state.rank.index });
        }
        previousRank.current = state.rank.index;
    }, [state.rank.index, state.rank.rank.blurb, state.rank.rank.name]);

    const pushToast = useCallback((amount: number, label: string) => {
        toastId.current += 1;
        const id = toastId.current;
        setToasts((current) => [...current, { id, amount, label }]);
        window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 1600);
    }, []);

    const goToSection = useCallback((sectionId: string) => {
        setActiveSection(sectionId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    /* Record the view + emit a "started" signal, matching the shared dashboard. */
    useEffect(() => {
        if (!activeSection) return;

        setProgress((current) => ({
            ...current,
            lastViewedSection: activeSection,
            startedAt: current.startedAt || new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
        }));
        saveProgramProgress(PROGRAM_ID, activeSection, false);

        const index = allLeafSections.findIndex((section) => section.id === activeSection);
        if (index >= 0 && !completedSections.has(activeSection)) {
            emitProgress(PROGRAM_ID, activeSection, activeSection, index, 'started');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSection]);

    if (!curriculum || !modules.length) {
        return <Navigate to="/programs" replace />;
    }

    /* ── Current position ───────────────────────────────────────────── */

    const findSection = (sectionId: string): ProgramSection | null => {
        for (const module of modules) {
            if (module.id === sectionId) return module;
            const nested = module.subSections?.find((section) => section.id === sectionId);
            if (nested) return nested;
        }
        return null;
    };

    const currentSection = findSection(activeSection) ?? modules[0];
    const isWorldView = Boolean(currentSection.subSections?.length);

    const activeWorldIndex = Math.max(
        0,
        modules.findIndex((module) => (
            module.id === currentSection.id || Boolean(module.subSections?.some((section) => section.id === currentSection.id))
        )),
    );
    const activeWorldState = state.worlds[activeWorldIndex] ?? state.worlds[0];
    const world = activeWorldState.world;

    const leafIndex = allLeafSections.findIndex((section) => section.id === currentSection.id);
    const previousSection = leafIndex > 0 ? allLeafSections[leafIndex - 1] : null;
    const nextSection = leafIndex >= 0 && leafIndex < allLeafSections.length - 1 ? allLeafSections[leafIndex + 1] : null;

    const nextAction = resolveNextAction(state, progress);

    /* ── Content buckets for the current quest ──────────────────────── */

    const resourceItems = appsIn(currentSection);
    const labItems = labsIn(currentSection);
    const pods = getConceptMissionPods(currentSection.id, resourceItems);
    const podTitles = new Set(pods.flatMap((pod) => pod.resources.map((resource) => resource.title)));
    const standaloneApps = pods.length ? resourceItems.filter((resource) => !podTitles.has(resource.title)) : resourceItems;
    const learnItems = currentSection.content.filter((item) => (
        ['heading', 'paragraph', 'quote', 'list', 'callout', 'image', 'video', 'embed', 'html', 'divider'].includes(item.type)
    ));
    const codeItems = currentSection.content.filter((item) => item.type === 'code');
    const isCurrentComplete = completedSections.has(currentSection.id);

    const liveLabs = liveLabsForSection(currentSection.id);
    const questSteps = buildQuestSteps(currentSection, progress, true);
    const questPercent = Math.round(questSteps.reduce((sum, step) => sum + step.percent, 0) / questSteps.length);

    const summaryOf = (section: ProgramSection) => {
        const source = section.content.find((item): item is ProgramCalloutContentItem | ProgramTextContentItem => (
            item.type === 'paragraph' || item.type === 'callout'
        ));

        if (!source) {
            return 'Open the quest to see the apps, the build, and the checkpoint.';
        }

        return repaired(Array.isArray(source.content) ? source.content[0] : source.content);
    };

    /* ── Progress writers ───────────────────────────────────────────── */

    const markAppCleared = (title: string) => {
        if (exploredApps.has(title)) return;
        setProgress(saveProgramResourceExplored(PROGRAM_ID, title));
        pushToast(XP_PER_APP, 'App cleared');
    };

    const markLabShipped = (labId: string) => {
        if (completedLabs.has(labId)) return;
        setProgress(saveProgramLabComplete(PROGRAM_ID, labId, reflectionDrafts[labId]));
        pushToast(XP_PER_LAB, 'Build shipped');
    };

    const sealQuest = () => {
        if (isWorldView || isCurrentComplete) return;

        const nextProgress: ProgramProgress = {
            ...progress,
            completedSections: [...(progress.completedSections ?? []), currentSection.id],
            lastViewedSection: currentSection.id,
            startedAt: progress.startedAt || new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
        };

        setProgress(nextProgress);
        saveProgramProgress(PROGRAM_ID, currentSection.id, true);
        emitProgress(PROGRAM_ID, currentSection.id, currentSection.id, leafIndex, 'completed');
        pushToast(XP_PER_SECTION, 'Quest sealed');

        if (nextProgress.completedSections.length >= allLeafSections.length) {
            emitCompletion();
        }
    };

    /* ── Learn-item renderer ────────────────────────────────────────── */

    const renderLearnItem = (item: ProgramContentItem, index: number): React.ReactNode => {
        if (item.type === 'heading') {
            return (
                <h3 key={index} className="pa-title-lift group mt-2 inline-flex w-fit flex-col text-xl font-black tracking-tight text-white sm:text-2xl">
                    <span>{repaired(item.content as string)}</span>
                    <span
                        className="mt-1.5 h-1 w-16 rounded-full transition-all duration-500 group-hover:w-full"
                        style={{ background: `linear-gradient(90deg, rgb(${world.rgb}), rgb(${world.rgbAlt}))` }}
                    />
                </h3>
            );
        }

        if (item.type === 'paragraph') {
            return (
                <div key={index} className="relative overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/35 p-4">
                    <span className="absolute inset-y-0 left-0 w-1" style={{ background: `linear-gradient(180deg, rgb(${world.rgb}), transparent)` }} />
                    <p className="pl-2 text-[14px] font-semibold leading-8 text-slate-200">
                        {renderHighlightedText(item.content as string)}
                    </p>
                </div>
            );
        }

        if (item.type === 'quote') {
            return (
                <blockquote
                    key={index}
                    className="rounded-[1.2rem] border p-4 text-[14px] font-semibold italic leading-8"
                    style={{
                        borderColor: `rgba(${world.rgb}, .28)`,
                        background: `rgba(${world.rgb}, .08)`,
                        color: '#e2e8f0',
                    }}
                >
                    {renderHighlightedText(item.content as string)}
                </blockquote>
            );
        }

        if (item.type === 'list') {
            return (
                <div key={index} className="grid gap-2 md:grid-cols-2">
                    {repairedList(item.content).map((listItem, listIndex) => (
                        <div
                            key={listItem}
                            className="pa-sheen group relative overflow-hidden rounded-[1.1rem] border border-white/10 bg-black/35 p-3.5 transition hover:-translate-y-0.5 hover:border-white/22"
                        >
                            <div className="flex items-start gap-2.5">
                                <span
                                    className="pa-hex flex h-7 w-7 shrink-0 items-center justify-center text-[10px] font-black text-slate-950"
                                    style={{ background: `linear-gradient(140deg, #ffffff, rgb(${world.rgb}))` }}
                                >
                                    {String(listIndex + 1).padStart(2, '0')}
                                </span>
                                <span className="text-[13px] font-semibold leading-7 text-slate-300">{renderHighlightedText(listItem)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (item.type === 'callout') {
            const tone = item.tone === 'warning'
                ? { border: 'rgba(252, 211, 77, .32)', bg: 'rgba(252, 211, 77, .09)', accent: '#fde68a', label: 'Watch out' }
                : item.tone === 'success'
                    ? { border: 'rgba(110, 231, 183, .32)', bg: 'rgba(110, 231, 183, .09)', accent: '#a7f3d0', label: 'Good to know' }
                    : { border: `rgba(${world.rgb}, .32)`, bg: `rgba(${world.rgb}, .09)`, accent: `rgb(${world.rgb})`, label: 'Briefing' };

            return (
                <div
                    key={index}
                    className="relative overflow-hidden rounded-[1.3rem] border p-4"
                    style={{ borderColor: tone.border, background: tone.bg }}
                >
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span
                            className="pa-hex flex h-8 w-8 items-center justify-center text-[10px] font-black text-slate-950"
                            style={{ background: tone.accent }}
                        >
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: tone.accent }}>
                            {item.title ? repaired(item.title) : tone.label}
                        </p>
                    </div>
                    <div className="mt-3 space-y-2 text-[13px] font-semibold leading-7 text-slate-200">
                        {repairedList(item.content).map((line) => <p key={line}>{renderHighlightedText(line)}</p>)}
                    </div>
                </div>
            );
        }

        if (item.type === 'image' || item.type === 'video' || item.type === 'embed' || item.type === 'html' || item.type === 'divider') {
            return <StudioMediaBlock key={index} item={item} variant="dark" />;
        }

        return null;
    };

    /* ── Section header block used by the quest view ─────────────────── */

    const questAvailableXp =
        resourceItems.length * XP_PER_APP + labItems.length * XP_PER_LAB + XP_PER_SECTION;

    return (
        <div className="pa-root relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#070c1a_0%,#050a16_38%,#03060f_100%)] text-white" style={worldVars(world)}>
            <AmbientField world={world} />

            <TopHUD
                state={state}
                world={world}
                atlasActive={isWorldView}
                onOpenAtlas={() => goToSection(modules[activeWorldIndex]?.id ?? modules[0].id)}
            />

            <div className="relative z-10 mx-auto grid w-full max-w-[1680px] gap-4 px-3 py-4 sm:px-5 lg:grid-cols-[264px_minmax(0,1fr)]">
                {/* Desktop rail */}
                <aside className="hidden lg:sticky lg:top-[4.6rem] lg:block lg:self-start">
                    <WorldRail
                        state={state}
                        activeSectionId={currentSection.id}
                        activeWorldIndex={activeWorldIndex}
                        completedSections={completedSections}
                        onSelect={goToSection}
                    />
                </aside>

                {/* Mobile world switcher */}
                <div className="pa-scroll-x -mx-3 flex gap-2 overflow-x-auto px-3 pb-1 lg:hidden">
                    {state.worlds.map((worldState) => (
                        <button
                            key={worldState.module.id}
                            type="button"
                            onClick={() => goToSection(worldState.module.id)}
                            className={`flex shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 transition ${
                                worldState.index === activeWorldIndex
                                    ? 'border-white/25 bg-white/[0.09]'
                                    : 'border-white/10 bg-black/35'
                            }`}
                            style={worldVars(worldState.world)}
                        >
                            <WorldGlyph
                                kind={worldState.world.glyph}
                                rgb={worldState.world.rgb}
                                rgbAlt={worldState.world.rgbAlt}
                                charge={worldState.percent}
                                dormant={!worldState.unlocked}
                                className="h-8 w-8"
                            />
                            <span className="text-left">
                                <span className="block text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: `rgb(${worldState.world.rgb})` }}>
                                    {worldState.world.codename}
                                </span>
                                <span className="pa-tabular block text-[11px] font-bold text-slate-300">{worldState.percent}%</span>
                            </span>
                        </button>
                    ))}
                </div>

                <main className="min-w-0">
                    {isWorldView ? (
                        <div className="grid gap-4">
                            <WorldBriefing
                                worldState={activeWorldState}
                                completedSections={completedSections}
                                completedLabs={completedLabs}
                                exploredApps={exploredApps}
                                summaryOf={summaryOf}
                                onSelect={goToSection}
                            />
                            <AtlasMap state={state} activeWorldIndex={activeWorldIndex} onSelect={goToSection} />
                            <TrophyCase state={state} world={world} />
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {/* Quest header */}
                            <section className="zt-plate relative overflow-hidden rounded-[2rem] p-5 sm:p-7">
                                <GuillocheWatermark rgb={world.rgb} />
                                <GuillocheBand rgb={world.rgb} className="pointer-events-none absolute inset-x-0 top-0 h-7 opacity-70" />
                                <Microprint rgb={world.rgb} className="pointer-events-none absolute inset-x-0 bottom-0 h-2 opacity-40" />
                                <div
                                    className="pointer-events-none absolute inset-0"
                                    style={{ background: `radial-gradient(80% 120% at 92% -20%, rgba(${world.rgb}, .18), transparent 58%)` }}
                                />
                                <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Chip className={world.chip}>
                                                <span className="zt-ovi font-black">{world.codename}</span>
                                            </Chip>
                                            <Chip className="border-white/12 bg-black/40 text-slate-300">
                                                Quest {activeWorldState.sections.findIndex((s) => s.id === currentSection.id) + 1} of {activeWorldState.sections.length}
                                            </Chip>
                                            <XpChip amount={questAvailableXp} earned={isCurrentComplete} />
                                        </div>

                                        <h1 className="pa-title-lift mt-4 max-w-3xl text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                                            {repaired(currentSection.title).replace(/^Section \d+:\s*/i, '')}
                                        </h1>
                                        <p className="mt-3 max-w-2xl text-[15px] font-semibold leading-7 text-slate-300">
                                            {summaryOf(currentSection)}
                                        </p>

                                        <div className="mt-5 flex flex-wrap gap-1.5">
                                            {pods.length > 0 && <Chip className="border-white/12 bg-black/40 text-slate-300">{count(pods.length, 'mission')}</Chip>}
                                            {resourceItems.length > 0 && <Chip className="border-white/12 bg-black/40 text-slate-300">{count(resourceItems.length, 'app')}</Chip>}
                                            {labItems.length > 0 && <Chip className="border-white/12 bg-black/40 text-slate-300">{count(labItems.length, 'build quest')}</Chip>}
                                            {learnItems.length > 0 && <Chip className="border-white/12 bg-black/40 text-slate-300">{count(learnItems.length, 'briefing card')}</Chip>}
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center justify-center">
                                        <PowerCore
                                            percent={questPercent}
                                            rgb={world.rgb}
                                            rgbAlt={world.rgbAlt}
                                            label={`${questPercent}%`}
                                            sublabel="CHARGED"
                                            className="h-32 w-32 sm:h-40 sm:w-40"
                                        />
                                    </div>
                                </div>

                                <div className="relative mt-6">
                                    <ObjectiveRail steps={questSteps} world={world} />
                                </div>
                            </section>

                            {/* Missions — concept + its apps together */}
                            {pods.length > 0 && (
                                <div className="grid gap-4">
                                    <div className="flex flex-wrap items-end justify-between gap-3 px-1">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Missions</p>
                                            <h2 className="pa-title-lift mt-1 text-2xl font-black tracking-[-0.03em] text-white">
                                                Learn it while the app is running.
                                            </h2>
                                        </div>
                                        <Chip className={world.chip}>{count(pods.length, 'mission')} to clear</Chip>
                                    </div>
                                    {pods.map((pod, podIndex) => (
                                        <MissionPod
                                            key={pod.id}
                                            pod={pod}
                                            index={podIndex}
                                            world={world}
                                            exploredApps={exploredApps}
                                            onExplore={markAppCleared}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Arcade deck — apps that are not inside a mission */}
                            {standaloneApps.length > 0 && (
                                <section className="pa-glass pa-edge overflow-hidden rounded-[1.9rem] p-5 sm:p-6">
                                    <div className="flex flex-wrap items-end justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Arcade deck</p>
                                            <h2 className="pa-title-lift mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
                                                {pods.length ? 'Extra machines to run.' : 'Apps, tools, and demos.'}
                                            </h2>
                                        </div>
                                        <Chip className={world.chip}>
                                            {standaloneApps.filter((app) => exploredApps.has(app.title)).length}/{standaloneApps.length} cleared
                                        </Chip>
                                    </div>
                                    <div className="mt-5 grid gap-3.5">
                                        {standaloneApps.map((app) => (
                                            <AppCabinet
                                                key={app.title}
                                                item={app}
                                                world={world}
                                                explored={exploredApps.has(app.title)}
                                                onExplore={() => markAppCleared(app.title)}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Live labs — real models, hosted free, no ZEN key spent */}
                            {liveLabs.length > 0 && (
                                <section className="zt-plate relative overflow-hidden rounded-[1.9rem] p-5 sm:p-6">
                                    <GuillocheWatermark rgb={world.rgb} opacity={0.1} />
                                    <div className="relative flex flex-wrap items-end justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Live labs</p>
                                            <h2 className="pa-title-lift mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
                                                Drive a real model, not a simulation.
                                            </h2>
                                            <p className="mt-1.5 max-w-2xl text-[13px] font-semibold leading-6 text-slate-400">
                                                These run on Hugging Face and NVIDIA, free and hosted by them. Everything else in
                                                this quest is ours — these are the real thing, so you can feel the difference.
                                            </p>
                                        </div>
                                        <Chip className={world.chip}>
                                            {count(liveLabs.length, 'lab')}
                                        </Chip>
                                    </div>
                                    <div className="relative mt-5 grid gap-3.5">
                                        {liveLabs.map((lab) => (
                                            <ZenLiveEmbed
                                                key={lab.id}
                                                lab={lab}
                                                rgb={world.rgb}
                                                rgbAlt={world.rgbAlt}
                                                cleared={exploredApps.has(`live:${lab.id}`)}
                                                onCleared={() => markAppCleared(`live:${lab.id}`)}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Briefing — every learn item, nothing dropped */}
                            <section className="pa-glass pa-edge overflow-hidden rounded-[1.9rem] p-5 sm:p-6">
                                <div className="flex flex-wrap items-end justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Mission briefing</p>
                                        <h2 className="pa-title-lift mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
                                            The core ideas, compressed.
                                        </h2>
                                    </div>
                                    <Chip className={world.chip}>{count(learnItems.length, 'card')}</Chip>
                                </div>
                                <div className="mt-5 grid gap-3">
                                    <LearningConceptVisualizer sectionId={currentSection.id} />
                                    {learnItems.length
                                        ? learnItems.map(renderLearnItem)
                                        : (
                                            <p className="rounded-[1.1rem] border border-white/10 bg-black/35 p-4 text-[13px] font-semibold leading-7 text-slate-400">
                                                This quest is all hands-on — head straight to the apps and the build.
                                            </p>
                                        )}
                                </div>
                            </section>

                            {/* Build quests */}
                            <div className="grid gap-4">
                                <div className="flex flex-wrap items-end justify-between gap-3 px-1">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Build quests</p>
                                        <h2 className="pa-title-lift mt-1 text-2xl font-black tracking-[-0.03em] text-white">
                                            Make the evidence.
                                        </h2>
                                    </div>
                                    <Chip className="border-emerald-300/35 bg-emerald-400/12 text-emerald-100">
                                        {labItems.filter((lab) => completedLabs.has(lab.id)).length}/{labItems.length} shipped
                                    </Chip>
                                </div>

                                {labItems.length ? labItems.map((lab) => (
                                    <BuildQuest
                                        key={lab.id}
                                        lab={lab}
                                        world={world}
                                        complete={completedLabs.has(lab.id)}
                                        ticks={ticks[lab.id] ?? []}
                                        reflection={reflectionDrafts[lab.id] ?? ''}
                                        onTick={(index) => toggle(lab.id, index)}
                                        onReflection={(value) => setReflectionDrafts((current) => ({ ...current, [lab.id]: value }))}
                                        onComplete={() => markLabShipped(lab.id)}
                                    />
                                )) : (
                                    <p className="pa-glass rounded-[1.4rem] p-4 text-[13px] font-semibold leading-7 text-slate-400">
                                        No build checkpoint in this quest — clear the apps and seal it.
                                    </p>
                                )}
                            </div>

                            {/* Advanced source notes */}
                            {codeItems.length > 0 && (
                                <details className="pa-glass group overflow-hidden rounded-[1.5rem] p-5">
                                    <summary className="cursor-pointer list-none text-[11px] font-black uppercase tracking-[0.22em] text-slate-300 transition hover:text-white">
                                        <span className="inline-flex items-center gap-2">
                                            <svg viewBox="0 0 14 14" className="h-3 w-3 transition group-open:rotate-90" aria-hidden="true">
                                                <path d="M5 3 L9.5 7 L5 11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Advanced source notes
                                        </span>
                                    </summary>
                                    <div className="mt-4 space-y-3">
                                        {codeItems.map((item, index) => (
                                            <pre
                                                key={index}
                                                className="max-h-96 overflow-auto rounded-[1.1rem] border border-white/10 bg-black/60 p-4 font-jetbrains text-[12px] leading-6 text-slate-200"
                                            >
                                                {item.type === 'code' ? repaired(item.content) : ''}
                                            </pre>
                                        ))}
                                    </div>
                                </details>
                            )}

                            <QuestDock
                                world={world}
                                complete={isCurrentComplete}
                                percent={questPercent}
                                previous={previousSection}
                                next={nextSection}
                                onGo={goToSection}
                                onComplete={sealQuest}
                            />
                        </div>
                    )}

                    {/* Persistent "what next" nudge */}
                    {nextAction && nextAction.sectionId !== currentSection.id && (
                        <button
                            type="button"
                            onClick={() => goToSection(nextAction.sectionId)}
                            className="pa-glass pa-sheen mt-4 flex w-full items-center gap-3 rounded-[1.4rem] p-4 text-left transition hover:-translate-y-0.5"
                            style={worldVars(state.worlds[nextAction.worldIndex]?.world ?? world)}
                        >
                            <span
                                className="pa-hex flex h-11 w-11 shrink-0 items-center justify-center text-slate-950"
                                style={{ background: `linear-gradient(140deg, #ffffff, rgb(${(state.worlds[nextAction.worldIndex]?.world ?? world).rgb}))` }}
                            >
                                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                                    <path d="M3 8 H12 M8.5 4 L12.5 8 L8.5 12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <span className="min-w-0">
                                <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Your next move</span>
                                <span className="block truncate text-sm font-black text-white">
                                    {repaired(nextAction.label).replace(/^Section \d+:\s*/i, '')}
                                </span>
                            </span>
                        </button>
                    )}
                </main>
            </div>

            <XpToastStack toasts={toasts} />

            {rankUp && (
                <RankUpOverlay
                    rankName={rankUp.name}
                    blurb={rankUp.blurb}
                    tier={rankUp.tier}
                    xp={state.xp}
                    nextRank={state.rank.next?.name ?? null}
                    xpToNext={state.rank.xpToNext}
                    world={world}
                    onClose={() => setRankUp(null)}
                />
            )}
        </div>
    );
};

export default PioneerDashboardPage;
