import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { InteractiveComponentProps } from '../../types';
import { SparklesIcon } from '../icons/SparklesIcon';

const ROLES = ['Researcher', 'Summarizer', 'Critic', 'Planner'];
const TASK = "Task: Create a report on the impact of AI on climate change.";

interface DropTarget {
  id: number;
  role: string | null;
}

interface LogEntry {
    source: string;
    message: string;
    type: 'thought' | 'action' | 'memory' | 'metric';
}

const AgentSystemDesigner: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
  const [availableRoles, setAvailableRoles] = useState<string[]>(ROLES);
  const [targets, setTargets] = useState<DropTarget[]>([
    { id: 1, role: null },
    { id: 2, role: null },
    { id: 3, role: null },
    { id: 4, role: null },
  ]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const { user, addPoints, updateProgress } = useAuth();

  const correctMapping = {
    1: 'Planner',
    2: 'Researcher',
    3: 'Summarizer',
    4: 'Critic',
  };

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
    setFeedback('');
  };

  const handleAssignRole = (targetId: number) => {
    if (!selectedRole) {
      setFeedback('Please select a role first.');
      return;
    }

    const currentTarget = targets.find(t => t.id === targetId);
    if (currentTarget && currentTarget.role) return; // Already assigned

    const newTargets = targets.map(t =>
      t.id === targetId ? { ...t, role: selectedRole } : t
    );
    setTargets(newTargets);

    setAvailableRoles(availableRoles.filter(r => r !== selectedRole));
    
    setSelectedRole(null);

    const allAssigned = newTargets.every(t => t.role);
    if (allAssigned) {
        // @ts-ignore
        const score = newTargets.reduce((acc, t) => acc + (correctMapping[t.id] === t.role ? 1 : 0), 0);
        if (score === 4) {
             setFeedback(`Team Assembled. System Ready for Autonomy Loop.`);
             if (user && !user.progress.completedInteractives.includes(interactiveId)) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } else {
             setFeedback(`Incorrect configuration. The optimal flow is Planner -> Researcher -> Summarizer -> Critic. Resetting...`);
             setTimeout(handleReset, 3000);
        }
    }
  };
  
   const handleReset = () => {
    setAvailableRoles(ROLES);
    setTargets([
        { id: 1, role: null },
        { id: 2, role: null },
        { id: 3, role: null },
        { id: 4, role: null },
    ]);
    setSelectedRole(null);
    setFeedback('');
    setIsSimulating(false);
    setLogs([]);
    setProgress(0);
   }

   const runSimulation = () => {
       setIsSimulating(true);
       setLogs([]);
       setProgress(0);

       const steps: LogEntry[] = [
           { source: 'Goal Gradient', message: 'Goal: "Impact of AI on Climate Change" - Initialized', type: 'metric' },
           { source: 'Cognitive Core', message: 'Decomposing task into sub-goals: 1. Data Gathering, 2. Analysis, 3. Synthesis', type: 'thought' },
           { source: 'Planner', message: 'Dispatching research tasks to Agent 2', type: 'action' },
           { source: 'Short-Term Memory', message: 'Context window updated with task definition', type: 'memory' },
           { source: 'Researcher', message: 'Calling Tool: GoogleSearch("AI energy consumption statistics 2024")', type: 'action' },
           { source: 'Tool Interface', message: 'GET request to search.api... 200 OK', type: 'action' },
           { source: 'Researcher', message: 'Calling Tool: GoogleSearch("AI optimization for renewable grids")', type: 'action' },
           { source: 'Long-Term Memory', message: 'Retrieving "Source Credibility Policy" from Vector DB', type: 'memory' },
           { source: 'Summarizer', message: 'Synthesizing 14 documents...', type: 'thought' },
           { source: 'Critic', message: 'Critique: "Section 3 lacks quantitative data on carbon offsets."', type: 'thought' },
           { source: 'Planner', message: 'Revision Plan: Re-run Researcher for carbon offset data.', type: 'action' },
           { source: 'Autonomy Loop', message: 'Cycle Complete. Confidence Delta: +45%', type: 'metric' },
           { source: 'System', message: 'Report Generated Successfully.', type: 'thought' },
       ];

       steps.forEach((step, index) => {
           setTimeout(() => {
               setLogs(prev => [...prev, step]);
               setProgress((index + 1) / steps.length * 100);
           }, index * 800);
       });
   };

   const allCorrect = targets.every(t => t.role && correctMapping[t.id as keyof typeof correctMapping] === t.role);

  return (
    <div className="my-8 bg-slate-900 rounded-2xl shadow-neumorphic-out border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-xl text-white flex items-center gap-2">
                <SparklesIcon /> Agent Anatomy Visualizer
            </h4>
            <div className="text-xs font-mono text-slate-400">STATUS: {isSimulating ? 'RUNNING' : 'STANDBY'}</div>
          </div>
          {!isSimulating && <p className="text-slate-400 mt-2 text-sm">Task: Assemble the optimal agent team to generate a climate report.</p>}
      </div>

      {/* Main Content */}
      <div className="p-6">
          {!isSimulating ? (
              <>
                <div className="flex justify-center gap-4 mb-8">
                    {availableRoles.map(role => (
                    <button
                        key={role}
                        onClick={() => handleSelectRole(role)}
                        className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200 border ${selectedRole === role ? 'bg-brand-primary text-white border-brand-primary' : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'}`}
                    >
                        {role}
                    </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center mb-6">
                    {targets.map(target => (
                    <div key={target.id} onClick={() => handleAssignRole(target.id)} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-brand-primary/50 cursor-pointer min-h-[100px] flex flex-col justify-center items-center transition-all group">
                        <span className="font-mono text-xs text-slate-500 mb-2">NODE {target.id}</span>
                        {target.role ? (
                        <span className="font-bold text-brand-primary text-lg">{target.role}</span>
                        ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-600 group-hover:border-slate-400"></div>
                        )}
                    </div>
                    ))}
                </div>

                {feedback && <p className={`text-center mb-6 font-mono text-sm ${feedback.includes('Incorrect') ? 'text-red-400' : 'text-green-400'}`}>{feedback}</p>}
                
                <div className="flex justify-center gap-4">
                    <button onClick={handleReset} className="px-6 py-2 text-sm rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">Reset</button>
                    {allCorrect && (
                        <button onClick={runSimulation} className="px-6 py-2 text-sm rounded-lg bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform">
                            Initialize Autonomy Loop
                        </button>
                    )}
                </div>
              </>
          ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Visualizer Left: Architecture */}
                  <div className="lg:col-span-1 space-y-4">
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                          <h5 className="text-xs font-mono text-slate-400 mb-3">ACTIVE ARCHITECTURE</h5>
                          <div className="space-y-2">
                              {targets.map(t => (
                                  <div key={t.id} className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-700">
                                      <span className="text-sm font-bold text-white">{t.role}</span>
                                      <div className={`w-2 h-2 rounded-full ${progress < 100 ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                          <h5 className="text-xs font-mono text-slate-400 mb-3">GOAL GRADIENT</h5>
                          <div className="w-full bg-slate-900 rounded-full h-2 mb-2">
                              <div className="bg-brand-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500 font-mono">
                              <span>INIT</span>
                              <span>COMPLETE</span>
                          </div>
                      </div>
                  </div>

                  {/* Visualizer Right: The Stream */}
                  <div className="lg:col-span-2 bg-black rounded-lg border border-slate-700 p-4 font-mono text-sm overflow-hidden flex flex-col h-[400px]">
                      <div className="flex-1 overflow-y-auto space-y-2 liquid-scrollbar pr-2">
                          {logs.map((log, i) => (
                              <div key={i} className="animate-fade-in flex gap-3">
                                  <span className="text-slate-500 min-w-[120px] text-right text-xs pt-0.5">{log.source}</span>
                                  <span className={`${
                                      log.type === 'thought' ? 'text-blue-300' :
                                      log.type === 'action' ? 'text-yellow-300' :
                                      log.type === 'memory' ? 'text-purple-300' : 'text-green-300'
                                  }`}>
                                      {log.type === 'action' && '> '}
                                      {log.message}
                                  </span>
                              </div>
                          ))}
                          {progress < 100 && (
                              <div className="animate-pulse text-brand-primary text-xs mt-2 ml-[132px]">_ Processing...</div>
                          )}
                      </div>
                  </div>
                  
                  {progress === 100 && (
                      <div className="lg:col-span-3 text-center">
                          <button onClick={handleReset} className="px-6 py-2 text-sm rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">Run New Simulation</button>
                      </div>
                  )}
              </div>
          )}
      </div>
    </div>
  );
};

export default AgentSystemDesigner;
