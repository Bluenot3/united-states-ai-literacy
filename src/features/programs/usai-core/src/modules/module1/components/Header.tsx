
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { GraduationCapIcon } from './icons/GraduationCapIcon';
import { LabsIcon } from './icons/LabsIcon';
import { RefreshIcon } from './icons/RefreshIcon';

const BlueBoltIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M18.5 2L6 18H16L13.5 30L26 14H16L18.5 2Z" fill="url(#paint0_linear_bolt)" />
        <defs>
            <linearGradient id="paint0_linear_bolt" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" />
                <stop offset="1" stopColor="#60A5FA" />
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
            setTimeout(() => setXpAnimating(false), 1200); // Sync with animation duration
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

                    {/* Left: Branding */}
                    <div className="flex items-center gap-4 min-w-fit group cursor-default">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover:scale-105 group-hover:shadow-md">
                            <BlueBoltIcon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-lg font-bold text-slate-800 leading-tight tracking-tight font-sans">
                                ZEN <span className="font-light text-slate-500">VANGUARD</span>
                            </h1>
                            <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
                            <span className="text-[11px] font-bold text-blue-600 tracking-widest uppercase hidden sm:block">MODULE 1</span>
                        </div>
                    </div>

                    {/* Center: Search */}
                    <div className="flex-1 max-w-2xl px-4 hidden md:block">
                        <div
                            className="relative group cursor-text"
                            onClick={onCommandPaletteToggle}
                        >
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                readOnly
                                placeholder="Ask Gemma 3..."
                                className="block w-full pl-11 pr-12 py-2.5 border border-slate-200 rounded-full leading-5 bg-slate-50/50 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all shadow-sm hover:bg-white hover:shadow-md cursor-pointer text-sm backdrop-blur-sm"
                            />
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                <span className="text-slate-400 border border-slate-200 rounded px-2 py-0.5 text-xs font-sans bg-white shadow-sm mr-1">/</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats & Profile */}
                    <div className="flex items-center gap-3 sm:gap-6 min-w-fit">
                        {user && (
                            <>
                                {/* XP Pill - with shimmer and intricate icon */}
                                <div className={`hidden sm:flex items-center gap-3 bg-white border border-slate-100 rounded-full pl-1.5 pr-5 py-1.5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default group relative overflow-hidden ${xpAnimating ? 'border-brand-primary/30 ring-2 ring-brand-primary/20' : ''}`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:animate-shimmer pointer-events-none"></div>
                                    <div className={`w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 transition-colors relative z-10 ${xpAnimating ? 'border-brand-primary/50 bg-brand-primary/5' : 'group-hover:border-brand-secondary/50'}`}>
                                        <GraduationCapIcon
                                            className={`w-5 h-5 transition-colors ${xpAnimating ? 'text-brand-primary' : 'text-slate-600 group-hover:text-brand-primary'}`}
                                            isAnimating={xpAnimating}
                                        />
                                    </div>
                                    <div className="relative flex flex-col leading-none z-10">
                                        <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mb-0.5">XP</span>
                                        <span className={`text-sm font-bold tabular-nums transition-colors duration-300 ${xpAnimating ? 'text-brand-primary scale-110' : 'text-slate-800'}`}>{user.points}</span>
                                        {pointAnims.map(anim => (
                                            <span
                                                key={anim.id}
                                                onAnimationEnd={() => setPointAnims(prev => prev.filter(p => p.id !== anim.id))}
                                                className="absolute top-0 left-full ml-2 font-bold text-green-500 text-xs animate-float-up-fade whitespace-nowrap"
                                            >
                                                +{anim.amount}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Labs Pill - with shimmer and intricate icon */}
                                <div className={`hidden sm:flex items-center gap-3 bg-white border border-slate-100 rounded-full pl-1.5 pr-5 py-1.5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default group relative overflow-hidden ${labsAnimating ? 'border-orange-300/50 ring-2 ring-orange-200' : ''}`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:animate-shimmer pointer-events-none"></div>
                                    <div className={`w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 transition-colors relative z-10 ${labsAnimating ? 'border-orange-300 bg-orange-50' : 'group-hover:border-orange-200'}`}>
                                        <LabsIcon
                                            className={`w-5 h-5 transition-colors ${labsAnimating ? 'text-orange-500' : 'text-slate-600 group-hover:text-orange-500'}`}
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
                                        <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white transition-transform group-hover:scale-105">
                                            {getInitials(user.name)}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    </button>

                                    {/* Dropdown */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-slate-100 py-1 animate-fade-in overflow-hidden z-50 origin-top-right">
                                            <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                                                <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <button
                                                    onClick={handleReset}
                                                    className={`w-full text-left px-4 py-2 text-sm transition-all flex items-center gap-2 ${resetConfirming
                                                            ? 'bg-red-600 text-white font-bold hover:bg-red-700'
                                                            : 'text-red-600 hover:bg-red-50 hover:underline'
                                                        }`}
                                                >
                                                    <RefreshIcon className={`w-4 h-4 ${resetConfirming ? 'text-white' : ''}`} />
                                                    {resetConfirming ? 'Reset?' : 'Reset Progress'}
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
