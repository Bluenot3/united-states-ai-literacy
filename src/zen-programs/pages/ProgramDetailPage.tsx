import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { isAdminEmail } from '../../services/adminAccess';
import { useAuth } from '../../hooks/useAuth';
import { getAccentClasses } from '../programsRegistry';
import {
    getProgramAccessDecision,
    getProgramBySlug,
    type UserProgramState,
} from '../programIntegrationContract';
import { programRegistrationAdapter } from '../programRegistrationAdapter';
import { getSyntheticStandaloneUserId, ProgramAccessGate } from '../components/ProgramAccessGate';
import { getArsenalProgramBridgeItem } from '../arsenalProgramBridge';

const pathway = ['Learn', 'Build', 'Deploy', 'Verify'];

const ProgramDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const program = slug ? getProgramBySlug(slug) : undefined;
    const { user, isAuthenticated } = useAuth();
    const isAdmin = isAdminEmail(user?.email);
    const [state, setState] = useState<UserProgramState | null>(null);
    const userId = user?.id ?? getSyntheticStandaloneUserId(user?.email);

    useEffect(() => {
        if (!program) return;

        let active = true;
        void programRegistrationAdapter.getRegistrationForProgram(userId, program.programKey)
            .then((nextState) => {
                if (active) setState(nextState);
            })
            .catch((error) => console.warn('Program registration state unavailable.', error));

        return () => {
            active = false;
        };
    }, [program, userId]);

    const colors = useMemo(() => (
        program ? getAccentClasses((program.metadata.accentColor as Parameters<typeof getAccentClasses>[0]) ?? 'blue') : null
    ), [program]);

    if (!program || !colors) {
        return <Navigate to="/programs" replace />;
    }

    const decision = getProgramAccessDecision({
        program,
        userState: state,
        isAuthenticated,
        isAdmin,
    });
    const skills = (program.metadata.skills as string[] | undefined) ?? [];
    const outcomes = (program.metadata.keyOutcomes as string[] | undefined) ?? [];
    const starterSteps = (program.metadata.starterSteps as string[] | undefined) ?? [];
    const bridge = getArsenalProgramBridgeItem({
        program,
        userState: state,
        isAuthenticated,
        isAdmin,
    });

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_80%_55%_at_18%_14%,rgba(201,168,76,0.08),transparent_58%),linear-gradient(180deg,#020617_0%,#081321_50%,#050814_100%)] px-5 py-10 text-white sm:px-8">
            <div className="mx-auto max-w-6xl">
                <Link to="/programs" className="text-xs font-semibold uppercase tracking-[0.28em] text-zen-gold/70 transition hover:text-zen-gold">
                    Back to programs
                </Link>

                <section className="mt-5 overflow-hidden rounded-[2rem] border border-zen-gold/12 bg-zen-surface/70 p-6 shadow-zen-card backdrop-blur-xl sm:p-8 lg:p-10">
                    <div className={`pointer-events-none absolute right-8 top-10 h-56 w-56 rounded-full bg-gradient-to-br ${colors.gradient} opacity-[0.10] blur-3xl`} />
                    <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${colors.gradient} text-sm font-black text-white`}>
                                    {String(program.metadata.icon ?? program.title.slice(0, 2)).slice(0, 2)}
                                </span>
                                <span className="rounded-full border border-zen-gold/20 bg-zen-gold/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zen-gold-light">
                                    {decision.badgeLabel}
                                </span>
                                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-200">
                                    {program.status}
                                </span>
                            </div>
                            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">{program.title}</h1>
                            <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300 sm:text-base">{program.shortDescription}</p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                {decision.canRegister && (
                                    <Link to={`/programs/${program.slug}/register`} className="rounded-full bg-gradient-to-r from-zen-gold to-zen-gold-light px-5 py-3 text-sm font-semibold text-zen-navy transition hover:-translate-y-0.5">
                                        {isAuthenticated ? 'Join waitlist' : 'Register interest'}
                                    </Link>
                                )}
                                <ProgramAccessGate
                                    program={program}
                                    userProgramState={state}
                                    isAuthenticated={isAuthenticated}
                                    isAdmin={isAdmin}
                                    mode="full"
                                >
                                    <Link to={program.launchRoute} className={`rounded-full bg-gradient-to-r ${colors.gradient} px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5`}>
                                        Launch program
                                    </Link>
                                </ProgramAccessGate>
                            </div>
                        </div>

                        <aside className="rounded-[1.5rem] border border-zen-gold/10 bg-zen-navy/55 p-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/60">Program facts</p>
                            <dl className="mt-4 space-y-4 text-sm">
                                <div>
                                    <dt className="text-slate-500">Audience</dt>
                                    <dd className="mt-1 text-slate-200">{program.audience}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">Duration</dt>
                                    <dd className="mt-1 text-slate-200">{program.estimatedDuration}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">Credential</dt>
                                    <dd className="mt-1 text-slate-200">{program.credentialLabel}</dd>
                                </div>
                            </dl>
                        </aside>
                    </div>
                </section>

                <section className="mt-6 grid gap-4 lg:grid-cols-4">
                    {pathway.map((step) => (
                        <article key={step} className="rounded-[1.25rem] border border-zen-gold/10 bg-zen-surface/60 p-5 shadow-zen-card">
                            <p className={`text-sm font-black ${colors.text}`}>{step}</p>
                            <p className="mt-2 text-xs leading-6 text-slate-400">Pathway stage for registration, preview, full enrollment, and evidence.</p>
                        </article>
                    ))}
                </section>

                <section className="mt-6 overflow-hidden rounded-[1.8rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card backdrop-blur-xl">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/60">Arsenal bridge</p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-white">First-class Arsenal pathway, existing curriculum runtime.</h2>
                            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">{bridge.roleInArsenal}</p>
                        </div>
                        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
                            {bridge.canonicalCurriculumOwner}
                        </span>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-3">
                        <article className="rounded-[1.35rem] border border-white/10 bg-zen-navy/55 p-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zen-gold/60">Arsenal controls</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {bridge.arsenalOwns.slice(0, 6).map((surface) => (
                                    <span key={surface} className="rounded-full border border-zen-gold/10 bg-zen-gold/[0.04] px-3 py-1 text-[11px] text-slate-300">{surface}</span>
                                ))}
                            </div>
                        </article>
                        <article className="rounded-[1.35rem] border border-white/10 bg-zen-navy/55 p-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zen-gold/60">Program Ecosystem owns</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {bridge.ecosystemOwns.map((surface) => (
                                    <span key={surface} className="rounded-full border border-cyan-300/10 bg-cyan-300/[0.04] px-3 py-1 text-[11px] text-slate-300">{surface}</span>
                                ))}
                            </div>
                        </article>
                        <article className="rounded-[1.35rem] border border-white/10 bg-zen-navy/55 p-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zen-gold/60">Release policy</p>
                            <p className="mt-3 text-sm leading-7 text-slate-300">{bridge.releaseControl.unlockPolicy}</p>
                        </article>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                        <div className="rounded-[1.25rem] border border-purple-300/15 bg-purple-300/[0.05] p-4 text-sm font-semibold text-purple-100">
                            Vault artifact lane
                            <p className="mt-2 text-xs font-normal leading-6 text-slate-400">{bridge.artifactLinks.vaultRoute}</p>
                        </div>
                        <div className="rounded-[1.25rem] border border-cyan-300/15 bg-cyan-300/[0.05] p-4 text-sm font-semibold text-cyan-100">
                            Hugging Face publish lane
                            <p className="mt-2 text-xs font-normal leading-6 text-slate-400">{bridge.artifactLinks.huggingFacePublishRoute}</p>
                        </div>
                        <Link to={bridge.artifactLinks.credentialRoute} className="rounded-[1.25rem] border border-emerald-300/15 bg-emerald-300/[0.05] p-4 text-sm font-semibold text-emerald-100 transition hover:-translate-y-0.5">
                            CREDS proof lane
                        </Link>
                    </div>
                </section>

                <section className="mt-6 grid gap-5 lg:grid-cols-3">
                    <article className="rounded-[1.6rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/60">Build / Earn</p>
                        <p className="mt-3 text-sm leading-7 text-slate-300">{String(program.metadata.coreOutput ?? program.credentialLabel)}</p>
                    </article>
                    <article className="rounded-[1.6rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/60">Skills</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <span key={skill} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-slate-300">{skill}</span>
                            ))}
                        </div>
                    </article>
                    <article className="rounded-[1.6rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/60">Access state</p>
                        <p className="mt-3 text-sm leading-7 text-slate-300">{decision.reason}</p>
                    </article>
                </section>

                <section className="mt-6 grid gap-5 lg:grid-cols-2">
                    <article className="rounded-[1.6rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/60">Outcomes</p>
                        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                            {outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
                        </ul>
                    </article>
                    <article className="rounded-[1.6rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/60">Starter steps</p>
                        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                            {starterSteps.map((step) => <li key={step}>{step}</li>)}
                        </ul>
                    </article>
                </section>
            </div>
        </div>
    );
};

export default ProgramDetailPage;
