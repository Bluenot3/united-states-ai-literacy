import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const sectors = ['Healthcare', 'Software Development', 'Customer Service', 'Creative Arts', 'Manufacturing'];

const JobImpactSimulator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [adoption, setAdoption] = useState(50); // 0-100%
    const [sector, setSector] = useState('Software Development');
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleAnalyze = async () => {
        setLoading(true);
        setError('');
        setAnalysis('');

        const prompt = `You are a workforce analyst. Analyze the potential impact of AI on the "${sector}" sector, assuming a ${adoption}% adoption rate of current AI technologies over the next 5 years.
Provide a brief analysis covering:
1.  Tasks likely to be automated or displaced.
2.  Tasks likely to be augmented or enhanced.
3.  New roles or skills that might emerge.
Keep the analysis concise and balanced.`;

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
            setError('Failed to generate analysis.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Global Job Impact Simulator</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-center text-brand-text-light mb-2">AI Adoption Rate: <span className="font-bold text-brand-text">{adoption}%</span></label>
                    <input type="range" min="0" max="100" value={adoption} onChange={e => setAdoption(Number(e.target.value))} className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in"/>
                </div>
                 <div>
                    <label className="block text-center text-brand-text-light mb-2">Select Sector</label>
                    <select value={sector} onChange={e => setSector(e.target.value)} className="w-full p-3 bg-brand-bg rounded-lg shadow-neumorphic-in focus:outline-none">
                        {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

             <div className="text-center">
                 <button onClick={handleAnalyze} disabled={loading} className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Analyzing...' : 'Analyze Impact'}
                </button>
            </div>
            
             {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || analysis) && (
                <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">AI Impact Analysis for {sector}</h5>
                    {loading && <p className="animate-pulse">Generating...</p>}
                    <pre className="text-brand-text-light whitespace-pre-wrap font-sans">{analysis}</pre>
                </div>
            )}
        </div>
    );
};

export default JobImpactSimulator;