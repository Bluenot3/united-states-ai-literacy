import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Student, Message, ActivityEvent, AdminStats } from '../types';
import { dal } from '../services/dal';
import { useAuth } from '../hooks/useAuth';

interface AdminContextType {
    isAdminAuthenticated: boolean;
    adminLoading: boolean;
    adminLogin: (username: string, password: string) => Promise<boolean>;
    adminLogout: () => void;
    students: Student[];
    messages: Message[];
    activityFeed: ActivityEvent[];
    stats: AdminStats;
    sendMessage: (to: string[], subject: string, body: string, type: Message['type']) => void;
    createAssignment: (studentIds: string[], assignment: any) => void;
    getStudent: (id: string) => Student | undefined;
    searchStudents: (query: string) => Student[];
    refreshData: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

// Helper to calculate stats
const calculateStats = (students: Student[]): AdminStats => {
    if (students.length === 0) {
        return {
            totalStudents: 0,
            activeToday: 0,
            averageProgress: 0,
            certificatesIssued: 0,
            atRiskStudents: 0,
            completionRate: 0,
            averageEngagementTime: '0h 0m',
            weeklyGrowth: 0,
            totalSectionsCompleted: 0,
            totalInteractivesCompleted: 0,
            totalPoints: 0,
        };
    }

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const activeToday = students.filter(s => {
        const lastActiveTime = new Date(s.lastActive).getTime();
        return lastActiveTime > oneDayAgo;
    }).length;

    const certificatesIssued = students.reduce((sum, s) => {
        return sum + Object.values(s.moduleProgress).filter(m => m.certificateId).length;
    }, 0);

    const totalSectionsCompleted = students.reduce((sum, s) => {
        return sum + Object.values(s.moduleProgress).reduce((mSum, m) => mSum + m.completedSections.length, 0);
    }, 0);

    const totalInteractivesCompleted = students.reduce((sum, s) => {
        return sum + Object.values(s.moduleProgress).reduce((mSum, m) => mSum + m.completedInteractives.length, 0);
    }, 0);

    const totalPoints = students.reduce((sum, s) => sum + s.totalPoints, 0);
    const aggregateProgramProgress = students.flatMap((student) => (
        (student.programProgress ?? []).filter((progress) => (
            progress.moduleKey === '__program__'
            && progress.lessonKey === '__aggregate__'
            && Number.isFinite(progress.progressPercent)
        ))
    ));
    const averageProgress = aggregateProgramProgress.length > 0
        ? Math.round(
            aggregateProgramProgress.reduce((sum, progress) => sum + progress.progressPercent, 0)
            / aggregateProgramProgress.length,
        )
        : 0;

    const atRiskStudents = students.filter(s => s.status === 'at-risk').length;
    const possibleCerts = students.length * 4;
    const completionRate = possibleCerts > 0 ? Math.round((certificatesIssued / possibleCerts) * 100) : 0;

    // Engagement time approx
    let totalSessionTime = 0;
    let sessionCount = 0;
    students.forEach(s => {
        s.sessionHistory?.forEach(session => {
            if (session.startedAt && session.endedAt) {
                const duration = new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime();
                totalSessionTime += duration;
                sessionCount++;
            }
        });
    });

    const avgSessionMs = sessionCount > 0 ? totalSessionTime / sessionCount : 0;
    const avgHours = Math.floor(avgSessionMs / (1000 * 60 * 60));
    const avgMinutes = Math.floor((avgSessionMs % (1000 * 60 * 60)) / (1000 * 60));

    return {
        totalStudents: students.length,
        activeToday,
        averageProgress,
        certificatesIssued,
        atRiskStudents,
        completionRate,
        averageEngagementTime: `${avgHours}h ${avgMinutes}m`,
        weeklyGrowth: 0,
        totalSectionsCompleted,
        totalInteractivesCompleted,
        totalPoints,
    };
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        loading: authLoading,
        isAdmin,
        adminLoading: canonicalAdminLoading,
        refreshAdminStatus,
        login: authLogin,
        logout: authLogout,
    } = useAuth();
    // Dev bypass: sessionStorage.__admin_bypass__ lets local preview skip Supabase auth
    const devBypass = import.meta.env.DEV && sessionStorage.getItem('__admin_bypass__') === '1';
    const isAdminAuthenticated = devBypass || isAdmin;
    const adminLoading = devBypass ? false : authLoading || canonicalAdminLoading;
    const [students, setStudents] = useState<Student[]>([]);
    const [messages, _setMessages] = useState<Message[]>([]);
    const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);

    // Single sign-on: any signed-in account whose email is on the central
    // admin allowlist (services/adminAccess.ts) is automatically an admin —
    // no separate admin login required. royaltokens@gmail.com and the rest of
    // the allowlist sign in once at /login and get everything.
    // Build activity feed from student data
    const buildActivityFeed = useCallback((loadedStudents: Student[]): ActivityEvent[] => {
        const events: ActivityEvent[] = [];
        loadedStudents.forEach((student) => {
            student.sessionHistory.forEach((session, i) => {
                events.push({
                    id: `${student.id}-login-${i}`,
                    studentId: student.id,
                    studentName: student.name,
                    type: 'login',
                    description: `Logged in — Module ${session.moduleId ?? '?'} session`,
                    timestamp: session.startedAt,
                    moduleId: session.moduleId,
                });
            });
            Object.entries(student.moduleProgress).forEach(([modId, mp]) => {
                const moduleId = Number(modId);
                (mp.completedSections ?? []).forEach((sectionId, si) => {
                    events.push({
                        id: `${student.id}-section-${modId}-${si}`,
                        studentId: student.id,
                        studentName: student.name,
                        type: 'section_complete',
                        description: `Completed section: ${sectionId}`,
                        timestamp: mp.completedAt ?? mp.startedAt ?? student.enrolledAt,
                        moduleId,
                    });
                });
                (mp.completedInteractives ?? []).forEach((interactiveId, ii) => {
                    events.push({
                        id: `${student.id}-interactive-${modId}-${ii}`,
                        studentId: student.id,
                        studentName: student.name,
                        type: 'interactive_complete',
                        description: `Completed interactive: ${interactiveId}`,
                        timestamp: mp.startedAt ?? student.enrolledAt,
                        moduleId,
                    });
                });
                if (mp.certificateId) {
                    events.push({
                        id: `${student.id}-cert-${modId}`,
                        studentId: student.id,
                        studentName: student.name,
                        type: 'certificate_earned',
                        description: `Earned Module ${moduleId} certificate`,
                        timestamp: mp.completedAt ?? student.enrolledAt,
                        moduleId,
                    });
                }
            });
        });
        return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, []);

    // Load real data from DAL
    const loadRealData = useCallback(async () => {
        if (!isAdminAuthenticated) return;

        try {
            const loadedStudents = await dal.user.getAllStudents();
            setStudents(loadedStudents);
            setActivityFeed(buildActivityFeed(loadedStudents));
        } catch (error) {
            console.error("Failed to load admin data:", error);
        }
    }, [isAdminAuthenticated, buildActivityFeed]);

    useEffect(() => {
        if (isAdminAuthenticated) {
            loadRealData();
        }
    }, [isAdminAuthenticated, loadRealData]);

    const adminLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
        const canonicalEmail = email.trim();
        if (!canonicalEmail.includes('@')) return false;

        try {
            await authLogin(canonicalEmail, password);

            // Central allowlist — managed in services/adminAccess.ts
            const allowed = await refreshAdminStatus();
            if (allowed) return true;

            // Not in admin list
            await authLogout();
            return false;
        } catch (error) {
            console.error("Admin Login Failed:", error);
            return false;
        }
    }, [authLogin, authLogout, refreshAdminStatus]);

    const adminLogout = useCallback(() => {
        void authLogout();
        setStudents([]);
    }, [authLogout]);

    const sendMessage = useCallback((to: string[], subject: string, _body: string, _type: Message['type']) => {
        // Implementation for sending messages (Firestore 'messages' collection)
        console.log("Send message:", to, subject);
    }, []);

    const createAssignment = useCallback((studentIds: string[], assignment: any) => {
        console.log("Create assignment", studentIds, assignment);
    }, []);

    const getStudent = useCallback((id: string) => {
        return students.find(s => s.id === id);
    }, [students]);

    const searchStudents = useCallback((query: string) => {
        const lower = query.toLowerCase();
        return students.filter(s =>
            s.name.toLowerCase().includes(lower) ||
            s.email.toLowerCase().includes(lower)
        );
    }, [students]);

    const refreshData = useCallback(() => {
        loadRealData();
    }, [loadRealData]);

    const stats = React.useMemo(() => calculateStats(students), [students]);

    return (
        <AdminContext.Provider value={{
            isAdminAuthenticated,
            adminLoading,
            adminLogin,
            adminLogout,
            students,
            messages,
            activityFeed,
            stats,
            sendMessage,
            createAssignment,
            getStudent,
            searchStudents,
            refreshData,
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
