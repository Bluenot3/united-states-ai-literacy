import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { WandIcon } from '../icons/WandIcon';
import { Modality } from '@google/genai';

const PromptArchitectWorkbench: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [idea, setIdea] = useState('A manifesto about sustainable cities');
    const [tone, setTone] = useState('As if by an ancient philosopher');
    const [structure, setStructure] = useState('A series of 5 core principles');
    const [result, setResult] = useState({ prompt: '', critique: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [imageUrl, setImageUrl] = useState('');
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!idea.trim() || !tone.trim() || !structure.trim()) {
            setError('Please fill all fields.');
            return;
        }
        setLoading(true);
        setError('');
        setResult({ prompt: '', critique: '' });
        setImageUrl('');
        setImageError('');

        const combinedPrompt = `${idea}, ${tone}. Structure it as: ${structure}.`;

        const critiqueRequest = `You are a prompt engineering expert. Critique the following prompt based on Clarity, Novelty, and Control. Provide a brief one-sentence analysis for each.

Prompt: "${combinedPrompt}"`;

        try {
            const ai = await getAiClient();
            const critiqueResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: critiqueRequest });
            
            setResult({
                prompt: combinedPrompt,
                critique: critiqueResponse.text,
            });

            if (!hasCompleted) {
                addPoints(15); // Points for prompt analysis
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate prompt analysis.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleGenerateImage = async () => {
        if (!result.prompt) {
            setImageError('Assemble a prompt first.');
            return;
        }
        setImageLoading(true);
        setImageError('');
        setImageUrl('');

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: result.prompt }] },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });
            
            let foundImage = false;
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    setImageUrl(`data:image/png;base64,${base64ImageBytes}`);
                    foundImage = true;
                    if (!hasCompleted) {
                        addPoints(10); // Extra points for generating an image
                    }
                    break;
                }
            }
            if (!foundImage) {
                setImageError('The model did not return an image. Try a different prompt.');
            }

        } catch (e) {
            console.error(e);
            setImageError('Failed to generate image.');
        } finally {
            setImageLoading(false);
        }
    };


    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Prompt Architect Workbench</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Deconstruct a prompt, analyze it, then generate an image with Nano-Banana.</p>
            
            <div className="space-y-4">
                <div>
                    <label className="font-semibold text-sm text-brand-text">Core Idea</label>
                    <input type="text" value={idea} onChange={e => setIdea(e.target.value)} className="w-full mt-1 p-3 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
                 <div>
                    <label className="font-semibold text-sm text-brand-text">Tone / Medium</label>
                    <input type="text" value={tone} onChange={e => setTone(e.target.value)} className="w-full mt-1 p-3 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
                 <div>
                    <label className="font-semibold text-sm text-brand-text">Structure / Format</label>
                    <input type="text" value={structure} onChange={e => setStructure(e.target.value)} className="w-full mt-1 p-3 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
            </div>
            
            <div className="text-center mt-6">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Analyzing...' : 'Assemble & Analyze'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || result.prompt) && (
                 <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                        <h5 className="font-semibold text-brand-text mb-2">Assembled Prompt</h5>
                        {loading && <p className="animate-pulse">...</p>}
                        <p className="text-sm text-brand-text-light">{result.prompt}</p>
                    </div>
                     <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                        <h5 className="font-semibold text-brand-text mb-2">AI Critique</h5>
                        {loading && <p className="animate-pulse">...</p>}
                        <pre className="text-sm text-brand-text-light whitespace-pre-wrap font-sans">{result.critique}</pre>
                    </div>
                </div>
            )}

            {result.critique && !loading && (
                 <div className="text-center mt-6">
                    <button onClick={handleGenerateImage} disabled={imageLoading} className="inline-flex items-center justify-center gap-2 bg-pale-green text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                        <WandIcon />
                        {imageLoading ? 'Generating Image...' : 'Generate Image with Nano-Banana'}
                    </button>
                </div>
            )}

            {imageError && <p className="text-center text-red-500 mt-4">{imageError}</p>}
            
            {(imageLoading || imageUrl) && (
                <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                     <h5 className="font-semibold text-brand-text mb-2 text-center">Generated Image</h5>
                     {imageLoading && <div className="h-64 bg-brand-bg shadow-neumorphic-in rounded-lg animate-pulse flex items-center justify-center text-brand-text-light">Nano-Banana is painting...</div>}
                     {imageUrl && <img src={imageUrl} alt="Generated by AI" className="rounded-lg shadow-md mx-auto max-h-96" />}
                </div>
            )}
        </div>
    );
};

export default PromptArchitectWorkbench;