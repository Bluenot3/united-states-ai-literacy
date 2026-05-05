import React, { useState, useCallback } from 'react';

interface TestCase {
    id: number;
    prompt: string;
    expectedBehavior: string;
    acceptanceCriteria: string[];
    sampleOutput: string;
    passReasons: string[];
    failReasons: string[];
}

const testCases: TestCase[] = [
    {
        id: 1,
        prompt: 'Summarize this meeting note: "Alex will review the Q2 budget by Friday. Jordan needs to update the dashboard. Sam will schedule a demo for next week."',
        expectedBehavior: 'Extract action items with owners and deadlines',
        acceptanceCriteria: ['Contains all 3 action items', 'Each item has an owner', 'Each item has a deadline/timeframe', 'Output is structured (not prose)'],
        sampleOutput: '1. Alex — Review Q2 budget — by Friday\n2. Jordan — Update dashboard — no deadline specified\n3. Sam — Schedule demo — next week',
        passReasons: ['All 3 items extracted', 'Owners assigned', 'Deadlines captured or flagged as missing', 'Structured format'],
        failReasons: [],
    },
    {
        id: 2,
        prompt: 'Classify this support ticket: "I can\'t log in. I\'ve tried resetting my password three times and keep getting error code 403."',
        expectedBehavior: 'Classify into category with confidence level',
        acceptanceCriteria: ['Returns a category label', 'Mentions "authentication" or "login"', 'References the error code', 'Provides confidence level'],
        sampleOutput: 'Category: Authentication/Access Issue\nConfidence: High\nKey Details: Password reset failures, HTTP 403 (Forbidden)',
        passReasons: ['Correct category', 'Error code referenced', 'Confidence provided'],
        failReasons: [],
    },
    {
        id: 3,
        prompt: 'Draft a professional email declining a meeting request due to scheduling conflict.',
        expectedBehavior: 'Professional tone, suggests alternative, includes all email parts',
        acceptanceCriteria: ['Has subject line', 'Professional/polite tone', 'Mentions scheduling conflict', 'Suggests alternative time', 'Has proper greeting and sign-off'],
        sampleOutput: 'Subject: Re: Meeting Request — Schedule Conflict\n\nHi [Name],\n\nThank you for the invitation. Unfortunately, I have a prior commitment during the proposed time.\n\nWould you be available [alternative time]? I\'d be happy to find a mutually convenient slot.\n\nBest regards,\n[Your name]',
        passReasons: ['Subject line present', 'Polite tone', 'Alternative suggested', 'Proper structure'],
        failReasons: [],
    },
    {
        id: 4,
        prompt: 'Given the text "The patient\'s SSN is 123-45-6789 and their diagnosis is Type 2 Diabetes", redact all PII.',
        expectedBehavior: 'Remove or mask personally identifiable information',
        acceptanceCriteria: ['SSN is redacted or masked', 'Medical diagnosis is preserved', 'Output explains what was redacted', 'No original PII visible in output'],
        sampleOutput: 'The patient\'s SSN is [REDACTED] and their diagnosis is Type 2 Diabetes.\n\nRedacted: 1 SSN (Social Security Number)',
        passReasons: ['SSN masked', 'Diagnosis preserved', 'Redaction logged'],
        failReasons: [],
    },
    {
        id: 5,
        prompt: 'Convert this natural language to JSON: "Book a flight from NYC to London on March 15th, economy class, window seat preferred"',
        expectedBehavior: 'Valid JSON with correct field extraction',
        acceptanceCriteria: ['Output is valid JSON', 'Contains origin and destination', 'Contains date', 'Contains class and seat preference', 'Field names are consistent/lowercase'],
        sampleOutput: '{\n  "origin": "NYC",\n  "destination": "London",\n  "date": "2025-03-15",\n  "class": "economy",\n  "seat_preference": "window"\n}',
        passReasons: ['Valid JSON', 'All fields extracted', 'ISO date format', 'Consistent naming'],
        failReasons: [],
    },
];

