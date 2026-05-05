import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Modality } from '@google/genai';

const SpatialNarrativeEngine: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [narrative, setNarrative] = useState('The old librarian finally found the hidden book in a dusty, forgotten corner of the grand library, its pages glowing with a faint, magical light.');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!narrative.trim()) {
            setError('Please provide a short story or narrative.');
            return;
        }
        setLoading(true);
        setError('');
        setImageUrl('');

        const apiPrompt = `Generate a cinematic, atmospheric image that visually represents the following scene: "${narrative}"`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: apiPrompt }] },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });
            
            let foundImage = false;
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
                    foundImage = true;
                    if (!hasCompleted) {
                        addPoints(25);
                        updateProgress(interactiveId, 'interactive');
                    }
                    break;
                }
            }
            if (!foundImage) {
                setError('The model did not return an image. Try a different narrative.');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate the scene description.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Spatial Narrative Engine</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Write a short story, and Nano-Banana will generate an image of the environment based on it.</p>
            
            <textarea value={narrative} onChange={e => setNarrative(e.target.value)} rows={4} className="w-full p-2 bg-brand-bg rounded-lg shadow-neumorphic-in mb-4"/>
            
            <div className="text-center">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Building...' : 'Build Scene from Narrative'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || imageUrl) && (
                 <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2 text-center">Generated Scene</h5>
                    {loading && <div className="h-64 bg-brand-bg shadow-neumorphic-in rounded-lg animate-pulse flex items-center justify-center text-brand-text-light">Generating scene...</div>}
                    {imageUrl && <img src={imageUrl} alt="AI-generated scene from narrative" className="rounded-lg shadow-md mx-auto max-h-[400px]" />}
                </div>
            )}
        </div>
    );
};

export default SpatialNarrativeEngine;