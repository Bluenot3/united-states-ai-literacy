
import React, { useState, useEffect, useRef } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';

// --- Types & Config ---

type NodeType = 'Strategy' | 'Tool' | 'Critique' | 'Memory';

interface NodeItem {
    id: string;
    type: NodeType;
}

interface NodeConfig {
    type: NodeType;
    label: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    color: string; // Tailwind text color class
    bg: string; // Tailwind bg class for light accents
    border: string;
}

const NODES: Record<NodeType, NodeConfig> = {
    Memory: {
        type: 'Memory',
        label: 'Memory / Context',
        description: 'Retrieves relevant history.',
        icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
        ),
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200'
    },
    Strategy: {
        type: 'Strategy',
        label: 'Strategy / Plan',
        description: 'Breaks down the goal.',
        icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
            </svg>
        ),
        color: 'text-brand-primary',
        bg: 'bg-purple-50',
        border: 'border-purple-200'
    },
    Tool: {
        type: 'Tool',
        label: 'Tool Use',
        description: 'Executes an action.',
        icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200'
    },
    Critique: {
        type: 'Critique',
        label: 'Critique / Verify',
        description: 'Checks for errors.',
        icon: ({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: 'text-pink-600',
        bg: 'bg-pink-50',
        border: 'border-pink-200'
    }
};

// --- Component ---

const LangGraphVisualizer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [pipeline, setPipeline] = useState<NodeItem[]>([]);
    const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [simulationStatus, setSimulationStatus] = useState<'idle' | 'success' | 'warning' | 'error'>('idle');

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: React.DragEvent, type: NodeType) => {
        e.dataTransfer.setData('nodeType', type);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('nodeType') as NodeType;
        if (type && NODES[type] && pipeline.length < 5) {
            setPipeline([...pipeline, { id: `${type}-${Date.now()}`, type }]);
            setSimulationStatus('idle');
            setLogs([]);
        }
    };

    const removeNode = (index: number) => {
        if (isRunning) return;
        setPipeline(pipeline.filter((_, i) => i !== index));
        setSimulationStatus('idle');
        setLogs([]);
    };

    const runSimulation = async () => {
        if (pipeline.length === 0 || isRunning) return;

        setIsRunning(true);
        setLogs(['Initializing Agent Protocol...']);
        setActiveNodeId('start');
        setSimulationStatus('idle');

        // Initial delay
        await new Promise(r => setTimeout(r, 600));

        // Process Nodes
        for (let i = 0; i < pipeline.length; i++) {
            const node = pipeline[i];
            setActiveNodeId(node.id);

            // Generate log based on node type
            const nodeConfig = NODES[node.type];
            setLogs(prev => [...prev, `[${nodeConfig.label}] Processing...`]);
            await new Promise(r => setTimeout(r, 800));

            let resultLog = '';
            switch (node.type) {
                case 'Memory': resultLog = 'Context Retrieved: User prefers concise data.'; break;
                case 'Strategy': resultLog = 'Plan Generated: 1. Search, 2. Filter, 3. Summarize.'; break;
                case 'Tool': resultLog = 'Tool Call: GoogleSearch("latest renewable stats") -> 200 OK.'; break;
                case 'Critique': resultLog = 'Verification: No hallucinations detected.'; break;
            }
            setLogs(prev => [...prev, `> ${resultLog}`]);
            await new Promise(r => setTimeout(r, 600));
        }

        setActiveNodeId('end');
        setLogs(prev => [...prev, ' finalizing...']);
        await new Promise(r => setTimeout(r, 500));

        // Evaluate Logic
        evaluatePipeline();
        setIsRunning(false);
        setActiveNodeId(null);
    };

    const evaluatePipeline = () => {
        const types = pipeline.map(n => n.type);
        const sequence = types.join('->');

        let message = '';
        let status: 'success' | 'warning' | 'error' = 'warning';
        let score = 0;

        if (sequence.includes('Memory->Strategy->Tool->Critique')) {
            message = "Optimal Architecture! The agent grounds itself in context, plans, acts, and verifies. This is a robust cognitive loop.";
            status = 'success';
            score = 100;
        } else if (sequence.startsWith('Tool')) {
            message = "Reactive System. The agent acts without planning or context. High risk of error.";
            status = 'error';
            score = 40;
        } else if (sequence.startsWith('Strategy->Tool')) {
            message = "Good start. Adding Context (Memory) before planning and Verification (Critique) after acting would make this elite.";
            status = 'warning';
            score = 75;
        } else {
            message = "Functional sequence, but lacks a robust cognitive structure. Try: Memory -> Strategy -> Tool -> Critique.";
            status = 'warning';
            score = 60;
        }

        setLogs(prev => [...prev, `\nSystem Evaluation: ${message}`]);
        setSimulationStatus(status);

        if (score >= 75 && user && !user.progress.completedInteractives.includes(interactiveId)) {
            addPoints(25);
            updateProgress(interactiveId, 'interactive');
        }
    };

    return (
        <div className="my-10 p-1 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 shadow-neumorphic-out border border-white/60 backdrop-blur-md">
            <div className="bg-brand-bg/90 rounded-[22px] p-6 md:p-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h4 className="font-bold text-2xl text-brand-text flex items-center gap-3">
                            <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                                <SparklesIcon />
                            </div>
                            Plan-Graph Simulator
                        </h4>
                        <p className="text-brand-text-light mt-1 text-sm">Design the agent's cognitive architecture by dragging nodes onto the processing track.</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => { setPipeline([]); setLogs([]); setSimulationStatus('idle'); }}
                            className="px-4 py-2 text-sm font-semibold text-brand-text-light hover:text-brand-text transition-colors"
                            disabled={isRunning}
                        >
                            Clear
                        </button>
                        <button
                            onClick={runSimulation}
                            disabled={pipeline.length === 0 || isRunning}
                            className={`px-6 py-2 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:shadow-none
                                ${isRunning ? 'bg-brand-text-light cursor-wait' : 'bg-gradient-to-r from-brand-primary to-purple-600 hover:shadow-brand-primary/30'}
                            `}
                        >
                            {isRunning ? 'Processing...' : 'Run Simulation'}
                        </button>
                    </div>
                </div>

                {/* Main Interaction Area */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Left: Palette */}
                    <div className="lg:col-span-1 space-y-4">
                        <h5 className="text-xs font-bold text-brand-text-light uppercase tracking-wider mb-4">Cognitive Modules</h5>
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                            {(Object.keys(NODES) as NodeType[]).map(type => {
                                const config = NODES[type];
                                return (
                                    <div
                                        key={type}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, type)}
                                        className={`
                                            group relative p-3 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-300
                                            bg-white border hover:border-transparent hover:shadow-neumorphic-out
                                            ${config.border}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
                                                <config.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className={`font-bold text-sm ${config.color}`}>{config.label}</div>
                                                <div className="text-[10px] text-brand-text-light leading-tight mt-0.5">{config.description}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Pipeline Canvas */}
                    <div className="lg:col-span-3 flex flex-col gap-6">

                        {/* The Track */}
                        <div
                            className="relative min-h-[180px] bg-brand-bg rounded-2xl shadow-neumorphic-in border border-white/50 flex items-center px-8 overflow-x-auto liquid-scrollbar"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            ref={scrollContainerRef}
                        >
                            {/* Background Guide Lines */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                                <div className="w-full h-px bg-brand-text"></div>
                            </div>

                            {/* Start Node */}
                            <div className="flex-shrink-0 flex items-center z-10">
                                <div className={`
                                    w-16 h-16 rounded-full flex items-center justify-center font-bold text-xs tracking-wider bg-white shadow-neumorphic-out border-4 transition-all duration-500
                                    ${activeNodeId === 'start' ? 'border-brand-primary scale-110 shadow-[0_0_20px_rgba(139,92,246,0.4)]' : 'border-gray-100 text-gray-400'}
                                `}>
                                    START
                                </div>
                                <div className={`w-8 h-1 transition-colors duration-500 ${activeNodeId === 'start' ? 'bg-brand-primary' : 'bg-gray-200'}`}></div>
                            </div>

                            {/* Dynamic Pipeline Nodes */}
                            {pipeline.length === 0 ? (
                                <div className="flex-grow flex items-center justify-center text-brand-text-light/40 font-medium italic border-2 border-dashed border-gray-200 rounded-xl h-24 mx-4 pointer-events-none">
                                    Drag modules here to build the agent's mind
                                </div>
                            ) : (
                                pipeline.map((node, index) => {
                                    const isActive = activeNodeId === node.id;
                                    const config = NODES[node.type];
                                    return (
                                        <div key={node.id} className="flex-shrink-0 flex items-center z-10 group relative">
                                            {/* Delete Button */}
                                            {!isRunning && (
                                                <button
                                                    onClick={() => removeNode(index)}
                                                    className="absolute -top-3 right-6 bg-white text-red-400 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:text-red-600 hover:scale-110"
                                                >
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            )}

                                            <div className={`
                                                relative w-32 h-24 bg-white rounded-xl shadow-neumorphic-out border-b-4 flex flex-col items-center justify-center p-2 transition-all duration-500
                                                ${isActive ? `scale-110 ring-4 ring-offset-2 ring-offset-brand-bg ${config.color.replace('text', 'ring')}` : 'scale-100 border-gray-100'}
                                                ${config.border.replace('border', 'border-b')}
                                            `}>
                                                <div className={`${config.color} mb-1 transition-transform duration-500 ${isActive ? 'scale-125' : ''}`}>
                                                    <config.icon className="w-6 h-6" />
                                                </div>
                                                <span className={`text-xs font-bold ${config.color}`}>{config.label.split(' / ')[0]}</span>

                                                {isActive && (
                                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-text text-white text-[10px] rounded-full shadow-lg whitespace-nowrap animate-bounce">
                                                        Processing...
                                                    </div>
                                                )}
                                            </div>

                                            {/* Connector */}
                                            <div className={`w-8 h-1 transition-colors duration-500 ${isActive ? config.bg.replace('bg', 'bg').replace('50', '400') : 'bg-gray-200'}`}></div>
                                        </div>
                                    );
                                })
                            )}

                            {/* End Node */}
                            <div className="flex-shrink-0 flex items-center z-10">
                                <div className={`
                                    w-16 h-16 rounded-full flex items-center justify-center font-bold text-xs tracking-wider bg-white shadow-neumorphic-out border-4 transition-all duration-500
                                    ${activeNodeId === 'end' ? 'border-green-500 text-green-600 scale-110 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'border-gray-100 text-gray-400'}
                                `}>
                                    END
                                </div>
                            </div>
                        </div>

                        {/* Console / Log */}
                        <div className="relative">
                            <div className="absolute top-0 left-4 -translate-y-1/2 bg-brand-text text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                                System Log
                            </div>
                            <div className="bg-slate-900 rounded-xl p-4 h-48 overflow-y-auto liquid-scrollbar font-mono text-xs shadow-inner border border-slate-700">
                                {logs.length === 0 ? (
                                    <span className="text-slate-600 animate-pulse">_ Waiting for execution...</span>
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        {logs.map((log, i) => (
                                            <div key={i} className={`
                                                ${log.includes('Evaluation') ? 'text-yellow-400 font-bold border-t border-slate-700 pt-2 mt-2' : 'text-slate-300'}
                                                ${log.includes('Optimal') ? 'text-green-400' : ''}
                                                ${log.includes('Reactive') ? 'text-red-400' : ''}
                                            `}>
                                                {log}
                                            </div>
                                        ))}
                                        {/* Auto-scroll anchor */}
                                        <div ref={(el) => { if (el?.parentElement) el.parentElement.scrollTop = el.parentElement.scrollHeight; }} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Feedback */}
                        {simulationStatus !== 'idle' && (
                            <div className={`p-4 rounded-xl border flex items-center gap-3 animate-fade-in
                                ${simulationStatus === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                                    simulationStatus === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                                        'bg-yellow-50 border-yellow-200 text-yellow-800'}
                            `}>
                                <div className={`p-2 rounded-full text-white
                                    ${simulationStatus === 'success' ? 'bg-green-500' :
                                        simulationStatus === 'error' ? 'bg-red-500' :
                                            'bg-yellow-500'}
                                `}>
                                    {simulationStatus === 'success' ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    )}
                                </div>
                                <div className="text-sm font-medium">
                                    {simulationStatus === 'success' ? 'System Optimized' : 'Optimization Required'}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LangGraphVisualizer;
