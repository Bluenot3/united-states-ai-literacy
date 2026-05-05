import React, { useState, useEffect, useRef } from 'react';
import { SendIcon } from '../icons/SendIcon';
import { getAiClient } from '../../services/aiService';
import type { Chat } from '@google/genai';
import { BotIcon } from '../icons/BotIcon';
import { UserIcon } from '../icons/UserIcon';
import type { InteractiveComponentProps } from '../../../../types';
import { useAuth } from '../../../../hooks/useAuth';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const InteractiveChatbot: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
  const { user, addPoints, updateProgress } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasCompleted = user?.modules?.[4]?.completedInteractives.includes(interactiveId);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const ai = await getAiClient();
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: 'You are a friendly, slightly quirky AI assistant in an interactive learning module. Your goal is to have a simple, engaging conversation. Keep your responses very brief (1-2 sentences). You can tell jokes or ask simple questions.'
          }
        });
        setMessages([{ text: "Hello! I'm an AI assistant powered by Gemini. Ask me for a joke!", sender: 'bot' }]);
      } catch (err) {
        setError('Could not initialize the AI chat.');
        console.error(err);
      }
    };
    initializeChat();
  }, []);

  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;
    if (container) container.scrollTop = container.scrollHeight;
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
      if (!hasCompleted) {
        addPoints(1); // Give a point per interaction
      }
    } catch (err) {
      setError('Sorry, I had trouble responding. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 rounded-2xl shadow-neumorphic-out max-w-md mx-auto bg-brand-bg text-brand-text">
      <div className="p-4 border-b border-brand-shadow-dark/50 font-semibold bg-brand-bg rounded-t-2xl">
        AI Assistant (Gemini-Powered)
      </div>
      <div className="h-80 overflow-y-auto p-4 space-y-4 liquid-scrollbar">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && <BotIcon />}
            <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-brand-bg shadow-neumorphic-out-sm text-brand-text-light'}`}>
              {msg.text}
            </div>
            {msg.sender === 'user' && <UserIcon />}
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-2">
            <BotIcon />
            <div className="px-4 py-2 rounded-lg bg-brand-bg shadow-neumorphic-out-sm text-brand-text-light animate-pulse">...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && <p className="p-2 text-center text-red-500 text-sm">{error}</p>}
      <form onSubmit={handleSend} className="p-4 border-t border-brand-shadow-dark/50 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-4 py-3 bg-brand-bg rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
          disabled={loading}
        />
        <button type="submit" className="bg-brand-primary text-white p-3 rounded-full transition-all duration-200 hover:bg-opacity-90 shadow-neumorphic-out hover:shadow-neumorphic-in" disabled={loading}>
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default InteractiveChatbot;