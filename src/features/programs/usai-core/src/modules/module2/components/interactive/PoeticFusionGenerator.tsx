import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const PoeticFusionGenerator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [topic, setTopic] = useState('the sound of rain');
    const [poem, setPoem] = useState('');
    const [critique, setCritique] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic.');
            return;
        }
        setLoading(true);
        setError('');
        setPoem('');
        setCritique('');

        try {
            const ai = await getAiClient();
            
            // 1. Generate Poem
            const poemResult = await ai.models.generateContent({ 
                model: 'gemini-2.5-flash', 
                contents: `Write a short, evocative poem about "${topic}".` 
            });
            const newPoem = poemResult.text;
            setPoem(newPoem);

            // 2. Generate Critique
            const critiquePrompt = `You are a poetry critic. Analyze the following poem. Provide a score for "Originality" and "Coherence" out of 10, and a brief one-sentence justification for your scores.

Poem:
"""
${newPoem}
"""`;
            const critiqueResult = await ai.models.generateContent({ 
                model: 'gemini-2.5-flash', 
                contents: critiquePrompt 
            });
            setCritique(critiqueResult.text);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }

        } catch (e) {
            console.error(e);
            setError('Failed to generate poem. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Poetic Fusion Generator</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Enter a topic to generate a poem, then see how an AI critic scores it.</p>
            
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="Enter a topic for your poem..."
                    className="flex-grow w-full px-4 py-3 bg-brand-bg rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
                />
                 <button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-neumorphic-out hover:shadow-neumorphic-in transform hover:scale-95 disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Generating...' : 'Generate'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[150px]">
                    <h5 className="font-semibold text-brand-text mb-2">Generated Poem</h5>
                     {loading && !poem && <p className="animate-pulse text-brand-text-light">Composing...</p>}
                    <pre className="whitespace-pre-wrap font-serif text-brand-text-light">{poem}</pre>
                </div>
                <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[150px]">
                    <h5 className="font-semibold text-brand-text mb-2">AI Critic's Score</h5>
                     {loading && poem && <p className="animate-pulse text-brand-text-light">Analyzing...</p>}
                    <pre className="whitespace-pre-wrap font-sans text-brand-text-light">{critique}</pre>
                </div>
            </div>
        </div>
    );
};

export default PoeticFusionGenerator;