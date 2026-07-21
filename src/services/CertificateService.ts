import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/supabaseConfig';
import type { Certificate } from '../types';

async function sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

const GENESIS_HASH = '0'.repeat(64);
const CERTIFICATES_STORAGE_KEY = 'zenVanguardCertificates';
const CERTIFICATE_CACHE_KEY = 'zenVanguardCertificateVerificationCache';
const EXPLICIT_DEMO_LOGIN_ENABLED = import.meta.env.VITE_ENABLE_DEMO_LOGIN === 'true';

let currentBlockNumber = 0;
let previousHash = GENESIS_HASH;

type CertificateRpcRow = {
    id: string;
    certificate_type: 'module' | 'final';
    module_number: 1 | 2 | 3 | 4 | null;
    display_name: string;
    issued_at: string;
    sections_completed: number;
    total_sections: number;
    interactives_completed: number;
    points_earned: number;
    completion_percentage: number;
    fingerprint_sha256: string;
    verification_version: number;
};

function toCertificate(row: CertificateRpcRow, source: Certificate['verificationSource']): Certificate {
    return {
        id: row.id,
        type: row.certificate_type,
        moduleNumber: row.module_number ?? undefined,
        userName: row.display_name,
        issuedAt: row.issued_at,
        performance: {
            sectionsCompleted: row.sections_completed,
            totalSections: row.total_sections,
            interactivesCompleted: row.interactives_completed,
            pointsEarned: row.points_earned,
            completionPercentage: row.completion_percentage,
        },
        sha256Hash: row.fingerprint_sha256,
        verificationSource: source,
        verificationVersion: row.verification_version,
    };
}

function readStoredCertificates(key: string): Certificate[] {
    if (typeof window === 'undefined') return [];

    try {
        const parsed = JSON.parse(window.localStorage.getItem(key) || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.warn('Failed to load locally stored certificate records.', error);
        return [];
    }
}

function writeStoredCertificates(key: string, certificates: Certificate[]) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(certificates));
}

function getCertificatesFromStorage(): Certificate[] {
    const certificates = readStoredCertificates(CERTIFICATES_STORAGE_KEY);
    const lastLocalCertificate = [...certificates].reverse().find((certificate) => (
        typeof certificate.blockNumber === 'number' && certificate.previousHash
    ));

    if (lastLocalCertificate) {
        currentBlockNumber = lastLocalCertificate.blockNumber ?? 0;
        previousHash = lastLocalCertificate.sha256Hash;
    }

    return certificates;
}

function cacheSupabaseCertificate(certificate: Certificate) {
    const certificates = readStoredCertificates(CERTIFICATE_CACHE_KEY);
    const withoutCurrent = certificates.filter((item) => item.id !== certificate.id);
    writeStoredCertificates(CERTIFICATE_CACHE_KEY, [
        ...withoutCurrent,
        { ...certificate, verificationSource: 'supabase-cache', userEmail: undefined },
    ]);
}

function getCachedCertificate(certId: string): Certificate | undefined {
    return readStoredCertificates(CERTIFICATE_CACHE_KEY)
        .find((certificate) => certificate.id === certId);
}

function isNetworkFailure(error: unknown): boolean {
    const message = error instanceof Error
        ? error.message
        : typeof error === 'object' && error && 'message' in error
            ? String(error.message)
            : String(error);

    return /failed to fetch|fetch failed|networkerror|network request|load failed|timeout/i.test(message);
}

