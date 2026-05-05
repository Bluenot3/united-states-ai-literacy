
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const TextureAlchemyLab: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [prompt, setPrompt] = useState('Ancient mossy stone bricks');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe a material.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const apiPrompt = `You are a 3D texturing AI. A user wants to generate a PBR (Physically-Based Rendering) material.
        
Describe the key texture maps for this material:
-   **Albedo/Diffuse:** The base color.
-   **Roughness:** How rough or smooth the surface is.
-   **Normal/Bump:** The fine surface detail and bumps.
-   **Ambient Occlusion:** The contact shadows in crevices.

Material Description: "${prompt}"`;

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
            setError('Failed to generate the texture description.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Texture Alchemy Lab</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Describe a material, and Gemini will break it down into its core PBR texture maps.</p>
            
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} className="flex-grow w-full px-4 py-3 bg-brand-bg rounded-full shadow-neumorphic-in"/>
                <button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Generating...' : 'Generate PBR Maps'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || result) && (
                 <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">PBR Texture Map Descriptions</h5>
                    {loading && <p className="animate-pulse">...</p>}
                    <pre className="text-brand-text-light whitespace-pre-wrap font-sans">{result}</pre>
                </div>
            )}
        </div>
    );
};

export default TextureAlchemyLab;
