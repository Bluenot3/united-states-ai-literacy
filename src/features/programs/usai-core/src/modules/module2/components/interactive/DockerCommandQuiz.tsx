import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { InteractiveComponentProps } from '../../types';

const questions = [
    {
        question: "Which command is used to create an image from a Dockerfile?",
        options: ["docker run", "docker build", "docker push", "docker create"],
        answer: "docker build"
    },
    {
        question: "How do you run a command in a new container?",
        options: ["docker exec", "docker start", "docker run", "docker commit"],
        answer: "docker run"
    },
    {
        question: "What command lists all running containers?",
        options: ["docker list", "docker images", "docker ps", "docker containers"],
        answer: "docker ps"
    }
];

const DockerCommandQuiz: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedback, setFeedback] = useState('');
    const [isFinished, setIsFinished] = useState(false);

    const handleOptionSelect = (option: string) => {
        if(selectedOption) return;

        setSelectedOption(option);
        if (option === questions[currentQuestionIndex].answer) {
            setFeedback('Correct!');
            setScore(score + 1);
        } else {
            setFeedback(`Wrong! The correct answer is ${questions[currentQuestionIndex].answer}.`);
        }
    };
    
    const handleNext = () => {
        setFeedback('');
        setSelectedOption(null);
        if(currentQuestionIndex < questions.length - 1){
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            if (user && !user.progress.completedInteractives.includes(interactiveId)) {
                const points = (score + (selectedOption === questions[currentQuestionIndex].answer ? 1 : 0)) * 10;
                addPoints(points);
                updateProgress(interactiveId, 'interactive');
            }
            setIsFinished(true);
        }
    }

    const handleReset = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedOption(null);
        setFeedback('');
        setIsFinished(false);
    }

    if(isFinished) {
        return (
            <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out text-center">
                <h4 className="font-bold text-xl text-brand-text mb-4">Quiz Complete!</h4>
                <p className="text-lg text-brand-text-light">Your final score is: {score} out of {questions.length}</p>
                 {!user?.progress.completedInteractives.includes(interactiveId) &&
                    <p className="font-semibold text-pale-green">You earned {score * 10} points!</p>
                }
                <button onClick={handleReset} className="mt-4 px-6 py-2 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Restart Quiz</button>
            </div>
        )
    }

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2">Question {currentQuestionIndex + 1}/{questions.length}</h4>
            <p className="text-brand-text-light mb-6">{questions[currentQuestionIndex].question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestionIndex].options.map(option => (
                    <button 
                        key={option}
                        onClick={() => handleOptionSelect(option)}
                        className={`p-4 rounded-lg text-left transition-all duration-200 
                            ${!selectedOption ? 'shadow-neumorphic-out hover:shadow-neumorphic-in' : ''}
                            ${selectedOption === option && option === questions[currentQuestionIndex].answer ? 'shadow-neumorphic-in bg-pale-green/20 text-green-800' : ''}
                            ${selectedOption === option && option !== questions[currentQuestionIndex].answer ? 'shadow-neumorphic-in bg-red-500/20 text-red-800' : ''}
                            ${selectedOption && option !== selectedOption ? 'opacity-50' : ''}
                        `}
                        disabled={!!selectedOption}
                    >
                        {option}
                    </button>
                ))}
            </div>
             {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
             {selectedOption && <div className="text-center mt-4"><button onClick={handleNext} className="px-6 py-2 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Next</button></div>}
        </div>
    );
};

export default DockerCommandQuiz;
