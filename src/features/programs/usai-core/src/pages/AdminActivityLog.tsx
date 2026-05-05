import React, { useState, useMemo } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import type { Student } from '../types';

const MODULE_NAMES: Record<number, string> = {
    1: 'AI Foundations',
    2: 'Building AI',
    3: 'AI Applications',
    4: 'Advanced Topics',
};

const MODULE_COLORS: Record<number, string> = {
    1: 'from-purple-500 to-violet-600',
    2: 'from-blue-500 to-cyan-600',
    3: 'from-emerald-500 to-teal-600',
    4: 'from-amber-500 to-orange-600',
};

const EVENT_ICONS: Record<string, string> = {
    section_complete: '📖',
    interactive_complete: '🎮',
    login: '👤',
    certificate_earned: '🏆',
    quiz_passed: '✅',
    points_earned: '⭐',
};

const EVENT_COLORS: Record<string, string> = {
    section_complete: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    interactive_complete: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    login: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    certificate_earned: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    quiz_passed: 'text-green-400 bg-green-500/10 border-green-500/20',
    points_earned: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
};

function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

// ── Student Profile Drawer ────────────────────────────────────────────
const StudentDrawer: React.FC<{ student: Student; onClose: () => void }> = ({ student, onClose }) => {
    const totalSections = Object.values(student.moduleProgress).reduce(
        (s, m) => s + (m.completedSections?.length ?? 0), 0
    );
    const totalInteractives = Object.values(student.moduleProgress).reduce(
        (s, m) => s + (m.completedInteractives?.length ?? 0), 0
    );
    const certificates = Object.values(student.moduleProgress).filter(m => m.certificateId).length;

    return (
        <div className="fixed inset-0 z-50 flex" onClick={onClose}>
            <div className="flex-1 bg-black/50 backdrop-blur-sm" />
            <div
                className="w-full max-w-lg bg-zen-navy border-l border-zen-gold/20 overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between bg-gradient-to-r from-zen-gold/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zen-gold to-amber-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-zen-gold/30">
                            {student.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white">{student.name}</h2>
                            <p className="text-slate-400 text-sm">{student.email}</p>
                            <span className={`mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                                student.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                student.status === 'at-risk' ? 'bg-red-500/20 text-red-400' :
                                'bg-slate-600/50 text-slate-400'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                    student.status === 'active' ? 'bg-green-400' :
                                    student.status === 'at-risk' ? 'bg-red-400' : 'bg-slate-400'
                                }`} />
                                {student.status}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Score Cards */}
                <div className="p-6 grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-xl p-4 text-center border border-zen-gold/10">
                        <p className="text-2xl font-black text-zen-gold">{student.totalPoints.toLocaleString()}</p>
                        <p className="text-xs text-slate-500 mt-1">Total Points</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                        <p className="text-2xl font-black text-cyan-400">{totalInteractives}</p>
                        <p className="text-xs text-slate-500 mt-1">Interactives</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                        <p className="text-2xl font-black text-amber-400">{certificates} 🏆</p>
                        <p className="text-xs text-slate-500 mt-1">Certificates</p>
                    </div>
                </div>

                {/* Module Breakdown */}
                <div className="px-6 pb-6">
                    <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest text-zen-gold/80">Module Progress</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(mId => {
                            const mp = student.moduleProgress[mId];
                            const sections = mp?.completedSections?.length ?? 0;
                            const interactives = mp?.completedInteractives ?? [];
                            const pts = mp?.points ?? 0;
                            const hasCert = !!mp?.certificateId;
                            const pct = Math.min(100, Math.round((sections / 50) * 100));

                            return (
                                <div key={mId} className="bg-white/3 rounded-xl p-4 border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${MODULE_COLORS[mId]}`} />
                                            <span className="text-white text-sm font-semibold">{MODULE_NAMES[mId]}</span>
                                            {hasCert && <span className="text-amber-400 text-xs">🏆</span>}
                                        </div>
                                        <span className="text-zen-gold font-bold text-sm">{pts} pts</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                                        <div className={`h-full bg-gradient-to-r ${MODULE_COLORS[mId]}`} style={{ width: `${pct}%` }} />
                                    </div>
                                    <div className="flex gap-4 text-xs text-slate-500">
                                        <span>{sections} sections</span>
                                        <span>{interactives.length} interactives</span>
                                    </div>
                                    {interactives.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1">
                                            {interactives.slice(0, 8).map((id: string) => (
                                                <span key={id} className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded text-xs">
                                                    {id.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                            ))}
                                            {interactives.length > 8 && (
                                                <span className="px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded text-xs">+{interactives.length - 8} more</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Session History */}
                    <h3 className="text-white font-bold mb-4 mt-6 text-sm uppercase tracking-widest text-zen-gold/80">Session History</h3>
                    {student.sessionHistory.length === 0 ? (
                        <p className="text-slate-500 text-sm">No sessions recorded yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {student.sessionHistory.slice(0, 10).map((session, i) => {
                                const duration = session.endedAt
                                    ? Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)
                                    : null;
                                return (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white/3 rounded-lg border border-white/5">
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${MODULE_COLORS[session.moduleId] ?? 'from-slate-500 to-slate-600'} flex items-center justify-center text-white text-xs font-bold`}>
                                            M{session.moduleId}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium">{MODULE_NAMES[session.moduleId] ?? `Module ${session.moduleId}`}</p>
                                            <p className="text-slate-500 text-xs">{(session.sectionsViewed ?? []).length} sections viewed</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-400 text-xs">{timeAgo(session.startedAt)}</p>
                                            {duration !== null && <p className="text-slate-500 text-xs">{duration}m</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────
const AdminActivityLog: React.FC = () => {
    const { students, activityFeed } = useAdmin();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [moduleFilter, setModuleFilter] = useState<number | 'all'>('all');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [activeView, setActiveView] = useState<'feed' | 'leaderboard' | 'interactives'>('feed');

    const filteredFeed = useMemo(() => {
        return activityFeed.filter(e => {
            if (search && !e.studentName.toLowerCase().includes(search.toLowerCase()) && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
            if (typeFilter !== 'all' && e.type !== typeFilter) return false;
            if (moduleFilter !== 'all' && e.moduleId !== moduleFilter) return false;
            return true;
        });
    }, [activityFeed, search, typeFilter, moduleFilter]);

    // Leaderboard
    const leaderboard = useMemo(() => {
        return [...students].sort((a, b) => b.totalPoints - a.totalPoints);
    }, [students]);

    // Interactive usage across all students
    const interactiveStats = useMemo(() => {
        const counts: Record<string, { count: number; students: Set<string> }> = {};
        students.forEach(student => {
            Object.values(student.moduleProgress).forEach(mp => {
                (mp.completedInteractives ?? []).forEach((id: string) => {
                    if (!counts[id]) counts[id] = { count: 0, students: new Set() };
                    counts[id].count++;
                    counts[id].students.add(student.id);
                });
            });
        });
        return Object.entries(counts)
            .map(([id, { count, students: s }]) => ({ id, count, uniqueStudents: s.size }))
            .sort((a, b) => b.count - a.count);
    }, [students]);

    const totalEvents = activityFeed.length;
    const totalPoints = students.reduce((s, st) => s + st.totalPoints, 0);
    const totalInteractives = activityFeed.filter(e => e.type === 'interactive_complete').length;
    const totalSections = activityFeed.filter(e => e.type === 'section_complete').length;

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white">Activity Intelligence</h1>
                    <p className="text-slate-400 mt-1">Real-time view of everything your students are doing</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-400 text-sm font-semibold">Live Tracking</span>
                </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Events', value: totalEvents.toLocaleString(), icon: '⚡', color: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/20' },
                    { label: 'Sections Done', value: totalSections.toLocaleString(), icon: '📖', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/20' },
                    { label: 'Interactives', value: totalInteractives.toLocaleString(), icon: '🎮', color: 'from-cyan-500/20 to-teal-500/20', border: 'border-cyan-500/20' },
                    { label: 'Total Points', value: totalPoints.toLocaleString(), icon: '⭐', color: 'from-amber-500/20 to-zen-gold/20', border: 'border-zen-gold/20' },
                ].map(card => (
                    <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-2xl border ${card.border} p-5 backdrop-blur-sm`}>
                        <div className="text-3xl mb-2">{card.icon}</div>
                        <p className="text-2xl font-black text-white">{card.value}</p>
                        <p className="text-sm text-slate-400">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* View Tabs */}
            <div className="flex gap-2 bg-black/20 p-1 rounded-xl w-fit border border-white/5">
                {(['feed', 'leaderboard', 'interactives'] as const).map(v => (
                    <button
                        key={v}
                        onClick={() => setActiveView(v)}
                        className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
                            activeView === v
                                ? 'bg-zen-gold text-zen-navy shadow-lg shadow-zen-gold/20'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        {v === 'feed' ? 'Activity Feed' : v === 'leaderboard' ? 'Leaderboard' : 'Interactive Usage'}
                    </button>
                ))}
            </div>

            {/* Activity Feed View */}
            {activeView === 'feed' && (
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 items-center bg-black/20 rounded-2xl border border-white/5 p-4">
                        <div className="flex-1 min-w-[200px] relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search student or activity..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-zen-gold/50 text-sm"
                            />
                        </div>
                        <select
                            value={typeFilter}
                            onChange={e => setTypeFilter(e.target.value)}
                            className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-zen-gold/50"
                        >
                            <option value="all">All Types</option>
                            <option value="section_complete">Sections</option>
                            <option value="interactive_complete">Interactives</option>
                            <option value="login">Logins</option>
                            <option value="certificate_earned">Certificates</option>
                        </select>
                        <select
                            value={moduleFilter}
                            onChange={e => setModuleFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-zen-gold/50"
                        >
                            <option value="all">All Modules</option>
                            {[1, 2, 3, 4].map(m => <option key={m} value={m}>{MODULE_NAMES[m]}</option>)}
                        </select>
                        <span className="text-slate-500 text-sm">{filteredFeed.length} events</span>
                    </div>

                    {/* Feed List */}
                    <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
                        {filteredFeed.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="text-5xl mb-4">📡</div>
                                <p className="text-slate-400 font-medium">No activity yet</p>
                                <p className="text-slate-600 text-sm mt-1">Activity will appear here as students interact with the platform.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {filteredFeed.slice(0, 100).map((event, i) => (
                                    <div
                                        key={event.id}
                                        className={`flex items-start gap-4 p-4 hover:bg-white/3 transition-colors cursor-pointer ${i === 0 ? 'bg-zen-gold/5' : ''}`}
                                        onClick={() => {
                                            const s = students.find(st => st.id === event.studentId);
                                            if (s) setSelectedStudent(s);
                                        }}
                                    >
                                        <div className="text-xl w-8 text-center flex-shrink-0 mt-0.5">{EVENT_ICONS[event.type] ?? '📌'}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <button
                                                    className="text-white font-semibold hover:text-zen-gold transition-colors text-sm"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        const s = students.find(st => st.id === event.studentId);
                                                        if (s) setSelectedStudent(s);
                                                    }}
                                                >
                                                    {event.studentName}
                                                </button>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${EVENT_COLORS[event.type] ?? 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
                                                    {event.type.replace(/_/g, ' ')}
                                                </span>
                                                {event.moduleId && (
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${MODULE_COLORS[event.moduleId]} text-white`}>
                                                        M{event.moduleId}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-400 text-sm mt-0.5 truncate">{event.description}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-slate-500 text-xs">{timeAgo(event.timestamp)}</p>
                                            {event.points && (
                                                <p className="text-zen-gold text-xs font-bold mt-0.5">+{event.points} pts</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {filteredFeed.length > 100 && (
                                    <div className="p-4 text-center text-slate-500 text-sm">
                                        Showing 100 of {filteredFeed.length} events
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Leaderboard View */}
            {activeView === 'leaderboard' && (
                <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-5 border-b border-white/5 flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-bold">Student Leaderboard</h3>
                            <p className="text-slate-500 text-sm">{students.length} students ranked by total points</p>
                        </div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {leaderboard.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">No students enrolled yet.</div>
                        ) : (
                            leaderboard.map((student, idx) => {
                                const totalSecs = Object.values(student.moduleProgress).reduce((s, m) => s + (m.completedSections?.length ?? 0), 0);
                                const totalInter = Object.values(student.moduleProgress).reduce((s, m) => s + (m.completedInteractives?.length ?? 0), 0);
                                const certs = Object.values(student.moduleProgress).filter(m => m.certificateId).length;

                                return (
                                    <div
                                        key={student.id}
                                        className={`flex items-center gap-4 p-4 hover:bg-white/3 transition-colors cursor-pointer ${
                                            idx === 0 ? 'bg-gradient-to-r from-zen-gold/10 to-transparent' :
                                            idx === 1 ? 'bg-gradient-to-r from-slate-400/5 to-transparent' :
                                            idx === 2 ? 'bg-gradient-to-r from-amber-700/5 to-transparent' : ''
                                        }`}
                                        onClick={() => setSelectedStudent(student)}
                                    >
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm ${
                                            idx === 0 ? 'bg-zen-gold text-zen-navy' :
                                            idx === 1 ? 'bg-slate-400 text-slate-900' :
                                            idx === 2 ? 'bg-amber-700 text-white' :
                                            'bg-white/5 text-slate-500'
                                        }`}>
                                            {idx < 3 ? ['🥇','🥈','🥉'][idx] : idx + 1}
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zen-gold/30 to-amber-600/30 flex items-center justify-center text-white font-bold">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold">{student.name}</p>
                                            <p className="text-slate-500 text-xs">{student.email}</p>
                                        </div>
                                        <div className="hidden md:flex items-center gap-6 text-sm">
                                            <div className="text-center">
                                                <p className="text-slate-300 font-semibold">{totalSecs}</p>
                                                <p className="text-slate-600 text-xs">sections</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-cyan-400 font-semibold">{totalInter}</p>
                                                <p className="text-slate-600 text-xs">interactives</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-amber-400 font-semibold">{certs} 🏆</p>
                                                <p className="text-slate-600 text-xs">certs</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-zen-gold font-black text-lg">{student.totalPoints.toLocaleString()}</p>
                                            <p className="text-slate-600 text-xs">points</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Interactive Usage View */}
            {activeView === 'interactives' && (
                <div className="space-y-4">
                    <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-5 border-b border-white/5">
                            <h3 className="text-white font-bold">Interactive Component Usage</h3>
                            <p className="text-slate-500 text-sm">{interactiveStats.length} unique interactives completed across {students.length} students</p>
                        </div>
                        {interactiveStats.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">No interactive completions recorded yet.</div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {interactiveStats.map((item, idx) => {
                                    const maxCount = interactiveStats[0]?.count ?? 1;
                                    const pct = Math.round((item.count / maxCount) * 100);
                                    return (
                                        <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                                            <span className="text-slate-600 text-sm w-6 text-right">{idx + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-white font-medium text-sm truncate">
                                                        {item.id.replace(/([A-Z])/g, ' $1').trim()}
                                                    </p>
                                                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                                        <span className="text-slate-400 text-xs">{item.uniqueStudents} students</span>
                                                        <span className="text-cyan-400 font-bold text-sm">{item.count}×</span>
                                                    </div>
                                                </div>
                                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Student Drawer */}
            {selectedStudent && (
                <StudentDrawer student={selectedStudent} onClose={() => setSelectedStudent(null)} />
            )}
        </div>
    );
};

export default AdminActivityLog;
