/**
 * Pioneer graphics kit.
 *
 * Every mark here is drawn as inline SVG so it stays razor sharp at any
 * density, inherits the active world colour, and costs no network request.
 * Gradient/filter ids are derived from React's useId so multiple instances
 * never collide.
 */

import React, { useEffect, useId, useMemo, useState } from 'react';
import type { BadgeGlyphKind, WorldGlyphKind } from './pioneerGame';

interface RgbProps {
    /** `r, g, b` triple matching the active world. */
    rgb: string;
    rgbAlt?: string;
}

/* ═══ Program crest ══════════════════════════════════════════════════ */

export const PioneerCrest: React.FC<RgbProps & { className?: string; rank: number }> = ({
    rgb,
    rgbAlt = rgb,
    className = '',
    rank,
}) => {
    const uid = useId().replace(/:/g, '');

    return (
        <svg viewBox="0 0 120 120" className={className} role="img" aria-label="AI Pioneer crest">
            <defs>
                <linearGradient id={`crest-${uid}`} x1="18" y1="8" x2="102" y2="112">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="45%" stopColor={`rgb(${rgb})`} />
                    <stop offset="100%" stopColor={`rgb(${rgbAlt})`} />
                </linearGradient>
                <radialGradient id={`crestGlow-${uid}`} cx="50%" cy="42%" r="60%">
                    <stop offset="0%" stopColor={`rgba(${rgb}, 0.55)`} />
                    <stop offset="100%" stopColor={`rgba(${rgb}, 0)`} />
                </radialGradient>
                <filter id={`crestBlur-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.4" />
                </filter>
            </defs>

            <circle cx="60" cy="60" r="56" fill={`url(#crestGlow-${uid})`} />

            {/* Outer navigation ring with tick marks */}
            <g className="pa-orbit-slow">
                <circle cx="60" cy="60" r="52" fill="none" stroke={`rgba(${rgb}, 0.35)`} strokeWidth="1" />
                {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i / 24) * Math.PI * 2;
                    const long = i % 6 === 0;
                    const r1 = long ? 45 : 48.5;
                    return (
                        <line
                            key={i}
                            x1={60 + Math.cos(angle) * r1}
                            y1={60 + Math.sin(angle) * r1}
                            x2={60 + Math.cos(angle) * 52}
                            y2={60 + Math.sin(angle) * 52}
                            stroke={long ? `rgba(${rgb}, 0.85)` : `rgba(${rgb}, 0.35)`}
                            strokeWidth={long ? 1.6 : 0.9}
                            strokeLinecap="round"
                        />
                    );
                })}
            </g>

            {/* Faceted shield */}
            <path
                d="M60 14 L96 32 V64 C96 86 78 100 60 106 C42 100 24 86 24 64 V32 Z"
                fill="rgba(3, 8, 20, 0.9)"
                stroke={`url(#crest-${uid})`}
                strokeWidth="2.4"
                strokeLinejoin="round"
            />
            <path
                d="M60 14 L96 32 V64 C96 86 78 100 60 106 Z"
                fill={`rgba(${rgb}, 0.10)`}
            />

            {/* Ascending pioneer chevron — reads as both a rising path and an A */}
            <path
                d="M38 78 L60 36 L82 78"
                fill="none"
                stroke={`url(#crest-${uid})`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={`url(#crestBlur-${uid})`}
                opacity="0.75"
            />
            <path
                d="M38 78 L60 36 L82 78"
                fill="none"
                stroke="#ffffff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M48 66 H72" stroke={`rgb(${rgb})`} strokeWidth="4" strokeLinecap="round" />

            {/* Rank pips along the base */}
            {Array.from({ length: 6 }).map((_, i) => (
                <circle
                    key={i}
                    cx={40 + i * 8}
                    cy={92}
                    r={i < rank ? 3 : 1.8}
                    fill={i < rank ? `rgb(${rgb})` : 'rgba(255,255,255,0.22)'}
                />
            ))}
        </svg>
    );
};

/* ═══ World glyphs ═══════════════════════════════════════════════════ */

