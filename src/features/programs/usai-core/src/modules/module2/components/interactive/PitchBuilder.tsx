import React, { useState } from 'react';
import { getAiClient } from '../../services/aiService';
import { useAuth } from '../../hooks/useAuth';
import type { InteractiveComponentProps } from '../../types';
import { SparklesIcon } from '../icons/SparklesIcon';

const STEPS = ['Problem', 'Solution', 'Audience'];

const PitchBuilder: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [step, setStep] = useState(0);
    const [pitch, setPitch] = useState({ problem: '', solution: '', audience: '' });
    const [isFinished, setIsFinished] = useState(false);
    const [refinedPitch, setRefinedPitch] = useState('');
    const [loading, setLoading] = useState(false);
    
    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPitch(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if(step < STEPS.length - 1) {
            setStep(step + 1);
        } else {
            setIsFinished(true);
        }
    };
    
    const handleRefine = async () => {
        setLoading(true);
        setRefinedPitch('');
        const prompt = `An entrepreneur has drafted an elevator pitch with the following components:
- Problem: ${pitch.problem}
- Solution: ${pitch.solution}
- Target Audience: ${pitch.audience}

Rewrite these points into a single, compelling, and concise paragraph. Make it flow naturally and sound professional.`;
        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setRefinedPitch(response.text);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (error) {
            console.error("Failed to refine pitch:", error);
            setRefinedPitch("Could not refine pitch at this time. Please try again later.");
        } finally {
            setLoading(false);
        }
    }


    const handleReset = () => {
        setStep(0);
        setPitch({ problem: '', solution: '', audience: '' });
        setIsFinished(false);
        setRefinedPitch('');
        setLoading(false);
    }
    
    if(isFinished) {
        return (
             <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
                <h4 className="font-bold text-xl text-brand-text mb-4">Your Elevator Pitch!</h4>
                <div className="space-y-4 text-brand-text-light p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <p><strong>The Problem:</strong> {pitch.problem || 'Not specified'}</p>
                    <p><strong>Our Solution:</strong> {pitch.solution || 'Not specified'}</p>
                    <p><strong>For:</strong> {pitch.audience || 'Not specified'}</p>
                </div>
                
                <div className="text-center my-6">
                    <button onClick={handleRefine} disabled={loading} className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-neumorphic-out hover:shadow-neumorphic-in transform hover:scale-95 disabled:opacity-50">
                        <SparklesIcon />
                        {loading ? 'Refining...' : 'Refine with AI'}
                    </button>
                </div>

                {refinedPitch && (
                    <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in animate-fade-in">
                        <h5 className="font-bold text-lg text-brand-text mb-2">AI-Refined Pitch {!hasCompleted && <span className="text-sm font-normal text-pale-green">(+25 points!)</span>}</h5>
                        <p className="text-brand-text-light">{refinedPitch}</p>
                    </div>
                )}

                <div className="text-center mt-6">
                    <button onClick={handleReset} className="px-6 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Start Over</button>
                </div>
            </div>
        )
    }

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-1">Step {step + 1}: Define the {STEPS[step]}</h4>
            <div className="w-full bg-brand-shadow-dark/20 h-1 rounded-full mb-6">
                <div className="bg-brand-primary h-1 rounded-full" style={{ width: `${((step + 1) / STEPS.length) * 100}%`}}></div>
            </div>
            
            <textarea
                name={STEPS[step].toLowerCase()}
                // @ts-ignore
                value={pitch[STEPS[step].toLowerCase()]}
                onChange={handleInputChange}
                rows={4}
                placeholder={`Briefly describe the ${STEPS[step]}...`}
                className="w-full p-4 bg-brand-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
            />

            <div className="text-right mt-4">
                <button 
                    onClick={nextStep}
                    className="bg-brand-primary text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-neumorphic-out hover:shadow-neumorphic-in transform hover:scale-95"
                >
                    {step < STEPS.length - 1 ? 'Next' : 'Finish'}
                </button>
            </div>
        </div>
    )

}

export default PitchBuilder;