import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../../../types';
import { useAuth } from '../../../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { CheckIcon } from '../icons/CheckIcon';

const AiGovernanceCardGenerator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [orgName, setOrgName] = useState('ZEN VANGUARD');
    const [pledge, setPledge] = useState('');
    const [cardData, setCardData] = useState<{ org: string; pledge: string; txId: string; } | null>(null);
    const [loading, setLoading] = useState(false);
    const hasCompleted = user?.modules?.[4]?.completedInteractives.includes(interactiveId);

    const generatePledge = async () => {
        setLoading(true);
        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: 'Write a one-sentence Responsible AI pledge for a corporate governance card.' });
            setPledge(response.text);
        } catch (e) {
            console.error(e);
            setPledge('We commit to developing AI that is safe, ethical, and beneficial for humanity.');
        } finally {
            setLoading(false);
        }
    };

    const handleMint = () => {
        if (!orgName || !pledge) return;
        setCardData({
            org: orgName,
            pledge: pledge,
            txId: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
        });
        if (!hasCompleted) {
            addPoints(30);
            updateProgress(interactiveId, 'interactive');
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">AI Governance Card Generator</h4>
            
            {!cardData ? (
                <div className="max-w-md mx-auto space-y-4">
                    <div>
                        <label className="font-semibold text-sm text-brand-text">Organization Name</label>
                        <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} className="w-full mt-1 p-3 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                    </div>
                    <div>
                        <label className="font-semibold text-sm text-brand-text">Responsible-AI Pledge</label>
                        <textarea value={pledge} onChange={e => setPledge(e.target.value)} rows={3} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                        <button onClick={generatePledge} disabled={loading} className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1">
                            <SparklesIcon /> {loading ? 'Generating...' : 'Generate with AI'}
                        </button>
                    </div>
                    <div className="text-center pt-2">
                        <button onClick={handleMint} disabled={!orgName || !pledge} className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                            Mint Governance Card
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="relative w-80 h-48 rounded-2xl p-4 bg-slate-800 text-white overflow-hidden shadow-lg transition-transform transform hover:scale-105" style={{
                        backgroundImage: 'linear-gradient(45deg, #1e1b4b 0%, #4c1d95 25%, #be185d 50%, #fde68a 75%, #a7f3d0 100%)',
                        backgroundSize: '200% 200%',
                        animation: 'holographic 5s ease infinite',
                    }}>
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start">
                                <h5 className="font-bold text-xl">{cardData.org}</h5>
                                <div className="flex items-center gap-1 text-xs bg-green-500/80 px-2 py-0.5 rounded-full">
                                    <CheckIcon /> VERIFIED
                                </div>
                            </div>
                            <p className="text-sm mt-4 italic">"{cardData.pledge}"</p>
                            <p className="absolute bottom-2 left-4 font-mono text-xs opacity-50 truncate">TX: {cardData.txId}</p>
                        </div>
                        <style>{`
                            @keyframes holographic {
                                0%{background-position:0% 50%}
                                50%{background-position:100% 50%}
                                100%{background-position:0% 50%}
                            }
                        `}</style>
                    </div>
                    <button onClick={() => setCardData(null)} className="mt-6 px-6 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Create New Card</button>
                </div>
            )}
        </div>
    );
};

export default AiGovernanceCardGenerator;
