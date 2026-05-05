import React, { useState } from 'react';
import { getAiClient } from '../../services/aiService';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const scenarios = [
    { id: 1, text: 'Benevolent Assistant' },
    { id: 2, text: 'Mass Job Displacement' },
    { id: 3, text: 'Uncontrollable Superintelligence' },
    { id: 4, text: 'A Tool with Limited Impact' },
];

const FutureScenarioPoll: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [voted, setVoted] = useState(false);

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleVote = async (scenarioText: string) => {
        setLoading(true);
        setVoted(true);
        setResult('');

        const prompt = `You are a creative writer from the future. Write a short, fictional news headline or social media post from a future where "AI as a ${scenarioText}" has become the reality.`;
        
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
            setResult('Error generating future news. It seems the timeline is unstable!');
        } finally {
            setLoading(false);
        }
    };
    
    const handleReset = () => {
        setVoted(false);
        setResult('');
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-center text-brand-text mb-4">What is AI's most likely future?</h4>
            {!voted ? (
                <div className="space-y-3">
                    {scenarios.map(scenario => (
                        <button
                            key={scenario.id}
                            onClick={() => handleVote(scenario.text)}
                            className="w-full p-4 rounded-lg text-left transition-all duration-200 shadow-neumorphic-out hover:shadow-neumorphic-in hover:text-brand-primary"
                        >
                            {scenario.text}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="animate-fade-in text-center p-4 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[150px] flex flex-col justify-center">
                    <h5 className="font-semibold text-brand-text mb-2">A Glimpse from the Future...</h5>
                    {loading ? (
                        <p className="animate-pulse">Contacting timeline...</p>
                    ) : (
                        <p className="text-xl italic text-brand-primary">"{result}"</p>
                    )}
                     <div className="text-center mt-6">
                        <button onClick={handleReset} className="px-4 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Vote Again</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FutureScenarioPoll;