const glyphPaths: Record<WorldGlyphKind, React.ReactNode> = {
    // ORIGIN — a neuron blooming into signal
    spark: (
        <>
            <circle cx="32" cy="32" r="7" fill="currentColor" />
            {[0, 60, 120, 180, 240, 300].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                return (
                    <g key={deg}>
                        <line
                            x1={32 + Math.cos(rad) * 9}
                            y1={32 + Math.sin(rad) * 9}
                            x2={32 + Math.cos(rad) * 21}
                            y2={32 + Math.sin(rad) * 21}
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                        />
                        <circle cx={32 + Math.cos(rad) * 23} cy={32 + Math.sin(rad) * 23} r="3" fill="currentColor" />
                    </g>
                );
            })}
        </>
    ),
    // FORGE — a prism striking sparks
    forge: (
        <>
            <path d="M32 12 L50 44 H14 Z" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M32 12 V44" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
            <path d="M20 52 H44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M26 44 L22 56 M38 44 L42 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <circle cx="32" cy="30" r="4" fill="currentColor" />
        </>
    ),
    // CIRCUIT — a lattice with routed traces
    circuit: (
        <>
            <rect x="22" y="22" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2.6" />
            <circle cx="32" cy="32" r="3.4" fill="currentColor" />
            {[
                'M32 22 V12', 'M32 42 V52', 'M22 32 H12', 'M42 32 H52',
                'M24 24 L16 16', 'M40 24 L48 16', 'M24 40 L16 48', 'M40 40 L48 48',
            ].map((d) => (
                <path key={d} d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ))}
            {[[32, 10], [32, 54], [10, 32], [54, 32]].map(([cx, cy]) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" fill="currentColor" />
            ))}
        </>
    ),
    // SUMMIT — a peak crowned with a star
    summit: (
        <>
            <path d="M10 50 L26 24 L36 38 L44 26 L54 50 Z" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M10 50 L26 24 L36 38 Z" fill="currentColor" opacity="0.22" />
            <path d="M32 6 L34.6 13 L42 13.6 L36.4 18.4 L38.2 25.6 L32 21.6 L25.8 25.6 L27.6 18.4 L22 13.6 L29.4 13 Z" fill="currentColor" />
        </>
    ),
};

