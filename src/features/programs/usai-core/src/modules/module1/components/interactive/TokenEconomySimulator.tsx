import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const TokenEconomySimulator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [supply, setSupply] = useState(50); // 0-100
    const [demand, setDemand] = useState(50); // 0-100

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleInteraction = () => {
        if (!hasCompleted) {
            addPoints(1, 10); // Give points for interaction
            updateModuleProgress(1, interactiveId, 'interactive');
        }
    };

    const price = (demand / (supply === 0 ? 1 : supply)).toFixed(2);

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Token Economy Simulator</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="space-y-6">
                     <div>
                        <label className="block text-center text-brand-text-light mb-2">Token Supply: <span className="font-bold text-brand-text">{supply}M</span></label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={supply}
                            onChange={(e) => {
                                setSupply(parseInt(e.target.value));
                                handleInteraction();
                            }}
                            className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in"
                        />
                    </div>
                     <div>
                        <label className="block text-center text-brand-text-light mb-2">Market Demand: <span className="font-bold text-brand-text">{demand}%</span></label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={demand}
                            onChange={(e) => {
                                setDemand(parseInt(e.target.value));
                                handleInteraction();
                            }}
                            className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in"
                        />
                    </div>
                </div>
                
                <div className="md:col-span-2 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in text-center h-full flex flex-col justify-center">
                    <p className="font-semibold text-brand-text mb-2">Simulated Token Price</p>
                    <p className="text-5xl font-extrabold text-brand-primary">${price}</p>
                </div>
            </div>
        </div>
    );
};

export default TokenEconomySimulator;
