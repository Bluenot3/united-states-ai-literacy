import React, { useState, useMemo } from 'react';

const costPerToken = {
    cheap: 0.00000015,  // $0.15/1M tokens
    mid: 0.0000025,     // $2.50/1M tokens
    expensive: 0.00006, // $60/1M tokens
};

const modelTiers = [
    { name: 'Fast / Cheap (e.g., GPT-4o-mini, Flash)', tier: 'cheap' as const, color: '#34d399' },
    { name: 'Balanced (e.g., GPT-4o, Sonnet)', tier: 'mid' as const, color: '#fbbf24' },
    { name: 'Premium (e.g., o1, Opus)', tier: 'expensive' as const, color: '#f87171' },
];

function estimateTokens(text: string): number {
    // Rough: ~4 chars per token for English
    return Math.max(1, Math.ceil(text.length / 4));
}

const tips = [
    'Remove filler words ("basically", "essentially", "in other words")',
    'Replace examples with patterns: "e.g., X, Y, Z" → "e.g., [category]"',
    'Use bullet constraints instead of paragraph-long instructions',
    'Move static instructions to system prompt (sent once, not per request)',
    'Use structured output format to reduce parsing tokens',
];

const TokenReceiptPrinter: React.FC<{ interactiveId: string }> = () => {
    const [text, setText] = useState('');
    const [showReceipt, setShowReceipt] = useState(false);

    const tokenCount = useMemo(() => estimateTokens(text), [text]);

    const getCostBand = (tokens: number) => {
        if (tokens < 200) return { label: '💚 Cheap', color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' };
        if (tokens < 800) return { label: '🟡 Medium', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' };
        return { label: '🔴 Expensive', color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)' };
    };

    const band = getCostBand(tokenCount);

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, rgba(245, 158, 11, 0.08) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            padding: '24px',
            fontFamily: "'Inter', sans-serif",
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '22px' }}>🧾</span>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Token Receipt Printer
                </h3>
            </div>

            {/* Input */}
            <textarea
                value={text}
                onChange={(e) => { setText(e.target.value); setShowReceipt(false); }}
                placeholder="Paste your prompt text here to analyze token usage and cost..."
                style={{
                    width: '100%',
                    minHeight: '120px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '14px',
                    color: '#e5e7eb',
                    fontSize: '13px',
                    fontFamily: "'Inter', monospace",
                    resize: 'vertical',
                    outline: 'none',
                    lineHeight: 1.5,
                    boxSizing: 'border-box',
                }}
            />

            {/* Live counter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                    {text.length} characters · ~{tokenCount} tokens
                </span>
                <span style={{
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    background: band.bg,
                    color: band.color,
                    fontWeight: 600,
                }}>
                    {band.label}
                </span>
            </div>

            <button
                onClick={() => setShowReceipt(true)}
                disabled={!text.trim()}
                style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: !text.trim() ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: !text.trim() ? 'rgba(255,255,255,0.3)' : '#fff',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: !text.trim() ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    marginBottom: '16px',
                }}
            >
                🖨️ Print Receipt
            </button>

            {/* Receipt */}
            {showReceipt && text.trim() && (
                <div style={{
                    background: 'rgba(0,0,0,0.4)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px dashed rgba(251, 191, 36, 0.3)',
                    fontFamily: "'Courier New', monospace",
                    animation: 'fadeIn 0.4s ease',
                }}>
                    <div style={{ textAlign: 'center', color: '#fbbf24', fontSize: '14px', fontWeight: 700, marginBottom: '12px', letterSpacing: '2px' }}>
                        ═══ TOKEN RECEIPT ═══
                    </div>
                    <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Input Characters</span>
                            <span style={{ color: '#e5e7eb', fontSize: '12px', fontWeight: 600 }}>{text.length}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Est. Tokens</span>
                            <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 700 }}>{tokenCount}</span>
                        </div>
                        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', marginTop: '10px', paddingTop: '10px' }}>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase' }}>Cost Estimate (per call)</div>
                            {modelTiers.map((m, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{m.name}</span>
                                    <span style={{ color: m.color, fontSize: '11px', fontWeight: 600 }}>
                                        ${(tokenCount * costPerToken[m.tier]).toFixed(6)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', marginTop: '10px', paddingTop: '10px' }}>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase' }}>At 1,000 calls/day</div>
                            {modelTiers.map((m, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{m.name}</span>
                                    <span style={{ color: m.color, fontSize: '11px', fontWeight: 600 }}>
                                        ${(tokenCount * costPerToken[m.tier] * 1000 * 30).toFixed(2)}/month
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '10px', marginTop: '12px', letterSpacing: '2px' }}>
                        ═══════════════════
                    </div>
                </div>
            )}

            {/* Optimization Tips */}
            {showReceipt && tokenCount > 100 && (
                <div style={{
                    marginTop: '16px',
                    padding: '14px 16px',
                    background: 'rgba(16, 185, 129, 0.06)',
                    borderRadius: '10px',
                    border: '1px solid rgba(16, 185, 129, 0.15)',
                }}>
                    <div style={{ fontSize: '12px', color: '#6ee7b7', fontWeight: 700, marginBottom: '8px' }}>💡 Optimization Suggestions</div>
                    {tips.slice(0, 3).map((tip, i) => (
                        <div key={i} style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', paddingLeft: '12px' }}>
                            • {tip}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TokenReceiptPrinter;
