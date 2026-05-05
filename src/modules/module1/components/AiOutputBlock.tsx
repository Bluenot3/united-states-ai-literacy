import React, { useState } from 'react';
import SimpleMarkdown from './SimpleMarkdown';

interface AiOutputBlockProps {
    content?: string;
    isLoading?: boolean;
    error?: string | null;
    title: string;
    titleColor?: string;
    containerClassName?: string;
    placeholder?: string;
}

const AiOutputBlock: React.FC<AiOutputBlockProps> = ({
    content,
    isLoading,
    error,
    title,
    titleColor = 'text-brand-text',
    containerClassName = '',
    placeholder = 'AI output will appear here.',
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (content) {
            navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    
    return (
        <div className={`p-4 bg-brand-bg rounded-lg shadow-neumorphic-in animate-fade-in ${containerClassName}`}>
            <div className="flex justify-between items-center mb-2">
                <h5 className={`font-semibold ${titleColor}`}>{title}</h5>
                {content && !isLoading && (
                    <button
                        onClick={handleCopy}
                        className="text-xs px-3 py-1 bg-slate-200/50 hover:bg-slate-300/50 text-brand-text-light rounded-md transition-all duration-200"
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                )}
            </div>
            <div className="min-h-[80px]">
                {isLoading && (
                    <div className="space-y-3 animate-pulse">
                        <div className="h-4 bg-brand-shadow-dark/50 rounded w-3/4"></div>
                        <div className="h-4 bg-brand-shadow-dark/50 rounded w-1/2"></div>
                        <div className="h-4 bg-brand-shadow-dark/50 rounded w-5/6"></div>
                    </div>
                )}
                {error && <p className="text-red-500 font-semibold">{error}</p>}
                {!isLoading && !error && content && <SimpleMarkdown content={content} />}
                {!isLoading && !error && !content && <p className="text-brand-text-light/50 italic">{placeholder}</p>}
            </div>
        </div>
    );
};

export default AiOutputBlock;
