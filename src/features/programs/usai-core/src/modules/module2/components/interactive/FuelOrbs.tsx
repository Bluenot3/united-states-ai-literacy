import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { InteractiveComponentProps } from '../../types';

interface OrbProps {
    title: string;
    secretName: string;
    color: 'purple' | 'gold';
    onReveal: () => void;
    description: string;
}

const DecryptingText: React.FC<{ targetText: string; onComplete?: () => void }> = ({ targetText, onComplete }) => {
    const [display, setDisplay] = useState('');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

    useEffect(() => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(() => {
                if (iterations > targetText.length + 10) {
                    clearInterval(interval);
                    onComplete?.();
                    return targetText;
                }

                return targetText
                    .split('')
                    .map((char, index) => (index < iterations ? char : chars[Math.floor(Math.random() * chars.length)]))
                    .join('');
            });
            iterations += 0.5;
        }, 30);

        return () => clearInterval(interval);
    }, [onComplete, targetText]);

    return <span className="break-all font-mono">{display}</span>;
};

const Orb: React.FC<OrbProps> = ({ title, secretName, color, onReveal, description }) => {
    const [state, setState] = useState<'idle' | 'decrypting' | 'revealed'>('idle');
    const [copied, setCopied] = useState(false);

    const gradient = color === 'purple' ? 'from-purple-500 via-indigo-500 to-purple-800' : 'from-amber-300 via-yellow-500 to-amber-700';
    const glowColor = color === 'purple' ? 'rgba(139, 92, 246, 0.6)' : 'rgba(245, 158, 11, 0.6)';
    const textColor = color === 'purple' ? 'text-purple-400' : 'text-amber-400';
    const borderColor = color === 'purple' ? 'border-purple-500/30' : 'border-amber-500/30';

    const handleClick = () => {
        if (state !== 'idle') {
            return;
        }

        setState('decrypting');
        onReveal();
        window.setTimeout(() => setState('revealed'), 1400);
    };

    const handleCopy = async (event: React.MouseEvent) => {
        event.stopPropagation();
        await navigator.clipboard.writeText(secretName);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    };

    if (state === 'decrypting' || state === 'revealed') {
        return (
            <div className="relative mx-auto w-full max-w-lg animate-fade-in transition-all duration-500">
                <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r ${gradient} blur opacity-30`} />
                <div className="relative rounded-xl border border-white/10 bg-black/90 p-8 shadow-2xl backdrop-blur-xl">
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <h4 className={`mb-1 text-sm font-black uppercase tracking-[0.2em] ${textColor}`}>{title}</h4>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{description}</p>
                        </div>
                        <div className="flex items-center gap-1.5 rounded border border-white/10 bg-white/5 px-2 py-1">
                            <div className={`h-1.5 w-1.5 rounded-full ${state === 'decrypting' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                            <span className="text-[9px] font-mono uppercase text-gray-400">{state === 'decrypting' ? 'Decrypting' : 'Ready'}</span>
                        </div>
                    </div>

                    <div className={`relative flex items-center gap-3 overflow-hidden rounded-lg border bg-black/50 p-4 ${borderColor}`}>
                        <div className="absolute left-0 top-0 h-[1px] w-full animate-[scan_2s_linear_infinite] bg-white/20" />
                        <code className={`flex-1 break-all font-mono text-xs transition-colors duration-500 ${state === 'decrypting' ? 'text-gray-500' : 'text-white'}`}>
                            {state === 'decrypting' ? <DecryptingText targetText={secretName.replace(/./g, '#')} /> : <DecryptingText targetText={secretName} />}
                        </code>

                        {state === 'revealed' && (
                            <button
                                onClick={handleCopy}
                                className={`rounded-lg border p-2.5 transition-all ${
                                    copied
                                        ? 'border-green-500/30 bg-green-500/20 text-green-400'
                                        : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                                title="Copy secret name"
                            >
                                {copied ? (
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </button>
                        )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-[9px] font-mono text-gray-600">Secret name only. Never expose the secret value in the browser.</span>
                        {copied && <span className="text-[9px] font-bold text-green-500">Secret name copied</span>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            className="group relative flex h-40 w-40 cursor-pointer items-center justify-center transition-all duration-700 hover:scale-105"
        >
            <div className="absolute inset-0 rounded-full blur-3xl opacity-40 transition-opacity duration-1000 group-hover:opacity-60" style={{ backgroundColor: glowColor }} />

            <div
                className={`relative h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-gradient-to-br ${gradient} transition-all duration-500`}
                style={{ boxShadow: `inset 0 -8px 12px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.5), 0 0 30px ${glowColor}` }}
            >
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                    <div className="absolute left-0 top-0 h-[200%] w-[200%] animate-[spin_20s_linear_infinite] bg-[radial-gradient(circle,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:10px_10px]" />
                </div>

                <div className="absolute inset-6 rounded-full bg-black/50 blur-md transition-colors group-hover:bg-black/30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 animate-[spin_4s_linear_infinite_reverse]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 animate-[spin_3s_linear_infinite]">
                            <div className="h-2 w-2 animate-ping rounded-full bg-white shadow-[0_0_15px_5px_white]" />
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">Reveal</span>
                </div>
            </div>

            <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold uppercase tracking-widest ${textColor} opacity-60 transition-colors duration-300 group-hover:translate-y-1 group-hover:opacity-100`}>
                {title}
            </div>
        </div>
    );
};

const FuelOrbs: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [interacted, setInteracted] = useState(false);

    const handleInteract = () => {
        if (!interacted && user && !user.progress.completedInteractives.includes(interactiveId)) {
            addPoints(100);
            updateProgress(interactiveId, 'interactive');
            setInteracted(true);
        }
    };

    return (
        <div className="relative my-24 animate-fade-in-up">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-gradient-to-b from-slate-800 to-black p-1 shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-800 via-gray-950 to-black opacity-90" />
                <div className="absolute left-1/2 top-0 h-[1px] w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-sm" />
                <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-black to-transparent" />

                <div className="relative z-10 flex flex-col items-center px-8 py-16 md:p-20">
                    <div className="mb-20 max-w-2xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Deployment Secrets Checklist</span>
                        </div>
                        <h3 className="mb-6 bg-gradient-to-b from-white via-gray-200 to-gray-600 bg-clip-text text-5xl font-black tracking-tighter text-transparent md:text-7xl">
                            FUEL
                        </h3>
                        <p className="text-sm font-light leading-relaxed text-slate-400 md:text-base">
                            Production apps do not ship with live keys in the frontend. Use this lab to learn the secret names you need to configure in Hugging Face Spaces or your backend environment.
                        </p>
                    </div>

                    <div className="mb-24 grid w-full max-w-5xl grid-cols-1 gap-24 lg:grid-cols-2 lg:gap-32">
                        <div className="flex flex-col items-center gap-8">
                            <Orb
                                title="Cognitive Core"
                                description="Use this secret name for your model provider"
                                secretName="OPENAI_API_KEY"
                                color="purple"
                                onReveal={handleInteract}
                            />
                        </div>

                        <div className="flex flex-col items-center gap-8">
                            <Orb
                                title="Retrieval Engine"
                                description="Optional secret name for web retrieval"
                                secretName="FIRECRAWL_API_KEY"
                                color="gold"
                                onReveal={handleInteract}
                            />
                        </div>
                    </div>

                    <div className="mt-8 w-full max-w-4xl">
                        <div className="relative">
                            <div className="mb-8 text-center">
                                <span className="border-b border-gray-700 pb-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                                    Deployment and Configuration Guide
                                </span>
                            </div>

                            <div className="relative z-10 rounded-xl border border-gray-800 bg-[#0b0f19] p-8 font-sans shadow-2xl">
                                <div className="mb-6 flex items-center gap-2">
                                    <span className="text-xl">API</span>
                                    <h3 className="text-xl font-bold text-white">Secrets Panel</h3>
                                </div>

                                <div className="mb-8">
                                    <label className="mb-2 block text-sm font-semibold text-gray-300">Secret Name</label>
                                    <input
                                        type="text"
                                        value="OPENAI_API_KEY"
                                        disabled
                                        className="mb-3 w-full rounded-lg border border-gray-700 bg-[#1f2937] px-4 py-3 font-mono text-sm text-gray-400"
                                    />
                                    <p className="text-sm text-gray-400">
                                        Add this in your Hugging Face Space or backend secret settings, then read it with <code>os.getenv("OPENAI_API_KEY")</code>.
                                    </p>
                                </div>

                                <div className="mb-2">
                                    <label className="mb-2 block text-sm font-semibold text-gray-300">Optional Retrieval Secret</label>
                                    <input
                                        type="text"
                                        value="FIRECRAWL_API_KEY"
                                        disabled
                                        className="mb-3 w-full rounded-lg border border-gray-700 bg-[#1f2937] px-4 py-3 font-mono text-sm text-gray-400"
                                    />
                                    <p className="text-sm text-gray-400">
                                        Keep optional services separate so your app can still run if retrieval is turned off.
                                    </p>
                                </div>
                            </div>

                            <div className="mx-auto mt-8 max-w-2xl space-y-4 text-center">
                                <p className="text-xs leading-relaxed text-gray-400 md:text-sm">
                                    After you deploy your Hugging Face Space, open the project settings and add these secret names there. Do not paste real keys into frontend source files.
                                </p>
                                <p className="text-xs italic leading-relaxed text-gray-500">
                                    Secret values belong in environment variables, Space secrets, or a backend proxy. The browser should only ever see public keys or final responses.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FuelOrbs;
