import React from 'react';
import { Link } from 'react-router-dom';
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
                <section className="relative overflow-hidden rounded-[2.5rem] border border-zen-gold/15 bg-[linear-gradient(135deg,rgba(6,11,24,0.95)_0%,rgba(15,23,42,0.85)_48%,rgba(6,11,24,0.95)_100%)] p-6 shadow-zen-card backdrop-blur-xl sm:p-8 lg:p-10">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute left-[8%] top-10 h-44 w-44 rounded-full bg-zen-gold/[0.07] blur-3xl" />
                        <div className="absolute right-[12%] top-14 h-48 w-48 rounded-full bg-brand-cyan/[0.05] blur-3xl" />
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zen-gold/20 to-transparent" />
                    </div>

                    <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="rounded-full border border-zen-gold/25 bg-zen-gold/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-zen-gold-light">
                                    Program Hub
                                </span>
                                <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                                    Est. 2024
                                </span>
                            </div>
                            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.08]">
                                Choose the path that matches your current level.
                            </h1>
                            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                                {user?.name ? `${user.name.split(' ')[0]}, ` : ''}
                                start with the Starter Guide if you want the shortest route from zero context to a finished
                                deployment. Then choose the program that fits your age, experience, and build goals.
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link to="/guide" className="rounded-full bg-gradient-to-r from-zen-gold to-zen-gold-light px-5 py-3 text-sm font-semibold text-zen-navy transition duration-300 hover:-translate-y-0.5 hover:shadow-glowing-gold">
                                    Open Starter Guide
                                </Link>
                                <Link to="/dashboard" className="rounded-full border border-zen-gold/15 bg-zen-gold/[0.06] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-zen-gold/[0.1]">
                                    Open Vanguard Dashboard
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-[1.9rem] border border-zen-gold/10 bg-zen-gold/[0.03] p-6 backdrop-blur-md">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zen-gold">Recommended order</p>
                            <ol className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-zen-gold/[0.1] text-[11px] font-bold text-zen-gold">1</span>
                                    <span>Read the Starter Guide once.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-zen-gold/[0.1] text-[11px] font-bold text-zen-gold">2</span>
                                    <span>Choose AI Pioneer if you need a true beginner path.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-zen-gold/[0.1] text-[11px] font-bold text-zen-gold">3</span>
                                    <span>Move to Vanguard when you are ready to treat projects like production work.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-zen-gold/[0.1] text-[11px] font-bold text-zen-gold">4</span>
                                    <span>Use Arena, Web3, or T3 when you need specialized depth.</span>
                                </li>
                            </ol>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="grid gap-4 md:grid-cols-3">
                        {hubStats.map((stat) => (
                            <article key={stat.label} className="rounded-[1.6rem] border border-zen-gold/10 bg-zen-surface/60 p-5 shadow-zen-card backdrop-blur-xl">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zen-gold/65">{stat.label}</p>
                                <p className="mt-3 text-3xl font-black tracking-tight text-white">{stat.value}</p>
                                <p className="mt-3 text-sm leading-7 text-slate-400">{stat.detail}</p>
                            </article>
                        ))}
                    </div>

                    <article className="rounded-[1.8rem] border border-zen-gold/10 bg-[linear-gradient(180deg,rgba(8,13,29,0.92)_0%,rgba(8,13,29,0.76)_100%)] p-6 shadow-zen-card backdrop-blur-xl">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zen-gold/65">Launch quality</p>
                        <h2 className="mt-3 text-2xl font-black tracking-tight text-white">The workspace now reads like a product surface, not a content dump.</h2>
                        <div className="mt-4 space-y-3">
                            {platformPillars.map((pillar) => (
                                <div key={pillar} className="flex items-start gap-3 rounded-[1.2rem] border border-zen-gold/8 bg-zen-navy/45 px-4 py-3">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zen-gold/80" />
                                    <p className="text-sm leading-7 text-slate-300">{pillar}</p>
                                </div>
                            ))}
                        </div>
                    </article>
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
