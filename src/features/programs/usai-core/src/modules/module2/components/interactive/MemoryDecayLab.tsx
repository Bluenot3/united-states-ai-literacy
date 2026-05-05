import React, { useState, useRef, useEffect } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SendIcon } from '../icons/SendIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const MemoryDecayLab: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: "Hello! Let's talk. Tell me about your favorite hobby and your favorite color." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    useEffect(() => {
        const container = messagesEndRef.current?.parentElement;
        if (container) container.scrollTop = container.scrollHeight;
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || loading) return;

        // FIX: Explicitly type the new message object to conform to the Message interface.
        // This resolves the TypeScript error where 'sender' was being inferred as a generic string.
        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        // Simple bot response
        setTimeout(() => {
            const botResponses = ["That's interesting!", "Tell me more.", "Fascinating. What else?", "I see."];
            const response = botResponses[Math.floor(Math.random() * botResponses.length)];
            const botMessage: Message = { sender: 'bot', text: response };
            setMessages(prev => [...prev, botMessage]);
            setLoading(false);
        }, 500);
    };

    const handleAnalyze = async () => {
        setLoading(true);
        setAnalysis('');
        const conversationHistory = messages.map(m => `${m.sender}: ${m.text}`).join('\n');

        // Simulate a limited context window by taking only the last few messages
        const shortTermMemory = messages.slice(-4).map(m => `${m.sender}: ${m.text}`).join('\n');

        const prompt = `An AI with a limited memory (it can only remember the last 4 messages) had a longer conversation.
        Full conversation:
        ${conversationHistory}

        The AI's current memory:
        ${shortTermMemory}
        
        Based on its limited memory, what specific details from the START of the conversation has the AI likely forgotten? Be specific. For example, mention favorite colors or hobbies if they are no longer in the short-term memory.`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAnalysis(response.text);
            if (!hasCompleted) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setAnalysis("Error analyzing memory. The concept is that early details like your initial favorite color or hobby would be forgotten as the conversation moves on and they fall out of the limited context window.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Memory Decay Lab</h4>
            <p className="text-center text-brand-text-light mb-4 text-sm">Have a short conversation, then click "Analyze Memory" to see what the AI has 'forgotten'.</p>

            <div className="max-w-lg mx-auto">
                <div className="h-64 p-3 bg-brand-bg rounded-lg shadow-neumorphic-in overflow-y-auto space-y-3 liquid-scrollbar">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-brand-bg shadow-neumorphic-out-sm'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        placeholder="Type here..."
                        className="flex-grow px-4 py-3 bg-brand-bg rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
                    />
                    <button onClick={handleSend} disabled={loading} className="p-3 bg-brand-primary text-white rounded-full shadow-neumorphic-out disabled:opacity-50">
                        <SendIcon />
                    </button>
                </div>

                <div className="text-center mt-4">
                    <button onClick={handleAnalyze} disabled={loading || messages.length < 4} className="inline-flex items-center gap-2 bg-brand-bg text-brand-primary font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50 disabled:cursor-not-allowed">
                        <SparklesIcon />
                        Analyze Memory
                    </button>
                </div>

                {(loading || analysis) && (
                    <div className="mt-4 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                        <h5 className="font-semibold text-brand-text mb-2">AI Memory Analysis</h5>
                        {loading && !analysis && <p className="animate-pulse">Analyzing...</p>}
                        {analysis && <p className="text-brand-text-light">{analysis}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemoryDecayLab;