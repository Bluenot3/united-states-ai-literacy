
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../../../types';
import { useAuth } from '../../../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Modality } from '@google/genai';

const SkytowerArchitect: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [prompt, setPrompt] = useState('Generate a photorealistic architectural rendering and floor-plan schematic of a next-generation skyscraper reaching 1.2 km in height, designed for a coastal smart-city in 2035. Include correct proportional scale, realistic materials (carbon-fiber composites, solar glass, wind turbines), structural core reinforcement, and crowd flow modeling with annotations.');
    const [imageUrl, setImageUrl] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState({ image: false, analysis: false });
    const [error, setError] = useState('');

    const hasCompleted = user?.modules?.[4]?.completedInteractives.includes(interactiveId);

    const handleGenerateImage = async () => {
        if (!prompt.trim()) {
            setError('Please provide a detailed prompt.');
            return;
        }
        setLoading(prev => ({ ...prev, image: true }));
        setError('');
        setImageUrl('');
        setAnalysis('');

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });
            
            let foundImage = false;
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
                    foundImage = true;
                    if (!hasCompleted) {
                        addPoints(15);
                    }
                    break;
                }
            }
            if (!foundImage) {
                setError('The model did not return an image. Try a more descriptive prompt.');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate image. The prompt might be too complex or unsafe.');
        } finally {
            setLoading(prev => ({ ...prev, image: false }));
        }
    };

    const handleIntegrityCheck = async () => {
        if (!imageUrl) return;
        setLoading(prev => ({ ...prev, analysis: true }));
        setAnalysis('');
        
        const analysisPrompt = `You are a structural engineer. Based on the following user prompt for a skyscraper, analyze the design's structural plausibility. Explain why each key element (like the core, materials, or turbines) would be necessary for a building of this scale.
        
User Prompt: "${prompt}"`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: analysisPrompt });
            setAnalysis(response.text);
            if (!hasCompleted) {
                addPoints(15);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setAnalysis('Could not perform integrity check.');
        } finally {
            setLoading(prev => ({ ...prev, analysis: false }));
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Skytower Architect</h4>
            <div className="mb-4">
                <label className="font-semibold text-sm text-brand-text">Architectural Prompt</label>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={5} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
            </div>
            <div className="text-center mb-4">
                <button onClick={handleGenerateImage} disabled={loading.image} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon /> {loading.image ? 'Rendering...' : 'Generate Vision'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 my-2">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-2 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[250px] flex flex-col justify-center items-center">
                    {loading.image && <div className="animate-pulse text-brand-text-light">Generating image...</div>}
                    {imageUrl && <img src={imageUrl} alt="AI-generated skyscraper" className="rounded-lg object-contain max-h-96"/>}
                </div>
                <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[250px]">
                    <h5 className="font-semibold text-brand-text mb-2">Structural Analysis</h5>
                    {imageUrl && !analysis && (
                        <div className="text-center">
                            <button onClick={handleIntegrityCheck} disabled={loading.analysis} className="text-sm inline-flex items-center justify-center gap-2 bg-brand-bg text-brand-primary font-bold py-2 px-4 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                                <SparklesIcon /> {loading.analysis ? 'Analyzing...' : 'Run Integrity Check'}
                            </button>
                        </div>
                    )}
                    {loading.analysis && <p className="animate-pulse">Analyzing plausibility...</p>}
                    <p className="text-sm text-brand-text-light whitespace-pre-wrap">{analysis}</p>
                </div>
            </div>
        </div>
    );
};

export default SkytowerArchitect;
