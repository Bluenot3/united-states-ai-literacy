
import React, { useState, useRef, useEffect } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SendIcon } from '../icons/SendIcon';

interface Message {
    sender: 'user' | 'bot';
    text: string;
    id: number;
}

const CAPACITY = 4;

const BOT_RESPONSES = [
    { text: "That's interesting! Tell me more.", trigger: null },
    { text: "Wait, what were we talking about at the start? I can't remember! 🤔", trigger: 'forget' },
    { text: "I see. Go on...", trigger: null },
    { text: "Hmm, that's a good point.", trigger: null },
    { text: "Can you remind me of your name? I think I forgot it... 😅", trigger: 'forget' },
    { text: "Sure! What else?", trigger: null },
    { text: "Sorry, I've lost track of our earlier conversation. What was the topic? 🫠", trigger: 'forget' },
];

const MemoryDecayLab: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: "Hi! I'm a bot with a VERY short memory — I can only remember 4 messages at a time. 🧠 Tell me your name!", id: 1 }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [responseIndex, setResponseIndex] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    useEffect(() => {
        const container = messagesEndRef.current?.parentElement;
        if (container) container.scrollTop = container.scrollHeight;
    }, [messages, loading]);

    const handleSend = () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = { sender: 'user', text: input, id: Date.now() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        if (!hasCompleted && messages.length > 5) {
            addPoints(1, 25);
            updateModuleProgress(1, interactiveId, 'interactive');
        }

        setTimeout(() => {
            const response = BOT_RESPONSES[responseIndex % BOT_RESPONSES.length];
            setResponseIndex(prev => prev + 1);
            const botMessage: Message = { sender: 'bot', text: response.text, id: Date.now() + 1 };
            setMessages(prev => [...prev, botMessage]);
            setLoading(false);
        }, 600 + Math.random() * 400);
    };

    const totalMessages = messages.length;
    const forgottenCount = Math.max(0, totalMessages - CAPACITY);
    const memoryUsed = Math.min(totalMessages, CAPACITY);

    return (
        <div className="my-8 rounded-2xl shadow-neumorphic-out overflow-hidden border border-brand-primary/10">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-rose-500/10 via-brand-accent/5 to-transparent border-b border-brand-shadow-dark/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-lg shadow-md">
                            🧠
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-brand-text">Memory Decay Lab</h4>
                            <p className="text-brand-text-light text-xs">Only remembers the last {CAPACITY} messages</p>
                        </div>
                    </div>
                    {/* Memory indicator */}
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: CAPACITY }, (_, i) => (
                            <div
                                key={i}
                                className={`w-2.5 h-6 rounded-sm transition-all duration-300 ${i < memoryUsed
                                    ? 'bg-gradient-to-t from-brand-primary to-brand-accent shadow-sm'
                                    : 'bg-brand-shadow-dark/20'
                                    }`}
                            />
                        ))}
                        <span className="text-[10px] font-mono text-brand-text-light/50 ml-1">{memoryUsed}/{CAPACITY}</span>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* Chat Area */}
                <div className="max-w-lg mx-auto">
                    <div className="h-80 p-4 bg-brand-bg rounded-xl shadow-neumorphic-in overflow-y-auto space-y-3 relative">
                        {/* Forgotten Zone Banner */}
                        {forgottenCount > 0 && (
                            <div className="sticky top-0 w-full text-center py-1.5 z-10 pointer-events-none">
                                <span className="bg-rose-500/10 text-rose-400 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-rose-500/20 backdrop-blur-sm">
                                    ⚠️ {forgottenCount} message{forgottenCount > 1 ? 's' : ''} forgotten
                                </span>
                            </div>
                        )}

                        {messages.map((msg, index) => {
                            const reverseIndex = totalMessages - 1 - index;
                            const isForgotten = reverseIndex >= CAPACITY;
                            const fadeLevel = isForgotten ? Math.max(0.1, 0.3 - (reverseIndex - CAPACITY) * 0.05) : 1;

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} transition-all duration-700`}
                                    style={{
                                        opacity: fadeLevel,
                                        filter: isForgotten ? `blur(${Math.min(2, (reverseIndex - CAPACITY) * 0.5)}px)` : 'none',
                                        transform: isForgotten ? 'scale(0.97)' : 'scale(1)'
                                    }}
                                >
                                    {msg.sender === 'bot' && (
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-[10px] flex-shrink-0 mr-2 mt-1 shadow-sm">
                                            🤖
                                        </div>
                                    )}
                                    <div className={`px-4 py-2.5 rounded-2xl max-w-[250px] text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                        ? 'bg-gradient-to-br from-brand-primary to-brand-primary/90 text-white rounded-br-md'
                                        : 'bg-brand-bg shadow-neumorphic-out-sm text-brand-text-light rounded-bl-md border border-brand-shadow-light/20'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Typing indicator */}
                        {loading && (
                            <div className="flex items-end gap-2 animate-fade-in">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-[10px] flex-shrink-0">
                                    🤖
                                </div>
                                <div className="px-4 py-3 rounded-2xl bg-brand-bg shadow-neumorphic-out-sm rounded-bl-md border border-brand-shadow-light/20">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-text-light/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-text-light/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-text-light/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="mt-3 flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Chat to push out old memories..."
                            className="flex-grow px-4 py-2.5 bg-brand-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-brand-text text-sm shadow-neumorphic-in placeholder:text-brand-text-light/40"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="p-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl shadow-md disabled:opacity-40 hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                            <SendIcon />
                        </button>
                    </form>
                </div>

                {/* Educational Note */}
                <div className="mt-4 max-w-lg mx-auto p-3 rounded-lg border border-rose-500/10 bg-rose-500/5">
                    <p className="text-[11px] text-brand-text-light/60 leading-relaxed">
                        <span className="text-rose-400 font-bold">💡 What this shows:</span> This is exactly how attention mechanisms work in transformers. Each message competes for space in the context window. When memory is full, the oldest information is lost — the model literally cannot "see" it anymore.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MemoryDecayLab;
