import React, { useState } from 'react';

const ROLES = ['Researcher', 'Summarizer', 'Critic', 'Planner'];
const TASK = "Task: Create a report on the impact of AI on climate change.";

interface DropTarget {
  id: number;
  role: string | null;
}

const AgentSystemDesigner: React.FC = () => {
  const [availableRoles, setAvailableRoles] = useState<string[]>(ROLES);
  const [targets, setTargets] = useState<DropTarget[]>([
    { id: 1, role: null },
    { id: 2, role: null },
    { id: 3, role: null },
    { id: 4, role: null },
  ]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [correct, setCorrect] = useState(0);

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
    
    if (correctMapping[targetId] === selectedRole) {
      setCorrect(prev => prev + 1);
    }
    setSelectedRole(null);

    const allAssigned = newTargets.every(t => t.role);
    if (allAssigned) {
        const score = newTargets.reduce((acc, t) => acc + (correctMapping[t.id] === t.role ? 1 : 0), 0);
        setFeedback(`All roles assigned! You got ${score} out of 4 correct. The correct order is Planner, Researcher, Summarizer, Critic.`);
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
    setCorrect(0);
   }

  return (
    <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
      <h4 className="font-bold text-lg text-brand-text mb-4 text-center">{TASK}</h4>
      <p className="text-center text-brand-text-light mb-4">Assign roles to the agents below. Click a role, then click a slot.</p>
      
      <div className="flex justify-center gap-4 mb-6">
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

      {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
      <div className="text-center mt-4">
        <button onClick={handleReset} className="px-4 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Reset</button>
      </div>
    </div>
  );
};

export default AgentSystemDesigner;