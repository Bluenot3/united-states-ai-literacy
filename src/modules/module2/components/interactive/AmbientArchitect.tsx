
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const AmbientArchitect: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [prompt, setPrompt] = useState('A cozy cabin in a forest during a gentle rainstorm');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe a mood or environment.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const apiPrompt = `You are an AI sound designer. A user wants to generate an ambient soundscape. Since you can't generate audio, instead write a detailed description of the soundscape.
        
Describe the key sounds, their relationship to each other (foreground/background), and the overall feeling the soundscape evokes.

Description: "${prompt}"`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: apiPrompt });
            setResult(response.text);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate the soundscape description.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Ambient Architect</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Describe a scene, and Gemini will design an immersive, ambient soundscape for it.</p>
            
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} className="flex-grow w-full px-4 py-3 bg-brand-bg rounded-full shadow-neumorphic-in"/>
                <button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Designing...' : 'Generate Soundscape'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || result) && (
                 <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">Soundscape Description</h5>
                    {loading && <p className="animate-pulse">...</p>}
                    <p className="text-brand-text-light">{result}</p>
                </div>
            )}
        </div>
    );
};

export default AmbientArchitect;
