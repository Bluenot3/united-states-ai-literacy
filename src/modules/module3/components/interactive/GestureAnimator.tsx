
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const GestureAnimator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [character, setCharacter] = useState('A friendly cartoon robot');
    const [gesture, setGesture] = useState('Waving hello to the viewer');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!character.trim() || !gesture.trim()) {
            setError('Please describe both a character and a gesture.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const apiPrompt = `You are an AI animator. A user wants to animate a character performing a gesture. Since you can't create a video, describe the animation sequence in terms of keyframes.
        
-   **Character:** ${character}
-   **Gesture:** ${gesture}

Describe 3-4 keyframes, including the starting pose, the peak of the action, and the ending pose. Be descriptive about the motion arcs and timing.`;

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
            setError('Failed to generate the animation breakdown.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Gesture Animator</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Describe a character and a gesture, and Gemini will break it down into animation keyframes.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="font-semibold text-sm text-brand-text">Character</label>
                    <input type="text" value={character} onChange={e => setCharacter(e.target.value)} className="w-full mt-1 p-3 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
                 <div>
                    <label className="font-semibold text-sm text-brand-text">Gesture</label>
                    <input type="text" value={gesture} onChange={e => setGesture(e.target.value)} className="w-full mt-1 p-3 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
            </div>
            
            <div className="text-center">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Animating...' : 'Generate Keyframes'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || result) && (
                 <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">Animation Keyframes</h5>
                    {loading && <p className="animate-pulse">...</p>}
                    <pre className="text-brand-text-light whitespace-pre-wrap font-sans">{result}</pre>
                </div>
            )}
        </div>
    );
};

export default GestureAnimator;
