import React, { useState } from 'react';

interface CheckpointQuestion {
    question: string;
    options: string[];
    correctIndex: number;
}

const checkpointQuestions: CheckpointQuestion[] = [
    { question: 'What is a verifiable credential?', options: ['A password for an API', 'A tamper-proof digital claim about a subject', 'A blockchain wallet address', 'A type of encryption key'], correctIndex: 1 },
    { question: 'What does "evidence hash" mean?', options: ['A random number', 'A cryptographic fingerprint of an artifact proving achievement', 'A password hash', 'A file name'], correctIndex: 1 },
    { question: 'Who is the "issuer" of a credential?', options: ['The learner', 'The blockchain', 'The entity that creates and signs the credential', 'The browser'], correctIndex: 2 },
];

const CredentialMintPreview: React.FC<{ interactiveId: string }> = () => {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [minted, setMinted] = useState(false);
    const [minting, setMinting] = useState(false);

    const allCorrect = checkpointQuestions.every((q, i) => answers[i] === q.correctIndex);
    const score = checkpointQuestions.filter((q, i) => answers[i] === q.correctIndex).length;

    const handleAnswer = (qIndex: number, oIndex: number) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
    };

    const submit = () => setSubmitted(true);

    const mint = () => {
        setMinting(true);
        setTimeout(() => {
            setMinting(false);
            setMinted(true);
        }, 1500);
    };

    const credentialJson = {
        "@context": ["https://www.w3.org/2018/credentials/v1", "https://zen.academy/credentials/v1"],
        type: ["VerifiableCredential", "ZENModuleCredential"],
        issuer: "did:zen:academy:vanguard",
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
            id: "did:zen:learner:anonymous",
            achievement: {
                type: "Module1Completion",
                name: "Foundations of Machine Intelligence",
                description: "Demonstrated understanding of ML fundamentals, LLM architecture, prompt engineering, security, and API readiness.",
            },
            skills: [
                "Neural Network Architecture",
                "Gradient Descent & Loss Functions",
                "Tokenization & Context Windows",
                "Prompt Engineering",
                "JSON Schema Design",
                "Security Fundamentals",
                "Model Selection",
                "RAG vs Fine-Tuning Decision-Making",
            ],
        },
        evidence: [
            { type: "QuizScore", value: `${score}/${checkpointQuestions.length}`, hash: `sha256:${Math.random().toString(36).slice(2, 18)}` },
            { type: "ModuleCompletion", value: "Module 1 — All Sections", hash: `sha256:${Math.random().toString(36).slice(2, 18)}` },
        ],
        proof: {
            type: "Ed25519Signature2020",
            created: new Date().toISOString(),
            verificationMethod: "did:zen:academy:vanguard#key-1",
            proofPurpose: "assertionMethod",
            proofValue: `z${Math.random().toString(36).slice(2, 42)}`,
        },
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(236, 72, 153, 0.06) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            padding: '24px',
            fontFamily: "'Inter', sans-serif",
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '22px' }}>🪙</span>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Credential Mint Preview
                </h3>
            </div>

            {!minted ? (
                <>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '16px' }}>
                        Complete the mini-checkpoint to generate your Module 1 Proof-of-Learning credential.
                    </p>

                    {/* Questions */}
                    {checkpointQuestions.map((q, qi) => (
                        <div key={qi} style={{ marginBottom: '14px' }}>
                            <div style={{ fontSize: '13px', color: '#e5e7eb', fontWeight: 600, marginBottom: '8px' }}>
                                {qi + 1}. {q.question}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                {q.options.map((opt, oi) => {
                                    const isSelected = answers[qi] === oi;
                                    const isCorrect = submitted && oi === q.correctIndex;
                                    const isWrong = submitted && isSelected && oi !== q.correctIndex;
                                    return (
                                        <button key={oi} onClick={() => handleAnswer(qi, oi)} style={{
                                            padding: '8px 12px', borderRadius: '8px', textAlign: 'left',
                                            border: `1px solid ${isCorrect ? 'rgba(34, 197, 94, 0.4)' : isWrong ? 'rgba(239, 68, 68, 0.4)' : isSelected ? 'rgba(192, 132, 252, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                                            background: isCorrect ? 'rgba(34, 197, 94, 0.08)' : isWrong ? 'rgba(239, 68, 68, 0.08)' : isSelected ? 'rgba(192, 132, 252, 0.08)' : 'rgba(255,255,255,0.02)',
                                            color: isCorrect ? '#6ee7b7' : isWrong ? '#fca5a5' : '#d1d5db',
                                            fontSize: '12px', cursor: submitted ? 'default' : 'pointer', transition: 'all 0.2s',
                                        }}>
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {!submitted ? (
                        <button onClick={submit} disabled={Object.keys(answers).length < checkpointQuestions.length} style={{
                            width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                            background: Object.keys(answers).length < checkpointQuestions.length ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #a855f7, #ec4899)',
                            color: '#fff', fontWeight: 700, fontSize: '14px',
                            cursor: Object.keys(answers).length < checkpointQuestions.length ? 'not-allowed' : 'pointer',
                        }}>
                            Check Answers
                        </button>
                    ) : (
                        <div>
                            <div style={{
                                padding: '12px', borderRadius: '8px', marginBottom: '12px',
                                background: allCorrect ? 'rgba(34, 197, 94, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                                border: `1px solid ${allCorrect ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                                color: allCorrect ? '#6ee7b7' : '#fde68a',
                                fontSize: '13px', fontWeight: 600,
                            }}>
                                {allCorrect ? '✅ All correct! You may mint your credential.' : `${score}/${checkpointQuestions.length} correct. Review answers above.`}
                            </div>
                            {allCorrect && (
                                <button onClick={mint} disabled={minting} style={{
                                    width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                                    background: minting ? 'rgba(168, 85, 247, 0.3)' : 'linear-gradient(135deg, #a855f7, #6366f1)',
                                    color: '#fff', fontWeight: 700, fontSize: '14px',
                                    cursor: minting ? 'wait' : 'pointer',
                                }}>
                                    {minting ? '⏳ Minting credential...' : '🪙 Mint Credential'}
                                </button>
                            )}
                        </div>
                    )}
                </>
            ) : (
                /* Minted Credential Display */
                <div style={{ animation: 'fadeIn 0.5s ease' }}>
                    <div style={{
                        textAlign: 'center', padding: '20px',
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.08))',
                        borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.3)',
                        marginBottom: '16px',
                    }}>
                        <div style={{ fontSize: '36px', marginBottom: '8px' }}>🏆</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#e5e7eb' }}>Module 1 Credential Minted!</div>
                        <div style={{ fontSize: '12px', color: '#c084fc', marginTop: '4px' }}>Foundations of Machine Intelligence</div>
                    </div>

                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>Credential JSON</div>
                    <pre style={{
                        background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '16px',
                        border: '1px solid rgba(168, 85, 247, 0.15)',
                        color: '#c4b5fd', fontSize: '11px', fontFamily: "'Courier New', monospace",
                        overflow: 'auto', whiteSpace: 'pre', lineHeight: 1.5, maxHeight: '300px',
                    }}>
                        {JSON.stringify(credentialJson, null, 2)}
                    </pre>

                    <div style={{
                        marginTop: '12px', padding: '12px 16px',
                        background: 'rgba(168, 85, 247, 0.06)', borderRadius: '10px',
                        border: '1px solid rgba(168, 85, 247, 0.15)',
                        fontSize: '12px', color: '#c4b5fd', lineHeight: 1.5,
                    }}>
                        💡 <strong>What you produced:</strong> A W3C-compatible verifiable credential with an issuer DID, evidence hashes, skills claims, and a cryptographic proof. In production, this would be anchored on-chain.
                    </div>
                </div>
            )}
        </div>
    );
};

export default CredentialMintPreview;
