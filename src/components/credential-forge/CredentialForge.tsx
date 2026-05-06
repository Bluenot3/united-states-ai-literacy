import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    BadgeStyle,
    CredentialDesign,
    CredentialTheme,
    CredentialTier,
    MockAchievement,
    StampedAchievement,
    VerificationStatus,
    buildMintPayload,
    prepareCredentialMetadata,
    stampAchievementMock,
    verifyCredentialMock,
} from './credentialForgeMock';
import './CredentialForge.css';

const tiers: CredentialTier[] = ['Member', 'Builder', 'Operator', 'Architect', 'Founder', 'Partner'];
const themes: CredentialTheme[] = ['Aurora Glass', 'Obsidian Chrome', 'Solar Gold', 'Ultraviolet', 'Crystal Matrix'];
const badgeStyles: BadgeStyle[] = ['Prism Seal', 'Orbital Crest', 'Institutional Glyph', 'Signal Mark', 'Founders Sigil'];

const themeProfiles: Record<CredentialTheme, {
    architecture: string;
    substrate: string;
    signature: string;
    layoutClass: string;
}> = {
    'Aurora Glass': {
        architecture: 'liquid aurora lattice',
        substrate: 'translucent spectral glass',
        signature: 'soft polar foil',
        layoutClass: 'cf-layout-aurora',
    },
    'Obsidian Chrome': {
        architecture: 'black chrome security slab',
        substrate: 'brushed obsidian alloy',
        signature: 'monochrome mirror cut',
        layoutClass: 'cf-layout-obsidian',
    },
    'Solar Gold': {
        architecture: 'institutional sunburst seal',
        substrate: 'matte carbon and gold leaf',
        signature: 'radial proof halo',
        layoutClass: 'cf-layout-solar',
    },
    Ultraviolet: {
        architecture: 'ultraviolet signal spectrum',
        substrate: 'deep violet photonic film',
        signature: 'magnetic waveband',
        layoutClass: 'cf-layout-ultraviolet',
    },
    'Crystal Matrix': {
        architecture: 'crystalline proof mesh',
        substrate: 'frosted crystal matrix',
        signature: 'faceted prism core',
        layoutClass: 'cf-layout-crystal',
    },
};

const achievements: MockAchievement[] = [
    {
        id: 'orientation',
        label: 'Completed Orientation',
        description: 'Finished the entry sequence and credential readiness briefing.',
    },
    {
        id: 'first-project',
        label: 'Built First Project',
        description: 'Created the first applied AI artifact for review.',
    },
    {
        id: 'skill-module',
        label: 'Completed Skill Module',
        description: 'Completed a focused learning module with practice output.',
    },
    {
        id: 'published-final',
        label: 'Published Final Project',
        description: 'Prepared a final project artifact for public or portfolio review.',
    },
    {
        id: 'verified-credential',
        label: 'Earned Verified Credential',
        description: 'Simulated completion of the verified credential layer.',
    },
    {
        id: 'capstone',
        label: 'Completed Capstone',
        description: 'Completed the terminal applied build challenge.',
    },
];

const premiumPresets: CredentialDesign[] = [
    {
        participantName: 'Avery Stone',
        credentialTitle: 'AI Pioneer Builder Credential',
        cohort: 'Vanguard Cohort 03',
        tier: 'Builder',
        theme: 'Aurora Glass',
        holographicIntensity: 78,
        particleDensity: 58,
        badgeStyle: 'Prism Seal',
        chainLabel: 'ZEN Testnet Placeholder',
    },
    {
        participantName: 'Jordan Vale',
        credentialTitle: 'Automation Systems Operator',
        cohort: 'Operator Lab Alpha',
        tier: 'Operator',
        theme: 'Obsidian Chrome',
        holographicIntensity: 64,
        particleDensity: 42,
        badgeStyle: 'Institutional Glyph',
        chainLabel: 'Mock L2 Credential Layer',
    },
    {
        participantName: 'Mika Chen',
        credentialTitle: 'Future Workforce Architect',
        cohort: 'Architecture Studio 01',
        tier: 'Architect',
        theme: 'Crystal Matrix',
        holographicIntensity: 86,
        particleDensity: 72,
        badgeStyle: 'Orbital Crest',
        chainLabel: 'Proof Layer Sandbox',
    },
    {
        participantName: 'Noah Rivers',
        credentialTitle: 'ZEN Foundational Member',
        cohort: 'Founding Pathway',
        tier: 'Founder',
        theme: 'Solar Gold',
        holographicIntensity: 72,
        particleDensity: 38,
        badgeStyle: 'Founders Sigil',
        chainLabel: 'Credential Registry Mock',
    },
];

