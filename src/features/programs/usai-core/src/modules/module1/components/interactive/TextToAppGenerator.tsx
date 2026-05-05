
import React, { useState, useEffect, useRef } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';
import CodeBlock from '../CodeBlock';

type AppType = 'todo' | 'color' | 'timer' | 'crypto' | 'game';

interface AppConfig {
    id: AppType;
    title: string;
    description: string;
    code: string;
}

const apps: AppConfig[] = [
    {
        id: 'todo',
        title: 'Task Manager',
        description: 'A clean to-do list with state management.',
        code: `function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // ... (Task logic)

  return (
    <div className="card">
      <h3>My Tasks</h3>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTask}>Add</button>
      <ul>{tasks.map(t => <li>{t}</li>)}</ul>
    </div>
  );
}`
    },
    {
        id: 'crypto',
        title: 'Crypto Dashboard',
        description: 'Live-simulated price tracker with trend indicators.',
        code: `function CryptoDashboard() {
  const [prices, setPrices] = useState({ BTC: 98000, ETH: 3200, SOL: 145 });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live market data updates
      setPrices(prev => ({
        BTC: prev.BTC + (Math.random() - 0.5) * 50,
        ETH: prev.ETH + (Math.random() - 0.5) * 10,
        SOL: prev.SOL + (Math.random() - 0.5) * 2
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <h2>Market Live</h2>
      <PriceCard symbol="BTC" price={prices.BTC} />
      <PriceCard symbol="ETH" price={prices.ETH} />
      <PriceCard symbol="SOL" price={prices.SOL} />
    </div>
  );
}`
    },
    {
        id: 'game',
        title: 'Neon Clicker',
        description: 'A retro-style idle game with particle effects.',
        code: `function NeonClicker() {
  const [score, setScore] = useState(0);
  const [particles, setParticles] = useState([]);

  const handleClick = (e) => {
    setScore(s => s + 1);
    spawnParticles(e.clientX, e.clientY);
  };

  return (
    <div className="game-container" onClick={handleClick}>
      <h1 className="neon-text">{score}</h1>
      <p>Tap to generate energy</p>
      {particles.map(p => <Particle key={p.id} {...p} />)}
    </div>
  );
}`
    },
    {
        id: 'color',
        title: 'Mood Picker',
        description: 'Dynamic background color changer.',
        code: `function ColorChanger() {
  const [color, setColor] = useState("#FFFFFF");
  // ... (Color logic)
  return (
    <div style={{ backgroundColor: color }}>
      <button onClick={changeColor}>Change Mood</button>
    </div>
  );
}`
    },
    {
        id: 'timer',
        title: 'Focus Timer',
        description: 'Productivity countdown timer.',
        code: `function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  // ... (Timer logic)
  return (
    <div className="timer">
      <h1>{format(timeLeft)}</h1>
      <button onClick={toggle}>Start/Stop</button>
    </div>
  );
}`
    }
];

// --- Mini App Implementations for Live Preview ---

