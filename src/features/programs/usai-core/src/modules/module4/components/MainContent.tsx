import React, { useEffect, useRef } from 'react';
import type { Section } from '../../../types';
import SectionRenderer from './SectionRenderer';

interface MainContentProps {
    sections: Section[];
    sectionRefs?: React.MutableRefObject<Record<string, HTMLElement | null>>;
    visibleSections?: Set<string>;
}

const operatingPillars = [
    'Evaluation and observability',
    'Security, governance, and controls',
    'Shipping systems people can trust',
];

// Detect Part 2 boundary
const isPart2Start = (section: Section): boolean => {
    const t = section.title.toLowerCase();
    return (
        t.includes('part 2') ||
        t.includes('section 2') ||
        t.includes('governance') && (t.includes('compliance') || t.includes('pack')) ||
        t.includes('legal') ||
        t.includes('capstone') ||
        t.includes('crisis')
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
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                        <div className="flex items-center gap-3 rounded-full border border-amber-400/25 bg-amber-400/[0.08] px-5 py-2.5 backdrop-blur-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-amber-300">Part 2</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                    </div>
                )}

                <div
                    id={section.id}
                    ref={(el) => { refs.current[section.id] = el; }}
                    className="mb-14 scroll-mt-28"
                >
                    <div className="relative">
                        <div className="vanguard-section-card glass-card overflow-hidden border border-white/10 bg-[linear-gradient(160deg,rgba(7,14,30,0.95)_0%,rgba(12,20,39,0.9)_48%,rgba(9,16,33,0.96)_100%)] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.42)] backdrop-blur-xl md:p-8">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                            {level === 0 && (
                                <div className="mb-6 h-1.5 w-20 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
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
                                style={{ borderImage: 'linear-gradient(to bottom, rgba(245,158,11,0.32), rgba(249,115,22,0.2), rgba(244,63,94,0.08)) 1' }}
                            >
                                {section.subSections.map((sub) => renderSection(sub, level + 1))}
                            </div>
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    };

    return (
        <div className="py-8">
            {/* Module intro header */}
            <header className="mb-10 overflow-hidden rounded-[1.5rem] border border-amber-400/20 bg-[linear-gradient(145deg,rgba(6,11,24,0.94)_0%,rgba(13,22,42,0.9)_60%,rgba(7,14,30,0.94)_100%)] p-6 shadow-[0_24px_55px_rgba(2,6,23,0.42)] backdrop-blur-xl md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-amber-400/25 bg-amber-400/[0.10] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200">
                        System Core
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                        Production Mode
                    </span>
                </div>
                <h1 className="mt-5 font-outfit text-4xl font-black tracking-tight text-slate-100 md:text-6xl md:leading-[1.02]">
                    Welcome to{' '}
                    <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                        Module 4
                    </span>
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
                    <span className="font-bold text-slate-100">Systems Mastery &amp; Professional Integration.</span>{' '}
                    Build the operating judgment needed to evaluate, govern, and scale AI systems beyond demos and into durable real-world deployments.
                </p>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {operatingPillars.map((pillar) => (
                        <div key={pillar} className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 backdrop-blur-sm">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-300">Pillar</p>
                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-100">{pillar}</p>
                        </div>
                    ))}
                </div>

                {/* Part 1 badge */}
                <div className="mt-7 flex items-center gap-3">
                    <div className="flex items-center gap-3 rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-4 py-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-amber-300">Part 1 — Systems Engineering &amp; Operational Excellence</span>
                    </div>
                </div>
            </header>

            <div className="space-y-0">
                {sections.map((section) => renderSection(section))}
            </div>
        </div>
    );
};

export default MainContent;
