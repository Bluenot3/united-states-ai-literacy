import React, { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { isAdminEmail } from '../../services/adminAccess';
import { useAuth } from '../../hooks/useAuth';
import { getProgramBySlug, isActivePublicProgramKey, parseProgramCampaignParams, type UserProgramState } from '../programIntegrationContract';
import { programRegistrationAdapter } from '../programRegistrationAdapter';
import { getSyntheticStandaloneUserId } from '../components/ProgramAccessGate';

const ProgramRegisterPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { search } = useLocation();
    const { user } = useAuth();
    const isAdmin = isAdminEmail(user?.email);
    const program = slug ? getProgramBySlug(slug) : undefined;
    const campaign = useMemo(() => parseProgramCampaignParams(new URLSearchParams(search)), [search]);
    const [email, setEmail] = useState(user?.email ?? '');
    const [displayName, setDisplayName] = useState(user?.name ?? '');
    const [submitting, setSubmitting] = useState(false);
    const [state, setState] = useState<UserProgramState | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!program) {
        return <Navigate to="/programs" replace />;
    }

    if (!isAdmin && !isActivePublicProgramKey(program.programKey)) {
        return <Navigate to="/programs" replace />;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const userId = user?.id ?? getSyntheticStandaloneUserId(email);
            const registration = await programRegistrationAdapter.registerForProgram({
                userId,
                email,
                displayName,
                programKey: program.programKey,
                source: campaign.source ?? 'program-register-page',
                referralCode: campaign.referralCode,
                utm_source: campaign.utm_source,
                utm_medium: campaign.utm_medium,
                utm_campaign: campaign.utm_campaign,
                utm_content: campaign.utm_content,
                utm_term: campaign.utm_term,
                metadata: {
                    standaloneAdapterMode: programRegistrationAdapter.mode,
                    programSlug: program.slug,
                },
            });

            setState(registration);
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Unable to register right now.');
        } finally {
            setSubmitting(false);
        }
    };

    if (state) {
        return (
            <div className="min-h-screen bg-[linear-gradient(180deg,#020617_0%,#081321_52%,#050814_100%)] px-5 py-12 text-white">
                <section className="mx-auto max-w-3xl rounded-[2rem] border border-zen-gold/12 bg-zen-surface/70 p-8 text-center shadow-zen-card backdrop-blur-xl">
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-100">
                        Registered
                    </span>
                    <h1 className="mt-5 text-3xl font-black tracking-tight">You&apos;re on the list.</h1>
                    <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-slate-300">
                        We&apos;ll notify you when enrollment opens. Your registration is tied to Arsenal identity when Arsenal injects the authenticated Supabase user id.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Link to={`/programs/${program.slug}`} className="rounded-full bg-gradient-to-r from-zen-gold to-zen-gold-light px-5 py-3 text-sm font-semibold text-zen-navy">
                            Return to program
                        </Link>
                        <Link to="/command-center" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200">
                            Return to Arsenal
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_70%_50%_at_20%_12%,rgba(201,168,76,0.08),transparent_58%),linear-gradient(180deg,#020617_0%,#081321_52%,#050814_100%)] px-5 py-10 text-white sm:px-8">
            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <section className="rounded-[2rem] border border-zen-gold/12 bg-zen-surface/70 p-6 shadow-zen-card backdrop-blur-xl sm:p-8">
                    <Link to={`/programs/${program.slug}`} className="text-xs font-semibold uppercase tracking-[0.28em] text-zen-gold/70">
                        Back to {program.title}
                    </Link>
                    <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Register interest</h1>
                    <p className="mt-4 text-sm leading-8 text-slate-300">
                        Join the waitlist for {program.title}. This does not create a separate course account.
                    </p>
                    <div className="mt-6 rounded-[1.3rem] border border-zen-gold/10 bg-zen-navy/55 p-4">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-zen-gold/60">Captured source</p>
                        <p className="mt-2 text-sm text-slate-300">{campaign.source ?? campaign.utm_campaign ?? 'direct'}</p>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="rounded-[2rem] border border-zen-gold/12 bg-zen-surface/70 p-6 shadow-zen-card backdrop-blur-xl sm:p-8">
                    <div className="grid gap-4">
                        <label className="block">
                            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-zen-gold/70">Email</span>
                            <input
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                type="email"
                                required
                                className="mt-2 w-full rounded-2xl border border-zen-gold/10 bg-zen-navy/70 px-4 py-3 text-sm text-white outline-none transition focus:border-zen-gold/35"
                            />
                        </label>
                        <label className="block">
                            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-zen-gold/70">Name</span>
                            <input
                                value={displayName}
                                onChange={(event) => setDisplayName(event.target.value)}
                                type="text"
                                className="mt-2 w-full rounded-2xl border border-zen-gold/10 bg-zen-navy/70 px-4 py-3 text-sm text-white outline-none transition focus:border-zen-gold/35"
                            />
                        </label>
                    </div>

                    {error && (
                        <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-300/[0.08] px-4 py-3 text-sm text-red-100">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-6 w-full rounded-full bg-gradient-to-r from-zen-gold to-zen-gold-light px-5 py-3 text-sm font-semibold text-zen-navy transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
                    >
                        {submitting ? 'Registering...' : 'Join waitlist'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProgramRegisterPage;
