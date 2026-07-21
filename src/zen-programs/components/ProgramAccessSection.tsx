import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBilling } from '../../contexts/BillingContext';
import { hasProgramAccess } from '../../services/programAccess';
import {
    isProfileComplete,
    loadProfile,
    saveProfile,
    type ZenExperience,
    type ZenGoal,
    type ZenProfile,
    type ZenTrack,
} from '../../services/profileSetup';

type ProgramKind = 'pioneer' | 'vanguard';
type AccessState = 'unknown' | 'yes' | 'no';

interface PanelConfig {
    kind: ProgramKind;
    mark: string;
    eyebrow: string;
    title: string;
    price: string;
    body: string;
    destination: string;
    gradient: string;
    glow: string;
    features: string[];
}

const PANELS: PanelConfig[] = [
    {
        kind: 'vanguard',
        mark: 'VA',
        eyebrow: 'Operator command route',
        title: 'ZEN Vanguard',
        price: '$75 one-time access',
        body: 'Operator-grade AI systems training. Activate full access to the Vanguard systems curriculum, operator labs, certificates, and progress layer.',
        destination: '/dashboard',
        gradient: 'from-[#f8fafc] via-[#ef4444] to-[#1d4ed8]',
        glow: 'rgba(239,68,68,.30)',
        features: [
            'Operator-grade AI systems training',
            'Agent workflow and automation labs',
            'Governance, evaluation, and deployment discipline',
            'Vanguard credential and progress tracking',
        ],
    },
    {
        kind: 'pioneer',
        mark: 'AI',
        eyebrow: 'Builder launch route',
        title: 'AI Pioneer Program',
        price: '$45 one-time access',
        body: 'Build, launch, and showcase real AI tools. Activate your seat to unlock the build path, labs, Hugging Face deployment, portfolio artifacts, and certificate track.',
        destination: '/programs/pioneer/launch',
        gradient: 'from-[#ffffff] via-[#3b82f6] to-[#dc2626]',
        glow: 'rgba(59,130,246,.32)',
        features: [
            'Hands-on AI literacy labs for ages 11-18',
            'Prompt, model, and agent-building skills',
            'Hugging Face Space deployment path',
            'Portfolio artifacts and certificate readiness',
        ],
    },
];

const STEP_LABELS = ['Account', 'Profile', 'Activate', 'Enter'] as const;

const emptyProfile = (name: string, program: ProgramKind): ZenProfile => ({
    displayName: name,
    username: '',
    bio: '',
    program,
    track: 'explorer',
    country: '',
    organization: '',
    experience: 'beginner',
    goal: 'build-apps',
    missionBadge: '',
    updatedAt: '',
});

