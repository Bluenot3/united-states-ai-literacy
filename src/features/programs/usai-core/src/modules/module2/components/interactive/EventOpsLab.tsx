
import React, { useState, useEffect, useRef } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { CloseIcon } from '../icons/CloseIcon';

// --- Types ---
type Tab = 'stream' | 'tuner' | 'replay' | 'dashboard' | 'incident';

interface EventLog {
    id: string;
    timestamp: string;
    type: 'EMAIL' | 'SENSOR' | 'UPLOAD' | 'USER_ACTION' | 'SYSTEM';
    source: string;
    severity: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';
    message: string;
    status: 'PROCESSED' | 'BLOCKED' | 'FAILED' | 'PENDING';
}

const MOCK_EVENTS: EventLog[] = [
    { id: 'ev-101', timestamp: '10:42:05', type: 'SENSOR', source: 'IoT-Hub-04', severity: 'MED', message: 'Temp threshold exceeded (45°C)', status: 'PROCESSED' },
    { id: 'ev-102', timestamp: '10:42:08', type: 'EMAIL', source: 'Support-Inbox', severity: 'LOW', message: 'New ticket: "Login issue"', status: 'PROCESSED' },
    { id: 'ev-103', timestamp: '10:42:15', type: 'UPLOAD', source: 'S3-Bucket-Alpha', severity: 'HIGH', message: 'Malware scan: Suspicious signature', status: 'BLOCKED' },
];

// --- Sub-Components ---

