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
                model: 'gemini-3-pro',
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
        <div className="my-8 p-8 bg-brand-bg rounded-3xl shadow-neumorphic-out border border-white/50 relative overflow-hidden group">
            {/* Soft tint background */}
            <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="tone" className="block text-sm font-bold text-brand-text mb-2 ml-1 uppercase tracking-wider opacity-70">Select Tone</label>
                        <div className="relative">
                            <select
                                id="tone"
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full p-4 bg-brand-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-brand-text shadow-neumorphic-in appearance-none cursor-pointer font-medium hover:bg-white/40 transition-colors"
                            >
                                <option>Formal</option>
                                <option>Friendly</option>
                                <option>Persuasive</option>
                                <option>Urgent</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-primary opacity-70">▼</div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="recipient" className="block text-sm font-bold text-brand-text mb-2 ml-1 uppercase tracking-wider opacity-70">Recipient</label>
                        <input
                            id="recipient"
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="e.g., The Hiring Manager"
                            className="w-full p-4 bg-brand-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-brand-text shadow-neumorphic-in placeholder:text-brand-text-light/40 transition-all duration-300"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="points" className="block text-sm font-bold text-brand-text mb-2 ml-1 uppercase tracking-wider opacity-70">Key Points (one per line)</label>
                    <textarea
                        id="points"
                        rows={4}
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        placeholder="e.g., Thank them for the opportunity\nConfirm my interest in the role\nAsk about next steps"
                        className="w-full p-4 bg-brand-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-brand-text shadow-neumorphic-in placeholder:text-brand-text-light/40 transition-all duration-300 min-h-[120px] resize-y"
                    />
                </div>
                <div className="text-center pt-2">
                    <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-neumorphic-out hover:shadow-lg hover:shadow-brand-primary/30 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                        <span className={loading ? "animate-spin" : ""}><SparklesIcon /></span>
                        {loading ? 'Generating...' : 'Generate Email'}
                    </button>
                </div>
            </form>

            {error && <p className="mt-6 text-center text-red-500 font-semibold bg-red-50 py-3 rounded-lg border border-red-100">{error}</p>}

            {(result || loading) && (
                <div className="mt-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-in border border-white/40">
                    <h4 className="font-bold text-lg text-brand-text mb-4 flex items-center justify-between">
                        <span>Generated Email</span>
                        {!hasCompleted && result && <span className="text-xs font-bold text-white bg-green-500 px-2 py-1 rounded-full shadow-lg shadow-green-500/30">+25 points!</span>}
                    </h4>
                    {loading ? (
                        <div className="space-y-3 animate-pulse">
                            <div className="h-2 bg-brand-shadow-dark/20 rounded w-3/4"></div>
                            <div className="h-2 bg-brand-shadow-dark/20 rounded w-full"></div>
                            <div className="h-2 bg-brand-shadow-dark/20 rounded w-11/12"></div>
                            <div className="h-2 bg-brand-shadow-dark/20 rounded w-1/2"></div>
                        </div>
                    ) : (
                        <div className="relative">
                            <pre className="whitespace-pre-wrap font-sans text-brand-text leading-relaxed text-sm opacity-90">{result}</pre>
                            <button
                                onClick={() => navigator.clipboard.writeText(result)}
                                className="absolute top-0 right-0 p-2 text-brand-text-light hover:text-brand-primary transition-colors"
                                title="Copy to clipboard"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfessionalEmailWriter;