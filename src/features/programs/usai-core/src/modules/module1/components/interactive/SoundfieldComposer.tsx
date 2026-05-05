import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const sounds = [
    { name: 'Birdsong', icon: '🐦' },
    { name: 'River', icon: '💧' },
    { name: 'Wind', icon: '💨' },
    { name: 'Footsteps', icon: '👣' },
];

interface PlacedSound {
    name: string;
    icon: string;
    x: number;
    y: number;
}

const SoundfieldComposer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [selectedSound, setSelectedSound] = useState(sounds[0]);
    const [placedSounds, setPlacedSounds] = useState<PlacedSound[]>([]);
    
    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handlePlaceSound = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setPlacedSounds([...placedSounds, { ...selectedSound, x, y }]);
        
        if (!hasCompleted) {
            addPoints(1, 10);
            updateModuleProgress(1, interactiveId, 'interactive');
        }
    };
    
    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Spatial Soundfield Composer (Simulation)</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Select a sound, then click on the canvas to place it in the 3D space.</p>

            <div className="flex justify-center gap-2 mb-4">
                {sounds.map(sound => (
                    <button 
                        key={sound.name}
                        onClick={() => setSelectedSound(sound)}
                        className={`p-2 rounded-lg text-2xl ${selectedSound.name === sound.name ? 'shadow-neumorphic-in' : 'shadow-neumorphic-out'}`}
                    >
                        {sound.icon}
                    </button>
                ))}
            </div>

            <div 
                className="w-full aspect-video bg-brand-bg rounded-lg shadow-neumorphic-in relative cursor-crosshair"
                onClick={handlePlaceSound}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl opacity-50">👤</div>
                {placedSounds.map((sound, i) => (
                    <div 
                        key={i} 
                        className="absolute text-2xl" 
                        style={{ left: `${sound.x}%`, top: `${sound.y}%`, transform: 'translate(-50%, -50%)' }}
                    >
                        {sound.icon}
                    </div>
                ))}
            </div>

            <div className="text-center mt-4">
                <button onClick={() => setPlacedSounds([])} className="px-4 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Clear Canvas</button>
            </div>
        </div>
    );
};

export default SoundfieldComposer;
