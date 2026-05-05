
import React, { useState } from 'react';

const features = [
    { id: 'engine', name: 'Adaptive Learning Engine', icon: '🧠', desc: 'Personalizes learning paths and provides AI analytics to track progress. Adjusts difficulty based on student performance.' },
    { id: 'dash', name: 'Parent/Student Dashboards', icon: '📊', desc: 'Separate, role-based views for progress tracking, attendance monitoring, and gradebooks with exportable reports.' },
    { id: 'hub', name: 'Community Hub', icon: '💬', desc: 'Forums and chats for peer interaction, collaborative projects, and mentorship connections.' },
    { id: 'lib', name: 'Resource Library', icon: '📚', desc: 'Contains all downloadable PDFs, interactive videos, coding environments, and supplementary materials.' },
    { id: 'plan', name: 'Calendar & Planner', icon: '📅', desc: 'Schedules assignments, deadlines, and reminders with calendar sync and notification support.' },
    { id: 'gen', name: 'Transcript Generator', icon: '📜', desc: 'Automatically compiles credits and GPAs for reporting to educational institutions and college applications.' },
];

const FeatureExplorer: React.FC = () => {
    const [selectedFeature, setSelectedFeature] = useState(features[0]);

    return (
        <div className="my-8 rounded-2xl shadow-neumorphic-out overflow-hidden border border-brand-primary/10">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent border-b border-brand-shadow-dark/20">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-lg shadow-md">
                        ⚡
                    </div>
                    <h4 className="font-bold text-lg text-brand-text">Platform Features</h4>
                </div>
                <p className="text-brand-text-light text-sm ml-11">Explore the key features of the ZEN Vanguard platform.</p>
            </div>

            <div className="p-5">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Feature List */}
                    <div className="w-full md:w-2/5">
                        <div className="flex flex-col gap-2">
                            {features.map((feature, i) => (
                                <button
                                    key={feature.id}
                                    onClick={() => setSelectedFeature(feature)}
                                    className={`p-3.5 text-sm rounded-xl text-left transition-all duration-200 flex items-center gap-3 ${selectedFeature.id === feature.id
                                            ? 'shadow-neumorphic-in bg-gradient-to-r from-brand-primary/10 to-transparent text-brand-primary border border-brand-primary/20'
                                            : 'shadow-neumorphic-out hover:shadow-neumorphic-in text-brand-text-light border border-transparent'
                                        }`}
                                >
                                    <span className="text-xl">{feature.icon}</span>
                                    <span className="font-medium">{feature.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Feature Detail */}
                    <div className="w-full md:w-3/5 p-6 bg-brand-bg rounded-xl shadow-neumorphic-in flex flex-col items-center justify-center min-h-[250px]">
                        <div className="text-5xl mb-4 animate-float">{selectedFeature.icon}</div>
                        <h4 className="font-bold text-xl text-brand-text mb-3 text-center">{selectedFeature.name}</h4>
                        <p className="text-brand-text-light text-center text-sm leading-relaxed max-w-sm">{selectedFeature.desc}</p>
                        <div className="mt-4 flex items-center gap-1">
                            {features.map((f, i) => (
                                <div
                                    key={f.id}
                                    className={`w-2 h-2 rounded-full transition-all ${f.id === selectedFeature.id ? 'bg-brand-primary w-6' : 'bg-brand-shadow-dark/30'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureExplorer;