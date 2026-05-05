import React, { useState, useEffect } from 'react';
import type { InteractiveComponentProps } from '../../../../types';
import { useAuth } from '../../../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

type Mode = 'Drift' | 'Equity';

const generateData = (mode: Mode, time: number) => {
    const base = 5;
    const driftFactor = mode === 'Drift' ? Math.max(0, time - 5) * 2 : 0;
    const biasFactor = mode === 'Equity' ? Math.sin(time / 2) * 15 : 0;
    const noise = (Math.random() - 0.5) * 5;
    return Math.max(0, Math.min(100, base + driftFactor + biasFactor + noise));
};

const DataDriftRiskLens: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [mode, setMode] = useState<Mode>('Drift');
    const [data, setData] = useState<number[]>([]);
    const [alert, setAlert] = useState('');
    const [loading, setLoading] = useState(false);
    const hasCompleted = user?.modules?.[4]?.completedInteractives.includes(interactiveId);

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => {
                const newData = [...prev, generateData(mode, prev.length)].slice(-20);
                if (newData[newData.length - 1] > 75) {
                    getAlert(mode, newData[newData.length - 1]);
                }
                return newData;
            });
        }, 1500);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    const getAlert = async (currentMode: Mode, currentValue: number) => {
        setLoading(true);
        const issue = currentMode === 'Drift' 
            ? `significant concept drift detected (value: ${currentValue.toFixed(1)})`
            : `potential demographic bias detected in outputs (value: ${currentValue.toFixed(1)})`;
        
        const prompt = `You are an AI Ops monitoring system. A critical alert has been triggered for "${issue}". Write a brief, clear alert message for a Slack channel that explains the problem and suggests one immediate action (e.g., "roll back to the previous model version" or "trigger a manual review of recent outputs").`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAlert(response.text);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setAlert('Critical alert! Manual investigation required.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg text-brand-text">Data Drift & Risk Lens</h4>
                <div className="p-1 bg-brand-bg rounded-full shadow-neumorphic-in flex">
                    <button onClick={() => { setMode('Drift'); setData([]); setAlert(''); }} className={`px-4 py-1 text-sm rounded-full ${mode === 'Drift' ? 'bg-brand-primary text-white' : ''}`}>Drift Mode</button>
                    <button onClick={() => { setMode('Equity'); setData([]); setAlert(''); }} className={`px-4 py-1 text-sm rounded-full ${mode === 'Equity' ? 'bg-brand-primary text-white' : ''}`}>Equity Mode</button>
                </div>
            </div>
            
            <div className="w-full h-48 bg-brand-bg p-2 rounded-lg shadow-neumorphic-in flex items-end gap-1">
                {data.map((val, i) => (
                    <div key={i} className="flex-1 bg-brand-secondary rounded-t-sm" style={{ height: `${val}%`, opacity: 0.5 + (i/data.length)*0.5 }}></div>
                ))}
            </div>

            {(loading || alert) && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg shadow-neumorphic-in">
                    <h5 className="font-bold text-red-600 mb-2">⚠️ CRITICAL ALERT</h5>
                    {loading && <p className="animate-pulse">Analyzing alert...</p>}
                    <p className="text-red-700">{alert}</p>
                </div>
            )}
        </div>
    );
};

export default DataDriftRiskLens;
