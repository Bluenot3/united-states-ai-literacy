import React, { useState, useMemo } from 'react';
import { useAdmin } from '../contexts/AdminContext';

const AdminStudents: React.FC = () => {
    const { students, sendMessage, createAssignment } = useAdmin();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'at-risk'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'progress' | 'lastActive' | 'points'>('name');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

    const filteredStudents = useMemo(() => {
        let result = students;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.email.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(s => s.status === statusFilter);
        }

        // Sort
        result = [...result].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'progress':
                    const aProgress = Object.values(a.moduleProgress).reduce((sum, m) => sum + m.completedSections.length, 0);
                    const bProgress = Object.values(b.moduleProgress).reduce((sum, m) => sum + m.completedSections.length, 0);
                    return bProgress - aProgress;
                case 'lastActive':
                    return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
                case 'points':
                    return b.totalPoints - a.totalPoints;
                default:
                    return 0;
            }
        });

        return result;
    }, [students, searchQuery, statusFilter, sortBy]);

    const toggleSelectAll = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredStudents.map(s => s.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const getProgressPercent = (student: typeof students[0]) => {
        const total = 50 + 40 + 40 + 60; // Module section totals
        const completed = Object.values(student.moduleProgress).reduce((sum, m) => sum + m.completedSections.length, 0);
        return Math.min(100, Math.round((completed / total) * 100));
    };

    const getTimeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div className="p-8 space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white">Student Management</h1>
                    <p className="text-slate-400 mt-1">Manage, track, and engage with your students</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowMessageModal(true)}
                        disabled={selectedStudents.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Message ({selectedStudents.length})
                    </button>
                    <button
                        onClick={() => setShowAssignModal(true)}
                        disabled={selectedStudents.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Assign
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4">
                {/* Search */}
                <div className="flex-1 min-w-[250px] relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-primary transition-colors"
                    />
                </div>

                {/* Status Filter */}
                <div className="flex gap-2">
                    {(['all', 'active', 'inactive', 'at-risk'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${statusFilter === status
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-slate-700/50 text-slate-400 hover:text-white'
                                }`}
                        >
                            {status === 'all' ? 'All' : status === 'at-risk' ? 'At Risk' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-primary"
                >
                    <option value="name">Sort by Name</option>
                    <option value="progress">Sort by Progress</option>
                    <option value="lastActive">Sort by Last Active</option>
                    <option value="points">Sort by Points</option>
                </select>
            </div>

            {/* Students Table */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 items-center p-4 border-b border-slate-700/50 bg-slate-800/50">
                    <div className="col-span-1">
                        <input
                            type="checkbox"
                            checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                            onChange={toggleSelectAll}
                            className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-brand-primary focus:ring-brand-primary"
                        />
                    </div>
                    <div className="col-span-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</div>
                    <div className="col-span-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</div>
                    <div className="col-span-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Progress</div>
                    <div className="col-span-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Points</div>
                    <div className="col-span-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Last Active</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-700/30">
                    {filteredStudents.map(student => {
                        const progress = getProgressPercent(student);

                        return (
                            <div
                                key={student.id}
                                className={`grid grid-cols-12 gap-4 items-center p-4 hover:bg-slate-800/50 transition-colors cursor-pointer ${selectedStudents.includes(student.id) ? 'bg-brand-primary/10' : ''
                                    }`}
                                onClick={() => setSelectedStudent(student.id)}
                            >
                                <div className="col-span-1" onClick={e => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={() => toggleSelect(student.id)}
                                        className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-brand-primary focus:ring-brand-primary"
                                    />
                                </div>

                                <div className="col-span-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary/30 to-purple-600/30 flex items-center justify-center text-white font-bold">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">{student.name}</p>
                                        <p className="text-slate-500 text-sm truncate">{student.email}</p>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${student.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                            student.status === 'at-risk' ? 'bg-red-500/20 text-red-400' :
                                                'bg-slate-600/50 text-slate-400'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'active' ? 'bg-green-400' :
                                                student.status === 'at-risk' ? 'bg-red-400' :
                                                    'bg-slate-400'
                                            }`} />
                                        {student.status === 'at-risk' ? 'At Risk' : student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                    </span>
                                </div>

                                <div className="col-span-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-brand-primary to-purple-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <span className="text-white font-semibold text-sm">{progress}%</span>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <span className="text-amber-400 font-bold">{student.totalPoints.toLocaleString()}</span>
                                    <span className="text-slate-500 text-sm ml-1">pts</span>
                                </div>

                                <div className="col-span-2 text-slate-400 text-sm">
                                    {getTimeAgo(student.lastActive)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredStudents.length === 0 && (
                    <div className="p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-slate-400">No students found matching your criteria</p>
                    </div>
                )}
            </div>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <StudentDetailModal
                    studentId={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                />
            )}

            {/* Message Modal */}
            {showMessageModal && (
                <MessageModal
                    studentIds={selectedStudents}
                    onClose={() => setShowMessageModal(false)}
                    onSend={(subject, body) => {
                        sendMessage(selectedStudents, subject, body, 'direct');
                        setShowMessageModal(false);
                        setSelectedStudents([]);
                    }}
                />
            )}
        </div>
    );
};

// Student Detail Modal Component
const StudentDetailModal: React.FC<{ studentId: string; onClose: () => void }> = ({ studentId, onClose }) => {
    const { getStudent } = useAdmin();
    const student = getStudent(studentId);

    if (!student) return null;

    const modules = [
        { id: 1, name: 'AI Foundations', total: 50 },
        { id: 2, name: 'Building AI', total: 40 },
        { id: 3, name: 'AI Applications', total: 40 },
        { id: 4, name: 'Advanced Topics', total: 60 },
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                            {student.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{student.name}</h2>
                            <p className="text-slate-400">{student.email}</p>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 mt-2 rounded-full text-xs font-bold ${student.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                    student.status === 'at-risk' ? 'bg-red-500/20 text-red-400' :
                                        'bg-slate-600/50 text-slate-400'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'active' ? 'bg-green-400' :
                                        student.status === 'at-risk' ? 'bg-red-400' :
                                            'bg-slate-400'
                                    }`} />
                                {student.status}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Stats */}
                <div className="p-6 grid grid-cols-3 gap-4">
                    <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                        <p className="text-3xl font-black text-amber-400">{student.totalPoints.toLocaleString()}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Total Points</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                        <p className="text-3xl font-black text-white">{Object.values(student.moduleProgress).filter(m => m.certificateId).length}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Certificates</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                        <p className="text-3xl font-black text-brand-primary">{student.assignments.length}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Assignments</p>
                    </div>
                </div>

                {/* Module Progress */}
                <div className="p-6 pt-0">
                    <h3 className="text-white font-bold mb-4">Module Progress</h3>
                    <div className="space-y-4">
                        {modules.map(module => {
                            const progress = student.moduleProgress[module.id as 1 | 2 | 3 | 4];
                            const percent = Math.round((progress?.completedSections?.length || 0) / module.total * 100);
                            const hasCert = !!progress?.certificateId;

                            return (
                                <div key={module.id} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300 flex items-center gap-2">
                                            {module.name}
                                            {hasCert && <span className="text-amber-400">🏆</span>}
                                        </span>
                                        <span className="text-white font-bold">{percent}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${hasCert ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-brand-primary to-purple-500'}`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 flex gap-3">
                    <button className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/80 transition-colors">
                        Send Message
                    </button>
                    <button className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition-colors">
                        Assign Task
                    </button>
                </div>
            </div>
        </div>
    );
};

// Message Modal Component
const MessageModal: React.FC<{
    studentIds: string[];
    onClose: () => void;
    onSend: (subject: string, body: string) => void;
}> = ({ studentIds, onClose, onSend }) => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Send Message</h2>
                    <p className="text-slate-400 text-sm mt-1">Sending to {studentIds.length} student{studentIds.length > 1 ? 's' : ''}</p>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-2">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            placeholder="Message subject..."
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-2">Message</label>
                        <textarea
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            placeholder="Type your message..."
                            rows={5}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-primary resize-none"
                        />
                    </div>
                </div>

                <div className="p-6 pt-0 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSend(subject, body)}
                        disabled={!subject || !body}
                        className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminStudents;
