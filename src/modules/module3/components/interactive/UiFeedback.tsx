import React, { useState } from 'react';
import { getAiClient } from '../../services/aiService';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface Hotspot {
    id: number;
    x: number; // %
    y: number; // %
    name: string;
}

const hotspots: Hotspot[] = [
    { id: 1, x: 50, y: 15, name: "Low Contrast Text" },
    { id: 2, x: 25, y: 80, name: "Aggressive Color on Secondary Action" },
    { id: 3, x: 75, y: 80, name: "Poor Touch Target Size" },
];

const UiFeedback: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [found, setFound] = useState<number[]>([]);
    const [message, setMessage] = useState('Click on the UI elements that have design flaws.');
    const [loading, setLoading] = useState(false);
    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleClick = async (hotspot: Hotspot) => {
        if(found.includes(hotspot.id) || loading) return;
        
        setLoading(true);
        setMessage('');

        const prompt = `You are a UI/UX design expert. Explain the design flaw "${hotspot.name}" to a beginner. Briefly describe why it's a problem and suggest a simple fix.`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setFound([...found, hotspot.id]);
            setMessage(response.text);
            if (!hasCompleted && found.length + 1 === hotspots.length) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setMessage("Error getting explanation. This is a bad design because it's hard to use!");
        } finally {
            setLoading(false);
        }
    }
    
    const handleReset = () => {
        setFound([]);
        setMessage('Click on the UI elements that have design flaws.');
    }

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="max-w-md mx-auto">
                 <div className="relative w-full aspect-[9/16] bg-white rounded-lg shadow-neumorphic-in p-4 overflow-hidden">
                    {/* Mock UI Content */}
                    <div className="text-center">
                        <h1 className="text-xl font-bold text-gray-800">Sign Up</h1>
                        <p style={{color: '#bbbbbb'}}>Create an account to continue</p>
                    </div>
                    <div className="mt-8 space-y-4">
                        <input type="text" placeholder="Email" className="w-full p-2 border border-gray-300 rounded" />
                        <input type="password" placeholder="Password" className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                         <button className="px-8 py-2 bg-red-500 text-white rounded">Cancel</button>
                         <button className="px-3 py-1 bg-blue-500 text-white rounded">Submit</button>
                    </div>

                    {/* Hotspots */}
                    {hotspots.map(spot => (
                        <button 
                            key={spot.id} 
                            onClick={() => handleClick(spot)}
                            className={`absolute w-12 h-12 rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity
                                ${found.includes(spot.id) ? 'bg-pale-green/50 border-2 border-pale-green' : 'bg-transparent'}`
                            }
                            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                            aria-label={`Design flaw area ${spot.id}`}
                        />
                    ))}
                 </div>
                 <div className="text-center mt-4 text-brand-text-light font-semibold min-h-[60px] p-2 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    {loading ? <p className="animate-pulse">Analyzing flaw...</p> : <p>{message}</p>}
                 </div>
                 {found.length === hotspots.length && (
                    <div className="text-center mt-2">
                        <button onClick={handleReset} className="px-4 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Reset</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UiFeedback;