
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface WordOption {
    word: string;
    prob: number;
}

const ROUNDS: { prompt: string; options: WordOption[] }[] = [
    {
        prompt: 'The quick brown fox jumps over the',
        options: [
            { word: 'lazy', prob: 65 },
            { word: 'fence', prob: 20 },
            { word: 'puddle', prob: 10 },
            { word: 'moon', prob: 5 },
        ],
    },
    {
        prompt: '', // appended dynamically
        options: [
            { word: 'dog', prob: 80 },
            { word: 'cat', prob: 10 },
            { word: 'log', prob: 5 },
            { word: 'universe', prob: 3 },
            { word: 'horizon', prob: 2 },
        ],
    },
];

const ProbabilitySelector: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [sentence, setSentence] = useState(ROUNDS[0].prompt);
    const [round, setRound] = useState(0);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const currentOptions = round < ROUNDS.length ? ROUNDS[round].options : [];

    const getBarColor = (prob: number) => {
        if (prob >= 60) return 'from-emerald-500 to-emerald-400';
        if (prob >= 15) return 'from-amber-500 to-yellow-400';
        if (prob >= 5) return 'from-orange-500 to-orange-400';
        return 'from-rose-500 to-red-400';
    };

    const getLabel = (prob: number) => {
        if (prob >= 60) return '🔥 Most Likely';
        if (prob >= 15) return '🤔 Possible';
        if (prob >= 5) return '🎲 Unlikely';
        return '🌙 Rare';
    };

    const handleSelect = (word: string) => {
        const newSentence = `${sentence} ${word}`;
        setSentence(newSentence);
        setSelectedWords(prev => [...prev, word]);

        if (round + 1 < ROUNDS.length) {
            setRound(round + 1);
        } else {
            setSentence(`${newSentence}.`);
            setIsComplete(true);
            if (!hasCompleted) {
                addPoints(1, 15);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        }
    };

    const handleReset = () => {
        setSentence(ROUNDS[0].prompt);
        setRound(0);
        setSelectedWords([]);
        setIsComplete(false);
    };

    return (
        <div className="my-8 rounded-2xl shadow-neumorphic-out overflow-hidden border border-brand-primary/10">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent border-b border-brand-shadow-dark/20">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-lg shadow-md">
                        🎯
                    </div>
                    <h4 className="font-bold text-lg text-brand-text">Prediction Engine: Next Word</h4>
                </div>
                <p className="text-brand-text-light text-sm ml-11">AI works by calculating the probability of the next word. Play as the AI and choose!</p>
            </div>

            <div className="p-5">
                {/* Sentence Display */}
                <div className="relative p-4 rounded-xl bg-brand-bg shadow-neumorphic-in mb-6 min-h-[70px] flex items-center justify-center">
                    <div className="text-center text-lg font-medium text-brand-text leading-relaxed">
                        "{sentence}
                        {!isComplete && (
                            <span className="inline-block w-0.5 h-5 bg-brand-primary ml-1 animate-pulse align-text-bottom" />
                        )}
                        "
                    </div>
                    {/* Round indicator */}
                    <div className="absolute top-2 right-3 text-[10px] font-mono text-brand-text-light/40">
                        {isComplete ? '✅ COMPLETE' : `STEP ${round + 1}/${ROUNDS.length}`}
                    </div>
                </div>

                {/* Options */}
                {!isComplete ? (
                    <div className="space-y-3">
                        <p className="text-xs text-brand-text-light/60 text-center font-mono mb-3">↓ Select the next word — bar width = probability</p>
                        {[...currentOptions].sort((a, b) => b.prob - a.prob).map((opt, i) => (
                            <button
                                key={opt.word}
                                onClick={() => handleSelect(opt.word)}
                                className="relative w-full overflow-hidden group bg-brand-bg rounded-xl shadow-neumorphic-out hover:shadow-neumorphic-in transition-all p-0 text-left animate-slide-in-up"
                                style={{ animationDelay: `${i * 80}ms` }}
                            >
                                {/* Probability bar */}
                                <div
                                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getBarColor(opt.prob)} opacity-15 transition-all duration-700 rounded-xl`}
                                    style={{ width: `${opt.prob}%` }}
                                />
                                <div className="relative z-10 p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-brand-text group-hover:translate-x-1 transition-transform text-base">
                                            {opt.word}
                                        </span>
                                        <span className="text-[10px] text-brand-text-light/50 hidden sm:inline">
                                            {getLabel(opt.prob)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 h-2 rounded-full bg-brand-bg shadow-neumorphic-in overflow-hidden">
                                            <div
                                                className={`h-full rounded-full bg-gradient-to-r ${getBarColor(opt.prob)} transition-all duration-700`}
                                                style={{ width: `${opt.prob}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-mono font-bold text-brand-text-light min-w-[3ch] text-right">
                                            {opt.prob}%
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 animate-fade-in">
                        <div className="text-4xl mb-3">🎉</div>
                        <p className="text-emerald-400 font-bold text-lg mb-1">Sentence Complete!</p>
                        <p className="text-brand-text-light/60 text-sm mb-4">
                            You chose: {selectedWords.map((w, i) => (
                                <span key={i} className="inline-block px-2 py-0.5 mx-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-mono">
                                    {w}
                                </span>
                            ))}
                        </p>
                        <p className="text-brand-text-light/40 text-xs max-w-md mx-auto mb-5">
                            Real AI models like GPT do this billions of times, picking from 50,000+ possible tokens at each step. The "temperature" setting controls how adventurous the choices are.
                        </p>
                        <button
                            onClick={handleReset}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all text-sm"
                        >
                            🔄 Play Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProbabilitySelector;
