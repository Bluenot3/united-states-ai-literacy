import React, { useState, useEffect, useRef } from 'react';
import { SendIcon } from '../icons/SendIcon';
import { useAuth } from '../../hooks/useAuth';
import type { InteractiveComponentProps } from '../../types';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const InteractiveChatbot: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState('name');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, addPoints, updateProgress } = useAuth();

  useEffect(() => {
    setMessages([{ text: "Hello! I'm a simple rule-based bot. What's your name?", sender: 'bot' }]);
  }, []);

  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  const getBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    if (step === 'name') {
      setStep('chat');
      return `Nice to meet you, ${userInput}! How can I help you today? You can ask me to "tell me a joke" or type "help".`;
    }
    if (lowerInput.includes('joke')) {
      return "Why don't scientists trust atoms? Because they make up everything!";
    }
    if (lowerInput.includes('help')) {
      return "I'm a simple bot. I can tell jokes and that's about it for now! Try asking for a 'joke'.";
    }
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello there! How can I assist?";
    }
    return "I'm not sure how to respond to that. Try asking for 'help'.";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (user && !user.progress.completedInteractives.includes(interactiveId)) {
      addPoints(10);
      updateProgress(interactiveId, 'interactive');
    }

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse = getBotResponse(input);
      const botMessage: Message = { text: botResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    }, 500);

    setInput('');
  };

  return (
    <div className="my-8 rounded-2xl shadow-neumorphic-out max-w-md mx-auto bg-brand-bg text-brand-text">
      <div className="p-4 border-b border-brand-shadow-dark/50 font-semibold bg-brand-bg rounded-t-2xl">
        Rule-Based Chatbot
      </div>
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">Z</div>}
            <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-brand-bg shadow-neumorphic-out-sm text-brand-text-light'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 border-t border-brand-shadow-dark/50 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-4 py-3 bg-brand-bg rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
        />
        <button type="submit" className="bg-brand-primary text-white p-3 rounded-full transition-all duration-200 hover:bg-opacity-90 shadow-neumorphic-out hover:shadow-neumorphic-in">
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default InteractiveChatbot;