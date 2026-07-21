import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    formatCertificateDate,
    truncateHash,
    verifyCertificate,
} from '../services/CertificateService';
import type { Certificate } from '../types';

declare const html2canvas: any;
declare const jspdf: any;

const CertificatePage: React.FC = () => {
    const { certId } = useParams<{ certId: string }>();
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const verify = async () => {
            if (!certId) {
                setErrorMessage('Certificate ID is missing.');
                setIsValid(false);
                setLoading(false);
                return;
            }

            const result = await verifyCertificate(certId);
            if (cancelled) return;

            setIsValid(result.valid);
            setCertificate(result.certificate || null);
            setErrorMessage(result.errorMessage || '');
            setLoading(false);
        };

        void verify();
        return () => { cancelled = true; };
    }, [certId]);

    const handleDownload = async (format: 'jpg' | 'pdf') => {
        const element = document.getElementById('certificate-display');
        if (!element) return;

        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: null,
            useCORS: true,
        });

        if (format === 'jpg') {
            const link = document.createElement('a');
            link.download = `ZEN_Vanguard_Certificate_${certId}.jpg`;
            link.href = canvas.toDataURL('image/jpeg', 0.95);
            link.click();
            return;
        }

        const { jsPDF } = jspdf;
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`ZEN_Vanguard_Certificate_${certId}.pdf`);
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-primary/20 border-t-brand-primary" />
                    <p className="text-brand-text-light">Verifying certificate...</p>
                </div>
            </div>
        );
    }

    if (!certificate) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <span className="mb-4 text-6xl" aria-hidden="true">×</span>
                <h2 className="mb-2 text-2xl font-bold text-brand-text">Certificate Not Found</h2>
                <p className="mb-6 text-brand-text-light">{errorMessage || 'This certificate does not exist.'}</p>
                <Link to="/dashboard" className="btn-primary">Return to Dashboard</Link>
            </div>
        );
    }

    const isPubliclyVerified = isValid && certificate.verificationSource === 'supabase';
    const isCachedSupabaseRecord = isValid && certificate.verificationSource === 'supabase-cache';
    const verificationTitle = isPubliclyVerified
        ? 'Certificate Verified'
        : isCachedSupabaseRecord
            ? 'Previously Verified Record'
            : isValid
                ? 'Device-Local Certificate'
                : 'Verification Failed';
    const verificationCopy = isPubliclyVerified
        ? 'This immutable certificate record was issued by ZEN and retrieved from Supabase.'
        : isCachedSupabaseRecord
            ? 'Supabase is temporarily unavailable. This is the last verified record cached on this device.'
            : isValid
                ? 'This legacy fallback record exists only on this device and is not publicly verified.'
                : errorMessage;
    const publicCertificateDetails = {
        certificateId: certificate.id,
        program: 'ZEN Vanguard',
        type: certificate.type,
        moduleNumber: certificate.moduleNumber,
        learnerName: certificate.userName,
        issuedAt: certificate.issuedAt,
        performance: certificate.performance,
        fingerprintSha256: certificate.sha256Hash,
        verificationSource: certificate.verificationSource,
        verificationVersion: certificate.verificationVersion,
    };

    return (
        <main className="mx-auto max-w-5xl animate-fade-in px-4 py-8">
            <div className={`mb-6 flex items-center gap-3 rounded-xl border p-4 ${isValid
                ? 'border-pale-green/30 bg-pale-green/10'
                : 'border-red-300 bg-red-100'
            }`}>
                <span className="text-2xl" aria-hidden="true">{isValid ? '✓' : '!'}</span>
                <div>
                    <p className={`font-semibold ${isValid ? 'text-pale-green' : 'text-red-600'}`}>
                        {verificationTitle}
                    </p>
                    <p className="text-sm text-brand-text-light">{verificationCopy}</p>
                </div>
            </div>

            <div id="certificate-display" className="glass-card relative aspect-[16/9] overflow-hidden p-8">
                <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-brand-primary/10 blur-3xl" />
                <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-pale-yellow/10 blur-3xl" />
                <div
                    className="bg-grid-pattern absolute inset-0 opacity-5"
                    style={{ '--grid-color': 'rgba(124, 58, 237, 0.2)', '--grid-size': '30px' } as React.CSSProperties}
                />

                <div className="relative z-10 flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-brand-primary">ZEN VANGUARD</h2>
                            <p className="font-semibold text-brand-text-light">
                                {certificate.type === 'final'
                                    ? 'AI Literacy Certification'
                                    : `Module ${certificate.moduleNumber} Certificate`}
                            </p>
                        </div>
                        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-xl border border-brand-primary/25 bg-brand-primary/10 text-center shadow-soft-lg" aria-label="ZEN verified credential">
                            <span className="text-xl font-black text-brand-primary">ZEN</span>
                            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-brand-text-light">Verified</span>
                        </div>
                    </div>

                    <div className="my-8 text-center">
                        <p className="mb-2 text-brand-text-light">This certification is hereby granted to</p>
                        <h1 className="mb-2 text-5xl font-extrabold tracking-tight text-brand-text">
                            {certificate.userName}
                        </h1>
                        <p className="mx-auto max-w-xl text-brand-text-light">
                            for successfully completing {certificate.type === 'final'
                                ? 'the complete ZEN Vanguard AI Professionals Program'
                                : `Module ${certificate.moduleNumber} of the ZEN Vanguard curriculum`}
                        </p>
                    </div>

                    <div className="mb-4 flex justify-center gap-8">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-pale-green">{certificate.performance.completionPercentage}%</p>
                            <p className="text-xs text-brand-text-light">Completion</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-brand-primary">{certificate.performance.sectionsCompleted}</p>
                            <p className="text-xs text-brand-text-light">Sections</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-pale-yellow">{certificate.performance.pointsEarned}</p>
                            <p className="text-xs text-brand-text-light">Points</p>
                        </div>
                    </div>

                    <div className="flex items-end justify-between font-mono text-xs text-brand-text-light/70">
                        <div>
                            <p>// CERT_ID: {certificate.id}</p>
                            <p>// ISSUED: {formatCertificateDate(certificate.issuedAt)}</p>
                            {typeof certificate.blockNumber === 'number' && (
                                <p>// LOCAL_SEQUENCE: #{certificate.blockNumber}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <p>SHA-256: {truncateHash(certificate.sha256Hash, 12)}</p>
                            {certificate.previousHash && (
                                <p>PREV_HASH: {truncateHash(certificate.previousHash, 8)}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button onClick={() => handleDownload('jpg')} className="btn-secondary">Download JPG</button>
                <button onClick={() => handleDownload('pdf')} className="btn-secondary">Download PDF</button>
                <Link to="/dashboard" className="btn-primary">Return to Dashboard</Link>
            </div>

            <details className="card-neumorphic mt-8">
                <summary className="flex cursor-pointer items-center gap-2 font-semibold text-brand-text">
                    View Verification Details
                </summary>
                <div className="mt-4 overflow-x-auto rounded-lg bg-gray-900 p-4 font-mono text-xs text-green-400">
                    <pre>{JSON.stringify(publicCertificateDetails, null, 2)}</pre>
                </div>
            </details>
        </main>
    );
};

export default CertificatePage;