const ProgramAccessSection: React.FC = () => {
    const { user, isAuthenticated, isAdmin } = useAuth();
    const { createCheckoutSession, checkEntitlement, error: billingError } = useBilling();
    const location = useLocation();
    const navigate = useNavigate();
    const sectionRef = useRef<HTMLElement | null>(null);
    const admin = isAdmin;

    const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const highlightedProgram: ProgramKind | null = (() => {
        const value = (params.get('program') ?? '').toLowerCase();
        if (value === 'pioneer' || value === 'ai-pioneer') return 'pioneer';
        if (value === 'vanguard') return 'vanguard';
        return null;
    })();
    const pendingPayment = params.get('pending') === '1' || params.get('status') === 'pending';

    const [access, setAccess] = useState<Record<ProgramKind, AccessState>>({ pioneer: 'unknown', vanguard: 'unknown' });
    const [busy, setBusy] = useState<ProgramKind | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [formFor, setFormFor] = useState<ProgramKind | null>(null);
    const [profileDraft, setProfileDraft] = useState<ZenProfile>(() => (
        loadProfile(user?.id) ?? emptyProfile(user?.name ?? '', highlightedProgram ?? 'pioneer')
    ));
    const [profileSaved, setProfileSaved] = useState(() => isProfileComplete(loadProfile(user?.id)));

    const refreshAccess = useCallback(async () => {
        if (!isAuthenticated || !user?.id) {
            setAccess({ pioneer: 'no', vanguard: 'no' });
            return;
        }
        const [pioneer, vanguard] = await Promise.all([
            hasProgramAccess(user.id, user.email, 'pioneer'),
            hasProgramAccess(user.id, user.email, 'vanguard'),
        ]);
        setAccess({ pioneer: pioneer ? 'yes' : 'no', vanguard: vanguard ? 'yes' : 'no' });
    }, [isAuthenticated, user?.id, user?.email]);

    useEffect(() => { void refreshAccess(); }, [refreshAccess]);

    useEffect(() => {
        const stored = loadProfile(user?.id);
        if (stored) {
            setProfileDraft(stored);
            setProfileSaved(isProfileComplete(stored));
        }
    }, [user?.id]);

    // Scroll into view when arriving with #program-access or ?program=.
    useEffect(() => {
        if (location.hash === '#program-access' || highlightedProgram) {
            const timeout = window.setTimeout(() => {
                sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 250);
            return () => window.clearTimeout(timeout);
        }
        return undefined;
    }, [location.hash, highlightedProgram]);

    const goTo = useCallback((target: string) => {
        if (/^https?:\/\//i.test(target)) {
            window.location.href = target;
            return;
        }
        navigate(target);
    }, [navigate]);

    const handleSignIn = (kind: ProgramKind) => {
        navigate(`/login?return_to=${encodeURIComponent(`/programs?program=${kind}#program-access`)}`);
    };

    const startCheckout = useCallback(async (panel: PanelConfig) => {
        setBusy(panel.kind);
        const url = await createCheckoutSession(panel.kind, panel.destination);
        if (url) {
            goTo(url);
            return;
        }
        setBusy(null);
    }, [createCheckoutSession, goTo]);

    const handleActivate = (panel: PanelConfig) => {
        if (!isAuthenticated) {
            handleSignIn(panel.kind);
            return;
        }
        if (!admin && !profileSaved) {
            setProfileDraft((current) => ({ ...current, program: panel.kind }));
            setFormFor(panel.kind);
            return;
        }
        void startCheckout(panel);
    };

    const handleSaveProfile = (event: React.FormEvent) => {
        event.preventDefault();
        if (!user?.id || !formFor) return;
        const next = { ...profileDraft, program: formFor };
        if (!isProfileComplete(next)) return;
        saveProfile(user.id, next);
        setProfileSaved(true);
        const panel = PANELS.find((item) => item.kind === formFor);
        setFormFor(null);
        if (panel) void startCheckout(panel);
    };

    const handleRefreshAccess = async () => {
        setRefreshing(true);
        await checkEntitlement();
        await refreshAccess();
        setRefreshing(false);
    };

    const stepFor = (kind: ProgramKind): 1 | 2 | 3 | 4 => {
        if (!isAuthenticated) return 1;
        if (!admin && !profileSaved) return 2;
        if (access[kind] !== 'yes' && !admin) return 3;
        return 4;
    };

    return (
        <section
            id="program-access"
            ref={sectionRef}
            className="mt-8 overflow-hidden rounded-[38px] border border-white/12 bg-[linear-gradient(150deg,rgba(2,6,23,.94),rgba(15,23,42,.86))] p-6 shadow-[24px_24px_70px_rgba(0,0,0,.48),0_0_92px_rgba(37,99,235,.10)] sm:p-8"
        >
            <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_12%_10%,rgba(59,130,246,.20),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(239,68,68,.16),transparent_32%),linear-gradient(rgba(248,250,252,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(248,250,252,.045)_1px,transparent_1px)] [background-size:auto,auto,34px_34px,34px_34px]" />

            <div className="relative z-10">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[.04] px-3.5 py-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,.7)]" />
                            <span className="text-[9.5px] font-black uppercase tracking-[.30em] text-[#bfdbfe]">Program access control</span>
                        </div>
                        <h2 className="mt-4 max-w-3xl bg-[linear-gradient(112deg,#ffffff_0%,#bfdbfe_24%,#ef4444_56%,#2563eb_82%,#ffffff_100%)] bg-clip-text text-3xl font-black leading-[.92] tracking-[-.055em] text-transparent sm:text-5xl">
                            Activate your seat. Enter your track.
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                            Vanguard and AI Pioneer are the two live ZEN programs. Review the breakdown above, then activate the
                            one that fits — payment unlocks the full program for your account.
                        </p>
                    </div>
                    {admin && (
                        <div className="rounded-[20px] border border-emerald-300/25 bg-emerald-400/[.08] px-4 py-3 text-xs leading-6 text-emerald-100">
                            <span className="font-black uppercase tracking-[.18em]">Owner/admin recognized</span>
                            <br />{user?.email} is on the ZEN admin allowlist — enter any program without checkout.
                        </div>
                    )}
                </div>

                {pendingPayment && (
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-amber-300/25 bg-amber-400/[.08] px-5 py-4">
                        <p className="text-sm leading-6 text-amber-100">
                            <span className="font-black">Payment submitted.</span> We're verifying your access — this usually takes under a minute.
                        </p>
                        <button
                            type="button"
                            onClick={() => void handleRefreshAccess()}
                            disabled={refreshing}
                            className="rounded-full border border-amber-200/40 bg-amber-300/[.12] px-4 py-2 text-xs font-black text-amber-100 transition hover:bg-amber-300/[.2] disabled:opacity-60"
                        >
                            {refreshing ? 'Checking…' : 'Refresh access'}
                        </button>
                    </div>
                )}

                {billingError && (
                    <div className="mt-5 rounded-[22px] border border-red-400/30 bg-red-500/[.08] px-5 py-3 text-sm leading-6 text-red-100">
                        {billingError}
                    </div>
                )}

                <div className="mt-7 grid gap-5 lg:grid-cols-2">
                    {PANELS.map((panel) => {
                        const step = stepFor(panel.kind);
                        const entered = access[panel.kind] === 'yes' || admin;
                        const checking = isAuthenticated && access[panel.kind] === 'unknown' && !admin;
                        const highlighted = highlightedProgram === panel.kind;

                        return (
                            <article
                                key={panel.kind}
                                className={`relative overflow-hidden rounded-[30px] border p-6 transition duration-500 ${
                                    highlighted
                                        ? 'border-white/30 bg-[linear-gradient(150deg,rgba(15,23,42,.95),rgba(30,41,59,.80))] shadow-[0_0_70px_rgba(59,130,246,.16)]'
                                        : 'border-white/12 bg-[linear-gradient(150deg,rgba(15,23,42,.80),rgba(2,6,23,.88))]'
                                }`}
                            >
                                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${panel.glow}, transparent 64%)` }} />
                                <div className="relative z-10">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex h-11 w-11 items-center justify-center rounded-[16px] bg-gradient-to-br ${panel.gradient} text-xs font-black text-slate-950 shadow-[0_10px_24px_rgba(0,0,0,.4)]`}>
                                                {panel.mark}
                                            </span>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[.26em] text-[#bfdbfe]">{panel.eyebrow}</p>
                                                <h3 className="mt-1 text-2xl font-black tracking-[-.04em] text-white">{panel.title}</h3>
                                            </div>
                                        </div>
                                        <span className="rounded-full border border-white/16 bg-white/[.05] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[.2em] text-white">
                                            {panel.price}
                                        </span>
                                    </div>

                                    <p className="mt-4 text-sm leading-7 text-slate-200">{panel.body}</p>

                                    <ul className="mt-4 space-y-2">
                                        {panel.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-2.5 text-sm leading-6 text-slate-300">
                                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-[#ef4444] to-[#3b82f6]" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {STEP_LABELS.map((label, index) => {
                                            const done = entered ? true : index + 1 < step;
                                            const current = !entered && index + 1 === step;
                                            return (
                                                <span
                                                    key={label}
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[.16em] ${
                                                        done
                                                            ? 'border-emerald-300/30 bg-emerald-400/[.10] text-emerald-200'
                                                            : current
                                                                ? 'border-[#60a5fa]/45 bg-[#2563eb]/[.16] text-[#dbeafe]'
                                                                : 'border-white/10 bg-white/[.03] text-slate-500'
                                                    }`}
                                                >
                                                    <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${done ? 'bg-emerald-300 text-slate-950' : current ? 'bg-[#60a5fa] text-slate-950' : 'bg-white/10 text-slate-400'}`}>
                                                        {done ? '✓' : index + 1}
                                                    </span>
                                                    {label}
                                                </span>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-6 flex flex-wrap items-center gap-3">
                                        {!isAuthenticated ? (
                                            <button
                                                type="button"
                                                onClick={() => handleSignIn(panel.kind)}
                                                className={`rounded-full bg-gradient-to-r ${panel.gradient} px-5 py-3 text-sm font-black text-slate-950 shadow-[0_18px_40px_rgba(0,0,0,.38)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/60`}
                                            >
                                                Sign in to activate
                                            </button>
                                        ) : entered ? (
                                            <button
                                                type="button"
                                                onClick={() => goTo(panel.destination)}
                                                className={`rounded-full bg-gradient-to-r ${panel.gradient} px-5 py-3 text-sm font-black text-slate-950 shadow-[0_18px_40px_rgba(0,0,0,.38)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/60`}
                                            >
                                                {admin && access[panel.kind] !== 'yes' ? 'Enter as admin' : `Enter ${panel.title}`}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleActivate(panel)}
                                                disabled={busy === panel.kind || checking}
                                                className={`rounded-full bg-gradient-to-r ${panel.gradient} px-5 py-3 text-sm font-black text-slate-950 shadow-[0_18px_40px_rgba(0,0,0,.38)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/60 disabled:cursor-wait disabled:opacity-60`}
                                            >
                                                {busy === panel.kind ? 'Opening checkout…' : checking ? 'Checking access…' : `Activate ${panel.title}`}
                                            </button>
                                        )}
                                        {entered && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-400/[.10] px-3.5 py-2 text-[10px] font-black uppercase tracking-[.18em] text-emerald-200">
                                                Access active
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-3 text-[11px] leading-5 text-slate-500">
                                        Secure checkout via Stripe. Access attaches to your signed-in account after payment is verified.
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {formFor && (
                    <form
                        onSubmit={handleSaveProfile}
                        className="mt-6 rounded-[28px] border border-[#60a5fa]/25 bg-[#0b1426]/85 p-6"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[.26em] text-[#bfdbfe]">One quick step</p>
                                <h3 className="mt-1 text-xl font-black text-white">Set up your ZEN Builder profile</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormFor(null)}
                                className="rounded-full border border-white/14 bg-white/[.04] px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/[.08]"
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <label className="block text-xs font-bold text-slate-300">
                                Display name
                                <input
                                    value={profileDraft.displayName}
                                    onChange={(event) => setProfileDraft({ ...profileDraft, displayName: event.target.value })}
                                    required
                                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-[#60a5fa]/60"
                                    placeholder="Your name"
                                />
                            </label>
                            <label className="block text-xs font-bold text-slate-300">
                                Username
                                <input
                                    value={profileDraft.username}
                                    onChange={(event) => setProfileDraft({ ...profileDraft, username: event.target.value.replace(/\s+/g, '').toLowerCase() })}
                                    required
                                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-[#60a5fa]/60"
                                    placeholder="zenbuilder"
                                />
                            </label>
                            <label className="block text-xs font-bold text-slate-300">
                                Country
                                <input
                                    value={profileDraft.country}
                                    onChange={(event) => setProfileDraft({ ...profileDraft, country: event.target.value })}
                                    required
                                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-[#60a5fa]/60"
                                    placeholder="United States"
                                />
                            </label>
                            <label className="block text-xs font-bold text-slate-300">
                                Track
                                <select
                                    value={profileDraft.track}
                                    onChange={(event) => setProfileDraft({ ...profileDraft, track: event.target.value as ZenTrack })}
                                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-[#60a5fa]/60"
                                >
                                    <option value="explorer">Explorer</option>
                                    <option value="builder">Builder</option>
                                    <option value="founder">Founder</option>
                                </select>
                            </label>
                            <label className="block text-xs font-bold text-slate-300">
                                Experience
                                <select
                                    value={profileDraft.experience}
                                    onChange={(event) => setProfileDraft({ ...profileDraft, experience: event.target.value as ZenExperience })}
                                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-[#60a5fa]/60"
                                >
                                    <option value="beginner">New to AI</option>
                                    <option value="some-ai">Some AI experience</option>
                                    <option value="builder">Already building</option>
                                </select>
                            </label>
                            <label className="block text-xs font-bold text-slate-300">
                                Main goal
                                <select
                                    value={profileDraft.goal}
                                    onChange={(event) => setProfileDraft({ ...profileDraft, goal: event.target.value as ZenGoal })}
                                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-[#60a5fa]/60"
                                >
                                    <option value="build-apps">Build real AI apps</option>
                                    <option value="learn-prompting">Master prompting</option>
                                    <option value="launch-agent">Launch an agent</option>
                                    <option value="portfolio">Build my portfolio</option>
                                    <option value="other">Something else</option>
                                </select>
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="mt-5 rounded-full bg-gradient-to-r from-[#f8fafc] via-[#60a5fa] to-[#ef4444] px-6 py-3 text-sm font-black text-slate-950 shadow-[0_18px_40px_rgba(0,0,0,.38)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/60"
                        >
                            Save profile & continue to checkout
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default ProgramAccessSection;
