
import React, { useState, useEffect, useRef } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const generateArray = () => Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);

const AlgorithmVisualizer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const [array, setArray] = useState(generateArray);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [compareIndex, setCompareIndex] = useState<number | null>(null);
    const [isSorting, setIsSorting] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    const [log, setLog] = useState<string>('System Ready. Waiting for logic execution...');
    const { user, addPoints, updateProgress } = useAuth();
    
    const intervalRef = useRef<number | null>(null);

    const stopSorting = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsSorting(false);
        setCurrentIndex(null);
        setCompareIndex(null);
    };

    const bubbleSortStep = (arr: number[], i: number, j: number) => {
        // Logic Step
        const a = arr[j];
        const b = arr[j + 1];
        
        setLog(`RULE: IF (${a} > ${b}) THEN SWAP.`);
        setCurrentIndex(j);
        setCompareIndex(j + 1);

        if (a > b) {
            arr[j] = b;
            arr[j + 1] = a;
            setArray([...arr]);
        }
    };

    const startSort = () => {
        if (isSorting) return;
        setIsSorting(true);
        setIsSorted(false);
        setArray(generateArray()); // Reset to new random
        
        let i = 0;
        let j = 0;
        const localArray = generateArray();
        setArray([...localArray]);

        intervalRef.current = window.setInterval(() => {
            if (i < localArray.length) {
                if (j < localArray.length - i - 1) {
                    bubbleSortStep(localArray, i, j);
                    j++;
                } else {
                    j = 0;
                    i++;
                }
            } else {
                stopSorting();
                setIsSorted(true);
                setLog("LOGIC COMPLETE. TERMINATING SEQUENCE.");
                if (user && !user.progress.completedInteractives.includes(interactiveId)) {
                    addPoints(15);
                    updateProgress(interactiveId, 'interactive');
                }
            }
        }, 300);
    };

    useEffect(() => {
        return () => stopSorting();
    }, []);

    return (
        <div className="my-8 p-6 bg-slate-900 rounded-2xl shadow-neumorphic-out border border-slate-700 font-mono text-white">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                <h4 className="font-bold text-lg text-green-400">Symbolic Logic Engine</h4>
                <div className="text-xs text-slate-500">MODE: STRICT_RULES</div>
            </div>

            <div className="flex justify-center items-end gap-2 h-40 mb-6 bg-slate-800/50 rounded-lg p-4 relative">
                {array.map((val, idx) => (
                    <div 
                        key={idx}
                        className={`w-8 rounded-t transition-all duration-200 flex items-end justify-center text-[10px] pb-1
                            ${isSorted ? 'bg-green-500' : 
                              idx === currentIndex ? 'bg-yellow-400 text-slate-900 font-bold' : 
                              idx === compareIndex ? 'bg-blue-400 text-slate-900 font-bold' : 'bg-slate-600'}
                        `}
                        style={{ height: `${val}%` }}
                    >
                        {val}
                    </div>
                ))}
            </div>

            <div className="bg-black/40 p-3 rounded-lg border border-slate-700 mb-6 h-12 flex items-center">
                <span className="text-green-500 mr-2">{'>'}</span>
                <span className="text-sm text-slate-300 animate-pulse">{log}</span>
            </div>

            <div className="flex justify-center gap-4">
                <button 
                    onClick={startSort} 
                    disabled={isSorting}
                    className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold uppercase tracking-wider text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSorting ? 'Executing Logic...' : 'Run Algorithm'}
                </button>
            </div>
            <p className="text-center text-xs text-slate-500 mt-4">
                Symbolic AI follows explicit, step-by-step rules. It is precise but rigid.
            </p>
        </div>
    );
};

export default AlgorithmVisualizer;
