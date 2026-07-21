import React, { useEffect, useMemo, useState } from 'react';
import {
    deleteOverride,
    fetchAllOverrides,
    isShippedVanguardQuizId,
    parsePublicQuizPayload,
    removeVanguardQuizOverride,
    setPublished,
    upsertOverride,
    type ContentOverride,
    type OverrideBlockType,
    type OverridePosition,
} from '../services/contentOverrides';

const ALL = '__all__';
const VANGUARD_PROGRAM_ID = 'vanguard';
const VANGUARD_MODULE_IDS = ['module1', 'module2', 'module3', 'module4'];

const AdminContentPage: React.FC = () => {
    const [rows, setRows] = useState<ContentOverride[]>([]);
    const [loading, setLoading] = useState(true);
    const [programFilter, setProgramFilter] = useState<string>(ALL);
    const [moduleFilter, setModuleFilter] = useState<string>(ALL);
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const refresh = async () => {
        setLoading(true);
        const data = await fetchAllOverrides();
        setRows(data);
        setLoading(false);
    };

    useEffect(() => { void refresh(); }, []);

    const programs = useMemo(
        () => Array.from(new Set([VANGUARD_PROGRAM_ID, ...rows.map((r) => r.program_id)])).sort(),
        [rows],
    );
    const modules = useMemo(
        () => Array.from(new Set([...VANGUARD_MODULE_IDS, ...rows.map((r) => r.module_id)])).sort(),
        [rows],
    );

    const filtered = useMemo(() => rows.filter((r) => {
        if (programFilter !== ALL && r.program_id !== programFilter) return false;
        if (moduleFilter !== ALL && r.module_id !== moduleFilter) return false;
        if (statusFilter === 'published' && !r.is_published) return false;
        if (statusFilter === 'draft' && r.is_published) return false;
        return true;
    }), [rows, programFilter, moduleFilter, statusFilter]);

    const togglePublish = async (row: ContentOverride) => {
        await setPublished(row.id, !row.is_published);
        void refresh();
    };

    const remove = async (row: ContentOverride) => {
        if (row.block_type === 'quiz') {
            const quiz = parsePublicQuizPayload(row.payload);
            if (!quiz) {
                alert('This quiz record is invalid and cannot be changed from the generic content table. Open the module editor for a safe repair.');
                return;
            }
            const shipped = isShippedVanguardQuizId(quiz.quiz_id);
            const action = shipped ? 'restore the shipped quiz' : 'remove this custom quiz';
            if (!confirm(`This will ${action} for ${row.module_id}. Continue?`)) return;
            const ok = await removeVanguardQuizOverride(row.id);
            if (!ok) {
                alert('Quiz change failed. Nothing was removed.');
                return;
            }
            void refresh();
            return;
        }
        if (!confirm(`Delete override for ${row.program_id}/${row.module_id}?`)) return;
        const ok = await deleteOverride(row.id);
        if (!ok) {
            alert('Delete failed. Nothing was removed.');
            return;
        }
        void refresh();
    };

    const moduleEditorHref = (row: ContentOverride) => {
        const moduleNumber = row.module_id.match(/(\d+)$/)?.[1];
        const base = moduleNumber ? `/module/${moduleNumber}` : '/admin/content';
        return row.section_id ? `${base}#${encodeURIComponent(row.section_id)}` : base;
    };

    const editing = editingId ? rows.find((r) => r.id === editingId) ?? null : null;

    return (
        <div className="min-h-screen bg-zen-navy p-6 text-slate-100 md:p-10">
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-zen-gold/70">Admin CMS</p>
                    <h1 className="mt-1 text-3xl font-black tracking-tight">Content overlays</h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-400">
                        Add, edit, publish, hide, or replace content across all four Vanguard module pages without code changes.
                        Drafts stay invisible to students until you toggle Published, and modules keep their shipped content when no override exists.
                        Quiz rows use the module editor so their private answer keys and public questions are always published together.
                    </p>
                </div>
                <button
                    onClick={() => setCreating(true)}
                    className="rounded-lg border border-zen-gold/60 bg-zen-gold px-4 py-2 text-sm font-bold text-zen-navy hover:bg-amber-400"
                >
                    + New override
                </button>
            </header>

            <div className="mb-6 flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <FilterSelect label="Program" value={programFilter} onChange={setProgramFilter} options={[ALL, ...programs]} />
                <FilterSelect label="Module" value={moduleFilter} onChange={setModuleFilter} options={[ALL, ...modules]} />
                <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm"
                    >
                        <option value="all">All</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
                <div className="ml-auto self-end text-xs text-slate-500">{filtered.length} of {rows.length}</div>
            </div>

            {loading ? (
                <p className="text-sm text-slate-500">Loading…</p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
                    <table className="w-full text-sm">
                        <thead className="bg-white/[0.03] text-xs uppercase tracking-widest text-slate-400">
                            <tr>
                                <th className="px-4 py-3 text-left">Program</th>
                                <th className="px-4 py-3 text-left">Module</th>
                                <th className="px-4 py-3 text-left">Section</th>
                                <th className="px-4 py-3 text-left">Position</th>
                                <th className="px-4 py-3 text-left">Type</th>
                                <th className="px-4 py-3 text-left">Order</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                                        No overrides yet. Module pages render exactly as coded.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((r) => (
                                <tr key={r.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                                    <td className="px-4 py-3 font-mono text-xs">{r.program_id}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{r.module_id}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{r.section_id ?? '—'}</td>
                                    <td className="px-4 py-3">{r.position}</td>
                                    <td className="px-4 py-3">{r.block_type}</td>
                                    <td className="px-4 py-3">
                                        {r.block_type === 'quiz' ? (
                                            <span
                                                className="inline-flex w-16 justify-center rounded border border-white/10 bg-slate-900/50 px-2 py-1 text-xs text-slate-500"
                                                title="Change quiz placement in the module editor"
                                            >
                                                {r.sort_order}
                                            </span>
                                        ) : (
                                            <input
                                                type="number"
                                                defaultValue={r.sort_order}
                                                onBlur={async (e) => {
                                                    const v = Number(e.target.value) || 0;
                                                    if (v !== r.sort_order) {
                                                        await upsertOverride({ ...r, sort_order: v });
                                                        void refresh();
                                                    }
                                                }}
                                                className="w-16 rounded border border-white/10 bg-slate-900 px-2 py-1 text-xs"
                                            />
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {r.block_type === 'quiz' ? (
                                            <span
                                                className="inline-flex rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300"
                                                title="Quizzes are published atomically from the module editor"
                                            >
                                                Published
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => togglePublish(r)}
                                                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                                                    r.is_published
                                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                                }`}
                                            >
                                                {r.is_published ? 'Published' : 'Draft'}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {r.block_type === 'quiz' ? (
                                            <a href={moduleEditorHref(r)} className="mr-2 text-xs text-zen-gold hover:underline">
                                                Open module editor
                                            </a>
                                        ) : (
                                            <button onClick={() => setEditingId(r.id)} className="mr-2 text-xs text-zen-gold hover:underline">Edit</button>
                                        )}
                                        <button onClick={() => remove(r)} className="text-xs text-red-400 hover:underline">
                                            {r.block_type === 'quiz' && parsePublicQuizPayload(r.payload) && isShippedVanguardQuizId(parsePublicQuizPayload(r.payload)!.quiz_id)
                                                ? 'Restore'
                                                : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {(editing || creating) && (
                <QuickEditor
                    existing={editing}
                    onClose={() => { setEditingId(null); setCreating(false); }}
                    onSaved={() => { setEditingId(null); setCreating(false); void refresh(); }}
                />
            )}
        </div>
    );
};

const FilterSelect: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: string[] }> = ({ label, value, onChange, options }) => (
    <div>
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm">
            {options.map((o) => <option key={o} value={o}>{o === ALL ? 'All' : o}</option>)}
        </select>
    </div>
);

// Minimal editor used only from the CMS table (the in-page editor lives in
// BlockEditorModal). This one covers the essential fields and reuses upsert.
const QuickEditor: React.FC<{
    existing: ContentOverride | null | undefined;
    onClose: () => void;
    onSaved: () => void;
}> = ({ existing, onClose, onSaved }) => {
    const [programId, setProgramId] = useState(existing?.program_id ?? VANGUARD_PROGRAM_ID);
    const [moduleId, setModuleId] = useState(existing?.module_id ?? 'module1');
    const [sectionId, setSectionId] = useState(existing?.section_id ?? '');
    const [position, setPosition] = useState<OverridePosition>(existing?.position ?? 'after');
    const [blockType, setBlockType] = useState<OverrideBlockType>(existing?.block_type ?? 'rich_text');
    const [payloadText, setPayloadText] = useState(JSON.stringify(existing?.payload ?? {}, null, 2));
    const [sortOrder, setSortOrder] = useState<number>(existing?.sort_order ?? 0);
    const [isPublished, setIsPublished] = useState<boolean>(existing?.is_published ?? false);
    const [saving, setSaving] = useState(false);

    const save = async () => {
        setSaving(true);
        let payload: Record<string, any> = {};
        try { payload = JSON.parse(payloadText || '{}'); }
        catch { alert('Payload must be valid JSON.'); setSaving(false); return; }
        const ok = await upsertOverride({
            id: existing?.id,
            program_id: programId,
            module_id: moduleId,
            section_id: sectionId || null,
            position,
            block_type: blockType,
            payload,
            sort_order: sortOrder,
            is_published: isPublished,
        });
        setSaving(false);
        if (ok) onSaved(); else alert('Save failed. Check console.');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-stretch justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
            <div className="my-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-[#080E1E] p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold">{existing ? 'Edit override' : 'New override'}</h2>
                    <button onClick={onClose} className="rounded-lg border border-white/10 px-3 py-1 text-sm">Close</button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <Field label="Program ID"><input value={programId} onChange={(e) => setProgramId(e.target.value)} className="w-full rounded border border-white/10 bg-slate-900 px-2 py-1" /></Field>
                    <Field label="Module ID"><input value={moduleId} onChange={(e) => setModuleId(e.target.value)} className="w-full rounded border border-white/10 bg-slate-900 px-2 py-1" /></Field>
                    <Field label="Section ID (blank for module-level)"><input value={sectionId} onChange={(e) => setSectionId(e.target.value)} className="w-full rounded border border-white/10 bg-slate-900 px-2 py-1" /></Field>
                    <Field label="Position">
                        <select value={position} onChange={(e) => setPosition(e.target.value as OverridePosition)} className="w-full rounded border border-white/10 bg-slate-900 px-2 py-1">
                            {['before','after','replace','hide','append_module'].map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </Field>
                    <Field label="Block type">
                        <select value={blockType} onChange={(e) => setBlockType(e.target.value as OverrideBlockType)} className="w-full rounded border border-white/10 bg-slate-900 px-2 py-1">
                            {['rich_text','embed_url','video','image','html','link_card','divider'].map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </Field>
                    <Field label="Sort order"><input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value) || 0)} className="w-full rounded border border-white/10 bg-slate-900 px-2 py-1" /></Field>
                </div>
                <div className="mt-3">
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Payload (JSON)</label>
                    <textarea value={payloadText} onChange={(e) => setPayloadText(e.target.value)} rows={10} className="w-full rounded border border-white/10 bg-slate-900 px-2 py-1 font-mono text-xs" />
                    <p className="mt-1 text-xs text-slate-500">
                        e.g. rich_text → <code>{'{ "markdown": "..." }'}</code>, video → <code>{'{ "url": "https://youtu.be/..." }'}</code>,
                        html → <code>{'{ "html": "&lt;div&gt;...&lt;/div&gt;", "height": 400 }'}</code>.
                    </p>
                </div>
                <label className="mt-4 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} /> Published
                </label>
                <div className="mt-6 flex justify-end gap-2">
                    <button onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-sm">Cancel</button>
                    <button onClick={save} disabled={saving} className="rounded-lg border border-zen-gold/60 bg-zen-gold px-4 py-2 text-sm font-bold text-zen-navy disabled:opacity-50">
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</label>
        {children}
    </div>
);

export default AdminContentPage;
