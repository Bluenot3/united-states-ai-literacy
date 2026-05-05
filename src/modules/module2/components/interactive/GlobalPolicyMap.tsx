
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface RegionInfo {
    id: string;
    name: string;
    focus: string;
    keyRisk: string;
    color: string;
}

const REGIONS: RegionInfo[] = [
    { id: 'na', name: 'North America', focus: 'Innovation & Sectoral', keyRisk: 'Litigation (Copyright/Liability)', color: 'bg-blue-500' },
    { id: 'eu', name: 'Europe (EU)', focus: 'Fundamental Rights (GDPR/AI Act)', keyRisk: 'Regulatory Fines (up to 7% turnover)', color: 'bg-indigo-600' },
    { id: 'cn', name: 'China', focus: 'Social Stability & Control', keyRisk: 'Strict Content Filtering & Data Locality', color: 'bg-red-500' },
    { id: 'row', name: 'Rest of World', focus: 'Mixed / Emerging', keyRisk: 'Fragmented Standards', color: 'bg-gray-400' },
];

const GlobalPolicyMap: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [selectedRegion, setSelectedRegion] = useState<RegionInfo | null>(null);

    const handleSelect = (r: RegionInfo) => {
        setSelectedRegion(r);
        if (user && !user.progress.completedInteractives.includes(interactiveId)) {
            addPoints(10);
            updateProgress(interactiveId, 'interactive');
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Global Policy Landscape</h4>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Abstract Map Visualization */}
                <div className="lg:w-1/2 relative bg-white rounded-xl border border-gray-200 h-64 overflow-hidden shadow-inner flex items-center justify-center">
                    <div className="absolute inset-0 bg-gray-50 opacity-50" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    
                    {/* Simulated Map Regions (Abstract Blobs) */}
                    <button 
                        onClick={() => handleSelect(REGIONS[0])}
                        className="absolute top-10 left-10 w-24 h-24 bg-blue-100 rounded-full border-2 border-blue-300 hover:bg-blue-200 transition-all flex items-center justify-center text-xs font-bold text-blue-800 shadow-sm hover:scale-105"
                    >
                        N. America
                    </button>
                    <button 
                        onClick={() => handleSelect(REGIONS[1])}
                        className="absolute top-12 right-24 w-20 h-20 bg-indigo-100 rounded-full border-2 border-indigo-300 hover:bg-indigo-200 transition-all flex items-center justify-center text-xs font-bold text-indigo-800 shadow-sm hover:scale-105"
                    >
                        EU
                    </button>
                    <button 
                        onClick={() => handleSelect(REGIONS[2])}
                        className="absolute bottom-10 right-10 w-24 h-24 bg-red-100 rounded-full border-2 border-red-300 hover:bg-red-200 transition-all flex items-center justify-center text-xs font-bold text-red-800 shadow-sm hover:scale-105"
                    >
                        China
                    </button>
                    <button 
                        onClick={() => handleSelect(REGIONS[3])}
                        className="absolute bottom-8 left-20 w-16 h-16 bg-gray-200 rounded-full border-2 border-gray-300 hover:bg-gray-300 transition-all flex items-center justify-center text-[10px] font-bold text-gray-600 shadow-sm hover:scale-105"
                    >
                        RoW
                    </button>
                </div>

                {/* Info Panel */}
                <div className="lg:w-1/2 flex items-center">
                    {selectedRegion ? (
                        <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-4 h-4 rounded-full ${selectedRegion.color}`}></div>
                                <h5 className="text-xl font-bold text-brand-text">{selectedRegion.name}</h5>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Regulatory Focus</span>
                                    <p className="text-gray-800 font-medium">{selectedRegion.focus}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Primary Risk</span>
                                    <p className="text-red-600 font-bold">{selectedRegion.keyRisk}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            Select a region on the map to inspect policy constraints.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlobalPolicyMap;
