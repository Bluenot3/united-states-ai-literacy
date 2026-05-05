import React, { useState, useCallback } from 'react';

interface Challenge {
    title: string;
    description: string;
    brokenJson: string;
    issues: string[];
    fixedJson: string;
    schema: string;
}

const challenges: Challenge[] = [
    {
        title: 'Missing Fields',
        description: 'The model forgot to include required fields in the output.',
        brokenJson: `{
  "action": "Send follow-up email",
  "deadline": "2025-03-15"
}`,
        issues: ['Missing "owner" field (required)', 'Missing "priority" field (required)', 'Missing "dependencies" field (required)'],
        fixedJson: `{
  "owner": "Alex",
  "action": "Send follow-up email",
  "deadline": "2025-03-15",
  "priority": "high",
  "dependencies": []
}`,
        schema: 'Required: owner (string), action (string), deadline (date), priority (low|medium|high), dependencies (array)',
    },
    {
        title: 'Wrong Types',
        description: 'The model returned the right fields but with incorrect data types.',
        brokenJson: `{
  "owner": "Jordan",
  "action": "Review contract",
  "deadline": "next Tuesday",
  "priority": 3,
  "dependencies": "none"
}`,
        issues: ['"deadline" should be ISO date format, got "next Tuesday"', '"priority" should be string enum (low|medium|high), got number 3', '"dependencies" should be an array, got string "none"'],
        fixedJson: `{
  "owner": "Jordan",
  "action": "Review contract",
  "deadline": "2025-03-18",
  "priority": "high",
  "dependencies": []
}`,
        schema: 'Required: owner (string), action (string), deadline (ISO date), priority (low|medium|high), dependencies (string[])',
    },
    {
        title: 'Invalid JSON Syntax',
        description: 'The model produced text that looks like JSON but won\'t parse.',
        brokenJson: `{
  "owner": "Sam",
  "action": "Update the dashboard",
  "deadline": "2025-04-01"
  "priority": "medium",
  "dependencies": ["design review", "API update",]
}`,
        issues: ['Missing comma after "deadline" value (line 4)', 'Trailing comma in "dependencies" array (line 6)'],
        fixedJson: `{
  "owner": "Sam",
  "action": "Update the dashboard",
  "deadline": "2025-04-01",
  "priority": "medium",
  "dependencies": ["design review", "API update"]
}`,
        schema: 'Valid JSON required — no trailing commas, all key-value pairs separated by commas.',
    },
];

