import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';

const MelodyMakerAI: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [prompt, setPrompt] = useState('A hopeful and adventurous synthwave track for exploring a new city at night.');
    const [loading, setLoading] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setIsGenerated(false);
        // Simulate API call to a text-to-music model
        setTimeout(() => {
            setLoading(false);
            setIsGenerated(true);
            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        }, 2000);
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Melody Maker AI (Simulation)</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Describe the music you want to hear, and the AI will compose it for you.</p>

            <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={3}
                className="w-full p-2 bg-brand-bg rounded-lg shadow-neumorphic-in mb-4"
                placeholder="e.g., a lo-fi hip hop beat for studying"
            />
            
            <div className="text-center">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Composing...' : 'Generate Melody'}
                </button>
            </div>
            
             {isGenerated && (
                <div className="mt-6 text-center p-4 bg-brand-bg rounded-lg shadow-neumorphic-in animate-fade-in">
                    <p className="font-semibold text-brand-text">Now playing (simulation):</p>
                    <p className="text-brand-text-light italic">"{prompt}"</p>
                    <div className="mt-2 text-4xl animate-pulse">🎼</div>
                </div>
            )}
        </div>
    );
};

export default MelodyMakerAI;
