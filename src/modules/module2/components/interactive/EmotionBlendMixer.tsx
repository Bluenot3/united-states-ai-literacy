import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const emotions = ['Joy', 'Awe', 'Melancholy', 'Suspense', 'Nostalgia', 'Serenity', 'Excitement'];

const EmotionBlendMixer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [emotion1, setEmotion1] = useState('Awe');
    const [emotion2, setEmotion2] = useState('Melancholy');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (emotion1 === emotion2) {
            setError('Please select two different emotions.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const prompt = `You are a creative writer. Write a short, evocative paragraph (3-5 sentences) that captures a scene or feeling blending the emotions of "${emotion1}" and "${emotion2}".`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setResult(response.text);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate the emotional blend. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Emotion Blend Mixer</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Combine two emotions and see what creative text Gemini generates.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="emotion1" className="block text-sm font-semibold text-brand-text mb-2">Emotion 1</label>
                    <select
                        id="emotion1"
                        value={emotion1}
                        onChange={(e) => setEmotion1(e.target.value)}
                        className="w-full p-3 bg-brand-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
                    >
                        {emotions.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="emotion2" className="block text-sm font-semibold text-brand-text mb-2">Emotion 2</label>
                    <select
                        id="emotion2"
                        value={emotion2}
                        onChange={(e) => setEmotion2(e.target.value)}
                        className="w-full p-3 bg-brand-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
                    >
                        {emotions.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                </div>
            </div>
            
            <div className="text-center mt-6">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-neumorphic-out hover:shadow-neumorphic-in transform hover:scale-95 disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Blending...' : 'Blend Emotions'}
                </button>
            </div>

            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || result) && (
                <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in animate-fade-in">
                    <h5 className="font-semibold text-brand-text mb-2">Generated Scene</h5>
                    {loading && <p className="animate-pulse text-brand-text-light">Writing...</p>}
                    <p className="text-brand-text-light">{result}</p>
                </div>
            )}
        </div>
    );
};

export default EmotionBlendMixer;