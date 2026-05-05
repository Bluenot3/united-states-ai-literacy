
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface Feature {
    id: string;
    label: string;
    impact: number; // Contribution to score
    description: string;
}

const FEATURES: Feature[] = [
    { id: 'sources', label: 'Show Sources (Citations)', impact: 25, description: 'Links response to grounding documents.' },
    { id: 'confidence', label: 'Confidence Score', impact: 15, description: 'Displays model certainty level.' },
    { id: 'reasoning', label: 'Chain of Thought', impact: 30, description: 'Exposes the internal reasoning steps.' },
    { id: 'audit', label: 'Audit ID Log', impact: 10, description: 'Provides a traceable transaction ID.' },
    { id: 'alternatives', label: 'Show Alternatives', impact: 20, description: 'Shows rejected paths or options.' }
];

const TransparencyScorecard: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [activeFeatures, setActiveFeatures] = useState<string[]>([]);

    const toggleFeature = (id: string) => {
        setActiveFeatures(prev => 
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
        
        // Gamification check: if score > 80
        const currentScore = activeFeatures.reduce((acc, fId) => {
            const feat = FEATURES.find(f => f.id === fId);
            return acc + (feat ? feat.impact : 0);
        }, 0);
        
        // Add current toggle impact
        const feature = FEATURES.find(f => f.id === id);
        const impact = feature ? feature.impact : 0;
        const newScore = activeFeatures.includes(id) ? currentScore - impact : currentScore + impact;

        if (newScore >= 80 && user && !user.progress.completedInteractives.includes(interactiveId)) {
            addPoints(15);
            updateProgress(interactiveId, 'interactive');
        }
    };

    const totalScore = activeFeatures.reduce((acc, id) => {
        const feat = FEATURES.find(f => f.id === id);
        return acc + (feat ? feat.impact : 0);
    }, 0);

    let trustLevel = 'Black Box';
    let color = 'text-red-500';
    let barColor = 'bg-red-500';

    if (totalScore >= 90) { trustLevel = 'Glass Box (Full)'; color = 'text-green-500'; barColor = 'bg-green-500'; }
    else if (totalScore >= 60) { trustLevel = 'Explainable'; color = 'text-blue-500'; barColor = 'bg-blue-500'; }
    else if (totalScore >= 30) { trustLevel = 'Observable'; color = 'text-yellow-500'; barColor = 'bg-yellow-500'; }

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-6 text-center">Transparency Scorecard</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Configuration Panel */}
                <div className="space-y-3">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">System Configuration</h5>
                    {FEATURES.map(feat => (
                        <div 
                            key={feat.id}
                            onClick={() => toggleFeature(feat.id)}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                                activeFeatures.includes(feat.id) 
                                ? 'bg-white border-brand-primary shadow-sm' 
                                : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                            }`}
                        >
                            <div>
                                <div className={`font-bold text-sm ${activeFeatures.includes(feat.id) ? 'text-brand-primary' : 'text-gray-600'}`}>{feat.label}</div>
                                <div className="text-[10px] text-gray-400">{feat.description}</div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                activeFeatures.includes(feat.id) ? 'bg-brand-primary border-brand-primary' : 'border-gray-300'
                            }`}>
                                {activeFeatures.includes(feat.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Preview Panel */}
                <div className="flex flex-col gap-6">
                    {/* Score Gauge */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">Trust Score</span>
                            <span className={`text-2xl font-black ${color}`}>{totalScore}/100</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${totalScore}%` }}></div>
                        </div>
                        <div className={`text-right text-xs font-bold mt-1 ${color}`}>{trustLevel}</div>
                    </div>

                    {/* Chat Preview */}
                    <div className="bg-slate-900 rounded-xl p-5 text-sm font-sans shadow-inner flex-grow relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
                        <div className="text-gray-400 text-[10px] uppercase font-bold mb-3">User Interface Preview</div>
                        
                        <div className="flex gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs shrink-0">AI</div>
                            <div className="bg-slate-800 text-gray-200 p-3 rounded-r-xl rounded-bl-xl">
                                <p>Based on your request, I recommend the Enterprise Plan.</p>
                                
                                {activeFeatures.length > 0 && <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
                                    
                                    {activeFeatures.includes('reasoning') && (
                                        <div className="text-xs text-blue-300 bg-blue-900/30 p-2 rounded">
                                            <span className="font-bold opacity-75">Reasoning:</span> User volume (5k+) exceeds Pro limit. Enterprise offers volume discount.
                                        </div>
                                    )}

                                    {activeFeatures.includes('sources') && (
                                        <div className="flex gap-2">
                                            <span className="px-2 py-0.5 bg-slate-700 rounded text-[10px] text-gray-400 border border-slate-600">Ref: Pricing_Sheet_2024.pdf</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center mt-2">
                                        {activeFeatures.includes('confidence') && (
                                            <span className="text-[10px] text-green-400 font-mono">Confidence: 98%</span>
                                        )}
                                        {activeFeatures.includes('audit') && (
                                            <span className="text-[10px] text-gray-500 font-mono">ID: tx_9921a</span>
                                        )}
                                    </div>

                                </div>}
                            </div>
                        </div>
                        
                        {activeFeatures.includes('alternatives') && (
                            <div className="ml-11 text-xs text-gray-500 italic">
                                Alternative considered: Pro Plan (Rejected: Lacks SLA support).
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransparencyScorecard;
