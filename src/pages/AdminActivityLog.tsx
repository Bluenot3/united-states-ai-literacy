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
    1: 'from-purple-400 to-violet-500',
    2: 'from-blue-400 to-cyan-500',
    3: 'from-emerald-400 to-teal-500',
    4: 'from-amber-400 to-orange-500',
};

const EVENT_ICONS: Record<string, string> = {
    section_complete: '📖',
    interactive_complete: '🎮',
    login: '👤',
    certificate_earned: '🏆',
    quiz_passed: '✅',
    points_earned: '⭐',
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
            <div className="flex-1 bg-slate-900/40 backdrop-blur-sm" />
            <div
                className="w-full max-w-lg bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(241,245,249,1)_100%)] border-l border-black/10 shadow-[-30px_0_60px_rgba(2,6,23,0.15),inset_2px_0_0_rgba(255,255,255,1)] overflow-y-auto relative"
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(255,255,255,0.8),transparent_70%)] pointer-events-none" />
                {/* Header */}
                <div className="p-8 border-b border-black/10 flex items-start justify-between bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.9),transparent_50%)]">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-black/10 flex items-center justify-center text-slate-800 text-2xl font-black shadow-[inset_0_2px_10px_rgba(0,0,0,0.02),0_5px_15px_rgba(2,6,23,0.05)]">
                            {student.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-950 tracking-tight drop-shadow-[0_1px_0_rgba(255,255,255,1)]">{student.name}</h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{student.email}</p>
                            <span className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] ${
                                student.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                student.status === 'at-risk' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                    student.status === 'active' ? 'bg-emerald-500 shadow-[0_0_5px_currentColor]' :
                                    student.status === 'at-risk' ? 'bg-rose-500 shadow-[0_0_5px_currentColor]' : 'bg-slate-500'
                                }`} />
                                {student.status}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition-colors p-2 bg-white rounded-xl border border-black/10 hover:bg-slate-50 shadow-[0_2px_5px_rgba(2,6,23,0.05)]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Score Cards */}
                <div className="p-8 grid grid-cols-3 gap-4">
                    <div className="bg-white/60 rounded-2xl p-4 text-center border border-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_8px_rgba(2,6,23,0.02)]">
                        <p className="text-2xl font-black text-slate-900">{student.totalPoints.toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Total XP</p>
                    </div>
                    <div className="bg-white/60 rounded-2xl p-4 text-center border border-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_8px_rgba(2,6,23,0.02)]">
                        <p className="text-2xl font-black text-emerald-600">{totalInteractives}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Interactives</p>
                    </div>
                    <div className="bg-white/60 rounded-2xl p-4 text-center border border-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_8px_rgba(2,6,23,0.02)]">
                        <p className="text-2xl font-black text-amber-500">{certificates} 🏆</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Certificates</p>
                    </div>
                </div>

                {/* Module Breakdown */}
                <div className="px-8 pb-8">
                    <h3 className="text-[10px] font-black mb-5 uppercase tracking-[0.2em] text-slate-400 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">Sector Progress Array</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(mId => {
                            const mp = student.moduleProgress[mId];
                            const sections = mp?.completedSections?.length ?? 0;
                            const interactives = mp?.completedInteractives ?? [];
                            const pts = mp?.points ?? 0;
                            const hasCert = !!mp?.certificateId;
                            const pct = Math.min(100, Math.round((sections / 50) * 100));

                            return (
                                <div key={mId} className="bg-white/60 rounded-2xl p-5 border border-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_10px_rgba(2,6,23,0.03)] hover:border-black/20 transition-all">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${MODULE_COLORS[mId]}`} />
                                            <span className="text-slate-900 text-sm font-black tracking-tight">{MODULE_NAMES[mId]}</span>
                                            {hasCert && <span className="text-amber-500 text-xs">🏆</span>}
                                        </div>
                                        <span className="text-slate-600 font-black text-sm tracking-tight">{pts} XP</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4 border border-black/5">
                                        <div className={`h-full bg-gradient-to-r ${MODULE_COLORS[mId]} transition-all duration-1000`} style={{ width: `${pct}%` }} />
                                    </div>
                                    <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        <span>{sections} Nodes</span>
                                        <span>{interactives.length} Int.</span>
                                    </div>
                                    {interactives.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-1.5">
                                            {interactives.slice(0, 8).map((id: string) => (
                                                <span key={id} className="px-2 py-1 bg-white border border-black/10 text-slate-700 rounded text-[9px] font-black uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
                                                    {id.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                            ))}
                                            {interactives.length > 8 && (
                                                <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">+{interactives.length - 8}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Session History */}
                    <h3 className="text-[10px] font-black mb-5 mt-8 uppercase tracking-[0.2em] text-slate-400 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">Telemetry Log</h3>
                    {student.sessionHistory.length === 0 ? (
                        <p className="text-slate-500 text-xs font-medium italic">No telemetry recorded yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {student.sessionHistory.slice(0, 10).map((session, i) => {
                                const duration = session.endedAt
                                    ? Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)
                                    : null;
                                return (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white/60 rounded-xl border border-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_5px_rgba(2,6,23,0.02)]">
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${MODULE_COLORS[session.moduleId] ?? 'from-slate-200 to-slate-300'} flex items-center justify-center text-white text-[10px] font-black tracking-widest shadow-[0_2px_4px_rgba(0,0,0,0.1)]`}>
                                            M{session.moduleId}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-slate-900 text-sm font-black truncate">{MODULE_NAMES[session.moduleId] ?? `Module ${session.moduleId}`}</p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{(session.sectionsViewed ?? []).length} Nodes Scanned</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">{timeAgo(session.startedAt)}</p>
                                            {duration !== null && <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">{duration}M</p>}
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
        <div className="p-8 space-y-8 relative min-h-[100vh] bg-slate-50 text-slate-900">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_20%,_rgba(255,255,255,0.8),_transparent_50%),radial-gradient(ellipse_60%_50%_at_85%_80%,_rgba(241,245,249,0.9),_transparent_40%)] pointer-events-none" />
            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.2]" style={{
                backgroundImage: 'linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
            }} />

            <div className="relative z-10 max-w-7xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="mb-12 relative overflow-hidden rounded-[56px] border border-black/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.99)_50%,rgba(255,255,255,0.96)_100%)] p-12 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_25px_50px_rgba(2,6,23,0.06)] backdrop-blur-3xl">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.9),transparent_60%)]" />
                    <div className="absolute inset-0 z-0 opacity-[0.15] [background:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(15,23,42,0.1)_3px,rgba(15,23,42,0.1)_3px)] [background-size:100%_4px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="flex flex-col items-start">
                            <div className="inline-flex items-center gap-3 rounded-full border border-black/20 bg-white/90 px-4 py-2 mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_5px_15px_rgba(2,6,23,0.05)]">
                                <span className="size-2 rounded-full bg-slate-900 shadow-[0_0_5px_rgba(15,23,42,0.4)] animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Global Operations Log</span>
                            </div>
                            <h1 className="text-[52px] font-black uppercase text-slate-950 tracking-[-0.05em] drop-shadow-[0_1px_0_rgba(255,255,255,0.9)] leading-none">Activity Intelligence</h1>
                            <p className="mt-4 text-[12px] font-black text-slate-600 uppercase tracking-[0.25em]">Real-time view of entire network telemetry</p>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(241,245,249,0.9)_100%)] border border-black/20 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,1),0_5px_15px_rgba(2,6,23,0.05)]">
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                            <span className="text-slate-700 text-[11px] font-black uppercase tracking-[0.3em]">Live Tracking</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Events', value: totalEvents.toLocaleString(), icon: '⚡', color: 'text-slate-950' },
                        { label: 'Nodes Processed', value: totalSections.toLocaleString(), icon: '📖', color: 'text-slate-950' },
                        { label: 'Interactives', value: totalInteractives.toLocaleString(), icon: '🎮', color: 'text-emerald-600' },
                        { label: 'Global XP Pool', value: totalPoints.toLocaleString(), icon: '⭐', color: 'text-amber-500' },
                    ].map(card => (
                        <div key={card.label} className={`bg-white/55 backdrop-blur-xl rounded-[32px] border border-black/45 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_15px_30px_rgba(2,6,23,0.08)] transition-all duration-300 group relative overflow-hidden hover:border-black/60 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(2,6,23,0.12),inset_0_1px_0_rgba(255,255,255,1)]`}>
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.9),transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10">
                                <div className="text-3xl mb-4 transform group-hover:scale-110 duration-300 origin-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">{card.icon}</div>
                                <p className={`text-[40px] leading-none font-black ${card.color} tracking-tight`}>{card.value}</p>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-3">{card.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View Tabs */}
                <div className="flex gap-2 bg-white/80 border border-black/20 p-2 rounded-full w-fit mb-10 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_10px_rgba(2,6,23,0.05)] relative z-20">
                    {(['feed', 'leaderboard', 'interactives'] as const).map(v => (
                        <button
                            key={v}
                            onClick={() => setActiveView(v)}
                            className={`px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-[0.25em] transition-all duration-300 ${
                                activeView === v
                                    ? 'bg-slate-950 text-white border border-black/80 shadow-[0_5px_15px_rgba(2,6,23,0.15)]'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                            }`}
                        >
                            {v === 'feed' ? 'Live Telemetry' : v === 'leaderboard' ? 'Elite Rank' : 'Interactive Arrays'}
                        </button>
                    ))}
                </div>

                {/* Activity Feed View */}
                {activeView === 'feed' && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-5 items-center bg-white/60 backdrop-blur-xl rounded-[32px] border border-black/30 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_15px_30px_rgba(2,6,23,0.06)] relative z-10 group hover:border-black/40 transition-colors">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(255,255,255,0.9),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[32px]" />
                            <div className="flex-1 min-w-[300px] relative">
                                <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="SCAN OPERATIVE OR NODE..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-white/80 border border-black/20 rounded-full text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_2px_4px_rgba(0,0,0,0.02)]"
                                />
                            </div>
                            <select
                                value={typeFilter}
                                onChange={e => setTypeFilter(e.target.value)}
                                className="px-6 py-4 bg-white/80 border border-black/20 rounded-full text-slate-800 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 appearance-none cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all"
                            >
                                <option value="all">ALL CLASSES</option>
                                <option value="section_complete">NODE COMPLETIONS</option>
                                <option value="interactive_complete">INTERACTIVES</option>
                                <option value="login">AUTHENTICATIONS</option>
                                <option value="certificate_earned">CERTIFICATIONS</option>
                            </select>
                            <select
                                value={moduleFilter}
                                onChange={e => setModuleFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                className="px-6 py-4 bg-white/80 border border-black/20 rounded-full text-slate-800 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 appearance-none cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all"
                            >
                                <option value="all">ALL SECTORS</option>
                                {[1, 2, 3, 4].map(m => <option key={m} value={m}>{MODULE_NAMES[m].toUpperCase()}</option>)}
                            </select>
                            <span className="text-slate-500 drop-shadow-[0_1px_0_rgba(255,255,255,1)] text-[10px] font-black uppercase tracking-[0.3em] ml-2">{filteredFeed.length} EVENTS</span>
                        </div>

                        {/* Feed List */}
                        <div className="bg-[linear-gradient(135deg,rgba(255,255,255,0.95)_0%,rgba(241,245,249,0.98)_100%)] backdrop-blur-3xl rounded-[40px] border border-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_20px_40px_rgba(2,6,23,0.08)] overflow-hidden relative group/feed z-10 hover:border-black/40 transition-colors">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.8),transparent_70%)] pointer-events-none opacity-0 group-hover/feed:opacity-100 transition-opacity duration-700" />
                            {filteredFeed.length === 0 ? (
                                <div className="p-24 text-center">
                                    <div className="text-6xl mb-8 opacity-50 animate-pulse drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">📡</div>
                                    <p className="text-[13px] font-black uppercase tracking-[0.4em] text-slate-500">Awaiting Signals</p>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em] mt-3">Telemetry will appear as nodes interact.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-black/5 relative z-10">
                                    {filteredFeed.slice(0, 100).map((event, i) => (
                                        <div
                                            key={event.id}
                                            className={`flex items-start gap-6 p-6 hover:bg-white transition-all duration-300 cursor-pointer ${i === 0 ? 'bg-[radial-gradient(ellipse_at_left,rgba(255,255,255,1),transparent_70%)] border-l-4 border-slate-800' : 'border-l-4 border-transparent hover:shadow-[0_2px_10px_rgba(2,6,23,0.02)]'}`}
                                            onClick={() => {
                                                const s = students.find(st => st.id === event.studentId);
                                                if (s) setSelectedStudent(s);
                                            }}
                                        >
                                            <div className="text-2xl w-12 h-12 rounded-[16px] bg-slate-50 border border-black/10 flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_5px_rgba(2,6,23,0.05)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]">
                                                {EVENT_ICONS[event.type] ?? '📌'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-4 flex-wrap mb-2">
                                                    <button
                                                        className="text-slate-900 font-black hover:text-slate-600 transition-colors tracking-tight text-[15px] drop-shadow-[0_1px_0_rgba(255,255,255,1)]"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            const s = students.find(st => st.id === event.studentId);
                                                            if (s) setSelectedStudent(s);
                                                        }}
                                                    >
                                                        {event.studentName}
                                                    </button>
                                                    <span className={`px-3 py-1 rounded-[8px] text-[9px] font-black uppercase tracking-[0.2em] border shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(2,6,23,0.05)] ${
                                                        event.type === 'section_complete' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                        event.type === 'interactive_complete' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                                                        event.type === 'certificate_earned' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                        event.type === 'quiz_passed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                        'bg-slate-50 text-slate-700 border-slate-200'
                                                    }`}>
                                                        {event.type.replace(/_/g, ' ')}
                                                    </span>
                                                    {event.moduleId && (
                                                        <span className={`px-3 py-1 rounded-[8px] text-[9px] font-black uppercase tracking-[0.2em] bg-white border border-black/10 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(2,6,23,0.05)]`}>
                                                            S{event.moduleId}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-slate-600 text-[12px] font-bold truncate tracking-wide">{event.description}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{timeAgo(event.timestamp)}</p>
                                                {event.points && (
                                                    <p className="text-slate-900 text-[13px] font-black tracking-tight mt-1.5 drop-shadow-[0_1px_0_rgba(255,255,255,1)]">+{event.points} XP</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {filteredFeed.length > 100 && (
                                        <div className="p-8 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] bg-slate-50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                                            SHOWING 100 OF {filteredFeed.length} EVENTS
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Leaderboard View */}
                {activeView === 'leaderboard' && (
                    <div className="bg-white/60 backdrop-blur-2xl rounded-[32px] border border-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_15px_30px_rgba(2,6,23,0.05)] overflow-hidden">
                        <div className="p-6 border-b border-black/10 flex items-center justify-between bg-white/80">
                            <div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Global Rankings</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{students.length} OPERATIVES INDEXED</p>
                            </div>
                        </div>
                        <div className="divide-y divide-black/5">
                            {leaderboard.length === 0 ? (
                                <div className="p-16 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">NO OPERATIVES FOUND.</div>
                            ) : (
                                leaderboard.map((student, idx) => {
                                    const totalSecs = Object.values(student.moduleProgress).reduce((s, m) => s + (m.completedSections?.length ?? 0), 0);
                                    const totalInter = Object.values(student.moduleProgress).reduce((s, m) => s + (m.completedInteractives?.length ?? 0), 0);
                                    const certs = Object.values(student.moduleProgress).filter(m => m.certificateId).length;

                                    return (
                                        <div
                                            key={student.id}
                                            className={`flex items-center gap-5 p-5 transition-all cursor-pointer hover:bg-white ${
                                                idx === 0 ? 'bg-[linear-gradient(90deg,rgba(245,158,11,0.05)_0%,rgba(255,255,255,0)_100%)]' :
                                                idx === 1 ? 'bg-[linear-gradient(90deg,rgba(148,163,184,0.05)_0%,rgba(255,255,255,0)_100%)]' :
                                                idx === 2 ? 'bg-[linear-gradient(90deg,rgba(180,83,9,0.05)_0%,rgba(255,255,255,0)_100%)]' : 'hover:shadow-[0_2px_5px_rgba(2,6,23,0.02)]'
                                            }`}
                                            onClick={() => setSelectedStudent(student)}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-[11px] tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,1)] ${
                                                idx === 0 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                idx === 1 ? 'bg-slate-200 text-slate-700 border border-slate-300' :
                                                idx === 2 ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                                'bg-white text-slate-500 border border-black/10'
                                            }`}>
                                                {idx < 3 ? ['01','02','03'][idx] : (idx + 1).toString().padStart(2, '0')}
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-black/10 flex items-center justify-center text-slate-800 font-black text-lg shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_5px_rgba(2,6,23,0.05)]">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-slate-900 font-black tracking-tight drop-shadow-[0_1px_0_rgba(255,255,255,1)]">{student.name}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{student.email}</p>
                                            </div>
                                            <div className="hidden md:flex items-center gap-8 text-sm">
                                                <div className="text-center">
                                                    <p className="text-slate-800 font-black">{totalSecs}</p>
                                                    <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest">NODES</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-emerald-600 font-black">{totalInter}</p>
                                                    <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest">INT.</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-amber-500 font-black">{certs}</p>
                                                    <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest">CERTS</p>
                                                </div>
                                            </div>
                                            <div className="text-right w-24">
                                                <p className="text-slate-950 font-black text-xl tracking-tighter drop-shadow-[0_1px_0_rgba(255,255,255,1)]">{student.totalPoints.toLocaleString()}</p>
                                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">XP</p>
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
                    <div className="space-y-6">
                        <div className="bg-white/60 backdrop-blur-2xl rounded-[32px] border border-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_15px_30px_rgba(2,6,23,0.05)] overflow-hidden">
                            <div className="p-6 border-b border-black/10 bg-white/80">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Component Matrix Status</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{interactiveStats.length} SYSTEMS DEPLOYED ACROSS {students.length} OPERATIVES</p>
                            </div>
                            {interactiveStats.length === 0 ? (
                                <div className="p-16 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">NO COMPONENT DATA.</div>
                            ) : (
                                <div className="divide-y divide-black/5">
                                    {interactiveStats.map((item, idx) => {
                                        const maxCount = interactiveStats[0]?.count ?? 1;
                                        const pct = Math.round((item.count / maxCount) * 100);
                                        return (
                                            <div key={item.id} className="flex items-center gap-5 p-5 hover:bg-white transition-colors group">
                                                <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest w-8 text-right">{(idx + 1).toString().padStart(2, '0')}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-slate-800 font-black text-sm tracking-tight truncate group-hover:text-slate-950 transition-colors drop-shadow-[0_1px_0_rgba(255,255,255,1)]">
                                                            {item.id.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                                                        </p>
                                                        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                                                            <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{item.uniqueStudents} USERS</span>
                                                            <span className="text-emerald-600 font-black text-sm">{item.count}×</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 border border-black/5 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                                                        <div
                                                            className="h-full bg-slate-900 transition-all duration-1000"
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
            </div>

            {/* Student Drawer */}
            {selectedStudent && (
                <StudentDrawer student={selectedStudent} onClose={() => setSelectedStudent(null)} />
            )}
        </div>
    );
};

export default AdminActivityLog;
