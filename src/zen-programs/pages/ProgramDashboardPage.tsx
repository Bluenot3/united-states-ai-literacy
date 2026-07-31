import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useArsenal } from '../../contexts/ArsenalContext';
import { getCurriculumByProgramId } from '../curriculum';
import StudioMediaBlock from '../components/StudioMediaBlocks';
import { getRegistryProgramIdForProgramKey, toProgramKey } from '../programIntegrationContract';
import { getProgramById } from '../programsRegistry';
import PioneerDashboardPage from '../pioneer/PioneerDashboardPage';
import {
    LearningConceptVisualizer,
    MiniOrbit,
    ProgramLaunchIntro,
    SectionLearningCockpit,
    ShellMetric,
    SignalRail,
    electricFrame,
    findModuleForSection,
    findSection,
    firstLeafForModule,
    flattenSections,
    getConceptMissionPods,
    getLeafSections,
    getSectionSummary,
    headingLift,
    highlightToneClass,
    missionPanel,
    missionPanelSoft,
    moduleThemes,
    renderHighlightedText,
    renderPioneerInteractive,
    repaired,
    repairedList,
    sectionActions,
    textLift,
    toneDotClass,
    type ConceptMissionPod,
} from '../pioneer/pioneerKit';
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

const SharedProgramDashboard: React.FC = () => {
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
    const learnItems = currentSection.content.filter((item) => ['heading', 'paragraph', 'quote', 'list', 'callout', 'image', 'video', 'embed', 'html', 'divider'].includes(item.type));
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

        if (item.type === 'image' || item.type === 'video' || item.type === 'embed' || item.type === 'html' || item.type === 'divider') {
            return <StudioMediaBlock key={`${item.type}-${index}`} item={item} variant="dark" />;
        }

        return null;
    };

    const renderNativeResource = (item: ProgramResourceContentItem) => (
        renderPioneerInteractive(item, () => markResourceExplored(item.title))
    );

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
                            {program.icon}
                        </span>
                        <div className="min-w-0 text-center sm:text-left">
                            <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-cyan-50 ${textLift}`}>{program.name}</p>
                            <h1 className={`truncate text-lg font-black tracking-tight text-white sm:text-xl ${headingLift}`}>{repaired(program.spotlight)}</h1>
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
                                    <h2 className={`mt-1 text-xl font-black text-white ${headingLift}`}>
                                        {curriculum.sections.length} modules / {leafSections.length} sections
                                    </h2>
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

/**
 * The AI Pioneer Program runs on its own mission-console experience; every
 * other program keeps the shared dashboard above. The split lives in a thin
 * wrapper so hook order stays stable when the route param changes.
 */
const ProgramDashboardPage: React.FC = () => {
    const { programId: routeProgramId } = useParams<{ programId: string }>();
    const resolvedId = useMemo(() => {
        if (!routeProgramId) {
            return '';
        }

        if (getProgramById(routeProgramId)) {
            return routeProgramId;
        }

        const programKey = toProgramKey(routeProgramId);
        return programKey ? getRegistryProgramIdForProgramKey(programKey) : routeProgramId;
    }, [routeProgramId]);

    if (resolvedId === 'pioneer') {
        return <PioneerDashboardPage />;
    }

    return <SharedProgramDashboard />;
};

export default ProgramDashboardPage;
