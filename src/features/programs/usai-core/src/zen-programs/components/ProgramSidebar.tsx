import React from 'react';
import type { ProgramSection, ProgramInfo } from '../types';
import { getAccentClasses } from '../programsRegistry';

interface ProgramSidebarProps {
    sections: ProgramSection[];
    activeSection: string;
    completedSections: string[];
    onSectionClick: (sectionId: string) => void;
    program: ProgramInfo;
}

const ProgramSidebar: React.FC<ProgramSidebarProps> = ({
    sections,
    activeSection,
    completedSections,
    onSectionClick,
    program
}) => {
    const colors = getAccentClasses(program.accentColor);

    const renderSection = (section: ProgramSection, level: number = 0) => {
        const isActive = activeSection === section.id;
        const isCompleted = completedSections.includes(section.id);
        const hasSubSections = section.subSections && section.subSections.length > 0;

        return (
            <div key={section.id}>
                <button
                    onClick={() => onSectionClick(section.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-3 group relative ${isActive
                            ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md`
                            : 'text-brand-text-light hover:bg-brand-bg hover:text-brand-text'
                        } ${level > 0 ? 'ml-4 text-sm' : ''}`}
                >
                    {/* Active indicator bar */}
                    {isActive && (
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-white/50`} />
                    )}

                    {/* Completion checkmark or section icon */}
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${isCompleted
                            ? isActive ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600'
                            : isActive ? 'bg-white/20 text-white' : 'bg-brand-shadow-dark/10 text-brand-text-light'
                        }`}>
                        {isCompleted ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            section.icon || '📄'
                        )}
                    </span>

                    {/* Section title */}
                    <span className={`flex-1 font-medium truncate ${level > 0 ? 'text-sm' : ''}`}>
                        {section.title}
                    </span>

                    {/* Expand indicator for parent sections */}
                    {hasSubSections && (
                        <svg className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                </button>

                {/* Render subsections */}
                {hasSubSections && (
                    <div className="mt-1 space-y-1">
                        {section.subSections!.map(subSection => renderSection(subSection, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
            <nav className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft-lg border border-white/50 p-4 space-y-1">
                <div className="px-4 py-2 mb-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-brand-text-light">Contents</h2>
                </div>
                {sections.map(section => renderSection(section))}
            </nav>
        </aside>
    );
};

export default ProgramSidebar;
