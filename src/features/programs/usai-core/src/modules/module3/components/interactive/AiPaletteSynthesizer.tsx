import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Type } from '@google/genai';

interface Palette {
    name: string;
    colors: string[];
}

const AiPaletteSynthesizer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [description, setDescription] = useState('a serene sunset over a calm ocean');
    const [palette, setPalette] = useState<Palette | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please enter a description.');
            return;
        }
        setLoading(true);
        setError('');
        setPalette(null);

        const prompt = `Generate a color palette based on the following description. The palette should have a descriptive name and consist of 5 harmonious colors in hex code format.
        
Description: "${description}"`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            colors: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            }
                        },
                        required: ['name', 'colors']
                    }
                }
            });

            const result = JSON.parse(response.text) as Palette;
            // Ensure there are exactly 5 colors for consistent UI
            if (result.colors && result.colors.length > 5) {
                result.colors = result.colors.slice(0, 5);
            }
            setPalette(result);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate palette. Please try a different description.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">AI Palette Synthesizer</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Describe an image or mood, and Gemini will generate a color palette for you.</p>

            <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="e.g., a futuristic cyberpunk city"
                    className="flex-grow w-full px-4 py-3 bg-brand-bg rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
                />
                <button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-neumorphic-out hover:shadow-neumorphic-in transform hover:scale-95 disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Generating...' : 'Generate'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            <div className="mt-6">
                {loading && (
                    <div className="h-28 bg-brand-bg rounded-lg shadow-neumorphic-in animate-pulse"></div>
                )}
                {palette && (
                    <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in animate-fade-in">
                        <h5 className="font-semibold text-center text-brand-text mb-3">{palette.name}</h5>
                        <div className="flex h-20 rounded-lg overflow-hidden">
                            {palette.colors.map((color, index) => (
                                <div key={index} className="flex-1 group relative flex items-center justify-center" style={{ backgroundColor: color }}>
                                    <span className="text-xs font-mono bg-black/50 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        {color}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiPaletteSynthesizer;