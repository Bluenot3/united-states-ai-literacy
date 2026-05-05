
import React, { useState, useEffect, useRef } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { UserIcon } from '../icons/UserIcon';
import { BotIcon } from '../icons/BotIcon';

type AgentRole = 'Planner' | 'Researcher' | 'Writer' | 'Critic' | 'Integrator' | 'User';

interface AgentMessage {
    id: string;
    role: AgentRole;
    content: string;
    timestamp: number;
}

interface AgentState {
    role: AgentRole;
    status: 'idle' | 'thinking' | 'writing' | 'waiting';
    description: string;
    color: string;
}

const AGENTS: Record<string, AgentState> = {
    Planner: { role: 'Planner', status: 'idle', description: 'Decomposes goals & assigns tasks', color: 'bg-blue-500' },
    Researcher: { role: 'Researcher', status: 'idle', description: 'Gathers data & citations', color: 'bg-green-500' },
    Writer: { role: 'Writer', status: 'idle', description: 'Drafts content & code', color: 'bg-purple-500' },
    Critic: { role: 'Critic', status: 'idle', description: 'Reviews for errors & logic', color: 'bg-red-500' },
    Integrator: { role: 'Integrator', status: 'idle', description: 'Merges & finalizes output', color: 'bg-yellow-500' },
};

const MultiAgentChatSandbox: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [task, setTask] = useState('Write a brief summary of the impact of quantum computing on AI.');
    const [messages, setMessages] = useState<AgentMessage[]>([]);
    const [agents, setAgents] = useState<Record<string, AgentState>>(AGENTS);
    const [isRunning, setIsRunning] = useState(false);
    const [sharedMemory, setSharedMemory] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const updateAgentStatus = (role: AgentRole, status: AgentState['status']) => {
        setAgents(prev => ({
            ...prev,
            [role]: { ...prev[role], status }
        }));
    };

    const addMessage = (role: AgentRole, content: string) => {
        setMessages(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            role,
            content,
            timestamp: Date.now()
        }]);
    };

    const runSimulation = async () => {
        if (!task.trim() || isRunning) return;
        
        setIsRunning(true);
        setMessages([]);
        setSharedMemory([]);
        addMessage('User', task);

        try {
            const ai = await getAiClient();
            const model = 'gemini-2.5-flash';

            // 1. Planner
            updateAgentStatus('Planner', 'thinking');
            await new Promise(r => setTimeout(r, 800));
            
            const plannerPrompt = `You are a Planner Agent in a multi-agent system. 
            User Goal: "${task}"
            
            Break this down into 3 specific steps for a Researcher, Writer, and Critic. 
            Keep it concise (bullet points).`;
            
            const plannerRes = await ai.models.generateContent({ model, contents: plannerPrompt });
            const plan = plannerRes.text;
            
            updateAgentStatus('Planner', 'idle');
            addMessage('Planner', plan);
            setSharedMemory(prev => [...prev, "PLAN ESTABLISHED"]);
            
            // 2. Researcher
            updateAgentStatus('Researcher', 'thinking');
            await new Promise(r => setTimeout(r, 1000));
            
            const researchPrompt = `You are a Researcher Agent. 
            Plan: ${plan}
            
            Simulate gathering 3 key facts or pieces of evidence relevant to this plan. 
            Format as a list of findings.`;
            
            const researchRes = await ai.models.generateContent({ model, contents: researchPrompt });
            const research = researchRes.text;
            
            updateAgentStatus('Researcher', 'idle');
            addMessage('Researcher', research);
            setSharedMemory(prev => [...prev, "DATA GATHERED"]);

            // 3. Writer
            updateAgentStatus('Writer', 'writing');
            await new Promise(r => setTimeout(r, 1200));
            
            const writerPrompt = `You are a Writer Agent.
            Plan: ${plan}
            Research: ${research}
            
            Draft a short paragraph (3-4 sentences) synthesizing this information.`;
            
            const writerRes = await ai.models.generateContent({ model, contents: writerPrompt });
            const draft = writerRes.text;
            
            updateAgentStatus('Writer', 'idle');
            addMessage('Writer', draft);
            setSharedMemory(prev => [...prev, "DRAFT V1 CREATED"]);

            // 4. Critic
            updateAgentStatus('Critic', 'thinking');
            await new Promise(r => setTimeout(r, 1000));
            
            const criticPrompt = `You are a Critic Agent.
            Draft: "${draft}"
            
            Identify one potential issue, missing nuance, or area for improvement. Be constructive but sharp.`;
            
            const criticRes = await ai.models.generateContent({ model, contents: criticPrompt });
            const critique = criticRes.text;
            
            updateAgentStatus('Critic', 'idle');
            addMessage('Critic', critique);
            setSharedMemory(prev => [...prev, "CRITIQUE LOGGED"]);

            // 5. Integrator
            updateAgentStatus('Integrator', 'writing');
            await new Promise(r => setTimeout(r, 1000));
            
            const integratorPrompt = `You are an Integrator Agent.
            Draft: "${draft}"
            Critique: "${critique}"
            
            Produce the final, polished output that incorporates the critique.`;
            
            const integratorRes = await ai.models.generateContent({ model, contents: integratorPrompt });
            const final = integratorRes.text;
            
            updateAgentStatus('Integrator', 'idle');
            addMessage('Integrator', final);
            setSharedMemory(prev => [...prev, "FINAL OUTPUT RELEASED"]);

            if (!hasCompleted) {
                addPoints(30);
                updateProgress(interactiveId, 'interactive');
            }

        } catch (e) {
            console.error(e);
            addMessage('User', 'System Error: Agent communication breakdown.');
        } finally {
            setIsRunning(false);
            Object.keys(AGENTS).forEach(role => updateAgentStatus(role as AgentRole, 'idle'));
        }
    };

    return (
        <div className="my-10 p-1 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 shadow-neumorphic-out border border-white/60 backdrop-blur-md">
            <div className="bg-brand-bg/95 rounded-[22px] p-6 md:p-8">
                
                {/* Header */}
                <div className="mb-8">
                    <h4 className="font-bold text-2xl text-brand-text flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <SparklesIcon />
                        </div>
                        Team Matrix: Multi-Agent Simulator
                    </h4>
                    <p className="text-brand-text-light mt-1 text-sm">Assign a complex goal and watch the digital organization collaborate, critique, and execute.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Visual Matrix (Left) */}
                    <div className="lg:w-1/3 flex flex-col gap-4">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-center">Active Agents</h5>
                            <div className="space-y-3">
                                {(Object.values(agents) as AgentState[]).map((agent) => (
                                    <div key={agent.role} className={`
                                        flex items-center gap-3 p-3 rounded-xl border transition-all duration-300
                                        ${agent.status !== 'idle' ? 'bg-white shadow-md border-brand-primary/30 scale-105' : 'bg-gray-50 border-transparent opacity-80'}
                                    `}>
                                        <div className={`w-3 h-3 rounded-full ${agent.color} ${agent.status !== 'idle' ? 'animate-pulse' : ''}`}></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-sm text-brand-text">{agent.role}</span>
                                                {agent.status !== 'idle' && <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded font-bold uppercase">{agent.status}</span>}
                                            </div>
                                            <div className="text-[10px] text-gray-500 leading-tight">{agent.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shared Memory State */}
                        <div className="bg-slate-900 rounded-2xl p-4 shadow-inner">
                            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">Shared Memory / Workspace</h5>
                            <div className="space-y-1.5">
                                {sharedMemory.length === 0 ? (
                                    <p className="text-slate-600 text-xs text-center italic">Empty</p>
                                ) : (
                                    sharedMemory.map((item, i) => (
                                        <div key={i} className="text-[10px] font-mono text-green-400 flex gap-2 animate-fade-in">
                                            <span className="opacity-50">0x{i}</span>
                                            <span>{item}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chat Stream (Right) */}
                    <div className="lg:w-2/3 flex flex-col h-[500px]">
                        <div className="flex-1 bg-white rounded-t-2xl border border-gray-200 overflow-y-auto p-6 space-y-6 liquid-scrollbar shadow-inner" ref={scrollRef}>
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                                    <div className="mb-4 grayscale">
                                        <BotIcon />
                                    </div>
                                    <p>Ready to initialize team...</p>
                                </div>
                            )}
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-4 ${msg.role === 'User' ? 'flex-row-reverse' : ''} animate-fade-in`}>
                                    <div className="flex-shrink-0 mt-1">
                                        {msg.role === 'User' ? (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><UserIcon /></div>
                                        ) : (
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${agents[msg.role as AgentRole]?.color || 'bg-gray-400'}`}>
                                                {msg.role[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`flex flex-col max-w-[80%] ${msg.role === 'User' ? 'items-end' : 'items-start'}`}>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">{msg.role}</span>
                                        <div className={`
                                            p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                                            ${msg.role === 'User' ? 'bg-brand-primary text-white rounded-tr-none' : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-none'}
                                        `}>
                                            {msg.role === 'Planner' || msg.role === 'Researcher' ? (
                                                <div className="whitespace-pre-wrap">{msg.content}</div>
                                            ) : (
                                                msg.content
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isRunning && (
                                <div className="flex items-center gap-2 text-xs text-gray-400 animate-pulse pl-12">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                    <span>Team is collaborating...</span>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="bg-gray-50 p-4 rounded-b-2xl border-x border-b border-gray-200 flex gap-3">
                            <input 
                                type="text" 
                                value={task} 
                                onChange={(e) => setTask(e.target.value)}
                                placeholder="Give the team a goal..."
                                disabled={isRunning}
                                className="flex-grow px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm shadow-sm disabled:opacity-60"
                                onKeyPress={(e) => e.key === 'Enter' && runSimulation()}
                            />
                            <button 
                                onClick={runSimulation} 
                                disabled={isRunning || !task.trim()}
                                className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2 whitespace-nowrap"
                            >
                                {isRunning ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <SparklesIcon />}
                                Activate Team
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiAgentChatSandbox;
