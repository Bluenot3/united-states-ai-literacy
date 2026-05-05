import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBilling } from '../contexts/BillingContext';

const BillingSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { checkEntitlement } = useBilling();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [countdown, setCountdown] = useState(4);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            const sessionId = searchParams.get('session_id');

            if (!sessionId) {
                setStatus('error');
                return;
            }

            // Allow a moment for the Stripe webhook to process
            await new Promise(resolve => setTimeout(resolve, 2000));
            await checkEntitlement();
            setStatus('success');
        };

        verifyPayment();
    }, [searchParams, checkEntitlement]);

    // Countdown + redirect once success
    useEffect(() => {
        if (status !== 'success') return;

        timerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    navigate('/hub', { replace: true });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [status, navigate]);

    return (
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,_rgba(201,168,76,0.08),_transparent_60%),linear-gradient(135deg,_#020617_0%,_#060B18_40%,_#0A1628_70%,_#060B18_100%)] text-white">
            {/* Grid overlay */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(201,168,76,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.4) 1px, transparent 1px)`,
                    backgroundSize: '48px 48px',
                }}
            />

            {/* Ambient glow blobs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-15%] h-[500px] w-[500px] rounded-full bg-zen-gold/[0.04] blur-[120px]" />
                <div className="absolute bottom-[-15%] right-[-10%] h-[400px] w-[400px] rounded-full bg-brand-cyan/[0.04] blur-[100px]" />
            </div>

            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
                {/* Logo */}
                <div className="mb-10 flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-zen-gold via-zen-gold-light to-zen-gold-dark text-base font-black text-zen-navy shadow-[0_10px_24px_rgba(201,168,76,0.25)]">
                        Z
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-zen-gold/70">ZEN Vanguard</p>
                </div>

                {/* Loading state */}
                {status === 'loading' && (
                    <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-[2px] border-zen-gold/10 border-t-zen-gold animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-3 w-3 rounded-full bg-zen-gold/60 animate-pulse" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Confirming your payment</h2>
                            <p className="mt-2 text-sm text-slate-400">Verifying with Stripe and activating your access…</p>
                        </div>
                        <div className="w-full rounded-full border border-zen-gold/10 bg-zen-gold/[0.04] px-4 py-2 text-xs text-slate-500">
                            This only takes a moment.
                        </div>
                    </div>
                )}

                {/* Success state */}
                {status === 'success' && (
                    <div className="w-full max-w-md animate-scale-in">
                        <div className="rounded-[2rem] border border-zen-gold/15 bg-zen-surface/60 p-8 shadow-zen-card backdrop-blur-xl sm:p-10">
                            {/* Success icon */}
                            <div className="mb-7 flex justify-center">
                                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-zen-emerald/20 to-zen-emerald/5 ring-1 ring-zen-emerald/30">
                                    <svg className="h-9 w-9 text-zen-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div className="absolute inset-0 rounded-2xl bg-zen-emerald/5 blur-sm" />
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-zen-gold/15 bg-zen-gold/[0.06] px-3 py-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-zen-emerald animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zen-gold">Subscription Active</span>
                                </div>
                                <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">Payment confirmed.</h2>
                                <p className="mt-3 text-sm leading-7 text-slate-400">
                                    Welcome to ZEN Vanguard. All four modules, interactive labs, and certification tracks
                                    are now unlocked for your account.
                                </p>
                            </div>

                            {/* Feature list */}
                            <div className="mt-7 space-y-2.5">
                                {[
                                    'All 4 AI learning modules — fully unlocked',
                                    'Interactive labs, simulations & certifications',
                                    'Program Hub with guided learning paths',
                                ].map(feat => (
                                    <div key={feat} className="flex items-center gap-3 rounded-xl border border-zen-gold/8 bg-zen-gold/[0.03] px-4 py-3">
                                        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-zen-emerald/15 text-[10px] font-bold text-zen-emerald ring-1 ring-zen-emerald/25">
                                            ✓
                                        </div>
                                        <span className="text-sm text-slate-300">{feat}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Redirect progress */}
                            <div className="mt-8">
                                <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                                    <span>Redirecting to Program Hub</span>
                                    <span className="font-semibold text-zen-gold">{countdown}s</span>
                                </div>
                                <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-zen-gold to-zen-gold-light transition-all duration-1000"
                                        style={{ width: `${((4 - countdown) / 4) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/hub', { replace: true })}
                                className="mt-6 w-full rounded-full bg-gradient-to-r from-zen-gold via-zen-gold-light to-zen-gold px-5 py-3.5 text-sm font-bold text-zen-navy transition hover:opacity-90 hover:shadow-glowing-gold"
                            >
                                Enter Program Hub now →
                            </button>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {status === 'error' && (
                    <div className="w-full max-w-md animate-scale-in">
                        <div className="rounded-[2rem] border border-rose-500/20 bg-zen-surface/60 p-8 shadow-zen-card backdrop-blur-xl sm:p-10">
                            <div className="mb-7 flex justify-center">
                                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-500/10 ring-1 ring-rose-500/25">
                                    <svg className="h-9 w-9 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="text-center">
                                <h2 className="text-2xl font-black text-white">Verification failed</h2>
                                <p className="mt-3 text-sm leading-7 text-slate-400">
                                    We couldn't verify your payment session. If you completed payment, your access may still be activated —
                                    try signing in again. Otherwise contact support.
                                </p>
                            </div>

                            <div className="mt-8 flex flex-col gap-3">
                                <button
                                    onClick={() => navigate('/hub', { replace: true })}
                                    className="w-full rounded-full bg-gradient-to-r from-zen-gold via-zen-gold-light to-zen-gold px-5 py-3.5 text-sm font-bold text-zen-navy transition hover:opacity-90"
                                >
                                    Go to Hub
                                </button>
                                <button
                                    onClick={() => navigate('/paywall')}
                                    className="w-full rounded-full border border-slate-700 bg-transparent px-5 py-3 text-sm font-semibold text-slate-400 transition hover:border-slate-600 hover:text-white"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillingSuccessPage;
