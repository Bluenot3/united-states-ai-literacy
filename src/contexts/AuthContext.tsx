import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { ModuleProgress, SessionRecord, User } from '../types';
import { dal } from '../services/dal';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<{ requiresConfirmation: boolean }>;
    logout: () => Promise<void>;
    updateModuleProgress: (moduleId: 1 | 2 | 3 | 4, sectionId: string, type: 'section' | 'interactive') => void;
    addPoints: (...args: [1 | 2 | 3 | 4, number] | [number]) => void;
    updateLastViewedSection: (moduleId: 1 | 2 | 3 | 4, sectionId: string) => void;
    resetModuleProgress: (moduleId: 1 | 2 | 3 | 4) => void;
    resetProgress: () => void;
    setModuleCertificate: (moduleId: 1 | 2 | 3 | 4, certId: string, hash: string) => void;
    setFinalCertification: (certId: string, hash: string) => void;
    getModuleProgress: (moduleId: 1 | 2 | 3 | 4) => ModuleProgress;
    startSession: (moduleId: number) => void;
    endSession: () => void;
    updateProgress: (sectionOrInteractiveId: string, type: 'section' | 'interactive') => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PREVIEW_USER_STORAGE_KEY = 'zenPreviewUser';
const PREVIEW_ACCESS_ENABLED = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_LOGIN === 'true';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const currentModuleId = getModuleIdFromPath(location.pathname);

    const [user, setUser] = useState<User | null>(() => (PREVIEW_ACCESS_ENABLED ? readPreviewUser() : null));
    const [loading, setLoading] = useState(true);
    const [currentSession, setCurrentSession] = useState<{
        moduleId: number;
        startedAt: string;
        sectionsViewed: string[];
    } | null>(null);

    useEffect(() => {
        let mounted = true;

        if (PREVIEW_ACCESS_ENABLED) {
            setUser((previous) => previous ?? readPreviewUser());
            setLoading(false);
        }

        const unsubscribe = dal.auth.onAuthStateChanged((incomingUser: User | null) => {
            if (!mounted) {
                return;
            }

            if (incomingUser) {
                setUser(normalizeUser(incomingUser));
            } else if (PREVIEW_ACCESS_ENABLED) {
                setUser(readPreviewUser());
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const updateUserState = useCallback((updater: (prevUser: User) => User | null) => {
        setUser((prevUser) => {
            const baseUser = prevUser ?? (PREVIEW_ACCESS_ENABLED ? readPreviewUser() : null);

            if (!baseUser) {
                return null;
            }

            const nextUser = updater(baseUser);
            const userId = dal.auth.getUserId();

            if (nextUser && userId) {
                void dal.user.updateUser(userId, nextUser).catch(console.error);
            }

            return nextUser;
        });
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            await dal.auth.login(email, password);
            // Auth state change will be handled by onAuthStateChanged listener
        } catch (error) {
            throw error;
        }
    }, []);

    const signup = useCallback(async (email: string, password: string) => {
        return await dal.auth.signup(email, password);
    }, []);

    const updateModuleProgress = useCallback((
        moduleId: 1 | 2 | 3 | 4,
        id: string,
        type: 'section' | 'interactive'
    ) => {
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

            if (currentSession) {
                setCurrentSession((previousSession) => previousSession ? {
                    ...previousSession,
                    sectionsViewed: [...new Set([...previousSession.sectionsViewed, id])],
                } : null);
            }

            return {
                ...prevUser,
                modules: {
                    ...prevUser.modules,
                    [moduleId]: moduleProgress,
                },
            };
        });
    }, [currentSession, updateUserState]);

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

    const setModuleCertificate = useCallback((moduleId: 1 | 2 | 3 | 4, certId: string, hash: string) => {
        updateUserState((prevUser) => ({
            ...prevUser,
            modules: {
                ...prevUser.modules,
                [moduleId]: {
                    ...prevUser.modules[moduleId],
                    completedAt: new Date().toISOString(),
                    certificateId: certId,
                    certificateHash: hash,
                },
            },
        }));
    }, [updateUserState]);

    const setFinalCertification = useCallback((certId: string, hash: string) => {
        updateUserState((prevUser) => ({
            ...prevUser,
            finalCertificationId: certId,
            finalCertificationHash: hash,
        }));
    }, [updateUserState]);

    const getModuleProgress = useCallback((moduleId: 1 | 2 | 3 | 4): ModuleProgress => {
        if (!user) {
            return createDefaultModuleProgress();
        }

        return user.modules[moduleId] ?? createDefaultModuleProgress();
    }, [user]);

    const startSession = useCallback((moduleId: number) => {
        setCurrentSession({
            moduleId,
            startedAt: new Date().toISOString(),
            sectionsViewed: [],
        });
    }, []);

    const endSession = useCallback(() => {
        if (!currentSession || !user) {
            return;
        }

        const sessionRecord: SessionRecord = {
            startedAt: currentSession.startedAt,
            endedAt: new Date().toISOString(),
            moduleId: currentSession.moduleId,
            sectionsViewed: currentSession.sectionsViewed,
        };

        updateUserState((prevUser) => ({
            ...prevUser,
            sessionHistory: [...(prevUser.sessionHistory || []), sessionRecord],
        }));

        setCurrentSession(null);
    }, [currentSession, updateUserState, user]);

    const logout = useCallback(async () => {
        if (currentSession) {
            endSession();
        }

        try {
            await dal.auth.logout();
        } catch (error) {
            console.warn('Logout failed.', error);
        } finally {
            setCurrentSession(null);
            setUser(null);
        }
    }, [currentSession, endSession]);

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
        login,
        signup,
        logout,
        updateModuleProgress,
        addPoints,
        updateLastViewedSection,
        resetModuleProgress,
        resetProgress: () => resetModuleProgress(currentModuleId),
        setModuleCertificate,
        setFinalCertification,
        getModuleProgress,
        startSession,
        endSession,
        updateProgress,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
