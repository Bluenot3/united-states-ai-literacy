import React, { useEffect, useMemo, useRef, useState } from 'react';
import { curriculumRegistry } from '../curriculum';
import type {
    ProgramCalloutContentItem,
    ProgramCodeContentItem,
    ProgramContentItem,
    ProgramEmbedContentItem,
    ProgramHtmlContentItem,
    ProgramLabContentItem,
    ProgramMediaContentItem,
    ProgramResourceContentItem,
    ProgramSection,
    ProgramTextContentItem,
} from '../types';
import {
    createStudioId,
    emptyProgramOverride,
    exportStudioJson,
    getProgramOverride,
    importStudioJson,
    loadStudioState,
    resetProgramOverride,
    saveStudioState,
    type ProgramStudioOverride,
    type StudioBlock,
    type StudioState,
} from '../curriculumStudioStore';
import StudioMediaBlock from '../components/StudioMediaBlocks';
import SmartCodeBlock from '../components/SmartCodeBlock';
import {
    loadCurriculumStudioDraft,
    publishCurriculumStudio,
    saveCurriculumStudioDraft,
} from '../curriculumStudioRemote';

type BlockTypeId = 'heading' | 'paragraph' | 'list' | 'quote' | 'callout' | 'code' | 'resource' | 'lab' | 'image' | 'video' | 'embed' | 'html' | 'divider';

const blockPalette: Array<{ type: BlockTypeId; label: string; hint: string; glyph: string }> = [
    { type: 'heading', label: 'Heading', hint: 'Section sub-title', glyph: 'H' },
    { type: 'paragraph', label: 'Text', hint: 'Lesson paragraph', glyph: '¶' },
    { type: 'list', label: 'List', hint: 'Bullet points', glyph: '≡' },
    { type: 'quote', label: 'Quote', hint: 'Highlighted quote', glyph: '“”' },
    { type: 'callout', label: 'Callout', hint: 'Info / success / warning', glyph: '!' },
    { type: 'code', label: 'Code', hint: 'Code snippet', glyph: '<>' },
    { type: 'resource', label: 'Tool / resource', hint: 'Link, embed, or interactive activity', glyph: 'R' },
    { type: 'lab', label: 'Build lab', hint: 'Hands-on assignment and reflection', glyph: 'L' },
    { type: 'image', label: 'Image', hint: 'Image from URL', glyph: '🖼' },
    { type: 'video', label: 'Video', hint: 'YouTube, Vimeo, Loom, MP4', glyph: '▶' },
    { type: 'embed', label: 'Embed / URL', hint: 'Any page in an iframe', glyph: '🌐' },
    { type: 'html', label: 'HTML', hint: 'Interactive HTML + JS (sandboxed)', glyph: '{ }' },
    { type: 'divider', label: 'Divider', hint: 'Visual separator', glyph: '—' },
];

const createBlockItem = (type: BlockTypeId): ProgramContentItem => {
    switch (type) {
        case 'heading': return { type: 'heading', content: 'New heading' };
        case 'paragraph': return { type: 'paragraph', content: '' };
        case 'list': return { type: 'list', content: [''] };
        case 'quote': return { type: 'quote', content: '' };
        case 'callout': return { type: 'callout', title: 'Heads up', tone: 'info', content: [''] };
        case 'code': return { type: 'code', title: '', language: '', content: '' };
        case 'resource': return { type: 'resource', title: 'New tool', href: '', content: '', status: 'Ready', embed: false, instructions: [''], completionHint: '' };
        case 'lab': return { type: 'lab', id: createStudioId('lab'), title: 'New build lab', objective: '', steps: [''], expectedOutput: '', reflectionPrompt: '' };
        case 'image': return { type: 'image', src: '', alt: '', caption: '' };
        case 'video': return { type: 'video', src: '', caption: '' };
        case 'embed': return { type: 'embed', url: '', title: '', height: 480 };
        case 'html': return { type: 'html', title: '', content: '', height: 360 };
        case 'divider': return { type: 'divider' };
    }
};

const blockTypeLabel = (type: string) => blockPalette.find((entry) => entry.type === type)?.label ?? type;

const inputClass = 'w-full rounded-xl border border-zen-gold/15 bg-[#07101f] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-zen-gold/40 transition-colors';
const labelClass = 'mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-zen-gold/60';
const monoClass = `${inputClass} font-mono text-xs leading-5`;

