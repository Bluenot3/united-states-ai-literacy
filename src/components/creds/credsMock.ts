export type CredentialTier = 'Member' | 'Builder' | 'Operator' | 'Architect' | 'Founder' | 'Partner';

export type CredentialTheme = 'Aurora Glass' | 'Obsidian Chrome' | 'Solar Gold' | 'Ultraviolet' | 'Crystal Matrix';

export type BadgeStyle = 'Prism Seal' | 'Orbital Crest' | 'Institutional Glyph' | 'Signal Mark' | 'Founders Sigil';

export type ProofStandard = 'W3C VC' | 'Open Badges 3.0' | 'EAS' | 'Custom Registry';

export type VerificationStatus = 'prepared' | 'attestation-ready' | 'anchored';

export type CredentialDesign = {
    participantName: string;
    credentialTitle: string;
    cohort: string;
    tier: CredentialTier;
    theme: CredentialTheme;
    holographicIntensity: number;
    particleDensity: number;
    badgeStyle: BadgeStyle;
    networkLabel: string;
    issuerLabel: string;
    proofStandard: ProofStandard;
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
    proof_standard: ProofStandard;
    issuer: string;
    network: string;
    registry_mode: 'dry-run';
    achievements: Array<{
        id: string;
        label: string;
        stamped_at: string;
        verification_hash: string;
        transaction_hash: string;
        status: VerificationStatus;
    }>;
    image_uri: string;
    metadata_uri: string;
    created_at: string;
    updated_at: string;
    version: string;
};

export type MintPayload = {
    action: 'prepare_attestation_payload';
    dry_run: true;
    credential_id: string;
    recipient_address_placeholder: string;
    issuer_address_placeholder: string;
    network: string;
    proof_standard: ProofStandard;
    metadata_uri: string;
    image_uri: string;
    credential_hash: string;
    schema_ref_placeholder: string;
    resolver_ref_placeholder: string;
    revocation_ref_placeholder: string;
    achievements_count: number;
    issued_by: string;
    warning: string;
};

const MOCK_VERSION = 'creds-dry-run-v0.2';
const DEFAULT_ISSUER = 'ZEN CREDS Dry-Run Issuer';

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

export function generateCredentialHash(seed: string, prefix = '0xCRD'): string {
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
    const credentialId = `zen-creds-${identity}-${encodeSeed(identity).slice(0, 6)}`;

    return {
        credential_id: credentialId,
        holder_name: design.participantName,
        credential_title: design.credentialTitle,
        cohort: design.cohort,
        tier: design.tier,
        visual_theme: design.theme,
        proof_standard: design.proofStandard,
        issuer: design.issuerLabel || DEFAULT_ISSUER,
        network: design.networkLabel,
        registry_mode: 'dry-run',
        achievements: achievements.map((achievement) => ({
            id: achievement.id,
            label: achievement.label,
            stamped_at: achievement.stamped_at,
            verification_hash: achievement.verification_hash,
            transaction_hash: achievement.transaction_hash,
            status: achievement.status,
        })),
        image_uri: `mock://creds/images/${credentialId}.png`,
        metadata_uri: `mock://creds/metadata/${credentialId}.json`,
        created_at: achievements[0]?.stamped_at ?? now,
        updated_at: now,
        version: MOCK_VERSION,
    };
}

export function buildMintPayload(metadata: CredentialMetadata): MintPayload {
    return {
        action: 'prepare_attestation_payload',
        dry_run: true,
        credential_id: metadata.credential_id,
        recipient_address_placeholder: 'wallet://future-holder-address',
        issuer_address_placeholder: 'wallet://future-issuer-address',
        network: metadata.network,
        proof_standard: metadata.proof_standard,
        metadata_uri: metadata.metadata_uri,
        image_uri: metadata.image_uri,
        credential_hash: generateCredentialHash(JSON.stringify(metadata)),
        schema_ref_placeholder: 'schema://future-attestation-schema',
        resolver_ref_placeholder: 'resolver://future-proof-resolver',
        revocation_ref_placeholder: 'revocation://future-registry-path',
        achievements_count: metadata.achievements.length,
        issued_by: metadata.issuer,
        warning: 'Dry-run payload only. No wallet signature, chain write, attestation registry write, database write, or real issuance is performed.',
    };
}

export function stampAchievementMock(achievement: MockAchievement, seed: string): StampedAchievement {
    const stampedAt = new Date().toISOString();

    return {
        ...achievement,
        stamped_at: stampedAt,
        verification_hash: generateCredentialHash(`${seed}:${achievement.id}:verification`, '0xPROOF'),
        transaction_hash: generateCredentialHash(`${seed}:${achievement.id}:transaction`, '0xDRYRUN'),
        status: 'prepared',
    };
}

export function verifyCredentialMock(achievement: StampedAchievement, status: VerificationStatus): StampedAchievement {
    return {
        ...achievement,
        status,
    };
}
