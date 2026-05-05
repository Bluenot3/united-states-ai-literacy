import React from 'react';
import { useAuth } from '../hooks/useAuth';

const ActivityTimeline: React.FC = () => {
    const { getModuleProgress } = useAuth();

    const getActivity = () => {
        const activities = [];

        const m1 = getModuleProgress(1);
        if (m1.completedSections.length > 0) {
            activities.push({
                id: 'm1-progress',
                title: 'AI Foundations progress',
                desc: `${m1.completedSections.length} sections completed`,
                time: 'Recently',
                icon: '🧠',
                bg: 'bg-purple-50',
            });
        }

        const m3 = getModuleProgress(3);
        if (m3.completedSections.length > 0) {
            activities.push({
                id: 'm3-progress',
                title: 'AI Applications progress',
                desc: `${m3.completedSections.length} sections completed`,
                time: 'Recently',
                icon: '🚀',
                bg: 'bg-emerald-50',
            });
        }

        if (activities.length === 0) {
            activities.push({
                id: 'joined',
                title: 'Joined ZEN Vanguard',
                desc: 'Started the AI literacy journey',
                time: 'Just now',
                icon: '👋',
                bg: 'bg-blue-50',
            });
        }

        return activities;
    };

    const activities = getActivity();

    return (
        <div className="glass-card p-5">
            <h3 className="font-bold text-sm text-brand-text mb-3 flex items-center gap-2">
                <span>📅</span> Recent Activity
            </h3>

            <div className="space-y-3 relative">
                <div className="absolute left-[18px] top-3 bottom-3 w-px bg-slate-200/60" />

                {activities.map((item, index) => (
                    <div key={item.id} className="relative flex gap-3 animate-slide-in-up" style={{ animationDelay: `${index * 80}ms` }}>
                        <div className={`relative z-10 flex-shrink-0 w-9 h-9 rounded-full ${item.bg} flex items-center justify-center border-2 border-white shadow-sm`}>
                            <span className="text-sm">{item.icon}</span>
                        </div>
                        <div className="flex-1 pt-0.5 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                                <h4 className="font-semibold text-xs text-brand-text leading-tight">{item.title}</h4>
                                <span className="text-[10px] text-brand-text-light/50 font-medium flex-shrink-0">{item.time}</span>
                            </div>
                            <p className="text-[11px] text-brand-text-light mt-0.5">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityTimeline;
