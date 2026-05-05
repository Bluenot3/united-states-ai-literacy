import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const MobileBottomNav: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { path: '/docs', label: 'Docs', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        { path: '/guide', label: 'Guide', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
        { path: '/hub', label: 'Programs', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { path: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ];

    if (location.pathname.includes('/module/')) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zen-gold/10 bg-zen-navy/95 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
            <div className="flex h-16 items-center justify-around">
                {navItems.map((item) => {
                    const isActive = item.path === '/hub'
                        ? location.pathname === '/hub' || location.pathname.startsWith('/programs/')
                        : location.pathname === item.path;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            aria-label={item.label}
                            className={`relative flex h-full w-full flex-col items-center justify-center transition-all duration-300 ${isActive ? 'text-zen-gold' : 'text-slate-500 hover:text-zen-gold/70'}`}
                        >
                            {/* Gold glow bar above active tab */}
                            {isActive && (
                                <span className="absolute left-1/2 top-0 h-[2px] w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-zen-gold/0 via-zen-gold to-zen-gold/0 animate-fade-in" />
                            )}
                            <svg className={`mb-1 h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                            <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-zen-gold' : ''}`}>{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
