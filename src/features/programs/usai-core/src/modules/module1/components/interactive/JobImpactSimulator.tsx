import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const industryData = {
    'Customer Service': { base: 100, automation: 0.7, creation: 0.1 },
    'Software Development': { base: 100, automation: 0.4, creation: 0.5 },
    'Graphic Design': { base: 100, automation: 0.6, creation: 0.3 },
    'Healthcare': { base: 100, automation: 0.2, creation: 0.4 },
};

type Industry = keyof typeof industryData;

const JobImpactSimulator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [industry, setIndustry] = useState<Industry>('Customer Service');
    const [adoption, setAdoption] = useState(50); // 0-100%

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleInteraction = () => {
         if (!hasCompleted) {
            addPoints(1, 10);
            updateModuleProgress(1, interactiveId, 'interactive');
        }
    };

    const { displaced, created, netChange } = (() => {
        const data = industryData[industry];
        const displaced = data.base * data.automation * (adoption / 100);
        const created = data.base * data.creation * (adoption / 100);
        const netChange = created - displaced;
        return { displaced, created, netChange };
    })();
    
    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">AI Job Impact Simulator</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">Select Industry</label>
                    <select 
                        value={industry} 
                        onChange={(e) => {
                            setIndustry(e.target.value as Industry);
                            handleInteraction();
                        }} 
                        className="w-full p-3 bg-brand-bg rounded-lg shadow-neumorphic-in focus:outline-none"
                    >
                        {Object.keys(industryData).map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">AI Adoption Rate: {adoption}%</label>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={adoption} 
                        onChange={(e) => {
                            setAdoption(Number(e.target.value));
                            handleInteraction();
                        }} 
                        className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                 <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <p className="text-brand-text-light">Jobs Displaced</p>
                    <p className="text-3xl font-bold text-red-500">-{displaced.toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <p className="text-brand-text-light">Jobs Created</p>
                    <p className="text-3xl font-bold text-pale-green">+{created.toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <p className="text-brand-text-light">Net Change</p>
                    <p className={`text-3xl font-bold ${netChange >= 0 ? 'text-pale-green' : 'text-red-500'}`}>
                        {netChange >= 0 ? '+' : ''}{netChange.toFixed(1)}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JobImpactSimulator;
