
import React, { useState, useMemo } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

type DatasetType = 'clean' | 'noisy' | 'biased';

const DATASETS: { type: DatasetType; label: string; icon: string; color: string; activeColor: string; description: string }[] = [
    { type: 'clean', label: 'Clean Data', icon: '✅', color: 'emerald', activeColor: 'from-emerald-500/20 to-emerald-400/5', description: "Clear linear pattern. The AI learns perfectly: 'As X goes up, Y goes up.' This represents ideal training data." },
    { type: 'noisy', label: 'Noisy Data', icon: '⚠️', color: 'amber', activeColor: 'from-amber-500/20 to-amber-400/5', description: "Messy scatter. The AI will be confused — it might learn a false pattern or fail to learn anything at all. This is what happens with poor-quality training data." },
    { type: 'biased', label: 'Biased Data', icon: '🚫', color: 'rose', activeColor: 'from-rose-500/20 to-rose-400/5', description: "Notice how the right side flattens out? The AI learns a false ceiling, thinking values can never exceed 50. This is systemic bias baked into data." },
];

const DataVisualizer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [dataset, setDataset] = useState<DatasetType>('clean');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleSetDataset = (type: DatasetType) => {
        setDataset(type);
        if (!hasCompleted) {
            addPoints(1, 10);
            updateModuleProgress(1, interactiveId, 'interactive');
        }
    };

    const points = useMemo(() => Array.from({ length: 25 }, (_, i) => {
        const x = i * 4 + 2;
        let y = x;

        if (dataset === 'noisy') {
            y = x + (Math.random() - 0.5) * 60;
        } else if (dataset === 'biased') {
            if (x > 50) y = 50 + (Math.random() - 0.5) * 10;
            else y = x + (Math.random() - 0.5) * 10;
        } else {
            y = x + (Math.random() - 0.5) * 5;
        }

        return { x, y: Math.max(5, Math.min(95, y)) };
    }), [dataset]);

    const currentDataset = DATASETS.find(d => d.type === dataset)!;

    // Chart dimensions
    const width = 400;
    const height = 280;
    const pad = 40;

    return (
        <div className="my-8 rounded-2xl shadow-neumorphic-out overflow-hidden border border-brand-primary/10">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent border-b border-brand-shadow-dark/20">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-lg shadow-md">
                        📈
                    </div>
                    <h4 className="font-bold text-lg text-brand-text">Data Quality Lab</h4>
                </div>
                <p className="text-brand-text-light text-sm ml-11">Feed the AI different "ingredients" to see how it changes the pattern it learns.</p>
            </div>

            <div className="p-5">
                {/* Dataset Selector */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {DATASETS.map(d => (
                        <button
                            key={d.type}
                            onClick={() => handleSetDataset(d.type)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${dataset === d.type
                                    ? `bg-gradient-to-br ${d.activeColor} shadow-neumorphic-in border border-${d.color}-500/20`
                                    : 'bg-brand-bg shadow-neumorphic-out hover:shadow-neumorphic-in border border-transparent'
                                }`}
                        >
                            <span>{d.icon}</span> {d.label}
                        </button>
                    ))}
                </div>

                {/* Chart */}
                <div className="relative bg-brand-bg rounded-xl shadow-neumorphic-in p-3 mb-4 flex justify-center">
                    <svg width={width} height={height} className="overflow-visible">
                        {/* Grid */}
                        {[0, 25, 50, 75, 100].map(v => (
                            <g key={`grid-${v}`}>
                                <line x1={pad} y1={height - pad - (v / 100) * (height - 2 * pad)} x2={width - pad} y2={height - pad - (v / 100) * (height - 2 * pad)} stroke="currentColor" strokeWidth="1" opacity="0.05" />
                                <text x={pad - 6} y={height - pad - (v / 100) * (height - 2 * pad) + 4} textAnchor="end" fontSize="9" fill="currentColor" opacity="0.25" fontFamily="monospace">{v}</text>
                            </g>
                        ))}

                        {/* Axes */}
                        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
                        <line x1={pad} y1={height - pad} x2={pad} y2={pad} stroke="currentColor" strokeWidth="1.5" opacity="0.15" />

                        <text x={width / 2} y={height - 5} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.35">Input Value</text>
                        <text x={12} y={height / 2} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.35" transform={`rotate(-90, 12, ${height / 2})`}>Output Value</text>

                        {/* Trend Lines */}
                        {dataset === 'clean' && (
                            <line
                                x1={pad} y1={height - pad} x2={width - pad} y2={pad}
                                stroke="#10b981" strokeWidth="2" opacity="0.4" strokeDasharray="6,4"
                            />
                        )}
                        {dataset === 'biased' && (
                            <path
                                d={`M${pad} ${height - pad} L${pad + (width - 2 * pad) * 0.5} ${pad + (height - 2 * pad) * 0.5} L${width - pad} ${pad + (height - 2 * pad) * 0.5}`}
                                fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.4" strokeDasharray="6,4"
                            />
                        )}

                        {/* Data Points */}
                        {points.map((p, i) => {
                            const cx = pad + (p.x / 100) * (width - 2 * pad);
                            const cy = height - pad - (p.y / 100) * (height - 2 * pad);
                            const color = dataset === 'clean' ? '#10b981' : dataset === 'noisy' ? '#f59e0b' : '#ef4444';
                            return (
                                <g key={i}>
                                    <circle cx={cx} cy={cy} r="7" fill={color} opacity="0.08" className="transition-all duration-500" />
                                    <circle cx={cx} cy={cy} r="4" fill={color} opacity="0.7" className="transition-all duration-500" />
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Description */}
                <div className={`p-4 rounded-xl bg-gradient-to-r ${currentDataset.activeColor} border border-brand-shadow-light/10`}>
                    <p className="text-brand-text text-sm leading-relaxed">
                        <span className="font-bold">{currentDataset.icon} {currentDataset.label}:</span> {currentDataset.description}
                    </p>
                </div>

                {/* Educational Note */}
                <div className="mt-3 p-3 rounded-lg border border-brand-primary/10 bg-brand-primary/5">
                    <p className="text-[11px] text-brand-text-light/60 leading-relaxed">
                        <span className="text-brand-primary font-bold">💡 Real-world impact:</span> Amazon discovered its hiring AI discriminated against women because it was trained on 10 years of resumes — mostly from men. The data was biased, so the AI learned bias.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DataVisualizer;
