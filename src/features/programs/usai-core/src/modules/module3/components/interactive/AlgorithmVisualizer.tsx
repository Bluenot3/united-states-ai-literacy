import React, { useState, useMemo } from 'react';

const generateData = () => Array.from({ length: 50 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 80 + 10,
}));

// Add some outliers
const initialData = generateData();
initialData.push({ x: 10, y: 98 });
initialData.push({ x: 90, y: 2 });
initialData.push({ x: 50, y: 0 });


const OutlierDetector: React.FC = () => {
    const [data, setData] = useState(initialData);
    const [threshold, setThreshold] = useState(1.5);

    const { q1, q3, iqr } = useMemo(() => {
        const sortedY = [...data].map(d => d.y).sort((a, b) => a - b);
        const mid = Math.floor(sortedY.length / 2);
        const q1 = sortedY[Math.floor(mid / 2)];
        const q3 = sortedY[Math.floor(sortedY.length - mid / 2)];
        const iqr = q3 - q1;
        return { q1, q3, iqr };
    }, [data]);

    const lowerBound = q1 - threshold * iqr;
    const upperBound = q3 + threshold * iqr;

    const handleReset = () => {
        const newData = generateData();
        newData.push({ x: 10 + Math.random() * 10, y: 95 + Math.random() * 5 });
        newData.push({ x: 80 + Math.random() * 10, y: 5 - Math.random() * 5 });
        setData(newData);
    }

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Outlier Detector (IQR Method)</h4>
            <div className="w-full h-72 bg-brand-bg p-2 rounded-lg shadow-neumorphic-in relative">
                {data.map((point, index) => {
                    const isOutlier = point.y < lowerBound || point.y > upperBound;
                    return (
                        <div
                            key={index}
                            className={`absolute w-3 h-3 rounded-full transition-all duration-300 ${isOutlier ? 'bg-red-500' : 'bg-brand-primary'}`}
                            style={{
                                left: `${point.x}%`,
                                bottom: `${point.y}%`,
                                transform: `scale(${isOutlier ? 1.5 : 1})`
                            }}
                            title={`(${Math.round(point.x)}, ${Math.round(point.y)})${isOutlier ? ' - Outlier' : ''}`}
                        ></div>
                    );
                })}
            </div>
            <div className="mt-6">
                 <label htmlFor="iqr-threshold" className="block text-center text-brand-text-light mb-2">IQR Threshold Multiplier: <span className="font-bold text-brand-text">{threshold.toFixed(1)}</span></label>
                 <input
                    id="iqr-threshold"
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={threshold}
                    onChange={(e) => setThreshold(parseFloat(e.target.value))}
                    className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in"
                />
            </div>
            <div className="text-center mt-4">
                <button onClick={handleReset} className="px-6 py-2 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in text-sm">
                    New Data
                </button>
            </div>
        </div>
    );
};

export default OutlierDetector;