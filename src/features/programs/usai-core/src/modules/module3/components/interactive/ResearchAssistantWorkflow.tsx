import React, { useState } from 'react';

interface WorkflowStep {
    id: string;
    name: string;
    icon: string;
    description: string;
    action: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
    {
        id: 'hunt',
        name: 'HUNT',
        icon: '🎯',
        description: 'Identify high-value sources',
        action: 'Add URLs to your target list'
    },
    {
        id: 'gather',
        name: 'GATHER',
        icon: '🕷️',
        description: 'Scrape raw content using Firecrawl',
        action: 'Extract text and structure'
    },
    {
        id: 'distill',
        name: 'DISTILL',
        icon: '⚗️',
        description: 'Extract the signal from noise',
        action: 'AI strips ads, banners, and fluff'
    }
];

interface Source {
    id: string;
    url: string;
    title: string;
    status: 'pending' | 'gathered' | 'distilled';
    rawContent?: string;
    distilledContent?: string;
}

const SAMPLE_SOURCES: Source[] = [
    {
        id: '1',
        url: 'https://arxiv.org/paper/2025/transformer-advances',
        title: 'Advances in Transformer Architecture',
        status: 'pending',
        rawContent: `<header>ArXiv.org</header><nav>Home | Papers | About</nav>
<article>
<h1>Advances in Transformer Architecture: A 2025 Survey</h1>
<div class="authors">Zhang et al., Stanford AI Lab</div>
<div class="abstract">
This paper surveys recent advances in transformer architectures, focusing on three key innovations:
1. **Sparse Attention Mechanisms** - Reducing computational complexity from O(n²) to O(n log n)
2. **Mixture of Experts (MoE)** - Dynamic routing enabling 10x parameter scaling
3. **Multi-Modal Fusion** - Native support for text, image, and audio tokens
Key findings show 47% improvement in efficiency with comparable accuracy.
</div>
<footer>Copyright 2025 ArXiv</footer>`,
        distilledContent: `**Advances in Transformer Architecture (Zhang et al., Stanford)**

Key Innovations:
• Sparse Attention: O(n²) → O(n log n) complexity
• Mixture of Experts: 10x parameter scaling via dynamic routing
• Multi-Modal Fusion: Native text/image/audio token support

**Bottom Line:** 47% efficiency improvement with comparable accuracy.`
    },
    {
        id: '2',
        url: 'https://techcrunch.com/2025/ai-funding-trends',
        title: 'AI Funding Reaches Record Heights in 2025',
        status: 'pending',
        rawContent: `<header>TechCrunch</header><nav>Startups | AI | Crypto | Enterprise</nav>
<div class="ad">SPONSORED: Try Notion AI Free</div>
<article>
<h1>AI Funding Reaches Record Heights in 2025</h1>
<div class="ad">Advertisement</div>
<p>Venture capital investment in AI startups hit $127B in 2025, a 89% increase from 2024.</p>
<p>Top funded areas: Foundation models ($42B), Enterprise AI ($31B), AI Infrastructure ($28B)</p>
<p>Leading investors: a16z, Sequoia, Tiger Global</p>
<div class="ad">Subscribe to our newsletter!</div>
<p>Expert quote: "This is the largest capital deployment we've seen in any tech sector" - Marc Andreessen</p>
</article>
<footer>More from TechCrunch | Privacy Policy</footer>`,
        distilledContent: `**AI Funding Trends 2025**

• Total VC Investment: $127B (+89% YoY)

**Top Sectors:**
- Foundation Models: $42B
- Enterprise AI: $31B  
- AI Infrastructure: $28B

**Key Investors:** a16z, Sequoia, Tiger Global

**Quote:** "Largest capital deployment in any tech sector" - Marc Andreessen`
    }
];

