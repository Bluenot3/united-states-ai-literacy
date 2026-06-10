import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useArsenal } from '../../contexts/ArsenalContext';
import { getAiClient } from '../../lib/aiClient';
import { repairContent, repairText } from '../../utils/text';
import { getCurriculumByProgramId } from '../curriculum';
import { getRegistryProgramIdForProgramKey, toProgramKey } from '../programIntegrationContract';
import { getProgramById } from '../programsRegistry';
import {
    getProgramProgress,
    saveProgramLabComplete,
    saveProgramProgress,
    saveProgramResourceExplored,
    type ProgramContentItem,
    type ProgramLabContentItem,
    type ProgramResourceContentItem,
    type ProgramSection,
} from '../types';

const sectionActions = ['Start', 'Learn', 'Explore', 'Build', 'Reflect', 'Complete'];

const moduleThemes = [
    {
        accent: 'from-sky-300 via-cyan-300 to-emerald-300',
        active: 'from-sky-500 via-cyan-500 to-emerald-400',
        ring: 'ring-cyan-300/30',
        glow: 'bg-cyan-300/[0.16]',
        soft: 'bg-cyan-300/[0.075] border-cyan-200/20 text-cyan-50',
    },
    {
        accent: 'from-violet-300 via-sky-300 to-white',
        active: 'from-violet-500 via-sky-500 to-cyan-300',
        ring: 'ring-sky-300/30',
        glow: 'bg-sky-300/[0.15]',
        soft: 'bg-sky-300/[0.075] border-sky-200/20 text-sky-50',
    },
    {
        accent: 'from-emerald-300 via-teal-300 to-blue-300',
        active: 'from-emerald-500 via-teal-500 to-blue-400',
        ring: 'ring-emerald-300/30',
        glow: 'bg-emerald-300/[0.14]',
        soft: 'bg-emerald-300/[0.075] border-emerald-200/20 text-emerald-50',
    },
    {
        accent: 'from-rose-200 via-cyan-200 to-amber-200',
        active: 'from-rose-500 via-cyan-500 to-amber-300',
        ring: 'ring-rose-200/30',
        glow: 'bg-rose-300/[0.13]',
        soft: 'bg-rose-300/[0.07] border-rose-100/20 text-rose-50',
    },
];

type ModuleTheme = typeof moduleThemes[number];

const headingLift = 'drop-shadow-[0_5px_20px_rgba(0,0,0,.95)] [text-shadow:_0_2px_0_rgba(2,6,23,.9),0_18px_44px_rgba(2,6,23,.96)]';
const textLift = '[text-shadow:_0_2px_10px_rgba(0,0,0,.92)]';
const missionPanel = 'border-cyan-100/24 bg-[linear-gradient(145deg,rgba(2,6,23,.97),rgba(8,21,43,.96)_42%,rgba(8,47,73,.86))] shadow-[0_34px_100px_rgba(0,0,0,.66),inset_0_1px_0_rgba(255,255,255,.1)]';
const missionPanelSoft = 'border-cyan-100/24 bg-[linear-gradient(145deg,rgba(2,6,23,.93),rgba(7,23,43,.9),rgba(10,38,62,.86))] shadow-[0_18px_54px_rgba(0,0,0,.38),inset_0_1px_0_rgba(255,255,255,.09)]';
const electricFrame = 'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-white/10 before:shadow-[inset_0_0_44px_rgba(103,232,249,.08)]';

const flattenSections = (sections: ProgramSection[]): ProgramSection[] => (
    sections.reduce<ProgramSection[]>((items, section) => {
        items.push(section);

        if (section.subSections?.length) {
            items.push(...flattenSections(section.subSections));
        }

        return items;
    }, [])
);

const getLeafSections = (sections: ProgramSection[]) => flattenSections(sections).filter((section) => !section.subSections?.length);

const findSection = (sections: ProgramSection[], sectionId: string): ProgramSection | null => {
    for (const section of sections) {
        if (section.id === sectionId) {
            return section;
        }

        if (section.subSections?.length) {
            const nested = findSection(section.subSections, sectionId);

            if (nested) {
                return nested;
            }
        }
    }

    return null;
};

const findModuleForSection = (modules: ProgramSection[], sectionId: string): ProgramSection | null => (
    modules.find((module) => module.id === sectionId || Boolean(module.subSections?.some((section) => section.id === sectionId))) ?? modules[0] ?? null
);

const firstLeafForModule = (module: ProgramSection): ProgramSection => module.subSections?.find((section) => !section.subSections?.length) ?? module;

const repaired = (value: string) => repairText(repairContent(value) as string);

const repairedList = (value: string | string[]) => (
    Array.isArray(value) ? value.map((item) => repaired(item)) : [repaired(value)]
);

const getSectionSummary = (section: ProgramSection) => {
    const firstParagraph = section.content.find((item) => item.type === 'paragraph');
    const firstCallout = section.content.find((item) => item.type === 'callout');

    if (firstParagraph?.type === 'paragraph' && typeof firstParagraph.content === 'string') {
        return repaired(firstParagraph.content);
    }

    if (firstCallout?.type === 'callout' && typeof firstCallout.content === 'string') {
        return repaired(firstCallout.content);
    }

    return 'Open the section to review the build path, tools, labs, and completion checkpoint.';
};

const MiniOrbit: React.FC<{ percent: number; className?: string }> = ({ percent, className = '' }) => {
    const circumference = 2 * Math.PI * 42;
    const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

    return (
        <svg viewBox="0 0 110 110" className={className} aria-hidden="true">
            <defs>
                <linearGradient id="pioneerOrbit" x1="12" y1="12" x2="98" y2="98">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="42%" stopColor="#67e8f9" />
                    <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <filter id="pioneerGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <circle cx="55" cy="55" r="42" fill="rgba(15,23,42,.72)" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
            <circle cx="55" cy="55" r="30" fill="none" stroke="rgba(103,232,249,.16)" strokeDasharray="5 7" />
            <circle
                cx="55"
                cy="55"
                r="42"
                fill="none"
                stroke="url(#pioneerOrbit)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 55 55)"
                filter="url(#pioneerGlow)"
            />
            <circle cx="55" cy="55" r="9" fill="#e0f2fe" />
            <circle cx="75" cy="25" r="4" fill="#f87171" />
            <circle cx="30" cy="80" r="3.5" fill="#22d3ee" />
        </svg>
    );
};

const ShellMetric: React.FC<{ label: string; value: string; sublabel: string }> = ({ label, value, sublabel }) => (
    <div className="min-w-0 overflow-hidden rounded-[1.05rem] border border-cyan-100/18 bg-slate-950/76 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.09),0_14px_34px_rgba(0,0,0,.28)]">
        <p className={`truncate text-[9px] font-black uppercase tracking-[0.16em] text-cyan-50 ${textLift}`}>{label}</p>
        <p className={`mt-1 break-words text-2xl font-black tracking-tight text-white ${headingLift}`}>{value}</p>
        <p className="mt-0.5 text-[11px] font-bold leading-4 text-slate-200">{sublabel}</p>
    </div>
);

const MiniAppShell: React.FC<{
    title: string;
    children: React.ReactNode;
    onComplete: () => void;
    completeLabel?: string;
}> = ({ title, children, onComplete, completeLabel = 'Mark interaction complete' }) => (
    <div className={`relative mt-5 overflow-hidden rounded-[1.45rem] border ${missionPanelSoft} ${electricFrame}`}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-100/45 to-transparent" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-100/18 bg-black/48 px-4 py-3">
            <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,.9)]" />
                <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>{title}</p>
            </div>
            <button type="button" onClick={onComplete} className="rounded-full border border-cyan-950/20 bg-cyan-100 px-3 py-1.5 text-xs font-black text-slate-950 shadow-[0_10px_26px_rgba(34,211,238,.32)] transition hover:-translate-y-0.5 hover:bg-white">
                {completeLabel}
            </button>
        </div>
        <div className="relative z-10 p-4">{children}</div>
    </div>
);

