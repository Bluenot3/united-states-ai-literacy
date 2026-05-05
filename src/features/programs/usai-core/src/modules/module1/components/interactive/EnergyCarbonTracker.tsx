
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

// Example data points (Wh per 1M tokens). These are illustrative based on rough industry estimates.
const modelEnergy = {
    'gemini-2.5-flash': 50,  // Efficient
    'gemini-2.5-pro': 200,   // Standard
    'gpt-5-heavy': 600       // Hypothetical heavy model
};

const CO2_PER_WH = 0.4; // grams per Wh (global average)
const CAR_DIST_PER_G_CO2 = 120; // meters driven per gram of CO2 (approx)
const BULB_WATTS = 10; // 10W LED bulb

const EnergyCarbonTracker: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [model, setModel] = useState<keyof typeof modelEnergy>('gemini-2.5-flash');
    const [queries, setQueries] = useState(100); // Number of queries (assuming ~1k tokens each)

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    // Calculate metrics
    // Assume 1 query = ~1000 tokens (input + output)
    const totalTokens = queries * 1000;
    const energyWh = (totalTokens / 1000000) * modelEnergy[model]; 
    
    // Impact Visuals
    const bulbHours = (energyWh / BULB_WATTS);
    const carbonGrams = energyWh * CO2_PER_WH;
    const carMeters = carbonGrams / (150 / 1000); // ~150g CO2/km for a car -> 0.15g/m

    const handleInteraction = () => {
        if (!hasCompleted) {
            addPoints(1, 25);
            updateModuleProgress(1, interactiveId, 'interactive');
        }
    }

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Energy Cost Calculator</h4>
            <p className="text-center text-brand-text-light mb-6 text-sm">Every AI thought burns real-world fuel. See the impact.</p>

            <div className="flex flex-col gap-6">
                
                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Model "Brain" Size</label>
                        <select 
                            value={model} 
                            onChange={(e) => {
                                setModel(e.target.value as keyof typeof modelEnergy);
                                handleInteraction();
                            }} 
                            className="w-full p-2 bg-brand-bg rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            <option value="gemini-2.5-flash">Flash (Small/Fast)</option>
                            <option value="gemini-2.5-pro">Pro (Medium/Smart)</option>
                            <option value="gpt-5-heavy">Ultra-Heavy (Massive)</option>
                        </select>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Number of Questions: {queries}</label>
                        <input 
                            type="range" 
                            min="10" 
                            max="10000" 
                            step="10"
                            value={queries} 
                            onChange={(e) => {
                                setQueries(Number(e.target.value));
                                handleInteraction();
                            }} 
                            className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer accent-brand-primary" 
                        />
                    </div>
                </div>

                {/* Visualizations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Lightbulb Metaphor */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-100 flex flex-col items-center justify-center text-center">
                        <div className="text-5xl mb-2 filter drop-shadow-md">💡</div>
                        <p className="text-yellow-900 font-bold text-2xl">{bulbHours.toFixed(2)} Hours</p>
                        <p className="text-yellow-700/70 text-xs font-medium">of an LED lightbulb burning</p>
                    </div>

                    {/* Car Metaphor */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-gray-200 p-6 rounded-xl border border-slate-300 flex flex-col items-center justify-center text-center">
                        <div className="text-5xl mb-2 filter drop-shadow-md">🚗</div>
                        <p className="text-slate-800 font-bold text-2xl">{carMeters.toFixed(1)} Meters</p>
                        <p className="text-slate-600/70 text-xs font-medium">driven by a gas car</p>
                    </div>
                </div>

                <div className="bg-black/5 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-500 font-mono">
                        Total Energy: <strong>{energyWh.toFixed(2)} Wh</strong> | Est. Carbon: <strong>{carbonGrams.toFixed(2)} gCO₂</strong>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default EnergyCarbonTracker;
