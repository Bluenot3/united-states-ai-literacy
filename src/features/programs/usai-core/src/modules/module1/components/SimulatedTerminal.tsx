import React, { useState } from 'react';
import CodeBlock from './CodeBlock';

interface SimulatedTerminalProps {
  code: string;
  language: 'python' | 'solidity' | 'bash' | 'javascript';
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
    
    // Special case for typewriter effect
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
            setAnimatedOutput(output); // Show all at once
            setIsRunning(false);
        }, 700);
    }
  };

  return (
    <div className="bg-brand-bg rounded-lg my-6 p-2 shadow-neumorphic-in">
      <CodeBlock code={code} language={language} onRun={handleRun} isRunning={isRunning} />
      {showOutput && (
        <div className="p-4 bg-slate-900 rounded-b-lg">
          <pre className="text-xs sm:text-sm whitespace-pre-wrap text-slate-300">
            <span className="text-pale-green mr-2">$</span>{animatedOutput.trim()}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SimulatedTerminal;