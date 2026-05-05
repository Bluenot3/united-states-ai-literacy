import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/useAuth';

interface Puzzle {
    id: string;
    type: 'sequence' | 'pattern' | 'logic';
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    points: number;
}

const PUZZLES: Puzzle[] = [
    {
        id: 'seq1',
        type: 'sequence',
        question: "If an AI model doubles its accuracy every iteration, what's the accuracy after 4 iterations starting at 5%?",
        options: ["20%", "40%", "80%", "100%"],
        correctAnswer: 2,
        explanation: "5% → 10% → 20% → 40% → 80%. The pattern is exponential doubling.",
        difficulty: 'Easy',
        points: 15
    },
    {
        id: 'pat1',
        type: 'pattern',
        question: "GPT-1: 117M, GPT-2: 1.5B, GPT-3: 175B. What's the approximate pattern?",
        options: ["Linear growth", "Exponential (10-100x)", "Logarithmic", "Random"],
        correctAnswer: 1,
        explanation: "Each version is roughly 10-100x larger, showing exponential scaling in AI models.",
        difficulty: 'Medium',
        points: 25
    },
    {
        id: 'log1',
        type: 'logic',
        question: "An AI can process 1000 images/second. How long to process 1 million images?",
        options: ["100 seconds", "1000 seconds", "16.7 minutes", "1.67 hours"],
        correctAnswer: 2,
        explanation: "1,000,000 ÷ 1,000 = 1,000 seconds = 16.67 minutes.",
        difficulty: 'Easy',
        points: 15
    },
    {
        id: 'seq2',
        type: 'sequence',
        question: "Neural network layers: 3 → 6 → 12 → 24 → ?",
        options: ["36", "48", "30", "96"],
        correctAnswer: 1,
        explanation: "Each layer count doubles: 24 × 2 = 48.",
        difficulty: 'Easy',
        points: 15
    },
    {
        id: 'log2',
        type: 'logic',
        question: "If training a model costs $100K and accuracy improves 1% per $10K spent, what accuracy gain from a $500K budget?",
        options: ["5%", "50%", "40%", "100%"],
        correctAnswer: 1,
        explanation: "$500K ÷ $10K = 50% accuracy improvement (assuming linear scaling in this range).",
        difficulty: 'Hard',
        points: 35
    }
];

