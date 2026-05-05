import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyCertificate, formatCertificateDate, truncateHash } from '../services/CertificateService';
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
        const verify = async () => {
            if (!certId) return;

            const result = await verifyCertificate(certId);
            setIsValid(result.valid);
            setCertificate(result.certificate || null);
            setErrorMessage(result.errorMessage || '');
            setLoading(false);
        };

        verify();
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
        } else {
            const { jsPDF } = jspdf;
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height],
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`ZEN_Vanguard_Certificate_${certId}.pdf`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                    <p className="text-brand-text-light">Verifying certificate...</p>
                </div>
            </div>
        );
    }

    if (!certificate) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <span className="text-6xl mb-4">❌</span>
                <h2 className="text-2xl font-bold text-brand-text mb-2">Certificate Not Found</h2>
                <p className="text-brand-text-light mb-6">{errorMessage || 'This certificate does not exist.'}</p>
                <Link to="/dashboard" className="btn-primary">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            {/* Verification Status */}
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${isValid ? 'bg-pale-green/10 border border-pale-green/30' : 'bg-red-100 border border-red-300'
                }`}>
                <span className="text-2xl">{isValid ? '✅' : '⚠️'}</span>
                <div>
                    <p className={`font-semibold ${isValid ? 'text-pale-green' : 'text-red-600'}`}>
                        {isValid ? 'Certificate Verified' : 'Verification Failed'}
                    </p>
                    <p className="text-sm text-brand-text-light">
                        {isValid
                            ? 'This certificate is authentic and has been verified on the blockchain.'
                            : errorMessage}
                    </p>
                </div>
            </div>

            {/* Certificate Display */}
            <div
                id="certificate-display"
                className="glass-card p-8 aspect-[16/9] relative overflow-hidden"
            >
                {/* Background decorations */}
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-brand-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pale-yellow/10 rounded-full blur-3xl" />
                <div
                    className="absolute inset-0 bg-grid-pattern opacity-5"
                    style={{ '--grid-color': 'rgba(124, 58, 237, 0.2)', '--grid-size': '30px' } as React.CSSProperties}
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-brand-primary tracking-tight">ZEN VANGUARD</h2>
                            <p className="font-semibold text-brand-text-light">
                                {certificate.type === 'final' ? 'AI Literacy Certification' : `Module ${certificate.moduleNumber} Certificate`}
                            </p>
                        </div>
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${certificate.id}`}
                            alt="Certificate QR Code"
                            className="w-20 h-20 bg-white p-1 rounded-md shadow-soft-lg"
                        />
                    </div>

                    {/* Main Content */}
                    <div className="text-center my-8">
                        <p className="text-brand-text-light mb-2">This certification is hereby granted to</p>
                        <h1 className="text-5xl font-extrabold text-brand-text tracking-tight mb-2">
                            {certificate.userName}
                        </h1>
                        <p className="text-brand-text-light max-w-xl mx-auto">
                            for successfully completing {certificate.type === 'final'
                                ? 'the complete ZEN Vanguard AI Professionals Program'
                                : `Module ${certificate.moduleNumber} of the ZEN Vanguard curriculum`}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 mb-4">
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

                    {/* Footer */}
                    <div className="flex justify-between items-end text-xs font-mono text-brand-text-light/70">
                        <div>
                            <p>// CERT_ID: {certificate.id}</p>
                            <p>// ISSUED: {formatCertificateDate(certificate.issuedAt)}</p>
                            <p>// BLOCK: #{certificate.blockNumber}</p>
                        </div>
                        <div className="text-right">
                            <p>SHA-256: {truncateHash(certificate.sha256Hash, 12)}</p>
                            <p>PREV_HASH: {truncateHash(certificate.previousHash, 8)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Download Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={() => handleDownload('jpg')}
                    className="btn-secondary flex items-center gap-2"
                >
                    <span>📷</span> Download JPG
                </button>
                <button
                    onClick={() => handleDownload('pdf')}
                    className="btn-secondary flex items-center gap-2"
                >
                    <span>📄</span> Download PDF
                </button>
                <Link to="/dashboard" className="btn-primary">
                    Return to Dashboard
                </Link>
            </div>

            {/* Technical Details */}
            <details className="mt-8 card-neumorphic">
                <summary className="cursor-pointer font-semibold text-brand-text flex items-center gap-2">
                    <span>🔐</span> View Blockchain Verification Details
                </summary>
                <div className="mt-4 p-4 bg-gray-900 rounded-lg text-xs font-mono text-green-400 overflow-x-auto">
                    <pre>{JSON.stringify(certificate, null, 2)}</pre>
                </div>
            </details>
        </div>
    );
};

export default CertificatePage;
