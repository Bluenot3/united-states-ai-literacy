import React, { useState, useRef, useEffect } from 'react';
import { getAiClient } from '../services/aiService';
import type { Chat } from '@google/genai';
import { curriculumData } from '../data/curriculumData';
import { ChatIcon } from './icons/ChatIcon';
import { CloseIcon } from './icons/CloseIcon';
import { SendIcon } from './icons/SendIcon';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

const GeminiChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const initializeChat = async () => {
        try {
            const ai = await getAiClient();
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: `You are a helpful AI assistant for the ZEN AI VANGUARD curriculum. Your purpose is to answer student questions about the curriculum content. Be concise and encouraging. Here is the curriculum summary for your context:\n\n${curriculumData.summaryForAI}`,
                },
            });
            setMessages([{ sender: 'bot', text: "Hello! How can I help you with the curriculum today?" }]);
        } catch (err) {
            setError('Could not initialize the AI chat assistant.');
            console.error(err);
        }
    };
    
    useEffect(() => {
        if (isOpen && !chatRef.current) {
            initializeChat();
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading || !chatRef.current) return;

        const userMessage: Message = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setError('');

        try {
            const response = await chatRef.current.sendMessage({ message: input });
            const botMessage: Message = { text: response.text, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            setError('Sorry, I encountered an error. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-brand-primary text-white p-4 rounded-full shadow-neumorphic-out-lg z-50 transition-transform duration-300 hover:scale-110"
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-full max-h-[600px] bg-brand-bg rounded-2xl shadow-neumorphic-out-lg z-50 flex flex-col animate-fade-in-up">
                    <header className="p-4 border-b border-brand-shadow-dark/50 font-semibold text-brand-text">
                        Curriculum Assistant
                    </header>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 liquid-scrollbar">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'bot' && <BotIcon />}
                                <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-brand-bg shadow-neumorphic-out-sm text-brand-text-light'}`}>
                                    {msg.text}
                                </div>
                                 {msg.sender === 'user' && <UserIcon />}
                            </div>
                        ))}
                        {loading && (
                             <div className="flex items-start gap-3">
                                <BotIcon />
                                <div className="px-4 py-2 rounded-lg bg-brand-bg shadow-neumorphic-out-sm text-brand-text-light animate-pulse">...</div>
                             </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                     {error && <p className="p-4 text-center text-red-500 text-sm">{error}</p>}
                    <form onSubmit={handleSend} className="p-4 border-t border-brand-shadow-dark/50 flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-grow px-4 py-3 bg-brand-bg rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
                            disabled={loading}
                        />
                        <button type="submit" className="bg-brand-primary text-white p-3 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50" disabled={loading}>
                            <SendIcon />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default GeminiChat;
