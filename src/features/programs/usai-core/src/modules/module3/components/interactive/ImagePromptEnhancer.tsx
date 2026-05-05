import React, { useState } from 'react';
import { WandIcon } from '../icons/WandIcon';
import { getAiClient } from '../../services/aiService';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const ImagePromptEnhancer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [idea, setIdea] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idea.trim()) {
            setError("Please enter a simple idea.");
            return;
        }
        
        setLoading(true);
        setError(null);
        setResult('');

        const prompt = `You are a prompt engineering expert for generative AI art models like Stable Diffusion. Take the user's simple idea and expand it into a detailed, descriptive, and artistic prompt. Include details about style (e.g., photorealistic, impressionistic, anime), lighting (e.g., cinematic, golden hour), composition (e.g., wide shot, close-up), and mood. Do not add any conversational text, just the prompt itself. Simple idea: "${idea}"`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });
            setResult(response.text);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (err) {
            console.error("Error generating content:", err);
            const errorMessage = err instanceof Error ? err.message : "An error occurred while enhancing the prompt.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="idea" className="block text-sm font-semibold text-brand-text mb-2">Simple Idea</label>
                    <input
                        id="idea"
                        type="text"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="e.g., a robot in a forest"
                        className="w-full p-3 bg-brand-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
                    />
                </div>
                 <div className="text-center">
                    <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-neumorphic-out hover:shadow-neumorphic-in transform hover:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                        <WandIcon />
                        {loading ? 'Enhancing...' : 'Enhance Prompt'}
                    </button>
                </div>
            </form>

            {error && <p className="mt-4 text-center text-red-500 font-semibold">{error}</p>}

             {(result || loading) && (
                 <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                     <h4 className="font-bold text-lg text-brand-text mb-2">Enhanced Prompt: {!hasCompleted && result && <span className="text-sm font-normal text-pale-green">(+25 points!)</span>}</h4>
                     {loading ? (
                        <div className="space-y-2 animate-pulse">
                            <div className="h-4 bg-brand-shadow-dark/50 rounded w-full"></div>
                            <div className="h-4 bg-brand-shadow-dark/50 rounded w-5/6"></div>
                        </div>
                     ) : (
                        <p className="font-mono text-sm text-brand-text-light">{result}</p>
                     )}
                 </div>
            )}
        </div>
    );
};

export default ImagePromptEnhancer;