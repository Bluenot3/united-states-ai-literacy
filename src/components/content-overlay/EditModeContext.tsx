import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

interface EditModeState {
    isAdmin: boolean;
    editMode: boolean;
    setEditMode: (value: boolean) => void;
    programId: string;
    moduleId: string;
    openEditor: (init: BlockEditorInit) => void;
    editorState: BlockEditorInit | null;
    closeEditor: () => void;
}

export interface BlockEditorInit {
    programId: string;
    moduleId: string;
    sectionId: string | null;
    position: 'before' | 'after' | 'replace' | 'hide' | 'append_module';
    existingOverrideId?: string;
}

const Ctx = createContext<EditModeState | null>(null);

export const EditModeProvider: React.FC<{
    programId: string;
    moduleId: string;
    children: React.ReactNode;
}> = ({ programId, moduleId, children }) => {
    const { isAdminAuthenticated } = useAdmin();
    const [editMode, setEditMode] = useState(false);
    const [editorState, setEditorState] = useState<BlockEditorInit | null>(null);

    useEffect(() => {
        if (!isAdminAuthenticated && editMode) setEditMode(false);
    }, [isAdminAuthenticated, editMode]);

    const openEditor = useCallback((init: BlockEditorInit) => setEditorState(init), []);
    const closeEditor = useCallback(() => setEditorState(null), []);

    const value = useMemo<EditModeState>(() => ({
        isAdmin: isAdminAuthenticated,
        editMode: isAdminAuthenticated && editMode,
        setEditMode,
        programId,
        moduleId,
        openEditor,
        editorState,
        closeEditor,
    }), [isAdminAuthenticated, editMode, programId, moduleId, openEditor, editorState, closeEditor]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useEditMode(): EditModeState {
    const ctx = useContext(Ctx);
    if (!ctx) {
        // Safe default — pages not wrapped by the provider simply behave as before.
        return {
            isAdmin: false,
            editMode: false,
            setEditMode: () => {},
            programId: '',
            moduleId: '',
            openEditor: () => {},
            editorState: null,
            closeEditor: () => {},
        };
    }
    return ctx;
}
