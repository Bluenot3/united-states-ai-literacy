import React from 'react';

import ZenBrandMark from './ZenBrandMark';

interface ZenIdentityCardProps {
    title: string;
    subtitle: string;
    description: string;
    chips?: string[];
    imageSrc?: string;
}

const ZenIdentityCard: React.FC<ZenIdentityCardProps> = ({
    title,
    subtitle,
    description,
    chips = [],
    imageSrc,
}) => {
    return (
        <div className="zen-identity-card relative overflow-hidden rounded-[2rem] p-[1px] shadow-[0_26px_70px_rgba(2,6,23,0.5)]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,228,160,0.95),rgba(142,245,255,0.45),rgba(205,172,255,0.45),rgba(255,228,160,0.95))]" />
            <div className="relative rounded-[calc(2rem-1px)] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),linear-gradient(160deg,rgba(8,14,28,0.98),rgba(10,18,34,0.94)_52%,rgba(8,14,28,0.98))] p-6 text-white">
                <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent)]" />
                <div className="relative flex items-start justify-between gap-4">
                    <div>
                        <p className="zen-micro-label">{subtitle}</p>
                        <h3 className="mt-3 font-display text-2xl font-semibold text-[#f8e4ad]">{title}</h3>
                    </div>
                    <ZenBrandMark variant="square" size="md" />
                </div>

                {imageSrc ? (
                    <div className="relative mt-5 overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/60 p-2">
                        <img src={imageSrc} alt={title} className="h-36 w-full rounded-[1.1rem] object-cover opacity-85" />
                    </div>
                ) : null}

                <p className="relative mt-5 text-sm leading-7 text-slate-300">
                    {description}
                </p>

                {chips.length > 0 ? (
                    <div className="relative mt-5 flex flex-wrap gap-2">
                        {chips.map((chip) => (
                            <span key={chip} className="zen-chip">
                                {chip}
                            </span>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default ZenIdentityCard;
