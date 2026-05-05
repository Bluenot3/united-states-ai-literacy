import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

interface Step {
  id: string;
  question: string;
  options?: string[];
  requiresTextInput?: boolean;
  nextStep: (answer: string) => string | null;
}

const FLOW: Record<string, Step> = {
  start: {
    id: 'start',
    question: "Welcome to Vanguard. I am your calibration liaison. To finalize your environment, what brings you here?",
    options: [
      "Upskill my staff",
      "Start a business",
      "Pivoting to AI",
      "Integrate into my business",
      "Just exploring"
    ],
    nextStep: () => 'models_used'
  },
  models_used: {
    id: 'models_used',
    question: "Understood. Which intelligence models are you accustomed to?",
    options: [
      "ChatGPT",
      "Claude",
      "Gemini",
      "Midjourney/DALL-E",
      "None"
    ],
    nextStep: () => 'professional'
  },
  professional: {
    id: 'professional',
    question: "Are you operating as a working professional right now?",
    options: ["Yes", "No"],
    nextStep: (answer) => (answer === 'Yes' ? 'industry' : 'parent')
  },
  industry: {
    id: 'industry',
    question: "Specify your industry and current organization.",
    requiresTextInput: true,
    nextStep: () => 'parent'
  },
  parent: {
    id: 'parent',
    question: "Finally, are you managing children alongside your work? (This optimizes pacing).",
    options: ["Yes, managing kids", "No"],
    nextStep: () => 'finish'
  },
  finish: {
    id: 'finish',
    question: "Calibration locked in. Initializing your hub...",
    nextStep: () => null
  }
};

export const OnboardingChat: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepId, setCurrentStepId] = useState<string>('start');
  const [inputText, setInputText] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
        const scrollHeight = containerRef.current.scrollHeight;
        containerRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiProcessing]);

  useEffect(() => {
    pushAiMessage(FLOW['start'].question);
  }, []);

  const pushAiMessage = (text: string) => {
    setIsAiProcessing(true);
    // Drastically reduced delay for speed and premium feel
    setTimeout(() => {
      setIsAiProcessing(false);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text }]);
    }, 400); 
  };

  const handleUserAnswer = (answer: string) => {
    if (!answer.trim() || isAiProcessing) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: answer }]);
    setInputText('');

    const step = FLOW[currentStepId];
    const nextStepId = step.nextStep(answer);

    if (nextStepId && FLOW[nextStepId]) {
      setCurrentStepId(nextStepId);
      pushAiMessage(FLOW[nextStepId].question);
      if (nextStepId === 'finish') {
        setTimeout(() => {
          handleComplete();
        }, 800);
      }
    } else {
      setTimeout(() => {
        handleComplete();
      }, 500);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('zen_onboarding_answered', 'true');
    onComplete();
  };

  const currentStep = FLOW[currentStepId];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 pointer-events-none">
      {/* Blurred background interceptor that still lets dashboard breathe */}
      <div className="absolute inset-0 bg-[#02050E]/60 backdrop-blur-[6px] pointer-events-auto" />
      
      {/* HUD Container */}
      <div className="relative flex flex-col w-full max-w-2xl max-h-[85vh] h-[550px] border border-white/5 bg-gradient-to-b from-[#060B18]/95 to-[#02040A]/95 overflow-hidden rounded-[2rem] shadow-[0_0_80px_rgba(201,168,76,0.06),_inset_0_1px_1px_rgba(255,255,255,0.05)] pointer-events-auto transition-transform duration-500 ease-out animate-in zoom-in-95 fade-in">
        
        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-zen-gold/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Minimalist Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center h-4 w-4">
               <div className="absolute inset-0 rounded-full border border-zen-gold animate-[spin_3s_linear_infinite]" />
               <div className="h-1.5 w-1.5 rounded-full bg-zen-gold shadow-[0_0_8px_rgba(201,168,76,1)]" />
            </div>
            <div>
                <h2 className="font-mono text-xs tracking-[0.3em] text-white/90 uppercase m-0 leading-tight">Vanguard Telemetry</h2>
            </div>
          </div>
          <button 
            onClick={handleComplete}
            className="group flex items-center gap-2 text-[10px] font-mono text-white/40 hover:text-white transition-all tracking-[0.2em] uppercase px-4 py-1.5 rounded-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5"
          >
            <span>Bypass</span>
            <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>

        {/* Stream Area */}
        <div ref={containerRef} className="flex-1 overflow-y-auto px-8 py-8 space-y-6 liquid-scrollbar font-mono text-sm relative z-10 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {msg.sender === 'user' ? (
                <div className="flex w-full justify-end">
                  <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 px-4 py-3 rounded-xl max-w-[85%] shadow-sm">
                    <span className="text-white/80 leading-relaxed tracking-wide">{msg.text}</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)] shrink-0" />
                  </div>
                </div>
              ) : (
                <div className="flex w-full justify-start items-start gap-4 max-w-[90%]">
                  <div className="h-4 w-4 shrink-0 rounded-sm bg-gradient-to-br from-zen-gold to-yellow-600 mt-1 shadow-[0_0_10px_rgba(201,168,76,0.3)]" />
                  <p className="text-white/60 leading-relaxed tracking-wide text-[13px] pt-0.5">{msg.text}</p>
                </div>
              )}
            </div>
          ))}
          
          {isAiProcessing && (
            <div className="flex w-full justify-start items-center gap-4 animate-in fade-in duration-200">
              <div className="h-4 w-4 shrink-0 rounded-sm border border-zen-gold/50 bg-transparent animate-pulse" />
              <div className="flex gap-1.5 items-center">
                <span className="text-xs text-zen-gold/60 uppercase tracking-widest font-mono">Syncing</span>
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 bg-zen-gold/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 bg-zen-gold/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 bg-zen-gold/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Region */}
        <div className="px-8 pb-8 pt-4 relative z-10">
          {currentStep && !isAiProcessing && currentStep.id !== 'finish' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-4">
              
              {/* Option Tiles (Premium variants) */}
              {currentStep.options && (
                <div className="flex flex-wrap gap-2.5">
                  {currentStep.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleUserAnswer(opt)}
                      className="px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-white/70 font-mono text-xs tracking-wide
                                 hover:bg-zen-gold/10 hover:text-zen-gold hover:border-zen-gold/30 transition-all duration-200
                                 active:scale-95 text-left flex items-center justify-between group"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Text Input (Sleek Command Line style) */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleUserAnswer(inputText); }}
                className="relative group mt-2"
              >
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zen-gold/50 font-mono text-sm">
                  {'>_'}
                </div>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={currentStep.requiresTextInput ? "Awaiting input..." : "Or submit custom directive..."}
                  className="w-full bg-[#030612] border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white/90 placeholder:text-white/20 focus:outline-none focus:border-zen-gold/40 focus:bg-white/[0.02] transition-all text-xs font-mono shadow-inner"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/30 hover:text-zen-gold disabled:opacity-0 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                  </svg>
                </button>
              </form>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
