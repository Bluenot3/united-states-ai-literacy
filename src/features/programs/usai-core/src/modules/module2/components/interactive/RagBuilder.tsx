
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { InteractiveComponentProps } from '../../types';
import { SparklesIcon } from '../icons/SparklesIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { CloseIcon } from '../icons/CloseIcon';

// --- Types ---
type MiniApp = 'heatmap' | 'galaxy' | 'chunking' | 'abtest' | 'citations' | 'permissions';

// --- Mini-Apps ---

// 1. Retrieval Heatmap
const RetrievalHeatmap: React.FC = () => {
    const [queries, setQueries] = useState(0);
    const [docs, setDocs] = useState([
        { id: 1, name: 'Employee Handbook', hits: 5, category: 'HR' },
        { id: 2, name: 'IT Security Policy', hits: 2, category: 'IT' },
        { id: 3, name: 'Q3 Financials', hits: 8, category: 'Finance' },
        { id: 4, name: 'Remote Work SOP', hits: 15, category: 'HR' },
        { id: 5, name: 'Legacy Code Docs', hits: 0, category: 'Dev' },
        { id: 6, name: 'Brand Guidelines', hits: 4, category: 'Marketing' },
        { id: 7, name: 'Project Zeus Plan', hits: 12, category: 'Product' },
        { id: 8, name: 'Lunch Menu', hits: 1, category: 'Ops' },
    ]);

    const simulateQueries = () => {
        setQueries(prev => prev + 100);
        setDocs(prev => prev.map(d => ({
            ...d,
            hits: d.hits + Math.floor(Math.random() * (d.category === 'HR' || d.category === 'Product' ? 15 : 5))
        })));
    };

    const getMaxHits = () => Math.max(...docs.map(d => d.hits), 1);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-brand-text">Knowledge Base Heatmap</h3>
                <div className="text-sm font-mono text-gray-500">Total Queries: {queries}</div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {docs.map(doc => {
                    const intensity = doc.hits / getMaxHits();
                    return (
                        <div 
                            key={doc.id}
                            className="relative p-4 rounded-xl shadow-sm border transition-all duration-500 overflow-hidden group"
                            style={{ 
                                backgroundColor: `rgba(139, 92, 246, ${0.05 + intensity * 0.5})`, // brand-primary base
                                borderColor: `rgba(139, 92, 246, ${0.1 + intensity * 0.8})`
                            }}
                        >
                            <div className="font-bold text-brand-text text-sm mb-1">{doc.name}</div>
                            <div className="text-xs text-gray-500">{doc.category}</div>
                            <div className="absolute top-2 right-2 text-xs font-mono font-bold opacity-50 group-hover:opacity-100">
                                {doc.hits} hits
                            </div>
                            {intensity > 0.8 && <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-red-500 blur-xl opacity-20 rounded-full animate-pulse"></div>}
                        </div>
                    );
                })}
            </div>

            <div className="text-center">
                <button 
                    onClick={simulateQueries}
                    className="px-6 py-2 bg-brand-primary text-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold text-sm"
                >
                    Simulate 100 User Queries
                </button>
                <p className="mt-4 text-xs text-gray-500">Observe which documents are "Hot Spots" (critical knowledge) versus "Cold Spots" (unused data).</p>
            </div>
        </div>
    );
};

