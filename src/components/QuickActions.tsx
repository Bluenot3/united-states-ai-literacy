import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const QuickActions: React.FC = () => {
    const navigate = useNavigate();
    const { getModuleProgress } = useAuth();

    const getContinuePath = () => {
        const m1 = getModuleProgress(1);
        if (!m1.certificateId) return '/module/1';
        const m2 = getModuleProgress(2);
        if (!m2.certificateId) return '/module/2';
        const m3 = getModuleProgress(3);
        if (!m3.certificateId) return '/module/3';
        return '/module/4';
    };

    const actions = [
        { id: 'continue', label: 'Resume', icon: '▶️', color: 'from-brand-primary to-purple-700', onClick: () => navigate(getContinuePath()) },
        { id: 'certificates', label: 'Awards', icon: '🏆', color: 'from-amber-500 to-orange-600', onClick: () => navigate('/dashboard#certificates') },
        { id: 'profile', label: 'Settings', icon: '⚙️', color: 'from-slate-500 to-slate-700', onClick: () => navigate('/admin/settings') },
    ];

    return (
        <div className="grid grid-cols-3 gap-2.5">
            {actions.map((action) => (
                <button
                    key={action.id}
                    onClick={action.onClick}
                    className="group glass-card p-3 text-center transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer"
                >
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white text-sm mx-auto mb-2 shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                        {action.icon}
                    </div>
                    <h4 className="font-bold text-xs text-brand-text leading-tight">{action.label}</h4>
                </button>
            ))}
        </div>
    );
};

export default QuickActions;
