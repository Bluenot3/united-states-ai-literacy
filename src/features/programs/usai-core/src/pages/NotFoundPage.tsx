import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <main className="relative min-h-screen overflow-hidden bg-zen-navy text-white">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_18%_18%,rgba(201,168,76,0.14),transparent_58%),radial-gradient(ellipse_70%_50%_at_80%_78%,rgba(34,211,238,0.12),transparent_60%),linear-gradient(180deg,#060B18_0%,#081021_48%,#060B18_100%)]" />

            <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
                <div className="inline-flex items-center rounded-full border border-zen-gold/25 bg-zen-gold/[0.08] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-zen-gold">
                    Route Not Found
                </div>

                <h1 className="mt-8 max-w-4xl font-display text-5xl font-semibold tracking-[0.04em] text-[#f7e4b0] sm:text-6xl">
                    The requested path is outside the Vanguard grid.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                    The page you requested does not exist, may have moved, or is not available in the current environment.
                    Use a verified entry point below to return to the live workspace.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="rounded-full bg-gradient-to-r from-zen-gold to-zen-gold-light px-6 py-3 text-sm font-semibold text-zen-navy transition duration-300 hover:-translate-y-0.5 hover:shadow-glowing-gold"
                    >
                        Open workspace
                    </Link>
                    <Link
                        to="/login"
                        className="rounded-full border border-zen-gold/20 bg-zen-gold/[0.06] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-zen-gold/30"
                    >
                        Go to login
                    </Link>
                </div>

                <div className="mt-14 grid w-full max-w-4xl gap-4 text-left md:grid-cols-3">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zen-gold">Primary</p>
                        <p className="mt-3 text-lg font-semibold text-white">Program Hub</p>
                        <p className="mt-2 text-sm leading-7 text-slate-400">
                            Browse the full Vanguard learning surface and launch into active programs.
                        </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-brand-cyan">Research</p>
                        <p className="mt-3 text-lg font-semibold text-white">Documentation</p>
                        <p className="mt-2 text-sm leading-7 text-slate-400">
                            Use the docs layer for deployment notes, references, and operational guidance.
                        </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-300">Proof</p>
                        <p className="mt-3 text-lg font-semibold text-white">Certificates</p>
                        <p className="mt-2 text-sm leading-7 text-slate-400">
                            Completed modules issue verifiable artifacts that remain visible in the dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default NotFoundPage;
