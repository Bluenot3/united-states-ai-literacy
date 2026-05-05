import React, { useState } from 'react';

interface Scenario {
    id: string;
    title: string;
    description: string;
    variables: { name: string; value: string; impact: 'positive' | 'negative' | 'neutral' }[];
    preMortem?: string;
}

const SAMPLE_SCENARIOS: Scenario[] = [
    {
        id: 'base',
        title: 'Base Case',
        description: 'Current trajectory with no major changes',
        variables: [
            { name: 'Economy', value: 'Stable growth (3%)', impact: 'positive' },
            { name: 'Budget', value: 'Full allocation', impact: 'positive' },
            { name: 'Team', value: 'Current capacity', impact: 'neutral' },
            { name: 'Competition', value: 'Status quo', impact: 'neutral' }
        ]
    },
    {
        id: 'optimistic',
        title: 'Best Case',
        description: 'Everything goes right',
        variables: [
            { name: 'Economy', value: 'Strong growth (6%)', impact: 'positive' },
            { name: 'Budget', value: '+25% increase', impact: 'positive' },
            { name: 'Team', value: '+3 new hires', impact: 'positive' },
            { name: 'Competition', value: 'Major competitor exit', impact: 'positive' }
        ]
    },
    {
        id: 'pessimistic',
        title: 'Worst Case',
        description: 'Murphy\'s Law in action',
        variables: [
            { name: 'Economy', value: 'Recession (-2%)', impact: 'negative' },
            { name: 'Budget', value: '-20% cut', impact: 'negative' },
            { name: 'Team', value: 'Key departure', impact: 'negative' },
            { name: 'Competition', value: 'New entrant with funding', impact: 'negative' }
        ],
        preMortem: `PROJECT AUTOPSY REPORT - Q4 2026

WHAT FAILED:
1. Underestimated market sensitivity to economic downturn
2. Relied too heavily on single key team member
3. Didn't build contingency budget reserves
4. Ignored early warning signs from competitor intelligence

ROOT CAUSES:
• Overconfidence in baseline projections
• No scenario planning or stress testing
• Insufficient team cross-training
• Delayed decision-making when pivots were needed

LESSONS FOR NEXT TIME:
✓ Build 20% contingency into all timelines
✓ Cross-train team on critical functions
✓ Monthly scenario stress tests
✓ Define clear pivot triggers in advance`
    }
];

