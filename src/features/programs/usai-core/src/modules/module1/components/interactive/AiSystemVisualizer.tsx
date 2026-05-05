
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';

const steps = [
    { id: 1, title: 'The World (Data)', icon: '🌍', desc: 'Books, Code, Articles, and Images from the internet.' },
    { id: 2, title: 'Training', icon: '⚙️', desc: 'Massive computers find patterns in the data (months of work).' },
    { id: 3, title: 'The Model', icon: '🧠', desc: 'A compressed "brain" of parameters (file size: ~100GB).' },
    { id: 4, title: 'Inference', icon: '⚡', desc: 'You ask a question, and the model predicts the answer (milliseconds).' }
];

const AiSystemVisualizer: React.FC<InteractiveComponentProps> = () => {
    const [activeStep, setActiveStep] = useState<number | null>(null);

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-6 text-center">The AI Pipeline: From Data to Intelligence</h4>
            
            <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-8 left-0 right-0 h-1 bg-slate-200 -z-10 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-brand-primary/20 animate-shimmer" style={{ backgroundSize: '50% 100%' }}></div>
                </div>

                <div className="flex justify-between items-start gap-2">
                    {steps.map((step, index) => (
                        <div 
                            key={step.id} 
                            className="flex flex-col items-center group cursor-pointer"
                            onMouseEnter={() => setActiveStep(step.id)}
                            onMouseLeave={() => setActiveStep(null)}
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-neumorphic-out transition-all duration-300 z-10 
                                ${activeStep === step.id ? 'bg-brand-primary text-white scale-110 shadow-glowing' : 'bg-brand-bg text-brand-text'}
                            `}>
                                {step.icon}
                            </div>
                            <p className={`mt-3 text-xs md:text-sm font-bold text-center transition-colors ${activeStep === step.id ? 'text-brand-primary' : 'text-brand-text-light'}`}>
                                {step.title}
                            </p>
                            
                            {/* Animated Particle moving to next step */}
                            {index < steps.length - 1 && (
                                <div className="absolute top-8 h-2 w-2 rounded-full bg-brand-primary animate-float" 
                                     style={{ 
                                         left: `${(index / (steps.length - 1)) * 100}%`, 
                                         animation: `flow 2s linear infinite`,
                                         animationDelay: `${index * 0.5}s`,
                                         opacity: 0
                                     }}
                                ></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[100px] flex flex-col justify-center items-center text-center transition-all duration-300">
                {activeStep ? (
                    <div className="animate-fade-in">
                        <h5 className="font-bold text-brand-primary text-lg mb-1">{steps[activeStep - 1].title}</h5>
                        <p className="text-brand-text-light">{steps[activeStep - 1].desc}</p>
                    </div>
                ) : (
                    <p className="text-brand-text-light/50 italic">Hover over a step to see how it works.</p>
                )}
            </div>
            
            <style>{`
                @keyframes flow {
                    0% { transform: translateX(0); opacity: 1; }
                    100% { transform: translateX(100px); opacity: 0; } 
                }
            `}</style>
        </div>
    );
};

export default AiSystemVisualizer;
