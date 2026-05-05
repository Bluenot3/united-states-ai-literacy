
import React from 'react';

interface GraduationCapIconProps {
    className?: string;
    isAnimating?: boolean;
}

export const GraduationCapIcon: React.FC<GraduationCapIconProps> = ({ className, isAnimating }) => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="capGradient" x1="16" y1="4" x2="16" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="currentColor" stopOpacity="0.1" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="scrollGradient" x1="24" y1="20" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="currentColor" stopOpacity="0.05" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0.2" />
            </linearGradient>
        </defs>
        
        {/* --- DIPLOMA SCROLL (Bottom Layer) --- */}
        <g transform="translate(18, 18) rotate(-15)">
            {/* Paper Body */}
            <path d="M0 0 H10 V4 H0 Z" fill="url(#scrollGradient)" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Rolled Edges */}
            <ellipse cx="0" cy="2" rx="1.5" ry="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.5"/>
            <ellipse cx="10" cy="2" rx="1.5" ry="2" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            {/* Ribbon */}
            <path d="M4 0 V4" stroke="#EF4444" strokeWidth="1.5" strokeOpacity="0.8"/>
            <path d="M4 2 L6 4" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.8"/>
            <path d="M4 2 L6 0" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.8"/>
        </g>

        {/* --- MORTARBOARD CAP (Top Layer) --- */}
        <g transform="translate(2, 4)">
            {/* Top Diamond Board */}
            <path d="M14 0 L2 6 L14 12 L26 6 L14 0Z" fill="url(#capGradient)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            
            {/* Cap Base/Skullcap */}
            <path d="M26 6 V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
            <path d="M14 20 C18.4183 20 22 17.7614 22 15 V12.5 C22 12.5 18.5 15 14 15 C9.5 15 6 12.5 6 12.5 V15 C6 17.7614 9.58172 20 14 20 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 12 V15" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.3"/>

            {/* Tassel Assembly */}
            <g style={{ transformOrigin: '14px 6px' }} className={isAnimating ? 'animate-tassel-swing' : ''}>
                {/* Center Button */}
                <circle cx="14" cy="6" r="1.5" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
                {/* Cord */}
                <path d="M14 6 L22 10" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round"/>
                {/* Tassel Fringe */}
                <g transform="translate(22, 10)">
                    <rect x="-1" y="0" width="2" height="1.5" fill="#F59E0B"/>
                    <path d="M0 1.5 V7" stroke="#F59E0B" strokeWidth="1"/>
                    <path d="M-1 1.5 L-2 6" stroke="#F59E0B" strokeWidth="0.5"/>
                    <path d="M1 1.5 L2 6" stroke="#F59E0B" strokeWidth="0.5"/>
                </g>
            </g>
        </g>

        {/* --- ANIMATION PARTICLES (Stars) --- */}
        {isAnimating && (
            <g className="text-yellow-400">
                <path d="M14 4 L15 6 L17 6 L15.5 7.5 L16 9.5 L14 8.5 L12 9.5 L12.5 7.5 L11 6 L13 6 Z" fill="currentColor" className="animate-star-burst" style={{transformOrigin: '14px 4px', animationDelay: '0ms'}} />
                <path d="M28 8 L29 10 L31 10 L29.5 11.5 L30 13.5 L28 12.5 L26 13.5 L26.5 11.5 L25 10 L27 10 Z" fill="currentColor" transform="scale(0.6)" className="animate-star-burst" style={{transformOrigin: '28px 8px', animationDelay: '100ms'}} />
                <circle cx="4" cy="10" r="1.5" fill="currentColor" className="animate-star-burst" style={{transformOrigin: '4px 10px', animationDelay: '200ms'}} />
            </g>
        )}
    </svg>
);
