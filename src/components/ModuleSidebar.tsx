import React from 'react';
import type { Section } from '../types';

interface ModuleSidebarProps {
    sections: Section[];
    activeSection: string;
    completedSections: string[];
    moduleId: 1 | 2 | 3 | 4;
}

const ModuleSidebar: React.FC<ModuleSidebarProps> = ({
    sections,
    activeSection,
    completedSections,
    moduleId,
}) => {
    const renderSections = (items: Section[], depth: number = 0) => {
        return items.map((section) => {
            const isActive = activeSection === section.id;
            const isCompleted = completedSections.includes(section.id);

            return (
                <div key={section.id}>
                    <a
                        href={`#${section.id}`}
                        className={`block py-2 px-3 rounded-lg text-sm transition-all duration-200 ${depth > 0 ? 'ml-4 text-xs' : ''
                            } ${isActive
                                ? 'bg-white shadow-soft-lg text-brand-primary font-medium'
                                : isCompleted
                                    ? 'text-pale-green hover:bg-white/50'
                                    : 'text-brand-text-light hover:bg-white/50 hover:text-brand-primary'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            {isCompleted && !isActive && <span className="text-pale-green">✓</span>}
                            {section.icon && <span>{section.icon}</span>}
                            <span className="truncate">{section.title}</span>
                        </span>
                    </a>
                    {section.subSections && (
                        <div className="mt-1">
                            {renderSections(section.subSections, depth + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <aside className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-24 card-neumorphic max-h-[calc(100vh-8rem)] overflow-y-auto liquid-scrollbar">
                <h3 className="font-bold text-brand-text mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center text-white text-xs">
                        {moduleId}
                    </span>
                    Module Navigation
                </h3>
                <nav className="space-y-1">
                    {renderSections(sections)}
                </nav>
            </div>
        </aside>
    );
};

export default ModuleSidebar;
