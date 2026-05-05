
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';

const steps = [
    { id: 'plan', label: 'Plan', icon: '📝', detail: 'The AI reasons about the task and decomposes it into sub-goals.' },
    { id: 'tool', label: 'Tool', icon: '🛠️', detail: 'The AI selects a specialized tool: Search, Calculator, or API call.' },
    { id: 'action', label: 'Action', icon: '✅', detail: 'The AI executes the call and observes the result to iterate.' }
];

const AgenticWorkflowViz: React.FC<InteractiveComponentProps> = () => {
    const [active, setActive] = useState(0);

    return (
        <div className="my-10 p-8 bg-brand-bg rounded-3xl shadow-neumorphic-out relative overflow-hidden">
            <h4 className="text-center font-black text-brand-text text-xl mb-8 uppercase tracking-widest">The Agentic Reasoning Loop</h4>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
                {/* Connector Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-0 hidden md:block"></div>
                
                {steps.map((s, i) => (
                    <div 
                        key={s.id} 
                        className={`flex flex-col items-center z-10 cursor-pointer transition-all duration-500 w-full md:w-1/3
                            ${active === i ? 'scale-110' : 'opacity-60 grayscale scale-95'}
                        `}
                        onClick={() => setActive(i)}
                    >
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-neumorphic-out 
                            ${active === i ? 'bg-brand-primary text-white shadow-glowing' : 'bg-white text-slate-400'}
                        `}>
                            {s.icon}
                        </div>
                        <h5 className={`mt-4 font-black text-lg ${active === i ? 'text-brand-primary' : 'text-slate-500'}`}>
                            {s.label}
                        </h5>
                    </div>
                ))}
            </div>

            <div className="mt-10 p-6 bg-white rounded-2xl shadow-inner-sm text-center min-h-[100px] flex flex-col justify-center animate-fade-in border border-slate-100">
                <p className="text-brand-text text-lg font-bold mb-1">"{steps[active].label}" Phase</p>
                <p className="text-brand-text-light leading-relaxed">{steps[active].detail}</p>
            </div>
            
            <div className="mt-6 flex justify-center gap-2">
                {steps.map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${active === i ? 'bg-brand-primary w-8' : 'bg-slate-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default AgenticWorkflowViz;
