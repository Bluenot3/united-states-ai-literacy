
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';

const ParadigmShiftExplorer: React.FC<InteractiveComponentProps> = () => {
    const [era, setEra] = useState<1 | 2 | 3>(1);

    return (
        <div className="my-8 bg-brand-bg rounded-2xl shadow-neumorphic-out overflow-hidden">
            <div className="flex border-b border-brand-shadow-dark/10">
                <button onClick={() => setEra(1)} className={`flex-1 py-4 text-sm font-bold transition-colors ${era === 1 ? 'bg-white text-brand-primary border-b-2 border-brand-primary' : 'text-brand-text-light hover:bg-white/50'}`}>
                    1.0: Logic (Code)
                </button>
                <button onClick={() => setEra(2)} className={`flex-1 py-4 text-sm font-bold transition-colors ${era === 2 ? 'bg-white text-brand-primary border-b-2 border-brand-primary' : 'text-brand-text-light hover:bg-white/50'}`}>
                    2.0: Learning (Neural)
                </button>
                <button onClick={() => setEra(3)} className={`flex-1 py-4 text-sm font-bold transition-colors ${era === 3 ? 'bg-white text-brand-primary border-b-2 border-brand-primary' : 'text-brand-text-light hover:bg-white/50'}`}>
                    3.0: Agentic (Reasoning)
                </button>
            </div>

            <div className="p-8 min-h-[300px] flex flex-col md:flex-row gap-8 items-center justify-center transition-all">
                {era === 1 && (
                    <div className="animate-slide-in-up w-full flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-1/2 font-mono text-sm bg-slate-900 text-green-400 p-6 rounded-lg shadow-lg">
                            <p>function detectSpam(email) &#123;</p>
                            <p className="pl-4">if (email.contains("lottery")) return true;</p>
                            <p className="pl-4">if (email.sender == "unknown") return true;</p>
                            <p className="pl-4">else return false;</p>
                            <p>&#125;</p>
                        </div>
                        <div className="w-full md:w-1/2">
                            <h4 className="text-xl font-bold text-brand-text mb-2">Software 1.0: Explicit Rules</h4>
                            <p className="text-brand-text-light">Humans write every rule. It's precise but brittle. If a spammer spells "lottery" as "l0ttery", the code fails.</p>
                        </div>
                    </div>
                )}

                {era === 2 && (
                    <div className="animate-slide-in-up w-full flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-1/2 h-48 bg-white rounded-lg shadow-inner-sm flex items-center justify-center relative overflow-hidden">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                {/* Simple Neural Net Viz */}
                                <line x1="10" y1="20" x2="50" y2="50" stroke="#CBD5E1" strokeWidth="2" />
                                <line x1="10" y1="80" x2="50" y2="50" stroke="#CBD5E1" strokeWidth="2" />
                                <line x1="50" y1="50" x2="90" y2="50" stroke="#7C3AED" strokeWidth="3" />

                                <circle cx="10" cy="20" r="5" fill="#94A3B8" />
                                <circle cx="10" cy="80" r="5" fill="#94A3B8" />
                                <circle cx="50" cy="50" r="8" fill="#C4B5FD" className="animate-pulse" />
                                <circle cx="90" cy="50" r="5" fill="#7C3AED" />
                            </svg>
                            <div className="absolute bottom-2 text-xs text-slate-400 font-mono">1M+ Parameters</div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <h4 className="text-xl font-bold text-brand-text mb-2">Software 2.0: Probabilistic</h4>
                            <p className="text-brand-text-light">We don't write rules; we curate data. The machine learns the pattern (e.g., what spam looks like) by adjusting millions of numbers (weights).</p>
                        </div>
                    </div>
                )}

                {era === 3 && (
                    <div className="animate-slide-in-up w-full flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-1/2 h-48 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 flex flex-col items-center justify-center p-4">
                            <div className="flex gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-500 rounded-md shadow-lg flex items-center justify-center text-white">🧠</div>
                                <div className="text-2xl">→</div>
                                <div className="w-8 h-8 bg-green-500 rounded-md shadow-lg flex items-center justify-center text-white">🛠️</div>
                                <div className="text-2xl">→</div>
                                <div className="w-8 h-8 bg-orange-500 rounded-md shadow-lg flex items-center justify-center text-white">✅</div>
                            </div>
                            <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-brand-primary shadow-sm">
                                {"Plan -> Tool -> Action"}
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <h4 className="text-xl font-bold text-brand-text mb-2">Software 3.0: Agentic</h4>
                            <p className="text-brand-text-light">The AI isn't just a classifier; it's an operator. It can reason ("I need to check the weather"), use tools (API calls), and execute complex multi-step workflows.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParadigmShiftExplorer;
