
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface ChatMessage {
    id: number;
    sender: 'user' | 'bot' | 'system';
    text?: string;
    imageUrl?: string;
    isLoading?: boolean;
}

interface Preset {
    prompt: string;
    icon: string;
    responseText: string | null;
    responseImage: string | null;
}

const presets: Preset[] = [
    {
        prompt: "Describe a futuristic city where nature and technology coexist.",
        icon: "🏙️",
        responseText: "Bioluminescent vines climb chrome skyscrapers, their light pulsing in sync with the city's data streams. Flying vehicles shaped like manta rays glide silently between buildings, while citizens walk through parks where robotic animals roam freely.",
        responseImage: null
    },
    {
        prompt: "Generate an image of a 'cybernetic philosopher cat' pondering the universe.",
        icon: "🐱",
        responseText: null,
        responseImage: "https://storage.googleapis.com/aistudio-marketplace/project-b841f4f14704439a9335d11889895a09/releases/v0TfOaM/assets/cybernetic_cat.png"
    },
    {
        prompt: "Write a short poem about a digital ghost.",
        icon: "👻",
        responseText: "In circuits deep, where memories sleep,\nA phantom trace, a promise to keep.\nNo form to hold, no voice to call,\nJust data streams, beyond the wall.\nA digital ghost, in the machine's cold heart,\nA silent echo, a work of art.",
        responseImage: null
    },
];

