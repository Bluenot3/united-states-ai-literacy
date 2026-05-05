
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const SceneDirectorXR: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [directions, setDirections] = useState('A lone detective stands under a flickering streetlamp on a rain-slicked 1940s city street. A mysterious figure watches from a shadowy alleyway.');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!directions.trim()) {
            setError('Please provide some stage directions.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const prompt = `You are a cinematic director for an XR scene. Based on the following stage directions, create a detailed "shot list" and "scene breakdown".
        
For the shot list, describe 3 distinct camera shots (e.g., Wide Shot, Medium Close-Up, POV shot).
For the scene breakdown, describe the lighting, atmosphere, and character blocking.

Stage Directions: "${directions}"`;

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
            setError('Failed to generate the scene breakdown.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Scene Director XR</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Write stage directions, and Gemini will generate a cinematic shot list and scene breakdown.</p>
            
            <div className="space-y-4">
                <div>
                    <label className="font-semibold text-sm text-brand-text">Stage Directions</label>
                    <textarea value={directions} onChange={e => setDirections(e.target.value)} rows={4} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
            </div>
            
            <div className="text-center mt-4">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Directing...' : 'Construct Scene'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || result) && (
                 <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">Cinematic Breakdown</h5>
                    {loading && <p className="animate-pulse">...</p>}
                    <pre className="text-brand-text-light whitespace-pre-wrap font-sans">{result}</pre>
                </div>
            )}
        </div>
    );
};

export default SceneDirectorXR;
