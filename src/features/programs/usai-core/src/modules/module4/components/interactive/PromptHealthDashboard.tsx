import React, { useState, useEffect } from 'react';
import type { InteractiveComponentProps } from '../../../../types';
import { useAuth } from '../../../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const prompts = [
    { id: 'prod-001', name: 'Product Description Generator' },
    { id: 'support-002', name: 'Customer Support Initial Response' },
    { id: 'marketing-003', name: 'Social Media Ad Copy' },
];

const PromptHealthDashboard: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);
    const [data, setData] = useState({ variance: 0, hallucination: 0, cost: 0 });
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const hasCompleted = user?.modules?.[4]?.completedInteractives.includes(interactiveId);

    const fetchData = () => {
        // Simulate fetching new data
        setData({
            variance: Math.random() * 25, // 0-25%
            hallucination: Math.random() * 10, // 0-10%
            cost: 0.01 + Math.random() * 0.05 // $0.01 - $0.06 per prompt
        });
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [selectedPrompt]);

    const getAnalysis = async () => {
        setLoading(true);
        setAnalysis('');
        const prompt = `You are an MLOps engineer analyzing a prompt's performance.
        
Prompt Name: "${selectedPrompt.name}"
Metrics:
- Output Variance: ${data.variance.toFixed(2)}%
- Hallucination Rate: ${data.hallucination.toFixed(2)}%
- Avg. Cost per Execution: $${data.cost.toFixed(4)}

Provide a brief, one-paragraph analysis. Is this prompt healthy? What is one recommendation for improvement?`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAnalysis(response.text);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setAnalysis('Failed to generate analysis.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg text-brand-text">Prompt Health Dashboard</h4>
                <select value={selectedPrompt.id} onChange={e => setSelectedPrompt(prompts.find(p => p.id === e.target.value)!)} className="p-2 bg-brand-bg rounded-lg shadow-neumorphic-out text-sm">
                    {prompts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in text-center">
                    <p className="text-sm text-brand-text-light">Output Variance</p>
                    <p className="text-3xl font-bold text-brand-primary">{data.variance.toFixed(2)}%</p>
                </div>
                <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in text-center">
                    <p className="text-sm text-brand-text-light">Hallucination Rate</p>
                    <p className="text-3xl font-bold text-pale-yellow">{data.hallucination.toFixed(2)}%</p>
                </div>
                <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in text-center">
                    <p className="text-sm text-brand-text-light">Avg. Cost / Call</p>
                    <p className="text-3xl font-bold text-pale-green">${data.cost.toFixed(4)}</p>
                </div>
            </div>
            
            <div className="text-center">
                <button onClick={getAnalysis} disabled={loading} className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon /> {loading ? 'Analyzing...' : 'Get AI Analysis'}
                </button>
            </div>
            
            {(loading || analysis) && (
                <div className="mt-4 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">Performance Analysis</h5>
                    {loading && <p className="animate-pulse">Generating report...</p>}
                    <p className="text-brand-text-light">{analysis}</p>
                </div>
            )}
        </div>
    );
};

export default PromptHealthDashboard;
