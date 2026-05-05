import React, { useState } from 'react';

interface BiasScenario {
    id: string;
    title: string;
    situation: string;
    icon: string;
    options: { text: string; biasType: string | null; explanation: string }[];
    correctIndex: number;
}

const SCENARIOS: BiasScenario[] = [
    {
        id: '1',
        title: 'The Expensive Software',
        icon: '💻',
        situation: 'Your company spent $500,000 on new software that isn\'t working well. The vendor offers to fix it for another $200,000, or you can switch to a competitor\'s proven solution for $150,000.',
        options: [
            {
                text: 'Pay the extra $200K - we\'ve already invested too much to switch now.',
                biasType: 'Sunk Cost Fallacy',
                explanation: '⚠️ The $500K is already spent and cannot be recovered. This decision should be based on future value, not past investment.'
            },
            {
                text: 'Switch to the competitor - it\'s cheaper and proven to work.',
                biasType: null,
                explanation: '✅ Correct! This evaluates options based on future outcomes, ignoring sunk costs.'
            },
            {
                text: 'Do nothing and hope it gets better.',
                biasType: 'Status Quo Bias',
                explanation: '⚠️ Avoiding action because change feels risky is a cognitive trap.'
            }
        ],
        correctIndex: 1
    },
    {
        id: '2',
        title: 'The New Hire Decision',
        icon: '👥',
        situation: 'You\'re hiring a senior developer. Candidate A has 10 years of traditional experience. Candidate B just finished a bootcamp but showed exceptional problem-solving in the interview. Your last 3 hires were experienced developers.',
        options: [
            {
                text: 'Hire Candidate A - experience is what matters most.',
                biasType: 'Confirmation Bias',
                explanation: '⚠️ You may be favoring data that confirms your existing belief that experience = quality.'
            },
            {
                text: 'Hire Candidate B - the interview performance was undeniable.',
                biasType: null,
                explanation: '✅ Correct! Evaluating based on demonstrated ability rather than assumptions.'
            },
            {
                text: 'Hire both to be safe.',
                biasType: 'Loss Aversion',
                explanation: '⚠️ Fear of making the wrong choice is driving an inefficient decision.'
            }
        ],
        correctIndex: 1
    },
    {
        id: '3',
        title: 'The Market Crash',
        icon: '📉',
        situation: 'The market dropped 15% last week. You\'re reviewing your investment portfolio. A financial advisor suggests buying more stocks while they\'re cheap, but you just read 5 articles about further crashes.',
        options: [
            {
                text: 'Sell everything - those articles can\'t all be wrong.',
                biasType: 'Recency Bias',
                explanation: '⚠️ You\'re overweighting recent information and news over long-term data.'
            },
            {
                text: 'Follow the advisor\'s data-driven analysis.',
                biasType: null,
                explanation: '✅ Correct! Making decisions based on systematic analysis rather than recent headlines.'
            },
            {
                text: 'Wait and see what happens next week.',
                biasType: 'Analysis Paralysis',
                explanation: '⚠️ Delaying decisions due to uncertainty can be as costly as making the wrong one.'
            }
        ],
        correctIndex: 1
    },
    {
        id: '4',
        title: 'The Project Pivot',
        icon: '🔄',
        situation: 'Your 6-month project has been going well, but new market research shows customer preferences have shifted. Your team lead suggests pivoting, but your CEO loves the current direction.',
        options: [
            {
                text: 'Stay the course - the CEO knows best and we\'re almost done.',
                biasType: 'Authority Bias',
                explanation: '⚠️ Deferring to authority rather than evaluating the data objectively.'
            },
            {
                text: 'Present the market research and recommend a pivot discussion.',
                biasType: null,
                explanation: '✅ Correct! Using evidence to drive decisions, regardless of who favors which option.'
            },
            {
                text: 'Finish the project but start a backup project secretly.',
                biasType: 'Anchoring Bias',
                explanation: '⚠️ You\'re anchored to the original plan while hedging inefficiently.'
            }
        ],
        correctIndex: 1
    }
];

