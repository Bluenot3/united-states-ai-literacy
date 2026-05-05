
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { InteractiveComponentProps } from '../../types';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Type } from '@google/genai';

interface Task {
    id: string;
    title: string;
    type: 'Cognitive' | 'Creative' | 'Physical' | 'Reflective' | 'Restorative';
    duration: number; // minutes
    reasoning: string;
    status: 'pending' | 'active' | 'completed';
}

const PRESETS = [
    "Build my optimized daily schedule for deep work.",
    "Plan a product launch event.",
    "Create a study plan for learning Quantum Computing.",
];

const SchedulePlanner: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [goal, setGoal] = useState(PRESETS[0]);
    const [plan, setPlan] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const generatePlan = async () => {
        if (!goal.trim()) return;
        setLoading(true);
        setPlan([]);
        setLogs(['Initializing Goal Interpreter...', 'Extracting constraints...', 'Identifying dependencies...']);
        setSelectedTask(null);

        const prompt = `You are an autonomous agent planning engine. 
        GOAL: "${goal}"
        
        Decompose this goal into 5-7 sequential subtasks.
        For each task, assign a category: 'Cognitive' (hard thinking), 'Creative' (generative), 'Physical' (movement), 'Reflective' (review), or 'Restorative' (break).
        Provide a brief "reasoning" for why this task exists and why it is placed in this order (e.g., "Cognitive load is high, needs breaks").
        
        Return a JSON array of objects with keys: title, type, duration (mins), reasoning.`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                type: { type: Type.STRING, enum: ['Cognitive', 'Creative', 'Physical', 'Reflective', 'Restorative'] },
                                duration: { type: Type.NUMBER },
                                reasoning: { type: Type.STRING }
                            }
                        }
                    }
                }
            });

            const rawTasks = JSON.parse(response.text);
            const tasks: Task[] = rawTasks.map((t: any, i: number) => ({
                id: `task-${i}`,
                ...t,
                status: 'pending'
            }));

            setPlan(tasks);
            setLogs(prev => [...prev, 'Plan generated successfully.', 'Awaiting execution command.']);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }

        } catch (e) {
            console.error(e);
            setLogs(prev => [...prev, 'Error: Failed to generate plan. Agent cognitive overload.']);
        } finally {
            setLoading(false);
        }
    };

    const runSimulation = async () => {
        if (plan.length === 0) return;
        setIsSimulating(true);
        setLogs(prev => [...prev, '--- STARTING AUTONOMY LOOP ---']);

        for (let i = 0; i < plan.length; i++) {
            setPlan(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'active' } : t));
            setLogs(prev => [...prev, `> Engaging: ${plan[i].title} (${plan[i].type})`]);

            // Artificial delay for simulation effect
            await new Promise(r => setTimeout(r, 1000));

            setPlan(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'completed' } : t));

            // Random chance of "self-correction" log
            if (Math.random() > 0.7) {
                setLogs(prev => [...prev, `  [Monitor] Drift detected. Re-aligning context... OK.`]);
                await new Promise(r => setTimeout(r, 500));
            }
        }

        setLogs(prev => [...prev, '--- GOAL STATE ACHIEVED ---']);
        setIsSimulating(false);
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Cognitive': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Creative': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Physical': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Reflective': return 'bg-teal-100 text-teal-800 border-teal-200';
            case 'Restorative': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="my-10 p-1 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 shadow-neumorphic-out border border-white/60 backdrop-blur-md">
            <div className="bg-brand-bg/95 rounded-[22px] p-6 md:p-8">

                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h4 className="font-bold text-2xl text-brand-text flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <SparklesIcon />
                            </div>
                            Goal Forge Workbench
                        </h4>
                        <p className="text-brand-text-light mt-1 text-sm">Define a goal and watch the agent decompose, prioritize, and execute it.</p>
                    </div>
                </div>

                {/* Input Section */}
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="State your goal..."
                            className="flex-grow px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                            disabled={loading || isSimulating}
                        />
                        <button
                            onClick={generatePlan}
                            disabled={loading || isSimulating || !goal.trim()}
                            className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 hover:bg-brand-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            {loading ? <span className="animate-spin">⚙️</span> : <SparklesIcon />}
                            Forge Plan
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {PRESETS.map((p, i) => (
                            <button key={i} onClick={() => setGoal(p)} disabled={loading || isSimulating} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors">
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: The Plan (Visualizer) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <h5 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Execution Graph</h5>
                                {plan.length > 0 && (
                                    <button
                                        onClick={runSimulation}
                                        disabled={isSimulating}
                                        className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1.5 rounded-lg hover:bg-green-200 disabled:opacity-50 transition-colors"
                                    >
                                        {isSimulating ? 'Running Loop...' : '▶ Simulate Execution'}
                                    </button>
                                )}
                            </div>

                            <div className="p-4 space-y-3">
                                {loading && (
                                    <div className="space-y-3 animate-pulse">
                                        {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>)}
                                    </div>
                                )}

                                {!loading && plan.length === 0 && (
                                    <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                                        <div className="mb-2 text-4xl opacity-20">🎯</div>
                                        <p className="text-sm">No active plan. Set a goal to begin.</p>
                                    </div>
                                )}

                                {plan.map((task, index) => (
                                    <div
                                        key={task.id}
                                        onClick={() => setSelectedTask(task)}
                                        className={`
                                            relative p-4 rounded-xl border-l-4 transition-all duration-300 cursor-pointer hover:shadow-md
                                            ${task.status === 'active' ? 'bg-blue-50 border-blue-500 scale-[1.02] shadow-lg ring-1 ring-blue-200' :
                                                task.status === 'completed' ? 'bg-gray-50 border-green-500 opacity-60' : 'bg-white border-gray-200 hover:border-brand-primary'}
                                        `}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mb-1 inline-block ${getTypeColor(task.type)}`}>
                                                    {task.type}
                                                </span>
                                                <h6 className="font-bold text-brand-text">{task.title}</h6>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-mono text-gray-400">{task.duration}m</span>
                                                {task.status === 'active' && <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full animate-ping ml-auto"></div>}
                                                {task.status === 'completed' && <div className="mt-1 text-green-500 text-xs font-bold">✓</div>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Internals (Reasoning & Logs) */}
                    <div className="lg:col-span-1 flex flex-col gap-6">

                        {/* Selected Task Details */}
                        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg min-h-[200px] border border-slate-700">
                            <h5 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">Agent Reasoning Engine</h5>
                            {selectedTask ? (
                                <div className="animate-fade-in">
                                    <h6 className="font-bold text-lg text-white mb-2">{selectedTask.title}</h6>
                                    <div className="w-full h-px bg-slate-700 mb-3"></div>
                                    <p className="text-sm text-slate-300 italic leading-relaxed">
                                        "{selectedTask.reasoning}"
                                    </p>
                                    <div className="mt-4 flex gap-2">
                                        <span className="text-[10px] border border-slate-600 px-2 py-1 rounded text-slate-400">Dependency Check: PASS</span>
                                        <span className="text-[10px] border border-slate-600 px-2 py-1 rounded text-slate-400">Resource: AVAIL</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm italic">Select a task from the plan to inspect the agent's internal logic and scheduling constraints.</p>
                            )}
                        </div>

                        {/* System Logs */}
                        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex-1 flex flex-col">
                            <h5 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-3">System Event Log</h5>
                            <div className="flex-1 overflow-y-auto max-h-[200px] font-mono text-[10px] space-y-1.5 liquid-scrollbar">
                                {logs.map((log, i) => (
                                    <div key={i} className={`truncate ${log.startsWith('>') ? 'text-blue-600 font-bold' : log.includes('Error') ? 'text-red-500' : 'text-gray-500'}`}>
                                        <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                                        {log}
                                    </div>
                                ))}
                                <div ref={(el) => { if (el?.parentElement) el.parentElement.scrollTop = el.parentElement.scrollHeight; }} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedulePlanner;
