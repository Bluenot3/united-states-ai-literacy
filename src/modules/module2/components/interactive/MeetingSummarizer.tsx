import React, { useState } from 'react';
import { ListIcon } from '../icons/ListIcon';
import { getAiClient } from '../../services/aiService';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Type } from '@google/genai';

const placeholderTranscript = `Alex: Okay team, let's kick off. The main topic today is the Q3 product launch. Jane, can you give us an update?
Jane: Sure. We're on track. The final UI designs were approved yesterday. We need to make a decision on the primary marketing channel, though. I'm leaning towards social media ads.
Mark: I agree with social media, but we also need to consider influencer outreach. It has a better ROI in our tests.
Alex: Good point, Mark. Let's go with a hybrid approach: 70% social media ads, 30% influencer outreach. Jane, can you action that?
Jane: Will do. I'll have a plan by EOD Friday.
Alex: Perfect. Anything else? No? Okay, great meeting.`;

interface Summary {
    summary: string;
    actionItems: string[];
    keyDecisions: string[];
}

const MeetingSummarizer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [transcript, setTranscript] = useState('');
    const [result, setResult] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleUseExample = () => {
        setTranscript(placeholderTranscript);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!transcript.trim()) {
            setError("Please provide a transcript to summarize.");
            return;
        }
        
        setLoading(true);
        setError(null);
        setResult(null);

        const prompt = `Analyze the following meeting transcript and extract a summary, key decisions, and action items. Transcript:\n\n${transcript}`;
        
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
                        summary: {
                            type: Type.STRING,
                            description: 'A brief, one to two sentence overview of the meeting.',
                        },
                        actionItems: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'A list of specific tasks assigned to individuals or the team.',
                        },
                        keyDecisions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'A list of important decisions made during the meeting.',
                        },
                    },
                    required: ['summary', 'actionItems', 'keyDecisions'],
                },
              }
            });

            const summaryData = JSON.parse(response.text);
            setResult(summaryData);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }

        } catch (err) {
            console.error("Error summarizing content:", err);
            const errorMessage = err instanceof Error ? err.message : "An error occurred while generating the summary.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="transcript" className="block text-sm font-semibold text-brand-text">Meeting Transcript</label>
                        <button type="button" onClick={handleUseExample} className="text-sm text-brand-primary font-semibold hover:underline">Use Example</button>
                    </div>
                    <textarea
                        id="transcript"
                        rows={8}
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder="Paste your meeting notes or transcript here..."
                        className="w-full p-3 bg-brand-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
                    />
                </div>
                 <div className="text-center">
                    <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-neumorphic-out hover:shadow-neumorphic-in transform hover:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ListIcon />
                        {loading ? 'Summarizing...' : 'Generate Summary'}
                    </button>
                </div>
            </form>

            {error && <p className="mt-4 text-center text-red-500 font-semibold">{error}</p>}

            {(result || loading) && (
                <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in animate-fade-in">
                    {loading ? (
                         <div className="space-y-4 animate-pulse">
                            <div className="h-5 bg-brand-shadow-dark/50 rounded w-1/4"></div>
                            <div className="h-4 bg-brand-shadow-dark/50 rounded w-3/4"></div>
                            <div className="h-5 bg-brand-shadow-dark/50 rounded w-1/3 mt-4"></div>
                            <div className="h-4 bg-brand-shadow-dark/50 rounded w-full"></div>
                         </div>
                    ) : (
                        result && (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-lg text-brand-text mb-1">Summary {!hasCompleted && <span className="text-sm font-normal text-pale-green">(+25 points!)</span>}</h4>
                                    <p className="text-brand-text-light">{result.summary}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-brand-text mb-1">Key Decisions</h4>
                                    <ul className="list-disc list-inside text-brand-text-light space-y-1">
                                        {result.keyDecisions.map((item, i) => <li key={`d-${i}`}>{item}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-brand-text mb-1">Action Items</h4>
                                    <ul className="list-disc list-inside text-brand-text-light space-y-1">
                                        {result.actionItems.map((item, i) => <li key={`a-${i}`}>{item}</li>)}
                                    </ul>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default MeetingSummarizer;