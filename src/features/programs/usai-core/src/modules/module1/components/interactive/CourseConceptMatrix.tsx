
import React from 'react';
import type { InteractiveComponentProps } from '../../types';

const pillars = [
    {
        title: 'Architecture',
        icon: '🏗️',
        desc: 'Understand the neural blueprints: Layers, weights, and the breakthrough Transformer architecture.',
        color: 'border-blue-400'
    },
    {
        title: 'Generative Power',
        icon: '🎨',
        desc: 'Master the engines of creation: Denoising diffusion, token prediction, and high-fidelity media synthesis.',
        color: 'border-purple-400'
    },
    {
        title: 'Agentic Flow',
        icon: '🤖',
        desc: 'Beyond chatting: Build autonomous agents that plan, use tools, and execute complex business logic.',
        color: 'border-orange-400'
    },
    {
        title: 'Ethical Moats',
        icon: '⚖️',
        desc: 'Responsibility as a feature: Navigate bias, safety, and alignment to build trustworthy AI systems.',
        color: 'border-green-400'
    }
];

const CourseConceptMatrix: React.FC<InteractiveComponentProps> = () => {
    return (
        <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((p, i) => (
                <div 
                    key={i} 
                    className={`bg-white p-6 rounded-2xl border-l-8 ${p.color} shadow-neumorphic-out transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-xl group`}
                >
                    <div className="text-4xl mb-4 transition-transform group-hover:scale-110">{p.icon}</div>
                    <h4 className="text-xl font-black text-brand-text mb-2 tracking-tight uppercase">{p.title}</h4>
                    <p className="text-brand-text-light leading-relaxed font-medium">{p.desc}</p>
                </div>
            ))}
        </div>
    );
};

export default CourseConceptMatrix;
