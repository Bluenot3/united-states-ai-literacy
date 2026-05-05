import React, { useState, useMemo } from 'react';

interface DocChunk {
    id: number;
    title: string;
    content: string;
    keywords: string[];
    semanticTags: string[];
}

const corpus: DocChunk[] = [
    { id: 1, title: 'Remote Work Policy §3.2', content: 'Employees may work remotely up to 3 days per week with manager approval. All remote work arrangements must be documented in the HR system.', keywords: ['remote', 'work', 'employees', 'manager'], semanticTags: ['flexibility', 'work-from-home', 'scheduling', 'approval process'] },
    { id: 2, title: 'Data Retention Policy §5.1', content: 'Personal data must be deleted within 30 days of account termination. Backup copies must be purged within 90 days.', keywords: ['data', 'deleted', 'backup', 'days'], semanticTags: ['privacy', 'compliance', 'GDPR', 'data lifecycle'] },
    { id: 3, title: 'Expense Policy §2.4', content: 'Travel expenses exceeding $500 require VP-level approval. Receipts must be submitted within 14 business days.', keywords: ['travel', 'expenses', 'approval', 'receipts'], semanticTags: ['budgeting', 'reimbursement', 'financial controls', 'corporate travel'] },
    { id: 4, title: 'Security Policy §7.3', content: 'API keys must be rotated every 90 days. Keys must never be committed to version control or shared in chat messages.', keywords: ['API', 'keys', 'rotated', 'security'], semanticTags: ['credential management', 'secret handling', 'DevSecOps', 'access control'] },
    { id: 5, title: 'Leave Policy §4.1', content: 'Unused PTO carries over up to 5 days into the next calendar year. Employees with more than 15 unused days receive a mandatory notification.', keywords: ['PTO', 'leave', 'carry', 'days'], semanticTags: ['time-off', 'work-life balance', 'HR benefits', 'vacation'] },
    { id: 6, title: 'Acceptable Use §8.2', content: 'Company devices must not be used for cryptocurrency mining. Unauthorized software installation is grounds for disciplinary action.', keywords: ['devices', 'cryptocurrency', 'software', 'unauthorized'], semanticTags: ['IT policy', 'resource abuse', 'compliance', 'device management'] },
    { id: 7, title: 'Onboarding Policy §1.5', content: 'New hires must complete security awareness training within their first 14 days. Background checks must be completed before the start date.', keywords: ['training', 'security', 'background', 'onboarding'], semanticTags: ['new employee', 'hiring process', 'compliance training', 'security awareness'] },
    { id: 8, title: 'Contractor Policy §6.3', content: 'Independent contractors must sign NDAs before accessing any internal systems. Contractor access is reviewed quarterly and revoked upon project completion.', keywords: ['contractors', 'NDA', 'access', 'reviewed'], semanticTags: ['third-party access', 'confidentiality', 'vendor management', 'access review'] },
];

const sampleQueries = [
    'How long do we keep user data after they leave?',
    'Can I work from home?',
    'How should we handle API credentials?',
    'What happens to my unused vacation days?',
    'Rules for hiring contractors',
];

function keywordSearch(query: string, docs: DocChunk[]): DocChunk[] {
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    return docs
        .map(doc => ({
            doc,
            score: queryWords.filter(w => doc.keywords.some(k => k.toLowerCase().includes(w)) || doc.content.toLowerCase().includes(w)).length,
        }))
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(r => r.doc);
}

function semanticSearch(query: string, docs: DocChunk[]): DocChunk[] {
    const semanticMap: Record<string, string[]> = {
        'data': ['privacy', 'compliance', 'GDPR', 'data lifecycle', 'confidentiality'],
        'keep': ['data lifecycle', 'compliance', 'GDPR'],
        'leave': ['data lifecycle', 'time-off', 'work-life balance'],
        'user': ['privacy', 'GDPR', 'data lifecycle'],
        'home': ['flexibility', 'work-from-home', 'scheduling'],
        'work': ['flexibility', 'work-from-home', 'scheduling'],
        'remote': ['flexibility', 'work-from-home', 'scheduling'],
        'api': ['credential management', 'secret handling', 'DevSecOps', 'access control'],
        'credentials': ['credential management', 'secret handling', 'DevSecOps'],
        'handle': ['credential management', 'secret handling'],
        'secret': ['credential management', 'secret handling', 'DevSecOps'],
        'vacation': ['time-off', 'work-life balance', 'HR benefits'],
        'unused': ['time-off', 'HR benefits', 'vacation'],
        'pto': ['time-off', 'HR benefits', 'vacation'],
        'days': ['time-off', 'data lifecycle'],
        'contractor': ['third-party access', 'vendor management', 'confidentiality'],
        'hiring': ['new employee', 'hiring process', 'third-party access'],
        'rules': ['compliance', 'IT policy'],
    };

    const queryWords = query.toLowerCase().split(/\s+/);
    const querySemantic = new Set<string>();
    queryWords.forEach(w => {
        Object.keys(semanticMap).forEach(key => {
            if (w.includes(key) || key.includes(w)) {
                semanticMap[key].forEach(tag => querySemantic.add(tag));
            }
        });
    });

    return docs
        .map(doc => ({
            doc,
            score: doc.semanticTags.filter(tag => querySemantic.has(tag)).length,
        }))
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(r => r.doc);
}

