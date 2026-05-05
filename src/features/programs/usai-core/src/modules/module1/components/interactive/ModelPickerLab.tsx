import React, { useState } from 'react';

interface Scenario {
    title: string;
    description: string;
    requirements: { label: string; value: string }[];
    correctChoice: string;
    reasoning: string;
}

interface ModelOption {
    name: string;
    tier: string;
    color: string;
    speed: string;
    cost: string;
    contextWindow: string;
    strengths: string[];
}

const models: ModelOption[] = [
    { name: 'Fast / Cheap', tier: 'lite', color: '#34d399', speed: '< 1s', cost: '$0.15/1M tokens', contextWindow: '128K', strengths: ['Classification', 'Simple extraction', 'High-volume tasks', 'Low latency apps'] },
    { name: 'Balanced', tier: 'mid', color: '#fbbf24', speed: '1-5s', cost: '$2.50/1M tokens', contextWindow: '128K', strengths: ['General purpose', 'Content generation', 'Analysis', 'Code assistance'] },
    { name: 'Deep Reasoning', tier: 'premium', color: '#f87171', speed: '10-60s', cost: '$15-60/1M tokens', contextWindow: '200K', strengths: ['Complex reasoning', 'Multi-step analysis', 'Math/science', 'Code architecture'] },
];

const scenarios: Scenario[] = [
    {
        title: 'Auto-Categorize Support Tickets',
        description: '10,000 incoming support tickets per day need to be classified into 15 categories. Latency must be < 2 seconds.',
        requirements: [{ label: 'Volume', value: '10K/day' }, { label: 'Latency', value: '< 2s' }, { label: 'Task', value: 'Classification' }, { label: 'Accuracy', value: '90%+' }],
        correctChoice: 'lite',
        reasoning: 'Classification is a simple, well-defined task. The fast/cheap tier handles it easily with low latency. Using a premium model here would be 100x more expensive for negligible accuracy improvement.',
    },
    {
        title: 'Legal Contract Analysis',
        description: 'Analyze 50-page legal contracts to identify risks, obligations, and missing clauses. Accuracy is critical — mistakes could cost millions.',
        requirements: [{ label: 'Volume', value: '10/day' }, { label: 'Latency', value: 'Flexible' }, { label: 'Task', value: 'Complex analysis' }, { label: 'Stakes', value: 'Very high' }],
        correctChoice: 'premium',
        reasoning: 'High-stakes, complex reasoning task with low volume. The cost of a premium model ($15-60/1M tokens on 10 docs) is negligible compared to the cost of missing a contractual risk. Speed doesn\'t matter — accuracy does.',
    },
    {
        title: 'Customer-Facing Chatbot',
        description: 'Build a chatbot for a SaaS product that answers product questions and troubleshoots issues. Needs to be fast and handle 500 concurrent users.',
        requirements: [{ label: 'Volume', value: '500 concurrent' }, { label: 'Latency', value: '< 3s' }, { label: 'Task', value: 'Q&A + Troubleshooting' }, { label: 'User-facing', value: 'Yes' }],
        correctChoice: 'mid',
        reasoning: 'The balanced tier is ideal: fast enough for real-time chat, smart enough for product Q&A, and cost-effective at scale. The lite tier might miss nuance in troubleshooting; the premium tier is too slow and expensive for 500 concurrent users.',
    },
];

const ModelPickerLab: React.FC<{ interactiveId: string }> = () => {
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const scenario = scenarios[scenarioIndex];
    const isCorrect = selectedModel === scenario.correctChoice;

    const reset = (i: number) => {
        setScenarioIndex(i);
        setSelectedModel(null);
        setSubmitted(false);
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(99, 102, 241, 0.06) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            padding: '24px',
            fontFamily: "'Inter', sans-serif",
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '22px' }}>🎯</span>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Pick the Right Model
                </h3>
            </div>

            {/* Scenario Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {scenarios.map((s, i) => (
                    <button key={i} onClick={() => reset(i)} style={{
                        flex: 1, padding: '8px 12px', borderRadius: '8px',
                        border: `1px solid ${scenarioIndex === i ? 'rgba(96, 165, 250, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                        background: scenarioIndex === i ? 'rgba(96, 165, 250, 0.1)' : 'rgba(255,255,255,0.02)',
                        color: scenarioIndex === i ? '#93c5fd' : '#9ca3af',
                        fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                        {s.title}
                    </button>
                ))}
            </div>

            {/* Scenario Brief */}
            <div style={{
                padding: '14px 18px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px',
            }}>
                <div style={{ fontSize: '14px', color: '#e5e7eb', fontWeight: 600, marginBottom: '8px' }}>{scenario.title}</div>
                <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.5, marginBottom: '10px' }}>{scenario.description}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {scenario.requirements.map((req, i) => (
                        <span key={i} style={{
                            fontSize: '11px', padding: '4px 10px', borderRadius: '6px',
                            background: 'rgba(59, 130, 246, 0.1)', color: '#93c5fd',
                        }}>
                            <strong>{req.label}:</strong> {req.value}
                        </span>
                    ))}
                </div>
            </div>

            {/* Model Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {models.map((m) => (
                    <button key={m.tier} onClick={() => { setSelectedModel(m.tier); setSubmitted(false); }} style={{
                        padding: '14px', borderRadius: '10px', textAlign: 'left',
                        border: `2px solid ${selectedModel === m.tier ? m.color : 'rgba(255,255,255,0.06)'}`,
                        background: selectedModel === m.tier ? `rgba(${m.tier === 'lite' ? '52, 211, 153' : m.tier === 'mid' ? '251, 191, 36' : '248, 113, 113'}, 0.08)` : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: m.color, marginBottom: '8px' }}>{m.name}</div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>⚡ {m.speed}</div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>💰 {m.cost}</div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px' }}>📐 {m.contextWindow}</div>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
                            {m.strengths.map((s, i) => (
                                <div key={i} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '1px' }}>• {s}</div>
                            ))}
                        </div>
                    </button>
                ))}
            </div>

            {/* Submit */}
            <button
                onClick={() => setSubmitted(true)}
                disabled={!selectedModel}
                style={{
                    width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                    background: !selectedModel ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    color: '#fff', fontWeight: 700, fontSize: '14px',
                    cursor: !selectedModel ? 'not-allowed' : 'pointer', marginBottom: '12px',
                }}
            >
                🎯 Submit Selection
            </button>

            {/* Result */}
            {submitted && (
                <div style={{
                    padding: '16px', borderRadius: '10px', animation: 'fadeIn 0.3s ease',
                    background: isCorrect ? 'rgba(34, 197, 94, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                    border: `1px solid ${isCorrect ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: isCorrect ? '#6ee7b7' : '#fde68a', marginBottom: '8px' }}>
                        {isCorrect ? '✅ Correct!' : '🔄 Not quite — here\'s why:'}
                    </div>
                    <p style={{ fontSize: '13px', color: '#d1d5db', lineHeight: 1.6, margin: 0 }}>{scenario.reasoning}</p>
                </div>
            )}
        </div>
    );
};

export default ModelPickerLab;
