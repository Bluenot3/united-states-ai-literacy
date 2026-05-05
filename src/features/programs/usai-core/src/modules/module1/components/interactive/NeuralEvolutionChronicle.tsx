import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';

const events = [
    { name: 'Perceptron', year: 1958, description: 'The simplest kind of neural network, a single neuron that can make basic classifications.' },
    { name: 'Backpropagation', year: 1986, description: 'A key algorithm that allowed multi-layer networks to be trained effectively, unlocking modern deep learning.' },
    { name: 'Recurrent Neural Networks (RNNs)', year: 1990, description: 'Networks with loops, allowing them to process sequences of data like text or time series.' },
    { name: 'Convolutional Neural Networks (CNNs)', year: 1998, description: 'Specialized networks for processing grid-like data, such as images, revolutionizing computer vision.' },
    { name: 'Transformers', year: 2017, description: 'Introduced the "attention" mechanism, allowing models to weigh the importance of different parts of the input data, leading to a massive leap in language understanding.' },
];

const NeuralEvolutionChronicle: React.FC<InteractiveComponentProps> = () => {
    const [selectedEvent, setSelectedEvent] = useState(events[events.length - 1]);

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Neural Evolution Chronicle</h4>
            
            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-brand-text-light mb-6">
                {events.map(event => (
                    <button 
                        key={event.name}
                        onClick={() => setSelectedEvent(event)}
                        className={`text-center p-1 rounded-md ${selectedEvent.name === event.name ? 'text-brand-primary font-bold' : ''}`}
                    >
                        {event.name}
                        <div className={`w-full h-1 mt-1 rounded-full ${selectedEvent.name === event.name ? 'bg-brand-primary' : 'bg-brand-bg shadow-neumorphic-in'}`}></div>
                    </button>
                ))}
            </div>

            <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in text-center min-h-[120px] flex flex-col justify-center animate-fade-in">
                <h5 className="font-bold text-xl text-brand-primary">{selectedEvent.name} ({selectedEvent.year})</h5>
                <p className="text-brand-text-light mt-2">{selectedEvent.description}</p>
            </div>
        </div>
    );
};

export default NeuralEvolutionChronicle;
