
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

const VoiceDrivenEditingDesk: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [command, setCommand] = useState('Cut after 3 seconds, then add a 50% slow motion effect.');
    const [log, setLog] = useState<string[]>(['Timeline: [0s] Scene_A.mp4 [10s]']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleGenerate = async () => {
        if (!command.trim()) {
            setError('Please enter a command.');
            return;
        }
        setLoading(true);
        setError('');

        const apiPrompt = `You are an AI video editing assistant. A user has given a voice command. Convert this command into a sequence of actions and describe the new state of the video timeline.

Timeline State: "${log[log.length - 1]}"
Command: "${command}"

Respond with a confirmation of the action and the new timeline state. For example: "Action: Applied slow motion. Timeline: [0s] Clip1 [3s] Clip1_slow [7s]"`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: apiPrompt });
            setLog(prev => [...prev, response.text]);

            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to process command.');
            setLog(prev => [...prev, 'Error: Could not process command.']);
        } finally {
            setLoading(false);
            setCommand('');
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Voice-Driven Editing Desk</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Speak (by typing) your edits, and watch the AI modify the timeline.</p>

            <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in mb-4 min-h-[100px]">
                <h5 className="font-semibold text-sm text-brand-text mb-2">Edit Log</h5>
                <div className="font-mono text-xs text-brand-text-light space-y-1">
                    {log.map((entry, i) => <p key={i}>{`> ${entry}`}</p>)}
                    {loading && <p className="animate-pulse">{'>'} Processing...</p>}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
                <input type="text" value={command} onChange={e => setCommand(e.target.value)} className="flex-grow w-full px-4 py-3 bg-brand-bg rounded-full shadow-neumorphic-in" />
                <button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50">
                    {loading ? '...' : 'Execute'}
                </button>
            </div>
        </div>
    );
};

export default VoiceDrivenEditingDesk;
