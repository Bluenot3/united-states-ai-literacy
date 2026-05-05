
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { CloseIcon } from '../icons/CloseIcon';

// --- Types ---
type Tab = 'gatekeeper' | 'design' | 'simulation' | 'funnel';

// --- Mini-Apps ---

// 1. Approval Gatekeeper Game
const GatekeeperGame: React.FC = () => {
    const [score, setScore] = useState(0);
    const [currentCard, setCurrentCard] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    const cards = [
        { id: 1, text: "Send meeting summary to internal team.", correct: 'auto', reason: "Internal, low risk. Auto-approve is efficient." },
        { id: 2, text: "Approve background check for new hire.", correct: 'human', reason: "High stakes (employment). Human must verify." },
        { id: 3, text: "Trigger disciplinary documentation.", correct: 'escalate', reason: "Legal/HR risk. Requires admin/leadership escalation." },
        { id: 4, text: "Update dashboard metric.", correct: 'auto', reason: "Data viz update. Low risk." },
        { id: 5, text: "Send message to external partner.", correct: 'human', reason: "External communication. Brand risk requires review." },
    ];

    const handleChoice = (choice: 'auto' | 'human' | 'escalate') => {
        const card = cards[currentCard];
        let correct = false;
        if (choice === card.correct) correct = true;
        // Allow human approval for escalate scenarios as "safe enough" but maybe not optimal? 
        // For simplicity, strict matching.
        
        if (correct) {
            setScore(prev => prev + 20);
            setFeedback("✅ Correct! " + card.reason);
        } else {
            setFeedback("❌ Incorrect. " + card.reason);
        }

        setTimeout(() => {
            if (currentCard < cards.length - 1) {
                setCurrentCard(prev => prev + 1);
                setFeedback(null);
            } else {
                setIsComplete(true);
            }
        }, 2000);
    };

    if (isComplete) {
        return (
            <div className="text-center py-12 animate-fade-in">
                <div className="text-6xl mb-4">🛡️</div>
                <h3 className="text-2xl font-bold text-brand-text mb-2">Gatekeeper Certification Complete</h3>
                <p className="text-brand-text-light mb-6">Final Score: {score}/100</p>
                <button onClick={() => { setCurrentCard(0); setScore(0); setIsComplete(false); setFeedback(null); }} className="px-6 py-2 bg-brand-primary text-white rounded-lg shadow-lg hover:bg-brand-primary/90">
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-brand-text text-center">Approval Gatekeeper</h3>
            <p className="text-sm text-center text-gray-500 mb-6">Decide the level of autonomy for each task.</p>

            <div className="bg-white p-8 rounded-2xl shadow-neumorphic-out border border-gray-100 text-center relative overflow-hidden min-h-[200px] flex flex-col justify-center">
                <div className="absolute top-2 right-2 text-xs font-bold text-gray-300">Card {currentCard + 1}/{cards.length}</div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">{cards[currentCard].text}</h4>
                
                {feedback && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-300 ${feedback.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                        <p className="font-bold px-6">{feedback}</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 gap-3">
                <button onClick={() => handleChoice('auto')} disabled={!!feedback} className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 font-bold text-xs hover:bg-green-100 transition-colors disabled:opacity-50">
                    ⚡ Auto-Approve
                </button>
                <button onClick={() => handleChoice('human')} disabled={!!feedback} className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 font-bold text-xs hover:bg-yellow-100 transition-colors disabled:opacity-50">
                    👀 Human Review
                </button>
                <button onClick={() => handleChoice('escalate')} disabled={!!feedback} className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-bold text-xs hover:bg-red-100 transition-colors disabled:opacity-50">
                    🚨 Escalate
                </button>
            </div>
        </div>
    );
};

// 2. Design Safety Lab
const DesignSafetyLab: React.FC = () => {
    const [foundFlaws, setFoundFlaws] = useState<string[]>([]);
    const [activeExplanation, setActiveExplanation] = useState<string | null>(null);

    const flaws = [
        { id: 'buttons', label: 'Ambiguous Buttons', explanation: "Risk: Accidental Approval. Primary actions should be distinct from cancel actions.", css: "bottom-4 left-4 right-4 h-10" },
        { id: 'password', label: 'Weak Password UX', explanation: "Risk: System Compromise. No strength meter or requirements shown.", css: "top-[40%] left-4 right-4 h-10" },
        { id: 'privacy', label: 'Missing Privacy Notice', explanation: "Risk: Trust/Consent Failure. Users need to know why data is collected.", css: "bottom-16 left-4 right-4 h-6" }
    ];

    const handleFlawClick = (id: string, explanation: string) => {
        if (!foundFlaws.includes(id)) {
            setFoundFlaws([...foundFlaws, id]);
        }
        setActiveExplanation(explanation);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            {/* Interactive Mock UI */}
            <div className="relative bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-w-sm mx-auto w-full aspect-[9/16]">
                <div className="bg-gray-100 p-4 border-b text-center text-sm font-bold text-gray-500">Unsafe UI v1.0</div>
                <div className="p-6 flex flex-col h-full justify-center">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Sign Up</h2>
                    <p className="text-center text-gray-400 text-sm mb-8">Create an account to continue</p>
                    
                    <div className="space-y-4 mb-8">
                        <input type="text" placeholder="Email" className="w-full p-3 border border-gray-300 rounded bg-gray-50" readOnly />
                        <input type="password" placeholder="Password" className="w-full p-3 border border-gray-300 rounded bg-gray-50" readOnly />
                    </div>

                    <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-red-500 text-white rounded">Cancel</button>
                        <button className="flex-1 py-2 bg-blue-500 text-white rounded">Submit</button>
                    </div>
                </div>

                {/* Hotspots */}
                {flaws.map(flaw => (
                    <button
                        key={flaw.id}
                        onClick={() => handleFlawClick(flaw.id, flaw.explanation)}
                        className={`absolute ${flaw.css} border-2 border-dashed transition-all duration-300 ${foundFlaws.includes(flaw.id) ? 'border-green-500 bg-green-500/20' : 'border-transparent hover:border-red-400 hover:bg-red-400/10'}`}
                    />
                ))}
            </div>

            {/* Explainer Panel */}
            <div className="flex flex-col justify-center">
                <h3 className="text-xl font-bold text-brand-text mb-4">Safety Audit Panel</h3>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-64 overflow-y-auto relative">
                    {activeExplanation ? (
                        <div className="animate-fade-in">
                            <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2">
                                ⚠️ Risk Identified
                            </h4>
                            <p className="text-gray-700 leading-relaxed">{activeExplanation}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm italic">
                            <p>Click elements on the UI to audit them.</p>
                        </div>
                    )}
                </div>
                <div className="mt-4 flex gap-2">
                    <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Audit Progress:</span>
                    <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                        <div className="bg-brand-primary h-full transition-all duration-500" style={{ width: `${(foundFlaws.length / flaws.length) * 100}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-brand-primary">{foundFlaws.length}/{flaws.length}</span>
                </div>
            </div>
        </div>
    );
};

// 3. Approval Simulation
const ApprovalSim: React.FC = () => {
    const [step, setStep] = useState(0);
    const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);

    const emailDraft = `Subject: Partnership Proposal\n\nHi [Name],\n\nWe'd love to partner with you. Our AI analysis shows a 98% synergy score. Please sign the attached contract by Friday.\n\nBest,\nAutomated Agent`;

    const handleAction = (d: 'approved' | 'rejected') => {
        setDecision(d);
        setStep(3);
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-brand-text text-center">HITL Workflow Simulator</h3>
            
            {/* Timeline */}
            <div className="flex justify-between items-center mb-8 px-4 relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 rounded-full"></div>
                {['Draft', 'Risk Check', 'Review', 'Action'].map((label, i) => (
                    <div key={i} className={`flex flex-col items-center gap-2 ${step >= i ? 'opacity-100' : 'opacity-40'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-white ${step >= i ? 'border-brand-primary text-brand-primary' : 'border-gray-300 text-gray-300'}`}>
                            {i + 1}
                        </div>
                        <span className="text-[10px] font-bold uppercase">{label}</span>
                    </div>
                ))}
            </div>

            {/* Sim Content */}
            <div className="bg-white p-6 rounded-2xl shadow-neumorphic-in border border-gray-100 min-h-[300px]">
                {step === 0 && (
                    <div className="text-center py-8">
                        <div className="animate-pulse text-4xl mb-4">🤖</div>
                        <h4 className="text-lg font-bold mb-2">Agent Working...</h4>
                        <p className="text-gray-500">Drafting email to external partner based on CRM data.</p>
                        <button onClick={() => setStep(1)} className="mt-6 px-6 py-2 bg-brand-primary text-white rounded-lg">Next</button>
                    </div>
                )}

                {step === 1 && (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4">🛡️</div>
                        <h4 className="text-lg font-bold mb-2">Guardrail Check</h4>
                        <div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold mb-4">Risk Level: MEDIUM</div>
                        <p className="text-gray-500">External communication detected. Policy requires human approval.</p>
                        <button onClick={() => setStep(2)} className="mt-6 px-6 py-2 bg-brand-primary text-white rounded-lg">Send to Queue</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="text-left">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 font-mono text-sm text-gray-700 mb-6 whitespace-pre-wrap">
                            {emailDraft}
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => handleAction('rejected')} className="flex-1 py-3 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200">Reject / Edit</button>
                            <button onClick={() => handleAction('approved')} className="flex-1 py-3 bg-green-100 text-green-700 font-bold rounded-xl hover:bg-green-200">Approve & Send</button>
                        </div>
                    </div>
                )}

                {step === 3 && decision && (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4">{decision === 'approved' ? '🚀' : '🛑'}</div>
                        <h4 className="text-lg font-bold mb-2">{decision === 'approved' ? 'Action Executed' : 'Action Blocked'}</h4>
                        <div className="bg-slate-900 text-green-400 font-mono text-xs p-4 rounded-xl text-left mt-4">
                            <div>[AUDIT LOG] {new Date().toLocaleTimeString()}</div>
                            <div>User: admin@zen.ai</div>
                            <div>Action: {decision.toUpperCase()}</div>
                            <div>Resource: Email_Draft_v1</div>
                        </div>
                        <button onClick={() => { setStep(0); setDecision(null); }} className="mt-6 text-brand-primary hover:underline">Reset</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// 4. Approval Funnel (Visual)
const ApprovalFunnel: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-brand-text text-center">Live Operations Funnel</h3>
            
            <div className="flex flex-col gap-2 max-w-lg mx-auto">
                <div className="w-full bg-blue-100 p-3 rounded-lg flex justify-between items-center text-blue-900">
                    <span className="font-bold text-sm">Tasks Initiated</span>
                    <span className="font-mono font-bold">1,240</span>
                </div>
                
                <div className="w-[85%] mx-auto bg-blue-200 p-3 rounded-lg flex justify-between items-center text-blue-900">
                    <span className="font-bold text-sm">Auto-Approved (Low Risk)</span>
                    <span className="font-mono font-bold">890</span>
                </div>

                <div className="w-[60%] mx-auto bg-yellow-100 p-3 rounded-lg flex justify-between items-center text-yellow-900 border border-yellow-200">
                    <span className="font-bold text-sm">Flagged for Human Review</span>
                    <span className="font-mono font-bold">310</span>
                </div>

                <div className="w-[40%] mx-auto bg-green-100 p-3 rounded-lg flex justify-between items-center text-green-900 border border-green-200">
                    <span className="font-bold text-sm">Human Approved</span>
                    <span className="font-mono font-bold">245</span>
                </div>

                <div className="w-[20%] mx-auto bg-red-100 p-3 rounded-lg flex justify-between items-center text-red-900 border border-red-200">
                    <span className="font-bold text-sm">Rejected</span>
                    <span className="font-mono font-bold">65</span>
                </div>
            </div>
            
            <p className="text-center text-xs text-gray-400 mt-4">Real-time metrics from the last 24 hours.</p>
        </div>
    );
};

const HitlLab: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('gatekeeper');

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        if (user && !user.progress.completedInteractives.includes(interactiveId)) {
            addPoints(5);
            updateProgress(interactiveId, 'interactive');
        }
    };

    const tabs: { id: Tab, label: string, icon: string }[] = [
        { id: 'gatekeeper', label: 'Gatekeeper Game', icon: '🎮' },
        { id: 'design', label: 'Safety Audit', icon: '🕵️' },
        { id: 'simulation', label: 'Approval Sim', icon: '🧪' },
        { id: 'funnel', label: 'Ops Data', icon: '📊' },
    ];

    return (
        <div className="my-10 p-1 rounded-3xl bg-gradient-to-br from-brand-primary/20 to-purple-600/20 shadow-neumorphic-out border border-white/60 backdrop-blur-md">
            <div className="bg-brand-bg/95 rounded-[22px] overflow-hidden min-h-[500px] flex flex-col">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg shadow-lg">
                            <CheckIcon />
                        </div>
                        <div>
                            <h4 className="font-bold text-2xl text-brand-text">HITL Control Center</h4>
                            <p className="text-xs text-brand-text-light">Human-in-the-Loop Automation Suite</p>
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
                    {activeTab === 'gatekeeper' && <GatekeeperGame />}
                    {activeTab === 'design' && <DesignSafetyLab />}
                    {activeTab === 'simulation' && <ApprovalSim />}
                    {activeTab === 'funnel' && <ApprovalFunnel />}
                </div>

            </div>
        </div>
    );
};

export default HitlLab;
