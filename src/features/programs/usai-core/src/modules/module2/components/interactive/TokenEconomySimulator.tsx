
import React, { useState, useEffect, useRef } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';
import { CubeIcon } from '../icons/CubeIcon';
import { RefreshIcon } from '../icons/RefreshIcon';

// --- Types ---
type Tab = 'dashboard' | 'levers' | 'bossfight' | 'race';

interface Metrics {
    costPer1k: number;
    latencyMs: number;
    qualityScore: number; // 0-100
    efficiency: number; // 0-100
    throughput: number; // req/sec
}

interface LeverState {
    id: string;
    label: string;
    desc: string;
    active: boolean;
    impact: { cost: number; latency: number; quality: number; efficiency: number };
}

// --- Constants & Config ---
const INITIAL_METRICS: Metrics = {
    costPer1k: 0.06, // $0.06 baseline (high)
    latencyMs: 2500, // 2.5s baseline (slow)
    qualityScore: 95, // High quality start
    efficiency: 20, // Low efficiency
    throughput: 5,
};

const LEVERS_CONFIG: LeverState[] = [
    { id: 'routing', label: 'Model Routing', desc: 'Route simple queries to Flash, complex to Pro.', active: false, impact: { cost: -0.4, latency: -0.3, quality: -2, efficiency: 30 } },
    { id: 'context', label: 'Context Budgeting', desc: 'Trim history and summarize before reasoning.', active: false, impact: { cost: -0.2, latency: -0.1, quality: -1, efficiency: 15 } },
    { id: 'rag', label: 'RAG Tuning', desc: 'Reduce chunk spam, strict citation checks.', active: false, impact: { cost: -0.15, latency: 0.1, quality: 5, efficiency: 10 } },
    { id: 'caching', label: 'Semantic Caching', desc: 'Serve stored answers for repeated queries.', active: false, impact: { cost: -0.5, latency: -0.8, quality: 0, efficiency: 40 } },
    { id: 'batching', label: 'Event Batching', desc: 'Process multiple events in one API call.', active: false, impact: { cost: -0.1, latency: 0.2, quality: 0, efficiency: 25 } },
    { id: 'guardrails', label: 'Guardrails (Cost Control)', desc: 'Block infinite loops and excessive tool calls.', active: false, impact: { cost: -0.1, latency: 0.05, quality: 2, efficiency: 10 } },
    { id: 'fallback', label: 'Graceful Fallback', desc: 'Switch to heuristic tools if model fails.', active: false, impact: { cost: -0.05, latency: -0.1, quality: -5, efficiency: 15 } },
];

// --- Sub-Components ---

const MetricCard: React.FC<{ label: string; value: string | number; unit?: string; trend?: 'up' | 'down' | 'neutral'; color: string }> = ({ label, value, unit, trend, color }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        <div className="flex items-end gap-1 mt-2">
            <span className={`text-2xl font-black ${color}`}>{value}</span>
            {unit && <span className="text-xs font-bold text-gray-400 mb-1">{unit}</span>}
        </div>
        {trend && (
            <div className={`text-[10px] font-bold mt-1 ${trend === 'down' ? 'text-green-500' : trend === 'up' ? 'text-red-500' : 'text-gray-400'}`}>
                {trend === 'down' ? '↓ Improving' : trend === 'up' ? '↑ Increasing' : '• Stable'}
            </div>
        )}
    </div>
);

