import React, { useEffect, useRef, useCallback } from 'react';

const AnimatedBackground: React.FC = React.memo(() => {
    const followerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        rafRef.current = requestAnimationFrame(() => {
            if (followerRef.current) {
                const x = (e.clientX / window.innerWidth) * 100;
                const y = (e.clientY / window.innerHeight) * 100;
                followerRef.current.style.left = `${x}%`;
                followerRef.current.style.top = `${y}%`;
            }
        });
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [handleMouseMove]);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-zen-navy">
            {/* Deep space quantum gradient mesh */}
            <div className="absolute inset-0 opacity-50">
                {/* Gold nebula — top-left */}
                <div
                    className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full animate-blob"
                    style={{
                        background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 40%, transparent 70%)',
                        willChange: 'transform',
                    }}
                />
                {/* Quantum cyan — top-right */}
                <div
                    className="absolute -top-10 -right-10 w-[450px] h-[450px] rounded-full animate-blob"
                    style={{
                        background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, rgba(56,189,248,0.03) 40%, transparent 70%)',
                        willChange: 'transform',
                        animationDelay: '2s',
                    }}
                />
                {/* Deep blue — bottom-center */}
                <div
                    className="absolute -bottom-20 left-1/4 w-[600px] h-[600px] rounded-full animate-blob"
                    style={{
                        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0.02) 40%, transparent 70%)',
                        willChange: 'transform',
                        animationDelay: '4s',
                    }}
                />

                {/* Dynamic mouse follower — gold quantum glow */}
                <div
                    ref={followerRef}
                    className="absolute w-[400px] h-[400px] rounded-full transition-all duration-[1500ms] ease-out"
                    style={{
                        background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 30%, transparent 60%)',
                        transform: 'translate(-50%, -50%)',
                        willChange: 'left, top',
                    }}
                />
            </div>

            {/* Horizon scan line — subtle */}
            <div
                className="absolute left-0 right-0 h-px opacity-20"
                style={{
                    top: '38%',
                    background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15) 20%, rgba(34,211,238,0.1) 50%, rgba(201,168,76,0.15) 80%, transparent)',
                }}
            />

            {/* Vertical accent line — left edge */}
            <div
                className="absolute top-0 bottom-0 w-px opacity-10"
                style={{
                    left: '8%',
                    background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.2) 30%, rgba(201,168,76,0.1) 70%, transparent)',
                }}
            />

            {/* Grid Pattern Overlay — ZEN structural grid */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px',
                }}
            />

            {/* Noise texture */}
            <div className="absolute inset-0 opacity-[0.012] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
        </div>
    );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;
