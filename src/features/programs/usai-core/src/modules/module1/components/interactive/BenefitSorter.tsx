
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { InteractiveComponentProps } from '../../types';

type Category = 'For Students' | 'For Parents';

interface Benefit {
  id: number;
  text: string;
  icon: string;
  category: Category;
}

const allBenefits: Benefit[] = [
  { id: 1, text: 'Future-Ready Skills', icon: '🚀', category: 'For Students' },
  { id: 2, text: 'Personalized Learning', icon: '🎯', category: 'For Students' },
  { id: 3, text: 'Regulatory Compliance', icon: '📋', category: 'For Parents' },
  { id: 4, text: 'Community Support', icon: '🤝', category: 'For Students' },
  { id: 5, text: 'Turnkey Curriculum', icon: '📦', category: 'For Parents' },
];

const BenefitSorter: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
  const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
  const [unassigned, setUnassigned] = useState<Benefit[]>(allBenefits);
  const [studentBenefits, setStudentBenefits] = useState<Benefit[]>([]);
  const [parentBenefits, setParentBenefits] = useState<Benefit[]>([]);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'correct' | 'incorrect' | 'info' | '' }>({ text: '', type: '' });
  const [score, setScore] = useState(0);

  const moduleProgress = getModuleProgress(1);
  const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

  useEffect(() => {
    if (unassigned.length === 0 && !hasCompleted) {
      addPoints(1, 25);
      updateModuleProgress(1, interactiveId, 'interactive');
      setFeedback({ text: '🎉 Great job! All benefits sorted. +25 points!', type: 'correct' });
    }
  }, [unassigned, hasCompleted, addPoints, updateModuleProgress, interactiveId]);

  const handleSelectBenefit = (benefit: Benefit) => {
    setSelectedBenefit(benefit);
    setFeedback({ text: `Now click a category for "${benefit.text}"`, type: 'info' });
  };

  const handleAssignCategory = (category: Category) => {
    if (!selectedBenefit) {
      setFeedback({ text: '👆 Select a benefit card first!', type: 'info' });
      return;
    }

    const isCorrect = selectedBenefit.category === category;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback({ text: `✅ Correct! "${selectedBenefit.text}" belongs to ${category}.`, type: 'correct' });
    } else {
      setFeedback({ text: `❌ "${selectedBenefit.text}" is actually ${selectedBenefit.category}. But categorized anyway!`, type: 'incorrect' });
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
    setFeedback({ text: '', type: '' });
    setScore(0);
  };

  return (
    <div className="my-8 rounded-2xl shadow-neumorphic-out overflow-hidden border border-brand-primary/10">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent border-b border-brand-shadow-dark/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-lg shadow-md">
              🗂️
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-text">Benefit Sorter</h4>
              <p className="text-brand-text-light text-xs">Drag benefits into the correct category</p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-brand-text-light/50 bg-brand-bg px-2.5 py-1 rounded-full shadow-neumorphic-in">
            {score}/{allBenefits.length} correct
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Unassigned Benefits */}
          <div className="bg-brand-bg p-4 rounded-xl shadow-neumorphic-in">
            <h5 className="font-semibold text-center text-brand-text text-xs uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-primary/50" />
              Benefits to Sort
            </h5>
            <div className="flex flex-col gap-2 min-h-[120px]">
              {unassigned.map(benefit => (
                <button
                  key={benefit.id}
                  onClick={() => handleSelectBenefit(benefit)}
                  className={`p-3 text-sm rounded-xl text-left transition-all duration-200 flex items-center gap-2 ${selectedBenefit?.id === benefit.id
                      ? 'shadow-neumorphic-in bg-gradient-to-r from-brand-primary/10 to-transparent text-brand-primary border border-brand-primary/20 scale-[0.98]'
                      : 'shadow-neumorphic-out hover:shadow-neumorphic-in text-brand-text-light border border-transparent'
                    }`}
                >
                  <span>{benefit.icon}</span>
                  <span className="font-medium">{benefit.text}</span>
                </button>
              ))}
              {unassigned.length === 0 && (
                <div className="flex items-center justify-center h-full text-brand-text-light/40 text-sm py-8">
                  ✨ All sorted!
                </div>
              )}
            </div>
          </div>

          {/* For Students */}
          <button
            onClick={() => handleAssignCategory('For Students')}
            className={`bg-brand-bg p-4 rounded-xl shadow-neumorphic-in cursor-pointer transition-all hover:ring-2 hover:ring-blue-400/30 text-left ${selectedBenefit ? 'ring-1 ring-blue-400/20 animate-pulse-subtle' : ''
              }`}
          >
            <h5 className="font-semibold text-center text-brand-text text-xs uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
              <span>🎓</span> For Students
            </h5>
            <div className="flex flex-col gap-2 min-h-[120px]">
              {studentBenefits.map(b => (
                <div key={b.id} className="p-3 bg-brand-bg shadow-neumorphic-out rounded-xl text-sm flex items-center gap-2 animate-slide-in-up border border-blue-500/10">
                  <span>{b.icon}</span>
                  <span className="text-brand-text-light">{b.text}</span>
                </div>
              ))}
            </div>
          </button>

          {/* For Parents */}
          <button
            onClick={() => handleAssignCategory('For Parents')}
            className={`bg-brand-bg p-4 rounded-xl shadow-neumorphic-in cursor-pointer transition-all hover:ring-2 hover:ring-violet-400/30 text-left ${selectedBenefit ? 'ring-1 ring-violet-400/20 animate-pulse-subtle' : ''
              }`}
          >
            <h5 className="font-semibold text-center text-brand-text text-xs uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
              <span>👨‍👩‍👧</span> For Parents
            </h5>
            <div className="flex flex-col gap-2 min-h-[120px]">
              {parentBenefits.map(b => (
                <div key={b.id} className="p-3 bg-brand-bg shadow-neumorphic-out rounded-xl text-sm flex items-center gap-2 animate-slide-in-up border border-violet-500/10">
                  <span>{b.icon}</span>
                  <span className="text-brand-text-light">{b.text}</span>
                </div>
              ))}
            </div>
          </button>
        </div>

        {/* Feedback */}
        {feedback.text && (
          <div className={`text-center mt-4 p-3 rounded-xl text-sm font-semibold animate-fade-in ${feedback.type === 'correct' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              feedback.type === 'incorrect' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
            }`}>
            {feedback.text}
          </div>
        )}

        {unassigned.length === 0 && (
          <div className="text-center mt-4">
            <button
              onClick={handleReset}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              🔄 Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BenefitSorter;
