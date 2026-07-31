/**
 * Pioneer game layer.
 *
 * Turns the plain curriculum + progress records into the vocabulary the
 * Pioneer UI speaks: worlds, XP, ranks, badges, and the "next best action".
 * Everything is derived — no extra persistence, so a learner's existing
 * progress instantly maps onto the new experience.
 */

import type { ProgramLabContentItem, ProgramProgress, ProgramResourceContentItem, ProgramSection } from '../types';

export const XP_PER_SECTION = 150;
export const XP_PER_LAB = 250;
export const XP_PER_APP = 60;

export interface PioneerWorld {
    /** Curriculum module id this world skins, when the ids line up. */
    moduleId: string;
    codename: string;
    tagline: string;
    /** One-line gloss explaining the security-engraving metaphor. */
    craft: string;
    /** `r, g, b` triple, injected as the --pa-world custom property. */
    rgb: string;
    rgbAlt: string;
    /** Tailwind gradient stops for solid fills. */
    gradient: string;
    /** Softer gradient for large surfaces. */
    wash: string;
    ring: string;
    text: string;
    chip: string;
    glyph: WorldGlyphKind;
}

export type WorldGlyphKind = 'strike' | 'assay' | 'burin' | 'seal';

export const PIONEER_WORLDS: PioneerWorld[] = [
    {
        moduleId: 'module-1',
        codename: 'ZEN MINT',
        tagline: 'Where raw signal is struck into understanding',
        // Gloss shown under the codename so the metaphor teaches instead of
        // decorating: each world is a stage of security engraving.
        craft: 'A mint strikes a blank into something with a face and a value.',
        rgb: '201, 168, 76',
        rgbAlt: '223, 192, 106',
        gradient: 'from-amber-200 via-yellow-300 to-amber-400',
        wash: 'from-amber-400/25 via-yellow-600/10 to-transparent',
        ring: 'ring-amber-200/40',
        text: 'text-amber-100',
        chip: 'border-amber-200/35 bg-amber-300/15 text-amber-50',
        glyph: 'strike',
    },
    {
        moduleId: 'module-2',
        codename: 'ZEN ASSAY',
        tagline: 'Where models are tested for purity and put to work',
        craft: 'An assay office measures what a metal really is before anyone trusts it.',
        rgb: '52, 211, 153',
        rgbAlt: '34, 211, 238',
        gradient: 'from-emerald-300 via-teal-300 to-cyan-400',
        wash: 'from-emerald-500/25 via-teal-600/10 to-transparent',
        ring: 'ring-emerald-300/40',
        text: 'text-emerald-200',
        chip: 'border-emerald-300/35 bg-emerald-400/15 text-emerald-100',
        glyph: 'assay',
    },
    {
        moduleId: 'module-3',
        codename: 'ZEN INTAGLIO',
        tagline: 'Where code and knowledge are cut into working tools',
        craft: 'Intaglio is the engraving that puts ink below the surface — the hardest line to fake.',
        rgb: '167, 139, 250',
        rgbAlt: '129, 140, 248',
        gradient: 'from-violet-300 via-indigo-300 to-blue-400',
        wash: 'from-violet-500/25 via-indigo-600/10 to-transparent',
        ring: 'ring-violet-300/40',
        text: 'text-violet-200',
        chip: 'border-violet-300/35 bg-violet-400/15 text-violet-100',
        glyph: 'burin',
    },
    {
        moduleId: 'module-4',
        codename: 'ZEN SEAL',
        tagline: 'Where finished work is certified and issued',
        craft: 'The seal is applied last, and only to work that passed every earlier stage.',
        rgb: '224, 87, 107',
        rgbAlt: '201, 168, 76',
        gradient: 'from-rose-300 via-red-300 to-amber-300',
        wash: 'from-rose-500/25 via-amber-600/10 to-transparent',
        ring: 'ring-rose-300/40',
        text: 'text-rose-200',
        chip: 'border-rose-300/35 bg-rose-400/15 text-rose-100',
        glyph: 'seal',
    },
];

export const getWorld = (index: number): PioneerWorld => PIONEER_WORLDS[index % PIONEER_WORLDS.length];

