import React, { useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';
import { SendIcon } from '../icons/SendIcon';

// ⚠️ CRITICAL CONFIGURATION:
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc7osJ5b9VwpKE2jWQQFHUhAAtPJjIcROiokeUzLittC6Qvgg/formResponse";
const GOOGLE_FORM_ENTRY_ID = "entry.123456789"; 

const ProjectSubmission: React.FC<{ interactiveId: string }> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [url, setUrl] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const hasCompleted = user?.modules?.[4]?.completedInteractives.includes(interactiveId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!url.trim()) return;

        if (!url.startsWith('http')) {
            setError('Please enter a valid URL starting with http:// or https://');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append(GOOGLE_FORM_ENTRY_ID, url);

            await fetch(GOOGLE_FORM_ACTION_URL, {
                method: 'POST',
                mode: 'no-cors', // Crucial for Google Forms to bypass CORS
                body: formData
            });

            setSubmitted(true);
            
            if (!hasCompleted) {
                addPoints(50);
                updateProgress(interactiveId, 'interactive');
            }

        } catch (err) {
            console.error("Form submission error:", err);
            // In no-cors mode, we can't see the error details, but if the fetch throws, it's a network error.
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-12 p-1 rounded-3xl bg-gradient-to-br from-brand-primary via-white to-brand-secondary shadow-2xl transform transition-all hover:scale-[1.01] duration-500 group relative">
             {/* Ambient Glow Effect */}
             <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
             
             <div className="bg-brand-bg/95 backdrop-blur-2xl rounded-[1.4rem] p-8 relative overflow-hidden border border-white/50">
                 
                 {/* Abstract Background Decor */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                 <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                 {/* Header */}
                 <div className="text-center mb-8 relative z-10">
                    <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary mb-2 tracking-tight">Submit Your Build</h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto rounded-full mb-4 shadow-glow-blue"></div>
                    <p className="text-brand-text-light max-w-md mx-auto text-sm leading-relaxed font-medium">
                        Deploy your Gradio app to Hugging Face Spaces and paste the URL here to earn your Vanguard badge.
                    </p>
                 </div>

                 {submitted ? (
                     <div className="flex flex-col items-center justify-center p-8 animate-fade-in-up">
                        <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)] border-4 border-white ring-4 ring-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h4 className="text-2xl font-bold text-brand-text mb-2">Mission Accomplished!</h4>
                        <p className="text-brand-text-light mb-6 text-center max-w-sm">Your project has been successfully logged in the Vanguard database.</p>
                        {!hasCompleted && (
                            <div className="px-6 py-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary rounded-full font-bold flex items-center gap-2 animate-pulse border border-brand-primary/20 shadow-sm">
                                <SparklesIcon /> +50 XP Earned
                            </div>
                        )}
                     </div>
                 ) : (
                     <div className="max-w-lg mx-auto relative z-10">
                         <form onSubmit={handleSubmit} className="relative">
                            <div className="relative group mb-6">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </div>
                                <input 
                                    type="url" 
                                    required
                                    placeholder="https://huggingface.co/spaces/username/space-name"
                                    className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-inner placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/50 text-brand-text transition-all hover:shadow-md font-mono text-sm"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            
                            {error && <div className="text-red-500 text-sm text-center mb-4 font-semibold bg-red-50 py-2 rounded-lg border border-red-100 animate-fade-in">{error}</div>}
                            
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-brand-primary/30 transition-all transform hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-wait disabled:transform-none disabled:shadow-none hover:brightness-110 relative overflow-hidden group/btn"
                            >
                                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Submit Project <SendIcon />
                                    </>
                                )}
                            </button>
                         </form>
                     </div>
                 )}
             </div>
        </div>
    );
};

export default ProjectSubmission;