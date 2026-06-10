import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBilling } from '../contexts/BillingContext';
import { useAuth } from '../hooks/useAuth';
import { isAdminEmail } from '../services/adminAccess';
import { getProgramBySlug } from '../zen-programs/programIntegrationContract';

const PROGRAM_DESTINATIONS = {
    pioneer: '/programs/pioneer',
    vanguard: '/dashboard',
} as const;

const safeInternalPath = (value: string | null) => (
    value && value.startsWith('/') && !value.startsWith('//') ? value : null
);

const inferProgramSlug = (searchProgram: string | null, returnPath: string | null): 'pioneer' | 'vanguard' | null => {
    const candidate = (searchProgram ?? '').toLowerCase();
    if (candidate === 'pioneer' || candidate === 'ai-pioneer') return 'pioneer';
    if (candidate === 'vanguard') return 'vanguard';
    const path = (returnPath ?? '').toLowerCase();
    if (path.includes('/pioneer') || path.includes('/ai-pioneer')) return 'pioneer';
    if (path.includes('/vanguard') || path.startsWith('/dashboard') || path.startsWith('/module')) return 'vanguard';
    return null;
};

const programFeatures = {
    vanguard: [
        'Operator-grade AI systems training',
        'Agent workflow and automation labs',
        'Governance, evaluation, and deployment discipline',
        'Vanguard credential and progress tracking',
    ],
    pioneer: [
        'Hands-on AI literacy labs for ages 11-18',
        'Prompt, model, and agent-building skills',
        'Hugging Face Space deployment path',
        'Portfolio artifacts and certificate readiness',
    ],
};


const PaywallPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const explicitReturn = safeInternalPath(params.get('return_to'));
    const programSlug = inferProgramSlug(params.get('program'), explicitReturn);
    const program = getProgramBySlug(programSlug) ?? getProgramBySlug('vanguard');
    const isPioneer = program?.programKey === 'ai-pioneer';
    const programKind = isPioneer ? 'pioneer' : 'vanguard';
    const features = programFeatures[programKind];
    // Always route admins / entitled users to the program-specific destination,
    // not the generic /programs hub.
    const programDestination = PROGRAM_DESTINATIONS[programKind];
    const returnTo = explicitReturn ?? programDestination;
    const { user, isAuthenticated } = useAuth();
    const { createCheckoutSession, adminBypass, checkEntitlement, entitled, error } = useBilling();
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminError, setAdminError] = useState('');
    const [loading, setLoading] = useState(false);
    const signedInAdmin = isAdminEmail(user?.email);

    const panelCopy = useMemo(() => {
        if (isPioneer) {
            return {
                eyebrow: 'AI Pioneer program access',
                headline: 'Your AI Pioneer seat is ready.',
                body: 'Registration is recorded. Activate the program seat to enter the build path, labs, progress system, and credential track.',
                price: '$45 program access',
                product: 'AI Pioneer Program',
                image: '/zen-brand-logo-light.png',
                accent: 'from-cyan-300 via-blue-400 to-violet-400',
            };
        }

        return {
            eyebrow: 'ZEN Vanguard program access',
            headline: 'Enter the Vanguard operator track.',
            body: 'Registration is recorded. Activate full access to the Vanguard systems curriculum, operator labs, certificates, and progress layer.',
            price: '$75 program access',
            product: 'ZEN Vanguard Program',
            image: '/zen-logo-alt.png',
            accent: 'from-zen-gold via-cyan-300 to-emerald-300',
        };
    }, [isPioneer]);

    const goTo = (target: string) => {
        if (/^https?:\/\//i.test(target)) {
            window.location.href = target;
            return;
        }
        navigate(target);
    };

    const handleEnterProgram = () => {
        goTo(returnTo);
    };

    const handleSubscribe = async () => {
        if (!isAuthenticated) {
            navigate(`/login?return_to=${encodeURIComponent(location.pathname + location.search)}`);
            return;
        }
        setLoading(true);
        const url = await createCheckoutSession(returnTo);
        if (url) {
            goTo(url);
            return;
        }
        setLoading(false);
    };

    const handleSignedInAdmin = async () => {
        setLoading(true);
        setAdminError('');
        if (signedInAdmin) {
            // Skip remote check; admin allowlist is authoritative client-side.
            goTo(returnTo);
            return;
        }
        const allowed = await checkEntitlement();
        if (allowed) {
            goTo(returnTo);
            return;
        }
        setAdminError('This signed-in email is not on the owner/admin allowlist.');
        setLoading(false);
    };

    const handleAdminLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setAdminError('');
        setLoading(true);

        const success = await adminBypass(adminUsername, adminPassword);

        if (success) {
            goTo(returnTo);
            return;
        }

        setAdminError('Admin access unavailable or credentials rejected.');
        setLoading(false);
    };

    const hasAccess = entitled || signedInAdmin;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#02040a] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,168,76,0.16),transparent_32%),radial-gradient(circle_at_82%_16%,rgba(34,211,238,0.14),transparent_30%),linear-gradient(135deg,#02040a_0%,#07111f_48%,#03101a_100%)]" />
            <div className="absolute inset-0 opacity-[0.055]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)', backgroundSize: '54px 54px' }} />
            <img src="/zen-brand-logo-dark.png" alt="" className="pointer-events-none absolute -left-16 top-12 hidden w-[34rem] opacity-[0.035] blur-[1px] lg:block" />
            <img src="/zen-brand-logo-light.png" alt="" className="pointer-events-none absolute -right-20 bottom-[-8rem] hidden w-[40rem] opacity-[0.045] lg:block" />

            <section className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
                <div className="hidden lg:block">
                    <div className="relative aspect-square max-w-[34rem]">
                        <div className={`absolute inset-10 rounded-[4rem] bg-gradient-to-br ${panelCopy.accent} opacity-20 blur-3xl`} />
                        <div className="absolute inset-0 rounded-[4rem] border border-white/10 bg-white/[0.035] shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl" />
                        <img src={panelCopy.image} alt="ZEN brand mark" className="relative z-10 h-full w-full object-contain p-12 drop-shadow-[0_0_44px_rgba(34,211,238,0.22)]" />
                    </div>
                </div>

                <div className="mx-auto w-full max-w-xl">
                    <div className="mb-7 flex items-center gap-4">
                        <img src="/zen-logo-alt.png" alt="ZEN" className="h-14 w-14 rounded-2xl border border-white/10 object-cover shadow-[0_0_28px_rgba(34,211,238,0.16)]" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-zen-gold">ZEN AI Co.</p>
                            <p className="mt-1 text-sm text-slate-400">Program access control</p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-slate-950/72 p-6 shadow-[0_36px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-8">
                        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${panelCopy.accent}`} />
                        <div className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-300">
                            {panelCopy.price}
                        </div>

                        <p className="pr-28 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100">{panelCopy.eyebrow}</p>
                        <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">{panelCopy.headline}</h1>
                        <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">{panelCopy.body}</p>

                        {signedInAdmin && (
                            <div className="mt-6 rounded-2xl border border-emerald-300/25 bg-emerald-300/[0.08] p-4">
                                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100">Owner/admin recognized</p>
                                <p className="mt-2 text-sm leading-6 text-emerald-50/85">
                                    {user?.email} is on the ZEN admin allowlist. Continue without Stripe checkout.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleSignedInAdmin}
                                    disabled={loading}
                                    className="mt-4 rounded-full bg-emerald-200 px-5 py-3 text-sm font-black text-emerald-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? 'Opening access...' : 'Continue as admin'}
                                </button>
                            </div>
                        )}

                        <div className="mt-7 grid gap-3">
                            {features.map((feature) => (
                                <div key={feature} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
                                    <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${panelCopy.accent} shadow-[0_0_18px_rgba(34,211,238,0.35)]`} />
                                    <span className="text-sm font-semibold text-slate-200">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {(error || adminError) && (
                            <div className="mt-5 rounded-2xl border border-rose-400/25 bg-rose-400/[0.08] px-4 py-3 text-sm font-semibold text-rose-100">
                                {adminError || error}
                            </div>
                        )}

                        <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
                            {hasAccess ? (
                                <button
                                    type="button"
                                    onClick={handleEnterProgram}
                                    disabled={loading}
                                    className={`rounded-full bg-gradient-to-r ${panelCopy.accent} px-6 py-4 text-sm font-black text-slate-950 shadow-[0_0_42px_rgba(201,168,76,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                    {`Enter ${panelCopy.product}`}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubscribe}
                                    disabled={loading}
                                    className={`rounded-full bg-gradient-to-r ${panelCopy.accent} px-6 py-4 text-sm font-black text-slate-950 shadow-[0_0_42px_rgba(201,168,76,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                    {loading ? 'Opening checkout...' : isAuthenticated ? `Activate ${panelCopy.product}` : `Sign in to activate ${panelCopy.product}`}
                                </button>
                            )}
                            <Link to="/programs" className="rounded-full border border-white/12 bg-white/[0.04] px-6 py-4 text-center text-sm font-black text-white transition hover:bg-white/[0.08]">
                                Programs
                            </Link>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                            <span>Secure checkout powered by Stripe</span>
                            {!signedInAdmin && (
                                <button type="button" onClick={() => setShowAdminModal(true)} className="font-semibold text-slate-400 underline-offset-4 hover:text-white hover:underline">
                                    Internal admin access
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {showAdminModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
                    <div className="relative w-full max-w-sm rounded-[1.5rem] border border-white/12 bg-slate-950/95 p-7 shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
                        <button
                            type="button"
                            onClick={() => setShowAdminModal(false)}
                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:text-white"
                            aria-label="Close admin access"
                        >
                            x
                        </button>
                        <img src="/zen-logo-alt.png" alt="ZEN" className="mx-auto h-14 w-14 rounded-2xl object-cover" />
                        <h2 className="mt-5 text-center text-xl font-black text-white">Internal Admin Access</h2>
                        <p className="mt-2 text-center text-xs leading-6 text-slate-500">Use only when the signed-in account is authorized for ZEN operations.</p>

                        <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
                            <input
                                type="text"
                                value={adminUsername}
                                onChange={(event) => setAdminUsername(event.target.value)}
                                placeholder="Username"
                                disabled={loading}
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-200/40"
                            />
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={(event) => setAdminPassword(event.target.value)}
                                placeholder="Password"
                                disabled={loading}
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-200/40"
                            />
                            <button
                                type="submit"
                                disabled={loading || !adminUsername || !adminPassword}
                                className="w-full rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Continue'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default PaywallPage;
