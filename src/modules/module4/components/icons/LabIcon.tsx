import React from 'react';

// Sleek Lab Beaker Icon
export const LabIconV4: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <defs>
             <linearGradient id="liquid-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.6"/>
            </linearGradient>
        </defs>
        {/* Beaker Outline */}
        <path d="M19 21H5C4.44772 21 4 20.5523 4 20V19L6.8 9.2C6.92727 8.75453 6.99091 8.5318 7 8.30902C7.00909 8.08623 7.00909 7.86344 7 7.64066V3H17V7.64066C16.9909 7.86344 16.9909 8.08623 17 8.30902C17.0091 8.5318 17.0727 8.75453 17.2 9.2L20 19V20C20 20.5523 19.5523 21 19 21Z" 
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-text-light"/>
        
        {/* Liquid Fill - Dynamic */}
        <path d="M6.5 11L17.5 11L19 18C19 18.5523 18.5523 19 18 19H6C5.44772 19 5 18.5523 5 18L6.5 11Z" 
              fill="url(#liquid-grad)" className="text-pale-yellow opacity-80"/>
        
        {/* Bubbles */}
        <circle cx="12" cy="14" r="1.5" className="fill-white animate-ping opacity-50" style={{animationDuration: '3s'}}/>
        <circle cx="14" cy="16" r="1" className="fill-white animate-ping opacity-40" style={{animationDuration: '2s', animationDelay: '0.5s'}}/>
    </svg>
);

export { LabIconV4 as LabIcon };