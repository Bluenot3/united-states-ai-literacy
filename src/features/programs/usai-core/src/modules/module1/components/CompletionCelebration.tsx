
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

declare const html2canvas: any;
declare const jspdf: any;

const launchConfetti = () => {
    const confettiCount = 200;
    const confettiContainer = document.body;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confettiContainer.appendChild(confetti);

        const xStart = Math.random() < 0.5 ? 0 : window.innerWidth;
        const yStart = window.innerHeight;
        
        const xEnd = window.innerWidth / 2 + (Math.random() - 0.5) * (window.innerWidth / 2);
        const yEnd = window.innerHeight / 2 + (Math.random() - 0.5) * (window.innerHeight / 2);

        const duration = 2000 + Math.random() * 3000;
        const delay = Math.random() * 1000;
        const rotation = Math.random() * 360 * 3;
        const colors = ['#7c3aed', '#a78bfa', '#c4b5fd', '#fde047', '#f97316'];
        
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${xStart}px`;
        confetti.style.top = `${yStart}px`;

        const animation = confetti.animate([
            { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
            { transform: `translate(${xEnd - xStart}px, ${yEnd - yStart}px) rotate(${rotation}deg)`, opacity: 1, offset: 0.7 },
            { transform: `translate(${xEnd - xStart}px, ${window.innerHeight - yStart + 50}px) rotate(${rotation + 180}deg)`, opacity: 0 }
        ], {
            duration: duration,
            delay: delay,
            easing: 'cubic-bezier(0.1, 0.5, 0.5, 1)',
        });

        animation.onfinish = () => {
            confetti.remove();
        };
    }
};

const CompletionCelebration: React.FC = () => {
    const { user } = useAuth();
    const [certificateName, setCertificateName] = useState(user?.name || 'Zen Vanguard');
    const certificateRef = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [transformStyle, setTransformStyle] = useState({});
    
    useEffect(() => {
        launchConfetti();
        const timer = setTimeout(() => {
            setShowModal(true);
        }, 1500); // Show modal after confetti has started
        return () => clearTimeout(timer);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const rotateX = (y / height - 0.5) * -15; // Max 7.5 deg tilt
        const rotateY = (x / width - 0.5) * 15; // Max 7.5 deg tilt
        setTransformStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
            transition: 'transform 0.1s ease-out',
        });
    };

    const handleMouseLeave = () => {
        setTransformStyle({
            transform: 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
            transition: 'transform 0.5s ease-in-out',
        });
    };

    const handleDownload = async (format: 'jpg' | 'pdf') => {
        const element = certificateRef.current;
        if (!element) return;
        
        // Reset transform for clean capture
        element.style.transform = 'none';

        const canvas = await html2canvas(element, { 
            scale: 2, 
            backgroundColor: null,
            useCORS: true
        });

        // Restore transform
        element.style.transform = (transformStyle as any).transform;

        if (format === 'jpg') {
            const link = document.createElement('a');
            link.download = 'Zen_Vanguard_Certificate.jpg';
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
        } else {
            const { jsPDF } = jspdf;
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('Zen_Vanguard_Certificate.pdf');
        }
    };
    
    const certId = `ZV-M1-${user?.email.slice(0, 4).toUpperCase()}${new Date().getFullYear()}`;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${showModal ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)'}}>
           <div className="bg-brand-bg/80 backdrop-blur-xl p-8 rounded-2xl shadow-soft-xl max-w-4xl w-full mx-4 animate-slide-in-tilt">
                <h1 className="text-center text-3xl font-bold text-brand-text mb-2">Congratulations!</h1>
                <p className="text-center text-brand-text-light mb-6">You've completed the module. Here is your certificate of completion.</p>

                <div 
                    id="certificate" 
                    ref={certificateRef} 
                    className="glass-card p-8 aspect-[16/9] w-full flex flex-col justify-between relative overflow-hidden bg-brand-bg/50"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={transformStyle}
                >
                    {/* Background elements */}
                    <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-brand-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pale-yellow/10 rounded-full blur-3xl"></div>
                    <div className="absolute inset-0 bg-grid-pattern opacity-5" style={{ '--grid-color': 'rgba(124, 58, 237, 0.2)', '--grid-size': '30px' } as React.CSSProperties}></div>

                    <div className="flex justify-between items-start z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-brand-primary tracking-tighter">ZEN AI VANGUARD</h2>
                            <p className="font-semibold text-brand-text-light">Certificate of Completion</p>
                        </div>
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${certId}`} 
                            alt="Certificate QR Code" 
                            className="w-20 h-20 bg-white p-1 rounded-md"
                        />
                    </div>

                    <div className="text-center z-10 my-4">
                        <p className="text-brand-text-light mb-1">is hereby granted to</p>
                        <h1 className="text-5xl font-extrabold text-brand-text tracking-tight">{certificateName}</h1>
                        <p className="text-brand-text-light mt-2 max-w-xl mx-auto">for successfully completing Module 1 of the "Introduction to Machine Learning" curriculum.</p>
                    </div>

                    <div className="flex justify-between items-end text-xs font-mono text-brand-text-light/80 z-10">
                        <div>
                            <p>// CERT_ID: {certId}</p>
                            <p>// COMPLETION_DATE: {new Date().toISOString()}</p>
                        </div>
                         <div className="text-right">
                            <p>POINTS_EARNED: {user?.points}</p>
                            <p>SECTIONS_COMPLETED: {user?.progress.completedSections.length}</p>
                         </div>
                    </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                     <input 
                        type="text" 
                        value={certificateName} 
                        onChange={(e) => setCertificateName(e.target.value)}
                        placeholder="Enter your name"
                        className="px-4 py-2 bg-white/50 rounded-lg shadow-soft-inner text-center font-semibold"
                    />
                    <button onClick={() => handleDownload('jpg')} className="px-6 py-2 bg-white/80 rounded-lg shadow-soft-lg font-semibold text-brand-primary hover:bg-white transition-all">Download JPG</button>
                    <button onClick={() => handleDownload('pdf')} className="px-6 py-2 bg-white/80 rounded-lg shadow-soft-lg font-semibold text-brand-primary hover:bg-white transition-all">Download PDF</button>
                </div>
           </div>
        </div>
    );
};

export default CompletionCelebration;
