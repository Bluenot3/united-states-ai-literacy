import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
// FIX: Add import for AiOutputBlock
import AiOutputBlock from '../AiOutputBlock';

const layers = [
    'Input Layer: 256x256x3',
    'Conv Layer 1: 32 filters, 3x3 kernel',
    'Pooling Layer 1: 2x2 max pooling',
    'Conv Layer 2: 64 filters, 3x3 kernel',
    'Pooling Layer 2: 2x2 max pooling',
    'Flatten Layer',
    'Dense Layer 1: 128 units, ReLU',
    'Output Layer: 10 units, Softmax',
];

const ArchitectureBuilderSandbox: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleAnalyze = async () => {
        setLoading(true);
        setError('');
        setAnalysis('');

        const architectureString = layers.map(layer => `- ${layer}`).join('\n');
        const prompt = `As an expert ML engineer, critique the following neural network architecture for an image classification task. 
Provide a detailed analysis of its strengths and weaknesses. Format your response using markdown with headings for 'Strengths' and 'Weaknesses', each with a bulleted list for clarity.

**Architecture:**
${architectureString}`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAnalysis(response.text);
            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate analysis.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Neural Network Architecture Sandbox</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Review the predefined architecture and get an expert critique from Gemini.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-3 text-center">Architecture Layers</h5>
                    <div className="space-y-2">
                        {layers.map((layer, index) => (
                            <div key={index} className="p-2 bg-brand-bg shadow-neumorphic-out rounded-lg text-sm text-brand-text-light text-center">
                                {layer}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex-grow">
                        <AiOutputBlock
                            content={analysis}
                            isLoading={loading}
                            error={error}
                            title="Gemini's Critique"
                            placeholder="Click 'Analyze' to get feedback."
                        />
                    </div>
                    <div className="text-center mt-4">
                        <button onClick={handleAnalyze} disabled={loading} className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                            <SparklesIcon />
                            {loading ? 'Analyzing...' : 'Analyze Architecture'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArchitectureBuilderSandbox;