import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Modality } from '@google/genai';

const lightingSetups = [
    { name: 'Film Noir', prompt: 'a single, harsh key light from the side, creating long shadows and high contrast, black and white.'},
    { name: 'Golden Hour', prompt: 'warm, soft, diffused light from a low angle, creating a magical and serene mood.'},
    { name: 'Cyberpunk Neon', prompt: 'vibrant, colorful light from multiple sources like neon signs, casting magenta and cyan hues.'},
    { name: 'Clinical/Horror', prompt: 'a cold, sterile, top-down fluorescent light that washes out color and feels unsettling.'},
];

const LightingPhysicsLab: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [setup, setSetup] = useState(lightingSetups[0]);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async (selectedSetup: typeof setup) => {
        setSetup(selectedSetup);
        setLoading(true);
        setError('');
        setImageUrl('');

        const prompt = `A cinematic, photorealistic image of "a person sitting at a desk with a coffee mug". The scene is lit with ${selectedSetup.prompt}`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
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
                setError('The model did not return an image. Please try again.');
            }

        } catch (e) {
            console.error(e);
            setError('Failed to generate the lighting description.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Lighting Physics Lab</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Select a lighting setup to see how it transforms a simple scene.</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-4">
                {lightingSetups.map(s => (
                    <button 
                        key={s.name} 
                        onClick={() => handleGenerate(s)}
                        disabled={loading}
                        className={`px-4 py-2 text-sm rounded-lg disabled:opacity-50 ${setup.name === s.name && !imageUrl && !loading ? 'shadow-neumorphic-in text-brand-primary' : 'shadow-neumorphic-out'}`}
                    >
                        {s.name}
                    </button>
                ))}
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            <div className="mt-4 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[250px] flex flex-col justify-center items-center">
                <h5 className="font-semibold text-brand-text mb-2 flex items-center gap-2 self-start"><SparklesIcon/> Scene Preview</h5>
                {loading && <div className="animate-pulse text-brand-text-light">Rendering scene...</div>}
                {!loading && !imageUrl && <p className="text-brand-text-light/50">Select a setup to begin.</p>}
                {imageUrl && <img src={imageUrl} alt={`Scene with ${setup.name} lighting`} className="rounded-lg shadow-md mx-auto max-h-80" />}
            </div>
        </div>
    );
};

export default LightingPhysicsLab;