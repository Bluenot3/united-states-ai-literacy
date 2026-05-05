import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
// FIX: Add import for AiOutputBlock
import AiOutputBlock from '../AiOutputBlock';

const EmotionBlendMixer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [emotion1, setEmotion1] = useState('Joy');
    const [emotion2, setEmotion2] = useState('Nostalgia');
    const [subject, setSubject] = useState('a lone astronaut discovering an ancient alien artifact');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!emotion1 || !emotion2 || !subject) {
            setError('Please fill all fields.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const prompt = `Write a short, evocative scene description about "${subject}". The scene should blend the emotions of ${emotion1} and ${emotion2}. Focus on sensory details to convey the mixed feelings.`;

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
            setError('Failed to generate the scene.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Emotion Blend Mixer</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Combine two emotions with a subject, and Gemini will write a scene blending them together.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="font-semibold text-sm text-brand-text">Emotion 1</label>
                    <input type="text" value={emotion1} onChange={e => setEmotion1(e.target.value)} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
                <div>
                    <label className="font-semibold text-sm text-brand-text">Emotion 2</label>
                    <input type="text" value={emotion2} onChange={e => setEmotion2(e.target.value)} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
                <div>
                    <label className="font-semibold text-sm text-brand-text">Subject</label>
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
            </div>
            
            <div className="text-center">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Blending...' : 'Generate Scene'}
                </button>
            </div>
            
            <AiOutputBlock
                content={result}
                isLoading={loading}
                error={error}
                title="Generated Scene"
                containerClassName="mt-6"
            />
        </div>
    );
};

export default EmotionBlendMixer;