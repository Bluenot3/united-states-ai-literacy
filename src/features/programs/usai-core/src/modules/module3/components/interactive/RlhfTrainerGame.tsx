import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

type Classification = 'True Positive' | 'False Positive' | 'True Negative' | 'False Negative';

type Scenario = {
    id: number;
    text: string;
    actual: 'Positive';
    predicted: 'Positive';
    answer: 'True Positive';
    context: string;
} | {
    id: number;
    text: string;
    actual: 'Negative';
    predicted: 'Positive';
    answer: 'False Positive';
    context: string;
} | {
    id: number;
    text: string;
    actual: 'Negative';
    predicted: 'Negative';
    answer: 'True Negative';
    context: string;
} | {
    id: number;
    text: string;
    actual: 'Positive';
    predicted: 'Negative';
    answer: 'False Negative';
    context: string;
};


// FIX: Declare the scenarios array with an explicit type before sorting.
// This allows TypeScript to correctly validate the literal types (e.g., 'Positive')
// against the `Scenario` union type, resolving the type assignment error.
const scenariosData: Scenario[] = [
    { id: 1, text: "An email is spam (Actual: Positive) and the model flags it as spam (Predicted: Positive).", actual: 'Positive', predicted: 'Positive', answer: 'True Positive', context: 'spam filtering' },
    { id: 2, text: "An email is important (Actual: Negative) but the model flags it as spam (Predicted: Positive).", actual: 'Negative', predicted: 'Positive', answer: 'False Positive', context: 'spam filtering' },
    { id: 3, text: "A medical scan is healthy (Actual: Negative) and the model classifies it as healthy (Predicted: Negative).", actual: 'Negative', predicted: 'Negative', answer: 'True Negative', context: 'medical diagnosis' },
    { id: 4, text: "A medical scan shows a tumor (Actual: Positive) but the model classifies it as healthy (Predicted: Negative).", actual: 'Positive', predicted: 'Negative', answer: 'False Negative', context: 'medical diagnosis' },
];

const scenarios: Scenario[] = [...scenariosData].sort(() => Math.random() - 0.5);

const ConfusionMatrixLab: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [round, setRound] = useState(0);
    const [matrix, setMatrix] = useState({ 'True Positive': 0, 'False Positive': 0, 'True Negative': 0, 'False Negative': 0 });
    const [feedback, setFeedback] = useState('');
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    
    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleChoice = (choice: Classification) => {
        if (feedback) return;

        if (choice === scenarios[round].answer) {
            setFeedback('Correct!');
            setMatrix(prev => ({ ...prev, [choice]: prev[choice] + 1 }));
        } else {
            setFeedback(`Not quite! That scenario is a ${scenarios[round].answer}.`);
        }
    };
    
    const getExplanation = async () => {
        setLoading(true);
        setExplanation('');
        const scenario = scenarios[round];
        const prompt = `For a machine learning model used in ${scenario.context}, explain the real-world consequences of a "${scenario.answer}". Keep the explanation concise and easy for a beginner to understand.`;
        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setExplanation(response.text);
        } catch(e) {
            setExplanation("Could not load explanation.");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setExplanation('');
        if (round < scenarios.length - 1) {
            setRound(prev => prev + 1);
            setFeedback('');
        } else {
            setIsFinished(true);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        }
    }

    if (isFinished) {
        return (
             <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out text-center">
                 <h4 className="font-bold text-xl text-brand-text mb-4">Lab Complete!</h4>
                 <p className="text-lg text-brand-text-light">You've successfully categorized all scenarios.</p>
                 {!hasCompleted && <p className="font-semibold text-pale-green mt-2">You earned 25 points!</p>}
             </div>
        )
    }

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Confusion Matrix Lab</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Classify the scenario below to populate the confusion matrix.</p>
            
            <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in text-center mb-4">
                <p className="text-brand-text-light text-sm">Scenario {round + 1}/{scenarios.length}:</p>
                <p className="font-semibold text-brand-text">{scenarios[round].text}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                    <div className="grid grid-cols-2 gap-3">
                        {(Object.keys(matrix) as Classification[]).map(key => (
                             <button 
                                key={key}
                                onClick={() => handleChoice(key)}
                                disabled={!!feedback}
                                className="p-4 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50"
                             >
                                 {key}
                            </button>
                        ))}
                    </div>
                     {feedback && (
                        <div className="text-center mt-4">
                            <p className="font-semibold">{feedback}</p>
                            <div className="flex items-center justify-center gap-4 mt-2">
                                <button onClick={getExplanation} disabled={loading} className="text-sm font-semibold text-brand-primary inline-flex items-center gap-1"><SparklesIcon/> Explain Consequences</button>
                                <button onClick={handleNext} className="px-4 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">
                                    {round < scenarios.length - 1 ? 'Next Scenario' : 'Finish'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-2 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <div className="grid grid-cols-2 gap-px bg-brand-shadow-dark/20">
                        <div className="bg-brand-bg p-3 text-center"><span className="font-bold">TP:</span> <span className="text-2xl font-extrabold text-pale-green">{matrix['True Positive']}</span></div>
                        <div className="bg-brand-bg p-3 text-center"><span className="font-bold">FP:</span> <span className="text-2xl font-extrabold text-red-500">{matrix['False Positive']}</span></div>
                        <div className="bg-brand-bg p-3 text-center"><span className="font-bold">FN:</span> <span className="text-2xl font-extrabold text-red-500">{matrix['False Negative']}</span></div>
                        <div className="bg-brand-bg p-3 text-center"><span className="font-bold">TN:</span> <span className="text-2xl font-extrabold text-pale-green">{matrix['True Negative']}</span></div>
                    </div>
                </div>
            </div>
             {(loading || explanation) && (
                <div className="mt-4 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    {loading ? <p className="animate-pulse">Loading explanation...</p> : <pre className="text-sm whitespace-pre-wrap font-sans text-brand-text-light">{explanation}</pre>}
                </div>
             )}
        </div>
    );
};

export default ConfusionMatrixLab;