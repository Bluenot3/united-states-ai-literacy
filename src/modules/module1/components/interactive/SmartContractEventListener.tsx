import React, { useState } from 'react';

interface Event {
    id: number;
    timestamp: string;
    message: string;
}

const SmartContractEventListener: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);

    const handleMint = () => {
        const now = new Date();
        const newEvent: Event = {
            id: Date.now(),
            timestamp: now.toLocaleTimeString(),
            message: `Event: 'Transfer', from: 0x0000...0000, to: 0xUser...Address, amount: 1 ZLT`
        };
        setEvents(prev => [newEvent, ...prev]);
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="text-center mb-6">
                <button 
                    onClick={handleMint}
                    className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-neumorphic-out hover:shadow-neumorphic-in transform hover:scale-95"
                >
                    Mint 1 ZLT Token
                </button>
            </div>
            
            <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                <h4 className="font-semibold text-brand-text mb-2">Live Event Log</h4>
                <div className="h-48 overflow-y-auto bg-slate-900 rounded-lg p-3 font-mono text-xs text-slate-300 space-y-2 liquid-scrollbar">
                    {events.length > 0 ? (
                        events.map(event => (
                            <div key={event.id} className="animate-fade-in">
                                <span className="text-pale-green mr-2">[{event.timestamp}]</span>
                                <span>{event.message}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500">Awaiting events...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartContractEventListener;
