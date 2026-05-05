import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const exampleCSV = `product_id,category,price,units_sold,rating
101,electronics,499.99,150,4.5
102,books,19.99,,4.8
103,electronics,899.99,75,4.9
104,clothing,49.95,300,4.2
`;

const DataVisualizer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [rawData, setRawData] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleProcess = async () => {
        if (!rawData.trim()) {
            setError('Please paste some data to process.');
            return;
        }
        setLoading(true);
        setError('');
        setAnalysis('');
        
        const prompt = `You are a data scientist. A user has provided the following raw data, likely in CSV format. Analyze it and describe the key steps you would take to clean and prepare it for a machine learning model.
        
Mention:
1. Handling of missing values (e.g., in the 'units_sold' column).
2. Normalization or scaling of numerical features (like 'price').
3. Splitting the data into training and testing sets.

Keep the explanation clear and concise for a beginner.

Raw Data:
\`\`\`
${rawData}
\`\`\``;

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
            setError('Failed to generate pipeline analysis.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Data Pipeline Simulator</h4>
            <div className="flex justify-end mb-2">
                <button onClick={() => setRawData(exampleCSV)} className="text-sm font-semibold text-brand-primary hover:underline">Use Example</button>
            </div>
            <textarea
                value={rawData}
                onChange={e => setRawData(e.target.value)}
                rows={6}
                placeholder="Paste raw data (e.g., from a CSV file) here..."
                className="w-full p-3 bg-brand-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in font-mono text-sm"
            />
            <div className="text-center mt-4">
                <button onClick={handleProcess} disabled={loading} className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Processing...' : 'Process Data'}
                </button>
            </div>

            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || analysis) && (
                <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in animate-fade-in">
                    <h5 className="font-semibold text-brand-text mb-2">Data Pipeline Analysis</h5>
                    {loading && <p className="animate-pulse">Analyzing data...</p>}
                    <pre className="text-brand-text-light whitespace-pre-wrap font-sans">{analysis}</pre>
                </div>
            )}
        </div>
    );
};

export default DataVisualizer;
