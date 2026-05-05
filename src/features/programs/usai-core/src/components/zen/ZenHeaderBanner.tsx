import React from 'react';

import type { ZenGlyphName } from './ZenModuleGlyph';
import ZenBrandMark from './ZenBrandMark';
import ZenModuleGlyph from './ZenModuleGlyph';

type BannerVariant = 'hub' | 'dashboard' | 'module' | 'compact';

interface ZenHeaderBannerProps {
    eyebrow: string;
    title: string;
    description: string;
    variant?: BannerVariant;
    chips?: string[];
    icon?: ZenGlyphName;
    rightContent?: React.ReactNode;
}

const variantClasses: Record<BannerVariant, string> = {
    hub: 'lg:grid-cols-[1.15fr_0.85fr]',
    dashboard: 'lg:grid-cols-[1.2fr_0.8fr]',
    module: 'lg:grid-cols-[1.28fr_0.72fr]',
    compact: 'lg:grid-cols-[1.4fr_0.6fr]',
};

const ZenHeaderBanner: React.FC<ZenHeaderBannerProps> = ({
    eyebrow,
    title,
    description,
    variant = 'hub',
    chips = [],
    icon,
    rightContent,
}) => {
    return (
        <section className="zen-hero-panel relative overflow-hidden rounded-[2.35rem] p-6 text-white shadow-[0_32px_80px_rgba(2,6,23,0.52)] sm:p-8 lg:p-10">
            <div className="zen-grid-overlay" />
            <div className="zen-corner-flare pointer-events-none absolute left-5 top-5 h-24 w-24" />
            <div className="zen-corner-flare pointer-events-none absolute bottom-5 right-5 h-24 w-24 rotate-180" />

            <div className={`relative grid gap-8 ${variantClasses[variant]}`}>
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="zen-eyebrow-chip">{eyebrow}</span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-300">
                            EST. 2024
                        </span>
                    </div>

                    <div className="mt-5 flex items-start gap-4">
                        {icon ? (
                            <div className="hidden rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-3 text-zen-gold shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:flex">
                                <ZenModuleGlyph name={icon} className="h-7 w-7" />
                            </div>
                        ) : null}
                        <div className="min-w-0">
                            <h1 className="font-display text-4xl font-semibold tracking-[0.04em] text-[#f7e8ba] sm:text-5xl lg:text-[3.65rem] lg:leading-[1.02]">
                                {title}
                            </h1>
                            <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 sm:text-base">
                                {description}
                            </p>
                        </div>
                    </div>

                    {chips.length > 0 ? (
                        <div className="mt-6 flex flex-wrap gap-2.5">
                            {chips.map((chip) => (
                                <span key={chip} className="zen-chip">
                                    {chip}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>

                <div className="relative flex min-h-[16rem] items-stretch justify-end">
                    {rightContent ?? (
                        <div className="zen-panel relative flex w-full max-w-md flex-col justify-between p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#edd07c]">ZEN Identity</p>
                                    <p className="mt-3 font-display text-2xl text-[#f9e6b2]">United States AI Literacy</p>
                                </div>
                                <ZenBrandMark variant="coin" size="md" />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="zen-stat-block">
                                    <p className="zen-micro-label">Status</p>
                                    <p className="mt-2 text-lg font-bold text-white">Operational</p>
                                </div>
                                <div className="zen-stat-block">
                                    <p className="zen-micro-label">Integrity</p>
                                    <p className="mt-2 text-lg font-bold text-white">Secure</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ZenHeaderBanner;
