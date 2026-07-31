/**
 * ZEN Treasury — security-engraving graphics.
 *
 * The visual language of banknote and certificate security printing, drawn
 * procedurally as SVG: guilloché rosettes cut on a geometric lathe, interlaced
 * border bands, microprint, security threads, intaglio hatching, and engraved
 * medallion frames.
 *
 * Deliberately *not* currency: no denominations, no currency symbols, no
 * government seals or marks, no portrait likenesses. This is the craft of
 * security engraving applied as ZEN chrome — the guilloché is real math, the
 * microprint is real repeated text, and none of it imitates a financial
 * instrument or an official document.
 *
 * Every mark inherits the active world colour and costs no network request.
 */

import React, { useId, useMemo } from 'react';

/* ═══ Guilloché math ═════════════════════════════════════════════════
   A geometric lathe traces a point on a circle rolling inside (hypotrochoid)
   or outside (epitrochoid) another circle. Overlaying several passes with a
   small phase offset produces the woven rosette you see on engraved
   certificates — impossible to redraw freehand, trivial to express as math.
   ═══════════════════════════════════════════════════════════════════ */

interface RosetteParams {
    /** Fixed circle radius. */
    R: number;
    /** Rolling circle radius — R/r controls the number of petals. */
    r: number;
    /** Pen offset from the rolling circle's centre; controls petal depth. */
    d: number;
    /** Outside (epitrochoid) instead of inside (hypotrochoid). */
    outer?: boolean;
    /** Samples around the full sweep. Higher = smoother, heavier DOM. */
    steps?: number;
    /** Radians of rotation applied to the whole curve. */
    phase?: number;
}

