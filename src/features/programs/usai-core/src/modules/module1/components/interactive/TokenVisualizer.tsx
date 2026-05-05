
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const TOKEN_COLORS = [
    { bg: 'from-violet-500/20 to-violet-600/10', border: 'border-violet-400/30', text: 'text-violet-300', glow: 'shadow-violet-500/20' },
    { bg: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-400/30', text: 'text-cyan-300', glow: 'shadow-cyan-500/20' },
    { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-400/30', text: 'text-amber-300', glow: 'shadow-amber-500/20' },
    { bg: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-400/30', text: 'text-emerald-300', glow: 'shadow-emerald-500/20' },
    { bg: 'from-rose-500/20 to-rose-600/10', border: 'border-rose-400/30', text: 'text-rose-300', glow: 'shadow-rose-500/20' },
    { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-400/30', text: 'text-blue-300', glow: 'shadow-blue-500/20' },
];

const TokenVisualizer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [text, setText] = useState('Artificial Intelligence is amazing');
    const [tokens, setTokens] = useState<{ str: string, id: number, colorIdx: number }[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleTokenize = () => {
        if (isAnimating || !text.trim()) return;
        setIsAnimating(true);
        setTokens([]);

        const words = text.split(/(\s+)/).filter(e => e.trim().length > 0);

        const newTokens = words.flatMap(word => {
            if (word.length > 5 && !word.includes(' ')) {
                const part1 = word.substring(0, Math.ceil(word.length / 2));
                const part2 = word.substring(Math.ceil(word.length / 2));
                return [part1, part2];
            }
            return [word];
        }).map((t, i) => ({
            str: t,
            id: Math.floor(Math.random() * 50000),
            colorIdx: i % TOKEN_COLORS.length
        }));

        // Stagger token appearance
        newTokens.forEach((token, i) => {
            setTimeout(() => {
                setTokens(prev => [...prev, token]);
                if (i === newTokens.length - 1) setIsAnimating(false);
            }, i * 120);
        });

        if (!hasCompleted) {
            addPoints(1, 10);
            updateModuleProgress(1, interactiveId, 'interactive');
        }
    };

    return (
        <div className="my-8 rounded-2xl shadow-neumorphic-out overflow-hidden border border-brand-primary/10">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent border-b border-brand-shadow-dark/20">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-lg shadow-md">
                        🔡
                    </div>
                    <h4 className="font-bold text-lg text-brand-text">How Computers "Read": Tokenizer</h4>
                </div>
                <p className="text-brand-text-light text-sm ml-11">AI doesn't read words — it reads numbers. Type a sentence to see it broken down into tokens.</p>
            </div>

            <div className="p-5">
                {/* Input Area */}
                <div className="flex gap-2 mb-6">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleTokenize()}
                            className="w-full px-4 py-3 rounded-xl shadow-neumorphic-in bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-brand-text font-mono text-sm transition-all"
                            placeholder="Type any sentence..."
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-text-light/40 font-mono">
                            {text.length} chars
                        </span>
                    </div>
                    <button
                        onClick={handleTokenize}
                        disabled={isAnimating || !text.trim()}
                        className="bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100"
                    >
                        {isAnimating ? '⏳' : '⚡'} Tokenize
                    </button>
                </div>

                {/* Arrow indicator */}
                {tokens.length > 0 && (
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />
                        <span className="text-xs text-brand-text-light/60 font-mono">↓ {tokens.length} tokens generated</span>
                        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />
                    </div>
                )}

                {/* Tokens Display */}
                {tokens.length > 0 && (
                    <div className="flex flex-wrap gap-3 justify-center p-4 rounded-xl bg-brand-bg/50 shadow-neumorphic-in min-h-[80px]">
                        {tokens.map((token, i) => {
                            const color = TOKEN_COLORS[token.colorIdx];
                            return (
                                <div
                                    key={i}
                                    className="flex flex-col items-center animate-icon-pop group cursor-default"
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    <div className={`bg-gradient-to-br ${color.bg} ${color.border} border px-3.5 py-2 rounded-lg shadow-md ${color.glow} font-mono text-sm font-bold text-brand-text mb-1 group-hover:scale-110 transition-transform`}>
                                        {token.str}
                                    </div>
                                    <div className={`text-[10px] font-mono ${color.text} opacity-60`}>
                                        ID: {token.id}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty state */}
                {tokens.length === 0 && !isAnimating && (
                    <div className="text-center py-8 text-brand-text-light/40">
                        <div className="text-3xl mb-2">🔤 → 🔢</div>
                        <p className="text-sm">Press <strong>Tokenize</strong> to convert text to numerical tokens</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TokenVisualizer;
