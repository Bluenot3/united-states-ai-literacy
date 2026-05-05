
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { CloseIcon } from '../icons/CloseIcon';

// --- Types ---
type Tab = 'perception' | 'sync' | 'signal' | 'formats' | 'workflow';

// --- Mini-Apps ---

// 1. Perception Lab (Nano-Banana Sim)
const PerceptionLab: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'scanning' | 'analyzing' | 'done'>('idle');
    const [imageType, setImageType] = useState<'hazard' | 'chart'>('hazard');
    const [uncertainty, setUncertainty] = useState(false);

    const handleAnalyze = () => {
        setStatus('scanning');
        setTimeout(() => setStatus('analyzing'), 1500);
        setTimeout(() => setStatus('done'), 3000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-brand-text">Nano-Banana Perception Lab</h3>
            <p className="text-sm text-gray-500">Upload an image type to see how the agent perceives, interprets, and acts.</p>

            <div className="flex gap-4">
                <button onClick={() => { setImageType('hazard'); setStatus('idle'); }} className={`px-4 py-2 rounded-lg text-sm border transition-all ${imageType === 'hazard' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-600'}`}>Safety Hazard</button>
                <button onClick={() => { setImageType('chart'); setStatus('idle'); }} className={`px-4 py-2 rounded-lg text-sm border transition-all ${imageType === 'chart' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-600'}`}>Chart Analysis</button>
            </div>

            <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
                {/* Mock Image Content */}
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30 select-none">
                    {imageType === 'hazard' ? '⚠️ 💧 🔌' : '📊 📈 📉'}
                </div>

                {/* Scanning Effect */}
                {status === 'scanning' && (
                    <div className="absolute inset-0 bg-brand-primary/10 animate-pulse">
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary shadow-[0_0_15px_rgba(139,92,246,0.8)] animate-[scan_1.5s_linear_infinite]"></div>
                    </div>
                )}

                {/* Attention Spotlight (Simulated) */}
                {status === 'analyzing' && (
                    <>
                        <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-yellow-400 rounded-lg animate-ping opacity-75"></div>
                        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 border-2 border-yellow-400 rounded-lg animate-ping opacity-75 animation-delay-500"></div>
                    </>
                )}
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="uncertainty" checked={uncertainty} onChange={e => setUncertainty(e.target.checked)} className="w-4 h-4 text-brand-primary rounded" />
                    <label htmlFor="uncertainty" className="text-sm font-semibold text-gray-700">Simulate Low Confidence (Blurry Image)</label>
                </div>
                <button onClick={handleAnalyze} disabled={status !== 'idle'} className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg shadow-md disabled:opacity-50 hover:bg-brand-primary/90">
                    {status === 'idle' ? 'Start Perception Loop' : 'Processing...'}
                </button>
            </div>

            {status === 'done' && (
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 font-mono text-sm space-y-2 animate-fade-in text-green-400 shadow-inner">
                    <p><span className="text-blue-400">[PERCEIVE]</span> Object detected: {imageType === 'hazard' ? 'Exposed Wiring, Puddle' : 'Bar Chart, Q3 Trend'}</p>
                    <p><span className="text-purple-400">[INTERPRET]</span> {imageType === 'hazard' ? 'Electrical hazard proximity to water.' : 'Revenue decline of 15% observed in August.'}</p>
                    {uncertainty ? (
                        <p className="text-yellow-400">[DECIDE] CONFIDENCE LOW (42%). FLAGGING FOR HUMAN REVIEW.</p>
                    ) : (
                        <p className="text-green-400">[DECIDE] CONFIDENCE HIGH (98%). Triggering {imageType === 'hazard' ? 'Emergency Alert Protocol' : 'Management Report Generation'}.</p>
                    )}
                    <p className="text-white border-t border-slate-700 pt-2 mt-2">
                        🔊 AUDIO OUTPUT GENERATED: "{imageType === 'hazard' ? 'Warning. Hazard detected in Sector 4.' : 'Here is the summary of the Q3 performance chart.'}"
                    </p>
                </div>
            )}
        </div>
    );
};

