import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';

const getEmotion = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('happy') || lower.includes('joy') || lower.includes('!')) return { emotion: 'Joy', score: 0.92 };
    if (lower.includes('sad') || lower.includes('crying')) return { emotion: 'Sadness', score: 0.88 };
    if (lower.includes('angry') || lower.includes('furious')) return { emotion: 'Anger', score: 0.95 };
    if (lower.includes('?')) return { emotion: 'Curiosity', score: 0.75 };
    return { emotion: 'Neutral', score: 0.65 };
};

const SpeechEmotionAnalyzer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [text, setText] = useState('This is a truly happy day!');
    const [result, setResult] = useState<{ emotion: string, score: number } | null>(null);
    const [loading, setLoading] = useState(false);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleAnalyze = () => {
        if (!text.trim()) return;
        setLoading(true);
        setResult(null);
        setTimeout(() => {
            setResult(getEmotion(text));
            setLoading(false);
            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        }, 1000);
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Speech Emotion Analyzer (Simulation)</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Enter a sentence to analyze its emotional content.</p>

            <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
                <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="flex-grow w-full px-4 py-3 bg-brand-bg rounded-full shadow-neumorphic-in"
                />
                <button onClick={handleAnalyze} disabled={loading} className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Analyzing...' : 'Analyze'}
                </button>
            </div>
            
            {(loading || result) && (
                <div className="mt-4 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in text-center">
                    {loading && <p className="animate-pulse">Analyzing emotion...</p>}
                    {result && (
                        <div>
                            <p className="text-brand-text-light">Dominant Emotion:</p>
                            <p className="text-3xl font-bold text-brand-primary">{result.emotion}</p>
                            <p className="text-sm font-semibold text-brand-text-light">Confidence: {(result.score * 100).toFixed(0)}%</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SpeechEmotionAnalyzer;
