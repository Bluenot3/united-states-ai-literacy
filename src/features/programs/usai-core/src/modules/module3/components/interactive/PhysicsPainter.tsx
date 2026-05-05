
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const PhysicsPainter: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [friction, setFriction] = useState(50);
    const [density, setDensity] = useState(50);
    const [elasticity, setElasticity] = useState(50);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        setResult('');

        const prompt = `You are a physics simulation AI. Describe a scene where "a collection of geometric shapes (cubes, spheres, pyramids) are dropped onto a sloped surface" with the following physical properties:

- Friction: ${friction}/100 (0 is ice, 100 is sandpaper)
- Density of Shapes: ${density}/100 (0 is foam, 100 is lead)
- Elasticity (Bounciness): ${elasticity}/100 (0 is clay, 100 is a superball)

Describe how the shapes would slide, tumble, and bounce.`;

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
            setError('Failed to generate the physics simulation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Physics Painter</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">"Paint" with physics by adjusting the parameters below, then see how the scene behaves.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-center text-brand-text-light mb-1">Friction: {friction}%</label>
                    <input type="range" min="0" max="100" value={friction} onChange={e => setFriction(Number(e.target.value))} className="w-full"/>
                </div>
                 <div>
                    <label className="block text-center text-brand-text-light mb-1">Density: {density}%</label>
                    <input type="range" min="0" max="100" value={density} onChange={e => setDensity(Number(e.target.value))} className="w-full"/>
                </div>
                 <div>
                    <label className="block text-center text-brand-text-light mb-1">Elasticity: {elasticity}%</label>
                    <input type="range" min="0" max="100" value={elasticity} onChange={e => setElasticity(Number(e.target.value))} className="w-full"/>
                </div>
            </div>
            
            <div className="text-center">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Simulating...' : 'Run Simulation'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || result) && (
                 <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">Physics Scene Description</h5>
                    {loading && <p className="animate-pulse">...</p>}
                    <p className="text-brand-text-light">{result}</p>
                </div>
            )}
        </div>
    );
};

export default PhysicsPainter;