/* ── Ranks ─────────────────────────────────────────────────────────── */

export interface PioneerRank {
    name: string;
    /** Share of the program's total XP required to hold this rank. */
    at: number;
    blurb: string;
}

export const PIONEER_RANKS: PioneerRank[] = [
    { name: 'Initiate', at: 0, blurb: 'Signed in and ready for the first signal.' },
    { name: 'Scout', at: 0.1, blurb: 'You have touched real AI systems and lived to tell it.' },
    { name: 'Explorer', at: 0.25, blurb: 'You can steer a model instead of guessing at it.' },
    { name: 'Builder', at: 0.45, blurb: 'You ship things other people can actually open.' },
    { name: 'Architect', at: 0.65, blurb: 'You design the system, not just the prompt.' },
    { name: 'Vanguard', at: 0.85, blurb: 'You lead builds and check them for safety.' },
    { name: 'Legend', at: 1, blurb: 'Full clear. Every world, every lab, every app.' },
];

export interface RankState {
    index: number;
    rank: PioneerRank;
    next: PioneerRank | null;
    /** 0-100 progress toward the next rank. */
    toNextPercent: number;
    xpToNext: number;
}

export const resolveRank = (xp: number, totalXp: number): RankState => {
    const safeTotal = Math.max(1, totalXp);
    const thresholds = PIONEER_RANKS.map((rank) => Math.round((rank.at * safeTotal) / 50) * 50);

    let index = 0;
    for (let i = 0; i < thresholds.length; i += 1) {
        if (xp >= thresholds[i]) {
            index = i;
        }
    }

    const next = PIONEER_RANKS[index + 1] ?? null;
    const floor = thresholds[index];
    const ceiling = next ? thresholds[index + 1] : floor;
    const span = Math.max(1, ceiling - floor);

    return {
        index,
        rank: PIONEER_RANKS[index],
        next,
        toNextPercent: next ? Math.min(100, Math.round(((xp - floor) / span) * 100)) : 100,
        xpToNext: next ? Math.max(0, ceiling - xp) : 0,
    };
};

/* ── Curriculum shape helpers ──────────────────────────────────────── */

export const flattenSections = (sections: ProgramSection[]): ProgramSection[] => (
    sections.reduce<ProgramSection[]>((items, section) => {
        items.push(section);
        if (section.subSections?.length) {
            items.push(...flattenSections(section.subSections));
        }
        return items;
    }, [])
);

export const leavesOf = (module: ProgramSection): ProgramSection[] => (
    module.subSections?.length ? module.subSections.filter((section) => !section.subSections?.length) : [module]
);

export const labsIn = (section: ProgramSection): ProgramLabContentItem[] => (
    section.content.filter((item): item is ProgramLabContentItem => item.type === 'lab')
);

export const appsIn = (section: ProgramSection): ProgramResourceContentItem[] => (
    section.content.filter((item): item is ProgramResourceContentItem => item.type === 'resource')
);

/* ── Aggregate state ───────────────────────────────────────────────── */

export interface WorldState {
    world: PioneerWorld;
    module: ProgramSection;
    index: number;
    sections: ProgramSection[];
    completedSections: number;
    labs: ProgramLabContentItem[];
    completedLabs: number;
    apps: ProgramResourceContentItem[];
    exploredApps: number;
    percent: number;
    /** A world unlocks when the previous world has at least one clear. */
    unlocked: boolean;
    cleared: boolean;
    xp: number;
    maxXp: number;
}

export interface PioneerState {
    worlds: WorldState[];
    xp: number;
    totalXp: number;
    percent: number;
    rank: RankState;
    sectionsDone: number;
    sectionsTotal: number;
    labsDone: number;
    labsTotal: number;
    appsDone: number;
    appsTotal: number;
    badges: BadgeState[];
    streakDays: number;
}

export interface BadgeState {
    id: string;
    name: string;
    hint: string;
    glyph: BadgeGlyphKind;
    earned: boolean;
    /** 0-100 toward earning it, for the locked state. */
    progress: number;
}

export type BadgeGlyphKind = 'signal' | 'quill' | 'joystick' | 'hammer' | 'flask' | 'crown' | 'shield' | 'star';

