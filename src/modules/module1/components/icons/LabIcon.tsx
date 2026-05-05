import React from 'react';

// Fix: Renamed from LabIcon to LabIconV1 to resolve a name conflict with the aliased export at the end of the file.
export const LabIconV1: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pale-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-2.387-.477a2 2 0 01-.547-1.806l.477-2.387a6 6 0 013.86-.517l.318.158a6 6 0 003.86-.517l2.387.477a2 2 0 011.806.547a2 2 0 01.547 1.806l-.477 2.387a6 6 0 01-3.86.517l-.318-.158a6 6 0 00-3.86.517l-2.387-.477a2 2 0 00-1.806-.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 003.86.517l.318.158a6 6 0 013.86.517l2.387-.477a2 2 0 011.806-.547a2 2 0 01.547 1.806l-.477 2.387a6 6 0 01-3.86.517" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


// Alternate Beaker Icon
export const LabIconV2: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pale-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 3.5V8a.5.5 0 00.5.5h4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14h4" />
    </svg>
);


// Simplified Beaker Icon that looks more like a lab beaker
export const LabIconV3: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pale-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14M5 3a2 2 0 012-2h10a2 2 0 012 2M5 3v16a2 2 0 002 2h10a2 2 0 002-2V3M8 9h8m-8 4h8" />
        <path d="M9 19c-1 0-1.5-.5-1.5-1.5S8 16 9 16s1.5.5 1.5 1.5S10 19 9 19z" fill="currentColor" stroke="none" />
        <path d="M15 19c-1 0-1.5-.5-1.5-1.5S14 16 15 16s1.5.5 1.5 1.5S16 19 15 19z" fill="currentColor" stroke="none" />
    </svg>
);

// Final chosen icon - a simple, clean beaker
export const LabIconV4: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pale-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16M4 4v14a2 2 0 002 2h12a2 2 0 002-2V4M8 4l2 3h4l2-3M8 12h8" />
    </svg>
);

export { LabIconV4 as LabIcon };