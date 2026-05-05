import React, { useState } from 'react';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const SLOPE = 8;
const INTERCEPT = 15;
const NOISE_LEVEL = 15;

const generateData = () => Array.from({ length: 30 }, () => {
    const x = Math.random() * 10;
    const y = SLOPE * x + INTERCEPT + (Math.random() - 0.5) * NOISE_LEVEL;
    return { x, y: Math.max(0, Math.min(100, y)) };
});

const SimplePredictiveModel: React.FC = () => {
    const [hours, setHours] = useState(5);
    const [data] = useState(generateData);
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const score = SLOPE * hours + INTERCEPT;

    const getAnalysis = async () => {
        setLoading(true);
        setAnalysis('');
        const prompt = `A user is looking at a scatter plot showing a positive correlation between "Hours Studied" and "Test Score". Explain this relationship in simple terms. Cover three key points:
1. What positive correlation means here.
2. Why correlation does not equal causation (mention a potential confounding variable like "prior knowledge").
3. How a predictive model uses this correlation to make estimations.`;
        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAnalysis(response.text);
        } catch (e) {
            console.error(e);
            setAnalysis('Could not load analysis. The key takeaway is that while more study time is associated with higher scores, other factors can also play a role.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Correlation Explorer: Study vs. Score</h4>
            
            <div className="relative w-full max-w-xl mx-auto aspect-video mb-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                {data.map((point, index) => (
                    <div key={index} className="absolute w-2 h-2 bg-brand-primary/40 rounded-full" style={{ left: `${point.x * 10}%`, bottom: `${point.y}%`}}></div>
                ))}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1={100 - INTERCEPT} x2="100" y2={100 - (SLOPE * 10 + INTERCEPT)} stroke="#F472B6" strokeWidth="1" strokeDasharray="2,2"/>
                </svg>
                 <div className="absolute w-4 h-4 bg-brand-secondary rounded-full border-2 border-white shadow-lg" style={{ left: `${hours * 10}%`, bottom: `${score}%`, transform: 'translate(-50%, 50%)'}}></div>
            </div>

            <div className="flex flex-col items-center gap-6">
                <div className="w-full max-w-sm">
                    <label htmlFor="study-hours" className="block text-center text-brand-text-light mb-2">Hours Studied: <span className="font-bold text-brand-text">{hours}</span></label>
                    <input
                        id="study-hours"
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={hours}
                        onChange={(e) => setHours(parseFloat(e.target.value))}
                        className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in"
                    />
                </div>
                <div className="text-center p-6 bg-brand-bg rounded-full shadow-neumorphic-out w-48 h-48 flex flex-col justify-center items-center">
                    <p className="text-brand-text-light text-sm">Predicted Score</p>
                    <p className="font-extrabold text-5xl text-brand-primary">{Math.round(score)}%</p>
                </div>
            </div>

            <div className="text-center mt-6">
                <button onClick={getAnalysis} disabled={loading} className="inline-flex items-center gap-2 bg-brand-bg text-brand-primary font-bold py-2 px-4 rounded-full text-sm shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon/> {loading ? 'Analyzing...' : 'Get AI Analysis'}
                </button>
            </div>
            
            {(loading || analysis) && (
                <div className="mt-4 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">Correlation Analysis</h5>
                    {loading ? <p className="animate-pulse">Loading analysis...</p> : <pre className="text-brand-text-light whitespace-pre-wrap font-sans">{analysis}</pre>}
                </div>
            )}
        </div>
    );
};

export default SimplePredictiveModel;