// 2. Sync Lab
const SyncLab: React.FC = () => {
    const [sound, setSound] = useState('Glass shattering');
    const [visual, setVisual] = useState('A baseball hitting a window');
    const [explanation, setExplanation] = useState('');

    const generateExplanation = () => {
        setExplanation(`
SYNC ANALYSIS:
1. Visual Lead: The ball must make contact with the glass frame (Time: T=0).
2. Audio Lag: Sound travels slower than light, but in film/video, impact sounds are usually synced to the exact frame of contact (Frame 0) for maximum impact.
3. Meaning: If the sound plays *before* the visual impact, it feels like a premonition or error. If it plays *after*, it emphasizes distance.
4. AI Action: Align "crack.wav" peak amplitude with Video Frame #42 (impact point).
        `.trim());
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-brand-text">Audio-to-Visual Sync Lab</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Sound Event</label>
                    <input type="text" value={sound} onChange={e => setSound(e.target.value)} className="w-full font-semibold text-brand-text outline-none" />
                </div>
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Visual Event</label>
                    <input type="text" value={visual} onChange={e => setVisual(e.target.value)} className="w-full font-semibold text-brand-text outline-none" />
                </div>
            </div>

            <button onClick={generateExplanation} className="w-full py-3 bg-brand-secondary/10 text-brand-secondary font-bold rounded-xl hover:bg-brand-secondary/20 transition-colors">
                Explain Sync Logic
            </button>

            {explanation && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 font-mono text-xs whitespace-pre-wrap text-gray-700 animate-fade-in">
                    {explanation}
                </div>
            )}
        </div>
    );
};

