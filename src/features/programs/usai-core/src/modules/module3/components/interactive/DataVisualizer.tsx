import React, { useState, useMemo } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

type LabMode = 'collector' | 'cleaner' | 'visualizer';

// --- Data for Cleaner Mode ---
const initialDirtyData = [
    { id: 1, product: 'Laptop', score: 8, sales: 150 },
    { id: 2, product: 'Mouse', score: null, sales: 300 },
    { id: 3, product: 'Keyboard', score: 7, sales: 220 },
    { id: 4, product: 'Monitor', score: 9, sales: null },
];

// --- Data for Visualizer Mode ---
const vizData = [
    { category: 'Electronics', sales: 45000 },
    { category: 'Clothing', sales: 32000 },
    { category: 'Books', sales: 18000 },
    { category: 'Home Goods', sales: 25000 },
];

const DataScienceLab: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();

    const mode: LabMode = useMemo(() => {
        if (interactiveId === 'data-collector-sandbox-1') return 'collector';
        if (interactiveId === 'data-cleaner-widget-1') return 'cleaner';
        if (interactiveId === 'mini-data-visualizer-1') return 'visualizer';
        return 'collector';
    }, [interactiveId]);

    // --- State for Collector Mode ---
    const [csvData, setCsvData] = useState<{ headers: string[], rows: string[][] } | null>(null);
    const [fileError, setFileError] = useState('');

    // --- State for Cleaner Mode ---
    const [cleanerOptions, setCleanerOptions] = useState({ dropNulls: false, imputeMean: false });
    const cleanedData = useMemo(() => {
        let data = [...initialDirtyData];
        if (cleanerOptions.dropNulls) {
            data = data.filter(row => row.score !== null && row.sales !== null);
        }
        if (cleanerOptions.imputeMean) {
            const validScores = data.map(r => r.score).filter(s => s !== null) as number[];
            const meanScore = validScores.reduce((a, b) => a + b, 0) / validScores.length;
            const validSales = data.map(r => r.sales).filter(s => s !== null) as number[];
            const meanSales = validSales.reduce((a, b) => a + b, 0) / validSales.length;
            data = data.map(row => ({
                ...row,
                score: row.score === null ? Math.round(meanScore) : row.score,
                sales: row.sales === null ? Math.round(meanSales) : row.sales,
            }));
        }
        return data;
    }, [cleanerOptions]);
    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'text/csv') {
            setFileError('Please upload a valid .csv file.');
            return;
        }
        setFileError('');
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            const headers = lines[0].split(',');
            const rows = lines.slice(1).map(line => line.split(','));
            setCsvData({ headers, rows });
        };
        reader.readAsText(file);
    };

    const renderTable = (headers: string[], rows: (string | number | null)[][]) => (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-brand-bg shadow-neumorphic-out-sm">
                    <tr>{headers.map(h => <th key={h} className="p-2">{h}</th>)}</tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-b border-brand-shadow-dark/20">
                            {row.map((cell, j) => <td key={j} className="p-2">{cell === null ? <span className="text-red-500/80">NULL</span> : cell}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
    // --- RENDER LOGIC ---

    const renderCollector = () => (
        <>
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Data Collector Sandbox</h4>
            <div className="flex flex-col items-center justify-center p-4 bg-brand-bg rounded-lg shadow-neumorphic-in min-h-[150px]">
                <input type="file" accept=".csv" onChange={handleFileUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-bg file:text-brand-primary hover:file:bg-brand-bg file:shadow-neumorphic-out"/>
                {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
            </div>
            {csvData && (
                <div className="mt-4 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">CSV Preview ({csvData.rows.length} rows)</h5>
                    {renderTable(csvData.headers, csvData.rows)}
                </div>
            )}
        </>
    );

    const renderCleaner = () => (
        <>
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Data Cleaner Widget</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h5 className="font-semibold text-center text-brand-text mb-2">Before</h5>
                    {renderTable(Object.keys(initialDirtyData[0]), initialDirtyData.map(Object.values))}
                </div>
                 <div>
                    <h5 className="font-semibold text-center text-brand-text mb-2">After</h5>
                    {renderTable(Object.keys(cleanedData[0]), cleanedData.map(Object.values))}
                </div>
            </div>
            <div className="mt-4 p-3 bg-brand-bg rounded-lg shadow-neumorphic-in flex justify-center gap-4">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={cleanerOptions.dropNulls} onChange={e => setCleanerOptions(p => ({...p, dropNulls: e.target.checked}))} />
                    Drop Nulls
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={cleanerOptions.imputeMean} onChange={e => setCleanerOptions(p => ({...p, imputeMean: e.target.checked}))} />
                    Impute Mean
                </label>
            </div>
        </>
    );

    const renderVisualizer = () => {
        const maxSales = Math.max(...vizData.map(d => d.sales));
        return (
            <>
                <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Mini Data Visualizer</h4>
                <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <div className="h-64 flex items-end gap-4 border-b-2 border-l-2 border-brand-shadow-dark/50 pb-2 pl-2">
                        {vizData.map(item => (
                            <div key={item.category} className="flex-1 flex flex-col items-center gap-2">
                                <div 
                                    className="w-full bg-gradient-to-t from-brand-secondary to-brand-primary rounded-t-md transition-all duration-500"
                                    style={{ height: `${(item.sales / maxSales) * 100}%`}}
                                    title={`Sales: $${item.sales.toLocaleString()}`}
                                />
                                <span className="text-xs text-brand-text-light">{item.category}</span>
                            </div>
                        ))}
                    </div>
                     <p className="text-center text-brand-text-light font-bold mt-2">Sales by Category</p>
                </div>
            </>
        )
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            {mode === 'collector' && renderCollector()}
            {mode === 'cleaner' && renderCleaner()}
            {mode === 'visualizer' && renderVisualizer()}
        </div>
    );
};

export default DataScienceLab;
