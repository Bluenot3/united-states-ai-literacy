import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    hue: number;
    life: number;
    maxLife: number;
}

const ParticleField: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0, active: false });
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initialize particles
        const initParticles = () => {
            const particles: Particle[] = [];
            for (let i = 0; i < 80; i++) {
                particles.push(createParticle(canvas.width, canvas.height));
            }
            particlesRef.current = particles;
        };

        const createParticle = (w: number, h: number): Particle => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.2,
            hue: 260 + Math.random() * 40, // Purple to violet range
            life: 0,
            maxLife: 300 + Math.random() * 200,
        });

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
        };
        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        initParticles();

        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const particles = particlesRef.current;
            const mouse = mouseRef.current;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Mouse attraction/repulsion
                if (mouse.active) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200) {
                        const force = (200 - dist) / 200 * 0.02;
                        p.vx += dx * force * 0.01;
                        p.vy += dy * force * 0.01;
                    }
                }

                // Update position
                p.x += p.vx;
                p.y += p.vy;
                p.life++;

                // Damping
                p.vx *= 0.99;
                p.vy *= 0.99;

                // Wrap around screen
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Respawn if life exceeded
                if (p.life > p.maxLife) {
                    particles[i] = createParticle(canvas.width, canvas.height);
                    continue;
                }

                // Calculate opacity based on life
                const lifeRatio = p.life / p.maxLife;
                const fadeOpacity = lifeRatio < 0.1
                    ? lifeRatio * 10
                    : lifeRatio > 0.9
                        ? (1 - lifeRatio) * 10
                        : 1;
                const finalOpacity = p.opacity * fadeOpacity;

                // Draw particle with glow
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
                gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${finalOpacity})`);
                gradient.addColorStop(0.3, `hsla(${p.hue}, 70%, 60%, ${finalOpacity * 0.5})`);
                gradient.addColorStop(1, `hsla(${p.hue}, 60%, 50%, 0)`);

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Core bright spot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, 90%, ${finalOpacity})`;
                ctx.fill();
            }

            // Draw connecting lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        const opacity = (1 - dist / 100) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `hsla(270, 70%, 60%, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default ParticleField;
