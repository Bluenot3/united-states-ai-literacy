import React, { useEffect, useRef } from 'react';
import type { InteractiveComponentProps } from '../../../../types';

const HeroIntroMod4: React.FC<InteractiveComponentProps> = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = container.offsetWidth;
        let height = canvas.height = container.offsetHeight;
        let animationFrameId: number;

        // Matrix rain effect
        const fontSize = 14;
        const columns = Math.floor(width / fontSize);
        const drops: number[] = new Array(columns).fill(1);
        const chars = "01DEFENSE_PROTOCAL_MASTERY_AI_VANGUARD";

        const render = () => {
            ctx.fillStyle = 'rgba(10, 5, 20, 0.1)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#ef4444'; // Red-500
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];

                // Color ramp
                if (Math.random() > 0.95) ctx.fillStyle = '#fff';
                else ctx.fillStyle = '#ef4444';

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            animationFrameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            width = canvas.width = container.offsetWidth;
            height = canvas.height = container.offsetHeight;
        };

        window.addEventListener('resize', handleResize);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full min-h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-[#0a0514] mb-16 group flex items-center justify-center border border-white/5">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30"></canvas>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0514] via-transparent to-[#0a0514]/80 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 max-w-5xl mx-auto pointer-events-none">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono mb-8 animate-fade-in backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    DEFENSE MATRIX ACTIVE
                </div>

                <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                    MOD <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-600 to-indigo-500 animate-pulse-slow">4</span>
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold text-red-200 mb-8 tracking-[0.2em] font-mono">
                    OPERATIONAL EXCELLENCE CLASSIFIED
                </h2>

                <p className="text-slate-300 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 animate-slide-in-up font-light border-l-2 border-red-500 pl-6 text-left">
                    "You have built the mind. Now you must build the
                    <span className="text-red-400 font-semibold"> cage, the code, and the controls.</span>"
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                    {[
                        { label: "SECURITY", val: "MAXIMUM" },
                        { label: "ETHICS", val: "ENFORCED" },
                        { label: "LATENCY", val: "OPTIMAL" },
                        { label: "SCALE", val: "GLOBAL" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex flex-col items-center hover:bg-white/10 transition-colors">
                            <span className="text-red-400 font-mono text-xs mb-1">{stat.label}</span>
                            <span className="text-white font-bold tracking-widest text-sm">{stat.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-red-700">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7-7-7m14-8l-7 7-7-7"></path></svg>
            </div>
        </div>
    );
};

export default HeroIntroMod4;