export const WorldGlyph: React.FC<RgbProps & {
    kind: WorldGlyphKind;
    className?: string;
    /** 0-100 — fills the hex frame like a charge meter. */
    charge?: number;
    /** Not yet reached in the recommended order. Still fully reachable — this
     *  only dims the mark, it never gates access. */
    dormant?: boolean;
}> = ({ kind, rgb, rgbAlt = rgb, className = '', charge = 0, dormant = false }) => {
    const locked = dormant;
    const uid = useId().replace(/:/g, '');
    const perimeter = 300;
    const dash = perimeter - (Math.min(100, Math.max(0, charge)) / 100) * perimeter;

    return (
        <svg viewBox="0 0 64 64" className={className} role="img" aria-hidden="true">
            <defs>
                <linearGradient id={`wg-${uid}`} x1="8" y1="4" x2="56" y2="60">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="55%" stopColor={`rgb(${rgb})`} />
                    <stop offset="100%" stopColor={`rgb(${rgbAlt})`} />
                </linearGradient>
                <radialGradient id={`wgGlow-${uid}`} cx="50%" cy="45%" r="55%">
                    <stop offset="0%" stopColor={`rgba(${rgb}, ${locked ? 0.1 : 0.45})`} />
                    <stop offset="100%" stopColor={`rgba(${rgb}, 0)`} />
                </radialGradient>
            </defs>

            <rect x="0" y="0" width="64" height="64" fill={`url(#wgGlow-${uid})`} />

            {/* Hex frame */}
            <path
                d="M32 2 L58 17 V47 L32 62 L6 47 V17 Z"
                fill="rgba(3, 8, 20, 0.82)"
                stroke={locked ? 'rgba(148,163,184,0.35)' : `rgba(${rgb}, 0.5)`}
                strokeWidth="1.6"
                strokeLinejoin="round"
            />

            {/* Charge meter riding the hex edge */}
            {charge > 0 && !locked && (
                <path
                    d="M32 2 L58 17 V47 L32 62 L6 47 V17 Z"
                    fill="none"
                    stroke={`url(#wg-${uid})`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={perimeter}
                    strokeDashoffset={dash}
                    className="pa-ring-sweep"
                    style={{ ['--pa-dash-from' as string]: `${perimeter}` }}
                />
            )}

            <g color={locked ? 'rgba(148,163,184,0.5)' : `rgb(${rgb})`} opacity={locked ? 0.8 : 1}>
                {glyphPaths[kind]}
            </g>
        </svg>
    );
};

/* ═══ Power core (XP / completion ring) ══════════════════════════════ */

export const PowerCore: React.FC<RgbProps & {
    percent: number;
    className?: string;
    label?: string;
    sublabel?: string;
}> = ({ percent, rgb, rgbAlt = rgb, className = '', label, sublabel }) => {
    const uid = useId().replace(/:/g, '');
    const clamped = Math.min(100, Math.max(0, percent));
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clamped / 100) * circumference;

    return (
        <svg viewBox="0 0 140 140" className={className} role="img" aria-label={`${clamped}% complete`}>
            <defs>
                <linearGradient id={`pc-${uid}`} x1="18" y1="18" x2="122" y2="122">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="40%" stopColor={`rgb(${rgb})`} />
                    <stop offset="100%" stopColor={`rgb(${rgbAlt})`} />
                </linearGradient>
                <radialGradient id={`pcCore-${uid}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={`rgba(${rgb}, 0.42)`} />
                    <stop offset="70%" stopColor={`rgba(${rgb}, 0.06)`} />
                    <stop offset="100%" stopColor="rgba(2, 6, 23, 0)" />
                </radialGradient>
                <filter id={`pcGlow-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="4" result="b" />
                    <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <circle cx="70" cy="70" r="64" fill={`url(#pcCore-${uid})`} />

            {/* Tick bezel */}
            <g className="pa-orbit-slow" opacity="0.55">
                {Array.from({ length: 40 }).map((_, i) => {
                    const angle = (i / 40) * Math.PI * 2;
                    return (
                        <line
                            key={i}
                            x1={70 + Math.cos(angle) * 61}
                            y1={70 + Math.sin(angle) * 61}
                            x2={70 + Math.cos(angle) * (i % 5 === 0 ? 55 : 58)}
                            y2={70 + Math.sin(angle) * (i % 5 === 0 ? 55 : 58)}
                            stroke={`rgba(${rgb}, ${i % 5 === 0 ? 0.9 : 0.4})`}
                            strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
                            strokeLinecap="round"
                        />
                    );
                })}
            </g>

            <circle cx="70" cy="70" r={radius} fill="rgba(2, 6, 23, 0.72)" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
            <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="9"
            />
            <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={`url(#pc-${uid})`}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 70 70)"
                filter={`url(#pcGlow-${uid})`}
                className="pa-ring-sweep"
                style={{ ['--pa-dash-from' as string]: `${circumference}` }}
            />

            {/* Inner rotating containment hex */}
            <path
                d="M70 34 L101 52 V88 L70 106 L39 88 V52 Z"
                fill="none"
                stroke={`rgba(${rgb}, 0.22)`}
                strokeWidth="1"
                className="pa-orbit"
                style={{ transformOrigin: '70px 70px' }}
            />

            {label && (
                <text x="70" y={sublabel ? 68 : 78} textAnchor="middle" className="pa-tabular" fill="#ffffff" fontSize="30" fontWeight="800" letterSpacing="-1">
                    {label}
                </text>
            )}
            {sublabel && (
                <text x="70" y="88" textAnchor="middle" fill={`rgba(${rgb}, 0.95)`} fontSize="11" fontWeight="800" letterSpacing="2">
                    {sublabel}
                </text>
            )}
        </svg>
    );
};

/* ═══ Rank sigil ═════════════════════════════════════════════════════ */

