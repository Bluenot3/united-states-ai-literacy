import React, { useState } from 'react';

const getReading = (distance: number) => {
    // Simulate an inverse relationship with some noise
    const baseReading = Math.round(500 / (distance + 1));
    const noise = Math.floor(Math.random() * 20) - 10;
    return baseReading + noise;
};

const options = [
    { text: "Obstacle is very close (< 10cm)", range: [0, 10] },
    { text: "Obstacle is nearby (10-40cm)", range: [11, 40] },
    { text: "Obstacle is far away (> 40cm)", range: [41, 100] },
];

const SensorDataInterpreter: React.FC = () => {
    const [distance, setDistance] = useState(50);
    const [feedback, setFeedback] = useState('');

    const reading = getReading(distance);
    
    const handleCheck = (range: number[]) => {
        if (distance >= range[0] && distance <= range[1]) {
            setFeedback('Correct! Your interpretation matches the sensor data.');
        } else {
            setFeedback('Not quite. The reading corresponds to a different distance.');
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Ultrasonic Sensor Interpreter</h4>
            
            <div className="flex flex-col items-center gap-6">
                {/* Simulation visual */}
                <div className="w-full max-w-md h-24 bg-brand-bg rounded-lg shadow-neumorphic-in flex items-center p-4 relative">
                    <div className="text-4xl">🤖</div>
                    <div
                        className="absolute h-16 w-8 bg-brand-primary/50 rounded-lg transition-all duration-100"
                        style={{ right: `${distance}%` }}
                    ></div>
                </div>

                {/* Slider */}
                <div className="w-full max-w-md">
                    <label htmlFor="distance" className="block text-center text-brand-text-light mb-2">Adjust obstacle distance: <span className="font-bold text-brand-text">{distance}cm</span></label>
                    <input
                        id="distance"
                        type="range"
                        min="0"
                        max="100"
                        value={distance}
                        onChange={(e) => {
                            setDistance(parseInt(e.target.value));
                            setFeedback('');
                        }}
                        className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer shadow-neumorphic-in"
                    />
                </div>

                <div className="text-center p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <p className="text-brand-text-light">Sensor Reading:</p>
                    <p className="font-bold text-2xl text-brand-primary">{reading}</p>
                </div>

                <div>
                    <p className="text-center font-semibold mb-3">Based on the reading, what can you conclude?</p>
                    <div className="flex flex-col md:flex-row gap-3">
                        {options.map((opt, index) => (
                            <button key={index} onClick={() => handleCheck(opt.range)} className="p-3 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">
                                {opt.text}
                            </button>
                        ))}
                    </div>
                </div>
                
                {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
            </div>
        </div>
    );
};

export default SensorDataInterpreter;