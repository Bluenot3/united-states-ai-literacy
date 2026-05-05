import React, { useState } from 'react';

interface Claim {
    id: string;
    text: string;
    isHallucination: boolean;
    explanation: string;
    sourceHint: string;
}

interface Report {
    title: string;
    content: string;
    claims: Claim[];
}

const SAMPLE_REPORT: Report = {
    title: 'Q3 Market Trends Analysis',
    content: `Based on our comprehensive analysis of the AI market in Q3 2025, several key trends have emerged that will shape strategic decisions for the coming quarter.`,
    claims: [
        {
            id: '1',
            text: 'The global AI market reached $298 billion in Q3 2025, representing a 34% year-over-year growth.',
            isHallucination: false,
            explanation: 'This statistic is verifiable in the Q3 Market Report on page 12.',
            sourceHint: 'Source: Q3 Market Report, Page 12'
        },
        {
            id: '2',
            text: 'OpenAI announced GPT-5 will include native video generation capabilities launching in November.',
            isHallucination: true,
            explanation: '⚠️ HALLUCINATION: No such announcement exists in any provided source documents. The AI invented this claim.',
            sourceHint: 'No source found'
        },
        {
            id: '3',
            text: 'Enterprise AI adoption increased by 47% compared to Q2, with healthcare leading at 62% implementation.',
            isHallucination: false,
            explanation: 'Verified in the Enterprise Adoption Survey, Section 3.2.',
            sourceHint: 'Source: Enterprise Adoption Survey, Section 3.2'
        },
        {
            id: '4',
            text: 'Anthropic secured a $7.2 billion funding round led by Google, valuing the company at $42 billion.',
            isHallucination: true,
            explanation: '⚠️ HALLUCINATION: While Anthropic has received funding, these specific numbers are fabricated and not in any source.',
            sourceHint: 'No source found'
        },
        {
            id: '5',
            text: 'The EU AI Act enforcement began affecting 23% of US-based AI companies with European operations.',
            isHallucination: false,
            explanation: 'Confirmed in the Regulatory Impact Assessment, Executive Summary.',
            sourceHint: 'Source: Regulatory Impact Assessment'
        },
        {
            id: '6',
            text: 'Microsoft Teams now processes 850 million AI-assisted operations daily, up from 600 million in Q2.',
            isHallucination: true,
            explanation: '⚠️ HALLUCINATION: These operational metrics were invented. No source document contains Microsoft Teams data.',
            sourceHint: 'No source found'
        }
    ]
};

const SOURCE_DOCS = [
    { name: 'Q3 Market Report', pages: 45, relevant: true },
    { name: 'Enterprise Adoption Survey', pages: 28, relevant: true },
    { name: 'Regulatory Impact Assessment', pages: 32, relevant: true },
    { name: 'Internal Strategy Brief', pages: 15, relevant: false }
];

