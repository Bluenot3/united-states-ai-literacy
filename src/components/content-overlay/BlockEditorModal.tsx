import React, { useEffect, useMemo, useState } from 'react';
import type {
    ContentOverride,
    OverrideBlockType,
    OverridePosition,
} from '../../services/contentOverrides';
import { deleteOverride, upsertOverride } from '../../services/contentOverrides';
import { notifyContentOverridesChanged } from '../../hooks/useContentOverrides';
import ContentBlockRenderer from './ContentBlockRenderer';
import { useEditMode } from './EditModeContext';

interface Props {
    existing?: ContentOverride | null;
}

const BLOCK_TYPES: { value: OverrideBlockType; label: string; hint: string }[] = [
    { value: 'rich_text', label: 'Rich text / Markdown', hint: 'Formatted lesson copy, notes, or intros.' },
    { value: 'embed_url', label: 'Embed URL (iframe)', hint: 'Any URL — ZEN Arena, tools, forms, dashboards.' },
    { value: 'video', label: 'Video', hint: 'YouTube, Vimeo, Loom, or direct MP4 URL.' },
    { value: 'image', label: 'Image', hint: 'Diagram, screenshot, or photo URL.' },
    { value: 'html', label: 'Custom HTML (sandboxed)', hint: 'Interactive widget — runs inside a sandboxed iframe.' },
    { value: 'link_card', label: 'Link card', hint: 'External resource — opens in a new tab.' },
    { value: 'divider', label: 'Divider', hint: 'Section break with optional label.' },
];

