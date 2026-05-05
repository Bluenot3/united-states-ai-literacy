
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { InteractiveComponentProps } from '../../types';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Type } from '@google/genai';

const EXAMPLE_TRANSCRIPT = `Alex: Okay team, let's kick off. The main topic today is the Q3 product launch. Jane, can you give us an update?
Jane: Sure. We're on track. The final UI designs were approved yesterday. We need to make a decision on the primary marketing channel, though. I'm leaning towards social media ads.
Mark: I agree with social media, but we also need to consider influencer outreach. It has a better ROI in our tests.
Alex: Good point, Mark. Let's go with a hybrid approach: 70% social media ads, 30% influencer outreach. Jane, can you action that?
Jane: Will do. I'll have a plan by EOD Friday.
Alex: Perfect. Anything else? No? Okay, great meeting.`;

interface AgentConfig {
    name: string;
    role: string;
    tone: string;
    guardrails: {
        piiRedaction: boolean;
        noHallucinations: boolean;
        policyCompliance: boolean;
    };
    memory: string;
}

interface SummaryResult {
    summary: string;
    actionItems: string[];
    risks: string[];
}

const CapstoneAgentBuilder: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();

    // Modes: 'design' | 'deploy' | 'processing' | 'results'
    const [mode, setMode] = useState<'design' | 'deploy' | 'processing' | 'results'>('design');
    const [step, setStep] = useState(1); // 1: Identity, 2: Logic, 3: Safety

    const [config, setConfig] = useState<AgentConfig>({
        name: 'BriefBot',
        role: 'Executive Assistant',
        tone: 'Professional & Action-Oriented',
        guardrails: {
            piiRedaction: true,
            noHallucinations: true,
            policyCompliance: true,
        },
        memory: 'Retain structure, discard filler'
    });

    const [transcript, setTranscript] = useState(EXAMPLE_TRANSCRIPT);
    const [timelineStep, setTimelineStep] = useState(0); // For Nano-Banana visualizer
    const [result, setResult] = useState<SummaryResult | null>(null);
    const [error, setError] = useState('');

    // --- Helpers ---

    const handleDesignNext = () => {
        if (step < 3) setStep(step + 1);
        else setMode('deploy');
    };

    const handleRunAgent = async () => {
        setMode('processing');
        setTimelineStep(0);
        setError('');

        // Start Nano-Banana Visualization Loop
        // Steps: 0:Input -> 1:Guardrail -> 2:Context -> 3:Plan -> 4:Tool -> 5:Output
        const visualSteps = [0, 1, 2, 3, 4, 5];
        for (const s of visualSteps) {
            setTimelineStep(s);
            await new Promise(r => setTimeout(r, 800)); // Simulate thinking time
        }

        // Call Gemini
        try {
            const ai = await getAiClient();

            const systemPrompt = `You are a single-purpose AI agent configured as follows:
            Role: ${config.role}
            Tone: ${config.tone}
            Memory Strategy: ${config.memory}
            Guardrails: ${config.guardrails.piiRedaction ? "Redact PII." : ""} ${config.guardrails.noHallucinations ? "Do not invent facts." : ""} ${config.guardrails.policyCompliance ? "Flag policy risks." : ""}
            
            Mission: Summarize the meeting transcript. Return JSON with 'summary', 'actionItems', and 'risks'.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Transcript:\n${transcript}`,
                config: {
                    systemInstruction: systemPrompt,
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            summary: { type: Type.STRING },
                            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                            risks: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    }
                }
            });

            const data = JSON.parse(response.text);
            setResult(data);
            setMode('results');

            if (user && !user.progress.completedInteractives.includes(interactiveId)) {
                addPoints(50);
                updateProgress(interactiveId, 'interactive');
            }

        } catch (e) {
            console.error(e);
            setError('Agent crashed. Please check transcript and try again.');
            setMode('deploy');
        }
    };

    return (
        <div className="my-10 p-1 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 shadow-neumorphic-out border border-white/60 backdrop-blur-md min-h-[600px] flex flex-col">
            <div className="bg-brand-bg/95 rounded-[22px] flex-grow flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
                    <div>
                        <h4 className="font-bold text-xl text-brand-text flex items-center gap-2">
                            <span className="text-2xl">⚡</span> Capstone Agent Builder
                        </h4>
                        <p className="text-xs text-brand-text-light mt-1">Design. Deploy. Operate.</p>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${(mode === 'design' && step >= i) || mode !== 'design' ? 'bg-brand-primary' : 'bg-gray-200'
                                }`}></div>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-8 flex-grow flex flex-col justify-center max-w-4xl mx-auto w-full">

                    {/* --- DESIGN MODE --- */}
                    {mode === 'design' && (
                        <div className="animate-fade-in space-y-6">
                            <h2 className="text-2xl font-bold text-center mb-8">
                                {step === 1 && "Phase 1: Define Identity"}
                                {step === 2 && "Phase 2: Logic & Memory"}
                                {step === 3 && "Phase 3: Safety Guardrails"}
                            </h2>

                            {step === 1 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Agent Name</label>
                                        <input type="text" value={config.name} onChange={e => setConfig({ ...config, name: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/50 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Role</label>
                                        <input type="text" value={config.role} onChange={e => setConfig({ ...config, role: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/50 outline-none" />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Tone</label>
                                        <div className="flex gap-3">
                                            {['Professional', 'Friendly', 'Concise', 'Analytic'].map(t => (
                                                <button key={t} onClick={() => setConfig({ ...config, tone: t })} className={`px-4 py-2 rounded-lg text-sm border transition-all ${config.tone === t ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>{t}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                        <h5 className="font-bold text-blue-800 mb-2">Memory Architecture</h5>
                                        <p className="text-sm text-blue-600 mb-4">How should the agent handle information?</p>
                                        <select value={config.memory} onChange={e => setConfig({ ...config, memory: e.target.value })} className="w-full p-3 rounded-lg border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none bg-white">
                                            <option>Retain structure, discard filler (Optimized)</option>
                                            <option>Verbatim retention (High fidelity)</option>
                                            <option>Extract only action items (Minimalist)</option>
                                        </select>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                        <h5 className="font-bold text-purple-800 mb-2">Reasoning Plan</h5>
                                        <div className="flex items-center gap-2 text-sm text-purple-700 overflow-x-auto pb-2">
                                            <span className="bg-white px-3 py-1 rounded shadow-sm">Input</span>
                                            <span>→</span>
                                            <span className="bg-white px-3 py-1 rounded shadow-sm">Analyze Context</span>
                                            <span>→</span>
                                            <span className="bg-white px-3 py-1 rounded shadow-sm">Extract Topics</span>
                                            <span>→</span>
                                            <span className="bg-white px-3 py-1 rounded shadow-sm">Format Report</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                                        <div>
                                            <div className="font-bold text-gray-800">Redact PII</div>
                                            <div className="text-xs text-gray-500">Remove names, emails, phones</div>
                                        </div>
                                        <input type="checkbox" checked={config.guardrails.piiRedaction} onChange={e => setConfig({ ...config, guardrails: { ...config.guardrails, piiRedaction: e.target.checked } })} className="w-6 h-6 text-brand-primary rounded focus:ring-brand-primary" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                                        <div>
                                            <div className="font-bold text-gray-800">Strict Fact-Checking</div>
                                            <div className="text-xs text-gray-500">Prevent hallucinations</div>
                                        </div>
                                        <input type="checkbox" checked={config.guardrails.noHallucinations} onChange={e => setConfig({ ...config, guardrails: { ...config.guardrails, noHallucinations: e.target.checked } })} className="w-6 h-6 text-brand-primary rounded focus:ring-brand-primary" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                                        <div>
                                            <div className="font-bold text-gray-800">Policy Compliance</div>
                                            <div className="text-xs text-gray-500">Flag HR/Legal risks</div>
                                        </div>
                                        <input type="checkbox" checked={config.guardrails.policyCompliance} onChange={e => setConfig({ ...config, guardrails: { ...config.guardrails, policyCompliance: e.target.checked } })} className="w-6 h-6 text-brand-primary rounded focus:ring-brand-primary" />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <button onClick={handleDesignNext} className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-brand-primary/90 transition-all flex items-center gap-2">
                                    {step === 3 ? "Finalize Agent" : "Next Phase"} ➜
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- DEPLOY MODE --- */}
                    {mode === 'deploy' && (
                        <div className="animate-fade-in h-full flex flex-col">
                            <div className="mb-4 text-center">
                                <h3 className="text-2xl font-bold text-brand-text mb-1">{config.name} is Online</h3>
                                <div className="flex justify-center gap-2 text-xs text-gray-500">
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">● Active</span>
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full">v1.0.0</span>
                                </div>
                            </div>

                            <div className="flex-grow bg-white rounded-2xl border border-gray-200 shadow-inner p-4 mb-6 relative">
                                <textarea
                                    value={transcript}
                                    onChange={e => setTranscript(e.target.value)}
                                    className="w-full h-full resize-none outline-none text-sm text-gray-700 font-mono"
                                    placeholder="Paste meeting transcript here..."
                                />
                                <div className="absolute bottom-4 right-4">
                                    <button onClick={() => setTranscript(EXAMPLE_TRANSCRIPT)} className="text-xs text-brand-primary hover:underline bg-white/80 px-2 py-1 rounded backdrop-blur">
                                        Reset Example
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button onClick={handleRunAgent} className="bg-brand-primary text-white font-bold py-4 px-10 rounded-full shadow-xl shadow-brand-primary/30 hover:scale-105 transition-transform flex items-center gap-3">
                                    <SparklesIcon />
                                    Run {config.name}
                                </button>
                            </div>
                            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
                        </div>
                    )}

                    {/* --- PROCESSING MODE (Nano-Banana Visualizer) --- */}
                    {mode === 'processing' && (
                        <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                            <h3 className="text-xl font-bold text-gray-700 mb-8">Agent Processing Timeline</h3>

                            <div className="relative w-full max-w-2xl">
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 rounded-full"></div>
                                <div className="flex justify-between">
                                    {['Input', 'Guardrails', 'Memory', 'Planning', 'Tools', 'Output'].map((label, i) => (
                                        <div key={i} className="flex flex-col items-center gap-3 transition-all duration-500">
                                            <div className={`
                                                w-12 h-12 rounded-full flex items-center justify-center border-4 z-10 bg-white
                                                ${timelineStep >= i ? 'border-brand-primary text-brand-primary scale-110 shadow-lg shadow-brand-primary/20' : 'border-gray-200 text-gray-300'}
                                                ${timelineStep === i ? 'animate-pulse ring-4 ring-brand-primary/20' : ''}
                                            `}>
                                                {i === 0 && '📥'}
                                                {i === 1 && '🛡️'}
                                                {i === 2 && '🧠'}
                                                {i === 3 && '📝'}
                                                {i === 4 && '🛠️'}
                                                {i === 5 && '📤'}
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wider ${timelineStep >= i ? 'text-brand-primary' : 'text-gray-300'}`}>
                                                {label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 bg-slate-900 text-green-400 font-mono text-sm p-6 rounded-xl w-full max-w-lg shadow-2xl">
                                <div className="mb-2 opacity-50 border-b border-white/10 pb-2">Internal Logs</div>
                                <div className="space-y-1">
                                    {timelineStep >= 0 && <div>{'>'} Receiving data stream (42kb)... OK</div>}
                                    {timelineStep >= 1 && <div>{'>'} Scanning for PII... CLEARED</div>}
                                    {timelineStep >= 2 && <div>{'>'} Retrieving context window... DONE</div>}
                                    {timelineStep >= 3 && <div>{'>'} Generating extraction plan...</div>}
                                    {timelineStep >= 4 && <div>{'>'} Invoking summarization_engine()...</div>}
                                    {timelineStep >= 5 && <div>{'>'} Formatting final report...</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- RESULTS MODE --- */}
                    {mode === 'results' && result && (
                        <div className="animate-fade-in h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-brand-text">Mission Complete</h3>
                                <button onClick={() => setMode('deploy')} className="text-sm font-bold text-gray-500 hover:text-brand-primary">
                                    Run Another Task
                                </button>
                            </div>

                            <div className="bg-white rounded-2xl shadow-neumorphic-in p-8 border border-gray-100 flex-grow overflow-y-auto liquid-scrollbar">
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-2">Executive Summary</h4>
                                    <p className="text-gray-700 leading-relaxed">{result.summary}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-3">Action Items</h4>
                                        <ul className="space-y-2">
                                            {result.actionItems.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <input type="checkbox" className="mt-1 text-green-500 rounded focus:ring-green-500" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-3">Risks & Flags</h4>
                                        <ul className="space-y-2">
                                            {result.risks.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <span className="text-red-500">⚠️</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CapstoneAgentBuilder;
