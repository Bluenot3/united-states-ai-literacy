
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';

interface Case {
    id: number;
    title: string;
    data: { label: string; value: string }[];
    aiAnalysis: {
        recommendation: 'APPROVE' | 'REJECT' | 'ESCALATE';
        confidence: number;
        reasoning: string;
    };
    ragContext: {
        source: string;
        snippet: string;
        relevance: 'HIGH' | 'MED' | 'LOW';
    }[];
    correctDecision: 'APPROVE' | 'REJECT' | 'ESCALATE';
}

const CASES: Case[] = [
    {
        id: 1,
        title: "Transaction Flag #8821",
        data: [
            { label: "Amount", value: "$12,500.00" },
            { label: "Merchant", value: "TechGlobal Inc." },
            { label: "Location", value: "Singapore (User in NY)" },
            { label: "Time", value: "3:42 AM EST" }
        ],
        aiAnalysis: {
            recommendation: 'REJECT',
            confidence: 88,
            reasoning: "Location mismatch and unusual time for high-value transaction."
        },
        ragContext: [
            {
                source: "Travel Logs",
                snippet: "User filed travel notification for Singapore trip (Dates: Oct 12-20).",
                relevance: "HIGH"
            },
            {
                source: "Vendor History",
                snippet: "User has 3 prior transactions with TechGlobal Inc > $5k in last year.",
                relevance: "MED"
            }
        ],
        correctDecision: 'APPROVE'
    },
    {
        id: 2,
        title: "Content Mod Queue #994",
        data: [
            { label: "User", value: "@CryptoKing99" },
            { label: "Message", value: "This project is going to the moon! 🚀 Guaranteed 100x returns if you buy now!" },
            { label: "Channel", value: "#general-chat" }
        ],
        aiAnalysis: {
            recommendation: 'APPROVE',
            confidence: 65,
            reasoning: "Sentiment is positive. No explicit profanity found."
        },
        ragContext: [
            {
                source: "Community Guidelines v4.2",
                snippet: "Section 5.1: Financial advice and 'guaranteed returns' claims are strictly prohibited to prevent scams.",
                relevance: "HIGH"
            }
        ],
        correctDecision: 'REJECT'
    }
];

const HitlRagSimulator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [caseIndex, setCaseIndex] = useState(0);
    const [showRag, setShowRag] = useState(false);
    const [feedback, setFeedback] = useState<'success' | 'failure' | null>(null);
    const [decisionLog, setDecisionLog] = useState<string[]>([]);

    const currentCase = CASES[caseIndex];

    const handleDecision = (decision: 'APPROVE' | 'REJECT' | 'ESCALATE') => {
        const isCorrect = decision === currentCase.correctDecision;
        
        if (isCorrect) {
            setFeedback('success');
            if (user && !user.progress.completedInteractives.includes(interactiveId)) {
                addPoints(15);
                updateProgress(interactiveId, 'interactive');
            }
        } else {
            setFeedback('failure');
        }

        const logEntry = `Case ${currentCase.id}: ${decision} (${isCorrect ? 'Correct' : 'Incorrect'}) - RAG ${showRag ? 'ON' : 'OFF'}`;
        setDecisionLog(prev => [logEntry, ...prev]);

        setTimeout(() => {
            if (caseIndex < CASES.length - 1) {
                setCaseIndex(prev => prev + 1);
                setFeedback(null);
                setShowRag(false);
            } else {
                setCaseIndex(0); // Loop
                setFeedback(null);
                setShowRag(false);
            }
        }, 2000);
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out border border-gray-100">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">HITL Decision Console</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: The Data & AI Opinion */}
                <div className="space-y-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h5 className="font-bold text-brand-text">{currentCase.title}</h5>
                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">ID: {currentCase.id}</span>
                        </div>
                        <div className="space-y-2 mb-6">
                            {currentCase.data.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm border-b border-gray-50 pb-1">
                                    <span className="text-gray-500">{item.label}</span>
                                    <span className="font-medium text-gray-800 text-right">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                                <SparklesIcon />
                                <span className="text-xs font-bold uppercase text-slate-500">AI Recommendation</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-lg font-black ${currentCase.aiAnalysis.recommendation === 'APPROVE' ? 'text-green-600' : 'text-red-500'}`}>
                                    {currentCase.aiAnalysis.recommendation}
                                </span>
                                <span className="text-xs font-bold text-gray-400">{currentCase.aiAnalysis.confidence}% Conf.</span>
                            </div>
                            <p className="text-xs text-gray-600 italic">"{currentCase.aiAnalysis.reasoning}"</p>
                        </div>
                    </div>
                </div>

                {/* Right: The RAG Context */}
                <div className="space-y-4 flex flex-col">
                    <div className={`flex-grow p-5 rounded-xl border transition-all duration-500 relative overflow-hidden ${showRag ? 'bg-blue-50 border-blue-200' : 'bg-gray-100 border-gray-200'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h5 className="font-bold text-gray-700 flex items-center gap-2">
                                <span>📚</span> Knowledge Retrieval
                            </h5>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={showRag} onChange={() => setShowRag(!showRag)} />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-2 text-xs font-bold text-gray-500">{showRag ? 'ON' : 'OFF'}</span>
                            </label>
                        </div>

                        {showRag ? (
                            <div className="space-y-3 animate-fade-in">
                                {currentCase.ragContext.map((ctx, i) => (
                                    <div key={i} className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-[10px] font-bold text-blue-600 uppercase">{ctx.source}</span>
                                            <span className={`text-[10px] font-bold px-1.5 rounded ${ctx.relevance === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>{ctx.relevance}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-tight">"{ctx.snippet}"</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                <div className="text-3xl mb-2 opacity-50">🔒</div>
                                <p className="text-sm text-center">Context Hidden.<br/>Make a decision based on data alone.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Decision Controls */}
            <div className="mt-6 flex flex-col items-center">
                {feedback ? (
                    <div className={`text-lg font-bold mb-4 animate-fade-in ${feedback === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        {feedback === 'success' ? 'Correct Decision! Context matters.' : 'Incorrect. Check the RAG context next time.'}
                    </div>
                ) : (
                    <div className="flex gap-4 w-full max-w-md">
                        <button onClick={() => handleDecision('REJECT')} className="flex-1 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition-colors">Reject</button>
                        <button onClick={() => handleDecision('ESCALATE')} className="flex-1 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold rounded-xl transition-colors">Escalate</button>
                        <button onClick={() => handleDecision('APPROVE')} className="flex-1 py-3 bg-green-100 hover:bg-green-200 text-green-700 font-bold rounded-xl transition-colors">Approve</button>
                    </div>
                )}
            </div>

            {/* Mini Log */}
            {decisionLog.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Audit Log</p>
                    <div className="font-mono text-xs text-gray-500 space-y-1">
                        {decisionLog.slice(0, 3).map((log, i) => (
                            <div key={i}>&gt; {log}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HitlRagSimulator;
