import React from 'react';

export const CubeTransparentIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 01-4.5 0m4.5 0l-4.5-4.5m4.5 4.5l4.5 4.5m-4.5-4.5L10.5 3.256m4.5 4.5l4.5 4.5m-4.5-4.5L10.5 12m4.5 4.5l-4.5 4.5m4.5-4.5l4.5-4.5M10.5 12l-4.5 4.5m4.5-4.5l4.5 4.5m-4.5-4.5L6 7.756m4.5 4.5l-4.5 4.5M6 7.756L1.5 12l4.5 4.5" />
    </svg>
);
