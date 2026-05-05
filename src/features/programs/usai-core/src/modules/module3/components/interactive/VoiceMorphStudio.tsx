
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const personas = ['Wise Old Narrator', 'Excited Child', 'Cynical Robot', 'Soothing Meditation Guide'];

const VoiceMorphStudio: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [text, setText] = useState('To be, or not to be, that is the question.');
    const [persona, setPersona] = useState(personas[0]);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!text.trim()) {
            setError('Please enter some text to synthesize.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const apiPrompt = `You are a voice synthesis AI. A user wants to hear a line of text spoken in a specific persona. Since you can't generate audio, instead describe the voice in detail. 
        
Describe its pitch, cadence, tone, and any notable characteristics.

Text: "${text}"
Persona: "${persona}"`;

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
            setError('Failed to generate the voice description.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Voice Morph Studio</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Choose a persona to "hear" your text in a new voice (described by AI).</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                    <label className="font-semibold text-sm text-brand-text">Text to Synthesize</label>
                    <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full mt-1 p-3 bg-brand-bg rounded-lg shadow-neumorphic-in"/>
                </div>
                 <div>
                    <label className="font-semibold text-sm text-brand-text">Voice Persona</label>
                    <select value={persona} onChange={e => setPersona(e.target.value)} className="w-full mt-1 p-3 bg-brand-bg rounded-lg shadow-neumorphic-in">
                        {personas.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>
            
            <div className="text-center">
                 <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Synthesizing...' : 'Generate Voice'}
                </button>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            
            {(loading || result) && (
                 <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">Voice Description</h5>
                    {loading && <p className="animate-pulse">...</p>}
                    <p className="text-brand-text-light">{result}</p>
                </div>
            )}
        </div>
    );
};

export default VoiceMorphStudio;
