import React, { useState } from 'react';

interface ProgramCodeBlockProps {
    code: string;
    language?: string;
    title?: string;
    filename?: string;
}

const ProgramCodeBlock: React.FC<ProgramCodeBlockProps> = ({
    code,
    language = 'text',
    title,
    filename,
}) => {
    const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
    const displayTitle = title || filename || 'Code';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code.trimEnd());
            setCopyState('copied');
            window.setTimeout(() => setCopyState('idle'), 1800);
        } catch {
            setCopyState('failed');
            window.setTimeout(() => setCopyState('idle'), 2200);
        }
    };

    return (
        <div className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{displayTitle}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">
                        {filename ? `${filename} / ${language}` : language}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex min-h-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
                    aria-label={`Copy ${displayTitle}`}
                >
                    {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy'}
                </button>
            </div>
            <pre className="max-h-[34rem] max-w-full overflow-x-auto p-4 text-xs leading-6 text-slate-100 sm:text-sm">
                <code>{code.trimEnd()}</code>
            </pre>
        </div>
    );
};

export default ProgramCodeBlock;
