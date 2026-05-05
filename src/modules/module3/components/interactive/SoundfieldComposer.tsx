
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const SoundfieldComposer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [prompt, setPrompt] = useState('A bustling medieval marketplace. A blacksmith hammer is to the left, a bard playing a lute is to the right, and crowd chatter is all around.');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe a scene with sound sources.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const apiPrompt = `You are a 3D spatial audio designer for VR. Based on the user's scene description, create a detailed plan for the soundfield.
        
Describe:
-   **Positional Audio:** Where each key sound is located in 3D space (e.g., left, right, distant, close).
-   **Environmental Effects:** Any reverb or echo from the environment.
-   **Overall Ambience:** The general background noise that fills the space.

Scene Description: "${prompt}"`;

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
            setError('Failed to generate the soundfield plan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Soundfield Composer</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Describe a 3D scene and its sounds, and Gemini will design the spatial audio.</p>
            
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} className="w-full p-2 bg-brand-bg rounded-lg shadow-neumorphic-in mb-4"/>
            
            <div className="text-center">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Composing...' : 'Compose Soundfield'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || result) && (
                 <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">Spatial Audio Plan</h5>
                    {loading && <p className="animate-pulse">...</p>}
                    <pre className="text-brand-text-light whitespace-pre-wrap font-sans">{result}</pre>
                </div>
            )}
        </div>
    );
};

export default SoundfieldComposer;
