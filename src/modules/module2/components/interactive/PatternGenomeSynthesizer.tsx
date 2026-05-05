
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Type } from '@google/genai';

interface PatternResult {
    name: string;
    svg_pattern: string;
}

const PatternGenomeSynthesizer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [prompt, setPrompt] = useState('Geometric floral pattern in the Art Deco style');
    const [result, setResult] = useState<PatternResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe a pattern.');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);

        const apiPrompt = `You are a pattern designer. Based on the user's prompt, create a simple, abstract, geometric SVG pattern. The SVG should be a single <svg> element containing basic shapes like <rect>, <circle>, or <path>. It should be tileable. Also provide a creative name for the pattern.

User Prompt: "${prompt}"`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ 
                model: 'gemini-2.5-flash', 
                contents: apiPrompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: 'A creative name for the pattern.' },
                            svg_pattern: { type: Type.STRING, description: 'A string containing a complete, simple, tileable SVG pattern.'}
                        },
                        required: ['name', 'svg_pattern']
                    }
                }
            });
            
            const data = JSON.parse(response.text);
            setResult(data);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate the pattern. The AI may have returned an invalid format.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Pattern Genome Synthesizer</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Describe a pattern, and Gemini will generate an SVG representation of it.</p>
            
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} className="flex-grow w-full px-4 py-3 bg-brand-bg rounded-full shadow-neumorphic-in"/>
                <button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Synthesizing...' : 'Generate'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || result) && (
                 <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2 text-center">{result?.name || 'Loading...'}</h5>
                    {loading && <div className="animate-pulse bg-brand-shadow-dark/50 h-48 rounded-lg"></div>}
                    {result?.svg_pattern && (
                        <div className="w-full h-48 rounded-lg" style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(result.svg_pattern)}")`, backgroundRepeat: 'repeat', backgroundSize: '50px 50px' }}>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PatternGenomeSynthesizer;
