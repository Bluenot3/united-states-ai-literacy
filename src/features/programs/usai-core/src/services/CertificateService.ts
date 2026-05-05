import type { Certificate } from '../types';

// Simple SHA-256 hash implementation using Web Crypto API
async function sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Simulated blockchain for certificate verification
const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';
let currentBlockNumber = 0;
let previousHash = GENESIS_HASH;

// Store certificates in localStorage for verification
const CERTIFICATES_STORAGE_KEY = 'zenVanguardCertificates';

function getCertificatesFromStorage(): Certificate[] {
    try {
        const stored = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
        if (stored) {
            const certs = JSON.parse(stored);
            if (certs.length > 0) {
                const lastCert = certs[certs.length - 1];
                currentBlockNumber = lastCert.blockNumber;
                previousHash = lastCert.sha256Hash;
            }
            return certs;
        }
    } catch (error) {
        console.error('Failed to load certificates:', error);
    }
    return [];
}

function saveCertificatesToStorage(certificates: Certificate[]) {
    localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(certificates));
}

export async function generateModuleCertificate(
    moduleNumber: 1 | 2 | 3 | 4,
    userName: string,
    userEmail: string,
    sectionsCompleted: number,
    totalSections: number,
    interactivesCompleted: number,
    pointsEarned: number
): Promise<Certificate> {
    const issuedAt = new Date().toISOString();
    const certId = `ZV-M${moduleNumber}-${userEmail.slice(0, 4).toUpperCase()}${Date.now().toString(36).toUpperCase()}`;

    const completionPercentage = Math.round((sectionsCompleted / totalSections) * 100);

    // Build the data string for hashing
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

    // Update block chain state
    const certificates = getCertificatesFromStorage();
    currentBlockNumber++;

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
    };

    // Store certificate
    certificates.push(certificate);
    saveCertificatesToStorage(certificates);

    // Update previous hash for next certificate
    previousHash = sha256Hash;

    return certificate;
}

export async function generateFinalCertification(
    userName: string,
    userEmail: string,
    moduleCertificates: Certificate[]
): Promise<Certificate> {
    const issuedAt = new Date().toISOString();
    const certId = `ZV-FINAL-${userEmail.slice(0, 4).toUpperCase()}${Date.now().toString(36).toUpperCase()}`;

    // Calculate total performance across all modules
    const totalSectionsCompleted = moduleCertificates.reduce(
        (sum, cert) => sum + cert.performance.sectionsCompleted, 0
    );
    const totalSections = moduleCertificates.reduce(
        (sum, cert) => sum + cert.performance.totalSections, 0
    );
    const totalInteractives = moduleCertificates.reduce(
        (sum, cert) => sum + cert.performance.interactivesCompleted, 0
    );
    const totalPoints = moduleCertificates.reduce(
        (sum, cert) => sum + cert.performance.pointsEarned, 0
    );

    const completionPercentage = Math.round((totalSectionsCompleted / totalSections) * 100);

    // Include all module certificate hashes in final hash
    const dataToHash = JSON.stringify({
        id: certId,
        type: 'final',
        userName,
        userEmail,
        issuedAt,
        moduleCertificateHashes: moduleCertificates.map(c => c.sha256Hash),
        totalSectionsCompleted,
        totalSections,
        totalInteractives,
        totalPoints,
        completionPercentage,
        previousHash,
    });

    const sha256Hash = await sha256(dataToHash);

    const certificates = getCertificatesFromStorage();
    currentBlockNumber++;

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
    };

    certificates.push(certificate);
    saveCertificatesToStorage(certificates);
    previousHash = sha256Hash;

    return certificate;
}

export async function verifyCertificate(certId: string): Promise<{
    valid: boolean;
    certificate?: Certificate;
    errorMessage?: string;
}> {
    const certificates = getCertificatesFromStorage();
    const certificate = certificates.find(c => c.id === certId);

    if (!certificate) {
        return {
            valid: false,
            errorMessage: 'Certificate not found.',
        };
    }

    // Verify hash chain integrity
    const certIndex = certificates.findIndex(c => c.id === certId);

    if (certIndex > 0) {
        const prevCert = certificates[certIndex - 1];
        if (certificate.previousHash !== prevCert.sha256Hash) {
            return {
                valid: false,
                certificate,
                errorMessage: 'Hash chain integrity check failed.',
            };
        }
    } else if (certificate.previousHash !== GENESIS_HASH) {
        return {
            valid: false,
            certificate,
            errorMessage: 'Genesis hash mismatch.',
        };
    }

    return {
        valid: true,
        certificate,
    };
}

export function getAllCertificates(): Certificate[] {
    return getCertificatesFromStorage();
}

export function getCertificatesByUser(userEmail: string): Certificate[] {
    return getCertificatesFromStorage().filter(c => c.userEmail === userEmail);
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