const AIPuzzle: React.FC = () => {
    const { addPoints } = useAuth();
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [completedPuzzles, setCompletedPuzzles] = useState<string[]>([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [wrongAnswer, setWrongAnswer] = useState(false);

    const currentPuzzle = PUZZLES[currentPuzzleIndex];
    const isCorrect = selectedAnswer === currentPuzzle.correctAnswer;
    const alreadyCompleted = completedPuzzles.includes(currentPuzzle.id);

    useEffect(() => {
        // Load completed puzzles from localStorage
        const saved = localStorage.getItem('completedAIPuzzles');
        if (saved) setCompletedPuzzles(JSON.parse(saved));
    }, []);

    const handleSubmit = () => {
        if (selectedAnswer === null) return;
        setShowResult(true);

        if (isCorrect && !alreadyCompleted) {
            setScore(prev => prev + currentPuzzle.points);
            addPoints(3, currentPuzzle.points);
            const newCompleted = [...completedPuzzles, currentPuzzle.id];
            setCompletedPuzzles(newCompleted);
            localStorage.setItem('completedAIPuzzles', JSON.stringify(newCompleted));
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2500);
        } else if (!isCorrect) {
            // Trigger shake animation for wrong answer
            setWrongAnswer(true);
            setTimeout(() => setWrongAnswer(false), 500);
        }
    };

    const handleNext = () => {
        setCurrentPuzzleIndex((prev) => (prev + 1) % PUZZLES.length);
        setSelectedAnswer(null);
        setShowResult(false);
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Easy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'Medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'Hard': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    return (
        <div className="relative my-8 group">
            {/* Ultra premium animated outer glow */}
            <div className="absolute -inset-1 rounded-[32px] opacity-50 blur-xl animate-pulse-slow"
                style={{
                    background: 'conic-gradient(from 0deg at 50% 50%, #8b5cf6, #d946ef, #ec4899, #8b5cf6)'
                }}
            />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 rounded-3xl opacity-60 blur-sm group-hover:opacity-80 transition-all duration-700 animate-gradient-shift" />

            <div className="relative bg-slate-950 rounded-3xl p-8 border border-white/10 backdrop-blur-xl overflow-hidden">

                {/* Mesh gradient background */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full opacity-60"
                        style={{
                            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
                            animation: 'meshMove1 8s ease-in-out infinite'
                        }}
                    />
                    <div className="absolute top-1/2 right-0 w-[350px] h-[350px] rounded-full opacity-50"
                        style={{
                            background: 'radial-gradient(circle, rgba(217, 70, 239, 0.4) 0%, transparent 70%)',
                            animation: 'meshMove2 10s ease-in-out infinite'
                        }}
                    />
                    <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full opacity-50"
                        style={{
                            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, transparent 70%)',
                            animation: 'meshMove3 12s ease-in-out infinite'
                        }}
                    />
                </div>

                {/* Ultra-fine floating particles inside */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(40)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: `${1 + Math.random() * 3}px`,
                                height: `${1 + Math.random() * 3}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                background: `radial-gradient(circle, hsla(${260 + Math.random() * 60}, 80%, 70%, ${0.3 + Math.random() * 0.4}) 0%, transparent 100%)`,
                                boxShadow: `0 0 ${4 + Math.random() * 8}px hsla(${260 + Math.random() * 60}, 80%, 60%, 0.5)`,
                                animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    ))}
                </div>

                {/* Animated grid lines */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Confetti */}
                {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none z-50">
                        {[...Array(35)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute animate-confetti-fall"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: '-10px',
                                    width: `${6 + Math.random() * 8}px`,
                                    height: `${6 + Math.random() * 8}px`,
                                    backgroundColor: ['#a855f7', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 6)],
                                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                                    boxShadow: `0 0 6px ${['#a855f7', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 3)]}`,
                                    animationDuration: `${1.5 + Math.random() * 1.5}s`,
                                    animationDelay: `${Math.random() * 0.5}s`
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-violet-500/30">
                            🧩
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">AI Puzzle Challenge</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(currentPuzzle.difficulty)}`}>
                                    {currentPuzzle.difficulty}
                                </span>
                                <span className="text-xs text-violet-400 font-medium">+{currentPuzzle.points} pts</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-extrabold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                            {score}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Score</div>
                    </div>
                </div>

                {/* Question */}
                <div className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/5">
                    <p className="text-white text-lg font-medium leading-relaxed">{currentPuzzle.question}</p>
                </div>

                {/* Options - Enhanced with press effects */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 transition-transform duration-300 ${wrongAnswer ? 'animate-shake' : ''}`}>
                    {currentPuzzle.options.map((option, i) => {
                        let optionStyle = 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10';

                        if (showResult) {
                            if (i === currentPuzzle.correctAnswer) {
                                optionStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/20 animate-spring-in';
                            } else if (i === selectedAnswer && !isCorrect) {
                                optionStyle = 'bg-rose-500/20 border-rose-500/50 text-rose-300';
                            }
                        } else if (selectedAnswer === i) {
                            optionStyle = 'bg-violet-500/20 border-violet-500/50 ring-2 ring-violet-500/30 shadow-lg shadow-violet-500/20';
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => !showResult && setSelectedAnswer(i)}
                                disabled={showResult}
                                className={`p-4 rounded-xl border text-left font-medium transition-all duration-300 btn-press ${optionStyle} ${!showResult && 'hover:scale-[1.02] active:scale-[0.97]'}`}
                            >
                                <span className="text-violet-400 font-bold mr-2 transition-transform duration-200 inline-block">{String.fromCharCode(65 + i)}.</span>
                                {option}
                            </button>
                        );
                    })}
                </div>

                {/* Result / Explanation */}
                {showResult && (
                    <div className={`p-4 rounded-xl border mb-6 animate-fade-in ${isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                        }`}>
                        <div className="font-bold mb-1">{isCorrect ? '✅ Correct!' : '❌ Not quite.'}</div>
                        <p className="text-sm opacity-80">{currentPuzzle.explanation}</p>
                        {isCorrect && !alreadyCompleted && (
                            <p className="text-sm font-bold mt-2 text-emerald-400">+{currentPuzzle.points} points earned!</p>
                        )}
                        {alreadyCompleted && isCorrect && (
                            <p className="text-xs opacity-60 mt-1">You've already completed this puzzle.</p>
                        )}
                    </div>
                )}

                {/* Actions - Enhanced with press feedback */}
                <div className="flex gap-3">
                    {!showResult ? (
                        <button
                            onClick={handleSubmit}
                            disabled={selectedAnswer === null}
                            className="flex-1 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl text-white font-bold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.97] active:shadow-md btn-press"
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="flex-1 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl text-white font-bold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-[0.97] btn-press animate-spring-in"
                        >
                            Next Puzzle →
                        </button>
                    )}
                </div>

                {/* Progress */}
                <div className="flex justify-center gap-1.5 mt-6">
                    {PUZZLES.map((p, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentPuzzleIndex
                                ? 'bg-violet-500 w-6'
                                : completedPuzzles.includes(p.id)
                                    ? 'bg-emerald-500'
                                    : 'bg-white/20'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AIPuzzle;
