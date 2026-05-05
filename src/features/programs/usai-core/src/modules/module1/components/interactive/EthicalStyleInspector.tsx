import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
// FIX: Add import for AiOutputBlock
import AiOutputBlock from '../AiOutputBlock';

const EthicalStyleInspector: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [prompt, setPrompt] = useState('An oil painting of a swirling, starry night sky over a small village.');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe an artwork.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const apiPrompt = `You are an AI art ethics analyst. A user has described an AI-generated artwork. Analyze the description for potential stylistic plagiarism or heavy derivation from a famous artist or artwork.
        
Provide a fictional "Originality Score" out of 100 and a "Derivative Risk Analysis". Format your response using markdown headings.

Artwork Description: "${prompt}"`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: apiPrompt });
            setResult(response.text);

            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate the analysis.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Ethical Style Inspector</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Describe an AI-generated artwork to get a simulated originality and derivative risk analysis.</p>
            
            <div className="space-y-4">
                <div>
                    <label className="font-semibold text-sm text-brand-text">Artwork Description</label>
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
            </div>
            
            <div className="text-center mt-4">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Inspecting...' : 'Inspect Style'}
                </button>
            </div>
            
            <AiOutputBlock
                content={result}
                isLoading={loading}
                error={error}
                title="Analysis Report"
                containerClassName="mt-6"
            />
        </div>
    );
};

export default EthicalStyleInspector;