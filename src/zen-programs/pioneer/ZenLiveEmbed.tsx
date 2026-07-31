/**
 * ZEN Live Embed — the engraved cabinet that hosts a third-party demo.
 *
 * Design constraints that shaped this:
 *
 *  - **Click to load.** A quest can carry three live labs; framing all of them
 *    on mount would pull megabytes and hand the learner's IP to three hosts
 *    before they asked for anything. Nothing loads until "Run this lab".
 *  - **Never a dead grey box.** Frame-blocking cannot be detected reliably from
 *    the parent (a blocked frame still fires `load`). So the open-in-new-tab
 *    control is always present, and a "not loading?" hint appears after a few
 *    seconds. A Space that stops allowing embeds degrades into a working link.
 *  - **Honest about what it is.** Learners are told this is someone else's
 *    site, running someone else's model, before they touch it. That is part of
 *    the literacy lesson, not a disclaimer.
 */

import React, { useEffect, useRef, useState } from 'react';
import { liveLabUrl, type LiveLab } from './zenLiveLabs';
import { GuillocheBand, Microprint } from './ZenTreasuryGraphics';

const providerLabel: Record<LiveLab['provider'], string> = {
    huggingface: 'Hugging Face Space',
    nvidia: 'NVIDIA',
};

export const ZenLiveEmbed: React.FC<{
    lab: LiveLab;
    rgb: string;
    rgbAlt?: string;
    /** Marks the lab explored, same as any other app. */
    onCleared?: () => void;
    cleared?: boolean;
}> = ({ lab, rgb, rgbAlt = rgb, onCleared, cleared = false }) => {
    const [running, setRunning] = useState(false);
    const [slow, setSlow] = useState(false);
    const timer = useRef<number | undefined>(undefined);
    const url = liveLabUrl(lab);

    useEffect(() => {
        if (!running) return undefined;
        // Third-party frames that refuse to embed look identical to slow ones,
        // so surface the escape hatch on a timer rather than guessing.
        timer.current = window.setTimeout(() => setSlow(true), 6000);
        return () => window.clearTimeout(timer.current);
    }, [running]);

    const style = { ['--zt-rgb' as string]: rgb, ['--zt-rgb-alt' as string]: rgbAlt };

    return (
        <article className="zt-plate relative overflow-hidden rounded-[1.4rem]" style={style}>
            <GuillocheBand rgb={rgb} className="pointer-events-none absolute inset-x-0 top-0 h-6 opacity-60" />

            <div className="relative flex flex-wrap items-start justify-between gap-3 border-b border-white/10 px-4 pb-3 pt-6">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span
                            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]"
                            style={{ borderColor: `rgba(${rgb}, .4)`, background: `rgba(${rgb}, .12)`, color: `rgb(${rgb})` }}
                        >
                            Live lab
                        </span>
                        <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-300">
                            {providerLabel[lab.provider]}
                        </span>
                        {lab.onDevice && (
                            <span className="rounded-full border border-emerald-300/35 bg-emerald-400/12 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100">
                                Runs on your device
                            </span>
                        )}
                        {cleared && (
                            <span className="rounded-full border border-emerald-300/40 bg-emerald-400/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100">
                                Cleared
                            </span>
                        )}
                    </div>
                    <h4 className="pa-title-lift mt-2.5 text-lg font-black tracking-tight text-white">{lab.title}</h4>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/18 bg-white/[0.06] px-3.5 py-2 text-xs font-black text-white transition hover:bg-white/[0.14]"
                    >
                        New tab
                        <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
                            <path d="M6 3 H13 V10 M13 3 L4 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                    {lab.mode === 'embed' && !running && (
                        <button
                            type="button"
                            onClick={() => setRunning(true)}
                            className="rounded-full px-4 py-2 text-xs font-black text-slate-950 shadow-[0_10px_26px_rgba(0,0,0,.45)] transition hover:-translate-y-0.5"
                            style={{ background: `linear-gradient(90deg,#ffffff,rgb(${rgb}))` }}
                        >
                            Run this lab
                        </button>
                    )}
                </div>
            </div>

            <div className="relative grid gap-2.5 p-4 md:grid-cols-2">
                <div className="rounded-[1rem] border border-white/10 bg-black/40 p-3.5">
                    <p className="text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: `rgb(${rgb})` }}>
                        What to notice
                    </p>
                    <p className="mt-1.5 text-[13px] font-semibold leading-6 text-slate-300">{lab.teaches}</p>
                </div>
                <div className="rounded-[1rem] border border-emerald-300/20 bg-emerald-400/[0.07] p-3.5">
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-emerald-200">Try this</p>
                    <p className="mt-1.5 text-[13px] font-semibold leading-6 text-emerald-50/90">{lab.tryThis}</p>
                </div>
            </div>

            {lab.mode === 'embed' && running && (
                <div className="relative px-4 pb-4">
                    <div
                        className="relative overflow-hidden rounded-[1rem] border"
                        style={{ borderColor: `rgba(${rgb}, .3)`, background: '#05080f' }}
                    >
                        <iframe
                            src={url}
                            title={lab.title}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allow={lab.allow}
                            className="block w-full"
                            style={{ height: lab.height ?? 640, border: 0 }}
                        />
                    </div>

                    {slow && (
                        <p className="mt-2.5 text-[11px] font-semibold leading-5 text-slate-400">
                            Still blank? Some hosts refuse to run inside another page, and free Spaces sleep when
                            unused.{' '}
                            <a href={url} target="_blank" rel="noreferrer noopener" className="font-black text-white underline decoration-white/40 underline-offset-2">
                                Open it in a new tab
                            </a>{' '}
                            instead — the lab works the same way there.
                        </p>
                    )}
                </div>
            )}

            {lab.mode === 'launch' && (
                <div className="relative px-4 pb-4">
                    <p className="rounded-[1rem] border border-white/10 bg-black/35 p-3.5 text-[12px] font-semibold leading-6 text-slate-400">
                        This one runs on {providerLabel[lab.provider]}&rsquo;s own site and cannot be embedded here, so it
                        opens in a new tab. Come back to this quest when you are done.
                    </p>
                </div>
            )}

            <div className="relative flex flex-wrap items-center justify-between gap-2.5 border-t border-white/10 px-4 py-3">
                <p className="text-[11px] font-semibold text-slate-500">
                    Hosted by {providerLabel[lab.provider]} — not by ZEN. Do not paste personal information or keys into it.
                </p>
                {onCleared && (
                    <button
                        type="button"
                        onClick={onCleared}
                        disabled={cleared}
                        className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                            cleared
                                ? 'cursor-default border border-emerald-300/30 bg-emerald-400/15 text-emerald-100'
                                : 'border border-white/20 bg-white/[0.08] text-white hover:-translate-y-0.5 hover:bg-white/[0.16]'
                        }`}
                    >
                        {cleared ? 'Cleared' : 'Mark cleared'}
                    </button>
                )}
            </div>

            <Microprint rgb={rgb} className="pointer-events-none absolute inset-x-0 bottom-0 h-2 opacity-40" />
        </article>
    );
};

export default ZenLiveEmbed;
