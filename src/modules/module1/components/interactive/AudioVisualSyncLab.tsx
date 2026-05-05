import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
// FIX: Add import for AiOutputBlock
import AiOutputBlock from '../AiOutputBlock';

const AudioVisualSyncLab: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [visual, setVisual] = useState('A fast-paced car chase through city streets.');
    const [audio, setAudio] = useState('An epic orchestral score with intense drums.');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!visual.trim() || !audio.trim()) {
            setError('Please provide both a visual scene and an audio description.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const prompt = `You are a post-production supervisor. Create a plan for synchronizing audio and visuals for the following scene. Describe how specific audio cues would align with visual actions to maximize impact. Format your response using a markdown list.

Visual Scene: "${visual}"
Audio Description: "${audio}"`;

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
            setError('Failed to generate the synchronization plan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Audio-Visual Sync Lab</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Describe a scene and its audio, and Gemini will create a synchronization plan.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="font-semibold text-sm text-brand-text">Visual Scene Description</label>
                    <textarea value={visual} onChange={e => setVisual(e.target.value)} rows={3} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
                 <div>
                    <label className="font-semibold text-sm text-brand-text">Audio Description</label>
                    <textarea value={audio} onChange={e => setAudio(e.target.value)} rows={3} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
            </div>
            
            <div className="text-center">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Synchronizing...' : 'Generate Sync Plan'}
                </button>
            </div>
            
            <AiOutputBlock
                content={result}
                isLoading={loading}
                error={error}
                title="Synchronization Plan"
                containerClassName="mt-6"
            />
        </div>
    );
};

export default AudioVisualSyncLab;