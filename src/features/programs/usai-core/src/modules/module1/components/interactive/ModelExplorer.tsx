import React, { useState, useMemo } from 'react';
import { modelData } from '../../data/modelData';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const ModelExplorer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [activeProviders, setActiveProviders] = useState<string[]>([]);
    const [filterType, setFilterType] = useState<'all' | 'open' | 'closed'>('all');
    const [sortBy, setSortBy] = useState('provider');
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const providers = useMemo(() => {
        const providerCounts = modelData.reduce((acc, model) => {
            acc[model.provider] = (acc[model.provider] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(providerCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([provider]) => provider);
    }, []);

    const toggleProvider = (provider: string) => {
        setActiveProviders(prev => 
            prev.includes(provider) ? prev.filter(p => p !== provider) : [...prev, provider]
        );
        if(!hasCompleted) {
            addPoints(1, 1);
            updateModuleProgress(1, interactiveId, 'interactive');
        }
    };

    const filteredModels = useMemo(() => {
        return modelData.filter(model => {
            const providerMatch = activeProviders.length === 0 || activeProviders.includes(model.provider);
            const typeMatch = filterType === 'all' || (filterType === 'open' ? model.isOpenSource : !model.isOpenSource);
            return providerMatch && typeMatch;
        });
    }, [activeProviders, filterType]);

    const sortedModels = useMemo(() => {
        return [...filteredModels].sort((a, b) => {
            switch (sortBy) {
                case 'context': return b.contextWindowSort - a.contextWindowSort;
                case 'input_price': return a.inputPriceSort - b.inputPriceSort;
                case 'output_price': return a.outputPriceSort - b.outputPriceSort;
                case 'model': return a.model.localeCompare(b.model);
                default: return a.provider.localeCompare(b.provider) || a.model.localeCompare(b.model);
            }
        });
    }, [filteredModels, sortBy]);

    const providerColors: { [key: string]: string } = {
        'OpenAI': 'bg-green-200 text-green-800', 'Google': 'bg-blue-200 text-blue-800',
        'Anthropic': 'bg-orange-200 text-orange-800', 'Meta': 'bg-indigo-200 text-indigo-800',
        'xAI': 'bg-gray-300 text-gray-800', 'Mistral': 'bg-yellow-200 text-yellow-800',
        'Alibaba': 'bg-red-200 text-red-800', 'NVIDIA': 'bg-lime-200 text-lime-800',
        'Microsoft': 'bg-sky-200 text-sky-800', 'default': 'bg-slate-200 text-slate-800'
    };
    
    const getProviderColor = (provider: string) => providerColors[provider] || providerColors.default;

    return (
        <div className="my-8 p-4 md:p-6 bg-brand-bg/50 rounded-2xl shadow-soft-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-2">
                    <label className="font-semibold text-brand-text mb-2 block">Filter by Provider</label>
                    <div className="flex flex-wrap gap-2">
                        {providers.slice(0, 7).map(p => (
                            <button key={p} onClick={() => toggleProvider(p)} className={`px-3 py-1.5 text-sm rounded-lg transition-all border ${activeProviders.includes(p) ? 'bg-brand-primary/10 border-brand-primary text-brand-primary font-semibold' : 'bg-white/50 border-slate-300/50 hover:border-slate-400/80'}`}>{p}</button>
                        ))}
                    </div>
                </div>
                <div>
                     <label className="font-semibold text-brand-text mb-2 block">Filter by Type</label>
                     <div className="flex bg-white/40 p-1 rounded-lg shadow-soft-inner">
                        <button onClick={() => setFilterType('all')} className={`flex-1 py-1 text-sm rounded-md transition-colors ${filterType === 'all' ? 'bg-brand-primary text-white shadow-md' : 'hover:bg-white/50'}`}>All</button>
                        <button onClick={() => setFilterType('open')} className={`flex-1 py-1 text-sm rounded-md transition-colors ${filterType === 'open' ? 'bg-brand-primary text-white shadow-md' : 'hover:bg-white/50'}`}>Open</button>
                        <button onClick={() => setFilterType('closed')} className={`flex-1 py-1 text-sm rounded-md transition-colors ${filterType === 'closed' ? 'bg-brand-primary text-white shadow-md' : 'hover:bg-white/50'}`}>Proprietary</button>
                     </div>
                </div>
            </div>
             <div className="flex justify-end mb-4">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="p-2 text-sm bg-white/50 border border-slate-300/50 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-primary">
                    <option value="provider">Sort by Provider</option>
                    <option value="model">Sort by Name</option>
                    <option value="context">Sort by Context Window</option>
                    <option value="input_price">Sort by Input Price</option>
                    <option value="output_price">Sort by Output Price</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedModels.map(model => (
                    <div key={model.model} className="group glass-card relative transition-all duration-300 hover:shadow-glowing-blue hover:-translate-y-1">
                        <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-br from-brand-blue/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                        <div className="p-4 cursor-pointer" onClick={() => setExpandedCard(prev => prev === model.model ? null : model.model)}>
                            <div className="flex justify-between items-start">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${getProviderColor(model.provider)}`}>{model.provider}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${model.isOpenSource ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-800'}`}>{model.isOpenSource ? 'Open' : 'Proprietary'}</span>
                            </div>
                            <h3 className="font-bold text-lg text-brand-text mt-2">{model.model}</h3>
                            <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                                <div>
                                    <p className="font-semibold text-brand-text-light">Context</p>
                                    <p className="font-bold text-brand-text text-sm">{model.contextWindow}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-brand-text-light">Input</p>
                                    <p className="font-bold text-brand-text text-sm whitespace-pre-line">{model.inputPrice}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-brand-text-light">Output</p>
                                    <p className="font-bold text-brand-text text-sm whitespace-pre-line">{model.outputPrice}</p>
                                </div>
                            </div>
                            <div className="flex justify-center mt-3 text-brand-text-light/50">
                                <ChevronDownIcon className={`transition-transform duration-300 ${expandedCard === model.model ? 'rotate-180' : ''}`} />
                            </div>
                        </div>
                        <div className={`transition-all duration-300 ease-in-out grid ${expandedCard === model.model ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden">
                                <div className="p-4 pt-0">
                                  <div className="border-t border-glass-stroke pt-4">
                                    <h4 className="font-semibold text-sm text-brand-text mb-1">Details</h4>
                                    <p className="text-sm text-brand-text-light">{model.details}</p>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {sortedModels.length === 0 && <p className="text-center text-brand-text-light mt-8">No models match the current filters.</p>}
        </div>
    );
};

export default ModelExplorer;