export function trochoidPath({ R, r, d, outer = false, steps = 720, phase = 0 }: RosetteParams): string {
    // The curve closes after r/gcd(R,r) revolutions.
    const gcd = (a: number, b: number): number => (b < 0.0001 ? a : gcd(b, a % b));
    const revolutions = Math.max(1, Math.min(24, Math.round(r / Math.max(0.001, gcd(R, r)))));
    const total = steps * revolutions;
    const parts: string[] = [];

    for (let i = 0; i <= total; i += 1) {
        const t = (i / steps) * Math.PI * 2 + phase;
        const k = outer ? (R + r) / r : (R - r) / r;
        const base = outer ? R + r : R - r;

        const x = base * Math.cos(t) + (outer ? -d : d) * Math.cos(k * t);
        const y = base * Math.sin(t) - d * Math.sin(k * t);

        parts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`);
    }

    return parts.join(' ');
}

/**
 * A guilloché rosette — the engraved medallion at the heart of the aesthetic.
 * Several lathe passes at increasing phase build the woven moiré.
 */
export const GuillocheRosette: React.FC<{
    rgb: string;
    rgbAlt?: string;
    className?: string;
    /** Number of overlaid lathe passes. */
    passes?: number;
    /** Petal count driver — higher is busier. */
    petals?: number;
    opacity?: number;
    /** Slowly rotate, like a lathe still turning. */
    spin?: boolean;
    strokeWidth?: number;
}> = ({
    rgb,
    rgbAlt = rgb,
    className = '',
    passes = 5,
    petals = 11,
    opacity = 0.55,
    spin = false,
    strokeWidth = 0.5,
}) => {
    const uid = useId().replace(/:/g, '');

    const paths = useMemo(() => {
        const R = 46;
        const r = R / petals;
        return Array.from({ length: passes }).map((_, i) =>
            trochoidPath({
                R,
                r,
                d: r * (1.5 + i * 0.34),
                steps: 240,
                phase: (i * Math.PI) / (passes * petals),
            }),
        );
    }, [passes, petals]);

    return (
        <svg viewBox="-56 -56 112 112" className={className} aria-hidden="true">
            <defs>
                <linearGradient id={`gr-${uid}`} x1="-46" y1="-46" x2="46" y2="46" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="45%" stopColor={`rgb(${rgb})`} />
                    <stop offset="100%" stopColor={`rgb(${rgbAlt})`} />
                </linearGradient>
            </defs>
            <g
                className={spin ? 'zt-lathe' : undefined}
                stroke={`url(#gr-${uid})`}
                strokeWidth={strokeWidth}
                fill="none"
                opacity={opacity}
            >
                {paths.map((d, i) => <path key={i} d={d} />)}
            </g>
        </svg>
    );
};

/**
 * An interlaced guilloché border band — the running ornament along the edge of
 * an engraved document. Two counter-phased wave families woven together.
 */
export const GuillocheBand: React.FC<{
    rgb: string;
    className?: string;
    /** Wave cycles across the band. */
    cycles?: number;
    /** Lines per wave family. */
    lines?: number;
    opacity?: number;
}> = ({ rgb, className = '', cycles = 9, lines = 7, opacity = 0.5 }) => {
    const uid = useId().replace(/:/g, '');
    const W = 1200;
    const H = 40;

    const families = useMemo(() => {
        const build = (direction: 1 | -1) =>
            Array.from({ length: lines }).map((_, i) => {
                const amplitude = 6 + i * 1.6;
                const offset = (i / lines) * Math.PI;
                const pts: string[] = [];
                for (let x = 0; x <= W; x += 6) {
                    const y =
                        H / 2 +
                        direction * amplitude * Math.sin((x / W) * cycles * Math.PI * 2 + offset) +
                        (amplitude / 3) * Math.sin((x / W) * cycles * Math.PI * 6 + offset * 2);
                    pts.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(2)}`);
                }
                return pts.join(' ');
            });
        return [build(1), build(-1)];
    }, [cycles, lines]);

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className={className} preserveAspectRatio="none" aria-hidden="true">
            <defs>
                <linearGradient id={`gb-${uid}`} x1="0" y1="0" x2={W} y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={`rgba(${rgb}, 0)`} />
                    <stop offset="22%" stopColor={`rgba(${rgb}, 1)`} />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="78%" stopColor={`rgba(${rgb}, 1)`} />
                    <stop offset="100%" stopColor={`rgba(${rgb}, 0)`} />
                </linearGradient>
            </defs>
            <g stroke={`url(#gb-${uid})`} strokeWidth="0.6" fill="none" opacity={opacity}>
                {families.map((family, fi) => family.map((d, i) => <path key={`${fi}-${i}`} d={d} />))}
            </g>
        </svg>
    );
};

/**
 * Microprint — the line of tiny repeated text that reads as a rule at normal
 * size and resolves into words up close. A real anti-counterfeit technique and
 * a genuinely rewarding detail to discover.
 */
export const Microprint: React.FC<{
    text?: string;
    rgb: string;
    className?: string;
    repeat?: number;
    size?: number;
}> = ({ text = 'ZEN·AI·PIONEER·PROGRAM·', rgb, className = '', repeat = 24, size = 3.4 }) => (
    <svg viewBox="0 0 1200 8" className={className} preserveAspectRatio="none" aria-hidden="true">
        <text
            x="0"
            y="5.6"
            fill={`rgba(${rgb}, .85)`}
            fontSize={size}
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
            letterSpacing="0.6"
        >
            {text.repeat(repeat)}
        </text>
    </svg>
);

/**
 * The embedded security thread: a band carrying repeated micro-text with an
 * optically-variable sheen that travels along it.
 */
export const SecurityThread: React.FC<{
    rgb: string;
    label?: string;
    className?: string;
    vertical?: boolean;
}> = ({ rgb, label = 'ZEN SECURE', className = '', vertical = false }) => (
    <div
        className={`zt-thread overflow-hidden ${className}`}
        style={{
            ['--zt-rgb' as string]: rgb,
            writingMode: vertical ? ('vertical-rl' as const) : undefined,
        }}
        aria-hidden="true"
    >
        <span className="zt-thread-text">{`${label} · `.repeat(24)}</span>
    </div>
);

/**
 * Engraved medallion frame — the oval vignette that surrounds a portrait on an
 * engraved certificate. Here it frames a world glyph instead of a face.
 */
export const EngravedMedallion: React.FC<{
    rgb: string;
    rgbAlt?: string;
    className?: string;
    children?: React.ReactNode;
    /** 0-100, drives the progress arc cut into the outer ring. */
    charge?: number;
    dormant?: boolean;
}> = ({ rgb, rgbAlt = rgb, className = '', children, charge = 0, dormant = false }) => {
    const uid = useId().replace(/:/g, '');
    const radius = 44;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(100, Math.max(0, charge)) / 100) * circumference;
    const tint = dormant ? 'rgba(148,163,184,0.45)' : `rgb(${rgb})`;

    return (
        <div className={`relative ${className}`}>
            <svg viewBox="-56 -56 112 112" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                    <linearGradient id={`em-${uid}`} x1="-44" y1="-44" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="50%" stopColor={tint} />
                        <stop offset="100%" stopColor={dormant ? 'rgba(148,163,184,0.4)' : `rgb(${rgbAlt})`} />
                    </linearGradient>
                    <radialGradient id={`emGlow-${uid}`} cx="50%" cy="46%" r="52%">
                        <stop offset="0%" stopColor={`rgba(${rgb}, ${dormant ? 0.05 : 0.3})`} />
                        <stop offset="100%" stopColor={`rgba(${rgb}, 0)`} />
                    </radialGradient>
                </defs>

                <circle cx="0" cy="0" r="52" fill={`url(#emGlow-${uid})`} />

                {/* Rosette bed, cut on the lathe */}
                <g transform="scale(0.78)">
                    <GuillocheRosetteInline rgb={rgb} rgbAlt={rgbAlt} dormant={dormant} />
                </g>

                {/* Beaded rim — the dotted collar of a struck medallion */}
                {Array.from({ length: 72 }).map((_, i) => {
                    const angle = (i / 72) * Math.PI * 2;
                    return (
                        <circle
                            key={i}
                            cx={Math.cos(angle) * 50}
                            cy={Math.sin(angle) * 50}
                            r={i % 6 === 0 ? 1.15 : 0.6}
                            fill={dormant ? 'rgba(148,163,184,0.35)' : `rgba(${rgb}, ${i % 6 === 0 ? 0.95 : 0.5})`}
                        />
                    );
                })}

                <circle cx="0" cy="0" r={radius} fill="rgba(3, 7, 16, 0.72)" stroke={`rgba(${rgb}, .3)`} strokeWidth="0.8" />

                {charge > 0 && !dormant && (
                    <circle
                        cx="0"
                        cy="0"
                        r={radius}
                        fill="none"
                        stroke={`url(#em-${uid})`}
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform="rotate(-90)"
                    />
                )}
            </svg>
            <div className="relative flex h-full w-full items-center justify-center">{children}</div>
        </div>
    );
};

/** Rosette drawn inline (no nested <svg>) for use inside another viewBox. */
const GuillocheRosetteInline: React.FC<{ rgb: string; rgbAlt: string; dormant?: boolean }> = ({
    rgb,
    rgbAlt,
    dormant,
}) => {
    const uid = useId().replace(/:/g, '');
    const paths = useMemo(() => {
        const R = 46;
        const petals = 13;
        const r = R / petals;
        return Array.from({ length: 4 }).map((_, i) =>
            trochoidPath({ R, r, d: r * (1.6 + i * 0.4), steps: 200, phase: (i * Math.PI) / (4 * petals) }),
        );
    }, []);

    return (
        <>
            <defs>
                <linearGradient id={`gri-${uid}`} x1="-46" y1="-46" x2="46" y2="46" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor={`rgb(${rgb})`} />
                    <stop offset="100%" stopColor={`rgb(${rgbAlt})`} />
                </linearGradient>
            </defs>
            <g
                stroke={dormant ? 'rgba(148,163,184,0.28)' : `url(#gri-${uid})`}
                strokeWidth="0.42"
                fill="none"
                opacity={dormant ? 0.4 : 0.75}
            >
                {paths.map((d, i) => <path key={i} d={d} />)}
            </g>
        </>
    );
};

/**
 * The ornate corner cartouche that carries a number on an engraved document.
 * Used for quest indices — an engraved counter, never a denomination.
 */
export const CornerCartouche: React.FC<{
    value: string;
    rgb: string;
    className?: string;
}> = ({ value, rgb, className = '' }) => {
    const uid = useId().replace(/:/g, '');

    return (
        <svg viewBox="0 0 72 72" className={className} aria-hidden="true">
            <defs>
                <linearGradient id={`cc-${uid}`} x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor={`rgb(${rgb})`} />
                </linearGradient>
            </defs>

            {/* Scalloped guilloché frame */}
            <path
                d="M36 3 L52 10 L62 20 L69 36 L62 52 L52 62 L36 69 L20 62 L10 52 L3 36 L10 20 L20 10 Z"
                fill="rgba(3, 7, 16, 0.85)"
                stroke={`url(#cc-${uid})`}
                strokeWidth="1.4"
                strokeLinejoin="round"
            />
            <path
                d="M36 9 L48 14 L58 24 L63 36 L58 48 L48 58 L36 63 L24 58 L14 48 L9 36 L14 24 L24 14 Z"
                fill="none"
                stroke={`rgba(${rgb}, .45)`}
                strokeWidth="0.6"
            />
            <text
                x="36"
                y="45"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="26"
                fontWeight="800"
                letterSpacing="-1"
                fontFamily="'Space Grotesk', system-ui, sans-serif"
            >
                {value}
            </text>
        </svg>
    );
};

/**
 * Intaglio hatch — the fine parallel line shading that gives engraved printing
 * its depth. Exposed as a reusable SVG pattern id.
 */
export const IntaglioHatchDefs: React.FC<{ id: string; rgb: string; angle?: number; gap?: number }> = ({
    id,
    rgb,
    angle = -35,
    gap = 4,
}) => (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
            <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
                <line x1="0" y1="0" x2="0" y2={gap} stroke={`rgba(${rgb}, .35)`} strokeWidth="0.7" />
            </pattern>
        </defs>
    </svg>
);

/**
 * A full-bleed guilloché watermark for panel backgrounds — the ghosted rosette
 * that sits under the text on an engraved certificate.
 */
export const GuillocheWatermark: React.FC<{ rgb: string; className?: string; opacity?: number }> = ({
    rgb,
    className = '',
    opacity = 0.22,
}) => (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
        <GuillocheRosette
            rgb={rgb}
            rgbAlt={rgb}
            passes={6}
            petals={17}
            opacity={opacity}
            strokeWidth={0.35}
            className="absolute -right-24 -top-28 h-[min(38rem,72vw)] w-[min(38rem,72vw)]"
        />
    </div>
);
