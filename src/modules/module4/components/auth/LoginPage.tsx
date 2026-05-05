import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signup } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0e24 30%, #0d1117 60%, #0a0a1a 100%)' }}>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="liquid-orb liquid-orb-1" />
                <div className="liquid-orb liquid-orb-2" />
                <div className="liquid-orb liquid-orb-3" />
            </div>

            <div className="w-full max-w-md relative z-10">
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
                    <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>AI Professionals Program</p>
                </div>

                <div className="liquid-glass-card hologram-border p-8 md:p-10">
                    <div className="flex justify-center mb-7">
                        <div className="toggle-pill-glass">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${isLogin ? 'toggle-active' : 'toggle-inactive'}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${!isLogin ? 'toggle-active' : 'toggle-inactive'}`}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>

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
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="input-liquid-glass"
                                disabled={loading}
                            />
                        </div>

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

                        <div>
                            <button
                                type="submit"
                                className="w-full btn-liquid-glass font-bold py-3 px-8 disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;