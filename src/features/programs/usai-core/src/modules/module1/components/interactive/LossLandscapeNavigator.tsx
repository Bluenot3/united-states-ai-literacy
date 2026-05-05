
import React, { useState, useEffect, useRef } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const LossLandscapeNavigator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [robotX, setRobotX] = useState(10); // 0 to 100
    const [isAuto, setIsAuto] = useState(false);
    const [message, setMessage] = useState("Help the robot find the bottom of the valley (0 Error)!");
    const [isScanning, setIsScanning] = useState(false);
    const lastX = useRef(robotX);

    // Simple valley function: y = (x - 50)^2 / 25
    // Global minimum at x=50.
    const getError = (x: number) => Math.round(Math.pow(x - 50, 2) / 25);
    const getSlope = (x: number) => (2 * (x - 50)) / 25; // Derivative

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const step = () => {
        setRobotX(prev => {
            lastX.current = prev;
            const slope = getSlope(prev);
            const learningRate = 5; // Fixed step size for simplicity

            // Basic Gradient Descent: x_new = x_old - (learning_rate * slope)
            let nextX = prev - (learningRate * (slope > 0 ? 1 : -1));

            // Add some "momentum" or noise to make it feel organic, but clamp to 0-100
            nextX = Math.max(0, Math.min(100, nextX));

            if (Math.abs(nextX - 50) < 2) {
                setIsAuto(false);
                setMessage("🎉 Perfect! Zero Error achieved.");
                if (!hasCompleted) {
                    addPoints(1, 25);
                    updateModuleProgress(1, interactiveId, 'interactive');
                }
                return 50; // Snap to center
            }
            return nextX;
        });
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 300);
    };

    useEffect(() => {
        let interval: any;
        if (isAuto) {
            interval = setInterval(step, 200);
        }
        return () => clearInterval(interval);
    }, [isAuto, hasCompleted, interactiveId, addPoints, updateModuleProgress]);

    const handleReset = () => {
        setIsAuto(false);
        setRobotX(Math.random() < 0.5 ? 10 : 90); // Random side start
        setMessage("Robot reset. Initialize descent.");
        lastX.current = robotX;
    };

    const currentError = getError(robotX);
    const isMovingRight = robotX > lastX.current;

    return (
        <div className="my-8 p-1 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl shadow-xl border border-white">
            <div className="relative bg-brand-bg rounded-[1.3rem] overflow-hidden">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-white/90 to-transparent flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-lg text-brand-text flex items-center gap-2">
                            <span className="text-2xl">📉</span>
                            Training: Gradient Descent
                        </h4>
                        <p className="text-xs text-brand-text-light font-medium max-w-xs mt-1">
                            The "Blind Hiker" needs to find the valley floor (min error) using only slope.
                        </p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className={`px-4 py-2 rounded-xl backdrop-blur-md border shadow-sm transition-all duration-300 ${currentError === 0
                                ? 'bg-green-500/10 border-green-500/30 text-green-600'
                                : 'bg-white/80 border-slate-200 text-slate-600'
                            }`}>
                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Error Rate</span>
                            <div className="text-2xl font-mono font-bold leading-none">{currentError}</div>
                        </div>
                    </div>
                </div>

                {/* VISUALIZATION AREA */}
                <div className="relative w-full h-[320px] bg-gradient-to-b from-sky-400 via-sky-200 to-white overflow-hidden">

                    {/* Background Grid - "Matrix" style */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.5) 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                            transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)'
                        }}
                    />

                    {/* Background Mountains (Parallax-ish) */}
                    <svg className="absolute bottom-0 left-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,80 L20,60 L40,85 L60,50 L80,70 L100,60 L100,100 L0,100 Z" fill="#94a3b8" />
                        <path d="M-10,90 L30,50 L70,95 L110,60 L110,100 L-10,100 Z" fill="#64748b" opacity="0.5" />
                    </svg>

                    {/* The Main Loss Curve */}
                    <svg className="absolute bottom-0 left-0 w-full h-full drop-shadow-xl" preserveAspectRatio="none" viewBox="0 0 100 100">
                        {/* Gradient Definition */}
                        <defs>
                            <linearGradient id="valleyGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#475569" />
                                <stop offset="100%" stopColor="#1e293b" />
                            </linearGradient>
                            <linearGradient id="strokeGradient" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="50%" stopColor="#22c55e" />
                                <stop offset="100%" stopColor="#ef4444" />
                            </linearGradient>
                        </defs>

                        {/* The Fill */}
                        <path
                            d="M0,0 L0,100 L100,100 L100,0 Q50,150 0,0"
                            fill="url(#valleyGradient)"
                            className="opacity-90"
                        />

                        {/* The Top Edge Line */}
                        <path
                            d="M0,0 Q50,150 100,0"
                            fill="none"
                            stroke="url(#strokeGradient)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                        />

                        {/* Grid Lines on the surface for 3D effect */}
                        <path d="M20,20 Q55,140 90,20" fill="none" stroke="white" strokeWidth="0.2" opacity="0.3" />
                        <path d="M10,10 Q52,145 95,10" fill="none" stroke="white" strokeWidth="0.2" opacity="0.2" />
                        <path d="M30,30 Q58,135 85,30" fill="none" stroke="white" strokeWidth="0.2" opacity="0.1" />
                    </svg>

                    {/* Target Marker at Minimal Loss (Center) */}
                    <div className="absolute left-1/2 bottom-[15%] -translate-x-1/2 flex flex-col items-center">
                        <div className="w-1 h-8 bg-green-500/50 rounded-full blur-[2px]" />
                        <div className="w-12 h-2 bg-green-500/30 rounded-[100%] blur-md" />
                    </div>

                    {/* The Robot Character */}
                    <div
                        className="absolute bottom-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col items-center z-20 group"
                        style={{
                            left: `${robotX}%`,
                            transform: `translateX(-50%) translateY(-${100 - (currentError / 100 * 75 + 15)}%)`
                        }}
                    >
                        {/* Chat Bubble / Thought */}
                        <div className={`absolute -top-12 opacity-0 transition-all duration-300 ${isScanning ? 'opacity-100 -top-14 scale-110' : ''} ${currentError === 0 ? 'opacity-100 -top-16 scale-125' : ''}`}>
                            <div className="bg-white px-3 py-1.5 rounded-2xl rounded-bl-none shadow-lg text-xs font-bold whitespace-nowrap">
                                {currentError === 0 ? "🎯 Optimized!" : isScanning ? "Scanning..." : "Thinking..."}
                            </div>
                        </div>

                        {/* Robot Body Construction */}
                        <div className={`relative w-16 h-16 transition-transform duration-300 ${isMovingRight ? '' : '-scale-x-100'}`}>
                            {/* Glow Aura */}
                            <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-xl animate-pulse" />

                            {/* Body */}
                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                                {/* Legs/Wheel */}
                                <circle cx="50" cy="85" r="12" fill="#334155" />
                                <circle cx="50" cy="85" r="8" fill="#94a3b8" className={isScanning ? 'animate-spin' : ''} />

                                {/* Main Chassis */}
                                <rect x="25" y="30" width="50" height="45" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="2" />

                                {/* Screen/Face */}
                                <rect x="32" y="38" width="36" height="24" rx="4" fill="#1e293b" />

                                {/* Eyes - Animated */}
                                {currentError === 0 ? (
                                    // Happy Eyes
                                    <g stroke="#22c55e" strokeWidth="3" fill="none">
                                        <path d="M38,50 Q42,46 46,50" />
                                        <path d="M54,50 Q58,46 62,50" />
                                    </g>
                                ) : (
                                    // Regular Eyes
                                    <g fill={isScanning ? '#ef4444' : '#38bdf8'} className="transition-colors duration-300">
                                        <circle cx="40" cy="50" r="3" className="animate-blink" />
                                        <circle cx="60" cy="50" r="3" className="animate-blink animation-delay-500" />
                                    </g>
                                )}

                                {/* Antenna */}
                                <line x1="50" y1="30" x2="50" y2="15" stroke="#cbd5e1" strokeWidth="2" />
                                <circle cx="50" cy="15" r="4" fill={isScanning ? '#ef4444' : '#38bdf8'} className={`transition-colors duration-200 ${isScanning ? 'animate-ping' : ''}`} />
                            </svg>
                        </div>

                        {/* Shadow Projection */}
                        <div className="w-10 h-2 bg-black/20 rounded-[100%] blur-sm mt-[-5px]" />
                    </div>
                </div>

                {/* CONTROLS AREA */}
                <div className="p-6 bg-white relative z-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

                        {/* Status Message */}
                        <div className="flex-1 text-center sm:text-left">
                            <h5 className="font-bold text-slate-700 text-sm mb-1 uppercase tracking-wider">System Status</h5>
                            <p className={`font-medium transition-colors duration-300 ${currentError === 0 ? 'text-green-600' : 'text-slate-500'}`}>
                                {message}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={step}
                                disabled={isAuto || currentError === 0}
                                className="group relative px-6 py-3 rounded-xl bg-white border-2 border-slate-100 shadow-sm hover:border-brand-primary/30 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                            >
                                <span className="relative z-10 font-bold text-slate-700 group-hover:text-brand-primary flex items-center gap-2">
                                    <span>👣</span> One Step
                                </span>
                                <div className="absolute inset-0 bg-brand-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>

                            <button
                                onClick={() => setIsAuto(!isAuto)}
                                disabled={currentError === 0}
                                className={`relative px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all font-bold text-white overflow-hidden
                                    ${isAuto ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gradient-to-r from-brand-primary to-violet-600'}
                                `}
                            >
                                <div className="flex items-center gap-2">
                                    {isAuto ? (
                                        <>
                                            <span className="animate-pulse">⏸</span> <span>Pause</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>⚡</span> <span>Auto-Descend</span>
                                        </>
                                    )}
                                </div>
                                {/* Shine effect */}
                                {!isAuto && (
                                    <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-[-20deg] animate-shimmer" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brand-primary transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset Simulation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LossLandscapeNavigator;
