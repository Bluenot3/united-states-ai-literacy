import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
  onRun?: () => void;
  isRunning?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, onRun, isRunning }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-lg relative">
        <div className="flex justify-between items-center px-4 py-2 bg-black/20 rounded-t-lg border-b border-white/10">
            <span className="text-xs font-mono text-slate-400">{language}</span>
            <div className="flex items-center gap-2">
                {onRun && (
                    <button
                        onClick={onRun}
                        disabled={isRunning}
                        className="text-xs px-3 py-1 bg-green-500/80 hover:bg-green-500/100 text-white rounded-md transition-all duration-200 disabled:bg-green-700/50 disabled:cursor-not-allowed flex items-center"
                    >
                         <svg className={`w-3 h-3 mr-1.5 ${isRunning ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isRunning ? "M12 4v.01M12 20v.01M4 12h.01M20 12h.01M6.31 6.31l.01.01M17.69 17.69l.01.01M6.31 17.69l.01-.01M17.69 6.31l.01-.01" : "M5 3l14 9-14 9V3z"}></path></svg>
                        {isRunning ? 'Running...' : 'Run'}
                    </button>
                )}
                <button
                    onClick={handleCopy}
                    className="text-xs px-3 py-1 bg-slate-600/80 hover:bg-slate-600/100 text-white rounded-md transition-all duration-200"
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code.trim()}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;