import React, { useEffect, useRef } from 'react';

const BURST_COOLDOWN_MS = 90;
const PARTICLE_COUNT = 16;

const LuxuryClickEffects: React.FC = () => {
    const layerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const layer = layerRef.current;
        if (!layer) {
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        let lastBurstAt = 0;

        const animateAndCleanup = (node: HTMLSpanElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
            const animation = node.animate(keyframes, options);
            animation.addEventListener('finish', () => node.remove(), { once: true });
        };

        const emitPulse = (x: number, y: number) => {
            const ring = document.createElement('span');
            ring.style.position = 'absolute';
            ring.style.left = `${x - 10}px`;
            ring.style.top = `${y - 10}px`;
            ring.style.width = '20px';
            ring.style.height = '20px';
            ring.style.borderRadius = '999px';
            ring.style.border = '1px solid rgba(247, 228, 176, 0.48)';
            ring.style.background = 'radial-gradient(circle, rgba(247,228,176,0.2) 0%, rgba(247,228,176,0) 68%)';
            ring.style.boxShadow = '0 0 14px rgba(247, 228, 176, 0.18)';
            layer.appendChild(ring);

            animateAndCleanup(
                ring,
                [
                    { transform: 'scale(0.4)', opacity: 0.9 },
                    { transform: 'scale(1.95)', opacity: 0 },
                ],
                {
                    duration: 460,
                    easing: 'cubic-bezier(0.19, 0.69, 0.32, 0.99)',
                },
            );
        };

        const emitSparks = (x: number, y: number) => {
            for (let index = 0; index < PARTICLE_COUNT; index += 1) {
                const particle = document.createElement('span');
                const angle = (Math.PI * 2 * index) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.22;
                const drift = 18 + Math.random() * 44;
                const lift = 6 + Math.random() * 10;
                const targetX = Math.cos(angle) * drift;
                const targetY = Math.sin(angle) * (drift * 0.62) - lift;
                const size = 0.8 + Math.random() * 1.35;
                const duration = 350 + Math.random() * 210;
                const alpha = 0.42 + Math.random() * 0.42;

                particle.style.position = 'absolute';
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.borderRadius = '999px';
                particle.style.background = `rgba(248, 229, 173, ${alpha})`;
                particle.style.boxShadow = '0 0 6px rgba(248, 229, 173, 0.48)';
                layer.appendChild(particle);

                animateAndCleanup(
                    particle,
                    [
                        { transform: 'translate3d(0px, 0px, 0) scale(1)', opacity: 0.96 },
                        { transform: `translate3d(${targetX * 0.62}px, ${targetY * 0.62}px, 0) scale(0.96)`, opacity: 0.68 },
                        { transform: `translate3d(${targetX}px, ${targetY}px, 0) scale(0.2)`, opacity: 0 },
                    ],
                    {
                        duration,
                        easing: 'cubic-bezier(0.2, 0.68, 0.29, 0.98)',
                    },
                );
            }
        };

        const handlePointerDown = (event: PointerEvent) => {
            if (event.button !== 0 || !event.isPrimary) {
                return;
            }

            const now = performance.now();
            if (now - lastBurstAt < BURST_COOLDOWN_MS) {
                return;
            }

            lastBurstAt = now;
            emitPulse(event.clientX, event.clientY);
            emitSparks(event.clientX, event.clientY);
        };

        window.addEventListener('pointerdown', handlePointerDown, { passive: true });

        return () => {
            window.removeEventListener('pointerdown', handlePointerDown);
            layer.replaceChildren();
        };
    }, []);

    return <div ref={layerRef} aria-hidden data-click-effects-layer="luxury-spark" className="pointer-events-none fixed inset-0 z-[120] overflow-hidden" />;
};

export default React.memo(LuxuryClickEffects);
