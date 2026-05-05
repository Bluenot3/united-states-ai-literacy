import React from 'react';

import type { ZenGlyphName } from './ZenModuleGlyph';
import ZenModuleGlyph from './ZenModuleGlyph';

type TelemetryVariant = 'progress' | 'readiness' | 'network' | 'integrity';

interface ZenTelemetryCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: ZenGlyphName;
    variant?: TelemetryVariant;
}

const accentClasses: Record<TelemetryVariant, string> = {
    progress: 'from-[#f0d581]/18 to-transparent border-[#dfc06a]/20',
    readiness: 'from-cyan-300/14 to-transparent border-cyan-300/18',
    network: 'from-emerald-300/14 to-transparent border-emerald-300/18',
    integrity: 'from-fuchsia-300/12 to-transparent border-fuchsia-300/15',
};

const ZenTelemetryCard: React.FC<ZenTelemetryCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    variant = 'progress',
}) => {
    return (
        <div className={`zen-panel rounded-[1.55rem] border bg-gradient-to-br p-5 ${accentClasses[variant]}`}>
            <div className="flex items-center justify-between gap-3">
                <p className="zen-micro-label">{title}</p>
                <span className="zen-glyph-frame text-[#f2d789]">
                    <ZenModuleGlyph name={icon} className="h-4 w-4" />
                </span>
            </div>
            <p className="mt-4 font-display text-3xl font-semibold text-[#f8e5b3]">{value}</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">{subtitle}</p>
        </div>
    );
};

export default ZenTelemetryCard;
