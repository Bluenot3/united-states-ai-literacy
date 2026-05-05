import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const models = {
    'gemini-2.5-flash': { inputCost: 0.0001, outputCost: 0.0002 }, // per 1k tokens (example pricing)
    'gemini-2.5-pro': { inputCost: 0.001, outputCost: 0.002 }, // per 1k tokens (example pricing)
};

const TokenEconomySimulator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [model, setModel] = useState<keyof typeof models>('gemini-2.5-flash');
    const [queries, setQueries] = useState(1000);
    const [avgInput, setAvgInput] = useState(500);
    const [avgOutput, setAvgOutput] = useState(150);
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const cost = (queries * ( (avgInput / 1000 * models[model].inputCost) + (avgOutput / 1000 * models[model].outputCost) )).toFixed(2);

    const handleAnalyze = async () => {
        setLoading(true);
        setAnalysis('');
        const prompt = `Analyze the cost-effectiveness of the following API usage scenario:
- Model: ${model}
- Number of Queries: ${queries}
- Average Input Tokens: ${avgInput}
- Average Output Tokens: ${avgOutput}
- Estimated Cost: $${cost}

Briefly explain the trade-offs (e.g., cost vs. capability) of using this model for this task volume. Is this model choice likely cost-effective?`;
        
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
            setAnalysis('Could not generate analysis at this time.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Token Economy Simulator</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">Model</label>
                        <select value={model} onChange={e => setModel(e.target.value as keyof typeof models)} className="w-full p-3 bg-brand-bg rounded-lg shadow-neumorphic-in focus:outline-none">
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Faster, Cheaper)</option>
                            <option value="gemini-2.5-pro">Gemini 2.5 Pro (Smarter, Costlier)</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">Number of Queries: {queries.toLocaleString()}</label>
                        <input type="range" min="100" max="100000" step="100" value={queries} onChange={e => setQueries(Number(e.target.value))} className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">Avg. Input Tokens: {avgInput}</label>
                         <input type="range" min="50" max="2000" step="50" value={avgInput} onChange={e => setAvgInput(Number(e.target.value))} className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in" />
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">Avg. Output Tokens: {avgOutput}</label>
                         <input type="range" min="50" max="2000" step="50" value={avgOutput} onChange={e => setAvgOutput(Number(e.target.value))} className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in" />
                    </div>
                </div>

                <div className="text-center p-6 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <p className="text-brand-text-light">Estimated Monthly Cost</p>
                    <p className="text-5xl font-extrabold text-brand-primary my-2">${cost}</p>
                    <button onClick={handleAnalyze} disabled={loading} className="inline-flex mt-4 items-center gap-2 bg-brand-bg text-brand-primary font-bold py-2 px-4 rounded-full text-sm shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                        <SparklesIcon />
                        {loading ? 'Analyzing...' : 'Get AI Analysis'}
                    </button>
                </div>
            </div>
            {(loading || analysis) && (
                <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">Cost-Effectiveness Analysis</h5>
                     {loading && !analysis && <p className="animate-pulse">Generating...</p>}
                    <p className="text-brand-text-light">{analysis}</p>
                </div>
            )}
        </div>
    );
};

export default TokenEconomySimulator;