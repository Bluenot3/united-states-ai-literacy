import React from 'react';

interface ZenBrandMarkProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'square' | 'coin';
    className?: string;
}

const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32',
};

const ZenBrandMark: React.FC<ZenBrandMarkProps> = ({
    size = 'md',
    variant = 'square',
    className = '',
}) => {
    const isCoin = variant === 'coin';

    return (
        <div
            className={[
                'zen-brandmark relative isolate flex items-center justify-center overflow-hidden text-white shadow-[0_18px_40px_rgba(5,10,24,0.55)]',
                sizeClasses[size],
                isCoin ? 'rounded-full' : 'rounded-[1.75rem]',
                className,
            ].join(' ')}
        >
            <div className="pointer-events-none absolute inset-[1px] rounded-[inherit] bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.34),transparent_26%),radial-gradient(circle_at_72%_78%,rgba(34,211,238,0.22),transparent_24%),linear-gradient(135deg,rgba(6,11,24,0.96),rgba(12,21,42,0.88)_50%,rgba(5,10,24,0.96))]" />
            <div className="pointer-events-none absolute inset-[8%] rounded-[inherit] border border-white/10" />
            <div className="pointer-events-none absolute inset-x-[18%] top-[10%] h-[26%] rounded-full bg-white/18 blur-2xl" />
            <div className="pointer-events-none absolute inset-x-[12%] bottom-[12%] h-[26%] rounded-full bg-cyan-400/20 blur-2xl" />

            <svg viewBox="0 0 100 100" className="relative z-10 h-[68%] w-[68%]" aria-hidden="true">
                <defs>
                    <linearGradient id="zenZStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fff3c2" />
                        <stop offset="35%" stopColor="#e8c97d" />
                        <stop offset="60%" stopColor="#91f6ff" />
                        <stop offset="82%" stopColor="#c8b4ff" />
                        <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                    <linearGradient id="zenZFill" x1="20%" y1="0%" x2="85%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.96)" />
                        <stop offset="35%" stopColor="rgba(183,241,255,0.95)" />
                        <stop offset="70%" stopColor="rgba(204,189,255,0.9)" />
                        <stop offset="100%" stopColor="rgba(255,224,160,0.98)" />
                    </linearGradient>
                    <filter id="zenZGlow">
                        <feGaussianBlur stdDeviation="2.6" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <path
                    d="M20 24h58L38 74h42v8H22l40-50H20z"
                    fill="url(#zenZFill)"
                    stroke="url(#zenZStroke)"
                    strokeWidth="4.5"
                    strokeLinejoin="round"
                    filter="url(#zenZGlow)"
                />
            </svg>
        </div>
    );
};

export default ZenBrandMark;
