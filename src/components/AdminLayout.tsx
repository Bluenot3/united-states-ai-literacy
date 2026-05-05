import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

const AdminLayout: React.FC = () => {
    const { adminLogout, stats, isAdminAuthenticated } = useAdmin();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    if (!isAdminAuthenticated) {
        return null;
    }

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
        { path: '/admin/students', label: 'Students', icon: 'people' },
        { path: '/admin/activity', label: 'Activity Log', icon: 'activity' },
        { path: '/admin/messages', label: 'Messages', icon: 'mail' },
        { path: '/admin/analytics', label: 'Analytics', icon: 'chart' },
        { path: '/admin/settings', label: 'Settings', icon: 'settings' },
    ];

    const icons: Record<string, React.ReactNode> = {
        dashboard: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        ),
        people: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
        activity: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        ),
        mail: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
        ),
        chart: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        ),
        settings: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    };

    const handleLogout = () => {
        adminLogout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-zen-navy flex">
            {/* Sidebar */}
            <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-[#080E1E]/90 backdrop-blur-xl border-r border-zen-gold/10 flex flex-col transition-all duration-300 relative flex-shrink-0`}>
                {/* Gold accent gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-zen-gold/5 via-transparent to-transparent pointer-events-none" />

                {/* Header */}
                <div className="p-5 border-b border-zen-gold/10 relative">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zen-gold to-amber-600 flex items-center justify-center shadow-lg shadow-zen-gold/30 flex-shrink-0">
                            <span className="text-zen-navy text-lg font-black">Z</span>
                        </div>
                        {!sidebarCollapsed && (
                            <div className="animate-fade-in min-w-0">
                                <h1 className="text-white font-black text-base tracking-wide">ZEN Admin</h1>
                                <p className="text-zen-gold/50 text-xs tracking-widest uppercase">Command Center</p>
                            </div>
                        )}
                    </div>

                    {/* Collapse button */}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0D1428] border border-zen-gold/20 rounded-full flex items-center justify-center text-slate-400 hover:text-zen-gold transition-colors"
                    >
                        <svg className={`w-3 h-3 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Quick Stats */}
                {!sidebarCollapsed && (
                    <div className="p-4 border-b border-zen-gold/10 animate-fade-in">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white/3 rounded-xl p-3 border border-zen-gold/10">
                                <p className="text-xs text-slate-500 tracking-wider">Students</p>
                                <p className="text-xl font-black text-white">{stats.totalStudents}</p>
                            </div>
                            <div className="bg-white/3 rounded-xl p-3 border border-white/5">
                                <p className="text-xs text-slate-500 tracking-wider">Active</p>
                                <p className="text-xl font-black text-green-400">{stats.activeToday}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-0.5 relative">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative
                                ${isActive
                                    ? 'bg-zen-gold/15 text-zen-gold border border-zen-gold/25'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }
                                ${sidebarCollapsed ? 'justify-center' : ''}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`transition-colors flex-shrink-0 ${isActive ? 'text-zen-gold' : 'group-hover:text-white'}`}>
                                        {icons[item.icon]}
                                    </span>
                                    {!sidebarCollapsed && (
                                        <span className="font-medium text-sm">{item.label}</span>
                                    )}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-zen-gold rounded-r-full" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Points display */}
                {!sidebarCollapsed && (
                    <div className="mx-3 mb-3 p-3 bg-gradient-to-r from-zen-gold/10 to-transparent rounded-xl border border-zen-gold/15">
                        <p className="text-xs text-zen-gold/60 tracking-widest uppercase mb-1">Total Points</p>
                        <p className="text-xl font-black text-zen-gold">{stats.totalPoints.toLocaleString()}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{stats.totalSectionsCompleted} sections · {stats.totalInteractivesCompleted} interactives</p>
                    </div>
                )}

                {/* Footer */}
                <div className="p-3 border-t border-zen-gold/10">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full ${sidebarCollapsed ? 'justify-center' : ''}`}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        {!sidebarCollapsed && <span className="font-medium text-sm">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-zen-navy">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
