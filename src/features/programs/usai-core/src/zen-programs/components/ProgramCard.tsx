import React from 'react';
import { Link } from 'react-router-dom';
import type { ProgramInfo } from '../types';
import { getAccentClasses } from '../programsRegistry';

interface ProgramCardProps {
    program: ProgramInfo;
    variant?: 'light' | 'dark' | 'glass';
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, variant = 'light' }) => {
    const colors = getAccentClasses(program.accentColor);

    // Glass variant - premium glassmorphic style
    if (variant === 'glass') {
        return (
            <Link
                to={program.route}
                className="group relative block"
            >
                {/* Outer glow on hover */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-30 rounded-3xl blur-xl transition-all duration-500`} />

                {/* Glass card */}
                <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-500 group-hover:shadow-2xl overflow-hidden">
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-2xl">
                        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rotate-12" />
                    </div>

                    {/* Inner glow corner */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.gradient} opacity-[0.08] rounded-bl-[60px] group-hover:opacity-[0.15] transition-opacity`} />

                    {/* Badge */}
                    {program.badge && (
                        <div className="absolute -top-px left-6 right-6 flex justify-center">
                            <span className={`inline-block px-4 py-1.5 text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r ${colors.gradient} text-white rounded-b-xl shadow-lg shadow-${colors.shadow || 'cyan-500/20'}`}>
                                {program.badge}
                            </span>
                        </div>
                    )}

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-5">
                            {/* Icon with glass effect */}
                            <div className="relative flex-shrink-0">
                                <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-30 rounded-xl blur-md group-hover:opacity-50 transition-opacity`} />
                                <div className="relative w-14 h-14 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center group-hover:border-white/[0.2] transition-colors">
                                    <span className="text-2xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{program.icon}</span>
                                </div>
                            </div>

                            {/* Title and description */}
                            <div className="flex-1 min-w-0 pt-1">
                                <h3 className="font-bold text-lg text-white group-hover:text-cyan-50 transition-colors tracking-tight">
                                    {program.name}
                                </h3>
                                <p className="text-sm text-slate-400 mt-1.5 line-clamp-2 leading-relaxed group-hover:text-slate-300 transition-colors">
                                    {program.description}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                            {/* Status indicator */}
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Ready</span>
                            </div>

                            {/* Enter button */}
                            <div className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-white/[0.03] backdrop-blur-sm text-slate-300 border border-white/[0.08] group-hover:border-cyan-500/30 group-hover:bg-white/[0.08] group-hover:text-white transition-all duration-300`}>
                                <span>Enter</span>
                                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Subtle noise texture */}
                    <div className="absolute inset-0 opacity-[0.015] pointer-events-none rounded-2xl" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }} />
                </div>
            </Link>
        );
    }

    // Dark variant
    if (variant === 'dark') {
        return (
            <Link
                to={program.route}
                className="group relative block"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />

                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-cyan-500/10 overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent transform -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-out" />
                    </div>

                    {program.badge && (
                        <div className="absolute -top-px left-6 right-6 flex justify-center">
                            <span className={`inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r ${colors.gradient} text-white rounded-b-lg shadow-lg`}>
                                {program.badge}
                            </span>
                        </div>
                    )}

                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${colors.gradient} opacity-10 rounded-bl-[40px]`} />

                    <div className="relative z-10">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="relative flex-shrink-0">
                                <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-20 rounded-xl blur-md group-hover:opacity-40 transition-opacity`} />
                                <div className="relative w-14 h-14 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center group-hover:border-slate-600/50 transition-colors">
                                    <span className="text-2xl filter drop-shadow-lg">{program.icon}</span>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0 pt-1">
                                <h3 className="font-bold text-lg text-white group-hover:text-cyan-50 transition-colors tracking-tight">
                                    {program.name}
                                </h3>
                                <p className="text-sm text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                    {program.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Ready</span>
                            </div>

                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-slate-800 text-slate-300 border border-slate-700/50 group-hover:border-cyan-500/30 group-hover:bg-slate-800/80 group-hover:text-cyan-300 transition-all duration-300">
                                <span>Enter</span>
                                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                    }} />
                </div>
            </Link>
        );
    }

    // Light variant (original)
    return (
        <Link
            to={program.route}
            className="group relative block"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-5 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300`} />

            <div className={`relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-elevated border border-white/50 hover:shadow-elevated-lg transition-all duration-500 hover:-translate-y-2`}>
                {program.badge && (
                    <div className="absolute -top-3 left-6 right-6 flex justify-center">
                        <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r ${colors.gradient} text-white shadow-lg`}>
                            {program.badge}
                        </span>
                    </div>
                )}

                <div className="flex items-start gap-4 mt-2">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 text-white flex-shrink-0`}>
                        <span className="text-3xl filter drop-shadow-md">{program.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-brand-text">
                            {program.name}
                        </h3>
                        <p className="text-sm text-brand-text-light mt-1 line-clamp-2">
                            {program.description}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r ${colors.gradient} text-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                        Enter
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ProgramCard;
