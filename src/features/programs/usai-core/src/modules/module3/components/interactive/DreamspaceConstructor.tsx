import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Modality } from '@google/genai';

const DreamspaceConstructor: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [prompt, setPrompt] = useState('A glass pavilion in a lunar desert at twilight');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe a space.');
            return;
        }
        setLoading(true);
        setError('');
        setImageUrl('');

        const apiPrompt = `Generate a cinematic, photorealistic, breathtaking image of the following space: "${prompt}"`;

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
                setError('The model did not return an image. Try a different description.');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate the space description.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Dreamspace Constructor</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Describe a space, and Nano-Banana will generate a cinematic image of the 3D environment.</p>
            
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} className="flex-grow w-full px-4 py-3 bg-brand-bg rounded-full shadow-neumorphic-in"/>
                <button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Constructing...' : 'Construct Space'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || imageUrl) && (
                 <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2 text-center">Generated Environment</h5>
                    {loading && <div className="h-64 bg-brand-bg shadow-neumorphic-in rounded-lg animate-pulse flex items-center justify-center text-brand-text-light">Constructing space...</div>}
                    {imageUrl && <img src={imageUrl} alt="AI-generated dreamspace" className="rounded-lg shadow-md mx-auto max-h-[400px]" />}
                </div>
            )}
        </div>
    );
};

export default DreamspaceConstructor;