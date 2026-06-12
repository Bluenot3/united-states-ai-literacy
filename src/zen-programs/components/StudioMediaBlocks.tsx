import React from 'react';
import type { ProgramContentItem } from '../types';

// Converts well-known share URLs (YouTube, Vimeo, Loom) into embeddable URLs.
export const toEmbedUrl = (raw: string): string => {
    const url = raw.trim();
    const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
    if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
    const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    const loom = url.match(/loom\.com\/(?:share|embed)\/([\w-]+)/);
    if (loom) return `https://www.loom.com/embed/${loom[1]}`;
    return url;
};

const isFileVideo = (url: string) => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url.trim());

interface StudioMediaBlockProps {
    item: ProgramContentItem;
    variant?: 'light' | 'dark';
}

/**
 * Renders the rich/media curriculum block types added via Curriculum Studio:
 * image, video, embed (iframe/URL), raw HTML (sandboxed, scripts allowed), divider.
 * Returns null for any other block type.
 */
export const StudioMediaBlock: React.FC<StudioMediaBlockProps> = ({ item, variant = 'light' }) => {
    const dark = variant === 'dark';
    const frame = dark
        ? 'overflow-hidden rounded-[1.35rem] border border-white/14 bg-black/40 shadow-[0_18px_46px_rgba(0,0,0,.28)]'
        : 'overflow-hidden rounded-2xl border border-brand-shadow-dark/10 bg-white shadow-md';
    const captionClass = dark
        ? 'px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300'
        : 'px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-text-light';

    if (item.type === 'divider') {
        return (
            <div className="flex items-center gap-3 py-2" role="separator">
                <span className={`h-px flex-1 ${dark ? 'bg-white/15' : 'bg-brand-shadow-dark/15'}`} />
                <span className={`h-1.5 w-1.5 rounded-full ${dark ? 'bg-white/30' : 'bg-brand-shadow-dark/30'}`} />
                <span className={`h-px flex-1 ${dark ? 'bg-white/15' : 'bg-brand-shadow-dark/15'}`} />
            </div>
        );
    }

    if (item.type === 'image') {
        if (!item.src?.trim()) return null;
        return (
            <figure className={frame}>
                <img
                    src={item.src}
                    alt={item.alt || item.caption || 'Curriculum image'}
                    loading="lazy"
                    className="w-full object-cover"
                />
                {item.caption && <figcaption className={captionClass}>{item.caption}</figcaption>}
            </figure>
        );
    }

    if (item.type === 'video') {
        if (!item.src?.trim()) return null;
        return (
            <figure className={frame}>
                {isFileVideo(item.src) ? (
                    <video src={item.src} controls playsInline className="aspect-video w-full bg-black" />
                ) : (
                    <iframe
                        src={toEmbedUrl(item.src)}
                        title={item.caption || 'Curriculum video'}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="aspect-video w-full bg-black"
                    />
                )}
                {item.caption && <figcaption className={captionClass}>{item.caption}</figcaption>}
            </figure>
        );
    }

    if (item.type === 'embed') {
        if (!item.url?.trim()) return null;
        return (
            <figure className={frame}>
                <iframe
                    src={toEmbedUrl(item.url)}
                    title={item.title || 'Embedded content'}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
                    allowFullScreen
                    style={{ height: Math.max(160, item.height ?? 480) }}
                    className="w-full bg-white"
                />
                {item.title && <figcaption className={captionClass}>{item.title}</figcaption>}
            </figure>
        );
    }

    if (item.type === 'html') {
        if (!item.content?.trim()) return null;
        // Render admin-authored HTML inside a sandboxed iframe (no same-origin
        // access) so scripts can power interactive content without touching
        // the app session, storage, or cookies.
        const srcDoc = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><style>body{margin:0;font-family:Inter,system-ui,sans-serif;${dark ? 'background:transparent;color:#e2e8f0;' : 'color:#0f172a;'}}</style></head><body>${item.content}</body></html>`;
        return (
            <figure className={frame}>
                <iframe
                    srcDoc={srcDoc}
                    title={item.title || 'Interactive HTML block'}
                    loading="lazy"
                    sandbox="allow-scripts allow-popups allow-forms allow-modals"
                    style={{ height: Math.max(120, item.height ?? 360) }}
                    className="w-full"
                />
                {item.title && <figcaption className={captionClass}>{item.title}</figcaption>}
            </figure>
        );
    }

    return null;
};

export default StudioMediaBlock;
