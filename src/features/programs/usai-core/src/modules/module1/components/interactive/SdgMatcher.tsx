import React, { useState } from 'react';

const goals = [
  { id: 4, name: 'Quality Education' },
  { id: 9, name: 'Industry, Innovation & Infrastructure' },
  { id: 11, name: 'Sustainable Cities & Communities' },
  { id: 13, name: 'Climate Action' },
];

const projects = [
  { text: "AI tools for personalized learning", goalId: 4 },
  { text: "Sensors for monitoring pollution", goalId: 13 },
  { text: "Smart traffic management systems", goalId: 11 },
  { text: "Robotics for automating manufacturing", goalId: 9 },
].sort(() => Math.random() - 0.5);

const SdgMatcher: React.FC = () => {
    const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleMatch = (goalId: number) => {
        if(feedback) return; // Prevent multiple clicks

        if (projects[currentProjectIndex].goalId === goalId) {
            setFeedback('Correct!');
            setScore(score + 1);
        } else {
            const correctGoal = goals.find(g => g.id === projects[currentProjectIndex].goalId)?.name;
            setFeedback(`Not quite. This project aligns with ${correctGoal}.`);
        }
        
        setTimeout(() => {
            setFeedback('');
            if (currentProjectIndex < projects.length - 1) {
                setCurrentProjectIndex(currentProjectIndex + 1);
            } else {
                 setCurrentProjectIndex(0); // Loop back
                 setScore(0);
                 setFeedback('Quiz reset. Try again!');
            }
        }, 2000);
    };

    return(
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="text-center mb-6">
                <p className="text-brand-text-light">Project Idea:</p>
                <h4 className="font-bold text-xl text-brand-text">{projects[currentProjectIndex].text}</h4>
                <p className="mt-2 text-sm text-brand-text-light">Match it to the correct UN Sustainable Development Goal below.</p>
                <p className="font-bold text-lg mt-2">Score: {score}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {goals.map(goal => (
                    <button
                        key={goal.id}
                        onClick={() => handleMatch(goal.id)}
                        disabled={!!feedback}
                        className="p-4 rounded-lg transition-all duration-200 shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50 text-center"
                    >
                        <span className="font-bold text-2xl text-brand-primary">{goal.id}</span>
                        <p className="text-sm mt-1">{goal.name}</p>
                    </button>
                ))}
            </div>

            {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
        </div>
    )
}

export default SdgMatcher;
