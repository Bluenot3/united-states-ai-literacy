import React from 'react';
import { Link } from 'react-router-dom';
import type { ProgramInfo } from '../types';
import { getAccentClasses } from '../programsRegistry';

interface ProgramHeaderProps {
    program: ProgramInfo;
    completedSections: number;
    totalSections: number;
}

const ProgramHeader: React.FC<ProgramHeaderProps> = ({ program, completedSections, totalSections }) => {
    const colors = getAccentClasses(program.accentColor);
    const progressPercent = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

    return (
        <header className={`sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-brand-shadow-dark/10 shadow-soft-lg`}>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Left side: Back link + Title */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/hub"
                            className="flex items-center gap-2 text-sm font-medium text-brand-text-light hover:text-brand-primary transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="hidden sm:inline">Back to Hub</span>
                        </Link>

                        <div className="h-6 w-px bg-brand-shadow-dark/20 hidden sm:block" />

                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-md text-white`}>
                                <span className="text-xl">{program.icon}</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-brand-text leading-tight">{program.name}</h1>
                                <p className="text-xs text-brand-text-light hidden sm:block">{program.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Progress */}
                    <div className="flex items-center gap-4">
                        {/* Progress pill */}
                        <div className={`hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-brand-bg shadow-neumorphic-in-sm`}>
                            <div className="text-right">
                                <p className="text-xs font-bold text-brand-text-light uppercase tracking-wider">Progress</p>
                                <p className={`text-lg font-black ${colors.text}`}>{progressPercent}%</p>
                            </div>
                            <div className={`w-12 h-12 rounded-full border-4 ${colors.border} flex items-center justify-center relative`}>
                                <svg className="w-12 h-12 transform -rotate-90">
                                    <circle
                                        cx="24"
                                        cy="24"
                                        r="20"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                        className="text-brand-shadow-dark/20"
                                    />
                                    <circle
                                        cx="24"
                                        cy="24"
                                        r="20"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                        strokeDasharray={`${progressPercent * 1.256} 126`}
                                        className={colors.text}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                                    {completedSections}/{totalSections}
                                </span>
                            </div>
                        </div>

                        {/* Mobile progress */}
                        <div className={`sm:hidden flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg}/10`}>
                            <span className={`text-sm font-bold ${colors.text}`}>{progressPercent}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ProgramHeader;
