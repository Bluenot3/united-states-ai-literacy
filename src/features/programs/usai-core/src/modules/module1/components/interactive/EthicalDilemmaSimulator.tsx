
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

type Framework = 'Utilitarian' | 'Rule-Based';

const outcomes = {
    A: {
        title: 'Switched to Bottom Lane',
        result: 'The car swerved. 1 person was hit.',
        severity: 'amber',
        Utilitarian: 'This fits Utilitarian logic: "Maximize the good." You sacrificed 1 to save 5. It feels cold, but mathematically minimizes total loss.',
        'Rule-Based': 'This violates the principle of "Do No Harm." By swerving, you actively caused an injury that wouldn\'t have happened had you not intervened.',
    },
    B: {
        title: 'Stayed in Top Lane',
        result: 'The car kept going. 5 people were hit.',
        severity: 'rose',
        Utilitarian: 'This fails Utilitarian logic. The net loss of life (5) is greater than the alternative (1). A Utilitarian would call this the "wrong" choice.',
        'Rule-Based': 'This follows the "Non-Interference" principle. You didn\'t take an action to harm anyone; the accident was already in motion. Some argue you are not "responsible" for outcomes you didn\'t cause.',
    }
};

const EthicalDilemmaSimulator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [choice, setChoice] = useState<'A' | 'B' | null>(null);
    const [animating, setAnimating] = useState(false);
    const [carLane, setCarLane] = useState<'middle' | 'top' | 'bottom'>('middle');
    const [showWarning, setShowWarning] = useState(false);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleChoice = (madeChoice: 'A' | 'B') => {
        if (animating || choice) return;
        setAnimating(true);
        setShowWarning(true);

        setTimeout(() => {
            setCarLane(madeChoice === 'A' ? 'bottom' : 'top');
        }, 500);

        setTimeout(() => {
            setAnimating(false);
            setChoice(madeChoice);
            setShowWarning(false);
            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        }, 2500);
    };

    const handleReset = () => {
        setChoice(null);
        setCarLane('middle');
    };

    return (
        <div className="my-8 rounded-2xl shadow-neumorphic-out overflow-hidden border border-brand-primary/10">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-transparent border-b border-brand-shadow-dark/20">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-lg shadow-md">
                        ⚖️
                    </div>
                    <h4 className="font-bold text-lg text-brand-text">Simulation: The Autonomous Car</h4>
                </div>
                <p className="text-brand-text-light text-sm ml-11">The brakes have failed. You are the programmer. What should the AI decide?</p>
            </div>

            <div className="p-5">
                {/* Road Visualization */}
                <div className="relative w-full h-56 bg-gradient-to-b from-slate-700 via-slate-600 to-slate-700 rounded-xl overflow-hidden border border-slate-500/30 mb-6 shadow-lg">
                    {/* Road markings */}
                    <div className="absolute top-0 left-0 w-full h-full">
                        {/* Lane divider - dashed center line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 flex gap-3 items-center -translate-y-0.5">
                            {Array.from({ length: 20 }, (_, i) => (
                                <div key={i} className="w-8 h-0.5 bg-yellow-300/60 flex-shrink-0" />
                            ))}
                        </div>
                        {/* Road edges */}
                        <div className="absolute top-2 left-4 w-[calc(100%-2rem)] h-0.5 bg-white/20" />
                        <div className="absolute bottom-2 left-4 w-[calc(100%-2rem)] h-0.5 bg-white/20" />
                    </div>

                    {/* Lane Labels */}
                    <div className="absolute top-3 left-4 text-[10px] font-mono text-white/40 uppercase tracking-wider">Top Lane</div>
                    <div className="absolute bottom-3 left-4 text-[10px] font-mono text-white/40 uppercase tracking-wider">Bottom Lane</div>

                    {/* Pedestrians - Top Lane (5 people) */}
                    <div className="absolute top-[18%] right-[8%] flex gap-1">
                        {['🧑', '👩', '🧑‍🦰', '👨', '👩‍🦳'].map((emoji, i) => (
                            <div key={i} className={`text-2xl transition-all duration-500 ${choice === 'B' ? 'opacity-40 scale-90' : 'animate-subtle-bob'}`} style={{ animationDelay: `${i * 200}ms` }}>
                                {emoji}
                            </div>
                        ))}
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-rose-500/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                            5 people
                        </div>
                    </div>

                    {/* Pedestrian - Bottom Lane (1 person) */}
                    <div className="absolute bottom-[18%] right-[12%]">
                        <div className={`text-2xl transition-all duration-500 ${choice === 'A' ? 'opacity-40 scale-90' : 'animate-subtle-bob'}`}>
                            🧑‍💼
                        </div>
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-500/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                            1 person
                        </div>
                    </div>

                    {/* Car */}
                    <div
                        className={`absolute text-3xl transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                            ${carLane === 'middle' ? 'top-[38%] left-[5%]' : ''}
                            ${carLane === 'top' ? 'top-[15%] left-[75%]' : ''}
                            ${carLane === 'bottom' ? 'top-[62%] left-[75%]' : ''}
                        `}
                    >
                        🚗
                        {/* Speed lines */}
                        {animating && (
                            <div className="absolute right-full top-1/2 -translate-y-1/2 flex gap-1 opacity-60">
                                <div className="w-6 h-0.5 bg-white/40 rounded-full animate-pulse" />
                                <div className="w-4 h-0.5 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
                                <div className="w-3 h-0.5 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                            </div>
                        )}
                    </div>

                    {/* Warning flash */}
                    {showWarning && (
                        <div className="absolute inset-0 bg-rose-500/10 animate-pulse z-10">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-400 font-bold text-xs font-mono animate-pulse bg-slate-900/60 px-3 py-1 rounded-full">
                                ⚠️ BRAKE FAILURE
                            </div>
                        </div>
                    )}
                </div>

                {/* Choice buttons */}
                {!choice && !animating && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        <button
                            onClick={() => handleChoice('B')}
                            className="group relative p-5 bg-brand-bg rounded-xl shadow-neumorphic-out hover:shadow-neumorphic-in transition-all border border-rose-500/10 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">🚫</span>
                                    <h5 className="font-bold text-brand-text">Do Nothing (Stay Top)</h5>
                                </div>
                                <p className="text-xs text-brand-text-light/60">Impact the group of 5 people</p>
                            </div>
                        </button>
                        <button
                            onClick={() => handleChoice('A')}
                            className="group relative p-5 bg-brand-bg rounded-xl shadow-neumorphic-out hover:shadow-neumorphic-in transition-all border border-blue-500/10 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">↪️</span>
                                    <h5 className="font-bold text-brand-text">Swerve (Go Bottom)</h5>
                                </div>
                                <p className="text-xs text-brand-text-light/60">Impact the single person</p>
                            </div>
                        </button>
                    </div>
                )}

                {/* Results */}
                {choice && (
                    <div className="animate-slide-in-up space-y-4">
                        <div className="p-5 bg-brand-bg rounded-xl shadow-neumorphic-in border-l-4 border-amber-500">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{choice === 'A' ? '↪️' : '🚫'}</span>
                                <h5 className="font-bold text-lg text-brand-text">{outcomes[choice].title}</h5>
                            </div>
                            <p className="font-mono text-xs text-rose-400 mb-4 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                                {outcomes[choice].result}
                            </p>

                            <div className="grid md:grid-cols-2 gap-3">
                                <div className="p-4 bg-brand-bg rounded-xl shadow-neumorphic-out border border-violet-500/10">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <span className="text-sm">📊</span>
                                        <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Utilitarian View</span>
                                    </div>
                                    <p className="text-sm text-brand-text-light leading-relaxed">{outcomes[choice].Utilitarian}</p>
                                </div>
                                <div className="p-4 bg-brand-bg rounded-xl shadow-neumorphic-out border border-emerald-500/10">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <span className="text-sm">📏</span>
                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Deontological View</span>
                                    </div>
                                    <p className="text-sm text-brand-text-light leading-relaxed">{outcomes[choice]['Rule-Based']}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-[11px] text-brand-text-light/50 italic max-w-sm">
                                Neither answer is "right." This is why AI ethics is one of the hardest problems in computer science.
                            </p>
                            <button
                                onClick={handleReset}
                                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                            >
                                🔄 Replay
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EthicalDilemmaSimulator;
