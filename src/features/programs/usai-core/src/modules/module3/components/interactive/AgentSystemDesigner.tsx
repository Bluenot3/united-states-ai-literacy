import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const ROLES = ['Researcher', 'Summarizer', 'Critic', 'Planner'];
const TASK = "Task: Create a report on the impact of AI on climate change.";

interface DropTarget {
  id: number;
  role: string | null;
}

const AgentSystemDesigner: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
  const { user, addPoints, updateProgress } = useAuth();
  const [availableRoles, setAvailableRoles] = useState<string[]>(ROLES);
  const [targets, setTargets] = useState<DropTarget[]>([
    { id: 1, role: null }, { id: 2, role: null }, { id: 3, role: null }, { id: 4, role: null },
  ]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const isAllAssigned = targets.every(t => t.role);
  const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
    setFeedback('');
  };

  const handleAssignRole = (targetId: number) => {
    if (!selectedRole || loading) return;
    const currentTarget = targets.find(t => t.id === targetId);
    if (currentTarget && currentTarget.role) return;

    const newTargets = targets.map(t =>
      t.id === targetId ? { ...t, role: selectedRole } : t
    );
    setTargets(newTargets);
    setAvailableRoles(availableRoles.filter(r => r !== selectedRole));
    setSelectedRole(null);
  };
  
  const handleReview = async () => {
    if (!isAllAssigned) return;
    setLoading(true);
    setFeedback('');
    const userWorkflow = targets.map(t => t.role).join(' -> ');
    const prompt = `You are an expert in AI agentic workflows. A user has designed a workflow for the following task: "${TASK}".
    
User's workflow: ${userWorkflow}

Critique this workflow. Is it logical? What are its strengths and weaknesses? Suggest one possible improvement. Keep your feedback constructive and easy for a beginner to understand.`;
    
    try {
        const ai = await getAiClient();
        const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
        setFeedback(response.text);
        if (!hasCompleted) {
            addPoints(25);
            updateProgress(interactiveId, 'interactive');
        }
    } catch (e) {
        console.error(e);
        setFeedback("Error getting feedback. A common logical flow is Planner -> Researcher -> Summarizer -> Critic.");
    } finally {
        setLoading(false);
    }
  };

  const handleReset = () => {
    setAvailableRoles(ROLES);
    setTargets([
        { id: 1, role: null }, { id: 2, role: null }, { id: 3, role: null }, { id: 4, role: null },
    ]);
    setSelectedRole(null);
    setFeedback('');
    setLoading(false);
  };

  return (
    <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
      <h4 className="font-bold text-lg text-brand-text mb-4 text-center">{TASK}</h4>
      <p className="text-center text-brand-text-light mb-4">Assign roles to the agents below. Click a role, then click a slot.</p>
      
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {availableRoles.map(role => (
          <button
            key={role}
            onClick={() => handleSelectRole(role)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${selectedRole === role ? 'shadow-neumorphic-in text-brand-primary' : 'shadow-neumorphic-out'}`}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        {targets.map(target => (
          <div key={target.id} onClick={() => handleAssignRole(target.id)} className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[80px] flex flex-col justify-center items-center cursor-pointer">
            <span className="font-semibold text-brand-text-light">Agent {target.id}</span>
            {target.role ? (
              <span className="font-bold text-brand-primary mt-2">{target.role}</span>
            ) : (
              <span className="text-sm text-slate-400 mt-2">(Empty Slot)</span>
            )}
          </div>
        ))}
      </div>

      {isAllAssigned && !feedback && !loading && (
        <div className="text-center mt-6">
            <button onClick={handleReview} className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in">
                <SparklesIcon /> Submit for AI Review
            </button>
        </div>
      )}

      {(loading || feedback) && (
        <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
          <h5 className="font-semibold text-brand-text mb-2">AI Feedback</h5>
          {loading ? <p className="animate-pulse">Analyzing workflow...</p> : <pre className="text-brand-text-light whitespace-pre-wrap font-sans">{feedback}</pre>}
        </div>
      )}

      <div className="text-center mt-4">
        <button onClick={handleReset} className="px-4 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Reset</button>
      </div>
    </div>
  );
};

export default AgentSystemDesigner;