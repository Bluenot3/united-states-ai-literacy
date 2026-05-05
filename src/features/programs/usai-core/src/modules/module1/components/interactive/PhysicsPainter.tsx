import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const PhysicsPainter: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [isPainting, setIsPainting] = useState(false);

    const handlePaint = () => {
        setIsPainting(true);
        if (user && !user.progress.completedInteractives.includes(interactiveId)) {
            addPoints(1, 25);
            updateModuleProgress(1, interactiveId, 'interactive');
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Physics Painter (Simulation)</h4>
            <div className="w-full aspect-video bg-brand-bg rounded-lg shadow-neumorphic-in flex items-center justify-center p-4 relative overflow-hidden">
                <p className={`transition-opacity ${isPainting ? 'opacity-0' : 'opacity-50'}`}>Click "Paint" to start</p>
                {isPainting && (
                    <div className="absolute inset-0">
                        <div className="absolute w-2 h-20 bg-brand-primary rounded-full animate-paint-drip" style={{left: '20%', animationDelay: '0s'}}></div>
                        <div className="absolute w-3 h-32 bg-pale-green rounded-full animate-paint-drip" style={{left: '50%', animationDelay: '0.5s'}}></div>
                        <div className="absolute w-2 h-24 bg-pale-yellow rounded-full animate-paint-drip" style={{left: '75%', animationDelay: '0.2s'}}></div>
                    </div>
                )}
            </div>
             <div className="text-center mt-6">
                <button onClick={handlePaint} className="px-6 py-2 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">
                    Paint with Gravity
                </button>
                <button onClick={() => setIsPainting(false)} className="ml-4 px-4 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">
                    Clear
                </button>
            </div>
        </div>
    );
};

export default PhysicsPainter;
