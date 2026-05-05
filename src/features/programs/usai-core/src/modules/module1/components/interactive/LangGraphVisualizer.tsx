import React, { useState } from 'react';

const nodes = [
    { id: 'start', name: 'Start', description: "The task is initiated: 'Research and write a blog post about AI in healthcare.'" },
    { id: 'planner', name: 'Planner Agent', description: "The Planner breaks down the task into steps: 1. Research current trends. 2. Draft the post. 3. Review and edit." },
    { id: 'researcher', name: 'Researcher Agent', description: "The Researcher executes step 1, gathering information from simulated web sources." },
    { id: 'writer', name: 'Writer Agent', description: "The Writer takes the research and executes step 2, drafting the blog post." },
    { id: 'reviewer', name: 'Reviewer Agent', description: "The Reviewer checks the draft for accuracy and clarity, executing step 3." },
    { id: 'end', name: 'End', description: "The final, reviewed blog post is complete and ready for publishing." },
];

const LangGraphVisualizer: React.FC = () => {
    const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
    const isFinished = currentNodeIndex === nodes.length - 1;

    const handleNext = () => {
        if (!isFinished) {
            setCurrentNodeIndex(prev => prev + 1);
        }
    };
    
    const handleReset = () => {
        setCurrentNodeIndex(0);
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">LangGraph State Visualizer</h4>
            <div className="flex justify-center items-center gap-2 md:gap-4 mb-6 text-xs md:text-sm font-semibold">
                {nodes.map((node, index) => (
                    <React.Fragment key={node.id}>
                        <div className={`p-2 md:px-4 md:py-3 rounded-lg text-center transition-all duration-300 ${currentNodeIndex >= index ? 'shadow-neumorphic-in text-brand-primary' : 'shadow-neumorphic-out text-brand-text-light'}`}>
                            {node.name}
                        </div>
                        {index < nodes.length - 1 && <div className={`w-4 h-1 rounded-full ${currentNodeIndex > index ? 'bg-brand-primary' : 'bg-brand-shadow-dark/50'}`}></div>}
                    </React.Fragment>
                ))}
            </div>
            <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[80px] flex items-center justify-center text-center">
                <p className="text-brand-text-light">{nodes[currentNodeIndex].description}</p>
            </div>
            <div className="text-center mt-6">
                 <button 
                    onClick={isFinished ? handleReset : handleNext} 
                    className="px-6 py-2 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in"
                >
                    {isFinished ? 'Reset' : 'Next Step'}
                </button>
            </div>
        </div>
    );
};

export default LangGraphVisualizer;
