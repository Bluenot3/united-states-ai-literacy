import React from 'react';
import type { ProgramContentItem } from '../types';
import SmartCodeBlock from './SmartCodeBlock';
import StudioMediaBlock from './StudioMediaBlocks';

interface ProgramSectionRendererProps {
    content: ProgramContentItem[];
}

const ProgramSectionRenderer: React.FC<ProgramSectionRendererProps> = ({ content }) => {
    return (
        <div className="space-y-4">
            {content.map((item, index) => {
                switch (item.type) {
                    case 'heading':
                        return (
                            <h3 key={index} className="text-xl font-bold text-brand-text mt-6 first:mt-0">
                                {item.content as string}
                            </h3>
                        );

                    case 'paragraph':
                        return (
                            <p key={index} className="text-brand-text-light leading-relaxed">
                                {item.content as string}
                            </p>
                        );

                    case 'list':
                        return (
                            <ul key={index} className="space-y-2 ml-1">
                                {(item.content as string[]).map((listItem, listIndex) => (
                                    <li key={listIndex} className="flex items-start gap-3 text-brand-text-light">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                                        <span className="leading-relaxed">{listItem}</span>
                                    </li>
                                ))}
                            </ul>
                        );

                    case 'quote':
                        return (
                            <blockquote key={index} className="border-l-4 border-brand-primary/30 pl-4 py-2 italic text-brand-text-light bg-brand-primary/5 rounded-r-lg">
                                {item.content as string}
                            </blockquote>
                        );

                    case 'callout': {
                        const tone = item.tone === 'warning'
                            ? 'border-amber-300/60 bg-amber-50 text-amber-900'
                            : item.tone === 'success'
                                ? 'border-emerald-300/60 bg-emerald-50 text-emerald-900'
                                : 'border-sky-300/60 bg-sky-50 text-sky-900';
                        const lines = Array.isArray(item.content) ? item.content : [item.content];
                        return (
                            <div key={index} className={`rounded-xl border p-4 ${tone}`}>
                                {item.title && (
                                    <p className="text-xs font-bold uppercase tracking-wider mb-2">{item.title}</p>
                                )}
                                <div className="space-y-1.5 text-sm leading-relaxed">
                                    {lines.filter(Boolean).map((line, lineIndex) => <p key={lineIndex}>{line}</p>)}
                                </div>
                            </div>
                        );
                    }

                    case 'code':
                        return <SmartCodeBlock key={index} code={item.content} language={item.language} title={item.title} variant="light" />;

                    case 'image':
                    case 'video':
                    case 'embed':
                    case 'html':
                    case 'divider':
                        return <StudioMediaBlock key={index} item={item} variant="light" />;

                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default ProgramSectionRenderer;
