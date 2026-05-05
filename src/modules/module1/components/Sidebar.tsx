import React from 'react';
import type { Section } from '../types';
import { useAuth } from '../hooks/useAuth';
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

        const headerOffset = 96;
        const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
        });

        window.setTimeout(() => {
            window.history.replaceState(null, '', `#${sectionId}`);
        }, 450);
    };

    return (
        <aside className="lg:self-start">
            <StickySectionNavCard
                sections={sections}
                activeSection={activeSection}
                completedSections={user?.modules[1]?.completedSections ?? []}
                moduleLabel="Module 1"
                moduleNumber={1}
                accentClassName="from-violet-500 via-fuchsia-500 to-cyan-400"
                activeAccentClassName="from-violet-600 via-fuchsia-600 to-cyan-500"
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
