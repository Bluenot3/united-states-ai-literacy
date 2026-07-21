import React from 'react';
import type { Section } from '../types';
import { useAuth } from '../hooks/useAuth';
import StickySectionNavCard from '../../../components/vanguard/StickySectionNavCard';

interface SidebarProps {
    sections: Section[];
    activeSection: string;
    unlockedSectionIds: Set<string>;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, activeSection, unlockedSectionIds }) => {
    const { user } = useAuth();

    const handleNavigate = (sectionId: string) => {
        if (!unlockedSectionIds.has(sectionId)) {
            return;
        }

        const element = document.getElementById(sectionId);
        if (!element) {
            return;
        }

        const headerOffset = 116;
        const offsetPosition = element.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
        });
    };

    return (
        <aside className="lg:self-start">
            <StickySectionNavCard
                sections={sections}
                activeSection={activeSection}
                completedSections={user?.modules?.[2]?.completedSections ?? []}
                moduleLabel="Module 2"
                moduleNumber={2}
                accentClassName="from-sky-500 via-cyan-500 to-emerald-400"
                activeAccentClassName="from-sky-600 via-cyan-600 to-emerald-500"
                onNavigate={handleNavigate}
                unlockedSectionIds={unlockedSectionIds}
            />
        </aside>
    );
};

export default React.memo(Sidebar);
