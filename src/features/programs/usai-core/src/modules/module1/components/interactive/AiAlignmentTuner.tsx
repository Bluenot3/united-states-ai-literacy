import React, { useState } from 'react';

const PaperclipIcon: React.FC = () => <span role="img" aria-label="paperclip">📎</span>;
const EarthIcon: React.FC = () => <span role="img" aria-label="earth">🌍</span>;

const AiAlignmentTuner: React.FC = () => {
    const [goal, setGoal] = useState(50); // 0-100
    const [constraint, setConstraint] = useState(50); // 0-100

    const getOutcome = () => {
        const score = goal - constraint;
        if (score > 40) return { text: "Catastrophe! The AI has converted the world into paperclips.", color: "text-red-500", icon: <PaperclipIcon /> };
        if (score > 10) return { text: "Warning: The AI is over-optimizing for its goal at the expense of other values.", color: "text-pale-yellow", icon: <PaperclipIcon /> };
        if (score < -30) return { text: "Ineffective: The AI is too constrained to achieve its goal.", color: "text-brand-text-light", icon: <EarthIcon />};
        return { text: "Aligned: The AI is effectively achieving its goal while respecting constraints.", color: "text-pale-green", icon: <EarthIcon /> };
    };
    
    const outcome = getOutcome();

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">AI Alignment Simulator</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="goal" className="block text-center text-brand-text-light mb-2">Goal: Maximize Paperclips <span className="font-bold text-brand-text">{goal}%</span></label>
                        <input
                            id="goal"
                            type="range"
                            min="0"
                            max="100"
                            value={goal}
                            onChange={(e) => setGoal(parseInt(e.target.value))}
                            className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in"
                        />
                    </div>
                     <div>
                        <label htmlFor="constraint" className="block text-center text-brand-text-light mb-2">Constraint: Preserve Human Values <span className="font-bold text-brand-text">{constraint}%</span></label>
                        <input
                            id="constraint"
                            type="range"
                            min="0"
                            max="100"
                            value={constraint}
                            onChange={(e) => setConstraint(parseInt(e.target.value))}
                            className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in"
                        />
                    </div>
                </div>
                
                <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in text-center h-full flex flex-col justify-center">
                    <p className="font-semibold text-brand-text mb-2">Outcome:</p>
                    <div className="text-6xl my-2 transform transition-transform duration-500" style={{ transform: `scale(${1 + (goal - constraint) / 200})`}}>
                        {outcome.icon}
                    </div>
                    <p className={`font-bold ${outcome.color}`}>{outcome.text}</p>
                </div>
            </div>
        </div>
    );
};

export default AiAlignmentTuner;
