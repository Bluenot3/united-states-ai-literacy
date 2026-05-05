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
            setMessages([{ sender: 'bot', text: "Hello! I'm your ZEN AI assistant. How can I help you master today's material?" }]);
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
                className="fixed bottom-8 right-8 bg-brand-primary text-white p-4 rounded-full shadow-lg shadow-brand-primary/30 z-50 transition-all duration-300 hover:scale-105 hover:shadow-xl group active:scale-95"
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>
            
            {isOpen && (
                <div className="fixed bottom-28 right-4 md:right-8 w-[90vw] max-w-[400px] h-[600px] max-h-[75vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col animate-fade-in-up overflow-hidden border border-slate-100 ring-1 ring-black/5">
                    <header className="p-4 border-b border-slate-100 bg-white flex items-center gap-3 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-primary to-brand-secondary"></div>
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                        <span className="font-bold text-slate-800 tracking-wide text-sm">ZEN Assistant</span>
                    </header>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 liquid-scrollbar">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'bot' && <div className="mb-1 transform scale-90"><BotIcon /></div>}
                                <div 
                                    className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm transition-all ${
                                        msg.sender === 'user' 
                                            ? 'bg-brand-primary text-white rounded-br-none' 
                                            : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                                 {msg.sender === 'user' && <div className="mb-1 transform scale-90"><UserIcon /></div>}
                            </div>
                        ))}
                        {loading && (
                             <div className="flex items-end gap-2">
                                <div className="transform scale-90"><BotIcon /></div>
                                <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-white border border-slate-100 shadow-sm flex gap-1.5 items-center h-10">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce animation-delay-100"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce animation-delay-200"></span>
                                </div>
                             </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                     {error && <div className="px-4 py-2 bg-red-50 text-red-500 text-xs text-center border-t border-red-100">{error}</div>}
                    
                    <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-grow px-4 py-2.5 bg-slate-50 rounded-full focus:outline-none focus:ring-1 focus:ring-brand-primary text-slate-800 shadow-inner text-sm placeholder-slate-400 border border-transparent transition-all focus:bg-white focus:border-brand-primary/20"
                            disabled={loading}
                        />
                        <button 
                            type="submit" 
                            className="p-2.5 bg-brand-primary text-white rounded-full shadow-md hover:bg-brand-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                            disabled={loading || !input.trim()}
                        >
                            <SendIcon />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default GeminiChat;