// 1. Live Event Stream
const LiveStream: React.FC = () => {
    const [events, setEvents] = useState<EventLog[]>(MOCK_EVENTS);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const types: EventLog['type'][] = ['EMAIL', 'SENSOR', 'UPLOAD', 'USER_ACTION'];
            const severities: EventLog['severity'][] = ['LOW', 'LOW', 'MED', 'MED', 'HIGH'];
            const newEvent: EventLog = {
                id: `ev-${Date.now().toString().slice(-4)}`,
                timestamp: new Date().toLocaleTimeString(),
                type: types[Math.floor(Math.random() * types.length)],
                source: `Node-${Math.floor(Math.random() * 10)}`,
                severity: severities[Math.floor(Math.random() * severities.length)],
                message: 'System activity detected.',
                status: Math.random() > 0.8 ? 'FAILED' : 'PROCESSED'
            };
            setEvents(prev => [...prev.slice(-19), newEvent]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [events]);

    return (
        <div className="h-96 flex flex-col bg-slate-900 rounded-xl border border-slate-700 overflow-hidden font-mono text-xs">
            <div className="p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                <span className="text-green-400 font-bold flex items-center gap-2">● LIVE FEED</span>
                <span className="text-slate-500">{events.length} Events Logged</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1" ref={scrollRef}>
                {events.map(ev => (
                    <div key={ev.id} className="grid grid-cols-12 gap-2 p-2 rounded hover:bg-slate-800/50 transition-colors border-l-2 border-transparent hover:border-slate-600">
                        <span className="col-span-2 text-slate-500">{ev.timestamp}</span>
                        <span className={`col-span-2 font-bold ${ev.severity === 'CRITICAL' ? 'text-red-500' : ev.severity === 'HIGH' ? 'text-orange-400' : ev.severity === 'MED' ? 'text-yellow-400' : 'text-blue-400'}`}>
                            {ev.severity}
                        </span>
                        <span className="col-span-2 text-slate-300">{ev.type}</span>
                        <span className="col-span-4 text-slate-400 truncate">{ev.message}</span>
                        <span className={`col-span-2 text-right font-bold ${ev.status === 'BLOCKED' || ev.status === 'FAILED' ? 'text-red-500' : 'text-green-500'}`}>
                            {ev.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 2. Trigger Tuner
const TriggerTuner: React.FC = () => {
    const [threshold, setThreshold] = useState(75);

    // Simulate False Positive / Miss rates based on threshold
    const falsePositives = Math.max(0, 100 - threshold) * 1.2;
    const missedDetections = Math.max(0, threshold) * 0.8;

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-brand-text">Trigger Sensitivity Tuner</h3>
            <p className="text-sm text-gray-500">Balance the system. Too sensitive = alert fatigue. Too strict = missed risks.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <label className="block font-bold text-brand-text mb-4">Alert Threshold: {threshold}%</label>
                    <input
                        type="range" min="0" max="100" value={threshold}
                        onChange={e => setThreshold(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2 font-bold uppercase">
                        <span>Sensitive (Alert Everything)</span>
                        <span>Strict (Only Certainties)</span>
                    </div>
                </div>

                <div className="relative h-48 w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner">
                    {/* Simplified Chart Visualization */}
                    <div className="absolute inset-0 flex items-end px-8 pb-4 gap-4">
                        <div className="w-1/2 flex flex-col items-center gap-2 group">
                            <div style={{ height: `${falsePositives}%` }} className="w-full bg-red-400 rounded-t-lg transition-all duration-300 relative">
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-red-500 opacity-0 group-hover:opacity-100">{Math.round(falsePositives)}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-500">False Alarms</span>
                        </div>
                        <div className="w-1/2 flex flex-col items-center gap-2 group">
                            <div style={{ height: `${missedDetections}%` }} className="w-full bg-orange-400 rounded-t-lg transition-all duration-300 relative">
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-orange-500 opacity-0 group-hover:opacity-100">{Math.round(missedDetections)}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-500">Missed Risks</span>
                        </div>
                    </div>
                    {/* Optimal Zone Marker */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-l-2 border-dashed border-green-500 opacity-50 pointer-events-none"></div>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">OPTIMAL ZONE</div>
                </div>
            </div>
        </div>
    );
};

// 3. Replay Theater
const ReplayTheater: React.FC = () => {
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let timer: any;
        if (isPlaying && step < 5) {
            timer = setTimeout(() => setStep(s => s + 1), 1000);
        } else if (step >= 5) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, step]);

    const steps = [
        { label: 'Event Detected', icon: '⚡' },
        { label: 'RAG Retrieval', icon: '📚' },
        { label: 'LLM Reasoning', icon: '🧠' },
        { label: 'Guardrail Check', icon: '🛡️' },
        { label: 'Action Taken', icon: '🚀' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-brand-text">Workflow Replay Debugger</h3>
                <div className="flex gap-2">
                    <button onClick={() => { setStep(0); setIsPlaying(true); }} className="px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-primary/90">
                        ▶ Replay Event #492
                    </button>
                    <button onClick={() => { setStep(0); setIsPlaying(false); }} className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-300">
                        Reset
                    </button>
                </div>
            </div>

            <div className="relative pt-8 pb-4 px-4 overflow-x-auto">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 rounded-full mx-8"></div>
                <div
                    className="absolute top-1/2 left-8 h-1 bg-brand-primary -z-10 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `calc(${(step / 4) * 100}% - 4rem)` }}
                ></div>

                <div className="flex justify-between min-w-[500px]">
                    {steps.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                            <div className={`
                                w-12 h-12 rounded-full flex items-center justify-center text-xl border-4 transition-all duration-300 z-10 bg-white
                                ${step >= i ? 'border-brand-primary text-brand-primary scale-110 shadow-lg' : 'border-gray-200 text-gray-300 grayscale'}
                                ${step === i ? 'ring-4 ring-brand-primary/20 animate-pulse' : ''}
                            `}>
                                {s.icon}
                            </div>
                            <span className={`text-xs font-bold uppercase transition-colors ${step >= i ? 'text-brand-primary' : 'text-gray-400'}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-900 text-green-400 font-mono text-xs p-4 rounded-xl h-32 overflow-y-auto shadow-inner">
                {step >= 0 && <div>[10:00:01] EVENT_RX: Payload size 24kb... OK</div>}
                {step >= 1 && <div>[10:00:02] VECTOR_DB: Retrieved 3 chunks (Score: 0.89)... OK</div>}
                {step >= 2 && <div>[10:00:03] MODEL_INF: Generating response... DONE</div>}
                {step >= 3 && <div>[10:00:04] POLICY_SCAN: PII check passed. No toxicity detected... OK</div>}
                {step >= 4 && <div>[10:00:05] EXECUTE: API Call to Slack_Webhook... 200 OK</div>}
                {step >= 5 && <div className="text-white mt-2 border-t border-slate-700 pt-2">STATUS: COMPLETED SUCCESSFULLY</div>}
            </div>
        </div>
    );
};

// 4. Ops Dashboard
const OpsDashboard: React.FC = () => {
    return (
        <div className="grid grid-cols-2 gap-4 animate-fade-in">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Success Rate</h5>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-green-500">98.4%</span>
                    <span className="text-xs text-green-600 font-bold mb-1">↑ 0.2%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-green-500 h-full w-[98.4%]"></div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Avg Latency</h5>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-brand-text">1.2s</span>
                    <span className="text-xs text-red-500 font-bold mb-1">↑ 150ms</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-yellow-400 h-full w-[60%]"></div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Token Cost / Run</h5>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-brand-text">$0.04</span>
                    <span className="text-xs text-green-600 font-bold mb-1">↓ 12%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-blue-500 h-full w-[30%]"></div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quality Score</h5>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-purple-600">A-</span>
                    <span className="text-xs text-gray-400 font-bold mb-1">Stable</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-purple-500 h-full w-[92%]"></div>
                </div>
            </div>
        </div>
    );
};

// 5. Incident Simulator
const IncidentSim: React.FC = () => {
    const [scenario, setScenario] = useState<'idle' | 'active' | 'resolved'>('idle');
    const [feedback, setFeedback] = useState('');

    const handleAction = (action: string) => {
        if (action === 'escalate') {
            setFeedback("✅ Correct! In an 'Event Storm' (1000+ events/sec), automatic scaling might fail or cost a fortune. Escalating to human OPS allows for a kill-switch decision.");
            setScenario('resolved');
        } else {
            setFeedback("❌ Failed. Retrying just added more load to the crashing system. Ignoring caused data loss.");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in text-center">
            {scenario === 'idle' && (
                <div className="py-10">
                    <button onClick={() => setScenario('active')} className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-transform hover:scale-105 animate-pulse">
                        ⚠️ TRIGGER SYSTEM FAILURE
                    </button>
                    <p className="text-xs text-gray-400 mt-4">Simulates a production outage event.</p>
                </div>
            )}

            {scenario === 'active' && (
                <div className="bg-red-50 border-2 border-red-100 rounded-xl p-6">
                    <h4 className="text-red-600 font-bold text-xl mb-2 flex items-center justify-center gap-2">
                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                        ALERT: EVENT STORM DETECTED
                    </h4>
                    <p className="text-gray-700 mb-6">Input volume spiked 5000%. Vector DB is timing out. Error rate {'>'} 80%.</p>

                    <div className="grid grid-cols-3 gap-4">
                        <button onClick={() => handleAction('retry')} className="p-3 bg-white border hover:bg-gray-50 rounded-lg font-bold text-gray-700">Auto-Retry All</button>
                        <button onClick={() => handleAction('ignore')} className="p-3 bg-white border hover:bg-gray-50 rounded-lg font-bold text-gray-700">Ignore Errors</button>
                        <button onClick={() => handleAction('escalate')} className="p-3 bg-brand-primary text-white hover:bg-brand-primary/90 rounded-lg font-bold shadow-md">Escalate to Human</button>
                    </div>
                </div>
            )}

            {scenario === 'resolved' && (
                <div className="py-6 animate-fade-in">
                    <div className="text-4xl mb-4">🛡️</div>
                    <h4 className="text-xl font-bold text-brand-text mb-2">Incident Resolved</h4>
                    <p className="text-sm text-gray-600 max-w-md mx-auto">{feedback}</p>
                    <button onClick={() => { setScenario('idle'); setFeedback(''); }} className="mt-6 text-brand-primary font-bold hover:underline">Reset Simulation</button>
                </div>
            )}
        </div>
    );
};

const EventOpsLab: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('stream');

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        if (user && !user.progress.completedInteractives.includes(interactiveId)) {
            addPoints(5);
            updateProgress(interactiveId, 'interactive');
        }
    };

    const tabs: { id: Tab, label: string, icon: string }[] = [
        { id: 'stream', label: 'Live Stream', icon: '📡' },
        { id: 'tuner', label: 'Trigger Tuner', icon: '🎛️' },
        { id: 'replay', label: 'Replay Theater', icon: '⏪' },
        { id: 'dashboard', label: 'Ops Dash', icon: '📊' },
        { id: 'incident', label: 'Incident Sim', icon: '🔥' },
    ];

    return (
        <div className="my-10 p-1 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-neumorphic-out border border-white/20 backdrop-blur-md text-white">
            <div className="bg-slate-950/50 rounded-[22px] overflow-hidden min-h-[550px] flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg shadow-lg border border-blue-500/30">
                            <SparklesIcon />
                        </div>
                        <div>
                            <h4 className="font-bold text-2xl text-white">EventOps Mission Control</h4>
                            <p className="text-xs text-slate-400">Agent Reliability Engineering Suite</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex bg-black/40 p-1 rounded-xl overflow-x-auto max-w-full border border-white/5">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <span>{tab.icon}</span> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area - White background for content contrast inside dark frame */}
                <div className="p-8 flex-grow bg-white text-slate-800 rounded-b-[22px] relative overflow-hidden">
                    {activeTab === 'stream' && <LiveStream />}
                    {activeTab === 'tuner' && <TriggerTuner />}
                    {activeTab === 'replay' && <ReplayTheater />}
                    {activeTab === 'dashboard' && <OpsDashboard />}
                    {activeTab === 'incident' && <IncidentSim />}
                </div>

            </div>
        </div>
    );
};

export default EventOpsLab;
