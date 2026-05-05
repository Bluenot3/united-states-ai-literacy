import React, { useState, useEffect, useRef } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

// Object definitions with their ideal feature patterns
const OBJECTS = {
    dog: { emoji: '🐶', name: 'Dog', pattern: { hasFur: true, barks: true, hasTail: true, hasEyes: true, hasWings: false, hasWheels: false, isMetallic: false, makesSound: true } },
    cat: { emoji: '🐱', name: 'Cat', pattern: { hasFur: true, barks: false, hasTail: true, hasEyes: true, hasWings: false, hasWheels: false, isMetallic: false, makesSound: true } },
    bird: { emoji: '🐦', name: 'Bird', pattern: { hasFur: false, barks: false, hasTail: true, hasEyes: true, hasWings: true, hasWheels: false, isMetallic: false, makesSound: true } },
    airplane: { emoji: '✈️', name: 'Airplane', pattern: { hasFur: false, barks: false, hasTail: true, hasEyes: false, hasWings: true, hasWheels: true, isMetallic: true, makesSound: true } },
    car: { emoji: '🚗', name: 'Car', pattern: { hasFur: false, barks: false, hasTail: false, hasEyes: false, hasWings: false, hasWheels: true, isMetallic: true, makesSound: true } },
    robot: { emoji: '🤖', name: 'Robot', pattern: { hasFur: false, barks: false, hasTail: false, hasEyes: true, hasWings: false, hasWheels: false, isMetallic: true, makesSound: true } },
};

type ObjectKey = keyof typeof OBJECTS;
type InputKey = keyof typeof OBJECTS.dog.pattern;

const INPUT_LABELS: Record<InputKey, { label: string; icon: string }> = {
    hasFur: { label: 'Has Fur', icon: '🦊' },
    barks: { label: 'Barks', icon: '🔊' },
    hasTail: { label: 'Has Tail', icon: '🦎' },
    hasEyes: { label: 'Has Eyes', icon: '👁️' },
    hasWings: { label: 'Has Wings', icon: '🪽' },
    hasWheels: { label: 'Has Wheels', icon: '🛞' },
    isMetallic: { label: 'Is Metallic', icon: '⚙️' },
    makesSound: { label: 'Makes Sound', icon: '🔔' },
};

