import React from 'react';

const MagicZIcon: React.FC = () => (
    <div className="relative w-16 h-16">
        <div className="absolute inset-0 bg-brand-primary rounded-full transform rotate-45"></div>
        <div className="absolute inset-2 bg-brand-bg rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-brand-primary transform -rotate-45">Z</span>
        </div>
    </div>
);

export default MagicZIcon;
