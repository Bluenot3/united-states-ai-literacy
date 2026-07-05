import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Rocket, Trophy } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getAccentClasses, programs } from '../programsRegistry';


const vanguardCurriculumBlueprint = [
    {
        module: 'Module 1',
        title: 'The Intelligence Inside',
        focus: 'Replace AI mythology with technical intuition for model behavior, architecture, and failure analysis.',
        systems: ['Neural networks and transformers', 'Context windows and embeddings', 'Alignment, safety, and adversarial risk'],
        labs: ['Neural Network Playground', 'Loss Landscape Navigator', 'Prompt Injection Game'],
        artifact: 'Model Behavior Analysis Brief',
    },
    {
        module: 'Module 2',
        title: 'Agents and Automation Frameworks',
        focus: 'Move from prompting to autonomous workflows with retrieval, tools, orchestration, and governance controls.',
        systems: ['Workflow orchestration and event-driven pipelines', 'RAG architecture and vector retrieval', 'Human-in-the-loop escalation and policy logic'],
        labs: ['RAG Builder', 'EventOps Lab', 'Token Economy Simulator'],
        artifact: 'Autonomous Organization System Design',
    },
    {
        module: 'Module 3',
        title: 'Personal Intelligence and Cognitive Systems',
        focus: 'Build a second-brain operating model for capture, retrieval, synthesis, and higher quality decisions.',
        systems: ['Metadata and file architecture', 'Knowledge graph workflows', 'Trust-but-verify research loops'],
        labs: ['Memory Decay Lab', 'Fact-Checker Simulator', 'Privacy Lens Dashboard'],
        artifact: 'Personal Omni Studio Deployment',
    },
    {
        module: 'Module 4',
        title: 'AI Systems Mastery and Professional Integration',
        focus: 'Operate AI as production infrastructure with cost discipline, drift monitoring, and compliance.',
        systems: ['Executive KPI telemetry', 'Model drift and anomaly detection', 'Regulatory and governance pack assembly'],
        labs: ['Data Drift Risk Lens', 'Ethical Bias Mirror', 'Crisis Command Center'],
        artifact: 'ZEN Web Insight Brief Builder',
    },
];

const vanguardOutcomes = [
    'Technical intuition for how AI systems produce, fail, and recover.',
    'Operational capability to deploy RAG, agents, and monitored automation flows.',
    'Strategic judgment for ROI, governance, and legal-risk decisions.',
    'Verifiable portfolio artifacts that prove execution, not just comprehension.',
];

const executionRoadmap = [
    'Week 1-2: Build foundations, vocabulary, and model behavior diagnostics.',
    'Week 3-5: Ship your first retrieval-backed or tool-using automation.',
    'Week 6-8: Productize your personal knowledge and decision workflow.',
    'Week 9-12: Harden systems with drift, cost, and governance controls.',
];

const operatingStandards = [
    'Keep model and payment secrets server-side only; never expose private keys in frontend variables.',
    'Gate high-risk actions through human approval points with clear escalation paths.',
    'Treat every module output as a portfolio artifact with reproducible evidence.',
    'Test mobile and desktop execution paths before publishing any deployment.',
];

const hubStats = [
    { label: 'Programs', value: String(programs.length), detail: 'Operator, beginner, educator, and specialty tracks' },
    { label: 'Flagship modules', value: '4', detail: 'Sequential Vanguard depth from foundations to systems' },
    { label: 'Proof model', value: 'Artifact-led', detail: 'Outputs are designed to become portfolio evidence' },
];

const platformPillars = [
    'Curriculum, docs, and dashboard are now visually and operationally aligned.',
    'Each path makes audience, depth, duration, and expected outcomes explicit.',
    'The flagship blueprint is surfaced directly on the hub instead of hidden behind navigation.',
];

const ProgramHubPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_80%_60%_at_15%_20%,_rgba(201,168,76,0.08),_transparent_50%),radial-gradient(ellipse_60%_50%_at_85%_80%,_rgba(34,211,238,0.05),_transparent_40%),linear-gradient(180deg,_#020617_0%,_#0A1628_48%,_#060B18_100%)] text-white">
            <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]" style={{
                backgroundImage: 'linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
            }} />

            <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
                {/* ────────────── ZEN Sovereign Landing Hero ────────────── */}
                <section className="relative overflow-hidden rounded-[2rem] border border-[color:var(--zen-line)] bg-[linear-gradient(180deg,rgba(5,10,24,0.96)_0%,rgba(13,23,48,0.9)_60%,rgba(5,10,24,0.98)_100%)] px-6 py-14 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
                    <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{
                        backgroundImage: 'linear-gradient(rgba(240,214,142,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(240,214,142,0.6) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                        maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 30%, transparent 90%)',
                    }} />
                    <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(245,216,141,0.14),transparent_70%)] blur-2xl" />

                    <div className="relative mx-auto max-w-4xl text-center">
                        <span className="zen-micro-label inline-flex items-center gap-2 rounded-full border border-[color:var(--zen-line)] bg-white/[0.02] px-3 py-1.5">
                            <Sparkles className="h-3.5 w-3.5" /> ZEN AI Co.
                        </span>
                        <h1 className="mt-6 font-[Space_Grotesk] text-4xl font-semibold leading-[1.05] tracking-tight text-[#F5E7C0] sm:text-5xl lg:text-[64px]">
                            The First Youth AI Literacy Program in U.S. History
                        </h1>
                        <p className="mt-5 text-lg leading-relaxed text-slate-300 sm:text-xl">
                            Students don&rsquo;t study AI here. They ship it.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] text-slate-400">
                            <span className="flex items-center gap-2"><Trophy className="h-4 w-4 text-[color:var(--zen-brass)]" /> Year 3</span>
                            <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
                            <span>Boys &amp; Girls Clubs of Greater Washington</span>
                            <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
                            <span>Students deploy live AI apps by Week 4</span>
                        </div>
                        {user?.name && (
                            <p className="mt-4 text-sm text-slate-500">Welcome back, {user.name.split(' ')[0]}.</p>
                        )}
                    </div>

                    {/* Two program cards */}
                    <div className="relative mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
                        {/* AI Pioneer */}
                        <Link
                            to="/programs/pioneer"
                            className="zen-glass zen-glass--live group relative flex flex-col p-7 transition-transform duration-300 hover:-translate-y-1"
                        >
                            <span className="zen-corner tl" />
                            <span className="zen-corner tr" />
                            <span className="zen-corner bl" />
                            <span className="zen-corner br" />
                            <div className="relative flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--pio-cyan)]/25 to-[color:var(--pio-violet)]/25 text-[color:var(--pio-cyan)] ring-1 ring-inset ring-[color:var(--pio-cyan)]/30">
                                    <Rocket className="h-5 w-5" />
                                </span>
                                <span className="zen-micro-label rounded-full border border-[color:var(--pio-cyan)]/30 bg-[color:var(--pio-cyan)]/[0.08] px-2.5 py-1 !text-[color:var(--pio-cyan)]">
                                    Build &amp; Launch Track
                                </span>
                            </div>
                            <h2 className="relative mt-6 font-[Space_Grotesk] text-2xl font-semibold tracking-tight text-white">
                                AI Pioneer Program
                            </h2>
                            <p className="relative mt-3 text-[15px] leading-7 text-slate-300">
                                Zero-to-shipped. Learners build, deploy, and defend real AI applications on Hugging Face &mdash; then earn verified evidence they can show.
                            </p>
                            <ul className="relative mt-5 space-y-2 text-[14px] leading-6 text-slate-400">
                                <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--pio-cyan)]" /> Project-based, artifact-led</li>
                                <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--pio-violet)]" /> Ships 3 apps + capstone</li>
                                <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--pio-cyan)]" /> Certificate on completion</li>
                            </ul>
                            <span className="relative mt-7 inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r from-[color:var(--pio-cyan)] to-[color:var(--pio-violet)] px-5 py-2.5 text-sm font-semibold text-[#040915] transition group-hover:gap-3">
                                Enter Pioneer Track <ArrowRight className="h-4 w-4" />
                            </span>
                        </Link>

                        {/* Vanguard */}
                        <Link
                            to="/dashboard"
                            className="zen-glass zen-glass--elevated group relative flex flex-col p-7 transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div className="relative flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--zen-brass)]/25 to-[color:var(--zen-gold)]/25 text-[color:var(--zen-brass)] ring-1 ring-inset ring-[color:var(--zen-brass)]/40">
                                    <ShieldCheck className="h-5 w-5" />
                                </span>
                                <span className="zen-micro-label rounded-full border border-[color:var(--zen-brass)]/30 bg-[color:var(--zen-brass)]/[0.08] px-2.5 py-1">
                                    Professional Track
                                </span>
                            </div>
                            <h2 className="relative mt-6 font-[Space_Grotesk] text-2xl font-semibold tracking-tight text-white">
                                Vanguard Program
                            </h2>
                            <p className="relative mt-3 text-[15px] leading-7 text-slate-300">
                                For working professionals. Self-paced deep track through foundations, agents, personal AI systems, and production governance.
                            </p>
                            <ul className="relative mt-5 space-y-2 text-[14px] leading-6 text-slate-400">
                                <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--zen-brass)]" /> 4 flagship modules, self-paced</li>
                                <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--zen-gold)]" /> RAG, agents, deployment</li>
                                <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--zen-brass)]" /> Verified portfolio artifacts</li>
                            </ul>
                            <span className="relative mt-7 inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r from-[color:var(--zen-brass)] to-[color:var(--zen-gold)] px-5 py-2.5 text-sm font-semibold text-[#1a1204] transition group-hover:gap-3">
                                Enter Vanguard <ArrowRight className="h-4 w-4" />
                            </span>
                        </Link>
                    </div>
                </section>


                <section className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                    {programs.map((program, index) => {
                        const colors = getAccentClasses(program.accentColor);

                        return (
                            <Link
                                key={program.id}
                                to={program.route}
                                className="group overflow-hidden rounded-[1.9rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-zen-gold/20 hover:shadow-zen-card-hover"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${colors.gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-[0.12]`} />

                                <div className="relative flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${colors.gradient} text-sm font-bold text-white shadow-[0_12px_26px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-110`}>
                                                {program.icon}
                                            </span>
                                            {program.badge && (
                                                <span className="rounded-full border border-zen-gold/20 bg-zen-gold/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zen-gold-light">
                                                    {program.badge}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="mt-4 text-xl font-bold text-white">{program.name}</h2>
                                        <p className="mt-2 text-sm leading-7 text-slate-400">{program.description}</p>
                                    </div>
                                </div>

                                <div className="mt-5 rounded-[1.35rem] border border-zen-gold/8 bg-zen-navy/50 p-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zen-gold/50">Good fit for</p>
                                    <p className="mt-2 text-sm text-slate-200">{program.audience}</p>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                    <div className="rounded-[1.2rem] border border-zen-gold/8 bg-zen-navy/50 p-3">
                                        <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Level</p>
                                        <p className="mt-1 text-slate-200">{program.level}</p>
                                    </div>
                                    <div className="rounded-[1.2rem] border border-zen-gold/8 bg-zen-navy/50 p-3">
                                        <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Duration</p>
                                        <p className="mt-1 text-slate-200">{program.duration}</p>
                                    </div>
                                </div>

                                <div className="mt-4 rounded-[1.35rem] border border-zen-gold/8 bg-zen-navy/50 p-4">
                                    <p className="text-[11px] uppercase tracking-[0.25em] text-zen-gold/50">Spotlight</p>
                                    <p className="mt-2 text-sm leading-7 text-slate-200">{program.spotlight}</p>
                                </div>

                                <div className="mt-4 rounded-[1.35rem] border border-zen-gold/8 bg-zen-navy/50 p-4">
                                    <p className="text-[11px] uppercase tracking-[0.25em] text-zen-gold/50">Expected outcomes</p>
                                    <ul className="mt-3 space-y-2">
                                        {program.outcomes.slice(0, 2).map((outcome) => (
                                            <li key={outcome} className="flex items-start gap-2 text-sm leading-7 text-slate-300">
                                                <span className="mt-3 h-1.5 w-1.5 rounded-full bg-zen-gold/80" />
                                                <span>{outcome}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-5 flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        {program.skills.slice(0, 3).map((skill) => (
                                            <span key={skill} className="rounded-full border border-zen-gold/10 bg-zen-gold/[0.04] px-3 py-1 text-[11px] text-slate-300">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <span className={`flex items-center gap-1.5 text-sm font-semibold ${colors.text} transition-transform duration-300 group-hover:translate-x-1`}>
                                        Enter
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </section>

                <section className="mt-12 rounded-[2.2rem] border border-zen-gold/12 bg-[linear-gradient(180deg,rgba(8,13,29,0.9)_0%,rgba(8,13,29,0.7)_100%)] p-6 shadow-zen-card backdrop-blur-xl sm:p-8 lg:p-10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="max-w-3xl">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zen-gold/70">Flagship Program Blueprint</p>
                            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                                Vanguard depth map
                            </h2>
                            <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
                                This is the core curriculum stack behind the flagship track. Each module layers technical depth,
                                systems thinking, and real lab execution into a production-grade portfolio output.
                            </p>
                        </div>
                        <Link
                            to="/dashboard"
                            className="rounded-full border border-zen-gold/20 bg-zen-gold/[0.08] px-5 py-3 text-sm font-semibold text-zen-gold transition duration-300 hover:-translate-y-0.5 hover:border-zen-gold/30 hover:bg-zen-gold/[0.12]"
                        >
                            Open Vanguard Dashboard
                        </Link>
                    </div>

                    <div className="mt-8 grid gap-4 lg:grid-cols-2">
                        {vanguardCurriculumBlueprint.map((moduleCard) => (
                            <article key={moduleCard.module} className="rounded-[1.6rem] border border-zen-gold/10 bg-zen-navy/55 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="rounded-full border border-zen-gold/20 bg-zen-gold/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold-light">
                                        {moduleCard.module}
                                    </span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Portfolio artifact</span>
                                </div>
                                <h3 className="mt-4 text-xl font-bold text-white">{moduleCard.title}</h3>
                                <p className="mt-2 text-sm leading-7 text-slate-300">{moduleCard.focus}</p>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-[1.1rem] border border-zen-gold/8 bg-zen-surface/70 p-3">
                                        <p className="text-[10px] uppercase tracking-[0.22em] text-zen-gold/55">Core systems</p>
                                        <ul className="mt-2 space-y-2">
                                            {moduleCard.systems.map((system) => (
                                                <li key={system} className="text-sm leading-6 text-slate-300">
                                                    {system}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="rounded-[1.1rem] border border-zen-gold/8 bg-zen-surface/70 p-3">
                                        <p className="text-[10px] uppercase tracking-[0.22em] text-zen-gold/55">Interactive labs</p>
                                        <ul className="mt-2 space-y-2">
                                            {moduleCard.labs.map((lab) => (
                                                <li key={lab} className="text-sm leading-6 text-slate-300">
                                                    {lab}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <p className="mt-4 rounded-[1rem] border border-zen-gold/10 bg-zen-gold/[0.04] px-3 py-2 text-sm text-slate-200">
                                    {moduleCard.artifact}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mt-10 grid gap-4 lg:grid-cols-3">
                    <article className="rounded-[1.7rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card backdrop-blur-xl">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/70">Program outcomes</p>
                        <ul className="mt-4 space-y-3">
                            {vanguardOutcomes.map((outcome) => (
                                <li key={outcome} className="flex items-start gap-2 text-sm leading-7 text-slate-300">
                                    <span className="mt-3 h-1.5 w-1.5 rounded-full bg-zen-gold/80" />
                                    <span>{outcome}</span>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="rounded-[1.7rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card backdrop-blur-xl">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/70">Execution roadmap</p>
                        <ul className="mt-4 space-y-3">
                            {executionRoadmap.map((step) => (
                                <li key={step} className="text-sm leading-7 text-slate-300">
                                    {step}
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="rounded-[1.7rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card backdrop-blur-xl">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/70">Operating standards</p>
                        <ul className="mt-4 space-y-3">
                            {operatingStandards.map((standard) => (
                                <li key={standard} className="text-sm leading-7 text-slate-300">
                                    {standard}
                                </li>
                            ))}
                        </ul>
                    </article>
                </section>

                <footer className="mt-12 border-t border-zen-gold/8 py-8 text-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} ZEN AI Co. - All programs. All rights reserved.</p>
                    <p className="mt-1 bg-gradient-to-r from-zen-gold to-brand-cyan bg-clip-text font-medium text-transparent">
                        Powered by ZEN Vanguard AI Literacy Certification
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default ProgramHubPage;
