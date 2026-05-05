import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const GenerativeSculptor3D: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [objectPrompt, setObjectPrompt] = useState('a futuristic throne made of crystal');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!objectPrompt.trim()) {
            setError('Please enter a description of an object.');
            return;
        }
        setLoading(true);
        setError('');
        setDescription('');

        const prompt = `You are a 3D modeling assistant. A user wants to generate a 3D object based on their prompt. Since you can't create a real 3D mesh, instead write a detailed and vivid description of the 3D object. Describe its shape, materials, texture, lighting, and overall aesthetic as if you were describing a finished 3D render.

User's prompt: "${objectPrompt}"`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });
            setDescription(response.text);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate description. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Generative Sculptor 3D (Conceptual)</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">While we can't render a 3D model in real-time here, you can describe an object and Gemini will generate a detailed textual description of its form.</p>

            <div className="flex flex-col sm:flex-row items-center gap-2">
                 <input
                    type="text"
                    value={objectPrompt}
                    onChange={e => setObjectPrompt(e.target.value)}
                    placeholder="Describe an object..."
                    className="flex-grow w-full px-4 py-3 bg-brand-bg rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
                />
                <button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-neumorphic-out hover:shadow-neumorphic-in transform hover:scale-95 disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Generating...' : 'Generate Description'}
                </button>
            </div>

            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            <div className="mt-6">
                 {(loading || description) && (
                    <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in animate-fade-in">
                        <h5 className="font-semibold text-brand-text mb-2">3D Object Description</h5>
                        {loading && <p className="animate-pulse text-brand-text-light">Generating...</p>}
                        <p className="text-brand-text-light">{description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerativeSculptor3D;