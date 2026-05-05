
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { InteractiveComponentProps } from '../../types';
import { CheckIcon } from '../icons/CheckIcon';

const STAGES = [
    { id: 'dev', label: 'Development', icon: '🌱', desc: 'Designing responsibilities, writing identity, connecting tools.' },
    { id: 'test', label: 'Testing', icon: '🧪', desc: 'Accuracy, Safety, Load, and Adversarial tests in a sandbox.' },
    { id: 'gov', label: 'Governance', icon: '🏛️', desc: 'Policy checks, risk classification, approval workflows.' },
    { id: 'deploy', label: 'Deployment', icon: '🚀', desc: 'Release to production, live monitoring, CI/CD automation.' }
];

const QUIZ_QUESTIONS = [
    {
        q: "Which command is used to create an image from a Dockerfile?",
        options: ["docker run", "docker build", "docker push", "docker create"],
        answer: "docker build"
    },
    {
        q: "What is the primary purpose of the 'Governance' stage?",
        options: ["To write code faster", "To optimize server costs", "To ensure compliance and safety", "To market the agent"],
        answer: "To ensure compliance and safety"
    },
    {
        q: "In CI/CD, what does 'CD' usually stand for?",
        options: ["Continuous Data", "Continuous Deployment", "Code Debugging", "Central Distribution"],
        answer: "Continuous Deployment"
    }
];

const SIMULATION_SCENARIOS = [
    {
        id: 1,
        name: "Agent v1.2 Release",
        logs: [
            { type: 'pass', msg: 'Unit Tests: 142/142 Passed' },
            { type: 'pass', msg: 'Security Scan: Clean' },
            { type: 'fail', msg: 'Policy Check: Agent attempted to access restricted HR database.' }
        ],
        shouldPass: false
    },
    {
        id: 2,
        name: "Hotfix v1.2.1",
        logs: [
            { type: 'pass', msg: 'Unit Tests: 145/145 Passed' },
            { type: 'pass', msg: 'Security Scan: Clean' },
            { type: 'pass', msg: 'Policy Check: All tool scopes verified.' }
        ],
        shouldPass: true
    }
];

