import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
// FIX: Add import for AiOutputBlock
import AiOutputBlock from '../AiOutputBlock';

const DataDecisionFlowchartBuilder: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [goal, setGoal] = useState('Decide whether to approve a loan application');
    const [dataPoints, setDataPoints] = useState('Credit score, income, debt-to-income ratio, employment history');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!goal.trim() || !dataPoints.trim()) {
            setError('Please fill all fields.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const prompt = `You are a data scientist designing a decision-making model. Based on the goal and available data points, describe a logical flowchart or series of steps to reach a decision. Use markdown with a numbered list to outline the flow.

Goal: ${goal}
Available Data: ${dataPoints}`;

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
            setError('Failed to generate flowchart logic.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Data Decision Flowchart Builder</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Define a goal and the data you have, and Gemini will create a logical decision flow.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="font-semibold text-sm text-brand-text">Goal</label>
                    <input type="text" value={goal} onChange={e => setGoal(e.target.value)} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
                 <div>
                    <label className="font-semibold text-sm text-brand-text">Available Data Points (comma-separated)</label>
                    <input type="text" value={dataPoints} onChange={e => setDataPoints(e.target.value)} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
            </div>
            
            <div className="text-center">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Building Flow...' : 'Build Decision Flow'}
                </button>
            </div>
            
            <AiOutputBlock
                content={result}
                isLoading={loading}
                error={error}
                title="Generated Decision Flow"
                containerClassName="mt-6"
            />
        </div>
    );
};

export default DataDecisionFlowchartBuilder;