
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const HuggingFaceGuide: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [activeTab, setActiveTab] = useState<'blueprint' | 'analogy' | 'process'>('analogy');

    const handleTabChange = (tab: 'blueprint' | 'analogy' | 'process') => {
        setActiveTab(tab);
        if (user && !user.progress.completedInteractives.includes(interactiveId)) {
            addPoints(10);
            updateProgress(interactiveId, 'interactive');
        }
    };

    return (
        <div className="my-8 p-1 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-neumorphic-out">
            <div className="bg-slate-900 rounded-[22px] overflow-hidden min-h-[500px] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div>
                        <h4 className="font-bold text-xl text-white">Space Architecture Guide</h4>
                        <p className="text-xs text-indigo-200">Understanding your deployment environment</p>
                    </div>
                    <div className="flex gap-2">
                        {['analogy', 'blueprint', 'process'].map((t) => (
                            <button
                                key={t}
                                onClick={() => handleTabChange(t as any)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                    activeTab === t ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-grow p-8 relative">
                    
                    {/* --- ANALOGY VIEW --- */}
                    {activeTab === 'analogy' && (
                        <div className="animate-fade-in h-full flex flex-col items-center justify-center">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-white mb-2">The Food Truck Analogy</h3>
                                <p className="text-slate-400 text-sm max-w-lg mx-auto">How a Hugging Face Space actually works.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                                {/* Card 1 */}
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 relative group hover:border-orange-400/50 transition-colors">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                                        📜
                                    </div>
                                    <div className="mt-6 text-center">
                                        <h5 className="font-bold text-orange-400 mb-1">app.py</h5>
                                        <div className="text-xs font-mono text-slate-500 mb-4">THE MENU & RECIPE</div>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            Defines what users can order (inputs) and how the chef cooks it (logic). Without this, the truck has no purpose.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 relative group hover:border-green-400/50 transition-colors">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                                        🛒
                                    </div>
                                    <div className="mt-6 text-center">
                                        <h5 className="font-bold text-green-400 mb-1">requirements.txt</h5>
                                        <div className="text-xs font-mono text-slate-500 mb-4">THE SHOPPING LIST</div>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            Tells the supplier what ingredients to bring (libraries like openai, gradio). Without this, the chef can't cook.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 3 */}
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 relative group hover:border-blue-400/50 transition-colors">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                                        🚚
                                    </div>
                                    <div className="mt-6 text-center">
                                        <h5 className="font-bold text-blue-400 mb-1">Hugging Face</h5>
                                        <div className="text-xs font-mono text-slate-500 mb-4">THE TRUCK & STAFF</div>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            Provides the electricity, kitchen, and server staff. It reads your list, stocks the fridge, and opens the window.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- BLUEPRINT VIEW --- */}
                    {activeTab === 'blueprint' && (
                        <div className="animate-fade-in flex flex-col items-center justify-center h-full">
                            <div className="relative w-full max-w-3xl bg-slate-950 rounded-xl border border-slate-800 p-8 shadow-2xl">
                                {/* Connection Lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                                    <path d="M150 150 L 400 150 L 400 250" stroke="#6366f1" strokeWidth="2" fill="none" strokeDasharray="5,5" className="animate-pulse"/>
                                    <path d="M600 150 L 400 150" stroke="#6366f1" strokeWidth="2" fill="none" strokeDasharray="5,5" className="animate-pulse"/>
                                </svg>

                                <div className="grid grid-cols-3 gap-8 relative z-10">
                                    {/* Codebase */}
                                    <div className="flex flex-col gap-4">
                                        <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg text-center">
                                            <div className="text-xs text-slate-500 uppercase font-bold mb-2">Source Code</div>
                                            <div className="flex items-center gap-2 text-sm text-white bg-black/50 p-2 rounded mb-2">
                                                <span className="text-yellow-400">📄</span> app.py
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-white bg-black/50 p-2 rounded">
                                                <span className="text-yellow-400">📄</span> requirements.txt
                                            </div>
                                        </div>
                                    </div>

                                    {/* The Build Process */}
                                    <div className="flex flex-col justify-center items-center">
                                        <div className="w-24 h-24 rounded-full bg-indigo-500/20 border-2 border-indigo-500 flex items-center justify-center relative animate-pulse">
                                            <span className="text-3xl">⚙️</span>
                                            <div className="absolute -bottom-8 text-xs font-bold text-indigo-400 uppercase tracking-widest text-center w-40">
                                                Container Build
                                            </div>
                                        </div>
                                    </div>

                                    {/* The App */}
                                    <div className="flex flex-col gap-4">
                                        <div className="p-4 bg-gradient-to-br from-slate-800 to-indigo-900 border border-indigo-500/50 rounded-lg text-center shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                                            <div className="text-xs text-indigo-300 uppercase font-bold mb-2">Live Space</div>
                                            <div className="bg-white rounded p-1 mb-2">
                                                {/* Mini UI Mockup */}
                                                <div className="h-2 w-full bg-gray-200 mb-1 rounded-sm"></div>
                                                <div className="h-8 w-full bg-blue-100 rounded-sm flex items-center justify-center text-[8px] text-blue-800 font-bold">GRADIO UI</div>
                                            </div>
                                            <div className="text-[10px] text-slate-400">Running on Python 3.10</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- PROCESS VIEW --- */}
                    {activeTab === 'process' && (
                        <div className="animate-fade-in max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold text-white text-center mb-8">What happens when you click "Commit"?</h3>
                            
                            <div className="space-y-4">
                                {[
                                    { step: 1, title: 'Read', desc: 'Hugging Face reads your requirements.txt file.', icon: '👀', color: 'bg-blue-500' },
                                    { step: 2, title: 'Install', desc: 'It downloads every library listed (OpenAI, Gradio, etc).', icon: '📦', color: 'bg-purple-500' },
                                    { step: 3, title: 'Launch', desc: 'It executes `python app.py` on the server.', icon: '🚀', color: 'bg-orange-500' },
                                    { step: 4, title: 'Serve', desc: 'Gradio generates the UI and opens port 7860.', icon: '🌐', color: 'bg-green-500' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-white/5 hover:bg-slate-800 transition-colors">
                                        <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-white font-bold shadow-lg shrink-0`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h5 className="text-white font-bold text-sm">{item.title}</h5>
                                            <p className="text-slate-400 text-xs">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default HuggingFaceGuide;