const defaultDesign = premiumPresets[0];

const statusOrder: VerificationStatus[] = ['pending', 'confirmed', 'anchored'];

const copyToClipboard = async (value: string) => {
    if (!navigator.clipboard) {
        throw new Error('Clipboard API is not available in this browser.');
    }

    await navigator.clipboard.writeText(value);
};

const getThemeClass = (theme: CredentialTheme) =>
    theme.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const shortHash = (value: string) => `${value.slice(0, 10)}...${value.slice(-8)}`;

const nextUnstampedAchievement = (stamped: StampedAchievement[]) =>
    achievements.find((achievement) => !stamped.some((item) => item.id === achievement.id)) ?? achievements[0];

const ParticleField: React.FC<{ density: number }> = ({ density }) => {
    const count = Math.max(14, Math.round(density / 3));

    return (
        <div className="cf-particles" aria-hidden="true">
            {Array.from({ length: count }).map((_, index) => (
                <span
                    key={index}
                    style={{
                        '--cf-particle-x': `${(index * 37) % 100}%`,
                        '--cf-particle-y': `${(index * 61) % 100}%`,
                        '--cf-particle-delay': `${(index % 9) * 0.28}s`,
                        '--cf-particle-size': `${2 + (index % 5)}px`,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};

const CredentialCard: React.FC<{
    design: CredentialDesign;
    stampedAchievements: StampedAchievement[];
    pulseKey: number;
}> = ({ design, stampedAchievements, pulseKey }) => {
    const latestStatus = stampedAchievements.length ? stampedAchievements[stampedAchievements.length - 1].status : 'pending';
    const themeClass = getThemeClass(design.theme);
    const themeProfile = themeProfiles[design.theme];
    const credentialSeed = `${design.participantName}-${design.credentialTitle}-${design.cohort}`;
    const credentialId = `ZEN-${design.tier.slice(0, 3).toUpperCase()}-${credentialSeed.length * 137}-${design.theme.length}F`;
    const cardStyle = {
        '--cf-holo': `${design.holographicIntensity}%`,
        '--cf-particles': design.particleDensity,
    } as React.CSSProperties;

    return (
        <section className={`cf-card-stage cf-theme-${themeClass}`} style={cardStyle} aria-label="Animated credential card preview">
            <ParticleField density={design.particleDensity} />
            <div className={`cf-credential-card ${themeProfile.layoutClass} ${pulseKey ? 'cf-card-pulse' : ''}`} key={pulseKey}>
                <div className="cf-card-substrate" />
                <div className="cf-card-architecture" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </div>
                <div className="cf-card-foil" />
                <div className="cf-card-grid" />
                <div className="cf-scanner" />
                <div className="cf-card-edge" />
                <div className="cf-security-thread" />
                <div className="cf-corner-index" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </div>

                <div className="cf-card-topline">
                    <span>Credential Forge</span>
                    <span>{design.chainLabel || 'Network Placeholder'}</span>
                </div>

                <div className="cf-card-main">
                    <div>
                        <p className="cf-micro-label">Holder</p>
                        <h2>{design.participantName || 'Participant Name'}</h2>
                        <p className="cf-card-title">{design.credentialTitle || 'Credential Title'}</p>
                    </div>

                    <div className="cf-badge-orbit" aria-label={`Badge style: ${design.badgeStyle}`}>
                        <div className="cf-badge-ring" />
                        <div className="cf-badge-core">{design.tier.slice(0, 1)}</div>
                        <span>{design.badgeStyle}</span>
                    </div>
                </div>

                <div className="cf-card-midline">
                    <div>
                        <p className="cf-micro-label">Cohort</p>
                        <strong>{design.cohort || 'Cohort Label'}</strong>
                    </div>
                    <div>
                        <p className="cf-micro-label">Tier</p>
                        <strong>{design.tier}</strong>
                    </div>
                    <div>
                        <p className="cf-micro-label">Credential ID</p>
                        <strong>{credentialId}</strong>
                    </div>
                </div>

                <div className="cf-theme-signature">
                    <span>{themeProfile.substrate}</span>
                    <span>{themeProfile.architecture}</span>
                    <span>{themeProfile.signature}</span>
                </div>

                <div className="cf-stamp-row" aria-label="Achievement stamp slots">
                    {achievements.slice(0, 6).map((achievement) => {
                        const stamped = stampedAchievements.find((item) => item.id === achievement.id);

                        return (
                            <div className={`cf-stamp-slot ${stamped ? 'is-stamped' : ''}`} key={achievement.id}>
                                <span>{stamped ? 'Stamped' : 'Open Slot'}</span>
                                <strong>{achievement.label.replace('Completed ', '').replace('Earned ', '')}</strong>
                            </div>
                        );
                    })}
                </div>

                <div className="cf-card-footer">
                    <span>Verification glow: {latestStatus}</span>
                    <span>Microtext: ZEN proof layer prototype only</span>
                </div>
            </div>
        </section>
    );
};

const CredentialForge: React.FC = () => {
    const [design, setDesign] = useState<CredentialDesign>(defaultDesign);
    const [stampedAchievements, setStampedAchievements] = useState<StampedAchievement[]>([]);
    const [selectedAchievementId, setSelectedAchievementId] = useState(achievements[0].id);
    const [pulseKey, setPulseKey] = useState(0);
    const [copyState, setCopyState] = useState<string>('Ready');
    const timersRef = useRef<number[]>([]);

    const metadata = useMemo(() => prepareCredentialMetadata(design, stampedAchievements), [design, stampedAchievements]);
    const mintPayload = useMemo(() => buildMintPayload(metadata), [metadata]);
    const metadataJson = useMemo(() => JSON.stringify(metadata, null, 2), [metadata]);
    const mintPayloadJson = useMemo(() => JSON.stringify(mintPayload, null, 2), [mintPayload]);

    useEffect(() => {
        return () => {
            timersRef.current.forEach((timer) => window.clearTimeout(timer));
        };
    }, []);

    const updateDesign = <Key extends keyof CredentialDesign>(key: Key, value: CredentialDesign[Key]) => {
        setDesign((current) => ({ ...current, [key]: value }));
    };

    const updateAchievementStatus = (id: string, status: VerificationStatus) => {
        setStampedAchievements((current) =>
            current.map((achievement) => (achievement.id === id ? verifyCredentialMock(achievement, status) : achievement))
        );
    };

    const stampAchievement = () => {
        const selectedAchievement =
            achievements.find((achievement) => achievement.id === selectedAchievementId) ?? nextUnstampedAchievement(stampedAchievements);
        const stamped = stampAchievementMock(selectedAchievement, `${design.participantName}:${design.credentialTitle}:${design.cohort}`);

        setStampedAchievements((current) => {
            const withoutExisting = current.filter((achievement) => achievement.id !== stamped.id);
            return [...withoutExisting, stamped];
        });
        setPulseKey((current) => current + 1);
        setCopyState('Achievement pending');

        const confirmedTimer = window.setTimeout(() => {
            updateAchievementStatus(stamped.id, 'confirmed');
            setCopyState('Achievement confirmed');
        }, 850);
        const anchoredTimer = window.setTimeout(() => {
            updateAchievementStatus(stamped.id, 'anchored');
            setCopyState('Achievement anchored');
        }, 1750);

        timersRef.current.push(confirmedTimer, anchoredTimer);
    };

    const resetDesign = () => {
        timersRef.current.forEach((timer) => window.clearTimeout(timer));
        timersRef.current = [];
        setDesign(defaultDesign);
        setStampedAchievements([]);
        setSelectedAchievementId(achievements[0].id);
        setPulseKey((current) => current + 1);
        setCopyState('Reset complete');
    };

    const randomizePremiumCard = () => {
        const preset = premiumPresets[Math.floor(Math.random() * premiumPresets.length)];
        setDesign({
            ...preset,
            holographicIntensity: 58 + Math.floor(Math.random() * 36),
            particleDensity: 28 + Math.floor(Math.random() * 62),
            theme: themes[Math.floor(Math.random() * themes.length)],
            badgeStyle: badgeStyles[Math.floor(Math.random() * badgeStyles.length)],
            tier: tiers[Math.floor(Math.random() * tiers.length)],
        });
        setPulseKey((current) => current + 1);
        setCopyState('Premium variant generated');
    };

    const handleCopy = async (label: string, value: string) => {
        try {
            await copyToClipboard(value);
            setCopyState(`${label} copied`);
        } catch (error) {
            setCopyState(error instanceof Error ? error.message : 'Copy failed');
        }
    };

    const latestAchievement = stampedAchievements.length ? stampedAchievements[stampedAchievements.length - 1] : undefined;

    return (
        <div className="credential-forge">
            <div className="cf-shell">
                <header className="cf-hero">
                    <div>
                        <p className="cf-system-label">Experimental Prototype</p>
                        <h1>Credential Forge</h1>
                        <p>
                            Design premium holographic credential cards, simulate achievement stamps, and inspect mock metadata without
                            connecting wallets, chains, databases, or production user records.
                        </p>
                    </div>
                    <div className="cf-hero-status" aria-label="Prototype safety status">
                        <span>No chain writes</span>
                        <span>No user data</span>
                        <span>No backend calls</span>
                    </div>
                </header>

                <main className="cf-workbench">
                    <aside className="cf-panel cf-controls" aria-label="Design controls">
                        <div className="cf-panel-heading">
                            <span>01</span>
                            <h2>Design Controls</h2>
                        </div>

                        <label className="cf-field">
                            <span>Participant name</span>
                            <input value={design.participantName} onChange={(event) => updateDesign('participantName', event.target.value)} />
                        </label>

                        <label className="cf-field">
                            <span>Credential title</span>
                            <input value={design.credentialTitle} onChange={(event) => updateDesign('credentialTitle', event.target.value)} />
                        </label>

                        <label className="cf-field">
                            <span>Cohort or group</span>
                            <input value={design.cohort} onChange={(event) => updateDesign('cohort', event.target.value)} />
                        </label>

                        <div className="cf-field-grid">
                            <label className="cf-field">
                                <span>Tier</span>
                                <select value={design.tier} onChange={(event) => updateDesign('tier', event.target.value as CredentialTier)}>
                                    {tiers.map((tier) => (
                                        <option key={tier} value={tier}>{tier}</option>
                                    ))}
                                </select>
                            </label>

                            <label className="cf-field">
                                <span>Badge style</span>
                                <select value={design.badgeStyle} onChange={(event) => updateDesign('badgeStyle', event.target.value as BadgeStyle)}>
                                    {badgeStyles.map((badgeStyle) => (
                                        <option key={badgeStyle} value={badgeStyle}>{badgeStyle}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <label className="cf-field">
                            <span>Theme</span>
                            <select value={design.theme} onChange={(event) => updateDesign('theme', event.target.value as CredentialTheme)}>
                                {themes.map((theme) => (
                                    <option key={theme} value={theme}>{theme}</option>
                                ))}
                            </select>
                        </label>

                        <div className="cf-theme-picker" aria-label="Premium theme presets">
                            {themes.map((theme) => {
                                const profile = themeProfiles[theme];
                                const isSelected = design.theme === theme;

                                return (
                                    <button
                                        className={`cf-theme-chip cf-theme-chip-${getThemeClass(theme)} ${isSelected ? 'is-selected' : ''}`}
                                        key={theme}
                                        type="button"
                                        onClick={() => updateDesign('theme', theme)}
                                    >
                                        <span />
                                        <strong>{theme}</strong>
                                        <em>{profile.signature}</em>
                                    </button>
                                );
                            })}
                        </div>

                        <label className="cf-field">
                            <span>Chain/network label placeholder</span>
                            <input value={design.chainLabel} onChange={(event) => updateDesign('chainLabel', event.target.value)} />
                        </label>

                        <label className="cf-slider">
                            <span>Holographic intensity</span>
                            <strong>{design.holographicIntensity}%</strong>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={design.holographicIntensity}
                                onChange={(event) => updateDesign('holographicIntensity', Number(event.target.value))}
                            />
                        </label>

                        <label className="cf-slider">
                            <span>Particle density</span>
                            <strong>{design.particleDensity}%</strong>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={design.particleDensity}
                                onChange={(event) => updateDesign('particleDensity', Number(event.target.value))}
                            />
                        </label>
                    </aside>

                    <CredentialCard design={design} stampedAchievements={stampedAchievements} pulseKey={pulseKey} />

                    <aside className="cf-panel cf-metadata" aria-label="Achievement stamps and mock metadata">
                        <div className="cf-panel-heading">
                            <span>02</span>
                            <h2>Stamps and Metadata</h2>
                        </div>

                        <label className="cf-field">
                            <span>Achievement to stamp</span>
                            <select value={selectedAchievementId} onChange={(event) => setSelectedAchievementId(event.target.value)}>
                                {achievements.map((achievement) => (
                                    <option key={achievement.id} value={achievement.id}>{achievement.label}</option>
                                ))}
                            </select>
                        </label>

                        <button className="cf-primary-action" type="button" onClick={stampAchievement}>
                            Stamp Achievement
                        </button>

                        <div className="cf-status-rail" aria-label="Mock verification status progression">
                            {statusOrder.map((status) => (
                                <div
                                    className={`cf-status-node ${latestAchievement?.status === status ? 'is-active' : ''} ${
                                        latestAchievement && statusOrder.indexOf(latestAchievement.status) >= statusOrder.indexOf(status) ? 'is-complete' : ''
                                    }`}
                                    key={status}
                                >
                                    <span />
                                    <strong>{status}</strong>
                                </div>
                            ))}
                        </div>

                        <div className="cf-achievement-list">
                            {stampedAchievements.length ? stampedAchievements.map((achievement) => (
                                <article className="cf-achievement" key={`${achievement.id}-${achievement.stamped_at}`}>
                                    <div>
                                        <strong>{achievement.label}</strong>
                                        <p>{achievement.description}</p>
                                    </div>
                                    <dl>
                                        <div>
                                            <dt>verify</dt>
                                            <dd>{shortHash(achievement.verification_hash)}</dd>
                                        </div>
                                        <div>
                                            <dt>tx</dt>
                                            <dd>{shortHash(achievement.transaction_hash)}</dd>
                                        </div>
                                    </dl>
                                </article>
                            )) : (
                                <div className="cf-empty-state">
                                    <strong>No stamps yet</strong>
                                    <span>Select an achievement and run the mock stamping sequence.</span>
                                </div>
                            )}
                        </div>

                        <div className="cf-json-block">
                            <div>
                                <span>Live mock credential JSON</span>
                                <strong>{metadata.achievements.length} stamps</strong>
                            </div>
                            <pre>{metadataJson}</pre>
                        </div>
                    </aside>
                </main>

                <section className="cf-export-panel" aria-label="Export and mock actions">
                    <div>
                        <span>Export console</span>
                        <strong>{copyState}</strong>
                    </div>
                    <div className="cf-export-actions">
                        <button type="button" onClick={() => handleCopy('Metadata JSON', metadataJson)}>Copy Metadata JSON</button>
                        <button type="button" onClick={() => handleCopy('Mint payload', mintPayloadJson)}>Copy Mint Payload</button>
                        <button type="button" onClick={resetDesign}>Reset Design</button>
                        <button type="button" onClick={randomizePremiumCard}>Randomize Premium Card</button>
                    </div>
                </section>

                <section className="cf-dev-note">
                    <h2>Developer Note</h2>
                    <p>
                        The mock functions are intentionally pure client-side utilities. Later, `prepareCredentialMetadata` can be backed
                        by durable storage, `generateCredentialHash` can be replaced with a canonical hashing service, `buildMintPayload`
                        can target a contract-safe payload schema, `stampAchievementMock` can consume verified completion events, and
                        `verifyCredentialMock` can read real indexer or attestation status. This prototype performs none of those writes.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default CredentialForge;
