
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Type } from '@google/genai';

// --- Types ---
type Tab = 'scanner' | 'risk' | 'diff' | 'receipt' | 'quest' | 'rbac';
type RedactionMode = 'MASK' | 'REPLACE' | 'HASH';

interface PiiResult {
    originalText: string;
    redactedText: string;
    piiFound: { type: string, value: string }[];
    riskScore: number;
    timestamp: string;
    scanId: string;
}

const EXAMPLE_TEXT = `User: Sarah Jenkins
Email: s.jenkins88@example.com
Phone: (555) 019-2834
Notes: Patient ID #99281. Diagnosed with mild hypertension. Prescribed Lisinopril. Address: 42 Maple Ave, Springfield.`;

// --- Mini-Apps ---

// 1. Scanner & Diff & Risk Logic (Core)
const ScannerTab: React.FC<{ 
    onScan: (text: string, mode: RedactionMode) => void; 
    loading: boolean; 
    result: PiiResult | null 
}> = ({ onScan, loading, result }) => {
    const [text, setText] = useState(EXAMPLE_TEXT);
    const [mode, setMode] = useState<RedactionMode>('MASK');

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Controls */}
                <div className="md:w-1/3 space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Redaction Mode</h5>
                        <div className="space-y-2">
                            {(['MASK', 'REPLACE', 'HASH'] as RedactionMode[]).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all ${mode === m ? 'bg-brand-primary text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                >
                                    {m === 'MASK' && 'Mask (j***@ex.com)'}
                                    {m === 'REPLACE' && 'Replace ([EMAIL])'}
                                    {m === 'HASH' && 'Hash (User_A7X)'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={() => onScan(text, mode)} 
                        disabled={loading}
                        className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <SparklesIcon />}
                        Scan for PII
                    </button>
                </div>

                {/* Input Area */}
                <div className="md:w-2/3">
                    <div className="relative h-full">
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            className="w-full h-64 p-4 bg-brand-bg rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 font-mono text-sm resize-none shadow-inner"
                            placeholder="Paste text containing PII here..."
                        />
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <button onClick={() => setText(EXAMPLE_TEXT)} className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 text-brand-text-light font-medium">
                                Load Medical Example
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RiskMeter: React.FC<{ result: PiiResult }> = ({ result }) => {
    const score = result.riskScore;
    let level = 'LOW';
    let color = 'bg-green-500';
    let text = 'text-green-600';

    if (score > 70) { level = 'HIGH'; color = 'bg-red-500'; text = 'text-red-600'; }
    else if (score > 30) { level = 'MEDIUM'; color = 'bg-yellow-500'; text = 'text-yellow-600'; }

    return (
        <div className="flex flex-col items-center justify-center h-full animate-fade-in p-8">
            <div className="relative w-64 h-32 overflow-hidden mb-6">
                {/* Gauge Background */}
                <div className="absolute bottom-0 w-full h-full bg-gray-200 rounded-t-full"></div>
                {/* Gauge Fill */}
                <div 
                    className={`absolute bottom-0 w-full h-full ${color} rounded-t-full origin-bottom transition-transform duration-1000 ease-out`}
                    style={{ transform: `rotate(${(score / 100) * 180 - 180}deg)` }}
                ></div>
                {/* Cover Center */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-32 h-32 bg-white rounded-full flex items-start justify-center pt-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                    <span className={`text-2xl font-black ${text}`}>{score}</span>
                </div>
            </div>
            <h4 className={`text-2xl font-bold ${text} tracking-wider`}>{level} RISK</h4>
            <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-sm text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-400 uppercase font-bold">Identifiers</div>
                    <div className="text-xl font-bold text-gray-700">{result.piiFound.length}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-400 uppercase font-bold">Sensitivity</div>
                    <div className="text-xl font-bold text-gray-700">{result.piiFound.some(p => p.type.includes('Health') || p.type.includes('ID')) ? 'Critical' : 'Standard'}</div>
                </div>
            </div>
        </div>
    );
};

const DiffViewer: React.FC<{ result: PiiResult }> = ({ result }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full animate-fade-in">
            <div className="bg-red-50/50 p-4 rounded-xl border border-red-100">
                <h5 className="text-xs font-bold text-red-400 uppercase mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span> Original Input
                </h5>
                <p className="font-mono text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result.originalText}</p>
            </div>
            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                <h5 className="text-xs font-bold text-green-500 uppercase mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Safe Output
                </h5>
                <p className="font-mono text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result.redactedText}</p>
            </div>
        </div>
    );
};

const GovernanceReceipt: React.FC<{ result: PiiResult }> = ({ result }) => {
    return (
        <div className="flex justify-center animate-fade-in">
            <div className="bg-white p-6 rounded-none w-full max-w-sm shadow-[0_0_15px_rgba(0,0,0,0.1)] border-t-4 border-brand-primary relative font-mono text-xs">
                {/* Paper Tear Effect Top/Bottom could go here conceptually */}
                <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
                    <h3 className="text-lg font-bold text-gray-800">GOVERNANCE LOG</h3>
                    <p className="text-gray-500">{result.timestamp}</p>
                    <p className="text-gray-400">ID: {result.scanId}</p>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Scan Status:</span>
                        <span className="font-bold text-green-600">COMPLETED</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Risk Score:</span>
                        <span className="font-bold">{result.riskScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">User Role:</span>
                        <span className="font-bold">Staff_Viewer</span>
                    </div>
                </div>

                <div className="border-t border-dashed border-gray-300 pt-4 mb-4">
                    <p className="font-bold text-gray-600 mb-2">DETECTED ENTITIES</p>
                    {result.piiFound.map((item, i) => (
                        <div key={i} className="flex justify-between mb-1">
                            <span>{item.type}</span>
                            <span className="text-gray-400">[REDACTED]</span>
                        </div>
                    ))}
                </div>

                <div className="text-center pt-4 border-t border-gray-300">
                    <div className="inline-block border-2 border-brand-primary text-brand-primary px-3 py-1 rounded font-bold uppercase text-[10px] tracking-widest opacity-50 rotate-[-12deg]">
                        Audited
                    </div>
                </div>
            </div>
        </div>
    );
};

const RedactionQuest: React.FC = () => {
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    const levels = [
        { 
            text: "Contact me at j.doe@email.com or 555-0199.", 
            targets: ["j.doe@email.com", "555-0199"],
            hint: "Find the Email and Phone Number."
        },
        { 
            text: "Subject ID: 8821. Diagnosis: Acute Bronchitis.", 
            targets: ["8821", "Acute Bronchitis"],
            hint: "Find the ID and the Medical Condition."
        },
        {
            text: "Meeting with Alex S. regarding Project X.",
            targets: ["Alex S."],
            hint: "Find the Name (even partial)."
        }
    ];

    const currentLevel = levels[level];

    const handleWordClick = (word: string) => {
        // Strip punctuation for matching
        const cleanWord = word.replace(/[.,]/g, '');
        const isTarget = currentLevel.targets.some(t => t.includes(cleanWord));

        if (isTarget) {
            setScore(prev => prev + 10);
            setFeedback("✅ Correct! PII identified.");
            if (score + 10 >= (level + 1) * 20) { // Rough logic to advance level
                setTimeout(() => {
                    if (level < levels.length - 1) {
                        setLevel(prev => prev + 1);
                        setFeedback(null);
                    } else {
                        setFeedback("🏆 Quest Complete! You have a sharp eye for privacy.");
                    }
                }, 1000);
            }
        } else {
            setFeedback("❌ Not PII. That's safe context.");
        }
    };

    return (
        <div className="space-y-6 text-center animate-fade-in p-4">
            <h4 className="font-bold text-xl text-brand-text">Level {level + 1}: {currentLevel.hint}</h4>
            <div className="bg-white p-8 rounded-2xl shadow-inner border border-gray-200 text-lg leading-loose">
                {currentLevel.text.split(' ').map((word, i) => (
                    <span 
                        key={i} 
                        onClick={() => handleWordClick(word)}
                        className="cursor-pointer hover:bg-red-100 hover:text-red-600 rounded px-1 transition-colors mx-0.5"
                    >
                        {word}
                    </span>
                ))}
            </div>
            <div className="flex justify-between items-center px-8">
                <div className="font-mono text-sm text-gray-500">Score: {score}</div>
                {feedback && <div className={`font-bold ${feedback.includes('✅') || feedback.includes('🏆') ? 'text-green-500' : 'text-red-500'}`}>{feedback}</div>}
            </div>
        </div>
    );
};

const RbacSim: React.FC<{ result: PiiResult | null }> = ({ result }) => {
    const [role, setRole] = useState<'staff' | 'manager' | 'admin'>('staff');

    if (!result) return <div className="text-center text-gray-400 mt-10">Run a scan first to inspect permissions.</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex bg-gray-100 p-1 rounded-xl">
                {(['staff', 'manager', 'admin'] as const).map(r => (
                    <button 
                        key={r} 
                        onClick={() => setRole(r)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${role === r ? 'bg-white shadow text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {r}
                    </button>
                ))}
            </div>

            <div className="bg-slate-900 rounded-xl p-6 font-mono text-sm text-green-400 shadow-inner min-h-[200px]">
                <div className="border-b border-gray-700 pb-2 mb-4 text-gray-500 uppercase text-xs flex justify-between">
                    <span>View Mode: {role.toUpperCase()}</span>
                    <span>System_Log_v2.4</span>
                </div>
                
                {role === 'staff' && (
                    <div>
                        {result.redactedText}
                        <div className="mt-4 text-gray-500">[System] PII masked for Staff Level clearance.</div>
                    </div>
                )}
                
                {role === 'manager' && (
                    <div>
                        {result.originalText.replace(/(#\d+)/g, '<ID_HIDDEN>')}
                        <div className="mt-4 text-yellow-500">[System] Partial redaction. Medical IDs hidden. Names visible.</div>
                    </div>
                )}

                {role === 'admin' && (
                    <div>
                        {result.originalText}
                        <div className="mt-4 text-red-500 border-t border-gray-700 pt-2">
                            ⚠️ AUDIT ALERT: You are viewing unredacted PII. This access has been logged to the Governance Ledger.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Component ---

const PrivacyLensDashboard: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('scanner');
    const [result, setResult] = useState<PiiResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleScan = async (inputText: string, mode: RedactionMode) => {
        setLoading(true);
        
        let instruction = "";
        if (mode === 'MASK') instruction = "Replace PII with asterisks (e.g. j***@d**.com).";
        if (mode === 'REPLACE') instruction = "Replace PII with generic tags (e.g. [EMAIL], [NAME]).";
        if (mode === 'HASH') instruction = "Replace PII with unique consistent hashes (e.g. Person_A, Email_B).";

        const prompt = `Analyze the following text for PII (Personally Identifiable Information).
        1. Identify names, emails, phones, addresses, IDs, and health info.
        2. Create a redacted version based on this rule: ${instruction}
        3. Assign a Risk Score (0-100) based on sensitivity.
        4. List found entities.

        Text: "${inputText}"`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            redactedText: { type: Type.STRING },
                            piiFound: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        type: { type: Type.STRING },
                                        value: { type: Type.STRING }
                                    }
                                }
                            },
                            riskScore: { type: Type.NUMBER }
                        }
                    }
                }
            });

            const data = JSON.parse(response.text);
            const scanResult: PiiResult = {
                originalText: inputText,
                redactedText: data.redactedText,
                piiFound: data.piiFound,
                riskScore: data.riskScore,
                timestamp: new Date().toISOString(),
                scanId: Math.random().toString(36).substr(2, 9).toUpperCase()
            };

            setResult(scanResult);
            if (user && !user.progress.completedInteractives.includes(interactiveId)) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const tabs: { id: Tab, label: string, icon: string }[] = [
        { id: 'scanner', label: '1. Scanner', icon: '🔍' },
        { id: 'risk', label: '2. Risk Meter', icon: '⚡' },
        { id: 'diff', label: '3. Diff View', icon: '📝' },
        { id: 'receipt', label: '4. Receipt', icon: '🧾' },
        { id: 'rbac', label: '5. RBAC Sim', icon: '👥' },
        { id: 'quest', label: 'Play: Redaction Quest', icon: '🎮' },
    ];

    return (
        <div className="my-10 p-1 rounded-3xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 shadow-neumorphic-out border border-white/60 backdrop-blur-md">
            <div className="bg-brand-bg/95 rounded-[22px] overflow-hidden min-h-[600px] flex flex-col">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg">
                            <SparklesIcon />
                        </div>
                        <div>
                            <h4 className="font-bold text-2xl text-brand-text">Privacy Lens</h4>
                            <p className="text-xs text-brand-text-light">Governance & Transparency Suite</p>
                        </div>
                    </div>
                    
                    {/* Navigation */}
                    <div className="flex bg-gray-100/50 p-1 rounded-xl overflow-x-auto max-w-full liquid-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-brand-primary shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <span>{tab.icon}</span> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="p-8 flex-grow bg-white/30 relative">
                    {activeTab === 'scanner' && <ScannerTab onScan={handleScan} loading={loading} result={result} />}
                    
                    {(activeTab !== 'scanner' && activeTab !== 'quest' && !result) && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                            <div className="text-4xl">🔒</div>
                            <p>Please run a scan in the <strong>Scanner</strong> tab first.</p>
                            <button onClick={() => setActiveTab('scanner')} className="text-brand-primary underline hover:text-brand-secondary">Go to Scanner</button>
                        </div>
                    )}

                    {activeTab === 'risk' && result && <RiskMeter result={result} />}
                    {activeTab === 'diff' && result && <DiffViewer result={result} />}
                    {activeTab === 'receipt' && result && <GovernanceReceipt result={result} />}
                    {activeTab === 'rbac' && <RbacSim result={result} />}
                    {activeTab === 'quest' && <RedactionQuest />}
                </div>

            </div>
        </div>
    );
};

export default PrivacyLensDashboard;