const NeuralNetworkPlayground: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [inputs, setInputs] = useState<Record<InputKey, boolean>>({
        hasFur: false,
        barks: false,
        hasTail: false,
        hasEyes: false,
        hasWings: false,
        hasWheels: false,
        isMetallic: false,
        makesSound: false,
    });
    const [trainingMode, setTrainingMode] = useState(false);
    const [targetObject, setTargetObject] = useState<ObjectKey | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [pulseConnection, setPulseConnection] = useState<InputKey | null>(null);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    // Calculate confidence scores for each object
    const calculateScores = () => {
        const scores: Record<ObjectKey, number> = {} as Record<ObjectKey, number>;

        Object.entries(OBJECTS).forEach(([key, obj]) => {
            let matches = 0;
            let total = 0;

            Object.entries(obj.pattern).forEach(([feature, expected]) => {
                total++;
                if (inputs[feature as InputKey] === expected) {
                    matches++;
                }
            });

            scores[key as ObjectKey] = Math.round((matches / total) * 100);
        });

        return scores;
    };

    const scores = calculateScores();

    // Find best match
    const bestMatch = Object.entries(scores).reduce((best, [key, score]) => {
        if (score > best.score) return { key: key as ObjectKey, score };
        return best;
    }, { key: 'dog' as ObjectKey, score: 0 });

    // Check if training target is matched
    useEffect(() => {
        if (trainingMode && targetObject && scores[targetObject] >= 100) {
            setShowConfetti(true);
            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
            setTimeout(() => setShowConfetti(false), 2000);
        }
    }, [scores, targetObject, trainingMode]);

    const toggleInput = (key: InputKey) => {
        setPulseConnection(key);
        setTimeout(() => setPulseConnection(null), 300);

        setInputs(prev => ({ ...prev, [key]: !prev[key] }));
        if (!hasCompleted && !trainingMode) {
            addPoints(1, 2);
        }
    };

    const startTraining = (obj: ObjectKey) => {
        setTrainingMode(true);
        setTargetObject(obj);
        setInputs({
            hasFur: false, barks: false, hasTail: false, hasEyes: false,
            hasWings: false, hasWheels: false, isMetallic: false, makesSound: false,
        });
    };

    const resetSimulator = () => {
        setTrainingMode(false);
        setTargetObject(null);
        setInputs({
            hasFur: false, barks: false, hasTail: false, hasEyes: false,
            hasWings: false, hasWheels: false, isMetallic: false, makesSound: false,
        });
    };

    // Get missing features for training mode
    const getMissingFeatures = () => {
        if (!targetObject) return [];
        const pattern = OBJECTS[targetObject].pattern;
        return Object.entries(pattern)
            .filter(([key, expected]) => inputs[key as InputKey] !== expected)
            .map(([key]) => INPUT_LABELS[key as InputKey].label);
    };

    // Helper for hidden nodes (simplified viz)
    const hiddenNodes = [1, 2, 3, 4];

    return (
        <div className="my-8 p-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl relative overflow-hidden text-white">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Confetti Effect */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
                    <div className="text-6xl animate-bounce">🎉</div>
                </div>
            )}

            <div className="relative z-10 p-6">
                <h4 className="font-bold text-xl text-white mb-2 text-center flex items-center justify-center gap-2">
                    <span className="text-2xl">🧠</span> Neural Network Simulator
                </h4>
                <p className="text-center text-slate-400 mb-6 text-sm max-w-2xl mx-auto">
                    {trainingMode
                        ? `🎯 Training Mode: Match the features to identify the ${OBJECTS[targetObject!].name}!`
                        : 'Toggle input neurons to see how the network classifies different objects!'}
                </p>

                {/* Mode Toggle */}
                <div className="flex justify-center gap-3 mb-8">
                    {!trainingMode ? (
                        <div className="flex flex-wrap justify-center gap-2 bg-slate-800/50 p-2 rounded-2xl border border-slate-700">
                            <span className="text-xs font-bold text-slate-500 self-center px-2 uppercase tracking-wide">Select Target:</span>
                            {Object.entries(OBJECTS).map(([key, obj]) => (
                                <button
                                    key={key}
                                    onClick={() => startTraining(key as ObjectKey)}
                                    className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-indigo-600 text-slate-300 hover:text-white text-sm font-semibold hover:scale-105 transition-all shadow-sm"
                                >
                                    {obj.emoji} {obj.name}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <button
                            onClick={resetSimulator}
                            className="px-4 py-2 rounded-full bg-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-600 transition-colors flex items-center gap-2"
                        >
                            <span>←</span> Exit Training
                        </button>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative">

                    {/* SVG Connector Layer - Simplistic Logic for Demo */}
                    {/* In a real app, we'd calculate exact coordinates. Here we simulate the effect with CSS/SVG */}
                    <div className="absolute inset-0 pointer-events-none hidden lg:block opacity-30">
                        <svg className="w-full h-full">
                            <defs>
                                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Lines would ideally be drawn dynamically here based on node positions */}
                        </svg>
                    </div>

                    {/* Input Neurons */}
                    <div className="flex-1 w-full z-10">
                        <h5 className="text-xs font-bold text-slate-500 mb-4 text-center uppercase tracking-widest">Input Layer</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
                            {Object.entries(INPUT_LABELS).map(([key, { label, icon }]) => {
                                const isActive = inputs[key as InputKey];
                                const isPulsing = pulseConnection === key;

                                return (
                                    <button
                                        key={key}
                                        onClick={() => toggleInput(key as InputKey)}
                                        className={`
                                            relative px-3 py-3 rounded-xl border transition-all duration-300 font-semibold text-sm group overflow-hidden
                                            ${isActive
                                                ? 'bg-indigo-900/40 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'}
                                            ${isPulsing ? 'scale-105 ring-2 ring-indigo-400' : ''}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl filter drop-shadow-md">{icon}</span>
                                            <span className="text-xs">{label}</span>
                                        </div>

                                        {/* Active Indicator */}
                                        <div className={`absolute top-1/2 -right-1 w-2 h-2 rounded-full transform -translate-y-1/2 shadow-lg transition-colors duration-300 ${isActive ? 'bg-indigo-400 shadow-[0_0_8px_#6366f1]' : 'bg-slate-700'}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Hidden Layer Visualization */}
                    <div className="hidden lg:flex flex-col items-center justify-center px-8 z-10">
                        <h5 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Hidden Layer</h5>
                        <div className="flex flex-col gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                            {hiddenNodes.map((i) => {
                                const activeCount = Object.values(inputs).filter(Boolean).length;
                                const isActive = activeCount >= i * 2;
                                return (
                                    <div
                                        key={i}
                                        className={`w-12 h-12 rounded-full border-2 transition-all duration-500 flex items-center justify-center
                                            ${isActive
                                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-300 shadow-[0_0_20px_rgba(139,92,246,0.5)] scale-110'
                                                : 'bg-slate-800 border-slate-700 shadow-inner'
                                            }`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white transition-opacity duration-300 ${isActive ? 'opacity-90 animate-pulse' : 'opacity-10'}`} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Output Layer */}
                    <div className="flex-1 w-full z-10">
                        <h5 className="text-xs font-bold text-slate-500 mb-4 text-center uppercase tracking-widest">Output Layer</h5>

                        {trainingMode && targetObject ? (
                            /* Training Mode Output */
                            <div className="text-center">
                                <div className={`
                                    w-40 h-40 mx-auto rounded-3xl flex flex-col items-center justify-center border-2 transition-all duration-500
                                    ${scores[targetObject] >= 100
                                        ? 'bg-gradient-to-br from-emerald-500/20 to-green-900/20 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                                        : 'bg-slate-800/50 border-slate-700'}
                                `}>
                                    <span className="text-6xl drop-shadow-2xl filter">{OBJECTS[targetObject].emoji}</span>
                                    <span className={`text-3xl font-bold mt-2 ${scores[targetObject] >= 100 ? 'text-emerald-400' : 'text-slate-500'}`}>
                                        {scores[targetObject]}%
                                    </span>
                                </div>

                                {scores[targetObject] < 100 && (
                                    <div className="mt-6 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                        <p className="text-xs text-amber-500 font-bold uppercase tracking-wide mb-2">Missing Signals</p>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {getMissingFeatures().map(f => (
                                                <span key={f} className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-md border border-amber-500/30">
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Free Play Output */
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(OBJECTS).map(([key, obj]) => {
                                    const score = scores[key as ObjectKey];
                                    const isBest = bestMatch.key === key && score > 50;

                                    return (
                                        <div
                                            key={key}
                                            className={`
                                                relative p-3 rounded-xl border transition-all duration-300
                                                ${isBest
                                                    ? 'bg-gradient-to-br from-emerald-900/40 to-green-800/40 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                                    : 'bg-slate-800/30 border-slate-700/50'}
                                            `}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-2xl">{obj.emoji}</span>
                                                <span className={`text-xs font-bold ${isBest ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                    {score}%
                                                </span>
                                            </div>

                                            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${isBest ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                                                        : score > 60 ? 'bg-indigo-500'
                                                            : 'bg-slate-600'
                                                        }`}
                                                    style={{ width: `${score}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Educational Footer */}
                <div className="mt-8 pt-4 border-t border-slate-700/50 text-center">
                    <p className="text-xs text-slate-500 max-w-xl mx-auto">
                        <strong className="text-indigo-400">Deep Learning Insight:</strong> Neural networks learn to recognize patterns by adjusting the weights of connections between neurons. Stronger connections signal distinct features!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NeuralNetworkPlayground;
