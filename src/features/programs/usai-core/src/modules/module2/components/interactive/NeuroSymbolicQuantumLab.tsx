
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';

// --- Neuro-Symbolic Mixer ---
const NeuroSymbolicMixer: React.FC = () => {
    const [mix, setMix] = useState(50); // 0 = Neural, 100 = Symbolic

    const getOutput = (val: number) => {
        if (val < 20) return { 
            type: "Pure Neural (Intuition)", 
            text: "Output: 'It feels like maybe a cat?'", 
            pros: "Creative, fast, handles messy data.", 
            cons: "Hallucinates, hard to explain." 
        };
        if (val > 80) return { 
            type: "Pure Symbolic (Logic)", 
            text: "Output: 'IF has_whiskers AND meows THEN Cat.'", 
            pros: "Provable, consistent, follows rules.", 
            cons: "Brittle, fails on edge cases." 
        };
        return { 
            type: "Neuro-Symbolic (Hybrid)", 
            text: "Output: 'Visuals suggest Cat (98%). Rule Check: Whiskers present. Confirmed.'", 
            pros: "Best of both: Robust & Explainable.", 
            cons: "Complex architecture." 
        };
    };

    const current = getOutput(mix);

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-brand-text">Intuition vs. Logic Mixer</h3>
            <p className="text-sm text-gray-500">Adjust the slider to blend Neural Networks (Intuition) with Symbolic Logic (Rules).</p>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <input 
                    type="range" min="0" max="100" value={mix} onChange={e => setMix(Number(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-purple-400 via-gray-300 to-green-400 rounded-lg appearance-none cursor-pointer mb-4"
                />
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
                    <span className="text-purple-500">Neural (Intuition)</span>
                    <span className="text-green-600">Symbolic (Logic)</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <div className="font-bold text-lg text-brand-primary mb-2">{current.type}</div>
                    <div className="font-mono text-sm text-slate-700 bg-white p-3 rounded border border-slate-100 mb-4 shadow-inner">
                        {current.text}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-left text-xs">
                        <div className="text-green-700"><strong>👍 Pros:</strong> {current.pros}</div>
                        <div className="text-red-600"><strong>👎 Cons:</strong> {current.cons}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Rule Impact Simulator ---
const RuleImpactSim: React.FC = () => {
    const [hasRule, setHasRule] = useState(false);
    
    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-brand-text">Rule-Aware RAG</h3>
            <p className="text-sm text-gray-500">See how injecting a symbolic rule changes the AI's output.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <div className="text-xs font-bold text-blue-500 uppercase mb-2">Retrieved Context (Fact)</div>
                        <p className="text-sm text-blue-900 bg-white p-2 rounded border border-blue-100">
                            "The document states that the project deadline is October 15th."
                        </p>
                    </div>
                    
                    <div className={`p-4 border rounded-xl transition-all ${hasRule ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold uppercase text-gray-500">Symbolic Rule</span>
                            <input 
                                type="checkbox" 
                                checked={hasRule} 
                                onChange={e => setHasRule(e.target.checked)}
                                className="w-5 h-5 text-green-500 rounded focus:ring-green-500 cursor-pointer"
                            />
                        </div>
                        <p className="text-sm font-mono text-gray-700 bg-white p-2 rounded border border-gray-200">
                            IF (Date is Weekend) THEN (Shift to Monday)
                        </p>
                        <p className="text-xs text-gray-400 mt-1 italic">(Note: Oct 15th is a Sunday)</p>
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <div className="p-5 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">AI Decision Output</h5>
                        
                        {hasRule ? (
                            <div className="animate-fade-in">
                                <p className="text-green-400 font-bold mb-2">Deadline: October 16th (Monday)</p>
                                <p className="text-xs text-slate-400 border-t border-slate-700 pt-2">
                                    Reasoning: Document says Oct 15. Rule #99 says "Shift Weekend to Monday". Oct 15 is Sunday. Applied logic adjustment.
                                </p>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <p className="text-blue-300 font-bold mb-2">Deadline: October 15th</p>
                                <p className="text-xs text-slate-400 border-t border-slate-700 pt-2">
                                    Reasoning: Extracted directly from retrieved text. No rules applied.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Quantum Decision Map ---
const QuantumSim: React.FC = () => {
    const [mode, setMode] = useState<'classic' | 'quantum'>('classic');
    const [step, setStep] = useState(0);

    const runSim = () => {
        setStep(0);
        let s = 0;
        const interval = setInterval(() => {
            s++;
            setStep(s);
            if (s >= 4) clearInterval(interval);
        }, mode === 'classic' ? 800 : 400);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-brand-text">Quantum vs. Classical Search</h3>
            <p className="text-sm text-gray-500">Classical computers check paths one by one. Quantum agents explore all paths simultaneously.</p>

            <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => { setMode('classic'); runSim(); }} className={`px-4 py-2 rounded-lg font-bold text-sm border transition-all ${mode === 'classic' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600'}`}>Classical (Serial)</button>
                <button onClick={() => { setMode('quantum'); runSim(); }} className={`px-4 py-2 rounded-lg font-bold text-sm border transition-all ${mode === 'quantum' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-600'}`}>Quantum (Parallel)</button>
            </div>

            <div className="relative h-48 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-around px-10">
                {/* Paths */}
                {[1, 2, 3, 4].map(pathId => {
                    const isWinningPath = pathId === 3;
                    let isActive = false;
                    let isChecked = false;

                    if (mode === 'classic') {
                        isActive = step === pathId;
                        isChecked = step > pathId;
                    } else {
                        // Quantum: All activate at step 1, winner found at step 2
                        isActive = step === 1;
                        isChecked = step >= 2;
                    }

                    return (
                        <div key={pathId} className="flex flex-col items-center gap-2 relative">
                            <div className={`w-32 h-2 rounded-full transition-all duration-300 ${isActive ? (mode === 'quantum' ? 'bg-purple-400 shadow-[0_0_10px_#a855f7]' : 'bg-blue-500') : isChecked ? (isWinningPath ? 'bg-green-500' : 'bg-red-200') : 'bg-gray-200'}`}></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 ${isChecked ? (isWinningPath ? 'bg-green-500 text-white scale-125' : 'bg-red-100 text-red-400') : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                                {isChecked && isWinningPath ? '★' : pathId}
                            </div>
                            {mode === 'quantum' && step >= 1 && (
                                <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full animate-pulse"></div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            <div className="text-center text-sm font-mono text-gray-600">
                {step === 0 && "Ready to search..."}
                {step > 0 && step < 4 && (mode === 'classic' ? `Checking Path ${step}...` : "Superposition: Exploring all paths...")}
                {step >= 4 && (mode === 'classic' ? "Found target after 3 failures." : "Target collapsed instantly.")}
            </div>
        </div>
    );
};

// --- Main Container ---
const NeuroSymbolicQuantumLab: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [activeTab, setActiveTab] = useState<'neuro' | 'rule' | 'quantum'>('neuro');

    const handleTabChange = (tab: 'neuro' | 'rule' | 'quantum') => {
        setActiveTab(tab);
        if (user && !user.progress.completedInteractives.includes(interactiveId)) {
            // Simple gamification: Just award points for exploring.
            if (tab === 'quantum') { // Award when they reach the last tab or just generally
                 addPoints(20);
                 updateProgress(interactiveId, 'interactive');
            }
        }
    };

    return (
        <div className="my-10 p-1 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 shadow-neumorphic-out border border-white/60 backdrop-blur-md">
            <div className="bg-brand-bg/95 rounded-[22px] overflow-hidden min-h-[500px] flex flex-col">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white rounded-lg shadow-lg">
                            <SparklesIcon />
                        </div>
                        <div>
                            <h4 className="font-bold text-2xl text-brand-text">Future Frontiers Lab</h4>
                            <p className="text-xs text-brand-text-light">Neuro-Symbolic & Quantum Concepts</p>
                        </div>
                    </div>
                    
                    <div className="flex bg-gray-100/50 p-1 rounded-xl overflow-x-auto max-w-full">
                        <button onClick={() => handleTabChange('neuro')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'neuro' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Logic Mixer</button>
                        <button onClick={() => handleTabChange('rule')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'rule' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Rule RAG</button>
                        <button onClick={() => handleTabChange('quantum')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'quantum' ? 'bg-white text-fuchsia-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Quantum Sim</button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-grow bg-white/30">
                    {activeTab === 'neuro' && <NeuroSymbolicMixer />}
                    {activeTab === 'rule' && <RuleImpactSim />}
                    {activeTab === 'quantum' && <QuantumSim />}
                </div>

            </div>
        </div>
    );
};

export default NeuroSymbolicQuantumLab;