const AgentCiCdPipeline: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [mode, setMode] = useState<'learn' | 'sim' | 'quiz'>('learn');
    
    // Learn State
    const [activeStage, setActiveStage] = useState(0);

    // Sim State
    const [simIndex, setSimIndex] = useState(0);
    const [simFeedback, setSimFeedback] = useState('');
    const [simComplete, setSimComplete] = useState(false);

    // Quiz State
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    // -- Handlers --

    const handleSimDecision = (approved: boolean) => {
        const scenario = SIMULATION_SCENARIOS[simIndex];
        if (approved === scenario.shouldPass) {
            setSimFeedback('Correct Decision! ✅');
            setTimeout(() => {
                if (simIndex < SIMULATION_SCENARIOS.length - 1) {
                    setSimIndex(prev => prev + 1);
                    setSimFeedback('');
                } else {
                    setSimComplete(true);
                    if (!user?.progress.completedInteractives.includes(interactiveId)) {
                        addPoints(15);
                    }
                }
            }, 1500);
        } else {
            setSimFeedback(approved ? '❌ Error: You deployed a risky agent!' : '❌ Error: You blocked a safe update!');
        }
    };

    const handleQuizAnswer = (option: string) => {
        if (selectedOption) return;
        setSelectedOption(option);
        
        if (option === QUIZ_QUESTIONS[quizIndex].answer) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            if (quizIndex < QUIZ_QUESTIONS.length - 1) {
                setQuizIndex(prev => prev + 1);
                setSelectedOption(null);
            } else {
                setQuizComplete(true);
                if (user && !user.progress.completedInteractives.includes(interactiveId)) {
                    addPoints(25);
                    updateProgress(interactiveId, 'interactive');
                }
            }
        }, 1200);
    };

    return (
        <div className="my-8 p-1 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 shadow-neumorphic-out border border-white/60 backdrop-blur-md">
            <div className="bg-brand-bg/95 rounded-[22px] overflow-hidden min-h-[500px] flex flex-col">
                
                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-200">
                    <button onClick={() => setMode('learn')} className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${mode === 'learn' ? 'bg-brand-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Learning Mode</button>
                    <button onClick={() => setMode('sim')} className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${mode === 'sim' ? 'bg-brand-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Simulation</button>
                    <button onClick={() => setMode('quiz')} className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${mode === 'quiz' ? 'bg-brand-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Quiz</button>
                </div>

                <div className="p-8 flex-grow">
                    
                    {/* --- LEARNING MODE --- */}
                    {mode === 'learn' && (
                        <div className="h-full flex flex-col justify-center">
                            <h4 className="text-xl font-bold text-brand-text mb-8 text-center">The Agent Lifecycle Pipeline</h4>
                            
                            {/* Pipeline Graphic */}
                            <div className="flex items-center justify-between relative mb-12 px-4">
                                {/* Connecting Line */}
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 rounded-full"></div>
                                
                                {STAGES.map((stage, i) => (
                                    <button 
                                        key={stage.id} 
                                        onClick={() => setActiveStage(i)}
                                        className={`relative flex flex-col items-center group transition-transform duration-300 ${activeStage === i ? 'scale-110' : 'hover:scale-105'}`}
                                    >
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 transition-all duration-300 z-10 ${activeStage === i ? 'bg-white border-brand-primary' : 'bg-gray-100 border-white text-gray-400 grayscale'}`}>
                                            {stage.icon}
                                        </div>
                                        <div className={`mt-3 font-bold text-sm bg-white px-3 py-1 rounded-full shadow-sm border transition-colors ${activeStage === i ? 'text-brand-primary border-brand-primary' : 'text-gray-500 border-gray-200'}`}>
                                            {stage.label}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Stage Details */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center animate-fade-in">
                                <h5 className="text-2xl font-bold text-brand-text mb-2">{STAGES[activeStage].label}</h5>
                                <p className="text-brand-text-light text-lg">{STAGES[activeStage].desc}</p>
                            </div>
                        </div>
                    )}

                    {/* --- SIMULATION MODE --- */}
                    {mode === 'sim' && !simComplete && (
                        <div className="max-w-md mx-auto">
                            <h4 className="text-xl font-bold text-brand-text mb-6 text-center">Governance Check: {SIMULATION_SCENARIOS[simIndex].name}</h4>
                            
                            <div className="bg-slate-900 rounded-xl p-5 mb-6 font-mono text-sm shadow-inner">
                                {SIMULATION_SCENARIOS[simIndex].logs.map((log, i) => (
                                    <div key={i} className={`mb-2 flex items-start gap-2 ${log.type === 'pass' ? 'text-green-400' : 'text-red-400'}`}>
                                        <span>{log.type === 'pass' ? '✓' : '✗'}</span>
                                        <span>{log.msg}</span>
                                    </div>
                                ))}
                            </div>

                            {simFeedback ? (
                                <div className={`text-center font-bold text-lg mb-6 ${simFeedback.includes('Correct') ? 'text-green-600' : 'text-red-500'}`}>
                                    {simFeedback}
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => handleSimDecision(false)}
                                        className="flex-1 py-3 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 transition-colors"
                                    >
                                        Reject
                                    </button>
                                    <button 
                                        onClick={() => handleSimDecision(true)}
                                        className="flex-1 py-3 bg-green-100 text-green-700 font-bold rounded-xl hover:bg-green-200 transition-colors"
                                    >
                                        Approve
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {mode === 'sim' && simComplete && (
                        <div className="text-center py-10">
                            <div className="text-6xl mb-4">🏆</div>
                            <h4 className="text-2xl font-bold text-brand-text mb-2">Governance Certification Complete!</h4>
                            <p className="text-gray-500">You successfully managed the release pipeline.</p>
                            <button onClick={() => { setSimIndex(0); setSimComplete(false); }} className="mt-6 px-6 py-2 bg-gray-100 rounded-lg text-gray-600 font-bold hover:bg-gray-200">Replay</button>
                        </div>
                    )}

                    {/* --- QUIZ MODE --- */}
                    {mode === 'quiz' && !quizComplete && (
                        <div className="max-w-lg mx-auto">
                            <div className="mb-2 flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <span>Question {quizIndex + 1}/{QUIZ_QUESTIONS.length}</span>
                                <span>Score: {score}</span>
                            </div>
                            
                            <h4 className="text-xl font-bold text-brand-text mb-6">{QUIZ_QUESTIONS[quizIndex].q}</h4>
                            
                            <div className="space-y-3">
                                {QUIZ_QUESTIONS[quizIndex].options.map((option) => {
                                    const isSelected = selectedOption === option;
                                    const isCorrect = option === QUIZ_QUESTIONS[quizIndex].answer;
                                    
                                    let btnClass = "bg-white border-gray-200 hover:border-brand-primary hover:shadow-md";
                                    if (selectedOption) {
                                        if (isCorrect) btnClass = "bg-green-100 border-green-300 text-green-800";
                                        else if (isSelected) btnClass = "bg-red-100 border-red-300 text-red-800";
                                        else btnClass = "bg-gray-50 border-gray-100 text-gray-400 opacity-50";
                                    }

                                    return (
                                        <button 
                                            key={option} 
                                            onClick={() => handleQuizAnswer(option)}
                                            disabled={!!selectedOption}
                                            className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all duration-300 ${btnClass}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                {option}
                                                {selectedOption && isCorrect && <CheckIcon />}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {mode === 'quiz' && quizComplete && (
                        <div className="text-center py-10">
                            <div className="text-6xl mb-4">🎓</div>
                            <h4 className="text-2xl font-bold text-brand-text mb-2">Pipeline Quiz Complete</h4>
                            <p className="text-xl text-brand-primary font-black mb-4">{score} / {QUIZ_QUESTIONS.length} Correct</p>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">You've demonstrated a solid understanding of how AI agents move from code to production.</p>
                            <button onClick={() => { setQuizIndex(0); setScore(0); setQuizComplete(false); setSelectedOption(null); }} className="mt-6 px-6 py-2 bg-gray-100 rounded-lg text-gray-600 font-bold hover:bg-gray-200">Retake Quiz</button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AgentCiCdPipeline;
