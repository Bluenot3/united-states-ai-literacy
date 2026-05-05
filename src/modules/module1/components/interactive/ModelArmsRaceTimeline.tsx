import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';

const events = [
    { year: 2018, name: 'BERT', description: 'Google releases BERT, revolutionizing natural language understanding with transformers.' },
    { year: 2020, name: 'GPT-3', description: 'OpenAI releases GPT-3, showcasing impressive few-shot learning capabilities and sparking widespread interest.' },
    { year: 2022, name: 'Stable Diffusion', description: 'Stability AI releases Stable Diffusion, making high-quality open-source image generation widely accessible.' },
    { year: 2023, name: 'Gemini 1.0', description: 'Google DeepMind announces Gemini, a natively multimodal model with Pro, Ultra, and Nano sizes.' },
    { year: 2024, name: 'Gemini 2.5 Pro & Flash', description: 'Google releases Gemini 2.5 series, with a massive context window and enhanced performance for complex reasoning tasks.' },
];

const ModelArmsRaceTimeline: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const [selectedYear, setSelectedYear] = useState(2024);

    const selectedEvent = events.find(e => e.year === selectedYear) || events[events.length - 1];

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Model "Arms Race" Timeline</h4>
            
            <div className="relative px-4">
                {/* Timeline Line */}
                <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-1 bg-brand-bg shadow-neumorphic-in rounded-full"></div>
                
                {/* Timeline Buttons */}
                <div className="relative flex justify-between">
                    {events.map(event => (
                        <button 
                            key={event.year} 
                            onClick={() => setSelectedYear(event.year)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                ${selectedYear === event.year 
                                    ? 'bg-brand-primary text-white scale-110 shadow-md' 
                                    : 'bg-brand-bg shadow-neumorphic-out'}`}
                        >
                           <span className="text-xs font-bold -rotate-45">{event.year}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in text-center min-h-[120px] flex flex-col justify-center animate-fade-in">
                <h5 className="font-bold text-xl text-brand-primary">{selectedEvent.name} ({selectedEvent.year})</h5>
                <p className="text-brand-text-light mt-2">{selectedEvent.description}</p>
            </div>
        </div>
    );
};

export default ModelArmsRaceTimeline;