import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getCurriculumByProgramId } from '../curriculum';
import { getAccentClasses, getProgramById } from '../programsRegistry';
import { getProgramProgress, saveProgramProgress, type ProgramContentItem, type ProgramSection } from '../types';
import { repairContent, repairText } from '../../utils/text';

const flattenSections = (sections: ProgramSection[]): ProgramSection[] => (
    sections.reduce<ProgramSection[]>((allSections, section) => {
        allSections.push(section);

        if (section.subSections) {
            allSections.push(...flattenSections(section.subSections));
        }

        return allSections;
    }, [])
);

const findSection = (sections: ProgramSection[], sectionId: string): ProgramSection | null => {
    for (const section of sections) {
        if (section.id === sectionId) {
            return section;
        }

        if (section.subSections) {
            const nestedSection = findSection(section.subSections, sectionId);

            if (nestedSection) {
                return nestedSection;
            }
        }
    }

    return null;
};

const ProgramDashboardPage: React.FC = () => {
    const { programId } = useParams<{ programId: string }>();
    const program = programId ? getProgramById(programId) : undefined;
    const curriculum = programId ? getCurriculumByProgramId(programId) : undefined;
    const colors = program ? getAccentClasses(program.accentColor) : null;
    const [activeSection, setActiveSection] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [progress, setProgress] = useState(() => (
        programId ? getProgramProgress(programId) : { completedSections: [], lastViewedSection: '', startedAt: null }
    ));

    const allSections = useMemo(() => (
        curriculum ? flattenSections(curriculum.sections) : []
    ), [curriculum]);

    useEffect(() => {
        if (!programId) {
            return;
        }

        const storedProgress = getProgramProgress(programId);
        setProgress(storedProgress);

        if (!curriculum?.sections.length) {
            return;
        }

        setActiveSection(storedProgress.lastViewedSection || curriculum.sections[0].id);
    }, [curriculum, programId]);

    useEffect(() => {
        if (!programId || !activeSection) {
            return;
        }

        if (progress.completedSections.includes(activeSection)) {
            return;
        }

        const nextProgress = {
            ...progress,
            completedSections: [...progress.completedSections, activeSection],
            lastViewedSection: activeSection,
            startedAt: progress.startedAt || new Date().toISOString(),
        };

        setProgress(nextProgress);
        saveProgramProgress(programId, activeSection);
    }, [activeSection, progress, programId]);

    if (!programId || !program) {
        return <Navigate to="/hub" replace />;
    }

    if (program.id === 'vanguard') {
        return <Navigate to="/dashboard" replace />;
    }

    if (!curriculum) {
        return (
            <div className="min-h-screen bg-zen-navy flex items-center justify-center px-5 text-center text-white">
                <div>
                    <h1 className="text-3xl font-bold">Curriculum coming soon</h1>
                    <p className="mt-4 text-slate-300">The content for {program.name} is still being assembled.</p>
                    <Link to="/hub" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-zen-gold to-zen-gold-light px-5 py-3 text-sm font-semibold text-zen-navy">
                        Back to Program Hub
                    </Link>
                </div>
            </div>
        );
    }

    const currentSection = findSection(curriculum.sections, activeSection) ?? curriculum.sections[0];
    const currentIndex = allSections.findIndex((section) => section.id === currentSection.id);
    const previousSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
    const nextSection = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;
    const progressPercent = allSections.length > 0 ? Math.round((progress.completedSections.length / allSections.length) * 100) : 0;

    const renderContentItem = (item: ProgramContentItem, index: number) => {
        const repairedContent = repairContent(item.content);

        if (item.type === 'heading') {
            return (
                <h3 key={`${item.type}-${index}`} className="mt-8 text-xl font-bold text-white first:mt-0">
                    {repairText(repairedContent as string)}
                </h3>
            );
        }

        if (item.type === 'paragraph') {
            return (
                <p key={`${item.type}-${index}`} className="mt-4 text-sm leading-8 text-slate-300 first:mt-0">
                    {repairText(repairedContent as string)}
                </p>
            );
        }

        if (item.type === 'quote') {
            return (
                <blockquote key={`${item.type}-${index}`} className={`mt-6 rounded-2xl border-l-4 ${colors?.border} bg-zen-gold/[0.03] p-5 text-sm leading-8 text-slate-300`}>
                    {repairText(repairedContent as string)}
                </blockquote>
            );
        }

        if (item.type === 'list') {
            return (
                <ul key={`${item.type}-${index}`} className="mt-4 space-y-3">
                    {(repairedContent as string[]).map((listItem) => (
                        <li key={listItem} className="flex items-start gap-3 text-sm leading-8 text-slate-300">
                            <span className={`mt-3 h-2 w-2 rounded-full ${colors?.bg}`} />
                            <span>{repairText(listItem)}</span>
                        </li>
                    ))}
                </ul>
            );
        }

        return null;
    };

    const renderSectionButton = (section: ProgramSection, depth = 0) => {
        const isActive = activeSection === section.id;
        const isCompleted = progress.completedSections.includes(section.id);

        return (
            <div key={section.id}>
                <button
                    type="button"
                    onClick={() => {
                        setActiveSection(section.id);
                        setIsSidebarOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex w-full items-center gap-3 rounded-[1.3rem] border px-4 py-3 text-left transition duration-300 ${
                        isActive
                            ? 'border-zen-gold/20 bg-zen-gold/[0.06] text-white shadow-[inset_0_1px_0_rgba(201,168,76,0.08)]'
                            : 'border-transparent text-slate-400 hover:border-zen-gold/10 hover:bg-zen-gold/[0.03] hover:text-white'
                    } ${depth > 0 ? 'ml-4 text-sm' : ''}`}
                >
                    <span className={`inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                        isActive
                            ? 'bg-zen-gold/[0.1] text-zen-gold'
                            : isCompleted
                                ? 'bg-zen-emerald/20 text-zen-emerald'
                                : 'bg-white/[0.04] text-slate-500'
                    }`}>
                        {isCompleted ? '✓' : depth > 0 ? '·' : '›'}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">{repairText(section.title)}</span>
                </button>

                {section.subSections && (
                    <div className="mt-1 space-y-1">
                        {section.subSections.map((subSection) => renderSectionButton(subSection, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_80%_60%_at_15%_20%,_rgba(201,168,76,0.06),_transparent_50%),linear-gradient(180deg,_#020617_0%,_#0A1628_48%,_#060B18_100%)]">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 border-b border-zen-gold/10 bg-[linear-gradient(180deg,rgba(6,11,24,0.96)_0%,rgba(15,23,42,0.92)_100%)] backdrop-blur-2xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
                    <div className="min-w-0">
                        <Link to="/hub" className="text-xs font-semibold uppercase tracking-[0.3em] text-zen-gold/60 transition hover:text-zen-gold">
                            ← Back to Program Hub
                        </Link>
                        <div className="mt-2 flex items-center gap-3">
                            <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${colors?.gradient} text-sm font-bold text-white shadow-[0_12px_26px_rgba(0,0,0,0.3)]`}>
                                {program.icon}
                            </span>
                            <div className="min-w-0">
                                <h1 className="truncate text-xl font-bold text-white sm:text-2xl">{program.name}</h1>
                                <p className="text-sm text-slate-400">{program.spotlight}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden rounded-[1.35rem] border border-zen-gold/15 bg-zen-surface/80 px-4 py-3 text-right shadow-zen-card backdrop-blur-xl sm:block">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/70">Progress</p>
                            <p className={`mt-1 text-2xl font-black ${colors?.text}`}>{progressPercent}%</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen((previousState) => !previousState)}
                            className="inline-flex rounded-2xl border border-zen-gold/15 bg-zen-gold/[0.06] px-4 py-3 text-sm font-semibold text-zen-gold transition hover:bg-zen-gold/[0.1] lg:hidden"
                        >
                            Sections
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-zen-surface">
                    <div
                        className={`h-full bg-gradient-to-r ${colors?.gradient} transition-all duration-1000`}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
                {/* Info cards */}
                <div className="mb-8 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-[1.6rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card backdrop-blur-xl">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/60">Audience</p>
                        <p className="mt-3 text-sm leading-7 text-slate-300">{program.audience}</p>
                    </div>
                    <div className="rounded-[1.6rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card backdrop-blur-xl">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/60">Outcomes</p>
                        <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-300">
                            {program.outcomes.slice(0, 2).map((outcome) => (
                                <li key={outcome}>{outcome}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-[1.6rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card backdrop-blur-xl">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/60">Starter steps</p>
                        <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-300">
                            {program.starterSteps.slice(0, 2).map((step) => (
                                <li key={step}>{step}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Main content area */}
                <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
                    {/* Sidebar */}
                    <aside className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
                        <div className="rounded-[1.75rem] border border-zen-gold/10 bg-zen-surface/60 p-5 shadow-zen-card backdrop-blur-xl lg:sticky lg:top-32">
                            <h2 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Sections</h2>
                            <div className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto pr-1">
                                {curriculum.sections.map((section) => renderSectionButton(section))}
                            </div>
                        </div>
                    </aside>

                    {/* Article content */}
                    <main className="space-y-6">
                        <article className="rounded-[1.9rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card backdrop-blur-xl sm:p-8">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className={`inline-flex rounded-full bg-gradient-to-r ${colors?.gradient} px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white`}>
                                    {program.level}
                                </span>
                                <span className="rounded-full border border-zen-gold/15 bg-zen-gold/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-zen-gold/80">
                                    {program.duration}
                                </span>
                            </div>

                            <h2 className="mt-5 text-3xl font-black tracking-tight text-white">
                                {repairText(currentSection.title)}
                            </h2>

                            <div className="mt-6 space-y-4">
                                {currentSection.content.map((item, index) => renderContentItem(item, index))}
                            </div>
                        </article>

                        {/* Skills and next actions */}
                        <section className="rounded-[1.9rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card backdrop-blur-xl sm:p-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/60">Skills covered</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {program.skills.map((skill) => (
                                            <span key={skill} className="rounded-full border border-zen-gold/10 bg-zen-gold/[0.04] px-3 py-2 text-sm text-slate-300">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/60">Next actions</p>
                                    <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                                        {program.starterSteps.map((step) => (
                                            <li key={step} className="flex items-start gap-3">
                                                <span className={`mt-3 h-2 w-2 rounded-full ${colors?.bg}`} />
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Navigation */}
                        <div className="flex items-center justify-between gap-4 rounded-[1.75rem] border border-zen-gold/10 bg-zen-surface/60 p-5 shadow-zen-card backdrop-blur-xl">
                            {previousSection ? (
                                <button
                                    type="button"
                                    onClick={() => { setActiveSection(previousSection.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="rounded-full border border-zen-gold/15 bg-zen-gold/[0.06] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-zen-gold/[0.1]"
                                >
                                    ← Previous
                                </button>
                            ) : <span />}

                            {nextSection ? (
                                <button
                                    type="button"
                                    onClick={() => { setActiveSection(nextSection.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className={`rounded-full bg-gradient-to-r ${colors?.gradient} px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:opacity-90`}
                                >
                                    Next section →
                                </button>
                            ) : (
                                <div className={`rounded-full bg-gradient-to-r ${colors?.gradient} px-5 py-3 text-sm font-semibold text-white`}>
                                    ✓ Course complete
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProgramDashboardPage;
