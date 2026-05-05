import React, { useState, useEffect } from 'react';

interface ToxicFile {
    id: string;
    originalName: string;
    content: string;
    correctName: string;
    correctHeader: string;
    project: string;
    type: string;
    date: string;
    icon: string;
}

const TOXIC_FILES: ToxicFile[] = [
    {
        id: '1',
        originalName: 'meeting notes final v2.docx',
        content: 'Q3 review notes with marketing team discussing campaign performance and quarterly targets...',
        correctName: '2025-10-12_Project-Apollo_Meeting-Notes.md',
        correctHeader: '[PROJECT: Apollo] | [TYPE: Meeting Notes] | [DATE: 2025-10-12]',
        project: 'Apollo',
        type: 'Meeting Notes',
        date: '2025-10-12',
        icon: '📝'
    },
    {
        id: '2',
        originalName: 'Contract FINAL (1).pdf',
        content: 'Legal agreement for Zeus partnership services outlining deliverables and timeline...',
        correctName: '2025-09-28_Project-Zeus_Contract.pdf',
        correctHeader: '[PROJECT: Zeus] | [TYPE: Contract] | [DATE: 2025-09-28]',
        project: 'Zeus',
        type: 'Contract',
        date: '2025-09-28',
        icon: '📄'
    },
    {
        id: '3',
        originalName: 'Untitled Document.txt',
        content: 'Research findings on competitor analysis for Titan project including market positioning...',
        correctName: '2025-11-03_Project-Titan_Research-Analysis.md',
        correctHeader: '[PROJECT: Titan] | [TYPE: Research] | [DATE: 2025-11-03]',
        project: 'Titan',
        type: 'Research',
        date: '2025-11-03',
        icon: '🔬'
    },
    {
        id: '4',
        originalName: 'budget stuff.xlsx',
        content: 'Q4 financial projections and resource allocation spreadsheet with department breakdowns...',
        correctName: '2025-10-30_Project-Apollo_Budget-Q4.xlsx',
        correctHeader: '[PROJECT: Apollo] | [TYPE: Budget] | [DATE: 2025-10-30]',
        project: 'Apollo',
        type: 'Budget',
        date: '2025-10-30',
        icon: '💰'
    }
];

const PROJECTS = ['Apollo', 'Zeus', 'Titan', 'Orion'];
const TYPES = ['Meeting Notes', 'Contract', 'Research', 'Budget', 'Report', 'Proposal'];

