import React, { useState } from 'react';

interface VocabTerm {
    term: string;
    meaning: string;
    controls: string;
    apiUsage: string;
}

interface VocabSectionData {
    sectionId: string;
    terms: VocabTerm[];
}

const vocabData: Record<string, VocabSectionData> = {
    'vocab-1-1': {
        sectionId: '1.1',
        terms: [
            { term: 'Parameters', meaning: 'Weights — numerical dials inside the model', controls: 'Model behavior and capability', apiUsage: 'Impacts cost per token, model selection' },
            { term: 'Context Window', meaning: 'Working memory — how much text the model can see', controls: 'Max prompt + response size', apiUsage: 'max_tokens, truncation behavior' },
            { term: 'Embeddings', meaning: 'Meaning vectors — numbers that represent concepts', controls: 'Semantic search and memory', apiUsage: 'Embedding endpoints, vector databases' },
            { term: 'Foundation Model', meaning: 'Pre-trained base model adaptable to many tasks', controls: 'Baseline capability and cost', apiUsage: 'Model name in API calls (e.g., gpt-4o)' },
        ]
    },
    'vocab-1-2': {
        sectionId: '1.2',
        terms: [
            { term: 'Loss Function', meaning: 'Error measurement — how wrong the model is', controls: 'Training convergence', apiUsage: 'Eval metrics, fine-tuning logs' },
            { term: 'Gradient Descent', meaning: 'Downhill optimization to minimize error', controls: 'How fast and well the model learns', apiUsage: 'Learning rate, training configuration' },
            { term: 'Generalization', meaning: 'Ability to handle data never seen before', controls: 'Real-world reliability', apiUsage: 'Test set accuracy, production performance' },
            { term: 'Overfitting', meaning: 'Memorization failure — works on training data, fails on new data', controls: 'Model usefulness', apiUsage: 'Eval regression, unexpected failures' },
        ]
    },
    'vocab-1-3': {
        sectionId: '1.3',
        terms: [
            { term: 'Hallucination', meaning: 'Confident mistake — the model makes up facts', controls: 'Output reliability', apiUsage: 'Eval criteria, fact-checking pipelines' },
            { term: 'Alignment', meaning: 'Making the model do what we actually intend', controls: 'Safety and trust', apiUsage: 'RLHF, safety filters, system prompts' },
            { term: 'Objective Function', meaning: 'The goal the model optimizes for', controls: 'Model behavior direction', apiUsage: 'Reward model design, fine-tuning targets' },
        ]
    },
    'vocab-1-4': {
        sectionId: '1.4',
        terms: [
            { term: 'Dataset', meaning: 'The training material — data the model learns from', controls: 'Model knowledge and biases', apiUsage: 'Data pipeline, training configuration' },
            { term: 'Multimodal', meaning: 'Ability to process multiple data types (text, image, audio)', controls: 'What the model can understand', apiUsage: 'mime_type in API requests, model selection' },
            { term: 'Embedding Space', meaning: 'Shared mathematical world where all data types live', controls: 'Cross-modal reasoning', apiUsage: 'Embedding endpoints, similarity search' },
        ]
    },
    'vocab-1-5': {
        sectionId: '1.5',
        terms: [
            { term: 'Adversarial Attack', meaning: 'Deliberately crafted input designed to fool the model', controls: 'Model reliability under attack', apiUsage: 'Input validation, safety testing' },
            { term: 'Prompt Injection', meaning: 'Hacking by talking — tricking the model via input', controls: 'System prompt integrity', apiUsage: 'System message hardening, guardrails' },
            { term: 'Alignment', meaning: 'Ensuring the model follows intended rules', controls: 'Whether safety holds under stress', apiUsage: 'RLHF, constitutional AI, content filters' },
        ]
    },
    'vocab-1-6': {
        sectionId: '1.6',
        terms: [
            { term: 'Context Window', meaning: 'Working memory — the total token budget', controls: 'How much information fits in one request', apiUsage: 'max_tokens, model selection' },
            { term: 'Token Limit', meaning: 'The hard boundary of the context window', controls: 'When information gets lost', apiUsage: 'Truncation strategy, summarization' },
            { term: 'External Memory', meaning: 'Databases and vector stores that supplement context', controls: 'Knowledge retrieval beyond the window', apiUsage: 'RAG architecture, vector stores' },
        ]
    },
    'vocab-1-7': {
        sectionId: '1.7',
        terms: [
            { term: 'Attention Weights', meaning: 'How much focus the model gives each word', controls: 'What the model prioritizes in output', apiUsage: 'Prompt engineering, logprobs API' },
            { term: 'Bias', meaning: 'Inherited prejudice from training data', controls: 'Fairness and representation in outputs', apiUsage: 'Eval criteria, debiasing pipelines' },
            { term: 'Explainability', meaning: '"Why did the model say that?"', controls: 'Trust, debugging, compliance', apiUsage: 'Attention visualization, logprobs' },
        ]
    },
};

