import React from 'react';
import { Link } from 'react-router-dom';
import { ZenModuleGlyph } from '../components/zen';
import type { ZenGlyphName } from '../components/zen';

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
        description: 'Access ZEN\'s program ecosystem, including the AI Pioneer Program, Vanguard, Web3 Literacy, and future training pathways.',
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
        label: 'Verified Proof of Skill',
        description: 'Turn learning, building, and achievement into portable blockchain-verified credentials for students, professionals, and partners.',
        cta: 'View Credential Layer',
        icon: 'verify',
        tone: 'from-zen-emerald/80 via-brand-cyan/70 to-zen-gold/70',
        destination: 'internal',
        to: '/programs/web3',
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
    'First youth AI literacy program in United States history',
    'Students ages 11-18 launched cloud-hosted AI-powered agents',
    'AI Pioneer Program',
    'Vanguard adult AI literacy and workforce acceleration',
    'Smart Business Solutions automation systems',
    'Arsenal as the app, website, agent, and automation builder',
    'Web3 / blockchain-verified credentials',
    'AI Social layer',
    'Partner and client ecosystem',
    'Business process automation',
    'AI education infrastructure',
    'Dashboard and workflow systems',
    'Future-ready AI x Web3 literacy movement',
];

const ecosystemCategories = [
    'Programs',
    'Platforms',
    'Automation Systems',
    'Credentials',
    'Partners & Clients',
    'Student-Built AI Agents',
    'Workforce Pathways',
    'Business Infrastructure',
];

const operationalMetrics = [
    { value: '11-18', label: 'Student builder age range' },
    { value: '4+', label: 'Program pathways active' },
    { value: 'AI x Web3', label: 'Literacy and proof layer' },
    { value: 'Arsenal', label: 'Builder and automation platform' },
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
    const marqueeItems = [...proofHighlights, ...proofHighlights];

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
                                {ecosystemCategories.map((category, index) => (
                                    <div key={category} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#07101d]/80 px-4 py-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-zen-gold/20 bg-zen-gold/[0.08] text-[11px] font-black text-zen-gold">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="flex-1 text-sm font-semibold text-slate-200">{category}</span>
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

                <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {commandTiles.map((tile, index) => (
                        <CommandTileCard key={tile.title} tile={tile} index={index} />
                    ))}
                </section>

                <section id="zen-overview" className="scroll-mt-24 py-16 lg:py-20">
                    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                        <div>
                            <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                                Built Across Education, Automation, AI Agents, and Verified Digital Credentials
                            </h2>
                            <p className="mt-5 text-base leading-8 text-slate-300">
                                ZEN connects literacy, deployment, automation, and proof into one ecosystem - helping people learn AI, build with AI, automate real work, and verify what they have created.
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

                    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {ecosystemCategories.map((category, index) => (
                            <article key={category} className="rounded-[1.2rem] border border-white/10 bg-[#07101d]/75 p-5 backdrop-blur-xl transition duration-300 hover:border-zen-gold/20 hover:bg-white/[0.055]">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zen-gold/60">
                                    Layer {String(index + 1).padStart(2, '0')}
                                </p>
                                <h3 className="mt-3 text-lg font-black text-white">{category}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-400">
                                    Connected into the ZEN operating model for learning, deployment, automation, and verified proof.
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
