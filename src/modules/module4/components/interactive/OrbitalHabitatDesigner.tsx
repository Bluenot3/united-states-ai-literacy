
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../../../types';
import { useAuth } from '../../../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Modality } from '@google/genai';

const OrbitalHabitatDesigner: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [prompt, setPrompt] = useState('Generate a high-fidelity cutaway visualization of a lunar base built for 5,000 inhabitants. Include radiation shielding layers, hydroponic zones, oxygen recycling loops, fusion-reactor placement, transportation tubes, and energy storage systems. Label all major sections accurately.');
    const [imageUrl, setImageUrl] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.modules?.[4]?.completedInteractives.includes(interactiveId);

    const handleGenerate = async (currentPrompt: string) => {
        if (!currentPrompt.trim()) {
            setError('Please provide a detailed prompt for the habitat.');
            return;
        }
        setLoading(true);
        setError('');
        setImageUrl('');
        setSummary('');

        try {
            const ai = await getAiClient();

            // 1. Generate Image
            const imgResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: currentPrompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });
            
            let foundImage = false;
            for (const part of imgResponse.candidates[0].content.parts) {
                if (part.inlineData) {
                    setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
                    foundImage = true;
                    break;
                }
            }
            if (!foundImage) {
                throw new Error('Model did not return an image.');
            }

            // 2. Generate System Summary
            const summaryPrompt = `Based on the following design prompt for a space habitat, provide a brief system summary. Explain the purpose of key systems mentioned (e.g., life support, power, shielding).
            
Design Prompt: "${currentPrompt}"`;
            
            const summaryResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: summaryPrompt });
            setSummary(summaryResponse.text);

            if (!hasCompleted) {
                addPoints(30);
                updateProgress(interactiveId, 'interactive');
            }

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'Failed to generate the habitat design.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleGovernanceMode = () => {
        const governancePrompt = prompt + " Now, revise the design to prioritize sustainability and ethical resource use over rapid expansion.";
        setPrompt(governancePrompt);
        handleGenerate(governancePrompt);
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Orbital Habitat Designer</h4>
             <div className="mb-4">
                <label className="font-semibold text-sm text-brand-text">Habitat Design Prompt</label>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={5} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
            </div>
             <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
                <button onClick={() => handleGenerate(prompt)} disabled={loading} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon /> {loading ? 'Generating...' : 'Generate Habitat'}
                </button>
                <button onClick={handleGovernanceMode} disabled={loading} className="w-full sm:w-auto text-sm inline-flex items-center justify-center gap-2 bg-brand-bg text-pale-green font-bold py-2 px-4 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    Apply Governance Mode
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 my-2">{error}</p>}
            
            <div className="relative p-2 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[300px] flex flex-col justify-center items-center">
                {loading && <div className="animate-pulse text-brand-text-light">Generating habitat systems...</div>}
                {imageUrl && (
                    <>
                        <img src={imageUrl} alt="AI-generated orbital habitat" className="rounded-lg object-contain max-h-[500px]"/>
                        {summary && (
                            <div className="absolute bottom-2 left-2 right-2 p-2 bg-black/50 text-white/90 backdrop-blur-sm rounded-md text-xs animate-fade-in">
                                <h6 className="font-bold">SYSTEMS OVERLAY</h6>
                                <p>{summary}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default OrbitalHabitatDesigner;
