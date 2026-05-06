import React from 'react';
import { Link } from 'react-router-dom';
import ZenModuleGlyph from '../components/zen/ZenModuleGlyph';
import type { ZenGlyphName } from '../components/zen/ZenModuleGlyph';
import { useAuth } from '../hooks/useAuth';
import { getModuleCompletionPercent, getVanguardProgressSummary, VANGUARD_MODULE_NAMES } from '../services/progressEngine';

type CommandTile =
    | {
        title: string;
        label: string;
        description: string;
        cta: string;
        icon: ZenGlyphName;
        tone: string;
        destination: 'external';
        href: string;
    }
    | {
        title: string;
        label: string;
        description: string;
        cta: string;
        icon: ZenGlyphName;
        tone: string;
        destination: 'internal';
        to: string;
    }
    | {
        title: string;
        label: string;
        description: string;
        cta: string;
        icon: ZenGlyphName;
        tone: string;
        destination: 'anchor';
        href: string;
    }
    | {
        title: string;
        label: string;
        description: string;
        cta: string;
        icon: ZenGlyphName;
        tone: string;
        destination: 'disabled';
    };

const commandTiles: CommandTile[] = [
    {
        title: 'Arsenal',
        label: 'Agent, App & Website Builder',
        description: 'Build, launch, and manage AI agents, apps, automations, and digital systems from one command layer.',
        cta: 'Open Arsenal',
        icon: 'ship',
        tone: 'from-zen-gold/90 via-amber-300/75 to-brand-cyan/80',
        destination: 'external',
        href: 'https://arsenal.world',
    },
    {
        title: 'Smart Business Solutions',
        label: 'Automation Systems for Real Operations',
        description: 'Deploy AI-powered workflows, dashboards, forms, automations, and custom systems that eliminate repetitive work and unlock staff capacity.',
        cta: 'Build with Arsenal',
        icon: 'telemetry',
        tone: 'from-brand-cyan/80 via-zen-emerald/70 to-zen-gold/70',
        destination: 'external',
        href: 'https://arsenal.world',
    },
    {
        title: 'Programs',
        label: 'AI Literacy & Workforce Pathways',
        description: 'Run the four-module ZEN Intelligence Architect pathway from foundations through production-grade multi-agent workflows.',
        cta: 'View Programs',
        icon: 'programs',
        tone: 'from-purple-300/80 via-zen-gold/70 to-brand-cyan/70',
        destination: 'internal',
        to: '/hub',
    },
    {
        title: 'AI Social',
        label: 'AI-Native Community & Distribution',
        description: 'Connect learning, publishing, creators, cohorts, and community engagement into one AI-powered social layer.',
        cta: 'Explore AI Social',
        icon: 'network',
        tone: 'from-cyan-300/80 via-blue-400/70 to-purple-300/75',
        destination: 'disabled',
    },
    {
        title: 'Web3 Credentials',
        label: 'Proof-Linked Credential Layer',
        description: 'Issue portable, blockchain-ready certificates tied to learner identity, deployment artifacts, review trails, and portfolio evidence.',
        cta: 'Open Credential Forge',
        icon: 'verify',
        tone: 'from-zen-emerald/80 via-brand-cyan/70 to-zen-gold/70',
        destination: 'internal',
        to: '/credential-forge',
    },
    {
        title: 'ZEN Overview',
        label: 'Movement, Partners & Proof',
        description: 'Explore ZEN\'s accomplishments, partners, programs, systems, and historic milestones.',
        cta: 'View Impact',
        icon: 'identity',
        tone: 'from-zen-gold/85 via-slate-200/65 to-brand-cyan/75',
        destination: 'anchor',
        href: '#zen-overview',
    },
];

const proofHighlights = [
    'ZEN is infrastructure, not curriculum',
    'ZEN AI Co. founded in 2024',
    'Mission: democratize AI literacy through deployable, credentialed education',
    'First youth AI literacy program in United States history',
    'Boys & Girls Clubs of America partner context entering Year 3',
    'Current reach: 42 U.S. states and 12 countries',
    'Learners deploy agents, apps, automations, credentials, and portfolios',
    'Every learner ships real agents, apps, or automation systems',
    'AI-assisted and human-reviewed assessment at each milestone',
    'Blockchain-ready certificates tied to portfolio artifacts',
    'Git-based learner projects, semantic curriculum versions, and rollback paths',
];

