import React, { useState, useEffect } from 'react';

interface TimeBlock {
    id: string;
    hour: number;
    activity: string;
    decisionType: 'trivial' | 'important' | 'critical';
    energyCost: number;
    icon: string;
}

const INITIAL_SCHEDULE: TimeBlock[] = [
    { id: '1', hour: 6, activity: 'Wake up - What to wear?', decisionType: 'trivial', energyCost: 5, icon: '👕' },
    { id: '2', hour: 7, activity: 'Breakfast - What to eat?', decisionType: 'trivial', energyCost: 5, icon: '🥣' },
    { id: '3', hour: 8, activity: 'Email triage - 47 messages', decisionType: 'important', energyCost: 15, icon: '📧' },
    { id: '4', hour: 9, activity: 'Meeting: Which vendor to hire?', decisionType: 'critical', energyCost: 25, icon: '🤝' },
    { id: '5', hour: 10, activity: 'Report review - format choices', decisionType: 'trivial', energyCost: 8, icon: '📄' },
    { id: '6', hour: 11, activity: 'Lunch plans - where to go?', decisionType: 'trivial', energyCost: 5, icon: '🍽️' },
    { id: '7', hour: 12, activity: 'Team conflict resolution', decisionType: 'critical', energyCost: 30, icon: '⚔️' },
    { id: '8', hour: 13, activity: 'Calendar Tetris - scheduling', decisionType: 'trivial', energyCost: 10, icon: '📅' },
    { id: '9', hour: 14, activity: 'Product roadmap prioritization', decisionType: 'critical', energyCost: 25, icon: '🗺️' },
    { id: '10', hour: 15, activity: 'Meeting: Accept or decline?', decisionType: 'trivial', energyCost: 5, icon: '❓' },
    { id: '11', hour: 16, activity: 'Budget approval decision', decisionType: 'critical', energyCost: 20, icon: '💰' },
    { id: '12', hour: 17, activity: 'Delegate tasks or do yourself?', decisionType: 'important', energyCost: 15, icon: '🎯' }
];

const AUTOMATION_OPTIONS: Record<string, { solution: string; icon: string }> = {
    'What to wear?': { solution: 'Pre-planned outfit system', icon: '🎽' },
    'What to eat?': { solution: 'Meal prep automation', icon: '🍱' },
    'Email triage': { solution: 'AI inbox sorter', icon: '🤖' },
    'format choices': { solution: 'Template library', icon: '📋' },
    'where to go?': { solution: 'Auto-rotation schedule', icon: '🔄' },
    'scheduling': { solution: 'AI calendar optimizer', icon: '⚡' },
    'Accept or decline?': { solution: 'Meeting criteria filter', icon: '🚦' }
};