const BlockEditorModal: React.FC<Props> = ({ existing }) => {
    const { editorState, closeEditor, programId, moduleId } = useEditMode();
    const [blockType, setBlockType] = useState<OverrideBlockType>('rich_text');
    const [payload, setPayload] = useState<Record<string, any>>({});
    const [sortOrder, setSortOrder] = useState<number>(0);
    const [isPublished, setIsPublished] = useState(false);
    const [saving, setSaving] = useState(false);

    // Initialise fields when opening
    useEffect(() => {
        if (!editorState) return;
        if (existing) {
            setBlockType(existing.block_type);
            setPayload(existing.payload ?? {});
            setSortOrder(existing.sort_order);
            setIsPublished(existing.is_published);
        } else {
            setBlockType('rich_text');
            setPayload({});
            setSortOrder(0);
            setIsPublished(false);
        }
    }, [editorState, existing]);

    const previewOverride = useMemo<ContentOverride>(() => ({
        id: existing?.id ?? 'preview',
        program_id: programId,
        module_id: moduleId,
        section_id: editorState?.sectionId ?? null,
        position: (editorState?.position ?? 'after') as OverridePosition,
        block_type: blockType,
        payload,
        sort_order: sortOrder,
        is_published: isPublished,
        created_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }), [existing?.id, programId, moduleId, editorState, blockType, payload, sortOrder, isPublished]);

    if (!editorState) return null;

    const save = async (publish: boolean) => {
        setSaving(true);
        const saved = await upsertOverride({
            id: existing?.id,
            program_id: editorState.programId,
            module_id: editorState.moduleId,
            section_id: editorState.sectionId,
            position: editorState.position,
            block_type: blockType,
            payload,
            sort_order: sortOrder,
            is_published: publish,
        });
        setSaving(false);
        if (saved) {
            notifyContentOverridesChanged();
            closeEditor();
        } else {
            alert('Could not save. Check the browser console for details.');
        }
    };

    const remove = async () => {
        if (!existing) return;
        if (!confirm('Delete this content block? This cannot be undone.')) return;
        const ok = await deleteOverride(existing.id);
        if (ok) {
            notifyContentOverridesChanged();
            closeEditor();
        }
    };

    const setField = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setPayload((prev) => ({ ...prev, [key]: e.target.value }));

    return (
        <div className="fixed inset-0 z-[100] flex items-stretch justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
            <div className="my-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-zen-gold/20 bg-[#080E1E] shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-zen-gold/80">
                            {existing ? 'Edit content block' : 'Add content block'}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                            {editorState.programId} · {editorState.moduleId}
                            {editorState.sectionId ? ` · section: ${editorState.sectionId}` : ' · module-level'}
                            {` · position: ${editorState.position}`}
                        </p>
                    </div>
                    <button
                        onClick={closeEditor}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5"
                    >
                        Close
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                    {/* Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">Block type</label>
                            <select
                                value={blockType}
                                onChange={(e) => setBlockType(e.target.value as OverrideBlockType)}
                                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                            >
                                {BLOCK_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-slate-500">
                                {BLOCK_TYPES.find((t) => t.value === blockType)?.hint}
                            </p>
                        </div>

                        {(blockType === 'rich_text') && (
                            <TextField label="Markdown" value={payload.markdown ?? ''} onChange={setField('markdown')} multiline rows={10} />
                        )}
                        {blockType === 'html' && (
                            <>
                                <TextField label="Title (optional)" value={payload.title ?? ''} onChange={setField('title')} />
                                <TextField label="HTML" value={payload.html ?? ''} onChange={setField('html')} multiline rows={12} mono />
                                <TextField label="Height (px)" value={payload.height ?? ''} onChange={setField('height')} />
                            </>
                        )}
                        {blockType === 'embed_url' && (
                            <>
                                <TextField label="Title (optional)" value={payload.title ?? ''} onChange={setField('title')} />
                                <TextField label="URL" value={payload.url ?? ''} onChange={setField('url')} />
                                <TextField label="Height (px, optional — defaults 16:9)" value={payload.height ?? ''} onChange={setField('height')} />
                            </>
                        )}
                        {blockType === 'video' && (
                            <>
                                <TextField label="Title (optional)" value={payload.title ?? ''} onChange={setField('title')} />
                                <TextField label="Video URL" value={payload.url ?? ''} onChange={setField('url')} />
                                <TextField label="Caption (optional)" value={payload.caption ?? ''} onChange={setField('caption')} />
                            </>
                        )}
                        {blockType === 'image' && (
                            <>
                                <TextField label="Image URL" value={payload.url ?? ''} onChange={setField('url')} />
                                <TextField label="Alt text" value={payload.alt ?? ''} onChange={setField('alt')} />
                                <TextField label="Caption (optional)" value={payload.caption ?? ''} onChange={setField('caption')} />
                            </>
                        )}
                        {blockType === 'link_card' && (
                            <>
                                <TextField label="Title" value={payload.title ?? ''} onChange={setField('title')} />
                                <TextField label="Description" value={payload.description ?? ''} onChange={setField('description')} multiline rows={3} />
                                <TextField label="URL" value={payload.url ?? ''} onChange={setField('url')} />
                            </>
                        )}
                        {blockType === 'divider' && (
                            <TextField label="Label (optional)" value={payload.label ?? ''} onChange={setField('label')} />
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">Sort order</label>
                                <input
                                    type="number"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
                                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                                />
                            </div>
                            <label className="flex items-end gap-2 pb-2 text-sm text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={isPublished}
                                    onChange={(e) => setIsPublished(e.target.checked)}
                                    className="h-4 w-4"
                                />
                                Published
                            </label>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Live preview</p>
                        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                            <ContentBlockRenderer override={previewOverride} isAdminView />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/30 px-6 py-4">
                    <div>
                        {existing && (
                            <button
                                onClick={remove}
                                disabled={saving}
                                className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                            >
                                Delete block
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={closeEditor}
                            disabled={saving}
                            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => save(false)}
                            disabled={saving}
                            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 disabled:opacity-50"
                        >
                            Save as draft
                        </button>
                        <button
                            onClick={() => save(true)}
                            disabled={saving}
                            className="rounded-lg border border-zen-gold/60 bg-zen-gold px-4 py-2 text-sm font-bold text-zen-navy hover:bg-amber-400 disabled:opacity-50"
                        >
                            Publish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TextField: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    multiline?: boolean;
    rows?: number;
    mono?: boolean;
}> = ({ label, value, onChange, multiline, rows = 4, mono }) => (
    <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</label>
        {multiline ? (
            <textarea
                value={value}
                onChange={onChange}
                rows={rows}
                className={`w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 ${mono ? 'font-mono' : ''}`}
            />
        ) : (
            <input
                type="text"
                value={value}
                onChange={onChange}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            />
        )}
    </div>
);

export default BlockEditorModal;
