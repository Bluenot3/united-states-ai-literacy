import React, { useState } from 'react';

interface Option {
    id: string;
    name: string;
    scores: Record<string, number>;
}

interface Criterion {
    id: string;
    name: string;
    weight: number;
    icon: string;
}

const SAMPLE_CRITERIA: Criterion[] = [
    { id: 'cost', name: 'Cost', weight: 0.25, icon: '💰' },
    { id: 'speed', name: 'Speed', weight: 0.30, icon: '⚡' },
    { id: 'quality', name: 'Quality', weight: 0.25, icon: '✨' },
    { id: 'risk', name: 'Low Risk', weight: 0.20, icon: '🛡️' }
];

const SAMPLE_OPTIONS: Option[] = [
    { id: 'vendor-a', name: 'Vendor A', scores: { cost: 8, speed: 6, quality: 9, risk: 7 } },
    { id: 'vendor-b', name: 'Vendor B', scores: { cost: 6, speed: 9, quality: 7, risk: 5 } },
    { id: 'vendor-c', name: 'Vendor C', scores: { cost: 9, speed: 5, quality: 6, risk: 9 } }
];

export const DecisionMatrixCalculator: React.FC = () => {
    const [decisionTopic, setDecisionTopic] = useState('Which vendor to hire?');
    const [criteria, setCriteria] = useState<Criterion[]>(SAMPLE_CRITERIA);
    const [options, setOptions] = useState<Option[]>(SAMPLE_OPTIONS);
    const [newOptionName, setNewOptionName] = useState('');
    const [newCriterionName, setNewCriterionName] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [animateResult, setAnimateResult] = useState(false);

    const calculateScore = (option: Option): number => {
        return criteria.reduce((total, criterion) => {
            const score = option.scores[criterion.id] || 0;
            return total + (score * criterion.weight);
        }, 0);
    };

    const getWinner = () => {
        let maxScore = -1;
        let winner: Option | null = null;
        options.forEach(opt => {
            const score = calculateScore(opt);
            if (score > maxScore) {
                maxScore = score;
                winner = opt;
            }
        });
        return winner;
    };

    const handleWeightChange = (criterionId: string, newWeight: number) => {
        setCriteria(prev => {
            const updated = prev.map(c =>
                c.id === criterionId ? { ...c, weight: newWeight } : c
            );
            const total = updated.reduce((sum, c) => sum + c.weight, 0);
            return updated.map(c => ({ ...c, weight: c.weight / total }));
        });
        setAnimateResult(true);
        setTimeout(() => setAnimateResult(false), 500);
    };

    const handleScoreChange = (optionId: string, criterionId: string, score: number) => {
        setOptions(prev => prev.map(opt =>
            opt.id === optionId
                ? { ...opt, scores: { ...opt.scores, [criterionId]: score } }
                : opt
        ));
        setAnimateResult(true);
        setTimeout(() => setAnimateResult(false), 500);
    };

    const addOption = () => {
        if (!newOptionName.trim()) return;
        const newOption: Option = {
            id: `opt-${Date.now()}`,
            name: newOptionName,
            scores: criteria.reduce((acc, c) => ({ ...acc, [c.id]: 5 }), {})
        };
        setOptions(prev => [...prev, newOption]);
        setNewOptionName('');
    };

    const winner = getWinner();
    const sortedOptions = [...options].sort((a, b) => calculateScore(b) - calculateScore(a));
    const maxScore = Math.max(...options.map(o => calculateScore(o)));

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
            <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Header */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)'
                }}>
                    ⚖️
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Weighted Decision Matrix
                    </h2>
                    <input
                        type="text"
                        value={decisionTopic}
                        onChange={e => setDecisionTopic(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px dashed rgba(255,255,255,0.3)',
                            color: '#fff',
                            opacity: 0.7,
                            fontSize: '14px',
                            padding: '4px 0',
                            width: '100%',
                            fontWeight: 500
                        }}
                    />
                </div>
            </div>

            {/* Criteria Weights */}
            <div style={{
                ...glassStyle,
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>📊</span>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, letterSpacing: '0.5px', color: '#a5b4fc' }}>CRITERIA & WEIGHTS</h4>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {criteria.map(criterion => (
                        <div key={criterion.id} style={{
                            padding: '16px',
                            background: 'rgba(139, 92, 246, 0.1)',
                            borderRadius: '14px',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{criterion.icon}</div>
                            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{criterion.name}</div>
                            <input
                                type="range"
                                min="0.05"
                                max="0.5"
                                step="0.05"
                                value={criterion.weight}
                                onChange={e => handleWeightChange(criterion.id, parseFloat(e.target.value))}
                                style={{ width: '100%', accentColor: '#8b5cf6' }}
                            />
                            <div style={{
                                fontSize: '18px',
                                fontWeight: 800,
                                marginTop: '8px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {Math.round(criterion.weight * 100)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Options Matrix */}
            <div style={{
                ...glassStyle,
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>🎯</span>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, letterSpacing: '0.5px', color: '#60a5fa' }}>OPTIONS & SCORES</h4>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            placeholder="New option..."
                            value={newOptionName}
                            onChange={e => setNewOptionName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addOption()}
                            style={{
                                padding: '8px 14px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.15)',
                                background: 'rgba(0,0,0,0.4)',
                                color: '#fff',
                                fontSize: '13px',
                                width: '140px'
                            }}
                        />
                        <button
                            onClick={addOption}
                            style={{
                                padding: '8px 16px',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            + Add
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sortedOptions.map((option, index) => {
                        const score = calculateScore(option);
                        const isWinner = option.id === winner?.id;
                        const barWidth = (score / 10) * 100;

                        return (
                            <div key={option.id} style={{
                                padding: '16px',
                                background: isWinner ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                                borderRadius: '14px',
                                border: `1px solid ${isWinner ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Background Score Bar */}
                                <div style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    height: '100%',
                                    width: `${barWidth}%`,
                                    background: isWinner
                                        ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
                                        : 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.02) 100%)',
                                    transition: 'width 0.5s ease-out',
                                    pointerEvents: 'none'
                                }} />

                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    {/* Rank */}
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '10px',
                                        background: isWinner
                                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                            : 'rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        fontWeight: 700
                                    }}>
                                        {isWinner ? '🏆' : index + 1}
                                    </div>

                                    {/* Name */}
                                    <div style={{ width: '100px', fontWeight: 600, fontSize: '15px' }}>
                                        {option.name}
                                    </div>

                                    {/* Score Inputs */}
                                    <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                                        {criteria.map(c => (
                                            <div key={c.id} style={{ flex: 1, textAlign: 'center' }}>
                                                <div style={{ fontSize: '10px', opacity: 0.5, marginBottom: '4px' }}>{c.icon}</div>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={option.scores[c.id] || 5}
                                                    onChange={e => handleScoreChange(option.id, c.id, parseInt(e.target.value) || 5)}
                                                    style={{
                                                        width: '48px',
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        border: '1px solid rgba(255,255,255,0.15)',
                                                        background: 'rgba(0,0,0,0.4)',
                                                        color: '#fff',
                                                        textAlign: 'center',
                                                        fontSize: '14px',
                                                        fontWeight: 600
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total Score */}
                                    <div style={{
                                        textAlign: 'right',
                                        minWidth: '80px',
                                        transform: animateResult ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'transform 0.2s'
                                    }}>
                                        <div style={{ fontSize: '10px', opacity: 0.5, marginBottom: '4px' }}>SCORE</div>
                                        <div style={{
                                            fontSize: '22px',
                                            fontWeight: 800,
                                            background: isWinner
                                                ? 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
                                                : 'linear-gradient(135deg, #60a5fa 0%, #a5b4fc 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}>
                                            {score.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Winner Result */}
            {winner && (
                <div style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
                    borderRadius: '20px',
                    padding: '28px',
                    textAlign: 'center',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Glow Effect */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
                        pointerEvents: 'none'
                    }} />

                    <div style={{ position: 'relative' }}>
                        <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '8px', fontWeight: 600, letterSpacing: '2px' }}>
                            OPTIMAL CHOICE BASED ON WEIGHTED ANALYSIS
                        </div>
                        <div style={{
                            fontSize: '32px',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '8px'
                        }}>
                            🏆 {winner.name}
                        </div>
                        <div style={{ fontSize: '18px', opacity: 0.8 }}>
                            Score: <strong>{calculateScore(winner).toFixed(2)}</strong> / 10
                        </div>

                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            style={{
                                marginTop: '16px',
                                padding: '10px 20px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '10px',
                                color: '#fff',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: 600
                            }}
                        >
                            {showDetails ? '📖 Hide' : '🔍 Show'} Calculation Breakdown
                        </button>

                        {showDetails && (
                            <div style={{
                                marginTop: '20px',
                                padding: '16px',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '12px',
                                textAlign: 'left',
                                fontFamily: 'monospace',
                                fontSize: '13px',
                                lineHeight: 1.8
                            }}>
                                {criteria.map(c => {
                                    const rawScore = winner.scores[c.id] || 0;
                                    const weighted = rawScore * c.weight;
                                    return (
                                        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{c.icon} {c.name}:</span>
                                            <span style={{ color: '#60a5fa' }}>{rawScore} × {(c.weight * 100).toFixed(0)}% = <strong>{weighted.toFixed(2)}</strong></span>
                                        </div>
                                    );
                                })}
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 700, color: '#10b981' }}>Total:</span>
                                    <span style={{ fontWeight: 700, color: '#10b981' }}>{calculateScore(winner).toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DecisionMatrixCalculator;
