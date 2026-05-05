
import React, { useState, useEffect, useRef } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const LOG_STEPS = [
    { time: '14:02:01', system: 'GATEWAY', msg: 'Request received from user_id: 4421', status: 'OK' },
    { time: '14:02:02', system: 'POLICY_ENG', msg: 'Retrieving context: "Travel_Policy_v2.pdf"', status: 'OK' },
    { time: '14:02:02', system: 'VECTOR_DB', msg: 'Found relevant section: §4.2 "Flight Upgrades"', status: 'MATCH' },
    { time: '14:02:03', system: 'REASONING', msg: 'Analyzing: Cost ($800) < Limit ($1000). Route matches project code.', status: 'OK' },
    { time: '14:02:04', system: 'DECISION', msg: 'Outcome: APPROVED', status: 'SUCCESS' },
    { time: '14:02:04', system: 'NOTIFY', msg: 'Email sent to manager & user.', status: 'SENT' }
];

const DecisionAuditLog: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [stepIndex, setStepIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isPlaying && stepIndex < LOG_STEPS.length - 1) {
            const timer = setTimeout(() => {
                setStepIndex(prev => prev + 1);
            }, 800);
            return () => clearTimeout(timer);
        } else if (stepIndex >= LOG_STEPS.length - 1) {
            setIsPlaying(false);
            if (user && !user.progress.completedInteractives.includes(interactiveId)) {
                addPoints(10);
                updateProgress(interactiveId, 'interactive');
            }
        }
    }, [isPlaying, stepIndex, user, addPoints, updateProgress, interactiveId]);

    useEffect(() => {
        if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [stepIndex]);

    const handleReplay = () => {
        setStepIndex(-1);
        setIsPlaying(true);
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg text-brand-text">Decision Audit Explorer</h4>
                <button 
                    onClick={handleReplay} 
                    disabled={isPlaying}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold shadow-md hover:bg-brand-primary/90 disabled:opacity-50 transition-all"
                >
                    {isPlaying ? 'Replaying...' : '▶ Replay Decision #9942'}
                </button>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-700 h-64 overflow-hidden relative font-mono text-xs">
                {/* Header Row */}
                <div className="bg-slate-800 p-2 grid grid-cols-12 text-slate-400 font-bold border-b border-slate-700">
                    <div className="col-span-2">Time</div>
                    <div className="col-span-2">System</div>
                    <div className="col-span-6">Message</div>
                    <div className="col-span-2 text-right">Status</div>
                </div>

                {/* Log Rows */}
                <div className="overflow-y-auto h-full pb-8" ref={scrollRef}>
                    {stepIndex === -1 && !isPlaying && (
                        <div className="flex items-center justify-center h-full text-slate-600 italic">
                            System Idle. Click Replay to view audit trace.
                        </div>
                    )}
                    {LOG_STEPS.map((step, i) => (
                        <div 
                            key={i} 
                            className={`grid grid-cols-12 p-2 border-b border-slate-800 transition-all duration-300 ${i <= stepIndex ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                        >
                            <div className="col-span-2 text-slate-500">{step.time}</div>
                            <div className="col-span-2 text-blue-400 font-bold">{step.system}</div>
                            <div className="col-span-6 text-slate-300 truncate" title={step.msg}>{step.msg}</div>
                            <div className={`col-span-2 text-right font-bold ${step.status === 'SUCCESS' || step.status === 'SENT' ? 'text-green-500' : step.status === 'MATCH' ? 'text-purple-400' : 'text-slate-400'}`}>
                                {step.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DecisionAuditLog;
