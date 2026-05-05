
import React, { useState, useEffect } from 'react';

const ScrollProgressBar: React.FC = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    let requestRunning = false;

    const handleScroll = () => {
        if (!requestRunning) {
            requestAnimationFrame(() => {
                const totalScroll = document.documentElement.scrollTop;
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scroll = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
                setScrollPercentage(scroll);
                requestRunning = false;
            });
            requestRunning = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary transition-transform duration-75 ease-out origin-left"
        style={{ transform: `scaleX(${scrollPercentage / 100})` }}
      />
    </div>
  );
};

export default ScrollProgressBar;
