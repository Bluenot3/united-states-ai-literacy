
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ScrollProgressBar from './ScrollProgressBar';
import { SearchIcon } from './icons/SearchIcon';
import { CubeIcon } from './icons/CubeIcon';
import { CubeOutlineIcon } from './icons/CubeOutlineIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { curriculumData } from '../data/curriculumData';
import type { Section } from '../types';
import { getAiClient } from '../services/aiService';
import { Type } from '@google/genai';

// Utility to count total sections, including nested subsections
const countSections = (sections: Section[]): number => {
    let count = 0;
    sections.forEach(section => {
        count++; // Count the parent section
        if (section.subSections) {
            count += countSections(section.subSections);
        }
    });
    return count;
};
const totalSections = countSections(curriculumData.sections);

interface SearchResult {
    sectionId: string;
    title: string;
    reasoning: string;
}

const VanguardLogo = () => (
    <div className="flex items-center gap-5 group cursor-pointer select-none">
        {/* Official Animated Orb Container */}
        <div className="relative w-14 h-14 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-105">

            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-brand-primary/20 rounded-full blur-xl group-hover:bg-brand-primary/40 transition-colors duration-500"></div>

            {/* Outer Ring - Slow Rotation */}
            <div className="absolute inset-0 rounded-full border-2 border-brand-primary/10 border-t-brand-primary/60 animate-[spin_8s_linear_infinite]"></div>

            {/* Middle Ring - Medium Rotation Reverse */}
            <div className="absolute inset-2 rounded-full border-2 border-purple-400/10 border-b-purple-400/60 animate-[spin_5s_linear_infinite_reverse]"></div>

            {/* Inner Ring - Fast Rotation */}
            <div className="absolute inset-4 rounded-full border-2 border-blue-400/10 border-l-blue-400/80 animate-[spin_3s_linear_infinite]"></div>

            {/* Glowing Core */}
            <div className="relative w-3 h-3 rounded-full bg-gradient-to-br from-white to-brand-primary shadow-[0_0_15px_2px_rgba(139,92,246,0.5)] animate-pulse"></div>

            {/* Glassy Overlay for polish */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>

        <div className="flex flex-col justify-center h-14">
            <span className="text-3xl font-black tracking-tighter text-gray-900 leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-primary group-hover:to-purple-600 transition-all duration-300 drop-shadow-sm">
                ZEN<span className="text-brand-primary group-hover:text-inherit">VANGUARD</span>
            </span>
            <div className="flex items-center gap-2 mt-1.5">
                <div className="h-[2px] w-5 bg-brand-primary rounded-full"></div>
                <span className="text-[0.65rem] font-bold tracking-[0.35em] uppercase text-gray-400 leading-none group-hover:text-brand-text transition-colors">Module 2</span>
            </div>
        </div>
    </div>
);

const Header: React.FC = () => {
    const { user, resetProgress } = useAuth();
    const [isResetPopupOpen, setIsResetPopupOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const completedSections = user?.progress.completedSections.length || 0;

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }

    const handleReset = () => {
        resetProgress();
        setIsResetPopupOpen(false);
        // Safe scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setIsSearchOpen(true);
        setSearchResults([]);

        try {
            const ai = await getAiClient();

            const context = curriculumData.sections.map(s => ({
                id: s.id,
                title: s.title,
                subSections: s.subSections?.map(sub => ({ id: sub.id, title: sub.title, contentPreview: sub.content.map(c => typeof c.content === 'string' ? c.content.substring(0, 50) : '').join(' ') }))
            }));

            const prompt = `You are a smart search engine for the "ZEN VANGUARD Module 2" curriculum.
          
          Curriculum Structure: ${JSON.stringify(context)}
          
          User Query: "${searchQuery}"
          
          Find the most relevant sections (up to 4) that answer or relate to the query. Return a JSON object.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            results: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        sectionId: { type: Type.STRING, description: "The exact ID of the matching section" },
                                        title: { type: Type.STRING, description: "The title of the section" },
                                        reasoning: { type: Type.STRING, description: "A brief explanation of why this section matches the query" }
                                    },
                                    required: ["sectionId", "title", "reasoning"]
                                }
                            }
                        }
                    }
                }
            });

            const data = JSON.parse(response.text);
            setSearchResults(data.results || []);

        } catch (error) {
            console.error("Search failed:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleNavigate = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            // Manual scroll calculation to avoid browser jumpiness with scrollIntoView/pushState
            const headerOffset = 120;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <>
            <header className="zen-module-header transition-all duration-500">
                <ScrollProgressBar />
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-28">
                        {/* Left: Custom Logo */}
                        <div className="flex-shrink-0 transition-transform hover:scale-[1.02] duration-500 ease-out">
                            <VanguardLogo />
                        </div>

                        {/* Center: Premium Search */}
                        <div className="flex-1 flex justify-center px-8 lg:px-20 relative z-50">
                            <div className="w-full max-w-2xl relative group">
                                {/* Search Bar Glow */}
                                <div className={`absolute -inset-1 bg-gradient-to-r from-brand-primary via-purple-400 to-brand-primary rounded-2xl opacity-0 group-hover:opacity-20 transition duration-700 blur-xl ${isSearchOpen ? 'opacity-40' : ''}`}></div>

                                <form onSubmit={handleSearch} className={`relative bg-white/90 backdrop-blur-xl rounded-2xl flex items-center p-1.5 shadow-lg shadow-gray-200/50 ring-1 transition-all duration-300 ${isSearchOpen ? 'ring-brand-primary/40 scale-[1.01] shadow-brand-primary/10' : 'ring-black/5 hover:ring-black/10'}`}>
                                    <div className="pl-4 pr-3 text-brand-primary">
                                        {isSearching ? (
                                            <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
                                        ) : (
                                            <div className="text-brand-primary/80">
                                                <SparklesIcon />
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Ask Gemma 3..."
                                        className="block w-full bg-transparent border-none py-3 pl-1 pr-12 text-gray-800 placeholder-gray-400 focus:ring-0 text-base font-medium tracking-tight"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-1.5 flex items-center">
                                        <button type="submit" className="p-2.5 bg-gray-50 hover:bg-brand-primary hover:text-white text-gray-400 rounded-xl transition-all duration-300 group-hover:shadow-md">
                                            <SearchIcon />
                                        </button>
                                    </div>
                                </form>

                                {/* Search Results Dropdown */}
                                {isSearchOpen && (
                                    <div className="absolute top-[calc(100%+1rem)] left-0 right-0 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 ring-1 ring-black/5 overflow-hidden animate-fade-in-up origin-top z-50">
                                        <div className="flex justify-between items-center p-5 border-b border-gray-100/80 bg-gray-50/30">
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex h-2.5 w-2.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Powered by Gemini</span>
                                            </div>
                                            <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                                <CloseIcon />
                                            </button>
                                        </div>
                                        <div className="max-h-[450px] overflow-y-auto liquid-scrollbar p-3">
                                            {isSearching ? (
                                                <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-4">
                                                    <div className="w-10 h-10 border-2 border-gray-100 border-t-brand-primary rounded-full animate-spin"></div>
                                                    <span className="text-xs font-medium tracking-wide animate-pulse">Analyzing curriculum...</span>
                                                </div>
                                            ) : searchResults.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {searchResults.map((result, idx) => (
                                                        <li key={idx}>
                                                            <button
                                                                onClick={() => handleNavigate(result.sectionId)}
                                                                className="w-full text-left p-5 rounded-2xl hover:bg-gray-50/80 transition-all duration-200 group border border-transparent hover:border-gray-100"
                                                            >
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="font-bold text-gray-800 group-hover:text-brand-primary transition-colors">{result.title}</span>
                                                                    <span className="text-[9px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-md group-hover:bg-brand-primary group-hover:text-white transition-colors uppercase tracking-wide">Go</span>
                                                                </div>
                                                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{result.reasoning}</p>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="py-16 text-center opacity-50">
                                                    <p className="text-gray-900 font-bold">No matches found</p>
                                                    <p className="text-xs text-gray-500 mt-1">Try a different keyword</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: User Stats & Profile */}
                        {user && (
                            <div className="flex items-center gap-6">
                                {/* Stats Pill */}
                                <div className="hidden xl:flex items-center bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-1.5 pr-5 gap-4 shadow-lg shadow-gray-100 hover:shadow-xl transition-all duration-300 ring-1 ring-black/5 group">
                                    <div className="flex items-center gap-3 pl-2 border-r border-gray-200/50 pr-4">
                                        <div className="text-brand-primary transform group-hover:scale-110 transition-transform">
                                            <CubeIcon />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Score</span>
                                            <span className="text-lg font-black text-gray-800 leading-none tabular-nums">{user?.points || 0}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-gray-400">
                                            <CubeOutlineIcon />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Progress</span>
                                            <span className="text-lg font-black text-gray-800 leading-none tabular-nums">{completedSections}<span className="text-gray-300 text-sm font-medium">/{totalSections}</span></span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 hidden sm:block border border-transparent hover:border-red-100"
                                    title="Reset Progress"
                                    onClick={() => setIsResetPopupOpen(true)}
                                >
                                    <RefreshIcon />
                                </button>

                                {/* Profile */}
                                <div className="flex items-center gap-3 pl-2 relative">
                                    <div className="relative cursor-pointer group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-tr from-brand-primary to-purple-400 rounded-full blur opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                                        <div className="relative h-12 w-12 rounded-full bg-white p-1 shadow-md ring-1 ring-gray-100 group-hover:ring-0 transition-all">
                                            <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                                {user.picture ? (
                                                    <img src={user.picture} alt={user.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-brand-primary font-black text-sm">{getInitials(user.name)}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm z-20"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Overlay */}
            {(isResetPopupOpen || isSearchOpen) && (
                <div
                    className="fixed inset-0 bg-white/60 backdrop-blur-md z-30 transition-all duration-500 animate-fade-in"
                    onClick={() => { setIsResetPopupOpen(false); setIsSearchOpen(false); }}
                />
            )}

            {/* Reset Popup */}
            {isResetPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-xs w-full text-center transform transition-all animate-fade-in-up pointer-events-auto border border-white/80 ring-1 ring-black/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-red-50/80 to-transparent pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100 text-red-500">
                                <RefreshIcon />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Restart?</h3>
                            <p className="text-gray-500 mb-8 text-sm leading-relaxed px-4">This will wipe your progress and points.</p>
                            <div className="flex flex-col gap-3">
                                <button onClick={handleReset} className="w-full py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-500/20 transition-all transform hover:scale-[1.02]">
                                    Yes, Reset
                                </button>
                                <button onClick={() => setIsResetPopupOpen(false)} className="w-full py-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-sm transition-all">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
