import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const nodes = [
    'IoT Sensor Data', 'API Data Fetch', 'User Input',
    'Data Cleaning', 'Feature Engineering',
    'Predictive Model', 'Classification Model',
    'Generate Report', 'Update Dashboard', 'Send Alert'
];

const DataDecisionFlowchartBuilder: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [flow, setFlow] = useState<string[]>([]);
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleAddNode = (node: string) => {
        if (flow.length < 5) {
            setFlow([...flow, node]);
        }
    };

    const handleReset = () => {
        setFlow([]);
        setExplanation('');
        setError('');
    };

    const handleExplain = async () => {
        if (flow.length < 2) {
            setError('Please add at least two steps to the flowchart.');
            return;
        }
        setLoading(true);
        setError('');
        setExplanation('');

        const prompt = `Explain how the following sequence of steps forms a data-to-decision pipeline. Describe what each step does in the context of the overall flow.
        
Flow: ${flow.join(' -> ')}`;

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
            setError('Failed to generate explanation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Data-to-Decision Flowchart Builder</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Select up to 5 nodes to build a flowchart, then let AI explain it.</p>
            
            <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in mb-4">
                <h5 className="font-semibold text-brand-text text-center mb-3">Available Nodes</h5>
                <div className="flex flex-wrap gap-2 justify-center">
                    {nodes.map(node => (
                        <button key={node} onClick={() => handleAddNode(node)} className="px-3 py-1 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">
                            {node}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[80px] flex items-center justify-center">
                {flow.length > 0 ? (
                    <div className="flex flex-wrap items-center justify-center gap-2 font-semibold">
                        {flow.map((node, i) => (
                            <React.Fragment key={i}>
                                <div className="p-2 rounded-md bg-brand-bg shadow-neumorphic-out text-brand-primary">{node}</div>
                                {i < flow.length - 1 && <div className="text-brand-text-light">&rarr;</div>}
                            </React.Fragment>
                        ))}
                    </div>
                ) : <p className="text-brand-text-light">Your flowchart is empty.</p>}
            </div>

            <div className="flex justify-center items-center gap-4 mt-6">
                <button onClick={handleReset} className="px-4 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Reset</button>
                <button onClick={handleExplain} disabled={loading || flow.length < 2} className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-2 px-4 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Explaining...' : 'Explain Flowchart'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || explanation) && (
                <div className="mt-4 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">Flowchart Explanation</h5>
                    {loading && <p className="animate-pulse">Generating...</p>}
                    <p className="text-brand-text-light">{explanation}</p>
                </div>
            )}
        </div>
    );
};

export default DataDecisionFlowchartBuilder;