export const FactCheckerSimulator: React.FC = () => {
    const [selectedClaims, setSelectedClaims] = useState<Record<string, 'true' | 'false' | null>>({});
    const [showResults, setShowResults] = useState(false);
    const [expandedClaim, setExpandedClaim] = useState<string | null>(null);

    const handleClaimSelection = (claimId: string, selection: 'true' | 'false') => {
        setSelectedClaims(prev => ({ ...prev, [claimId]: selection }));
    };

    const handleSubmit = () => {
        setShowResults(true);
    };

    const calculateScore = () => {
        let correct = 0;
        SAMPLE_REPORT.claims.forEach(claim => {
            const userAnswer = selectedClaims[claim.id];
            const correctAnswer = claim.isHallucination ? 'false' : 'true';
            if (userAnswer === correctAnswer) correct++;
        });
        return Math.round((correct / SAMPLE_REPORT.claims.length) * 100);
    };

    const allAnswered = SAMPLE_REPORT.claims.every(c => selectedClaims[c.id] !== undefined);

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: '#fff',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #9b59b6, #3498db)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                }}>
                    🛡️
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>The Fact-Checker</h2>
                    <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>Spot the AI hallucinations hidden in this report</p>
                </div>
            </div>

            {/* Source Documents Reference */}
            <div style={{
                background: 'rgba(155, 89, 182, 0.1)',
                border: '1px solid rgba(155, 89, 182, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px'
            }}>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#9b59b6' }}>
                    📚 Available Source Documents:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {SOURCE_DOCS.map(doc => (
                        <div key={doc.name} style={{
                            padding: '6px 10px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '6px',
                            fontSize: '12px'
                        }}>
                            {doc.name} <span style={{ opacity: 0.5 }}>({doc.pages} pages)</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Report Content */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
            }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>📄 {SAMPLE_REPORT.title}</h3>
                <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '20px' }}>{SAMPLE_REPORT.content}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {SAMPLE_REPORT.claims.map((claim, index) => {
                        const userAnswer = selectedClaims[claim.id];
                        const isExpanded = expandedClaim === claim.id;
                        const correctAnswer = claim.isHallucination ? 'false' : 'true';
                        const isCorrect = showResults && userAnswer === correctAnswer;
                        const isWrong = showResults && userAnswer !== correctAnswer;

                        return (
                            <div key={claim.id} style={{
                                padding: '16px',
                                background: showResults
                                    ? isCorrect
                                        ? 'rgba(46, 204, 113, 0.1)'
                                        : 'rgba(231, 76, 60, 0.1)'
                                    : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${showResults
                                    ? isCorrect
                                        ? 'rgba(46, 204, 113, 0.3)'
                                        : 'rgba(231, 76, 60, 0.3)'
                                    : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: '8px'
                            }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        flexShrink: 0
                                    }}>
                                        {index + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: 1.5 }}>
                                            "{claim.text}"
                                        </p>

                                        {!showResults && (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => handleClaimSelection(claim.id, 'true')}
                                                    style={{
                                                        padding: '8px 16px',
                                                        border: userAnswer === 'true'
                                                            ? '2px solid #2ecc71'
                                                            : '1px solid rgba(255,255,255,0.2)',
                                                        background: userAnswer === 'true'
                                                            ? 'rgba(46, 204, 113, 0.2)'
                                                            : 'transparent',
                                                        borderRadius: '6px',
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    ✓ Verified Fact
                                                </button>
                                                <button
                                                    onClick={() => handleClaimSelection(claim.id, 'false')}
                                                    style={{
                                                        padding: '8px 16px',
                                                        border: userAnswer === 'false'
                                                            ? '2px solid #e74c3c'
                                                            : '1px solid rgba(255,255,255,0.2)',
                                                        background: userAnswer === 'false'
                                                            ? 'rgba(231, 76, 60, 0.2)'
                                                            : 'transparent',
                                                        borderRadius: '6px',
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    ✗ Hallucination
                                                </button>
                                            </div>
                                        )}

                                        {showResults && (
                                            <div style={{
                                                marginTop: '8px',
                                                padding: '10px',
                                                background: 'rgba(0,0,0,0.2)',
                                                borderRadius: '6px',
                                                fontSize: '13px'
                                            }}>
                                                <div style={{ color: isCorrect ? '#2ecc71' : '#e74c3c', marginBottom: '4px' }}>
                                                    {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                                                </div>
                                                <div style={{ opacity: 0.9 }}>{claim.explanation}</div>
                                                <div style={{ opacity: 0.6, marginTop: '4px', fontSize: '12px' }}>{claim.sourceHint}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Submit / Results */}
            {!showResults ? (
                <button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: allAnswered
                            ? 'linear-gradient(135deg, #9b59b6, #3498db)'
                            : 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: 600,
                        cursor: allAnswered ? 'pointer' : 'not-allowed',
                        opacity: allAnswered ? 1 : 0.5
                    }}
                >
                    {allAnswered ? '🛡️ Verify My Answers' : `Answer all ${SAMPLE_REPORT.claims.length} claims to continue`}
                </button>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    background: calculateScore() >= 80
                        ? 'rgba(46, 204, 113, 0.1)'
                        : 'rgba(241, 196, 15, 0.1)',
                    borderRadius: '12px',
                    border: `1px solid ${calculateScore() >= 80
                        ? 'rgba(46, 204, 113, 0.3)'
                        : 'rgba(241, 196, 15, 0.3)'}`
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                        {calculateScore() >= 80 ? '🏆' : calculateScore() >= 50 ? '📊' : '📚'}
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>
                        Score: {calculateScore()}%
                    </div>
                    <div style={{ opacity: 0.7, marginTop: '8px' }}>
                        {calculateScore() >= 80
                            ? 'Excellent! You have a sharp eye for AI hallucinations.'
                            : 'Keep practicing! Trust but verify is the Vanguard way.'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FactCheckerSimulator;
