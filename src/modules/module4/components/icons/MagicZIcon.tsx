import React from 'react';

const MagicZIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
    <div className={`relative group ${className}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform transition-transform duration-500 group-hover:rotate-180 group-hover:scale-110">
            <defs>
                <linearGradient id="z-main-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" /> {/* Blue-500 */}
                    <stop offset="100%" stopColor="#8b5cf6" /> {/* Violet-500 */}
                </linearGradient>
                <linearGradient id="z-accent-grad" x1="100%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan-500 */}
                     <stop offset="100%" stopColor="#3b82f6" /> {/* Blue-500 */}
                </linearGradient>
                <filter id="z-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            
            {/* Abstract Z Construction */}
            <path 
                d="M25 25 H 75 L 45 55 H 25 L 55 25 Z" 
                fill="url(#z-main-grad)" 
                className="drop-shadow-sm"
            />
            <path 
                d="M75 75 H 25 L 55 45 H 75 L 45 75 Z" 
                fill="url(#z-accent-grad)" 
                className="drop-shadow-sm"
            />
            
            {/* Central Pivot Point */}
            <circle cx="50" cy="50" r="4" fill="white" className="animate-pulse" />
        </svg>
    </div>
);

export default MagicZIcon;