function generateLocalModuleCertificate(
    moduleNumber: 1 | 2 | 3 | 4,
    userName: string,
    userEmail: string,
    sectionsCompleted: number,
    totalSections: number,
    interactivesCompleted: number,
    pointsEarned: number,
): Promise<Certificate> {
    return (async () => {
        const issuedAt = new Date().toISOString();
        const certId = `ZV-M${moduleNumber}-LOCAL-${Date.now().toString(36).toUpperCase()}`;
        const completionPercentage = Math.round((sectionsCompleted / totalSections) * 100);
        const dataToHash = JSON.stringify({
            id: certId,
            type: 'module',
            moduleNumber,
            userName,
            userEmail,
            issuedAt,
            sectionsCompleted,
            totalSections,
            interactivesCompleted,
            pointsEarned,
            completionPercentage,
            previousHash,
        });
        const sha256Hash = await sha256(dataToHash);
        const certificates = getCertificatesFromStorage();
        currentBlockNumber += 1;

        const certificate: Certificate = {
            id: certId,
            type: 'module',
            moduleNumber,
            userName,
            userEmail,
            issuedAt,
            performance: {
                sectionsCompleted,
                totalSections,
                interactivesCompleted,
                pointsEarned,
                completionPercentage,
            },
            sha256Hash,
            blockNumber: currentBlockNumber,
            previousHash,
            verificationSource: 'local',
        };

        writeStoredCertificates(CERTIFICATES_STORAGE_KEY, [...certificates, certificate]);
        previousHash = sha256Hash;
        return certificate;
    })();
}

export async function generateModuleCertificate(
    moduleNumber: 1 | 2 | 3 | 4,
    userName: string,
    userEmail: string,
    sectionsCompleted: number,
    totalSections: number,
    interactivesCompleted: number,
    pointsEarned: number,
): Promise<Certificate> {
    if (!isSupabaseConfigured) {
        return generateLocalModuleCertificate(
            moduleNumber,
            userName,
            userEmail,
            sectionsCompleted,
            totalSections,
            interactivesCompleted,
            pointsEarned,
        );
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
        if (EXPLICIT_DEMO_LOGIN_ENABLED) {
            return generateLocalModuleCertificate(
                moduleNumber,
                userName,
                userEmail,
                sectionsCompleted,
                totalSections,
                interactivesCompleted,
                pointsEarned,
            );
        }
        throw new Error('Sign in before claiming a certificate.');
    }

    const { data, error } = await supabase.rpc('issue_vanguard_module_certificate', {
        p_module_number: moduleNumber,
        p_display_name: userName,
    });

    if (error) {
        if (EXPLICIT_DEMO_LOGIN_ENABLED && isNetworkFailure(error)) {
            return generateLocalModuleCertificate(
                moduleNumber,
                userName,
                userEmail,
                sectionsCompleted,
                totalSections,
                interactivesCompleted,
                pointsEarned,
            );
        }
        throw error;
    }

    const row = (Array.isArray(data) ? data[0] : data) as CertificateRpcRow | undefined;
    if (!row) throw new Error('Certificate issuance returned no record.');

    const certificate = toCertificate(row, 'supabase');
    cacheSupabaseCertificate(certificate);
    return certificate;
}

async function generateLocalFinalCertification(
    userName: string,
    userEmail: string,
    moduleCertificates: Certificate[],
): Promise<Certificate> {
    const issuedAt = new Date().toISOString();
    const certId = `ZV-FINAL-LOCAL-${Date.now().toString(36).toUpperCase()}`;
    const totalSectionsCompleted = moduleCertificates.reduce(
        (sum, certificate) => sum + certificate.performance.sectionsCompleted,
        0,
    );
    const totalSections = moduleCertificates.reduce(
        (sum, certificate) => sum + certificate.performance.totalSections,
        0,
    );
    const totalInteractives = moduleCertificates.reduce(
        (sum, certificate) => sum + certificate.performance.interactivesCompleted,
        0,
    );
    const totalPoints = moduleCertificates.reduce(
        (sum, certificate) => sum + certificate.performance.pointsEarned,
        0,
    );
    const completionPercentage = Math.round((totalSectionsCompleted / totalSections) * 100);
    const dataToHash = JSON.stringify({
        id: certId,
        type: 'final',
        userName,
        userEmail,
        issuedAt,
        moduleCertificateHashes: moduleCertificates.map((certificate) => certificate.sha256Hash),
        totalSectionsCompleted,
        totalSections,
        totalInteractives,
        totalPoints,
        completionPercentage,
        previousHash,
    });
    const sha256Hash = await sha256(dataToHash);
    const certificates = getCertificatesFromStorage();
    currentBlockNumber += 1;

    const certificate: Certificate = {
        id: certId,
        type: 'final',
        userName,
        userEmail,
        issuedAt,
        performance: {
            sectionsCompleted: totalSectionsCompleted,
            totalSections,
            interactivesCompleted: totalInteractives,
            pointsEarned: totalPoints,
            completionPercentage,
        },
        sha256Hash,
        blockNumber: currentBlockNumber,
        previousHash,
        verificationSource: 'local',
    };

    writeStoredCertificates(CERTIFICATES_STORAGE_KEY, [...certificates, certificate]);
    previousHash = sha256Hash;
    return certificate;
}

