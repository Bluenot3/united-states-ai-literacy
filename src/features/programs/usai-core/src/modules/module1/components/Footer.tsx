import React from 'react';

const Footer: React.FC = () => {
    const handleScrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="bg-brand-bg mt-16 border-t border-brand-shadow-dark/20">
            <div className="max-w-screen-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-brand-text-light">
                <p>&copy; {new Date().getFullYear()} ZEN AI VANGUARD. All Rights Reserved.</p>
                <button 
                    onClick={handleScrollTop}
                    className="mt-4 text-sm font-semibold hover:text-brand-primary transition-colors"
                >
                    Back to Top &uarr;
                </button>
            </div>
        </footer>
    );
};

export default Footer;