const SemanticSearchLab: React.FC<{ interactiveId: string }> = () => {
    const [query, setQuery] = useState('');
    const [searched, setSearched] = useState(false);
    const [activeQuery, setActiveQuery] = useState('');

    const doSearch = (q: string) => {
        setActiveQuery(q);
        setSearched(true);
    };

    const keywordResults = useMemo(() => searched ? keywordSearch(activeQuery, corpus) : [], [activeQuery, searched]);
    const semanticResults = useMemo(() => searched ? semanticSearch(activeQuery, corpus) : [], [activeQuery, searched]);

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(34, 211, 238, 0.06) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '24px',
            fontFamily: "'Inter', sans-serif",
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '22px' }}>🔍</span>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Semantic Search Lab — "Find the Clause"
                </h3>
            </div>

            {/* Quick queries */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {sampleQueries.map((q, i) => (
                    <button key={i} onClick={() => { setQuery(q); doSearch(q); }} style={{
                        padding: '6px 12px', borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: activeQuery === q ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.02)',
                        color: activeQuery === q ? '#6ee7b7' : '#9ca3af',
                        fontSize: '11px', cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                        {q}
                    </button>
                ))}
            </div>

            {/* Search Input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && query.trim() && doSearch(query)}
                    placeholder="Ask a question about company policies..."
                    style={{
                        flex: 1, padding: '12px 16px', borderRadius: '10px',
                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#e5e7eb', fontSize: '13px', outline: 'none',
                    }}
                />
                <button onClick={() => query.trim() && doSearch(query)} style={{
                    padding: '12px 20px', borderRadius: '10px', border: 'none',
                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    color: '#fff', fontWeight: 700, cursor: 'pointer',
                }}>
                    Search
                </button>
            </div>

            {/* Results Comparison */}
            {searched && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Keyword */}
                    <div>
                        <div style={{
                            fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase',
                            marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                            <span style={{ fontSize: '14px' }}>📝</span> Keyword Search
                            <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                {keywordResults.length} results
                            </span>
                        </div>
                        {keywordResults.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                No keyword matches found
                            </div>
                        ) : keywordResults.map(doc => (
                            <div key={doc.id} style={{
                                padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.06)', marginBottom: '6px',
                            }}>
                                <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 600 }}>{doc.title}</div>
                                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', lineHeight: 1.4 }}>{doc.content}</div>
                            </div>
                        ))}
                    </div>

                    {/* Semantic */}
                    <div>
                        <div style={{
                            fontSize: '12px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase',
                            marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                            <span style={{ fontSize: '14px' }}>🧠</span> Semantic Search
                            <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', color: '#6ee7b7' }}>
                                {semanticResults.length} results
                            </span>
                        </div>
                        {semanticResults.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                No semantic matches found
                            </div>
                        ) : semanticResults.map(doc => (
                            <div key={doc.id} style={{
                                padding: '10px 14px', background: 'rgba(16, 185, 129, 0.04)', borderRadius: '8px',
                                border: '1px solid rgba(16, 185, 129, 0.12)', marginBottom: '6px',
                            }}>
                                <div style={{ fontSize: '11px', color: '#6ee7b7', fontWeight: 600 }}>{doc.title}</div>
                                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', lineHeight: 1.4 }}>{doc.content}</div>
                                <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                                    {doc.semanticTags.map((tag, i) => (
                                        <span key={i} style={{
                                            fontSize: '9px', padding: '2px 6px', borderRadius: '4px',
                                            background: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7',
                                        }}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{
                marginTop: '16px', padding: '12px 16px',
                background: 'rgba(16, 185, 129, 0.06)', borderRadius: '10px',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                fontSize: '12px', color: '#a5b4fc', lineHeight: 1.5,
            }}>
                💡 <strong>Key Insight:</strong> Keyword search matches exact words. Semantic search matches <em>meaning</em>. "How long do we keep user data after they leave?" finds the data retention policy via semantic tags — not by matching the word "leave."
            </div>
        </div>
    );
};

export default SemanticSearchLab;
