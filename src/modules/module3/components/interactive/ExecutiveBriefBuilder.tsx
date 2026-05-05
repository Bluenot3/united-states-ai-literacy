import React, { useState } from 'react';

interface BriefSection {
    id: string;
    label: string;
    placeholder: string;
    example: string;
}

const BRIEF_SECTIONS: BriefSection[] = [
    {
        id: 'bluf',
        label: 'BLUF (Bottom Line Up Front)',
        placeholder: 'What is the single most important thing the reader needs to know?',
        example: 'We should proceed with Vendor B for the cloud migration. Cost: $450K. Timeline: 6 months.'
    },
    {
        id: 'context',
        label: 'Context',
        placeholder: 'Why does this decision matter now?',
        example: 'Our current infrastructure contract expires in 8 months. Delay risks service interruption.'
    },
    {
        id: 'options',
        label: 'Options Considered',
        placeholder: 'What alternatives were evaluated?',
        example: 'Option A: Renew current vendor ($380K, limited scalability)\nOption B: Migrate to cloud ($450K, 3x capacity)\nOption C: Build in-house ($800K, 18 months)'
    },
    {
        id: 'recommendation',
        label: 'Recommendation',
        placeholder: 'What specific action should be taken?',
        example: 'Approve Vendor B contract by end of week. Assign Sarah as project lead.'
    },
    {
        id: 'risk',
        label: 'Key Risk',
        placeholder: 'What\'s the main thing that could go wrong?',
        example: 'Migration window conflicts with Q4 freeze. Mitigation: Complete before November 1st.'
    }
];

