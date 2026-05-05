
import React from 'react';
import type { InteractiveComponentProps } from '../../types';

const kitModules = [
  { id: '1', title: 'The Architect', focus: 'AI Foundations', sub: 'Learn the "Brain" of the Machine.' },
  { id: '2', title: 'The Creator', focus: 'Generative Media', sub: 'Design Art, Music, & Code.' },
  { id: '3', title: 'The Operator', focus: 'Agentic Workflows', sub: 'Automate Business & Operations.' },
  { id: '4', title: 'The Pioneer', focus: 'Web3 & Identity', sub: 'Decentralized Intelligence & Ownership.' }
];

const HomeschoolKitRoadmap: React.FC<InteractiveComponentProps> = () => {
    return (
        <div className="my-12 relative overflow-hidden">
            <h4 className="text-2xl font-black text-brand-text mb-8 text-center uppercase italic tracking-tighter">Your Journey Map</h4>
            <div className="flex flex-col space-y-4">
                {kitModules.map((m, i) => (
                    <div key={m.id} className="flex gap-4 items-center group">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white shadow-lg transition-transform group-hover:rotate-12
                            ${i === 0 ? 'bg-brand-primary' : 'bg-slate-300'}
                        `}>
                            {m.id}
                        </div>
                        <div className={`flex-grow p-4 rounded-xl shadow-neumorphic-out border-l-4 transition-all group-hover:translate-x-2
                            ${i === 0 ? 'border-brand-primary bg-white' : 'border-slate-200 bg-brand-bg/50'}
                        `}>
                            <h5 className="font-black text-brand-text uppercase text-sm tracking-widest">{m.title}</h5>
                            <p className="text-brand-text font-bold text-lg">{m.focus}</p>
                            <p className="text-brand-text-light text-sm">{m.sub}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeschoolKitRoadmap;
