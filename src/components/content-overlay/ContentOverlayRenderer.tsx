import React from 'react';
import type { ContentOverride } from '../../services/contentOverrides';
import ContentBlockRenderer from './ContentBlockRenderer';
import { useEditMode } from './EditModeContext';
import BlockEditorModal from './BlockEditorModal';

// ---------------------------------------------------------------------------
// SectionOverlay — wraps a curriculum section. If no overrides exist and edit
// mode is off, it renders exactly its children (visually identical to before).
// ---------------------------------------------------------------------------
export interface SectionOverlayProps {
    sectionId: string;
    before?: ContentOverride[];
    after?: ContentOverride[];
    replace?: ContentOverride[];
    hide?: ContentOverride[];
    children: React.ReactNode;
}

export const SectionOverlay: React.FC<SectionOverlayProps> = ({
    sectionId,
    before = [],
    after = [],
    replace = [],
    hide = [],
    children,
}) => {
    const { editMode, isAdmin, programId, moduleId, openEditor } = useEditMode();
    const isHidden = hide.some((h) => h.is_published) || (isAdmin && hide.length > 0);
    const hasHideRow = hide.length > 0;
    const hasReplace = replace.length > 0;

    // For students: if hidden or replaced, we skip the original children.
    const showOriginalToStudents = !isHidden && !hasReplace;

    return (
        <>
            {before.map((b) => (
                <div key={b.id} className="mb-6">
                    <AdminBlockWrap override={b}>
                        <ContentBlockRenderer override={b} isAdminView={isAdmin} />
                    </AdminBlockWrap>
                </div>
            ))}

            {editMode && (
                <SectionToolbar
                    label={`Section: ${sectionId}`}
                    onAddBefore={() => openEditor({ programId, moduleId, sectionId, position: 'before' })}
                    onAddAfter={() => openEditor({ programId, moduleId, sectionId, position: 'after' })}
                    onReplace={() => openEditor({ programId, moduleId, sectionId, position: 'replace' })}
                    onHide={() => openEditor({ programId, moduleId, sectionId, position: 'hide' })}
                    hidden={hasHideRow}
                />
            )}

            {/* Original curriculum content:
                - students: render only if not hidden and not replaced
                - admins in edit mode: still render, struck-through if hidden / replaced */}
            {(showOriginalToStudents || (isAdmin && editMode)) && (
                <div className={editMode && (isHidden || hasReplace) ? 'relative opacity-40 grayscale' : ''}>
                    {editMode && (isHidden || hasReplace) && (
                        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                            <span className="rounded-full border border-amber-400/60 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-amber-300">
                                {hasReplace ? 'Replaced by admin' : 'Hidden by admin'}
                            </span>
                        </div>
                    )}
                    {children}
                </div>
            )}

            {/* Full replacement content (rendered instead of the original for students) */}
            {replace.map((r) => (
                <div key={r.id} className="mb-14">
                    <AdminBlockWrap override={r}>
                        <ContentBlockRenderer override={r} isAdminView={isAdmin} />
                    </AdminBlockWrap>
                </div>
            ))}

            {after.map((a) => (
                <div key={a.id} className="mb-14">
                    <AdminBlockWrap override={a}>
                        <ContentBlockRenderer override={a} isAdminView={isAdmin} />
                    </AdminBlockWrap>
                </div>
            ))}
        </>
    );
};

const AdminBlockWrap: React.FC<{ override: ContentOverride; children: React.ReactNode }> = ({
    override,
    children,
}) => {
    const { editMode, openEditor, programId, moduleId } = useEditMode();
    if (!editMode) return <>{children}</>;
    return (
        <div className="relative">
            <div className="absolute -top-3 right-3 z-10 flex gap-1">
                <button
                    onClick={() =>
                        openEditor({
                            programId,
                            moduleId,
                            sectionId: override.section_id,
                            position: override.position === 'append_module' ? 'append_module' : (override.position as any),
                            existingOverrideId: override.id,
                        })
                    }
                    className="rounded-full border border-zen-gold/60 bg-black/70 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-zen-gold backdrop-blur hover:bg-zen-gold hover:text-zen-navy"
                >
                    Edit
                </button>
            </div>
            {children}
        </div>
    );
};

// ---------------------------------------------------------------------------
// AppendedSections — render admin-authored bonus sections at end of module
// ---------------------------------------------------------------------------
export const AppendedSections: React.FC<{ blocks: ContentOverride[] }> = ({ blocks }) => {
    const { isAdmin } = useEditMode();
    if (blocks.length === 0) return null;
    return (
        <div className="mt-14 space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zen-gold/40 to-transparent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-zen-gold/70">Bonus · Admin sections</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zen-gold/40 to-transparent" />
            </div>
            {blocks.map((b) => (
                <AdminBlockWrap key={b.id} override={b}>
                    <ContentBlockRenderer override={b} isAdminView={isAdmin} />
                </AdminBlockWrap>
            ))}
        </div>
    );
};

// ---------------------------------------------------------------------------
// SectionToolbar
// ---------------------------------------------------------------------------
const SectionToolbar: React.FC<{
    label: string;
    onAddBefore: () => void;
    onAddAfter: () => void;
    onReplace: () => void;
    onHide: () => void;
    hidden: boolean;
}> = ({ label, onAddBefore, onAddAfter, onReplace, onHide, hidden }) => (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-zen-gold/40 bg-zen-gold/[0.04] px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-zen-gold/80">{label}</span>
        <div className="ml-auto flex flex-wrap gap-1">
            <ToolbarBtn onClick={onAddBefore}>+ Before</ToolbarBtn>
            <ToolbarBtn onClick={onAddAfter}>+ After</ToolbarBtn>
            <ToolbarBtn onClick={onReplace}>Replace</ToolbarBtn>
            <ToolbarBtn onClick={onHide}>{hidden ? 'Manage hide' : 'Hide'}</ToolbarBtn>
        </div>
    </div>
);

const ToolbarBtn: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-semibold text-slate-200 hover:border-zen-gold/60 hover:text-zen-gold"
    >
        {children}
    </button>
);

// ---------------------------------------------------------------------------
// ModuleEditControls — floating "Edit Content" toggle + [+ Add section]
// + editor host. Renders nothing for non-admins.
// ---------------------------------------------------------------------------
export const ModuleEditControls: React.FC<{ rowsById: Map<string, ContentOverride> }> = ({ rowsById }) => {
    const { isAdmin, editMode, setEditMode, openEditor, programId, moduleId, editorState } = useEditMode();
    if (!isAdmin) return null;

    const existing = editorState?.existingOverrideId
        ? rowsById.get(editorState.existingOverrideId) ?? null
        : null;

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                {editMode && (
                    <button
                        onClick={() => openEditor({ programId, moduleId, sectionId: null, position: 'append_module' })}
                        className="zen-glass rounded-full border border-zen-gold/50 bg-black/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-zen-gold shadow-lg backdrop-blur hover:bg-zen-gold hover:text-zen-navy"
                    >
                        + Add section
                    </button>
                )}
                <button
                    onClick={() => setEditMode(!editMode)}
                    className={`zen-glass rounded-full border px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] shadow-2xl backdrop-blur transition ${
                        editMode
                            ? 'border-zen-gold/70 bg-zen-gold text-zen-navy'
                            : 'border-zen-gold/40 bg-black/70 text-zen-gold hover:bg-zen-gold/10'
                    }`}
                >
                    {editMode ? 'Exit edit mode' : 'Edit content'}
                </button>
            </div>
            {editorState && <BlockEditorModal existing={existing} />}
        </>
    );
};
