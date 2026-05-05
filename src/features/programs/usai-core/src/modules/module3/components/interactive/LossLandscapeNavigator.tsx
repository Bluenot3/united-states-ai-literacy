import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const points = [
    { id: 'start', x: 10, y: 20, description: "the initial state of the model with random parameters, where the error (loss) is very high." },
    { id: 'peak', x: 30, y: 15, description: "a point of high error. The training process aims to move away from these peaks." },
    { id: 'saddle', x: 50, y: 50, description: "a tricky saddle point. It's flat in some directions and curved in others, which can temporarily slow down training." },
    { id: 'local_min', x: 75, y: 70, description: "a local minimum. The model has found a good solution, but not the best one. It's a common challenge in optimization." },
    { id: 'global_min', x: 90, y: 85, description: "the global minimum. This is the ideal target, representing the lowest possible error and the best model performance." },
];

const LossLandscapeNavigator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activePoint, setActivePoint] = useState<string | null>(null);

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handlePointClick = async (point: any) => {
        setLoading(true);
        setError('');
        setExplanation('');
        setActivePoint(point.id);

        const prompt = `Explain in simple terms for a beginner what a "${point.id}" point represents on a model's loss landscape. You should explain that this point represents ${point.description}`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setExplanation(response.text);
            if (!hasCompleted && !user?.progress.completedInteractives.includes(interactiveId)) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to get explanation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Loss-Landscape Navigator</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">This is a 2D representation of a model's error surface. Click the blinking points to learn what they mean.</p>
            
            <div className="relative w-full max-w-xl mx-auto aspect-video rounded-lg shadow-neumorphic-in overflow-hidden">
                {/* Dummy background image */}
                <svg width="100%" height="100%" viewBox="0 0 400 200" className="absolute inset-0">
                  <defs>
                    <radialGradient id="grad1" cx="50%" cy="90%" r="80%">
                      <stop offset="0%" style={{stopColor: '#c4b5fd', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 1}} />
                    </radialGradient>
                  </defs>
                  <rect width="400" height="200" fill="url(#grad1)" />
                  <path d="M 0 100 Q 100 20, 200 100 T 400 100" stroke="#ffffff55" strokeWidth="2" fill="none" />
                   <path d="M 0 120 Q 100 180, 200 120 T 400 120" stroke="#ffffff33" strokeWidth="2" fill="none" />
                </svg>

                {/* Points of interest */}
                {points.map(p => (
                    <button
                        key={p.id}
                        onClick={() => handlePointClick(p)}
                        className={`absolute w-5 h-5 rounded-full bg-white/50 -translate-x-1/2 -translate-y-1/2 border-2 border-white animate-pulse ${activePoint === p.id ? 'ring-4 ring-pale-yellow' : ''}`}
                        style={{ left: `${p.x}%`, top: `${p.y}%` }}
                        aria-label={`Select point ${p.id}`}
                    />
                ))}
            </div>

            <div className="mt-4 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[100px]">
                 <h5 className="font-semibold text-brand-text mb-2 flex items-center gap-2"><SparklesIcon/> Explanation</h5>
                 {loading && <p className="animate-pulse">Loading explanation...</p>}
                 {error && <p className="text-red-500">{error}</p>}
                 {explanation && <p className="text-brand-text-light">{explanation}</p>}
            </div>
        </div>
    );
};

export default LossLandscapeNavigator;
