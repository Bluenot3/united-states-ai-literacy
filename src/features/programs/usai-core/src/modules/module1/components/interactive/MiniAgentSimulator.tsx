import React, { useState, useCallback } from 'react';

interface AgentStep {
    thought: string;
    tool: string;
    observation: string;
    status: 'success' | 'error' | 'warning';
}

interface Scenario {
    title: string;
    goal: string;
    tools: string[];
    correctPath: AgentStep[];
    failureModes: { tool: string; result: string }[];
}

const scenarios: Scenario[] = [
    {
        title: 'Volunteer Onboarding',
        goal: 'Create a structured onboarding checklist for a new volunteer',
        tools: ['search_docs', 'draft_email', 'create_record', 'summarize'],
        correctPath: [
            { thought: 'I need to find the required documents for volunteer onboarding.', tool: 'search_docs', observation: 'Found: Background check form, liability waiver, training schedule, contact info form.', status: 'success' },
            { thought: 'Now I should draft a welcome email with these requirements.', tool: 'draft_email', observation: 'Email drafted: Subject "Welcome to ZEN Volunteer Team" with document checklist and training date.', status: 'success' },
            { thought: 'Finally, create a tracking record with all required fields.', tool: 'create_record', observation: 'Record created: { name, email, docs_received: [], training_date, status: "pending" }', status: 'success' },
        ],
        failureModes: [
            { tool: 'summarize', result: '⚠️ Wrong tool! "summarize" has no documents to summarize yet. The agent should search first.' },
            { tool: 'draft_email', result: '⚠️ Premature! You\'re drafting an email without knowing what documents are required. Search first.' },
        ],
    },
    {
        title: 'Meeting Notes → Action Items',
        goal: 'Extract action items from messy meeting notes and assign owners',
        tools: ['parse_text', 'extract_entities', 'create_tasks', 'send_notification'],
        correctPath: [
            { thought: 'First, parse the messy meeting notes into structured text.', tool: 'parse_text', observation: 'Parsed: 5 discussion topics, 3 decisions, 4 potential action items identified.', status: 'success' },
            { thought: 'Extract the people and tasks mentioned.', tool: 'extract_entities', observation: 'Entities: { people: ["Alex", "Jordan", "Sam"], actions: ["review contract", "update dashboard", "schedule demo", "send report"] }', status: 'success' },
            { thought: 'Create structured task records with owners and deadlines.', tool: 'create_tasks', observation: '4 tasks created with assigned owners, priorities, and deadlines.', status: 'success' },
        ],
        failureModes: [
            { tool: 'send_notification', result: '⚠️ Too early! You haven\'t extracted or created any tasks yet. Don\'t notify before the work is done.' },
            { tool: 'create_tasks', result: '⚠️ Missing step! You need to parse and extract entities first. Creating tasks from raw notes will produce garbage.' },
        ],
    },
];

const MiniAgentSimulator: React.FC<{ interactiveId: string }> = () => {
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [steps, setSteps] = useState<AgentStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedTool, setSelectedTool] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');
    const [completed, setCompleted] = useState(false);

    const scenario = scenarios[scenarioIndex];

    const reset = (i: number) => {
        setScenarioIndex(i);
        setSteps([]);
        setCurrentStep(0);
        setSelectedTool(null);
        setFeedback(null);
        setCompleted(false);
    };

    const chooseTool = useCallback((tool: string) => {
        setSelectedTool(tool);
        const correct = scenario.correctPath[currentStep];
        const failure = scenario.failureModes.find(f => f.tool === tool);

        if (correct && tool === correct.tool) {
            setSteps(prev => [...prev, correct]);
            setFeedback('✅ Correct! ' + correct.observation);
            setFeedbackType('success');
            if (currentStep + 1 >= scenario.correctPath.length) {
                setCompleted(true);
            } else {
                setCurrentStep(prev => prev + 1);
            }
        } else if (failure) {
            setFeedback(failure.result);
            setFeedbackType('error');
        } else {
            setFeedback('⚠️ Not the best choice. Think about what information you need at this step.');
            setFeedbackType('error');
        }
    }, [currentStep, scenario]);

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(239, 68, 68, 0.06) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            padding: '24px',
            fontFamily: "'Inter', sans-serif",
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '22px' }}>🤖</span>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Mini-Agent Simulator
                </h3>
            </div>

            {/* Scenario Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {scenarios.map((s, i) => (
                    <button key={i} onClick={() => reset(i)} style={{
                        flex: 1, padding: '10px', borderRadius: '8px',
                        border: `1px solid ${scenarioIndex === i ? 'rgba(251, 191, 36, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                        background: scenarioIndex === i ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.02)',
                        color: scenarioIndex === i ? '#fde68a' : '#9ca3af',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    }}>
                        {s.title}
                    </button>
                ))}
            </div>

            {/* Goal */}
            <div style={{
                padding: '12px 16px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.06)',
                marginBottom: '16px',
            }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600 }}>🎯 Agent Goal</span>
                <div style={{ fontSize: '14px', color: '#e5e7eb', marginTop: '4px' }}>{scenario.goal}</div>
            </div>

            {/* Progress */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {scenario.correctPath.map((_, i) => (
                    <div key={i} style={{
                        flex: 1, height: '4px', borderRadius: '2px',
                        background: i < steps.length ? '#10b981' : i === currentStep && !completed ? 'rgba(251, 191, 36, 0.4)' : 'rgba(255,255,255,0.05)',
                        transition: 'background 0.3s',
                    }} />
                ))}
            </div>

            {/* Completed Steps */}
            {steps.map((step, i) => (
                <div key={i} style={{
                    padding: '12px 16px',
                    background: 'rgba(16, 185, 129, 0.06)',
                    borderRadius: '10px',
                    border: '1px solid rgba(16, 185, 129, 0.15)',
                    marginBottom: '8px',
                }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Step {i + 1}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>💭 {step.thought}</div>
                    <div style={{ fontSize: '12px', color: '#6ee7b7', marginBottom: '4px' }}>🔧 Tool: <strong>{step.tool}</strong></div>
                    <div style={{ fontSize: '12px', color: '#d1d5db' }}>👁️ {step.observation}</div>
                </div>
            ))}

            {/* Tool Selection */}
            {!completed && (
                <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 600, marginBottom: '8px' }}>
                        💭 Step {currentStep + 1}: {scenario.correctPath[currentStep]?.thought || 'What should the agent do?'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Choose a tool:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {scenario.tools.map((tool) => (
                            <button
                                key={tool}
                                onClick={() => chooseTool(tool)}
                                style={{
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: `1px solid ${selectedTool === tool ? 'rgba(251, 191, 36, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                                    background: selectedTool === tool ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.02)',
                                    color: '#e5e7eb',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontFamily: 'monospace',
                                }}
                            >
                                🔧 {tool}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Feedback */}
            {feedback && (
                <div style={{
                    marginTop: '12px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: feedbackType === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    border: `1px solid ${feedbackType === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    color: feedbackType === 'success' ? '#6ee7b7' : '#fca5a5',
                    fontSize: '13px',
                    animation: 'fadeIn 0.3s ease',
                }}>
                    {feedback}
                </div>
            )}

            {/* Completed */}
            {completed && (
                <div style={{
                    marginTop: '16px',
                    textAlign: 'center',
                    padding: '14px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#6ee7b7',
                    fontWeight: 600,
                }}>
                    ✅ Agent completed the goal in {steps.length} steps!
                    <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 400, marginTop: '4px' }}>
                        The Reason → Act → Observe loop terminated successfully.
                    </div>
                </div>
            )}
        </div>
    );
};

export default MiniAgentSimulator;
