import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { ModuleProgress, SessionRecord, User } from '../types';
import { dal } from '../services/dal';
import { getCanonicalAdminStatus } from '../services/adminAccess';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    adminLoading: boolean;
    refreshAdminStatus: () => Promise<boolean>;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<{ requiresConfirmation: boolean }>;
    logout: () => Promise<void>;
    updateModuleProgress: (moduleId: 1 | 2 | 3 | 4, sectionId: string, type: 'section' | 'interactive') => void;
    addPoints: (...args: [1 | 2 | 3 | 4, number] | [number]) => void;
    updateLastViewedSection: (moduleId: 1 | 2 | 3 | 4, sectionId: string) => void;
    resetModuleProgress: (moduleId: 1 | 2 | 3 | 4) => void;
    resetProgress: () => void;
    setModuleCertificate: (moduleId: 1 | 2 | 3 | 4, certId: string, hash: string) => Promise<void>;
    getModuleProgress: (moduleId: 1 | 2 | 3 | 4) => ModuleProgress;
    startSession: (moduleId: number) => void;
    trackSessionSection: (sectionId: string) => void;
    endSession: () => Promise<void>;
    updateProgress: (sectionOrInteractiveId: string, type: 'section' | 'interactive') => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PREVIEW_USER_STORAGE_KEY = 'zenPreviewUser';
// Preview identities are opt-in. Development builds otherwise use the same
// Supabase session path as production so local QA cannot accidentally pass on
// a synthetic learner that will never exist after deployment.
const PREVIEW_ACCESS_ENABLED = import.meta.env.VITE_ENABLE_DEMO_LOGIN === 'true';

const createDefaultModuleProgress = (): ModuleProgress => ({
    completedSections: [],
    completedInteractives: [],
    points: 0,
    startedAt: null,
    completedAt: null,
    lastViewedSection: 'overview',
    certificateId: null,
    certificateHash: null,
});

const createDefaultModules = (): User['modules'] => ({
    1: createDefaultModuleProgress(),
    2: createDefaultModuleProgress(),
    3: createDefaultModuleProgress(),
    4: createDefaultModuleProgress(),
});

const createPreviewUser = (): User => ({
    id: 'standalone-preview-user',
    email: 'preview@zenai.world',
    name: 'ZEN Preview User',
    picture: 'https://api.dicebear.com/7.x/initials/svg?seed=ZEN',
    createdAt: new Date().toISOString(),
    totalPoints: 0,
    modules: createDefaultModules(),
    sessionHistory: [],
    finalCertificationId: null,
    finalCertificationHash: null,
});

const normalizeUser = (incomingUser: User): User => ({
    ...incomingUser,
    totalPoints: incomingUser.totalPoints ?? 0,
    sessionHistory: incomingUser.sessionHistory ?? [],
    modules: {
        1: incomingUser.modules?.[1] ?? createDefaultModuleProgress(),
        2: incomingUser.modules?.[2] ?? createDefaultModuleProgress(),
        3: incomingUser.modules?.[3] ?? createDefaultModuleProgress(),
        4: incomingUser.modules?.[4] ?? createDefaultModuleProgress(),
    },
    finalCertificationId: incomingUser.finalCertificationId ?? null,
    finalCertificationHash: incomingUser.finalCertificationHash ?? null,
});

const readPreviewUser = (): User => {
    if (typeof window === 'undefined') {
        return normalizeUser(createPreviewUser());
    }

    try {
        const stored = window.localStorage.getItem(PREVIEW_USER_STORAGE_KEY);
        if (!stored) {
            return normalizeUser(createPreviewUser());
        }

        return normalizeUser(JSON.parse(stored) as User);
    } catch (error) {
        console.warn('Failed to read preview user state. Resetting preview profile.', error);
        return normalizeUser(createPreviewUser());
    }
};

const persistPreviewUser = (user: User | null) => {
    if (typeof window === 'undefined' || !PREVIEW_ACCESS_ENABLED || !user) {
        return;
    }

    window.localStorage.setItem(PREVIEW_USER_STORAGE_KEY, JSON.stringify(user));
};

