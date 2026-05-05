import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { InteractiveComponentProps } from '../../types';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

type Category = 'Supervised' | 'Unsupervised' | 'Other';

interface Concept {
  id: number;
  text: string;
  category: Category;
}

const allConcepts: Concept[] = [
  { id: 1, text: 'Predicting house prices from features', category: 'Supervised' },
  { id: 2, text: 'Grouping customers into market segments', category: 'Unsupervised' },
  { id: 3, text: 'Classifying emails as "spam" or "not spam"', category: 'Supervised' },
  { id: 4, text: 'A calculator adding two numbers', category: 'Other' },
  { id: 5, text: 'Identifying anomalies in sensor data', category: 'Unsupervised' },
];

const ConceptSorter: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
  const { user, addPoints, updateProgress } = useAuth();
  const [unassigned, setUnassigned] = useState<Concept[]>(allConcepts);
  const [categorized, setCategorized] = useState<{ [key in Category]: Concept[] }>({ 'Supervised': [], 'Unsupervised': [], 'Other': [] });
  const [selected, setSelected] = useState<Concept | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const isCompleted = user?.progress.completedInteractives.includes(interactiveId);

  useEffect(() => {
    if (unassigned.length === 0 && !isCompleted) {
        addPoints(25);
        updateProgress(interactiveId, 'interactive');
    }
  }, [unassigned, isCompleted, addPoints, updateProgress, interactiveId]);

  const handleSelect = (concept: Concept) => {
    setSelected(concept);
    setFeedback('');
  };

  const handleAssignCategory = (category: Category) => {
    if (!selected) {
      setFeedback('Please select a concept to sort first!');
      return;
    }

    if (selected.category === category) {
        setFeedback(`Correct! "${selected.text}" is an example of ${category} learning.`);
    } else {
        setFeedback(`Not quite. "${selected.text}" belongs in the "${selected.category}" category.`);
    }

    setUnassigned(unassigned.filter(b => b.id !== selected.id));
    setCategorized(prev => ({ ...prev, [selected.category]: [...prev[selected.category], selected] }));
    setSelected(null);
  };
  
  const getExplanation = async (concept: Concept) => {
    setLoading(true);
    setFeedback('');
    const prompt = `Explain for a beginner why the task "${concept.text}" is an example of ${concept.category} Learning. If the category is 'Other', explain why it's not considered machine learning.`;
    try {
        const ai = await getAiClient();
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        setFeedback(response.text);
    } catch(e) {
        console.error(e);
        setFeedback("Could not load explanation at this time.");
    } finally {
        setLoading(false);
    }
  }

  const handleReset = () => {
    setUnassigned(allConcepts.sort(() => 0.5 - Math.random()));
    setCategorized({ 'Supervised': [], 'Unsupervised': [], 'Other': [] });
    setSelected(null);
    setFeedback('');
  }

  return (
    <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 bg-brand-bg p-4 rounded-lg shadow-neumorphic-in">
                <h4 className="font-bold text-center text-brand-text mb-4">Concepts to Sort</h4>
                <div className="flex flex-col gap-2">
                    {unassigned.map(concept => (
                        <button 
                            key={concept.id} 
                            onClick={() => handleSelect(concept)}
                            className={`p-3 text-sm rounded-lg text-left transition-all duration-200 ${selected?.id === concept.id ? 'shadow-neumorphic-in text-brand-primary' : 'shadow-neumorphic-out'}`}
                        >
                            {concept.text}
                        </button>
                    ))}
                    {unassigned.length === 0 && <p className="text-center text-brand-text-light text-sm">All sorted!</p>}
                </div>
            </div>
            
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.keys(categorized) as Category[]).map(category => (
                    <div key={category} onClick={() => handleAssignCategory(category)} className="bg-brand-bg p-4 rounded-lg shadow-neumorphic-in cursor-pointer">
                        <h4 className="font-bold text-center text-brand-text mb-4">{category}</h4>
                        <div className="flex flex-col gap-2 min-h-[100px]">
                            {categorized[category].map(b => (
                                <div key={b.id} className="p-3 bg-brand-bg shadow-neumorphic-out rounded-lg text-sm">
                                    {b.text}
                                    <button onClick={(e) => { e.stopPropagation(); getExplanation(b); }} className="text-xs text-brand-primary font-semibold ml-2 inline-flex items-center gap-1">
                                      <SparklesIcon /> AI Explain
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        {(feedback || loading) && (
          <div className="text-center mt-4 font-semibold p-3 bg-brand-bg rounded-lg shadow-neumorphic-in">
            {loading ? <p className="animate-pulse">Getting explanation...</p> : <p>{feedback} {unassigned.length === 0 && !isCompleted ? "+25 points!" : ""}</p>}
          </div>
        )}
        
        {unassigned.length === 0 && (
            <div className="text-center mt-4">
                 <button onClick={handleReset} className="px-4 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Reset</button>
            </div>
        )}
    </div>
  );
};

export default ConceptSorter;