import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Link } from 'react-router-dom';

// Animated Counter Component
const AnimatedCounter: React.FC<{ value: number; prefix?: string; suffix?: string; duration?: number }> = ({
    value, prefix = '', suffix = '', duration = 1500
}) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number;
        const startValue = displayValue;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            setDisplayValue(Math.floor(startValue + (value - startValue) * eased));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
};

// Metric Card Component
const MetricCard: React.FC<{
    label: string;
    value: number | string;
    prefix?: string;
    suffix?: string;
    icon: React.ReactNode;
    trend?: { value: number; isPositive: boolean };
    color: string;
}> = ({ label, value, prefix, suffix, icon, trend, color }) => (
    <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 group hover:border-slate-600/50 transition-all duration-300">
        {/* Background glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Content */}
        <div className="relative">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </div>
                )}
            </div>

            <p className="text-3xl font-black text-white mb-1">
                {typeof value === 'number' ? (
                    <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
                ) : (
                    `${prefix || ''}${value}${suffix || ''}`
                )}
            </p>
            <p className="text-sm text-slate-400">{label}</p>
        </div>
    </div>
);

// Activity Feed Item
const ActivityItem: React.FC<{
    event: {
        id: string;
        studentName: string;
        type: string;
        description: string;
        timestamp: string;
        points?: number;
    };
    isNew?: boolean;
}> = ({ event, isNew }) => {
    const getIcon = () => {
        switch (event.type) {
            case 'section_complete': return '📖';
            case 'interactive_complete': return '🎮';
            case 'login': return '👋';
            case 'certificate_earned': return '🏆';
            case 'quiz_passed': return '✅';
            default: return '📌';
        }
    };

    const timeAgo = () => {
        const diff = Date.now() - new Date(event.timestamp).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <div className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-500 ${isNew ? 'bg-brand-primary/10 border border-brand-primary/30 animate-pulse' : 'bg-slate-800/30 hover:bg-slate-800/50'}`}>
            <div className="text-2xl">{getIcon()}</div>
            <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{event.studentName}</p>
                <p className="text-slate-400 text-sm truncate">{event.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="text-xs text-slate-500">{timeAgo()}</p>
                {event.points && (
                    <p className="text-xs font-bold text-amber-400">+{event.points} pts</p>
                )}
            </div>
        </div>
    );
};

// Quick Action Button
const QuickAction: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    color: string;
}> = ({ icon, label, onClick, color }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-3 p-6 rounded-2xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60 transition-all duration-300 group hover:border-slate-600/50 hover:scale-105`}
    >
        <div className={`p-4 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <span className="text-slate-300 font-medium text-sm">{label}</span>
    </button>
);

const AdminDashboard: React.FC = () => {
    const { stats, activityFeed, students, refreshData } = useAdmin();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    // Get at-risk students
    const atRiskStudents = students.filter(s => s.status === 'at-risk').slice(0, 5);

    // Calculate real module progress from student data
    const moduleProgress = React.useMemo(() => {
        const modules = [
            { id: 1, name: 'AI Foundations', color: 'from-purple-500 to-violet-600' },
            { id: 2, name: 'Building AI', color: 'from-blue-500 to-cyan-600' },
            { id: 3, name: 'AI Applications', color: 'from-emerald-500 to-teal-600' },
            { id: 4, name: 'Advanced Topics', color: 'from-amber-500 to-orange-600' },
        ];

        return modules.map(module => {
            if (students.length === 0) {
                return { ...module, completion: 0, studentsWithProgress: 0, certificates: 0 };
            }

            // Count students who have completed sections in this module
            let totalSections = 0;
            let certificates = 0;
            const estimatedSectionsPerModule = 50;

            students.forEach(s => {
                const progress = s.moduleProgress[module.id];
                if (progress) {
                    totalSections += progress.completedSections?.length || 0;
                    if (progress.certificateId) certificates++;
                }
            });

            const maxPossible = students.length * estimatedSectionsPerModule;
            const completion = maxPossible > 0 ? Math.round((totalSections / maxPossible) * 100) : 0;
            const studentsWithProgress = students.filter(s =>
                (s.moduleProgress[module.id]?.completedSections?.length || 0) > 0
            ).length;

            return { ...module, completion, studentsWithProgress, certificates };
        });
    }, [students]);

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white">{greeting}, Admin</h1>
                    <p className="text-slate-400 mt-1">
                        Here's what's happening with your students today.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={refreshData}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-full transition-colors"
                    >
                        <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-slate-300 text-sm font-medium">Refresh</span>
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-400 text-sm font-semibold">Live Sync</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    label="Total Students"
                    value={stats.totalStudents}
                    icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                    color="from-blue-500/20 to-cyan-500/20"
                />
                <MetricCard
                    label="Sections Completed"
                    value={stats.totalSectionsCompleted}
                    icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    color="from-green-500/20 to-emerald-500/20"
                />
                <MetricCard
                    label="Interactives Done"
                    value={stats.totalInteractivesCompleted}
                    icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>}
                    color="from-amber-500/20 to-orange-500/20"
                />
                <MetricCard
                    label="Total Points"
                    value={stats.totalPoints}
                    icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                    color="from-purple-500/20 to-pink-500/20"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Feed */}
                <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-white">Live Activity</h2>
                            <p className="text-slate-500 text-sm">Real-time student interactions</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-red-400 text-xs font-bold uppercase">Live</span>
                        </div>
                    </div>

                    <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                        {activityFeed.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <p className="text-slate-400 font-medium">No activity yet</p>
                                <p className="text-slate-500 text-sm mt-1">Student activity will appear here in real-time as they complete sections and interactives.</p>
                            </div>
                        ) : (
                            activityFeed.slice(0, 10).map((event, i) => (
                                <ActivityItem key={event.id} event={event} isNew={i === 0} />
                            ))
                        )}
                    </div>
                </div>

                {/* At-Risk Students & Quick Actions */}
                <div className="space-y-6">
                    {/* At-Risk Alert */}
                    <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl border border-red-500/30 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-bold">At-Risk Students</h3>
                                <p className="text-red-300/70 text-xs">{stats.atRiskStudents} students need attention</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {atRiskStudents.length === 0 ? (
                                <p className="text-slate-400 text-sm">No at-risk students - everyone is engaged!</p>
                            ) : (
                                atRiskStudents.map(student => (
                                    <div key={student.id} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500/30 to-orange-500/30 flex items-center justify-center text-sm font-bold text-white">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium truncate">{student.name}</p>
                                            <p className="text-red-300/60 text-xs">Inactive 48h+</p>
                                        </div>
                                        <button className="text-xs px-3 py-1 bg-red-500/20 text-red-300 rounded-full hover:bg-red-500/30 transition-colors">
                                            Reach Out
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                        <h3 className="text-white font-bold mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/admin/messages" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-900/50 hover:bg-slate-900/70 border border-slate-700/30 transition-colors group">
                                <svg className="w-6 h-6 text-brand-primary group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <span className="text-slate-400 text-xs font-medium">Send Message</span>
                            </Link>
                            <Link to="/admin/students" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-900/50 hover:bg-slate-900/70 border border-slate-700/30 transition-colors group">
                                <svg className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                <span className="text-slate-400 text-xs font-medium">View Students</span>
                            </Link>
                            <Link to="/admin/analytics" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-900/50 hover:bg-slate-900/70 border border-slate-700/30 transition-colors group">
                                <svg className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-slate-400 text-xs font-medium">View Reports</span>
                            </Link>
                            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-900/50 hover:bg-slate-900/70 border border-slate-700/30 transition-colors group">
                                <svg className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                                <span className="text-slate-400 text-xs font-medium">Broadcast</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Module Progress Overview - Now using real data */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h2 className="text-xl font-bold text-white mb-6">Module Completion Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {moduleProgress.map(module => (
                        <div key={module.id} className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-300 font-medium">{module.name}</span>
                                <span className="text-white font-bold">{module.completion}%</span>
                            </div>
                            <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${module.color} transition-all duration-1000 ease-out`}
                                    style={{ width: `${module.completion}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>{module.studentsWithProgress} students active</span>
                                <span>{module.certificates} 🏆</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

