import React, { useState, useCallback } from 'react';

const samplePrompts = [
    'Write a one-sentence description of a sunset.',
    'Explain what an API is in simple terms.',
    'Write a creative tagline for a coffee shop.',
    'Describe a robot learning to paint.',
];

// Simulated outputs at different temperatures
const outputsByTemp: Record<string, string[]> = {
    'Write a one-sentence description of a sunset.': [
        'The sun descends below the horizon, casting orange and pink hues across the sky.',
        'A blazing orb melts into the sea, painting the clouds in streaks of amber and violet.',
        'The sky fractures into a kaleidoscope of molten gold and bruised purple as the sun drowns in liquid horizon.',
    ],
    'Explain what an API is in simple terms.': [
        'An API is a set of rules that allows different software programs to communicate with each other.',
        'Think of an API as a waiter in a restaurant — it takes your order to the kitchen and brings back what you asked for.',
        'An API is like a universal translator that lets alien civilizations share recipes through quantum radio waves of structured data.',
    ],
    'Write a creative tagline for a coffee shop.': [
        'Great coffee, served fresh daily.',
        'Where every cup tells a story and every sip writes a new chapter.',
        'Caffeinated chaos in a ceramic universe — your brain\'s favorite fuel station in the multiverse of mornings.',
    ],
    'Describe a robot learning to paint.': [
        'A robot uses its mechanical arm to apply paint to a canvas, learning from each stroke to improve its technique.',
        'Brushstroke by brushstroke, the robot discovers color — each failed attempt teaching it something no programmer could code.',
        'Paint splatters across chrome fingers as the robot hallucinates sunflowers it has never seen, inventing beauty from mathematics alone.',
    ],
};

const tempLabels = [
    { value: 0, label: 'Temperature 0.0', desc: 'Deterministic — same output every time' },
    { value: 1, label: 'Temperature 1.0', desc: 'Balanced — creative but coherent' },
    { value: 2, label: 'Temperature 2.0', desc: 'Maximum chaos — wild and unpredictable' },
];

const TemperaturePlayground: React.FC<{ interactiveId: string }> = () => {
    const [selectedPrompt, setSelectedPrompt] = useState(samplePrompts[0]);
    const [tempIndex, setTempIndex] = useState(0);
    const [generated, setGenerated] = useState(false);
    const [loading, setLoading] = useState(false);

    const generate = useCallback(() => {
        setLoading(true);
        setGenerated(false);
        setTimeout(() => {
            setGenerated(true);
            setLoading(false);
        }, 800 + Math.random() * 600);
    }, []);

    const outputs = outputsByTemp[selectedPrompt] || outputsByTemp[samplePrompts[0]];

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(168, 85, 247, 0.08) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            padding: '24px',
            fontFamily: "'Inter', sans-serif",
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '22px' }}>🎛️</span>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Same Prompt, Different Worlds
                </h3>
            </div>

            {/* Prompt Selector */}
            <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Select a Prompt</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {samplePrompts.map((p, i) => (
                        <button
                            key={i}
                            onClick={() => { setSelectedPrompt(p); setGenerated(false); }}
                            style={{
                                padding: '10px 14px',
                                borderRadius: '10px',
                                border: `1px solid ${selectedPrompt === p ? 'rgba(167, 139, 250, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                                background: selectedPrompt === p ? 'rgba(167, 139, 250, 0.12)' : 'rgba(255,255,255,0.02)',
                                color: selectedPrompt === p ? '#c4b5fd' : '#9ca3af',
                                fontSize: '13px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s',
                                lineHeight: 1.4,
                            }}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Temperature Slider */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Temperature</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {tempLabels.map((t, i) => (
                        <button
                            key={i}
                            onClick={() => { setTempIndex(i); setGenerated(false); }}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '10px',
                                border: `1px solid ${tempIndex === i ? 'rgba(167, 139, 250, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                                background: tempIndex === i
                                    ? `rgba(${i === 0 ? '59, 130, 246' : i === 1 ? '167, 139, 250' : '239, 68, 68'}, 0.15)`
                                    : 'rgba(255,255,255,0.02)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'center',
                            }}
                        >
                            <div style={{ fontSize: '14px', fontWeight: 700, color: i === 0 ? '#93c5fd' : i === 1 ? '#c4b5fd' : '#fca5a5' }}>
                                {t.label}
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{t.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Generate Button */}
            <button
                onClick={generate}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: loading ? 'rgba(99, 102, 241, 0.2)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: loading ? 'wait' : 'pointer',
                    transition: 'all 0.3s',
                    marginBottom: '16px',
                }}
            >
                {loading ? '⏳ Generating...' : '⚡ Generate Output'}
            </button>

            {/* Output Display */}
            {generated && (
                <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '12px',
                    padding: '18px',
                    border: `1px solid rgba(${tempIndex === 0 ? '59, 130, 246' : tempIndex === 1 ? '167, 139, 250' : '239, 68, 68'}, 0.2)`,
                    animation: 'fadeIn 0.4s ease',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{
                            fontSize: '11px', padding: '3px 8px', borderRadius: '6px', fontWeight: 600,
                            background: tempIndex === 0 ? 'rgba(59, 130, 246, 0.2)' : tempIndex === 1 ? 'rgba(167, 139, 250, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: tempIndex === 0 ? '#93c5fd' : tempIndex === 1 ? '#c4b5fd' : '#fca5a5',
                        }}>
                            {tempLabels[tempIndex].label}
                        </span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                            {tempIndex === 0 ? '📐 Precise' : tempIndex === 1 ? '🎨 Creative' : '🌀 Chaotic'}
                        </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#e5e7eb', lineHeight: 1.6, fontStyle: 'italic' }}>
                        "{outputs[tempIndex]}"
                    </p>
                    {tempIndex === 2 && (
                        <div style={{
                            marginTop: '12px',
                            padding: '8px 12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            fontSize: '12px',
                            color: '#fca5a5',
                        }}>
                            ⚠️ Notice: High temperature increases creativity but also increases hallucination risk and inconsistency.
                        </div>
                    )}
                </div>
            )}

            {/* Insight */}
            <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: 'rgba(99, 102, 241, 0.06)',
                borderRadius: '10px',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                fontSize: '12px',
                color: '#a5b4fc',
                lineHeight: 1.5,
            }}>
                💡 <strong>Key Insight:</strong> Temperature is the risk/creativity dial. Low temperature = safe, predictable, boring. High temperature = novel, surprising, risky. Professional applications typically use 0.0–0.3. Creative tasks use 0.7–1.2.
            </div>
        </div>
    );
};

export default TemperaturePlayground;
