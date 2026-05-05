import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const sampleText = "The quick brown fox jumps over the lazy dog. It was a sunny day.";

const VoiceDrivenEditingDesk: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [text, setText] = useState(sampleText);
    const [command, setCommand] = useState('');
    const [feedback, setFeedback] = useState('');

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleCommand = () => {
        const lowerCmd = command.toLowerCase();
        let newText = text;
        let success = true;

        if (lowerCmd.includes('replace') && lowerCmd.includes('with')) {
            const parts = lowerCmd.split('with');
            const toReplace = parts[0].replace('replace', '').trim();
            const replacer = parts[1].trim();
            newText = text.replace(new RegExp(toReplace, 'gi'), replacer);
        } else if (lowerCmd.includes('delete')) {
            const toDelete = lowerCmd.replace('delete', '').trim();
            newText = text.replace(new RegExp(toDelete, 'gi'), '');
        } else if (lowerCmd.includes('add')) {
            const toAdd = lowerCmd.replace('add', '').trim();
            newText = text + ' ' + toAdd;
        } else {
            success = false;
            setFeedback('Command not recognized. Try "replace [word] with [word]", "delete [word]", or "add [word]".');
        }

        if (success) {
            setText(newText);
            setFeedback(`Executed: ${command}`);
            setCommand('');
            if (!hasCompleted) {
                addPoints(1, 15);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Voice-Driven Editing Desk (Simulation)</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Use text commands to edit the document below.</p>

            <div className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-in mb-4 min-h-[100px]">
                <p className="text-brand-text-light">{text}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                    type="text"
                    value={command}
                    onChange={e => setCommand(e.target.value)}
                    placeholder="e.g., replace fox with cat"
                    className="flex-grow w-full px-4 py-3 bg-brand-bg rounded-full shadow-neumorphic-in"
                />
                <button onClick={handleCommand} className="w-full sm:w-auto flex-shrink-0 px-6 py-3 bg-brand-primary text-white rounded-full shadow-neumorphic-out">
                    Execute Command
                </button>
            </div>

            {feedback && <p className="text-center mt-4 font-semibold text-sm text-brand-text-light">{feedback}</p>}
        </div>
    );
};

export default VoiceDrivenEditingDesk;
