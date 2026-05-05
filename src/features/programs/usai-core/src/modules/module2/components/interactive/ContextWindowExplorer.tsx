import React, { useState, useMemo, useCallback } from 'react';
import { getAiClient } from '../../services/aiService';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';

const placeholderText = `Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by humans and other animals. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of successfully achieving its goals.

The term "artificial intelligence" had previously been used to describe machines that mimic and display "human" cognitive skills that are associated with the human mind, such as "learning" and "problem-solving". This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated.

AI applications include advanced web search engines (e.g., Google Search), recommendation systems (used by YouTube, Amazon and Netflix), understanding human speech (such as Siri and Alexa), self-driving cars (e.g., Waymo), generative or creative tools (ChatGPT and AI art), and competing at the highest level in strategic games (such as chess and Go).`;

const ContextWindowExplorer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [documentText, setDocumentText] = useState(placeholderText);
    const [windowSize, setWindowSize] = useState(25); // Percentage
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const startIndex = 0;
    const endIndex = Math.round(documentText.length * (windowSize / 100));

    const highlightedText = useMemo(() => {
        const before = documentText.substring(0, startIndex);
        const inside = documentText.substring(startIndex, endIndex);
        const after = documentText.substring(endIndex);
        return (
            <>
                <span className="opacity-30">{before}</span>
                <mark className="bg-brand-primary/20">{inside}</mark>
                <span className="opacity-30">{after}</span>
            </>
        );
    }, [documentText, startIndex, endIndex]);

    // Debounce function
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
        const prompt = `Concisely summarize the key points from the following text excerpt:\n\n"${text}"`;
        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setSummary(response.text);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to generate summary.');
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


    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Context Window Explorer</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Use the slider to see what an AI can "pay attention to" at different context sizes. The AI will summarize only the highlighted text.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h5 className="font-semibold text-brand-text mb-2">Full Document</h5>
                    <div className="h-64 p-3 bg-brand-bg rounded-lg shadow-neumorphic-in overflow-y-auto text-brand-text-light leading-relaxed liquid-scrollbar">
                        {highlightedText}
                    </div>
                </div>
                 <div>
                    <h5 className="font-semibold text-brand-text mb-2">AI's Summary of Context</h5>
                    <div className="h-64 p-3 bg-brand-bg rounded-lg shadow-neumorphic-in flex items-center justify-center">
                        {loading && <p className="text-brand-text-light animate-pulse">AI is reading...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {!loading && !error && summary && <p className="text-brand-text-light">{summary}</p>}
                        {!loading && !error && !summary && <p className="text-brand-text-light opacity-50">Move the slider to generate a summary.</p>}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                 <label htmlFor="context-slider" className="block text-center text-brand-text-light mb-2">Context Window Size: <span className="font-bold text-brand-text">{windowSize}%</span></label>
                <input
                    id="context-slider"
                    type="range"
                    min="1"
                    max="100"
                    value={windowSize}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in"
                />
            </div>
        </div>
    );
};

export default ContextWindowExplorer;