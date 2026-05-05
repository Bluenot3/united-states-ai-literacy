import React, { useState, useCallback } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import AiOutputBlock from '../AiOutputBlock';

const ParameterUniverseExplorer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [temperature, setTemperature] = useState(0.5);
    const [topP, setTopP] = useState(0.95);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
        let timeoutId: ReturnType<typeof setTimeout>;
        return (...args: Parameters<F>): void => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const generateText = async (temp: number, p: number) => {
        setLoading(true);
        setError('');
        
        const prompt = "Write a short, creative story about a clockmaker who discovers a gear that can turn back time by one second.";

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ 
                model: 'gemini-2.5-flash', 
                contents: prompt,
                config: { temperature: temp, topP: p }
            });
            setResult(response.text);

            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate text.');
        } finally {
            setLoading(false);
        }
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedGenerate = useCallback(debounce(generateText, 700), [hasCompleted]);

    const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTemp = parseFloat(e.target.value);
        setTemperature(newTemp);
        debouncedGenerate(newTemp, topP);
    }
    
     const handleTopPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTopP = parseFloat(e.target.value);
        setTopP(newTopP);
        debouncedGenerate(temperature, newTopP);
    }

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Parameter Universe Explorer</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Adjust Temperature (randomness) and Top-P (creativity) to see how they affect the AI's response.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                 <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">Temperature: {temperature.toFixed(2)}</label>
                    <input type="range" min="0" max="1" step="0.05" value={temperature} onChange={handleTempChange} className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in" />
                </div>
                 <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">Top-P: {topP.toFixed(2)}</label>
                    <input type="range" min="0" max="1" step="0.05" value={topP} onChange={handleTopPChange} className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in" />
                </div>
            </div>
            
             <AiOutputBlock
                content={result}
                isLoading={loading}
                error={error}
                title="Generated Story"
                placeholder="Adjust a slider to generate a story."
            />
        </div>
    );
};

export default ParameterUniverseExplorer;
