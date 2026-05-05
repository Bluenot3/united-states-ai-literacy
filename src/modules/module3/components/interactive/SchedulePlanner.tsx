import React, { useState } from 'react';

const activities = [
    "Morning Mindfulness",
    "Core Instruction",
    "Applied Practice",
    "Lunch & Break",
    "Project Time",
    "Reflection"
].sort(() => Math.random() - 0.5); // Randomize order

const correctOrder = [
    "Morning Mindfulness",
    "Core Instruction",
    "Applied Practice",
    "Lunch & Break",
    "Project Time",
    "Reflection"
];

const SchedulePlanner: React.FC = () => {
    const [unplanned, setUnplanned] = useState<string[]>(activities);
    const [planned, setPlanned] = useState<string[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string>('');
    
    const handleSelect = (activity: string) => {
        setSelected(activity);
        setFeedback('');
    }

    const handlePlan = () => {
        if(!selected) {
            setFeedback('Select an activity to plan.');
            return;
        }

        const currentIndex = planned.length;
        if(correctOrder[currentIndex] === selected) {
            setPlanned([...planned, selected]);
            setUnplanned(unplanned.filter(a => a !== selected));
            setSelected(null);
            if(currentIndex + 1 === correctOrder.length) {
                setFeedback('Great job! You planned the day perfectly.');
            }
        } else {
            setFeedback(`That's not the right next step. Think about what comes after "${planned[currentIndex-1] || 'the start of the day'}".`);
        }
    }
    
    const handleReset = () => {
        setUnplanned(activities);
        setPlanned([]);
        setSelected(null);
        setFeedback('');
    }
    
    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <h4 className="font-bold text-center text-brand-text mb-4">Activities to Plan</h4>
                    <div className="flex flex-col gap-2">
                        {unplanned.map(activity => (
                             <button
                                key={activity}
                                onClick={() => handleSelect(activity)}
                                className={`p-3 text-sm rounded-lg text-left transition-all duration-200 ${selected === activity ? 'shadow-neumorphic-in text-brand-primary' : 'shadow-neumorphic-out'}`}
                            >
                                {activity}
                            </button>
                        ))}
                    </div>
                 </div>

                 <div onClick={handlePlan} className="bg-brand-bg p-4 rounded-lg shadow-neumorphic-in cursor-pointer">
                    <h4 className="font-bold text-center text-brand-text mb-4">Daily Schedule</h4>
                    <div className="space-y-2">
                         {planned.map((activity, index) => (
                             <div key={index} className="p-3 bg-brand-bg shadow-neumorphic-out rounded-lg text-sm flex items-center">
                                <span className="font-bold text-brand-primary mr-3">{index + 1}.</span> {activity}
                             </div>
                         ))}
                         {unplanned.length > 0 && planned.length < correctOrder.length && <div className="p-3 text-center text-brand-text-light text-sm border-2 border-dashed border-brand-shadow-dark/50 rounded-lg">Click to add selected activity</div>}
                    </div>
                 </div>
            </div>

             {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
             {planned.length === correctOrder.length && (
                <div className="text-center mt-4">
                     <button onClick={handleReset} className="px-4 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Reset</button>
                </div>
            )}
        </div>
    );
};

export default SchedulePlanner;