const ApiKeyChatSimulator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const [noApiMessages, setNoApiMessages] = useState<ChatMessage[]>([]);
    const [withApiMessages, setWithApiMessages] = useState<ChatMessage[]>([]);
    const [isAnimatingKey, setIsAnimatingKey] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

    const intervalRef = useRef<number | null>(null);
    const noApiScrollRef = useRef<HTMLDivElement>(null);
    const withApiScrollRef = useRef<HTMLDivElement>(null);

    // Scroll within the chat container only — not the page
    const scrollChatToBottom = useCallback((containerRef: React.RefObject<HTMLDivElement | null>) => {
        requestAnimationFrame(() => {
            if (containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        });
    }, []);

    useEffect(() => { scrollChatToBottom(noApiScrollRef); }, [noApiMessages, scrollChatToBottom]);
    useEffect(() => { scrollChatToBottom(withApiScrollRef); }, [withApiMessages, scrollChatToBottom]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handlePresetClick = (preset: Preset, index: number) => {
        if (isAnimatingKey) return;

        if (intervalRef.current) clearInterval(intervalRef.current);

        setIsAnimatingKey(true);
        setSelectedPreset(index);
        if (!hasCompleted) {
            addPoints(1, 15);
            updateModuleProgress(1, interactiveId, 'interactive');
        }

        const userMessageId = Date.now();
        const botMessageId = userMessageId + 1;
        const userMessage: ChatMessage = { id: userMessageId, sender: 'user', text: preset.prompt };
        const loadingMessage: ChatMessage = { id: botMessageId, sender: 'bot', isLoading: true };

        setNoApiMessages(prev => [...prev, userMessage]);
        setWithApiMessages(prev => [...prev, userMessage, loadingMessage]);

        // No-API side: error after delay
        setTimeout(() => {
            setNoApiMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'system',
                text: '⛔ HTTP 401: Authentication Failed — No API key provided. Request rejected by server.'
            }]);
        }, 800);

        // With-API side: success after delay
        setTimeout(() => {
            setWithApiMessages(prev => prev.map(msg =>
                msg.id === botMessageId
                    ? { ...msg, isLoading: false, text: preset.responseText ? '' : undefined, imageUrl: preset.responseImage || undefined }
                    : msg
            ));

            if (preset.responseText) {
                let i = 0;
                const fullText = preset.responseText;
                intervalRef.current = window.setInterval(() => {
                    i++;
                    const currentText = fullText.substring(0, i);
                    const cursor = i < fullText.length ? '▋' : '';

                    setWithApiMessages(prev => prev.map(msg =>
                        msg.id === botMessageId ? { ...msg, text: currentText + cursor } : msg
                    ));

                    if (i >= fullText.length) {
                        clearInterval(intervalRef.current!);
                        intervalRef.current = null;
                        setWithApiMessages(prev => prev.map(msg =>
                            msg.id === botMessageId ? { ...msg, text: fullText } : msg
                        ));
                    }
                }, 20);
            }
        }, 1500);

        setTimeout(() => {
            setIsAnimatingKey(false);
        }, 3500);
    };

    const MessageBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => (
        <div className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 shadow-sm">
                    Z
                </div>
            )}
            {msg.sender === 'system' && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 shadow-sm">
                    !
                </div>
            )}
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm break-words shadow-sm ${msg.sender === 'user'
                ? 'bg-gradient-to-br from-brand-primary to-brand-primary/90 text-white rounded-br-md'
                : msg.sender === 'system'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-bl-md font-mono text-xs'
                    : 'bg-brand-bg shadow-neumorphic-out-sm text-brand-text-light rounded-bl-md border border-brand-shadow-light/20'
                }`}>
                {msg.isLoading ? (
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-[10px] text-brand-text-light/40 font-mono">Processing...</span>
                    </div>
                ) : (
                    <>
                        {msg.text && <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>}
                        {msg.imageUrl && (
                            <img src={msg.imageUrl} alt="Generated by AI" className="rounded-lg mt-2 animate-fade-in max-w-full" />
                        )}
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="my-8 rounded-2xl shadow-neumorphic-out overflow-hidden border border-brand-primary/10">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent border-b border-brand-shadow-dark/20">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-lg shadow-md">
                        🔑
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-brand-text">API Key Simulation</h4>
                        <p className="text-brand-text-light text-xs">See the difference between authenticated and unauthenticated API requests</p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                {/* Key Animation Diagram */}
                <div className="flex items-center justify-center gap-4 mb-5 py-4 bg-brand-bg rounded-xl shadow-neumorphic-in">
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="text-2xl">👤</div>
                        <p className="text-[10px] font-mono text-brand-text-light/50">User</p>
                    </div>

                    <div className="flex items-center gap-1">
                        <div className={`h-0.5 w-8 rounded-full transition-colors duration-500 ${isAnimatingKey ? 'bg-brand-primary' : 'bg-brand-shadow-dark/20'}`} />
                        <div className={`text-xl transition-all duration-300 ${isAnimatingKey ? 'scale-125' : 'scale-100'}`}>
                            {isAnimatingKey ? '🔐' : '🔒'}
                        </div>
                        <div className={`h-0.5 w-8 rounded-full transition-colors duration-500 ${isAnimatingKey ? 'bg-brand-primary' : 'bg-brand-shadow-dark/20'}`} />
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                        <div className="text-2xl">🧠</div>
                        <p className="text-[10px] font-mono text-brand-text-light/50">AI Model</p>
                    </div>
                </div>

                {/* Two Chat Windows */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    {/* Without API Key */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                            <h5 className="font-bold text-sm text-brand-text">Without API Key</h5>
                            <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/10 text-rose-400 rounded-full font-mono">401</span>
                        </div>
                        <div
                            ref={noApiScrollRef}
                            className="h-64 p-3 bg-brand-bg rounded-xl shadow-neumorphic-in overflow-y-auto space-y-3"
                        >
                            {noApiMessages.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-brand-text-light/30 text-sm">
                                    <div className="text-center">
                                        <div className="text-3xl mb-2">🚫</div>
                                        <p>No key — requests will fail</p>
                                    </div>
                                </div>
                            ) : (
                                noApiMessages.map(msg => <MessageBubble key={msg.id} msg={msg} />)
                            )}
                        </div>
                    </div>

                    {/* With API Key */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <h5 className="font-bold text-sm text-brand-text">With API Key</h5>
                            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full font-mono">200 OK</span>
                        </div>
                        <div
                            ref={withApiScrollRef}
                            className="h-64 p-3 bg-brand-bg rounded-xl shadow-neumorphic-in overflow-y-auto space-y-3"
                        >
                            {withApiMessages.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-brand-text-light/30 text-sm">
                                    <div className="text-center">
                                        <div className="text-3xl mb-2">✅</div>
                                        <p>Authenticated — ready to respond</p>
                                    </div>
                                </div>
                            ) : (
                                withApiMessages.map(msg => <MessageBubble key={msg.id} msg={msg} />)
                            )}
                        </div>
                    </div>
                </div>

                {/* Preset Prompts */}
                <div>
                    <p className="text-[10px] font-mono text-brand-text-light/40 mb-2 uppercase tracking-wider">Send a prompt to both terminals</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {presets.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => handlePresetClick(p, i)}
                                disabled={isAnimatingKey}
                                className={`p-3 text-sm text-left rounded-xl transition-all duration-200 flex items-start gap-2 ${selectedPreset === i
                                    ? 'shadow-neumorphic-in bg-gradient-to-r from-brand-primary/10 to-transparent text-brand-primary border border-brand-primary/20'
                                    : 'shadow-neumorphic-out hover:shadow-neumorphic-in text-brand-text-light border border-transparent'
                                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                            >
                                <span className="text-lg flex-shrink-0">{p.icon}</span>
                                <span className="line-clamp-2">{p.prompt}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Educational Note */}
                <div className="mt-4 p-3 rounded-lg border border-brand-primary/10 bg-brand-primary/5">
                    <p className="text-[11px] text-brand-text-light/60 leading-relaxed">
                        <span className="text-brand-primary font-bold">💡 What's an API Key?</span> It's like a password for software. When your app sends a request to an AI model (like GPT or Gemini), the API key proves you're authorized. Without it, the server rejects your request with a 401 Unauthorized error.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyChatSimulator;