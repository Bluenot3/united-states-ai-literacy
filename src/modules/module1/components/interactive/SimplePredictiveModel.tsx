
import React, { useState } from 'react';

// Data points for "Past Students"
const pastData = [
    { x: 1, y: 20 }, { x: 1.5, y: 30 },
    { x: 2, y: 25 }, { x: 3, y: 45 },
    { x: 4, y: 40 }, { x: 5, y: 60 },
    { x: 6, y: 55 }, { x: 7, y: 75 },
    { x: 8, y: 80 }, { x: 9, y: 85 },
];

const SimplePredictiveModel: React.FC = () => {
    const [hours, setHours] = useState(5);
    // Linear model: y = 8x + 15
    const predictedScore = Math.min(100, Math.round(8 * hours + 15));

    // Chart dimensions
    const width = 400;
    const height = 280;
    const padding = 45;

    // Scale functions
    const xScale = (h: number) => padding + (h / 10) * (width - 2 * padding);
    const yScale = (s: number) => height - padding - (s / 100) * (height - 2 * padding);

    const getScoreColor = () => {
        if (predictedScore >= 80) return { text: 'text-emerald-400', bg: 'from-emerald-500/20', label: 'Excellent 🌟' };
        if (predictedScore >= 60) return { text: 'text-blue-400', bg: 'from-blue-500/20', label: 'Good 👍' };
        if (predictedScore >= 40) return { text: 'text-amber-400', bg: 'from-amber-500/20', label: 'Fair 📚' };
        return { text: 'text-rose-400', bg: 'from-rose-500/20', label: 'Needs More Study 📖' };
    };

    const scoreInfo = getScoreColor();

    return (
        <div className="my-8 rounded-2xl shadow-neumorphic-out overflow-hidden border border-brand-primary/10">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent border-b border-brand-shadow-dark/20">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-lg shadow-md">
                        📊
                    </div>
                    <h4 className="font-bold text-lg text-brand-text">Prediction Engine: Student Success</h4>
                </div>
                <p className="text-brand-text-light text-sm ml-11">Drag the slider to see how the model predicts test scores from study hours.</p>
            </div>

            <div className="p-5">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    {/* Chart */}
                    <div className="relative bg-brand-bg rounded-xl shadow-neumorphic-in p-4 flex-shrink-0">
                        <svg width={width} height={height} className="overflow-visible">
                            {/* Grid lines */}
                            {[0, 25, 50, 75, 100].map(v => (
                                <g key={v}>
                                    <line
                                        x1={padding} y1={yScale(v)} x2={width - padding} y2={yScale(v)}
                                        stroke="currentColor" strokeWidth="1" opacity="0.06" strokeDasharray="4,4"
                                    />
                                    <text x={padding - 8} y={yScale(v) + 4} textAnchor="end" fontSize="10" fill="currentColor" opacity="0.3">{v}</text>
                                </g>
                            ))}
                            {[0, 2, 4, 6, 8, 10].map(v => (
                                <g key={v}>
                                    <line
                                        x1={xScale(v)} y1={padding} x2={xScale(v)} y2={height - padding}
                                        stroke="currentColor" strokeWidth="1" opacity="0.06" strokeDasharray="4,4"
                                    />
                                    <text x={xScale(v)} y={height - padding + 16} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.3">{v}h</text>
                                </g>
                            ))}

                            {/* Axes */}
                            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" strokeWidth="2" opacity="0.15" />
                            <line x1={padding} y1={height - padding} x2={padding} y2={padding} stroke="currentColor" strokeWidth="2" opacity="0.15" />

                            {/* Labels */}
                            <text x={width / 2} y={height - 5} textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.4" fontWeight="600">Hours Studied</text>
                            <text x={12} y={height / 2} textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.4" fontWeight="600" transform={`rotate(-90, 12, ${height / 2})`}>Test Score</text>

                            {/* Past Data Points with glow */}
                            {pastData.map((d, i) => (
                                <g key={i}>
                                    <circle cx={xScale(d.x)} cy={yScale(d.y)} r="8" fill="#3B82F6" opacity="0.08" />
                                    <circle cx={xScale(d.x)} cy={yScale(d.y)} r="5" fill="#3B82F6" opacity="0.7" className="transition-all duration-300" />
                                </g>
                            ))}

                            {/* The Model (Line of Best Fit) with gradient */}
                            <defs>
                                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.9" />
                                </linearGradient>
                            </defs>
                            <line
                                x1={xScale(0)} y1={yScale(15)}
                                x2={xScale(10)} y2={yScale(95)}
                                stroke="url(#lineGradient)"
                                strokeWidth="3"
                                strokeDasharray="8,4"
                            />

                            {/* Prediction crosshairs */}
                            <line x1={xScale(hours)} y1={height - padding} x2={xScale(hours)} y2={yScale(predictedScore)} stroke="#F97316" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.4" />
                            <line x1={padding} y1={yScale(predictedScore)} x2={xScale(hours)} y2={yScale(predictedScore)} stroke="#F97316" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.4" />

                            {/* Prediction point glow */}
                            <circle cx={xScale(hours)} cy={yScale(predictedScore)} r="16" fill="#F97316" opacity="0.1" className="animate-pulse" />
                            <circle cx={xScale(hours)} cy={yScale(predictedScore)} r="9" fill="#F97316" stroke="white" strokeWidth="3" className="drop-shadow-lg" />

                            {/* Score label on chart */}
                            <rect x={xScale(hours) + 12} y={yScale(predictedScore) - 14} width="38" height="22" rx="6" fill="#F97316" opacity="0.9" />
                            <text x={xScale(hours) + 31} y={yScale(predictedScore) + 1} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">{predictedScore}%</text>
                        </svg>

                        {/* Legend */}
                        <div className="flex justify-center gap-4 mt-3 text-[10px] font-mono text-brand-text-light/50">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Past Students</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-violet-500" /> Model Fit</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Your Prediction</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex-grow w-full max-w-sm">
                        <div className="bg-brand-bg p-5 rounded-xl shadow-neumorphic-in">
                            <label htmlFor="study-hours" className="block text-center font-semibold text-brand-text mb-4">
                                If a new student studies <span className="text-orange-500 text-2xl font-extrabold">{hours}</span> hours...
                            </label>

                            {/* Custom range slider */}
                            <div className="relative mb-2">
                                <input
                                    id="study-hours"
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="0.5"
                                    value={hours}
                                    onChange={(e) => setHours(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gradient-to-r from-rose-500/30 via-amber-500/30 to-emerald-500/30 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <div className="flex justify-between mt-1 text-[9px] font-mono text-brand-text-light/30">
                                    <span>0h</span>
                                    <span>5h</span>
                                    <span>10h</span>
                                </div>
                            </div>

                            {/* Score display */}
                            <div className={`mt-5 text-center p-4 rounded-xl bg-gradient-to-br ${scoreInfo.bg} to-transparent border border-brand-shadow-light/10`}>
                                <p className="text-brand-text-light text-xs mb-1 uppercase tracking-wider">Predicted Score</p>
                                <p className={`font-extrabold text-5xl ${scoreInfo.text} animate-float`}>{predictedScore}%</p>
                                <p className="text-brand-text-light/60 text-xs mt-1">{scoreInfo.label}</p>
                            </div>
                        </div>

                        {/* Fun fact */}
                        <div className="mt-4 p-3 rounded-lg border border-brand-primary/10 bg-brand-primary/5">
                            <p className="text-[11px] text-brand-text-light/60 leading-relaxed">
                                <span className="text-brand-primary font-bold">💡 How it works:</span> The model learned the equation <code className="text-[10px] bg-brand-bg px-1 rounded font-mono">score = 8 × hours + 15</code> by minimizing the distance between the line and all blue data points.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimplePredictiveModel;
