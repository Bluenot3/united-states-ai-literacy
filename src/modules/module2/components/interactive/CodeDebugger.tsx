import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { InteractiveComponentProps } from '../../types';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const codeLines = [
  { id: 1, text: "def greet(name):" },
  { id: 2, text: "    message = 'Hello, ' + name" },
  { id: 3, text: "    print(mesage)" },
  { id: 4, text: "" },
  { id: 5, text: "greet('World')" },
];

const buggyLineId = 3;

const CodeDebugger: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
  const { user, addPoints, updateProgress } = useAuth();
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [solved, setSolved] = useState<boolean>(false);
  
  const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

  const getExplanation = async () => {
    setLoading(true);
    setExplanation('');
    try {
        const ai = await getAiClient();
        const fullCode = codeLines.map(l => l.text).join('\n');
        const prompt = `A user is debugging a Python script. They correctly identified that line 3 has a bug. Here is the code:\n\n${fullCode}\n\nExplain the bug on line 3 ("print(mesage)") in a concise and helpful way for a beginner. Explain what a NameError is and how to fix it by correcting the typo.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        setExplanation(response.text);

        if (!hasCompleted) {
            addPoints(25);
            updateProgress(interactiveId, 'interactive');
        }

    } catch (error) {
        console.error("Error getting explanation:", error);
        setExplanation("Could not load explanation. The bug is a 'NameError' because the variable 'mesage' is misspelled. It should be 'message'.");
    } finally {
        setLoading(false);
    }
  };


  const handleLineClick = (lineId: number) => {
    if (solved || loading) return;
    setSelectedLine(lineId);
    if (lineId === buggyLineId) {
      setFeedback("Correct! The variable 'mesage' is misspelled.");
      setSolved(true);
      getExplanation();
    } else {
      setFeedback("That's not it. Look closely for typos!");
    }
  };

  const handleReset = () => {
    setSelectedLine(null);
    setFeedback('');
    setExplanation('');
    setLoading(false);
    setSolved(false);
  }

  return (
    <div className="my-8 p-4 bg-slate-900 rounded-2xl shadow-neumorphic-out text-white font-mono">
      <div className="bg-black/20 p-2 rounded-t-lg text-center text-sm text-slate-400">
        Click on the line with the bug.
      </div>
      <div className="p-4">
        {codeLines.map(line => (
          <div
            key={line.id}
            onClick={() => handleLineClick(line.id)}
            className={`cursor-pointer px-2 rounded ${
              selectedLine === line.id ? (line.id === buggyLineId ? 'bg-green-500/30' : 'bg-red-500/30') : 'hover:bg-white/10'
            }`}
          >
            <span className="text-slate-500 select-none mr-4">{line.id}</span>
            <pre className="inline whitespace-pre-wrap">{line.text}</pre>
          </div>
        ))}
      </div>
      {feedback && (
        <div className={`p-4 text-center font-sans font-semibold ${solved ? 'text-pale-green' : 'text-red-400'}`}>
          {feedback}
        </div>
      )}
      { (loading || explanation) && (
        <div className="p-4 border-t border-white/10 font-sans">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2"><SparklesIcon/> AI Explanation</h4>
            {loading ? (
                <p className="text-slate-400 animate-pulse">Generating explanation...</p>
            ) : (
                <p className="text-slate-300 whitespace-pre-wrap">{explanation} {!hasCompleted && "+25 points!"}</p>
            )}
        </div>
      )}
       {solved && (
            <div className="text-center pb-4 pt-2">
                 <button onClick={handleReset} className="px-4 py-2 text-sm rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-sans">Try Again</button>
            </div>
        )}
    </div>
  );
};

export default CodeDebugger;