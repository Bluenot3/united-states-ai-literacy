import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
// ScrollProgressBar removed (unused)
import { GraduationCapIcon } from './icons/GraduationCapIcon';
import { LabIcon } from './icons/LabIcon';
import MagicZIcon from './icons/MagicZIcon';
import { getAiClient } from '../services/aiService';
import { curriculumData } from '../data/curriculumData';
import { Type } from '@google/genai';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';

// Standardized Props Interface matching Module3Page usage
interface HeaderProps {
    completedSections: number;
    totalSections: number;
    onCommandPaletteToggle: () => void;
    onMenuClick?: () => void; // Optional for mobile sidebar toggle if needed
}

interface SearchResult {
    answer: string;
    relevantSections: {
        id: string;
        title: string;
        reason: string;
    }[];
}

// --- Slot Machine Animation Components ---

const SlotDigit: React.FC<{ value: string }> = ({ value }) => {
    const isNumber = !isNaN(parseInt(value));
    if (!isNumber) return <span className="font-mono text-inherit font-bold">{value}</span>;

    const digit = parseInt(value);

    return (
        <div className="relative h-[1em] w-[0.6em] overflow-hidden inline-block align-bottom -mb-[0.05em]">
            <div
                className="absolute top-0 left-0 flex flex-col transition-transform duration-[800ms] cubic-bezier(0.2, 1, 0.3, 1)"
                style={{ transform: `translateY(-${digit * 10}%)` }}
            >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <div key={num} className="h-[1em] flex items-center justify-center font-mono text-inherit tabular-nums font-bold">
                        {num}
                    </div>
                ))}
            </div>
        </div>
    );
};

const SlotCounter: React.FC<{ value: number | string | undefined | null; minDigits?: number }> = ({ value = 0, minDigits = 1 }) => {
    const safeValue = value ?? 0;
    const valueStr = safeValue.toString().padStart(minDigits, '0');
    const digits = valueStr.split('');

    return (
        <div className="flex items-center overflow-hidden leading-none relative">
            {digits.map((digit, index) => (
                <SlotDigit key={index} value={digit} />
            ))}
        </div>
    );
};

// --- Main Header Component ---

