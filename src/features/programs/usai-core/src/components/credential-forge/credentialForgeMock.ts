export type CredentialTier = 'Member' | 'Builder' | 'Operator' | 'Architect' | 'Founder' | 'Partner';

export type CredentialTheme = 'Aurora Glass' | 'Obsidian Chrome' | 'Solar Gold' | 'Ultraviolet' | 'Crystal Matrix';

export type BadgeStyle = 'Prism Seal' | 'Orbital Crest' | 'Institutional Glyph' | 'Signal Mark' | 'Founders Sigil';

export type VerificationStatus = 'pending' | 'confirmed' | 'anchored';

export type CredentialDesign = {
    participantName: string;
    credentialTitle: string;
    cohort: string;
    tier: CredentialTier;
    theme: CredentialTheme;
    holographicIntensity: number;
    particleDensity: number;
    badgeStyle: BadgeStyle;
    chainLabel: string;
};

export type MockAchievement = {
    id: string;
    label: string;
    description: string;
};

export type StampedAchievement = MockAchievement & {
    stamped_at: string;
    verification_hash: string;
    transaction_hash: string;
    status: VerificationStatus;
};

export type CredentialMetadata = {
    credential_id: string;
    holder_name: string;
    credential_title: string;
    cohort: string;
    tier: CredentialTier;
    visual_theme: CredentialTheme;
    achievements: Array<{
        id: string;
        label: string;
        stamped_at: string;
        verification_hash: string;
        transaction_hash: string;
        status: VerificationStatus;
    }>;
    issuer: string;
    chain: string;
    image_uri: string;
    metadata_uri: string;
    created_at: string;
    updated_at: string;
    version: string;
};

export type MintPayload = {
    action: 'mock_prepare_credential';
    dry_run: true;
    credential_id: string;
    recipient_placeholder: string;
    network_placeholder: string;
    metadata_uri: string;
    image_uri: string;
    credential_hash: string;
    achievements_count: number;
    issued_by: string;
    warning: string;
};

const MOCK_VERSION = 'credential-forge-prototype-v0.1';
const MOCK_ISSUER = 'ZEN Credential Forge Prototype Issuer';

const normalize = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 42);

const encodeSeed = (seed: string) => {
    let hash = 2166136261;

    for (let index = 0; index < seed.length; index += 1) {
        hash ^= seed.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0).toString(16).padStart(8, '0');
};

export function generateCredentialHash(seed: string, prefix = '0xZEN'): string {
    const now = Date.now().toString(36);
    const primary = encodeSeed(`${seed}:${now}:primary`);
    const secondary = encodeSeed(`${now}:${seed}:secondary`);

    return `${prefix}${primary}${secondary}${now}`.slice(0, 34);
}

export function prepareCredentialMetadata(
    design: CredentialDesign,
    achievements: StampedAchievement[],
    now = new Date().toISOString()
): CredentialMetadata {
    const identity = normalize(`${design.participantName}-${design.credentialTitle}-${design.cohort}`) || 'credential-holder';
    const credentialId = `zen-forge-${identity}-${encodeSeed(identity).slice(0, 6)}`;

    return {
        credential_id: credentialId,
        holder_name: design.participantName,
        credential_title: design.credentialTitle,
        cohort: design.cohort,
        tier: design.tier,
        visual_theme: design.theme,
        achievements: achievements.map((achievement) => ({
            id: achievement.id,
            label: achievement.label,
            stamped_at: achievement.stamped_at,
            verification_hash: achievement.verification_hash,
            transaction_hash: achievement.transaction_hash,
            status: achievement.status,
        })),
        issuer: MOCK_ISSUER,
        chain: design.chainLabel,
        image_uri: `mock://credential-forge/images/${credentialId}.png`,
        metadata_uri: `mock://credential-forge/metadata/${credentialId}.json`,
        created_at: achievements[0]?.stamped_at ?? now,
        updated_at: now,
        version: MOCK_VERSION,
    };
}

export function buildMintPayload(metadata: CredentialMetadata): MintPayload {
    return {
        action: 'mock_prepare_credential',
        dry_run: true,
        credential_id: metadata.credential_id,
        recipient_placeholder: 'wallet://future-holder-address',
        network_placeholder: metadata.chain,
        metadata_uri: metadata.metadata_uri,
        image_uri: metadata.image_uri,
        credential_hash: generateCredentialHash(JSON.stringify(metadata)),
        achievements_count: metadata.achievements.length,
        issued_by: metadata.issuer,
        warning: 'Prototype payload only. No wallet connection, contract write, database write, or real minting is performed.',
    };
}

export function stampAchievementMock(achievement: MockAchievement, seed: string): StampedAchievement {
    const stampedAt = new Date().toISOString();

    return {
        ...achievement,
        stamped_at: stampedAt,
        verification_hash: generateCredentialHash(`${seed}:${achievement.id}:verification`, '0xVERIFY'),
        transaction_hash: generateCredentialHash(`${seed}:${achievement.id}:transaction`, '0xMOCKTX'),
        status: 'pending',
    };
}

export function verifyCredentialMock(achievement: StampedAchievement, status: VerificationStatus): StampedAchievement {
    return {
        ...achievement,
        status,
    };
}
