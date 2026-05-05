import React, { useState } from 'react';
import { useBilling } from '../contexts/BillingContext';

const includedFeatures = [
    { label: '4 structured AI learning modules', icon: '◈' },
    { label: 'Interactive labs and simulations', icon: '◈' },
    { label: 'Agent deployment and automation training', icon: '◈' },
    { label: 'Certificates and progress tracking', icon: '◈' },
    { label: 'Program Hub and guided learning paths', icon: '◈' },
];

const PaywallPage: React.FC = () => {
    const { createCheckoutSession, adminBypass, error } = useBilling();
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminError, setAdminError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        const url = await createCheckoutSession();
        if (url) {
            window.location.href = url;
        }
        setLoading(false);
    };

    const handleAdminLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setAdminError('');
        setLoading(true);

        const success = await adminBypass(adminUsername, adminPassword);

        if (success) {
            window.location.href = '/hub';
        } else {
            setAdminError('Admin access unavailable or credentials rejected.');
        }

        setLoading(false);
    };

    const closeAdminModal = () => {
        setShowAdminModal(false);
        setAdminError('');
        setAdminUsername('');
        setAdminPassword('');
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_15%_20%,_rgba(201,168,76,0.07),_transparent_50%),radial-gradient(ellipse_70%_50%_at_85%_80%,_rgba(34,211,238,0.05),_transparent_45%),linear-gradient(135deg,_#020617_0%,_#060B18_40%,_#0A1628_70%,_#060B18_100%)] text-white">
            {/* Grid overlay */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(201,168,76,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.4) 1px, transparent 1px)`,
                    backgroundSize: '48px 48px',
                }}
            />

            {/* Ambient blobs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-20%] h-[600px] w-[600px] rounded-full bg-zen-gold/[0.04] blur-[120px] animate-blob" />
                <div className="animation-delay-2000 absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-brand-cyan/[0.04] blur-[100px] animate-blob" />
            </div>

            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-14">
                {/* Logo */}
                <div className="mb-10 flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-zen-gold via-zen-gold-light to-zen-gold-dark text-xl font-black text-zen-navy shadow-[0_12px_32px_rgba(201,168,76,0.25)]">
                        Z
                    </div>
                    <div>
                        <p className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-zen-gold">ZEN Vanguard</p>
                        <p className="text-center text-xs text-slate-500 mt-0.5">AI Professionals Program</p>
                    </div>
                </div>

                {/* Main card */}
                <div className="w-full max-w-md">
                    <div className="rounded-[2rem] border border-zen-gold/12 bg-zen-surface/60 p-8 shadow-zen-card backdrop-blur-xl sm:p-10">
                        {/* Lock icon */}
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-zen-gold/15 to-zen-gold/5 ring-1 ring-zen-gold/20">
                                <svg className="h-7 w-7 text-zen-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>

                        <div className="text-center">
                            <h2 className="text-2xl font-black text-white sm:text-3xl">Subscription Required</h2>
                            <p className="mt-3 text-sm leading-7 text-slate-400">
                                Unlock the full ZEN Vanguard learning experience — from AI fundamentals to production systems.
                            </p>
                        </div>

                        {/* Feature list */}
                        <div className="mt-7 space-y-2">
                            {includedFeatures.map(({ label }) => (
                                <div key={label} className="flex items-center gap-3 rounded-xl border border-zen-gold/8 bg-zen-gold/[0.03] px-4 py-3">
                                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-zen-emerald/15 text-[10px] font-bold text-zen-emerald ring-1 ring-zen-emerald/25">
                                        ✓
                                    </div>
                                    <span className="text-sm text-slate-300">{label}</span>
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div className="mt-5 rounded-xl border border-rose-500/20 bg-rose-500/[0.06] px-4 py-3 text-center text-sm font-semibold text-rose-300">
                                {error}
                            </div>
                        )}

                        {/* Subscribe CTA */}
                        <button
                            onClick={handleSubscribe}
                            disabled={loading}
                            className="mt-7 w-full rounded-full bg-gradient-to-r from-zen-gold via-zen-gold-light to-zen-gold px-6 py-4 text-sm font-bold text-zen-navy shadow-glowing-gold transition hover:opacity-90 hover:shadow-[0_0_40px_rgba(201,168,76,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Processing…
                                </span>
                            ) : (
                                'Subscribe Now'
                            )}
                        </button>

                        {/* Stripe trust badge */}
                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-600">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Secure payment via Stripe
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setShowAdminModal(true)}
                                className="text-xs text-slate-600 underline-offset-2 transition hover:text-slate-400 hover:underline"
                            >
                                Internal admin access
                            </button>
                        </div>
                    </div>

                    {/* Trust line */}
                    <div className="mt-6 flex items-center justify-center gap-2 rounded-full border border-zen-gold/10 bg-zen-gold/[0.03] px-5 py-2.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-zen-emerald animate-pulse" />
                        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                            First verified AI literacy ecosystem in U.S. history
                        </p>
                    </div>
                </div>
            </div>

            {/* Admin modal */}
            {showAdminModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-sm animate-scale-in rounded-[1.5rem] border border-zen-gold/12 bg-zen-surface/90 p-8 shadow-zen-card backdrop-blur-xl">
                        <button
                            onClick={closeAdminModal}
                            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-700 text-slate-500 transition hover:border-slate-600 hover:text-white"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="mb-6 text-center">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700">
                                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white">Internal Admin Access</h3>
                            <p className="mt-1 text-xs text-slate-500">Restricted to authorized personnel.</p>
                        </div>

                        <form onSubmit={handleAdminLogin} className="space-y-4">
                            <input
                                type="text"
                                value={adminUsername}
                                onChange={(event) => setAdminUsername(event.target.value)}
                                placeholder="Username"
                                disabled={loading}
                                className="w-full rounded-2xl border border-zen-gold/10 bg-zen-navy/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-zen-gold/30 focus:ring-2 focus:ring-zen-gold/10"
                            />
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={(event) => setAdminPassword(event.target.value)}
                                placeholder="Password"
                                disabled={loading}
                                className="w-full rounded-2xl border border-zen-gold/10 bg-zen-navy/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-zen-gold/30 focus:ring-2 focus:ring-zen-gold/10"
                            />

                            {adminError && (
                                <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.06] px-4 py-3 text-center text-sm text-rose-300">
                                    {adminError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !adminUsername || !adminPassword}
                                className="w-full rounded-full border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-600 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? 'Verifying…' : 'Continue'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaywallPage;
