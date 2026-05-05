
import React, { useEffect, useRef } from 'react';
import type { InteractiveComponentProps } from '../../types';

const HeroIntro: React.FC<InteractiveComponentProps> = () => {
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

        // Neural Node definition
        interface Node {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            pulse: number;
            pulseSpeed: number;
            connections: Node[];
        }

        const nodes: Node[] = [];
        const connectionDistance = 150;
        const nodeCount = Math.floor((width * height) / 10000); // Dense but performant

        // Initialize Nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                pulse: Math.random() * Math.PI,
                pulseSpeed: 0.05 + Math.random() * 0.05,
                connections: []
            });
        }

        // Draw Loop
        const render = () => {
            // Soft trails
            ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
            ctx.fillRect(0, 0, width, height);

            // Update Nodes
            nodes.forEach((node, i) => {
                // Movement
                node.x += node.vx;
                node.y += node.vy;
                node.pulse += node.pulseSpeed;

                // Bounce off walls
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                // Mouse interaction (gentle repulsion)
                const dx = mouseX - node.x;
                const dy = mouseY - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    node.x -= dx * 0.005;
                    node.y -= dy * 0.005;
                }

                // Draw Node
                const alpha = (Math.sin(node.pulse) + 1) / 2 * 0.5 + 0.3;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`; // brand-primary
                ctx.fill();

                // Glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
                ctx.fill();
                ctx.shadowBlur = 0;

                // Connections
                nodes.slice(i + 1).forEach(otherNode => {
                    const dx = node.x - otherNode.x;
                    const dy = node.y - otherNode.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const opacity = 1 - (dist / connectionDistance);
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        // Control point for subtle curve? No, straight lines are faster for "network" feel
                        ctx.lineTo(otherNode.x, otherNode.y);
                        ctx.strokeStyle = `rgba(167, 139, 250, ${opacity * 0.3})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();

                        // Synaptic Fire (Signal Pulse)
                        // Occasionally send a signal between connected nodes
                        if (Math.random() < 0.002) {
                            ctx.beginPath();
                            const signalPos = Math.random();
                            const sx = node.x + (otherNode.x - node.x) * signalPos;
                            const sy = node.y + (otherNode.y - node.y) * signalPos;
                            ctx.arc(sx, sy, 2, 0, Math.PI * 2);
                            ctx.fillStyle = '#fff';
                            ctx.fill();
                        }
                    }
                });
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
        <div ref={containerRef} className="relative w-full min-h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 mb-16 group flex items-center justify-center border border-white/5 ring-1 ring-white/5">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80 mix-blend-screen"></canvas>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-900/80 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 max-w-5xl mx-auto pointer-events-none">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary-light text-xs font-mono mb-8 animate-fade-in backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    NEURAL LINK ESTABLISHED
                </div>

                <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                    MOD <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-blue-500 animate-pulse-slow">1</span>
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold text-slate-300 mb-8 tracking-[0.2em] font-mono">
                    INTELLIGENCE ARCHITECT PROGRAM
                </h2>

                <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 animate-slide-in-up font-light border-l-2 border-brand-primary pl-6 text-left">
                    "We are building the nervous system of the digital age.
                    <span className="text-brand-secondary font-semibold"> You are the architect.</span>"
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                    {[
                        { label: "GEN-3 MODELS", val: "ACTIVE" },
                        { label: "NEURAL LINKS", val: "ONLINE" },
                        { label: "ETHICS CORE", val: "SECURE" },
                        { label: "AGENT SWARM", val: "READY" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex flex-col items-center hover:bg-white/10 transition-colors duration-300 hover:scale-105 hover:border-brand-primary/30 group/stat">
                            <span className="text-brand-primary/80 group-hover/stat:text-brand-primary font-mono text-[10px] tracking-widest mb-1.5 transition-colors">{stat.label}</span>
                            <span className="text-white font-bold tracking-widest text-sm drop-shadow-md">{stat.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7-7-7m14-8l-7 7-7-7"></path></svg>
            </div>
        </div>
    );
};

export default HeroIntro;
