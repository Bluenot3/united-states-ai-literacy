import React from 'react';

interface LocalAIStatusCardProps {
    supported: boolean;
    initialized: boolean;
    initializing: boolean;
    progress?: number;
    error?: string | null;
    currentModel?: string | null;
    provider?: 'webllm' | 'template' | null;
    onEnable: () => void;
    onUseFallback?: () => void;
}

const LocalAIStatusCard: React.FC<LocalAIStatusCardProps> = ({
    supported,
    initialized,
    initializing,
    progress = 0,
    error,
    currentModel,
    provider,
    onEnable,
    onUseFallback,
}) => {
    const unavailable = !supported || Boolean(error && !initialized);
    const title = initialized
        ? 'Local AI ready'
        : initializing
            ? 'Local AI loading'
            : unavailable
                ? 'Local AI unavailable on this device'
                : 'Enable Local AI';
    const body = initialized
        ? `Powered by ${currentModel ?? 'WebLLM'} in this browser.`
        : unavailable
            ? 'This activity will use a guided fallback.'
            : 'Local AI runs in your browser on supported devices.';

    return (
        <div className="relative my-4 overflow-hidden rounded-2xl border border-cyan-300/15 bg-[linear-gradient(135deg,rgba(8,13,30,0.92),rgba(20,24,48,0.82))] p-4 text-left shadow-[0_20px_60px_rgba(8,13,30,0.35)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-200/70">
                        Browser AI
                    </p>
                    <h5 className="mt-1 text-sm font-bold text-white">{title}</h5>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{body}</p>
                    {provider && (
                        <p className="mt-2 text-[11px] font-semibold text-slate-500">
                            {provider === 'webllm' ? 'Powered by Local AI' : 'Fallback response'}
                        </p>
                    )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {!initialized && !initializing && !unavailable && (
                        <button
                            type="button"
                            onClick={onEnable}
                            className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/15"
                        >
                            Enable Local AI
                        </button>
                    )}
                    {unavailable && onUseFallback && (
                        <button
                            type="button"
                            onClick={onUseFallback}
                            className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-4 py-2 text-xs font-bold text-fuchsia-100 transition hover:border-fuchsia-200/40"
                        >
                            Use Fallback
                        </button>
                    )}
                </div>
            </div>
            {initializing && (
                <div className="mt-4">
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 transition-all"
                            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">{progress}% loaded</p>
                </div>
            )}
        </div>
    );
};

export default LocalAIStatusCard;