// 2. Embedding Galaxy
const EmbeddingGalaxy: React.FC = () => {
    const [query, setQuery] = useState('');
    const [targetPos, setTargetPos] = useState<{x: number, y: number} | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    const clusters = [
        { id: 'tech', label: 'Tech Stack', x: 20, y: 30, color: '#3b82f6', keywords: ['code', 'api', 'server', 'bug', 'database'] },
        { id: 'hr', label: 'HR & People', x: 80, y: 30, color: '#ec4899', keywords: ['salary', 'holiday', 'benefits', 'job', 'team'] },
        { id: 'legal', label: 'Legal & Compliance', x: 50, y: 80, color: '#f59e0b', keywords: ['contract', 'law', 'sue', 'policy', 'audit'] },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        const lowerQ = query.toLowerCase();
        let bestCluster = clusters[0];
        let maxMatch = 0;

        clusters.forEach(c => {
            const match = c.keywords.filter(k => lowerQ.includes(k)).length;
            if (match > maxMatch) {
                maxMatch = match;
                bestCluster = c;
            }
        });

        // Add some randomness to position within cluster
        setTargetPos({
            x: bestCluster.x + (Math.random() * 10 - 5),
            y: bestCluster.y + (Math.random() * 10 - 5)
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-brand-text">Semantic Embedding Galaxy</h3>
            
            <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-700" ref={canvasRef}>
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                {/* Clusters */}
                {clusters.map(c => (
                    <div key={c.id} className="absolute w-32 h-32 rounded-full blur-2xl opacity-20 transition-all duration-1000" style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%, -50%)', backgroundColor: c.color }}></div>
                ))}
                
                {/* Docs (Static dots) */}
                {clusters.map(c => Array.from({length: 8}).map((_, i) => (
                    <div 
                        key={`${c.id}-${i}`}
                        className="absolute w-2 h-2 rounded-full opacity-60"
                        style={{ 
                            left: `${c.x + Math.random()*15 - 7.5}%`, 
                            top: `${c.y + Math.random()*15 - 7.5}%`, 
                            backgroundColor: c.color 
                        }} 
                    />
                )))}

                {/* Labels */}
                {clusters.map(c => (
                    <div key={`label-${c.id}`} className="absolute text-xs font-bold text-white opacity-50 uppercase tracking-widest" style={{ left: `${c.x}%`, top: `${c.y + 12}%`, transform: 'translate(-50%, 0)' }}>
                        {c.label}
                    </div>
                ))}

                {/* Query Dot */}
                {targetPos && (
                    <>
                        <div 
                            className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white] transition-all duration-1000 ease-out z-10"
                            style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%`, transform: 'translate(-50%, -50%)' }}
                        ></div>
                        <div 
                            className="absolute text-xs font-bold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm transition-all duration-1000 ease-out z-20"
                            style={{ left: `${targetPos.x}%`, top: `${targetPos.y - 8}%`, transform: 'translate(-50%, -50%)' }}
                        >
                            "{query}"
                        </div>
                    </>
                )}
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
                <input 
                    type="text" 
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Type a query (e.g. 'server error', 'salary bonus', 'NDA contract')..."
                    className="flex-grow px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
                <button type="submit" className="bg-brand-primary text-white p-3 rounded-lg shadow-md hover:bg-brand-primary/90">
                    <SearchIcon />
                </button>
            </form>
        </div>
    );
};

// 3. Chunking Lab
const ChunkingLab: React.FC = () => {
    const [chunkSize, setChunkSize] = useState(50); // 10-100% of paragraph
    const [overlap, setOverlap] = useState(10); // 0-50%

    const text = "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by humans and other animals. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. The term 'artificial intelligence' had previously been used to describe machines that mimic and display 'human' cognitive skills that are associated with the human mind, such as 'learning' and 'problem-solving'.";
    
    // Simulate metrics based on sliders
    const accuracy = Math.min(98, Math.max(40, 100 - Math.abs(chunkSize - 30) - Math.abs(overlap - 15)));
    const latency = Math.max(10, chunkSize * 1.5); 

    // Visual Chunks logic
    const words = text.split(' ');
    const chunkWordCount = Math.floor((chunkSize / 100) * words.length) || 1;
    const overlapCount = Math.floor((overlap / 100) * chunkWordCount);
    const step = Math.max(1, chunkWordCount - overlapCount);
    
    const chunks = [];
    for (let i = 0; i < words.length; i += step) {
        chunks.push(words.slice(i, i + chunkWordCount).join(' '));
        if (chunks.length > 4) break; // Limit for visual
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-brand-text">Chunking Strategy Lab</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Chunk Size (Granularity)</label>
                        <input type="range" min="10" max="100" value={chunkSize} onChange={e => setChunkSize(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Specific (Small)</span><span>Broad (Large)</span></div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Overlap (Context Preservation)</label>
                        <input type="range" min="0" max="50" value={overlap} onChange={e => setOverlap(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-secondary" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>None</span><span>High</span></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl border text-center">
                            <div className="text-xs text-gray-500 uppercase tracking-wide font-bold">Retrieval Accuracy</div>
                            <div className={`text-2xl font-black ${accuracy > 80 ? 'text-green-500' : accuracy > 50 ? 'text-yellow-500' : 'text-red-500'}`}>{Math.round(accuracy)}%</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border text-center">
                            <div className="text-xs text-gray-500 uppercase tracking-wide font-bold">System Latency</div>
                            <div className="text-2xl font-black text-brand-text">{Math.round(latency)}ms</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border rounded-xl p-4 shadow-inner h-64 overflow-y-auto space-y-2">
                    <div className="text-xs font-bold text-gray-400 mb-2 uppercase">Preview: How the AI "Sees" Documents</div>
                    {chunks.map((chunk, i) => (
                        <div key={i} className={`p-3 rounded-lg text-xs leading-relaxed border-l-4 ${i % 2 === 0 ? 'bg-blue-50 border-blue-400 text-blue-900' : 'bg-purple-50 border-purple-400 text-purple-900'}`}>
                            <span className="font-bold mr-2">Chunk {i+1}:</span>"{chunk}..."
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 4. Hallucination vs Grounding
const GroundingTest: React.FC = () => {
    const [mode, setMode] = useState<'off' | 'on' | null>(null);
    const [loading, setLoading] = useState(false);

    const handleTest = (newMode: 'off' | 'on') => {
        setLoading(true);
        setMode(null);
        setTimeout(() => {
            setMode(newMode);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="space-y-6 animate-fade-in text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-brand-text">Hallucination vs. Grounding Test</h3>
            
            <div className="p-4 bg-gray-50 rounded-xl border mb-6 text-left">
                <span className="font-bold text-brand-primary">User Query:</span> "What is the company policy on bringing pets to the office?"
            </div>

            <div className="flex gap-4 justify-center mb-8">
                <button onClick={() => handleTest('off')} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all">
                    Generate (RAG OFF)
                </button>
                <button onClick={() => handleTest('on')} className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold shadow-lg hover:shadow-brand-primary/30 transition-all">
                    Generate (RAG ON)
                </button>
            </div>

            {loading && (
                <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl animate-pulse text-gray-400">
                    Thinking...
                </div>
            )}

            {mode === 'off' && !loading && (
                <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-left animate-fade-in">
                    <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                        <CloseIcon /> <span>Standard Model Response</span>
                    </div>
                    <p className="text-gray-700 mb-4">"Most companies allow pets on Fridays. You should check with your manager, but generally, well-behaved dogs are welcome in open office areas as long as they are leashed."</p>
                    <div className="text-xs font-bold text-red-500 uppercase tracking-wide">Analysis: Hallucination Risk High. The model invented a "Friday" rule that doesn't exist in your specific handbook.</div>
                </div>
            )}

            {mode === 'on' && !loading && (
                <div className="p-6 bg-green-50 border border-green-100 rounded-xl text-left animate-fade-in">
                    <div className="flex items-center gap-2 text-green-600 font-bold mb-2">
                        <CheckIcon /> <span>RAG-Augmented Response</span>
                    </div>
                    <p className="text-gray-700 mb-4">"According to the <strong>Employee Handbook (Section 9.2)</strong>, pets are <strong>not permitted</strong> in the office due to building allergies, with the exception of certified service animals. Please contact HR for service animal registration."</p>
                    <div className="flex gap-2 mt-4">
                        <span className="text-[10px] bg-white border border-green-200 px-2 py-1 rounded text-green-700 font-bold">Source: Handbook v4.pdf</span>
                        <span className="text-[10px] bg-white border border-green-200 px-2 py-1 rounded text-green-700 font-bold">Confidence: 98%</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// 5. Citations Quest
const CitationsQuest: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [score, setScore] = useState(0);
    const [matches, setMatches] = useState<number[]>([]);
    
    const claims = [
        { id: 1, text: "Project Alpha launches in Q3." },
        { id: 2, text: "The budget cap is $50k." },
        { id: 3, text: "Remote work is allowed on Mondays." },
    ];

    const sources = [
        { id: 2, text: "Finance Report: '...strict limit of $50,000 for Q1 initiatives...'" },
        { id: 3, text: "HR Memo: '...hybrid policy permits WFH on Mon/Fri...'" },
        { id: 1, text: "Roadmap Doc: '...Alpha Go-Live scheduled for July (Q3)...'" },
    ];

    const [selectedSource, setSelectedSource] = useState<number | null>(null);

    const handleClaimClick = (claimId: number) => {
        if (selectedSource === claimId && !matches.includes(claimId)) {
            setMatches([...matches, claimId]);
            setScore(prev => prev + 1);
            setSelectedSource(null);
            if (matches.length + 1 === claims.length) onComplete();
        } else {
            setSelectedSource(null); // Reset on miss or mismatch logic
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-brand-text">Citations Quest</h3>
                <div className="text-sm font-bold bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full">Score: {score}/3</div>
            </div>
            
            <p className="text-sm text-gray-500">Tap a <strong>Source Snippet</strong>, then tap the matching <strong>Claim</strong> to verify the AI's output.</p>

            <div className="grid grid-cols-2 gap-8">
                {/* Claims */}
                <div className="space-y-4">
                    <h4 className="font-bold text-gray-700 border-b pb-2">AI Output Claims</h4>
                    {claims.map(c => (
                        <button 
                            key={c.id} 
                            onClick={() => handleClaimClick(c.id)}
                            disabled={matches.includes(c.id)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                matches.includes(c.id) ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-brand-primary'
                            }`}
                        >
                            {matches.includes(c.id) && <span className="mr-2">✅</span>}
                            {c.text}
                        </button>
                    ))}
                </div>

                {/* Sources */}
                <div className="space-y-4">
                    <h4 className="font-bold text-gray-700 border-b pb-2">Retrieved Snippets</h4>
                    {sources.map(s => (
                        <button 
                            key={s.id} 
                            onClick={() => !matches.includes(s.id) && setSelectedSource(s.id)}
                            disabled={matches.includes(s.id)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all text-xs font-mono ${
                                matches.includes(s.id) ? 'opacity-50 border-transparent bg-gray-100' : 
                                selectedSource === s.id ? 'border-brand-primary bg-brand-primary/5 shadow-md scale-105' : 'border-dashed border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {s.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 6. Permission Maze
const PermissionMaze: React.FC = () => {
    const [role, setRole] = useState<'intern' | 'manager' | 'admin'>('intern');
    const [query] = useState('Q4 Strategy & Bonus Pool');

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-brand-text">RBAC (Role-Based Access Control) Sim</h3>
            
            <div className="flex bg-gray-100 p-1 rounded-xl">
                {(['intern', 'manager', 'admin'] as const).map(r => (
                    <button 
                        key={r}
                        onClick={() => setRole(r)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${role === r ? 'bg-white shadow text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {r}
                    </button>
                ))}
            </div>

            <div className="bg-white border rounded-xl p-6 shadow-sm">
                <div className="text-xs font-bold text-gray-400 uppercase mb-2">User Query</div>
                <div className="text-lg font-medium mb-6">"{query}"</div>

                <div className="text-xs font-bold text-gray-400 uppercase mb-2">RAG Retrieval Result</div>
                
                {role === 'intern' && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm font-mono flex items-center gap-3">
                        <CloseIcon />
                        ACCESS DENIED: Policy 102. Insufficient Clearance.
                    </div>
                )}

                {role === 'manager' && (
                    <div className="space-y-2">
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-gray-700">
                            DOC: Q4_Strategy_Public.pdf <span className="text-green-600 ml-2">[ACCESS GRANTED]</span>
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm font-mono text-yellow-800">
                            DOC: Executive_Bonus_Pool.xlsx <span className="text-red-500 ml-2 font-bold">[REDACTED]</span>
                        </div>
                        <p className="text-sm mt-2 text-gray-600 italic">"Here is the Q4 Strategy overview. You do not have permission to view the Bonus Pool data."</p>
                    </div>
                )}

                {role === 'admin' && (
                    <div className="space-y-2">
                        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm font-mono text-green-800">
                            DOC: Q4_Strategy_Full.pdf <span className="ml-2">✓</span>
                        </div>
                        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm font-mono text-green-800">
                            DOC: Executive_Bonus_Pool.xlsx <span className="ml-2">✓</span>
                        </div>
                        <p className="text-sm mt-2 text-gray-600 italic">"The Q4 Strategy prioritizes retention. The Bonus Pool is set at $1.2M allocated across 4 regions..."</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Container ---

const RagBuilder: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [activeTab, setActiveTab] = useState<MiniApp>('heatmap');

    const handleComplete = () => {
        if (user && !user.progress.completedInteractives.includes(interactiveId)) {
            addPoints(25);
            updateProgress(interactiveId, 'interactive');
        }
    };

    const tabs: { id: MiniApp, label: string, icon: string }[] = [
        { id: 'heatmap', label: '1. Heatmap', icon: '🔥' },
        { id: 'galaxy', label: '2. Embeddings', icon: '🌌' },
        { id: 'chunking', label: '3. Chunking', icon: '🔪' },
        { id: 'abtest', label: '4. Grounding', icon: '⚖️' },
        { id: 'citations', label: '5. Citations', icon: '🔗' },
        { id: 'permissions', label: '6. Security', icon: '🛡️' },
    ];

    return (
        <div className="my-10 p-1 rounded-3xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 shadow-neumorphic-out border border-white/60 backdrop-blur-md">
            <div className="bg-brand-bg/95 rounded-[22px] overflow-hidden min-h-[600px] flex flex-col">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-primary text-white rounded-lg shadow-lg">
                            <SparklesIcon />
                        </div>
                        <div>
                            <h4 className="font-bold text-2xl text-brand-text">RAG Builder Pro</h4>
                            <p className="text-xs text-brand-text-light">Advanced Knowledge Retrieval Simulator</p>
                        </div>
                    </div>
                    
                    {/* Navigation */}
                    <div className="flex bg-gray-100/50 p-1 rounded-xl overflow-x-auto max-w-full">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-brand-primary shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <span>{tab.icon}</span> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="p-8 flex-grow bg-white/30">
                    {activeTab === 'heatmap' && <RetrievalHeatmap />}
                    {activeTab === 'galaxy' && <EmbeddingGalaxy />}
                    {activeTab === 'chunking' && <ChunkingLab />}
                    {activeTab === 'abtest' && <GroundingTest />}
                    {activeTab === 'citations' && <CitationsQuest onComplete={handleComplete} />}
                    {activeTab === 'permissions' && <PermissionMaze />}
                </div>

            </div>
        </div>
    );
};

export default RagBuilder;
