import React, { useEffect, useRef } from 'react';
import type { InteractiveComponentProps } from '../../types';

const HeroIntroMod2: React.FC<InteractiveComponentProps> = () => {
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
        let mouseX = width / 2;
        let mouseY = height / 2;

        interface Orb {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            hue: number;
            pulse: number;
        }

        const orbs: Orb[] = [];
        const orbCount = 30;

        for (let i = 0; i < orbCount; i++) {
            orbs.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 40 + 20,
                hue: Math.random() * 60 + 320, // Pinks and Reds and Oranges (320-380)
                pulse: Math.random() * Math.PI
            });
        }

        const render = () => {
            // Creative trail effect
            ctx.fillStyle = 'rgba(20, 10, 30, 0.1)';
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'lighter'; // Blend mode for glowing effect

            orbs.forEach(orb => {
                orb.x += orb.vx;
                orb.y += orb.vy;
                orb.pulse += 0.02;

                if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
                if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

                // Mouse interaction
                const dx = mouseX - orb.x;
                const dy = mouseY - orb.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 300) {
                    orb.x -= dx * 0.01;
                    orb.y -= dy * 0.01;
                }

                const size = orb.radius + Math.sin(orb.pulse) * 10;

                const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, size);
                gradient.addColorStop(0, `hsla(${orb.hue}, 100%, 70%, 0.6)`);
                gradient.addColorStop(1, `hsla(${orb.hue}, 100%, 50%, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, size, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalCompositeOperation = 'source-over';
            animationFrameId = requestAnimationFrame(render);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        const handleResize = () => {
            width = canvas.width = container.offsetWidth;
            height = canvas.height = container.offsetHeight;
        };

        window.addEventListener('resize', handleResize);
        container.addEventListener('mousemove', handleMouseMove);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            container.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full min-h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-[#0f0518] mb-16 group flex items-center justify-center border border-white/5">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-transparent to-[#0f0518]/60 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 max-w-5xl mx-auto pointer-events-none">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-mono mb-8 animate-fade-in backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                    </span>
                    DREAM ENGINE ONLINE
                </div>

                <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]">
                    MOD <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 animate-pulse-slow">2</span>
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold text-pink-200 mb-8 tracking-[0.2em] font-mono">
                    GENERATIVE INTELLIGENCE
                </h2>

                <p className="text-slate-300 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 animate-slide-in-up font-light border-l-2 border-pink-500 pl-6 text-left">
                    "From chaos comes structure. You are now entering the logic
                    <span className="text-pink-400 font-semibold"> of imagination.</span>"
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                    {[
                        { label: "DIFFUSION", val: "ACTIVE" },
                        { label: "LATENT SPACE", val: "MAPPED" },
                        { label: "CREATIVITY", val: "UNBOUND" },
                        { label: "MODALITY", val: "MULTI" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex flex-col items-center hover:bg-white/10 transition-colors">
                            <span className="text-pink-400 font-mono text-xs mb-1">{stat.label}</span>
                            <span className="text-white font-bold tracking-widest text-sm">{stat.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-pink-700">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7-7-7m14-8l-7 7-7-7"></path></svg>
            </div>
        </div>
    );
};

export default HeroIntroMod2;
