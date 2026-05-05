import React from 'react';
import type { Section } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';
import StickySectionNavCard from '../../../components/vanguard/StickySectionNavCard';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { CubeTransparentIcon } from './icons/CubeTransparentIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
    BookOpen: BookOpenIcon,
    CubeTransparent: CubeTransparentIcon,
    Sparkles: SparklesIcon,
    default: CubeTransparentIcon,
};

interface SidebarProps {
    sections: Section[];
    activeSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, activeSection }) => {
    const { user } = useAuth();

    const handleNavigate = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (!element) {
            return;
        }

        const headerOffset = 100;
        const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
        });

        window.history.replaceState(null, '', `#${sectionId}`);
    };

    return (
        <aside className="lg:self-start">
            <StickySectionNavCard
                sections={sections}
                activeSection={activeSection}
                completedSections={(user?.modules as any)?.[4]?.completedSections ?? []}
                moduleLabel="Module 4"
                moduleNumber={4}
                accentClassName="from-amber-500 via-orange-500 to-rose-500"
                activeAccentClassName="from-amber-600 via-orange-600 to-rose-600"
                onNavigate={handleNavigate}
                renderIcon={(section, isActive) => {
                    const IconComponent = section.icon ? (iconMap[section.icon] ?? iconMap.default) : iconMap.default;
                    return <IconComponent className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />;
                }}
            />
        </aside>
    );
};

export default Sidebar;