const ecosystemLayers = [
    {
        title: 'Learners',
        detail: 'Youth, young adults, and professionals entering guided or self-directed AI literacy tracks.',
        status: 'Input',
    },
    {
        title: 'Curriculum',
        detail: 'Four progressive modules moving from first AI interactions to production-grade multi-agent workflows.',
        status: 'Input',
    },
    {
        title: 'Tools',
        detail: 'Gemini, OpenAI, Hugging Face, Supabase, Solana, Vercel, and Arsenal as deployment surfaces.',
        status: 'Input',
    },
    {
        title: 'Partners',
        detail: 'Boys & Girls Clubs, educational institutions, enterprises, mentors, and ZEN graduates.',
        status: 'Input',
    },
    {
        title: 'Deployment Pipeline',
        detail: 'Interactive learning, artifact shipping, AI plus human review, credentialing, and community showcase loops.',
        status: 'Process',
    },
    {
        title: 'Proof Artifacts',
        detail: 'Agents, apps, automations, verifiable certificates, and public-facing competency portfolios.',
        status: 'Output',
    },
    {
        title: 'Audit Trail',
        detail: 'Timestamp, learner ID, artifact hash, tool calls, human review state, and security scan posture.',
        status: 'Governance',
    },
    {
        title: 'Credential Standards',
        detail: 'ZEN Certified, ZEN Pro, and ZEN Mentor credentials mapped to specific deployment requirements.',
        status: 'Governance',
    },
];

const operationalMetrics = [
    { value: 'ZEN AI Co.', label: 'Legal operating identity' },
    { value: '42 / 12', label: 'States and countries reached' },
    { value: 'Year 3', label: 'Boys & Girls Clubs partner context' },
    { value: '4 modules', label: 'Deployment-backed mastery path' },
];

const identityRows = [
    { label: 'Legal Name', value: 'ZEN AI Co.' },
    { label: 'Founded', value: '2024' },
    { label: 'Mission', value: 'Democratize AI literacy through deployable, credentialed education' },
    { label: 'Distinction', value: 'First youth AI literacy program in United States history' },
    { label: 'Primary Partner', value: 'Boys & Girls Clubs of America, entering Year 3' },
    { label: 'Current Reach', value: '42 U.S. states, 12 countries' },
];

const deploymentPipeline = [
    { module: 'Module 1', artifact: 'First AI interaction app', examples: 'Email writer, summarizer, or guided assistant' },
    { module: 'Module 2', artifact: 'Generative media project', examples: 'Image, audio, video, and creative AI production' },
    { module: 'Module 3', artifact: 'Single-purpose autonomous agent', examples: 'Memory, tools, goals, and narrow operating scope' },
    { module: 'Module 4', artifact: 'Production-grade multi-agent workflow', examples: 'Coordinated agents, automation paths, and reviewable outputs' },
];

const credentialStandards = [
    { level: 'ZEN Certified', requirement: 'Complete all four modules', badge: 'Intelligence Architect' },
    { level: 'ZEN Pro', requirement: 'Pass advanced capstone and deploy a production agent', badge: 'Pro Architect' },
    { level: 'ZEN Mentor', requirement: 'Train 10+ learners plus contribute to the community', badge: 'Mentor Badge' },
];

const launchReadiness = [
    {
        title: 'Canonical identity locked',
        state: 'Live',
        detail: 'The command center now speaks from the official ZEN AI Co. source of truth instead of generic ecosystem language.',
    },
    {
        title: 'Proof model operationalized',
        state: 'Live',
        detail: 'Inputs, processes, outputs, audit trails, versioning, and credential standards are visible as the operating model.',
    },
    {
        title: 'Credential Forge routed',
        state: 'Live',
        detail: 'The Web3 credential tile opens the proof-linked credential layer already mounted in the app.',
    },
    {
        title: 'AI Social distribution',
        state: 'Integration remaining',
        detail: 'Kept intentionally marked as coming soon until the social layer is wired to real community and publishing data.',
    },
    {
        title: 'Partner CRM sync',
        state: 'Integration remaining',
        detail: 'Ready for live partner, cohort, and institution data once the final external integration is connected.',
    },
];

