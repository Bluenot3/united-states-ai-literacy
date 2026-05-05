import React, { useState, useEffect } from 'react';

const correctOrder = [
    'User Input',
    'Retrieve Relevant Documents',
    'Augment Prompt with Context',
    'Generate Answer with LLM',
    'Respond to User',
];

const shuffleArray = (array: string[]) => [...array].sort(() => Math.random() - 0.5);

const RagBuilder: React.FC = () => {
    const [unassigned, setUnassigned] = useState<string[]>(() => shuffleArray(correctOrder));
    const [assigned, setAssigned] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string>('');
    const [isAnimating, setIsAnimating] = useState(false);

    const handleAssign = (step: string) => {
        if (assigned.length === correctOrder.length || isAnimating) return;

        const currentIndex = assigned.length;

        if (correctOrder[currentIndex] === step) {
            const newAssigned = [...assigned, step];
            setAssigned(newAssigned);
            setUnassigned(unassigned.filter(s => s !== step));
            if (newAssigned.length === correctOrder.length) {
                setFeedback('Excellent! You have correctly assembled the RAG pipeline.');
            } else {
                setFeedback('Correct! What\'s next?');
            }
        } else {
            setFeedback('Not quite. That\'s not the correct next step in the pipeline.');
        }
    };

    const handleReset = () => {
        setIsAnimating(false);
        setUnassigned(shuffleArray(correctOrder));
        setAssigned([]);
        setFeedback('');
    };

    useEffect(() => {
        // Fix: Use `ReturnType<typeof setTimeout>` for cross-environment compatibility.
        const timeoutRefs: ReturnType<typeof setTimeout>[] = [];
        
        const runPipelineAnimation = () => {
            // Clear any lingering animations
            timeoutRefs.forEach(clearTimeout);
            timeoutRefs.length = 0;

            handleReset();
            
            // Wait a tick for state to reset before starting animation
            setTimeout(() => {
                setIsAnimating(true);
                setFeedback('Running RAG pipeline simulation...');
                
                const newAssigned: string[] = [];
                correctOrder.forEach((step, index) => {
                    const timeout = setTimeout(() => {
                        newAssigned.push(step);
                        setAssigned([...newAssigned]);
                        setUnassigned(prev => prev.filter(s => s !== step));

                        if (index === correctOrder.length - 1) {
                            setIsAnimating(false);
                            setFeedback('Simulation complete! This is the correct RAG pipeline sequence.');
                        }
                    }, (index + 1) * 600);
                    timeoutRefs.push(timeout);
                });
            }, 50);
        };

        document.addEventListener('runRagPipeline', runPipelineAnimation);
        return () => {
            document.removeEventListener('runRagPipeline', runPipelineAnimation);
            timeoutRefs.forEach(clearTimeout);
        };
    }, []);

    const isFinished = assigned.length === correctOrder.length;
    
    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <h4 className="font-bold text-center text-brand-text mb-4">Pipeline Steps</h4>
                    <div className="flex flex-col gap-2">
                        {unassigned.map(step => (
                             <button
                                key={step}
                                onClick={() => handleAssign(step)}
                                disabled={isAnimating}
                                className="p-3 text-sm rounded-lg text-left transition-all duration-200 shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {step}
                            </button>
                        ))}
                        {unassigned.length === 0 && <p className="text-center text-sm text-brand-text-light">All steps assigned!</p>}
                    </div>
                 </div>

                 <div className="bg-brand-bg p-4 rounded-lg shadow-neumorphic-in">
                    <h4 className="font-bold text-center text-brand-text mb-4">Your RAG Pipeline</h4>
                    <div className="space-y-2">
                         {assigned.map((step, index) => (
                             <div key={index} className="p-3 bg-brand-bg shadow-neumorphic-out rounded-lg text-sm flex items-center animate-fade-in">
                                <span className="font-bold text-brand-primary mr-3">{index + 1}.</span> {step}
                             </div>
                         ))}
                         {!isFinished && !isAnimating && (
                            <div className="p-3 text-center text-brand-text-light text-sm border-2 border-dashed border-brand-shadow-dark/50 rounded-lg min-h-[50px] flex items-center justify-center">
                                Click a step from the left to add it here.
                            </div>
                         )}
                          {isAnimating && assigned.length < correctOrder.length && (
                             <div className="p-3 text-center text-brand-text-light text-sm border-2 border-dashed border-brand-shadow-dark/50 rounded-lg min-h-[50px] flex items-center justify-center animate-pulse">
                                Assembling...
                            </div>
                         )}
                    </div>
                 </div>
            </div>

             {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
             {isFinished && !isAnimating && (
                <div className="text-center mt-4">
                     <button onClick={handleReset} className="px-4 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Reset</button>
                </div>
            )}
        </div>
    );
};

export default RagBuilder;