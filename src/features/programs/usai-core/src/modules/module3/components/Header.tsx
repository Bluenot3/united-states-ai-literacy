
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { GraduationCapIcon } from './icons/GraduationCapIcon';
import { LabsIcon } from './icons/LabsIcon';
import { RefreshIcon } from './icons/RefreshIcon';

const BrainIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M16 4C12 4 9 7 9 11C7 11 5 13 5 16C5 19 7 21 9 21V26C9 27.1 9.9 28 11 28H21C22.1 28 23 27.1 23 26V21C25 21 27 19 27 16C27 13 25 11 23 11C23 7 20 4 16 4Z" fill="url(#brainGrad)" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 4V28" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <path d="M12 10C13 11 14 12 14 14" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <path d="M20 10C19 11 18 12 18 14" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <defs>
            <linearGradient id="brainGrad" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10B981" />
                <stop offset="1" stopColor="#059669" />
            </linearGradient>
        </defs>
    </svg>
);

interface HeaderProps {
    completedSections: number;
    totalSections: number;
    onCommandPaletteToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ completedSections, totalSections, onCommandPaletteToggle }) => {
    const { user, resetProgress } = useAuth();
    const [pointAnims, setPointAnims] = useState<{ id: number; amount: number }[]>([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [xpAnimating, setXpAnimating] = useState(false);
    const [labsAnimating, setLabsAnimating] = useState(false);
    const [resetConfirming, setResetConfirming] = useState(false);
    const prevCompletedSections = useRef(completedSections);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getInitials = (name: string) => {
        if (!name) return 'ZV';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    useEffect(() => {
        const handlePointsAdded = (e: Event) => {
            const { amount } = (e as CustomEvent).detail;
            setPointAnims(prev => [...prev, { id: Date.now(), amount }]);
            setXpAnimating(true);
            setTimeout(() => setXpAnimating(false), 1200);
        };
        document.addEventListener('pointsAdded', handlePointsAdded);
        return () => document.removeEventListener('pointsAdded', handlePointsAdded);
    }, []);

    useEffect(() => {
        if (completedSections > prevCompletedSections.current) {
            setLabsAnimating(true);
            setTimeout(() => setLabsAnimating(false), 2000);
        }
        prevCompletedSections.current = completedSections;
    }, [completedSections]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                e.preventDefault();
                onCommandPaletteToggle();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCommandPaletteToggle]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isProfileOpen) {
            setResetConfirming(false);
        }
    }, [isProfileOpen]);

    const handleReset = () => {
        if (resetConfirming) {
            resetProgress();
            setIsProfileOpen(false);
            setResetConfirming(false);
        } else {
            setResetConfirming(true);
        }
    };

    return (
        <header className="zen-module-header w-full h-20 transition-all duration-500">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full gap-4">

                    {/* Left: Branding - Enhanced with animated glow */}
                    <div className="flex items-center gap-4 min-w-fit group cursor-default">
                        <div className="relative w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100/50 flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/30 group-hover:rotate-3 group-hover:border-emerald-200/50">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <BrainIcon className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <div className="flex items-center gap-4 relative">
                            <h1 className="text-lg font-bold text-slate-800 leading-tight tracking-tight font-sans transition-colors duration-300 group-hover:text-emerald-700">
                                ZEN <span className="font-light text-slate-500 group-hover:text-emerald-500/70 transition-colors duration-300">VANGUARD</span>
                            </h1>
                            {/* Animated underline on hover */}
                            <div className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 w-0 group-hover:w-full transition-all duration-500 ease-out rounded-full" />
                            <div className="h-4 w-px bg-slate-300 hidden sm:block transition-colors duration-300 group-hover:bg-emerald-300"></div>
                            <span className="text-[11px] font-bold text-emerald-600 tracking-widest uppercase hidden sm:block animate-pulse-slow">MODULE 3</span>
                        </div>
                    </div>

                    {/* Center: Search */}
                    <div className="flex-1 max-w-2xl px-4 hidden md:block">
                        <div
                            className="relative group cursor-text transition-all duration-300 hover:-translate-y-0.5"
                            onClick={onCommandPaletteToggle}
                        >
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors duration-300" />
                            </div>
                            <input
                                type="text"
                                readOnly
                                placeholder="Ask Gemma 3..."
                                className="block w-full pl-11 pr-12 py-2.5 border border-slate-200/60 rounded-full leading-5 bg-slate-50/50 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white/80 transition-all duration-300 shadow-sm hover:bg-white/80 hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer text-sm backdrop-blur-md"
                            />
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                <span className="text-slate-400 border border-slate-200/60 rounded px-2 py-0.5 text-xs font-sans bg-white/60 shadow-sm mr-1 group-hover:border-emerald-200 group-hover:text-emerald-500 transition-colors">/</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats & Profile */}
                    <div className="flex items-center gap-3 sm:gap-6 min-w-fit">
                        {user && (
                            <>
                                {/* XP Pill - Enhanced with glow breathe and spring animations */}
                                <div className={`hidden sm:flex items-center gap-3 bg-white border border-slate-100 rounded-full pl-1.5 pr-5 py-1.5 shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] cursor-default group relative overflow-hidden btn-press ${xpAnimating ? 'border-emerald-400/50 ring-2 ring-emerald-400/30 shadow-emerald-400/20 shadow-lg' : ''}`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-50/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                                    <div className={`w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 transition-all duration-300 relative z-10 ${xpAnimating ? 'border-emerald-400/50 bg-emerald-50 scale-110' : 'group-hover:border-emerald-300/50 group-hover:bg-emerald-50/50'}`}>
                                        <GraduationCapIcon
                                            className={`w-5 h-5 transition-all duration-300 ${xpAnimating ? 'text-emerald-500 scale-110' : 'text-slate-600 group-hover:text-emerald-500'}`}
                                            isAnimating={xpAnimating}
                                        />
                                    </div>
                                    <div className="relative flex flex-col leading-none z-10">
                                        <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mb-0.5 transition-colors duration-300 group-hover:text-emerald-400">XP</span>
                                        <span className={`text-sm font-bold tabular-nums transition-all duration-300 ${xpAnimating ? 'text-emerald-500 scale-110 animate-rubber-band' : 'text-slate-800'}`}>{user.points}</span>
                                        {pointAnims.map(anim => (
                                            <span
                                                key={anim.id}
                                                onAnimationEnd={() => setPointAnims(prev => prev.filter(p => p.id !== anim.id))}
                                                className="absolute top-0 left-full ml-2 font-bold text-emerald-500 text-xs animate-float-up-fade whitespace-nowrap drop-shadow-sm"
                                            >
                                                +{anim.amount}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Labs Pill - with shimmer and intricate icon */}
                                <div className={`hidden sm:flex items-center gap-3 bg-white border border-slate-100 rounded-full pl-1.5 pr-5 py-1.5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default group relative overflow-hidden ${labsAnimating ? 'border-teal-300/50 ring-2 ring-teal-200' : ''}`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:animate-shimmer pointer-events-none"></div>
                                    <div className={`w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 transition-colors relative z-10 ${labsAnimating ? 'border-teal-300 bg-teal-50' : 'group-hover:border-teal-200'}`}>
                                        <LabsIcon
                                            className={`w-5 h-5 transition-colors ${labsAnimating ? 'text-teal-500' : 'text-slate-600 group-hover:text-teal-500'}`}
                                            isAnimating={labsAnimating}
                                        />
                                    </div>
                                    <div className="flex flex-col leading-none z-10">
                                        <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mb-0.5">LABS</span>
                                        <span className="text-sm font-bold text-slate-800 tabular-nums">
                                            {completedSections} <span className="text-slate-300 font-normal text-xs">/ {totalSections}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>

                                {/* Profile Avatar */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="relative group cursor-pointer focus:outline-none"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white transition-transform group-hover:scale-105">
                                            {getInitials(user.name)}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    </button>

                                    {/* Dropdown - Enhanced with spring animation and depth */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100/80 py-1 animate-spring-in overflow-hidden z-50 origin-top-right">
                                            {/* Subtle gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
                                            <div className="relative px-4 py-3 border-b border-slate-100/50 bg-gradient-to-r from-slate-50/80 to-slate-100/50">
                                                <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                            <div className="relative py-1">
                                                <button
                                                    onClick={handleReset}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center gap-2 ${resetConfirming
                                                        ? 'bg-red-500 text-white font-bold hover:bg-red-600 shadow-inner'
                                                        : 'text-red-500 hover:bg-red-50 hover:text-red-600 active:scale-[0.98]'
                                                        }`}
                                                >
                                                    <RefreshIcon className={`w-4 h-4 transition-transform duration-300 ${resetConfirming ? 'text-white animate-spin-slow' : 'group-hover:rotate-180'}`} />
                                                    {resetConfirming ? 'Confirm Reset?' : 'Reset Progress'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
