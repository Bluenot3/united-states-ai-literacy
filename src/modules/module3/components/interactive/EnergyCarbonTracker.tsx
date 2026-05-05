import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

// Example data points (Wh per 1M tokens). These are illustrative.
const modelEnergy = {
    'gemini-2.5-flash': 50,  // Wh per 1M tokens
    'gemini-2.5-pro': 200, // Wh per 1M tokens
    'gpt-5-hypothetical': 500 // Wh per 1M tokens
};

const CO2_PER_KWH = 400; // gCO2e per kWh (global average, illustrative)

const EnergyCarbonTracker: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [model, setModel] = useState<keyof typeof modelEnergy>('gemini-2.5-flash');
    const [tokens, setTokens] = useState(1000000); // Default to 1M

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const energyWh = (tokens / 1000000) * modelEnergy[model];
    const carbonGrams = (energyWh / 1000) * CO2_PER_KWH;

    const handleModelChange = () => {
        if (!hasCompleted) {
            addPoints(25);
            updateProgress(interactiveId, 'interactive');
        }
    }

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Energy & Carbon Tracker</h4>
            <p className="text-center text-brand-text-light mb-6 text-sm">Estimate the energy and carbon footprint for processing a given number of tokens with different models.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">AI Model</label>
                        <select 
                            value={model} 
                            onChange={(e) => {
                                setModel(e.target.value as keyof typeof modelEnergy);
                                handleModelChange();
                            }} 
                            className="w-full p-3 bg-brand-bg rounded-lg shadow-neumorphic-in focus:outline-none"
                        >
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                            <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                            <option value="gpt-5-hypothetical">GPT-5 (Hypothetical)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">Number of Tokens: {tokens.toLocaleString()}</label>
                        <input 
                            type="range" 
                            min="100000" 
                            max="10000000" 
                            step="100000" 
                            value={tokens} 
                            onChange={(e) => {
                                setTokens(Number(e.target.value));
                                handleModelChange();
                            }} 
                            className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in" 
                        />
                    </div>
                </div>

                <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in space-y-4">
                    <div className="text-center">
                        <p className="text-brand-text-light">Est. Energy Consumption</p>
                        <p className="text-3xl font-bold text-brand-primary">{energyWh.toFixed(2)} <span className="text-xl">Wh</span></p>
                         <p className="text-xs text-brand-text-light">(Equivalent to powering a 10W LED bulb for {Math.round(energyWh/10)} hours)</p>
                    </div>
                    <div className="text-center">
                        <p className="text-brand-text-light">Est. Carbon Footprint</p>
                        <p className="text-3xl font-bold text-brand-primary">{carbonGrams.toFixed(2)} <span className="text-xl">gCO₂e</span></p>
                        <p className="text-xs text-brand-text-light">(Equivalent to driving a car for ~{Math.round(carbonGrams/120)} meters)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnergyCarbonTracker;
