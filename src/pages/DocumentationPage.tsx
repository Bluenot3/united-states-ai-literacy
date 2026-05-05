import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAiClient } from '../lib/aiClient';
import { getVanguardDocById, vanguardDocCategories, vanguardDocs, type VanguardDocument } from '../data/vanguardDocs';

const pageCapabilities = [
    {
        title: 'Fast doc search',
        description: 'Search concepts, workflows, and deployment guidance without leaving Vanguard.',
    },
    {
        title: 'Grounded AI help',
        description: 'Ask the archive copilot to answer from the selected document instead of floating free.',
    },
    {
        title: 'Action-ready playbooks',
        description: 'Jump from docs into the exact module or page where the work happens.',
    },
];

const sectionCardClassName = 'scroll-mt-28 rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.88)_0%,rgba(2,6,23,0.86)_100%)] p-5 shadow-[0_18px_50px_rgba(2,6,23,0.2)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_64px_rgba(2,6,23,0.24)] sm:p-6';

const DocumentationPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState('');
    const [activeSectionId, setActiveSectionId] = useState('');
    const [assistantQuestion, setAssistantQuestion] = useState('');
    const [assistantAnswer, setAssistantAnswer] = useState('');
    const [assistantStatus, setAssistantStatus] = useState<'idle' | 'loading' | 'error'>('idle');
    const [assistantError, setAssistantError] = useState('');

    const filteredDocs = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return vanguardDocs;
        }

        return vanguardDocs.filter((document) => {
            const searchableText = [
                document.title,
                document.summary,
                document.audience,
                document.category,
                document.tags.join(' '),
                document.sections.map((section) => `${section.title} ${section.body}`).join(' '),
            ].join(' ').toLowerCase();

            return searchableText.includes(normalizedQuery);
        });
    }, [query]);

    const activeDocument = useMemo<VanguardDocument | null>(() => {
        const requestedDocId = searchParams.get('doc');
        const requestedDocument = getVanguardDocById(requestedDocId);

        if (requestedDocument && filteredDocs.some((document) => document.id === requestedDocument.id)) {
            return requestedDocument;
        }

        return filteredDocs[0] || null;
    }, [filteredDocs, searchParams]);

    useEffect(() => {
        if (!activeDocument) {
            return;
        }

        const requestedDocId = searchParams.get('doc');
        if (requestedDocId !== activeDocument.id) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.set('doc', activeDocument.id);
            setSearchParams(nextParams, { replace: true });
        }
    }, [activeDocument, searchParams, setSearchParams]);

    useEffect(() => {
        if (!activeDocument) {
            return;
        }

        setActiveSectionId(activeDocument.sections[0]?.id || '');
        setAssistantAnswer('');
        setAssistantError('');
        setAssistantStatus('idle');
    }, [activeDocument?.id]);

    useEffect(() => {
        if (!activeDocument) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

                if (visibleEntry?.target?.id) {
                    setActiveSectionId(visibleEntry.target.id);
                }
            },
            {
                rootMargin: '-18% 0px -58% 0px',
                threshold: [0.2, 0.45, 0.7],
            },
        );

        activeDocument.sections.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [activeDocument]);

    const categoryCounts = useMemo(() => {
        return vanguardDocCategories.map((category) => ({
            category,
            count: filteredDocs.filter((document) => document.category === category).length,
        }));
    }, [filteredDocs]);

    const activeCategory = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return vanguardDocCategories.find((category) => category.toLowerCase() === normalizedQuery) ?? null;
    }, [query]);

    const handleDocSelect = (docId: string) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('doc', docId);
        setSearchParams(nextParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSectionJump = (sectionId: string) => {
        setActiveSectionId(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleAskAssistant = async () => {
        if (!activeDocument || !assistantQuestion.trim()) {
            return;
        }

        setAssistantStatus('loading');
        setAssistantError('');

        const context = activeDocument.sections
            .map((section) => {
                const bullets = section.bullets?.length ? `Bullets: ${section.bullets.join(' | ')}` : '';
                const checklist = section.checklist?.length ? `Checklist: ${section.checklist.join(' | ')}` : '';
                return `## ${section.title}\n${section.body}\n${bullets}\n${checklist}`.trim();
            })
            .join('\n\n');

        try {
            const aiClient = await getAiClient();
            const response = await aiClient.models.generateContent({
                model: 'doc-copilot',
                contents: `Selected document: ${activeDocument.title}\nAudience: ${activeDocument.audience}\nQuestion: ${assistantQuestion}\n\nContext:\n${context}`,
                config: {
                    temperature: 0.25,
                    maxOutputTokens: 800,
                    systemInstruction: [
                        'You are the Vanguard documentation copilot.',
                        'Answer only from the provided documentation context.',
                        'If the context is insufficient, say that clearly and recommend the most relevant next document or module.',
                        'Prefer concise, practical answers with clear next steps.',
                        'This copilot is intended to work well on a lightweight instruct model such as Mistral 7B behind the Vanguard API proxy.',
                    ].join(' '),
                },
            });

            const text = response?.text || response?.response?.text?.() || 'No answer returned.';
            setAssistantAnswer(text);
            setAssistantStatus('idle');
        } catch (error) {
            setAssistantStatus('error');
            setAssistantError(error instanceof Error ? error.message : 'The docs copilot could not answer right now.');
        }
    };

    if (!activeDocument) {
        return (
            <div className="mx-auto max-w-7xl pb-20 lg:pb-8">
                <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
                    <p className="text-lg font-semibold text-slate-900">No documents match that search</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        Clear the filter and try again. Vanguard docs are indexed across foundations, deployment, and operating guidance.
                    </p>
                    <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="mt-5 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        Reset search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-[96rem] space-y-6 pb-20 lg:pb-8">
            <section className="relative overflow-hidden rounded-[2.25rem] border border-white/60 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_22%),radial-gradient(circle_at_75%_22%,_rgba(168,85,247,0.16),_transparent_21%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#082f49_100%)] p-6 text-white shadow-[0_30px_110px_rgba(2,6,23,0.32)] sm:p-8">
                <div className="pointer-events-none absolute inset-0 bg-grid-pattern [--grid-color:rgba(255,255,255,0.08)] [--grid-size:38px]" />
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-[8%] top-8 h-36 w-36 rounded-full bg-cyan-300/14 blur-3xl" />
                    <div className="absolute right-[10%] top-12 h-44 w-44 rounded-full bg-fuchsia-400/12 blur-3xl" />
                </div>

                <div className="relative grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-300">Vanguard Documentation Library</p>
                        <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl sm:leading-[1.02]">
                            Operational docs, deployment playbooks, and a grounded AI copilot in one surface.
                        </h1>
                        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300 sm:text-base">
                            Use this as the reference layer for Vanguard. It explains what you can do, where to do it, how to deploy safely,
                            and how to get unstuck fast without bouncing between course pages. The copilot is optimized for a lightweight
                            instruct model path behind the Vanguard API proxy.
                        </p>

                        <div className="mt-6 grid gap-3 md:grid-cols-3">
                            {pageCapabilities.map((capability) => (
                                <div key={capability.title} className="rounded-[1.4rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.08]">
                                    <p className="text-sm font-bold text-white">{capability.title}</p>
                                    <p className="mt-2 text-sm leading-7 text-slate-300">{capability.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[1.9rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Quick launch</p>
                                <p className="mt-2 text-xl font-bold text-white">{activeDocument.title}</p>
                            </div>
                            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-right">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Reading time</p>
                                <p className="mt-1 text-lg font-bold text-white">{activeDocument.estimatedRead}</p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Use this page when</p>
                            <p className="mt-2 text-sm leading-7 text-slate-200">{activeDocument.summary}</p>
                            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-500">Best for {activeDocument.audience}</p>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {activeDocument.tags.map((tag) => (
                                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.08]">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[19rem_minmax(0,1fr)_17rem]">
                <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
                    <section className="rounded-[2rem] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,248,255,0.88)_100%)] p-4 shadow-[0_18px_52px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Doc index</p>
                                <p className="mt-1 text-lg font-bold text-slate-900">Find what you need fast</p>
                            </div>
                            <div className="rounded-2xl bg-slate-950 px-3 py-2 text-right text-white">
                                <p className="text-lg font-black">{filteredDocs.length}</p>
                                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Docs</p>
                            </div>
                        </div>

                        <label className="mt-4 block">
                            <span className="sr-only">Search Vanguard docs</span>
                            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-inner">
                                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.6-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Search docs, skills, deployments..."
                                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                />
                            </div>
                        </label>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {categoryCounts.map(({ category, count }) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setQuery((currentQuery) => (
                                        currentQuery.trim().toLowerCase() === category.toLowerCase() ? '' : category
                                    ))}
                                    className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition duration-300 hover:-translate-y-0.5 ${
                                        activeCategory === category
                                            ? 'border-cyan-300 bg-slate-950 text-cyan-100 shadow-[0_12px_28px_rgba(8,145,178,0.18)]'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-300 hover:text-cyan-700'
                                    }`}
                                >
                                    {category} <span className="px-1 text-current/60">&middot;</span> {count}
                                </button>
                            ))}
                            {!!query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    className="rounded-full border border-slate-200 bg-slate-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="mt-5 max-h-[30rem] space-y-3 overflow-y-auto pr-1">
                            {vanguardDocCategories.map((category) => {
                                const documentsInCategory = filteredDocs.filter((document) => document.category === category);

                                if (documentsInCategory.length === 0) {
                                    return null;
                                }

                                return (
                                    <div key={category} className="space-y-2">
                                        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">{category}</p>
                                        {documentsInCategory.map((documentDefinition) => {
                                            const isActive = documentDefinition.id === activeDocument.id;

                                            return (
                                                <button
                                                    key={documentDefinition.id}
                                                    type="button"
                                                    onClick={() => handleDocSelect(documentDefinition.id)}
                                                    className={`w-full rounded-[1.35rem] border px-4 py-4 text-left transition ${
                                                        isActive
                                                            ? 'border-cyan-400/30 bg-slate-950 text-white shadow-[0_18px_36px_rgba(8,145,178,0.18)]'
                                                            : 'border-slate-200 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold">{documentDefinition.title}</p>
                                                            <p className={`mt-2 text-xs leading-6 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                                                                {documentDefinition.summary}
                                                            </p>
                                                        </div>
                                                        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${isActive ? 'bg-white/10 text-cyan-200' : 'bg-slate-100 text-slate-500'}`}>
                                                            {documentDefinition.estimatedRead}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_100%)] p-4 text-white shadow-[0_24px_60px_rgba(2,6,23,0.24)]">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Ask Archive AI</p>
                        <p className="mt-2 text-sm leading-7 text-slate-300">
                            Grounded answers from the selected doc. Best with a lightweight instruct model behind the API proxy.
                        </p>
                        <textarea
                            value={assistantQuestion}
                            onChange={(event) => setAssistantQuestion(event.target.value)}
                            placeholder={`Ask about "${activeDocument.title}"`}
                            className="mt-4 min-h-[8rem] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition duration-300 focus:border-cyan-300/40 focus:bg-white/[0.08]"
                        />
                        <button
                            type="button"
                            onClick={handleAskAssistant}
                            disabled={assistantStatus === 'loading' || !assistantQuestion.trim()}
                            className="mt-3 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-4 py-3 text-sm font-bold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                        >
                            {assistantStatus === 'loading' ? 'Thinking...' : 'Ask the docs copilot'}
                        </button>

                        {(assistantAnswer || assistantError) && (
                            <div className={`mt-4 rounded-2xl border p-4 text-sm leading-7 ${assistantError ? 'border-rose-400/20 bg-rose-500/10 text-rose-100' : 'border-white/10 bg-white/[0.04] text-slate-200'}`}>
                                {assistantError || assistantAnswer}
                            </div>
                        )}
                    </section>
                </aside>

                <main className="space-y-6">
                    <section className="rounded-[2rem] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,248,255,0.9)_100%)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="max-w-3xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">{activeDocument.category}</p>
                                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{activeDocument.title}</h2>
                                <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">{activeDocument.summary}</p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-3 lg:max-w-md lg:grid-cols-1">
                                {activeDocument.quickActions.map((action) => (
                                    <Link
                                        key={action.label}
                                        to={action.to}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                                    >
                                        <p className="text-sm font-bold text-slate-900">{action.label}</p>
                                        <p className="mt-1 text-xs leading-6 text-slate-500">{action.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    {activeDocument.sections.map((section, index) => (
                        <section key={section.id} id={section.id} className={sectionCardClassName}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Section {String(index + 1).padStart(2, '0')}</p>
                                    <h3 className="mt-2 text-2xl font-bold text-white sm:text-[1.7rem]">{section.title}</h3>
                                </div>
                                {activeSectionId === section.id && (
                                    <span className="rounded-full border border-cyan-300/30 bg-cyan-300/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                                        Active
                                    </span>
                                )}
                            </div>

                            <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-[0.97rem]">{section.body}</p>

                            {section.bullets && (
                                <div className="mt-5 grid gap-3">
                                    {section.bullets.map((bullet) => (
                                        <div key={bullet} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-slate-950/55 px-4 py-3">
                                            <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                                            <p className="text-sm leading-7 text-slate-200">{bullet}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {section.checklist && (
                                <div className="mt-5 grid gap-3">
                                    {section.checklist.map((item) => (
                                        <div key={item} className="flex items-start gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-500/5 px-4 py-3">
                                            <span className="mt-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300/40 text-emerald-200">
                                                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.415 0l-3.6-3.6a1 1 0 111.414-1.42l2.893 2.894 6.493-6.494a1 1 0 011.415 0z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                            <p className="text-sm leading-7 text-slate-200">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {section.code && (
                                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
                                    <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                                        <p className="text-sm font-semibold text-white">{section.code.title}</p>
                                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                            {section.code.language}
                                        </span>
                                    </div>
                                    <pre className="overflow-x-auto p-4 text-xs leading-6 text-cyan-200">
                                        <code>{section.code.content}</code>
                                    </pre>
                                </div>
                            )}
                        </section>
                    ))}
                </main>

                <aside className="hidden xl:block xl:sticky xl:top-24 xl:self-start">
                    <div className="rounded-[2rem] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,248,255,0.9)_100%)] p-4 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">On this page</p>
                        <p className="mt-2 text-lg font-bold text-slate-900">Jump by section</p>

                        <div className="mt-5 space-y-2">
                            {activeDocument.sections.map((section, index) => {
                                const isActive = activeSectionId === section.id;

                                return (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => handleSectionJump(section.id)}
                                        className={`w-full rounded-2xl px-4 py-3 text-left transition duration-300 ${
                                            isActive
                                                ? 'bg-slate-950 text-white shadow-[0_12px_26px_rgba(15,23,42,0.14)]'
                                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                                        }`}
                                    >
                                        <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${isActive ? 'text-cyan-200' : 'text-slate-400'}`}>
                                            {String(index + 1).padStart(2, '0')}
                                        </p>
                                        <p className="mt-1 text-sm font-semibold">{section.title}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DocumentationPage;
