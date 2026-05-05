import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';
import { getAiClient } from '../../services/aiService';
import type { InteractiveComponentProps } from '../../types';

const CpuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
);

const BulbIcon = ({ on }: { on: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-8 w-8 transition-colors duration-300 ${on ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'text-slate-600'}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const CubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

interface LogEntry {
    id: string;
    timestamp: string;
    type: 'input' | 'thought' | 'tool_call' | 'tool_result' | 'error';
    content: string;
    metadata?: unknown;
}

type ToolDecision = {
    tool: 'iot_control' | 'search_web' | 'mint_token' | 'calculate' | 'none';
    args: Record<string, any>;
    reasoning: string;
};

function tokenizeExpression(expression: string): string[] {
    const cleaned = expression.replace(/\s+/g, '');

    if (!/^[0-9+\-*/().]+$/.test(cleaned)) {
        throw new Error('Unsupported characters in expression.');
    }

    return cleaned.match(/\d*\.?\d+|[()+\-*/]/g) || [];
}

function evaluateExpression(expression: string): number {
    const tokens = tokenizeExpression(expression);
    let index = 0;

    function peek() {
        return tokens[index];
    }

    function consume(expected?: string) {
        const token = tokens[index];

        if (expected && token !== expected) {
            throw new Error(`Expected ${expected} but received ${token ?? 'end of input'}.`);
        }

        index += 1;
        return token;
    }

    function parseFactor(): number {
        const token = peek();

        if (token === '+') {
            consume('+');
            return parseFactor();
        }

        if (token === '-') {
            consume('-');
            return -parseFactor();
        }

        if (token === '(') {
            consume('(');
            const value = parseExpressionInternal();
            consume(')');
            return value;
        }

        if (!token) {
            throw new Error('Unexpected end of expression.');
        }

        consume();
        const value = Number(token);

        if (Number.isNaN(value)) {
            throw new Error('Invalid numeric token.');
        }

        return value;
    }

    function parseTerm(): number {
        let value = parseFactor();

        while (peek() === '*' || peek() === '/') {
            const operator = consume();
            const nextValue = parseFactor();
            value = operator === '*' ? value * nextValue : value / nextValue;
        }

        return value;
    }

    function parseExpressionInternal(): number {
        let value = parseTerm();

        while (peek() === '+' || peek() === '-') {
            const operator = consume();
            const nextValue = parseTerm();
            value = operator === '+' ? value + nextValue : value - nextValue;
        }

        return value;
    }

    const result = parseExpressionInternal();

    if (index !== tokens.length) {
        throw new Error('Expression could not be fully parsed.');
    }

    return result;
}

function coerceDecision(payload: string): ToolDecision {
    const parsed = JSON.parse(payload);
    return {
        tool: parsed.tool || 'none',
        args: parsed.args || {},
        reasoning: parsed.reasoning || 'No reasoning returned.',
    };
}

const ToolCallDashboard: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [command, setCommand] = useState('');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [lightsOn, setLightsOn] = useState(false);
    const [temperature, setTemperature] = useState(72);
    const [walletBalance, setWalletBalance] = useState(0);
    const [lastSearchResult, setLastSearchResult] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const addLog = (type: LogEntry['type'], content: string, metadata?: unknown) => {
        setLogs((previous) => [
            ...previous,
            {
                id: crypto.randomUUID(),
                timestamp: new Date().toLocaleTimeString(),
                type,
                content,
                metadata,
            },
        ]);
    };

    const handleCommand = async (cmdOverride?: string) => {
        const inputCmd = cmdOverride || command;

        if (!inputCmd.trim()) {
            return;
        }

        setIsProcessing(true);
        addLog('input', inputCmd);
        setCommand('');

        try {
            const ai = await getAiClient();
            const toolsPrompt = `
You are an autonomous agent controller. Choose the best tool for the user's command.

Available tools:
1. "iot_control": { device: "lights" | "thermostat", action: "on" | "off" | "set", value?: number }
2. "search_web": { query: string }
3. "mint_token": { amount: number, symbol: "ZLT" }
4. "calculate": { expression: string }

Return JSON only:
{ "tool": string, "args": object, "reasoning": "brief thought process" }

If no tool fits, return:
{ "tool": "none", "args": {}, "reasoning": "explanation" }

User command: "${inputCmd}"`;

            addLog('thought', 'Analyzing the request and selecting a tool...');

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: toolsPrompt,
                config: { responseMimeType: 'application/json' },
            });

            const decision = coerceDecision(response.text);

            await new Promise((resolve) => setTimeout(resolve, 800));

            addLog('thought', decision.reasoning);
            addLog('tool_call', `Invoking ${decision.tool}`, decision.args);

            let resultMessage = 'No suitable tool found for this request.';

            switch (decision.tool) {
                case 'iot_control':
                    if (decision.args.device === 'lights') {
                        const nextState = decision.args.action === 'on';
                        setLightsOn(nextState);
                        resultMessage = `Lights turned ${nextState ? 'on' : 'off'}.`;
                    } else if (decision.args.device === 'thermostat') {
                        const nextTemperature = Number(decision.args.value);
                        if (!Number.isNaN(nextTemperature)) {
                            setTemperature(nextTemperature);
                            resultMessage = `Thermostat set to ${nextTemperature} F.`;
                        } else {
                            resultMessage = 'Thermostat update failed because the target temperature was invalid.';
                        }
                    }
                    break;

                case 'mint_token': {
                    const amount = Number(decision.args.amount) || 1;
                    setWalletBalance((previous) => previous + amount);
                    resultMessage = `Minted ${amount} ZLT. Transaction hash: 0x${crypto.randomUUID().replace(/-/g, '').slice(0, 32)}`;
                    break;
                }

                case 'search_web':
                    setLastSearchResult(`Results for "${decision.args.query}": AI adoption is rising across workflows, education, and operations.`);
                    resultMessage = `Found sample results for "${decision.args.query}".`;
                    break;

                case 'calculate':
                    try {
                        const value = evaluateExpression(String(decision.args.expression || ''));
                        resultMessage = `Result: ${value}`;
                    } catch {
                        resultMessage = 'Error: invalid calculation.';
                    }
                    break;

                default:
                    resultMessage = 'No suitable tool found for this request.';
            }

            await new Promise((resolve) => setTimeout(resolve, 600));
            addLog('tool_result', resultMessage);

            if (!hasCompleted) {
                addPoints(10);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (error) {
            console.error(error);
            addLog('error', 'The agent could not process the request.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="my-10 rounded-3xl border border-white/60 bg-gradient-to-br from-white/40 to-white/10 p-1 shadow-neumorphic-out backdrop-blur-md">
            <div className="flex min-h-[600px] flex-col overflow-hidden rounded-[22px] bg-brand-bg/95 md:flex-row">
                <div className="flex flex-col border-r border-white/50 p-6 md:w-1/2 md:p-8">
                    <div className="mb-8">
                        <h4 className="flex items-center gap-3 text-2xl font-bold text-brand-text">
                            <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                                <CpuIcon />
                            </div>
                            Agent Console
                        </h4>
                        <p className="mt-2 text-sm text-brand-text-light">
                            Issue natural language commands to see how an agent reasons about tools, execution, and results.
                        </p>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="rounded-2xl border border-white/60 bg-white/60 p-5 shadow-sm">
                            <h5 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Physical Environment</h5>
                            <div className="flex items-center justify-around">
                                <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${lightsOn ? 'scale-110' : 'opacity-70'}`}>
                                    <BulbIcon on={lightsOn} />
                                    <span className="text-xs font-semibold text-slate-600">{lightsOn ? 'ON' : 'OFF'}</span>
                                </div>
                                <div className="h-12 w-px bg-slate-200" />
                                <div className="flex flex-col items-center gap-2">
                                    <div className="text-2xl font-black text-brand-text">{temperature} F</div>
                                    <span className="text-xs font-semibold text-slate-600">Thermostat</span>
                                </div>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/60 p-5 shadow-sm">
                            <div className="absolute right-0 top-0 p-2 opacity-10 transition-opacity group-hover:opacity-20">
                                <CubeIcon />
                            </div>
                            <h5 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Wallet Simulator</h5>
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                                    <span className="text-lg font-black">Z</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-black tracking-tight text-brand-text">{walletBalance.toLocaleString()} ZLT</div>
                                    <div className="font-mono text-xs text-slate-500">0x71C...9A23</div>
                                </div>
                            </div>
                        </div>

                        {lastSearchResult && (
                            <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 p-4 text-sm text-slate-700">
                                <p className="font-semibold text-slate-900">Latest sample search output</p>
                                <p className="mt-2 leading-6">{lastSearchResult}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        <h5 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Quick Tests</h5>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => handleCommand('Turn on the lights')} disabled={isProcessing} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                                Lights On
                            </button>
                            <button onClick={() => handleCommand('Set thermostat to 68')} disabled={isProcessing} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                                Cool Down
                            </button>
                            <button onClick={() => handleCommand('Mint 100 ZLT tokens')} disabled={isProcessing} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                                Mint Tokens
                            </button>
                            <button onClick={() => handleCommand("Search for AI agent trends")} disabled={isProcessing} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                                Search Web
                            </button>
                        </div>
                    </div>

                    <div className="relative mt-6">
                        <input
                            type="text"
                            value={command}
                            onChange={(event) => setCommand(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    void handleCommand();
                                }
                            }}
                            placeholder="Type a command, for example: Turn off lights and mint 5 ZLT"
                            disabled={isProcessing}
                            className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-4 pr-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:bg-gray-50"
                        />
                        <button
                            onClick={() => void handleCommand()}
                            disabled={isProcessing}
                            className="absolute bottom-2 right-2 top-2 flex aspect-square items-center justify-center rounded-lg bg-brand-primary text-white transition-colors hover:bg-brand-primary/90 disabled:opacity-50"
                        >
                            {isProcessing ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <SparklesIcon />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col bg-slate-900 p-6 font-mono text-sm md:w-1/2 md:p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                        </div>
                        <span className="text-xs uppercase tracking-widest text-slate-500">Live Event Log</span>
                    </div>

                    <div className="liquid-scrollbar flex-1 space-y-4 overflow-y-auto pr-2" ref={scrollRef}>
                        {logs.length === 0 && (
                            <div className="mt-20 text-center italic text-slate-600">System ready. Awaiting input...</div>
                        )}

                        {logs.map((log) => (
                            <div key={log.id} className="group animate-fade-in">
                                <div className="mb-1 flex items-baseline gap-3">
                                    <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                                    <span
                                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                                            log.type === 'input'
                                                ? 'bg-blue-900/30 text-blue-400'
                                                : log.type === 'thought'
                                                  ? 'bg-purple-900/30 text-purple-400'
                                                  : log.type === 'tool_call'
                                                    ? 'bg-yellow-900/30 text-yellow-400'
                                                    : log.type === 'error'
                                                      ? 'bg-red-900/30 text-red-400'
                                                      : 'bg-green-900/30 text-green-400'
                                        }`}
                                    >
                                        {log.type.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="ml-3 border-l border-slate-800 pl-16 text-slate-300">
                                    {log.content}
                                    {log.metadata && (
                                        <pre className="mt-2 overflow-x-auto rounded bg-black/20 p-2 text-[10px] text-slate-500">
                                            {JSON.stringify(log.metadata, null, 2)}
                                        </pre>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isProcessing && (
                            <div className="flex items-center gap-2 pl-3">
                                <span className="text-brand-primary">-&gt;</span>
                                <span className="animate-pulse text-slate-500">Agent is thinking...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolCallDashboard;
