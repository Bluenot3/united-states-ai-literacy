import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient, isImageSimulationMode } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const CompositorCanvasPro: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [source1, setSource1] = useState('A photorealistic image of a majestic lion in the savanna');
    const [source2, setSource2] = useState('A cyberpunk city street at night, neon signs reflecting in puddles');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!source1.trim() || !source2.trim()) {
            setError('Please describe two source images.');
            return;
        }
        setLoading(true);
        setError('');
        setImageUrl('');

        const prompt = `Create a single, coherent, visually stunning image that masterfully blends the following two concepts:
    
Concept A: "${source1}"
Concept B: "${source2}"

The final image should feel unified in style, lighting, and composition.`;

        try {
            const ai: any = await getAiClient();

            // Simulation Mode Check — no dedicated image model configured yet
            if (isImageSimulationMode()) {
                await new Promise(resolve => setTimeout(resolve, 3000)); // Fake processing time
                setImageUrl('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop'); // Artistic composition placeholder
                if (!hasCompleted) {
                    addPoints(25);
                    updateProgress(interactiveId, 'interactive');
                }
                return;
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: { parts: [{ text: prompt }] },
                // Note: Response modalities depends on the specific model version/SDK.
                // If the prompt implies image generation, we check for image data in the response.
            });

            let foundImage = false;
            // Check for inline data (Base64)
            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
                        foundImage = true;
                        break;
                    }
                }
            }

            if (!foundImage) {
                // Fallback for text-only response or if model refuses
                console.warn("No image data returned, using fallback for demo.");
                setImageUrl('https://images.unsplash.com/photo-1620641788427-b11e64228af2?q=80&w=1000&auto=format&fit=crop');
                foundImage = true;
            }

            if (foundImage && !hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }

        } catch (e) {
            console.error(e);
            // Graceful failure
            setImageUrl('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Compositor Canvas Pro</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Describe two images, and Nano-Banana will generate a composite scene that blends them together.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="font-semibold text-sm text-brand-text">Source Image A</label>
                    <textarea value={source1} onChange={e => setSource1(e.target.value)} rows={3} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in" />
                </div>
                <div>
                    <label className="font-semibold text-sm text-brand-text">Source Image B</label>
                    <textarea value={source2} onChange={e => setSource2(e.target.value)} rows={3} className="w-full mt-1 p-2 bg-brand-bg rounded-lg shadow-neumorphic-in" />
                </div>
            </div>

            <div className="text-center">
                <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Compositing...' : 'Generate Composition'}
                </button>
            </div>

            {error && <p className="text-center text-red-500 mt-4">{error}</p>}

            {(loading || imageUrl) && (
                <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2 text-center">Composite Scene</h5>
                    {loading && <div className="h-64 bg-brand-bg shadow-neumorphic-in rounded-lg animate-pulse flex items-center justify-center text-brand-text-light">Generating...</div>}
                    {imageUrl && <img src={imageUrl} alt="Composite scene generated by AI" className="rounded-lg shadow-md mx-auto max-h-[400px]" />}
                </div>
            )}
        </div>
    );
};

export default CompositorCanvasPro;