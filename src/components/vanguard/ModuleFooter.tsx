import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NextModuleInfo {
    moduleNumber: number;
    title: string;
    subtitle: string;
    accentClassName: string;
    route: string;
}

const NEXT_MODULE_MAP: Record<number, NextModuleInfo> = {
    1: {
        moduleNumber: 2,
        title: 'Agents & Automation Frameworks',
        subtitle: 'Design, deploy, and govern autonomous AI agents that reason, act, and adapt.',
        accentClassName: 'from-sky-500 via-cyan-500 to-emerald-400',
        route: '/module/2',
    },
    2: {
        moduleNumber: 3,
        title: 'Personal Intelligence & Cognitive Systems',
        subtitle: 'Build a second-brain workflow for research, retrieval, and decision support.',
        accentClassName: 'from-emerald-500 via-teal-500 to-cyan-400',
        route: '/module/3',
    },
    3: {
        moduleNumber: 4,
        title: 'AI Systems Mastery & Professional Integration',
        subtitle: 'Move from builder to operator. Govern, evaluate, and scale production AI systems.',
        accentClassName: 'from-amber-500 via-orange-500 to-rose-500',
        route: '/module/4',
    },
    4: {
        moduleNumber: 0, // Program complete
        title: 'Vanguard Certificate',
        subtitle: 'You have completed all four modules. Claim your ZEN AI Vanguard credential.',
        accentClassName: 'from-violet-500 via-fuchsia-500 to-cyan-400',
        route: '/certificate',
    },
};

interface ModuleFooterProps {
    currentModule: number;
}

const ModuleFooter: React.FC<ModuleFooterProps> = ({ currentModule }) => {
    const navigate = useNavigate();
    const next = NEXT_MODULE_MAP[currentModule];

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="mt-16 space-y-6">
            {/* ── Next Module CTA Banner ─────────────────────────────── */}
            {next && (
                <div className="module-cta-banner">
                    <div
                        className="group relative cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(145deg,rgba(7,14,30,0.96)_0%,rgba(12,20,40,0.92)_100%)] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.5)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_32px_80px_rgba(2,6,23,0.6)] md:p-8"
                        onClick={() => navigate(next.route)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && navigate(next.route)}
                        aria-label={`Continue to Module ${next.moduleNumber}: ${next.title}`}
                    >
                        {/* Gradient aurora top edge */}
                        <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${next.accentClassName} opacity-70 transition-opacity duration-300 group-hover:opacity-100`} />

                        {/* Subtle ambient glow */}
                        <div className={`pointer-events-none absolute right-[-4rem] top-[-4rem] h-48 w-48 rounded-full bg-gradient-to-br ${next.accentClassName} opacity-[0.08] blur-3xl transition-opacity duration-500 group-hover:opacity-[0.14]`} />

                        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                                {/* Eyebrow */}
                                <div className="flex items-center gap-2.5">
                                    <span className={`inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r ${next.accentClassName}`} />
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                                        {next.moduleNumber === 0 ? 'Program Complete' : `Up Next · Module ${next.moduleNumber}`}
                                    </p>
                                </div>

                                {/* Title */}
                                <h3 className={`mt-2 bg-gradient-to-r ${next.accentClassName} bg-clip-text text-2xl font-outfit font-black tracking-tight text-transparent md:text-3xl`}>
                                    {next.title}
                                </h3>

                                <p className="mt-2 max-w-xl text-sm leading-7 text-slate-400">
                                    {next.subtitle}
                                </p>
                            </div>

                            {/* CTA Arrow button */}
                            <div className="flex-shrink-0">
                                <div className={`inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r ${next.accentClassName} px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 group-hover:shadow-xl group-hover:scale-105`}>
                                    <span>{next.moduleNumber === 0 ? 'Claim Certificate' : 'Start Module'}</span>
                                    <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Progress dots */}
                        <div className="relative mt-6 flex items-center gap-2">
                            {[1, 2, 3, 4].map((n) => (
                                <div
                                    key={n}
                                    className={[
                                        'h-1.5 rounded-full transition-all duration-300',
                                        n === currentModule
                                            ? `w-8 bg-gradient-to-r ${next.accentClassName}`
                                            : n < currentModule
                                                ? 'w-4 bg-white/40'
                                                : 'w-4 bg-white/15',
                                    ].join(' ')}
                                />
                            ))}
                            <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                                Module {currentModule} of 4
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Standard footer bar ───────────────────────────────── */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-5 backdrop-blur-sm sm:flex-row">
                <p className="text-xs text-slate-500">
                    © {new Date().getFullYear()} ZEN AI Co. — Vanguard Intelligence Architect Program
                </p>
                <button
                    onClick={handleScrollTop}
                    className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-slate-200"
                    aria-label="Back to top"
                >
                    <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                    </svg>
                    Back to Top
                </button>
            </div>
        </footer>
    );
};

export default ModuleFooter;
