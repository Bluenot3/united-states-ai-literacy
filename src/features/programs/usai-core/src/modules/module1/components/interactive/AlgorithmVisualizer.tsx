import React, { useState, useEffect, useRef } from 'react';

const generateArray = () => Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);

const AlgorithmVisualizer: React.FC = () => {
    const [array, setArray] = useState(generateArray);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [passIndex, setPassIndex] = useState(0);
    const [isSorting, setIsSorting] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    
    const intervalRef = useRef<number | null>(null);

    const stopSorting = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsSorting(false);
    };

    const bubbleSortStep = () => {
        setArray(prevArray => {
            const newArray = [...prevArray];
            if (passIndex < newArray.length - 1) {
                if (currentIndex < newArray.length - passIndex - 1) {
                    if (newArray[currentIndex] > newArray[currentIndex + 1]) {
                        [newArray[currentIndex], newArray[currentIndex + 1]] = [newArray[currentIndex + 1], newArray[currentIndex]];
                    }
                    setCurrentIndex(prev => prev + 1);
                } else {
                    setCurrentIndex(0);
                    setPassIndex(prev => prev + 1);
                }
            } else {
                stopSorting();
                setIsSorted(true);
            }
            return newArray;
        });
    };

    const handleStart = () => {
        if(isSorted) handleReset();
        setIsSorting(true);
        intervalRef.current = window.setInterval(bubbleSortStep, 300);
    };

    const handleReset = () => {
        stopSorting();
        setArray(generateArray());
        setCurrentIndex(0);
        setPassIndex(0);
        setIsSorted(false);
    };
    
    useEffect(() => {
        return () => stopSorting(); // Cleanup on unmount
    }, []);

    const maxValue = 100;

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Bubble Sort Visualizer</h4>
            <div className="w-full h-64 bg-brand-bg p-4 rounded-lg shadow-neumorphic-in flex justify-around items-end gap-1">
                {array.map((value, index) => (
                    <div
                        key={index}
                        className="flex-1 rounded-t-md transition-all duration-200 ease-in-out"
                        style={{
                            height: `${(value / maxValue) * 100}%`,
                            backgroundColor: isSorted ? '#22c55e' : (isSorting && (index === currentIndex || index === currentIndex + 1)) ? '#8b5cf6' : '#c4b5fd'
                        }}
                    ></div>
                ))}
            </div>
            <div className="flex justify-center gap-4 mt-6">
                <button onClick={handleStart} disabled={isSorting} className="px-6 py-2 rounded-lg shadow-neumorphic-out disabled:opacity-50 hover:shadow-neumorphic-in">
                    {isSorting ? 'Sorting...' : isSorted ? 'Start Again' : 'Start Sort'}
                </button>
                <button onClick={handleReset} className="px-6 py-2 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">
                    Reset
                </button>
            </div>
        </div>
    );
};

export default AlgorithmVisualizer;