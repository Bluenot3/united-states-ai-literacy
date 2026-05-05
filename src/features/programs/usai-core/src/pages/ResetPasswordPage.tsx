import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { dal } from '../services/dal';

const ResetPasswordPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [validSession, setValidSession] = useState(false);
    const [checking, setChecking] = useState(true);
    const navigate = useNavigate();

    // Supabase embeds the recovery token in the URL hash and fires
    // an SIGNED_IN / PASSWORD_RECOVERY auth event — we just wait for it.
    useEffect(() => {
        // @ts-expect-error - Type definition clash with local node_modules
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
                setValidSession(true);
            }
            setChecking(false);
        });

        // If no event fires within 3 s, the link is likely expired/invalid
        const timeout = setTimeout(() => setChecking(false), 3000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await dal.auth.updatePassword(password);
            setSuccess(true);
            setTimeout(() => navigate('/hub', { replace: true }), 2500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0e24 30%, #0d1117 60%, #0a0a1a 100%)' }}
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="liquid-orb liquid-orb-1" />
                <div className="liquid-orb liquid-orb-2" />
                <div className="liquid-orb liquid-orb-3" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div
                        className="logo-hologram w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                        style={{
                            background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(168,85,247,0.15) 50%, rgba(124,58,237,0.25) 100%)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(168,85,247,0.25)',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(124,58,237,0.2)',
                        }}
                    >
                        <span className="text-white text-4xl font-black" style={{ textShadow: '0 0 20px rgba(168,85,247,0.4)' }}>Z</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">ZEN Vanguard</h1>
                    <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>AI Professionals Program</p>
                </div>

                <div className="liquid-glass-card hologram-border p-8 md:p-10">
                    {checking ? (
                        <div className="text-center py-4">
                            <div className="h-10 w-10 rounded-full border-[3px] border-purple-500/20 border-t-purple-500 animate-spin mx-auto mb-4" />
                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Verifying reset link…</p>
                        </div>
                    ) : success ? (
                        <div className="text-center">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.1))',
                                    border: '1px solid rgba(34,197,94,0.3)',
                                }}
                            >
                                <span className="text-2xl">✓</span>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Password Updated</h2>
                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Redirecting you to your workspace…</p>
                        </div>
                    ) : !validSession ? (
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-white mb-3">Link Expired</h2>
                            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
                                This reset link is invalid or has expired. Please request a new one.
                            </p>
                            <button
                                onClick={() => navigate('/login', { replace: true })}
                                className="w-full btn-liquid-glass font-bold py-3 px-8"
                            >
                                Back to Sign In
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-7">
                                <h2 className="text-lg font-bold text-white">Set New Password</h2>
                                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                    Choose a strong password for your account.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="new-password" className="sr-only">New Password</label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="New Password (min. 6 characters)"
                                        className="input-liquid-glass"
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        placeholder="Confirm New Password"
                                        className="input-liquid-glass"
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                </div>

                                {error && (
                                    <div style={{
                                        background: 'rgba(239,68,68,0.08)',
                                        border: '1px solid rgba(239,68,68,0.25)',
                                        borderRadius: '12px',
                                        padding: '12px 16px',
                                    }}>
                                        <p className="text-center text-sm font-semibold" style={{ color: '#EF4444' }}>{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full btn-liquid-glass font-bold py-3 px-8 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? 'Updating…' : 'Update Password'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
