import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Notebook from '../components/notebook/Notebook';
import ContentGallery from '../components/profile/ContentGallery';

const PioneerProfilePage: React.FC = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'notebook' | 'gallery'>('notebook');

    return (
        <div className="min-h-screen text-white relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 via-slate-950/80 to-slate-950 pointer-events-none" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">

                {/* Header Card */}
                <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:bg-white/[0.07] hover:border-white/20 hover:shadow-2xl hover:shadow-brand-primary/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar Section */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-brand-primary via-purple-500 to-cyan-500 animate-spin-slow">
                                <div className="bg-slate-950 w-full h-full rounded-full p-1">
                                    <img
                                        src={user?.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover border-2 border-white/10"
                                    />
                                </div>
                            </div>
                            <button
                                className="absolute bottom-1 right-1 p-2.5 bg-brand-primary text-white rounded-full shadow-lg shadow-brand-primary/40 hover:bg-brand-primary-light hover:scale-110 transition-all duration-300 group/edit"
                                title="Change Avatar"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-3 justify-center md:justify-start">
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-lg">
                                    {user?.name || 'Pioneer Command'}
                                </h1>
                                <span className="mb-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider glow-amber">
                                    Lvl {Math.floor((user?.totalPoints || 0) / 1000) + 1} Scout
                                </span>
                            </div>
                            <p className="text-gray-400 font-medium tracking-wide">{user?.email}</p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                <div className="p-4 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-sm">
                                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Total XP</p>
                                    <p className="font-mono text-2xl text-cyan-400 font-bold drop-shadow-cyan">{user?.totalPoints || 0}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-sm">
                                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Modules</p>
                                    <p className="font-mono text-2xl text-purple-400 font-bold drop-shadow-purple">
                                        {Object.values(user?.modules || {}).filter(m => m.completedSections.length > 0).length} <span className="text-gray-600 text-sm">/ 4</span>
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-sm">
                                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Streak</p>
                                    <div className="flex items-center gap-2 justify-center md:justify-start">
                                        <p className="font-mono text-2xl text-orange-400 font-bold drop-shadow-orange">3</p>
                                        <svg className="w-5 h-5 text-orange-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-sm">
                                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Rank</p>
                                    <p className="font-mono text-lg text-emerald-400 font-bold truncate">Nova I</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 min-w-[140px]">
                            <button className="px-5 py-2.5 bg-white text-black font-bold rounded-xl text-sm hover:bg-gray-200 hover:scale-105 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Edit Profile
                            </button>
                            <button onClick={logout} className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Tabs (Mobile) */}
                <div className="flex lg:hidden gap-2 bg-black/20 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('notebook')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'notebook' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Field Notebook
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'gallery' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Artifacts
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px] lg:min-h-[650px]">
                    {/* Notebook Column */}
                    <div className={`h-full ${activeTab === 'notebook' ? 'block' : 'hidden lg:block'} animate-slide-up`}>
                        <Notebook />
                    </div>

                    {/* Gallery Column */}
                    <div className={`h-full ${activeTab === 'gallery' ? 'block' : 'hidden lg:block'} animate-slide-up animation-delay-200`}>
                        <ContentGallery />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PioneerProfilePage;