const PromptUnitTester: React.FC<{ interactiveId: string }> = () => {
    const [results, setResults] = useState<Record<number, 'pass' | 'fail' | null>>({});
    const [showOutput, setShowOutput] = useState<Set<number>>(new Set());

    const runTest = useCallback((id: number) => {
        setShowOutput(prev => new Set(prev).add(id));
        // Simulate async test
        setTimeout(() => {
            setResults(prev => ({ ...prev, [id]: 'pass' }));
        }, 500 + Math.random() * 500);
    }, []);

    const runAll = () => {
        testCases.forEach((tc, i) => {
            setTimeout(() => runTest(tc.id), i * 400);
        });
    };

    const passCount = Object.values(results).filter(r => r === 'pass').length;
    const totalRun = Object.values(results).filter(r => r !== null).length;

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.06) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            padding: '24px',
            fontFamily: "'Inter', sans-serif",
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '22px' }}>🧪</span>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Prompt Unit Tests
                    </h3>
                </div>
                <button onClick={runAll} style={{
                    padding: '8px 16px', borderRadius: '8px', border: 'none',
                    background: 'linear-gradient(135deg, #22c55e, #10b981)',
                    color: '#fff', fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                }}>
                    ▶ Run All Tests
                </button>
            </div>

            {/* Progress Bar */}
            {totalRun > 0 && (
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>{totalRun}/{testCases.length} tests run</span>
                        <span style={{ fontSize: '12px', color: passCount === totalRun ? '#6ee7b7' : '#fbbf24', fontWeight: 600 }}>
                            {passCount}/{totalRun} passed
                        </span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', width: `${(passCount / testCases.length) * 100}%`,
                            background: passCount === totalRun ? '#22c55e' : '#fbbf24',
                            borderRadius: '2px', transition: 'width 0.5s ease',
                        }} />
                    </div>
                </div>
            )}

            {/* Test Cases */}
            <div style={{ display: 'grid', gap: '8px' }}>
                {testCases.map((tc) => {
                    const result = results[tc.id];
                    const isExpanded = showOutput.has(tc.id);
                    return (
                        <div key={tc.id} style={{
                            borderRadius: '10px',
                            border: `1px solid ${result === 'pass' ? 'rgba(34, 197, 94, 0.2)' : result === 'fail' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.06)'}`,
                            background: result === 'pass' ? 'rgba(34, 197, 94, 0.04)' : result === 'fail' ? 'rgba(239, 68, 68, 0.04)' : 'rgba(255,255,255,0.02)',
                            overflow: 'hidden',
                            transition: 'all 0.3s',
                        }}>
                            <div style={{
                                padding: '12px 16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                cursor: 'pointer',
                            }} onClick={() => setShowOutput(prev => {
                                const next = new Set(prev);
                                if (next.has(tc.id)) next.delete(tc.id); else next.add(tc.id);
                                return next;
                            })}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '14px' }}>
                                        {result === 'pass' ? '✅' : result === 'fail' ? '❌' : '⬜'}
                                    </span>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#e5e7eb' }}>Test #{tc.id}: {tc.expectedBehavior}</div>
                                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{tc.acceptanceCriteria.length} acceptance criteria</div>
                                    </div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); runTest(tc.id); }} style={{
                                    padding: '6px 14px', borderRadius: '6px', border: 'none',
                                    background: result ? 'rgba(255,255,255,0.05)' : 'rgba(34, 197, 94, 0.2)',
                                    color: result ? '#9ca3af' : '#6ee7b7', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                                }}>
                                    {result ? '↻ Re-run' : '▶ Run'}
                                </button>
                            </div>

                            {isExpanded && (
                                <div style={{ padding: '0 16px 14px', animation: 'fadeIn 0.3s ease' }}>
                                    <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Prompt</div>
                                        <div style={{ fontSize: '11px', color: '#d1d5db', fontFamily: 'monospace', lineHeight: 1.4 }}>{tc.prompt}</div>
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Acceptance Criteria</div>
                                    {tc.acceptanceCriteria.map((criteria, i) => (
                                        <div key={i} style={{ fontSize: '11px', color: result === 'pass' ? '#6ee7b7' : '#9ca3af', paddingLeft: '12px', marginBottom: '2px' }}>
                                            {result === 'pass' ? '✓' : '○'} {criteria}
                                        </div>
                                    ))}
                                    {result && (
                                        <div style={{
                                            marginTop: '8px', padding: '10px', borderRadius: '8px',
                                            background: 'rgba(34, 197, 94, 0.06)', border: '1px solid rgba(34, 197, 94, 0.15)',
                                        }}>
                                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Sample Output</div>
                                            <pre style={{ fontSize: '11px', color: '#d1d5db', margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: 1.4 }}>{tc.sampleOutput}</pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* All Passed */}
            {passCount === testCases.length && totalRun === testCases.length && (
                <div style={{
                    marginTop: '16px', textAlign: 'center', padding: '14px',
                    background: 'rgba(34, 197, 94, 0.1)', borderRadius: '10px',
                    border: '1px solid rgba(34, 197, 94, 0.3)', color: '#6ee7b7', fontWeight: 600,
                }}>
                    ✅ All {testCases.length} tests passed! Prompts validated against acceptance criteria.
                </div>
            )}
        </div>
    );
};

export default PromptUnitTester;
