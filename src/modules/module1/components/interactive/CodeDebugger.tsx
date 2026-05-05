import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import AiOutputBlock from '../AiOutputBlock';

const sampleCode = `function factorial(n) {
  if (n = 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}`;

const CodeDebugger: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [code, setCode] = useState(sampleCode);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleDebug = async () => {
        if (!code.trim()) {
            setError('Please enter some code to debug.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        const prompt = `You are an expert code debugger. Analyze the following JavaScript code, identify any bugs, explain them clearly, and provide the corrected code. Format your response with markdown.

Code:
\`\`\`javascript
${code}
\`\`\``;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setResult(response.text);

            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to debug code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">AI Code Debugger</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Enter some buggy code and let Gemini find the issues.</p>
            
            <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                rows={8}
                className="w-full p-3 bg-slate-900 text-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Enter your code here..."
            />
            
            <div className="text-center mt-4">
                 <button onClick={handleDebug} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    <SparklesIcon />
                    {loading ? 'Debugging...' : 'Find Bugs'}
                </button>
            </div>
            
            <AiOutputBlock
                content={result}
                isLoading={loading}
                error={error}
                title="Debugging Report"
                containerClassName="mt-6"
            />
        </div>
    );
};

export default CodeDebugger;
