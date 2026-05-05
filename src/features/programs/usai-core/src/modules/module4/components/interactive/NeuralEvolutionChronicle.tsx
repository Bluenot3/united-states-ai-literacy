import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../../../types';
import { useAuth } from '../../../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const milestones = [
    { year: 1958, name: 'Perceptron', prompt: 'the Perceptron, one of the first artificial neural networks, and its significance as a linear classifier.' },
    { year: 1986, name: 'Backprop', prompt: 'the rediscovery and popularization of the backpropagation algorithm, and why it was crucial for training deep neural networks.' },
    { year: 2017, name: 'Transformer', prompt: 'the "Attention Is All You Need" paper, which introduced the Transformer architecture and revolutionized natural language processing.' },
    { year: 2024, name: 'Gemini', prompt: 'the release of the Google Gemini family of models, highlighting their native multimodality and the significance of the 2.5 Pro version.' },
];

const NeuralEvolutionChronicle: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeYear, setActiveYear] = useState<number | null>(null);

    const hasCompleted = user?.modules?.[4]?.completedInteractives.includes(interactiveId);

    const getExplanation = async (milestone: typeof milestones[0]) => {
        setLoading(true);
        setError('');
        setExplanation('');
        setActiveYear(milestone.year);

        const prompt = `You are a historian of artificial intelligence. Explain, in a concise and engaging way for a beginner, the significance of the following milestone: ${milestone.name} (${milestone.year}). Your explanation should cover ${milestone.prompt}.`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setExplanation(response.text);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to get explanation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Neural Evolution Chronicle</h4>
            <p className="text-center text-brand-text-light mb-6 text-sm">Click a milestone on the timeline to learn about its impact on the history of AI.</p>
            
            <div className="relative w-full max-w-xl mx-auto p-4">
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-brand-bg shadow-neumorphic-in rounded-full"></div>
                <div className="relative flex justify-between">
                    {milestones.map(m => (
                        <div key={m.year} className="flex flex-col items-center">
                            <button
                                onClick={() => getExplanation(m)}
                                className={`w-6 h-6 rounded-full border-4 border-brand-bg transition-all duration-300 ${activeYear === m.year ? 'bg-brand-primary ring-4 ring-brand-primary/50' : 'bg-brand-secondary shadow-neumorphic-out'}`}
                            />
                            <span className="text-xs font-bold mt-2 text-brand-text-light">{m.name} ({m.year})</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[150px]">
                <h5 className="font-semibold text-brand-text mb-2 flex items-center gap-2"><SparklesIcon/> Gemini Narration</h5>
                {loading && <p className="animate-pulse">Loading history...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {explanation && <p className="text-brand-text-light">{explanation}</p>}
                {!loading && !explanation && !error && <p className="text-brand-text-light/50">Select a milestone to begin.</p>}
            </div>
        </div>
    );
};

export default NeuralEvolutionChronicle;