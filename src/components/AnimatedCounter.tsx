import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
    value: number | string;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    value,
    duration = 2000,
    prefix = '',
    suffix = '',
    className = ''
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    const elementRef = useRef<HTMLSpanElement>(null);
    const numericValue = typeof value === 'number' ? value : parseFloat((value || '0').toString().replace(/[^0-9.-]+/g, ''));
    const isVisible = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isVisible.current) {
                    isVisible.current = true;
                    startAnimation();
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [numericValue]);

    const startAnimation = () => {
        let startTime: number | null = null;
        const startValue = 0;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // East out cubic function for smooth landing
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);

            const currentValue = Math.floor(startValue + (numericValue - startValue) * easeOutCubic);
            setDisplayValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    };

    return (
        <span ref={elementRef} className={`tabular-nums ${className}`}>
            {prefix}{displayValue}{suffix}
        </span>
    );
};

export default AnimatedCounter;