interface NavEntry {
    id: string;
    title: string;
    icon?: string;
    depth: number;
    isModule: boolean;
    custom: boolean;
}

const buildNavEntries = (sections: ProgramSection[]): NavEntry[] => {
    const entries: NavEntry[] = [];
    sections.forEach((section) => {
        entries.push({
            id: section.id,
            title: section.title,
            icon: section.icon,
            depth: 0,
            isModule: Boolean(section.subSections?.length),
            custom: false,
        });
        section.subSections?.forEach((sub) => {
            entries.push({ id: sub.id, title: sub.title, icon: sub.icon, depth: 1, isModule: false, custom: false });
        });
    });
    return entries;
};

const snippetOf = (item: ProgramContentItem): string => {
    if ('content' in item && item.content) {
        const text = Array.isArray(item.content) ? item.content.join(' · ') : String(item.content);
        return text.length > 110 ? `${text.slice(0, 110)}…` : text;
    }
    if (item.type === 'resource' || item.type === 'lab') return item.title;
    if (item.type === 'image' || item.type === 'video') return item.src || '(no URL yet)';
    if (item.type === 'embed') return item.url || '(no URL yet)';
    return '';
};

const CurriculumStudio: React.FC = () => {
    const programIds = useMemo(() => Object.keys(curriculumRegistry), []);
    const [programId, setProgramId] = useState(programIds[0] ?? 'pioneer');
    const [state, setState] = useState<StudioState>(() => loadStudioState());
    const [savedAt, setSavedAt] = useState<Date | null>(null);
    const [publishedAt, setPublishedAt] = useState<Date | null>(null);
    const [remoteReadyProgram, setRemoteReadyProgram] = useState<string | null>(null);
    const [remoteSaving, setRemoteSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [showBaseline, setShowBaseline] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const baseCurriculum = curriculumRegistry[programId];
    const override = getProgramOverride(state, programId);
    const serializedOverride = useMemo(() => JSON.stringify(override), [override]);

    useEffect(() => {
        let active = true;
        setRemoteReadyProgram(null);
        setStatusMessage('Loading the shared Supabase draft…');

        void loadCurriculumStudioDraft(programId)
            .then((remoteDocument) => {
                if (!active) return;
                if (remoteDocument) {
                    setState((previous) => {
                        const next = { ...previous, [programId]: remoteDocument };
                        saveStudioState(next);
                        return next;
                    });
                    setStatusMessage('Shared Supabase draft loaded. Changes here are visible to other admins.');
                } else {
                    setStatusMessage('No shared draft yet. Your existing local draft will become the first Supabase draft.');
                }
                setRemoteReadyProgram(programId);
            })
            .catch((error) => {
                console.warn('Curriculum Studio Supabase draft could not be loaded.', error);
                if (active) {
                    setStatusMessage('Supabase draft unavailable. Local backup remains safe; publishing is paused until connection returns.');
                }
            });

        return () => {
            active = false;
        };
    }, [programId]);

    useEffect(() => {
        if (remoteReadyProgram !== programId) return;

        const timer = window.setTimeout(() => {
            setRemoteSaving(true);
            void saveCurriculumStudioDraft(programId, JSON.parse(serializedOverride) as ProgramStudioOverride)
                .then(() => setSavedAt(new Date()))
                .catch((error) => {
                    console.warn('Curriculum Studio Supabase autosave failed.', error);
                    setStatusMessage('Supabase autosave failed. The local backup is still intact.');
                })
                .finally(() => setRemoteSaving(false));
        }, 700);

        return () => window.clearTimeout(timer);
    }, [programId, remoteReadyProgram, serializedOverride]);

    const navEntries = useMemo(() => {
        const entries = baseCurriculum ? buildNavEntries(baseCurriculum.sections).map((entry) => ({
            ...entry,
            title: override.sectionTitles[entry.id]?.trim() || entry.title,
        })) : [];
        override.customSections.forEach((custom) => {
            entries.push({ id: custom.id, title: custom.title, icon: custom.icon, depth: 0, isModule: false, custom: true });
        });
        return entries;
    }, [baseCurriculum, override.customSections, override.sectionTitles]);

    const [activeSectionId, setActiveSectionId] = useState<string>(() => navEntries[0]?.id ?? '');
    const activeEntry = navEntries.find((entry) => entry.id === activeSectionId) ?? navEntries[0];
    const activeId = activeEntry?.id ?? '';
    const blocks = override.sectionBlocks[activeId] ?? [];

    const findBaseSection = (sections: ProgramSection[], id: string): ProgramSection | null => {
        for (const section of sections) {
            if (section.id === id) return section;
            if (section.subSections) {
                const found = findBaseSection(section.subSections, id);
                if (found) return found;
            }
        }
        return null;
    };
    const baseSection = baseCurriculum && activeEntry && !activeEntry.custom
        ? findBaseSection(baseCurriculum.sections, activeId)
        : null;

    const commit = (mutator: (draft: ProgramStudioOverride) => void) => {
        setState((previous) => {
            const next: StudioState = JSON.parse(JSON.stringify(previous));
            const draft = next[programId] ?? (next[programId] = emptyProgramOverride());
            draft.sectionBlocks = draft.sectionBlocks ?? {};
            draft.customSections = draft.customSections ?? [];
            draft.sectionModes = draft.sectionModes ?? {};
            draft.sectionTitles = draft.sectionTitles ?? {};
            mutator(draft);
            saveStudioState(next);
            setSavedAt(new Date());
            return next;
        });
    };

    const addBlock = (type: BlockTypeId) => {
        const block: StudioBlock = { id: createStudioId(), item: createBlockItem(type) };
        commit((draft) => {
            draft.sectionBlocks[activeId] = [...(draft.sectionBlocks[activeId] ?? []), block];
        });
    };

    const updateBlock = (blockId: string, item: ProgramContentItem) => {
        commit((draft) => {
            draft.sectionBlocks[activeId] = (draft.sectionBlocks[activeId] ?? []).map((block) => (
                block.id === blockId ? { ...block, item } : block
            ));
        });
    };

    const removeBlock = (blockId: string) => {
        commit((draft) => {
            draft.sectionBlocks[activeId] = (draft.sectionBlocks[activeId] ?? []).filter((block) => block.id !== blockId);
        });
    };

    const moveBlock = (blockId: string, direction: -1 | 1) => {
        commit((draft) => {
            const list = [...(draft.sectionBlocks[activeId] ?? [])];
            const index = list.findIndex((block) => block.id === blockId);
            const target = index + direction;
            if (index < 0 || target < 0 || target >= list.length) return;
            [list[index], list[target]] = [list[target], list[index]];
            draft.sectionBlocks[activeId] = list;
        });
    };

    const addCustomSection = () => {
        const id = createStudioId('sec');
        commit((draft) => {
            draft.customSections.push({ id, title: 'New custom section', icon: '🧩' });
        });
        setActiveSectionId(id);
    };

    const renameCustomSection = (id: string, title: string) => {
        commit((draft) => {
            draft.customSections = draft.customSections.map((section) => (
                section.id === id ? { ...section, title } : section
            ));
        });
    };

    const removeCustomSection = (id: string) => {
        if (!window.confirm('Delete this custom section and all of its blocks?')) return;
        commit((draft) => {
            draft.customSections = draft.customSections.filter((section) => section.id !== id);
            delete draft.sectionBlocks[id];
        });
        setActiveSectionId(navEntries.find((entry) => entry.id !== id)?.id ?? '');
    };

    const handleExport = () => {
        const blob = new Blob([exportStudioJson()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `zen-curriculum-studio-${new Date().toISOString().slice(0, 10)}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
        setStatusMessage('Backup exported. Keep it safe — it contains every Studio edit.');
    };

    const handleImportFile = async (file: File) => {
        try {
            const next = importStudioJson(await file.text());
            setState(next);
            setSavedAt(new Date());
            setStatusMessage('Backup imported. All Studio content restored.');
        } catch {
            setStatusMessage('Import failed — that file is not a valid Curriculum Studio backup.');
        }
    };

    const handleResetProgram = () => {
        if (!window.confirm(`Remove ALL Studio content for "${baseCurriculum?.title ?? programId}"? The built-in curriculum is never affected.`)) return;
        setState(resetProgramOverride(programId));
        setSavedAt(new Date());
        setStatusMessage('Studio content for this program cleared.');
    };

    const editBuiltInSection = () => {
        if (!baseSection) return;
        commit((draft) => {
            const additions = draft.sectionBlocks[activeId] ?? [];
            draft.sectionModes[activeId] = 'replace';
            draft.sectionTitles[activeId] = draft.sectionTitles[activeId] || baseSection.title;
            draft.sectionBlocks[activeId] = [
                ...baseSection.content.map((item) => ({
                    id: createStudioId('base'),
                    item: JSON.parse(JSON.stringify(item)) as ProgramContentItem,
                })),
                ...additions,
            ];
        });
        setShowBaseline(false);
    };

    const restoreBuiltInSection = () => {
        if (!window.confirm("Restore the shipped section? This removes this section's Studio replacement and additions after you publish.")) return;
        commit((draft) => {
            delete draft.sectionModes[activeId];
            delete draft.sectionTitles[activeId];
            delete draft.sectionBlocks[activeId];
        });
    };

    const handlePublish = async () => {
        if (remoteReadyProgram !== programId) {
            setStatusMessage('Wait for the Supabase draft to finish loading before publishing.');
            return;
        }

        setPublishing(true);
        try {
            await publishCurriculumStudio(programId, override);
            const published = new Date();
            setPublishedAt(published);
            setSavedAt(published);
            setStatusMessage('Published to Supabase. Learners will receive this version on their next curriculum load.');
        } catch (error) {
            console.warn('Curriculum Studio publish failed.', error);
            setStatusMessage('Publish failed. The shared draft and local backup remain safe.');
        } finally {
            setPublishing(false);
        }
    };

    const totalBlocks = Object.values(override.sectionBlocks).reduce((sum, list) => sum + (list?.length ?? 0), 0);

    const renderBlockEditor = (block: StudioBlock, index: number) => {
        const { item } = block;
        const set = (next: ProgramContentItem) => updateBlock(block.id, next);

        let fields: React.ReactNode = null;
        if (item.type === 'heading' || item.type === 'paragraph' || item.type === 'quote') {
            const textItem = item as ProgramTextContentItem;
            fields = item.type === 'heading' ? (
                <input className={inputClass} value={textItem.content as string} placeholder="Heading text" onChange={(e) => set({ ...textItem, content: e.target.value })} />
            ) : (
                <textarea className={inputClass} rows={3} value={textItem.content as string} placeholder={item.type === 'quote' ? 'Quote text' : 'Write the lesson text students will read…'} onChange={(e) => set({ ...textItem, content: e.target.value })} />
            );
        } else if (item.type === 'list') {
            const listItem = item as ProgramTextContentItem;
            const lines = Array.isArray(listItem.content) ? listItem.content : [String(listItem.content)];
            fields = (
                <div>
                    <label className={labelClass}>One bullet per line</label>
                    <textarea className={inputClass} rows={4} value={lines.join('\n')} onChange={(e) => set({ ...listItem, content: e.target.value.split('\n') })} />
                </div>
            );
        } else if (item.type === 'callout') {
            const callout = item as ProgramCalloutContentItem;
            const lines = Array.isArray(callout.content) ? callout.content : [String(callout.content)];
            fields = (
                <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
                        <div>
                            <label className={labelClass}>Title</label>
                            <input className={inputClass} value={callout.title ?? ''} onChange={(e) => set({ ...callout, title: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Tone</label>
                            <select className={inputClass} value={callout.tone ?? 'info'} onChange={(e) => set({ ...callout, tone: e.target.value as ProgramCalloutContentItem['tone'] })}>
                                <option value="info">Info (blue)</option>
                                <option value="success">Success (green)</option>
                                <option value="warning">Warning (amber)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Body — one line per row</label>
                        <textarea className={inputClass} rows={3} value={lines.join('\n')} onChange={(e) => set({ ...callout, content: e.target.value.split('\n') })} />
                    </div>
                </div>
            );
        } else if (item.type === 'code') {
            const code = item as ProgramCodeContentItem;
            fields = (
                <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>Title (optional)</label>
                            <input className={inputClass} value={code.title ?? ''} onChange={(e) => set({ ...code, title: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Language (optional)</label>
                            <input className={inputClass} value={code.language ?? ''} placeholder="Leave blank to auto-detect" onChange={(e) => set({ ...code, language: e.target.value })} />
                        </div>
                    </div>
                    <textarea className={monoClass} rows={6} value={code.content} placeholder="Paste code here" onChange={(e) => set({ ...code, content: e.target.value })} />
                </div>
            );
        } else if (item.type === 'resource') {
            const resource = item as ProgramResourceContentItem;
            const content = Array.isArray(resource.content) ? resource.content.join('\n') : resource.content ?? '';
            fields = (
                <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>Tool title</label>
                            <input className={inputClass} value={resource.title} onChange={(e) => set({ ...resource, title: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>URL (optional)</label>
                            <input className={inputClass} value={resource.href ?? ''} placeholder="https://..." onChange={(e) => set({ ...resource, href: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>What learners should know</label>
                        <textarea className={inputClass} rows={3} value={content} onChange={(e) => set({ ...resource, content: e.target.value })} />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>Why it matters</label>
                            <textarea className={inputClass} rows={3} value={resource.why ?? ''} onChange={(e) => set({ ...resource, why: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Completion hint</label>
                            <textarea className={inputClass} rows={3} value={resource.completionHint ?? ''} onChange={(e) => set({ ...resource, completionHint: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Instructions - one step per line</label>
                        <textarea className={inputClass} rows={4} value={(resource.instructions ?? []).join('\n')} onChange={(e) => set({ ...resource, instructions: e.target.value.split('\n') })} />
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                        <input type="checkbox" checked={resource.embed === true} onChange={(e) => set({ ...resource, embed: e.target.checked })} />
                        Embed the URL inside the lesson
                    </label>
                    {resource.interactive && (
                        <p className="rounded-lg border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-2 text-xs text-cyan-100">
                            Native interactive: {resource.interactive}. Its code-backed behavior remains connected while you edit its lesson copy.
                        </p>
                    )}
                </div>
            );
        } else if (item.type === 'lab') {
            const lab = item as ProgramLabContentItem;
            fields = (
                <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>Lab title</label>
                            <input className={inputClass} value={lab.title} onChange={(e) => set({ ...lab, title: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Stable lab ID</label>
                            <input className={inputClass} value={lab.id} onChange={(e) => set({ ...lab, id: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Objective</label>
                        <textarea className={inputClass} rows={3} value={lab.objective} onChange={(e) => set({ ...lab, objective: e.target.value })} />
                    </div>
                    <div>
                        <label className={labelClass}>Steps - one per line</label>
                        <textarea className={inputClass} rows={5} value={lab.steps.join('\n')} onChange={(e) => set({ ...lab, steps: e.target.value.split('\n') })} />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>Expected output</label>
                            <textarea className={inputClass} rows={3} value={lab.expectedOutput} onChange={(e) => set({ ...lab, expectedOutput: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Reflection prompt</label>
                            <textarea className={inputClass} rows={3} value={lab.reflectionPrompt ?? ''} onChange={(e) => set({ ...lab, reflectionPrompt: e.target.value })} />
                        </div>
                    </div>
                </div>
            );
        } else if (item.type === 'image' || item.type === 'video') {
            const media = item as ProgramMediaContentItem;
            fields = (
                <div className="space-y-3">
                    <div>
                        <label className={labelClass}>{item.type === 'image' ? 'Image URL' : 'Video URL (YouTube, Vimeo, Loom or direct .mp4)'}</label>
                        <input className={inputClass} value={media.src} placeholder="https://…" onChange={(e) => set({ ...media, src: e.target.value })} />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {item.type === 'image' && (
                            <div>
                                <label className={labelClass}>Alt text (accessibility)</label>
                                <input className={inputClass} value={media.alt ?? ''} onChange={(e) => set({ ...media, alt: e.target.value })} />
                            </div>
                        )}
                        <div>
                            <label className={labelClass}>Caption (optional)</label>
                            <input className={inputClass} value={media.caption ?? ''} onChange={(e) => set({ ...media, caption: e.target.value })} />
                        </div>
                    </div>
                </div>
            );
        } else if (item.type === 'embed') {
            const embed = item as ProgramEmbedContentItem;
            fields = (
                <div className="space-y-3">
                    <div>
                        <label className={labelClass}>URL to embed (iframe)</label>
                        <input className={inputClass} value={embed.url} placeholder="https://… (Hugging Face Space, Figma, form, site…)" onChange={(e) => set({ ...embed, url: e.target.value })} />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>Label (optional)</label>
                            <input className={inputClass} value={embed.title ?? ''} onChange={(e) => set({ ...embed, title: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Height (px)</label>
                            <input className={inputClass} type="number" min={160} value={embed.height ?? 480} onChange={(e) => set({ ...embed, height: Number(e.target.value) || 480 })} />
                        </div>
                    </div>
                </div>
            );
        } else if (item.type === 'html') {
            const html = item as ProgramHtmlContentItem;
            fields = (
                <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>Label (optional)</label>
                            <input className={inputClass} value={html.title ?? ''} onChange={(e) => set({ ...html, title: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Height (px)</label>
                            <input className={inputClass} type="number" min={120} value={html.height ?? 360} onChange={(e) => set({ ...html, height: Number(e.target.value) || 360 })} />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>HTML + CSS + JS — runs sandboxed, scripts allowed</label>
                        <textarea className={monoClass} rows={8} value={html.content} placeholder={'<div>\n  <button onclick="alert(\'It works!\')">Try me</button>\n</div>'} onChange={(e) => set({ ...html, content: e.target.value })} />
                    </div>
                </div>
            );
        } else if (item.type === 'divider') {
            fields = <p className="text-xs text-slate-500">Visual divider — no settings needed.</p>;
        }

        const showPreview = ['code', 'image', 'video', 'embed', 'html', 'divider'].includes(item.type);

        return (
            <article key={block.id} className="rounded-[1.4rem] border border-zen-gold/10 bg-zen-navy/55 p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-zen-gold/20 bg-zen-gold/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zen-gold">
                        {blockTypeLabel(item.type)}
                    </span>
                    <div className="flex items-center gap-1">
                        <button type="button" title="Move up" disabled={index === 0} onClick={() => moveBlock(block.id, -1)} className="h-8 w-8 rounded-lg border border-white/10 text-slate-400 transition hover:text-white disabled:opacity-30">↑</button>
                        <button type="button" title="Move down" disabled={index === blocks.length - 1} onClick={() => moveBlock(block.id, 1)} className="h-8 w-8 rounded-lg border border-white/10 text-slate-400 transition hover:text-white disabled:opacity-30">↓</button>
                        <button type="button" title="Delete block" onClick={() => removeBlock(block.id)} className="h-8 w-8 rounded-lg border border-red-400/20 text-red-400/80 transition hover:bg-red-500/10 hover:text-red-300">✕</button>
                    </div>
                </div>
                {fields}
                {showPreview && (
                    <div className="mt-4 border-t border-white/8 pt-4">
                        <p className={labelClass}>Live preview</p>
                        {item.type === 'code'
                            ? <SmartCodeBlock code={item.content} language={item.language} title={item.title} />
                            : <StudioMediaBlock item={item} variant="dark" />}
                    </div>
                )}
            </article>
        );
    };

    if (!baseCurriculum) {
        return <div className="p-8 text-slate-300">No curriculum found.</div>;
    }

    return (
        <div className="min-h-screen bg-zen-navy px-5 py-8 text-white sm:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <section className="rounded-[2rem] border border-zen-gold/12 bg-zen-surface/70 p-6 shadow-zen-card backdrop-blur-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-zen-gold/70">Admin · Content</p>
                            <h1 className="mt-2 text-3xl font-black tracking-tight">Curriculum Studio</h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-400">
                                Add lesson content to any program section — text, images, video, live embeds, even interactive HTML.
                                Append new blocks or use Edit existing section to replace, reorder, or remove content. The shipped version always stays recoverable.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => void handlePublish()}
                                disabled={publishing || remoteReadyProgram !== programId}
                                className="rounded-full border border-emerald-300/35 bg-emerald-400/[0.12] px-4 py-2 text-sm font-bold text-emerald-200 transition hover:bg-emerald-400/[0.2] disabled:cursor-wait disabled:opacity-50"
                            >
                                {publishing ? 'Publishing…' : 'Publish to learners'}
                            </button>
                            <button type="button" onClick={handleExport} className="rounded-full border border-zen-gold/20 bg-zen-gold/[0.08] px-4 py-2 text-sm font-semibold text-zen-gold transition hover:bg-zen-gold/[0.15]">Export JSON</button>
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]">Import</button>
                            <button type="button" onClick={handleResetProgram} className="rounded-full border border-red-400/25 bg-red-500/[0.06] px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/[0.12]">Reset program</button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/json"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) void handleImportFile(file);
                                    e.target.value = '';
                                }}
                            />
                        </div>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <div>
                            <label className={labelClass}>Program</label>
                            <select
                                value={programId}
                                onChange={(e) => {
                                    setProgramId(e.target.value);
                                    const first = curriculumRegistry[e.target.value]?.sections[0];
                                    setActiveSectionId(first?.subSections?.[0]?.id ?? first?.id ?? '');
                                }}
                                className={`${inputClass} w-auto min-w-[220px]`}
                            >
                                {programIds.map((id) => (
                                    <option key={id} value={id}>{curriculumRegistry[id].title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="ml-auto flex items-center gap-3 text-xs text-slate-400">
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">{totalBlocks} Studio block{totalBlocks === 1 ? '' : 's'} in this program</span>
                            <span className={`rounded-full px-3 py-1.5 ${savedAt ? 'border border-emerald-300/25 bg-emerald-400/[0.08] text-emerald-300' : 'border border-white/10 bg-white/[0.04]'}`}>
                                {remoteSaving ? 'Saving to Supabase…' : savedAt ? `Supabase saved ${savedAt.toLocaleTimeString()}` : 'Supabase autosave on'}
                            </span>
                            {publishedAt && <span className="rounded-full border border-cyan-300/25 bg-cyan-400/[0.08] px-3 py-1.5 text-cyan-200">Published {publishedAt.toLocaleTimeString()}</span>}
                        </div>
                    </div>
                    {statusMessage && (
                        <p className="mt-4 rounded-xl border border-sky-300/20 bg-sky-400/[0.08] px-4 py-2.5 text-sm text-sky-200">{statusMessage}</p>
                    )}
                </section>

                <div className="mt-5 grid gap-5 lg:grid-cols-[300px_1fr]">
                    {/* Section navigator */}
                    <aside className="h-fit rounded-[1.6rem] border border-zen-gold/10 bg-zen-surface/60 p-4 shadow-zen-card lg:sticky lg:top-6">
                        <div className="flex items-center justify-between gap-2 px-1">
                            <p className={labelClass}>Sections</p>
                            <button type="button" onClick={addCustomSection} className="rounded-lg border border-zen-gold/20 bg-zen-gold/[0.08] px-2.5 py-1 text-xs font-semibold text-zen-gold transition hover:bg-zen-gold/[0.15]">+ Section</button>
                        </div>
                        <nav className="mt-2 max-h-[60vh] space-y-0.5 overflow-y-auto pr-1">
                            {navEntries.map((entry) => {
                                const count = override.sectionBlocks[entry.id]?.length ?? 0;
                                const isActive = entry.id === activeId;
                                return (
                                    <button
                                        key={entry.id}
                                        type="button"
                                        onClick={() => setActiveSectionId(entry.id)}
                                        className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${entry.depth === 1 ? 'ml-3 w-[calc(100%-0.75rem)]' : ''} ${isActive ? 'border border-zen-gold/25 bg-zen-gold/15 text-zen-gold' : 'border border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <span className="shrink-0 text-base leading-none">{entry.icon || (entry.custom ? '🧩' : entry.isModule ? '📦' : '📄')}</span>
                                        <span className="min-w-0 flex-1 truncate font-medium">{entry.title}</span>
                                        {entry.custom && <span className="shrink-0 rounded-full border border-purple-300/25 bg-purple-400/[0.12] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-200">New</span>}
                                        {count > 0 && <span className="shrink-0 rounded-full bg-zen-gold/20 px-1.5 py-0.5 text-[10px] font-bold text-zen-gold">{count}</span>}
                                    </button>
                                );
                            })}
                        </nav>
                        <p className="mt-3 border-t border-white/8 px-1 pt-3 text-[11px] leading-5 text-slate-500">
                            Drafts autosave to Supabase and remain invisible to learners until you choose
                            <span className="text-slate-300"> Publish to learners</span>. Export JSON remains an offline backup.
                        </p>
                    </aside>

                    {/* Editor */}
                    <main className="min-w-0 space-y-5">
                        {activeEntry && (
                            <section className="rounded-[1.6rem] border border-zen-gold/10 bg-zen-surface/60 p-5 shadow-zen-card">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <p className={labelClass}>{activeEntry.custom ? 'Custom section (added by you)' : activeEntry.isModule ? 'Module overview' : 'Section'}</p>
                                        {activeEntry.custom ? (
                                            <input
                                                className={`${inputClass} mt-1 max-w-md text-lg font-bold`}
                                                value={activeEntry.title}
                                                onChange={(e) => renameCustomSection(activeEntry.id, e.target.value)}
                                                placeholder="Section title"
                                            />
                                        ) : override.sectionModes[activeId] === 'replace' ? (
                                            <input
                                                className={`${inputClass} mt-1 max-w-xl text-lg font-bold`}
                                                value={override.sectionTitles[activeId] ?? activeEntry.title}
                                                onChange={(e) => commit((draft) => { draft.sectionTitles[activeId] = e.target.value; })}
                                                placeholder="Section title"
                                            />
                                        ) : (
                                            <h2 className="mt-1 truncate text-xl font-black text-white">{activeEntry.title}</h2>
                                        )}
                                    </div>
                                    {activeEntry.custom && (
                                        <button type="button" onClick={() => removeCustomSection(activeEntry.id)} className="rounded-full border border-red-400/25 bg-red-500/[0.06] px-3.5 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/[0.12]">
                                            Delete section
                                        </button>
                                    )}
                                </div>

                                {baseSection && override.sectionModes[activeId] !== 'replace' && (
                                    <div className="mt-4 rounded-[1.2rem] border border-white/8 bg-zen-navy/50">
                                        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                                            <button type="button" onClick={() => setShowBaseline((v) => !v)} className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left text-sm text-slate-300">
                                                <span>Shipped content — {baseSection.content.length} block{baseSection.content.length === 1 ? '' : 's'}</span>
                                                <span className={`transition-transform ${showBaseline ? 'rotate-180' : ''}`}>▾</span>
                                            </button>
                                            <button type="button" onClick={editBuiltInSection} className="rounded-full border border-cyan-300/25 bg-cyan-300/[0.08] px-3 py-1.5 text-xs font-bold text-cyan-100">
                                                Edit existing section
                                            </button>
                                        </div>
                                        {showBaseline && (
                                            <div className="space-y-1.5 border-t border-white/8 px-4 py-3">
                                                {baseSection.content.map((item, i) => (
                                                    <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                                        <span className="mt-0.5 shrink-0 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">{item.type}</span>
                                                        <span className="min-w-0 flex-1 truncate">{snippetOf(item)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {baseSection && override.sectionModes[activeId] === 'replace' && (
                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-3">
                                        <p className="text-sm font-semibold text-emerald-100">Editing the complete section. Publishing replaces the shipped blocks for learners; progress IDs stay intact.</p>
                                        <button type="button" onClick={restoreBuiltInSection} className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-slate-200">
                                            Restore shipped section
                                        </button>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Blocks */}
                        <section className="space-y-4">
                            {blocks.length === 0 ? (
                                <div className="rounded-[1.6rem] border border-dashed border-zen-gold/20 bg-zen-surface/40 p-8 text-center">
                                    <p className="text-2xl">📝</p>
                                    <p className="mt-2 font-bold text-white">No Studio blocks here yet</p>
                                    <p className="mt-1 text-sm text-slate-400">Pick a block type below to add the first piece of content to this section.</p>
                                </div>
                            ) : (
                                blocks.map((block, index) => renderBlockEditor(block, index))
                            )}
                        </section>

                        {/* Add block palette */}
                        <section className="rounded-[1.6rem] border border-zen-gold/10 bg-zen-surface/60 p-5 shadow-zen-card">
                            <p className={labelClass}>Add a block</p>
                            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                                {blockPalette.map((entry) => (
                                    <button
                                        key={entry.type}
                                        type="button"
                                        onClick={() => addBlock(entry.type)}
                                        className="group rounded-xl border border-white/10 bg-zen-navy/50 p-3 text-left transition hover:-translate-y-0.5 hover:border-zen-gold/30 hover:bg-zen-gold/[0.06]"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-zen-gold/20 bg-zen-gold/[0.08] text-xs font-black text-zen-gold">{entry.glyph}</span>
                                            <span className="text-sm font-bold text-white">{entry.label}</span>
                                        </div>
                                        <p className="mt-1.5 text-[11px] leading-4 text-slate-500 group-hover:text-slate-400">{entry.hint}</p>
                                    </button>
                                ))}
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CurriculumStudio;