const Header: React.FC<HeaderProps> = ({ completedSections, totalSections, onCommandPaletteToggle, onMenuClick }) => {
    const { user, resetProgress } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
    const [showSearch, setShowSearch] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isResetConfirm, setIsResetConfirm] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Use passed props for sections instead of calculating locally if possible, 
    // but to support the advanced "SubSection" count logic of M4, we can keep the local calculation 
    // OR use the props. M3 Header uses props for simple section counts. 
    // Let's stick to the visual consistency of M3 but keep the M4 data logic for "Labs" if preferred,
    // OR just use the props to match the M3 style exactly.
    // The user wants it to look like M3. M3 shows "completedSections / totalSections".
    // M4 showing "completedSubSections" might be confusing. 
    // I will use the PROPS (Top Level Sections) to be consistent with the Sidebar.

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchResults(null);
        setShowSearch(true);

        try {
            const ai = await getAiClient();
            const context = curriculumData.sections.map(s =>
                `SECTION [${s.id}]: ${s.title}\n` +
                (s.content.filter(c => c.type === 'paragraph').map(c => c.content).join(' ').substring(0, 300) + '...')
            ).join('\n\n');

            const prompt = `You are "Gemma 3", an advanced AI tutor for the ZEN VANGUARD Module 4 curriculum.
          Curriculum Context: ${context}
          User Question: "${searchQuery}"
          Output strictly JSON.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            answer: { type: Type.STRING },
                            relevantSections: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING },
                                        title: { type: Type.STRING },
                                        reason: { type: Type.STRING }
                                    }
                                }
                            }
                        },
                        required: ['answer', 'relevantSections']
                    }
                }
            });

            const result = JSON.parse(response.text);
            setSearchResults(result);

        } catch (error) {
            console.error("Search failed", error);
            setSearchResults({
                answer: "Gemma 3 is momentarily unavailable.",
                relevantSections: []
            });
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearch(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
                setIsResetConfirm(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLinkClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            setShowSearch(false);
        }
    };

    const handleResetClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isResetConfirm) {
            resetProgress();
            setIsProfileOpen(false);
            setIsResetConfirm(false);
            window.scrollTo({ top: 0, behavior: 'auto' });
        } else {
            setIsResetConfirm(true);
        }
    };

    return (
        <header className="zen-module-header transition-all duration-500">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-20">
                <div className="flex items-center justify-between h-full gap-4">

                    {/* LEFT: Branding */}
                    <div className="flex items-center gap-4 min-w-fit group cursor-default">
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 -ml-2 text-brand-text hover:text-brand-primary transition-colors rounded-lg hover:bg-slate-100/50"
                            aria-label="Open Menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="relative group cursor-pointer flex items-center gap-4 select-none">
                            <div className="relative">
                                <MagicZIcon className="w-10 h-10 drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-brand-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <div className="flex flex-col justify-center hidden sm:flex">
                                <h1 className="text-lg font-extrabold tracking-tight text-slate-800 leading-none font-sans transition-colors group-hover:text-brand-primary">
                                    ZEN <span className="font-light text-slate-400">VANGUARD</span>
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="h-0.5 w-6 bg-gradient-to-r from-red-500 via-purple-500 to-indigo-500 rounded-full"></span>
                                    <span className="text-[10px] font-bold tracking-[0.25em] text-red-500 uppercase">Module 4</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CENTER: Search Bar (Command Palette Trigger) */}
                    <div className="flex-1 max-w-2xl px-4 hidden md:block">
                        {/* We use the simple trigger here to match Module 3's style if preferred, OR keep the AI search. 
                         User said "reference Module 1-3". M1-3 use Command Palette trigger.
                         M4 has this custom AI search.
                         I will KEEP M4's AI Search but style it to look integrated, 
                         AND add the Command Palette trigger on '/' key which is passed via props.
                     */}
                        <div className="relative group" onClick={onCommandPaletteToggle}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-hover:text-brand-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                readOnly
                                placeholder="Search or Ask Gemma 3..." // Hybrid hint
                                className="block w-full pl-11 pr-12 py-2.5 border border-slate-200 rounded-full leading-5 bg-slate-50/50 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white transition-all shadow-sm hover:bg-white hover:shadow-md cursor-pointer text-sm backdrop-blur-sm"
                            />
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                <span className="text-slate-400 border border-slate-200 rounded px-2 py-0.5 text-xs font-sans bg-white shadow-sm mr-1">/</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: User HUD */}
                    {user && (
                        <div className="flex items-center gap-3 sm:gap-6 min-w-fit">

                            {/* XP Pill - Enhanced */}
                            <div className="hidden lg:flex items-center bg-gradient-to-r from-white to-slate-50 border border-slate-200/80 rounded-2xl pl-1.5 pr-5 py-1.5 shadow-md shadow-slate-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-200/30 hover:-translate-y-1 hover:border-emerald-200 cursor-default group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center border border-emerald-100/50 text-emerald-600 group-hover:text-emerald-500 transition-all duration-300 group-hover:scale-105">
                                    <GraduationCapIcon className="w-5 h-5" />
                                </div>
                                <div className="relative flex flex-col items-start ml-3">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none group-hover:text-emerald-500 transition-colors">XP</span>
                                    <div className="text-sm font-bold text-slate-800 leading-none mt-0.5">
                                        <SlotCounter value={user.totalPoints} />
                                    </div>
                                </div>
                            </div>

                            {/* Labs Pill - Enhanced */}
                            <div className="hidden lg:flex items-center bg-gradient-to-r from-white to-amber-50/50 border border-slate-200/80 rounded-2xl pl-1.5 pr-5 py-1.5 shadow-md shadow-slate-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-200/30 hover:-translate-y-1 hover:border-amber-200 cursor-default group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-50 to-white flex items-center justify-center border border-amber-100/50 text-amber-600 group-hover:text-amber-500 transition-all duration-300 group-hover:scale-105">
                                    <LabIcon />
                                </div>
                                <div className="relative flex flex-col items-start ml-3">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none group-hover:text-amber-500 transition-colors">Labs</span>
                                    <div className="text-sm font-bold text-slate-800 leading-none mt-0.5 flex items-center gap-0.5">
                                        <SlotCounter value={completedSections} />
                                        <span className="text-slate-300 font-light">/</span>
                                        <span className="text-slate-400 text-xs">{totalSections}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>

                            {/* User Avatar */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="relative group cursor-pointer focus:outline-none"
                                >
                                    <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white transition-transform group-hover:scale-105">
                                        {user.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-10"></div>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute top-full right-0 mt-3 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in ring-1 ring-black/5 overflow-hidden transform origin-top-right">
                                        <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50">
                                            <p className="font-bold text-sm text-slate-800">{user.name}</p>
                                            <p className="text-xs text-slate-500 truncate font-mono mt-0.5">{user.email}</p>
                                        </div>
                                        <div className="p-2">
                                            <button
                                                onClick={handleResetClick}
                                                className={`w-full text-left px-4 py-2 text-xs font-medium rounded-xl transition-all duration-200 flex items-center gap-3
                                                ${isResetConfirm
                                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                        : 'text-slate-600 hover:bg-slate-50 hover:text-brand-primary'
                                                    }`}
                                            >
                                                {isResetConfirm ? 'Confirm Reset?' : 'Reset Progress'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
