import React from 'react';
import SimpleMarkdown from '../../modules/module1/components/SimpleMarkdown';
import SectionQuiz from '../SectionQuiz';
import {
    isShippedVanguardQuizId,
    parsePublicQuizPayload,
    type ContentOverride,
} from '../../services/contentOverrides';

interface BlockProps {
    override: ContentOverride;
    isAdminView?: boolean;
}

// Convert common video URLs to embed URLs
function videoEmbedUrl(raw: string): { src: string; kind: 'iframe' | 'video' } | null {
    if (!raw) return null;
    try {
        const url = new URL(raw);
        const host = url.hostname.replace(/^www\./, '');
        if (host === 'youtube.com' || host === 'm.youtube.com') {
            const v = url.searchParams.get('v');
            if (v) return { src: `https://www.youtube.com/embed/${v}`, kind: 'iframe' };
        }
        if (host === 'youtu.be') {
            const id = url.pathname.slice(1);
            if (id) return { src: `https://www.youtube.com/embed/${id}`, kind: 'iframe' };
        }
        if (host === 'vimeo.com') {
            const id = url.pathname.split('/').filter(Boolean)[0];
            if (id) return { src: `https://player.vimeo.com/video/${id}`, kind: 'iframe' };
        }
        if (host.endsWith('loom.com')) {
            const parts = url.pathname.split('/').filter(Boolean);
            const idx = parts.indexOf('share');
            const id = idx >= 0 ? parts[idx + 1] : parts[parts.length - 1];
            if (id) return { src: `https://www.loom.com/embed/${id}`, kind: 'iframe' };
        }
        if (/\.(mp4|webm|ogg)(\?|$)/i.test(url.pathname)) {
            return { src: raw, kind: 'video' };
        }
        // fallback: embed as iframe
        return { src: raw, kind: 'iframe' };
    } catch {
        return null;
    }
}

const BlockShell: React.FC<{
    children: React.ReactNode;
    override: ContentOverride;
    isAdminView?: boolean;
    className?: string;
}> = ({ children, override, isAdminView, className = '' }) => (
    <div
        className={`zen-glass relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(7,14,30,0.85)_0%,rgba(12,20,39,0.78)_100%)] p-5 backdrop-blur-xl ${className}`}
        data-content-override-id={override.id}
    >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zen-gold/60 to-transparent" />
        <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-zen-gold/40 bg-zen-gold/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.28em] text-zen-gold/80">
            ZEN
        </span>
        {isAdminView && !override.is_published && (
            <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-amber-400/50 bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.28em] text-amber-300">
                Draft
            </span>
        )}
        <div className={isAdminView && !override.is_published ? 'pt-5 opacity-70' : ''}>
            {children}
        </div>
    </div>
);