export const DecisionFatigueMeter: React.FC = () => {
    const [schedule, setSchedule] = useState<TimeBlock[]>(INITIAL_SCHEDULE);
    const [currentHour, setCurrentHour] = useState(6);
    const [energy, setEnergy] = useState(100);
    const [automatedDecisions, setAutomatedDecisions] = useState<string[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [pulseEnergy, setPulseEnergy] = useState(false);

    const getDecisionColor = (type: TimeBlock['decisionType']) => {
        switch (type) {
            case 'trivial': return { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', text: '#fbbf24' };
            case 'important': return { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)', text: '#60a5fa' };
            case 'critical': return { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)', text: '#f87171' };
        }
    };

    const getEnergyGradient = (energy: number) => {
        if (energy > 60) return 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
        if (energy > 30) return 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
        return 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)';
    };

    const canAutomate = (activity: string) => {
        return Object.keys(AUTOMATION_OPTIONS).some(key => activity.includes(key));
    };

    const getAutomationSuggestion = (activity: string) => {
        const key = Object.keys(AUTOMATION_OPTIONS).find(k => activity.includes(k));
        return key ? AUTOMATION_OPTIONS[key] : null;
    };

    const handleAutomate = (blockId: string) => {
        const block = schedule.find(b => b.id === blockId);
        if (!block) return;

        setAutomatedDecisions(prev => [...prev, blockId]);
        setSchedule(prev => prev.map(b =>
            b.id === blockId
                ? { ...b, decisionType: 'trivial' as const, energyCost: 1 }
                : b
        ));
    };

    const simulateDay = () => {
        setIsSimulating(true);
        setCurrentHour(6);
        setEnergy(100);

        let hour = 6;
        const interval = setInterval(() => {
            if (hour >= 17) {
                setIsSimulating(false);
                clearInterval(interval);
                return;
            }

            const block = schedule.find(b => b.hour === hour);
            if (block) {
                const cost = automatedDecisions.includes(block.id) ? 1 : block.energyCost;
                setEnergy(prev => {
                    setPulseEnergy(true);
                    setTimeout(() => setPulseEnergy(false), 300);
                    return Math.max(0, prev - cost);
                });
            }

            hour++;
            setCurrentHour(hour);
        }, 600);
    };

    const resetSimulation = () => {
        setCurrentHour(6);
        setEnergy(100);
        setIsSimulating(false);
    };

    const totalSaved = automatedDecisions.reduce((acc, id) => {
        const original = INITIAL_SCHEDULE.find(b => b.id === id);
        return acc + (original ? original.energyCost - 1 : 0);
    }, 0);

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
            <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Header */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    boxShadow: '0 10px 40px rgba(239, 68, 68, 0.3)'
                }}>
                    🔋
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #fff 0%, #fca5a5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Decision Fatigue Meter
                    </h2>
                    <p style={{ margin: '4px 0 0 0', opacity: 0.7, fontSize: '14px', fontWeight: 500 }}>
                        Visualize your cognitive battery throughout the day
                    </p>
                </div>
            </div>

            {/* Energy Display */}
            <div style={{
                ...glassStyle,
                borderRadius: '20px',
                padding: '24px',
                marginBottom: '24px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px' }}>⚡</span>
                        <span style={{ fontSize: '16px', fontWeight: 700 }}>Cognitive Battery</span>
                    </div>
                    <div style={{
                        fontSize: '36px',
                        fontWeight: 800,
                        background: getEnergyGradient(energy),
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        transform: pulseEnergy ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.2s'
                    }}>
                        {energy}%
                    </div>
                </div>

                {/* Battery Bar */}
                <div style={{
                    height: '32px',
                    background: 'rgba(0,0,0,0.4)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div style={{
                        width: `${energy}%`,
                        height: '100%',
                        background: getEnergyGradient(energy),
                        borderRadius: '16px',
                        transition: 'width 0.5s ease-out, background 0.3s',
                        boxShadow: `0 0 20px ${energy > 60 ? 'rgba(16, 185, 129, 0.5)' : energy > 30 ? 'rgba(245, 158, 11, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`
                    }} />
                    {/* Battery segments */}
                    {[...Array(10)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            left: `${(i + 1) * 10}%`,
                            top: 0,
                            bottom: 0,
                            width: '2px',
                            background: 'rgba(0,0,0,0.3)'
                        }} />
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', opacity: 0.6 }}>
                    <span>⚡ Full Focus Zone</span>
                    <span>😴 Decision Paralysis</span>
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                    { label: 'Automated', value: automatedDecisions.length, icon: '🤖', color: '#10b981' },
                    { label: 'Energy Saved', value: `${totalSaved}%`, icon: '💪', color: '#3b82f6' },
                    { label: 'Current Time', value: `${currentHour}:00`, icon: '🕐', color: '#8b5cf6' }
                ].map((stat, i) => (
                    <div key={i} style={{
                        ...glassStyle,
                        borderRadius: '14px',
                        padding: '16px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                        <div style={{ fontSize: '28px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: '11px', opacity: 0.6, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Timeline */}
            <div style={{
                ...glassStyle,
                borderRadius: '16px',
                padding: '16px',
                maxHeight: '320px',
                overflowY: 'auto',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {schedule.map(block => {
                        const isActive = block.hour === currentHour && isSimulating;
                        const isPast = block.hour < currentHour;
                        const isAutomated = automatedDecisions.includes(block.id);
                        const suggestion = getAutomationSuggestion(block.activity);
                        const colors = getDecisionColor(block.decisionType);

                        return (
                            <div
                                key={block.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    padding: '14px 16px',
                                    background: isActive
                                        ? 'rgba(255, 255, 255, 0.1)'
                                        : isPast
                                            ? 'rgba(0,0,0,0.2)'
                                            : 'rgba(255,255,255,0.02)',
                                    borderRadius: '12px',
                                    opacity: isPast ? 0.5 : 1,
                                    border: isActive ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                                    transition: 'all 0.3s',
                                    transform: isActive ? 'scale(1.02)' : 'scale(1)'
                                }}
                            >
                                {/* Time */}
                                <div style={{
                                    width: '50px',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    opacity: 0.7,
                                    fontFamily: 'monospace'
                                }}>
                                    {block.hour}:00
                                </div>

                                {/* Icon */}
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    background: isAutomated ? 'rgba(16, 185, 129, 0.2)' : colors.bg,
                                    border: `1px solid ${isAutomated ? 'rgba(16, 185, 129, 0.4)' : colors.border}`
                                }}>
                                    {isAutomated ? '🤖' : block.icon}
                                </div>

                                {/* Activity */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 500 }}>
                                        {block.activity}
                                    </div>
                                    {isAutomated && suggestion && (
                                        <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>
                                            {suggestion.icon} {suggestion.solution}
                                        </div>
                                    )}
                                </div>

                                {/* Energy Cost */}
                                <div style={{
                                    fontSize: '13px',
                                    padding: '4px 10px',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    background: isAutomated ? 'rgba(16, 185, 129, 0.2)' : colors.bg,
                                    color: isAutomated ? '#10b981' : colors.text
                                }}>
                                    -{isAutomated ? 1 : block.energyCost}%
                                </div>

                                {/* Automate Button */}
                                {!isAutomated && canAutomate(block.activity) && !isPast && (
                                    <button
                                        onClick={() => handleAutomate(block.id)}
                                        style={{
                                            padding: '6px 12px',
                                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
                                            border: '1px solid rgba(16, 185, 129, 0.4)',
                                            borderRadius: '8px',
                                            color: '#10b981',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ⚡ Automate
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    onClick={simulateDay}
                    disabled={isSimulating}
                    style={{
                        flex: 1,
                        padding: '16px',
                        background: isSimulating
                            ? 'rgba(255,255,255,0.1)'
                            : 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                        border: 'none',
                        borderRadius: '14px',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: 700,
                        cursor: isSimulating ? 'not-allowed' : 'pointer',
                        boxShadow: isSimulating ? 'none' : '0 10px 30px rgba(59, 130, 246, 0.3)'
                    }}
                >
                    {isSimulating ? '⏳ Simulating Day...' : '▶️ Simulate Your Day'}
                </button>
                <button
                    onClick={resetSimulation}
                    style={{
                        padding: '16px 24px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '14px',
                        color: '#fff',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    🔄 Reset
                </button>
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                gap: '20px',
                marginTop: '20px',
                justifyContent: 'center',
                fontSize: '12px'
            }}>
                {[
                    { type: 'trivial', label: 'Trivial', colors: getDecisionColor('trivial') },
                    { type: 'important', label: 'Important', colors: getDecisionColor('important') },
                    { type: 'critical', label: 'Critical', colors: getDecisionColor('critical') },
                    { type: 'automated', label: 'Automated', colors: { text: '#10b981', bg: 'rgba(16,185,129,0.2)' } }
                ].map(item => (
                    <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '4px',
                            background: item.colors.bg,
                            border: `1px solid ${item.colors.text}40`
                        }} />
                        <span style={{ opacity: 0.7, fontWeight: 500 }}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DecisionFatigueMeter;
