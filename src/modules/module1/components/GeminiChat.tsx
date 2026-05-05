import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChatIcon } from './icons/ChatIcon';
import { CloseIcon } from './icons/CloseIcon';
import { SendIcon } from './icons/SendIcon';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { getAiClient } from '../services/aiService';
import { useAuth } from '../hooks/useAuth';
import type { Section } from '../types';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';

interface Message {
  text: string;
  sender: 'user' | 'bot' | 'system';
}

interface GeminiChatProps {
  curriculumSummary: string;
  sections: (Section & { parentTitle?: string })[];
}

const GeminiChat: React.FC<GeminiChatProps> = ({ curriculumSummary, sections }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm the ZEN AI Tutor. Ask me anything about the curriculum. You can add specific sections as context using the plus icon.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectorSearch, setSelectorSearch] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const ai = await getAiClient();

      const history = messages
        .filter(m => m.sender !== 'system')
        .slice(1) // Remove initial welcome message
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }));

      let context = '';
      if (selectedSectionIds.length > 0) {
        const contextSections = sections.filter(s => selectedSectionIds.includes(s.id));
        context = "The user has provided the following specific sections as context for their question. Base your answer primarily on this information:\n\n" +
          contextSections.map(s => {
            const contentString = s.content.map(c => {
              if (typeof c.content === 'string') return c.content;
              if (Array.isArray(c.content)) return c.content.join('\n- ');
              return '';
            }).join('\n');
            return `--- SECTION: ${s.parentTitle ? `${s.parentTitle} / ` : ''}${s.title} ---\n${contentString}`;
          }).join('\n\n');
      } else {
        context = `The user has not selected a specific section. Use this general summary of the entire curriculum for context:\n\n${curriculumSummary}`;
      }

      const systemInstruction = `You are a friendly and helpful AI Tutor for the "ZEN AI VANGUARD". Your goal is to help students understand the curriculum. Be encouraging and clear in your explanations. Do not answer questions unrelated to the curriculum. Here is the context for the user's question:\n\n${context}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash',
        contents: {
          role: 'user',
          parts: [{ text: currentInput }],
        },
        history: history,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      const botMessage: Message = { text: response.text, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      console.error("Error with Gemini API:", err);
      const errorMessage: Message = { text: "Sorry, I'm having trouble connecting right now. Please try again later.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSection = (sectionId: string) => {
    setSelectedSectionIds(prev => {
      if (prev.includes(sectionId)) {
        return prev.filter(id => id !== sectionId);
      } else if (prev.length < 5) {
        return [...prev, sectionId];
      }
      return prev; // Max 5 reached
    });
  };

  const selectedSections = useMemo(() =>
    sections.filter(s => selectedSectionIds.includes(s.id)),
    [sections, selectedSectionIds]
  );

  const filteredPopupSections = useMemo(() =>
    sections.filter(s => s.id !== 'overview' && (s.title.toLowerCase().includes(selectorSearch.toLowerCase()) || s.parentTitle?.toLowerCase().includes(selectorSearch.toLowerCase()))),
    [sections, selectorSearch]
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-brand-bg text-brand-primary w-20 h-20 rounded-full flex items-center justify-center transition-all transform animate-chat-bubble-pulse"
        aria-label="Open AI Tutor"
      >
        <ChatIcon />
      </button>
      {isOpen && (
        <div className="fixed bottom-28 right-6 w-80 md:w-96 h-[36rem] glass-card flex flex-col z-50 animate-slide-in-tilt text-brand-text">
          <header className="flex justify-between items-center p-4 bg-transparent border-b border-glass-stroke">
            <h3 className="font-bold text-lg">ZEN AI Tutor</h3>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="text-brand-text-light hover:text-brand-text">
              <CloseIcon />
            </button>
          </header>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 animate-slide-in-up ${msg.sender === 'user' ? 'justify-end' : ''}`} style={{ animationDelay: `${index * 80}ms` }}>
                {msg.sender === 'bot' && <BotIcon />}
                <div className={`px-4 py-2 rounded-xl max-w-xs break-words ${msg.sender === 'user' ? 'bg-brand-primary text-white shadow-soft-lg' : 'bg-white/50 text-brand-text-light shadow-soft-lg'}`}>
                  {msg.text}
                </div>
                {msg.sender === 'user' && <UserIcon />}
              </div>
            ))}
            {loading && <div className="flex justify-start items-center gap-3 animate-slide-in-up"><BotIcon /><div className="px-4 py-2 rounded-xl bg-white/50 text-brand-text-light shadow-soft-lg">Thinking...</div></div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="relative">
            {isSelectorOpen && (
              <div className="absolute bottom-full mb-2 w-full p-2 animate-slide-in-up" style={{ animationDuration: '0.3s' }}>
                <div className="glass-card p-3">
                  <div className="flex items-center gap-2 p-2 border border-glass-stroke rounded-lg mb-2 bg-white/30">
                    <MagnifyingGlassIcon className="w-4 h-4 text-brand-text-light" />
                    <input type="text" value={selectorSearch} onChange={e => setSelectorSearch(e.target.value)} placeholder="Search sections..." className="bg-transparent w-full text-sm focus:outline-none" />
                  </div>
                  <ul className="max-h-48 overflow-y-auto space-y-1 liquid-scrollbar pr-2">
                    {filteredPopupSections.map(section => (
                      <li key={section.id}>
                        <label className="flex items-center gap-2 p-2 rounded-md hover:bg-brand-primary/5 cursor-pointer">
                          <input type="checkbox"
                            checked={selectedSectionIds.includes(section.id)}
                            onChange={() => handleToggleSection(section.id)}
                            disabled={selectedSectionIds.length >= 5 && !selectedSectionIds.includes(section.id)}
                            className="form-checkbox h-4 w-4 rounded text-brand-primary focus:ring-brand-primary/50"
                          />
                          <span className="text-sm">
                            {section.parentTitle && <span className="text-brand-text-light/80">{section.parentTitle.split(':')[0]} / </span>}
                            {section.title}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs text-right text-brand-text-light mt-2 pr-2">{selectedSectionIds.length} / 5 selected</div>
                </div>
              </div>
            )}
            <div className="p-4 border-t border-glass-stroke bg-transparent">
              {selectedSections.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedSections.map(s => (
                    <div key={s.id} className="bg-brand-primary/10 text-brand-primary text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                      <span>{s.title}</span>
                      <button onClick={() => handleToggleSection(s.id)} className="hover:bg-brand-primary/20 rounded-full">
                        <CloseIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <button type="button" onClick={() => setIsSelectorOpen(p => !p)} title="Add Context" className="p-2 text-brand-text-light hover:text-brand-primary transition-colors">
                  <PlusCircleIcon className="w-7 h-7" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={error ? "AI Tutor is unavailable" : "Ask a question..."}
                  className="flex-grow px-4 py-3 bg-brand-bg rounded-full focus:outline-none transition-shadow duration-300 focus:shadow-glowing text-brand-text shadow-soft-inner"
                  disabled={loading || !!error}
                />
                <button type="submit" className="bg-brand-primary text-white p-3 rounded-full hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 shadow-soft-lg" disabled={!input.trim() || loading || !!error}>
                  <SendIcon />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiChat;