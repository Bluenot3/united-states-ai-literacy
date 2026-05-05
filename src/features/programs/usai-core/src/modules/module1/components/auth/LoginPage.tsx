import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { dal } from '../../../../services/dal';

type Mode = 'login' | 'signup' | 'forgot';

const authSignals = [
    'Tracked progress and module state',
    'Certificates and proof surfaces',
    'Operational docs, guide, and dashboard access',
];

const MailGlyph: React.FC = () => (
    <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5h16v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 8 7 5 7-5" />
    </svg>
);

const LoginPage: React.FC = () => {
    const [mode, setMode] = useState<Mode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [signupConfirmation, setSignupConfirmation] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const { login, signup, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const isLogin = mode === 'login';
    const showPreviewHint = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_LOGIN === 'true';

    // Redirect once authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/command-center', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (mode === 'forgot') {
            if (!email) {
                setError('Please enter your email address.');
                setLoading(false);
                return;
            }
            try {
                await dal.auth.resetPassword(email);
                setResetSent(true);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
            return;
        }

        if (!email || !password) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        if (mode === 'signup' && password.length < 6) {
            setError('Password must be at least 6 characters.');
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                const { requiresConfirmation } = await signup(email, password);
                if (requiresConfirmation) {
                    setSignupConfirmation(true);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (next: Mode) => {
        setMode(next);
        setError('');
        setResetSent(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0e24 30%, #0d1117 60%, #0a0a1a 100%)' }}>

            {/* Liquid background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="liquid-orb liquid-orb-1" />
                <div className="liquid-orb liquid-orb-2" />
                <div className="liquid-orb liquid-orb-3" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="logo-hologram w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                        style={{
                            background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(168,85,247,0.15) 50%, rgba(124,58,237,0.25) 100%)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(168,85,247,0.25)',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(124,58,237,0.2)'
                        }}>
                        <span className="text-white text-4xl font-black" style={{ textShadow: '0 0 20px rgba(168,85,247,0.4)' }}>Z</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">ZEN Vanguard</h1>
                    <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Professional AI literacy and deployment training</p>
                </div>

                {/* Signup confirmation state */}
                {signupConfirmation ? (
                    <div className="liquid-glass-card hologram-border p-8 md:p-10 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                            style={{
                                background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))',
                                border: '1px solid rgba(168,85,247,0.3)'
                            }}>
                            <MailGlyph />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-3">Check Your Email</h2>
                        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
                            We sent a confirmation link to <span className="text-purple-400 font-medium">{email}</span>.
                            Click it to activate your account, then sign in.
                        </p>
                        <button
                            onClick={() => { setSignupConfirmation(false); switchMode('login'); }}
                            className="w-full btn-liquid-glass font-bold py-3 px-8"
                        >
                            Back to Sign In
                        </button>
                    </div>
                ) : (
                    /* Form Card */
                    <div className="liquid-glass-card hologram-border p-8 md:p-10">

                        {/* Forgot password — reset sent confirmation */}
                        {mode === 'forgot' && resetSent ? (
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))',
                                        border: '1px solid rgba(168,85,247,0.3)'
                                    }}>
                                    <MailGlyph />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-3">Check Your Email</h2>
                                <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
                                    We sent a password reset link to{' '}
                                    <span className="text-purple-400 font-medium">{email}</span>.
                                </p>
                                <button
                                    onClick={() => switchMode('login')}
                                    className="w-full btn-liquid-glass font-bold py-3 px-8"
                                >
                                    Back to Sign In
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Toggle — only shown for login/signup */}
                                {mode !== 'forgot' && (
                                    <div className="flex justify-center mb-7">
                                        <div className="toggle-pill-glass">
                                            <button
                                                onClick={() => switchMode('login')}
                                                className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${isLogin ? 'toggle-active' : 'toggle-inactive'}`}
                                            >
                                                Sign In
                                            </button>
                                            <button
                                                onClick={() => switchMode('signup')}
                                                className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${mode === 'signup' ? 'toggle-active' : 'toggle-inactive'}`}
                                            >
                                                Sign Up
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Forgot password heading */}
                                {mode === 'forgot' && (
                                    <div className="text-center mb-6">
                                        <h2 className="text-lg font-bold text-white">Reset Password</h2>
                                        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                            Enter your email and we'll send a reset link.
                                        </p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label htmlFor="email" className="sr-only">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email Address"
                                            className="input-liquid-glass"
                                            disabled={loading}
                                            autoComplete="email"
                                        />
                                    </div>

                                    {mode !== 'forgot' && (
                                        <div>
                                            <label htmlFor="password" className="sr-only">Password</label>
                                            <input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder={isLogin ? 'Password' : 'Password (min. 6 characters)'}
                                                className="input-liquid-glass"
                                                disabled={loading}
                                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                                            />
                                        </div>
                                    )}

                                    {error && (
                                        <div style={{
                                            background: 'rgba(239,68,68,0.08)',
                                            border: '1px solid rgba(239,68,68,0.25)',
                                            borderRadius: '12px',
                                            padding: '12px 16px'
                                        }}>
                                            <p className="text-center text-sm font-semibold" style={{ color: '#EF4444' }}>{error}</p>
                                        </div>
                                    )}

                                    {showPreviewHint && isLogin && (
                                        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-50">
                                            Local preview access is enabled. Use <span className="font-semibold">demo / demo</span> if you want to test the shell quickly.
                                        </div>
                                    )}

                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full btn-liquid-glass font-bold py-3 px-8 disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            {loading ? 'Loading...' : mode === 'forgot' ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'}
                                        </button>
                                    </div>

                                    {/* Forgot password link — only on sign in */}
                                    {isLogin && (
                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => switchMode('forgot')}
                                                className="text-sm transition-colors"
                                                style={{ color: 'rgba(168,85,247,0.7)' }}
                                            >
                                                Forgot your password?
                                            </button>
                                        </div>
                                    )}

                                    {/* Back to sign in — on forgot form */}
                                    {mode === 'forgot' && (
                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => switchMode('login')}
                                                className="text-sm transition-colors"
                                                style={{ color: 'rgba(255,255,255,0.4)' }}
                                            >
                                                Back to Sign In
                                            </button>
                                        </div>
                                    )}
                                </form>

                                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">Workspace access includes</p>
                                    <div className="mt-3 grid gap-2">
                                        {authSignals.map((signal) => (
                                            <div key={signal} className="flex items-start gap-2 text-sm text-white/70">
                                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-300" />
                                                <span>{signal}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