const ContentBlockRenderer: React.FC<BlockProps> = ({ override, isAdminView }) => {
    const p = override.payload ?? {};

    switch (override.block_type) {
        case 'rich_text': {
            const text: string = p.markdown ?? p.text ?? '';
            return (
                <BlockShell override={override} isAdminView={isAdminView}>
                    <div className="prose prose-invert max-w-none text-slate-200">
                        <SimpleMarkdown content={text} />
                    </div>
                </BlockShell>
            );
        }
        case 'embed_url': {
            const url: string = p.url ?? '';
            const height: number = Number(p.height) || 0;
            if (!url) return null;
            return (
                <BlockShell override={override} isAdminView={isAdminView}>
                    {p.title && (
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-slate-400">{p.title}</p>
                    )}
                    <div
                        className="overflow-hidden rounded-xl border border-white/10 bg-black"
                        style={height ? { height: `${height}px` } : { aspectRatio: '16 / 9' }}
                    >
                        <iframe
                            src={url}
                            loading="lazy"
                            title={p.title ?? 'Embedded content'}
                            className="h-full w-full"
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                            allow="fullscreen; clipboard-read; clipboard-write"
                        />
                    </div>
                </BlockShell>
            );
        }
        case 'video': {
            const url: string = p.url ?? '';
            const info = videoEmbedUrl(url);
            if (!info) return null;
            return (
                <BlockShell override={override} isAdminView={isAdminView}>
                    {p.title && (
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-slate-400">{p.title}</p>
                    )}
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-black" style={{ aspectRatio: '16 / 9' }}>
                        {info.kind === 'iframe' ? (
                            <iframe
                                src={info.src}
                                title={p.title ?? 'Video'}
                                loading="lazy"
                                className="h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                allowFullScreen
                            />
                        ) : (
                            <video src={info.src} controls className="h-full w-full" />
                        )}
                    </div>
                    {p.caption && <p className="mt-2 text-sm text-slate-400">{p.caption}</p>}
                </BlockShell>
            );
        }
        case 'image': {
            const url: string = p.url ?? '';
            if (!url) return null;
            return (
                <BlockShell override={override} isAdminView={isAdminView}>
                    <img
                        src={url}
                        alt={p.alt ?? p.caption ?? ''}
                        loading="lazy"
                        className="mx-auto max-h-[70vh] w-full rounded-xl border border-white/10 object-contain"
                    />
                    {p.caption && <p className="mt-2 text-center text-sm text-slate-400">{p.caption}</p>}
                </BlockShell>
            );
        }
        case 'html': {
            const html: string = p.html ?? '';
            // Rendered inside a sandboxed iframe so admin-authored HTML/JS
            // can never touch the parent page's DOM, storage, or cookies.
            const srcDoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:12px;background:transparent;color:#e2e8f0;font-family:Outfit,ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:1.55}a{color:#22d3ee}</style></head><body>${html}</body></html>`;
            const height: number = Number(p.height) || 320;
            return (
                <BlockShell override={override} isAdminView={isAdminView}>
                    {p.title && (
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-slate-400">{p.title}</p>
                    )}
                    <iframe
                        title={p.title ?? 'Custom content'}
                        srcDoc={srcDoc}
                        sandbox="allow-scripts"
                        loading="lazy"
                        className="w-full rounded-xl border border-white/10 bg-transparent"
                        style={{ height: `${height}px` }}
                    />
                </BlockShell>
            );
        }
        case 'link_card': {
            const url: string = p.url ?? '';
            if (!url) return null;
            return (
                <BlockShell override={override} isAdminView={isAdminView}>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-zen-gold/40 hover:bg-white/[0.06]"
                    >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-zen-gold/15 text-zen-gold">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-8.25 3.75L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-base font-semibold text-slate-100 group-hover:text-white">
                                {p.title ?? url}
                            </p>
                            {p.description && (
                                <p className="mt-1 text-sm leading-6 text-slate-400">{p.description}</p>
                            )}
                            <p className="mt-1 truncate text-xs text-slate-500">{url}</p>
                        </div>
                    </a>
                </BlockShell>
            );
        }
        case 'quiz': {
            const quiz = parsePublicQuizPayload(p);
            if (!quiz) return null;
            const moduleMatch = override.module_id.match(/^module([1-4])$/);
            const moduleId = moduleMatch ? Number(moduleMatch[1]) as 1 | 2 | 3 | 4 : undefined;

            if (isAdminView) {
                return (
                    <BlockShell override={override} isAdminView>
                        <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-300">
                            {isShippedVanguardQuizId(quiz.quiz_id) ? 'Built-in quiz update' : 'Required quiz'}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-100">{quiz.quiz_id}</p>
                        <p className="mt-1 text-xs text-slate-400">
                            {quiz.questions.length > 0
                                ? `${quiz.questions.length} questions · ${quiz.passing_percent ?? 60}% to pass`
                                : 'Restored to the shipped questions · correct choices remain private'}
                        </p>
                    </BlockShell>
                );
            }

            // Shipped quizzes already have a SectionQuiz component in the
            // curriculum. That component resolves this published override by
            // quiz ID, so rendering the overlay row again would duplicate it.
            if (isShippedVanguardQuizId(quiz.quiz_id)) return null;
            if (!moduleId || quiz.questions.length === 0) return null;

            return (
                <BlockShell override={override}>
                    <SectionQuiz
                        interactiveId={quiz.quiz_id}
                        quizOverride={override}
                        moduleId={moduleId}
                    />
                </BlockShell>
            );
        }
        case 'divider':
            return (
                <div className="relative my-6 flex items-center gap-4" data-content-override-id={override.id}>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zen-gold/30 to-transparent" />
                    {p.label && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-zen-gold/60">
                            {p.label}
                        </span>
                    )}
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zen-gold/30 to-transparent" />
                </div>
            );
        default:
            return null;
    }
};

export default ContentBlockRenderer;
