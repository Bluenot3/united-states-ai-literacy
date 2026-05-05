import React, { useEffect } from 'react';

interface ConfettiProps {
    onAnimationEnd: () => void;
}

const CONFETTI_COUNT = 150;
const DURATION = 6000; // 6 seconds

const Confetti: React.FC<ConfettiProps> = ({ onAnimationEnd }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onAnimationEnd();
        }, DURATION);

        return () => clearTimeout(timer);
    }, [onAnimationEnd]);

    const confetti = Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
        const side = i < CONFETTI_COUNT / 2 ? 'left' : 'right';
        const style = {
            '--x-end-offset': `${Math.random() * 30 - 15}vw`,
            '--delay': `${Math.random() * (DURATION / 2000)}s`,
            '--duration': `${Math.random() * 2 + 3}s`,
            '--rotation-start': `${Math.random() * 360}deg`,
            '--rotation-end': `${Math.random() * 1440 + 360}deg`,
            '--scale': Math.random() * 0.5 + 0.5,
            '--bg': ['#8B5CF6', '#F472B6', '#10B981', '#F59E0B', '#A78BFA'][Math.floor(Math.random() * 5)],
            animationName: side === 'left' ? 'rise-and-fall-left' : 'rise-and-fall-right',
        } as React.CSSProperties;

        return <i key={i} className="confetti-piece" style={style}></i>;
    });

    return <div className="confetti-container">{confetti}</div>;
};

export default Confetti;