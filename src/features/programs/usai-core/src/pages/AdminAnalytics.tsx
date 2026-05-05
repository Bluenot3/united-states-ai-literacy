import React, { useMemo } from 'react';
import { useAdmin } from '../contexts/AdminContext';

const AdminAnalytics: React.FC = () => {
    const { students, stats, activityFeed } = useAdmin();

    // Module data
    const moduleData = useMemo(() => [
        { id: 1, name: 'AI Foundations', color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-500/20', textColor: 'text-purple-400' },
        { id: 2, name: 'Building AI', color: 'from-blue-500 to-cyan-600', bgColor: 'bg-blue-500/20', textColor: 'text-blue-400' },
        { id: 3, name: 'AI Applications', color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-500/20', textColor: 'text-emerald-400' },
        { id: 4, name: 'Advanced Topics', color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-500/20', textColor: 'text-amber-400' },
    ], []);

    // Calculate module completion stats
    const moduleStats = useMemo(() => {
        return moduleData.map(module => {
            const totalSections = 40 + Math.floor(Math.random() * 20);
            const completionsSum = students.reduce((sum, s) => {
                return sum + (s.moduleProgress[module.id as 1 | 2 | 3 | 4]?.completedSections?.length || 0);
            }, 0);
            const avgCompletion = students.length > 0 ? Math.round((completionsSum / (students.length * totalSections)) * 100) : 0;
            const certificates = students.filter(s => s.moduleProgress[module.id as 1 | 2 | 3 | 4]?.certificateId).length;

            return { ...module, avgCompletion, certificates, totalSections };
        });
    }, [students, moduleData]);

    // Activity breakdown by type
    const activityBreakdown = useMemo(() => {
        const counts: Record<string, number> = {
            section_complete: 0,
            interactive_complete: 0,
            login: 0,
            certificate_earned: 0,
            quiz_passed: 0,
        };

        activityFeed.forEach(a => {
            counts[a.type] = (counts[a.type] || 0) + 1;
        });

        return [
            { type: 'section_complete', label: 'Sections Completed', count: counts.section_complete, color: 'bg-purple-500' },
            { type: 'interactive_complete', label: 'Interactives Done', count: counts.interactive_complete, color: 'bg-blue-500' },
            { type: 'login', label: 'Login Sessions', count: counts.login, color: 'bg-green-500' },
            { type: 'certificate_earned', label: 'Certificates Earned', count: counts.certificate_earned, color: 'bg-amber-500' },
            { type: 'quiz_passed', label: 'Quizzes Passed', count: counts.quiz_passed, color: 'bg-pink-500' },
        ];
    }, [activityFeed]);

    // Top performers
    const topPerformers = useMemo(() => {
        return [...students]
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .slice(0, 5);
    }, [students]);

    // Engagement time distribution (mock)
    const engagementData = [
        { day: 'Mon', hours: 156 },
        { day: 'Tue', hours: 178 },
        { day: 'Wed', hours: 142 },
        { day: 'Thu', hours: 189 },
        { day: 'Fri', hours: 134 },
        { day: 'Sat', hours: 89 },
        { day: 'Sun', hours: 76 },
    ];
    const maxHours = Math.max(...engagementData.map(d => d.hours));

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white">Analytics & Insights</h1>
                <p className="text-slate-400 mt-1">Deep dive into program performance and student engagement</p>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-brand-primary/20 rounded-xl">
                            <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Completion Rate</p>
                            <p className="text-2xl font-black text-white">{stats.completionRate}%</p>
                        </div>
                    </div>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-primary" style={{ width: `${stats.completionRate}%` }} />
                    </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Avg. Engagement</p>
                            <p className="text-2xl font-black text-white">{stats.averageEngagementTime}</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500">Per student, per session</p>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-amber-500/20 rounded-xl">
                            <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Certs</p>
                            <p className="text-2xl font-black text-white">{stats.certificatesIssued}</p>
                        </div>
                    </div>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                        <span>↑ {stats.weeklyGrowth}%</span>
                        <span className="text-slate-500">this week</span>
                    </p>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-red-500/20 rounded-xl">
                            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">At-Risk</p>
                            <p className="text-2xl font-black text-white">{stats.atRiskStudents}</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500">Students inactive 48h+</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Engagement Chart */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Weekly Engagement</h3>
                    <div className="flex items-end justify-between gap-4 h-48">
                        {engagementData.map(data => (
                            <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-slate-700/30 rounded-t-lg relative" style={{ height: '160px' }}>
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-primary to-purple-500 rounded-t-lg transition-all duration-500"
                                        style={{ height: `${(data.hours / maxHours) * 100}%` }}
                                    />
                                </div>
                                <span className="text-slate-400 text-xs font-medium">{data.day}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-center gap-8">
                        <div className="text-center">
                            <p className="text-2xl font-black text-white">{engagementData.reduce((a, b) => a + b.hours, 0).toLocaleString()}</p>
                            <p className="text-sm text-slate-500">Total Hours</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-brand-primary">{Math.round(engagementData.reduce((a, b) => a + b.hours, 0) / 7)}</p>
                            <p className="text-sm text-slate-500">Daily Avg</p>
                        </div>
                    </div>
                </div>

                {/* Activity Breakdown */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Activity Breakdown</h3>
                    <div className="space-y-4">
                        {activityBreakdown.map(item => {
                            const total = activityBreakdown.reduce((a, b) => a + b.count, 0);
                            const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;

                            return (
                                <div key={item.type} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300 text-sm">{item.label}</span>
                                        <span className="text-white font-bold">{item.count} <span className="text-slate-500 text-xs">({percent}%)</span></span>
                                    </div>
                                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} transition-all duration-500`} style={{ width: `${percent}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Module Performance & Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Module Performance */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Module Performance</h3>
                    <div className="space-y-6">
                        {moduleStats.map(module => (
                            <div key={module.id} className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${module.color}`} />
                                        <span className="text-white font-medium">{module.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-slate-400 text-sm">{module.certificates} 🏆</span>
                                        <span className="text-white font-bold">{module.avgCompletion}%</span>
                                    </div>
                                </div>
                                <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${module.color} transition-all duration-700`}
                                        style={{ width: `${module.avgCompletion}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performers Leaderboard */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Top Performers</h3>
                    <div className="space-y-3">
                        {topPerformers.map((student, index) => (
                            <div
                                key={student.id}
                                className={`flex items-center gap-4 p-4 rounded-xl ${index === 0 ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30' :
                                        index === 1 ? 'bg-gradient-to-r from-slate-400/10 to-slate-500/10 border border-slate-500/30' :
                                            index === 2 ? 'bg-gradient-to-r from-amber-700/10 to-orange-700/10 border border-amber-700/30' :
                                                'bg-slate-900/30'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${index === 0 ? 'bg-amber-500 text-white' :
                                        index === 1 ? 'bg-slate-400 text-slate-900' :
                                            index === 2 ? 'bg-amber-700 text-white' :
                                                'bg-slate-700 text-slate-400'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary/30 to-purple-600/30 flex items-center justify-center text-white font-bold">
                                    {student.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-semibold">{student.name}</p>
                                    <p className="text-slate-500 text-xs">{student.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-amber-400 font-black">{student.totalPoints.toLocaleString()}</p>
                                    <p className="text-slate-500 text-xs">points</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Insights Panel */}
            <div className="bg-gradient-to-br from-brand-primary/10 to-purple-600/10 backdrop-blur-sm rounded-2xl border border-brand-primary/30 p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand-primary/20 rounded-xl">
                        <svg className="w-8 h-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">AI-Powered Insights</h3>
                        <div className="space-y-3 text-slate-300">
                            <p className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">▸</span>
                                <span><strong>Positive Trend:</strong> Student engagement is up {stats.weeklyGrowth}% this week. Module 1 completion has the highest rate at {moduleStats[0]?.avgCompletion}%.</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-amber-400 mt-1">▸</span>
                                <span><strong>Opportunity:</strong> {stats.atRiskStudents} students haven't logged in for 48+ hours. Consider sending a re-engagement message to bring them back.</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-brand-primary mt-1">▸</span>
                                <span><strong>Recommendation:</strong> Weekend engagement is lower than weekdays. Consider scheduling reminders on Sunday evenings to boost Monday starts.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
