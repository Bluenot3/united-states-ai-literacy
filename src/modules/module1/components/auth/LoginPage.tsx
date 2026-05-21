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
            style={{ background: 'linear-gradient(135deg, #020617 0%, #050A18 35%, #080F20 65%, #050A18 100%)' }}>

            {/* Precision grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.018]" style={{
                backgroundImage: 'linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)',
                backgroundSize: '52px 52px',
            }} />
            {/* Radial ambient light */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse 70% 55% at 30% 40%, rgba(201,168,76,0.06), transparent 55%), radial-gradient(ellipse 50% 40% at 75% 65%, rgba(34,211,238,0.04), transparent 50%)',
            }} />
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(2,6,23,0.55) 100%)',
            }} />

            <div className="w-full max-w-sm relative z-10">
                {/* Wordmark */}
                <div className="flex flex-col items-center mb-7">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[0.75rem] mb-4"
                        style={{
                            background: 'linear-gradient(135deg, #C9A84C 0%, #DFC06A 50%, #A68B3A 100%)',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 24px rgba(201,168,76,0.22)',
                        }}>
                        <span className="text-[#060B18] text-xl font-black">Z</span>
                    </div>
                    <h1 className="text-[1.35rem] font-bold text-white tracking-[-0.01em]">ZEN Vanguard</h1>
                    <p className="text-[11px] mt-1 tracking-[0.06em]" style={{ color: 'rgba(255,255,255,0.35)' }}>Professional AI literacy and deployment training</p>
                </div>

                {/* Signup confirmation state */}
                {signupConfirmation ? (
                    <div className="p-7 text-center rounded-[1.4rem]" style={{
                        background: 'linear-gradient(180deg, rgba(9,16,31,0.94), rgba(6,11,24,0.90))',
                        border: '1px solid rgba(201,168,76,0.12)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 56px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(28px)',
                    }}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                            style={{
                                background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.08))',
                                border: '1px solid rgba(201,168,76,0.25)'
                            }}>
                            <MailGlyph />
                        </div>
                        <h2 className="text-lg font-bold text-white mb-2">Check Your Email</h2>
                        <p className="text-[12px] mb-5 leading-[1.7]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                            We sent a confirmation link to <span className="text-[#C9A84C] font-medium">{email}</span>.
                            Click it to activate your account, then sign in.
                        </p>
                        <button
                            onClick={() => { setSignupConfirmation(false); switchMode('login'); }}
                            className="w-full font-semibold py-2.5 px-8 rounded-full text-[13px]"
                            style={{
                                background: 'linear-gradient(90deg, #C9A84C, #DFC06A)',
                                color: '#060B18',
                                boxShadow: '0 4px 16px rgba(201,168,76,0.2)',
                            }}
                        >
                            Back to Sign In
                        </button>
                    </div>
                ) : (
                    /* Form Card */
                    <div className="p-6 rounded-[1.4rem]" style={{
                        background: 'linear-gradient(180deg, rgba(9,16,31,0.94), rgba(6,11,24,0.90))',
                        border: '1px solid rgba(201,168,76,0.11)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 56px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(28px)',
                    }}>

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
                                    <div className="flex justify-center mb-5">
                                        <div className="flex rounded-full p-[3px]" style={{
                                            border: '1px solid rgba(201,168,76,0.09)',
                                            background: 'rgba(6,11,24,0.7)',
                                        }}>
                                            <button
                                                onClick={() => switchMode('login')}
                                                className={`px-5 py-1.5 text-[12px] font-semibold rounded-full transition-all duration-200 ${isLogin ? 'text-[#060B18]' : 'text-slate-400 hover:text-white'}`}
                                                style={isLogin ? {
                                                    background: 'linear-gradient(90deg, #C9A84C, #DFC06A)',
                                                    boxShadow: '0 2px 8px rgba(201,168,76,0.22)',
                                                } : {}}
                                            >
                                                Sign In
                                            </button>
                                            <button
                                                onClick={() => switchMode('signup')}
                                                className={`px-5 py-1.5 text-[12px] font-semibold rounded-full transition-all duration-200 ${mode === 'signup' ? 'text-[#060B18]' : 'text-slate-400 hover:text-white'}`}
                                                style={mode === 'signup' ? {
                                                    background: 'linear-gradient(90deg, #C9A84C, #DFC06A)',
                                                    boxShadow: '0 2px 8px rgba(201,168,76,0.22)',
                                                } : {}}
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

                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div>
                                        <label htmlFor="email" className="block text-[9px] font-bold uppercase tracking-[0.26em] mb-1.5" style={{ color: 'rgba(201,168,76,0.55)' }}>Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            disabled={loading}
                                            autoComplete="email"
                                            className="w-full text-[13px] text-white placeholder:text-slate-600 outline-none transition"
                                            style={{
                                                background: 'rgba(6,11,24,0.7)',
                                                border: '1px solid rgba(201,168,76,0.09)',
                                                borderRadius: '0.75rem',
                                                padding: '0.6rem 0.85rem',
                                            }}
                                            onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.32)'; }}
                                            onBlur={e => { e.target.style.borderColor = 'rgba(201,168,76,0.09)'; }}
                                        />
                                    </div>

                                    {mode !== 'forgot' && (
                                        <div>
                                            <label htmlFor="password" className="block text-[9px] font-bold uppercase tracking-[0.26em] mb-1.5" style={{ color: 'rgba(201,168,76,0.55)' }}>Password</label>
                                            <input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder={isLogin ? 'Your password' : 'Min. 6 characters'}
                                                disabled={loading}
                                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                                                className="w-full text-[13px] text-white placeholder:text-slate-600 outline-none transition"
                                                style={{
                                                    background: 'rgba(6,11,24,0.7)',
                                                    border: '1px solid rgba(201,168,76,0.09)',
                                                    borderRadius: '0.75rem',
                                                    padding: '0.6rem 0.85rem',
                                                }}
                                                onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.32)'; }}
                                                onBlur={e => { e.target.style.borderColor = 'rgba(201,168,76,0.09)'; }}
                                            />
                                        </div>
                                    )}

                                    {error && (
                                        <div style={{
                                            background: 'rgba(239,68,68,0.07)',
                                            border: '1px solid rgba(239,68,68,0.22)',
                                            borderRadius: '0.75rem',
                                            padding: '0.6rem 0.85rem',
                                        }}>
                                            <p className="text-center text-[12px] font-semibold" style={{ color: '#EF4444' }}>{error}</p>
                                        </div>
                                    )}

                                    {showPreviewHint && isLogin && (
                                        <div style={{
                                            background: 'rgba(201,168,76,0.06)',
                                            border: '1px solid rgba(201,168,76,0.18)',
                                            borderRadius: '0.75rem',
                                            padding: '0.6rem 0.85rem',
                                        }}>
                                            <p className="text-[11px] text-[#C9A84C]">Demo active — use <span className="font-semibold">demo / demo</span></p>
                                        </div>
                                    )}

                                    <div className="pt-1">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full font-semibold py-2.5 px-8 rounded-full text-[13px] transition disabled:opacity-50"
                                            style={{
                                                background: 'linear-gradient(90deg, #C9A84C, #DFC06A, #C9A84C)',
                                                color: '#060B18',
                                                boxShadow: '0 4px 16px rgba(201,168,76,0.2)',
                                            }}
                                        >
                                            {loading ? 'Working...' : mode === 'forgot' ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'}
                                        </button>
                                    </div>

                                    {isLogin && (
                                        <div className="text-center pt-0.5">
                                            <button
                                                type="button"
                                                onClick={() => switchMode('forgot')}
                                                className="text-[11px] transition-colors"
                                                style={{ color: 'rgba(201,168,76,0.5)' }}
                                                onMouseEnter={e => { (e.target as HTMLElement).style.color = 'rgba(201,168,76,0.85)'; }}
                                                onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(201,168,76,0.5)'; }}
                                            >
                                                Forgot your password?
                                            </button>
                                        </div>
                                    )}

                                    {mode === 'forgot' && (
                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => switchMode('login')}
                                                className="text-[11px] transition-colors"
                                                style={{ color: 'rgba(255,255,255,0.35)' }}
                                            >
                                                Back to Sign In
                                            </button>
                                        </div>
                                    )}
                                </form>

                                <div className="mt-4 rounded-[0.75rem] p-3.5" style={{
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    background: 'rgba(255,255,255,0.02)',
                                }}>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.26em] mb-2.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Workspace access includes</p>
                                    <div className="grid gap-1.5">
                                        {authSignals.map((signal) => (
                                            <div key={signal} className="flex items-start gap-2">
                                                <span className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full" style={{ background: 'rgba(201,168,76,0.6)' }} />
                                                <span className="text-[11px] leading-[1.6]" style={{ color: 'rgba(255,255,255,0.5)' }}>{signal}</span>
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
