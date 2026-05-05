import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';

const GenerativeSculptor3D: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [prompt, setPrompt] = useState('a crystalline fox with glowing blue eyes');
    const [loading, setLoading] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setIsGenerated(false);
        // Simulate API call to a text-to-3D model
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
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Generative 3D Sculptor (Simulation)</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Describe a 3D object, and the AI will generate a model for you.</p>

            <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="e.g., a rusty sci-fi helmet"
                    className="flex-grow w-full px-4 py-3 bg-brand-bg rounded-full shadow-neumorphic-in"
                />
                <button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Generating...' : 'Generate 3D Model'}
                </button>
            </div>
            
            <div className="w-full aspect-video bg-brand-bg rounded-lg shadow-neumorphic-in flex items-center justify-center text-brand-text-light">
                {loading && <p className="animate-pulse">Creating 3D mesh...</p>}
                {isGenerated && (
                    <div className="text-center animate-fade-in">
                        <p className="text-6xl">🦊</p>
                        <p className="font-semibold mt-2">"{prompt}"</p>
                        <p className="text-xs">(3D model generated)</p>
                    </div>
                )}
                {!loading && !isGenerated && <p>Preview will appear here.</p>}
            </div>
        </div>
    );
};

export default GenerativeSculptor3D;
