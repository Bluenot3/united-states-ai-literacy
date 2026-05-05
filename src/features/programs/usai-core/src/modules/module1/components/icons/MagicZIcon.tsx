import React from 'react';

export const MagicZIcon: React.FC = () => (
    <div className="w-10 h-10">
        <svg
            width="40"
            height="40"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="rounded-md"
        >
            <rect width="100" height="100" fill="black" />
            <path
                d="M15 15 H 85 V 30 L 35 70 H 15 V 55 L 55 15 H 15 V 15 Z"
                fill="white"
            />
            <path
                d="M85 85 H 15 V 70 L 65 30 H 85 V 45 L 45 85 H 85 V 85 Z"
                fill="white"
            />
        </svg>
    </div>
);