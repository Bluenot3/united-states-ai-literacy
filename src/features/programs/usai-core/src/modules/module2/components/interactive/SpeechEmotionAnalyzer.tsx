
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const SpeechEmotionAnalyzer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [text, setText] = useState('I can\'t believe we actually won! This is incredible!');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!text.trim()) {
            setError('Please enter some text to analyze.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const apiPrompt = `You are a speech emotion analysis AI. Analyze the following text to predict the emotional content of the speech.
        
1.  Identify the primary emotion(s) (e.g., Joy, Surprise, Anger).
2.  Describe the likely vocal characteristics (pitch, volume, speed).
3.  Describe what a "living waveform sculpture" of this speech might look like (e.g., sharp peaks, gentle waves).

Text: "${text}"`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: apiPrompt });
            setResult(response.text);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate the analysis.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Speech Emotion Analyzer</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Enter a line of dialogue to get an AI-powered analysis of its emotional and vocal characteristics.</p>
            
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <input type="text" value={text} onChange={e => setText(e.target.value)} className="flex-grow w-full px-4 py-3 bg-brand-bg rounded-full shadow-neumorphic-in"/>
                <button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Analyzing...' : 'Analyze Speech'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || result) && (
                 <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">Emotion Analysis</h5>
                    {loading && <p className="animate-pulse">...</p>}
                    <pre className="text-brand-text-light whitespace-pre-wrap font-sans">{result}</pre>
                </div>
            )}
        </div>
    );
};

export default SpeechEmotionAnalyzer;
