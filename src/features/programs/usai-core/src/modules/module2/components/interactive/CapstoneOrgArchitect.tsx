
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';
import { CheckIcon } from '../icons/CheckIcon';

type Layer = 'event' | 'knowledge' | 'agent' | 'workflow' | 'governance';

interface OrgConfig {
    eventSource: string;
    knowledgeBase: string[];
    agentStructure: string;
    humanInLoop: boolean;
    loggingLevel: string;
}

const CapstoneOrgArchitect: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [activeLayer, setActiveLayer] = useState<Layer>('event');
    const [config, setConfig] = useState<OrgConfig>({
        eventSource: 'Customer Support Ticket',
        knowledgeBase: ['Refund Policy'],
        agentStructure: 'Single Analyst',
        humanInLoop: true,
        loggingLevel: 'Basic Actions'
    });
    const [isSimulating, setIsSimulating] = useState(false);
    const [simStep, setSimStep] = useState(0); // 0..5
    const [simLog, setSimLog] = useState<string[]>([]);

    const layers: { id: Layer; label: string; icon: string; desc: string }[] = [
        { id: 'event', label: '1. Event Layer', icon: '📡', desc: 'What wakes the system up?' },
        { id: 'knowledge', label: '2. Knowledge (RAG)', icon: '🧠', desc: 'What does it know?' },
        { id: 'agent', label: '3. Agent Layer', icon: '🤖', desc: 'Who does the work?' },
        { id: 'workflow', label: '4. Workflow', icon: '⚡', desc: 'How does it move?' },
        { id: 'governance', label: '5. Governance', icon: '🛡️', desc: 'How is it controlled?' },
    ];

    const runSimulation = () => {
        setIsSimulating(true);
        setSimStep(0);
        setSimLog([]);
        
        const sequence = [
            { step: 1, msg: `EVENT: Received "${config.eventSource}" (ID: #9921)` },
            { step: 2, msg: `RAG: Retrieved ${config.knowledgeBase.join(' + ')}` },
            { step: 3, msg: `AGENT: ${config.agentStructure} analyzing context...` },
            { step: 4, msg: config.humanInLoop ? "WORKFLOW: Risk Detected -> Routing to Human Approval Queue" : "WORKFLOW: Auto-Execution Path Selected" },
            { step: 5, msg: `GOVERNANCE: Logging [${config.loggingLevel}] to Immutable Ledger` }
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i >= sequence.length) {
                clearInterval(interval);
                if (user && !user.progress.completedInteractives.includes(interactiveId)) {
                    addPoints(50);
                    updateProgress(interactiveId, 'interactive');
                }
                return;
            }
            setSimLog(prev => [...prev, sequence[i].msg]);
            setSimStep(i + 1);
            i++;
        }, 1200);
    };

    const toggleKnowledge = (doc: string) => {
        setConfig(prev => ({
            ...prev,
            knowledgeBase: prev.knowledgeBase.includes(doc) 
                ? prev.knowledgeBase.filter(d => d !== doc)
                : [...prev.knowledgeBase, doc]
        }));
    };

    return (
        <div className="my-10 p-1 rounded-3xl bg-gradient-to-br from-blue-900 to-slate-900 shadow-neumorphic-out border border-white/20 text-white">
            <div className="bg-slate-900/95 rounded-[22px] overflow-hidden min-h-[600px] flex flex-col md:flex-row">
                
                {/* Left: Configuration Panel */}
                <div className="md:w-1/3 border-r border-white/10 p-6 flex flex-col gap-6">
                    <div className="mb-4">
                        <h4 className="font-bold text-xl text-white flex items-center gap-2">
                            <span className="text-2xl">🏛️</span> Org Architect
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">Design the 5 layers of autonomy.</p>
                    </div>

                    <div className="space-y-2 flex-grow">
                        {layers.map((layer) => (
                            <button
                                key={layer.id}
                                onClick={() => !isSimulating && setActiveLayer(layer.id)}
                                className={`w-full text-left p-3 rounded-xl transition-all duration-200 border border-transparent ${
                                    activeLayer === layer.id 
                                    ? 'bg-blue-600 text-white shadow-lg border-blue-400' 
                                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                                }`}
                                disabled={isSimulating}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-xl">{layer.icon}</div>
                                    <div>
                                        <div className="font-bold text-sm">{layer.label}</div>
                                        <div className="text-[10px] opacity-70">{layer.desc}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={runSimulation}
                        disabled={isSimulating}
                        className="w-full py-4 bg-gradient-to-r from-brand-primary to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-purple-500/30 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                    >
                        {isSimulating ? <span className="animate-spin text-xl">⚙️</span> : <SparklesIcon />}
                        {isSimulating ? 'Simulating Operations...' : 'Launch Organization'}
                    </button>
                </div>

                {/* Right: Layer Editor & Simulation View */}
                <div className="md:w-2/3 p-8 bg-slate-950 relative overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                    {!isSimulating ? (
                        <div className="relative z-10 animate-fade-in">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <span className="text-4xl">{layers.find(l => l.id === activeLayer)?.icon}</span>
                                {layers.find(l => l.id === activeLayer)?.label} Configuration
                            </h3>

                            {activeLayer === 'event' && (
                                <div className="space-y-4">
                                    <p className="text-slate-400 text-sm">Select the primary signal that triggers the autonomous loop.</p>
                                    {['Customer Support Ticket', 'IoT Sensor Alert', 'Scheduled Report', 'Slack Message'].map(opt => (
                                        <button key={opt} onClick={() => setConfig({...config, eventSource: opt})} className={`block w-full text-left p-4 rounded-xl border ${config.eventSource === opt ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {activeLayer === 'knowledge' && (
                                <div className="space-y-4">
                                    <p className="text-slate-400 text-sm">Select documents the organization can retrieve (RAG).</p>
                                    {['Refund Policy', 'Technical Manual', 'Employee Handbook', 'Past Ticket History'].map(opt => (
                                        <button key={opt} onClick={() => toggleKnowledge(opt)} className={`block w-full text-left p-4 rounded-xl border flex justify-between items-center ${config.knowledgeBase.includes(opt) ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                            <span>{opt}</span>
                                            {config.knowledgeBase.includes(opt) && <CheckIcon />}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {activeLayer === 'agent' && (
                                <div className="space-y-4">
                                    <p className="text-slate-400 text-sm">Define the reasoning structure.</p>
                                    {['Single Analyst', 'Team: Researcher + Writer', 'Committee: 3 Critics'].map(opt => (
                                        <button key={opt} onClick={() => setConfig({...config, agentStructure: opt})} className={`block w-full text-left p-4 rounded-xl border ${config.agentStructure === opt ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {activeLayer === 'workflow' && (
                                <div className="space-y-4">
                                    <p className="text-slate-400 text-sm">Configure human-in-the-loop gates.</p>
                                    <div onClick={() => setConfig({...config, humanInLoop: !config.humanInLoop})} className={`cursor-pointer p-6 rounded-xl border flex items-center justify-between ${config.humanInLoop ? 'bg-orange-500/20 border-orange-500 text-orange-300' : 'bg-white/5 border-white/10'}`}>
                                        <div>
                                            <div className="font-bold">Human Approval Gate</div>
                                            <div className="text-xs opacity-70">Require human review for high-risk actions</div>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${config.humanInLoop ? 'bg-orange-500' : 'bg-slate-600'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${config.humanInLoop ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeLayer === 'governance' && (
                                <div className="space-y-4">
                                    <p className="text-slate-400 text-sm">Set the depth of system transparency.</p>
                                    {['Basic Actions', 'Full Decision Trace', 'Audit + Reasoning'].map(opt => (
                                        <button key={opt} onClick={() => setConfig({...config, loggingLevel: opt})} className={`block w-full text-left p-4 rounded-xl border ${config.loggingLevel === opt ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col relative z-10">
                            <h3 className="text-xl font-bold mb-4 text-center text-blue-400">Live Operation Simulation</h3>
                            
                            {/* Pipeline Viz */}
                            <div className="flex justify-between items-center mb-8 px-4">
                                {layers.map((l, i) => (
                                    <div key={l.id} className={`flex flex-col items-center gap-2 transition-all duration-500 ${simStep > i ? 'opacity-100 scale-110 text-white' : 'opacity-30 scale-90 text-slate-500'}`}>
                                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl bg-slate-900 ${simStep === i + 1 ? 'border-brand-primary animate-pulse shadow-[0_0_15px_#8b5cf6]' : 'border-current'}`}>
                                            {l.icon}
                                        </div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider">{l.label.split(' ')[1]}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Terminal Log */}
                            <div className="flex-grow bg-black/50 rounded-xl border border-white/10 p-4 font-mono text-sm overflow-y-auto space-y-2 shadow-inner">
                                {simLog.map((log, i) => (
                                    <div key={i} className="animate-fade-in text-green-400 border-l-2 border-green-500/50 pl-3 py-1">
                                        <span className="opacity-50 text-xs mr-3">[{new Date().toLocaleTimeString()}]</span>
                                        {log}
                                    </div>
                                ))}
                                {simStep > 0 && simStep <= 5 && <div className="animate-pulse text-brand-primary">Processing layer {simStep}...</div>}
                                {simStep > 5 && (
                                    <div className="mt-4 text-center">
                                        <div className="text-2xl mb-2">✅</div>
                                        <div className="font-bold text-white">Scenario Complete</div>
                                        <button onClick={() => setIsSimulating(false)} className="mt-4 text-xs text-slate-400 hover:text-white underline">Return to Architect Mode</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CapstoneOrgArchitect;
