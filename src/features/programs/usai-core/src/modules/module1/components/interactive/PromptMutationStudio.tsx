
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Type } from '@google/genai';

const PromptMutationStudio: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [seed, setSeed] = useState('A bicycle');
    const [mutations, setMutations] = useState<{title: string, desc: string}[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleEvolve = async () => {
        if (!seed.trim()) {
            setError('Plant a seed idea first.');
            return;
        }
        setLoading(true);
        setError('');
        setMutations([]);

        const prompt = `You are a creative evolution engine. Take the user's simple seed idea and evolve it into 3 distinct, complex, and creative variations.
        For each variation, provide a short "title" and a 1-sentence "desc" (description).
        
        Seed: "${seed}"`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                desc: { type: Type.STRING }
                            },
                            required: ['title', 'desc']
                        }
                    }
                }
            });
            
            const data = JSON.parse(response.text);
            setMutations(data);

            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Evolution failed. Try a different seed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out relative overflow-hidden">
            {/* Background Tree Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent -z-10"></div>

            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Idea Evolution Lab</h4>
            <p className="text-center text-brand-text-light mb-8 text-sm">Plant a simple seed. Watch it grow into a forest of ideas.</p>
            
            {/* Seed Input */}
            <div className="max-w-md mx-auto relative z-10">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={seed}
                        onChange={e => setSeed(e.target.value)}
                        placeholder="e.g. A coffee cup"
                        className="flex-grow px-4 py-3 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-md text-center"
                    />
                    <button 
                        onClick={handleEvolve} 
                        disabled={loading} 
                        className="bg-brand-primary text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                    >
                        <SparklesIcon />
                    </button>
                </div>
            </div>
            
            {error && <p className="text-center text-red-500 mt-4 bg-white/50 inline-block px-4 py-1 rounded-full mx-auto">{error}</p>}
            
            {/* Branches */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 min-h-[200px]">
                {loading && (
                    <>
                        <div className="animate-pulse bg-white/50 h-32 rounded-xl shadow-sm"></div>
                        <div className="animate-pulse bg-white/50 h-32 rounded-xl shadow-sm delay-100"></div>
                        <div className="animate-pulse bg-white/50 h-32 rounded-xl shadow-sm delay-200"></div>
                    </>
                )}
                
                {mutations.map((m, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl shadow-neumorphic-in border-t-4 border-brand-primary animate-slide-in-up" style={{animationDelay: `${i * 150}ms`}}>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-brand-primary/30"></div>
                        <h5 className="font-bold text-brand-primary mb-2 text-lg">{m.title}</h5>
                        <p className="text-sm text-brand-text-light leading-relaxed">{m.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PromptMutationStudio;
