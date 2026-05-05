import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { InteractiveComponentProps } from '../../types';

// y = 8x + 15, where y is score, x is hours studied.
// Min hours = 0, Max hours = 10
// Min score = 15, Max score = 95
const predictScore = (hours: number) => Math.max(0, Math.min(100, 8 * hours + 15 + (Math.random() - 0.5) * 5));

const SimplePredictiveModel: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const [hours, setHours] = useState(5);
    const { user, addPoints, updateProgress } = useAuth();
    const score = predictScore(hours);

    const handleInteraction = (value: number) => {
        setHours(value);
        if (user && !user.progress.completedInteractives.includes(interactiveId)) {
            addPoints(10);
            updateProgress(interactiveId, 'interactive');
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Predictive Model: Study vs. Score</h4>
            <div className="flex flex-col items-center gap-6">
                <div className="w-full max-w-sm">
                    <label htmlFor="study-hours" className="block text-center text-brand-text-light mb-2">Hours Studied: <span className="font-bold text-brand-text">{hours}</span></label>
                    <input
                        id="study-hours"
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={hours}
                        onChange={(e) => handleInteraction(parseFloat(e.target.value))}
                        className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in"
                    />
                </div>
                <div className="text-center p-6 bg-brand-bg rounded-full shadow-neumorphic-out w-48 h-48 flex flex-col justify-center items-center">
                    <p className="text-brand-text-light text-sm">Predicted Score</p>
                    <p className="font-extrabold text-5xl text-brand-primary">{Math.round(score)}%</p>
                </div>
                <div className="text-center p-4 bg-brand-bg rounded-lg shadow-neumorphic-in text-sm text-brand-text-light font-mono">
                    Model: score = (8 * hours) + 15 ± noise
                </div>
            </div>
        </div>
    );
};

export default SimplePredictiveModel;