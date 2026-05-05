import React, { useState, useEffect } from 'react';

const BackToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-24 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-2xl border border-zen-gold/20 bg-zen-navy/90 text-zen-gold shadow-zen-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-zen-gold/40 hover:shadow-zen-glow-intense lg:bottom-8 print:hidden ${
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-4 opacity-0'
            }`}
            aria-label="Back to top"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        </button>
    );
};

export default BackToTopButton;
