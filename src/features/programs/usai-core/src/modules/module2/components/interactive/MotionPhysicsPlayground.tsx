
import React, { useState, useCallback } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const MotionPhysicsPlayground: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [gravity, setGravity] = useState(50);
    const [turbulence, setTurbulence] = useState(20);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    // Debounce function
    const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
        let timeoutId: ReturnType<typeof setTimeout>;
        return (...args: Parameters<F>): void => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const generateDescription = async (g: number, t: number) => {
        setLoading(true);
        setError('');
        
        const prompt = `You are a physics simulation AI. Describe the motion of "a single autumn leaf falling from a tree" given the following environmental parameters:
        
- Gravity Strength: ${g}/100
- Air Turbulence: ${t}/100

Be descriptive about the leaf's path, speed, and rotation.`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setResult(response.text);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate description.');
        } finally {
            setLoading(false);
        }
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedGenerate = useCallback(debounce(generateDescription, 500), [hasCompleted]);

    const handleGravityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newGravity = Number(e.target.value);
        setGravity(newGravity);
        debouncedGenerate(newGravity, turbulence);
    };
    
    const handleTurbulenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTurbulence = Number(e.target.value);
        setTurbulence(newTurbulence);
        debouncedGenerate(gravity, newTurbulence);
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Motion Physics Playground</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Adjust the physics parameters and see how an AI describes the resulting motion.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                    <label className="block text-center text-brand-text-light mb-2">Gravity: <span className="font-bold text-brand-text">{gravity}%</span></label>
                    <input type="range" min="0" max="100" value={gravity} onChange={handleGravityChange} className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in"/>
                </div>
                 <div>
                    <label className="block text-center text-brand-text-light mb-2">Turbulence: <span className="font-bold text-brand-text">{turbulence}%</span></label>
                    <input type="range" min="0" max="100" value={turbulence} onChange={handleTurbulenceChange} className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in"/>
                </div>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            <div className="mt-4 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[150px]">
                <h5 className="font-semibold text-brand-text mb-2 flex items-center gap-2"><SparklesIcon/> Motion Description</h5>
                {loading && <p className="animate-pulse">Simulating...</p>}
                 {!loading && !result && <p className="text-brand-text-light/50">Adjust sliders to begin simulation.</p>}
                <p className="text-brand-text-light">{result}</p>
            </div>
        </div>
    );
};

export default MotionPhysicsPlayground;