export const ResearchAssistantWorkflow: React.FC = () => {
    const [sources, setSources] = useState<Source[]>(SAMPLE_SOURCES);
    const [currentStep, setCurrentStep] = useState<string>('hunt');
    const [newUrl, setNewUrl] = useState('');
    const [selectedSource, setSelectedSource] = useState<string | null>(null);
    const [showContent, setShowContent] = useState<'raw' | 'distilled' | null>(null);

    const handleAddSource = () => {
        if (!newUrl.trim()) return;
        const newSource: Source = {
            id: `src${Date.now()}`,
            url: newUrl,
            title: new URL(newUrl).hostname + ' - Custom Source',
            status: 'pending'
        };
        setSources(prev => [...prev, newSource]);
        setNewUrl('');
    };

    const handleGather = (sourceId: string) => {
        setSources(prev => prev.map(s =>
            s.id === sourceId
                ? { ...s, status: 'gathered' as const }
                : s
        ));
    };

    const handleDistill = (sourceId: string) => {
        setSources(prev => prev.map(s =>
            s.id === sourceId
                ? { ...s, status: 'distilled' as const }
                : s
        ));
    };

    const getStepProgress = () => {
        const pending = sources.filter(s => s.status === 'pending').length;
        const gathered = sources.filter(s => s.status === 'gathered').length;
        const distilled = sources.filter(s => s.status === 'distilled').length;
        return { pending, gathered, distilled, total: sources.length };
    };

    const progress = getStepProgress();
    const selected = sources.find(s => s.id === selectedSource);

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
                    background: 'linear-gradient(135deg, #2ecc71, #3498db)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                }}>
                    🔬
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Research Assistant Workflow</h2>
                    <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>Hunt → Gather → Distill: The 5-Minute Expert Protocol</p>
                </div>
            </div>

            {/* Workflow Pipeline */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '24px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px',
                padding: '16px'
            }}>
                {WORKFLOW_STEPS.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <div
                            onClick={() => setCurrentStep(step.id)}
                            style={{
                                flex: 1,
                                padding: '16px',
                                background: currentStep === step.id
                                    ? 'rgba(46, 204, 113, 0.2)'
                                    : 'rgba(255,255,255,0.05)',
                                border: currentStep === step.id
                                    ? '1px solid rgba(46, 204, 113, 0.5)'
                                    : '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{step.icon}</div>
                            <div style={{ fontWeight: 600, marginBottom: '4px' }}>{step.name}</div>
                            <div style={{ fontSize: '12px', opacity: 0.7 }}>{step.description}</div>
                        </div>
                        {index < WORKFLOW_STEPS.length - 1 && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'rgba(255,255,255,0.3)',
                                fontSize: '24px'
                            }}>
                                →
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Progress Bar */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px'
            }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>Pending</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#f1c40f' }}>{progress.pending}</div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>Gathered</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#3498db' }}>{progress.gathered}</div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>Distilled</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#2ecc71' }}>{progress.distilled}</div>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Sources List */}
                <div>
                    {currentStep === 'hunt' && (
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                            <input
                                type="text"
                                placeholder="https://example.com/article"
                                value={newUrl}
                                onChange={e => setNewUrl(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#fff'
                                }}
                            />
                            <button
                                onClick={handleAddSource}
                                style={{
                                    padding: '10px 16px',
                                    background: '#2ecc71',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                + Add
                            </button>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                        {sources.map(source => (
                            <div
                                key={source.id}
                                onClick={() => setSelectedSource(source.id)}
                                style={{
                                    padding: '12px',
                                    background: selectedSource === source.id
                                        ? 'rgba(52, 152, 219, 0.2)'
                                        : 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${selectedSource === source.id
                                        ? 'rgba(52, 152, 219, 0.5)'
                                        : 'rgba(255,255,255,0.1)'}`,
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '10px',
                                        fontWeight: 600,
                                        background: source.status === 'distilled'
                                            ? '#2ecc71'
                                            : source.status === 'gathered'
                                                ? '#3498db'
                                                : '#f1c40f'
                                    }}>
                                        {source.status.toUpperCase()}
                                    </span>
                                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{source.title}</span>
                                </div>
                                <div style={{ fontSize: '11px', opacity: 0.6, wordBreak: 'break-all' }}>{source.url}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Panel */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    padding: '16px'
                }}>
                    {selected ? (
                        <>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>{selected.title}</h4>

                            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                {selected.status === 'pending' && (
                                    <button
                                        onClick={() => handleGather(selected.id)}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            background: 'linear-gradient(135deg, #3498db, #2980b9)',
                                            border: 'none',
                                            borderRadius: '6px',
                                            color: '#fff',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        🕷️ Gather Content
                                    </button>
                                )}
                                {selected.status === 'gathered' && (
                                    <button
                                        onClick={() => handleDistill(selected.id)}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                                            border: 'none',
                                            borderRadius: '6px',
                                            color: '#fff',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ⚗️ Distill Signal
                                    </button>
                                )}
                                {selected.status === 'distilled' && (
                                    <div style={{
                                        flex: 1,
                                        padding: '10px',
                                        background: 'rgba(46, 204, 113, 0.2)',
                                        borderRadius: '6px',
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        color: '#2ecc71'
                                    }}>
                                        ✓ Ready for Synthesis
                                    </div>
                                )}
                            </div>

                            {/* Content Preview */}
                            {(selected.status === 'gathered' || selected.status === 'distilled') && selected.rawContent && (
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <button
                                            onClick={() => setShowContent('raw')}
                                            style={{
                                                padding: '6px 12px',
                                                background: showContent === 'raw' ? 'rgba(255,255,255,0.2)' : 'transparent',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '4px',
                                                color: '#fff',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Raw HTML
                                        </button>
                                        {selected.status === 'distilled' && (
                                            <button
                                                onClick={() => setShowContent('distilled')}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: showContent === 'distilled' ? 'rgba(46, 204, 113, 0.3)' : 'transparent',
                                                    border: '1px solid rgba(46, 204, 113, 0.5)',
                                                    borderRadius: '4px',
                                                    color: '#2ecc71',
                                                    fontSize: '12px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Distilled ✓
                                            </button>
                                        )}
                                    </div>

                                    <div style={{
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        padding: '12px',
                                        background: 'rgba(0,0,0,0.3)',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontFamily: 'monospace',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: 1.6
                                    }}>
                                        {showContent === 'distilled' && selected.distilledContent
                                            ? selected.distilledContent
                                            : selected.rawContent}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0.5
                        }}>
                            Select a source to process
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResearchAssistantWorkflow;