// 3. Signal Game
const SignalGame: React.FC = () => {
    const [selected, setSelected] = useState<number | null>(null);
    const [feedback, setFeedback] = useState('');

    const inputs = [
        { id: 1, type: 'IMAGE', content: '🔴 Flashing Red Light', isSignal: true },
        { id: 2, type: 'TEXT', content: 'Log: "System All Clear"', isSignal: false },
        { id: 3, type: 'AUDIO', content: 'Background hum (normal)', isSignal: false },
    ];

    const handleSelect = (id: number, isSignal: boolean) => {
        setSelected(id);
        setFeedback(isSignal ? '✅ Correct! The visual alarm is the critical signal. The text log is outdated/lagging.' : '❌ Incorrect. This looks/sounds normal or outdated. Look for the anomaly.');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-brand-text">Spot the Signal</h3>
            <p className="text-sm text-gray-500">Scenario: A dashboard shows conflicting data. Which input should trigger the agent's emergency workflow?</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {inputs.map(input => (
                    <button
                        key={input.id}
                        onClick={() => handleSelect(input.id, input.isSignal)}
                        className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${selected === input.id ? (input.isSignal ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-200 bg-white hover:border-brand-primary'}`}
                    >
                        <div className="text-xs font-bold text-gray-400 mb-2">{input.type}</div>
                        <div className="font-bold text-gray-800">{input.content}</div>
                    </button>
                ))}
            </div>

            {feedback && (
                <div className={`p-4 rounded-xl text-center font-bold ${feedback.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feedback}
                </div>
            )}
        </div>
    );
};

// 4. Format Switcher
const FormatSwitcher: React.FC = () => {
    const [format, setFormat] = useState('beginner');

    const content = {
        beginner: "The chart shows sales went down a little bit in August. It looks like people bought fewer things.",
        report: "Q3 ANALYSIS: August revenue declined by 15% MoM. Primary driver identified as seasonal churn.",
        checklist: "- [ ] Investigate August drop\n- [ ] Review marketing spend\n- [ ] Prepare counter-strategy",
        json: `{\n  "month": "August",\n  "metric": "Revenue",\n  "change": "-15%",\n  "status": "ALERT"\n}`
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-brand-text">Output Format Switcher</h3>
            <div className="flex flex-wrap gap-2">
                {Object.keys(content).map(k => (
                    <button
                        key={k}
                        onClick={() => setFormat(k)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${format === k ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        {k}
                    </button>
                ))}
            </div>

            <div className="p-6 bg-white rounded-2xl shadow-neumorphic-in min-h-[150px] flex items-center justify-center">
                <pre className="text-brand-text whitespace-pre-wrap font-sans text-center">{content[format as keyof typeof content]}</pre>
            </div>
        </div>
    );
};

// 5. Workflow Hook
const WorkflowHook: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-brand-text">Multi-Modal Workflow Integration</h3>
            <div className="relative p-8 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">

                    <div className="p-4 bg-white shadow-md rounded-xl border border-gray-100 w-32">
                        <div className="text-2xl mb-2">📸</div>
                        <div className="text-xs font-bold text-gray-600">Input: Image</div>
                    </div>

                    <div className="hidden md:block text-gray-300">➜</div>

                    <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 shadow-md rounded-xl w-40 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[10px] px-2 py-0.5 rounded-full">AGENT</div>
                        <div className="text-2xl mb-2">🧠</div>
                        <div className="text-xs font-bold text-brand-primary">Analysis & Routing</div>
                    </div>

                    <div className="hidden md:block text-gray-300">➜</div>

                    <div className="flex flex-col gap-2">
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg w-40 text-xs font-bold text-red-600">If Hazard → Alert</div>
                        <div className="p-3 bg-green-50 border border-green-100 rounded-lg w-40 text-xs font-bold text-green-600">If Safe → Log</div>
                    </div>

                </div>
            </div>
            <p className="text-center text-sm text-gray-500">Multi-modal agents act as intelligent "routers," converting raw sensory data into specific workflow actions.</p>
        </div>
    );
};

const MultiModalLab: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('perception');

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        if (user && !user.progress.completedInteractives.includes(interactiveId)) {
            // Simple gamification: awarding points on exploration
            addPoints(5);
            // Only mark complete if they've visited multiple? Simplified for now.
            updateProgress(interactiveId, 'interactive');
        }
    };

    const tabs: { id: Tab, label: string, icon: string }[] = [
        { id: 'perception', label: 'Perception Lab', icon: '👁️' },
        { id: 'sync', label: 'Sync Lab', icon: '🎛️' },
        { id: 'signal', label: 'Signal Game', icon: '📡' },
        { id: 'formats', label: 'Format Shifter', icon: '📝' },
        { id: 'workflow', label: 'Workflow Hook', icon: '🔗' },
    ];

    return (
        <div className="my-10 p-1 rounded-3xl bg-gradient-to-br from-brand-secondary/20 to-brand-primary/20 shadow-neumorphic-out border border-white/60 backdrop-blur-md">
            <div className="bg-brand-bg/95 rounded-[22px] overflow-hidden min-h-[500px] flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-lg">
                            <SparklesIcon />
                        </div>
                        <div>
                            <h4 className="font-bold text-2xl text-brand-text">Multi-Modal Agent Suite</h4>
                            <p className="text-xs text-brand-text-light">Operational Eyes & Ears for AI</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex bg-gray-100/50 p-1 rounded-xl overflow-x-auto max-w-full">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-brand-primary shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <span>{tab.icon}</span> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="p-8 flex-grow bg-white/30">
                    {activeTab === 'perception' && <PerceptionLab />}
                    {activeTab === 'sync' && <SyncLab />}
                    {activeTab === 'signal' && <SignalGame />}
                    {activeTab === 'formats' && <FormatSwitcher />}
                    {activeTab === 'workflow' && <WorkflowHook />}
                </div>

            </div>
        </div>
    );
};

export default MultiModalLab;
