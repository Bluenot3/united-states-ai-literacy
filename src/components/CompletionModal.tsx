import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { generateModuleCertificate } from '../services/CertificateService';

declare const html2canvas: any;
declare const jspdf: any;

interface CompletionModalProps {
    moduleId: 1 | 2 | 3 | 4;
    moduleName: string;
    onClose: () => void;
}

const launchConfetti = () => {
    const confettiCount = 100;
    const container = document.body;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      z-index: 9999;
      pointer-events: none;
    `;
        container.appendChild(confetti);

        const xStart = Math.random() < 0.5 ? 0 : window.innerWidth;
        const yStart = window.innerHeight;
        const xEnd = window.innerWidth / 2 + (Math.random() - 0.5) * (window.innerWidth / 2);
        const yEnd = window.innerHeight / 2 + (Math.random() - 0.5) * (window.innerHeight / 2);
        const duration = 2000 + Math.random() * 2000;
        const delay = Math.random() * 500;
        const rotation = Math.random() * 360 * 3;
        const colors = ['#7c3aed', '#a78bfa', '#c4b5fd', '#fde047', '#10B981'];

        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${xStart}px`;
        confetti.style.top = `${yStart}px`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

        const animation = confetti.animate([
            { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
            { transform: `translate(${xEnd - xStart}px, ${yEnd - yStart}px) rotate(${rotation}deg)`, opacity: 1, offset: 0.7 },
            { transform: `translate(${xEnd - xStart}px, ${window.innerHeight - yStart + 50}px) rotate(${rotation + 180}deg)`, opacity: 0 }
        ], {
            duration,
            delay,
            easing: 'cubic-bezier(0.1, 0.5, 0.5, 1)',
        });

        animation.onfinish = () => confetti.remove();
    }
};

const CompletionModal: React.FC<CompletionModalProps> = ({ moduleId, moduleName, onClose }) => {
    const { user, getModuleProgress, setModuleCertificate } = useAuth();
    const navigate = useNavigate();
    const [certificateGenerated, setCertificateGenerated] = useState(false);
    const [certificateId, setCertificateId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [certificateName, setCertificateName] = useState(user?.name || 'Student');
    const certificateRef = useRef<HTMLDivElement>(null);

    const moduleProgress = getModuleProgress(moduleId);
    const totalSections = moduleId === 1 ? 50 : moduleId === 4 ? 60 : 40;

    useEffect(() => {
        launchConfetti();
    }, []);

    const handleGenerateCertificate = async () => {
        if (!user) return;
        setIsGenerating(true);

        try {
            const cert = await generateModuleCertificate(
                moduleId,
                certificateName,
                user.email,
                moduleProgress.completedSections.length,
                totalSections,
                moduleProgress.completedInteractives.length,
                moduleProgress.points
            );

            setModuleCertificate(moduleId, cert.id, cert.sha256Hash);
            setCertificateId(cert.id);
            setCertificateGenerated(true);
        } catch (error) {
            console.error('Failed to generate certificate:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = async (format: 'jpg' | 'pdf') => {
        const element = certificateRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: null,
            useCORS: true,
        });

        if (format === 'jpg') {
            const link = document.createElement('a');
            link.download = `ZEN_Vanguard_Module${moduleId}_Certificate.jpg`;
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
            pdf.save(`ZEN_Vanguard_Module${moduleId}_Certificate.pdf`);
        }
    };

    const handleViewCertificate = () => {
        if (certificateId) {
            navigate(`/certificate/${certificateId}`);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
            <div className="bg-brand-bg/90 backdrop-blur-xl rounded-2xl shadow-soft-xl max-w-3xl w-full p-8 animate-slide-in-tilt">
                {!certificateGenerated ? (
                    <>
                        <div className="text-center mb-6">
                            <span className="text-6xl mb-4 block animate-float">🎉</span>
                            <h2 className="text-3xl font-bold text-brand-text mb-2">Congratulations!</h2>
                            <p className="text-brand-text-light">
                                You've completed <strong>{moduleName}</strong>! You can now claim your certificate.
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-brand-text-light mb-2">
                                Name on Certificate
                            </label>
                            <input
                                type="text"
                                value={certificateName}
                                onChange={(e) => setCertificateName(e.target.value)}
                                className="input-neumorphic"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleGenerateCertificate}
                                disabled={isGenerating}
                                className="btn-primary flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <span>🏆</span> Generate Certificate
                                    </>
                                )}
                            </button>
                            <button onClick={onClose} className="btn-secondary">
                                Maybe Later
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold text-brand-text">Certificate Generated!</h2>
                            <p className="text-brand-text-light text-sm">SHA-256 verified and timestamped</p>
                        </div>

                        {/* Mini certificate preview */}
                        <div
                            ref={certificateRef}
                            className="glass-card p-6 aspect-video relative overflow-hidden mb-6"
                        >
                            <div className="absolute inset-0 bg-grid-pattern opacity-5" style={{ '--grid-color': 'rgba(124, 58, 237, 0.2)', '--grid-size': '20px' } as React.CSSProperties} />
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-brand-primary">ZEN VANGUARD</h3>
                                        <p className="text-xs text-brand-text-light">Module {moduleId} Certificate</p>
                                    </div>
                                    <span className="text-3xl">🏆</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-brand-text-light">Awarded to</p>
                                    <h4 className="text-2xl font-bold text-brand-text">{certificateName}</h4>
                                </div>
                                <div className="text-xs font-mono text-brand-text-light/60 text-center">
                                    {certificateId}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center">
                            <button onClick={() => handleDownload('jpg')} className="btn-secondary text-sm">
                                📷 Download JPG
                            </button>
                            <button onClick={() => handleDownload('pdf')} className="btn-secondary text-sm">
                                📄 Download PDF
                            </button>
                            <button onClick={handleViewCertificate} className="btn-primary text-sm">
                                🔍 View Full Certificate
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CompletionModal;
