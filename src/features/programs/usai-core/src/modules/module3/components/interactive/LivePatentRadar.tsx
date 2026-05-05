import React, { useState, useEffect } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

interface Patent {
    title: string;
    summary: string;
}

const LivePatentRadar: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [patents, setPatents] = useState<Patent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const fetchPatents = async () => {
        setLoading(true);
        setError('');
        
        const prompt = `You are an AI industry analyst. Generate a list of 5 plausible, recent, and interesting-sounding AI patent filings. For each patent, provide a "title" and a brief "summary". Return the result as a JSON array of objects, where each object has a "title" and "summary" key.`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ 
                model: 'gemini-2.5-flash', 
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });
            const data = JSON.parse(response.text) as Patent[];
            setPatents(data);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to fetch simulated patent data.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchPatents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg text-brand-text">Live Patent Radar (Simulated)</h4>
                 <button onClick={fetchPatents} disabled={loading} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary rounded-full px-4 py-2 shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>
            <p className="text-brand-text-light mb-4 text-sm">Gemini is generating a list of recent, plausible AI patent filings to simulate a live data feed.</p>
            
            {error && <p className="text-center text-red-500">{error}</p>}
            
            <div className="space-y-3">
                {loading && !patents.length && Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-3 bg-brand-bg rounded-lg shadow-neumorphic-in animate-pulse">
                        <div className="h-5 bg-brand-shadow-dark/50 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-brand-shadow-dark/50 rounded w-full"></div>
                    </div>
                ))}
                {patents.map((patent, i) => (
                    <div key={i} className="p-3 bg-brand-bg rounded-lg shadow-neumorphic-out animate-fade-in">
                        <h5 className="font-semibold text-brand-text">{patent.title}</h5>
                        <p className="text-sm text-brand-text-light">{patent.summary}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LivePatentRadar;