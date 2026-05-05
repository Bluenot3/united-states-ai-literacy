import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import AiOutputBlock from '../AiOutputBlock';

const PitchBuilder: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [problem, setProblem] = useState('Artists struggle to find inspiration for new color palettes.');
    const [solution, setSolution] = useState('An AI-powered web app that generates unique color palettes from a text description.');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!problem.trim() || !solution.trim()) {
            setError('Please describe both the problem and the solution.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const prompt = `You are a startup pitch coach. Based on the problem and solution provided, write a concise and compelling elevator pitch. Structure it with a hook, introduce the problem, present the solution, and end with a strong closing statement. Use markdown headings.

Problem: ${problem}
Solution: ${solution}`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setResult(response.text);

            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate the pitch.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">AI Pitch Builder</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Define a problem and your solution, and let Gemini craft an elevator pitch for you.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="font-semibold text-sm text-brand-text">The Problem</label>
                    <textarea value={problem} onChange={e => setProblem(e.target.value)} rows={3} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
                 <div>
                    <label className="font-semibold text-sm text-brand-text">Your Solution</label>
                    <textarea value={solution} onChange={e => setSolution(e.target.value)} rows={3} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
            </div>
            
            <div className="text-center">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Generating...' : 'Build Pitch'}
                </button>
            </div>
            
            <AiOutputBlock
                content={result}
                isLoading={loading}
                error={error}
                title="Generated Elevator Pitch"
                containerClassName="mt-6"
            />
        </div>
    );
};

export default PitchBuilder;
