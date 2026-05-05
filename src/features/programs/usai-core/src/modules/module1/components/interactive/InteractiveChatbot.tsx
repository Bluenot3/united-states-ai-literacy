import React, { useState, useEffect, useRef } from 'react';
import { SendIcon } from '../icons/SendIcon';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp?: string;
}

const TYPING_DELAY = 800;

const InteractiveChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState('name');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      setMessages([{ text: "Hello! I'm a simple rule-based bot. What's your name?", sender: 'bot', timestamp: getTimestamp() }]);
    }, TYPING_DELAY);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages, isTyping]);

  const getBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    if (step === 'name') {
      setStep('chat');
      return `Nice to meet you, ${userInput}! 👋 How can I help you today? Try saying "tell me a joke" or type "help".`;
    }
    if (lowerInput.includes('joke')) {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything! 😄",
        "Why did the neural network break up with the database? There was no connection! 🤖",
        "What do you call an AI that sings? A-Dell! 🎤",
        "Why was the computer cold? It left its Windows open! 💻",
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }
    if (lowerInput.includes('help')) {
      return "I'm a rule-based bot — I follow if/else logic, not AI. I can tell jokes, say hello, or explain how I work. Try: 'how do you work?' 🔍";
    }
    if (lowerInput.includes('how') && lowerInput.includes('work')) {
      return "I match keywords in your input to pre-written responses using if/else statements. Real AI models (like GPT) use neural networks to generate responses probabilistically — a fundamentally different approach! 🧠";
    }
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello there! 👋 How can I assist?";
    }
    if (lowerInput.includes('thank')) {
      return "You're welcome! Happy to help. 😊";
    }
    return "I don't recognize that keyword. This is exactly why rule-based bots are limited — I can only respond to patterns I was programmed for. Try 'help' to see what I can do! 🤔";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { text: input, sender: 'user', timestamp: getTimestamp() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(input);
      const botMessage: Message = { text: botResponse, sender: 'bot', timestamp: getTimestamp() };
      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);
    }, TYPING_DELAY + Math.random() * 600);
  };

  return (
    <div className="my-8 rounded-2xl shadow-neumorphic-out max-w-lg mx-auto bg-brand-bg text-brand-text overflow-hidden border border-brand-primary/10">
      {/* Header */}
      <div className="relative p-4 border-b border-brand-shadow-dark/30 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">
              Z
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-brand-bg animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-brand-text text-sm">ZEN Rule-Based Bot</h4>
            <p className="text-xs text-brand-text-light flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Online — If/Else Logic Only
            </p>
          </div>
        </div>
        <div className="absolute top-3 right-4 text-[10px] font-mono text-brand-text-light/50 bg-brand-bg/50 px-2 py-0.5 rounded-full">
          DEMO
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-brand-bg to-brand-bg/80">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 animate-slide-in-up ${msg.sender === 'user' ? 'justify-end' : ''}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {msg.sender === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-md">
                Z
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <div
                className={`px-4 py-2.5 rounded-2xl max-w-[280px] text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                  ? 'bg-gradient-to-br from-brand-primary to-brand-primary/90 text-white rounded-br-md'
                  : 'bg-brand-bg shadow-neumorphic-out-sm text-brand-text-light rounded-bl-md border border-brand-shadow-light/20'
                  }`}
              >
                {msg.text}
              </div>
              {msg.timestamp && (
                <span className={`text-[10px] text-brand-text-light/40 ${msg.sender === 'user' ? 'text-right' : 'text-left ml-1'}`}>
                  {msg.timestamp}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-end gap-2 animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              Z
            </div>
            <div className="px-4 py-3 rounded-2xl bg-brand-bg shadow-neumorphic-out-sm rounded-bl-md border border-brand-shadow-light/20">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-brand-text-light/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-brand-text-light/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-brand-text-light/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-brand-shadow-dark/20 flex gap-2 overflow-x-auto scrollbar-hide">
        {step === 'chat' && ['Tell me a joke', 'How do you work?', 'Help'].map(suggestion => (
          <button
            key={suggestion}
            onClick={() => {
              setInput(suggestion);
            }}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10 transition-colors whitespace-nowrap"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 border-t border-brand-shadow-dark/30 flex items-center gap-2 bg-brand-bg/50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={step === 'name' ? "Enter your name..." : "Type your message..."}
          disabled={isTyping}
          className="flex-grow px-4 py-2.5 bg-brand-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-brand-text text-sm shadow-neumorphic-in placeholder:text-brand-text-light/40 disabled:opacity-50 transition-all"
        />
        <button
          type="submit"
          disabled={isTyping || !input.trim()}
          className="bg-gradient-to-r from-brand-primary to-brand-accent text-white p-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 shadow-md"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default InteractiveChatbot;