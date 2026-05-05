import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  updateProgress: (id: string, type: 'section' | 'interactive') => void;
  addPoints: (amount: number) => void;
  resetProgress: () => void;
  isResetting: boolean;
  // FIX: Add login and signup to the context type to resolve errors in LoginPage.tsx.
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'zenVanguardUser';

const defaultUser: User = {
  email: 'user@example.com',
  name: 'Zen Vanguard',
  picture: '',
  points: 0,
  progress: { completedSections: [], completedInteractives: [] },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(USER_STORAGE_KEY);
            if (storedData) {
                setUser(JSON.parse(storedData));
            } else {
                setUser(defaultUser);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultUser));
            }
        } catch (error) {
            console.error("Failed to access localStorage:", error);
            setUser(defaultUser);
        } finally {
            setLoading(false);
        }
    }, []);

    const addPoints = useCallback(async (amount: number) => {
        setUser(prevUser => {
            if (!prevUser) return null;
            const updatedUser = { ...prevUser, points: prevUser.points + amount };
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
            return updatedUser;
        });
    }, []);

    const updateProgress = useCallback(async (id: string, type: 'section' | 'interactive') => {
        setUser(prevUser => {
            if (!prevUser) return null;

            const newProgress = { ...prevUser.progress };
            let updated = false;
            let pointsToAdd = 0;

            if (type === 'section' && !newProgress.completedSections.includes(id)) {
                newProgress.completedSections.push(id);
                pointsToAdd = 10; // Award 10 points for viewing a section
                updated = true;
            } else if (type === 'interactive' && !newProgress.completedInteractives.includes(id)) {
                newProgress.completedInteractives.push(id);
                updated = true;
            }

            if (updated) {
                const updatedUser = { ...prevUser, progress: newProgress, points: prevUser.points + pointsToAdd };
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
                return updatedUser;
            }

            return prevUser;
        });
    }, []);

    const resetProgress = useCallback(() => {
        setIsResetting(true);
        setUser(prevUser => {
            if (!prevUser) return null;
            const resetUser: User = {
                ...prevUser,
                points: 0,
                progress: { completedSections: [], completedInteractives: [] },
            };
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(resetUser));
            return resetUser;
        });
        setTimeout(() => {
            setIsResetting(false);
        }, 1500);
    }, []);

    // FIX: Implement mock login and signup functions to resolve errors in the unused LoginPage component.
    const login = useCallback(async (email: string, _pass: string) => {
        // Mock login. In a real app, you'd call an API.
        // We'll just create a user object and save it.
        const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const loggedInUser: User = {
            email: email,
            name: name,
            picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
            points: 0,
            progress: { completedSections: [], completedInteractives: [] },
        };
        setUser(loggedInUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
    }, []);

    const signup = useCallback(async (email: string, pass: string) => {
        // Mock signup is same as login for this app.
        await login(email, pass);
    }, [login]);

    const value = { user, loading, updateProgress, addPoints, login, signup, resetProgress, isResetting };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};