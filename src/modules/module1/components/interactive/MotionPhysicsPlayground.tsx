import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const MotionPhysicsPlayground: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [animation, setAnimation] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const applyForce = (force: string) => {
        setAnimation(''); // Reset animation
        setTimeout(() => setAnimation(force), 10); // Apply new animation
         if (!hasCompleted) {
            addPoints(1, 10);
            updateModuleProgress(1, interactiveId, 'interactive');
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Motion Physics Playground</h4>
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-2/3 h-64 bg-brand-bg rounded-lg shadow-neumorphic-in flex items-center justify-center relative overflow-hidden">
                    <div 
                        className={`w-10 h-10 bg-brand-primary rounded-full absolute ${animation}`}
                        style={{'--start-y': '20%', '--end-y': '80%'} as React.CSSProperties}
                    ></div>
                </div>
                <div className="flex flex-col gap-3">
                    <button onClick={() => applyForce('animate-gravity')} className="px-4 py-2 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Apply Gravity</button>
                    <button onClick={() => applyForce('animate-float')} className="px-4 py-2 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Apply Anti-Gravity</button>
                    <button onClick={() => applyForce('animate-shake')} className="px-4 py-2 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Shake</button>
                    <button onClick={() => setAnimation('')} className="px-4 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Reset</button>
                </div>
            </div>
        </div>
    );
};

export default MotionPhysicsPlayground;
