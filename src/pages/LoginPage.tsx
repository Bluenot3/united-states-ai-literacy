import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const valueProps = [
    'Learn what AI, LLMs, and automation actually mean.',
    'Follow a cleaner beginner path from theory to deployment.',
    'Ship at least one real project with secure API key handling.',
];

const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signup } = useAuth();
    const showDemoHint = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_LOGIN === 'true';

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!email || !password) {
            setError('Enter an email and password.');
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
                setSuccessMessage('Account created. Confirm your email, then sign in.');
                setIsLogin(true);
                setPassword('');
            }
        } catch (authError) {
            setError(authError instanceof Error ? authError.message : 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_70%_55%_at_12%_18%,_rgba(201,168,76,0.07),_transparent_48%),radial-gradient(ellipse_60%_45%_at_88%_82%,_rgba(34,211,238,0.05),_transparent_42%),linear-gradient(135deg,_#020617_0%,_#050A18_35%,_#080F20_65%,_#050A18_100%)] text-white">
            {/* Precision grid overlay */}
            <div className="pointer-events-none fixed inset-0 opacity-[0.018]" style={{
                backgroundImage: `linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)`,
                backgroundSize: '52px 52px',
            }} />
            {/* Vignette */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,6,23,0.6)_100%)]" />

            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-12 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:gap-16 lg:px-12">
                {/* Left — Brand messaging */}
                <section className="max-w-xl flex-1">
                    {/* Wordmark */}
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-[0.6rem] bg-gradient-to-br from-zen-gold via-zen-gold-light to-zen-gold-dark text-[11px] font-black text-zen-navy shadow-[0_6px_18px_rgba(201,168,76,0.22),inset_0_1px_0_rgba(255,255,255,0.15)]">
                            Z
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-zen-gold/90">ZEN Vanguard</p>
                    </div>

                    <h1 className="mt-5 text-[2.4rem] font-black tracking-[-0.02em] leading-[1.1] sm:text-5xl lg:text-[3.4rem]">
                        Build enough fluency to{' '}
                        <span className="bg-gradient-to-r from-zen-gold via-zen-gold-light to-brand-cyan bg-clip-text text-transparent">
                            ship, not just talk
                        </span>{' '}
                        about AI.
                    </h1>

                    <p className="mt-4 max-w-lg text-[0.92rem] leading-[1.75] text-slate-400">
                        A structured path from AI basics to automation and deployment.
                        Sign in to access the Program Hub, Starter Guide, and four modules.
                    </p>

                    {/* Value props — compressed cards */}
                    <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
                        {valueProps.map((item, index) => (
                            <div
                                key={item}
                                className="group rounded-[1.1rem] border border-zen-gold/[0.09] bg-[linear-gradient(145deg,rgba(201,168,76,0.03),rgba(6,11,24,0.6))] p-4 backdrop-blur-sm transition duration-200 hover:border-zen-gold/[0.18] hover:bg-zen-gold/[0.04] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                            >
                                <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-lg border border-zen-gold/15 bg-zen-gold/[0.08] text-[9px] font-bold text-zen-gold">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <p className="text-[12px] leading-[1.65] text-slate-300">{item}</p>
                            </div>
                        ))}
                    </div>

                    {/* Trust badge */}
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-zen-gold/[0.12] bg-zen-gold/[0.03] px-3 py-1.5 backdrop-blur-sm">
                        <div className="h-[6px] w-[6px] rounded-full bg-zen-emerald shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            First verified AI literacy ecosystem in U.S. history
                        </p>
                    </div>
                </section>

                {/* Right — Auth form */}
                <section className="w-full max-w-[360px] rounded-[1.6rem] border border-zen-gold/[0.11] bg-[linear-gradient(180deg,rgba(9,16,31,0.92),rgba(6,11,24,0.88))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_64px_rgba(0,0,0,0.5)] backdrop-blur-[28px] sm:p-6">
                    {/* Tab switcher */}
                    <div className="flex rounded-full border border-zen-gold/[0.09] bg-zen-navy/70 p-[3px]">
                        <button
                            type="button"
                            onClick={() => { setIsLogin(true); setError(''); setSuccessMessage(''); }}
                            className={`flex-1 rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${isLogin ? 'bg-gradient-to-r from-zen-gold to-zen-gold-light text-zen-navy shadow-[0_2px_8px_rgba(201,168,76,0.25)]' : 'text-slate-400 hover:text-white'}`}
                        >
                            Sign in
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsLogin(false); setError(''); setSuccessMessage(''); }}
                            className={`flex-1 rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${!isLogin ? 'bg-gradient-to-r from-zen-gold to-zen-gold-light text-zen-navy shadow-[0_2px_8px_rgba(201,168,76,0.25)]' : 'text-slate-400 hover:text-white'}`}
                        >
                            Create account
                        </button>
                    </div>

                    <div className="mt-5">
                        <h2 className="text-[1.25rem] font-bold tracking-tight text-white">{isLogin ? 'Welcome back' : 'Create your account'}</h2>
                        <p className="mt-1 text-[12px] leading-[1.65] text-slate-400">
                            {isLogin
                                ? 'Sign in to continue into the Program Hub and starter materials.'
                                : 'Create an account, then confirm your email before signing in.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                        <label className="block">
                            <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.26em] text-zen-gold/55">Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email"
                                disabled={loading}
                                className="w-full rounded-[0.85rem] border border-zen-gold/[0.09] bg-zen-navy/70 px-3.5 py-2.5 text-[13px] text-white outline-none transition placeholder:text-slate-600 focus:border-zen-gold/35 focus:ring-1 focus:ring-zen-gold/12"
                                placeholder="you@example.com"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.26em] text-zen-gold/55">Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                                disabled={loading}
                                className="w-full rounded-[0.85rem] border border-zen-gold/[0.09] bg-zen-navy/70 px-3.5 py-2.5 text-[13px] text-white outline-none transition placeholder:text-slate-600 focus:border-zen-gold/35 focus:ring-1 focus:ring-zen-gold/12"
                                placeholder="Enter a strong password"
                            />
                        </label>

                        {successMessage && (
                            <div className="rounded-[0.85rem] border border-zen-emerald/25 bg-zen-emerald/[0.08] px-3.5 py-2.5 text-[12px] text-emerald-200">
                                {successMessage}
                            </div>
                        )}

                        {error && (
                            <div className="rounded-[0.85rem] border border-rose-400/25 bg-rose-500/[0.08] px-3.5 py-2.5 text-[12px] text-rose-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-full bg-gradient-to-r from-zen-gold via-zen-gold-light to-zen-gold px-5 py-2.5 text-[13px] font-semibold text-zen-navy shadow-[0_4px_16px_rgba(201,168,76,0.18)] transition hover:opacity-90 hover:shadow-[0_6px_22px_rgba(201,168,76,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Working...' : isLogin ? 'Sign in' : 'Create account'}
                        </button>
                    </form>

                    <div className="mt-4 rounded-[0.85rem] border border-zen-gold/[0.07] bg-zen-navy/50 p-3.5 text-[12px] leading-[1.65] text-slate-400">
                        <p className="font-semibold text-white/90">After you sign in</p>
                        <p className="mt-1">
                            Open the Starter Guide first — shortest path from AI basics to a real Hugging Face deployment.
                        </p>
                        {showDemoHint && (
                            <p className="mt-2 text-zen-gold">
                                Demo mode active. Use <span className="font-semibold">demo / demo</span>.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LoginPage;