const dayStamp = (iso: string | null | undefined) => (iso ? new Date(iso).toDateString() : null);

export const buildPioneerState = (
    modules: ProgramSection[],
    progress: ProgramProgress,
): PioneerState => {
    const completedSections = new Set(progress.completedSections ?? []);
    const completedLabs = new Set(progress.completedLabs ?? []);
    const exploredApps = new Set(progress.exploredResources ?? []);

    let previousCleared = true;

    const worlds: WorldState[] = modules.map((module, index) => {
        const world = getWorld(index);
        const sections = leavesOf(module);
        const scoped = [module, ...flattenSections(module.subSections ?? [])];
        const labs = scoped.flatMap(labsIn);
        const apps = scoped.flatMap(appsIn);

        const sectionsDone = sections.filter((section) => completedSections.has(section.id)).length;
        const labsDone = labs.filter((lab) => completedLabs.has(lab.id)).length;
        const appsDone = apps.filter((app) => exploredApps.has(app.title)).length;

        const maxXp = sections.length * XP_PER_SECTION + labs.length * XP_PER_LAB + apps.length * XP_PER_APP;
        const xp = sectionsDone * XP_PER_SECTION + labsDone * XP_PER_LAB + appsDone * XP_PER_APP;
        const cleared = sections.length > 0 && sectionsDone === sections.length;
        const unlocked = index === 0 || previousCleared;

        previousCleared = cleared;

        return {
            world: { ...world, moduleId: module.id },
            module,
            index,
            sections,
            completedSections: sectionsDone,
            labs,
            completedLabs: labsDone,
            apps,
            exploredApps: appsDone,
            percent: sections.length ? Math.round((sectionsDone / sections.length) * 100) : 0,
            unlocked,
            cleared,
            xp,
            maxXp,
        };
    });

    const sectionsTotal = worlds.reduce((sum, w) => sum + w.sections.length, 0);
    const sectionsDone = worlds.reduce((sum, w) => sum + w.completedSections, 0);
    const labsTotal = worlds.reduce((sum, w) => sum + w.labs.length, 0);
    const labsDone = worlds.reduce((sum, w) => sum + w.completedLabs, 0);
    const appsTotal = worlds.reduce((sum, w) => sum + w.apps.length, 0);
    const appsDone = worlds.reduce((sum, w) => sum + w.exploredApps, 0);

    const totalXp = worlds.reduce((sum, w) => sum + w.maxXp, 0);
    const xp = worlds.reduce((sum, w) => sum + w.xp, 0);

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86_400_000).toDateString();
    const lastActive = dayStamp(progress.lastActiveAt);
    const streakDays = lastActive === today || lastActive === yesterday ? 1 : 0;

    return {
        worlds,
        xp,
        totalXp,
        percent: sectionsTotal ? Math.round((sectionsDone / sectionsTotal) * 100) : 0,
        rank: resolveRank(xp, totalXp),
        sectionsDone,
        sectionsTotal,
        labsDone,
        labsTotal,
        appsDone,
        appsTotal,
        streakDays,
        badges: buildBadges({ worlds, sectionsDone, sectionsTotal, labsDone, labsTotal, appsDone, appsTotal }),
    };
};

interface BadgeInput {
    worlds: WorldState[];
    sectionsDone: number;
    sectionsTotal: number;
    labsDone: number;
    labsTotal: number;
    appsDone: number;
    appsTotal: number;
}

const ratio = (value: number, target: number) => (target <= 0 ? 0 : Math.min(100, Math.round((value / target) * 100)));

