
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const CinematicPromptSequencer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [prompts, setPrompts] = useState(['A city skyline at dawn, misty and quiet.', 'The same city at bustling midday, traffic flowing.', 'The city at night, illuminated by millions of lights.']);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (prompts.some(p => !p.trim())) {
            setError('Please ensure all prompts are filled.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const apiPrompt = `You are an AI video generator. A user has provided a sequence of prompts to create a time-lapse video.
        
Write a description of the final video, explaining how you would smoothly transition between each scene to create a cohesive and cinematic time-lapse effect.

Prompt Sequence:
${prompts.map((p, i) => `${i+1}. ${p}`).join('\n')}
`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: apiPrompt });
            setResult(response.text);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate the video description.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Cinematic Prompt Sequencer</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Chain multiple prompts to describe a time-lapse video.</p>
            
            <div className="space-y-3 mb-4">
                {prompts.map((p, i) => (
                    <input 
                        key={i} 
                        type="text" 
                        value={p} 
                        onChange={e => {
                            const newPrompts = [...prompts];
                            newPrompts[i] = e.target.value;
                            setPrompts(newPrompts);
                        }}
                        className="w-full p-3 bg-brand-bg rounded-lg shadow-neumorphic-in"
                        placeholder={`Scene ${i + 1}`}
                    />
                ))}
            </div>
            
            <div className="text-center">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Rendering...' : 'Generate Time-Lapse'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || result) && (
                 <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">Time-Lapse Video Description</h5>
                    {loading && <p className="animate-pulse">...</p>}
                    <p className="text-brand-text-light">{result}</p>
                </div>
            )}
        </div>
    );
};

export default CinematicPromptSequencer;
