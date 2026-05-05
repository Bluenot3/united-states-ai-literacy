import React, { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';

const AIAdvisor: React.FC = () => {
    const { user, getModuleProgress } = useAuth();

    const advice = useMemo(() => {
        if (!user) return { message: '', suggestions: [] as string[] };

        const m1 = getModuleProgress(1);
        const m3 = getModuleProgress(3);
        const m4 = getModuleProgress(4);

        const totalCompleted = m1.completedSections.length + m3.completedSections.length + m4.completedSections.length;
        const hasAnyCert = m1.certificateId || m3.certificateId || m4.certificateId;

        if (totalCompleted === 0) {
            return {
                message: "Welcome! Start with Module 1 to build a strong foundation in AI concepts.",
                suggestions: [
                    "Begin with 'AI Foundations' — the essentials",
                    "Try the interactive Neural Network simulator",
                    "Set a goal: 5 sections this week",
                ],
            };
        }

        if (!m1.certificateId && m1.completedSections.length > 0) {
            const progress = Math.round((m1.completedSections.length / 50) * 100);
            return {
                message: `Module 1 is ${progress}% complete — keep the momentum going!`,
                suggestions: [
                    "Continue where you left off",
                    "Try interactive components you haven't explored",
                    progress > 80 ? "Almost there — finish for your first certificate!" : "Focus on a few more sections",
                ],
            };
        }

        if (hasAnyCert && !user.finalCertificationId) {
            const completedMods = [m1, m3, m4].filter(m => m.certificateId).length;
            return {
                message: `${completedMods} module(s) complete! Keep going to earn your AI Literacy Certification.`,
                suggestions: [
                    m1.certificateId ? "✓ Module 1 Complete" : "Complete Module 1 for advanced topics",
                    m3.certificateId ? "✓ Module 3 Complete" : "Module 3: real-world AI applications",
                    m4.certificateId ? "✓ Module 4 Complete" : "Module 4: professional AI coding",
                ],
            };
        }

        return {
            message: "Excellent progress! Keep challenging yourself.",
            suggestions: [
                "Review completed sections to reinforce learning",
                "Try the advanced interactive exercises",
                "Challenge yourself with timed quizzes",
            ],
        };
    }, [user, getModuleProgress]);

    if (!user) return null;

    return (
        <section className="glass-card p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-cyan/15 to-brand-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />

            <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-primary flex items-center justify-center shadow-sm">
                        <span className="text-sm">🤖</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-brand-text leading-tight">AI Study Advisor</h3>
                        <p className="text-[10px] text-brand-text-light">Personalized for you</p>
                    </div>
                </div>

                <p className="text-sm text-brand-text leading-relaxed mb-3">{advice.message}</p>

                <div className="space-y-1.5">
                    {advice.suggestions.map((suggestion, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-2 text-xs text-brand-text-light bg-white/40 rounded-lg px-2.5 py-1.5"
                        >
                            <span className="text-brand-cyan mt-0.5 flex-shrink-0">→</span>
                            <span className="leading-relaxed">{suggestion}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AIAdvisor;
