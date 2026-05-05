import React, { useState } from 'react';

const features = [
    { id: 'engine', name: 'Adaptive Learning Engine', desc: 'Personalizes learning paths and provides AI analytics to track progress.' },
    { id: 'dash', name: 'Parent/Student Dashboards', desc: 'Separate views for progress tracking, attendance, and gradebooks.' },
    { id: 'hub', name: 'Community Hub', desc: 'Forums and chats for peer interaction and collaborative projects.' },
    { id: 'lib', name: 'Resource Library', desc: 'Contains all downloadable PDFs, videos, and coding environments.' },
    { id: 'plan', name: 'Calendar & Planner', desc: 'Schedules assignments, deadlines, and reminders.' },
    { id: 'gen', name: 'Transcript Generator', desc: 'Automatically compiles credits and GPAs for reporting.' },
];

const FeatureExplorer: React.FC = () => {
    const [selectedFeature, setSelectedFeature] = useState(features[0]);

    return(
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="flex flex-col md:flex-row gap-6">
                 <div className="w-full md:w-1/3">
                    <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Platform Features</h4>
                     <div className="flex flex-col gap-2">
                        {features.map(feature => (
                             <button
                                key={feature.id}
                                onClick={() => setSelectedFeature(feature)}
                                className={`p-3 text-sm rounded-lg text-left transition-all duration-200 ${selectedFeature.id === feature.id ? 'shadow-neumorphic-in text-brand-primary' : 'shadow-neumorphic-out'}`}
                            >
                                {feature.name}
                            </button>
                        ))}
                     </div>
                </div>
                 <div className="w-full md:w-2/3 p-6 bg-brand-bg rounded-lg shadow-neumorphic-in flex items-center justify-center">
                    <div>
                        <h4 className="font-bold text-xl text-brand-text mb-2 text-center">{selectedFeature.name}</h4>
                        <p className="text-brand-text-light text-center">{selectedFeature.desc}</p>
                    </div>
                 </div>
            </div>
        </div>
    )
}

export default FeatureExplorer;