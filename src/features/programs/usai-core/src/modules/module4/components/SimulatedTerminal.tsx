import React, { useState } from 'react';
import CodeBlock from './CodeBlock';

interface SimulatedTerminalProps {
  code: string;
  language: string;
  output: string;
  onRunCustomEffect?: () => void;
  effectId?: string;
}

const SimulatedTerminal: React.FC<SimulatedTerminalProps> = ({ code, language, output, onRunCustomEffect, effectId }) => {
  const [showOutput, setShowOutput] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [animatedOutput, setAnimatedOutput] = useState('');

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowOutput(false);
    setAnimatedOutput('');

    if (onRunCustomEffect) {
        onRunCustomEffect();
    }
    
    if (effectId === 'textAdventureEffect') {
        setTimeout(() => {
            setShowOutput(true);
            let i = 0;
            const interval = setInterval(() => {
                setAnimatedOutput(output.substring(0, i));
                i++;
                if (i > output.length) {
                    clearInterval(interval);
                    setIsRunning(false);
                }
            }, 15);
        }, 700);
    } else {
        setTimeout(() => {
            setShowOutput(true);
            setAnimatedOutput(output);
            setIsRunning(false);
        }, 700);
    }
  };

  return (
    <div className="bg-[#1e1e1e] rounded-xl overflow-hidden font-mono text-sm shadow-2xl border border-slate-800 relative group ring-1 ring-black/5">
        {/* Terminal Header */}
        <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-black/50">
             <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/20"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/20"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/20"></div>
            </div>
            <div className="text-gray-500 text-xs font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"></span>
                zen-vanguard-terminal — {language}
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        
        {/* Code Area */}
        <div className="relative bg-[#0e0e0e]">
            <CodeBlock code={code} language={language} onRun={handleRun} isRunning={isRunning} />
        </div>

        {/* Output Area */}
        {showOutput && (
            <div className="p-5 bg-[#0a0a0a] border-t border-gray-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-brand-primary text-xs mb-3 uppercase tracking-widest font-bold opacity-70">
                    <span>Console Output</span>
                </div>
                <pre className="whitespace-pre-wrap text-emerald-400 font-mono leading-relaxed text-sm pl-2 border-l-2 border-emerald-500/30">
                    <span className="text-blue-500 mr-2">➜</span>
                    {animatedOutput.trim()}
                    <span className="animate-pulse inline-block w-2.5 h-5 bg-emerald-500 align-middle ml-1"></span>
                </pre>
            </div>
        )}
    </div>
  );
};

export default SimulatedTerminal;