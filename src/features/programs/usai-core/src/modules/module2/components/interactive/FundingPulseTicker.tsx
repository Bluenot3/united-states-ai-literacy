import React, { useState, useEffect } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';

interface FundingRound {
    company: string;
    sector: string;
    amount: string;
}

const FundingPulseTicker: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [rounds, setRounds] = useState<FundingRound[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const fetchRounds = async () => {
        setLoading(true);
        setError('');

        const prompt = `You are an AI venture capital analyst. Generate a list of 4 plausible, recent, and interesting-sounding funding rounds for AI startups. For each, provide a "company" name, "sector" (e.g., RAG, Robotics, Synthetic Data), and "amount" (e.g., "$15M Series A"). Return the result as a JSON array of objects.`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });
            const data = JSON.parse(response.text) as FundingRound[];
            setRounds(data);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to fetch simulated funding data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getSectorColor = (sector: string) => {
        if (sector.toLowerCase().includes('robotics')) return 'bg-pale-purple/20 text-pale-purple';
        if (sector.toLowerCase().includes('rag')) return 'bg-pale-yellow/20 text-pale-yellow';
        if (sector.toLowerCase().includes('synthetic')) return 'bg-pale-green/20 text-pale-green';
        return 'bg-brand-secondary/20 text-brand-primary';
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg text-brand-text">Funding Pulse Ticker (Simulated)</h4>
                <button onClick={fetchRounds} disabled={loading} className="text-sm font-semibold text-brand-primary hover:underline">
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading && !rounds.length && Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in animate-pulse h-28"></div>
                ))}
                {rounds.map((round, i) => (
                    <div key={i} className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-out animate-fade-in">
                        <h5 className="font-bold text-brand-text truncate">{round.company}</h5>
                        <p className={`text-xs font-semibold px-2 py-1 rounded-full inline-block my-2 ${getSectorColor(round.sector)}`}>{round.sector}</p>
                        <p className="text-2xl font-bold text-brand-primary">{round.amount}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FundingPulseTicker;