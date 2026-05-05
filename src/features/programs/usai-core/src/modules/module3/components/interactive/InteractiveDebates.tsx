
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const topics = {
    'co-author': 'Should an AI be listed as a co-author on a research paper?',
    'plagiarism': 'When does AI-assisted creation cross the line from inspiration to plagiarism?',
    'extinct-languages': 'Can synthetic voices preserve extinct languages ethically?'
};

type TopicKey = keyof typeof topics;

const InteractiveDebates: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [topic, setTopic] = useState<TopicKey>('co-author');
    const [stance, setStance] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleDebate = async (userStance: 'Agree' | 'Disagree') => {
        setStance(userStance);
        setLoading(true);
        setError('');
        setResponse('');

        const apiPrompt = `You are a neutral debate moderator facilitating a Socratic dialogue.
        
Topic: "${topics[topic]}"
User's Stance: They ${userStance} with the idea.

Provide a thoughtful, balanced counter-argument to the user's position. Your goal is not to win, but to make them think critically about the other side of the issue. Start your response with "An interesting perspective. However, have you considered...".`;

        try {
            const ai = await getAiClient();
            const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: apiPrompt });
            setResponse(result.text);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate a counter-argument.');
        } finally {
            setLoading(false);
        }
    };
    
    const resetDebate = () => {
        setStance('');
        setResponse('');
        setError('');
    }

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Socratic Debates on AI Ethics</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Choose a topic, take a stance, and Gemini will provide a counter-argument to challenge your perspective.</p>
            
            <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in text-center mb-4">
                 <select value={topic} onChange={e => setTopic(e.target.value as TopicKey)} className="w-full max-w-md p-2 bg-brand-bg rounded-lg shadow-neumorphic-out focus:outline-none mb-2">
                    {Object.entries(topics).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                </select>

                {!stance && !loading && (
                    <div className="flex justify-center gap-4 mt-2">
                        <button onClick={() => handleDebate('Agree')} className="px-6 py-2 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in bg-pale-green/20">Agree</button>
                        <button onClick={() => handleDebate('Disagree')} className="px-6 py-2 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in bg-red-500/10">Disagree</button>
                    </div>
                )}
            </div>
            
            {(loading || response) && (
                 <div className="mt-4 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">Gemini's Counter-Argument</h5>
                    {loading && <p className="animate-pulse">...</p>}
                    <p className="text-brand-text-light">{response}</p>
                    {!loading && <button onClick={resetDebate} className="text-xs font-semibold text-brand-primary hover:underline mt-2">Choose another topic</button>}
                </div>
            )}
        </div>
    );
};

export default InteractiveDebates;