export const ExecutiveBriefBuilder: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [sections, setSections] = useState<Record<string, string>>({});
    const [showPreview, setShowPreview] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('bluf');
    const [isTransforming, setIsTransforming] = useState(false);

    const handleTransform = () => {
        if (!inputText.trim()) return;

        setIsTransforming(true);

        // Simulate AI transformation
        setTimeout(() => {
            const transformed: Record<string, string> = {
                bluf: 'Recommend proceeding with the proposed initiative. Expected ROI: 2.3x over 18 months.',
                context: 'Market window is closing. Competitors have already moved. Our current approach is becoming obsolete.',
                options: '1. Full investment ($500K) - High risk, high reward\n2. Phased approach ($200K) - Lower risk, slower gains\n3. Status quo ($0) - Continued decline',
                recommendation: 'Approve Phase 1 funding of $200K with go/no-go decision at 90-day milestone.',
                risk: 'Team bandwidth is primary constraint. Mitigation: Defer non-critical projects until Q2.'
            };
            setSections(transformed);
            setIsTransforming(false);
            setShowPreview(true);
        }, 1500);
    };

    const handleSectionChange = (sectionId: string, value: string) => {
        setSections(prev => ({ ...prev, [sectionId]: value }));
    };

    const generateFinalBrief = () => {
        const brief = BRIEF_SECTIONS.map(section => {
            const content = sections[section.id] || '';
            return `**${section.label}**\n${content}`;
        }).join('\n\n');
        return brief;
    };

    const wordCount = Object.values(sections).join(' ').split(/\s+/).filter(Boolean).length;

    return (
        <div className="bg-gradient-to-br from-slate-900 via-[#1a1a2e] to-slate-900 rounded-3xl p-8 text-white font-sans shadow-2xl border border-white/5 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32"></div>

            {/* Header */}
            <div className="relative flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20">
                    📋
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Executive Brief Builder</h2>
                    <p className="text-slate-400 text-sm">Transform rambling thoughts into BLUF precision</p>
                </div>
                {showPreview && (
                    <div className={`px-4 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm transition-colors ${wordCount <= 150
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}>
                        {wordCount} words
                    </div>
                )}
            </div>

            {!showPreview ? (
                <>
                    {/* Input Area */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 backdrop-blur-sm relative focus-within:ring-2 focus-within:ring-blue-500/50 transition-all duration-300 hover:bg-white/[0.07]">
                        <label className="block text-sm font-semibold text-blue-200 mb-3 flex items-center gap-2">
                            <span>📝</span> Paste your rambling thoughts, meeting notes, or stream of consciousness:
                        </label>
                        <textarea
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder="So I've been thinking about this vendor situation and there's a lot to consider..."
                            className="w-full min-h-[180px] p-4 rounded-xl border border-white/10 bg-black/20 text-slate-200 text-sm leading-relaxed resize-y focus:outline-none focus:bg-black/30 placeholder-white/20 transition-all custom-scrollbar"
                        />
                    </div>

                    <button
                        onClick={handleTransform}
                        disabled={!inputText.trim() || isTransforming}
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg ${inputText.trim() && !isTransforming
                                ? 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 hover:-translate-y-0.5 shadow-blue-500/25'
                                : 'bg-white/10 text-white/40 cursor-not-allowed'
                            }`}
                    >
                        {isTransforming ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin">⚙️</span> Transforming...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                ⚡ Transform to Executive Brief
                            </span>
                        )}
                    </button>
                </>
            ) : (
                <>
                    {/* Section Editor */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
                        {BRIEF_SECTIONS.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 border ${activeSection === section.id
                                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-900/20'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                                    }`}
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>

                    {/* Active Section Editor */}
                    {BRIEF_SECTIONS.filter(s => s.id === activeSection).map(section => (
                        <div key={section.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 animate-fade-in backdrop-blur-sm">
                            <label className="block text-sm font-bold text-blue-300 mb-2">
                                {section.label}
                            </label>
                            <p className="text-xs text-slate-400 mb-4 font-light">
                                {section.placeholder}
                            </p>
                            <textarea
                                value={sections[section.id] || ''}
                                onChange={e => handleSectionChange(section.id, e.target.value)}
                                className="w-full min-h-[100px] p-4 rounded-xl border border-white/10 bg-black/20 text-slate-200 text-sm leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all mb-3"
                            />
                            <div className="p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg text-xs text-emerald-200/80 flex items-start gap-2">
                                <span className="mt-0.5">💡</span>
                                <span>Example: <span className="italic opacity-80">{section.example}</span></span>
                            </div>
                        </div>
                    ))}

                    {/* Preview */}
                    <div className="bg-black/30 border border-blue-500/20 rounded-2xl p-6 mb-6 relative group/preview">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-blue-200 flex items-center gap-2">
                                <span>📄</span> Final Brief Preview
                            </h4>
                            <button
                                onClick={() => navigator.clipboard.writeText(generateFinalBrief())}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5"
                            >
                                <span>📋</span> Copy
                            </button>
                        </div>

                        <div className="font-mono text-xs leading-relaxed opacity-90 whitespace-pre-wrap max-h-[300px] overflow-y-auto custom-scrollbar">
                            {BRIEF_SECTIONS.map(section => {
                                const content = sections[section.id];
                                if (!content) return null;
                                return (
                                    <div key={section.id} className="mb-4 last:mb-0">
                                        <div className={`font-bold uppercase tracking-wider text-[10px] mb-1 ${section.id === 'bluf' ? 'text-emerald-400' : 'text-blue-400'}`}>
                                            {section.label}
                                        </div>
                                        <div className="text-slate-300">{content}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setShowPreview(false);
                                setSections({});
                                setInputText('');
                            }}
                            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-medium text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                            <span>🔄</span> Start Over
                        </button>
                    </div>
                </>
            )}

            {/* BLUF Principles */}
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl">
                <strong className="block text-xs font-bold text-blue-300 mb-2 uppercase tracking-wider">📚 BLUF Principles</strong>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-blue-200/60">
                    <span>• Lead with the conclusion</span>
                    <span>• One page maximum</span>
                    <span>• Action-oriented language</span>
                    <span>• Quantify when possible</span>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveBriefBuilder;
