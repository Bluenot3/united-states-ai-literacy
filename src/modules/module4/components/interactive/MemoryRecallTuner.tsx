import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../../../types';
import { useAuth } from '../../../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const MemoryRecallTuner: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [chunkSize, setChunkSize] = useState(512);
    const [retrievalBias, setRetrievalBias] = useState(50); // 0 = keyword, 100 = semantic
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const hasCompleted = user?.modules?.[4]?.completedInteractives.includes(interactiveId);

    const precision = (1 - (chunkSize / 2048)) * 0.95 + (retrievalBias / 100) * 0.05;
    const recall = (retrievalBias / 100) * 0.9 + (1 - (chunkSize / 2048)) * 0.1;

    const getExplanation = async () => {
        setLoading(true);
        setExplanation('');
        const prompt = `A user is tuning a Retrieval-Augmented Generation (RAG) system.
        
Settings:
- Chunk Size: ${chunkSize} tokens
- Retrieval Bias: ${retrievalBias > 70 ? 'Heavily Semantic' : retrievalBias < 30 ? 'Heavily Keyword-based' : 'Balanced'}

Explain the performance trade-offs of these settings. How would this chunk size and retrieval bias affect precision (getting relevant results) versus recall (finding all possible results)?`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setExplanation(response.text);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setExplanation('Failed to generate explanation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Memory Recall Tuner</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <div>
                        <label className="block text-sm text-brand-text-light mb-1">Chunk Size: <span className="font-bold text-brand-text">{chunkSize} tokens</span></label>
                        <input type="range" min="128" max="2048" step="128" value={chunkSize} onChange={e => setChunkSize(Number(e.target.value))} className="w-full h-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                    </div>
                    <div>
                        <label className="block text-sm text-brand-text-light mb-1">Retrieval Bias</label>
                        <input type="range" min="0" max="100" value={retrievalBias} onChange={e => setRetrievalBias(Number(e.target.value))} className="w-full h-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                        <div className="flex justify-between text-xs text-brand-text-light mt-1">
                            <span>Keyword</span>
                            <span>Semantic</span>
                        </div>
                    </div>
                    <button onClick={getExplanation} disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                        <SparklesIcon /> {loading ? 'Analyzing...' : 'Analyze Settings'}
                    </button>
                </div>
                <div className="md:col-span-2 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                        <div className="p-2">
                            <p className="text-sm text-brand-text-light">Precision</p>
                            <p className="text-4xl font-bold text-pale-green">{(precision * 100).toFixed(1)}%</p>
                        </div>
                        <div className="p-2">
                            <p className="text-sm text-brand-text-light">Recall</p>
                            <p className="text-4xl font-bold text-pale-purple">{(recall * 100).toFixed(1)}%</p>
                        </div>
                    </div>
                    <div className="p-2 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[120px]">
                        <h5 className="font-semibold text-brand-text mb-2">AI Analysis</h5>
                        {loading && <p className="animate-pulse">Generating...</p>}
                        <p className="text-sm text-brand-text-light">{explanation}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemoryRecallTuner;
