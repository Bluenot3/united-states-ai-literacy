
import React, { useState } from 'react';
import { ListIcon } from '../icons/ListIcon';
import { getAiClient } from '../../services/aiService';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Type } from '@google/genai';

const placeholderTranscript = `Notes from Monday Morning Sync:
- Sarah said the website is crashing on mobile. Needs fix by tomorrow.
- Tom wants to change the logo color to neon pink?? (Discuss later).
- Q3 budget is approved! 50k more than last year.
- We need to hire 2 new devs ASAP.
- Lunch order: Pizza.
- Reminder: Client presentation is moved to Friday 2pm.`;

interface Summary {
    subject: string;
    body: string;
}

const MeetingSummarizer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [transcript, setTranscript] = useState(placeholderTranscript);
    const [result, setResult] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    
    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleSubmit = async () => {
        if (!transcript.trim()) {
            setError("Please provide notes to summarize.");
            return;
        }
        
        setLoading(true);
        setError(null);
        setResult(null);
        setSent(false);

        const prompt = `You are an elite Chief of Staff. Turn these messy meeting notes into a crisp, professional email to the team. 
        Format:
        1. Subject Line: Clear and Urgent.
        2. Body: Organized by "Key Wins", "Action Items" (with owners if implied), and "Updates". Remove irrelevant fluff (like lunch orders). Tone: Professional, energetic, leadership-driven.
        
        Notes:
        ${transcript}`;
        
        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        subject: { type: Type.STRING },
                        body: { type: Type.STRING }
                    },
                    required: ['subject', 'body'],
                },
              }
            });

            const summaryData = JSON.parse(response.text);
            setResult(summaryData);
            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }

        } catch (err) {
            console.error("Error summarizing content:", err);
            const errorMessage = err instanceof Error ? err.message : "An error occurred while generating the summary.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMock = () => {
        setSent(true);
    };
    
    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Chaos-to-Order Engine</h4>
            <p className="text-center text-brand-text-light mb-6 text-sm">Paste messy notes. Get a perfect email. See the power of AI structuring.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Side: The Sticky Note */}
                <div className="flex flex-col h-full">
                    <div className="bg-yellow-100 border border-yellow-200 p-4 rounded-lg shadow-sm flex-grow relative rotate-1 transform transition-transform hover:rotate-0">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-4 bg-yellow-200/50 backdrop-blur-sm rounded-sm"></div>
                        <label className="block font-handwriting text-yellow-800 mb-2 font-bold text-lg">Messy Brain Dump:</label>
                        <textarea
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            className="w-full h-64 bg-transparent border-none resize-none focus:ring-0 text-brand-text font-mono text-sm leading-relaxed"
                            placeholder="Type messy notes here..."
                        />
                    </div>
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading} 
                        className="mt-4 w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-xl shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        {loading ? 'Organizing...' : '⚡ AI: Fix This'}
                    </button>
                </div>

                {/* Output Side: The Email Client */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[400px]">
                    <div className="bg-slate-100 p-3 border-b border-slate-200 flex gap-2 items-center">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-grow text-center text-xs font-semibold text-slate-500">New Message</div>
                    </div>
                    
                    {loading ? (
                        <div className="flex-grow flex flex-col items-center justify-center space-y-3 p-8">
                            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm text-brand-text-light animate-pulse">Drafting professional correspondence...</p>
                        </div>
                    ) : result ? (
                        <div className="flex-col flex flex-grow">
                            <div className="p-4 border-b border-slate-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase w-12">To:</span>
                                    <span className="text-sm bg-slate-100 px-2 py-0.5 rounded text-slate-600">The Team</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase w-12">Subj:</span>
                                    <span className="text-sm font-semibold text-brand-text">{result.subject}</span>
                                </div>
                            </div>
                            <div className="p-4 flex-grow overflow-y-auto bg-white">
                                <p className="text-sm text-brand-text whitespace-pre-wrap leading-relaxed">{result.body}</p>
                            </div>
                            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                                {!sent ? (
                                    <button onClick={handleSendMock} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                                        Send Email <span className="text-blue-200">⌘Enter</span>
                                    </button>
                                ) : (
                                    <span className="text-green-600 font-bold text-sm flex items-center gap-2 px-4 py-2">
                                        ✓ Sent!
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-slate-300 text-sm">
                            Waiting for input...
                        </div>
                    )}
                </div>
            </div>
            {error && <p className="mt-4 text-center text-red-500 font-semibold">{error}</p>}
        </div>
    );
};

export default MeetingSummarizer;
