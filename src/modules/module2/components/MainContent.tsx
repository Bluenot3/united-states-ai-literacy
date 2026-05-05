import React, { useEffect, useRef } from 'react';
import type { Section } from '../types';
import SectionRenderer from './SectionRenderer';

interface MainContentProps {
    sections: Section[];
    sectionRefs?: React.MutableRefObject<Record<string, HTMLElement | null>>;
    visibleSections?: Set<string>;
}

const moduleHighlights = [
    'Reasoning loops and tool use',
    'Memory, orchestration, and security',
    'Shipping useful automation systems',
];

// Detect Part 2 boundary
const isPart2Start = (section: Section): boolean => {
    const t = section.title.toLowerCase();
    return (
        t.includes('part 2') ||
        t.includes('section 2') ||
        t.includes('advanced automation') ||
        t.includes('governance') && t.includes('framework') ||
        t.includes('multi-agent') && t.includes('advanced')
    );
};

const MainContent: React.FC<MainContentProps> = ({ sections, sectionRefs, visibleSections }) => {
    const internalRefs = useRef<Record<string, HTMLElement | null>>({});
    const refs = sectionRefs ?? internalRefs;
    let part2Inserted = false;

    const renderSection = (section: Section, level: number = 0): React.ReactNode => {
        const showPart2Divider = level === 0 && !part2Inserted && isPart2Start(section);
        if (showPart2Divider) part2Inserted = true;

        return (
            <React.Fragment key={section.id}>
                {showPart2Divider && (
                    <div className="relative my-14 flex items-center gap-5">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
                        <div className="flex items-center gap-3 rounded-full border border-sky-400/25 bg-sky-400/[0.08] px-5 py-2.5 backdrop-blur-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-sky-300">Part 2</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
                    </div>
                )}

                <div
                    id={section.id}
                    ref={(el) => { refs.current[section.id] = el; }}
                    className="mb-14 scroll-mt-28"
                >
                    <div className="relative">
                        <div className="vanguard-section-card glass-card mb-0 overflow-hidden border border-white/10 bg-[linear-gradient(160deg,rgba(7,14,30,0.95)_0%,rgba(12,20,39,0.9)_48%,rgba(9,16,33,0.96)_100%)] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.42)] backdrop-blur-xl md:p-8">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
                            {level === 0 && (
                                <div className="mb-6 h-1.5 w-20 rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-400" />
                            )}
                            <h2
                                className={[
                                    'mb-7 font-outfit font-black tracking-tight text-slate-100',
                                    level === 0 ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl',
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
                                style={{ borderImage: 'linear-gradient(to bottom, rgba(14,165,233,0.3), rgba(6,182,212,0.18), rgba(15,23,42,0.04)) 1' }}
                            >
                                {section.subSections.map((sub) => renderSection(sub, level + 1))}
                            </div>
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    };

    const overviewParagraph = sections.find((s) => s.id === 'overview')?.content
        .find((item) => item.type === 'paragraph')?.content;

    return (
        <div className="py-8">
            {/* Module intro header */}
            <header className="mb-10 overflow-hidden rounded-[1.5rem] border border-sky-400/20 bg-[linear-gradient(145deg,rgba(6,11,24,0.94)_0%,rgba(13,22,42,0.9)_60%,rgba(7,14,30,0.94)_100%)] p-6 shadow-[0_24px_55px_rgba(2,6,23,0.42)] backdrop-blur-xl md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-sky-400/25 bg-sky-400/[0.10] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">
                        Build Layer
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                        Module 2
                    </span>
                </div>
                <h1 className="mt-4 font-outfit text-4xl font-black tracking-tight text-slate-100 md:text-6xl md:leading-[1.02]">
                    Agent Systems that actually{' '}
                    <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                        do work
                    </span>
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
                    {typeof overviewParagraph === 'string' ? overviewParagraph : ''}
                </p>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {moduleHighlights.map((highlight) => (
                        <div key={highlight} className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 backdrop-blur-sm">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-300">Capability</p>
                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-100">{highlight}</p>
                        </div>
                    ))}
                </div>

                {/* Part 1 badge */}
                <div className="mt-7 flex items-center gap-3">
                    <div className="flex items-center gap-3 rounded-full border border-sky-400/20 bg-sky-400/[0.06] px-4 py-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-sky-300">Part 1 — Agentic Foundations &amp; Reasoning Systems</span>
                    </div>
                </div>
            </header>

            {sections.map((section) => renderSection(section))}
        </div>
    );
};

export default React.memo(MainContent);
