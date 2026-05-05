import React, { useState } from 'react';

interface UseCase {
    description: string;
    dataVolatility: 'static' | 'dynamic' | 'mixed';
    outputConsistency: 'critical' | 'flexible';
    dataAvailable: boolean;
    taskType: string;
}

interface Recommendation {
    approach: 'prompting' | 'rag' | 'finetuning';
    confidence: number;
    reasoning: string;
    considerations: string[];
}

const presetCases: UseCase[] = [
    { description: 'Generate marketing copy in our specific brand voice and tone.', dataVolatility: 'static', outputConsistency: 'critical', dataAvailable: true, taskType: 'Style Transfer' },
    { description: 'Answer customer questions using our product documentation that changes weekly.', dataVolatility: 'dynamic', outputConsistency: 'critical', dataAvailable: true, taskType: 'Q&A' },
    { description: 'Generate creative story ideas for a children\'s book.', dataVolatility: 'static', outputConsistency: 'flexible', dataAvailable: false, taskType: 'Creative' },
    { description: 'Summarize daily internal reports from Slack and email.', dataVolatility: 'dynamic', outputConsistency: 'flexible', dataAvailable: true, taskType: 'Summarization' },
    { description: 'Classify incoming support tickets into 15 custom categories.', dataVolatility: 'static', outputConsistency: 'critical', dataAvailable: true, taskType: 'Classification' },
];

const approachColors = {
    prompting: { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.3)', text: '#a5b4fc', label: '✍️ Prompting' },
    rag: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: '#6ee7b7', label: '📚 RAG' },
    finetuning: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: '#fde68a', label: '🔧 Fine-Tuning' },
};

function recommend(useCase: UseCase): Recommendation {
    if (useCase.dataVolatility === 'dynamic' && useCase.dataAvailable) {
        return {
            approach: 'rag',
            confidence: 92,
            reasoning: 'Dynamic data that changes frequently is best served by RAG. It retrieves the latest information at query time, ensuring answers are always current.',
            considerations: ['Need to maintain a vector store / index', 'Chunking strategy matters', 'Latency is slightly higher than pure prompting'],
        };
    }
    if (useCase.outputConsistency === 'critical' && useCase.dataAvailable && useCase.dataVolatility === 'static') {
        return {
            approach: 'finetuning',
            confidence: 85,
            reasoning: 'When you need consistent output format, have stable training data, and require a locked-in behavior pattern, fine-tuning bakes the behavior directly into model weights.',
            considerations: ['Requires training data (100+ examples)', 'Higher ops cost and maintenance', 'Model behavior is less flexible to change', 'Good for: brand voice, classification, formatting'],
        };
    }
    return {
        approach: 'prompting',
        confidence: 88,
        reasoning: 'For tasks that don\'t require external data or rigid consistency, well-crafted prompts are the fastest and most flexible approach. Zero infrastructure needed.',
        considerations: ['Fragile to prompt changes', 'No long-term memory', 'Fastest to iterate', 'Cheapest to start'],
    };
}

