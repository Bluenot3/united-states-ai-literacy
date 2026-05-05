import React, { useState, useEffect } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';

const prompts = [
    "Explain black holes to a 5-year-old.",
    "Write a tagline for a new brand of coffee.",
    "What are three fun things to do in Paris?",
    "Compose a tweet about launching a rocket.",
    "Describe the taste of a lemon without using the word sour."
];

const RlhfTrainerGame: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [prompt, setPrompt] = useState(prompts[0]);
    const [responseA, setResponseA] = useState('');
    const [responseB, setResponseB] = useState('');
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(0);
    const [rounds, setRounds] = useState(0);
    const [selected, setSelected] = useState<'A' | 'B' | null>(null);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const getNewPair = async () => {
        setLoading(true);
        setSelected(null);
        setResponseA('');
        setResponseB('');

        // Pick a random prompt different from current if possible
        let newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        if (newPrompt === prompt && prompts.length > 1) {
            const others = prompts.filter(p => p !== prompt);
            newPrompt = others[Math.floor(Math.random() * others.length)];
        }
        setPrompt(newPrompt);

        try {
            const ai = await getAiClient();
            // In a real app we might use different models or params. 
            // Here we vary temperature/instruction slightly to get different 'feels'.
            const [resA, resB] = await Promise.all([
                ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Respond to: "${newPrompt}"\nStyle: Concise, friendly, emoji-heavy.`,
                    config: { temperature: 0.9 }
                }),
                ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Respond to: "${newPrompt}"\nStyle: Professional, detailed, formal.`,
                    config: { temperature: 0.6 }
                })
            ]);

            // Randomly swap A/B so "friendly" isn't always left
            if (Math.random() > 0.5) {
                setResponseA(resA.text);
                setResponseB(resB.text);
            } else {
                setResponseA(resB.text);
                setResponseB(resA.text);
            }

        } catch (e) {
            console.error(e);
            setResponseA("Error generating response. Check API key.");
            setResponseB("Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        getNewPair();
    }, []);

    const handleChoice = (choice: 'A' | 'B') => {
        if (loading || selected) return;

        setSelected(choice);
        setScore(prev => prev + 10); // Simple points

        // Small delay before next round to show selection
        setTimeout(() => {
            const nextRound = rounds + 1;
            setRounds(nextRound);

            if (nextRound >= 5 && !hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            } else if (nextRound < 5) {
                getNewPair();
            }
        }, 1000);
    };

    const resetGame = () => {
        setRounds(0);
        setScore(0);
        getNewPair();
    };

    return (
        <div className="my-8 bg-white/50 border border-white/60 rounded-3xl shadow-xl overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

                <div className="relative z-10 flex justify-between items-center px-2">
                    <div className="text-left">
                        <h4 className="font-bold text-2xl mb-1">🤖 RLHF Trainer</h4>
                        <p className="text-violet-100 text-xs md:text-sm opacity-90">Reinforcement Learning from Human Feedback</p>
                    </div>
                    <div className="text-right bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/20">
                        <div className="text-[10px] uppercase font-bold text-violet-200 tracking-wider">Score</div>
                        <div className="text-2xl font-black text-white">{score}</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/20">
                    <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-500 ease-out"
                        style={{ width: `${(rounds / 5) * 100}%` }}
                    />
                </div>
            </div>

            {rounds >= 5 ? (
                // Completion Screen
                <div className="p-12 text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <span className="text-6xl">🏆</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Training Session Complete!</h3>
                    <p className="text-slate-500 mb-8 max-w-md">
                        Thank you for helping align the model. Your feedback helps ensure AI is helpful, harmless, and honest.
                    </p>
                    <button
                        onClick={resetGame}
                        className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-xl shadow-violet-500/20"
                    >
                        Start New Session
                    </button>
                    {hasCompleted && <p className="mt-4 text-xs text-green-600 font-bold uppercase tracking-wider">✅ Module Completed</p>}
                </div>
            ) : (
                // Game Area
                <div className="p-6 md:p-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Prompt Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 text-center relative group hover:shadow-md transition-all">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Current Prompt
                            </div>
                            <p className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed mt-2">
                                "{prompt}"
                            </p>
                        </div>

                        {/* VS Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                            {/* VS Badge */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-slate-200 text-xl border-4 border-slate-50 z-10 shadow-sm hidden md:flex italic">
                                VS
                            </div>

                            {/* Option A */}
                            <div
                                onClick={() => handleChoice('A')}
                                className={`
                                    relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex flex-col h-full min-h-[240px]
                                    ${selected === 'A'
                                        ? 'border-violet-500 bg-violet-50 ring-4 ring-violet-100 scale-[1.02]'
                                        : 'border-slate-100 bg-white hover:border-violet-200 hover:shadow-xl hover:-translate-y-1'}
                                    ${loading || selected ? 'pointer-events-none' : ''}
                                `}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selected === 'A' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500'}`}>A</div>
                                    <span className="text-xs font-bold text-slate-400 uppercase">Response Option</span>
                                </div>

                                {loading && !responseA ? (
                                    <div className="space-y-3 animate-pulse">
                                        <div className="h-4 bg-slate-100 rounded w-3/4" />
                                        <div className="h-4 bg-slate-100 rounded w-full" />
                                        <div className="h-4 bg-slate-100 rounded w-5/6" />
                                        <div className="h-4 bg-slate-100 rounded w-4/6" />
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none text-slate-600 text-sm leading-relaxed flex-grow">
                                        {responseA}
                                    </div>
                                )}

                                {selected === 'A' && (
                                    <div className="absolute inset-x-0 bottom-4 text-center animate-in slide-in-from-bottom-2 fade-in">
                                        <span className="bg-violet-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">Selected</span>
                                    </div>
                                )}
                            </div>

                            {/* Option B */}
                            <div
                                onClick={() => handleChoice('B')}
                                className={`
                                    relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex flex-col h-full min-h-[240px]
                                    ${selected === 'B'
                                        ? 'border-violet-500 bg-violet-50 ring-4 ring-violet-100 scale-[1.02]'
                                        : 'border-slate-100 bg-white hover:border-violet-200 hover:shadow-xl hover:-translate-y-1'}
                                    ${loading || selected ? 'pointer-events-none' : ''}
                                `}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selected === 'B' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500'}`}>B</div>
                                    <span className="text-xs font-bold text-slate-400 uppercase">Response Option</span>
                                </div>

                                {loading && !responseB ? (
                                    <div className="space-y-3 animate-pulse">
                                        <div className="h-4 bg-slate-100 rounded w-full" />
                                        <div className="h-4 bg-slate-100 rounded w-5/6" />
                                        <div className="h-4 bg-slate-100 rounded w-4/5" />
                                        <div className="h-4 bg-slate-100 rounded w-2/3" />
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none text-slate-600 text-sm leading-relaxed flex-grow">
                                        {responseB}
                                    </div>
                                )}

                                {selected === 'B' && (
                                    <div className="absolute inset-x-0 bottom-4 text-center animate-in slide-in-from-bottom-2 fade-in">
                                        <span className="bg-violet-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">Selected</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RlhfTrainerGame;