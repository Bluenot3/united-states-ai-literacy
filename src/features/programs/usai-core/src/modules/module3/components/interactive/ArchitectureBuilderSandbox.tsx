import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const availableLayers = ['Input', 'Embedding', 'Attention', 'Normalization', 'FeedForward', 'Output'];

const ArchitectureBuilderSandbox: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [architecture, setArchitecture] = useState<string[]>([]);
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const addLayer = (layer: string) => {
        setArchitecture(prev => [...prev, layer]);
    };
    
    const removeLayer = (index: number) => {
        setArchitecture(prev => prev.filter((_, i) => i !== index));
    };

    const handleAnalyze = async () => {
        if (architecture.length < 2) {
            setError('Please add at least two layers to your architecture.');
            return;
        }
        setLoading(true);
        setError('');
        setAnalysis('');
        
        const prompt = `A user has designed a simple neural network architecture by arranging these layers: ${architecture.join(' -> ')}.
Analyze this architecture.
1. Is it a valid sequence? (e.g., does it have an Input and Output?)
2. What kind of task might this architecture be good for?
3. Provide one simple suggestion for improvement.
Keep the analysis concise and easy for a beginner to understand.`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAnalysis(response.text);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to get analysis.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Architecture Builder Sandbox</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Build a simple model by adding layers, then get AI feedback on your design.</p>
            
            <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in mb-4">
                <h5 className="font-semibold text-brand-text text-center mb-3">Available Layers</h5>
                <div className="flex flex-wrap gap-2 justify-center">
                    {availableLayers.map(layer => (
                        <button key={layer} onClick={() => addLayer(layer)} className="px-3 py-1 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">
                            + {layer}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[120px]">
                <h5 className="font-semibold text-brand-text mb-3">Your Architecture</h5>
                {architecture.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                        {architecture.map((layer, i) => (
                            <React.Fragment key={i}>
                                <div className="relative p-2 rounded-md bg-brand-bg shadow-neumorphic-out text-brand-primary">
                                    {layer}
                                    <button onClick={() => removeLayer(i)} className="absolute -top-1 -right-1 text-xs bg-red-400 text-white rounded-full h-4 w-4 flex items-center justify-center">&times;</button>
                                </div>
                                {i < architecture.length - 1 && <div className="font-bold text-brand-text-light">&rarr;</div>}
                            </React.Fragment>
                        ))}
                    </div>
                ) : <p className="text-brand-text-light text-center">Click layers above to add them here.</p>}
            </div>
            
            <div className="text-center mt-6">
                <button onClick={handleAnalyze} disabled={loading || architecture.length < 2} className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Analyzing...' : 'Analyze Design'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || analysis) && (
                <div className="mt-4 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">AI Analysis</h5>
                    {loading && <p className="animate-pulse">Analyzing...</p>}
                    <pre className="text-brand-text-light whitespace-pre-wrap font-sans">{analysis}</pre>
                </div>
            )}
        </div>
    );
};

export default ArchitectureBuilderSandbox;
