import React, { useState } from 'react';

const PandaIcon: React.FC = () => (
    <span className="text-6xl" role="img" aria-label="panda">🐼</span>
);
const GibbonIcon: React.FC = () => (
    <span className="text-6xl" role="img" aria-label="gibbon">🐒</span>
);

const AdversarialAttackSimulator: React.FC = () => {
    const [isAttacked, setIsAttacked] = useState(false);
    
    const original = {
        label: "Panda",
        confidence: 98.2,
        icon: <PandaIcon />
    };
    
    const attacked = {
        label: "Gibbon",
        confidence: 99.7,
        icon: <GibbonIcon />
    };

    const current = isAttacked ? attacked : original;

    const handleAttack = () => {
        setIsAttacked(true);
    };
    
    const handleReset = () => {
        setIsAttacked(false);
    }

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                
                {/* Image Panel */}
                <div className="relative w-48 h-48 bg-brand-bg rounded-lg shadow-neumorphic-in flex items-center justify-center overflow-hidden">
                    {current.icon}
                    {isAttacked && (
                        <div className="absolute inset-0 bg-repeat bg-center opacity-10" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: '4px 4px'
                        }}></div>
                    )}
                </div>

                {/* Arrow */}
                <div className="text-3xl font-bold text-brand-primary hidden md:block">&rarr;</div>

                {/* Classification Panel */}
                <div className="text-center">
                    <p className="text-brand-text-light">Model Prediction:</p>
                    <h4 className="font-bold text-3xl text-brand-text my-2">{current.label}</h4>
                    <p className="font-semibold text-lg text-brand-primary">{current.confidence}% Confidence</p>
                </div>

            </div>

            <div className="text-center mt-6">
                {!isAttacked ? (
                    <button
                        onClick={handleAttack}
                        className="bg-brand-primary text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-neumorphic-out hover:shadow-neumorphic-in transform hover:scale-95"
                    >
                        Add Adversarial Noise
                    </button>
                ) : (
                     <button
                        onClick={handleReset}
                        className="px-6 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in"
                    >
                        Reset Simulation
                    </button>
                )}
            </div>
        </div>
    );
};

export default AdversarialAttackSimulator;
