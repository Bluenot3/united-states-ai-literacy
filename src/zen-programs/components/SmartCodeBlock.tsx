import React, { useMemo, useState } from 'react';

const normalizedLanguage = (value: string) => {
    const language = value.trim().toLowerCase();
    const aliases: Record<string, string> = {
        js: 'JavaScript',
        javascript: 'JavaScript',
        jsx: 'JSX',
        ts: 'TypeScript',
        typescript: 'TypeScript',
        tsx: 'TSX',
        py: 'Python',
        python: 'Python',
        html: 'HTML',
        css: 'CSS',
        json: 'JSON',
        sql: 'SQL',
        sh: 'Shell',
        bash: 'Shell',
        shell: 'Shell',
        java: 'Java',
        csharp: 'C#',
        'c#': 'C#',
        cpp: 'C++',
        'c++': 'C++',
        go: 'Go',
        rust: 'Rust',
        ruby: 'Ruby',
        php: 'PHP',
        yaml: 'YAML',
        yml: 'YAML',
        markdown: 'Markdown',
        md: 'Markdown',
    };
    return aliases[language] ?? (language ? language.toUpperCase() : 'Text');
};

export const detectCodeLanguage = (code: string, explicitLanguage?: string): string => {
    if (explicitLanguage?.trim() && explicitLanguage.trim().toLowerCase() !== 'auto') {
        return normalizedLanguage(explicitLanguage);
    }

    const sample = code.trim();
    if (!sample) return 'Text';
    if (/^<!doctype html|<html[\s>]|<(div|main|section|button|script|style)[\s>]/i.test(sample)) return 'HTML';
    if (/^\s*[\[{]/.test(sample)) {
        try {
            JSON.parse(sample);
            return 'JSON';
        } catch {
            // Continue through language heuristics.
        }
    }
    if (/\b(interface|type)\s+\w+|:\s*(string|number|boolean|unknown)\b|import\s+type\b/.test(sample)) return 'TypeScript';
    if (/\b(const|let|var)\s+\w+|=>|console\.log|import\s+.+\s+from\s+['"]/.test(sample)) return 'JavaScript';
    if (/\b(def|from\s+\w+\s+import|import\s+\w+|print\s*\(|if __name__\s*==)\b/.test(sample)) return 'Python';
    if (/\b(SELECT|INSERT INTO|UPDATE|DELETE FROM|CREATE TABLE|ALTER TABLE)\b/i.test(sample)) return 'SQL';
    if (/^#!.*\b(bash|sh)\b|\b(echo|chmod|export)\s+/.test(sample)) return 'Shell';
    if (/\bfn\s+main\s*\(|\blet\s+mut\b|println!\s*\(/.test(sample)) return 'Rust';
    if (/\bpackage\s+main\b|\bfunc\s+main\s*\(/.test(sample)) return 'Go';
    if (/\bpublic\s+static\s+void\s+main\b|System\.out\.println/.test(sample)) return 'Java';
    if (/\busing\s+System\b|Console\.WriteLine/.test(sample)) return 'C#';
    if (/\bbody\s*\{|[.#][\w-]+\s*\{[^}]*\b(color|display|margin|padding)\s*:/.test(sample)) return 'CSS';
    if (/^---\s*$|^[\w-]+:\s+.+$/m.test(sample)) return 'YAML';
    return 'Text';
};

interface SmartCodeBlockProps {
    code: string;
    language?: string;
    title?: string;
    variant?: 'light' | 'dark';
}

const SmartCodeBlock: React.FC<SmartCodeBlockProps> = ({ code, language, title, variant = 'dark' }) => {
    const [copied, setCopied] = useState(false);
    const detectedLanguage = useMemo(() => detectCodeLanguage(code, language), [code, language]);
    const dark = variant === 'dark';

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div className={`overflow-hidden rounded-xl border ${dark ? 'border-white/14 bg-black/55' : 'border-slate-700/30 bg-slate-950'}`}>
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
                <div className="min-w-0">
                    {title && <p className="truncate text-xs font-bold text-slate-100">{title}</p>}
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">{detectedLanguage}</p>
                </div>
                <button
                    type="button"
                    onClick={() => void copy()}
                    className="rounded-lg border border-white/14 bg-white/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-white/[0.12]"
                    aria-label={`Copy ${detectedLanguage} code`}
                >
                    {copied ? 'Copied' : 'Copy code'}
                </button>
            </div>
            <pre className="max-h-96 overflow-auto p-4 text-xs font-semibold leading-6 text-slate-100">
                <code data-language={detectedLanguage.toLowerCase()}>{code}</code>
            </pre>
        </div>
    );
};

export default SmartCodeBlock;
