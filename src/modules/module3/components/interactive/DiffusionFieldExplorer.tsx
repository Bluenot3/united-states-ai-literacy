
import React, { useState, useCallback } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const DiffusionFieldExplorer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [steps, setSteps] = useState(5);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    // Debounce function
    const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
        let timeoutId: ReturnType<typeof setTimeout>;
        return (...args: Parameters<F>): void => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const generateDescription = async (currentSteps: number) => {
        setLoading(true);
        setError('');
        
        let clarity = 'almost pure static noise';
        if (currentSteps > 8) clarity = 'a clear and detailed image';
        else if (currentSteps > 5) clarity = 'a recognizable but blurry form';
        else if (currentSteps > 2) clarity = 'a vague, ghostly shape emerging from the noise';

        const prompt = `You are a creative visual AI assistant. Describe what an image of "an astronaut riding a horse on the moon" would look like during a diffusion model's generation process. The process is at a stage where the image is ${clarity}. Be descriptive and evocative.`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setDescription(response.text);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate description.');
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedGenerate = useCallback(debounce(generateDescription, 500), [hasCompleted]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSteps = Number(e.target.value);
        setSteps(newSteps);
        debouncedGenerate(newSteps);
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Diffusion Field Explorer</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Adjust the slider to see how a diffusion model builds an image from noise, step by step.</p>
            
            <div className="relative w-full aspect-video bg-gray-800 rounded-lg shadow-neumorphic-in overflow-hidden flex items-center justify-center p-4 text-white/50 font-mono text-xs">
                {/* Visual noise effect */}
                 <div className="absolute inset-0 bg-repeat opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    animation: `noise 0.2s infinite`,
                    filter: `blur(${10 - steps}px)`
                 }}/>
                 <div className="relative p-4 bg-black/50 rounded-lg">
                    {loading && <p className="animate-pulse">Generating description...</p>}
                    {error && <p className="text-red-400">{error}</p>}
                    {!loading && description && <p className="text-white text-center text-sm font-sans">{description}</p>}
                 </div>
            </div>

            <div className="mt-6">
                <label className="block text-center text-brand-text-light mb-2">Denoising Steps: <span className="font-bold text-brand-text">{steps}</span></label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={steps}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in"
                />
            </div>
        </div>
    );
};

export default DiffusionFieldExplorer;