const VocabularyLockIn: React.FC<{ interactiveId: string }> = ({ interactiveId }) => {
    const [revealedTerms, setRevealedTerms] = useState<Set<number>>(new Set());
    const [allRevealed, setAllRevealed] = useState(false);
    const data = vocabData[interactiveId];

    if (!data) {
        return (
            <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
                Vocabulary data not found for: {interactiveId}
            </div>
        );
    }

    const toggleTerm = (index: number) => {
        setRevealedTerms(prev => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const revealAll = () => {
        if (allRevealed) {
            setRevealedTerms(new Set());
            setAllRevealed(false);
        } else {
            setRevealedTerms(new Set(data.terms.map((_, i) => i)));
            setAllRevealed(true);
        }
    };

    const progress = (revealedTerms.size / data.terms.length) * 100;

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(6, 182, 212, 0.08) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '24px',
            fontFamily: "'Inter', sans-serif",
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🔒</span>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#10b981', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        Vocabulary Lock-In — Section {data.sectionId}
                    </h3>
                </div>
                <button
                    onClick={revealAll}
                    style={{
                        background: allRevealed ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        border: `1px solid ${allRevealed ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                        color: allRevealed ? '#fca5a5' : '#6ee7b7',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                    }}
                >
                    {allRevealed ? 'Hide All' : 'Reveal All'}
                </button>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginBottom: '20px', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                    borderRadius: '2px',
                    transition: 'width 0.4s ease',
                }} />
            </div>

            {/* Terms Grid */}
            <div style={{ display: 'grid', gap: '10px' }}>
                {data.terms.map((term, i) => {
                    const isRevealed = revealedTerms.has(i);
                    return (
                        <div
                            key={i}
                            onClick={() => toggleTerm(i)}
                            style={{
                                background: isRevealed
                                    ? 'rgba(16, 185, 129, 0.08)'
                                    : 'rgba(255, 255, 255, 0.02)',
                                borderRadius: '12px',
                                border: `1px solid ${isRevealed ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.06)'}`,
                                padding: '14px 18px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                overflow: 'hidden',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    color: isRevealed ? '#6ee7b7' : '#e5e7eb',
                                }}>
                                    {term.term}
                                </span>
                                <span style={{
                                    fontSize: '11px',
                                    color: 'rgba(255,255,255,0.3)',
                                    transform: isRevealed ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s',
                                }}>
                                    ▼
                                </span>
                            </div>
                            {isRevealed && (
                                <div style={{
                                    marginTop: '12px',
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr',
                                    gap: '8px',
                                    animation: 'fadeIn 0.3s ease',
                                }}>
                                    <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>Plain Meaning</div>
                                        <div style={{ fontSize: '13px', color: '#d1d5db', lineHeight: 1.4 }}>{term.meaning}</div>
                                    </div>
                                    <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>What It Controls</div>
                                        <div style={{ fontSize: '13px', color: '#d1d5db', lineHeight: 1.4 }}>{term.controls}</div>
                                    </div>
                                    <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>In APIs/Tools Later</div>
                                        <div style={{ fontSize: '13px', color: '#d1d5db', lineHeight: 1.4 }}>{term.apiUsage}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Completion badge */}
            {revealedTerms.size === data.terms.length && (
                <div style={{
                    marginTop: '16px',
                    textAlign: 'center',
                    padding: '10px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#6ee7b7',
                    fontSize: '13px',
                    fontWeight: 600,
                }}>
                    ✅ All terms reviewed! Vocabulary locked in.
                </div>
            )}
        </div>
    );
};

export default VocabularyLockIn;
