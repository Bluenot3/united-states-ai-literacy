import React from 'react';

export const GraduationCapIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} viewBox="0 0 24 24" fill="none">
        {/* Cap Top - Diamond Shape with subtle perspective */}
        <path d="M12 3L2 8L12 13L22 8L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-text" />

        {/* Cap Base - Curved for sleekness */}
        <path d="M5 10V15C5 15 7 17 12 17C17 17 19 15 19 15V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-text-light" />

        {/* Tassel - Dynamic curve with accent color */}
        <path d="M22 8L22 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-text-light" />
        <circle cx="22" cy="13" r="1.5" className="fill-brand-primary animate-bounce" />
    </svg>
);