import React from 'react';
import { Link } from 'react-router-dom';

import type { ZenGlyphName } from './ZenModuleGlyph';
import ZenModuleGlyph from './ZenModuleGlyph';

type ActionVariant = 'primary' | 'secondary' | 'resource' | 'submit';

interface ZenActionTileProps {
    to: string;
    label: string;
    description: string;
    icon: ZenGlyphName;
    variant?: ActionVariant;
    badge?: string;
}

const variantClasses: Record<ActionVariant, string> = {
    primary: 'from-[#f7d98b]/22 via-[#8ef5ff]/12 to-transparent border-[#e5c26b]/30',
    secondary: 'from-white/10 via-white/[0.03] to-transparent border-white/12',
    resource: 'from-[#8ef5ff]/12 via-[#caa5ff]/10 to-transparent border-cyan-300/18',
    submit: 'from-[#f7d98b]/20 via-[#d68cff]/10 to-transparent border-amber-300/20',
};

const ZenActionTile: React.FC<ZenActionTileProps> = ({
    to,
    label,
    description,
    icon,
    variant = 'secondary',
    badge,
}) => {
    return (
        <Link
            to={to}
            className={[
                'group zen-panel relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(8,14,28,0.9),rgba(10,18,34,0.75))] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(2,6,23,0.5)]',
                `bg-gradient-to-br ${variantClasses[variant]}`,
            ].join(' ')}
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent)] opacity-60" />
            <div className="relative flex items-start justify-between gap-4">
                <span className="zen-glyph-frame text-[#f2d789] transition duration-300 group-hover:text-white">
                    <ZenModuleGlyph name={icon} className="h-6 w-6" />
                </span>
                {badge ? (
                    <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                        {badge}
                    </span>
                ) : null}
            </div>
            <p className="mt-5 font-display text-2xl font-semibold tracking-[0.03em] text-[#f8e4ad]">
                {label}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
                {description}
            </p>
        </Link>
    );
};

export default ZenActionTile;
