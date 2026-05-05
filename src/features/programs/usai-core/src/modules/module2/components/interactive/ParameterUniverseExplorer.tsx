import React, { useState, useMemo } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const ParameterUniverseExplorer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeCluster, setActiveCluster] = useState<number | null>(null);

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const clusters = useMemo(() => Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        name: `Cluster ${String.fromCharCode(65 + i)}`,
        promptTopic: ['Syntax & Grammar', 'Sentiment Analysis', 'Factual Knowledge (History)', 'Creative Association', 'Code Generation'][i],
        style: {
            left: `${10 + i * 18 + Math.random() * 5}%`,
            top: `${20 + Math.random() * 50}%`,
            width: `${10 + Math.random() * 10}%`,
            height: `${10 + Math.random() * 10}%`,
            animationDelay: `${i * 0.2}s`
        }
    })), []);

    const handleClusterClick = async (cluster: any) => {
        setLoading(true);
        setError('');
        setExplanation('');
        setActiveCluster(cluster.id);

        const prompt = `You are an AI research assistant. In a large language model, parameters often form specialized clusters. Explain, in simple terms for a beginner, what a parameter cluster responsible for "${cluster.promptTopic}" might do. For example, what kind of patterns would it look for in the data?`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
            setExplanation(response.text);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to get explanation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Parameter Universe Explorer</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">This is a conceptual visualization. Click a cluster to get a Gemini-powered explanation of its hypothetical function.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text text-center mb-3">Parameter Clusters</h5>
                    <div className="space-y-2">
                        {clusters.map(c => (
                            <button
                                key={c.id}
                                onClick={() => handleClusterClick(c)}
                                className={`w-full text-left p-2 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in ${activeCluster === c.id ? 'text-brand-primary' : ''}`}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-2 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[200px]">
                    <h5 className="font-semibold text-brand-text mb-2 flex items-center gap-2"><SparklesIcon/> Gemini Pro Explanation</h5>
                    {loading && <p className="animate-pulse">Loading explanation...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {explanation && <p className="text-brand-text-light">{explanation}</p>}
                </div>
            </div>
        </div>
    );
};

export default ParameterUniverseExplorer;