const BIAS_INFO: Record<string, { icon: string; color: string }> = {
    'Sunk Cost Fallacy': { icon: '💸', color: '#ef4444' },
    'Confirmation Bias': { icon: '🔍', color: '#f59e0b' },
    'Recency Bias': { icon: '📰', color: '#8b5cf6' },
    'Authority Bias': { icon: '👔', color: '#3b82f6' },
    'Status Quo Bias': { icon: '🛋️', color: '#10b981' },
    'Loss Aversion': { icon: '😰', color: '#ec4899' },
    'Anchoring Bias': { icon: '⚓', color: '#06b6d4' },
    'Analysis Paralysis': { icon: '🤔', color: '#6366f1' }
};

export const CognitiveBiasDetector: React.FC = () => {
    const [currentScenario, setCurrentScenario] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);

    const scenario = SCENARIOS[currentScenario];

    const handleSelect = (index: number) => {
        if (showResult) return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;
        setShowResult(true);
        if (selectedOption === scenario.correctIndex) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentScenario < SCENARIOS.length - 1) {
            setCurrentScenario(prev => prev + 1);
            setSelectedOption(null);
            setShowResult(false);
        } else {
            setCompleted(true);
        }
    };

    const resetQuiz = () => {
        setCurrentScenario(0);
        setSelectedOption(null);
        setShowResult(false);
        setScore(0);
        setCompleted(false);
    };

    const glassStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
    };

    return (
        <div style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0d1b2a 100%)',
            borderRadius: '24px',
            padding: '32px',
            color: '#fff',
            fontFamily: "'Inter', system-ui, sans-serif",
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
            {/* Gradient Orbs */}
            <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Header */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)'
                }}>
                    🧠
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #fff 0%, #fcd34d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Cognitive Bias Detector
                    </h2>
                    <p style={{ margin: '4px 0 0 0', opacity: 0.7, fontSize: '14px', fontWeight: 500 }}>
                        Spot the mental traps in professional decisions
                    </p>
                </div>
                <div style={{
                    ...glassStyle,
                    padding: '12px 20px',
                    borderRadius: '14px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {score}/{SCENARIOS.length}
                    </div>
                    <div style={{ fontSize: '10px', opacity: 0.6, fontWeight: 600, letterSpacing: '1px' }}>SCORE</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
                {SCENARIOS.map((_, index) => (
                    <div
                        key={index}
                        style={{
                            flex: 1,
                            height: '6px',
                            borderRadius: '3px',
                            background: index < currentScenario
                                ? 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)'
                                : index === currentScenario
                                    ? 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)'
                                    : 'rgba(255,255,255,0.1)',
                            boxShadow: index <= currentScenario ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none'
                        }}
                    />
                ))}
            </div>

            {completed ? (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 40px',
                    ...glassStyle,
                    borderRadius: '20px',
                    border: `1px solid ${score >= 3 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                }}>
                    <div style={{ fontSize: '72px', marginBottom: '20px' }}>
                        {score >= 3 ? '🏆' : score >= 2 ? '📊' : '📚'}
                    </div>
                    <h3 style={{
                        margin: '0 0 12px 0',
                        fontSize: '28px',
                        fontWeight: 800,
                        background: score >= 3
                            ? 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
                            : 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {score >= 3 ? 'Excellent Bias Detection!' : 'Keep Practicing!'}
                    </h3>
                    <p style={{ opacity: 0.7, fontSize: '16px', marginBottom: '24px' }}>
                        You correctly identified {score} out of {SCENARIOS.length} bias-free decisions.
                    </p>
                    <button
                        onClick={resetQuiz}
                        style={{
                            padding: '14px 32px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
                        }}
                    >
                        🔄 Try Again
                    </button>
                </div>
            ) : (
                <>
                    {/* Scenario Card */}
                    <div style={{
                        ...glassStyle,
                        borderRadius: '20px',
                        padding: '24px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px'
                            }}>
                                {scenario.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', opacity: 0.6, fontWeight: 600, letterSpacing: '1px', marginBottom: '2px' }}>
                                    SCENARIO {currentScenario + 1} OF {SCENARIOS.length}
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: 700 }}>{scenario.title}</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '15px', lineHeight: 1.7, opacity: 0.9, margin: 0 }}>
                            {scenario.situation}
                        </p>
                    </div>

                    {/* Options */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '13px', opacity: 0.6, marginBottom: '14px', fontWeight: 600 }}>
                            Which response avoids cognitive bias?
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {scenario.options.map((option, index) => {
                                const isSelected = selectedOption === index;
                                const isCorrect = showResult && index === scenario.correctIndex;
                                const isWrong = showResult && isSelected && index !== scenario.correctIndex;
                                const biasInfo = option.biasType ? BIAS_INFO[option.biasType] : null;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleSelect(index)}
                                        style={{
                                            padding: '18px 20px',
                                            ...glassStyle,
                                            borderRadius: '14px',
                                            cursor: showResult ? 'default' : 'pointer',
                                            transition: 'all 0.3s',
                                            transform: isSelected && !showResult ? 'scale(1.01)' : 'scale(1)',
                                            background: isCorrect
                                                ? 'rgba(16, 185, 129, 0.15)'
                                                : isWrong
                                                    ? 'rgba(239, 68, 68, 0.15)'
                                                    : isSelected
                                                        ? 'rgba(59, 130, 246, 0.15)'
                                                        : 'rgba(255,255,255,0.03)',
                                            border: `1px solid ${isCorrect
                                                ? 'rgba(16, 185, 129, 0.4)'
                                                : isWrong
                                                    ? 'rgba(239, 68, 68, 0.4)'
                                                    : isSelected
                                                        ? 'rgba(59, 130, 246, 0.4)'
                                                        : 'rgba(255,255,255,0.08)'}`,
                                            boxShadow: isCorrect
                                                ? '0 0 20px rgba(16, 185, 129, 0.2)'
                                                : isWrong
                                                    ? '0 0 20px rgba(239, 68, 68, 0.2)'
                                                    : 'none'
                                        }}
                                    >
                                        <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
                                            {option.text}
                                        </div>
                                        {showResult && (
                                            <div style={{
                                                marginTop: '14px',
                                                paddingTop: '14px',
                                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                                fontSize: '13px'
                                            }}>
                                                {option.biasType && biasInfo && (
                                                    <div style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '4px 12px',
                                                        background: `${biasInfo.color}20`,
                                                        borderRadius: '20px',
                                                        marginBottom: '8px',
                                                        fontSize: '12px',
                                                        fontWeight: 600,
                                                        color: biasInfo.color
                                                    }}>
                                                        {biasInfo.icon} {option.biasType}
                                                    </div>
                                                )}
                                                <div style={{ opacity: 0.9, lineHeight: 1.6 }}>{option.explanation}</div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Button */}
                    {!showResult ? (
                        <button
                            onClick={handleSubmit}
                            disabled={selectedOption === null}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: selectedOption !== null
                                    ? 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)'
                                    : 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '14px',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: 700,
                                cursor: selectedOption !== null ? 'pointer' : 'not-allowed',
                                opacity: selectedOption !== null ? 1 : 0.5,
                                boxShadow: selectedOption !== null ? '0 10px 30px rgba(139, 92, 246, 0.3)' : 'none'
                            }}
                        >
                            Check My Answer
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                border: 'none',
                                borderRadius: '14px',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
                            }}
                        >
                            {currentScenario < SCENARIOS.length - 1 ? 'Next Scenario →' : 'See Results'}
                        </button>
                    )}
                </>
            )}

            {/* Bias Reference Footer */}
            <div style={{
                marginTop: '24px',
                padding: '14px',
                ...glassStyle,
                borderRadius: '12px',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <span style={{ fontSize: '12px', opacity: 0.6, fontWeight: 600 }}>Common Biases:</span>
                {Object.entries(BIAS_INFO).slice(0, 4).map(([name, info]) => (
                    <span key={name} style={{
                        padding: '4px 10px',
                        background: `${info.color}15`,
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: info.color
                    }}>
                        {info.icon} {name}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default CognitiveBiasDetector;
