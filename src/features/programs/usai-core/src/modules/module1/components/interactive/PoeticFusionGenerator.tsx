import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import AiOutputBlock from '../AiOutputBlock';

const PoeticFusionGenerator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [concept1, setConcept1] = useState('The silence of deep space');
    const [concept2, setConcept2] = useState('The warmth of a crackling fireplace');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!concept1.trim() || !concept2.trim()) {
            setError('Please provide two concepts to fuse.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const prompt = `You are a creative poet. Write a short, evocative poem that fuses the following two concepts:

Concept 1: ${concept1}
Concept 2: ${concept2}`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setResult(response.text);

            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate the poem.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Poetic Fusion Generator</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Enter two concepts, and Gemini will write a poem that blends them together.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="font-semibold text-sm text-brand-text">Concept 1</label>
                    <input type="text" value={concept1} onChange={e => setConcept1(e.target.value)} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
                 <div>
                    <label className="font-semibold text-sm text-brand-text">Concept 2</label>
                    <input type="text" value={concept2} onChange={e => setConcept2(e.target.value)} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
            </div>
            
            <div className="text-center">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Fusing...' : 'Generate Poem'}
                </button>
            </div>
            
            <AiOutputBlock
                content={result}
                isLoading={loading}
                error={error}
                title="Fused Poem"
                containerClassName="mt-6"
            />
        </div>
    );
};

export default PoeticFusionGenerator;
