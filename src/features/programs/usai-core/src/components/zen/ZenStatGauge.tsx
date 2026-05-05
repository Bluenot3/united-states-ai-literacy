import React from 'react';

import type { ZenGlyphName } from './ZenModuleGlyph';
import ZenModuleGlyph from './ZenModuleGlyph';

type TelemetryVariant = 'progress' | 'readiness' | 'network' | 'integrity';

interface ZenStatGaugeProps {
    title: string;
    value: number;
    suffix?: string;
    subtitle: string;
    icon: ZenGlyphName;
    variant?: TelemetryVariant;
}

const colorStops: Record<TelemetryVariant, [string, string]> = {
    progress: ['#f3cf77', '#8ef5ff'],
    readiness: ['#9af6ff', '#7dd3fc'],
    network: ['#87ffa6', '#8ef5ff'],
    integrity: ['#f5de93', '#d4b5ff'],
};

const ZenStatGauge: React.FC<ZenStatGaugeProps> = ({
    title,
    value,
    suffix = '%',
    subtitle,
    icon,
    variant = 'progress',
}) => {
    const safeValue = Math.max(0, Math.min(100, value));
    const radius = 43;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (safeValue / 100) * circumference;
    const [start, end] = colorStops[variant];
    const gradientId = `${variant}-${title.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div className="zen-panel flex flex-col items-center rounded-[1.7rem] p-5 text-center">
            <div className="flex w-full items-center justify-between gap-3">
                <p className="zen-micro-label">{title}</p>
                <span className="zen-glyph-frame text-[#f2d789]">
                    <ZenModuleGlyph name={icon} className="h-4 w-4" />
                </span>
            </div>
            <div className="relative mt-4 h-32 w-32">
                <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={start} />
                            <stop offset="100%" stopColor={end} />
                        </linearGradient>
                    </defs>
                    <circle cx="55" cy="55" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="9" fill="none" />
                    <circle
                        cx="55"
                        cy="55"
                        r={radius}
                        stroke={`url(#${gradientId})`}
                        strokeWidth="9"
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="font-display text-3xl font-semibold text-[#f7e7b8]">{safeValue}{suffix}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-400">Live</p>
                </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{subtitle}</p>
        </div>
    );
};

export default ZenStatGauge;
