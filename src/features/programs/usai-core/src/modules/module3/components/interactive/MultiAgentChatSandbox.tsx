import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

interface Message {
    agent: 'Planner' | 'Researcher' | 'Writer' | 'User';
    text: string;
}

const MultiAgentChatSandbox: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [task, setTask] = useState('Write a brief summary of the impact of quantum computing on AI.');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const runSimulation = async () => {
        if (!task.trim()) {
            setError('Please enter a task.');
            return;
        }
        setLoading(true);
        setError('');
        const conversation: Message[] = [{ agent: 'User', text: task }];
        setMessages(conversation);

        try {
            const ai = await getAiClient();
            
            // Planner Agent
            let history = `Task: ${task}`;
            const plannerResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `You are a Planner Agent. Break this task down into simple steps for other agents.\n${history}` });
            const plan = plannerResponse.text;
            conversation.push({ agent: 'Planner', text: plan });
            setMessages([...conversation]);
            history += `\nPlanner: ${plan}`;
            
            // Researcher Agent
            const researcherResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `You are a Researcher Agent. Execute the research steps from the plan.\n${history}` });
            const research = researcherResponse.text;
            conversation.push({ agent: 'Researcher', text: research });
            setMessages([...conversation]);
            history += `\nResearcher: ${research}`;

            // Writer Agent
            const writerResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `You are a Writer Agent. Synthesize the research into a final answer.\n${history}` });
            const final = writerResponse.text;
            conversation.push({ agent: 'Writer', text: final });
            setMessages([...conversation]);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }

        } catch (e) {
            console.error(e);
            setError('The simulation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getAgentStyle = (agent: Message['agent']) => {
        switch (agent) {
            case 'User': return 'border-brand-primary';
            case 'Planner': return 'border-pale-purple';
            case 'Researcher': return 'border-pale-yellow';
            case 'Writer': return 'border-pale-green';
            default: return 'border-gray-400';
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Multi-Agent Chat Sandbox</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Give the AI agents a task and watch them collaborate to complete it.</p>
            
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                    type="text"
                    value={task}
                    onChange={e => setTask(e.target.value)}
                    placeholder="Enter a task..."
                    className="flex-grow w-full px-4 py-3 bg-brand-bg rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
                />
                <button onClick={runSimulation} disabled={loading} className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Running...' : 'Run Simulation'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}

            <div className="mt-6 space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`p-4 bg-brand-bg rounded-lg shadow-neumorphic-out border-l-4 ${getAgentStyle(msg.agent)} animate-fade-in`}>
                        <h5 className="font-bold text-sm text-brand-text">{msg.agent}</h5>
                        <p className="text-brand-text-light whitespace-pre-wrap">{msg.text}</p>
                    </div>
                ))}
                 {loading && messages.length > 0 && <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-out animate-pulse h-16"></div>}
            </div>
        </div>
    );
};

export default MultiAgentChatSandbox;