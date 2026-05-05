import React, { useState } from 'react';
import { getAiClient } from '../../services/aiService';
import { useAuth } from '../../hooks/useAuth';
import type { InteractiveComponentProps } from '../../types';

const scenarios = [
    {
        title: "The Autonomous Vehicle Dilemma",
        description: "An autonomous vehicle's brakes have failed. It can either continue straight and hit a group of 5 pedestrians, or swerve and hit a single person in the other lane. As the programmer, what do you instruct the car to do?",
        options: [ "Swerve to hit the single person.", "Continue straight, hitting the group." ]
    }
];

const EthicalDilemmaSimulator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const scenario = scenarios[0];
    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleChoice = async (choiceText: string) => {
        setLoading(true);
        setError(null);
        setAnalysis(null);

        const prompt = `A user is facing an ethical dilemma: "${scenario.description}". They chose to "${choiceText}". Analyze this choice from the perspectives of Utilitarianism and Deontology. Explain which framework their choice aligns with and why. Keep the analysis concise (2-3 sentences per framework) and easy for a beginner to understand.`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setAnalysis(response.text);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Could not fetch analysis.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setAnalysis(null);
        setError(null);
        setLoading(false);
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">{scenario.title}</h4>
            <p className="text-brand-text-light mb-6 text-center">{scenario.description}</p>

            {!analysis && !loading && !error && (
                <div className="flex flex-col md:flex-row justify-center gap-4">
                    {scenario.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleChoice(option)}
                            className="w-full md:w-1/2 p-4 rounded-lg text-left transition-all duration-200 shadow-neumorphic-out hover:shadow-neumorphic-in hover:text-brand-primary"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
            
            {(analysis || loading || error) && (
                <div className="animate-fade-in text-center">
                    <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                        <h5 className="font-semibold text-brand-text mb-2">AI Ethical Analysis</h5>
                        {loading && <p className="text-brand-text-light animate-pulse">Analyzing...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {analysis && <p className="text-brand-text-light text-left whitespace-pre-wrap">{analysis} {!hasCompleted && "\n\n+25 points!"}</p>}
                    </div>
                    <button onClick={handleReset} className="mt-4 px-6 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default EthicalDilemmaSimulator;