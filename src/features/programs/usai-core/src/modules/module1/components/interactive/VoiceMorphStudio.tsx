import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';

const voices = ['Nova (Warm, Friendly)', 'Orion (Deep, Authoritative)', 'Lyra (Crisp, Professional)', 'Caelus (Energetic, Youthful)'];

const VoiceMorphStudio: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [text, setText] = useState('Welcome to the future of synthetic voices.');
    const [voice, setVoice] = useState(voices[0]);
    const [loading, setLoading] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleGenerate = () => {
        if (!text.trim()) return;
        setLoading(true);
        setIsGenerated(false);
        setTimeout(() => {
            setLoading(false);
            setIsGenerated(true);
            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        }, 1500);
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Voice Morph Studio (Simulation)</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Enter text and select a voice profile to generate audio.</p>

            <div className="space-y-4">
                 <div>
                    <label className="font-semibold text-sm text-brand-text">Text to Synthesize</label>
                    <textarea value={text} onChange={e => setText(e.target.value)} rows={3} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
                <div>
                    <label className="font-semibold text-sm text-brand-text">Voice Profile</label>
                    <select value={voice} onChange={e => setVoice(e.target.value)} className="w-full mt-1 p-3 bg-brand-bg rounded-lg shadow-neumorphic-in">
                        {voices.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
            </div>
            
            <div className="text-center mt-6">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Generating...' : 'Generate Voice'}
                </button>
            </div>
            
            {isGenerated && (
                <div className="mt-6 text-center p-4 bg-brand-bg rounded-lg shadow-neumorphic-in animate-fade-in">
                    <p className="font-semibold text-brand-text">Playing audio with voice: {voice}</p>
                    <div className="mt-2 text-4xl animate-pulse">🔊</div>
                </div>
            )}
        </div>
    );
};

export default VoiceMorphStudio;
