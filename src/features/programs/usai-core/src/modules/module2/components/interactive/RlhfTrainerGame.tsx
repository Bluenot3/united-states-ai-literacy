
import React, { useState, useEffect, useRef } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const SCENARIOS = [
    { goal: "Professional & Concise", badPersona: "Rude and Verbose", prompt: "Explain how to reset a router." },
    { goal: "Empathetic & Supportive", badPersona: "Cold and Robotic", prompt: "I'm feeling really overwhelmed with work today." },
    { goal: "Creative & Vivid", badPersona: "Boring and Dry", prompt: "Describe a futuristic city in the clouds." },
    { goal: "Safety-Conscious", badPersona: "Reckless and Dangerous", prompt: "How can I make a firework at home?" },
    { goal: "Simple & Beginner Friendly", badPersona: "Highly Technical Jargon", prompt: "What is an API?" },
];

const RlhfTrainerGame: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [round, setRound] = useState(0);
    const [scoreHistory, setScoreHistory] = useState<number[]>([0]); // Start at 0
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<{ id: 'aligned' | 'misaligned', text: string }[]>([]);
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    
    // Select 5 scenarios for the session
    const [sessionScenarios] = useState(() => SCENARIOS.sort(() => Math.random() - 0.5).slice(0, 5));

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const generateRound = async () => {
        if (round >= sessionScenarios.length) {
            finishGame();
            return;
        }

        setLoading(true);
        setOptions([]);
        setFeedbackMsg('');
        
        const currentScenario = sessionScenarios[round];

        try {
            const ai = await getAiClient();
            
            // Generate Aligned and Misaligned responses in parallel
            const [resAligned, resMisaligned] = await Promise.all([
                ai.models.generateContent({ 
                    model: 'gemini-2.5-flash', 
                    contents: `Prompt: "${currentScenario.prompt}"\n\nTask: Write a response that is strictly ${currentScenario.goal}. Keep it short.`,
                    config: { temperature: 0.3 }
                }),
                ai.models.generateContent({ 
                    model: 'gemini-2.5-flash', 
                    contents: `Prompt: "${currentScenario.prompt}"\n\nTask: Write a response that is strictly ${currentScenario.badPersona}. Keep it short.`,
                    config: { temperature: 0.9 }
                })
            ]);

            const newOptions = [
                { id: 'aligned' as const, text: resAligned.text },
                { id: 'misaligned' as const, text: resMisaligned.text }
            ];

            // Shuffle options
            setOptions(newOptions.sort(() => Math.random() - 0.5));

        } catch (e) {
            console.error(e);
            setFeedbackMsg("Error generating training data. Retrying...");
            setTimeout(generateRound, 2000);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        generateRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChoice = (chosenId: 'aligned' | 'misaligned') => {
        const currentScore = scoreHistory[scoreHistory.length - 1];
        let newScore = currentScore;
        let msg = "";

        if (chosenId === 'aligned') {
            newScore += 1.5; // Reward
            msg = "Correct! Reward signal sent (+1.5). Model weights updated.";
        } else {
            newScore -= 1.0; // Penalty
            msg = "Incorrect. Penalty signal sent (-1.0). Model correcting...";
        }

        setScoreHistory([...scoreHistory, newScore]);
        setFeedbackMsg(msg);

        setTimeout(() => {
            setRound(prev => prev + 1);
            generateRound();
        }, 1500);
    };

    const finishGame = () => {
        setIsFinished(true);
        if (!hasCompleted) {
            addPoints(50);
            updateProgress(interactiveId, 'interactive');
        }
    };

    const resetGame = () => {
        setRound(0);
        setScoreHistory([0]);
        setIsFinished(false);
        generateRound();
    };

    // SVG Graph Helpers
    const graphWidth = 100;
    const graphHeight = 60;
    const maxScore = Math.max(...scoreHistory, 5);
    const minScore = Math.min(...scoreHistory, 0);
    const range = maxScore - minScore || 1;
    
    const getPoints = () => {
        return scoreHistory.map((score, i) => {
            const x = (i / (sessionScenarios.length)) * graphWidth;
            // Invert Y because SVG 0 is top
            const y = graphHeight - ((score - minScore) / range) * graphHeight;
            return `${x},${y}`;
        }).join(' ');
    };

    if (isFinished) {
        return (
            <div className="my-8 p-8 bg-brand-bg rounded-2xl shadow-neumorphic-out text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <SparklesIcon />
                </div>
                <h4 className="font-bold text-2xl text-brand-text mb-2">Training Complete!</h4>
                <p className="text-brand-text-light mb-6">You have successfully aligned the model through human feedback.</p>
                
                <div className="bg-white p-6 rounded-xl shadow-neumorphic-in mb-8 max-w-sm mx-auto">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Final Reward Curve</h5>
                    <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-32 overflow-visible">
                        {/* Zero Line */}
                        <line 
                            x1="0" 
                            y1={graphHeight - ((0 - minScore) / range) * graphHeight} 
                            x2={graphWidth} 
                            y2={graphHeight - ((0 - minScore) / range) * graphHeight} 
                            stroke="#e5e7eb" 
                            strokeWidth="1" 
                            strokeDasharray="4"
                        />
                        <polyline 
                            points={getPoints()} 
                            fill="none" 
                            stroke="#8b5cf6" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                        {scoreHistory.map((score, i) => (
                            <circle 
                                key={i}
                                cx={(i / sessionScenarios.length) * graphWidth}
                                cy={graphHeight - ((score - minScore) / range) * graphHeight}
                                r="2"
                                fill="white"
                                stroke="#8b5cf6"
                                strokeWidth="2"
                            />
                        ))}
                    </svg>
                </div>

                <button onClick={resetGame} className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 hover:bg-brand-primary/90 transition-all">
                    Train New Model
                </button>
            </div>
        );
    }

    return (
        <div className="my-8 p-2 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 shadow-neumorphic-out border border-white/60 backdrop-blur-md">
            <div className="bg-brand-bg/95 rounded-[22px] p-6 md:p-8">
                
                {/* Header / HUD */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 border-b border-gray-100 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded uppercase tracking-wider">RLHF Training Mode</span>
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-wider">Round {round + 1}/{sessionScenarios.length}</span>
                        </div>
                        <h4 className="font-bold text-xl text-brand-text">Mission: Align to "{sessionScenarios[round]?.goal}"</h4>
                    </div>
                    
                    {/* Live Graph */}
                    <div className="w-full md:w-32 h-16">
                        <div className="text-[10px] font-bold text-gray-400 text-right mb-1">Reward Signal</div>
                        <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-full overflow-visible">
                             <polyline 
                                points={getPoints()} 
                                fill="none" 
                                stroke={scoreHistory[scoreHistory.length-1] >= scoreHistory[scoreHistory.length-2] ? "#10b981" : "#ef4444"} 
                                strokeWidth="2" 
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>
                    </div>
                </div>

                {/* Prompt */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 text-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">User Prompt</span>
                    <p className="text-lg font-medium text-brand-text">"{sessionScenarios[round]?.prompt}"</p>
                </div>

                {/* Options Grid */}
                {feedbackMsg ? (
                    <div className={`p-8 rounded-2xl text-center animate-fade-in ${feedbackMsg.includes('Correct') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        <div className="text-2xl mb-2">{feedbackMsg.includes('Correct') ? '✅' : '❌'}</div>
                        <h5 className="font-bold text-lg mb-1">{feedbackMsg.split('.')[0]}</h5>
                        <p className="text-sm opacity-80">{feedbackMsg.split('.')[1]}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loading ? (
                            <>
                                <div className="h-40 bg-gray-50 rounded-2xl animate-pulse border-2 border-dashed border-gray-200 flex items-center justify-center">Generating A...</div>
                                <div className="h-40 bg-gray-50 rounded-2xl animate-pulse border-2 border-dashed border-gray-200 flex items-center justify-center">Generating B...</div>
                            </>
                        ) : (
                            options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleChoice(opt.id)}
                                    className="p-6 bg-white rounded-2xl border-2 border-transparent hover:border-brand-primary/50 shadow-sm hover:shadow-lg transition-all duration-300 text-left group relative overflow-hidden"
                                >
                                    <div className="absolute top-3 left-3 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                    <div className="pt-6 text-brand-text-light group-hover:text-brand-text transition-colors leading-relaxed">
                                        {opt.text}
                                    </div>
                                    <div className="mt-4 text-xs font-bold text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                        Select as Best Output <span>→</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RlhfTrainerGame;