const buildBadges = (input: BadgeInput): BadgeState[] => {
    const { worlds, sectionsDone, labsDone, labsTotal, appsDone, appsTotal } = input;
    const clearedWorlds = worlds.filter((world) => world.cleared).length;

    return [
        {
            id: 'first-signal',
            name: 'First Signal',
            hint: 'Open and finish any one app.',
            glyph: 'signal',
            earned: appsDone >= 1,
            progress: ratio(appsDone, 1),
        },
        {
            id: 'prompt-smith',
            name: 'Prompt Smith',
            hint: 'Finish 5 apps.',
            glyph: 'quill',
            earned: appsDone >= 5,
            progress: ratio(appsDone, 5),
        },
        {
            id: 'arcade-runner',
            name: 'Arcade Runner',
            hint: 'Finish 15 apps.',
            glyph: 'joystick',
            earned: appsDone >= 15,
            progress: ratio(appsDone, 15),
        },
        {
            id: 'first-build',
            name: 'First Build',
            hint: 'Complete one build quest.',
            glyph: 'hammer',
            earned: labsDone >= 1,
            progress: ratio(labsDone, 1),
        },
        {
            id: 'lab-master',
            name: 'Lab Master',
            hint: 'Complete every build quest.',
            glyph: 'flask',
            earned: labsTotal > 0 && labsDone >= labsTotal,
            progress: ratio(labsDone, labsTotal),
        },
        {
            id: 'world-runner',
            name: 'World Runner',
            hint: 'Clear two worlds end to end.',
            glyph: 'shield',
            earned: clearedWorlds >= 2,
            progress: ratio(clearedWorlds, 2),
        },
        {
            id: 'completionist',
            name: 'Completionist',
            hint: 'Finish every app in the program.',
            glyph: 'star',
            earned: appsTotal > 0 && appsDone >= appsTotal,
            progress: ratio(appsDone, appsTotal),
        },
        {
            id: 'pioneer-legend',
            name: 'Pioneer Legend',
            hint: 'Clear all four worlds.',
            glyph: 'crown',
            earned: clearedWorlds >= worlds.length && worlds.length > 0,
            progress: ratio(clearedWorlds, Math.max(1, worlds.length)),
        },
    ];
};

/* ── Next best action ──────────────────────────────────────────────── */

export interface NextAction {
    sectionId: string;
    label: string;
    worldIndex: number;
}

export const resolveNextAction = (state: PioneerState, progress: ProgramProgress): NextAction | null => {
    const completed = new Set(progress.completedSections ?? []);

    for (const world of state.worlds) {
        const target = world.sections.find((section) => !completed.has(section.id));
        if (target) {
            return { sectionId: target.id, label: target.title, worldIndex: world.index };
        }
    }

    const last = state.worlds[state.worlds.length - 1];
    const fallback = last?.sections[last.sections.length - 1];
    return fallback ? { sectionId: fallback.id, label: fallback.title, worldIndex: last.index } : null;
};

/* ── Quest step model (Learn → Play → Build → Prove) ───────────────── */

export interface QuestStep {
    key: 'learn' | 'play' | 'build' | 'prove';
    label: string;
    detail: string;
    done: boolean;
    /** 0-100 for partially completed steps. */
    percent: number;
}

export const buildQuestSteps = (
    section: ProgramSection,
    progress: ProgramProgress,
    visitedLearn: boolean,
): QuestStep[] => {
    const apps = appsIn(section);
    const labs = labsIn(section);
    const exploredApps = new Set(progress.exploredResources ?? []);
    const completedLabs = new Set(progress.completedLabs ?? []);

    const appsDone = apps.filter((app) => exploredApps.has(app.title)).length;
    const labsDone = labs.filter((lab) => completedLabs.has(lab.id)).length;
    const sectionDone = (progress.completedSections ?? []).includes(section.id);

    return [
        {
            key: 'learn',
            label: 'Learn',
            detail: 'Read the mission briefing',
            done: visitedLearn,
            percent: visitedLearn ? 100 : 0,
        },
        {
            key: 'play',
            label: 'Play',
            detail: apps.length ? `${appsDone}/${apps.length} apps cleared` : 'No apps in this quest',
            done: apps.length === 0 || appsDone >= apps.length,
            percent: apps.length ? ratio(appsDone, apps.length) : 100,
        },
        {
            key: 'build',
            label: 'Build',
            detail: labs.length ? `${labsDone}/${labs.length} builds shipped` : 'No build in this quest',
            done: labs.length === 0 || labsDone >= labs.length,
            percent: labs.length ? ratio(labsDone, labs.length) : 100,
        },
        {
            key: 'prove',
            label: 'Prove',
            detail: sectionDone ? 'Quest sealed' : 'Lock the quest when done',
            done: sectionDone,
            percent: sectionDone ? 100 : 0,
        },
    ];
};
