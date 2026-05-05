import React, { useState } from 'react';

interface MasteryQuestion {
    id: number;
    type: 'recall' | 'near-transfer' | 'far-transfer';
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

const masteryQuestions: MasteryQuestion[] = [
    {
        id: 1, type: 'recall',
        question: 'What is the difference between training and inference?',
        options: [
            'Training generates output; inference adjusts weights',
            'Training adjusts model weights using data; inference generates output from a trained model',
            'Training uses APIs; inference uses manual rules',
            'There is no meaningful difference'
        ],
        correctIndex: 1,
        explanation: 'Training is the process of adjusting a model\'s parameters (weights) to minimize prediction errors using labeled data. Inference is the process of generating output from an already-trained model — no learning happens during inference.'
    },
    {
        id: 2, type: 'recall',
        question: 'What does gradient descent optimize, and what is the "mountain" analogy?',
        options: [
            'It optimizes speed; the mountain represents compute cost',
            'It minimizes the loss function; the mountain surface represents error, and each step moves downhill toward lower error',
            'It maximizes accuracy; the mountain represents data size',
            'It optimizes token count; altitude represents prompt length'
        ],
        correctIndex: 1,
        explanation: 'Gradient descent minimizes the loss function. The "mountain" analogy: imagine a blindfolded hiker where altitude = error. The hiker feels the slope (gradient) and steps downhill. Each step adjusts model parameters toward lower error.'
    },
    {
        id: 3, type: 'near-transfer',
        question: 'Why do hallucinations occur — what mechanism causes them?',
        options: [
            'The model accesses incorrect databases',
            'The model optimizes for the most probable next token, not truth — when training data is sparse or ambiguous, probability becomes uncalibrated',
            'The model intentionally lies to test users',
            'Hallucinations only occur with bad prompts'
        ],
        correctIndex: 1,
        explanation: 'Hallucinations occur because LLMs are probabilistic token predictors, not truth engines. They generate the statistically most likely continuation. When the model encounters topics with sparse or contradictory training data, it fills gaps with plausible-sounding but incorrect text.'
    },
    {
        id: 4, type: 'near-transfer',
        question: 'What does an API key authenticate, and what happens without one?',
        options: [
            'It encrypts data; without it, data is unencrypted',
            'It verifies your identity to the model server; without it, the server rejects your request (401/403 error)',
            'It sets the model\'s temperature; without it, temperature defaults to 0',
            'It stores model weights locally; without it, the model can\'t run'
        ],
        correctIndex: 1,
        explanation: 'An API key authenticates your identity to the AI provider\'s server. It tells the server who is making the request and whether they have permission. Without a valid key, the server returns an authentication error (HTTP 401 Unauthorized or 403 Forbidden).'
    },
    {
        id: 5, type: 'far-transfer',
        question: 'A client wants to summarize 200-page legal documents. The model\'s context window is 8K tokens. What architecture would you propose?',
        options: [
            'Use a bigger model with a larger context window',
            'Ask the client to shorten their documents',
            'Use RAG: chunk the documents, embed them, retrieve relevant sections per query, and summarize only the retrieved chunks',
            'Fine-tune the model on legal data'
        ],
        correctIndex: 2,
        explanation: 'RAG (Retrieval-Augmented Generation) is the correct approach: chunk the 200-page document into smaller pieces, create embeddings for each chunk, then retrieve only the relevant chunks for each query and summarize them. This overcomes the context window limit without losing information fidelity.'
    },
];

const microBuildPrompt = `Convert this freeform prompt into a structured prompt spec:

"Write me something about dogs for my website"

Expected output format:
• Purpose: [What is this content for?]
• Inputs: [What information does the model need?]
• Output format: [What structure should the response have?]
• Constraints: [Length, tone, accuracy requirements]
• Tone: [Formal, casual, playful, etc.]`;

const typeColors = {
    'recall': { bg: 'rgba(59, 130, 246, 0.1)', color: '#93c5fd', label: 'Recall' },
    'near-transfer': { bg: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7', label: 'Near-Transfer' },
    'far-transfer': { bg: 'rgba(245, 158, 11, 0.1)', color: '#fde68a', label: 'Far-Transfer' },
};

const MasteryCheckGate: React.FC<{ interactiveId: string }> = () => {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [showExplanations, setShowExplanations] = useState<Set<number>>(new Set());
    const [microBuildResponse, setMicroBuildResponse] = useState('');
    const [microBuildSubmitted, setMicroBuildSubmitted] = useState(false);

    const score = masteryQuestions.filter(q => answers[q.id] === q.correctIndex).length;
    const passed = score >= 4;

    const handleAnswer = (qId: number, oIndex: number) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [qId]: oIndex }));
    };

    const toggleExplanation = (qId: number) => {
        setShowExplanations(prev => {
            const next = new Set(prev);
            if (next.has(qId)) next.delete(qId); else next.add(qId);
            return next;
        });
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(234, 179, 8, 0.06) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            padding: '24px',
            fontFamily: "'Inter', sans-serif",
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px' }}>🏁</span>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Mastery Check — Section 1.10 Gate
                </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 20px 0' }}>
                Answer 5 questions (recall, near-transfer, far-transfer) and complete the micro-build to unlock the next section.
            </p>

            {/* Questions */}
            {masteryQuestions.map((q) => {
                const tc = typeColors[q.type];

                return (
                    <div key={q.id} style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: tc.bg, color: tc.color, fontWeight: 600, textTransform: 'uppercase' }}>
                                {tc.label}
                            </span>
                            <span style={{ fontSize: '13px', color: '#e5e7eb', fontWeight: 600 }}>{q.question}</span>
                        </div>
                        <div style={{ display: 'grid', gap: '6px' }}>
                            {q.options.map((opt, oi) => {
                                const selected = answers[q.id] === oi;
                                const correct = submitted && oi === q.correctIndex;
                                const wrong = submitted && selected && oi !== q.correctIndex;
                                return (
                                    <button key={oi} onClick={() => handleAnswer(q.id, oi)} style={{
                                        padding: '10px 14px', borderRadius: '8px', textAlign: 'left',
                                        border: `1px solid ${correct ? 'rgba(34, 197, 94, 0.4)' : wrong ? 'rgba(239, 68, 68, 0.4)' : selected ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                                        background: correct ? 'rgba(34, 197, 94, 0.06)' : wrong ? 'rgba(239, 68, 68, 0.06)' : selected ? 'rgba(251, 191, 36, 0.06)' : 'rgba(255,255,255,0.02)',
                                        color: correct ? '#6ee7b7' : wrong ? '#fca5a5' : '#d1d5db',
                                        fontSize: '12px', cursor: submitted ? 'default' : 'pointer', transition: 'all 0.2s',
                                        lineHeight: 1.4,
                                    }}>
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                        {submitted && (
                            <button onClick={() => toggleExplanation(q.id)} style={{
                                marginTop: '6px', padding: '4px 10px', borderRadius: '6px',
                                border: 'none', background: 'rgba(255,255,255,0.04)',
                                color: '#9ca3af', fontSize: '11px', cursor: 'pointer',
                            }}>
                                {showExplanations.has(q.id) ? '▲ Hide Explanation' : '▼ Show Explanation'}
                            </button>
                        )}
                        {showExplanations.has(q.id) && (
                            <div style={{
                                marginTop: '6px', padding: '10px 14px', borderRadius: '8px',
                                background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.15)',
                                fontSize: '12px', color: '#a5b4fc', lineHeight: 1.5,
                            }}>
                                💡 {q.explanation}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Submit */}
            {!submitted ? (
                <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < masteryQuestions.length} style={{
                    width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                    background: Object.keys(answers).length < masteryQuestions.length ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #f59e0b, #eab308)',
                    color: '#fff', fontWeight: 700, fontSize: '14px',
                    cursor: Object.keys(answers).length < masteryQuestions.length ? 'not-allowed' : 'pointer',
                }}>
                    Check Mastery
                </button>
            ) : (
                <div style={{
                    padding: '14px', borderRadius: '10px', marginBottom: '20px',
                    background: passed ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    border: `1px solid ${passed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    color: passed ? '#6ee7b7' : '#fca5a5',
                    fontSize: '14px', fontWeight: 600,
                }}>
                    {passed ? `✅ ${score}/5 — Mastery demonstrated! Complete the micro-build below.` : `❌ ${score}/5 — Need at least 4/5 to pass. Review explanations and retry.`}
                </div>
            )}

            {/* Micro-Build */}
            {submitted && passed && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '16px' }}>🔨</span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#fbbf24' }}>Micro-Build Output</span>
                    </div>
                    <div style={{
                        padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.06)', marginBottom: '12px',
                        fontSize: '12px', color: '#d1d5db', fontFamily: 'monospace', lineHeight: 1.6, whiteSpace: 'pre-wrap',
                    }}>
                        {microBuildPrompt}
                    </div>
                    <textarea
                        value={microBuildResponse}
                        onChange={(e) => { setMicroBuildResponse(e.target.value); setMicroBuildSubmitted(false); }}
                        placeholder="Write your structured prompt spec here..."
                        style={{
                            width: '100%', minHeight: '150px', background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                            padding: '14px', color: '#e5e7eb', fontSize: '13px',
                            fontFamily: "'Inter', monospace", resize: 'vertical', outline: 'none',
                            lineHeight: 1.5, boxSizing: 'border-box',
                        }}
                    />
                    <button
                        onClick={() => setMicroBuildSubmitted(true)}
                        disabled={microBuildResponse.trim().length < 50}
                        style={{
                            marginTop: '8px', width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                            background: microBuildResponse.trim().length < 50 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #f59e0b, #22c55e)',
                            color: '#fff', fontWeight: 700, fontSize: '14px',
                            cursor: microBuildResponse.trim().length < 50 ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Submit Micro-Build
                    </button>
                    {microBuildSubmitted && (
                        <div style={{
                            marginTop: '12px', padding: '14px', borderRadius: '10px',
                            background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)',
                            color: '#6ee7b7', fontSize: '13px', fontWeight: 600, textAlign: 'center',
                        }}>
                            ✅ Mastery Check Complete! Section 1.10 gate passed. You're ready for the advanced topics.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MasteryCheckGate;