export const ScenarioSimulator: React.FC = () => {
    const [selectedScenario, setSelectedScenario] = useState<string>('base');
    const [showPreMortem, setShowPreMortem] = useState(false);
    const [customScenario, setCustomScenario] = useState({
        economy: 'stable',
        budget: 'full',
        team: 'current',
        competition: 'status-quo'
    });
    const [isCustom, setIsCustom] = useState(false);
    const [preMortemPrompt, setPreMortemPrompt] = useState('');
    const [generatedPreMortem, setGeneratedPreMortem] = useState<string | null>(null);

    const currentScenario = SAMPLE_SCENARIOS.find(s => s.id === selectedScenario);

    const getImpactColor = (impact: 'positive' | 'negative' | 'neutral') => {
        switch (impact) {
            case 'positive': return '#2ecc71';
            case 'negative': return '#e74c3c';
            case 'neutral': return '#f1c40f';
        }
    };

    const generatePreMortem = () => {
        // Simulate AI generation
        const template = `PROJECT AUTOPSY REPORT - Future Date

SCENARIO: ${preMortemPrompt || 'Custom scenario analysis'}

WHAT WENT WRONG:
1. Failed to anticipate market changes
2. Resource allocation was insufficient
3. Timeline was overly optimistic
4. Stakeholder alignment wasn't maintained

KEY FAILURE POINTS:
• Assumptions weren't validated early enough
• No clear ownership of risk monitoring
• Communication gaps between teams
• Delayed response to warning signs

PREVENTIVE MEASURES:
✓ Weekly assumption validation reviews
✓ Assign dedicated risk owner
✓ Establish clear escalation triggers
✓ Create decision-making framework for pivots

This pre-mortem helps you see the potential failure BEFORE it happens.`;

        setGeneratedPreMortem(template);
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: '#fff',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #e74c3c, #f39c12)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                }}>
                    🔮
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Scenario Simulator</h2>
                    <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>Pre-Mortem Analysis & Future Projection</p>
                </div>
            </div>

            {/* Scenario Selector */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px'
            }}>
                {SAMPLE_SCENARIOS.map(scenario => (
                    <button
                        key={scenario.id}
                        onClick={() => {
                            setSelectedScenario(scenario.id);
                            setIsCustom(false);
                            setShowPreMortem(false);
                        }}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: selectedScenario === scenario.id && !isCustom
                                ? scenario.id === 'optimistic'
                                    ? 'rgba(46, 204, 113, 0.2)'
                                    : scenario.id === 'pessimistic'
                                        ? 'rgba(231, 76, 60, 0.2)'
                                        : 'rgba(52, 152, 219, 0.2)'
                                : 'rgba(255,255,255,0.05)',
                            border: selectedScenario === scenario.id && !isCustom
                                ? `1px solid ${scenario.id === 'optimistic'
                                    ? 'rgba(46, 204, 113, 0.5)'
                                    : scenario.id === 'pessimistic'
                                        ? 'rgba(231, 76, 60, 0.5)'
                                        : 'rgba(52, 152, 219, 0.5)'}`
                                : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                            cursor: 'pointer',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                            {scenario.id === 'optimistic' ? '📈' : scenario.id === 'pessimistic' ? '📉' : '📊'}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{scenario.title}</div>
                    </button>
                ))}
                <button
                    onClick={() => setIsCustom(true)}
                    style={{
                        flex: 1,
                        padding: '12px',
                        background: isCustom ? 'rgba(155, 89, 182, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: isCustom ? '1px solid rgba(155, 89, 182, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        cursor: 'pointer',
                        textAlign: 'center'
                    }}
                >
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>⚙️</div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>Custom</div>
                </button>
            </div>

            {/* Scenario Details */}
            {currentScenario && !isCustom && (
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{currentScenario.title}</h3>
                    <p style={{ margin: '0 0 16px 0', fontSize: '14px', opacity: 0.7 }}>{currentScenario.description}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                        {currentScenario.variables.map((variable, index) => (
                            <div key={index} style={{
                                padding: '12px',
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '8px',
                                borderLeft: `3px solid ${getImpactColor(variable.impact)}`
                            }}>
                                <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>{variable.name}</div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: getImpactColor(variable.impact) }}>
                                    {variable.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {currentScenario.preMortem && (
                        <button
                            onClick={() => setShowPreMortem(!showPreMortem)}
                            style={{
                                marginTop: '16px',
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(231, 76, 60, 0.2)',
                                border: '1px solid rgba(231, 76, 60, 0.5)',
                                borderRadius: '8px',
                                color: '#e74c3c',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            {showPreMortem ? '📖' : '💀'} {showPreMortem ? 'Hide' : 'View'} Pre-Mortem Analysis
                        </button>
                    )}

                    {showPreMortem && currentScenario.preMortem && (
                        <div style={{
                            marginTop: '16px',
                            padding: '16px',
                            background: 'rgba(231, 76, 60, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(231, 76, 60, 0.3)',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.6
                        }}>
                            {currentScenario.preMortem}
                        </div>
                    )}
                </div>
            )}

            {/* Custom Pre-Mortem Generator */}
            {isCustom && (
                <div style={{
                    background: 'rgba(155, 89, 182, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>💀 Generate Pre-Mortem</h3>
                    <p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '16px' }}>
                        Imagine it's one year from now and your project failed catastrophically. Describe your project:
                    </p>

                    <textarea
                        placeholder="e.g., We're launching a new AI product targeting enterprise customers. Budget is $500K. Team of 8 people. Main risk is competition from established players..."
                        value={preMortemPrompt}
                        onChange={e => setPreMortemPrompt(e.target.value)}
                        style={{
                            width: '100%',
                            minHeight: '100px',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(0,0,0,0.3)',
                            color: '#fff',
                            fontSize: '14px',
                            resize: 'vertical',
                            boxSizing: 'border-box'
                        }}
                    />

                    <button
                        onClick={generatePreMortem}
                        style={{
                            marginTop: '12px',
                            width: '100%',
                            padding: '12px',
                            background: 'linear-gradient(135deg, #9b59b6, #e74c3c)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        💀 Generate Failure Autopsy
                    </button>

                    {generatedPreMortem && (
                        <div style={{
                            marginTop: '16px',
                            padding: '16px',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.6
                        }}>
                            {generatedPreMortem}
                        </div>
                    )}
                </div>
            )}

            {/* Key Insight */}
            <div style={{
                background: 'rgba(52, 152, 219, 0.1)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(52, 152, 219, 0.3)',
                fontSize: '13px'
            }}>
                <strong style={{ color: '#3498db' }}>💡 Vanguard Insight:</strong>{' '}
                The Pre-Mortem technique forces you to imagine failure BEFORE it happens,
                revealing blind spots and building contingencies while you still have time to act.
            </div>
        </div>
    );
};

export default ScenarioSimulator;
