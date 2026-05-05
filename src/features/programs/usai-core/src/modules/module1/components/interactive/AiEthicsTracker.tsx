import React, { useState, useEffect } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { Type } from '@google/genai';
// FIX: Add import for AiOutputBlock
import AiOutputBlock from '../AiOutputBlock';

interface PolicyUpdate {
    region: string;
    headline: string;
    summary: string;
}

const AiEthicsTracker: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [updates, setUpdates] = useState<PolicyUpdate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const fetchUpdates = async () => {
        setLoading(true);
        setError('');
        
        const prompt = `You are an AI policy analyst. Generate a list of 3 plausible, recent updates on AI ethics and regulation from different regions (e.g., EU, USA, Asia). For each, provide a "region", a "headline", and a brief "summary". Return as a JSON array of objects.`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ 
                model: 'gemini-2.5-flash', 
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                region: { type: Type.STRING },
                                headline: { type: Type.STRING },
                                summary: { type: Type.STRING }
                            },
                            required: ['region', 'headline', 'summary']
                        }
                    }
                }
            });
            const data = JSON.parse(response.text) as PolicyUpdate[];
            setUpdates(data);

            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to fetch simulated policy data.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchUpdates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="flex justify-between items-center mb-4">
                 <h4 className="font-bold text-lg text-brand-text">AI Ethics & Policy Tracker (Simulated)</h4>
                <button onClick={fetchUpdates} disabled={loading} className="text-sm font-semibold text-brand-primary hover:underline">
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>
             
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="space-y-4">
                {loading && !updates.length && Array.from({ length: 3 }).map((_, i) => (
                     <div key={i} className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in animate-pulse h-24"></div>
                ))}
                {updates.map((update, i) => (
                    <AiOutputBlock
                        key={i}
                        content={`**${update.headline}**\n\n*${update.summary}*`}
                        title={update.region}
                        titleColor="text-brand-primary"
                    />
                ))}
            </div>
        </div>
    );
};

export default AiEthicsTracker;