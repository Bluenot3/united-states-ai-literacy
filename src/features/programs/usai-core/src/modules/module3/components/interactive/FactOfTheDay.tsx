import React, { useState, useEffect } from 'react';

const AI_FACTS = [
    { fact: "AI can detect patterns in data 100x faster than humans.", category: "Speed" },
    { fact: "The first AI program was written in 1951 by Christopher Strachey.", category: "History" },
    { fact: "GPT-4 was trained on over 1 trillion parameters.", category: "Scale" },
    { fact: "AI image generators can create 1,000 unique images per second.", category: "Creativity" },
    { fact: "Neural networks are inspired by the human brain's structure.", category: "Science" },
    { fact: "AI can now pass the bar exam and medical licensing exams.", category: "Capability" },
    { fact: "The AI industry is projected to reach $1.8 trillion by 2030.", category: "Economy" },
    { fact: "AI can detect cancer with 94% accuracy from medical scans.", category: "Healthcare" },
    { fact: "Self-driving cars process 4TB of data per day.", category: "Autonomy" },
    { fact: "AI translation now supports over 200 languages.", category: "Language" },
];

const FactOfTheDay: React.FC = () => {
    const [currentFactIndex, setCurrentFactIndex] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Rotate to a new fact daily (based on day of year)
    useEffect(() => {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        setCurrentFactIndex(dayOfYear % AI_FACTS.length);
    }, []);

    const handleNextFact = () => {
        setIsFlipping(true);
        setTimeout(() => {
            setCurrentFactIndex((prev) => (prev + 1) % AI_FACTS.length);
            setIsFlipping(false);
        }, 300);
    };

    const currentFact = AI_FACTS[currentFactIndex];

    return (
        <div
            className="relative my-8 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Aurora glow background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 animate-pulse-slow"></div>

            <div className={`
                relative overflow-hidden rounded-3xl p-8
                bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95
                border border-white/10 backdrop-blur-xl
                shadow-2xl shadow-emerald-500/10
                transition-all duration-500
                ${isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}
                ${isHovered ? 'border-emerald-500/30' : ''}
            `}>
                {/* Animated particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-emerald-400/60 rounded-full animate-float"
                            style={{
                                left: `${15 + i * 15}%`,
                                top: `${20 + (i % 3) * 25}%`,
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: `${3 + i * 0.5}s`
                            }}
                        />
                    ))}
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30 animate-pulse-slow">
                            💡
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">AI Fact of the Day</h3>
                            <p className="text-xs text-emerald-400 font-medium tracking-wider uppercase">{currentFact.category}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleNextFact}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group/btn hover:scale-105 active:scale-95"
                        title="Next fact"
                    >
                        <svg className="w-5 h-5 text-emerald-400 group-hover/btn:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>

                {/* Fact content */}
                <div className="relative">
                    <div className="text-2xl font-semibold text-white leading-relaxed tracking-tight">
                        "{currentFact.fact}"
                    </div>

                    {/* Decorative quote marks */}
                    <div className="absolute -top-4 -left-2 text-6xl text-emerald-500/20 font-serif">"</div>
                    <div className="absolute -bottom-8 -right-2 text-6xl text-emerald-500/20 font-serif rotate-180">"</div>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-1.5 mt-8">
                    {AI_FACTS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setIsFlipping(true);
                                setTimeout(() => {
                                    setCurrentFactIndex(i);
                                    setIsFlipping(false);
                                }, 300);
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentFactIndex
                                    ? 'bg-emerald-500 w-6'
                                    : 'bg-white/20 hover:bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FactOfTheDay;
