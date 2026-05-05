import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface SidebarContextType {
    isCollapsed: boolean;
    toggle: () => void;
    collapse: () => void;
    expand: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
    isCollapsed: false,
    toggle: () => {},
    collapse: () => {},
    expand: () => {},
});

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    // Track whether the user has manually toggled the sidebar so we never fight their intent
    const userHasToggled = useRef(false);

    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
        // Default: collapsed on module pages, else use saved preference
        const saved = localStorage.getItem('zenSidebarCollapsed');
        if (saved !== null) return saved === 'true';
        return location.pathname.startsWith('/module/');
    });

    // Auto-collapse when entering a module page — but only if the user hasn't explicitly
    // expanded the sidebar themselves. This prevents the sidebar from fighting user intent.
    useEffect(() => {
        if (location.pathname.startsWith('/module/') && !userHasToggled.current) {
            setIsCollapsed(true);
        }
    }, [location.pathname]);

    const toggle = useCallback(() => {
        userHasToggled.current = true;
        setIsCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem('zenSidebarCollapsed', String(next));
            return next;
        });
    }, []);

    const collapse = useCallback(() => {
        userHasToggled.current = true;
        setIsCollapsed(true);
        localStorage.setItem('zenSidebarCollapsed', 'true');
    }, []);

    const expand = useCallback(() => {
        userHasToggled.current = true;
        setIsCollapsed(false);
        localStorage.setItem('zenSidebarCollapsed', 'false');
    }, []);

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggle, collapse, expand }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => useContext(SidebarContext);
