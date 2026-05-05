
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const AdversarialAttackSimulator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [isHacked, setIsHacked] = useState(false);
    const [animating, setAnimating] = useState(false);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleHack = () => {
        if (animating) return;
        setAnimating(true);
        setTimeout(() => {
            setIsHacked(true);
            setAnimating(false);
            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        }, 1200);
    };

    const handleReset = () => {
        setIsHacked(false);
    };

    return (
        <div className="my-8 rounded-2xl shadow-neumorphic-out overflow-hidden border border-brand-primary/10">
            {/* Header */}
            <div className={`p-5 border-b border-brand-shadow-dark/20 transition-colors duration-700 ${isHacked
                    ? 'bg-gradient-to-r from-rose-500/15 via-rose-400/5 to-transparent'
                    : 'bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent'
                }`}>
                <div className="flex items-center gap-3 mb-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-md transition-colors ${isHacked ? 'bg-gradient-to-br from-rose-500 to-red-600' : 'bg-gradient-to-br from-brand-primary to-brand-accent'
                        }`}>
                        {isHacked ? '⚠️' : '🛑'}
                    </div>
                    <h4 className="font-bold text-lg text-brand-text">AI Vision Hack: The Stop Sign Trick</h4>
                </div>
                <p className="text-brand-text-light text-sm ml-11">A self-driving car relies on cameras to read road signs. See what happens when "adversarial stickers" fool the AI.</p>
            </div>

            <div className="p-5">
                {/* Visualization */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">

                    {/* Real World View */}
                    <div className="flex flex-col items-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-text-light/40 mb-2 font-mono">Real World View</p>
                        <div className="w-52 h-52 bg-gradient-to-b from-sky-800/20 via-sky-600/10 to-slate-400/20 rounded-xl shadow-neumorphic-in flex items-center justify-center overflow-hidden relative border border-brand-shadow-light/20">
                            {/* Sky gradient */}
                            <div className="absolute top-0 inset-x-0 h-2/3 bg-gradient-to-b from-sky-300/10 to-transparent" />

                            {/* Road */}
                            <div className="absolute bottom-0 w-full h-1/3 bg-slate-600/30">
                                <div className="absolute top-1/2 left-0 w-full h-0.5 flex gap-2 items-center">
                                    {Array.from({ length: 8 }, (_, i) => (
                                        <div key={i} className="w-4 h-0.5 bg-yellow-300/30 flex-shrink-0" />
                                    ))}
                                </div>
                            </div>

                            {/* Pole */}
                            <div className="absolute bottom-0 w-1.5 h-28 bg-slate-500/50 z-0" />

                            {/* Stop Sign */}
                            <div className={`relative w-24 h-24 bg-red-600 flex items-center justify-center text-white font-black text-sm border-[3px] border-white shadow-lg z-10 transition-all duration-500 ${animating ? 'animate-pulse' : ''}`}
                                style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}>
                                STOP

                                {/* Adversarial Stickers */}
                                {(isHacked || animating) && (
                                    <>
                                        <div className="absolute top-[25%] left-[30%] w-4 h-2 bg-black/70 rotate-45 z-20 animate-fade-in rounded-sm" />
                                        <div className="absolute top-[55%] left-[55%] w-5 h-2.5 bg-white/80 rotate-12 z-20 animate-fade-in rounded-sm" />
                                        <div className="absolute top-[40%] left-[38%] w-2.5 h-5 bg-yellow-400/70 -rotate-12 z-20 animate-fade-in rounded-sm" />
                                        <div className="absolute top-[65%] left-[25%] w-3 h-1.5 bg-black/50 rotate-30 z-20 animate-fade-in rounded-sm" />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-brand-text-light/40 uppercase tracking-widest font-mono">Camera Feed</span>
                        <div className="w-20 h-1.5 rounded-full bg-brand-bg shadow-neumorphic-in overflow-hidden">
                            <div className={`h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-1000 rounded-full ${isHacked || animating ? 'w-full' : 'w-0'}`} />
                        </div>
                        <span className="text-xl text-brand-text-light/30">→</span>
                    </div>

                    {/* AI Dashboard */}
                    <div className={`w-64 rounded-xl shadow-neumorphic-in overflow-hidden transition-all duration-700 border-2 ${isHacked ? 'border-emerald-500/50' : 'border-rose-500/50'
                        }`}>
                        <div className={`p-3 transition-colors duration-700 ${isHacked ? 'bg-emerald-950/80' : 'bg-slate-900/80'}`}>
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-white/60 text-[10px] font-bold uppercase font-mono tracking-wider">AI Dashboard v2.0</p>
                                <div className={`w-2 h-2 rounded-full animate-pulse ${isHacked ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            </div>

                            {/* Terminal output */}
                            <div className="bg-black/60 p-2.5 rounded-lg mb-3 font-mono text-[11px] leading-relaxed border border-white/5">
                                <div className="text-slate-400">{'>'} SCANNING OBJECT...</div>
                                <div className="text-slate-400">{'>'} OBJECT_ID: #492A</div>
                                <div className="text-slate-400">{'>'} CONFIDENCE: {isHacked ? '87.3%' : '99.7%'}</div>
                                {isHacked ? (
                                    <div className="text-emerald-400 font-bold animate-pulse">{'>'} CLASS: SPEED LIMIT 45 ✓</div>
                                ) : (
                                    <div className="text-rose-400 font-bold">{'>'} CLASS: STOP SIGN 🛑</div>
                                )}
                            </div>

                            {/* Action */}
                            <div className="text-center py-2">
                                <p className="text-white/40 text-[9px] uppercase tracking-[0.2em] mb-1">Action</p>
                                {isHacked ? (
                                    <p className="font-black text-xl text-emerald-400 animate-pulse">⚡ ACCELERATE</p>
                                ) : (
                                    <p className="font-black text-xl text-rose-400">🛑 BRAKE</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action button */}
                <div className="text-center mb-4">
                    {!isHacked ? (
                        <button
                            onClick={handleHack}
                            disabled={animating}
                            className="bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {animating ? '⏳ Applying Stickers...' : '🩹 Apply Adversarial Stickers'}
                        </button>
                    ) : (
                        <button
                            onClick={handleReset}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                            🔄 Reset Simulation
                        </button>
                    )}
                </div>

                {/* Explanation */}
                {isHacked && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-transparent border border-rose-500/10 animate-slide-in-up">
                        <p className="text-sm text-brand-text leading-relaxed">
                            <strong className="text-rose-400">⚠️ Why did this happen?</strong> To a human, stickers are just "noise." But to the AI's neural network, those specific pixel patterns disrupt the mathematical features it uses to recognize a hexagonal stop sign — forcing it to classify the shape as a rectangular speed-limit sign instead.
                        </p>
                    </div>
                )}

                {/* Educational Note */}
                <div className="mt-3 p-3 rounded-lg border border-brand-primary/10 bg-brand-primary/5">
                    <p className="text-[11px] text-brand-text-light/60 leading-relaxed">
                        <span className="text-brand-primary font-bold">💡 Real research:</span> In 2017, researchers at CMU demonstrated that small stickers on stop signs could cause Tesla's Autopilot to misclassify them. This led to major investment in adversarial robustness for self-driving AI.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdversarialAttackSimulator;