const CommandTileCard: React.FC<{ tile: CommandTile; index: number }> = ({ tile, index }) => {
    const content = (
        <>
            <div className="flex items-start justify-between gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tile.tone} p-[1px] shadow-[0_18px_42px_rgba(0,0,0,0.35)]`}>
                    <span className="flex h-full w-full items-center justify-center rounded-[0.9rem] bg-[#050816]/90 text-white">
                        <ZenModuleGlyph name={tile.icon} className="h-5 w-5" />
                    </span>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                    {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            <div className="mt-6">
                <p className="text-sm font-semibold text-zen-gold-light">{tile.title}</p>
                <h2 className="mt-2 text-xl font-black leading-tight tracking-tight text-white">{tile.label}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">{tile.description}</p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-white">{tile.cta}</span>
                <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${tile.tone} text-[#040714] transition duration-300 group-hover:translate-x-1`}>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                </span>
            </div>
        </>
    );

    const cardClassName = 'group relative flex min-h-[20rem] flex-col justify-between overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-5 text-left shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-zen-gold/25 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-zen-gold/70';

    if (tile.destination === 'external') {
        return (
            <a href={tile.href} target="_blank" rel="noreferrer" className={cardClassName}>
                <span className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${tile.tone} to-transparent opacity-70`} />
                {content}
            </a>
        );
    }

    if (tile.destination === 'internal') {
        return (
            <Link to={tile.to} className={cardClassName}>
                <span className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${tile.tone} to-transparent opacity-70`} />
                {content}
            </Link>
        );
    }

    if (tile.destination === 'anchor') {
        return (
            <a href={tile.href} className={cardClassName}>
                <span className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${tile.tone} to-transparent opacity-70`} />
                {content}
            </a>
        );
    }

    return (
        <div className={`${cardClassName} cursor-default opacity-80`} aria-disabled="true">
            <span className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${tile.tone} to-transparent opacity-50`} />
            {content}
            <span className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Coming soon
            </span>
        </div>
    );
};

const CommandCenterPage: React.FC = () => {
    const { user, getModuleProgress } = useAuth();
    const marqueeItems = [...proofHighlights, ...proofHighlights];
    const progressSummary = getVanguardProgressSummary(user);
    const recentBadges = (user?.badges ?? []).slice(0, 3);
    const moduleProgressCards = ([1, 2, 3, 4] as const).map((moduleId) => {
        const progress = getModuleProgress(moduleId);

        return {
            moduleId,
            name: VANGUARD_MODULE_NAMES[moduleId],
            percent: getModuleCompletionPercent(progress, moduleId),
            sections: progress.completedSections.length,
            certificateId: progress.certificateId,
            lastViewedSection: progress.lastViewedSection,
        };
    });

    return (
        <div className="relative -m-4 min-h-screen overflow-hidden bg-[#03050d] text-white lg:-m-8">
            <style>
                {`
                    @keyframes zen-command-grid {
                        0% { transform: translate3d(0, 0, 0); }
                        100% { transform: translate3d(56px, 56px, 0); }
                    }

                    @keyframes zen-command-marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }

                    @keyframes zen-command-scan {
                        0%, 100% { transform: translateY(-18%); opacity: 0.18; }
                        50% { transform: translateY(18%); opacity: 0.35; }
                    }
                `}
            </style>

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(201,168,76,0.12),transparent_38%),radial-gradient(ellipse_at_80%_18%,rgba(34,211,238,0.10),transparent_34%),linear-gradient(180deg,#03050d_0%,#07101d_46%,#03050d_100%)]" />
            <div
                className="pointer-events-none absolute -inset-14 opacity-[0.07]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)',
                    backgroundSize: '56px 56px',
                    animation: 'zen-command-grid 24s linear infinite',
                }}
            />
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-[linear-gradient(180deg,transparent,rgba(201,168,76,0.10),transparent)] blur-2xl"
                style={{ animation: 'zen-command-scan 9s ease-in-out infinite' }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
                <section className="grid min-h-[calc(100vh-10rem)] items-center gap-10 py-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                        <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                            ZEN Ecosystem Command Center
                        </h1>
                        <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                            Enter the operating layer connecting Arsenal, AI literacy programs, automation systems, AI social tools, business solutions, and blockchain-verified credentials.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <a
                                href="https://arsenal.world"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-zen-gold via-zen-gold-light to-brand-cyan px-6 py-3 text-sm font-black text-[#03050d] shadow-[0_18px_40px_rgba(201,168,76,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_54px_rgba(34,211,238,0.18)]"
                            >
                                Launch Arsenal
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                                </svg>
                            </a>
                            <Link
                                to="/hub"
                                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-6 py-3 text-sm font-bold text-white backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-zen-gold/30 hover:bg-zen-gold/[0.08]"
                            >
                                Explore Programs
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zen-gold/70">Ecosystem map</p>
                                    <p className="mt-2 text-lg font-black text-white">Central operating layer</p>
                                </div>
                                <div className="flex gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-zen-gold/80" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-brand-cyan/70" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-zen-emerald/70" />
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3">
                                {ecosystemLayers.map((layer, index) => (
                                    <div key={layer.title} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#07101d]/80 px-4 py-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-zen-gold/20 bg-zen-gold/[0.08] text-[11px] font-black text-zen-gold">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="flex-1 text-sm font-semibold text-slate-200">{layer.title}</span>
                                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                            {layer.status}
                                        </span>
                                        <span className="h-1.5 w-10 rounded-full bg-gradient-to-r from-zen-gold/80 to-brand-cyan/70" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {operationalMetrics.map((metric) => (
                        <article key={metric.label} className="rounded-[1.25rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                            <p className="text-2xl font-black tracking-tight text-white">{metric.value}</p>
                            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{metric.label}</p>
                        </article>
                    ))}
                </section>

                <section className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <article className="rounded-[1.35rem] border border-zen-gold/15 bg-zen-gold/[0.055] p-5 backdrop-blur-xl">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-zen-gold/70">Learner proof record</p>
                        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-white">{user?.name ?? 'ZEN Preview User'}</h2>
                                <p className="mt-2 text-sm font-semibold text-slate-300">{user?.email ?? 'preview@zenai.world'}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-[#07101d]/80 px-4 py-3 text-right">
                                <p className="text-3xl font-black text-zen-gold">{progressSummary.completionPercent}%</p>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Vanguard complete</p>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-white/8 bg-[#07101d]/75 p-4">
                                <p className="text-2xl font-black text-white">{progressSummary.completedSections}/{progressSummary.totalSections}</p>
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Sections tracked</p>
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-[#07101d]/75 p-4">
                                <p className="text-2xl font-black text-white">{progressSummary.badgesEarned}</p>
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Badges earned</p>
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-[#07101d]/75 p-4">
                                <p className="text-2xl font-black text-white">{progressSummary.certificatesEarned}</p>
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Credentials issued</p>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {(recentBadges.length ? recentBadges : [
                                { id: 'locked', title: 'First Vanguard Action', description: 'Complete any tracked section to unlock.', kind: 'section' as const, earnedAt: '' },
                            ]).map((badge) => (
                                <span key={badge.id} className="rounded-full border border-zen-gold/20 bg-zen-gold/[0.08] px-3 py-1.5 text-xs font-bold text-zen-gold">
                                    {badge.title}
                                </span>
                            ))}
                        </div>
                    </article>

                    <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-cyan/65">Email-keyed progress</p>
                                <h2 className="mt-2 text-2xl font-black text-white">Every module writes back to the learner record.</h2>
                            </div>
                            {user?.finalCertificationId && (
                                <Link to={`/certificate/${user.finalCertificationId}`} className="rounded-full border border-zen-emerald/25 bg-zen-emerald/[0.10] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-zen-emerald">
                                    Final certificate
                                </Link>
                            )}
                        </div>

                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                            {moduleProgressCards.map((module) => (
                                <div key={module.moduleId} className="rounded-2xl border border-white/8 bg-[#07101d]/75 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-cyan/65">Module {module.moduleId}</p>
                                            <h3 className="mt-2 text-sm font-black text-white">{module.name}</h3>
                                        </div>
                                        <span className="text-xl font-black text-zen-gold">{module.percent}%</span>
                                    </div>
                                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                                        <div className="h-full rounded-full bg-gradient-to-r from-zen-gold to-brand-cyan" style={{ width: `${module.percent}%` }} />
                                    </div>
                                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                                        <span>{module.sections} sections</span>
                                        <span>{module.certificateId ? 'Certificate issued' : `Last: ${module.lastViewedSection}`}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </article>
                </section>

                <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {commandTiles.map((tile, index) => (
                        <CommandTileCard key={tile.title} tile={tile} index={index} />
                    ))}
                </section>

                <section id="zen-overview" className="scroll-mt-24 py-16 lg:py-20">
                    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                        <div>
                            <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                                ZEN Is Infrastructure, Not Curriculum
                            </h2>
                            <p className="mt-5 text-base leading-8 text-slate-300">
                                ZEN deploys AI as an operating system for human potential. The command center now exposes the real scaffolding: platforms, pipelines, credentials, partners, audit trails, and portfolio proof.
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
                            <div className="flex w-max gap-3" style={{ animation: 'zen-command-marquee 34s linear infinite' }}>
                                {marqueeItems.map((highlight, index) => (
                                    <span key={`${highlight}-${index}`} className="whitespace-nowrap rounded-full border border-zen-gold/15 bg-zen-gold/[0.06] px-4 py-2 text-sm font-semibold text-slate-200">
                                        {highlight}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                        <article className="rounded-[1.35rem] border border-white/10 bg-[#07101d]/75 p-5 backdrop-blur-xl">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zen-gold/60">Official identity</p>
                            <div className="mt-5 divide-y divide-white/10">
                                {identityRows.map((row) => (
                                    <div key={row.label} className="grid gap-2 py-3 sm:grid-cols-[10rem_1fr]">
                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{row.label}</p>
                                        <p className="text-sm font-semibold leading-6 text-slate-200">{row.value}</p>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="rounded-[1.35rem] border border-white/10 bg-[#07101d]/75 p-5 backdrop-blur-xl">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-cyan/60">Operating model</p>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {ecosystemLayers.map((layer) => (
                                    <div key={layer.title} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <h3 className="text-sm font-black text-white">{layer.title}</h3>
                                            <span className="rounded-full border border-zen-gold/15 bg-zen-gold/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-zen-gold/70">
                                                {layer.status}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-xs leading-6 text-slate-400">{layer.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </div>

                    <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                        <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zen-gold/60">Deployment pipeline</p>
                                    <h3 className="mt-2 text-2xl font-black text-white">Every module ships a real artifact.</h3>
                                </div>
                                <p className="max-w-sm text-sm leading-6 text-slate-400">
                                    The platform measures deployment rate, completion, credential issuance, partner expansion, and learner satisfaction.
                                </p>
                            </div>

                            <div className="mt-6 grid gap-3 md:grid-cols-2">
                                {deploymentPipeline.map((item) => (
                                    <div key={item.module} className="rounded-2xl border border-white/8 bg-[#07101d]/80 p-4">
                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-cyan/65">{item.module}</p>
                                        <h4 className="mt-3 text-base font-black text-white">{item.artifact}</h4>
                                        <p className="mt-2 text-sm leading-6 text-slate-400">{item.examples}</p>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zen-emerald/70">Credential standards</p>
                            <div className="mt-5 grid gap-3">
                                {credentialStandards.map((credential) => (
                                    <div key={credential.level} className="rounded-2xl border border-white/8 bg-[#07101d]/80 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <h4 className="text-base font-black text-white">{credential.level}</h4>
                                            <span className="rounded-full border border-zen-emerald/20 bg-zen-emerald/[0.08] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zen-emerald">
                                                {credential.badge}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-slate-400">{credential.requirement}</p>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        {launchReadiness.map((item) => (
                            <article key={item.title} className="rounded-[1.2rem] border border-white/10 bg-[#07101d]/75 p-5 backdrop-blur-xl transition duration-300 hover:border-zen-gold/20 hover:bg-white/[0.055]">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zen-gold/60">
                                    {item.state}
                                </p>
                                <h3 className="mt-3 text-lg font-black text-white">{item.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-400">
                                    {item.detail}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CommandCenterPage;
