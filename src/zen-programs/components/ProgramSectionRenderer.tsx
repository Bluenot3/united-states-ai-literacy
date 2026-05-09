import React from 'react';
import type { ProgramContentItem } from '../types';
import ProgramCodeBlock from './ProgramCodeBlock';

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

                    case 'code':
                        return (
                            <ProgramCodeBlock
                                key={index}
                                code={item.content}
                                filename={item.filename}
                                language={item.language}
                                title={item.title}
                            />
                        );

                    case 'checklist':
                        return (
                            <div key={index} className="rounded-2xl border border-brand-primary/10 bg-brand-primary/5 p-5">
                                {item.title && <h3 className="text-lg font-bold text-brand-text">{item.title}</h3>}
                                <ul className="mt-3 space-y-3">
                                    {item.content.map((checklistItem) => (
                                        <li key={checklistItem} className="flex items-start gap-3 text-brand-text-light">
                                            <span className="mt-1 h-4 w-4 rounded border border-brand-primary/30" />
                                            <span>{checklistItem}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );

                    case 'callout':
                    case 'resource':
                    case 'template':
                        return (
                            <div key={index} className="rounded-2xl border border-brand-primary/10 bg-brand-primary/5 p-5 text-brand-text-light">
                                {'title' in item && item.title && <h3 className="text-lg font-bold text-brand-text">{item.title}</h3>}
                                {'templateId' in item && <p className="text-sm font-semibold text-brand-text">{item.templateId}</p>}
                                {Array.isArray(item.content) ? (
                                    <ul className="mt-3 space-y-2">
                                        {item.content.map((contentItem) => (
                                            <li key={contentItem}>{contentItem}</li>
                                        ))}
                                    </ul>
                                ) : item.content ? (
                                    <p className="mt-3 leading-relaxed">{item.content}</p>
                                ) : null}
                                {'href' in item && item.href && (
                                    <a href={item.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-brand-primary">
                                        Open resource
                                    </a>
                                )}
                            </div>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default ProgramSectionRenderer;
