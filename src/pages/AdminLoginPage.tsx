import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

const AdminLoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { adminLogin, isAdminAuthenticated } = useAdmin();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAdminAuthenticated) {
            navigate('/admin');
        }
    }, [isAdminAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Pass raw inputs. The context handles mapping 'admin' to email if needed.
            const success = await adminLogin(username, password);
            if (success) {
                navigate('/admin');
            } else {
                setError('Invalid credentials or unauthorized access.');
                // Don't clear fields immediately so user can correct typos
            }
        } catch (err: any) {
            console.error("Login Error from Page:", err);
            setError('Authentication failed. Please check connection.');
        } finally {
            setLoading(false);
        }
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

            {/* Subtle grid overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
            }} />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-2xl mb-4 relative overflow-hidden group">
                            {/* Animated rings */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-brand-primary/30 animate-ping opacity-30" />
                            <div className="absolute inset-2 rounded-xl border border-cyan-500/20" />

                            {/* Icon */}
                            <svg className="w-12 h-12 text-brand-primary relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>

                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-primary/50 rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-primary/50 rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-primary/50 rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-primary/50 rounded-br-lg" />
                        </div>

                        {/* Status indicator */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-white tracking-tight">Command Center</h1>
                    <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                        ZEN Vanguard Admin Portal
                    </p>
                </div>

                {/* Form Card */}
                <div className="liquid-glass-card hologram-border p-8 relative overflow-hidden">

                    {/* Header */}
                    <div className="text-center mb-8 relative">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900/50 rounded-full border border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                            Secure Access Required
                        </div>
                        <p className="text-slate-500 text-sm">
                            Enter administrator credentials to proceed
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        <div>
                            <label htmlFor="username" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Username
                            </label>
                            <div className="relative group">
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    className="w-full px-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                    disabled={loading}
                                    autoComplete="off"
                                />

                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    className="w-full px-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all font-mono tracking-widest"
                                    disabled={loading}
                                    autoComplete="off"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>

                                {/* Focus glow */}
                                <div className="absolute inset-0 rounded-xl bg-brand-primary/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-shake">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="text-red-400 text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full btn-liquid-glass font-bold py-4 px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || !username || !password}
                        >

                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                    </svg>
                                    Authorize Access
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Security notice */}
                    <div className="mt-8 pt-6" style={{ borderTop: 'none' }}>
                        <div className="glass-divider mb-4" />
                        <div className="flex items-start gap-3 text-xs text-slate-500">
                            <svg className="w-4 h-4 mt-0.5 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p>
                                This is a restricted administrative area. All access attempts are logged and monitored. Unauthorized access is prohibited.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <a href="/login" className="text-slate-500 hover:text-brand-primary text-sm transition-colors">
                        ← Return to Student Portal
                    </a>
                </div>
            </div>

            {/* Custom animations */}
            <style>{`
                @keyframes scan-vertical {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
            `}</style>
        </div>
    );
};

export default AdminLoginPage;