export const DigitalJanitorLab: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<ToxicFile | null>(null);
    const [userInput, setUserInput] = useState({ project: '', type: '', date: '', customName: '' });
    const [cleanedFiles, setCleanedFiles] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [score, setScore] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [pulseAnimation, setPulseAnimation] = useState(false);

    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

    const handleCleanFile = () => {
        if (!selectedFile) return;
        setPulseAnimation(true);
        setTimeout(() => setPulseAnimation(false), 300);

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(userInput.date)) {
            setFeedback({ type: 'error', message: '❌ Date must be in ISO format: YYYY-MM-DD' });
            return;
        }

        if (userInput.customName?.includes(' ')) {
            setFeedback({ type: 'error', message: '❌ Filenames must NOT contain spaces. Use hyphens instead.' });
            return;
        }

        const projectMatch = userInput.project === selectedFile.project;
        const typeMatch = userInput.type === selectedFile.type;
        const dateMatch = userInput.date === selectedFile.date;

        if (projectMatch && typeMatch && dateMatch) {
            setFeedback({
                type: 'success',
                message: `✅ Perfect!\n\n📁 ${selectedFile.correctName}\n📋 ${selectedFile.correctHeader}`
            });
            setScore(prev => prev + 25);
            setCleanedFiles(prev => [...prev, selectedFile.id]);
            setShowConfetti(true);
            setTimeout(() => {
                setSelectedFile(null);
                setUserInput({ project: '', type: '', date: '', customName: '' });
                setFeedback(null);
            }, 2500);
        } else {
            const hints = [];
            if (!projectMatch) hints.push('• Check the content for project references');
            if (!typeMatch) hints.push('• Identify the document type from context');
            if (!dateMatch) hints.push('• Look for date clues in the content');
            setFeedback({ type: 'error', message: `❌ Not quite right.\n\n${hints.join('\n')}` });
        }
    };

    const remainingFiles = TOXIC_FILES.filter(f => !cleanedFiles.includes(f.id));
    const isComplete = remainingFiles.length === 0;

    return (
        <div className="relative bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0d1b2a] rounded-3xl p-8 text-white font-sans overflow-hidden shadow-2xl border border-white/5">
            {/* Gradient Orbs */}
            <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-pink-500/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Confetti Effect */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none z-50">
                    {[...Array(30)].map((_, i) => (
                        <div key={i} className="absolute animate-confetti-fall" style={{
                            left: `${Math.random() * 100}%`,
                            top: '-10px',
                            width: '10px',
                            height: '10px',
                            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 4)],
                            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                            animationDuration: `${Math.random() * 1 + 1}s`,
                            animationDelay: `${Math.random() * 0.3}s`
                        }} />
                    ))}
                    <style>{`
            @keyframes confettiFall {
              to { transform: translateY(500px) rotate(720deg); opacity: 0; }
            }
            .animate-confetti-fall {
                animation-name: confettiFall;
                animation-timing-function: ease-out;
                animation-fill-mode: forwards;
            }
          `}</style>
                </div>
            )}

            {/* Header */}
            <div className="relative flex items-center gap-4 mb-7">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-red-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg shadow-amber-500/30">
                    🧹
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-br from-white to-indigo-200 bg-clip-text text-transparent m-0">
                        Digital Janitor Lab
                    </h2>
                    <p className="mt-1 opacity-70 text-sm font-medium">
                        Clean the Toxic Drive using Vanguard Protocols
                    </p>
                </div>

                {/* Score Display */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl text-center shadow-lg">
                    <div className="text-3xl font-extrabold bg-gradient-to-br from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                        {score}%
                    </div>
                    <div className="text-[11px] opacity-60 font-bold tracking-widest uppercase">Cleaned</div>
                </div>
            </div>

            {/* Protocol Card */}
            <div className="bg-white/5 backdrop-blur-xl border-l-4 border-blue-500 rounded-2xl p-5 mb-6 shadow-lg">
                <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-lg">📋</span>
                    <span className="text-sm font-bold text-blue-400">VANGUARD PROTOCOLS</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: '📅', title: 'ISO Dates', example: 'YYYY-MM-DD' },
                        { icon: '🚫', title: 'No Spaces', example: 'Use-Hyphens' },
                        { icon: '🏷️', title: 'Universal Header', example: '[PROJECT] | [TYPE] | [DATE]' }
                    ].map((protocol, i) => (
                        <div key={i} className="p-3 bg-blue-500/10 rounded-xl text-center border border-blue-500/10 hover:bg-blue-500/20 transition-colors">
                            <div className="text-xl mb-1.5">{protocol.icon}</div>
                            <div className="text-xs font-bold mb-1 text-slate-200">{protocol.title}</div>
                            <code className="text-[10px] opacity-70 bg-black/30 px-1.5 py-0.5 rounded font-mono block mx-auto w-fit">{protocol.example}</code>
                        </div>
                    ))}
                </div>
            </div>

            {isComplete ? (
                <div className="text-center py-16 px-10 bg-white/5 backdrop-blur-xl rounded-3xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
                    <div className="text-7xl mb-5 drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">🎉</div>
                    <h3 className="text-3xl font-extrabold bg-gradient-to-br from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-2">
                        Drive Cleaned!
                    </h3>
                    <p className="opacity-70 text-base">All files are now AI-searchable and properly indexed.</p>
                    <div className="mt-6 px-4 py-3 bg-emerald-500/10 rounded-xl inline-block border border-emerald-500/20">
                        <span className="text-sm font-bold text-emerald-400">+15 days/year saved on file retrieval</span>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                    {/* File List */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-base">📁</span>
                            <h4 className="text-sm font-bold tracking-wide text-slate-300">
                                TOXIC FILES <span className="opacity-50 font-normal ml-1">({remainingFiles.length} remaining)</span>
                            </h4>
                        </div>
                        <div className="flex flex-col gap-3">
                            {remainingFiles.map(file => (
                                <div
                                    key={file.id}
                                    onClick={() => {
                                        setSelectedFile(file);
                                        setFeedback(null);
                                        setUserInput({ project: '', type: '', date: '', customName: '' });
                                    }}
                                    className={`
                                        group relative p-4 rounded-2xl cursor-pointer transition-all duration-300
                                        backdrop-blur-md border hover:scale-[1.02]
                                        ${selectedFile?.id === file.id
                                            ? 'bg-rose-500/10 border-rose-500/50 shadow-lg shadow-rose-500/10'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-lg'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                                            {file.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-rose-300 mb-1 truncate group-hover:text-rose-200 transition-colors">
                                                ⚠️ {file.originalName}
                                            </div>
                                            <div className="text-xs opacity-50 font-light truncate">
                                                {file.content}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cleaning Panel */}
                    <div className={`
                        bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10
                        transition-all duration-200
                        ${pulseAnimation ? 'scale-[1.01] shadow-2xl shadow-blue-500/20' : ''}
                    `}>
                        {selectedFile ? (
                            <>
                                <div className="flex items-center gap-3 mb-5 border-b border-white/5 pb-4">
                                    <span className="text-2xl animate-bounce-custom">{selectedFile.icon}</span>
                                    <div>
                                        <h4 className="text-base font-bold text-rose-300">{selectedFile.originalName}</h4>
                                        <p className="text-xs opacity-60 mt-0.5 font-medium">Classify and rename this file</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {/* Project Selector */}
                                    <div>
                                        <label className="text-[10px] font-bold opacity-70 tracking-widest block mb-1.5 text-blue-300">PROJECT</label>
                                        <div className="relative">
                                            <select
                                                value={userInput.project}
                                                onChange={e => setUserInput(prev => ({ ...prev, project: e.target.value }))}
                                                className="w-full p-3 rounded-xl border border-white/10 bg-black/40 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer transition-colors hover:bg-black/50"
                                            >
                                                <option value="">Select Project...</option>
                                                {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
                                        </div>
                                    </div>

                                    {/* Type Selector */}
                                    <div>
                                        <label className="text-[10px] font-bold opacity-70 tracking-widest block mb-1.5 text-blue-300">DOCUMENT TYPE</label>
                                        <div className="relative">
                                            <select
                                                value={userInput.type}
                                                onChange={e => setUserInput(prev => ({ ...prev, type: e.target.value }))}
                                                className="w-full p-3 rounded-xl border border-white/10 bg-black/40 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer transition-colors hover:bg-black/50"
                                            >
                                                <option value="">Select Type...</option>
                                                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
                                        </div>
                                    </div>

                                    {/* Date Input */}
                                    <div>
                                        <label className="text-[10px] font-bold opacity-70 tracking-widest block mb-1.5 text-blue-300">DATE (ISO FORMAT)</label>
                                        <input
                                            type="text"
                                            placeholder="YYYY-MM-DD"
                                            value={userInput.date}
                                            onChange={e => setUserInput(prev => ({ ...prev, date: e.target.value }))}
                                            className="w-full p-3 rounded-xl border border-white/10 bg-black/40 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-white/20 transition-colors hover:bg-black/50"
                                        />
                                    </div>

                                    <button
                                        onClick={handleCleanFile}
                                        className="w-full p-4 mt-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl text-white text-base font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                                    >
                                        🧹 Clean & Index File
                                    </button>

                                    {feedback && (
                                        <div className={`
                                            p-4 rounded-xl text-sm leading-relaxed whitespace-pre-line border animate-fade-in
                                            ${feedback.type === 'success'
                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200 shadow-emerald-500/10 shadow-lg'
                                                : 'bg-rose-500/10 border-rose-500/30 text-rose-200 shadow-rose-500/10 shadow-lg'
                                            }
                                        `}>
                                            {feedback.message}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-50 text-center py-10 min-h-[300px]">
                                <div className="text-5xl mb-4 opacity-50 animate-bounce">👈</div>
                                <div className="text-base font-semibold">Select a toxic file</div>
                                <div className="text-xs opacity-70 mt-1">Choose a file to clean and index</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DigitalJanitorLab;
