import React, { useEffect, useRef } from 'react';
import SectionRenderer from './SectionRenderer';
import type { Section } from '../types';

interface MainContentProps {
    title: string;
    sections: Section[];
    sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
    visibleSections: Set<string>;
}

const overviewPillars = [
    'How AI systems actually work',
    'What LLMs can and cannot do',
    'How to evaluate outputs responsibly',
];

// Detect Part 2 boundary
const isPart2Start = (section: Section): boolean => {
    const t = section.title.toLowerCase();
    return (
        t.includes('part 2') ||
        t.includes('section 2') ||
        t.includes('generative') && t.includes('laboratory') ||
        t.includes('creative') ||
        t.includes('experience the magic') ||
        t.includes('ai models landscape') ||
        t.includes('deep dives')
    );
};

const MainContent: React.FC<MainContentProps> = ({ title, sections, sectionRefs, visibleSections }) => {
    let part2Inserted = false;

    const renderSections = (sectionsToRender: Section[], level: number = 0): React.ReactNode => sectionsToRender.map((section) => {
        const showPart2Divider = level === 0 && !part2Inserted && isPart2Start(section);
        if (showPart2Divider) part2Inserted = true;

        return (
            <React.Fragment key={section.id}>
                {showPart2Divider && (
                    <div className="relative my-14 flex items-center gap-5">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
                        <div className="flex items-center gap-3 rounded-full border border-violet-400/25 bg-violet-400/[0.08] px-5 py-2.5 backdrop-blur-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.8)]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-violet-300">Part 2</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
                    </div>
                )}

                <div
                    id={section.id}
                    ref={(element) => { sectionRefs.current[section.id] = element; }}
                    className="scroll-mt-28"
                >
                    <div className="relative">
                        <div className="glass-card mb-14 overflow-hidden border border-white/10 bg-[linear-gradient(160deg,rgba(7,14,30,0.95)_0%,rgba(12,20,39,0.9)_48%,rgba(9,16,33,0.96)_100%)] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.42)] backdrop-blur-xl md:p-8">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zen-gold/70 to-transparent" />
                            {level === 0 && (
                                <div className="mb-8 h-1.5 w-24 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400" />
                            )}

                            <h2
                                className={[
                                    'mb-8 font-outfit font-black tracking-tight text-slate-100',
                                    level === 0 ? 'text-3xl md:text-4xl' : level === 1 ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl',
                                ].join(' ')}
                            >
                                {section.title}
                            </h2>

                            <div className="space-y-8">
                                {section.content.map((item, index) => (
                                    <SectionRenderer key={`${section.id}-${index}`} item={item} section={section} itemIndex={index} />
                                ))}
                            </div>
                        </div>

                        {section.subSections && (
                            <div
                                className="ml-4 border-l-2 border-transparent pl-4 md:ml-8 md:pl-8"
                                style={{ borderImage: 'linear-gradient(to bottom, rgba(139,92,246,0.28), rgba(34,211,238,0.18), rgba(15,23,42,0.04)) 1' }}
                            >
                                {renderSections(section.subSections, level + 1)}
                            </div>
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    });

    const overviewContent = sections.find((section) => section.id === 'overview')?.content[0]?.content;

    return (
        <div className="py-8">
            <header className="mb-10 overflow-hidden rounded-[1.5rem] border border-zen-gold/30 bg-[linear-gradient(145deg,rgba(6,11,24,0.94)_0%,rgba(13,22,42,0.9)_60%,rgba(7,14,30,0.94)_100%)] p-6 shadow-[0_24px_55px_rgba(2,6,23,0.42)] backdrop-blur-xl md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-violet-400/25 bg-violet-400/[0.10] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-200">
                        Module Overview
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                        Module 1
                    </span>
                </div>
                <h1 className="mt-5 text-4xl font-outfit font-black tracking-tight text-slate-100 md:text-6xl md:leading-[1.02]">
                    {title}
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                    {typeof overviewContent === 'string' ? overviewContent : ''}
                </p>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {overviewPillars.map((pillar) => (
                        <div key={pillar} className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 backdrop-blur-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">Focus</p>
                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-100">{pillar}</p>
                        </div>
                    ))}
                </div>

                {/* Part 1 badge */}
                <div className="mt-7 flex items-center gap-3">
                    <div className="flex items-center gap-3 rounded-full border border-violet-400/20 bg-violet-400/[0.06] px-4 py-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.8)]" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-violet-300">Part 1 — Foundations &amp; Model Behavior</span>
                    </div>
                </div>
            </header>

            {renderSections(sections)}
        </div>
    );
};

export default MainContent;
