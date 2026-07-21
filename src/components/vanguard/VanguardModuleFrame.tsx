import React from 'react';
import { ZenBrandMark, ZenTelemetryCard } from '../zen';

interface VanguardModuleFrameProps {
    moduleNumber: number;
    title: string;
    subtitle: string;
    accentClassName: string;
    chipLabels: string[];
    completedSections: number;
    totalSections: number;
    children: React.ReactNode;
    header: React.ReactNode;
    sidebar: React.ReactNode;
    footer: React.ReactNode;
    activeSectionTitle?: string;
    activeSectionComplete?: boolean;
    canCompleteActiveSection?: boolean;
    completionBlockedReason?: string;
    onCompleteActiveSection?: () => void;
    bleed?: boolean;
}

interface LockedVanguardSectionProps {
    id: string;
    title: string;
    accentClassName: string;
    className?: string;
}

export const LockedVanguardSection = React.forwardRef<HTMLDivElement, LockedVanguardSectionProps>(({
    id,
    title,
    accentClassName,
    className = '',
}, ref) => (
    <div
        id={id}
        ref={ref}
        className={`scroll-mt-28 ${className}`}
        aria-label={`${title} is locked`}
        data-section-locked="true"
    >
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(7,14,30,0.86)_0%,rgba(9,16,33,0.92)_100%)] p-6 opacity-80 shadow-[0_18px_48px_rgba(2,6,23,0.34)] md:p-8">
            <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accentClassName} opacity-35`} />
            <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-400" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                        <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </span>
                <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Locked checkpoint</p>
                    <h2 className="mt-2 text-xl font-black tracking-tight text-slate-300 md:text-2xl">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Complete the previous section to unlock this lesson and its activities.</p>
                </div>
            </div>
        </div>
    </div>
));

LockedVanguardSection.displayName = 'LockedVanguardSection';

const MODULE_AMBIENTS: Record<number, { orb1: string; orb2: string; orb3: string; ring: string }> = {
    1: { orb1: 'bg-violet-500/[0.14]', orb2: 'bg-fuchsia-400/[0.13]', orb3: 'bg-cyan-400/[0.09]', ring: 'from-violet-500 via-fuchsia-500 to-cyan-400' },
    2: { orb1: 'bg-sky-500/[0.13]', orb2: 'bg-cyan-400/[0.12]', orb3: 'bg-emerald-400/[0.09]', ring: 'from-sky-500 via-cyan-500 to-emerald-400' },
    3: { orb1: 'bg-emerald-500/[0.13]', orb2: 'bg-teal-400/[0.12]', orb3: 'bg-cyan-400/[0.09]', ring: 'from-emerald-500 via-teal-500 to-cyan-400' },
    4: { orb1: 'bg-amber-500/[0.13]', orb2: 'bg-orange-400/[0.12]', orb3: 'bg-rose-400/[0.09]', ring: 'from-amber-500 via-orange-500 to-rose-500' },
};

const VanguardModuleFrame: React.FC<VanguardModuleFrameProps> = ({
    moduleNumber,
    title,
    subtitle,
    accentClassName,
    chipLabels,
    completedSections,
    totalSections,
    children,
    header,
    sidebar,
    footer,
    activeSectionTitle,
    activeSectionComplete = false,
    canCompleteActiveSection = true,
    completionBlockedReason,
    onCompleteActiveSection,
    bleed = true,
}) => {
    const progressPercent = totalSections > 0
        ? Math.min(100, Math.round((completedSections / totalSections) * 100))
        : 0;
    const ambient = MODULE_AMBIENTS[moduleNumber] ?? MODULE_AMBIENTS[1];

    return (
        <div className={[
            'relative min-h-screen font-sans text-brand-text',
            'bg-[radial-gradient(circle_at_top_left,_rgba(201,168,76,0.10),_transparent_24%),radial-gradient(circle_at_82%_14%,_rgba(168,85,247,0.14),_transparent_20%),radial-gradient(circle_at_50%_110%,_rgba(56,189,248,0.11),_transparent_34%),linear-gradient(180deg,_#050A18_0%,_#0A1426_48%,_#060B18_100%)]',
            bleed ? '-mx-6 -mt-6' : '',
        ].join(' ')}>

            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className={`absolute left-[-10rem] top-[-10rem] h-80 w-80 rounded-full ${ambient.orb2} blur-3xl`} />
                <div className={`absolute right-[-8rem] top-32 h-96 w-96 rounded-full ${ambient.orb1} blur-3xl`} />
                <div className={`absolute bottom-[-8rem] left-1/3 h-[28rem] w-[28rem] rounded-full ${ambient.orb3} blur-3xl`} />
                <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-zen-gold/[0.04] blur-3xl" />
                <div className="absolute inset-0 bg-grid-pattern [--grid-color:rgba(201,168,76,0.06)] [--grid-size:34px]" />
                <div className="absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-white/[0.04] to-transparent" />
                <div className={`absolute inset-x-[12%] bottom-0 h-52 rounded-full bg-gradient-to-r ${ambient.ring} opacity-[0.08] blur-3xl`} />
                <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.08) 3px, rgba(255,255,255,0.08) 4px)' }} />
            </div>

            <div className="relative flex min-h-screen flex-col">
                {header}

                {/* ─── Main layout: sidebar always visible, no collapse bug ─── */}
                <div className="w-full flex-1 px-2 pb-16 pt-3 sm:px-3 lg:px-4">
                    <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">

                        {/* Sidebar — always in flow, the nav card itself handles collapse */}
                        <div className="hidden lg:block lg:sticky lg:top-4 lg:self-start">
                            {sidebar}
                        </div>

                        {/* Main content column */}
                        <div className="min-w-0">

                            {/* Hero banner */}
                            <section className="zen-hero-panel relative mb-4 overflow-hidden rounded-[1.6rem] px-5 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.38)] backdrop-blur-xl sm:px-6">
                                <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${accentClassName} opacity-80`} />
                                <div className={`pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-gradient-to-br ${accentClassName} opacity-[0.10] blur-3xl`} />
                                <div className={`pointer-events-none absolute -left-8 bottom-0 h-40 w-40 rounded-full bg-gradient-to-tr ${accentClassName} opacity-[0.07] blur-2xl`} />

                                <div className="relative">
                                    {/* Chips */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="zen-eyebrow-chip">Module {moduleNumber}</span>
                                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">Vanguard</span>
                                        {progressPercent === 100 && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/[0.12] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Complete
                                            </span>
                                        )}
                                        {progressPercent > 0 && progressPercent < 100 && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-cyan-400/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                                                <span className="relative flex h-1.5 w-1.5">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                                </span>
                                                In Progress
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <div className="mt-3 flex items-start gap-3">
                                        <ZenBrandMark size="sm" />
                                        <div className="min-w-0">
                                            <h1 className="font-display max-w-4xl text-[1.7rem] font-semibold tracking-[0.04em] text-[#f8e5b3] sm:text-2xl lg:text-[2.2rem] lg:leading-[1.1]">{title}</h1>
                                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{subtitle}</p>
                                        </div>
                                    </div>

                                    {/* Topic chips */}
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {chipLabels.map((label) => (
                                            <span key={label} className="zen-chip transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10">{label}</span>
                                        ))}
                                    </div>

                                    {/* Telemetry */}
                                    <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                                        <ZenTelemetryCard title="Progress" value={`${progressPercent}%`} subtitle="Live section completion" icon="progress" variant="progress" />
                                        <ZenTelemetryCard title="Completed" value={`${completedSections}`} subtitle="Sections cleared" icon="verify" variant="integrity" />
                                        <ZenTelemetryCard title="Remaining" value={`${Math.max(totalSections - completedSections, 0)}`} subtitle="Sections left in queue" icon="readiness" variant="readiness" />
                                    </div>
                                </div>
                            </section>

                            {/* Mobile sidebar */}
                            <div className="mb-4 lg:hidden">{sidebar}</div>

                            {onCompleteActiveSection && activeSectionTitle && (
                                <div className="sticky top-3 z-30 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-200/20 bg-[#07101f]/95 px-4 py-3 shadow-[0_18px_50px_rgba(2,6,23,.55)] backdrop-blur-xl">
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">Current checkpoint</p>
                                        <p className="mt-1 truncate text-sm font-bold text-white">{activeSectionTitle}</p>
                                        {!activeSectionComplete && !canCompleteActiveSection && completionBlockedReason && (
                                            <p className="mt-1 text-xs text-amber-200">{completionBlockedReason}</p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={onCompleteActiveSection}
                                        disabled={activeSectionComplete || !canCompleteActiveSection}
                                        className="rounded-full bg-cyan-100 px-4 py-2 text-xs font-black text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-default disabled:bg-emerald-300 disabled:text-emerald-950"
                                    >
                                        {activeSectionComplete
                                            ? 'Section completed'
                                            : canCompleteActiveSection
                                                ? 'Complete this section'
                                                : 'Complete required quiz'}
                                    </button>
                                </div>
                            )}

                            {/* Content */}
                            <main className="min-w-0 text-white">{children}</main>

                            {/* Footer */}
                            <div>{footer}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VanguardModuleFrame;