export async function generateFinalCertification(
    userName: string,
    userEmail: string,
    moduleCertificates: Certificate[],
): Promise<Certificate> {
    if (!isSupabaseConfigured || EXPLICIT_DEMO_LOGIN_ENABLED) {
        return generateLocalFinalCertification(userName, userEmail, moduleCertificates);
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
        throw new Error('Sign in before claiming the final certificate.');
    }

    const { data, error } = await supabase.rpc('issue_vanguard_final_certificate', {
        p_display_name: userName,
    });

    // Final credentials must never silently downgrade to a device-local record
    // during an ordinary network or backend failure.
    if (error) throw error;

    const row = (Array.isArray(data) ? data[0] : data) as CertificateRpcRow | undefined;
    if (!row) throw new Error('Final certificate issuance returned no record.');

    const certificate = toCertificate(row, 'supabase');
    cacheSupabaseCertificate(certificate);
    return certificate;
}

function verifyLocalCertificate(certId: string): {
    valid: boolean;
    certificate?: Certificate;
    errorMessage?: string;
} {
    const certificates = getCertificatesFromStorage();
    const certificate = certificates.find((item) => item.id === certId);

    if (!certificate) return { valid: false, errorMessage: 'Certificate not found.' };

    const certIndex = certificates.findIndex((item) => item.id === certId);
    if (certIndex > 0) {
        const priorCertificate = certificates[certIndex - 1];
        if (certificate.previousHash !== priorCertificate.sha256Hash) {
            return {
                valid: false,
                certificate: { ...certificate, verificationSource: 'local' },
                errorMessage: 'The device-local record chain does not match.',
            };
        }
    } else if (certificate.previousHash !== GENESIS_HASH) {
        return {
            valid: false,
            certificate: { ...certificate, verificationSource: 'local' },
            errorMessage: 'The device-local record is incomplete.',
        };
    }

    return { valid: true, certificate: { ...certificate, verificationSource: 'local' } };
}

export async function verifyCertificate(certId: string): Promise<{
    valid: boolean;
    certificate?: Certificate;
    errorMessage?: string;
}> {
    if (isSupabaseConfigured) {
        const { data, error } = await supabase.rpc('verify_program_certificate', {
            p_certificate_id: certId,
        });

        if (!error) {
            const row = (Array.isArray(data) ? data[0] : data) as CertificateRpcRow | undefined;
            if (row) {
                const certificate = toCertificate(row, 'supabase');
                cacheSupabaseCertificate(certificate);
                return { valid: true, certificate };
            }
        } else if (!isNetworkFailure(error)) {
            console.warn('Supabase certificate verification failed.', error);
        }

        const cached = getCachedCertificate(certId);
        if (cached && error && isNetworkFailure(error)) {
            return {
                valid: false,
                certificate: { ...cached, verificationSource: 'supabase-cache' },
                errorMessage: 'Live verification is unavailable. This cached display is not proof of validity.',
            };
        }
    }

    return verifyLocalCertificate(certId);
}

export function getAllCertificates(): Certificate[] {
    const combined = [
        ...getCertificatesFromStorage(),
        ...readStoredCertificates(CERTIFICATE_CACHE_KEY),
    ];
    return [...new Map(combined.map((certificate) => [certificate.id, certificate])).values()];
}

export function getCertificatesByUser(userEmail: string): Certificate[] {
    return getCertificatesFromStorage().filter((certificate) => certificate.userEmail === userEmail);
}

export function formatCertificateDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function truncateHash(hash: string, length: number = 8): string {
    return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}
