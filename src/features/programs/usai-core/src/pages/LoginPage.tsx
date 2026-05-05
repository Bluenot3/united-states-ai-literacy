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
        <div className="min-h-screen bg-[radial-gradient(ellipse_80%_60%_at_15%_20%,_rgba(201,168,76,0.08),_transparent_50%),radial-gradient(ellipse_70%_50%_at_85%_80%,_rgba(34,211,238,0.06),_transparent_45%),linear-gradient(135deg,_#020617_0%,_#060B18_40%,_#0A1628_70%,_#060B18_100%)] text-white">
            {/* Grid overlay */}
            <div className="pointer-events-none fixed inset-0 opacity-[0.02]" style={{
                backgroundImage: `linear-gradient(rgba(201,168,76,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.4) 1px, transparent 1px)`,
                backgroundSize: '48px 48px',
            }} />

            <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-10 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:px-10">
                {/* Left side — Brand messaging */}
                <section className="max-w-2xl flex-1">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-zen-gold via-zen-gold-light to-zen-gold-dark text-sm font-black text-zen-navy shadow-[0_10px_24px_rgba(201,168,76,0.2)]">
                            Z
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zen-gold">ZEN Vanguard</p>
                    </div>
                    <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                        Build enough fluency to <span className="bg-gradient-to-r from-zen-gold via-zen-gold-light to-brand-cyan bg-clip-text text-transparent">ship, not just talk</span> about AI.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                        The platform is being tightened around a clearer beginner journey. Sign in to access the Program Hub,
                        the Starter Guide, and the modules that walk from AI basics to automation and deployment.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        {valueProps.map((item, index) => (
                            <div key={item} className="rounded-3xl border border-zen-gold/10 bg-zen-gold/[0.03] p-5 backdrop-blur-sm transition duration-300 hover:border-zen-gold/20 hover:bg-zen-gold/[0.05]">
                                <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-lg bg-zen-gold/10 text-[10px] font-bold text-zen-gold">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <p className="text-sm leading-7 text-slate-300">{item}</p>
                            </div>
                        ))}
                    </div>

                    {/* Trust badge */}
                    <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-zen-gold/15 bg-zen-gold/[0.04] px-4 py-2">
                        <div className="h-2 w-2 rounded-full bg-zen-emerald animate-pulse" />
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            First verified AI literacy ecosystem in U.S. history
                        </p>
                    </div>
                </section>

                {/* Right side — Auth form */}
                <section className="w-full max-w-md rounded-[2rem] border border-zen-gold/12 bg-zen-surface/60 p-6 shadow-zen-card backdrop-blur-xl sm:p-8">
                    {/* Tab switcher */}
                    <div className="flex rounded-full border border-zen-gold/10 bg-zen-navy/80 p-1">
                        <button
                            type="button"
                            onClick={() => { setIsLogin(true); setError(''); setSuccessMessage(''); }}
                            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${isLogin ? 'bg-gradient-to-r from-zen-gold to-zen-gold-light text-zen-navy' : 'text-slate-400 hover:text-white'}`}
                        >
                            Sign in
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsLogin(false); setError(''); setSuccessMessage(''); }}
                            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${!isLogin ? 'bg-gradient-to-r from-zen-gold to-zen-gold-light text-zen-navy' : 'text-slate-400 hover:text-white'}`}
                        >
                            Create account
                        </button>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-white">{isLogin ? 'Welcome back' : 'Create your account'}</h2>
                        <p className="mt-2 text-sm leading-7 text-slate-400">
                            {isLogin
                                ? 'Sign in to continue into the Program Hub and starter materials.'
                                : 'Create an account, then confirm your email before signing in.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-zen-gold/60">Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email"
                                disabled={loading}
                                className="w-full rounded-2xl border border-zen-gold/10 bg-zen-navy/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zen-gold/40 focus:ring-2 focus:ring-zen-gold/15"
                                placeholder="you@example.com"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-zen-gold/60">Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                                disabled={loading}
                                className="w-full rounded-2xl border border-zen-gold/10 bg-zen-navy/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zen-gold/40 focus:ring-2 focus:ring-zen-gold/15"
                                placeholder="Enter a strong password"
                            />
                        </label>

                        {successMessage && (
                            <div className="rounded-2xl border border-zen-emerald/30 bg-zen-emerald/10 px-4 py-3 text-sm text-emerald-200">
                                {successMessage}
                            </div>
                        )}

                        {error && (
                            <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-full bg-gradient-to-r from-zen-gold via-zen-gold-light to-zen-gold px-5 py-3 text-sm font-semibold text-zen-navy transition hover:opacity-90 hover:shadow-glowing-gold disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Working...' : isLogin ? 'Sign in' : 'Create account'}
                        </button>
                    </form>

                    <div className="mt-6 rounded-2xl border border-zen-gold/8 bg-zen-navy/60 p-4 text-sm leading-7 text-slate-400">
                        <p className="font-semibold text-white">After you sign in</p>
                        <p className="mt-2">
                            Open the Starter Guide first if you want the shortest route to understanding AI, LLMs,
                            automation, and a first Hugging Face deployment.
                        </p>
                        {showDemoHint && (
                            <p className="mt-3 text-zen-gold">
                                Local demo mode is enabled. Use <span className="font-semibold">demo / demo</span>.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LoginPage;