export const RankSigil: React.FC<RgbProps & { rank: number; className?: string }> = ({ rank, rgb, className = '' }) => {
    const uid = useId().replace(/:/g, '');
    const chevrons = Math.min(3, Math.max(1, Math.ceil((rank + 1) / 2)));
    const starred = rank >= 5;

    return (
        <svg viewBox="0 0 44 44" className={className} role="img" aria-label={`Rank tier ${rank + 1}`}>
            <defs>
                <linearGradient id={`rs-${uid}`} x1="6" y1="4" x2="38" y2="40">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor={`rgb(${rgb})`} />
                </linearGradient>
            </defs>
            <path d="M22 2 L40 12 V32 L22 42 L4 32 V12 Z" fill="rgba(3,8,20,0.9)" stroke={`rgba(${rgb},0.55)`} strokeWidth="1.4" />
            {Array.from({ length: chevrons }).map((_, i) => (
                <path
                    key={i}
                    d={`M12 ${30 - i * 7} L22 ${20 - i * 7} L32 ${30 - i * 7}`}
                    fill="none"
                    stroke={`url(#rs-${uid})`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            ))}
            {starred && (
                <path
                    d="M22 5.5 L23.6 9.6 L28 9.9 L24.6 12.7 L25.7 17 L22 14.6 L18.3 17 L19.4 12.7 L16 9.9 L20.4 9.6 Z"
                    fill={`rgb(${rgb})`}
                />
            )}
        </svg>
    );
};

/* ═══ Badge medals ═══════════════════════════════════════════════════ */

const badgeGlyphs: Record<BadgeGlyphKind, React.ReactNode> = {
    signal: <><circle cx="24" cy="30" r="3.4" fill="currentColor" /><path d="M15 26 a12 12 0 0 1 18 0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /><path d="M10 21 a20 20 0 0 1 28 0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.65" /></>,
    quill: <><path d="M14 34 C20 20 30 14 36 13 C36 21 30 31 16 36 Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /><path d="M14 34 L24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
    joystick: <><rect x="12" y="28" width="24" height="9" rx="4" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M24 28 V18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /><circle cx="24" cy="15" r="4" fill="currentColor" /></>,
    hammer: <><path d="M14 22 h14 v7 h-14 z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /><path d="M28 25.5 L36 25.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /><path d="M20 29 L20 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></>,
    flask: <><path d="M20 13 v8 L13 35 a3 3 0 0 0 2.7 4.4 h16.6 A3 3 0 0 0 35 35 L28 21 v-8 Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /><path d="M18 13 h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /><circle cx="22" cy="33" r="2" fill="currentColor" /><circle cx="27" cy="30" r="1.4" fill="currentColor" /></>,
    crown: <><path d="M12 34 L14 17 L21 24 L24 14 L27 24 L34 17 L36 34 Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /><path d="M12 34 h24" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></>,
    shield: <><path d="M24 12 L35 17 v9 c0 7-5 11-11 13 c-6-2-11-6-11-13 v-9 Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /><path d="M19 26 l4 4 l7-8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></>,
    star: <><path d="M24 11 L28 21 L39 22 L30.5 29 L33 40 L24 34 L15 40 L17.5 29 L9 22 L20 21 Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /></>,
};

export const BadgeMedal: React.FC<RgbProps & {
    glyph: BadgeGlyphKind;
    earned: boolean;
    className?: string;
}> = ({ glyph, earned, rgb, rgbAlt = rgb, className = '' }) => {
    const uid = useId().replace(/:/g, '');

    return (
        <svg viewBox="0 0 48 48" className={className} role="img" aria-hidden="true">
            <defs>
                <linearGradient id={`bm-${uid}`} x1="8" y1="4" x2="40" y2="44">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor={`rgb(${rgb})`} />
                    <stop offset="100%" stopColor={`rgb(${rgbAlt})`} />
                </linearGradient>
            </defs>
            <path
                d="M24 2 L43 13 V35 L24 46 L5 35 V13 Z"
                fill={earned ? `rgba(${rgb}, 0.14)` : 'rgba(15, 23, 42, 0.7)'}
                stroke={earned ? `url(#bm-${uid})` : 'rgba(148,163,184,0.3)'}
                strokeWidth={earned ? 2 : 1.3}
                strokeLinejoin="round"
            />
            <g color={earned ? `rgb(${rgb})` : 'rgba(148,163,184,0.45)'}>{badgeGlyphs[glyph]}</g>
        </svg>
    );
};

/* ═══ Atlas route — the path that links the four worlds ══════════════ */

/**
 * A transit-map style rail: one station per world, sitting directly above the
 * world cards. The filled portion of the line is how far along the route the
 * learner has actually travelled.
 */
export const AtlasRoute: React.FC<{
    /** One 0-100 value per world node. */
    charges: number[];
    colors: string[];
    labels?: string[];
    className?: string;
}> = ({ charges, colors, labels = [], className = '' }) => {
    const uid = useId().replace(/:/g, '');
    const nodes = charges.length;
    const width = 1000;
    const y = 34;
    // Stations sit at the centre of each equal-width card column.
    const step = width / nodes;
    const xs = charges.map((_, i) => step * i + step / 2);

    const start = xs[0];
    const end = xs[xs.length - 1];
    const cleared = charges.filter((charge) => charge >= 100).length;
    const traveled = nodes > 1
        ? Math.min(1, (cleared + (charges[cleared] ?? 0) / 100) / (nodes - 1))
        : 0;

    return (
        <svg viewBox="0 0 1000 64" className={className} preserveAspectRatio="none" aria-hidden="true">
            <defs>
                <linearGradient id={`ar-${uid}`} x1={start} y1="0" x2={end} y2="0" gradientUnits="userSpaceOnUse">
                    {colors.map((color, i) => (
                        <stop key={i} offset={`${(i / Math.max(1, colors.length - 1)) * 100}%`} stopColor={`rgb(${color})`} />
                    ))}
                </linearGradient>
            </defs>

            <line x1={start} y1={y} x2={end} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="4" strokeLinecap="round" />
            <line
                x1={start}
                y1={y}
                x2={start + (end - start) * traveled}
                y2={y}
                stroke={`url(#ar-${uid})`}
                strokeWidth="4"
                strokeLinecap="round"
            />
            <line
                x1={start}
                y1={y}
                x2={end}
                y2={y}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.2"
                className="pa-trace"
            />

            {xs.map((x, i) => {
                const filled = charges[i] > 0;
                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r="11" fill="rgba(3, 8, 20, 0.95)" stroke={`rgba(${colors[i]}, ${filled ? 0.95 : 0.4})`} strokeWidth="2" />
                        <circle cx={x} cy={y} r={filled ? 5 : 3} fill={filled ? `rgb(${colors[i]})` : 'rgba(148,163,184,0.5)'} />
                        {labels[i] && (
                            <text
                                x={x}
                                y={y - 20}
                                textAnchor="middle"
                                fill={`rgba(${colors[i]}, .9)`}
                                fontSize="15"
                                fontWeight="800"
                                letterSpacing="3"
                            >
                                {labels[i]}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
};

/* ═══ Streak ember ═══════════════════════════════════════════════════ */

export const StreakEmber: React.FC<{ active: boolean; className?: string }> = ({ active, className = '' }) => (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-hidden="true">
        <path
            d="M12 2.5 C13.5 7 17.5 8 17.5 13 a5.5 5.5 0 0 1 -11 0 C6.5 9.5 9 8.5 9.5 5.5 C10.8 6.8 11.6 4.6 12 2.5 Z"
            fill={active ? 'url(#emberGrad)' : 'rgba(148,163,184,0.3)'}
            stroke={active ? 'rgba(253,224,71,0.9)' : 'rgba(148,163,184,0.45)'}
            strokeWidth="1"
        />
        <defs>
            <linearGradient id="emberGrad" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="55%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
        </defs>
    </svg>
);

/* ═══ Celebration burst ══════════════════════════════════════════════ */

const burstPalette = ['#67e8f9', '#a78bfa', '#6ee7b7', '#fde047', '#fb7185', '#ffffff'];

/**
 * Memoised on purpose: the surrounding overlay re-renders while its counters
 * animate, and re-rendering the spark spans restarts their CSS animations.
 */
export const CelebrationBurst: React.FC<{ seed: number; className?: string }> = React.memo(({ seed, className = '' }) => {
    const sparks = useMemo(() => (
        Array.from({ length: 42 }).map((_, i) => {
            const angle = (i / 42) * Math.PI * 2 + seed;
            // Far enough to clear a modal card sitting over the burst origin.
            const distance = 300 + ((i * 37 + seed * 13) % 260);
            return {
                dx: `${Math.cos(angle) * distance}px`,
                dy: `${Math.sin(angle) * distance}px`,
                rot: `${(i * 47) % 360}deg`,
                color: burstPalette[i % burstPalette.length],
                delay: `${(i % 7) * 45}ms`,
                size: 9 + (i % 4) * 5,
            };
        })
    ), [seed]);

    return (
        <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
            <span className="pa-shockwave" />
            {sparks.map((spark, i) => (
                <span
                    key={i}
                    className="pa-spark"
                    style={{
                        ['--pa-dx' as string]: spark.dx,
                        ['--pa-dy' as string]: spark.dy,
                        ['--pa-rot' as string]: spark.rot,
                        background: spark.color,
                        animationDelay: spark.delay,
                        width: spark.size,
                        height: spark.size,
                        boxShadow: `0 0 18px ${spark.color}, 0 0 6px ${spark.color}`,
                    }}
                />
            ))}
        </div>
    );
});

CelebrationBurst.displayName = 'CelebrationBurst';

/* ═══ Count-up number ════════════════════════════════════════════════ */

export const CountUp: React.FC<{ value: number; className?: string; duration?: number }> = ({
    value,
    className = '',
    duration = 900,
}) => {
    const [shown, setShown] = useState(value);

    useEffect(() => {
        const from = shown;
        const delta = value - from;
        if (delta === 0) return undefined;

        const start = performance.now();
        let frame = 0;

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setShown(Math.round(from + delta * eased));
            if (t < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, duration]);

    return <span className={`pa-tabular ${className}`}>{shown.toLocaleString()}</span>;
};
