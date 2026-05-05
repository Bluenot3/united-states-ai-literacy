
import React, { useState, useMemo, useCallback } from 'react';
import { getAiClient } from '../../services/aiService';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const placeholderText = `Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. The term "artificial intelligence" had previously been used to describe machines that mimic and display "human" cognitive skills. As machines become increasingly capable, mental facilities once thought to require intelligence are removed from the definition. Modern AI techniques have become pervasive and are too numerous to list. Frequently cited examples include expert systems, speech recognition, and self-driving vehicles.`;

const ContextWindowExplorer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [documentText, setDocumentText] = useState(placeholderText);
    const [windowSize, setWindowSize] = useState(25);
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const totalChars = documentText.length;
    const windowChars = Math.round(totalChars * (windowSize / 100));
    const totalWords = documentText.split(/\s+/).length;
    const visibleWords = documentText.substring(0, windowChars).split(/\s+/).length;

    const highlightedText = useMemo(() => {
        const inside = documentText.substring(0, windowChars);
        const outside = documentText.substring(windowChars);
        return (
            <>
                <mark className="bg-brand-primary/20 text-brand-text font-medium rounded px-0.5 transition-all duration-300">{inside}</mark>
                {outside && <span className="text-brand-text-light/25 transition-opacity duration-300 line-through decoration-brand-shadow-dark/10">{outside}</span>}
            </>
        );
    }, [documentText, windowChars]);

    const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
        let timeoutId: ReturnType<typeof setTimeout>;
        return (...args: Parameters<F>): void => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const getSummary = async (text: string) => {
        if (!text.trim()) return;
        setLoading(true);
        setError(null);
        const prompt = `Concisely summarize the key points from the following text excerpt (ignore cut-off sentences):\n\n"${text}"`;
        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setSummary(response.text);
            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to generate summary. Check your connection.');
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedGetSummary = useCallback(debounce(getSummary, 700), [hasCompleted]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(e.target.value, 10);
        setWindowSize(newSize);
        const textToSummarize = documentText.substring(0, Math.round(documentText.length * (newSize / 100)));
        debouncedGetSummary(textToSummarize);
    };

    const getCapacityColor = () => {
        if (windowSize > 90) return { bar: 'from-rose-500 to-red-400', text: 'text-rose-400', label: '⚠️ Near Limit' };
        if (windowSize > 60) return { bar: 'from-amber-500 to-yellow-400', text: 'text-amber-400', label: '📦 Heavy Load' };
        return { bar: 'from-emerald-500 to-green-400', text: 'text-emerald-400', label: '✅ Efficient' };
    };

    const capacity = getCapacityColor();

    return (
        <div className="my-8 rounded-2xl shadow-neumorphic-out overflow-hidden border border-brand-primary/10">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent border-b border-brand-shadow-dark/20">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-lg shadow-md">
                        🪟
                    </div>
                    <h4 className="font-bold text-lg text-brand-text">The Sliding Window</h4>
                </div>
                <p className="text-brand-text-light text-sm ml-11">AI memory is like a backpack with limited space. It can only "carry" (process) the highlighted text. The rest falls outside its Context Window.</p>
            </div>

            <div className="p-5">
                {/* Memory Usage Bar */}
                <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-brand-text-light/50">MEMORY USAGE</span>
                        <span className={`text-xs font-mono ${capacity.text}`}>{capacity.label}</span>
                    </div>
                    <div className="w-full h-4 rounded-full overflow-hidden shadow-neumorphic-in bg-brand-bg relative">
                        <div
                            className={`h-full transition-all duration-500 bg-gradient-to-r ${capacity.bar} rounded-full relative`}
                            style={{ width: `${windowSize}%` }}
                        >
                            <div className="absolute inset-0 bg-white/10 animate-pulse rounded-full" />
                        </div>
                    </div>
                    <div className="flex justify-between mt-1.5 text-[10px] font-mono text-brand-text-light/40">
                        <span>{visibleWords} of {totalWords} words visible</span>
                        <span>{windowSize}% capacity</span>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Document Panel */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-brand-text text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-brand-primary/50" />
                                Document (The World)
                            </h5>
                            <span className="text-[10px] font-mono text-brand-text-light/40">{totalChars} chars</span>
                        </div>
                        <div className="flex-grow h-64 p-4 bg-brand-bg rounded-xl shadow-neumorphic-in overflow-y-auto text-brand-text leading-relaxed text-sm scrollbar-thin">
                            {highlightedText}
                        </div>
                    </div>

                    {/* AI Understanding Panel */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-brand-text text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400/50" />
                                What the AI Understands
                            </h5>
                            {loading && <span className="text-[10px] font-mono text-brand-primary animate-pulse">Processing...</span>}
                        </div>
                        <div className="flex-grow h-64 p-4 bg-brand-bg rounded-xl shadow-neumorphic-in flex items-center justify-center text-center overflow-y-auto">
                            {loading && (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <p className="text-brand-text-light/50 text-xs">AI is reading the visible text...</p>
                                </div>
                            )}
                            {error && (
                                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                    <p className="text-rose-400 text-sm">❌ {error}</p>
                                </div>
                            )}
                            {!loading && !error && summary && (
                                <div className="text-left w-full">
                                    <p className="text-brand-text text-sm leading-relaxed italic">"{summary}"</p>
                                </div>
                            )}
                            {!loading && !error && !summary && (
                                <div className="flex flex-col items-center gap-2 text-brand-text-light/40">
                                    <div className="text-3xl">🧠</div>
                                    <p className="text-sm">Drag the slider to fill AI memory</p>
                                    <p className="text-[10px]">The AI will summarize what it can see</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Slider */}
                <div className="mt-5">
                    <input
                        id="context-slider"
                        type="range"
                        min="5"
                        max="100"
                        value={windowSize}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in accent-brand-primary"
                    />
                    <div className="flex justify-between text-xs text-brand-text-light/50 mt-1.5 font-mono">
                        <span>📎 Small Context (Short Memory)</span>
                        <span>📚 Large Context (Long Memory)</span>
                    </div>
                </div>

                {/* Educational Note */}
                <div className="mt-4 p-3 rounded-lg border border-brand-primary/10 bg-brand-primary/5">
                    <p className="text-[11px] text-brand-text-light/60 leading-relaxed">
                        <span className="text-brand-primary font-bold">💡 Why it matters:</span> GPT-4 has a 128K token window (~96K words). Claude has 200K tokens. But even the largest windows lose quality on distant content — the AI "forgets" what's far away.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContextWindowExplorer;
