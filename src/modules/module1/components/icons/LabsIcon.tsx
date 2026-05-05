
import React from 'react';

interface LabsIconProps {
    className?: string;
    isAnimating?: boolean;
}

export const LabsIcon: React.FC<LabsIconProps> = ({ className, isAnimating }) => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="flaskLiquid" x1="10" y1="14" x2="10" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="tubeLiquid" x1="24" y1="14" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="currentColor" stopOpacity="0.2" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0.5" />
            </linearGradient>
        </defs>

        {/* --- MAIN APPARATUS GROUP (Shakes when animating) --- */}
        <g className={isAnimating ? 'animate-shake-tilt' : ''} style={{ transformOrigin: 'bottom center' }}>
            
            {/* --- TEST TUBE (Background) --- */}
            <g transform="rotate(15, 24, 18)">
                <path d="M22 6 V24 A2 2 0 0 0 26 24 V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 6 H27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                {/* Liquid in Tube */}
                <path d="M22.5 14 V24 A1.5 1.5 0 0 0 25.5 24 V14 Z" fill="url(#tubeLiquid)" />
                {/* Tube Measurement Lines */}
                <path d="M24 10 H26" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                <path d="M24 12 H26" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
            </g>

            {/* --- FLASK (Foreground) --- */}
            <g>
                {/* Flask Body */}
                <path d="M13 2 V10 L6 22 C4.5 24.5 6 28 9 28 H17 C20 28 21.5 24.5 20 22 L13 10 V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 2 H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                
                {/* Flask Liquid */}
                <path d="M7.5 19.5 L18.5 19.5 C19.5 21 20 23 19 25 C18 27 16 27.5 13 27.5 C10 27.5 8 27 7 25 C6 23 6.5 21 7.5 19.5 Z" fill="url(#flaskLiquid)" />
                
                {/* Reflection Highlight */}
                <path d="M14 22 C14 22 15 23 16 23" stroke="white" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round"/>

                {/* Bubbles Inside Flask (Visible & Animated) */}
                <circle cx="11" cy="24" r="1.5" fill="currentColor" fillOpacity="0.6" className={isAnimating ? 'animate-liquid-bubble' : 'opacity-0'} style={{animationDelay: '0s'}}/>
                <circle cx="15" cy="22" r="1" fill="currentColor" fillOpacity="0.6" className={isAnimating ? 'animate-liquid-bubble' : 'opacity-0'} style={{animationDelay: '0.4s'}}/>
                <circle cx="13" cy="26" r="2" fill="currentColor" fillOpacity="0.6" className={isAnimating ? 'animate-liquid-bubble' : 'opacity-0'} style={{animationDelay: '0.8s'}}/>
            </g>
        </g>

        {/* --- VAPOR CLOUDS (Rise when animating) --- */}
        <g className={isAnimating ? 'opacity-100' : 'opacity-0'} style={{ transition: 'opacity 0.5s' }}>
            <path d="M13 2 C11 0 11 -2 13 -3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" className="animate-vapor-rise" style={{animationDelay: '0s'}}/>
            <path d="M15 1 C17 -1 17 -3 15 -5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" className="animate-vapor-rise" style={{animationDelay: '0.5s'}}/>
        </g>
    </svg>
);
