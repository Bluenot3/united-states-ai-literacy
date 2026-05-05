import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const ExplainabilityPanel: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [prompt, setPrompt] = useState('Write a sentence about a happy dog playing in a park.');
    const [generatedText, setGeneratedText] = useState('');
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setLoading(true);
        setError('');
        setGeneratedText('');
        setExplanation('');

        try {
            const ai = await getAiClient();
            // Step 1: Generate the initial text
            const genResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const newGeneratedText = genResponse.text;
            setGeneratedText(newGeneratedText);

            // Step 2: Generate the explanation
            const explainPrompt = `Original Prompt: "${prompt}"
AI Generated Text: "${newGeneratedText}"

Analyze the generated text. Explain which keywords or phrases from the original prompt most influenced the final output. This simulates an "attention heatmap" by highlighting the most important parts of the prompt. Be concise.`;
            
            const explainResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: explainPrompt });
            setExplanation(explainResponse.text);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }

        } catch (e) {
            console.error(e);
            setError('Failed to generate response. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Explainability Panel Pro</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Enter a prompt to see what an AI generates, and then get an AI-powered explanation of its reasoning.</p>

            <div className="space-y-4">
                <div>
                    <label htmlFor="explain-prompt" className="font-semibold text-brand-text mb-2 block">Your Prompt</label>
                    <textarea
                        id="explain-prompt"
                        rows={3}
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        className="w-full p-3 bg-brand-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
                        placeholder="e.g., Write a sentence about a happy dog..."
                    />
                </div>
                
                <div className="text-center">
                    <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-neumorphic-out hover:shadow-neumorphic-in transform hover:scale-95 disabled:opacity-50">
                        <SparklesIcon />
                        {loading ? 'Generating...' : 'Generate & Explain'}
                    </button>
                </div>

                {error && <p className="text-center text-red-500">{error}</p>}
                
                {(generatedText || loading) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                             <h5 className="font-semibold text-brand-text mb-2">Generated Text</h5>
                             {loading && !generatedText && <p className="animate-pulse text-brand-text-light">...</p>}
                             <p className="text-brand-text-light">{generatedText}</p>
                        </div>
                         <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                             <h5 className="font-semibold text-brand-text mb-2">AI's Reasoning</h5>
                             {loading && !explanation && <p className="animate-pulse text-brand-text-light">...</p>}
                             <p className="text-brand-text-light">{explanation}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExplainabilityPanel;