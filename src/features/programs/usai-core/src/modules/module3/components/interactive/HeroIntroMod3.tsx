import React, { useEffect, useRef } from 'react';
import type { InteractiveComponentProps } from '../../types';

const HeroIntroMod3: React.FC<InteractiveComponentProps> = () => {
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

        interface GridPoint {
            x: number;
            y: number;
            z: number;
        }

        const points: GridPoint[] = [];
        const gap = 50;

        // Create a 3D-ish grid
        for (let x = 0; x < width; x += gap) {
            for (let y = 0; y < height; y += gap) {
                points.push({ x, y, z: 0 });
            }
        }

        const render = () => {
            ctx.fillStyle = 'rgba(0, 20, 20, 0.2)';
            ctx.fillRect(0, 0, width, height);

            points.forEach(p => {
                // Wave effect based on mouse
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const wave = Math.sin(dist * 0.05 - Date.now() * 0.005) * 10;

                ctx.fillStyle = dist < 200 ? '#00ffcc' : '#005544';
                ctx.fillRect(p.x - 1, p.y - 1 + wave, 2, 2);

                if (dist < 150 && Math.random() < 0.05) {
                    ctx.strokeStyle = 'rgba(0, 255, 204, 0.5)';
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y + wave);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.stroke();
                }
            });

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
        <div ref={containerRef} className="relative w-full min-h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-[#001a1a] mb-16 group flex items-center justify-center border border-white/5">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>

            <div className="absolute inset-0 bg-gradient-to-t from-[#001a1a] via-transparent to-[#001a1a]/80 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 max-w-5xl mx-auto pointer-events-none">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-8 animate-fade-in backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    HIVE MIND ONLINE
                </div>

                <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                    MOD <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-green-500 animate-pulse-slow">3</span>
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold text-cyan-200 mb-8 tracking-[0.2em] font-mono">
                    COGNITIVE SYSTEMS ARCHITECTURE
                </h2>

                <p className="text-slate-300 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 animate-slide-in-up font-light border-l-2 border-cyan-500 pl-6 text-left">
                    "Intelligence is no longer solitary. It is networked, agentic, and
                    <span className="text-cyan-400 font-semibold"> relentlessly autonomous.</span>"
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                    {[
                        { label: "AGENTS", val: "DEPLOYED" },
                        { label: "MEMORY", val: "INFINITE" },
                        { label: "TOOLS", val: "CONNECTED" },
                        { label: "GOALS", val: "ALIGNED" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex flex-col items-center hover:bg-white/10 transition-colors">
                            <span className="text-cyan-400 font-mono text-xs mb-1">{stat.label}</span>
                            <span className="text-white font-bold tracking-widest text-sm">{stat.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-cyan-700">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7-7-7m14-8l-7 7-7-7"></path></svg>
            </div>
        </div>
    );
};

export default HeroIntroMod3;
