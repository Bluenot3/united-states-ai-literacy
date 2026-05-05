import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Type } from '@google/genai';

const exampleText = `{
  "user": "Jane Doe",
  "email": "jane.doe@example.com",
  "comment": "My order number is #12345. Please ship to 123 Main St, Anytown, USA. My phone is 555-867-5309.",
  "metadata": { "id": "user-abc-123" }
}`;

interface PiiResult {
    redactedText: string;
    piiFound: { type: string, value: string }[];
}

const PrivacyLensDashboard: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState<PiiResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleAnalyze = async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to analyze.');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);

        const prompt = `Analyze the following text for Personally Identifiable Information (PII) like names, emails, addresses, phone numbers, and unique IDs.
Provide a redacted version of the text, replacing PII with placeholders like [REDACTED_NAME].
Also, list the specific PII you found and its type.

Text to analyze:
\`\`\`
${inputText}
\`\`\``;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            redactedText: { type: Type.STRING },
                            piiFound: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        type: { type: Type.STRING },
                                        value: { type: Type.STRING }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            const data = JSON.parse(response.text) as PiiResult;
            setResult(data);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to analyze text. The AI might have returned an unexpected format.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Privacy Lens Dashboard</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Paste text or JSON below to automatically identify and redact PII.</p>

            <div className="space-y-4">
                <div className="flex justify-end">
                    <button onClick={() => setInputText(exampleText)} className="text-sm font-semibold text-brand-primary hover:underline">Use Example</button>
                </div>
                <textarea
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    rows={8}
                    className="w-full p-3 bg-brand-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in font-mono text-sm"
                    placeholder="Paste text with PII here..."
                />
                <div className="text-center">
                    <button onClick={handleAnalyze} disabled={loading} className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                        <SparklesIcon />
                        {loading ? 'Analyzing...' : 'Scan for PII'}
                    </button>
                </div>
            </div>

            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {loading && <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in animate-pulse h-48"></div>}

            {result && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                    <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                        <h5 className="font-semibold text-brand-text mb-2">PII Found</h5>
                        <ul className="text-sm text-brand-text-light space-y-1">
                            {result.piiFound.map((pii, i) => (
                                <li key={i}><strong>{pii.type}:</strong> {pii.value}</li>
                            ))}
                        </ul>
                    </div>
                     <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                        <h5 className="font-semibold text-brand-text mb-2">Redacted Text</h5>
                        <pre className="text-sm text-brand-text-light whitespace-pre-wrap font-mono">{result.redactedText}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrivacyLensDashboard;