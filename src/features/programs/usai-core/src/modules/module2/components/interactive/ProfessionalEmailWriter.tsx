import React, { useState } from 'react';
import { SparklesIcon } from '../icons/SparklesIcon';
import { getAiClient } from '../../services/aiService';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const ProfessionalEmailWriter: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [tone, setTone] = useState('Formal');
    const [recipient, setRecipient] = useState('');
    const [points, setPoints] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!points.trim() || !recipient.trim()) {
            setError("Please fill in the recipient and key points.");
            return;
        }
        
        setLoading(true);
        setError(null);
        setResult('');

        const prompt = `You are a professional communication assistant. Write an email with a ${tone} tone to ${recipient}. The email should be clear, concise, and professional. Incorporate the following key points:\n\n- ${points.split('\n').join('\n- ')}`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt
            });
            setResult(response.text);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (err) {
            console.error("Error generating content:", err);
            const errorMessage = err instanceof Error ? err.message : "An error occurred while generating the email.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="tone" className="block text-sm font-semibold text-brand-text mb-2">Select Tone</label>
                        <select
                            id="tone"
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="w-full p-3 bg-brand-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
                        >
                            <option>Formal</option>
                            <option>Friendly</option>
                            <option>Persuasive</option>
                            <option>Urgent</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="recipient" className="block text-sm font-semibold text-brand-text mb-2">Recipient</label>
                        <input
                            id="recipient"
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="e.g., The Hiring Manager"
                            className="w-full p-3 bg-brand-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="points" className="block text-sm font-semibold text-brand-text mb-2">Key Points (one per line)</label>
                    <textarea
                        id="points"
                        rows={4}
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        placeholder="e.g., Thank them for the opportunity\nConfirm my interest in the role\nAsk about next steps"
                        className="w-full p-3 bg-brand-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
                    />
                </div>
                 <div className="text-center">
                    <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-neumorphic-out hover:shadow-neumorphic-in transform hover:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                        <SparklesIcon />
                        {loading ? 'Generating...' : 'Generate Email'}
                    </button>
                </div>
            </form>

            {error && <p className="mt-4 text-center text-red-500 font-semibold">{error}</p>}

            {(result || loading) && (
                 <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                     <h4 className="font-bold text-lg text-brand-text mb-2">Generated Email: {!hasCompleted && result && <span className="text-sm font-normal text-pale-green">(+25 points!)</span>}</h4>
                     {loading ? (
                        <div className="space-y-2 animate-pulse">
                            <div className="h-4 bg-brand-shadow-dark/50 rounded w-3/4"></div>
                            <div className="h-4 bg-brand-shadow-dark/50 rounded w-full"></div>
                            <div className="h-4 bg-brand-shadow-dark/50 rounded w-1/2"></div>
                        </div>
                     ) : (
                        <pre className="whitespace-pre-wrap font-sans text-brand-text-light">{result}</pre>
                     )}
                 </div>
            )}
        </div>
    );
};

export default ProfessionalEmailWriter;