const SignalRail: React.FC<{ labels?: string[]; activeIndex?: number; compact?: boolean }> = ({
    labels = ['Input', 'Model', 'Output', 'Check'],
    activeIndex = 1,
    compact = false,
}) => (
    <div className={`relative overflow-hidden rounded-[1.35rem] border border-cyan-100/20 bg-black/42 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] ${compact ? '' : 'sm:p-4'}`}>
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.045)] [--grid-size:18px]" />
        <div className="relative z-10 grid grid-cols-4 gap-2">
            {labels.map((label, index) => (
                <div key={label} className="relative">
                    {index < labels.length - 1 && (
                        <span className="absolute left-[52%] top-5 h-px w-[96%] bg-gradient-to-r from-cyan-200/75 via-white/55 to-emerald-200/70 shadow-[0_0_16px_rgba(103,232,249,.55)]" />
                    )}
                    <div className={`relative z-10 flex min-h-20 flex-col items-center justify-center rounded-2xl border px-2 py-3 text-center transition ${index <= activeIndex ? 'border-cyan-100/34 bg-cyan-300/[0.14] text-white' : 'border-white/12 bg-slate-950/68 text-slate-300'}`}>
                        <span className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black ${index <= activeIndex ? 'bg-cyan-100 text-slate-950 shadow-[0_0_18px_rgba(103,232,249,.45)]' : 'bg-white/[0.08] text-slate-100'}`}>
                            {index + 1}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-[0.14em] ${textLift}`}>{label}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const PioneerLaunchConsole: React.FC<{
    progressPercent: number;
    completedSections: number;
    totalSections: number;
    completedLabs: number;
    totalLabs: number;
    currentSectionTitle: string;
    launchExamples: Array<[string, string]>;
    onStart: () => void;
}> = ({ progressPercent, completedSections, totalSections, completedLabs, totalLabs, currentSectionTitle, launchExamples, onStart }) => {
    const stages: Array<[string, string, string]> = [
        ['Input', 'Your idea enters the system.', 'from-cyan-200 to-sky-300'],
        ['Model', 'The AI looks for useful patterns.', 'from-violet-200 to-blue-300'],
        ['Output', 'A result appears for you to inspect.', 'from-rose-200 to-red-300'],
        ['Check', 'You decide what is accurate and safe.', 'from-emerald-200 to-teal-300'],
    ];

    return (
        <div className={`relative overflow-hidden rounded-[1.8rem] border border-cyan-100/24 bg-[linear-gradient(145deg,rgba(2,6,23,.95),rgba(6,26,50,.92)_46%,rgba(8,47,73,.78))] p-4 shadow-[0_32px_92px_rgba(0,0,0,.56),inset_0_1px_0_rgba(255,255,255,.1)] ${electricFrame}`}>
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.052)] [--grid-size:24px]" />
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/85 to-transparent" />
            <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.35rem] border border-white/14 bg-black/36 p-4">
                    <div className="flex items-center gap-4">
                        <MiniOrbit percent={progressPercent} className="h-20 w-20 shrink-0" />
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Your path</p>
                            <p className={`mt-1 text-3xl font-black text-white ${headingLift}`}>{progressPercent}% complete</p>
                            <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{completedSections}/{totalSections} sections and {completedLabs}/{totalLabs} labs completed.</p>
                        </div>
                    </div>
                    <button type="button" onClick={onStart} className="rounded-full border border-cyan-950/20 bg-cyan-100 px-4 py-2 text-xs font-black text-slate-950 shadow-[0_12px_28px_rgba(34,211,238,.26)] transition hover:-translate-y-0.5 hover:bg-white">
                        Open Section 1
                    </button>
                </div>

                <div className="relative mt-4 overflow-hidden rounded-[1.45rem] border border-cyan-100/18 bg-slate-950/72 p-4">
                    <div className="pointer-events-none absolute left-8 right-8 top-[4.7rem] h-px bg-gradient-to-r from-cyan-200/80 via-white/55 to-emerald-200/80" />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>AI signal console</p>
                            <h3 className={`mt-1 text-2xl font-black tracking-[-0.03em] text-white ${headingLift}`}>See the system before you use the tools.</h3>
                        </div>
                        <span className="rounded-full border border-white/16 bg-white/[0.08] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-50">Live learning map</span>
                    </div>
                    <div className="relative mt-5 grid gap-3 sm:grid-cols-4">
                        {stages.map(([label, body, tone], index) => (
                            <div key={label} className="relative min-w-0 rounded-[1.15rem] border border-white/14 bg-black/40 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.07)]">
                                <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tone} text-sm font-black text-slate-950 shadow-[0_0_24px_rgba(103,232,249,.28)]`}>{index + 1}</span>
                                <p className={`mt-3 text-sm font-black text-white ${textLift}`}>{label}</p>
                                <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 rounded-[1.35rem] border border-emerald-100/22 bg-emerald-300/[0.10] p-4">
                    <p className={`text-[10px] font-black uppercase tracking-[0.22em] text-emerald-50 ${textLift}`}>Next visible action</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-emerald-50">{currentSectionTitle}</p>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {launchExamples.map(([label, body], index) => (
                        <button key={label} type="button" onClick={onStart} className="group flex min-w-0 items-start gap-3 rounded-[1.15rem] border border-white/14 bg-black/34 p-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition hover:-translate-y-0.5 hover:border-cyan-100/36 hover:bg-cyan-300/[0.10]">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-[10px] font-black text-slate-950">{index + 1}</span>
                            <span className="min-w-0">
                                <span className={`block text-sm font-black text-white ${textLift}`}>{label}</span>
                                <span className="mt-1 block text-xs font-semibold leading-5 text-slate-200">{body}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const aiSignalScenarios = [
    {
        title: 'Explain A New Idea',
        input: 'You ask: "Explain AI in simple words with one example."',
        model: 'The model looks for language patterns about AI, examples, and beginner explanations.',
        output: 'It writes a short explanation and an example you can understand.',
        check: 'You check: Is it clear, accurate, safe, and not pretending AI is human?',
    },
    {
        title: 'Create A Project Image',
        input: 'You ask for an image of a future classroom with helpful technology.',
        model: 'The image model uses patterns from visual training data and the prompt details.',
        output: 'It generates a new image based on subject, style, lighting, and constraints.',
        check: 'You check: Does it match the mission and avoid misleading or unsafe details?',
    },
    {
        title: 'Compare Two Tools',
        input: 'You ask which AI tool is better for summarizing a science article.',
        model: 'The model uses patterns, tool knowledge, and the requested comparison format.',
        output: 'It creates a comparison with strengths, limits, and a recommendation.',
        check: 'You check: Did it cite enough evidence, and should a source be verified?',
    },
];

const AiSignalLoopMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selected = aiSignalScenarios[selectedIndex];
    const stages = [
        { label: 'Input', body: selected.input, style: 'from-cyan-200 to-sky-300 text-slate-950 shadow-cyan-300/40' },
        { label: 'Model', body: selected.model, style: 'from-violet-200 to-blue-300 text-slate-950 shadow-violet-300/40' },
        { label: 'Output', body: selected.output, style: 'from-rose-200 to-red-300 text-slate-950 shadow-rose-300/40' },
        { label: 'Human Check', body: selected.check, style: 'from-emerald-200 to-teal-300 text-slate-950 shadow-emerald-300/40' },
    ];

    return (
        <MiniAppShell title="AI Signal Loop" onComplete={onComplete} completeLabel="I can explain the loop">
            <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
                <div className="space-y-3">
                    <p className={`text-sm font-semibold leading-7 text-slate-100 ${textLift}`}>
                        AI feels less confusing when you can see the loop: a human gives an input, the model creates an output, and a human checks the result before using it.
                    </p>
                    <div className="grid gap-2">
                        {aiSignalScenarios.map((scenario, index) => (
                            <button
                                key={scenario.title}
                                type="button"
                                onClick={() => {
                                    setSelectedIndex(index);
                                    onComplete();
                                }}
                                className={`rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${selectedIndex === index ? 'border-cyan-100/42 bg-cyan-300/[0.16]' : 'border-white/14 bg-black/32 hover:bg-white/[0.08]'}`}
                            >
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Scenario {index + 1}</span>
                                <p className={`mt-1 text-sm font-black text-white ${textLift}`}>{scenario.title}</p>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="relative overflow-hidden rounded-[1.45rem] border border-cyan-100/18 bg-[radial-gradient(circle_at_16%_18%,rgba(103,232,249,.18),transparent_30%),linear-gradient(145deg,rgba(2,6,23,.9),rgba(15,23,42,.76))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                    <div className="pointer-events-none absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.055)] [--grid-size:22px]" />
                    <div className="relative z-10 grid gap-3 sm:grid-cols-2">
                        {stages.map((stage, index) => (
                            <div key={stage.label} className="relative overflow-hidden rounded-[1.2rem] border border-white/14 bg-black/36 p-4 shadow-[0_16px_38px_rgba(0,0,0,.24)]">
                                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${stage.style} text-sm font-black shadow-[0_0_28px_var(--tw-shadow-color)]`}>
                                    {index + 1}
                                </div>
                                <p className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>{stage.label}</p>
                                <p className="mt-2 text-sm font-semibold leading-6 text-slate-100">{renderHighlightedText(stage.body)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="relative z-10 mt-4 rounded-2xl border border-emerald-100/20 bg-emerald-300/[0.10] p-4 text-sm font-semibold leading-7 text-emerald-50">
                        Checkpoint: AI is a tool inside a human-controlled loop. The human check is what keeps the work useful and responsible.
                    </div>
                </div>
            </div>
        </MiniAppShell>
    );
};

const aiOrNotItems = [
    {
        id: 'calculator',
        example: 'A calculator adds 248 + 731 when you press equals.',
        isAi: false,
        reason: 'That is normal rule-based software. It follows fixed math instructions.',
    },
    {
        id: 'face-unlock',
        example: 'A phone recognizes a face pattern to unlock the screen.',
        isAi: true,
        reason: 'This uses pattern recognition. The system learned what a face match looks like.',
    },
    {
        id: 'spellcheck',
        example: 'A writing app predicts a better word for your sentence.',
        isAi: true,
        reason: 'Prediction and language patterns are common AI behaviors.',
    },
    {
        id: 'timer',
        example: 'A timer counts down from 10 minutes after you press start.',
        isAi: false,
        reason: 'A timer follows a simple rule. It is useful technology, but not AI by itself.',
    },
];

const AiOrNotCheckMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [answers, setAnswers] = useState<Record<string, boolean>>({});
    const answeredCount = Object.keys(answers).length;
    const score = aiOrNotItems.filter((item) => answers[item.id] === item.isAi).length;

    const answerItem = (id: string, value: boolean) => {
        setAnswers((current) => {
            const next = { ...current, [id]: value };
            if (Object.keys(next).length === aiOrNotItems.length) {
                onComplete();
            }
            return next;
        });
    };

    return (
        <MiniAppShell title="AI Or Not AI Checkpoint" onComplete={onComplete} completeLabel="Checkpoint complete">
            <div className="grid gap-4 lg:grid-cols-[0.76fr_1.24fr]">
                <div className={`rounded-[1.35rem] border p-4 ${missionPanelSoft}`}>
                    <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Quick rule</p>
                    <h5 className={`mt-3 text-2xl font-black text-white ${headingLift}`}>Look for pattern learning.</h5>
                    <p className="mt-3 text-sm font-semibold leading-7 text-slate-100">
                        Not every digital tool is AI. AI usually recognizes patterns, predicts, generates, classifies, or adapts from examples.
                    </p>
                    <div className="mt-4 rounded-2xl border border-white/14 bg-black/34 p-4">
                        <p className={`text-3xl font-black text-white ${headingLift}`}>{score}/{aiOrNotItems.length}</p>
                        <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-slate-200">{answeredCount} answered</p>
                    </div>
                </div>
                <div className="grid gap-3">
                    {aiOrNotItems.map((item) => {
                        const answered = answers[item.id];
                        const isCorrect = answered === item.isAi;

                        return (
                            <div key={item.id} className="rounded-[1.2rem] border border-white/14 bg-black/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
                                <p className="text-sm font-semibold leading-6 text-slate-100">{item.example}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <button type="button" onClick={() => answerItem(item.id, true)} className={`rounded-full border px-4 py-2 text-xs font-black transition ${answered === true ? 'border-cyan-100/40 bg-cyan-200/[0.18] text-white' : 'border-white/16 bg-slate-950/62 text-slate-100 hover:bg-white/[0.1]'}`}>
                                        AI
                                    </button>
                                    <button type="button" onClick={() => answerItem(item.id, false)} className={`rounded-full border px-4 py-2 text-xs font-black transition ${answered === false ? 'border-cyan-100/40 bg-cyan-200/[0.18] text-white' : 'border-white/16 bg-slate-950/62 text-slate-100 hover:bg-white/[0.1]'}`}>
                                        Not AI
                                    </button>
                                </div>
                                {answered !== undefined && (
                                    <p className={`mt-3 text-xs font-semibold leading-5 ${isCorrect ? 'text-emerald-100' : 'text-amber-100'}`}>
                                        {isCorrect ? 'Correct.' : 'Try the rule again.'} {item.reason}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </MiniAppShell>
    );
};

const coachTopics = [
    {
        label: 'What is AI?',
        question: 'Explain what AI is in plain language with one school or community example.',
        fallback: 'AI is software that can use patterns and instructions to help make useful outputs, such as an explanation, image, summary, plan, or prediction. You still decide the goal and check whether the result is accurate, safe, and useful.',
    },
    {
        label: 'How does it work?',
        question: 'Explain input, model, output, and human check for a beginner.',
        fallback: 'The loop is input, model, output, and human check. You give an instruction, the model uses learned patterns to respond, the output appears, and you review it before trusting or sharing it.',
    },
    {
        label: 'What can go wrong?',
        question: 'Explain one AI mistake risk and one responsible check.',
        fallback: 'AI can sound confident even when it is wrong, missing context, or copying a bad pattern. A responsible check is to compare the answer with a reliable source and ask whether it is safe and fair to use.',
    },
];

const PioneerAICoachMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [topicIndex, setTopicIndex] = useState(0);
    const [question, setQuestion] = useState(coachTopics[0].question);
    const [answer, setAnswer] = useState(coachTopics[0].fallback);
    const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'offline'>('idle');
    const selectedTopic = coachTopics[topicIndex];

    const chooseTopic = (index: number) => {
        const nextTopic = coachTopics[index];
        setTopicIndex(index);
        setQuestion(nextTopic.question);
        setAnswer(nextTopic.fallback);
        setState('idle');
        onComplete();
    };

    const askCoach = async () => {
        setState('loading');

        try {
            const client = await getAiClient();
            const result = await client.models.generateContent({
                model: 'ai-pioneer-coach',
                contents: `You are the ZEN AI Pioneer coach for ages 11 to 18. Answer this in clear, direct language with one short analogy, one concrete example, and one safety check. Keep it under 130 words. Question: ${question}`,
                config: {
                    temperature: 0.5,
                    maxOutputTokens: 210,
                },
            });
            const text = typeof result?.response?.text === 'function' ? result.response.text() : result?.text;
            setAnswer(text || selectedTopic.fallback);
            setState('ready');
            onComplete();
        } catch {
            setAnswer(selectedTopic.fallback);
            setState('offline');
            onComplete();
        }
    };

    return (
        <MiniAppShell title="AI Coach Console" onComplete={onComplete} completeLabel="Coach answer saved">
            <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
                <div className="space-y-3">
                    <div className={`rounded-[1.35rem] border p-4 ${missionPanelSoft}`}>
                        <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Ask the coach</p>
                        <h5 className={`mt-3 text-2xl font-black tracking-tight text-white ${headingLift}`}>Turn a confusing AI idea into a clear explanation.</h5>
                        <p className="mt-3 text-sm font-semibold leading-7 text-slate-100">
                            Use this like a learning checkpoint: ask, read, then explain the answer back in your own words.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        {coachTopics.map((topic, index) => (
                            <button
                                key={topic.label}
                                type="button"
                                onClick={() => chooseTopic(index)}
                                className={`rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${topicIndex === index ? 'border-cyan-100/42 bg-cyan-300/[0.16]' : 'border-white/14 bg-black/34 hover:bg-white/[0.08]'}`}
                            >
                                <p className={`text-sm font-black text-white ${textLift}`}>{topic.label}</p>
                                <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{topic.question}</p>
                            </button>
                        ))}
                    </div>
                    <label className="block rounded-2xl border border-white/14 bg-slate-950/72 p-3">
                        <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Your question</span>
                        <textarea
                            value={question}
                            onChange={(event) => setQuestion(event.target.value)}
                            className="mt-2 min-h-24 w-full rounded-xl border border-white/12 bg-black/44 p-3 text-sm font-semibold leading-6 text-white outline-none placeholder:text-slate-400 focus:border-cyan-200/50"
                        />
                    </label>
                </div>
                <div className={`relative overflow-hidden rounded-[1.55rem] border p-5 ${missionPanelSoft}`}>
                    <div className="pointer-events-none absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.05)] [--grid-size:24px]" />
                    <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-emerald-100/70 to-transparent" />
                    <div className="relative z-10">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Live learning loop</p>
                                <h5 className={`mt-2 text-3xl font-black tracking-tight text-white ${headingLift}`}>Coach response</h5>
                            </div>
                            <button
                                type="button"
                                onClick={askCoach}
                                disabled={state === 'loading'}
                                className="rounded-full border border-white/20 bg-cyan-100 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,.3)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-wait disabled:opacity-70"
                            >
                                {state === 'loading' ? 'Asking...' : 'Ask AI Coach'}
                            </button>
                        </div>
                        <div className="mt-4">
                            <SignalRail activeIndex={state === 'ready' ? 3 : state === 'loading' ? 1 : 0} />
                        </div>
                        <div className="mt-4 rounded-[1.25rem] border border-white/16 bg-black/48 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className={`text-[10px] font-black uppercase tracking-[0.22em] text-emerald-50 ${textLift}`}>Answer</p>
                                {state === 'ready' && <span className="rounded-full border border-emerald-100/30 bg-emerald-300/[0.14] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-50">AI proxy</span>}
                                {state === 'offline' && <span className="rounded-full border border-amber-100/30 bg-amber-300/[0.14] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-50">Offline guide</span>}
                            </div>
                            <p className="mt-3 text-base font-semibold leading-8 text-slate-100">{renderHighlightedText(answer)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </MiniAppShell>
    );
};

const aiVocabularyCards = [
    {
        term: 'Artificial Intelligence',
        short: 'Software that can recognize patterns, follow instructions, generate content, or help people make decisions.',
        example: 'A study helper explains a hard idea in simpler language.',
        check: 'AI still needs a human to set the goal and check the result.',
        tone: 'cyan' as HighlightTone,
    },
    {
        term: 'Machine Learning',
        short: 'A way for software to improve a prediction or classification by learning from examples.',
        example: 'A plant tool learns from many labeled leaf photos before it predicts plant health.',
        check: 'Bad examples can teach the model bad habits.',
        tone: 'emerald' as HighlightTone,
    },
    {
        term: 'Neural Network',
        short: 'A model made of connected layers that pass signals forward until the system produces an output.',
        example: 'A vision model uses layers to move from pixels to edges, shapes, and labels.',
        check: 'The network is math, not a human brain.',
        tone: 'violet' as HighlightTone,
    },
    {
        term: 'Computer Vision',
        short: 'AI that looks for visual patterns in images or video.',
        example: 'A scanner detects a face, road sign, damaged crop, or recycling symbol.',
        check: 'Lighting, blur, angle, and missing data can confuse it.',
        tone: 'amber' as HighlightTone,
    },
    {
        term: 'Generative AI',
        short: 'AI that creates new text, images, audio, video, code, or plans from a prompt.',
        example: 'An image generator creates a poster concept from your description.',
        check: 'Generated does not always mean accurate, fair, or safe.',
        tone: 'rose' as HighlightTone,
    },
];

const AiVocabularyQuestMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mastered, setMastered] = useState<Record<string, boolean>>({});
    const selected = aiVocabularyCards[selectedIndex];
    const masteredCount = Object.values(mastered).filter(Boolean).length;

    const markMastered = () => {
        setMastered((current) => {
            const next = { ...current, [selected.term]: true };
            if (Object.values(next).filter(Boolean).length >= 4) {
                onComplete();
            }
            return next;
        });
    };

    return (
        <MiniAppShell title="AI Vocabulary Quest" onComplete={onComplete} completeLabel="Vocabulary checkpoint complete">
            <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
                <div className="grid gap-2">
                    {aiVocabularyCards.map((card, index) => (
                        <button
                            key={card.term}
                            type="button"
                            onClick={() => {
                                setSelectedIndex(index);
                                onComplete();
                            }}
                            className={`rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${selectedIndex === index ? 'border-cyan-100/42 bg-cyan-300/[0.15]' : 'border-white/14 bg-black/30 hover:bg-white/[0.08]'}`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className={`text-sm font-black text-white ${textLift}`}>{card.term}</span>
                                {mastered[card.term] && <span className="rounded-full bg-emerald-200 px-2 py-1 text-[10px] font-black text-emerald-950">Known</span>}
                            </div>
                            <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{card.short}</p>
                        </button>
                    ))}
                </div>
                <div className={`relative overflow-hidden rounded-[1.45rem] border p-5 ${missionPanelSoft}`}>
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${toneDotClass[selected.tone]}`} />
                    <div className="relative z-10">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Concept card</p>
                            <span className="rounded-full border border-white/18 bg-black/34 px-3 py-1 text-xs font-black text-white">{masteredCount}/{aiVocabularyCards.length} learned</span>
                        </div>
                        <h5 className={`mt-4 text-3xl font-black tracking-tight text-white ${headingLift}`}>{selected.term}</h5>
                        <p className="mt-4 text-base font-semibold leading-8 text-slate-100">{renderHighlightedText(selected.short)}</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/14 bg-black/34 p-4">
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Example</p>
                                <p className="mt-2 text-sm font-semibold leading-6 text-slate-100">{renderHighlightedText(selected.example)}</p>
                            </div>
                            <div className="rounded-2xl border border-amber-100/24 bg-amber-300/[0.11] p-4">
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-amber-50 ${textLift}`}>Human check</p>
                                <p className="mt-2 text-sm font-semibold leading-6 text-amber-50">{renderHighlightedText(selected.check)}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={markMastered}
                            className="mt-4 rounded-full border border-white/20 bg-cyan-100 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,.24)] transition hover:-translate-y-0.5 hover:bg-white"
                        >
                            I can explain this word
                        </button>
                    </div>
                </div>
            </div>
        </MiniAppShell>
    );
};

const neuralLabScenarios = [
    {
        title: 'Plant Health Scanner',
        input: 'Leaf color, spots, shape, and lighting',
        output: 'Healthy, needs water, or possible disease',
        risk: 'A dark photo can lower confidence.',
    },
    {
        title: 'Message Safety Filter',
        input: 'Words, tone, links, and repeated patterns',
        output: 'Safe, suspicious, or needs review',
        risk: 'Sarcasm and slang can confuse the model.',
    },
    {
        title: 'Learning Coach',
        input: 'Question, grade level, topic, and goal',
        output: 'Simple explanation or next practice step',
        risk: 'You still need to check sources.',
    },
];

const NeuralNetworkLabMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [examples, setExamples] = useState(62);
    const [signal, setSignal] = useState(58);
    const [noise, setNoise] = useState(22);
    const scenario = neuralLabScenarios[scenarioIndex];
    const confidence = Math.max(18, Math.min(96, Math.round(28 + examples * 0.34 + signal * 0.38 - noise * 0.3)));
    const layers = [
        ['Input', 'Pixels', 'Words', 'Settings'],
        ['Hidden Layer 1', 'Edges', 'Signals', 'Weights'],
        ['Hidden Layer 2', 'Patterns', 'Confidence', 'Limits'],
        ['Output', confidence > 68 ? 'Prediction' : 'Needs check', `${confidence}%`, 'Human review'],
    ];

    return (
        <MiniAppShell title="Neural Network Lab" onComplete={onComplete} completeLabel="Network explained">
            <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
                <div className="space-y-3">
                    <div className={`rounded-[1.35rem] border p-4 ${missionPanelSoft}`}>
                        <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Simple idea</p>
                        <h5 className={`mt-3 text-2xl font-black text-white ${headingLift}`}>Signals move through layers.</h5>
                        <p className="mt-3 text-sm font-semibold leading-7 text-slate-100">
                            A neural network takes inputs, passes signals through hidden layers, and produces an output with a confidence score. More useful examples usually improve the model, but noise can still cause mistakes.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        {neuralLabScenarios.map((item, index) => (
                            <button
                                key={item.title}
                                type="button"
                                onClick={() => {
                                    setScenarioIndex(index);
                                    onComplete();
                                }}
                                className={`rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${scenarioIndex === index ? 'border-violet-100/42 bg-violet-300/[0.15]' : 'border-white/14 bg-black/30 hover:bg-white/[0.08]'}`}
                            >
                                <p className={`text-sm font-black text-white ${textLift}`}>{item.title}</p>
                                <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{item.output}</p>
                            </button>
                        ))}
                    </div>
                </div>
                <div className={`relative overflow-hidden rounded-[1.45rem] border p-5 ${missionPanelSoft}`}>
                    <div className="pointer-events-none absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.05)] [--grid-size:28px]" />
                    <div className="relative z-10">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Active scenario</p>
                                <h5 className={`mt-2 text-2xl font-black text-white ${headingLift}`}>{scenario.title}</h5>
                            </div>
                            <span className={`rounded-full border px-4 py-2 text-sm font-black ${confidence >= 70 ? 'border-emerald-100/30 bg-emerald-300/[0.15] text-emerald-50' : 'border-amber-100/30 bg-amber-300/[0.15] text-amber-50'}`}>
                                {confidence}% confidence
                            </span>
                        </div>
                        <div className="mt-5 grid gap-3 md:grid-cols-4">
                            {layers.map((layer, layerIndex) => (
                                <div key={layer[0]} className="relative rounded-2xl border border-white/14 bg-black/34 p-3">
                                    {layerIndex < layers.length - 1 && <span className="pointer-events-none absolute -right-3 top-1/2 hidden h-px w-6 bg-cyan-100/70 md:block" />}
                                    <p className={`text-[10px] font-black uppercase tracking-[0.18em] text-cyan-50 ${textLift}`}>{layer[0]}</p>
                                    <div className="mt-3 grid gap-2">
                                        {layer.slice(1).map((node, nodeIndex) => (
                                            <span key={node} className={`rounded-xl border px-3 py-2 text-center text-xs font-black ${nodeIndex === 1 ? 'border-violet-100/24 bg-violet-300/[0.12] text-violet-50' : 'border-cyan-100/18 bg-cyan-300/[0.10] text-cyan-50'}`}>
                                                {node}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            {[
                                ['Training examples', examples, setExamples, 10, 160],
                                ['Signal strength', signal, setSignal, 0, 100],
                                ['Noise / confusion', noise, setNoise, 0, 100],
                            ].map(([label, value, setter, min, max]) => (
                                <label key={String(label)} className="rounded-2xl border border-white/14 bg-black/34 p-3">
                                    <span className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.16em] text-slate-100">
                                        {String(label)}
                                        <span className="text-cyan-100">{String(value)}</span>
                                    </span>
                                    <input
                                        type="range"
                                        min={Number(min)}
                                        max={Number(max)}
                                        value={Number(value)}
                                        onChange={(event) => {
                                            (setter as React.Dispatch<React.SetStateAction<number>>)(Number(event.target.value));
                                            onComplete();
                                        }}
                                        className="mt-3 w-full accent-cyan-200"
                                    />
                                </label>
                            ))}
                        </div>
                        <p className="mt-4 rounded-2xl border border-amber-100/24 bg-amber-300/[0.11] p-4 text-sm font-semibold leading-7 text-amber-50">
                            Human check: {scenario.risk} Confidence is helpful, but it is not proof.
                        </p>
                    </div>
                </div>
            </div>
        </MiniAppShell>
    );
};

const visionScenes = [
    {
        title: 'Recycling Sorter',
        subject: 'bottle on a table',
        clues: ['shape', 'label', 'edge', 'color'],
        label: 'Possible plastic bottle',
        confidence: 82,
        risk: 'The model can miss the material if the label is hidden.',
    },
    {
        title: 'Road Sign Reader',
        subject: 'sign beside a road',
        clues: ['edge', 'symbol', 'color', 'position'],
        label: 'Possible warning sign',
        confidence: 76,
        risk: 'Rain, motion blur, or a bad angle can change the prediction.',
    },
    {
        title: 'Wildlife Camera',
        subject: 'animal in low light',
        clues: ['outline', 'texture', 'motion', 'background'],
        label: 'Possible animal detection',
        confidence: 64,
        risk: 'Low light means a human should review the result.',
    },
];

const ComputerVisionLabMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [sceneIndex, setSceneIndex] = useState(0);
    const [selectedClues, setSelectedClues] = useState<Record<string, boolean>>({});
    const scene = visionScenes[sceneIndex];
    const clueCount = Object.values(selectedClues).filter(Boolean).length;
    const adjustedConfidence = Math.min(96, scene.confidence + clueCount * 4);

    const toggleClue = (clue: string) => {
        setSelectedClues((current) => {
            const next = { ...current, [clue]: !current[clue] };
            if (Object.values(next).filter(Boolean).length >= 3) {
                onComplete();
            }
            return next;
        });
    };

    return (
        <MiniAppShell title="Computer Vision Scanner" onComplete={onComplete} completeLabel="Vision scan complete">
            <div className="grid gap-5 xl:grid-cols-[0.74fr_1.26fr]">
                <div className="space-y-3">
                    <p className={`rounded-[1.35rem] border p-4 text-sm font-semibold leading-7 text-slate-100 ${missionPanelSoft}`}>
                        Computer vision turns an image into signals: pixels, edges, colors, shapes, positions, and labels. The model predicts what it sees, then you check if the prediction makes sense.
                    </p>
                    <div className="grid gap-2">
                        {visionScenes.map((item, index) => (
                            <button
                                key={item.title}
                                type="button"
                                onClick={() => {
                                    setSceneIndex(index);
                                    setSelectedClues({});
                                    onComplete();
                                }}
                                className={`rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${sceneIndex === index ? 'border-amber-100/42 bg-amber-300/[0.15]' : 'border-white/14 bg-black/30 hover:bg-white/[0.08]'}`}
                            >
                                <p className={`text-sm font-black text-white ${textLift}`}>{item.title}</p>
                                <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{item.subject}</p>
                            </button>
                        ))}
                    </div>
                </div>
                <div className={`relative overflow-hidden rounded-[1.45rem] border p-5 ${missionPanelSoft}`}>
                    <div className="grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
                        <div className="relative min-h-72 overflow-hidden rounded-[1.25rem] border border-cyan-100/18 bg-[radial-gradient(circle_at_32%_28%,rgba(103,232,249,.24),transparent_22%),radial-gradient(circle_at_72%_62%,rgba(244,114,182,.20),transparent_25%),linear-gradient(145deg,rgba(15,23,42,.92),rgba(8,47,73,.76))]">
                            <div className="absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.06)] [--grid-size:22px]" />
                            <div className="absolute left-[24%] top-[24%] h-32 w-44 rounded-[2rem] border-2 border-cyan-100/70 bg-cyan-300/[0.08] shadow-[0_0_34px_rgba(103,232,249,.22)]" />
                            <div className="absolute left-[35%] top-[38%] h-16 w-24 rounded-full border-2 border-rose-100/70 bg-rose-300/[0.09] shadow-[0_0_28px_rgba(251,113,133,.20)]" />
                            <div className="absolute bottom-4 left-4 rounded-2xl border border-white/18 bg-black/56 px-4 py-3">
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Predicted label</p>
                                <p className={`mt-1 text-xl font-black text-white ${headingLift}`}>{scene.label}</p>
                            </div>
                            <div className="absolute right-4 top-4 rounded-full border border-white/18 bg-black/56 px-4 py-2 text-sm font-black text-white">
                                {adjustedConfidence}% confidence
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Select visual clues</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {scene.clues.map((clue) => (
                                        <button
                                            key={clue}
                                            type="button"
                                            onClick={() => toggleClue(clue)}
                                            className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${selectedClues[clue] ? 'border-cyan-100/40 bg-cyan-200 text-slate-950' : 'border-white/16 bg-black/34 text-slate-100 hover:bg-white/[0.1]'}`}
                                        >
                                            {clue}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/14 bg-black/34 p-4">
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Vision pipeline</p>
                                <p className="mt-2 text-sm font-semibold leading-7 text-slate-100">
                                    Pixels become edges. Edges become shapes. Shapes and context become a label. The label becomes useful only after a human check.
                                </p>
                            </div>
                            <p className="rounded-2xl border border-amber-100/24 bg-amber-300/[0.11] p-4 text-sm font-semibold leading-7 text-amber-50">{scene.risk}</p>
                        </div>
                    </div>
                </div>
            </div>
        </MiniAppShell>
    );
};

const ModelBehaviorMixerMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [scenario, setScenario] = useState('homework coach');
    const [dataQuality, setDataQuality] = useState(7);
    const [context, setContext] = useState(6);
    const [noise, setNoise] = useState(3);
    const [review, setReview] = useState(7);
    const accuracy = Math.max(12, Math.min(98, 20 + dataQuality * 5 + context * 4 + review * 2 - noise * 4));
    const confusion = Math.max(3, Math.min(88, 64 - dataQuality * 3 - context * 2 + noise * 5 - review));
    const trust = Math.max(8, Math.min(96, Math.round((accuracy + review * 7 - confusion) / 2)));
    const scenarios = [
        ['homework coach', 'Explains a math idea in simple steps.'],
        ['image labeler', 'Names what a camera sees.'],
        ['research helper', 'Summarizes a science article.'],
        ['creative partner', 'Turns a rough idea into a project draft.'],
    ];
    const controls: Array<[string, number, (value: number) => void, string, HighlightTone]> = [
        ['Data quality', dataQuality, setDataQuality, 'Better examples make patterns easier to learn.', 'emerald'],
        ['Context', context, setContext, 'More useful background gives the model a clearer job.', 'cyan'],
        ['Noise', noise, setNoise, 'Bad, missing, or confusing signals make mistakes more likely.', 'rose'],
        ['Human review', review, setReview, 'A person checks whether the output is accurate and safe.', 'amber'],
    ];
    const selectedScenario = scenarios.find(([value]) => value === scenario) ?? scenarios[0];
    const modelOutput = accuracy > 74
        ? `The ${scenario} gives a focused answer, explains the reason, and leaves a clear checkpoint for a human to verify.`
        : accuracy > 52
            ? `The ${scenario} gives a usable first draft, but some parts are vague and need a human check before anyone trusts it.`
            : `The ${scenario} guesses too much because the signal is weak. Improve the input before using the output.`;

    return (
        <MiniAppShell title="Model Behavior Mixer" onComplete={onComplete} completeLabel="Behavior explained">
            <div className="grid gap-5 2xl:grid-cols-[0.82fr_1.18fr]">
                <div className="grid gap-4">
                    <div className={`relative overflow-hidden rounded-[1.45rem] border p-5 ${missionPanelSoft}`}>
                        <div className="pointer-events-none absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.045)] [--grid-size:20px]" />
                        <div className="relative z-10">
                            <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>What changes AI behavior?</p>
                            <h5 className={`mt-2 text-3xl font-black tracking-tight text-white ${headingLift}`}>AI is powerful, but it is sensitive to the signal you give it.</h5>
                            <p className="mt-3 text-sm font-semibold leading-7 text-slate-100">
                                This mixer shows why the same tool can feel brilliant in one moment and wrong in the next. Data, context, noise, and human review all change the result.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[1.2rem] border border-cyan-100/18 bg-slate-950/72 p-4">
                        <p className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Choose a model job</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {scenarios.map(([value, body]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => {
                                        setScenario(value);
                                        onComplete();
                                    }}
                                    className={`rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${scenario === value ? 'border-cyan-100/44 bg-cyan-300/[0.15]' : 'border-white/14 bg-black/34 hover:bg-white/[0.08]'}`}
                                >
                                    <p className={`text-sm font-black capitalize text-white ${textLift}`}>{value}</p>
                                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{body}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {controls.map(([label, value, setter, hint]) => (
                            <label key={label} className="rounded-[1.2rem] border border-white/14 bg-black/34 p-4">
                                <span className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.18em] text-slate-100">
                                    {label}
                                    <span className="text-cyan-100">{value}/10</span>
                                </span>
                                <input
                                    type="range"
                                    min={1}
                                    max={10}
                                    value={value}
                                    onChange={(event) => {
                                        setter(Number(event.target.value));
                                        onComplete();
                                    }}
                                    className="mt-3 w-full accent-cyan-200"
                                />
                                <p className="mt-2 text-xs font-semibold leading-5 text-slate-300">{hint}</p>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4">
                    <div className="grid gap-3 md:grid-cols-3">
                        {[
                            ['Accuracy', accuracy, 'emerald' as HighlightTone],
                            ['Confusion', confusion, 'rose' as HighlightTone],
                            ['Trust readiness', trust, 'cyan' as HighlightTone],
                        ].map(([label, value, tone]) => (
                            <div key={String(label)} className={`relative overflow-hidden rounded-[1.35rem] border p-4 ${missionPanelSoft}`}>
                                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${toneDotClass[tone as HighlightTone]}`} />
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>{String(label)}</p>
                                <p className={`mt-3 text-4xl font-black tracking-[-0.05em] text-white ${headingLift}`}>{String(value)}%</p>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                                    <div className={`h-full rounded-full bg-gradient-to-r ${toneDotClass[tone as HighlightTone]}`} style={{ width: `${Number(value)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`relative overflow-hidden rounded-[1.45rem] border p-5 ${missionPanelSoft}`}>
                        <div className="pointer-events-none absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.05)] [--grid-size:24px]" />
                        <div className="relative z-10 grid gap-4 lg:grid-cols-[1fr_.9fr]">
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Live model behavior</p>
                                <h5 className={`mt-2 text-2xl font-black capitalize text-white ${headingLift}`}>{selectedScenario[0]}</h5>
                                <p className="mt-3 rounded-2xl border border-white/14 bg-black/38 p-4 text-sm font-semibold leading-7 text-slate-100">
                                    {renderHighlightedText(modelOutput)}
                                </p>
                            </div>
                            <div className="rounded-[1.2rem] border border-cyan-100/18 bg-black/34 p-4">
                                <p className={`text-[10px] font-black uppercase tracking-[0.22em] text-cyan-50 ${textLift}`}>Signal map</p>
                                <div className="mt-4 grid gap-3">
                                    {controls.map(([label, value, , , tone]) => (
                                        <div key={label}>
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.14em] text-slate-300">
                                                <span>{label}</span>
                                                <span>{value * 10}%</span>
                                            </div>
                                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                                                <div className={`h-full rounded-full bg-gradient-to-r ${toneDotClass[tone]}`} style={{ width: `${value * 10}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        {[
                            ['Change the signal', 'Move the sliders and watch the scores shift.'],
                            ['Read the output', 'Notice whether the model sounds clear or uncertain.'],
                            ['Add judgment', 'Explain what a human should check before using it.'],
                        ].map(([label, body], index) => (
                            <div key={label} className="rounded-[1.2rem] border border-emerald-100/20 bg-emerald-300/[0.09] p-4">
                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-950">{index + 1}</span>
                                <p className={`mt-3 text-sm font-black text-white ${textLift}`}>{label}</p>
                                <p className="mt-1 text-xs font-semibold leading-5 text-emerald-50">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MiniAppShell>
    );
};

const PromptFormulaBuilderMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [task, setTask] = useState('Explain');
    const [context, setContext] = useState('AI literacy for my project team');
    const [details, setDetails] = useState('use one example, three key words, and one safety reminder');
    const [limits, setLimits] = useState('keep it beginner friendly and avoid hype');
    const [output, setOutput] = useState('a short study card');
    const generatedPrompt = `${task} ${context}. Include ${details}. Constraint: ${limits}. Output format: ${output}.`;
    const qualityScore = Math.min(99, 48 + [task, context, details, limits, output].filter((value) => value.trim().length > 8).length * 10);
    const ingredientFields: Array<{ label: string; value: string; onChange: (value: string) => void; hint: string }> = [
        { label: 'Task', value: task, onChange: setTask, hint: 'What should the AI do?' },
        { label: 'Context', value: context, onChange: setContext, hint: 'Who is it for and why?' },
        { label: 'Details', value: details, onChange: setDetails, hint: 'What must be included?' },
        { label: 'Limits', value: limits, onChange: setLimits, hint: 'What should it avoid or respect?' },
        { label: 'Output', value: output, onChange: setOutput, hint: 'What shape should the answer take?' },
    ];

    return (
        <MiniAppShell title="Prompt Formula Builder" onComplete={onComplete} completeLabel="Prompt formula saved">
            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="grid gap-3">
                    {ingredientFields.map((field) => (
                        <label key={field.label} className="rounded-[1.1rem] border border-cyan-100/16 bg-slate-950/68 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.07)]">
                            <span className="flex flex-wrap items-center justify-between gap-2">
                                <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>{field.label}</span>
                                <span className="text-[11px] font-semibold text-slate-300">{field.hint}</span>
                            </span>
                            <input
                                value={field.value}
                                onChange={(event) => field.onChange(event.target.value)}
                                className="mt-2 w-full rounded-xl border border-white/12 bg-black/40 p-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-200/50"
                            />
                        </label>
                    ))}
                </div>
                <div className="relative overflow-hidden rounded-[1.45rem] border border-cyan-100/20 bg-[linear-gradient(145deg,rgba(2,6,23,.94),rgba(8,47,73,.74))] p-5 shadow-[0_22px_60px_rgba(0,0,0,.36),inset_0_1px_0_rgba(255,255,255,.08)]">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent" />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Generated prompt</p>
                        <span className="rounded-full border border-emerald-100/28 bg-emerald-300/[0.14] px-3 py-1 text-xs font-black text-emerald-50">
                            Structure {qualityScore}%
                        </span>
                    </div>
                    <p className="mt-4 rounded-[1.2rem] border border-white/14 bg-black/38 p-4 text-base font-semibold leading-8 text-white">
                        {renderHighlightedText(generatedPrompt)}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-5">
                        {['Task', 'Context', 'Details', 'Limits', 'Output'].map((part, index) => (
                            <div key={part} className="rounded-2xl border border-white/14 bg-white/[0.06] p-3 text-center">
                                <p className={`text-xl font-black text-white ${headingLift}`}>{index + 1}</p>
                                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-200">{part}</p>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            void navigator.clipboard?.writeText(generatedPrompt);
                            onComplete();
                        }}
                        className="mt-4 rounded-full border border-white/20 bg-cyan-100 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,.24)] transition hover:-translate-y-0.5 hover:bg-white"
                    >
                        Copy and mark saved
                    </button>
                </div>
            </div>
        </MiniAppShell>
    );
};

const PromptUpgraderMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [roughPrompt, setRoughPrompt] = useState('make a picture about a future classroom');
    const [goal, setGoal] = useState('create');
    const [format, setFormat] = useState('image prompt');
    const [tone, setTone] = useState('clear and exciting');
    const cleanPrompt = roughPrompt.trim() || 'my first AI Pioneer project';
    const score = Math.min(96, 44 + cleanPrompt.split(/\s+/).filter(Boolean).length * 4 + (goal.length + format.length + tone.length > 18 ? 18 : 0));
    const upgradedPrompt = [
        `Act as a helpful AI creative partner for me as an AI Pioneer.`,
        `Goal: ${goal} a ${format} about ${cleanPrompt}.`,
        `Context: I am learning AI for the first time and need the result to be clear, safe, and useful.`,
        `Style: ${tone}, specific, safe, and easy to understand.`,
        `Include: subject, setting, important details, one useful constraint, and a final output that can be shared in class.`,
    ].join(' ');

    return (
        <MiniAppShell title="Prompt Enhancer Studio" onComplete={onComplete} completeLabel="Prompt upgraded">
            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-3">
                    <div className="rounded-2xl border border-cyan-100/16 bg-slate-950/70 p-4">
                        <p className={`text-[10px] font-black uppercase tracking-[0.22em] text-cyan-50 ${textLift}`}>The formula</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {['Task', 'Context', 'Details', 'Constraints', 'Output'].map((part) => (
                                <span key={part} className="rounded-xl border border-white/14 bg-black/34 px-3 py-2 text-xs font-black text-slate-100">
                                    {part}
                                </span>
                            ))}
                        </div>
                    </div>
                    <label className="block">
                        <span className={`text-xs font-black uppercase tracking-[0.2em] text-slate-100 ${textLift}`}>Your rough prompt</span>
                        <textarea
                            value={roughPrompt}
                            onChange={(event) => setRoughPrompt(event.target.value)}
                            className="mt-2 min-h-32 w-full rounded-2xl border border-cyan-100/18 bg-black/45 p-4 text-sm font-semibold leading-7 text-white outline-none focus:border-cyan-200/50"
                        />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <label className="block">
                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-100">Goal</span>
                            <select value={goal} onChange={(event) => setGoal(event.target.value)} className="mt-2 w-full rounded-xl border border-cyan-100/18 bg-slate-950 p-3 text-sm font-semibold text-white">
                                {['create', 'explain', 'compare', 'plan', 'improve'].map((option) => <option key={option}>{option}</option>)}
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-100">Output</span>
                            <select value={format} onChange={(event) => setFormat(event.target.value)} className="mt-2 w-full rounded-xl border border-cyan-100/18 bg-slate-950 p-3 text-sm font-semibold text-white">
                                {['image prompt', 'class answer', 'project idea', 'build plan', 'checklist'].map((option) => <option key={option}>{option}</option>)}
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-100">Tone</span>
                            <select value={tone} onChange={(event) => setTone(event.target.value)} className="mt-2 w-full rounded-xl border border-cyan-100/18 bg-slate-950 p-3 text-sm font-semibold text-white">
                                {['clear and exciting', 'simple and friendly', 'professional', 'cinematic', 'science focused'].map((option) => <option key={option}>{option}</option>)}
                            </select>
                        </label>
                    </div>
                </div>
                <div className="rounded-[1.35rem] border border-cyan-100/20 bg-[radial-gradient(circle_at_20%_0%,rgba(103,232,249,.14),transparent_32%),linear-gradient(145deg,rgba(2,6,23,.92),rgba(8,47,73,.76))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className={`text-[10px] font-black uppercase tracking-[0.22em] text-cyan-50 ${textLift}`}>Upgraded prompt</p>
                        <span className="rounded-full border border-emerald-100/30 bg-emerald-300/[0.14] px-3 py-1 text-xs font-black text-emerald-50">
                            Clarity {score}%
                        </span>
                    </div>
                    <p className="mt-4 rounded-2xl border border-white/14 bg-black/34 p-4 text-sm font-semibold leading-7 text-slate-50">
                        {upgradedPrompt}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {[
                            ['Weak', 'Too vague to guide the tool.'],
                            ['Better', 'Adds a goal and details.'],
                            ['Strong', 'Defines role, task, context, constraints, and output.'],
                        ].map(([label, body]) => (
                            <div key={label} className="rounded-2xl border border-white/14 bg-black/28 p-3">
                                <p className={`text-xs font-black text-white ${textLift}`}>{label}</p>
                                <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MiniAppShell>
    );
};

const PromptPowerMeterMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [roughPrompt, setRoughPrompt] = useState('make a picture about a future classroom');
    const [audience, setAudience] = useState('students in my class');
    const [mission, setMission] = useState('show how AI can help people learn');
    const [specificity, setSpecificity] = useState(6);
    const [constraints, setConstraints] = useState(5);
    const [examples, setExamples] = useState(4);
    const [aiRewrite, setAiRewrite] = useState('');
    const [aiState, setAiState] = useState<'idle' | 'loading' | 'ready' | 'offline'>('idle');
    const cleanedPrompt = roughPrompt.trim() || 'my AI project idea';
    const roughWords = cleanedPrompt.split(/\s+/).filter(Boolean).length;
    const roughScore = Math.min(58, 22 + roughWords * 3);
    const controlScore = Math.min(98, 34 + specificity * 4 + constraints * 3 + examples * 2);
    const enhancedPrompt = [
        `Create a clear, age-appropriate AI response for ${audience}.`,
        `Mission: ${mission}.`,
        `Starting idea: ${cleanedPrompt}.`,
        `Use specific details, explain your choices, avoid unsafe or misleading claims, and finish with a useful output I can save as evidence.`,
    ].join(' ');
    const activePrompt = aiRewrite || enhancedPrompt;
    const metrics: Array<[string, number, number, HighlightTone]> = [
        ['Clarity', roughScore, controlScore, 'cyan' as HighlightTone],
        ['Control', Math.max(18, roughScore - 10), Math.min(99, controlScore + 2), 'emerald' as HighlightTone],
        ['Usefulness', Math.max(24, roughScore - 4), Math.min(96, controlScore + examples), 'violet' as HighlightTone],
        ['Safety', Math.max(20, roughScore - 16), Math.min(97, 38 + constraints * 6), 'amber' as HighlightTone],
    ];
    const knobs = [
        ['Specificity', specificity, setSpecificity, 'How many concrete details the AI can follow.'],
        ['Constraints', constraints, setConstraints, 'Rules that keep the result focused, safe, and usable.'],
        ['Examples', examples, setExamples, 'Model examples of the kind of answer you want.'],
    ] as Array<[string, number, React.Dispatch<React.SetStateAction<number>>, string]>;

    const requestAiRewrite = async () => {
        setAiState('loading');

        try {
            const client = await getAiClient();
            const result = await client.models.generateContent({
                model: 'ai-pioneer-coach',
                contents: `Rewrite this rough student prompt into a powerful, safe, practical prompt for ages 11 to 18. Keep it under 115 words. Include task, context, details, constraints, output format, and a human check. Rough prompt: ${cleanedPrompt}. Audience: ${audience}. Mission: ${mission}.`,
                config: {
                    temperature: 0.45,
                    maxOutputTokens: 170,
                },
            });
            const text = typeof result?.response?.text === 'function' ? result.response.text() : result?.text;
            setAiRewrite(text || enhancedPrompt);
            setAiState('ready');
            onComplete();
        } catch {
            setAiRewrite(enhancedPrompt);
            setAiState('offline');
            onComplete();
        }
    };

    return (
        <MiniAppShell title="Prompt Power Meter" onComplete={onComplete} completeLabel="Power shift understood">
            <div className="grid gap-5 2xl:grid-cols-[0.95fr_1.05fr]">
                <div className="grid gap-4">
                    <div className={`relative overflow-hidden rounded-[1.45rem] border p-5 ${missionPanelSoft}`}>
                        <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent" />
                        <div className="relative z-10">
                            <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Rough to controlled</p>
                            <h5 className={`mt-2 text-3xl font-black tracking-tight text-white ${headingLift}`}>Same idea. Different level of control.</h5>
                            <p className="mt-3 text-sm font-semibold leading-7 text-slate-100">
                                A stronger prompt does not just sound better. It gives the AI a clearer job, better boundaries, and a result you can actually use.
                            </p>
                        </div>
                    </div>

                    <label className="block rounded-[1.2rem] border border-cyan-100/18 bg-slate-950/72 p-4">
                        <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Rough idea</span>
                        <textarea
                            value={roughPrompt}
                            onChange={(event) => setRoughPrompt(event.target.value)}
                            className="mt-2 min-h-28 w-full rounded-2xl border border-white/12 bg-black/42 p-4 text-sm font-semibold leading-7 text-white outline-none focus:border-cyan-200/50"
                        />
                    </label>

                    <div className="grid gap-3 md:grid-cols-2">
                        <label className="block rounded-[1.2rem] border border-cyan-100/18 bg-slate-950/72 p-4">
                            <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Audience</span>
                            <input value={audience} onChange={(event) => setAudience(event.target.value)} className="mt-2 w-full rounded-xl border border-white/12 bg-black/42 p-3 text-sm font-semibold text-white outline-none focus:border-cyan-200/50" />
                        </label>
                        <label className="block rounded-[1.2rem] border border-cyan-100/18 bg-slate-950/72 p-4">
                            <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Mission</span>
                            <input value={mission} onChange={(event) => setMission(event.target.value)} className="mt-2 w-full rounded-xl border border-white/12 bg-black/42 p-3 text-sm font-semibold text-white outline-none focus:border-cyan-200/50" />
                        </label>
                    </div>

                    <div className="grid gap-3">
                        {knobs.map(([label, value, setter, hint]) => (
                            <label key={label} className="rounded-[1.2rem] border border-white/14 bg-black/34 p-4">
                                <span className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.18em] text-slate-100">
                                    {label}
                                    <span className="text-cyan-100">{value}/10</span>
                                </span>
                                <input
                                    type="range"
                                    min={1}
                                    max={10}
                                    value={value}
                                    onChange={(event) => {
                                        setter(Number(event.target.value));
                                        onComplete();
                                    }}
                                    className="mt-3 w-full accent-cyan-200"
                                />
                                <p className="mt-2 text-xs font-semibold leading-5 text-slate-300">{hint}</p>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4">
                    <div className="grid gap-3 lg:grid-cols-2">
                        <div className="rounded-[1.35rem] border border-rose-100/24 bg-rose-300/[0.09] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                            <p className={`text-[10px] font-black uppercase tracking-[0.22em] text-rose-50 ${textLift}`}>Basic prompt</p>
                            <p className="mt-3 min-h-28 rounded-2xl border border-white/12 bg-black/38 p-4 text-sm font-semibold leading-7 text-slate-100">{cleanedPrompt}</p>
                            <p className="mt-3 text-xs font-semibold leading-5 text-rose-50">Likely result: broad, generic, and hard to reuse.</p>
                        </div>
                        <div className="rounded-[1.35rem] border border-cyan-100/24 bg-cyan-300/[0.10] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className={`text-[10px] font-black uppercase tracking-[0.22em] text-cyan-50 ${textLift}`}>Controlled prompt</p>
                                {aiState === 'ready' && <span className="rounded-full bg-emerald-200 px-2 py-1 text-[10px] font-black text-emerald-950">AI rewrite</span>}
                                {aiState === 'offline' && <span className="rounded-full bg-amber-200 px-2 py-1 text-[10px] font-black text-amber-950">Guide mode</span>}
                            </div>
                            <p className="mt-3 min-h-28 rounded-2xl border border-white/12 bg-black/38 p-4 text-sm font-semibold leading-7 text-slate-100">{activePrompt}</p>
                            <p className="mt-3 text-xs font-semibold leading-5 text-cyan-50">Likely result: clearer, safer, and easier to turn into a project artifact.</p>
                        </div>
                    </div>

                    <div className={`relative overflow-hidden rounded-[1.45rem] border p-5 ${missionPanelSoft}`}>
                        <div className="pointer-events-none absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.05)] [--grid-size:24px]" />
                        <div className="relative z-10">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Prompt advantage</p>
                                    <h5 className={`mt-1 text-2xl font-black text-white ${headingLift}`}>Control changes the output.</h5>
                                </div>
                                <button
                                    type="button"
                                    onClick={requestAiRewrite}
                                    disabled={aiState === 'loading'}
                                    className="rounded-full border border-white/20 bg-cyan-100 px-4 py-2 text-xs font-black text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,.24)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-wait disabled:opacity-70"
                                >
                                    {aiState === 'loading' ? 'Rewriting...' : 'Ask AI to optimize'}
                                </button>
                            </div>
                            <div className="mt-5 grid gap-4">
                                {metrics.map(([label, before, after, tone]) => (
                                    <div key={String(label)} className="rounded-2xl border border-white/14 bg-black/36 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className={`text-sm font-black text-white ${textLift}`}>{String(label)}</p>
                                            <p className="text-xs font-black text-cyan-50">+{Number(after) - Number(before)}</p>
                                        </div>
                                        <div className="mt-3 grid gap-2">
                                            <div>
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.16em] text-slate-300"><span>Basic</span><span>{before}%</span></div>
                                                <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full rounded-full bg-rose-300" style={{ width: `${before}%` }} /></div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.16em] text-slate-300"><span>Controlled</span><span>{after}%</span></div>
                                                <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/[0.08]"><div className={`h-full rounded-full bg-gradient-to-r ${toneDotClass[tone as HighlightTone]}`} style={{ width: `${after}%` }} /></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MiniAppShell>
    );
};

const promptLibraryCards = [
    {
        title: 'Explain It Simply',
        tag: 'Learning',
        template: 'Explain [topic] to an 11-year-old using one example, one analogy, and three key words to remember.',
    },
    {
        title: 'Creative Image',
        tag: 'Image',
        template: 'Create an image prompt for [subject] with a clear setting, mood, color palette, camera angle, and one safety boundary.',
    },
    {
        title: 'Project Builder',
        tag: 'Build',
        template: 'Help me turn [idea] into a beginner AI project. Give me the goal, users, tools, first steps, and evidence to save.',
    },
    {
        title: 'Compare Two Tools',
        tag: 'Research',
        template: 'Compare [tool A] and [tool B] for a beginner. Use a table with strengths, limits, best use, and risk to check.',
    },
];

const PromptLibraryMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [replacement, setReplacement] = useState('AI helping my community');
    const selected = promptLibraryCards[selectedIndex];
    const remixed = selected.template.replace(/\[[^\]]+\]/g, replacement.trim() || 'my idea');

    return (
        <MiniAppShell title="Starter Prompt Deck" onComplete={onComplete} completeLabel="Prompt card remixed">
            <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    {promptLibraryCards.map((card, index) => (
                        <button
                            key={card.title}
                            type="button"
                            onClick={() => {
                                setSelectedIndex(index);
                                onComplete();
                            }}
                            className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${selectedIndex === index ? 'border-cyan-100/40 bg-cyan-300/[0.14]' : 'border-white/14 bg-black/30 hover:bg-white/[0.08]'}`}
                        >
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>{card.tag}</span>
                            <p className={`mt-2 text-base font-black text-white ${textLift}`}>{card.title}</p>
                            <p className="mt-2 text-xs font-semibold leading-5 text-slate-200">{card.template}</p>
                        </button>
                    ))}
                </div>
                <div className={`rounded-[1.35rem] border p-4 ${missionPanelSoft}`}>
                    <label className="block">
                        <span className={`text-xs font-black uppercase tracking-[0.2em] text-slate-100 ${textLift}`}>Swap in your topic</span>
                        <input
                            value={replacement}
                            onChange={(event) => setReplacement(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-cyan-100/18 bg-black/45 p-3 text-sm font-semibold text-white outline-none focus:border-cyan-200/50"
                        />
                    </label>
                    <div className="mt-4 rounded-2xl border border-white/14 bg-black/36 p-4">
                        <p className={`text-[10px] font-black uppercase tracking-[0.22em] text-cyan-50 ${textLift}`}>Your remixed prompt</p>
                        <p className="mt-3 text-sm font-semibold leading-7 text-white">{remixed}</p>
                    </div>
                    <p className="mt-4 text-xs font-semibold leading-6 text-slate-200">
                        One good prompt card is enough to start. The full library is for extra ideas after you understand how remixing works.
                    </p>
                </div>
            </div>
        </MiniAppShell>
    );
};

const PromptRemixMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [idea, setIdea] = useState('a robot helping a kid with homework');
    const remix = `Create a bright, hopeful scene of ${idea.trim() || 'a responsible AI project'}, with clear subject, setting, mood, color palette, and one safety boundary. Make it detailed enough for an image generator, but easy for your class to understand.`;

    return (
        <MiniAppShell title="Native Prompt Remix Lab" onComplete={onComplete} completeLabel="Save remix">
            <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
                <label className="block">
                    <span className={`text-xs font-black uppercase tracking-[0.2em] text-slate-100 ${textLift}`}>Rough idea</span>
                    <textarea
                        value={idea}
                        onChange={(event) => setIdea(event.target.value)}
                        className="mt-2 min-h-36 w-full rounded-2xl border border-cyan-100/18 bg-black/45 p-4 text-sm font-semibold leading-7 text-white outline-none focus:border-cyan-200/50"
                    />
                </label>
                <div className={`rounded-2xl border p-4 ${missionPanelSoft}`}>
                    <p className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Remixed prompt</p>
                    <p className="mt-3 text-sm font-semibold leading-7 text-slate-100">{remix}</p>
                </div>
            </div>
        </MiniAppShell>
    );
};

const ParticleControlMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [count, setCount] = useState(520);
    const [size, setSize] = useState(12);
    const [speed, setSpeed] = useState(4);
    const [dispersion, setDispersion] = useState(32);
    const [effect, setEffect] = useState('Vortex');
    const dots = Array.from({ length: 36 }, (_, index) => index);

    return (
        <MiniAppShell title="Particle Control Lab" onComplete={onComplete} completeLabel="Controls tested">
            <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
                <div className="grid gap-3">
                    {[
                        ['Particle Count', count, 100, 1000, setCount],
                        ['Particle Size', size, 4, 28, setSize],
                        ['Animation Speed', speed, 1, 10, setSpeed],
                        ['Dispersion', dispersion, 0, 100, setDispersion],
                    ].map(([label, value, min, max, setter]) => (
                        <label key={String(label)} className="rounded-2xl border border-cyan-100/16 bg-slate-950/68 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.07)]">
                            <span className="flex items-center justify-between text-xs font-black uppercase tracking-[0.18em] text-slate-100">
                                {String(label)}
                                <span className="text-cyan-100">{String(value)}</span>
                            </span>
                            <input
                                type="range"
                                min={Number(min)}
                                max={Number(max)}
                                value={Number(value)}
                                onChange={(event) => (setter as React.Dispatch<React.SetStateAction<number>>)(Number(event.target.value))}
                                className="mt-3 w-full accent-cyan-200"
                            />
                        </label>
                    ))}
                    <label className="rounded-2xl border border-cyan-100/16 bg-slate-950/68 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.07)]">
                        <span className={`text-xs font-black uppercase tracking-[0.18em] text-slate-100 ${textLift}`}>Effect type</span>
                        <select value={effect} onChange={(event) => setEffect(event.target.value)} className="mt-2 w-full rounded-xl border border-cyan-100/18 bg-slate-950 p-3 text-sm font-semibold text-white outline-none">
                            {['Explosion', 'Implosion', 'Vortex', 'Wave', 'Pixelate'].map((option) => <option key={option}>{option}</option>)}
                        </select>
                    </label>
                </div>
                <div className="relative min-h-80 overflow-hidden rounded-[1.4rem] border border-cyan-100/15 bg-[radial-gradient(circle_at_center,rgba(103,232,249,.18),rgba(15,23,42,.9)_58%)]">
                    <div className="absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.055)] [--grid-size:24px]" />
                    {dots.map((dot) => {
                        const angle = (dot / dots.length) * Math.PI * 2;
                        const radius = 46 + (dot % 8) * (dispersion / 9);
                        const x = 50 + Math.cos(angle + speed / 8) * radius * 0.55;
                        const y = 50 + Math.sin(angle + speed / 8) * radius * 0.55;

                        return (
                            <span
                                key={dot}
                                className="absolute rounded-full bg-cyan-100 shadow-[0_0_18px_rgba(103,232,249,.8)]"
                                style={{
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    width: `${Math.max(3, size / 2)}px`,
                                    height: `${Math.max(3, size / 2)}px`,
                                    opacity: 0.35 + (count / 1000) * 0.55,
                                    transform: `translate(-50%,-50%) scale(${effect === 'Implosion' ? 0.75 : effect === 'Explosion' ? 1.25 : 1})`,
                                }}
                            />
                        );
                    })}
                    <div className={`absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/58 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[0_12px_30px_rgba(0,0,0,.38)] ${textLift}`}>{effect} preview</div>
                </div>
            </div>
        </MiniAppShell>
    );
};

const ApiOrbMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [revealed, setRevealed] = useState(false);
    const fakeKey = 'sk-training-demo-zen-pioneer-keep-real-keys-private';

    return (
        <MiniAppShell title="API Key Orb Training Demo" onComplete={onComplete} completeLabel="I understand key safety">
            <div className="grid gap-5 lg:grid-cols-[240px_1fr] lg:items-center">
                <button
                    type="button"
                    onClick={() => {
                        setRevealed(true);
                        onComplete();
                    }}
                    className="relative mx-auto flex h-52 w-52 items-center justify-center rounded-full border border-cyan-100/25 bg-[radial-gradient(circle,#e0f2fe_0%,#38bdf8_22%,#1e3a8a_48%,#020617_76%)] shadow-[0_0_80px_rgba(56,189,248,.35)]"
                >
                    <span className="absolute inset-5 rounded-full border border-white/20" />
                    <span className="text-center text-xs font-black uppercase tracking-[0.26em] text-white">{revealed ? 'Training key revealed' : 'Click orb'}</span>
                </button>
                <div className={`rounded-2xl border p-5 ${missionPanelSoft}`}>
                    <p className="text-sm font-semibold leading-7 text-slate-100">API keys work like private passwords for AI tools. In class demos, use only approved training keys. Never paste personal or production keys into unknown websites.</p>
                    <div className="mt-4 rounded-xl border border-amber-100/30 bg-amber-300/[0.12] p-3 font-mono text-xs font-bold leading-6 text-amber-50 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                        {revealed ? fakeKey : 'Hidden until you click the orb'}
                    </div>
                </div>
            </div>
        </MiniAppShell>
    );
};

const missionBadges = [
    ['Eco Warrior', 'Use AI to protect ecosystems and support sustainable decisions.'],
    ['Ocean Guardian', 'Detect ocean plastic and support cleaner waterways.'],
    ['Wildlife Protector', 'Track endangered species and alert helpers to risk.'],
    ['Recycling Master', 'Teach communities how to recycle correctly.'],
    ['Energy Saver', 'Monitor and reduce energy waste.'],
    ['Urban Innovator', 'Improve traffic, resources, and cleaner city life.'],
    ['Community Healer', 'Support wellness, connection, and stronger communities.'],
    ['Global Collaborator', 'Connect people worldwide to build for social good.'],
];

const MissionBadgeMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [selected, setSelected] = useState('Ocean Guardian');

    return (
        <MiniAppShell title="Mission Badge Selector" onComplete={onComplete} completeLabel="Mission selected">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {missionBadges.map(([badge, description]) => (
                    <button
                        key={badge}
                        type="button"
                        onClick={() => {
                            setSelected(badge);
                            onComplete();
                        }}
                        className={`rounded-2xl border p-4 text-left shadow-[0_14px_34px_rgba(0,0,0,.22)] transition hover:-translate-y-0.5 ${selected === badge ? 'border-emerald-100/40 bg-emerald-300/[0.16] text-white' : 'border-white/14 bg-slate-950/68 text-slate-100 hover:bg-slate-900/80'}`}
                    >
                        <p className={`font-black text-white ${textLift}`}>{badge}</p>
                        <p className="mt-2 text-xs font-semibold leading-5">{description}</p>
                    </button>
                ))}
            </div>
        </MiniAppShell>
    );
};

const ImageRecipeBuilderMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [subject, setSubject] = useState('your team building an AI tool for clean water');
    const [setting, setSetting] = useState('a bright community innovation lab');
    const [style, setStyle] = useState('cinematic digital illustration');
    const [lighting, setLighting] = useState('soft morning light');
    const [camera, setCamera] = useState('wide angle with a clear focal point');
    const [safety, setSafety] = useState('positive, realistic, no scary or misleading details');
    const imagePrompt = `Create ${style} of ${subject} in ${setting}. Use ${lighting}, ${camera}, strong composition, expressive details, and a hopeful mood. Safety constraints: ${safety}.`;
    const recipeParts = [
        ['Subject', subject],
        ['Setting', setting],
        ['Style', style],
        ['Lighting', lighting],
        ['Camera', camera],
        ['Safety', safety],
    ];

    return (
        <MiniAppShell title="Image Prompt Recipe Builder" onComplete={onComplete} completeLabel="Image recipe saved">
            <div className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
                <div className="grid gap-3">
                    <label className="block rounded-[1.1rem] border border-cyan-100/16 bg-slate-950/68 p-3">
                        <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Subject</span>
                        <input value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-2 w-full rounded-xl border border-white/12 bg-black/40 p-3 text-sm font-semibold text-white outline-none focus:border-cyan-200/50" />
                    </label>
                    <label className="block rounded-[1.1rem] border border-cyan-100/16 bg-slate-950/68 p-3">
                        <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Setting</span>
                        <input value={setting} onChange={(event) => setSetting(event.target.value)} className="mt-2 w-full rounded-xl border border-white/12 bg-black/40 p-3 text-sm font-semibold text-white outline-none focus:border-cyan-200/50" />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block rounded-[1.1rem] border border-cyan-100/16 bg-slate-950/68 p-3">
                            <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Style</span>
                            <select value={style} onChange={(event) => setStyle(event.target.value)} className="mt-2 w-full rounded-xl border border-white/12 bg-slate-950 p-3 text-sm font-semibold text-white outline-none">
                                {['cinematic digital illustration', 'clean 3D render', 'bright comic panel', 'realistic documentary photo', 'futuristic product poster'].map((option) => <option key={option}>{option}</option>)}
                            </select>
                        </label>
                        <label className="block rounded-[1.1rem] border border-cyan-100/16 bg-slate-950/68 p-3">
                            <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Lighting</span>
                            <select value={lighting} onChange={(event) => setLighting(event.target.value)} className="mt-2 w-full rounded-xl border border-white/12 bg-slate-950 p-3 text-sm font-semibold text-white outline-none">
                                {['soft morning light', 'clean studio lighting', 'glowing neon accents', 'golden hour', 'high contrast spotlight'].map((option) => <option key={option}>{option}</option>)}
                            </select>
                        </label>
                    </div>
                    <label className="block rounded-[1.1rem] border border-cyan-100/16 bg-slate-950/68 p-3">
                        <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Camera / composition</span>
                        <input value={camera} onChange={(event) => setCamera(event.target.value)} className="mt-2 w-full rounded-xl border border-white/12 bg-black/40 p-3 text-sm font-semibold text-white outline-none focus:border-cyan-200/50" />
                    </label>
                    <label className="block rounded-[1.1rem] border border-cyan-100/16 bg-slate-950/68 p-3">
                        <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Safety / quality limit</span>
                        <input value={safety} onChange={(event) => setSafety(event.target.value)} className="mt-2 w-full rounded-xl border border-white/12 bg-black/40 p-3 text-sm font-semibold text-white outline-none focus:border-cyan-200/50" />
                    </label>
                </div>
                <div className="relative overflow-hidden rounded-[1.45rem] border border-cyan-100/20 bg-[radial-gradient(circle_at_20%_10%,rgba(244,114,182,.16),transparent_30%),radial-gradient(circle_at_86%_20%,rgba(103,232,249,.16),transparent_28%),linear-gradient(145deg,rgba(2,6,23,.94),rgba(8,47,73,.72))] p-5 shadow-[0_22px_60px_rgba(0,0,0,.36),inset_0_1px_0_rgba(255,255,255,.08)]">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {recipeParts.map(([label, value]) => (
                            <div key={label} className="rounded-2xl border border-white/14 bg-black/34 p-3">
                                <p className={`text-[10px] font-black uppercase tracking-[0.18em] text-cyan-50 ${textLift}`}>{label}</p>
                                <p className="mt-1 text-xs font-semibold leading-5 text-slate-100">{value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 rounded-[1.2rem] border border-white/14 bg-black/42 p-4">
                        <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Generated image prompt</p>
                        <p className="mt-3 text-sm font-semibold leading-7 text-white">{renderHighlightedText(imagePrompt)}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            void navigator.clipboard?.writeText(imagePrompt);
                            onComplete();
                        }}
                        className="mt-4 rounded-full border border-white/20 bg-cyan-100 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,.24)] transition hover:-translate-y-0.5 hover:bg-white"
                    >
                        Copy recipe and mark saved
                    </button>
                </div>
            </div>
        </MiniAppShell>
    );
};

const DiffusionLabMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [stage, setStage] = useState(2);
    const [subject, setSubject] = useState('your team building an AI clean-water tool');
    const [style, setStyle] = useState('bright cinematic poster');
    const [quality, setQuality] = useState('clear focal point, hopeful mood, realistic details');
    const stages = [
        ['Noise', 'The image starts as random visual noise.'],
        ['Structure', 'The model starts finding shapes that match the prompt.'],
        ['Details', 'Edges, lighting, colors, and textures become clearer.'],
        ['Review', 'You check the result and improve the prompt.'],
    ];
    const prompt = `Generate ${style} of ${subject}. Include ${quality}. Keep it safe, useful, and easy to explain.`;
    const dots = Array.from({ length: 56 }, (_, index) => index);

    return (
        <MiniAppShell title="Diffusion Image Lab" onComplete={onComplete} completeLabel="Diffusion loop explained">
            <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
                <div className="grid gap-3">
                    <label className="rounded-2xl border border-cyan-100/16 bg-slate-950/68 p-3">
                        <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Subject</span>
                        <input value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-2 w-full rounded-xl border border-white/12 bg-black/40 p-3 text-sm font-semibold text-white outline-none focus:border-cyan-200/50" />
                    </label>
                    <label className="rounded-2xl border border-cyan-100/16 bg-slate-950/68 p-3">
                        <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Style</span>
                        <select value={style} onChange={(event) => setStyle(event.target.value)} className="mt-2 w-full rounded-xl border border-white/12 bg-slate-950 p-3 text-sm font-semibold text-white outline-none">
                            {['bright cinematic poster', 'clean 3D educational scene', 'comic-book mission panel', 'realistic documentary image', 'futuristic app splash screen'].map((option) => <option key={option}>{option}</option>)}
                        </select>
                    </label>
                    <label className="rounded-2xl border border-cyan-100/16 bg-slate-950/68 p-3">
                        <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Quality direction</span>
                        <input value={quality} onChange={(event) => setQuality(event.target.value)} className="mt-2 w-full rounded-xl border border-white/12 bg-black/40 p-3 text-sm font-semibold text-white outline-none focus:border-cyan-200/50" />
                    </label>
                    <label className="rounded-2xl border border-cyan-100/16 bg-slate-950/68 p-3">
                        <span className="flex items-center justify-between text-xs font-black uppercase tracking-[0.18em] text-slate-100">
                            Generation stage
                            <span className="text-cyan-100">{stages[stage][0]}</span>
                        </span>
                        <input
                            type="range"
                            min={0}
                            max={3}
                            value={stage}
                            onChange={(event) => {
                                setStage(Number(event.target.value));
                                onComplete();
                            }}
                            className="mt-3 w-full accent-cyan-200"
                        />
                    </label>
                </div>
                <div className={`relative overflow-hidden rounded-[1.45rem] border p-5 ${missionPanelSoft}`}>
                    <div className="grid gap-4 lg:grid-cols-[1fr_.92fr]">
                        <div className="relative min-h-80 overflow-hidden rounded-[1.3rem] border border-cyan-100/18 bg-slate-950">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,rgba(103,232,249,.24),transparent_22%),radial-gradient(circle_at_70%_58%,rgba(244,114,182,.22),transparent_27%),linear-gradient(145deg,rgba(15,23,42,.96),rgba(8,47,73,.74))]" />
                            {dots.map((dot) => {
                                const column = dot % 8;
                                const row = Math.floor(dot / 8);
                                const opacity = stage === 0 ? 0.82 : 0.22 + stage * 0.18;
                                const scale = stage === 0 ? 0.75 + ((dot % 5) * 0.09) : 1 + stage * 0.08;
                                return (
                                    <span
                                        key={dot}
                                        className="absolute rounded-full bg-cyan-100 shadow-[0_0_18px_rgba(103,232,249,.45)]"
                                        style={{
                                            left: `${10 + column * 11 + (stage === 0 ? (dot % 3) * 2 : 0)}%`,
                                            top: `${12 + row * 11 + (stage === 0 ? (dot % 4) * 1.7 : 0)}%`,
                                            width: stage >= 2 && dot % 7 === 0 ? '42px' : '8px',
                                            height: stage >= 2 && dot % 7 === 0 ? '18px' : '8px',
                                            opacity,
                                            transform: `scale(${scale})`,
                                        }}
                                    />
                                );
                            })}
                            <div className={`absolute left-[24%] top-[30%] h-28 w-48 rounded-[2rem] border-2 ${stage >= 1 ? 'border-cyan-100/75 bg-cyan-300/[0.09]' : 'border-white/10 bg-white/[0.03]'} transition`} />
                            <div className={`absolute left-[40%] top-[42%] h-20 w-24 rounded-full border-2 ${stage >= 2 ? 'border-rose-100/75 bg-rose-300/[0.10]' : 'border-white/10 bg-white/[0.03]'} transition`} />
                            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/18 bg-black/58 p-3">
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>{stages[stage][0]}</p>
                                <p className="mt-1 text-sm font-semibold leading-6 text-slate-100">{stages[stage][1]}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="rounded-2xl border border-white/14 bg-black/34 p-4">
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Prompt driving the image</p>
                                <p className="mt-2 text-sm font-semibold leading-7 text-slate-100">{renderHighlightedText(prompt)}</p>
                            </div>
                            <div className="grid gap-2">
                                {stages.map(([label, body], index) => (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => {
                                            setStage(index);
                                            onComplete();
                                        }}
                                        className={`rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${stage === index ? 'border-cyan-100/42 bg-cyan-300/[0.14]' : 'border-white/14 bg-black/30 hover:bg-white/[0.08]'}`}
                                    >
                                        <p className={`text-xs font-black uppercase tracking-[0.18em] text-white ${textLift}`}>{index + 1}. {label}</p>
                                        <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{body}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MiniAppShell>
    );
};

const MediaQualityLensMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [mediaType, setMediaType] = useState('Image');
    const [subject, setSubject] = useState('students using AI to protect clean water');
    const [clarity, setClarity] = useState(7);
    const [styleControl, setStyleControl] = useState(6);
    const [safety, setSafety] = useState(8);
    const [evidence, setEvidence] = useState(5);
    const qualityScore = Math.min(99, 24 + clarity * 3 + styleControl * 3 + safety * 2 + evidence);
    const trustRisk = Math.max(4, 76 - safety * 5 - evidence * 3 + (mediaType === 'Video' ? 8 : 0));
    const finalPrompt = [
        `Create a ${mediaType.toLowerCase()} concept about ${subject || 'a helpful AI project'}.`,
        `Make the purpose clear for students ages 11 to 18.`,
        `Use a strong visual direction, specific details, safe choices, and one human review step before sharing.`,
    ].join(' ');
    const controls: Array<[string, number, (value: number) => void, string, HighlightTone]> = [
        ['Clarity', clarity, setClarity, 'Does the tool know exactly what to create?', 'cyan'],
        ['Style Control', styleControl, setStyleControl, 'Does the prompt guide mood, camera, lighting, and format?', 'violet'],
        ['Safety', safety, setSafety, 'Does the idea avoid harm, confusion, or fake evidence?', 'emerald'],
        ['Evidence', evidence, setEvidence, 'Can you save proof of what changed and why?', 'amber'],
    ];
    const pipeline = [
        ['Describe', 'Give the tool a clear job.'],
        ['Generate', 'Create one version.'],
        ['Inspect', 'Check accuracy, safety, and quality.'],
        ['Improve', 'Adjust the prompt and save proof.'],
    ];

    return (
        <MiniAppShell title="Generative Quality Lens" onComplete={onComplete} completeLabel="Quality lens saved">
            <div className="grid gap-5 2xl:grid-cols-[0.86fr_1.14fr]">
                <div className="grid gap-4">
                    <div className={`relative overflow-hidden rounded-[1.45rem] border p-5 ${missionPanelSoft}`}>
                        <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-rose-100/70 to-transparent" />
                        <p className={`relative text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Media control board</p>
                        <h5 className={`relative mt-2 text-3xl font-black tracking-tight text-white ${headingLift}`}>Better media comes from better controls.</h5>
                        <p className="relative mt-3 text-sm font-semibold leading-7 text-slate-100">
                            Image, audio, and video generators all need the same habit: give a clear direction, check the result, then improve it before sharing.
                        </p>
                    </div>

                    <div className="rounded-[1.2rem] border border-cyan-100/18 bg-slate-950/72 p-4">
                        <p className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Choose media type</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-4">
                            {['Image', 'Text', 'Audio', 'Video'].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                        setMediaType(option);
                                        onComplete();
                                    }}
                                    className={`rounded-2xl border px-3 py-3 text-xs font-black uppercase tracking-[0.14em] transition hover:-translate-y-0.5 ${mediaType === option ? 'border-cyan-100/50 bg-cyan-100 text-slate-950 shadow-[0_0_24px_rgba(103,232,249,.32)]' : 'border-white/14 bg-black/34 text-slate-100 hover:bg-white/[0.08]'}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    <label className="block rounded-[1.2rem] border border-cyan-100/18 bg-slate-950/72 p-4">
                        <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Project idea</span>
                        <input
                            value={subject}
                            onChange={(event) => setSubject(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-white/12 bg-black/42 p-3 text-sm font-semibold text-white outline-none focus:border-cyan-200/50"
                        />
                    </label>

                    <div className="grid gap-3">
                        {controls.map(([label, value, setter, hint]) => (
                            <label key={label} className="rounded-[1.2rem] border border-white/14 bg-black/34 p-4">
                                <span className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.18em] text-slate-100">
                                    {label}
                                    <span className="text-cyan-100">{value}/10</span>
                                </span>
                                <input
                                    type="range"
                                    min={1}
                                    max={10}
                                    value={value}
                                    onChange={(event) => {
                                        setter(Number(event.target.value));
                                        onComplete();
                                    }}
                                    className="mt-3 w-full accent-cyan-200"
                                />
                                <p className="mt-2 text-xs font-semibold leading-5 text-slate-300">{hint}</p>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4">
                    <div className="grid gap-3 lg:grid-cols-[0.72fr_1.28fr]">
                        <div className="relative overflow-hidden rounded-[1.45rem] border border-cyan-100/22 bg-[radial-gradient(circle_at_30%_18%,rgba(103,232,249,.22),transparent_28%),linear-gradient(145deg,rgba(2,6,23,.96),rgba(8,47,73,.72))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.09)]">
                            <div className="pointer-events-none absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.055)] [--grid-size:22px]" />
                            <div className="relative z-10">
                                <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Quality signal</p>
                                <p className={`mt-4 text-6xl font-black tracking-[-0.06em] text-white ${headingLift}`}>{qualityScore}</p>
                                <p className="mt-1 text-sm font-black uppercase tracking-[0.18em] text-cyan-50">Ready score</p>
                                <div className="mt-5 rounded-2xl border border-rose-100/24 bg-rose-300/[0.10] p-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-50">Trust risk</p>
                                    <p className={`mt-1 text-3xl font-black text-white ${headingLift}`}>{trustRisk}%</p>
                                    <p className="mt-2 text-xs font-semibold leading-5 text-rose-50">Lower risk means you gave the tool stronger safety and review instructions.</p>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-[1.45rem] border p-5 ${missionPanelSoft}`}>
                            <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Control dashboard</p>
                            <div className="mt-4 grid gap-3">
                                {controls.map(([label, value, , , tone]) => (
                                    <div key={label} className="rounded-2xl border border-white/14 bg-black/34 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className={`text-sm font-black text-white ${textLift}`}>{label}</p>
                                            <p className="text-xs font-black text-cyan-50">{value * 10}%</p>
                                        </div>
                                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/[0.08]">
                                            <div className={`h-full rounded-full bg-gradient-to-r ${toneDotClass[tone]}`} style={{ width: `${value * 10}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-3 xl:grid-cols-4">
                        {pipeline.map(([label, body], index) => (
                            <div key={label} className="relative overflow-hidden rounded-[1.2rem] border border-cyan-100/18 bg-slate-950/72 p-4">
                                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${index < 2 ? 'from-cyan-200 to-sky-300' : 'from-emerald-200 to-cyan-200'}`} />
                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-100 text-xs font-black text-slate-950 shadow-[0_0_18px_rgba(103,232,249,.3)]">{index + 1}</span>
                                <p className={`mt-3 text-base font-black text-white ${textLift}`}>{label}</p>
                                <p className="mt-2 text-xs font-semibold leading-5 text-slate-200">{body}</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-[1.45rem] border border-cyan-100/22 bg-black/42 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Generated studio prompt</p>
                            <button
                                type="button"
                                onClick={() => {
                                    void navigator.clipboard?.writeText(finalPrompt);
                                    onComplete();
                                }}
                                className="rounded-full border border-white/20 bg-cyan-100 px-4 py-2 text-xs font-black text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,.24)] transition hover:-translate-y-0.5 hover:bg-white"
                            >
                                Copy prompt
                            </button>
                        </div>
                        <p className="mt-4 rounded-2xl border border-white/14 bg-slate-950/62 p-4 text-sm font-semibold leading-7 text-slate-100">
                            {renderHighlightedText(finalPrompt)}
                        </p>
                        <div className="mt-4 grid gap-2 md:grid-cols-3">
                            {['Is it true?', 'Is it safe?', 'Can I explain it?'].map((question) => (
                                <div key={question} className="rounded-2xl border border-emerald-100/22 bg-emerald-300/[0.10] p-3 text-sm font-black text-emerald-50">
                                    {question}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MiniAppShell>
    );
};

const mediaModes = [
    ['Text', 'Turns a prompt into an explanation, story, plan, or code idea.', 'Check facts, tone, and whether the answer matches the task.'],
    ['Image', 'Turns visual instructions into a new picture or design direction.', 'Check subject, style, realism, safety, and bias.'],
    ['Audio', 'Turns words or direction into voice, music, or sound ideas.', 'Check consent, clarity, accent, and whether it sounds misleading.'],
    ['Video', 'Turns a scene prompt into moving media or a shot plan.', 'Check whether people could mistake it for real footage.'],
];

const GenerativeMediaLabMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [mode, setMode] = useState('Image');
    const [idea, setIdea] = useState('a youth team using AI to protect clean water');
    const [audience, setAudience] = useState('a global classroom');
    const [aiText, setAiText] = useState('');
    const [aiState, setAiState] = useState<'idle' | 'loading' | 'ready' | 'offline'>('idle');
    const [visualUrl, setVisualUrl] = useState('');
    const [visualState, setVisualState] = useState<'idle' | 'loading' | 'ready' | 'offline'>('idle');
    const [visualMessage, setVisualMessage] = useState('Up to 3 AI image generations are available per person every 24 hours.');
    const selectedMode = mediaModes.find(([label]) => label === mode) ?? mediaModes[1];
    const offlineBrief = `${mode} brief: Create a clear ${mode.toLowerCase()} concept about ${idea || 'a useful AI project'} for ${audience || 'your audience'}. Start with the goal, add the important details, generate one version, then review accuracy, safety, and usefulness before sharing.`;

    const requestCoach = async () => {
        setAiState('loading');
        try {
            const client = await getAiClient();
            const result = await client.models.generateContent({
                model: 'ai-pioneer-coach',
                contents: `Write a short, student-friendly ${mode} generation brief for ages 11 to 18. Idea: ${idea}. Audience: ${audience}. Include: prompt, what the model does, one safety check, and one improvement step. Keep it under 120 words.`,
                config: {
                    temperature: 0.55,
                    maxOutputTokens: 180,
                },
            });
            const text = typeof result?.response?.text === 'function' ? result.response.text() : result?.text;
            setAiText(text || offlineBrief);
            setAiState('ready');
            onComplete();
        } catch {
            setAiText(offlineBrief);
            setAiState('offline');
            onComplete();
        }
    };

    const requestVisual = async () => {
        setVisualState('loading');
        setVisualMessage('Sending your prompt through the secure AI image path...');

        try {
            const client = await getAiClient();
            const result = await client.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: `Create a clean, inspiring, age-appropriate educational concept image for this AI Pioneer project: ${idea}. Audience: ${audience}. Style: premium futuristic course graphic, clear subject, high contrast, no text, safe for ages 11 to 18.`,
                config: {
                    responseModalities: ['IMAGE'],
                },
            });
            const url = typeof result?.response?.text === 'function' ? result.response.text() : result?.text;

            if (typeof url === 'string' && /^(data:image\/|https?:\/\/)/.test(url)) {
                setVisualUrl(url);
                setVisualState('ready');
                setVisualMessage('Generated through the secure AI proxy. Review it before using it in a project.');
            } else {
                setVisualUrl('');
                setVisualState('offline');
                setVisualMessage(typeof url === 'string' && url.startsWith('Image generation error:')
                    ? url.replace('Image generation error:', '').trim()
                    : 'The image generator did not return a usable image. Try a clearer prompt or use guide mode.');
            }

            onComplete();
        } catch {
            setVisualUrl('');
            setVisualState('offline');
            setVisualMessage('The lesson still works in guide mode. Add Cloudflare server variables to enable live image generation.');
            onComplete();
        }
    };

    return (
        <MiniAppShell title="Generative Media Studio" onComplete={onComplete} completeLabel="Media loop understood">
            <div className="grid gap-5 xl:grid-cols-[0.76fr_1.24fr]">
                <div className="space-y-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                        {mediaModes.map(([label, body]) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => {
                                    setMode(label);
                                    onComplete();
                                }}
                                className={`rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${mode === label ? 'border-rose-100/42 bg-rose-300/[0.15]' : 'border-white/14 bg-black/30 hover:bg-white/[0.08]'}`}
                            >
                                <p className={`text-sm font-black text-white ${textLift}`}>{label}</p>
                                <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{body}</p>
                            </button>
                        ))}
                    </div>
                    <label className="block rounded-2xl border border-cyan-100/16 bg-slate-950/68 p-3">
                        <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Idea</span>
                        <input value={idea} onChange={(event) => setIdea(event.target.value)} className="mt-2 w-full rounded-xl border border-white/12 bg-black/40 p-3 text-sm font-semibold text-white outline-none focus:border-cyan-200/50" />
                    </label>
                    <label className="block rounded-2xl border border-cyan-100/16 bg-slate-950/68 p-3">
                        <span className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Audience</span>
                        <input value={audience} onChange={(event) => setAudience(event.target.value)} className="mt-2 w-full rounded-xl border border-white/12 bg-black/40 p-3 text-sm font-semibold text-white outline-none focus:border-cyan-200/50" />
                    </label>
                </div>
                <div className={`relative overflow-hidden rounded-[1.45rem] border p-5 ${missionPanelSoft}`}>
                    <div className="pointer-events-none absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.05)] [--grid-size:28px]" />
                    <div className="relative z-10">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Selected media</p>
                                <h5 className={`mt-2 text-3xl font-black text-white ${headingLift}`}>{mode}</h5>
                            </div>
                            <button
                                type="button"
                                onClick={requestCoach}
                                disabled={aiState === 'loading'}
                                className="rounded-full border border-white/20 bg-cyan-100 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,.24)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-wait disabled:opacity-70"
                            >
                                {aiState === 'loading' ? 'Generating...' : 'Generate coach brief'}
                            </button>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            {[
                                ['Prompt', 'Describe the goal, subject, details, limits, and output.'],
                                ['Model', selectedMode[1]],
                                ['Review', selectedMode[2]],
                            ].map(([label, body]) => (
                                <div key={label} className="rounded-2xl border border-white/14 bg-black/34 p-4">
                                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>{label}</p>
                                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-100">{renderHighlightedText(body)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 rounded-[1.2rem] border border-white/14 bg-black/40 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Studio brief</p>
                                {aiState === 'offline' && <span className="rounded-full border border-amber-100/30 bg-amber-300/[0.14] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-50">Offline fallback</span>}
                                {aiState === 'ready' && <span className="rounded-full border border-emerald-100/30 bg-emerald-300/[0.14] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-50">AI proxy</span>}
                            </div>
                            <p className="mt-3 text-sm font-semibold leading-7 text-slate-100">{renderHighlightedText(aiText || offlineBrief)}</p>
                        </div>
                        <div className="mt-4 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
                            <div className="rounded-[1.2rem] border border-cyan-100/18 bg-black/42 p-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-[0.22em] text-cyan-50 ${textLift}`}>Cloudflare image path</p>
                                        <p className="mt-2 text-sm font-semibold leading-6 text-slate-100">Practice image prompting through the secure server proxy, with a 3-per-24-hour daily limit.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={requestVisual}
                                        disabled={visualState === 'loading'}
                                        className="rounded-full border border-white/20 bg-emerald-200 px-4 py-2 text-xs font-black text-emerald-950 shadow-[0_14px_30px_rgba(16,185,129,.24)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-wait disabled:opacity-70"
                                    >
                                        {visualState === 'loading' ? 'Generating...' : 'Generate visual'}
                                    </button>
                                </div>
                                <div className="mt-4">
                                    <SignalRail compact labels={['Prompt', 'Model', 'Image', 'Review']} activeIndex={visualState === 'ready' ? 3 : visualState === 'loading' ? 1 : 0} />
                                </div>
                            </div>
                            <div className="relative min-h-56 overflow-hidden rounded-[1.2rem] border border-white/16 bg-[radial-gradient(circle_at_22%_18%,rgba(103,232,249,.2),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(244,114,182,.16),transparent_30%),linear-gradient(145deg,rgba(2,6,23,.95),rgba(8,47,73,.76))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                                {visualUrl ? (
                                    <img src={visualUrl} alt="Generated AI Pioneer project visual" className="h-full min-h-52 w-full rounded-2xl object-cover shadow-[0_18px_50px_rgba(0,0,0,.38)]" />
                                ) : (
                                    <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-100/28 bg-black/34 p-5 text-center">
                                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-lg font-black text-slate-950 shadow-[0_0_24px_rgba(103,232,249,.45)]">AI</span>
                                        <p className={`mt-4 text-lg font-black text-white ${headingLift}`}>{visualState === 'offline' ? 'AI image proxy is not connected here.' : 'Your generated visual will appear here.'}</p>
                                        <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">{visualState === 'idle' ? 'Use a clear idea and audience first.' : visualMessage}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MiniAppShell>
    );
};

const PromptArchitectMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [subject, setSubject] = useState('a mystical forest glowing at twilight');
    const [style, setStyle] = useState('Digital Painting');
    const [lighting, setLighting] = useState('Cinematic Lighting');
    const [ratio, setRatio] = useState('16:9');

    return (
        <MiniAppShell title="Advanced Prompt Architect" onComplete={onComplete} completeLabel="Prompt architected">
            <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
                <div className="grid gap-3">
                    <input value={subject} onChange={(event) => setSubject(event.target.value)} className="rounded-2xl border border-cyan-100/18 bg-black/45 p-3 text-sm font-semibold text-white outline-none focus:border-cyan-200/50" />
                    <select value={style} onChange={(event) => setStyle(event.target.value)} className="rounded-2xl border border-cyan-100/18 bg-slate-950 p-3 text-sm font-semibold text-white">
                        {['Photorealistic', 'Digital Painting', 'Anime/Manga Style', 'Concept Art', 'Pixel Art', '3D Render', 'Sci-Fi Art'].map((option) => <option key={option}>{option}</option>)}
                    </select>
                    <select value={lighting} onChange={(event) => setLighting(event.target.value)} className="rounded-2xl border border-cyan-100/18 bg-slate-950 p-3 text-sm font-semibold text-white">
                        {['Cinematic Lighting', 'Soft Studio Light', 'Golden Hour', 'Rim Lighting', 'Bioluminescent Glow'].map((option) => <option key={option}>{option}</option>)}
                    </select>
                    <select value={ratio} onChange={(event) => setRatio(event.target.value)} className="rounded-2xl border border-cyan-100/18 bg-slate-950 p-3 text-sm font-semibold text-white">
                        {['1:1', '16:9', '9:16', '4:3', '3:2'].map((option) => <option key={option}>{option}</option>)}
                    </select>
                </div>
                <div className={`rounded-2xl border p-4 ${missionPanelSoft}`}>
                    <p className={`text-xs font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Refined prompt</p>
                    <p className="mt-3 text-sm font-semibold leading-7 text-white">Create {subject}, in a {style.toLowerCase()} style, using {lighting.toLowerCase()}, strong composition, rich details, clean focal point, and {ratio} aspect ratio. Avoid confusing clutter or unsafe content.</p>
                </div>
            </div>
        </MiniAppShell>
    );
};

const PioneerStudioMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [complexity, setComplexity] = useState(6);
    const [sharpness, setSharpness] = useState(8);
    const [adherence, setAdherence] = useState(7);

    return (
        <MiniAppShell title="Pioneer Studio Brief" onComplete={onComplete} completeLabel="Studio brief saved">
            <div className="grid gap-4 lg:grid-cols-3">
                {[
                    ['Complexity', complexity, setComplexity],
                    ['Image Sharpness', sharpness, setSharpness],
                    ['Prompt Adherence', adherence, setAdherence],
                ].map(([label, value, setter]) => (
                    <label key={String(label)} className="rounded-2xl border border-cyan-100/16 bg-slate-950/68 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.07)]">
                        <span className="flex items-center justify-between text-xs font-black uppercase tracking-[0.18em] text-slate-100">
                            {String(label)}
                            <span className="text-cyan-100">{String(value)}/10</span>
                        </span>
                        <input type="range" min={1} max={10} value={Number(value)} onChange={(event) => (setter as React.Dispatch<React.SetStateAction<number>>)(Number(event.target.value))} className="mt-4 w-full accent-cyan-200" />
                    </label>
                ))}
            </div>
            <div className="mt-4 rounded-2xl border border-white/14 bg-black/36 p-4 text-sm font-semibold leading-7 text-slate-100">
                Studio setting: balanced creativity, high clarity, and close prompt-following. This is a good setup for a polished showcase image.
            </div>
        </MiniAppShell>
    );
};

const ChatbotAnatomyMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const parts = [
        ['Tokenizer', 'Splits input into smaller pieces the model can process.'],
        ['Formatter', 'Packages the user request for the AI server.'],
        ['Network', 'Sends and receives data securely.'],
        ['Stream Processor', 'Handles chunks of the answer as they arrive.'],
        ['Renderer', 'Shows text, images, controls, and feedback on screen.'],
    ];

    return (
        <MiniAppShell title="Chatbot Anatomy Map" onComplete={onComplete} completeLabel="Pipeline mapped">
            <div className="grid gap-3 md:grid-cols-5">
                {parts.map(([part, description], index) => (
                    <button key={part} type="button" onClick={onComplete} className="rounded-2xl border border-cyan-100/16 bg-slate-950/68 p-4 text-left shadow-[0_14px_34px_rgba(0,0,0,.22)] transition hover:-translate-y-0.5 hover:bg-slate-900/80">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>Part {index + 1}</span>
                        <p className={`mt-2 font-black text-white ${textLift}`}>{part}</p>
                        <p className="mt-2 text-xs font-semibold leading-5 text-slate-200">{description}</p>
                    </button>
                ))}
            </div>
        </MiniAppShell>
    );
};

const DeepfakeCheckMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [answer, setAnswer] = useState('');
    const safe = answer === 'verify';

    return (
        <MiniAppShell title="Deepfake Trust Check" onComplete={onComplete} completeLabel="Trust rule saved">
            <div className={`rounded-2xl border p-4 ${missionPanelSoft}`}>
                <p className="text-sm font-semibold leading-7 text-slate-100">A video online shows a famous person saying something shocking. The post has no source link and asks everyone to share fast. What should you do first?</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {[
                        ['share', 'Share it quickly'],
                        ['verify', 'Verify the source'],
                        ['edit', 'Make a fun remix'],
                    ].map(([value, label]) => (
                        <button key={value} type="button" onClick={() => { setAnswer(value); if (value === 'verify') onComplete(); }} className={`rounded-xl border px-4 py-3 text-sm font-black shadow-[0_10px_24px_rgba(0,0,0,.18)] transition ${answer === value ? 'border-cyan-100/40 bg-cyan-200/[0.16] text-white' : 'border-white/14 bg-black/36 text-slate-100 hover:bg-white/[0.1]'}`}>
                            {label}
                        </button>
                    ))}
                </div>
                {answer && <p className={`mt-4 text-sm font-bold ${safe ? 'text-emerald-100' : 'text-amber-100'}`}>{safe ? 'Correct. Slow down, verify, then decide.' : 'Try again. Fast sharing can spread misinformation.'}</p>}
            </div>
        </MiniAppShell>
    );
};

// ────────────────────────────────────────────────────────────────────
// Pioneer Pass mini-apps (deterministic, no AI calls)
// ────────────────────────────────────────────────────────────────────

const PredictionEngineMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const seeds: Array<{ id: string; starter: string; next: Array<{ token: string; p: number }> }> = [
        { id: 'mars', starter: 'The first city on Mars will need…', next: [
            { token: 'oxygen', p: 0.42 }, { token: 'water', p: 0.27 }, { token: 'shelter', p: 0.18 }, { token: 'people', p: 0.13 },
        ]},
        { id: 'ai', starter: 'A good AI tutor should always…', next: [
            { token: 'listen', p: 0.36 }, { token: 'explain', p: 0.31 }, { token: 'check', p: 0.21 }, { token: 'guess', p: 0.12 },
        ]},
        { id: 'storm', starter: 'Before the storm arrived, the…', next: [
            { token: 'sky', p: 0.45 }, { token: 'birds', p: 0.24 }, { token: 'wind', p: 0.20 }, { token: 'kids', p: 0.11 },
        ]},
    ];
    const [seed, setSeed] = useState(seeds[0]);
    const [picked, setPicked] = useState<string | null>(null);
    return (
        <MiniAppShell title="Prediction Engine · Demo" onComplete={onComplete} completeLabel="I can explain prediction">
            <p className="text-sm font-semibold leading-6 text-slate-100">LLMs do not "think." They predict the next likely token from patterns. Pick a starter and see the model's top guesses, with confidence.</p>
            <div className="mt-3 flex flex-wrap gap-2">
                {seeds.map(s => (
                    <button key={s.id} type="button" onClick={() => { setSeed(s); setPicked(null); }} className={`rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] ${seed.id === s.id ? 'bg-cyan-100 text-slate-950' : 'border border-white/15 bg-white/[0.06] text-slate-100 hover:bg-white/[0.12]'}`}>{s.id}</button>
                ))}
            </div>
            <div className="pioneer-pass pioneer-glint mt-4 p-4">
                <p className="font-mono text-sm text-cyan-100">{seed.starter} <span className="text-white/40">▍</span></p>
                <div className="pioneer-thread my-3" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/80">Top next-token candidates</p>
                <div className="mt-2 space-y-2">
                    {seed.next.map(({ token, p }) => (
                        <button key={token} type="button" onClick={() => setPicked(token)} className={`group flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${picked === token ? 'border-cyan-200/60 bg-cyan-300/[0.15]' : 'border-white/10 bg-black/30 hover:bg-white/[0.06]'}`}>
                            <span className="w-20 font-mono text-sm font-black text-white">{token}</span>
                            <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                                <span className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${p * 100}%` }} />
                            </span>
                            <span className="w-14 text-right font-mono text-xs font-bold text-cyan-100">{Math.round(p * 100)}%</span>
                        </button>
                    ))}
                </div>
                {picked && <p className="mt-3 text-xs font-semibold text-emerald-100">You picked <span className="font-mono text-white">{picked}</span>. Run the same prompt twice in a real chat — different sampling can flip the order. That is why "the same AI" can give different answers.</p>}
            </div>
        </MiniAppShell>
    );
};

const TokenBudgetMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const CONTEXT_BUDGET = 4096; // demo budget
    const [text, setText] = useState('Write a 200-word story about a kid in Johannesburg who builds an AI that protects local water sources.');
    // ~4 chars per token rough heuristic
    const tokenCount = Math.max(1, Math.ceil(text.trim().length / 4));
    const chunks: string[] = [];
    const words = text.split(/\s+/).filter(Boolean);
    for (let i = 0; i < words.length; i++) {
        const w = words[i];
        // split long words into ~4-char "subword" tokens
        for (let j = 0; j < w.length; j += 4) chunks.push(w.slice(j, j + 4));
    }
    const pct = Math.min(100, (tokenCount / CONTEXT_BUDGET) * 100);
    const palette = ['bg-cyan-300/70', 'bg-emerald-300/70', 'bg-violet-300/70', 'bg-rose-300/70', 'bg-amber-300/70'];
    return (
        <MiniAppShell title="Token Budget Visualizer · Demo" onComplete={onComplete} completeLabel="I understand tokens">
            <p className="text-sm font-semibold leading-6 text-slate-100">Models read text as <em>tokens</em>, not letters. Every model has a <em>context window</em> — a budget. Paste text and watch the meter fill.</p>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="mt-3 w-full rounded-xl border border-white/12 bg-black/50 p-3 font-mono text-xs text-cyan-50 focus:border-cyan-300/60 focus:outline-none" />
            <div className="pioneer-pass mt-3 p-4">
                <div className="flex items-center justify-between">
                    <span className="pioneer-pill pioneer-pill-demo">{tokenCount} tokens</span>
                    <span className="font-mono text-xs text-cyan-100">{pct.toFixed(1)}% of {CONTEXT_BUDGET}-token demo window</span>
                </div>
                <div className="mt-3 h-3 w-full overflow-hidden rounded-full border border-white/10 bg-black/60">
                    <div className="h-full bg-gradient-to-r from-cyan-400 via-emerald-300 to-amber-300" style={{ width: `${pct}%` }} />
                </div>
                <div className="pioneer-thread my-3" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/80">Token chunks (first 80)</p>
                <div className="mt-2 flex flex-wrap gap-1">
                    {chunks.slice(0, 80).map((c, i) => (
                        <span key={i} className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] text-slate-900 ${palette[i % palette.length]}`}>{c}</span>
                    ))}
                </div>
                <p className="mt-3 text-xs font-semibold text-emerald-100">Rule of thumb: ≈ 1 token per 4 English characters. Longer chat history = more tokens = more cost and slower replies.</p>
            </div>
        </MiniAppShell>
    );
};

const PersonaAgentMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [role, setRole] = useState('a calm coding mentor');
    const [audience, setAudience] = useState('a beginner aged 13');
    const [tone, setTone] = useState<'kind' | 'direct' | 'playful'>('kind');
    const [limit, setLimit] = useState('Never invent libraries that do not exist.');
    const [goal, setGoal] = useState('Help me debug Python without doing the work for me.');
    const prompt = `You are ${role}.\nYour audience: ${audience}.\nTone: ${tone}.\nHard limit: ${limit}\nGoal: ${goal}\nAlways ask one clarifying question before giving a long answer.`;
    const [copied, setCopied] = useState(false);
    return (
        <MiniAppShell title="Persona Agent Builder · Demo" onComplete={onComplete} completeLabel="Save system prompt">
            <p className="text-sm font-semibold leading-6 text-slate-100">Design an AI agent identity. Strong personas + clear limits = predictable behavior.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {([
                    ['Role', role, setRole],
                    ['Audience', audience, setAudience],
                    ['Hard limit', limit, setLimit],
                    ['Goal', goal, setGoal],
                ] as const).map(([label, val, set]) => (
                    <label key={label} className="block">
                        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/80">{label}</span>
                        <input value={val} onChange={(e) => set(e.target.value)} className="mt-1 w-full rounded-lg border border-white/12 bg-black/45 px-3 py-2 text-sm text-white focus:border-cyan-300/60 focus:outline-none" />
                    </label>
                ))}
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/80">Tone</span>
                    <div className="mt-1 flex gap-2">
                        {(['kind', 'direct', 'playful'] as const).map(t => (
                            <button key={t} type="button" onClick={() => setTone(t)} className={`rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] ${tone === t ? 'bg-cyan-100 text-slate-950' : 'border border-white/15 bg-white/[0.06] text-slate-100 hover:bg-white/[0.12]'}`}>{t}</button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="pioneer-pass pioneer-glint mt-4 p-4">
                <div className="flex items-center justify-between">
                    <span className="pioneer-pill pioneer-pill-artifact">System prompt draft</span>
                    <button type="button" onClick={() => { navigator.clipboard?.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="rounded-full border border-cyan-200/40 bg-cyan-200/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-cyan-100 hover:bg-cyan-200/20">{copied ? 'Copied' : 'Copy'}</button>
                </div>
                <pre className="mt-3 whitespace-pre-wrap font-mono text-xs leading-6 text-emerald-100">{prompt}</pre>
            </div>
        </MiniAppShell>
    );
};

const ModelFitRouterMiniApp: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    type Task = { id: string; label: string; modality: string; pick: string; why: string };
    const tasks: Task[] = [
        { id: 'essay', label: 'Help me edit a 500-word essay', modality: 'text', pick: 'GPT-4o / Claude Sonnet', why: 'Strong long-form editing, follows tone, cheap per essay.' },
        { id: 'mockup', label: 'Generate a product mockup', modality: 'image', pick: 'Flux / Imagen / SDXL', why: 'Image models render scenes; pick Flux for photoreal, SDXL for control.' },
        { id: 'transcribe', label: 'Transcribe a 30-min interview', modality: 'audio', pick: 'Whisper-large', why: 'Best free, accurate transcription; no voice cloning needed.' },
        { id: 'unit', label: 'Write Python unit tests', modality: 'code', pick: 'Claude Code / GPT-Codex', why: 'Strong at structured code + tests; cheap models miss edge cases.' },
        { id: 'clip', label: 'Make a 4-second product clip', modality: 'video', pick: 'Veo / Runway / Kling', why: 'Short clips, consistent subject; expect a few retries.' },
        { id: 'tutor', label: 'Tutor a 12-year-old on fractions', modality: 'text', pick: 'GPT-4o-mini / Gemini Flash', why: 'Fast, cheap, very capable for K–12 explanations.' },
    ];
    const [picked, setPicked] = useState<Task | null>(null);
    return (
        <MiniAppShell title="Model Fit Router · Demo" onComplete={onComplete} completeLabel="I can route a task">
            <p className="text-sm font-semibold leading-6 text-slate-100">Pick the job. The router shows the modality and a model family that usually fits — and one reason why.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {tasks.map(t => (
                    <button key={t.id} type="button" onClick={() => setPicked(t)} className={`rounded-xl border p-3 text-left transition ${picked?.id === t.id ? 'border-cyan-200/60 bg-cyan-300/[0.12]' : 'border-white/12 bg-black/35 hover:bg-white/[0.06]'}`}>
                        <span className="block text-sm font-black text-white">{t.label}</span>
                        <span className="mt-1 inline-block rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-200">{t.modality}</span>
                    </button>
                ))}
            </div>
            {picked && (
                <div className="pioneer-pass pioneer-glint mt-4 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/80">Routed to</p>
                            <p className="mt-1 font-mono text-lg font-black text-white">{picked.pick}</p>
                        </div>
                        <span className="pioneer-pill pioneer-pill-ready">{picked.modality}</span>
                    </div>
                    <div className="pioneer-thread my-3" />
                    <p className="text-sm font-semibold leading-6 text-emerald-100"><span className="text-cyan-100">Why:</span> {picked.why}</p>
                    <p className="mt-2 text-[11px] font-semibold text-slate-300">Always run your own comparison in the Arena before committing. These are starting points, not the only right answer.</p>
                </div>
            )}
        </MiniAppShell>
    );
};

type HighlightTone = 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet';

const highlightLexicon: Array<{ term: string; tone: HighlightTone }> = ([
    { term: 'artificial intelligence', tone: 'cyan' },
    { term: 'machine learning', tone: 'emerald' },
    { term: 'neural network', tone: 'violet' },
    { term: 'computer vision', tone: 'amber' },
    { term: 'generative media', tone: 'rose' },
    { term: 'generative AI', tone: 'rose' },
    { term: 'multimodal AI', tone: 'violet' },
    { term: 'human goals', tone: 'emerald' },
    { term: 'human judgment', tone: 'emerald' },
    { term: 'judgment', tone: 'emerald' },
    { term: 'safety checks', tone: 'amber' },
    { term: 'confidence score', tone: 'amber' },
    { term: 'responsible evaluation', tone: 'amber' },
    { term: 'synthetic media', tone: 'rose' },
    { term: 'safety check', tone: 'amber' },
    { term: 'AI proxy', tone: 'emerald' },
    { term: 'Cloudflare', tone: 'cyan' },
    { term: 'AI literacy', tone: 'cyan' },
    { term: 'human check', tone: 'emerald' },
    { term: 'analogy', tone: 'violet' },
    { term: 'example', tone: 'emerald' },
    { term: 'review', tone: 'amber' },
    { term: 'input', tone: 'cyan' },
    { term: 'model', tone: 'violet' },
    { term: 'pixels', tone: 'cyan' },
    { term: 'edges', tone: 'cyan' },
    { term: 'shapes', tone: 'violet' },
    { term: 'layers', tone: 'violet' },
    { term: 'noise', tone: 'amber' },
    { term: 'confidence', tone: 'amber' },
    { term: 'strong prompt', tone: 'cyan' },
    { term: 'weak prompt', tone: 'amber' },
    { term: 'image prompt', tone: 'rose' },
    { term: 'prompt', tone: 'cyan' },
    { term: 'task', tone: 'violet' },
    { term: 'context', tone: 'violet' },
    { term: 'details', tone: 'violet' },
    { term: 'constraints', tone: 'amber' },
    { term: 'output', tone: 'rose' },
    { term: 'patterns', tone: 'cyan' },
    { term: 'instructions', tone: 'cyan' },
    { term: 'data', tone: 'violet' },
    { term: 'tool access', tone: 'emerald' },
    { term: 'evidence', tone: 'emerald' },
    { term: 'mission', tone: 'rose' },
    { term: 'source', tone: 'cyan' },
    { term: 'deepfake', tone: 'rose' },
    { term: 'text', tone: 'cyan' },
    { term: 'image', tone: 'rose' },
    { term: 'audio', tone: 'violet' },
    { term: 'video', tone: 'rose' },
    { term: 'code', tone: 'emerald' },
    { term: 'simulation', tone: 'violet' },
    { term: 'ZEN-X', tone: 'violet' },
    { term: 'AI', tone: 'cyan' },
] as Array<{ term: string; tone: HighlightTone }>).sort((a, b) => b.term.length - a.term.length);

const highlightToneClass: Record<HighlightTone, string> = {
    cyan: 'border-cyan-100/35 bg-cyan-300/[0.17] text-cyan-50 decoration-cyan-200/90 shadow-cyan-950/30',
    emerald: 'border-emerald-100/35 bg-emerald-300/[0.16] text-emerald-50 decoration-emerald-200/90 shadow-emerald-950/30',
    amber: 'border-amber-100/35 bg-amber-300/[0.16] text-amber-50 decoration-amber-200/90 shadow-amber-950/30',
    rose: 'border-rose-100/35 bg-rose-300/[0.16] text-rose-50 decoration-rose-200/90 shadow-rose-950/30',
    violet: 'border-violet-100/35 bg-violet-300/[0.16] text-violet-50 decoration-violet-200/90 shadow-violet-950/30',
};

const isWordCharacter = (character?: string) => Boolean(character && /[a-z0-9]/i.test(character));

const matchesBoundary = (source: string, start: number, length: number) => (
    !isWordCharacter(source[start - 1]) && !isWordCharacter(source[start + length])
);

const renderHighlightedText = (value: string) => {
    const source = repaired(value);
    const lower = source.toLowerCase();
    const nodes: React.ReactNode[] = [];
    let buffer = '';
    let index = 0;

    const flushBuffer = () => {
        if (buffer) {
            nodes.push(buffer);
            buffer = '';
        }
    };

    while (index < source.length) {
        const match = highlightLexicon.find((entry) => {
            const term = entry.term.toLowerCase();
            return lower.startsWith(term, index) && matchesBoundary(source, index, term.length);
        });

        if (match) {
            flushBuffer();
            const text = source.slice(index, index + match.term.length);
            nodes.push(
                <span
                    key={`${match.term}-${index}`}
                    className={`mx-0.5 inline rounded-md border px-1.5 py-0.5 font-black underline decoration-2 underline-offset-4 shadow-[0_8px_20px_var(--tw-shadow-color)] ${highlightToneClass[match.tone]}`}
                >
                    {text}
                </span>
            );
            index += match.term.length;
        } else {
            buffer += source[index];
            index += 1;
        }
    }

    flushBuffer();
    return nodes;
};

const conceptDeckBySection: Record<string, {
    title: string;
    subtitle: string;
    equation: string[];
    nodes: Array<{ label: string; detail: string; tone: HighlightTone }>;
}> = {
    'm1-s1': {
        title: 'AI is a signal chain, not magic.',
        subtitle: 'See the system: instruction in, model behavior, output out, human check before use.',
        equation: ['Prompt', 'Model', 'Output', 'Human judgment'],
        nodes: [
            { label: 'Prompt', detail: 'The instruction that tells the tool what job to do.', tone: 'cyan' },
            { label: 'Patterns', detail: 'The model uses learned patterns, not human feelings.', tone: 'violet' },
            { label: 'Output', detail: 'The result can be text, image, code, plan, or decision support.', tone: 'rose' },
            { label: 'Control', detail: 'The human checks accuracy, safety, fairness, and usefulness.', tone: 'emerald' },
        ],
    },
    'm1-s2': {
        title: 'Creation needs a quality loop.',
        subtitle: 'A good image, chatbot, or media project improves through prompt design, review, and responsible checks.',
        equation: ['Describe', 'Generate', 'Inspect', 'Improve'],
        nodes: [
            { label: 'Describe', detail: 'Name the subject, style, audience, and goal.', tone: 'cyan' },
            { label: 'Generate', detail: 'Use a tool to create the first version.', tone: 'rose' },
            { label: 'Inspect', detail: 'Check what is accurate, confusing, risky, or missing.', tone: 'amber' },
            { label: 'Improve', detail: 'Revise the prompt, evidence, and final output.', tone: 'emerald' },
        ],
    },
};

const defaultConceptDeck = {
    title: 'Every section has a build loop.',
    subtitle: 'Learn the idea, explore the tool, build evidence, then explain what changed.',
    equation: ['Learn', 'Explore', 'Build', 'Reflect'],
    nodes: [
        { label: 'Learn', detail: 'Understand the concept in plain language.', tone: 'cyan' as HighlightTone },
        { label: 'Explore', detail: 'Try the app, tool, demo, or simulation.', tone: 'violet' as HighlightTone },
        { label: 'Build', detail: 'Make a small artifact that proves progress.', tone: 'emerald' as HighlightTone },
        { label: 'Reflect', detail: 'Explain what worked, what failed, and what to check next.', tone: 'amber' as HighlightTone },
    ],
};

const toneDotClass: Record<HighlightTone, string> = {
    cyan: 'from-cyan-200 to-sky-300 shadow-cyan-300/50',
    emerald: 'from-emerald-200 to-teal-300 shadow-emerald-300/50',
    amber: 'from-amber-200 to-orange-300 shadow-amber-300/50',
    rose: 'from-rose-200 to-red-300 shadow-rose-300/50',
    violet: 'from-violet-200 to-blue-300 shadow-violet-300/50',
};

const LearningConceptVisualizer: React.FC<{ sectionId: string }> = ({ sectionId }) => {
    const deck = conceptDeckBySection[sectionId] ?? defaultConceptDeck;

    return (
        <div className="relative overflow-hidden rounded-[1.6rem] border border-cyan-100/24 bg-[radial-gradient(circle_at_18%_12%,rgba(103,232,249,.18),transparent_34%),radial-gradient(circle_at_86%_18%,rgba(248,113,113,.14),transparent_32%),linear-gradient(145deg,rgba(2,6,23,.92),rgba(8,47,73,.78),rgba(15,23,42,.9))] p-5 shadow-[0_24px_70px_rgba(0,0,0,.42),inset_0_1px_0_rgba(255,255,255,.09)]">
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.055)] [--grid-size:26px]" />
            <div className="relative z-10 grid gap-5 xl:grid-cols-[0.85fr_1.15fr] xl:items-center">
                <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.28em] text-cyan-50 ${textLift}`}>Visual model</p>
                    <h4 className={`mt-3 text-2xl font-black tracking-tight text-white ${headingLift}`}>{deck.title}</h4>
                    <p className="mt-3 text-sm font-semibold leading-7 text-slate-100">{deck.subtitle}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        {deck.equation.map((item, index) => (
                            <React.Fragment key={item}>
                                <span className="rounded-full border border-white/18 bg-black/38 px-3 py-2 text-xs font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                                    {item}
                                </span>
                                {index < deck.equation.length - 1 && (
                                    <span className="h-px w-8 bg-gradient-to-r from-cyan-200 via-white to-rose-200 shadow-[0_0_16px_rgba(103,232,249,.7)]" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {deck.nodes.map((node, index) => (
                        <div key={node.label} className="group relative overflow-hidden rounded-[1.25rem] border border-white/14 bg-black/38 p-4 shadow-[0_16px_42px_rgba(0,0,0,.26),inset_0_1px_0_rgba(255,255,255,.07)] transition hover:-translate-y-1 hover:border-cyan-100/32">
                            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${toneDotClass[node.tone]}`} />
                            <div className="relative z-10 flex items-start gap-3">
                                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${toneDotClass[node.tone]} text-sm font-black text-slate-950 shadow-[0_0_24px_var(--tw-shadow-color)]`}>
                                    {index + 1}
                                </span>
                                <div>
                                    <h5 className={`font-black text-white ${textLift}`}>{node.label}</h5>
                                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{renderHighlightedText(node.detail)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

type SectionCockpitDeck = {
    kicker: string;
    headline: string;
    promise: string;
    mission: string;
    nodes: Array<{ label: string; detail: string; tone: HighlightTone; metric: string }>;
    checks: string[];
};

const sectionCockpitDecks: Record<string, SectionCockpitDeck> = {
    'm1-s1': {
        kicker: 'Foundation cockpit',
        headline: 'Learn the AI system before you drive the tools.',
        promise: 'You will move from mystery to control: what AI is, how models behave, how vision sees, and why prompts change everything.',
        mission: 'Understand the loop, control the prompt, explain the result.',
        nodes: [
            { label: 'AI Loop', detail: 'Input becomes model behavior, then output, then human check.', tone: 'cyan', metric: '4 stages' },
            { label: 'Model Behavior', detail: 'Data quality, noise, context, and review change reliability.', tone: 'emerald', metric: 'Live scores' },
            { label: 'Vision', detail: 'Pixels, edges, shapes, labels, confidence, then review.', tone: 'amber', metric: 'Pattern scan' },
            { label: 'Prompt Control', detail: 'Better instructions give the tool a clearer job.', tone: 'violet', metric: 'Power meter' },
        ],
        checks: ['Can I explain what AI actually does?', 'Can I improve a weak prompt?', 'Can I say what a human must check?'],
    },
    'm1-s2': {
        kicker: 'Creative systems cockpit',
        headline: 'Make media with control, not guesswork.',
        promise: 'You will design stronger image prompts, understand generation loops, map chatbot systems, and slow down around synthetic media.',
        mission: 'Describe, generate, inspect, improve, and save evidence.',
        nodes: [
            { label: 'Prompt Recipe', detail: 'Subject, setting, style, camera, lighting, safety.', tone: 'cyan', metric: '6 inputs' },
            { label: 'Diffusion', detail: 'Noise becomes structure, then details, then review.', tone: 'rose', metric: '4 stages' },
            { label: 'Quality Lens', detail: 'Clarity, style, safety, and evidence improve media quality.', tone: 'emerald', metric: 'Risk score' },
            { label: 'Trust Check', detail: 'Source, intent, clues, and risk before sharing.', tone: 'amber', metric: 'Safety rule' },
        ],
        checks: ['Can I design a stronger image prompt?', 'Can I explain a chatbot pipeline?', 'Can I spot synthetic media risk?'],
    },
};

const defaultCockpitDeck: SectionCockpitDeck = {
    kicker: 'Section cockpit',
    headline: 'Learn by building evidence.',
    promise: 'Each section gives you a short concept, a tool to try, and a checkpoint that proves what you learned.',
    mission: 'Learn, explore, build, reflect, complete.',
    nodes: [
        { label: 'Learn', detail: 'Understand the idea in plain language.', tone: 'cyan', metric: 'Core idea' },
        { label: 'Explore', detail: 'Use the app or simulation.', tone: 'violet', metric: 'Tool' },
        { label: 'Build', detail: 'Create one proof artifact.', tone: 'emerald', metric: 'Evidence' },
        { label: 'Reflect', detail: 'Explain what changed.', tone: 'amber', metric: 'Checkpoint' },
    ],
    checks: ['What changed?', 'What did I build?', 'What should I check next?'],
};

const SectionLearningCockpit: React.FC<{
    sectionId: string;
    title: string;
    summary: string;
    toolCount: number;
    labCount: number;
    exploredCount: number;
    completedLabCount: number;
    theme: ModuleTheme;
}> = ({ sectionId, title, summary, toolCount, labCount, exploredCount, completedLabCount, theme }) => {
    const deck = sectionCockpitDecks[sectionId] ?? defaultCockpitDeck;
    const [activeNode, setActiveNode] = useState(0);
    const active = deck.nodes[activeNode] ?? deck.nodes[0];
    const toolPercent = toolCount ? Math.round((exploredCount / toolCount) * 100) : 0;
    const labPercent = labCount ? Math.round((completedLabCount / labCount) * 100) : 0;

    return (
        <section className={`relative overflow-hidden rounded-[2rem] border border-cyan-100/24 bg-[linear-gradient(135deg,rgba(2,6,23,.98),rgba(8,23,43,.94)_42%,rgba(8,47,73,.82))] p-5 shadow-[0_36px_110px_rgba(0,0,0,.66),inset_0_1px_0_rgba(255,255,255,.1)] sm:p-6 ${electricFrame}`}>
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.052)] [--grid-size:28px]" />
            <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.accent}`} />

            <div className="relative z-10 grid gap-5 2xl:grid-cols-[0.72fr_1.28fr]">
                <div className="grid gap-4">
                    <div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-cyan-50 ${textLift}`}>{deck.kicker}</p>
                        <h3 className={`mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl ${headingLift}`}>{deck.headline}</h3>
                        <p className="mt-4 text-sm font-semibold leading-7 text-slate-100">{renderHighlightedText(deck.promise)}</p>
                    </div>

                    <div className="rounded-[1.35rem] border border-cyan-100/18 bg-black/38 p-4">
                        <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Current section</p>
                        <h4 className={`mt-2 text-xl font-black text-white ${headingLift}`}>{title}</h4>
                        <p className="mt-2 text-sm font-semibold leading-7 text-slate-200">{renderHighlightedText(summary)}</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {[
                            ['Tools explored', `${exploredCount}/${toolCount}`, toolPercent, 'cyan' as HighlightTone],
                            ['Labs complete', `${completedLabCount}/${labCount}`, labPercent, 'emerald' as HighlightTone],
                        ].map(([label, value, percent, tone]) => (
                            <div key={String(label)} className="rounded-[1.25rem] border border-white/14 bg-slate-950/70 p-4">
                                <p className={`text-[10px] font-black uppercase tracking-[0.18em] text-cyan-50 ${textLift}`}>{String(label)}</p>
                                <p className={`mt-2 text-3xl font-black text-white ${headingLift}`}>{String(value)}</p>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                                    <div className={`h-full rounded-full bg-gradient-to-r ${toneDotClass[tone as HighlightTone]}`} style={{ width: `${Number(percent)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4">
                    <div className={`relative overflow-hidden rounded-[1.55rem] border p-5 ${missionPanelSoft}`}>
                        <div className="grid gap-4 xl:grid-cols-[1fr_.8fr]">
                            <div>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Mission map</p>
                                    <span className={`rounded-full bg-gradient-to-r ${theme.active} px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-950`}>{deck.mission}</span>
                                </div>
                                <div className="mt-4 grid gap-3 md:grid-cols-4">
                                    {deck.nodes.map((node, index) => (
                                        <button
                                            key={node.label}
                                            type="button"
                                            onClick={() => setActiveNode(index)}
                                            className={`group relative min-h-36 overflow-hidden rounded-[1.25rem] border p-4 text-left transition hover:-translate-y-1 ${activeNode === index ? 'border-cyan-100/44 bg-cyan-300/[0.15]' : 'border-white/14 bg-black/34 hover:bg-white/[0.08]'}`}
                                        >
                                            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${toneDotClass[node.tone]}`} />
                                            <span className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${toneDotClass[node.tone]} text-xs font-black text-slate-950 shadow-[0_0_24px_var(--tw-shadow-color)]`}>
                                                {index + 1}
                                            </span>
                                            <p className={`mt-3 text-base font-black text-white ${textLift}`}>{node.label}</p>
                                            <p className="mt-2 text-xs font-semibold leading-5 text-slate-200">{node.metric}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[1.25rem] border border-white/14 bg-black/42 p-4">
                                <p className={`text-[10px] font-black uppercase tracking-[0.22em] text-cyan-50 ${textLift}`}>Selected concept</p>
                                <h4 className={`mt-3 text-2xl font-black text-white ${headingLift}`}>{active.label}</h4>
                                <p className="mt-3 text-sm font-semibold leading-7 text-slate-100">{renderHighlightedText(active.detail)}</p>
                                <div className="mt-4 rounded-2xl border border-emerald-100/22 bg-emerald-300/[0.10] p-4">
                                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 ${textLift}`}>Proof question</p>
                                    <p className="mt-2 text-sm font-semibold leading-6 text-emerald-50">{deck.checks[activeNode % deck.checks.length]}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        {deck.checks.map((check, index) => (
                            <div key={check} className="rounded-[1.2rem] border border-white/14 bg-black/34 p-4">
                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 text-xs font-black text-slate-950">{index + 1}</span>
                                <p className="mt-3 text-sm font-semibold leading-6 text-slate-100">{renderHighlightedText(check)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

type ConceptMissionPodConfig = {
    id: string;
    title: string;
    subtitle: string;
    plainLanguage: string;
    whyItMatters: string;
    resourceTitles: string[];
    keywords: Array<{ term: string; definition: string; tone: HighlightTone }>;
    steps: string[];
};

type ConceptMissionPod = Omit<ConceptMissionPodConfig, 'resourceTitles'> & {
    resources: ProgramResourceContentItem[];
};

const conceptMissionPodConfigs: Record<string, ConceptMissionPodConfig[]> = {
    'm1-s1': [
        {
            id: 'ai-is-a-system',
            title: 'What AI Actually Does',
            subtitle: 'Turn the mystery into a system you can see.',
            plainLanguage: 'AI is software that uses patterns and instructions to make an output. It can be impressive, but it still needs human judgment before anyone trusts or shares the result.',
            whyItMatters: 'By the end of this mission, you should know that AI is not magic and not a human mind. It is a powerful tool that needs a clear job and a smart human checker.',
            resourceTitles: ['AI Signal Loop', 'AI or Not AI? Checkpoint', 'AI Coach Console', 'AI Vocabulary Quest', 'Neural Network Lab', 'Computer Vision Scanner', 'Model Behavior Mixer'],
            keywords: [
                { term: 'AI', definition: 'Software that can recognize patterns, follow instructions, and generate useful outputs.', tone: 'cyan' },
                { term: 'Pattern', definition: 'A repeated signal the system has learned from data.', tone: 'violet' },
                { term: 'Output', definition: 'The answer, image, plan, code, or result the tool gives back.', tone: 'rose' },
                { term: 'Judgment', definition: 'The human decision about whether the output is accurate, safe, and useful.', tone: 'emerald' },
            ],
            steps: ['Watch the AI pipeline.', 'Compare two model outputs.', 'Explain why a human still has to check the result.'],
        },
        {
            id: 'prompt-is-steering',
            title: 'Prompt Power',
            subtitle: 'A prompt is the steering wheel for the AI tool.',
            plainLanguage: 'A prompt is the instruction you give an AI system. A weak prompt is vague. A strong prompt gives the task, context, details, constraints, and the output format.',
            whyItMatters: 'This is the fastest way for beginners to feel the difference between random AI use and skilled AI use.',
            resourceTitles: ['Prompt Formula Builder', 'Prompt Enhancer Studio', 'Prompt Power Meter', 'Starter Prompt Library', 'Prompt Remix Lab'],
            keywords: [
                { term: 'Prompt', definition: 'The instruction you give the AI.', tone: 'cyan' },
                { term: 'Task', definition: 'What you want the AI to do.', tone: 'violet' },
                { term: 'Context', definition: 'Helpful background, audience, purpose, or situation.', tone: 'violet' },
                { term: 'Constraints', definition: 'Rules, limits, safety boundaries, or format requirements.', tone: 'amber' },
            ],
            steps: ['Write a rough idea.', 'Upgrade it with task, context, details, and constraints.', 'Save the version you would actually use.'],
        },
        {
            id: 'control-and-purpose',
            title: 'Control, Access, and Purpose',
            subtitle: 'Tools become powerful when you control settings, protect keys, and choose a mission.',
            plainLanguage: 'AI apps are not just chat boxes. They have controls, settings, secure access, and real-world goals. A good Pioneer knows what the controls do and why the project matters.',
            whyItMatters: 'This connects the exciting interface layer to responsibility: protect access, use controls carefully, and build for a purpose.',
            resourceTitles: ['Particle Control Lab', 'API Key Orb', 'Mission Badge Selector'],
            keywords: [
                { term: 'Control', definition: 'A setting that changes what the system does.', tone: 'cyan' },
                { term: 'API Key', definition: 'A private access credential for a tool or model.', tone: 'amber' },
                { term: 'Safety', definition: 'Protecting people, data, keys, and outcomes.', tone: 'emerald' },
                { term: 'Mission', definition: 'The reason your AI project should exist.', tone: 'rose' },
            ],
            steps: ['Move the controls.', 'Learn why keys stay private.', 'Pick a social-good mission for your first build.'],
        },
    ],
    'm1-s2': [
        {
            id: 'image-prompt-architecture',
            title: 'Image Prompt Architecture',
            subtitle: 'Better images come from better instructions.',
            plainLanguage: 'Image prompting is more than saying what you want. Strong prompts include subject, style, lighting, composition, detail, aspect ratio, and constraints.',
            whyItMatters: 'You learn how to direct an image tool instead of just hoping the tool guesses correctly.',
            resourceTitles: ['Image Prompt Recipe Builder', 'Diffusion Image Lab', 'Generative Quality Lens', 'Generative Media Studio', 'Advanced Prompt Architect', 'Pioneer Studio'],
            keywords: [
                { term: 'Subject', definition: 'The main thing in the image.', tone: 'cyan' },
                { term: 'Style', definition: 'The visual look, such as cinematic, realistic, or illustrated.', tone: 'rose' },
                { term: 'Composition', definition: 'How the image is arranged.', tone: 'violet' },
                { term: 'Constraint', definition: 'A rule that keeps the result focused or safe.', tone: 'amber' },
            ],
            steps: ['Start with one simple image idea.', 'Add style, lighting, and constraints.', 'Save a studio brief you can use later.'],
        },
        {
            id: 'chatbot-system-map',
            title: 'Chatbot Anatomy',
            subtitle: 'A chatbot is a pipeline, not a single text box.',
            plainLanguage: 'A chatbot takes your input, formats the request, sends it through a network, processes streamed output, and renders the response on screen.',
            whyItMatters: 'When you see the parts, you can understand why chatbots can fail, lag, stream, format, or need secure access.',
            resourceTitles: ['Chatbot Design Anatomy', 'Power of an API Key'],
            keywords: [
                { term: 'Tokenizer', definition: 'Splits text into pieces the system can process.', tone: 'cyan' },
                { term: 'Formatter', definition: 'Packages the request for the AI system.', tone: 'violet' },
                { term: 'Stream', definition: 'The answer arriving in pieces.', tone: 'emerald' },
                { term: 'Renderer', definition: 'The interface that shows the final response.', tone: 'rose' },
            ],
            steps: ['Find the chatbot parts.', 'Name what each part does.', 'Notice which features need safe access.'],
        },
        {
            id: 'deepfake-trust-boundary',
            title: 'Trust Boundaries',
            subtitle: 'Slow down before believing or sharing synthetic media.',
            plainLanguage: 'Synthetic media can be useful, creative, misleading, or harmful. As a responsible Pioneer, check the source, intent, clues, and risk before trusting it.',
            whyItMatters: 'You get a practical safety habit you can use immediately online.',
            resourceTitles: ['Deepfake Trust Check', 'Mission Badge Selector'],
            keywords: [
                { term: 'Synthetic Media', definition: 'AI-generated or AI-edited image, audio, or video.', tone: 'rose' },
                { term: 'Source', definition: 'Where the media came from and whether it can be verified.', tone: 'cyan' },
                { term: 'Intent', definition: 'Why someone made or shared the media.', tone: 'violet' },
                { term: 'Trust Rule', definition: 'A personal rule for checking before sharing.', tone: 'emerald' },
            ],
            steps: ['Read the scenario.', 'Choose the safest response.', 'Write one trust rule before moving on.'],
        },
    ],
};

const getConceptMissionPods = (sectionId: string, resources: ProgramResourceContentItem[]): ConceptMissionPod[] => (
    (conceptMissionPodConfigs[sectionId] ?? [])
        .map((pod) => ({
            ...pod,
            resources: pod.resourceTitles
                .map((title) => resources.find((resource) => resource.title === title))
                .filter((resource): resource is ProgramResourceContentItem => Boolean(resource)),
        }))
        .filter((pod) => pod.resources.length > 0)
);

const ProgramLaunchIntro: React.FC<{
    progressPercent: number;
    completedSections: number;
    totalSections: number;
    completedLabs: number;
    totalLabs: number;
    currentSectionTitle: string;
    onStart: () => void;
    onContinue: () => void;
}> = ({ progressPercent, completedSections, totalSections, completedLabs, totalLabs, currentSectionTitle, onStart, onContinue }) => {
    const launchExamples: Array<[string, string]> = [
        ['Prompt Enhancer', 'Turn a rough idea into a stronger AI instruction, then compare what changed.'],
        ['Signal Loop', 'Watch input, model, output, and human check move as one system.'],
        ['Image Practice', 'Use the secure AI path to generate up to 3 project visuals per 24 hours.'],
        ['AI Or Not', 'Sort examples so you can tell ordinary software from pattern-learning AI.'],
    ];
    const launchPowerPath: Array<[string, string, string]> = [
        ['Understand', 'AI is a system you can inspect.', 'Input to output'],
        ['Control', 'Prompts give the system a clearer job.', 'Prompt power'],
        ['Create', 'Media gets better when you test and improve.', 'Studio loop'],
        ['Prove', 'Save evidence and explain your choices.', 'Credential path'],
    ];

    return (
        <section className="relative mb-5 overflow-hidden rounded-[2.1rem] border border-cyan-100/28 bg-[radial-gradient(circle_at_16%_12%,rgba(103,232,249,.22),transparent_31%),radial-gradient(circle_at_84%_10%,rgba(244,114,182,.16),transparent_28%),linear-gradient(135deg,rgba(2,6,23,.96),rgba(8,30,53,.9)_48%,rgba(12,74,110,.72))] p-5 shadow-[0_34px_110px_rgba(0,0,0,.62),inset_0_1px_0_rgba(255,255,255,.1)] sm:p-6 lg:p-8">
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.055)] [--grid-size:30px]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent" />
            <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.22fr)_minmax(320px,.78fr)] xl:items-stretch">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-cyan-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-950">Program Introduction</span>
                        <span className={`rounded-full border border-white/18 bg-black/38 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-50 ${textLift}`}>Official AI Pioneer launch</span>
                    </div>
                    <h2 className={`mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl ${headingLift}`}>
                        ZEN AI Pioneer Program
                    </h2>
                    <p className={`mt-4 max-w-3xl text-lg font-semibold leading-8 text-slate-100 ${textLift}`}>
                        Build, launch, and showcase real AI tools. You will learn AI literacy by testing ideas, using tools, saving evidence, and explaining your choices.
                    </p>
                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                        {[
                            ['4', 'Modules', 'Foundation to showcase'],
                            ['8', 'Sections', 'Self-paced checkpoints'],
                            ['1', 'Mission', 'Build for real-world good'],
                        ].map(([value, label, body]) => (
                            <div key={label} className="rounded-[1.25rem] border border-white/14 bg-black/34 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.07)]">
                                <p className={`text-3xl font-black text-white ${headingLift}`}>{value}</p>
                                <p className={`mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>{label}</p>
                                <p className="mt-2 text-xs font-semibold leading-5 text-slate-200">{body}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <button type="button" onClick={onStart} className="rounded-full border border-white/20 bg-cyan-100 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,.24)] transition hover:-translate-y-0.5 hover:bg-white">
                            Begin Section 1
                        </button>
                        <button type="button" onClick={onContinue} className="rounded-full border border-white/20 bg-black/42 px-5 py-3 text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,.08)] transition hover:bg-white/[0.12]">
                            Continue current section
                        </button>
                    </div>
                    <div className="mt-6 rounded-[1.45rem] border border-white/16 bg-slate-950/58 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className={`text-[10px] font-black uppercase tracking-[0.26em] text-cyan-50 ${textLift}`}>Pioneer power path</p>
                            <span className="rounded-full border border-cyan-100/22 bg-cyan-300/[0.12] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-50">4 skill loops</span>
                        </div>
                        <div className="mt-4 grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
                            {launchPowerPath.map(([label, body, tag], index) => (
                                <div key={label} className="relative min-w-0 overflow-hidden rounded-[1.15rem] border border-white/14 bg-black/34 p-4 shadow-[0_14px_36px_rgba(0,0,0,.28),inset_0_1px_0_rgba(255,255,255,.07)]">
                                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-200 via-white to-emerald-200" />
                                    <div className="flex items-start gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-xs font-black text-slate-950 shadow-[0_0_20px_rgba(103,232,249,.34)]">{index + 1}</span>
                                        <div className="min-w-0">
                                            <p className={`text-sm font-black text-white ${textLift}`}>{label}</p>
                                            <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{body}</p>
                                            <p className="mt-3 inline-flex rounded-full border border-white/14 bg-white/[0.07] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-cyan-50">{tag}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <PioneerLaunchConsole
                    progressPercent={progressPercent}
                    completedSections={completedSections}
                    totalSections={totalSections}
                    completedLabs={completedLabs}
                    totalLabs={totalLabs}
                    currentSectionTitle={currentSectionTitle}
                    launchExamples={launchExamples}
                    onStart={onStart}
                />
            </div>
        </section>
    );
};

const ProgramDashboardPage: React.FC = () => {
    const { programId: routeProgramId } = useParams<{ programId: string }>();
    const programId = useMemo(() => {
        if (!routeProgramId) {
            return '';
        }

        if (getProgramById(routeProgramId)) {
            return routeProgramId;
        }

        const programKey = toProgramKey(routeProgramId);
        return programKey ? getRegistryProgramIdForProgramKey(programKey) : routeProgramId;
    }, [routeProgramId]);
    const program = programId ? getProgramById(programId) : undefined;
    const curriculum = programId ? getCurriculumByProgramId(programId) : undefined;
    const { emitProgress, emitCompletion } = useArsenal();
    const [activeSection, setActiveSection] = useState('');
    const [reflectionDrafts, setReflectionDrafts] = useState<Record<string, string>>({});
    const [progress, setProgress] = useState(() => (
        programId ? getProgramProgress(programId) : {
            completedSections: [],
            completedLabs: [],
            exploredResources: [],
            reflections: {},
            lastViewedSection: '',
            startedAt: null,
            lastActiveAt: null,
        }
    ));

    const allSections = useMemo(() => (curriculum ? flattenSections(curriculum.sections) : []), [curriculum]);
    const leafSections = useMemo(() => (curriculum ? getLeafSections(curriculum.sections) : []), [curriculum]);
    const allLabs = useMemo(() => allSections.flatMap((section) => section.content.filter((item): item is ProgramLabContentItem => item.type === 'lab')), [allSections]);
    const allResources = useMemo(() => allSections.flatMap((section) => section.content.filter((item): item is ProgramResourceContentItem => item.type === 'resource')), [allSections]);

    useEffect(() => {
        if (!programId || !curriculum?.sections.length) {
            return;
        }

        const stored = getProgramProgress(programId);
        const firstModule = curriculum.sections[0];
        setProgress(stored);
        setActiveSection(stored.lastViewedSection || firstModule.id);
    }, [curriculum, programId]);

    useEffect(() => {
        if (!programId || !activeSection) {
            return;
        }

        setProgress((current) => ({
            ...current,
            lastViewedSection: activeSection,
            startedAt: current.startedAt || new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
        }));
        saveProgramProgress(programId, activeSection, false);

        const sectionIndex = leafSections.findIndex((section) => section.id === activeSection);
        if (sectionIndex >= 0 && !progress.completedSections.includes(activeSection)) {
            emitProgress(programId, activeSection, activeSection, sectionIndex, 'started');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSection, programId]);

    if (!programId || !program) {
        return <Navigate to="/programs" replace />;
    }

    if (program.id === 'vanguard') {
        return <Navigate to="/dashboard" replace />;
    }

    if (!curriculum) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-white">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-200">Program preview</p>
                    <h1 className="mt-4 text-4xl font-black">Curriculum coming soon</h1>
                    <p className="mt-4 text-slate-100">The content for {program.name} is still being assembled.</p>
                    <Link to="/programs" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950">
                        Back to Programs
                    </Link>
                </div>
            </div>
        );
    }

    const currentSection = findSection(curriculum.sections, activeSection) ?? curriculum.sections[0];
    const activeModule = findModuleForSection(curriculum.sections, currentSection.id) ?? curriculum.sections[0];
    const activeModuleIndex = Math.max(0, curriculum.sections.findIndex((section) => section.id === activeModule.id));
    const theme = moduleThemes[activeModuleIndex % moduleThemes.length];
    const currentIndex = leafSections.findIndex((section) => section.id === currentSection.id);
    const previousSection = currentIndex > 0 ? leafSections[currentIndex - 1] : null;
    const nextSection = currentIndex >= 0 && currentIndex < leafSections.length - 1 ? leafSections[currentIndex + 1] : null;
    const completedLeafSections = leafSections.filter((section) => progress.completedSections.includes(section.id));
    const completedModules = curriculum.sections.filter((module) => (
        (module.subSections ?? [module]).every((section) => progress.completedSections.includes(section.id))
    ));
    const completedLabs = allLabs.filter((lab) => progress.completedLabs?.includes(lab.id));
    const exploredResources = allResources.filter((resource) => progress.exploredResources?.includes(resource.title));
    const progressPercent = leafSections.length ? Math.round((completedLeafSections.length / leafSections.length) * 100) : 0;
    const isModuleView = Boolean(currentSection.subSections?.length);
    const learnItems = currentSection.content.filter((item) => ['heading', 'paragraph', 'quote', 'list', 'callout'].includes(item.type));
    const resourceItems = currentSection.content.filter((item): item is ProgramResourceContentItem => item.type === 'resource');
    const conceptMissionPods = getConceptMissionPods(currentSection.id, resourceItems);
    const podResourceTitles = new Set(conceptMissionPods.flatMap((pod) => pod.resources.map((resource) => resource.title)));
    const standaloneResourceItems = conceptMissionPods.length ? resourceItems.filter((resource) => !podResourceTitles.has(resource.title)) : resourceItems;
    const labItems = currentSection.content.filter((item): item is ProgramLabContentItem => item.type === 'lab');
    const codeItems = currentSection.content.filter((item) => item.type === 'code');
    const isCurrentComplete = progress.completedSections.includes(currentSection.id);

    const goToSection = (sectionId: string) => {
        setActiveSection(sectionId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const markSectionComplete = () => {
        if (!programId || isModuleView || isCurrentComplete) {
            return;
        }

        const nextProgress = {
            ...progress,
            completedSections: [...progress.completedSections, currentSection.id],
            lastViewedSection: currentSection.id,
            startedAt: progress.startedAt || new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
        };

        setProgress(nextProgress);
        saveProgramProgress(programId, currentSection.id, true);
        emitProgress(programId, currentSection.id, currentSection.id, currentIndex, 'completed');

        if (nextProgress.completedSections.length >= leafSections.length) {
            emitCompletion();
        }
    };

    const markResourceExplored = (title: string) => {
        setProgress(saveProgramResourceExplored(programId, title));
    };

    const markLabComplete = (labId: string) => {
        setProgress(saveProgramLabComplete(programId, labId, reflectionDrafts[labId]));
    };

    const renderLearnItem = (item: ProgramContentItem, index: number) => {
        if (item.type === 'heading') {
            return (
                <h3 key={`${item.type}-${index}`} className={`group inline-flex w-fit flex-col text-2xl font-black tracking-tight text-slate-50 ${headingLift}`}>
                    <span>{repaired(item.content as string)}</span>
                    <span className={`mt-2 h-1 w-20 rounded-full bg-gradient-to-r ${theme.accent} shadow-[0_0_22px_rgba(103,232,249,.55)] transition-all duration-500 group-hover:w-full`} />
                </h3>
            );
        }

        if (item.type === 'paragraph') {
            return (
                <div key={`${item.type}-${index}`} className="relative overflow-hidden rounded-[1.35rem] border border-white/14 bg-[linear-gradient(135deg,rgba(15,23,42,.74),rgba(8,47,73,.50))] p-5 shadow-[0_18px_46px_rgba(0,0,0,.28),inset_0_1px_0_rgba(255,255,255,.08)]">
                    <span className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${theme.accent}`} />
                    <p className={`text-base font-semibold leading-8 text-slate-100 ${textLift}`}>{renderHighlightedText(item.content as string)}</p>
                </div>
            );
        }

        if (item.type === 'quote') {
            return (
                <blockquote key={`${item.type}-${index}`} className={`rounded-[1.35rem] border border-cyan-100/24 bg-cyan-300/[0.10] p-5 text-base font-semibold leading-8 text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] ${textLift}`}>
                    {renderHighlightedText(item.content as string)}
                </blockquote>
            );
        }

        if (item.type === 'list') {
            return (
                <div key={`${item.type}-${index}`} className="grid gap-3 md:grid-cols-2">
                    {repairedList(item.content).map((listItem, listIndex) => (
                        <div key={listItem} className="group relative overflow-hidden rounded-[1.25rem] border border-cyan-100/18 bg-[linear-gradient(145deg,rgba(2,6,23,.86),rgba(8,47,73,.58))] p-4 text-sm font-semibold leading-7 text-slate-100 shadow-[0_16px_38px_rgba(0,0,0,.26),inset_0_1px_0_rgba(255,255,255,.08)] transition hover:-translate-y-0.5 hover:border-cyan-100/34">
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent opacity-70" />
                            <div className="flex items-start gap-3">
                                <span className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${theme.active} text-[10px] font-black text-slate-950 shadow-[0_0_22px_rgba(103,232,249,.24)]`}>
                                    {String(listIndex + 1).padStart(2, '0')}
                                </span>
                                <span>{renderHighlightedText(listItem)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (item.type === 'callout') {
            const tone = item.tone === 'warning'
                ? 'border-amber-100/32 bg-amber-300/[0.12] text-amber-50'
                : item.tone === 'success'
                    ? 'border-emerald-100/32 bg-emerald-300/[0.12] text-emerald-50'
                    : 'border-sky-100/32 bg-sky-300/[0.12] text-sky-50';

            return (
                <div key={`${item.type}-${index}`} className={`group relative overflow-hidden rounded-[1.45rem] border p-5 shadow-[0_22px_58px_rgba(0,0,0,.32),inset_0_1px_0_rgba(255,255,255,.10)] transition hover:-translate-y-0.5 ${tone}`}>
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(255,255,255,.13),transparent_32%)] opacity-80" />
                    <div className="pointer-events-none absolute right-4 top-4 h-16 w-16 rounded-full border border-white/16 bg-white/[.04] shadow-[inset_0_1px_0_rgba(255,255,255,.1)] transition group-hover:scale-110" />
                    <div className="relative z-10">
                        {item.title && (
                            <div className="flex flex-wrap items-center gap-3">
                                <span className={`flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-[10px] font-black text-slate-950 shadow-[0_12px_26px_rgba(0,0,0,.2)]`}>
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <p className={`text-xs font-black uppercase tracking-[0.22em] text-white ${textLift}`}>{repaired(item.title)}</p>
                            </div>
                        )}
                        <div className={`mt-4 space-y-2 text-sm font-semibold leading-7 ${textLift}`}>
                            {repairedList(item.content).map((line) => <p key={line}>{renderHighlightedText(line)}</p>)}
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    const renderNativeResource = (item: ProgramResourceContentItem) => {
        const onComplete = () => markResourceExplored(item.title);

        switch (item.interactive) {
            case 'ai-signal-loop':
                return <AiSignalLoopMiniApp onComplete={onComplete} />;
            case 'ai-or-not-check':
                return <AiOrNotCheckMiniApp onComplete={onComplete} />;
            case 'ai-coach-console':
                return <PioneerAICoachMiniApp onComplete={onComplete} />;
            case 'ai-vocab-quest':
                return <AiVocabularyQuestMiniApp onComplete={onComplete} />;
            case 'neural-network-lab':
                return <NeuralNetworkLabMiniApp onComplete={onComplete} />;
            case 'computer-vision-lab':
                return <ComputerVisionLabMiniApp onComplete={onComplete} />;
            case 'model-behavior-mixer':
                return <ModelBehaviorMixerMiniApp onComplete={onComplete} />;
            case 'prompt-formula-builder':
                return <PromptFormulaBuilderMiniApp onComplete={onComplete} />;
            case 'prompt-upgrader':
                return <PromptUpgraderMiniApp onComplete={onComplete} />;
            case 'prompt-power-meter':
                return <PromptPowerMeterMiniApp onComplete={onComplete} />;
            case 'prompt-library':
                return <PromptLibraryMiniApp onComplete={onComplete} />;
            case 'prompt-remix':
                return <PromptRemixMiniApp onComplete={onComplete} />;
            case 'particle-lab':
                return <ParticleControlMiniApp onComplete={onComplete} />;
            case 'api-orb':
                return <ApiOrbMiniApp onComplete={onComplete} />;
            case 'mission-badges':
                return <MissionBadgeMiniApp onComplete={onComplete} />;
            case 'image-recipe-builder':
                return <ImageRecipeBuilderMiniApp onComplete={onComplete} />;
            case 'diffusion-lab':
                return <DiffusionLabMiniApp onComplete={onComplete} />;
            case 'media-quality-lens':
                return <MediaQualityLensMiniApp onComplete={onComplete} />;
            case 'generative-media-lab':
                return <GenerativeMediaLabMiniApp onComplete={onComplete} />;
            case 'prompt-architect':
                return <PromptArchitectMiniApp onComplete={onComplete} />;
            case 'pioneer-studio':
                return <PioneerStudioMiniApp onComplete={onComplete} />;
            case 'chatbot-anatomy':
                return <ChatbotAnatomyMiniApp onComplete={onComplete} />;
            case 'deepfake-check':
                return <DeepfakeCheckMiniApp onComplete={onComplete} />;
            case 'prediction-engine':
                return <PredictionEngineMiniApp onComplete={onComplete} />;
            case 'token-budget':
                return <TokenBudgetMiniApp onComplete={onComplete} />;
            case 'persona-agent':
                return <PersonaAgentMiniApp onComplete={onComplete} />;
            case 'model-fit-router':
                return <ModelFitRouterMiniApp onComplete={onComplete} />;
            default:
                return null;
        }
    };

    const renderResource = (item: ProgramResourceContentItem, variant: 'standalone' | 'pod' = 'standalone') => {
        const explored = progress.exploredResources?.includes(item.title);
        const nativeResource = renderNativeResource(item);
        const hasExternalPreview = Boolean(item.embed && item.href);
        const shouldEmbed = Boolean(hasExternalPreview && !item.interactive && variant === 'standalone');
        const flowSteps = [
            ['Learn', item.interactive ? 'Concept + app' : 'Concept card'],
            ['Try', item.instructions?.length ? `${item.instructions.length} guided steps` : item.href ? 'Open tool' : 'Read and compare'],
            ['Prove', explored ? 'Saved' : 'Mark when done'],
        ];
        const articleClassName = variant === 'pod'
            ? `group relative overflow-hidden rounded-[1.45rem] border border-cyan-100/20 bg-[linear-gradient(145deg,rgba(2,6,23,.9),rgba(8,23,43,.86),rgba(12,74,110,.48))] shadow-[0_20px_58px_rgba(0,0,0,.42),inset_0_1px_0_rgba(255,255,255,.09)] transition hover:-translate-y-0.5 hover:border-cyan-100/40 ${electricFrame}`
            : `group overflow-hidden rounded-[1.65rem] border transition hover:-translate-y-1 hover:border-cyan-100/36 ${missionPanel}`;

        return (
            <article key={item.title} className={articleClassName}>
                {variant === 'pod' && <div className="pointer-events-none absolute inset-y-5 left-0 w-px bg-gradient-to-b from-transparent via-cyan-100/65 to-transparent" />}
                <div className={`relative min-h-2 bg-gradient-to-r ${variant === 'pod' ? 'from-cyan-200 via-violet-200 to-rose-200' : 'from-cyan-200 via-white to-rose-200'} shadow-[0_0_28px_rgba(103,232,249,.42)]`} />
                <div className={variant === 'pod' ? 'relative z-10 p-4' : 'p-5'}>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full border border-cyan-100/30 bg-cyan-300/[0.13] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-50 ${textLift}`}>
                            {item.status ?? 'External'}
                        </span>
                        {hasExternalPreview && (
                            <span className={`rounded-full border border-white/18 bg-black/34 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-50 ${textLift}`}>
                                Optional preview
                            </span>
                        )}
                        {item.interactive && (
                            <span className={`rounded-full border border-emerald-100/28 bg-emerald-300/[0.13] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 ${textLift}`}>
                                Interactive
                            </span>
                        )}
                    </div>
                    {explored && <span className="rounded-full bg-emerald-200 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-950">Explored</span>}
                </div>
                <h4 className={`mt-4 text-2xl font-black tracking-tight text-white ${headingLift}`}>{repaired(item.title)}</h4>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {flowSteps.map(([label, detail], index) => (
                        <div key={`${item.title}-${label}`} className="min-w-0 rounded-[1rem] border border-white/12 bg-slate-950/58 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
                            <div className="flex items-center gap-2">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-[10px] font-black text-slate-950">{index + 1}</span>
                                <p className={`min-w-0 truncate text-[10px] font-black uppercase tracking-[0.18em] text-cyan-50 ${textLift}`}>{label}</p>
                            </div>
                            <p className="mt-2 text-xs font-semibold leading-5 text-slate-200">{detail}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-[1.15rem] border border-white/14 bg-black/40 p-4">
                        <p className={`text-[10px] font-black uppercase tracking-[0.22em] text-cyan-50 ${textLift}`}>What you do</p>
                        <p className="mt-2 text-sm font-semibold leading-7 text-slate-100">{renderHighlightedText(item.what ?? 'A tool or app connected to this section.')}</p>
                    </div>
                    <div className="rounded-[1.15rem] border border-emerald-100/20 bg-emerald-300/[0.10] p-4">
                        <p className={`text-[10px] font-black uppercase tracking-[0.22em] text-emerald-50 ${textLift}`}>Why use it</p>
                        <p className="mt-2 text-sm font-semibold leading-7 text-emerald-50">{renderHighlightedText(item.why ?? 'It turns the idea into something you can test.')}</p>
                    </div>
                </div>
                {item.instructions?.length ? (
                    <div className="mt-4 grid gap-2">
                        {item.instructions.map((instruction, instructionIndex) => (
                            <div key={instruction} className="flex items-start gap-3 rounded-xl border border-cyan-100/16 bg-slate-950/58 p-3 text-sm font-semibold leading-6 text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-[10px] font-black text-slate-950">{instructionIndex + 1}</span>
                                <span>{renderHighlightedText(instruction)}</span>
                            </div>
                        ))}
                    </div>
                ) : null}

                {shouldEmbed && (
                    <details className="mt-5 overflow-hidden rounded-[1.35rem] border border-cyan-100/18 bg-slate-950/86 shadow-[0_18px_46px_rgba(0,0,0,.28)]">
                        <summary className="cursor-pointer list-none border-b border-cyan-100/14 bg-black/36 px-4 py-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Optional external preview</p>
                                <p className="text-xs font-semibold leading-5 text-slate-200">Open only if you want to compare the outside tool.</p>
                            </div>
                        </summary>
                        <iframe
                            title={item.title}
                            src={item.href}
                            loading="lazy"
                            onLoad={() => markResourceExplored(item.title)}
                            className="h-[260px] w-full bg-white sm:h-[300px] lg:h-[340px]"
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                        />
                    </details>
                )}

                {nativeResource}

                <div className="mt-5 flex flex-wrap gap-2">
                    {item.href && (
                        <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => markResourceExplored(item.title)}
                            className={`rounded-full border border-white/20 bg-gradient-to-r ${theme.active} px-4 py-2 text-sm font-black text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,.24)] transition hover:-translate-y-0.5`}
                        >
                            Open tool
                        </a>
                    )}
                    <button type="button" onClick={() => markResourceExplored(item.title)} className="rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,.08)] transition hover:bg-white/[0.12]">
                        {explored ? 'Explored' : 'Mark explored'}
                    </button>
                </div>
                {item.completionHint && <p className="mt-3 text-xs font-semibold leading-5 text-slate-300">{renderHighlightedText(item.completionHint)}</p>}
                </div>
            </article>
        );
    };

    const renderLab = (item: ProgramLabContentItem) => {
        const complete = progress.completedLabs?.includes(item.id);

        return (
            <article key={item.id} className="rounded-[1.6rem] border border-emerald-100/28 bg-[linear-gradient(145deg,rgba(2,6,23,.92),rgba(6,78,59,.68),rgba(8,47,73,.72))] p-5 shadow-[0_26px_76px_rgba(0,0,0,.48),inset_0_1px_0_rgba(255,255,255,.08)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <span className={`rounded-full border border-emerald-100/30 bg-emerald-300/[0.14] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 ${textLift}`}>Build Lab</span>
                        <h4 className={`mt-4 text-xl font-black tracking-tight text-white ${headingLift}`}>{repaired(item.title)}</h4>
                    </div>
                    {complete && <span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-black text-emerald-950">Complete</span>}
                </div>
                <p className="mt-4 text-sm font-semibold leading-7 text-slate-100"><span className="font-black text-white underline decoration-emerald-200/70 decoration-2 underline-offset-4">Objective:</span> {renderHighlightedText(item.objective)}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {item.steps.map((step, stepIndex) => (
                        <div key={step} className="rounded-[1.15rem] border border-white/16 bg-black/34 p-4 text-sm font-semibold leading-7 text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
                            <span className={`mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 ${textLift}`}>Step {stepIndex + 1}</span>
                            {renderHighlightedText(step)}
                        </div>
                    ))}
                </div>
                <div className="mt-4 rounded-[1.15rem] border border-white/16 bg-black/40 p-4 text-sm font-semibold leading-7 text-slate-100">
                    <span className="font-black text-white underline decoration-emerald-200/70 decoration-2 underline-offset-4">Expected output:</span> {renderHighlightedText(item.expectedOutput)}
                </div>
                {item.reflectionPrompt && (
                    <label className="mt-4 block">
                        <span className={`text-[10px] font-black uppercase tracking-[0.22em] text-emerald-50 ${textLift}`}>Reflection</span>
                        <textarea
                            value={reflectionDrafts[item.id] ?? progress.reflections?.[item.id] ?? ''}
                            onChange={(event) => setReflectionDrafts((drafts) => ({ ...drafts, [item.id]: event.target.value }))}
                            placeholder={repaired(item.reflectionPrompt)}
                            className="mt-2 min-h-24 w-full rounded-[1.15rem] border border-white/18 bg-slate-950/78 p-4 text-sm font-semibold leading-7 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-200/55"
                        />
                    </label>
                )}
                <button type="button" onClick={() => markLabComplete(item.id)} className="mt-4 rounded-full border border-white/20 bg-emerald-200 px-5 py-3 text-sm font-black text-emerald-950 shadow-[0_14px_30px_rgba(16,185,129,.24)] transition hover:-translate-y-0.5 hover:bg-white">
                    Mark lab complete
                </button>
            </article>
        );
    };

    const renderConceptMissionPod = (pod: ConceptMissionPod, podIndex: number) => (
        <article key={pod.id} className={`group relative overflow-hidden rounded-[2rem] border border-cyan-100/24 bg-[linear-gradient(145deg,rgba(2,6,23,.98),rgba(5,18,35,.96)_37%,rgba(8,47,73,.84)_100%)] p-4 shadow-[0_36px_110px_rgba(0,0,0,.68),inset_0_1px_0_rgba(255,255,255,.11)] sm:p-5 ${electricFrame}`}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,.055)] [--grid-size:26px]" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent" />
            <div aria-hidden="true" className={`pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r ${theme.accent} opacity-70`} />

            <div className="relative z-10 grid gap-5 2xl:grid-cols-[minmax(320px,0.78fr)_minmax(0,1.22fr)] 2xl:items-start">
                <div className="rounded-[1.6rem] border border-cyan-100/20 bg-black/38 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.09)] 2xl:sticky 2xl:top-24">
                    <div className="flex flex-wrap items-start justify-between gap-5">
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
                            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] bg-gradient-to-br ${theme.active} text-base font-black text-slate-950 shadow-[0_0_38px_rgba(103,232,249,.34)]`}>
                                {String(podIndex + 1).padStart(2, '0')}
                            </span>
                            <div className="min-w-0">
                                <p className={`text-[10px] font-black uppercase tracking-[0.28em] text-cyan-50 ${textLift}`}>Concept mission</p>
                                <h4 className={`mt-1 text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl ${headingLift}`}>{pod.title}</h4>
                            </div>
                        </div>
                        <span className="rounded-full border border-white/16 bg-white/[.07] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-50">
                            {pod.resources.length} app{pod.resources.length === 1 ? '' : 's'}
                        </span>
                    </div>

                    <div className="mt-5">
                        <SignalRail compact activeIndex={podIndex === 0 ? 3 : 2} labels={podIndex === 1 ? ['Idea', 'Prompt', 'Test', 'Improve'] : podIndex === 2 ? ['Control', 'Access', 'Safety', 'Mission'] : ['Input', 'Model', 'Output', 'Check']} />
                    </div>

                    <div className="mt-5 rounded-[1.35rem] border border-white/14 bg-slate-950/62 p-4">
                        <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-50">{pod.subtitle}</p>
                        <p className={`mt-4 text-base font-semibold leading-8 text-slate-100 ${textLift}`}>{renderHighlightedText(pod.plainLanguage)}</p>
                    </div>

                    <div className="mt-4 rounded-[1.35rem] border border-emerald-100/22 bg-emerald-300/[0.11] p-4">
                        <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-emerald-50 ${textLift}`}>What you unlock</p>
                        <p className="mt-3 text-sm font-semibold leading-7 text-emerald-50">{renderHighlightedText(pod.whyItMatters)}</p>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
                        {pod.keywords.map((keyword) => (
                            <div key={`${pod.id}-${keyword.term}`} className={`relative overflow-hidden rounded-[1.2rem] border p-4 shadow-[0_18px_42px_rgba(0,0,0,.3)] ${highlightToneClass[keyword.tone]}`}>
                                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${toneDotClass[keyword.tone]}`} />
                                <div className="relative flex items-start gap-3">
                                    <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${toneDotClass[keyword.tone]} text-xs font-black text-slate-950 shadow-[0_0_20px_rgba(103,232,249,.22)]`}>{keyword.term.slice(0, 2).toUpperCase()}</span>
                                    <div className="min-w-0">
                                        <p className={`text-xl font-black leading-none tracking-[-0.03em] text-white ${headingLift}`}>{keyword.term}</p>
                                        <p className={`mt-2 text-sm font-semibold leading-6 ${textLift}`}>{renderHighlightedText(keyword.definition)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4">
                    <div className="rounded-[1.35rem] border border-cyan-100/18 bg-[linear-gradient(135deg,rgba(8,47,73,.78),rgba(2,6,23,.92))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-cyan-50 ${textLift}`}>Try it here</p>
                                <p className="mt-1 text-sm font-semibold leading-6 text-slate-100">Use the app while the concept card stays beside you. Read, test, then save proof before moving on.</p>
                            </div>
                            <span className={`rounded-full bg-gradient-to-r ${theme.active} px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-950`}>Live pod</span>
                        </div>
                        <div className="mt-4 grid gap-2 lg:grid-cols-3">
                            {pod.steps.map((step, stepIndex) => (
                                <div key={step} className="flex items-start gap-3 rounded-2xl border border-white/14 bg-slate-950/62 p-3 text-sm font-semibold leading-6 text-slate-100">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-[10px] font-black text-slate-950 shadow-[0_0_16px_rgba(103,232,249,.34)]">{stepIndex + 1}</span>
                                    <span>{renderHighlightedText(step)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid gap-4">
                        {pod.resources.map((resource) => renderResource(resource, 'pod'))}
                    </div>
                </div>
            </div>
        </article>
    );

    return (
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_5%,rgba(103,232,249,.22),transparent_28%),radial-gradient(circle_at_86%_12%,rgba(248,113,113,.16),transparent_25%),radial-gradient(circle_at_55%_110%,rgba(16,185,129,.16),transparent_34%),linear-gradient(180deg,#081426_0%,#0c1f3a_15%,#07111f_43%,#030712_100%)] text-white">
            <div className="pointer-events-none absolute inset-0">
                <div className={`absolute inset-y-0 left-0 w-px bg-gradient-to-b ${theme.accent} opacity-40`} />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent" />
                <div className="absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,0.06)] [--grid-size:36px]" />
                <div className="absolute inset-x-0 top-0 h-52 bg-[linear-gradient(180deg,rgba(125,211,252,.18),rgba(15,23,42,.18)_42%,transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,rgba(2,6,23,.42)_72%)]" />
            </div>

            <header className="sticky top-0 z-40 border-b border-cyan-100/18 bg-[#050a14]/94 shadow-[0_18px_54px_rgba(0,0,0,.45)] backdrop-blur-2xl">
                <div className="mx-auto flex w-full max-w-none flex-wrap items-center justify-between gap-4 px-3 py-3 sm:px-4 lg:px-5">
                    <Link to="/programs" className={`rounded-full border border-cyan-100/24 bg-cyan-300/[0.10] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] transition hover:bg-cyan-200/[0.16] ${textLift}`}>
                        Programs
                    </Link>
                    <div className="flex min-w-0 flex-1 items-center justify-center gap-3">
                        <span className={`hidden h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.active} text-sm font-black text-slate-950 shadow-[0_14px_34px_rgba(14,165,233,.25)] sm:inline-flex`}>
                            AI
                        </span>
                        <div className="min-w-0 text-center sm:text-left">
                            <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-cyan-50 ${textLift}`}>ZEN AI Pioneer Program</p>
                            <h1 className={`truncate text-lg font-black tracking-tight text-white sm:text-xl ${headingLift}`}>Build, launch, and showcase real AI tools.</h1>
                        </div>
                    </div>
                    <div className={`rounded-full border border-white/18 bg-black/42 px-4 py-2 text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,.08)] ${textLift}`}>
                        {progressPercent}% complete
                    </div>
                </div>
                <div className="h-1 bg-black">
                    <div className={`h-full bg-gradient-to-r ${theme.active} transition-all duration-700`} style={{ width: `${progressPercent}%` }} />
                </div>
            </header>

            <div className="relative grid w-full max-w-none gap-4 px-3 py-4 sm:px-4 lg:grid-cols-[250px_minmax(0,1fr)] lg:px-5 xl:grid-cols-[260px_minmax(0,1fr)] 2xl:grid-cols-[270px_minmax(0,1fr)]">
                <aside className="lg:sticky lg:top-20 lg:self-start">
                    <div className="overflow-hidden rounded-[1.7rem] border border-cyan-100/22 bg-slate-950/86 shadow-[0_32px_90px_rgba(0,0,0,.55),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-2xl">
                        <div className="border-b border-cyan-100/14 p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-[0.28em] text-cyan-50 ${textLift}`}>Course Nav</p>
                                    <h2 className={`mt-1 text-xl font-black text-white ${headingLift}`}>4 modules / 8 sections</h2>
                                </div>
                                <MiniOrbit percent={progressPercent} className="h-14 w-14 shrink-0" />
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-2">
                                <ShellMetric label="Sections" value={`${completedLeafSections.length}/${leafSections.length}`} sublabel="done" />
                                <ShellMetric label="Labs" value={`${completedLabs.length}/${allLabs.length}`} sublabel="done" />
                                <ShellMetric label="Tools" value={`${exploredResources.length}/${allResources.length}`} sublabel="seen" />
                            </div>
                        </div>

                        <nav className="max-h-[calc(100vh-19rem)] overflow-y-auto p-3">
                            {curriculum.sections.map((module, moduleIndex) => {
                                const moduleTheme = moduleThemes[moduleIndex % moduleThemes.length];
                                const selected = activeModule.id === module.id;
                                const moduleLeaves = module.subSections ?? [module];
                                const moduleCompleteCount = moduleLeaves.filter((section) => progress.completedSections.includes(section.id)).length;

                                return (
                                    <div key={module.id} className="mb-3 rounded-[1.35rem] border border-white/12 bg-black/26 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,.05)]">
                                        <button
                                            type="button"
                                            onClick={() => goToSection(module.id)}
                                            className={[
                                                'flex w-full items-start gap-3 rounded-[1.1rem] border px-3 py-3 text-left transition',
                                                selected ? `border-white/28 bg-gradient-to-r ${moduleTheme.active} text-slate-950 shadow-[0_16px_36px_rgba(14,165,233,.28)]` : 'border-transparent text-white hover:bg-white/[0.08]',
                                            ].join(' ')}
                                        >
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950/85 text-xs font-black text-white">{module.icon ?? `M${moduleIndex + 1}`}</span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-[10px] font-black uppercase tracking-[0.22em] opacity-70">Module {moduleIndex + 1}</span>
                                                <span className="mt-1 block text-sm font-black leading-5">{repaired(module.title)}</span>
                                                <span className="mt-2 block text-[11px] font-bold opacity-70">{moduleCompleteCount}/{moduleLeaves.length} sections</span>
                                            </span>
                                        </button>
                                        <div className="mt-2 space-y-1">
                                            {module.subSections?.map((section, sectionIndex) => {
                                                const selectedSection = currentSection.id === section.id;
                                                const complete = progress.completedSections.includes(section.id);

                                                return (
                                                    <button
                                                        key={section.id}
                                                        type="button"
                                                        onClick={() => goToSection(section.id)}
                                                        className={[
                                                            'flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition',
                                                            selectedSection ? 'border-cyan-100/34 bg-cyan-200/[0.14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.07)]' : complete ? 'border-emerald-200/24 bg-emerald-200/[0.10] text-emerald-50' : 'border-transparent text-slate-100 hover:bg-white/[0.08] hover:text-white',
                                                        ].join(' ')}
                                                    >
                                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] text-[10px] font-black">{complete ? 'OK' : `S${sectionIndex + 1}`}</span>
                                                        <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{repaired(section.title)}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                <main className="min-w-0">
                    {program.id === 'pioneer' && ['module-1', 'm1-s1'].includes(currentSection.id) && (
                        <ProgramLaunchIntro
                            progressPercent={progressPercent}
                            completedSections={completedLeafSections.length}
                            totalSections={leafSections.length}
                            completedLabs={completedLabs.length}
                            totalLabs={allLabs.length}
                            currentSectionTitle={isModuleView ? repaired(firstLeafForModule(currentSection).title) : repaired(currentSection.title)}
                            onStart={() => goToSection('m1-s1')}
                            onContinue={() => goToSection(isModuleView ? firstLeafForModule(currentSection).id : currentSection.id)}
                        />
                    )}

                    <section className="relative mb-5 overflow-hidden rounded-[2rem] border border-cyan-100/24 bg-[linear-gradient(135deg,rgba(2,6,23,.94),rgba(8,47,73,.86)_46%,rgba(12,74,110,.62)_100%)] p-6 shadow-[0_34px_100px_rgba(0,0,0,.58),inset_0_1px_0_rgba(255,255,255,.09)] backdrop-blur-2xl lg:p-8">
                        <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${theme.accent}`} />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(103,232,249,.18),transparent_30%),radial-gradient(circle_at_80%_22%,rgba(255,255,255,.10),transparent_23%)]" />
                        <div className={`pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r ${theme.accent} opacity-60`} />
                        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`rounded-full bg-gradient-to-r ${theme.active} px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-950`}>
                                        Module {activeModuleIndex + 1}
                                    </span>
                                    <span className={`rounded-full border border-white/18 bg-black/34 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-50 ${textLift}`}>
                                        {program.level}
                                    </span>
                                    <span className={`rounded-full border border-white/18 bg-black/34 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-50 ${textLift}`}>
                                        {program.duration}
                                    </span>
                                </div>
                                <h2 className={`mt-5 max-w-4xl text-4xl font-black tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl ${headingLift}`}>
                                    {isModuleView ? repaired(activeModule.title) : repaired(currentSection.title)}
                                </h2>
                                <p className={`mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-100 sm:text-lg ${textLift}`}>
                                    {isModuleView ? getSectionSummary(activeModule) : getSectionSummary(currentSection)}
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {sectionActions.map((action) => (
                                        <span key={action} className={`rounded-full border border-white/18 bg-black/38 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.08)] ${textLift}`}>
                                            {action}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-[1.6rem] border border-cyan-100/18 bg-slate-950/78 p-5 shadow-[0_20px_54px_rgba(0,0,0,.35),inset_0_1px_0_rgba(255,255,255,.08)]">
                                <MiniOrbit percent={progressPercent} className="mx-auto h-36 w-36" />
                                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                                    <div className="rounded-2xl border border-white/12 bg-black/34 p-3">
                                        <p className={`text-2xl font-black ${headingLift}`}>{completedModules.length}/4</p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-200">Modules</p>
                                    </div>
                                    <div className="rounded-2xl border border-white/12 bg-black/34 p-3">
                                        <p className={`text-2xl font-black ${headingLift}`}>{completedLabs.length}</p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-200">Labs</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {isModuleView ? (
                        <section className="grid gap-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                {currentSection.subSections?.map((section, index) => {
                                    const complete = progress.completedSections.includes(section.id);
                                    const sectionLabs = section.content.filter((item) => item.type === 'lab').length;
                                    const sectionResources = section.content.filter((item) => item.type === 'resource').length;

                                    return (
                                        <button
                                            key={section.id}
                                            type="button"
                                            onClick={() => goToSection(section.id)}
                                            className={`group overflow-hidden rounded-[1.7rem] border p-5 text-left transition hover:-translate-y-1 hover:border-cyan-100/36 ${missionPanel}`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <span className={`rounded-full bg-gradient-to-r ${theme.active} px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950`}>Section {index + 1}</span>
                                                <span className={complete ? 'rounded-full bg-emerald-200 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-950' : 'rounded-full border border-white/18 bg-black/34 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-50'}>
                                                    {complete ? 'Complete' : 'Open'}
                                                </span>
                                            </div>
                                            <h3 className={`mt-5 text-2xl font-black tracking-tight text-white ${headingLift}`}>{repaired(section.title)}</h3>
                                            <p className="mt-3 line-clamp-3 text-sm font-semibold leading-7 text-slate-100">{getSectionSummary(section)}</p>
                                            <div className="mt-5 flex flex-wrap gap-2">
                                                <span className="rounded-full border border-white/18 bg-black/34 px-3 py-1 text-xs font-black text-slate-50">{sectionLabs} lab cards</span>
                                                <span className="rounded-full border border-white/18 bg-black/34 px-3 py-1 text-xs font-black text-slate-50">{sectionResources} tool cards</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className={`rounded-[1.7rem] border p-6 ${missionPanel}`}>
                                <p className={`text-[10px] font-black uppercase tracking-[0.26em] text-cyan-50 ${textLift}`}>Required labs preview</p>
                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    {(currentSection.subSections ?? []).flatMap((section) => section.content.filter((item): item is ProgramLabContentItem => item.type === 'lab')).map((lab) => (
                                        <div key={lab.id} className="rounded-[1.2rem] border border-emerald-100/22 bg-emerald-300/[0.10] p-4">
                                            <h4 className={`font-black text-white ${textLift}`}>{repaired(lab.title)}</h4>
                                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-100">{repaired(lab.objective)}</p>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={() => goToSection(firstLeafForModule(currentSection).id)} className={`mt-5 rounded-full bg-gradient-to-r ${theme.active} px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5`}>
                                    Start Module {activeModuleIndex + 1}
                                </button>
                            </div>
                        </section>
                    ) : (
                        <section className="grid gap-5">
                            <SectionLearningCockpit
                                sectionId={currentSection.id}
                                title={repaired(currentSection.title)}
                                summary={getSectionSummary(currentSection)}
                                toolCount={resourceItems.length}
                                labCount={labItems.length}
                                exploredCount={resourceItems.filter((resource) => progress.exploredResources?.includes(resource.title)).length}
                                completedLabCount={labItems.filter((lab) => progress.completedLabs?.includes(lab.id)).length}
                                theme={theme}
                            />

                            {conceptMissionPods.length > 0 && (
                                <div className={`relative overflow-hidden rounded-[1.8rem] border p-6 backdrop-blur-xl ${missionPanel}`}>
                                    <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.accent}`} />
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className={`text-[10px] font-black uppercase tracking-[0.28em] text-cyan-50 ${textLift}`}>A. Interactive missions</p>
                                            <h3 className={`mt-2 text-3xl font-black tracking-[-0.035em] text-white ${headingLift}`}>Learn the idea while the app is open.</h3>
                                        </div>
                                        <span className={`rounded-full border border-cyan-100/24 bg-cyan-300/[0.12] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-50 ${textLift}`}>{conceptMissionPods.length} missions</span>
                                    </div>
                                    <div className="mt-4 grid gap-3 lg:grid-cols-3">
                                        {[
                                            ['1', 'Read the core idea', 'Plain-language concept and key words stay visible.'],
                                            ['2', 'Use the app beside it', 'Touch the simulation, prompt tool, or checkpoint immediately.'],
                                            ['3', 'Save proof', 'Mark explored only after you can explain what changed.'],
                                        ].map(([step, label, body]) => (
                                            <div key={label} className="rounded-[1.2rem] border border-white/14 bg-slate-950/58 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.07)]">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 text-xs font-black text-slate-950">{step}</span>
                                                <p className={`mt-3 text-sm font-black text-white ${textLift}`}>{label}</p>
                                                <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{body}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-5 grid gap-5">
                                        {conceptMissionPods.map(renderConceptMissionPod)}
                                    </div>
                                </div>
                            )}

                            <div className={`rounded-[1.8rem] border p-6 backdrop-blur-xl ${missionPanel}`}>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-[0.28em] text-cyan-50 ${textLift}`}>{conceptMissionPods.length ? 'B. Quick Notes' : 'A. Learn'}</p>
                                        <h3 className={`mt-2 text-2xl font-black tracking-tight text-white ${headingLift}`}>{conceptMissionPods.length ? 'Reference cards after the missions.' : 'Core ideas, compressed.'}</h3>
                                    </div>
                                    <span className={`rounded-full border border-cyan-100/24 bg-cyan-300/[0.12] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-50 ${textLift}`}>{learnItems.length} cards</span>
                                </div>
                                <div className="mt-5 grid gap-4">
                                    <LearningConceptVisualizer sectionId={currentSection.id} />
                                    {learnItems.length ? learnItems.map(renderLearnItem) : <p className="text-sm font-semibold leading-7 text-slate-200">This section is currently focused on tools and build work.</p>}
                                </div>
                            </div>

                            <div className={`rounded-[1.8rem] border p-6 backdrop-blur-xl ${missionPanel}`}>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-[0.28em] text-cyan-50 ${textLift}`}>{conceptMissionPods.length ? 'C. Extra Tools' : 'B. Explore'}</p>
                                        <h3 className={`mt-2 text-2xl font-black tracking-tight text-white ${headingLift}`}>{conceptMissionPods.length ? 'Overflow apps and demos.' : 'Apps, tools, and demos.'}</h3>
                                    </div>
                                    <span className={`rounded-full border border-cyan-100/24 bg-cyan-300/[0.12] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-50 ${textLift}`}>{standaloneResourceItems.length} tools</span>
                                </div>
                                <div className="mt-5 grid gap-4">
                                    {standaloneResourceItems.length ? standaloneResourceItems.map((resource) => renderResource(resource)) : (
                                        <p className="rounded-[1.2rem] border border-white/12 bg-black/28 p-4 text-sm font-semibold leading-7 text-slate-200">
                                            The primary apps for this section are already embedded inside the concept pods above.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className={`rounded-[1.8rem] border p-6 backdrop-blur-xl ${missionPanel}`}>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-[0.28em] text-cyan-50 ${textLift}`}>{conceptMissionPods.length ? 'D. Build / Reflect' : 'C. Build / Reflect'}</p>
                                        <h3 className={`mt-2 text-2xl font-black tracking-tight text-white ${headingLift}`}>Make evidence, then move on.</h3>
                                    </div>
                                    <span className={`rounded-full border border-cyan-100/24 bg-cyan-300/[0.12] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-50 ${textLift}`}>{labItems.length} labs</span>
                                </div>
                                <div className="mt-5 grid gap-4">
                                    {labItems.length ? labItems.map(renderLab) : <p className="text-sm font-semibold leading-7 text-slate-200">The build checkpoint for this section will be added as the module content is finalized.</p>}
                                </div>
                            </div>

                            {codeItems.length > 0 && (
                                <details className={`rounded-[1.6rem] border p-5 ${missionPanelSoft}`}>
                                    <summary className={`cursor-pointer text-sm font-black uppercase tracking-[0.2em] text-slate-50 ${textLift}`}>Advanced source notes</summary>
                                    <div className="mt-4 space-y-4">
                                        {codeItems.map((item, index) => (
                                            <pre key={`${item.type}-${index}`} className="max-h-96 overflow-auto rounded-[1.1rem] border border-white/14 bg-black/50 p-4 text-xs font-semibold leading-6 text-slate-100">
                                                {item.type === 'code' ? repaired(item.content) : ''}
                                            </pre>
                                        ))}
                                    </div>
                                </details>
                            )}

                            <section className="sticky bottom-4 z-30 rounded-[1.65rem] border border-emerald-100/30 bg-[linear-gradient(135deg,rgba(6,95,70,.94),rgba(3,7,18,.97))] p-5 shadow-[0_28px_90px_rgba(0,0,0,.62),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-2xl">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-[0.24em] text-emerald-50 ${textLift}`}>Completion checkpoint</p>
                                        <h3 className={`mt-2 text-xl font-black text-white ${headingLift}`}>{isCurrentComplete ? 'Section complete' : 'Ready to lock this section?'}</h3>
                                        <p className="mt-1 text-sm font-semibold leading-6 text-emerald-50">Explore the tools, finish the lab, then mark the section complete.</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {previousSection && (
                                            <button type="button" onClick={() => goToSection(previousSection.id)} className="rounded-full border border-white/20 bg-black/38 px-4 py-3 text-sm font-black text-white transition hover:bg-white/[0.12]">
                                                Previous
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={markSectionComplete}
                                            disabled={isCurrentComplete}
                                            className={isCurrentComplete ? 'rounded-full border border-emerald-100/20 bg-emerald-200/20 px-5 py-3 text-sm font-black text-emerald-50' : 'rounded-full border border-white/20 bg-emerald-200 px-5 py-3 text-sm font-black text-emerald-950 shadow-[0_14px_30px_rgba(16,185,129,.26)] transition hover:-translate-y-0.5 hover:bg-white'}
                                        >
                                            {isCurrentComplete ? 'Complete' : 'Mark complete'}
                                        </button>
                                        {nextSection && (
                                            <button type="button" onClick={() => goToSection(nextSection.id)} className={`rounded-full border border-white/20 bg-gradient-to-r ${theme.active} px-5 py-3 text-sm font-black text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,.24)] transition hover:-translate-y-0.5`}>
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProgramDashboardPage;
