import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { InteractiveComponentProps } from '../../types';

type Category = 'For Students' | 'For Parents';

interface Benefit {
  id: number;
  text: string;
  category: Category;
}

const allBenefits: Benefit[] = [
  { id: 1, text: 'Future-Ready Skills', category: 'For Students' },
  { id: 2, text: 'Personalized Learning', category: 'For Students' },
  { id: 3, text: 'Regulatory Compliance', category: 'For Parents' },
  { id: 4, text: 'Community Support', category: 'For Students' },
  { id: 5, text: 'Turnkey Curriculum', category: 'For Parents' },
];

const BenefitSorter: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
  const { user, addPoints, updateProgress } = useAuth();
  const [unassigned, setUnassigned] = useState<Benefit[]>(allBenefits);
  const [studentBenefits, setStudentBenefits] = useState<Benefit[]>([]);
  const [parentBenefits, setParentBenefits] = useState<Benefit[]>([]);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  
  useEffect(() => {
    if (unassigned.length === 0 && user && !user.progress.completedInteractives.includes(interactiveId)) {
        addPoints(25);
        updateProgress(interactiveId, 'interactive');
        setFeedback('Great job! You\'ve sorted all the benefits. +25 points!');
    }
  }, [unassigned, user, addPoints, updateProgress, interactiveId]);

  const handleSelectBenefit = (benefit: Benefit) => {
    setSelectedBenefit(benefit);
    setFeedback('');
  };

  const handleAssignCategory = (category: Category) => {
    if (!selectedBenefit) {
      setFeedback('Please select a benefit first!');
      return;
    }

    if (selectedBenefit.category === category) {
      setFeedback('Correct!');
    } else {
      setFeedback(`Not quite! "${selectedBenefit.text}" is more for ${selectedBenefit.category}.`);
    }

    setUnassigned(unassigned.filter(b => b.id !== selectedBenefit.id));
    if (category === 'For Students') {
      setStudentBenefits([...studentBenefits, selectedBenefit]);
    } else {
      setParentBenefits([...parentBenefits, selectedBenefit]);
    }
    setSelectedBenefit(null);
  };
  
  const handleReset = () => {
    setUnassigned(allBenefits);
    setStudentBenefits([]);
    setParentBenefits([]);
    setSelectedBenefit(null);
    setFeedback('');
  }

  return (
    <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Unassigned Benefits */}
            <div className="bg-brand-bg p-4 rounded-lg shadow-neumorphic-in">
                <h4 className="font-bold text-center text-brand-text mb-4">Benefits to Sort</h4>
                <div className="flex flex-col gap-2">
                    {unassigned.map(benefit => (
                        <button 
                            key={benefit.id} 
                            onClick={() => handleSelectBenefit(benefit)}
                            className={`p-3 text-sm rounded-lg text-left transition-all duration-200 ${selectedBenefit?.id === benefit.id ? 'shadow-neumorphic-in text-brand-primary' : 'shadow-neumorphic-out'}`}
                        >
                            {benefit.text}
                        </button>
                    ))}
                    {unassigned.length === 0 && <p className="text-center text-brand-text-light text-sm">All sorted!</p>}
                </div>
            </div>

            {/* Category Columns */}
            <div onClick={() => handleAssignCategory('For Students')} className="bg-brand-bg p-4 rounded-lg shadow-neumorphic-in cursor-pointer">
                <h4 className="font-bold text-center text-brand-text mb-4">For Students</h4>
                 <div className="flex flex-col gap-2 min-h-[100px]">
                    {studentBenefits.map(b => <div key={b.id} className="p-3 bg-brand-bg shadow-neumorphic-out rounded-lg text-sm">{b.text}</div>)}
                </div>
            </div>
            <div onClick={() => handleAssignCategory('For Parents')} className="bg-brand-bg p-4 rounded-lg shadow-neumorphic-in cursor-pointer">
                <h4 className="font-bold text-center text-brand-text mb-4">For Parents</h4>
                <div className="flex flex-col gap-2 min-h-[100px]">
                     {parentBenefits.map(b => <div key={b.id} className="p-3 bg-brand-bg shadow-neumorphic-out rounded-lg text-sm">{b.text}</div>)}
                </div>
            </div>
        </div>
        
        {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
        {unassigned.length === 0 && (
            <div className="text-center mt-4">
                 <button onClick={handleReset} className="px-4 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Reset</button>
            </div>
        )}
    </div>
  );
};

export default BenefitSorter;