const BreakdownChart: React.FC<{ levers: LeverState[] }> = ({ levers }) => {
    // Calculate relative proportions based on active levers
    const baseCompute = 50;
    const baseRetrieval = 30;
    const baseOps = 20;

    // Levers affect these ratios
    const compute = Math.max(10, baseCompute - (levers.find(l => l.id === 'routing')?.active ? 20 : 0) - (levers.find(l => l.id === 'caching')?.active ? 15 : 0));
    const retrieval = Math.max(5, baseRetrieval - (levers.find(l => l.id === 'rag')?.active ? 10 : 0) - (levers.find(l => l.id === 'context')?.active ? 5 : 0));
    const ops = Math.max(5, baseOps - (levers.find(l => l.id === 'batching')?.active ? 5 : 0));

    const total = compute + retrieval + ops;

    return (
        <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h5 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-primary"></span> Cost Breakdown Analysis
            </h5>
            <div className="w-full h-8 flex rounded-full overflow-hidden shadow-inner">
                <div style={{ width: `${(compute / total) * 100}%` }} className="bg-purple-500 transition-all duration-500 hover:bg-purple-600 relative group">
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white opacity-0 group-hover:opacity-100">Compute</div>
                </div>
                <div style={{ width: `${(retrieval / total) * 100}%` }} className="bg-blue-400 transition-all duration-500 hover:bg-blue-500 relative group">
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white opacity-0 group-hover:opacity-100">Retrieval</div>
                </div>
                <div style={{ width: `${(ops / total) * 100}%` }} className="bg-orange-400 transition-all duration-500 hover:bg-orange-500 relative group">
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white opacity-0 group-hover:opacity-100">Ops</div>
                </div>
            </div>
            <div className="flex justify-between mt-3 text-xs font-bold text-gray-500">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div>Model Inference ({Math.round((compute / total) * 100)}%)</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400"></div>Tooling/RAG ({Math.round((retrieval / total) * 100)}%)</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"></div>Operations ({Math.round((ops / total) * 100)}%)</div>
            </div>
        </div>
    );
};

// --- Game Modes ---

const BossFight: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [budget, setBudget] = useState(100);
    const [quality, setQuality] = useState(50); // Need > 80 to win
    const [wave, setWave] = useState(1);
    const [logs, setLogs] = useState<string[]>(['>>> SYSTEM ONLINE. BUDGET: $100.']);
    const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

    const handleAction = (action: 'cheap' | 'balanced' | 'expensive') => {
        if (status !== 'playing') return;

        let cost = 0;
        let qual = 0;
        let log = '';

        if (action === 'cheap') {
            cost = 5;
            qual = Math.random() > 0.5 ? 5 : -5; // Risky
            log = 'Route: Flash Model + No Context. Low cost, variable quality.';
        } else if (action === 'balanced') {
            cost = 15;
            qual = 10;
            log = 'Route: Hybrid + Caching. Moderate cost, good stability.';
        } else {
            cost = 30;
            qual = 25;
            log = 'Route: Pro Model + Deep Research. High cost, excellent quality.';
        }

        setBudget(prev => prev - cost);
        setQuality(prev => Math.min(100, prev + qual));
        setLogs(prev => [log, ...prev].slice(0, 5));

        if (budget - cost <= 0) {
            setStatus('lost');
        } else if (quality + qual >= 100) {
            setStatus('won');
            onComplete();
        } else {
            setWave(prev => prev + 1);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in text-center max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-brand-text flex justify-center items-center gap-2">
                <span className="text-2xl">👹</span> Budget Boss Fight
            </h3>
            <p className="text-sm text-gray-500">Reach 100% Quality before your Budget hits $0.</p>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="text-xs font-bold text-green-700 uppercase">Budget Remaining</div>
                    <div className="text-3xl font-black text-green-600">${budget}</div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                    <div className="text-xs font-bold text-purple-700 uppercase">Current Quality</div>
                    <div className="text-3xl font-black text-purple-600">{quality}%</div>
                </div>
            </div>

            {status === 'playing' && (
                <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => handleAction('cheap')} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold border border-gray-300 transition-all">
                        Cheap Route<br /><span className="text-green-600">$5</span> / <span className="text-gray-500">+/- Q</span>
                    </button>
                    <button onClick={() => handleAction('balanced')} className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg text-xs font-bold border border-blue-300 transition-all text-blue-800">
                        Balanced Ops<br /><span className="text-blue-600">$15</span> / <span className="text-green-600">+10 Q</span>
                    </button>
                    <button onClick={() => handleAction('expensive')} className="p-3 bg-purple-100 hover:bg-purple-200 rounded-lg text-xs font-bold border border-purple-300 transition-all text-purple-800">
                        Max Compute<br /><span className="text-red-500">$30</span> / <span className="text-green-600">+25 Q</span>
                    </button>
                </div>
            )}

            <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-left h-24 overflow-hidden text-green-400">
                {logs.map((l, i) => <div key={i}>{'>'} {l}</div>)}
            </div>

            {status === 'won' && <div className="text-green-600 font-bold text-xl animate-bounce">VICTORY! Pipeline Optimized.</div>}
            {status === 'lost' && (
                <div>
                    <div className="text-red-500 font-bold text-xl mb-2">BANKRUPT!</div>
                    <button onClick={() => { setBudget(100); setQuality(50); setStatus('playing'); setLogs([]); }} className="px-4 py-2 bg-gray-200 rounded-lg font-bold text-sm">Retry Level</button>
                </div>
            )}
        </div>
    );
};

