import React, { useState } from 'react';

const scenarios = [
    { id: 1, text: 'Benevolent Assistant', votes: 45 },
    { id: 2, text: 'Mass Job Displacement', votes: 25 },
    { id: 3, text: 'Uncontrollable Superintelligence', votes: 15 },
    { id: 4, text: 'A Tool with Limited Impact', votes: 15 },
];

const FutureScenarioPoll: React.FC = () => {
    const [voted, setVoted] = useState(false);
    
    const handleVote = () => {
        setVoted(true);
    }
    
    const handleReset = () => {
        setVoted(false);
    }

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            {!voted ? (
                <div className="space-y-3">
                    {scenarios.map(scenario => (
                        <button
                            key={scenario.id}
                            onClick={handleVote}
                            className="w-full p-4 rounded-lg text-left transition-all duration-200 shadow-neumorphic-out hover:shadow-neumorphic-in hover:text-brand-primary"
                        >
                            {scenario.text}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="animate-fade-in">
                    <h4 className="font-bold text-center text-brand-text mb-4">Community Poll Results</h4>
                    <div className="space-y-4">
                        {scenarios.map(scenario => (
                            <div key={scenario.id}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-semibold text-brand-text">{scenario.text}</span>
                                    <span className="text-sm font-bold text-brand-primary">{scenario.votes}%</span>
                                </div>
                                <div className="w-full bg-brand-bg shadow-neumorphic-in rounded-full h-4">
                                    <div 
                                        className="bg-gradient-to-r from-brand-secondary to-brand-primary h-4 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${scenario.votes}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="text-center mt-6">
                        <button onClick={handleReset} className="px-4 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Vote Again</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FutureScenarioPoll;
