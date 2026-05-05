import React, { useState, useRef } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';

// This is a mock component as Web Audio API for sound generation is complex for this scope.
// In a real scenario, this would call a text-to-sound model.

const AmbientArchitect: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [description, setDescription] = useState('A quiet forest at night with crickets and a gentle breeze.');
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleGenerate = () => {
        setLoading(true);
        setIsPlaying(false);
        // Simulate API call
        setTimeout(() => {
            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
            // In a real app, you would get an audio file URL from an AI.
            // We'll just pretend and enable the play button.
            setLoading(false);
            setIsPlaying(true);
        }, 1500);
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Ambient Soundscape Architect</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Describe a scene, and the AI will generate an ambient soundscape for it (simulation).</p>
            
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full p-2 bg-brand-bg rounded-lg shadow-neumorphic-in mb-4"/>
            
            <div className="text-center">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Generating...' : 'Generate Soundscape'}
                </button>
            </div>

            {isPlaying && (
                <div className="mt-6 text-center p-4 bg-brand-bg rounded-lg shadow-neumorphic-in animate-fade-in">
                    <p className="font-semibold text-brand-text">Now playing (simulation):</p>
                    <p className="text-brand-text-light italic">"{description}"</p>
                    <div className="mt-2 text-4xl animate-pulse">🎵</div>
                </div>
            )}
        </div>
    );
};

export default AmbientArchitect;