const LatencyRace: React.FC = () => {
    const [racing, setRacing] = useState(false);
    const [legacyProgress, setLegacyProgress] = useState(0);
    const [optimizedProgress, setOptimizedProgress] = useState(0);
    const [winner, setWinner] = useState<'legacy' | 'optimized' | null>(null);

    const startRace = () => {
        setRacing(true);
        setLegacyProgress(0);
        setOptimizedProgress(0);
        setWinner(null);
    };

    useEffect(() => {
        if (!racing) return;

        const interval = setInterval(() => {
            setLegacyProgress(prev => {
                if (prev >= 100) return 100;
                return prev + Math.random() * 1.5; // Slow
            });
            setOptimizedProgress(prev => {
                if (prev >= 100) return 100;
                return prev + Math.random() * 4.5; // Fast (3x speedup)
            });
        }, 50);

        return () => clearInterval(interval);
    }, [racing]);

    useEffect(() => {
        if (legacyProgress >= 100 && !winner) setWinner('legacy');
        if (optimizedProgress >= 100 && !winner) {
            setWinner('optimized');
            setRacing(false);
        }
    }, [legacyProgress, optimizedProgress, winner]);

    return (
        <div className="space-y-8 animate-fade-in">
            <h3 className="text-xl font-bold text-brand-text text-center">Latency Drag Race</h3>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                        <span>Legacy Pipeline (GPT-4, No Cache, Full Context)</span>
                        <span>{Math.round(legacyProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div className="bg-gray-400 h-full transition-all duration-75" style={{ width: `${legacyProgress}%` }}></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-xs font-bold text-brand-primary mb-1">
                        <span>Optimized Pipeline (Flash, Semantic Cache, Routed)</span>
                        <span>{Math.round(optimizedProgress)}%</span>
                    </div>
                    <div className="w-full bg-brand-secondary/20 rounded-full h-4 overflow-hidden">
                        <div className="bg-gradient-to-r from-brand-secondary to-brand-primary h-full transition-all duration-75 relative" style={{ width: `${optimizedProgress}%` }}>
                            {optimizedProgress < 100 && <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 animate-pulse"></div>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center">
                {!racing && !winner && (
                    <button onClick={startRace} className="px-8 py-3 bg-brand-primary text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform">
                        Start Simulation
                    </button>
                )}
                {winner === 'optimized' && (
                    <div className="animate-fade-in-up">
                        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-purple-600 mb-2">3.2x Speedup Achieved!</p>
                        <button onClick={startRace} className="text-xs text-gray-400 hover:text-brand-primary underline">Run Again</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Component ---

const TokenEconomySimulator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [levers, setLevers] = useState<LeverState[]>(LEVERS_CONFIG);
    const [metrics, setMetrics] = useState<Metrics>(INITIAL_METRICS);

    // Update metrics when levers change
    useEffect(() => {
        // Correction: Start from base values defined in INITIAL_METRICS
        let cost = INITIAL_METRICS.costPer1k;
        let latency = INITIAL_METRICS.latencyMs;
        let quality = INITIAL_METRICS.qualityScore;
        let efficiency = INITIAL_METRICS.efficiency;

        levers.forEach(lever => {
            if (lever.active) {
                cost *= (1 + lever.impact.cost);
                latency *= (1 + lever.impact.latency);
                quality += lever.impact.quality;
                efficiency += lever.impact.efficiency;
            }
        });

        setMetrics({
            costPer1k: parseFloat(Math.max(0.001, cost).toFixed(3)),
            latencyMs: Math.round(Math.max(50, latency)),
            qualityScore: Math.min(100, Math.max(0, quality)),
            efficiency: Math.min(100, Math.max(0, efficiency)),
            throughput: Math.round(10000 / Math.max(50, latency)) // rough proxy
        });

    }, [levers]);

    const toggleLever = (id: string) => {
        setLevers(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));

        // Simple points for engaging with the system
        if (user && !user.progress.completedInteractives.includes(interactiveId)) {
            // Check if user has toggled at least 3 levers
            const activeCount = levers.filter(l => l.active).length;
            if (activeCount >= 2) {
                // Don't award yet, wait for completion of gamified parts? 
                // Or just award for exploration.
            }
        }
    };

    const handleBossWin = () => {
        if (user && !user.progress.completedInteractives.includes(interactiveId)) {
            addPoints(50);
            updateProgress(interactiveId, 'interactive');
        }
    };

    return (
        <div className="my-10 p-1 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-blue-600/20 shadow-neumorphic-out border border-white/60 backdrop-blur-md">
            <div className="bg-brand-bg/95 rounded-[22px] overflow-hidden min-h-[600px] flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-lg shadow-lg">
                            <CubeIcon />
                        </div>
                        <div>
                            <h4 className="font-bold text-2xl text-brand-text">Token Economy 2.0</h4>
                            <p className="text-xs text-brand-text-light">AgentOps Financial Control Room</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-gray-100/50 p-1 rounded-xl overflow-x-auto max-w-full">
                        {[
                            { id: 'dashboard', label: 'Metrics' },
                            { id: 'levers', label: 'Optimization Levers' },
                            { id: 'bossfight', label: 'Budget Boss' },
                            { id: 'race', label: 'Latency Race' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-brand-primary shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-8 flex-grow bg-white/30 relative">

                    {activeTab === 'dashboard' && (
                        <div className="animate-fade-in space-y-8">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <MetricCard label="Cost / 1k Tokens" value={`$${metrics.costPer1k}`} color="text-brand-text" trend="down" />
                                <MetricCard label="Avg Latency" value={`${metrics.latencyMs}ms`} color={metrics.latencyMs < 500 ? 'text-green-500' : 'text-yellow-500'} trend="down" />
                                <MetricCard label="Quality Score" value={metrics.qualityScore} color={metrics.qualityScore > 85 ? 'text-purple-600' : 'text-red-500'} trend="neutral" />
                                <MetricCard label="Efficiency Rating" value={`${metrics.efficiency}/100`} color="text-blue-500" trend="up" />
                            </div>

                            <BreakdownChart levers={levers} />

                            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-xs text-yellow-800 flex items-center gap-2">
                                <span className="text-xl">💡</span>
                                <p><strong>Tip:</strong> Go to the "Optimization Levers" tab to adjust these metrics. Your goal is high Quality + high Efficiency.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'levers' && (
                        <div className="animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {levers.map(lever => (
                                    <button
                                        key={lever.id}
                                        onClick={() => toggleLever(lever.id)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all duration-300 relative overflow-hidden group
                                            ${lever.active ? 'bg-white border-brand-primary shadow-md' : 'bg-white/50 border-gray-100 hover:border-gray-200'}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`font-bold ${lever.active ? 'text-brand-primary' : 'text-gray-600'}`}>{lever.label}</span>
                                            <div className={`w-10 h-5 rounded-full p-1 transition-colors ${lever.active ? 'bg-brand-primary' : 'bg-gray-300'}`}>
                                                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${lever.active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-3">{lever.desc}</p>

                                        {/* Impact Indicators */}
                                        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider opacity-60">
                                            {lever.impact.cost < 0 && <span className="text-green-600">Cost ↓</span>}
                                            {lever.impact.latency < 0 && <span className="text-blue-600">Speed ↑</span>}
                                            {lever.impact.quality > 0 && <span className="text-purple-600">Quality ↑</span>}
                                            {lever.impact.quality < 0 && <span className="text-red-500">Quality Risk ⚠️</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'bossfight' && <BossFight onComplete={handleBossWin} />}
                    {activeTab === 'race' && <LatencyRace />}

                </div>
            </div>
        </div>
    );
};

export default TokenEconomySimulator;
