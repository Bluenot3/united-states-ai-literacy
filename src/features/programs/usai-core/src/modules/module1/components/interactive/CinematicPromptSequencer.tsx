import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
// FIX: Add import for AiOutputBlock
import AiOutputBlock from '../AiOutputBlock';

const CinematicPromptSequencer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [prompt, setPrompt] = useState('A single flower blooming, from a closed bud to a full flower, then wilting.');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please provide a description of a time-lapse.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const apiPrompt = `You are a director of photography specializing in time-lapse video. Break down the following user prompt into a sequence of descriptive prompts for a text-to-video AI model. Create 3-5 distinct prompts that show a clear progression. Use markdown headings for each stage (e.g., "Stage 1: Budding").

User Prompt: "${prompt}"`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: apiPrompt });
            setResult(response.text);

            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate the prompt sequence.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Cinematic Prompt Sequencer</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Describe a time-lapse, and Gemini will generate a sequence of prompts to create it.</p>
            
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in mb-4"/>
            
            <div className="text-center">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Sequencing...' : 'Generate Sequence'}
                </button>
            </div>
            
            <AiOutputBlock
                content={result}
                isLoading={loading}
                error={error}
                title="Time-Lapse Prompt Sequence"
                containerClassName="mt-6"
            />
        </div>
    );
};

export default CinematicPromptSequencer;