import React, { useState } from 'react';

interface Hotspot {
    id: number;
    x: number; // %
    y: number; // %
    feedback: string;
}

const hotspots: Hotspot[] = [
    { id: 1, x: 50, y: 15, feedback: "Good! Low contrast text (light gray on white) is hard to read and fails accessibility standards." },
    { id: 2, x: 25, y: 80, feedback: "Correct! This 'Cancel' button's red color is too aggressive and competes with the primary action." },
    { id: 3, x: 75, y: 80, feedback: "Right! This 'Submit' button is too small, making it a difficult touch target on mobile devices." },
];

const UiFeedback: React.FC = () => {
    const [found, setFound] = useState<number[]>([]);
    const [message, setMessage] = useState('Click on the UI elements that have design flaws.');

    const handleClick = (hotspot: Hotspot) => {
        if(found.includes(hotspot.id)) return;
        setFound([...found, hotspot.id]);
        setMessage(hotspot.feedback);
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
                        <p style={{color: '#cccccc'}}>Create an account to continue</p>
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
                 <p className="text-center mt-4 text-brand-text-light font-semibold min-h-[40px]">{message}</p>
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
