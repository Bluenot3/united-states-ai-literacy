import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const TextureAlchemyLab: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [prompt, setPrompt] = useState('a texture of rough, weathered wood grain');
    const [svg, setSvg] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe a texture.');
            return;
        }
        setLoading(true);
        setError('');
        setSvg('');

        const apiPrompt = `You are an abstract SVG artist. Based on the user's prompt, create a simple, tileable SVG pattern that evokes the described texture. The SVG should be a single <svg> element with basic shapes like <path>, <rect>, <line>, etc. and a viewBox="0 0 50 50". Do not include any other text or markdown.

User Prompt: "${prompt}"`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: apiPrompt });
            setSvg(response.text);

            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate texture.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Texture Alchemy Lab</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Describe a texture, and Gemini will generate a tileable SVG pattern.</p>

            <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="flex-grow w-full px-4 py-3 bg-brand-bg rounded-full shadow-neumorphic-in"
                />
                <button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Generating...' : 'Generate Texture'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}

            <div className="w-full aspect-video bg-brand-bg rounded-lg shadow-neumorphic-in flex items-center justify-center p-4">
                {loading && <p className="animate-pulse text-brand-text-light">Brewing texture...</p>}
                {svg && (
                    <div 
                        className="w-full h-full rounded-md" 
                        style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, backgroundRepeat: 'repeat' }}
                    ></div>
                )}
                {!loading && !svg && <p className="text-brand-text-light/50">Texture preview will appear here</p>}
            </div>
        </div>
    );
};

export default TextureAlchemyLab;
