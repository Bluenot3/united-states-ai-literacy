import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface Note {
    id: string;
    title: string;
    content: string;
    lastModified: Date;
}

const Notebook: React.FC = () => {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Load notes from localStorage on mount
    useEffect(() => {
        if (!user) return;
        const savedNotes = localStorage.getItem(`pioneer_notes_${user.email}`);
        if (savedNotes) {
            try {
                const parsed = JSON.parse(savedNotes);
                // Convert date strings back to Date objects
                const hydratedDetails = parsed.map((n: any) => ({
                    ...n,
                    lastModified: new Date(n.lastModified)
                }));
                setNotes(hydratedDetails);
                if (hydratedDetails.length > 0) {
                    setActiveNoteId(hydratedDetails[0].id);
                }
            } catch (e) {
                console.error("Failed to load notes", e);
            }
        } else {
            // Create default welcome note
            const welcomeNote: Note = {
                id: crypto.randomUUID(),
                title: 'Mission Log 001',
                content: 'Welcome to your Pioneer Field Notebook.\n\nUse this secure terminal to record observations, mission data, and hypothesis tracking.\n\n// COMMANDS:\n- Create new logs via the + button\n- Data is encrypted locally\n- Access restricted to Pioneer clearance level',
                lastModified: new Date()
            };
            setNotes([welcomeNote]);
            setActiveNoteId(welcomeNote.id);
        }
    }, [user]);

    // Save to localStorage whenever notes change
    useEffect(() => {
        if (!user || notes.length === 0) return;
        setIsSaving(true);
        const timeout = setTimeout(() => {
            localStorage.setItem(`pioneer_notes_${user.email}`, JSON.stringify(notes));
            setIsSaving(false);
        }, 1000); // Debounce save
        return () => clearTimeout(timeout);
    }, [notes, user]);

    const handleCreateNote = () => {
        const newNote: Note = {
            id: crypto.randomUUID(),
            title: 'New Entry',
            content: '',
            lastModified: new Date()
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    };

    const handleDeleteNote = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const updated = notes.filter(n => n.id !== id);
        setNotes(updated);
        if (activeNoteId === id) {
            setActiveNoteId(updated.length > 0 ? updated[0].id : null);
        }
    };

    const updateNote = (id: string, updates: Partial<Note>) => {
        setNotes(current => current.map(note =>
            note.id === id
                ? { ...note, ...updates, lastModified: new Date() }
                : note
        ));
    };

    const activeNote = notes.find(n => n.id === activeNoteId);
    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl h-full flex flex-col overflow-hidden shadow-2xl">
            {/* Toolbar */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-brand-primary to-cyan-500 rounded-lg shadow-lg shadow-brand-primary/20">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span className="font-bold tracking-wide text-white">TERABYTE <span className="text-cyan-400 font-normal">NOTES</span></span>
                </div>

                <div className="flex items-center gap-4">
                    <span className={`text-xs font-mono transition-colors ${isSaving ? 'text-cyan-400 animate-pulse' : 'text-gray-500'}`}>
                        {isSaving ? 'SYNCING...' : 'ENCRYPTED & SAVED'}
                    </span>
                    <button
                        onClick={handleCreateNote}
                        className="p-2 hover:bg-white/10 rounded-lg text-cyan-400 transition-colors border border-cyan-500/30 hover:border-cyan-400"
                        title="New Entry"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar (Note List) */}
                <div className="w-64 border-r border-white/10 flex flex-col bg-black/20">
                    <div className="p-4 border-b border-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search logs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder-gray-600"
                            />
                            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {filteredNotes.length === 0 ? (
                            <div className="text-center py-8 text-gray-600 text-xs uppercase tracking-widest">No Logs Found</div>
                        ) : (
                            filteredNotes.map(note => (
                                <div
                                    key={note.id}
                                    onClick={() => setActiveNoteId(note.id)}
                                    className={`group p-3 rounded-xl cursor-pointer transition-all border ${activeNoteId === note.id
                                        ? 'bg-brand-primary/20 border-brand-primary/30 shadow-lg shadow-brand-primary/10'
                                        : 'hover:bg-white/5 border-transparent hover:border-white/5'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className={`font-bold text-sm truncate ${activeNoteId === note.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                            {note.title || 'Untitled Entry'}
                                        </h3>
                                        <button
                                            onClick={(e) => handleDeleteNote(e, note.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-all text-gray-600"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-600 truncate font-mono">
                                        {note.lastModified.toLocaleDateString()} • {note.lastModified.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col bg-white/[0.02]">
                    {activeNote ? (
                        <>
                            <input
                                type="text"
                                value={activeNote.title}
                                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                                placeholder="Entry Title..."
                                className="w-full bg-transparent border-b border-white/5 px-8 py-6 text-2xl font-bold text-white placeholder-gray-700 focus:outline-none focus:border-cyan-500/30 transition-colors bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"
                            />
                            <textarea
                                value={activeNote.content}
                                onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                                className="flex-1 w-full bg-transparent p-8 text-gray-300 placeholder-gray-700 focus:outline-none resize-none font-mono text-sm leading-relaxed custom-scrollbar"
                                placeholder="// Init observation protocol..."
                                spellCheck={false}
                            />
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-600 gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium">Select a log entry or initialize new file</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notebook;