const JsonSurgeon: React.FC<{ interactiveId: string }> = () => {
    const [challengeIndex, setChallengeIndex] = useState(0);
    const [showIssues, setShowIssues] = useState(false);
    const [showFix, setShowFix] = useState(false);
    const [userAttempt, setUserAttempt] = useState('');
    const [validated, setValidated] = useState<boolean | null>(null);

    const challenge = challenges[challengeIndex];

    const selectChallenge = (i: number) => {
        setChallengeIndex(i);
        setShowIssues(false);
        setShowFix(false);
        setUserAttempt('');
        setValidated(null);
    };

    const validateAttempt = useCallback(() => {
        try {
            const parsed = JSON.parse(userAttempt);
            const hasAllFields = ['owner', 'action', 'deadline', 'priority', 'dependencies'].every(f => f in parsed);
            const depsIsArray = Array.isArray(parsed.dependencies);
            const priorityValid = ['low', 'medium', 'high'].includes(parsed.priority);
            setValidated(hasAllFields && depsIsArray && priorityValid);
        } catch {
            setValidated(false);
        }
    }, [userAttempt]);

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(14, 165, 233, 0.08) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            padding: '24px',
            fontFamily: "'Inter', sans-serif",
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '22px' }}>🔧</span>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    JSON Surgeon
                </h3>
            </div>

            {/* Challenge Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {challenges.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => selectChallenge(i)}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: `1px solid ${challengeIndex === i ? 'rgba(34, 211, 238, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                            background: challengeIndex === i ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255,255,255,0.02)',
                            color: challengeIndex === i ? '#67e8f9' : '#9ca3af',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {c.title}
                    </button>
                ))}
            </div>

            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px' }}>{challenge.description}</p>

            {/* Schema */}
            <div style={{
                padding: '10px 14px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)',
                marginBottom: '12px',
            }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600 }}>Expected Schema</span>
                <div style={{ fontSize: '12px', color: '#67e8f9', marginTop: '4px', fontFamily: 'monospace' }}>{challenge.schema}</div>
            </div>

            {/* Broken JSON */}
            <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>🔴 Model Output (Broken)</span>
                <pre style={{
                    background: 'rgba(239, 68, 68, 0.06)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    padding: '14px',
                    color: '#fca5a5',
                    fontSize: '12px',
                    fontFamily: "'Courier New', monospace",
                    overflow: 'auto',
                    whiteSpace: 'pre',
                    margin: '6px 0 0 0',
                }}>
                    {challenge.brokenJson}
                </pre>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button
                    onClick={() => setShowIssues(!showIssues)}
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        background: showIssues ? 'rgba(251, 191, 36, 0.12)' : 'rgba(251, 191, 36, 0.05)',
                        color: '#fde68a',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    {showIssues ? '🔍 Hide Issues' : '🔍 Diagnose Issues'}
                </button>
                <button
                    onClick={() => setShowFix(!showFix)}
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        background: showFix ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.05)',
                        color: '#6ee7b7',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    {showFix ? '✅ Hide Fix' : '✅ Show Correct JSON'}
                </button>
            </div>

            {/* Issues */}
            {showIssues && (
                <div style={{
                    padding: '14px',
                    background: 'rgba(251, 191, 36, 0.06)',
                    borderRadius: '10px',
                    border: '1px solid rgba(251, 191, 36, 0.15)',
                    marginBottom: '12px',
                    animation: 'fadeIn 0.3s ease',
                }}>
                    {challenge.issues.map((issue, i) => (
                        <div key={i} style={{ fontSize: '12px', color: '#fde68a', marginBottom: '4px', paddingLeft: '8px' }}>⚠️ {issue}</div>
                    ))}
                </div>
            )}

            {/* Fixed JSON */}
            {showFix && (
                <div style={{ marginBottom: '12px', animation: 'fadeIn 0.3s ease' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>🟢 Corrected Output</span>
                    <pre style={{
                        background: 'rgba(16, 185, 129, 0.06)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '8px',
                        padding: '14px',
                        color: '#6ee7b7',
                        fontSize: '12px',
                        fontFamily: "'Courier New', monospace",
                        overflow: 'auto',
                        whiteSpace: 'pre',
                        margin: '6px 0 0 0',
                    }}>
                        {challenge.fixedJson}
                    </pre>
                </div>
            )}

            {/* User Try */}
            <div style={{ marginTop: '16px' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>✏️ Your Fix — Try writing the corrected JSON</span>
                <textarea
                    value={userAttempt}
                    onChange={(e) => { setUserAttempt(e.target.value); setValidated(null); }}
                    placeholder='Paste or type your corrected JSON here...'
                    style={{
                        width: '100%',
                        minHeight: '100px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: '#e5e7eb',
                        fontSize: '12px',
                        fontFamily: "'Courier New', monospace",
                        resize: 'vertical',
                        outline: 'none',
                        marginTop: '6px',
                        boxSizing: 'border-box',
                    }}
                />
                <button
                    onClick={validateAttempt}
                    disabled={!userAttempt.trim()}
                    style={{
                        marginTop: '8px',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: !userAttempt.trim() ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: !userAttempt.trim() ? 'not-allowed' : 'pointer',
                    }}
                >
                    🧪 Validate
                </button>
                {validated === true && (
                    <span style={{ marginLeft: '12px', color: '#6ee7b7', fontSize: '13px', fontWeight: 600 }}>✅ Valid JSON with correct schema!</span>
                )}
                {validated === false && (
                    <span style={{ marginLeft: '12px', color: '#fca5a5', fontSize: '13px', fontWeight: 600 }}>❌ Invalid — check syntax and required fields.</span>
                )}
            </div>
        </div>
    );
};

export default JsonSurgeon;
