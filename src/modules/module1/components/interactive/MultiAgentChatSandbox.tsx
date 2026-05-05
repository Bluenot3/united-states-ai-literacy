import React, { useState, useEffect, useRef } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const agents = {
    Planner: { color: 'bg-blue-500', icon: '📝' },
    Researcher: { color: 'bg-green-500', icon: '🔍' },
    Writer: { color: 'bg-purple-500', icon: '✍️' },
    Critic: { color: 'bg-red-500', icon: '🧐' },
};

const script = [
    { agent: 'Planner', text: "Task received: 'Summarize the impact of AI on renewable energy.' I'll create a plan: 1. Research recent breakthroughs. 2. Identify key impact areas. 3. Draft a summary." },
    { agent: 'Researcher', text: "Executing step 1. Found articles on AI-optimized wind turbine placement and predictive maintenance for solar farms. Key impact areas: efficiency, cost reduction, and grid management." },
    { agent: 'Writer', text: "Drafting summary based on research. 'AI is revolutionizing renewable energy by optimizing turbine placement for up to 20% more efficiency and using predictive models to reduce solar farm maintenance costs...'" },
    { agent: 'Critic', text: "Critique: The summary is good but lacks specifics. Can we add a quantifiable metric for the cost reduction? And mention grid management." },
    { agent: 'Writer', text: "Revision: '...reducing solar farm maintenance costs by 15%. Furthermore, AI algorithms are crucial for managing grid stability by predicting energy supply and demand.'" },
    { agent: 'Planner', text: "All steps complete. Final output is ready." },
];


const MultiAgentChatSandbox: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [messages, setMessages] = useState<{ agent: string, text: string }[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const startSimulation = () => {
        setMessages([]);
        setIsPlaying(true);
        let i = 0;
        intervalRef.current = setInterval(() => {
            setMessages(prev => [...prev, script[i]]);
            i++;
            if (i >= script.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setIsPlaying(false);
                if (!hasCompleted) {
                    addPoints(1, 25);
                    updateModuleProgress(1, interactiveId, 'interactive');
                }
            }
        }, 2500);
    };

    const resetSimulation = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setMessages([]);
        setIsPlaying(false);
    }

    useEffect(() => {
        const container = messagesEndRef.current?.parentElement;
        if (container) container.scrollTop = container.scrollHeight;
    }, [messages]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    }, [])

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Multi-Agent Chat Sandbox</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Watch a simulated team of AI agents collaborate to complete a task.</p>

            <div className="h-80 p-3 bg-brand-bg rounded-lg shadow-neumorphic-in overflow-y-auto space-y-3 liquid-scrollbar">
                {messages.map((msg, index) => (
                    <div key={index} className="flex items-start gap-3 animate-fade-in">
                        <div className={`w-8 h-8 rounded-full ${agents[msg.agent].color} text-white flex items-center justify-center text-lg flex-shrink-0`}>{agents[msg.agent].icon}</div>
                        <div>
                            <p className="font-bold text-brand-text text-sm">{msg.agent}</p>
                            <div className="text-brand-text-light">{msg.text}</div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="text-center mt-4">
                <button onClick={isPlaying ? resetSimulation : startSimulation} className="px-6 py-2 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">
                    {isPlaying ? 'Stop' : messages.length > 0 ? 'Restart Simulation' : 'Start Simulation'}
                </button>
            </div>
        </div>
    );
};

export default MultiAgentChatSandbox;
