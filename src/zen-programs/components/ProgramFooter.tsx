import React from 'react';

const ProgramFooter: React.FC = () => {
    return (
        <footer className="mt-8 border-t border-zen-gold/8 py-8">
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} ZEN AI Co. All rights reserved.
                </p>
                <p className="bg-gradient-to-r from-zen-gold to-brand-cyan bg-clip-text text-sm font-medium text-transparent">
                    Powered by ZEN Vanguard
                </p>
            </div>
        </footer>
    );
};

export default ProgramFooter;
