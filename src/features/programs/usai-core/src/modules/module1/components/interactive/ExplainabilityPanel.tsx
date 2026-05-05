
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const words = ['A', 'happy', 'dog', 'in', 'a', 'park', 'with', 'a', 'red', 'ball'];
const wordInfluences: { [key: string]: { weight: number; category: string } } = {
    dog: { weight: 0.95, category: 'Subject' },
    park: { weight: 0.88, category: 'Setting' },
    happy: { weight: 0.75, category: 'Emotion' },
    red: { weight: 0.92, category: 'Visual' },
    ball: { weight: 0.90, category: 'Object' },
};
const DEFAULT_WEIGHT = 0.1;

const getWeightColor = (w: number) => {
    if (w >= 0.9) return { bg: 'from-emerald-500/30 to-emerald-400/10', text: 'text-emerald-400', bar: 'from-emerald-500 to-emerald-400', label: 'Critical' };
    if (w >= 0.7) return { bg: 'from-blue-500/30 to-blue-400/10', text: 'text-blue-400', bar: 'from-blue-500 to-blue-400', label: 'High' };
    if (w >= 0.4) return { bg: 'from-amber-500/30 to-amber-400/10', text: 'text-amber-400', bar: 'from-amber-500 to-amber-400', label: 'Medium' };
    return { bg: 'from-slate-500/20 to-slate-400/5', text: 'text-slate-400', bar: 'from-slate-400 to-slate-300', label: 'Low' };
};

const ExplainabilityPanel: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [hoveredWord, setHoveredWord] = useState<string | null>(null);
    const [interacted, setInteracted] = useState(false);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleInteraction = () => {
        if (!interacted) setInteracted(true);
        if (!hasCompleted) {
            addPoints(1, 25);
            updateModuleProgress(1, interactiveId, 'interactive');
        }
    };

    const hoveredInfo = hoveredWord ? wordInfluences[hoveredWord] : null;
    const hoveredWeight = hoveredInfo?.weight ?? DEFAULT_WEIGHT;
    const colorInfo = getWeightColor(hoveredWeight);

    return (
        <div className="my-8 rounded-2xl shadow-neumorphic-out overflow-hidden border border-brand-primary/10">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent border-b border-brand-shadow-dark/20">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-lg shadow-md">
                        ⚖️
                    </div>
                    <h4 className="font-bold text-lg text-brand-text">The Word Weighing Scale</h4>
                </div>
                <p className="text-brand-text-light text-sm ml-11">How much does the AI care about each word when generating an image? Hover to find out.</p>
            </div>

            <div className="p-5">
                {/* Prompt Display */}
                <div className="mb-6">
                    <div className="text-[10px] font-mono text-brand-text-light/40 mb-2 uppercase tracking-wider">Input Prompt</div>
                    <div className="flex flex-wrap justify-center gap-2 p-5 bg-brand-bg rounded-xl shadow-neumorphic-in">
                        {words.map((word, i) => {
                            const info = wordInfluences[word];
                            const weight = info?.weight ?? DEFAULT_WEIGHT;
                            const isHovered = hoveredWord === word;
                            const wColor = getWeightColor(weight);

                            return (
                                <span
                                    key={i}
                                    onMouseEnter={() => { setHoveredWord(word); handleInteraction(); }}
                                    onMouseLeave={() => setHoveredWord(null)}
                                    className={`
                                        relative cursor-pointer px-3 py-2 rounded-xl font-medium transition-all duration-200 transform select-none
                                        ${isHovered
                                            ? `bg-gradient-to-br ${wColor.bg} shadow-lg scale-110 -translate-y-1 border border-brand-shadow-light/20`
                                            : 'bg-brand-bg shadow-neumorphic-out hover:shadow-md border border-transparent'
                                        }
                                    `}
                                >
                                    <span className={`text-sm ${isHovered ? 'text-brand-text font-bold' : 'text-brand-text-light'}`}>{word}</span>
                                    {/* Weight bar */}
                                    <span
                                        className={`absolute bottom-0 left-0 h-1 rounded-b-xl bg-gradient-to-r ${wColor.bar} transition-all duration-300`}
                                        style={{ width: `${weight * 100}%`, opacity: isHovered ? 1 : 0.3 }}
                                    />
                                    {/* Category tag */}
                                    {isHovered && info && (
                                        <span className={`absolute -top-5 left-1/2 -translate-x-1/2 ${wColor.text} text-[9px] font-mono font-bold whitespace-nowrap`}>
                                            {info.category}
                                        </span>
                                    )}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Weight Analysis Panel */}
                <div className="bg-brand-bg rounded-xl shadow-neumorphic-in p-6 flex flex-col items-center justify-center min-h-[180px] transition-all">
                    {hoveredWord ? (
                        <div className="w-full max-w-sm animate-fade-in">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-text-light/50">Weight Analysis</p>
                                <span className={`text-[10px] font-mono font-bold ${colorInfo.text} px-2 py-0.5 rounded-full bg-gradient-to-r ${colorInfo.bg}`}>
                                    {colorInfo.label}
                                </span>
                            </div>

                            <h2 className={`text-3xl font-black ${colorInfo.text} mb-4 text-center`}>"{hoveredWord}"</h2>

                            {/* Animated bar */}
                            <div className="w-full h-4 rounded-full overflow-hidden shadow-neumorphic-in bg-brand-bg mb-2">
                                <div
                                    className={`bg-gradient-to-r ${colorInfo.bar} h-full transition-all duration-500 rounded-full relative`}
                                    style={{ width: `${hoveredWeight * 100}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/15 animate-pulse rounded-full" />
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <p className="font-mono text-xs text-brand-text-light/50">
                                    Importance: <span className={`font-bold ${colorInfo.text}`}>{(hoveredWeight * 100).toFixed(0)}%</span>
                                </p>
                                {hoveredInfo && (
                                    <p className="text-[10px] text-brand-text-light/40">
                                        Role: {hoveredInfo.category}
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-brand-text-light/40">
                            <div className="text-3xl">👆</div>
                            <p className="font-medium text-sm">Hover over a word above to measure its impact</p>
                            <p className="text-[10px]">Content words carry more weight than function words</p>
                        </div>
                    )}
                </div>

                {/* Educational Note */}
                <div className="mt-4 p-3 rounded-lg border border-brand-primary/10 bg-brand-primary/5">
                    <p className="text-[11px] text-brand-text-light/60 leading-relaxed">
                        <span className="text-brand-primary font-bold">💡 Explainability (XAI):</span> This is a simplified version of "attention visualization" — a technique used to understand what parts of the input an AI focuses on. Tools like SHAP and LIME do this for real models.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExplainabilityPanel;
