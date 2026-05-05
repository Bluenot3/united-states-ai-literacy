import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import AiOutputBlock from '../AiOutputBlock';

const topics = [
    'Should AI be regulated?',
    'Will AI lead to mass job displacement?',
    'Is open-sourcing powerful AI models dangerous?'
];

const InteractiveDebates: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [topic, setTopic] = useState(topics[0]);
    const [stance, setStance] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleDebate = async () => {
        if (!stance.trim()) {
            setError('Please state your stance on the topic.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const prompt = `You are a skilled debater. The debate topic is: "${topic}". The user's stance is: "${stance}". 
Present a strong, logical, and respectful counter-argument to the user's stance.`;

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
            setError('Failed to generate a counter-argument.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Interactive Debates</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Choose a topic, state your position, and Gemini will provide a counter-argument.</p>

            <div className="space-y-4">
                <div>
                    <label className="font-semibold text-sm text-brand-text">Debate Topic</label>
                    <select value={topic} onChange={e => setTopic(e.target.value)} className="w-full mt-1 p-3 bg-brand-bg rounded-lg shadow-neumorphic-in">
                        {topics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="font-semibold text-sm text-brand-text">Your Stance</label>
                    <textarea value={stance} onChange={e => setStance(e.target.value)} rows={3} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in" placeholder="e.g., I believe strong regulation is necessary to prevent misuse..."/>
                </div>
            </div>
            
            <div className="text-center mt-4">
                 <button onClick={handleDebate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Thinking...' : 'Generate Counter-Argument'}
                </button>
            </div>
            
             <AiOutputBlock
                content={result}
                isLoading={loading}
                error={error}
                title="Gemini's Counter-Argument"
                containerClassName="mt-6"
            />
        </div>
    );
};

export default InteractiveDebates;