const ApproachDecisionTree: React.FC<{ interactiveId: string }> = () => {
    const [selectedCase, setSelectedCase] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [customDesc, setCustomDesc] = useState('');
    const [customVolatility, setCustomVolatility] = useState<'static' | 'dynamic' | 'mixed'>('static');
    const [customConsistency, setCustomConsistency] = useState<'critical' | 'flexible'>('flexible');
    const [customData, setCustomData] = useState(false);
    const [isCustom, setIsCustom] = useState(false);

    const currentCase: UseCase | null = isCustom
        ? { description: customDesc, dataVolatility: customVolatility, outputConsistency: customConsistency, dataAvailable: customData, taskType: 'Custom' }
        : selectedCase !== null ? presetCases[selectedCase] : null;

    const result = currentCase ? recommend(currentCase) : null;
    const colors = result ? approachColors[result.approach] : null;

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.06) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            padding: '24px',
            fontFamily: "'Inter', sans-serif",
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '22px' }}>🌳</span>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Decision Tree Coach
                </h3>
            </div>

            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button onClick={() => { setIsCustom(false); setShowResult(false); }} style={{
                    flex: 1, padding: '8px', borderRadius: '8px',
                    border: `1px solid ${!isCustom ? 'rgba(167, 139, 250, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                    background: !isCustom ? 'rgba(167, 139, 250, 0.1)' : 'transparent',
                    color: !isCustom ? '#c4b5fd' : '#9ca3af', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                }}>
                    📋 Preset Scenarios
                </button>
                <button onClick={() => { setIsCustom(true); setShowResult(false); setSelectedCase(null); }} style={{
                    flex: 1, padding: '8px', borderRadius: '8px',
                    border: `1px solid ${isCustom ? 'rgba(167, 139, 250, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                    background: isCustom ? 'rgba(167, 139, 250, 0.1)' : 'transparent',
                    color: isCustom ? '#c4b5fd' : '#9ca3af', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                }}>
                    ✏️ Describe Your Own
                </button>
            </div>

            {/* Presets */}
            {!isCustom && (
                <div style={{ display: 'grid', gap: '8px', marginBottom: '16px' }}>
                    {presetCases.map((c, i) => (
                        <button key={i} onClick={() => { setSelectedCase(i); setShowResult(false); }} style={{
                            padding: '12px 16px', borderRadius: '10px', textAlign: 'left',
                            border: `1px solid ${selectedCase === i ? 'rgba(167, 139, 250, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                            background: selectedCase === i ? 'rgba(167, 139, 250, 0.06)' : 'rgba(255,255,255,0.02)',
                            color: '#e5e7eb', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{c.description}</span>
                                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>{c.taskType}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Custom */}
            {isCustom && (
                <div style={{ marginBottom: '16px' }}>
                    <textarea value={customDesc} onChange={(e) => setCustomDesc(e.target.value)}
                        placeholder="Describe your use case..."
                        style={{
                            width: '100%', minHeight: '60px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px', padding: '10px', color: '#e5e7eb', fontSize: '13px', resize: 'vertical', outline: 'none', marginBottom: '10px', boxSizing: 'border-box',
                        }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        <div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase' }}>Data Changes?</div>
                            <select value={customVolatility} onChange={(e) => setCustomVolatility(e.target.value as any)} style={{
                                width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px', color: '#e5e7eb', fontSize: '12px',
                            }}>
                                <option value="static">Static</option>
                                <option value="dynamic">Dynamic</option>
                                <option value="mixed">Mixed</option>
                            </select>
                        </div>
                        <div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase' }}>Output Consistency?</div>
                            <select value={customConsistency} onChange={(e) => setCustomConsistency(e.target.value as any)} style={{
                                width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px', color: '#e5e7eb', fontSize: '12px',
                            }}>
                                <option value="flexible">Flexible</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase' }}>Training Data?</div>
                            <button onClick={() => setCustomData(!customData)} style={{
                                width: '100%', padding: '8px', borderRadius: '6px',
                                border: `1px solid ${customData ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                                background: customData ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.3)',
                                color: customData ? '#6ee7b7' : '#9ca3af', fontSize: '12px', cursor: 'pointer',
                            }}>
                                {customData ? '✅ Available' : '❌ None'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Analyze Button */}
            <button
                onClick={() => setShowResult(true)}
                disabled={!currentCase || (isCustom && !customDesc.trim())}
                style={{
                    width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                    background: (!currentCase || (isCustom && !customDesc.trim())) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    color: '#fff', fontWeight: 700, fontSize: '14px',
                    cursor: (!currentCase || (isCustom && !customDesc.trim())) ? 'not-allowed' : 'pointer',
                    marginBottom: '16px',
                }}
            >
                🌳 Analyze Approach
            </button>

            {/* Result */}
            {showResult && result && colors && (
                <div style={{
                    background: colors.bg, borderRadius: '12px', border: `1px solid ${colors.border}`,
                    padding: '18px', animation: 'fadeIn 0.4s ease',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: colors.text }}>{colors.label}</span>
                        <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', color: colors.text, fontWeight: 600 }}>
                            {result.confidence}% confidence
                        </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#d1d5db', lineHeight: 1.6, margin: '0 0 12px 0' }}>{result.reasoning}</p>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>Considerations</div>
                    {result.considerations.map((c, i) => (
                        <div key={i} style={{ fontSize: '12px', color: '#9ca3af', paddingLeft: '12px', marginBottom: '3px' }}>• {c}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApproachDecisionTree;
