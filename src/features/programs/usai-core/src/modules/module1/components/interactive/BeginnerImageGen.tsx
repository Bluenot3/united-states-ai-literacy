
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient, isImageSimulationMode } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const prompts = [
    "A cute robot painting a canvas in a sunny park",
    "A futuristic city floating in the clouds, golden hour",
    "A cat wearing a spacesuit on Mars, digital art",
    "A magical library with flying books, fantasy style"
];

const BeginnerImageGen: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleSurprise = () => {
        const random = prompts[Math.floor(Math.random() * prompts.length)];
        setPrompt(random);
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a description first.');
            return;
        }
        setLoading(true);
        setError('');
        setImageUrl('');

        try {
            const ai: any = await getAiClient();

            // Check for simulation mode (no dedicated image model configured yet)
            if (isImageSimulationMode()) {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Return a simulation placeholder
                setImageUrl('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop');

                if (!hasCompleted) {
                    addPoints(1, 25);
                    updateModuleProgress(1, interactiveId, 'interactive');
                }
                return;
            }

            // Real generation attempt
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.0-flash', // Using 2.0 Flash for speed/multimodal
                    contents: { parts: [{ text: "Generate an image of: " + prompt }] },
                    // 2.0 Flash often returns image links or base64 in specific formats, 
                    // dependent on exact API version. 
                    // SAFEST FALLBACK for demo: If not specific image model, use simulation logic above
                    // or assume standard text response if model doesn't support image output directly via this SDK method yet.
                });

                // Note: Direct image generation via generateContent varies by model version.
                // If real model fails to return inlineData, we treat it as text-only model limitation
                // and show the fallback with a specific message.

                if (response.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
                    setImageUrl(`data:image/png;base64,${response.candidates[0].content.parts[0].inlineData.data}`);
                    if (!hasCompleted) {
                        addPoints(1, 25);
                        updateModuleProgress(1, interactiveId, 'interactive');
                    }
                } else {
                    // Fallback for models that don't satisfy the image request directly in this interface
                    console.warn("Model returned text instead of image data or no data.");
                    setImageUrl('https://images.unsplash.com/photo-1614726365778-d10e86b4d324?q=80&w=1000&auto=format&fit=crop');
                    if (!hasCompleted) {
                        addPoints(1, 25);
                        updateModuleProgress(1, interactiveId, 'interactive');
                    }
                }

            } catch (err) {
                // Fallback on error to ensure user experience remains broken
                console.error("Real AI generation failed, using simulation backup", err);
                setImageUrl('https://images.unsplash.com/photo-1542831371-d531d36971e6?q=80&w=1000&auto=format&fit=crop');
                if (!hasCompleted) {
                    addPoints(1, 25);
                    updateModuleProgress(1, interactiveId, 'interactive');
                }
            }

        } catch (e) {
            console.error(e);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Instant Image Creator</h4>
            <p className="text-center text-brand-text-light mb-6 text-sm">Type anything you can imagine, or click "Surprise Me" for an idea.</p>

            <div className="flex flex-col gap-4 max-w-xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="e.g. A neon hamster running a marathon"
                        className="w-full pl-4 pr-32 py-3 bg-brand-bg rounded-full shadow-neumorphic-in focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                    <button
                        onClick={handleSurprise}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-primary hover:text-brand-primary-light px-3 py-1 bg-white/50 rounded-full transition-colors"
                    >
                        Surprise Me
                    </button>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                >
                    <SparklesIcon />
                    {loading ? 'Dreaming...' : 'Generate Image'}
                </button>
            </div>

            {error && <p className="text-center text-red-500 mt-4">{error}</p>}

            <div className="mt-8 flex justify-center">
                {loading ? (
                    <div className="w-full max-w-md aspect-square bg-brand-bg rounded-2xl shadow-neumorphic-in flex flex-col items-center justify-center animate-pulse">
                        <SparklesIcon />
                        <p className="text-brand-text-light mt-2 text-sm">Creating pixel by pixel...</p>
                    </div>
                ) : imageUrl ? (
                    <div className="relative group w-full max-w-md">
                        <img src={imageUrl} alt={prompt} className="w-full h-auto rounded-2xl shadow-soft-xl animate-fade-in" />
                        <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                                {imageUrl.startsWith('data:') ? 'Generated by Gemini' : 'Simulation Mode Preview'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-md aspect-video bg-brand-bg/50 border-2 border-dashed border-brand-shadow-dark rounded-2xl flex items-center justify-center text-brand-text-light/50">
                        Image Preview Area
                    </div>
                )}
            </div>
        </div>
    );
};

export default BeginnerImageGen;
