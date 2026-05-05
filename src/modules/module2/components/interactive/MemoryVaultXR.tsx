import React, { useState, useRef, useEffect } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { Type } from '@google/genai';

interface MemoryNode {
    id: string;
    text: string;
    x: number;
    y: number;
    category: string;
}

const INITIAL_MEMORIES: MemoryNode[] = [
    { id: '1', text: 'User prefers Python over JS', x: 80, y: 20, category: 'Tech' },
    { id: '2', text: 'Birthday is October 24th', x: 20, y: 80, category: 'Personal' },
    { id: '3', text: 'Project deadline is Friday', x: 30, y: 30, category: 'Work' },
    { id: '4', text: 'Deployment failed due to timeouts', x: 85, y: 25, category: 'Tech' },
    { id: '5', text: 'Always summarize emails', x: 35, y: 35, category: 'Work' },
];

const MemoryVaultXR: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [memories, setMemories] = useState<MemoryNode[]>(INITIAL_MEMORIES);
    const [input, setInput] = useState('');
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'store' | 'retrieve'>('store');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    
    const containerRef = useRef<HTMLDivElement>(null);

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleAction = async () => {
        const text = mode === 'store' ? input : query;
        if (!text.trim()) return;

        setLoading(true);
        setSearchResults([]);

        try {
            const ai = await getAiClient();
            
            if (mode === 'store') {
                // Store Logic: Get coordinates
                const prompt = `You are a semantic embedding engine. Map the following text to a 2D coordinate system (x, y) from 0 to 100 based on its semantic meaning.
                
                Anchors:
                - Top Right (x>50, y<50): Technology, Code, Engineering
                - Top Left (x<50, y<50): Work, Tasks, Schedules
                - Bottom Left (x<50, y>50): Personal, Bio, Facts
                - Bottom Right (x>50, y>50): Abstract, Philosophy, General Knowledge
                
                Text: "${text}"`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: 'application/json',
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                x: { type: Type.NUMBER },
                                y: { type: Type.NUMBER },
                                category: { type: Type.STRING }
                            }
                        }
                    }
                });

                const data = JSON.parse(response.text);
                const newNode: MemoryNode = {
                    id: Date.now().toString(),
                    text,
                    x: data.x,
                    y: data.y,
                    category: data.category
                };
                setMemories(prev => [...prev, newNode]);
                setInput('');
                
                if (!hasCompleted) {
                    addPoints(15);
                    updateProgress(interactiveId, 'interactive');
                }

            } else {
                // Retrieval Logic: Find closest nodes
                // In a real app, this uses cosine similarity. Here, we simulate it via Gemini or distance.
                // Let's use Euclidean distance for the visual simulation since we have x,y.
                
                // First get the query's "embedding" (x,y)
                const prompt = `Map this query to the same 0-100 x,y coordinate system: "${text}". Return JSON {x, y}.`;
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } } }
                });
                const queryPos = JSON.parse(response.text);
                
                // Calculate distances
                const withDist = memories.map(m => ({
                    ...m,
                    dist: Math.sqrt(Math.pow(m.x - queryPos.x, 2) + Math.pow(m.y - queryPos.y, 2))
                }));
                
                // Sort and pick top 3
                const top = withDist.sort((a, b) => a.dist - b.dist).slice(0, 3);
                setSearchResults(top.map(t => t.id));
                
                if (!hasCompleted) {
                    addPoints(15);
                    updateProgress(interactiveId, 'interactive');
                }
            }

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-10 p-1 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 shadow-neumorphic-out border border-white/60 backdrop-blur-md">
            <div className="bg-brand-bg/90 rounded-[22px] p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h4 className="font-bold text-2xl text-brand-text flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg text-brand-primary">
                                <SparklesIcon />
                            </div>
                            Memory Vault XR
                        </h4>
                        <p className="text-brand-text-light text-sm mt-1">Visualize how AI embeds and retrieves knowledge in vector space.</p>
                    </div>
                    
                    <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
                        <button 
                            onClick={() => { setMode('store'); setSearchResults([]); }}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'store' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Store (Embed)
                        </button>
                        <button 
                            onClick={() => { setMode('retrieve'); }}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'retrieve' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Retrieve (Query)
                        </button>
                    </div>
                </div>

                <div className="relative w-full aspect-[16/9] bg-slate-900 rounded-2xl shadow-inner overflow-hidden border border-slate-700 mb-6 group" ref={containerRef}>
                    {/* Grid Lines */}
                    <div className="absolute inset-0 opacity-10" 
                        style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                    </div>
                    
                    {/* Axis Labels */}
                    <div className="absolute top-2 right-2 text-[10px] font-mono text-purple-400">TECHNOLOGY</div>
                    <div className="absolute top-2 left-2 text-[10px] font-mono text-blue-400">WORK</div>
                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-green-400">PERSONAL</div>
                    <div className="absolute bottom-2 right-2 text-[10px] font-mono text-pink-400">ABSTRACT</div>

                    {/* Nodes */}
                    {memories.map((node) => {
                        const isMatch = searchResults.includes(node.id);
                        return (
                            <div 
                                key={node.id}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 cursor-pointer group/node
                                    ${isMatch ? 'z-20 scale-125' : 'z-10 scale-100'}
                                `}
                                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                            >
                                <div className={`
                                    w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all
                                    ${isMatch ? 'bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)] ring-4 ring-yellow-400/20' : 'bg-white'}
                                `}></div>
                                
                                {/* Tooltip */}
                                <div className={`
                                    absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none border border-white/10
                                    ${isMatch ? 'opacity-100' : ''}
                                `}>
                                    {node.text}
                                </div>
                            </div>
                        );
                    })}

                    {/* Connecting Lines for Retrieval */}
                    {mode === 'retrieve' && searchResults.length > 0 && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            {/* We just assume the center of the screen is the query point for visual simplicity or we could store the query coord. 
                                For this demo, let's just connect the dots to each other or highlight them. 
                                Actually, connecting them creates a nice "constellation" effect of relevant memories.
                            */}
                            {searchResults.map((id, i) => {
                                const node = memories.find(m => m.id === id);
                                if (!node) return null;
                                return (
                                    <circle key={i} cx={`${node.x}%`} cy={`${node.y}%`} r="20" fill="none" stroke="rgba(250, 204, 21, 0.3)" strokeWidth="1" className="animate-ping" />
                                )
                            })}
                        </svg>
                    )}
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={mode === 'store' ? input : query}
                        onChange={(e) => mode === 'store' ? setInput(e.target.value) : setQuery(e.target.value)}
                        placeholder={mode === 'store' ? "Type a fact to store (e.g., 'Cats are liquids')..." : "Type a query to retrieve (e.g., 'Do I like pets?')..."}
                        className="flex-grow px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-inner"
                        onKeyPress={(e) => e.key === 'Enter' && handleAction()}
                    />
                    <button 
                        onClick={handleAction}
                        disabled={loading}
                        className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        {loading ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"/> : (mode === 'store' ? <SparklesIcon /> : <SearchIcon />)}
                        {mode === 'store' ? 'Embed' : 'Scan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemoryVaultXR;