const MiniTodo = () => {
    const [tasks, setTasks] = useState<{text: string, done: boolean}[]>([]);
    const [input, setInput] = useState("");
    return (
        <div className="p-4 bg-white rounded-xl shadow-lg text-brand-text w-full max-w-xs mx-auto">
            <h3 className="font-bold mb-3">My Tasks</h3>
            <div className="flex gap-2 mb-3">
                <input value={input} onChange={(e) => setInput(e.target.value)} className="border border-gray-200 p-2 rounded text-sm flex-grow outline-none" placeholder="Add task..." />
                <button onClick={() => { if(input) { setTasks([...tasks, {text: input, done: false}]); setInput(""); }}} className="bg-brand-primary text-white px-3 py-1 rounded text-sm hover:bg-brand-primary-light">Add</button>
            </div>
            <ul className="space-y-1">
                {tasks.length === 0 && <li className="text-xs text-gray-400 italic">No tasks yet.</li>}
                {tasks.map((t, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                        <div className="w-2 h-2 rounded-full bg-brand-secondary"></div>
                        <span className="flex-grow">{t.text}</span>
                        <button onClick={() => setTasks(tasks.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">×</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const MiniColor = () => {
    const [color, setColor] = useState("#FFFFFF");
    const colors = ["#FDE047", "#F9A8D4", "#67E8F9", "#86EFAC", "#C4B5FD"];
    return (
        <div className="p-8 rounded-xl shadow-lg text-center transition-colors duration-500 w-full max-w-xs mx-auto flex flex-col items-center justify-center h-48" style={{ backgroundColor: color }}>
            <h3 className="font-bold text-gray-800 mb-2 bg-white/50 px-2 rounded">Hex: {color}</h3>
            <button onClick={() => setColor(colors[Math.floor(Math.random() * colors.length)])} className="bg-white text-brand-text px-4 py-2 rounded-full shadow-md text-sm font-semibold hover:scale-105 transition-transform">
                Splash Color
            </button>
        </div>
    );
};

const MiniTimer = () => {
    const [time, setTime] = useState(1500);
    const [active, setActive] = useState(false);
    useEffect(() => {
        let interval: any;
        if(active && time > 0) interval = setInterval(() => setTime(t => t - 1), 1000);
        else if (time === 0) setActive(false);
        return () => clearInterval(interval);
    }, [active, time]);
    const format = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };
    return (
        <div className="p-6 bg-slate-800 text-white rounded-xl shadow-lg text-center w-full max-w-xs mx-auto">
            <h3 className="text-lg font-bold mb-2 text-brand-secondary">Focus Timer</h3>
            <div className="text-4xl font-mono mb-4 text-white tracking-widest">{format(time)}</div>
            <div className="flex justify-center gap-3">
                <button onClick={() => setActive(!active)} className={`px-4 py-1.5 rounded-lg font-bold text-sm ${active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                    {active ? 'Pause' : 'Start'}
                </button>
                <button onClick={() => { setActive(false); setTime(1500); }} className="px-4 py-1.5 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm">
                    Reset
                </button>
            </div>
        </div>
    );
};

const MiniCrypto = () => {
    const [prices, setPrices] = useState({ BTC: 98420.50, ETH: 3210.25, SOL: 145.80 });
    const [flash, setFlash] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setPrices(prev => {
                const change = Math.random() > 0.5;
                setFlash(change ? 'green' : 'red');
                setTimeout(() => setFlash(null), 300);
                return {
                    BTC: prev.BTC + (Math.random() - 0.5) * 50,
                    ETH: prev.ETH + (Math.random() - 0.5) * 10,
                    SOL: prev.SOL + (Math.random() - 0.5) * 2
                };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-5 bg-slate-900 text-white rounded-xl shadow-lg w-full max-w-xs mx-auto font-mono">
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                <h3 className="font-bold text-brand-secondary">CRYPTO LIVE</h3>
                <span className="text-[10px] animate-pulse text-green-400">● LIVE</span>
            </div>
            <div className="space-y-3">
                {Object.entries(prices).map(([symbol, price]) => (
                    <div key={symbol} className="flex justify-between items-center bg-slate-800 p-2 rounded">
                        <span className="font-bold text-slate-400">{symbol}</span>
                        <span className={`transition-colors duration-300 ${flash === 'green' ? 'text-green-400' : flash === 'red' ? 'text-red-400' : 'text-white'}`}>
                            ${(price as number).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MiniGame = () => {
    const [score, setScore] = useState(0);
    const [clicks, setClicks] = useState<{id: number, x: number, y: number}[]>([]);

    const handleClick = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setScore(s => s + 1);
        const id = Date.now();
        setClicks(prev => [...prev, {id, x, y}]);
        setTimeout(() => setClicks(prev => prev.filter(c => c.id !== id)), 800);
    };

    return (
        <div 
            onClick={handleClick}
            className="p-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl shadow-lg w-full max-w-xs mx-auto h-48 relative overflow-hidden cursor-pointer select-none border-2 border-purple-500/30 hover:border-purple-400 transition-colors"
        >
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-purple-300 text-xs tracking-widest uppercase mb-1">Neon Clicker</span>
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                    {score}
                </span>
                <span className="text-[10px] text-purple-300/50 mt-2">TAP TO GENERATE</span>
            </div>
            {clicks.map(c => (
                <div 
                    key={c.id} 
                    className="absolute text-xl font-bold text-yellow-300 animate-float-up-fade pointer-events-none"
                    style={{ left: c.x, top: c.y }}
                >
                    +1
                </div>
            ))}
        </div>
    );
};


const TextToAppGenerator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [stage, setStage] = useState<'idle' | 'coding' | 'preview'>('idle');
    const [selectedAppId, setSelectedAppId] = useState<AppType | null>(null);
    const [typedCode, setTypedCode] = useState('');
    
    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    const handleSelect = (id: AppType) => {
        setSelectedAppId(id);
        setStage('coding');
        setTypedCode('');
    };

    const handleReset = () => {
        setStage('idle');
        setSelectedAppId(null);
        setTypedCode('');
    }

    useEffect(() => {
        if (stage === 'coding' && selectedAppId) {
            const app = apps.find(a => a.id === selectedAppId);
            if (!app) return;

            let i = 0;
            const fullCode = app.code;
            const interval = setInterval(() => {
                setTypedCode(fullCode.substring(0, i));
                i += 5; // Type fast
                if (i > fullCode.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setStage('preview');
                        if (!hasCompleted) {
                            addPoints(1, 25);
                            updateModuleProgress(1, interactiveId, 'interactive');
                        }
                    }, 800);
                }
            }, 10);
            return () => clearInterval(interval);
        }
    }, [stage, selectedAppId, addPoints, updateModuleProgress,  interactiveId, hasCompleted]);

    const selectedApp = apps.find(a => a.id === selectedAppId);

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Text-to-App Generator</h4>
            <p className="text-center text-brand-text-light mb-6 text-sm">Select a prompt card to simulate generating a functional mini-app from scratch.</p>

            {stage === 'idle' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {apps.map(app => (
                        <button 
                            key={app.id}
                            onClick={() => handleSelect(app.id)}
                            className="p-6 bg-brand-bg rounded-xl shadow-neumorphic-out hover:shadow-neumorphic-in transition-all duration-300 transform hover:-translate-y-1 text-left group border border-white/50"
                        >
                            <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-primary/20 transition-colors">
                                <SparklesIcon />
                            </div>
                            <h5 className="font-bold text-brand-text mb-2">{app.title}</h5>
                            <p className="text-xs text-brand-text-light">{app.description}</p>
                            <div className="mt-4 text-xs font-mono text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                &gt; Generate Code...
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {stage === 'coding' && selectedApp && (
                <div className="animate-fade-in">
                    <div className="flex items-center gap-2 mb-2 text-sm font-mono text-brand-text-light">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Generating {selectedApp.title}...
                    </div>
                    <div className="h-64 overflow-hidden rounded-lg relative border border-slate-700 shadow-xl">
                        <CodeBlock code={typedCode} language="javascript" />
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}

            {stage === 'preview' && selectedApp && (
                <div className="animate-slide-in-up">
                    <div className="flex justify-between items-center mb-4">
                        <h5 className="font-bold text-brand-text flex items-center gap-2">
                            <span className="text-green-500">●</span> Simulation Complete
                        </h5>
                        <button onClick={handleReset} className="text-xs text-brand-text-light hover:text-brand-primary underline">
                            Create Another
                        </button>
                    </div>
                    
                    {/* Window Frame */}
                    <div className="bg-slate-200 rounded-xl overflow-hidden shadow-2xl border border-slate-300">
                        {/* Window Header */}
                        <div className="bg-slate-300 px-4 py-2 flex items-center gap-2 border-b border-slate-400/30">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/30"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500/30"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/30"></div>
                            </div>
                            <div className="flex-grow text-center text-xs font-semibold text-slate-500">localhost:3000 — {selectedApp.title}</div>
                        </div>
                        {/* Window Body */}
                        <div className="p-8 bg-brand-bg/50 flex items-center justify-center min-h-[300px] backdrop-blur-sm">
                            {selectedApp.id === 'todo' && <MiniTodo />}
                            {selectedApp.id === 'color' && <MiniColor />}
                            {selectedApp.id === 'timer' && <MiniTimer />}
                            {selectedApp.id === 'crypto' && <MiniCrypto />}
                            {selectedApp.id === 'game' && <MiniGame />}
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-brand-primary/5 rounded-lg border border-brand-primary/10">
                        <p className="text-xs text-brand-text-light text-center">
                            <strong>How it works:</strong> LLMs understand code syntax just like human languages. They predict the next logical line of JavaScript, connecting UI elements (buttons, inputs) to logic (state, events), creating functional software from simple English instructions.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextToAppGenerator;
