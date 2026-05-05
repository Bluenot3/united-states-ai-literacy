
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';

type Mode = 'RAG_ONLY' | 'MEMORY_ONLY' | 'HYBRID';

interface Scenario {
    id: number;
    user: string;
    role: string;
    request: string;
    amount: number;
}

const SCENARIO: Scenario = {
    id: 101,
    user: 'Alice Chen',
    role: 'Senior Developer',
    request: 'MacBook Pro M3 Max',
    amount: 4200
};

const POLICIES = [
    { id: 'pol-1', name: 'IT Procurement Standard v4', rule: 'Standard laptop limit is $2,500.', type: 'General' },
    { id: 'pol-2', name: 'R&D Equipment Exception', rule: 'Developers may expense up to $5,000 for compile-heavy workflows.', type: 'Exception' }
];

const MEMORIES = [
    { id: 'mem-1', content: 'Rejected Bob\'s $3000 request last month (Sales Dept).' },
    { id: 'mem-2', content: 'Approved Sarah\'s $4500 request yesterday (AI Research).' }
];

const GovernanceDecisionSimulator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [mode, setMode] = useState<Mode>('HYBRID');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<{ decision: string; rationale: string; sources: string[] } | null>(null);

    const handleDecide = () => {
        setAnalyzing(true);
        setResult(null);

        setTimeout(() => {
            let decision = 'REJECTED';
            let rationale = '';
            let sources: string[] = [];

            if (mode === 'RAG_ONLY') {
                decision = 'APPROVED';
                rationale = 'Although standard limit is $2,500 (Policy v4), the R&D Exception applies for Developers ($5,000 limit).';
                sources = ['IT Procurement Standard v4', 'R&D Equipment Exception'];
            } else if (mode === 'MEMORY_ONLY') {
                decision = 'APPROVED';
                rationale = 'Precedent exists: Sarah (AI Research) was approved for a similar amount yesterday. Consistent with recent team patterns.';
                sources = ['Memory #8821 (Sarah Request)'];
            } else { // HYBRID
                decision = 'APPROVED';
                rationale = 'Request complies with R&D Exception Policy (Limit $5k). Supported by recent precedent (Sarah, $4.5k).';
                sources = ['R&D Exception Policy', 'Memory #8821'];
            }

            setResult({ decision, rationale, sources });
            setAnalyzing(false);

            if (user && !user.progress.completedInteractives.includes(interactiveId)) {
                addPoints(20);
                updateProgress(interactiveId, 'interactive');
            }
        }, 1500);
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out border border-gray-100">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Governance Decision Engine</h4>
            <p className="text-center text-sm text-gray-500 mb-6">Simulate how an AI enforces rules using Policies (RAG) vs. Precedent (Memory).</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Context Column */}
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Incoming Request</h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">User:</span>
                                <span className="font-bold text-gray-800">{SCENARIO.user}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Role:</span>
                                <span className="font-bold text-blue-600">{SCENARIO.role}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Item:</span>
                                <span className="font-bold text-gray-800">{SCENARIO.request}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Cost:</span>
                                <span className="font-bold text-gray-800">${SCENARIO.amount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Governance Mode</h5>
                        <div className="flex flex-col gap-2">
                            {(['RAG_ONLY', 'MEMORY_ONLY', 'HYBRID'] as Mode[]).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                                        mode === m 
                                        ? 'bg-brand-primary text-white border-brand-primary' 
                                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    {m.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Logic Column */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col relative overflow-hidden">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">System Logic</h5>
                    
                    <div className="flex-grow space-y-3 overflow-y-auto max-h-[300px] liquid-scrollbar p-1">
                        {/* Policies (RAG) */}
                        <div className={`transition-opacity duration-300 ${mode === 'MEMORY_ONLY' ? 'opacity-20 grayscale' : 'opacity-100'}`}>
                            <div className="text-[10px] font-bold text-blue-500 mb-1 flex items-center gap-1">
                                <span className="text-lg">📚</span> RAG: Active Policies
                            </div>
                            {POLICIES.map(p => (
                                <div key={p.id} className="bg-white p-2 rounded border border-blue-100 text-xs shadow-sm">
                                    <div className="font-bold text-slate-700">{p.name}</div>
                                    <div className="text-slate-500 italic">"{p.rule}"</div>
                                </div>
                            ))}
                        </div>

                        {/* Memory */}
                        <div className={`transition-opacity duration-300 ${mode === 'RAG_ONLY' ? 'opacity-20 grayscale' : 'opacity-100'}`}>
                            <div className="text-[10px] font-bold text-purple-500 mb-1 flex items-center gap-1">
                                <span className="text-lg">🧠</span> Agent Memory: Precedents
                            </div>
                            {MEMORIES.map(m => (
                                <div key={m.id} className="bg-white p-2 rounded border border-purple-100 text-xs shadow-sm">
                                    <div className="text-slate-600">{m.content}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200 text-center">
                        <button 
                            onClick={handleDecide}
                            disabled={analyzing}
                            className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {analyzing ? <span className="animate-spin text-xl">⚙️</span> : <SparklesIcon />}
                            Run Governance Check
                        </button>
                    </div>
                </div>

                {/* Outcome Column */}
                <div className="flex flex-col justify-center">
                    {analyzing ? (
                        <div className="text-center p-8">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-primary rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-sm text-gray-500 font-mono animate-pulse">Evaluating constraints...</p>
                        </div>
                    ) : result ? (
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 animate-fade-in h-full flex flex-col">
                            <div className="mb-4 text-center">
                                <div className={`inline-block px-4 py-1 rounded-full text-sm font-black uppercase tracking-widest ${
                                    result.decision === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {result.decision}
                                </div>
                            </div>
                            
                            <div className="flex-grow">
                                <h6 className="text-xs font-bold text-gray-400 uppercase mb-2">Rationale</h6>
                                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                    {result.rationale}
                                </p>

                                <h6 className="text-xs font-bold text-gray-400 uppercase mb-2">Citations / Basis</h6>
                                <ul className="space-y-1">
                                    {result.sources.map((s, i) => (
                                        <li key={i} className="text-xs font-mono bg-gray-50 px-2 py-1 rounded text-gray-600 border border-gray-200 truncate">
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                            Run simulation to see outcome
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default GovernanceDecisionSimulator;
