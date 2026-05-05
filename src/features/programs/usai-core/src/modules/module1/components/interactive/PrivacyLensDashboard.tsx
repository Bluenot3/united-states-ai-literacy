
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { Type } from '@google/genai';

const exampleText = `Hey Gemini, I'm stuck. Can you debug this?
User ID: 8842-192-XA
Email: sarah.connor@sky.net
Phone: 555-0199
Address: 123 Cyberdyne Way, CA.
Here is the error log...`;

interface PiiResult {
    redactedText: string;
    piiFound: { type: string, value: string }[];
}

const PrivacyLensDashboard: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [inputText, setInputText] = useState(exampleText);
    const [result, setResult] = useState<PiiResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleScan = async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to scan.');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);

        const prompt = `Analyze the following text for Personally Identifiable Information (PII) like names, emails, addresses, phone numbers, and IDs.
1. Provide a redacted version where PII is replaced by black blocks (e.g. █).
2. List the specific items found.

Text:
${inputText}`;

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
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Scan failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-slate-900 rounded-2xl shadow-xl border border-slate-700 text-slate-200 font-mono">
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                <h4 className="font-bold text-lg text-green-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Privacy Defense HUD
                </h4>
                <div className="text-xs text-slate-500 uppercase tracking-widest">System Active</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Zone */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Input Stream (Unsafe)</label>
                    <textarea
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        rows={8}
                        className="w-full p-4 bg-slate-800 rounded-lg border border-slate-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm leading-relaxed text-slate-300"
                        placeholder="Paste text here..."
                    />
                    <button 
                        onClick={handleScan} 
                        disabled={loading} 
                        className="mt-2 w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? 'SCANNING...' : 'INITIATE SCAN'}
                    </button>
                </div>

                {/* Output Zone */}
                <div className="flex flex-col gap-2 relative">
                    <label className="text-xs font-bold text-slate-400 uppercase">Output Stream (Sanitized)</label>
                    <div className="w-full h-full min-h-[200px] bg-black rounded-lg border border-green-900/50 p-4 relative overflow-hidden">
                        {/* Scanning Effect */}
                        {loading && (
                            <div className="absolute inset-0 z-10 bg-green-500/10 flex flex-col items-center justify-center">
                                <div className="w-full h-1 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-[gravity_1.5s_infinite_linear]"></div>
                                <p className="mt-4 text-green-400 font-bold tracking-widest animate-pulse">DETECTING PII...</p>
                            </div>
                        )}

                        {!loading && result ? (
                            <div className="space-y-4">
                                <p className="text-sm leading-relaxed text-green-300/90 whitespace-pre-wrap">
                                    {result.redactedText}
                                </p>
                                <div className="border-t border-green-900/50 pt-3 mt-2">
                                    <p className="text-xs text-red-400 font-bold mb-2">THREATS INTERCEPTED:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {result.piiFound.map((item, i) => (
                                            <span key={i} className="px-2 py-1 bg-red-900/30 border border-red-800/50 rounded text-xs text-red-300">
                                                {item.type}
                                            </span>
                                        ))}
                                        {result.piiFound.length === 0 && <span className="text-green-500 text-xs">None found. Safe.</span>}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            !loading && <div className="text-slate-600 text-center mt-20 text-xs">Waiting for scan...</div>
                        )}
                    </div>
                </div>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4 text-sm bg-red-900/20 p-2 rounded border border-red-900/50">{error}</p>}
        </div>
    );
};

export default PrivacyLensDashboard;