const getModuleIdFromPath = (pathname: string): 1 | 2 | 3 | 4 => {
    const match = pathname.match(/\/module\/([1-4])/);
    const parsed = Number(match?.[1]);

    if (parsed >= 1 && parsed <= 4) {
        return parsed as 1 | 2 | 3 | 4;
    }

    return 1;
};

interface ActiveSession {
    id: string;
    userId: string | null;
    moduleId: number;
    startedAt: string;
    sectionsViewed: string[];
}

const toSessionRecord = (session: ActiveSession, endedAt: string): SessionRecord => ({
    id: session.id,
    startedAt: session.startedAt,
    endedAt,
    moduleId: session.moduleId,
    sectionsViewed: session.sectionsViewed,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const currentModuleId = getModuleIdFromPath(location.pathname);

    const [user, setUser] = useState<User | null>(() => (PREVIEW_ACCESS_ENABLED ? readPreviewUser() : null));
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminLoading, setAdminLoading] = useState(!PREVIEW_ACCESS_ENABLED);
    const currentSessionRef = useRef<ActiveSession | null>(null);
    const sessionWriteQueueRef = useRef<Promise<void>>(Promise.resolve());
    const userWriteQueueRef = useRef<Promise<void>>(Promise.resolve());
    const adminLookupVersionRef = useRef(0);

    const refreshAdminStatus = useCallback(async (): Promise<boolean> => {
        const lookupVersion = ++adminLookupVersionRef.current;
        if (PREVIEW_ACCESS_ENABLED || !dal.auth.getUserId()) {
            if (lookupVersion === adminLookupVersionRef.current) {
                setIsAdmin(false);
                setAdminLoading(false);
            }
            return false;
        }

        setAdminLoading(true);
        const allowed = await getCanonicalAdminStatus();
        if (lookupVersion === adminLookupVersionRef.current) {
            setIsAdmin(allowed);
            setAdminLoading(false);
        }
        return allowed;
    }, []);

    useEffect(() => {
        let mounted = true;

        if (PREVIEW_ACCESS_ENABLED) {
            setUser((previous) => previous ?? readPreviewUser());
            setLoading(false);
            setAdminLoading(false);
        }

        const unsubscribe = dal.auth.onAuthStateChanged((incomingUser: User | null) => {
            if (!mounted) {
                return;
            }

            if (incomingUser) {
                setUser(normalizeUser(incomingUser));
                void refreshAdminStatus();
            } else if (PREVIEW_ACCESS_ENABLED) {
                setUser(readPreviewUser());
                setIsAdmin(false);
                setAdminLoading(false);
            } else {
                setUser(null);
                adminLookupVersionRef.current += 1;
                setIsAdmin(false);
                setAdminLoading(false);
            }

            setLoading(false);
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const queueUserWrite = useCallback((userId: string, nextUser: User): Promise<void> => {
        const nextWrite = userWriteQueueRef.current
            .catch(() => undefined)
            .then(() => dal.user.updateUser(userId, nextUser));

        userWriteQueueRef.current = nextWrite;
        return nextWrite;
    }, [refreshAdminStatus]);

    const updateUserState = useCallback((updater: (prevUser: User) => User | null) => {
        setUser((prevUser) => {
            const baseUser = prevUser ?? (PREVIEW_ACCESS_ENABLED ? readPreviewUser() : null);

            if (!baseUser) {
                return null;
            }

            const nextUser = updater(baseUser);
            const userId = dal.auth.getUserId();

            persistPreviewUser(nextUser);

            if (nextUser && userId) {
                void queueUserWrite(userId, nextUser).catch(console.error);
            }

            return nextUser;
        });
    }, [queueUserWrite]);

    const queueSessionWrite = useCallback((session: ActiveSession, endedAt: string): Promise<void> => {
        if (!session.userId) {
            return Promise.resolve();
        }

        const sessionRecord = toSessionRecord(session, endedAt);
        const nextWrite = sessionWriteQueueRef.current
            .catch(() => undefined)
            .then(() => dal.user.upsertSession(session.userId as string, sessionRecord));

        sessionWriteQueueRef.current = nextWrite;
        return nextWrite;
    }, []);

    const endSession = useCallback(async () => {
        const activeSession = currentSessionRef.current;
        if (!activeSession) {
            return;
        }

        // Clear first so route cleanup, logout, or a double click cannot flush twice.
        currentSessionRef.current = null;
        const endedAt = new Date().toISOString();
        const sessionRecord = toSessionRecord(activeSession, endedAt);

        setUser((previousUser) => {
            if (!previousUser) {
                return previousUser;
            }

            const nextUser = {
                ...previousUser,
                sessionHistory: [...(previousUser.sessionHistory || []), sessionRecord],
            };
            persistPreviewUser(nextUser);
            return nextUser;
        });

        try {
            await queueSessionWrite(activeSession, endedAt);
        } catch (error) {
            // Session analytics must never trap a learner in the app or block logout.
            console.warn('Failed to flush learner session.', error);
        }
    }, [queueSessionWrite]);

    const startSession = useCallback((moduleId: number) => {
        if (!Number.isInteger(moduleId) || moduleId < 1 || moduleId > 4) {
            return;
        }

        const userId = dal.auth.getUserId();
        const activeSession = currentSessionRef.current;
        if (activeSession?.moduleId === moduleId && activeSession.userId === userId) {
            return;
        }

        if (activeSession) {
            void endSession();
        }

        const startedAt = new Date().toISOString();
        const nextSession: ActiveSession = {
            id: crypto.randomUUID(),
            userId,
            moduleId,
            startedAt,
            sectionsViewed: [],
        };

        currentSessionRef.current = nextSession;
        void queueSessionWrite(nextSession, startedAt).catch((error) => {
            console.warn('Failed to start learner session.', error);
        });
    }, [endSession, queueSessionWrite]);

    const trackSessionSection = useCallback((sectionId: string) => {
        const activeSession = currentSessionRef.current;
        if (!activeSession || !sectionId) {
            return;
        }

        const nextSession = {
            ...activeSession,
            sectionsViewed: activeSession.sectionsViewed.includes(sectionId)
                ? activeSession.sectionsViewed
                : [...activeSession.sectionsViewed, sectionId],
        };
        currentSessionRef.current = nextSession;

        void queueSessionWrite(nextSession, new Date().toISOString()).catch((error) => {
            console.warn('Failed to update learner session.', error);
        });
    }, [queueSessionWrite]);

    const login = useCallback(async (email: string, password: string) => {
        const authenticatedUser = await dal.auth.login(email, password);
        setUser(normalizeUser(authenticatedUser));
        setLoading(false);
        await refreshAdminStatus();
    }, [refreshAdminStatus]);

    const signup = useCallback(async (email: string, password: string) => {
        return await dal.auth.signup(email, password);
    }, []);

    const updateModuleProgress = useCallback((
        moduleId: 1 | 2 | 3 | 4,
        id: string,
        type: 'section' | 'interactive'
    ) => {
        trackSessionSection(id);
        updateUserState((prevUser) => {
            const moduleProgress = { ...prevUser.modules[moduleId] };
            let updated = false;

            if (!moduleProgress.startedAt) {
                moduleProgress.startedAt = new Date().toISOString();
                updated = true;
            }

            if (type === 'section' && !moduleProgress.completedSections.includes(id)) {
                moduleProgress.completedSections = [...moduleProgress.completedSections, id];
                updated = true;
            }

            if (type === 'interactive' && !moduleProgress.completedInteractives.includes(id)) {
                moduleProgress.completedInteractives = [...moduleProgress.completedInteractives, id];
                updated = true;
            }

            if (!updated) {
                return prevUser;
            }

            return {
                ...prevUser,
                modules: {
                    ...prevUser.modules,
                    [moduleId]: moduleProgress,
                },
            };
        });
    }, [trackSessionSection, updateUserState]);

    const applyPoints = useCallback((moduleId: 1 | 2 | 3 | 4, amount: number) => {
        updateUserState((prevUser) => {
            const moduleProgress = { ...prevUser.modules[moduleId] };
            moduleProgress.points += amount;

            document.dispatchEvent(new CustomEvent('pointsAdded', { detail: { amount } }));

            return {
                ...prevUser,
                totalPoints: prevUser.totalPoints + amount,
                modules: {
                    ...prevUser.modules,
                    [moduleId]: moduleProgress,
                },
            };
        });
    }, [updateUserState]);

    const addPoints = useCallback((...args: [1 | 2 | 3 | 4, number] | [number]) => {
        const moduleId = args.length === 1 ? currentModuleId : args[0];
        const amount = args.length === 1 ? args[0] : args[1];
        applyPoints(moduleId, amount);
    }, [applyPoints, currentModuleId]);

    const updateLastViewedSection = useCallback((moduleId: 1 | 2 | 3 | 4, sectionId: string) => {
        updateUserState((prevUser) => {
            if (prevUser.modules[moduleId].lastViewedSection === sectionId) {
                return prevUser;
            }

            return {
                ...prevUser,
                modules: {
                    ...prevUser.modules,
                    [moduleId]: {
                        ...prevUser.modules[moduleId],
                        lastViewedSection: sectionId,
                    },
                },
            };
        });
    }, [updateUserState]);

    const resetModuleProgress = useCallback((moduleId: 1 | 2 | 3 | 4) => {
        updateUserState((prevUser) => {
            const pointsToRemove = prevUser.modules[moduleId].points;

            return {
                ...prevUser,
                totalPoints: Math.max(0, prevUser.totalPoints - pointsToRemove),
                modules: {
                    ...prevUser.modules,
                    [moduleId]: createDefaultModuleProgress(),
                },
            };
        });
    }, [updateUserState]);

    const setModuleCertificate = useCallback(async (moduleId: 1 | 2 | 3 | 4, certId: string, hash: string) => {
        if (!user) {
            throw new Error('A signed-in learner is required to save a module certificate.');
        }

        const completedAt = new Date().toISOString();
        const nextUser: User = {
            ...user,
            modules: {
                ...user.modules,
                [moduleId]: {
                    ...user.modules[moduleId],
                    completedAt,
                    certificateId: certId,
                    certificateHash: hash,
                },
            },
        };

        const userId = dal.auth.getUserId();
        if (userId) {
            await queueUserWrite(userId, nextUser);
        }

        persistPreviewUser(nextUser);
        setUser(nextUser);
    }, [queueUserWrite, user]);

    const getModuleProgress = useCallback((moduleId: 1 | 2 | 3 | 4): ModuleProgress => {
        if (!user) {
            return createDefaultModuleProgress();
        }

        return user.modules[moduleId] ?? createDefaultModuleProgress();
    }, [user]);

    const logout = useCallback(async () => {
        await endSession();

        try {
            await userWriteQueueRef.current;
        } catch (error) {
            console.warn('Learner progress could not be fully flushed before logout.', error);
        }

        try {
            await dal.auth.logout();
        } catch (error) {
            console.warn('Logout failed.', error);
        } finally {
            currentSessionRef.current = null;
            setUser(null);
            adminLookupVersionRef.current += 1;
            setIsAdmin(false);
            setAdminLoading(false);
        }
    }, [endSession]);

    const updateProgress = useCallback((sectionOrInteractiveId: string, type: 'section' | 'interactive') => {
        updateModuleProgress(currentModuleId, sectionOrInteractiveId, type);
    }, [currentModuleId, updateModuleProgress]);

    const userWithLegacyProgress = useMemo(() => {
        if (!user) {
            return null;
        }

        return {
            ...user,
            points: user.totalPoints,
            progress: user.modules[currentModuleId] ?? createDefaultModuleProgress(),
        };
    }, [currentModuleId, user]);

    const value: AuthContextType = {
        user: userWithLegacyProgress,
        loading,
        isAuthenticated: !!userWithLegacyProgress,
        isAdmin,
        adminLoading,
        refreshAdminStatus,
        login,
        signup,
        logout,
        updateModuleProgress,
        addPoints,
        updateLastViewedSection,
        resetModuleProgress,
        resetProgress: () => resetModuleProgress(currentModuleId),
        setModuleCertificate,
        getModuleProgress,
        startSession,
        trackSessionSection,
        endSession,
        updateProgress,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
