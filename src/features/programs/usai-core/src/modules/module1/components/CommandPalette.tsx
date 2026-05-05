import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Section } from '../types';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    sections: (Section & { parentTitle?: string })[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, sections }) => {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const filteredSections = useMemo(() => {
        if (!query) return sections;
        return sections.filter(section => 
            section.title.toLowerCase().includes(query.toLowerCase()) ||
            section.parentTitle?.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, sections]);
    
    useEffect(() => {
        // Scroll active item into view
        if (resultsRef.current && activeIndex >= 0) {
            const activeElement = resultsRef.current.children[activeIndex] as HTMLElement;
            if (activeElement) {
                activeElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [activeIndex]);

    const handleSelect = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80; // height of sticky header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                 top: offsetPosition,
                 behavior: 'smooth'
            });
        }
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => Math.min(prev + 1, filteredSections.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredSections[activeIndex]) {
                handleSelect(filteredSections[activeIndex].id);
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };
    
    useEffect(() => {
        setActiveIndex(0);
    }, [query]);


    if (!isOpen) return null;

    return (
        <div 
            id="command-palette-backdrop"
            className="fixed inset-0 z-50 flex justify-center pt-20 animate-fade-in" 
            onClick={onClose}
        >
            <div 
                className="w-full max-w-xl h-fit glass-card shadow-soft-xl flex flex-col animate-slide-in-up" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 p-4 border-b border-glass-stroke">
                    <MagnifyingGlassIcon className="w-5 h-5 text-brand-text-light" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Jump to section..."
                        className="w-full bg-transparent focus:outline-none text-brand-text placeholder:text-brand-text-light"
                    />
                </div>
                <ul id="command-palette-results" ref={resultsRef} className="max-h-96 overflow-y-auto p-2">
                    {filteredSections.length > 0 ? filteredSections.map((section, index) => (
                        <li 
                            key={section.id}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => handleSelect(section.id)}
                            className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                                index === activeIndex ? 'bg-brand-primary/10 text-brand-primary' : ''
                            }`}
                        >
                           <div>
                             {section.parentTitle && <span className="text-xs text-brand-text-light">{section.parentTitle} / </span>}
                             <span className="font-semibold">{section.title}</span>
                           </div>
                           <span className="text-xs text-brand-text-light">Jump to &crarr;</span>
                        </li>
                    )) : (
                        <li className="p-4 text-center text-brand-text-light">No results found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default CommandPalette;
