
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Type } from '@google/genai';

interface Shot {
    panel: number;
    shot_type: string;
    description: string;
}

const StoryboardForgePlus: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [script, setScript] = useState('A hero enters a dark cave, finds a glowing sword, and raises it triumphantly.');
    const [shots, setShots] = useState<Shot[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!script.trim()) {
            setError('Please provide a script or scene description.');
            return;
        }
        setLoading(true);
        setError('');
        setShots([]);

        const apiPrompt = `You are an AI storyboard artist. Convert the following script into a sequence of 3-5 storyboard panels. For each panel, provide the shot type and a visual description.

Script: "${script}"`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ 
                model: 'gemini-2.5-flash', 
                contents: apiPrompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                panel: { type: Type.NUMBER },
                                shot_type: { type: Type.STRING },
                                description: { type: Type.STRING }
                            }
                        }
                    }
                }
            });
            
            const data = JSON.parse(response.text);
            setShots(data);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate storyboard. The AI may have returned an invalid format.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Storyboard Forge Plus</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Input a script, and Gemini will generate a storyboard sequence for you.</p>
            
            <div className="space-y-4">
                <textarea value={script} onChange={e => setScript(e.target.value)} rows={3} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
            </div>
            
            <div className="text-center mt-4">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Generating...' : 'Create Storyboard'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading && Array.from({length: 3}).map((_, i) => <div key={i} className="h-40 bg-brand-bg rounded-lg shadow-neumorphic-in animate-pulse"></div>)}
                {shots.map((shot) => (
                     <div key={shot.panel} className="p-3 bg-brand-bg rounded-lg shadow-neumorphic-out">
                        <div className="font-bold text-brand-primary mb-1">{shot.shot_type}</div>
                        <p className="text-sm text-brand-text-light">{shot.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoryboardForgePlus;
