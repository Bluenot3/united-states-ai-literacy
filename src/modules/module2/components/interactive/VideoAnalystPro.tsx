
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';
import { getAiClient } from '../../services/aiService';
import { Type } from '@google/genai';

// --- Simulation Config ---
const VIDEO_DURATION = 60; // seconds

interface GameEvent {
    id: string;
    timestamp: number;
    label: string;
    description: string;
    type: 'info' | 'warning' | 'critical';
}

const DETECTED_EVENTS: GameEvent[] = [
    { id: 'ev1', timestamp: 5, label: 'Vehicle Entry', description: 'Blue Sedan (License: 4K2-99) enters north gate.', type: 'info' },
    { id: 'ev2', timestamp: 18, label: 'Traffic Violation', description: 'Red Truck runs red light at intersection.', type: 'warning' },
    { id: 'ev3', timestamp: 24, label: 'Pedestrian Crossing', description: 'Pedestrian enters crosswalk. Safe crossing.', type: 'info' },
    { id: 'ev4', timestamp: 35, label: 'Sudden Braking', description: 'Blue Sedan brakes abruptly to avoid debris.', type: 'critical' },
    { id: 'ev5', timestamp: 52, label: 'Vehicle Exit', description: 'Blue Sedan exits frame south.', type: 'info' }
];

const VideoAnalystPro: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [query, setQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // We use state for UI updates (slider) but a ref for the animation loop source of truth
    // to prevent closure staleness issues in the loop.
    const [playhead, setPlayhead] = useState(0); 
    const playheadRef = useRef(0);
    
    const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
    const [aiResponse, setAiResponse] = useState('');
    const [error, setError] = useState('');
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);

    // --- Sync State <-> Ref ---
    // When UI controls change the state (seeking), update the ref
    const updatePlayhead = (newTime: number) => {
        const clamped = Math.max(0, Math.min(newTime, VIDEO_DURATION));
        setPlayhead(clamped);
        playheadRef.current = clamped;
    };

    // --- Drawing Logic ---
    const drawFrame = useCallback((ctx: CanvasRenderingContext2D, time: number, width: number, height: number) => {
        // 1. Background (Night Vision / Dark Mode)
        ctx.fillStyle = '#0f172a'; // Slate 900
        ctx.fillRect(0, 0, width, height);

        // 2. Roads
        const roadW = 120;
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.fillStyle = '#1e293b'; // Slate 800
        ctx.fillRect(centerX - roadW / 2, 0, roadW, height); // N-S Road
        ctx.fillRect(0, centerY - roadW / 2, width, roadW); // E-W Road

        // Lane Markings
        ctx.strokeStyle = '#fbbf24'; // Amber
        ctx.setLineDash([15, 20]);
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
        ctx.stroke();

        ctx.setLineDash([]);

        // Crosswalks & Stop Lines
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        
        // North Stop Line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - roadW/2 - 10);
        ctx.lineTo(centerX + roadW/2, centerY - roadW/2 - 10);
        ctx.stroke();

        // West Stop Line
        ctx.beginPath();
        ctx.moveTo(centerX - roadW/2 - 10, centerY);
        ctx.lineTo(centerX - roadW/2 - 10, centerY + roadW/2);
        ctx.stroke();

        // 3. Traffic Lights Logic
        // N-S Green: 0-15s. Yellow: 15-18s. Red: 18-60s.
        const nsState = time < 15 ? 'green' : time < 18 ? 'yellow' : 'red';
        // E-W Red: 0-18s. Green: 18-40s. Yellow: 40-43s. Red: 43-60s.
        const ewState = time < 18 ? 'red' : time < 40 ? 'green' : time < 43 ? 'yellow' : 'red';

        const drawTrafficLight = (x: number, y: number, state: string) => {
            // Box
            ctx.fillStyle = '#000';
            ctx.fillRect(x - 8, y - 20, 16, 40);
            
            // Lights
            ctx.fillStyle = state === 'red' ? '#ef4444' : '#333';
            ctx.beginPath(); ctx.arc(x, y - 10, 4, 0, Math.PI * 2); ctx.fill();
            if(state === 'red') { ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0; }

            ctx.fillStyle = state === 'yellow' ? '#f59e0b' : '#333';
            ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
            if(state === 'yellow') { ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0; }

            ctx.fillStyle = state === 'green' ? '#10b981' : '#333';
            ctx.beginPath(); ctx.arc(x, y + 10, 4, 0, Math.PI * 2); ctx.fill();
            if(state === 'green') { ctx.shadowColor = '#10b981'; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0; }
        };

        // Render Lights
        drawTrafficLight(centerX + roadW/2 + 20, centerY - roadW/2 - 20, nsState); // Facing North Traffic (on Right)
        drawTrafficLight(centerX - roadW/2 - 20, centerY + roadW/2 + 20, ewState); // Facing West Traffic

        // 4. Entities (Cars & Peds)
        
        // Helper to draw car
        const drawVehicle = (x: number, y: number, color: string, rotation: number, label?: string) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            
            // Body
            ctx.fillStyle = color;
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 5;
            ctx.fillRect(-10, -20, 20, 40); // Standard Car
            
            // Windshield
            ctx.fillStyle = '#a5f3fc';
            ctx.fillRect(-8, -8, 16, 8);

            // Headlights
            ctx.fillStyle = '#fef08a'; // Yellowish
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.moveTo(-8, -20); ctx.lineTo(-20, -80); ctx.lineTo(-5, -80); ctx.fill();
            ctx.beginPath();
            ctx.moveTo(8, -20); ctx.lineTo(20, -80); ctx.lineTo(5, -80); ctx.fill();
            ctx.globalAlpha = 1.0;

            if (label) {
                ctx.rotate(-rotation); // Unrotate for text
                ctx.fillStyle = 'white';
                ctx.font = '10px monospace';
                ctx.fillText(label, 15, 0);
            }

            ctx.restore();
        };

        // EV1 + EV4 + EV5: Blue Sedan (North to South, then stops, then exits)
        // Timeline:
        // 0-5s: Off screen North
        // 5-15s: Moving down to center
        // 32-40s: Re-enters frame? No, let's make it consistent.
        // Let's say EV1 and EV4/5 are the SAME car timeline.
        
        // REVISED CAR LOGIC:
        // Car A (Blue): Enters North at 5s. Moves South.
        // At 35s (EV4), it brakes suddenly (maybe for a squirrel).
        // At 52s (EV5), it exits South.
        
        if (time >= 5 && time <= 55) {
            let carY = -50;
            let braking = false;

            // Movement logic
            if (time < 15) {
                // Moving into frame
                const t = (time - 5) / 10; // 0 to 1
                carY = -50 + t * (centerY - 50); 
            } else if (time < 35) {
                // Moving through intersection slowly
                const t = (time - 15) / 20; 
                carY = (centerY - 50) + t * 100;
            } else if (time < 38) {
                // BRAKING EVENT (35-38s)
                carY = (centerY + 50); 
                braking = true;
            } else {
                // Exiting
                const t = (time - 38) / 17;
                carY = (centerY + 50) + t * (height / 2 + 100);
            }

            drawVehicle(centerX - roadW/4, carY, '#3b82f6', Math.PI, '4K2-99');
            
            if (braking) {
                ctx.fillStyle = 'red';
                ctx.font = 'bold 14px sans-serif';
                ctx.fillText('! BRAKING', centerX - roadW/4 + 20, carY);
            }
        }

        // EV2: Red Truck (West to East) - Running Red Light
        // Enters 15s. Runs light at 18s. Exits 25s.
        if (time >= 15 && time <= 25) {
            const t = (time - 15) / 10; // 0 to 1 over 10s
            const carX = -50 + t * (width + 100);
            drawVehicle(carX, centerY + roadW/4, '#ef4444', Math.PI * 0.5);

            if (time > 17.5 && time < 19) {
                ctx.fillStyle = 'red';
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 1;
                ctx.font = 'bold 12px sans-serif';
                ctx.fillText('VIOLATION', carX - 30, centerY + roadW/4 - 30);
            }
        }

        // EV3: Pedestrian
        // Crosses bottom from Left to Right at 22s-28s
        if (time >= 22 && time <= 28) {
            const t = (time - 22) / 6;
            const pedX = (centerX - roadW/2 - 20) + t * (roadW + 40);
            const pedY = centerY + roadW/2 + 20;

            ctx.fillStyle = '#fcd34d'; // Pedestrian Color
            ctx.beginPath(); ctx.arc(pedX, pedY, 6, 0, Math.PI*2); ctx.fill();
            ctx.shadowColor = 'black'; ctx.shadowBlur = 5; 
            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.beginPath(); ctx.ellipse(pedX + 2, pedY + 2, 6, 3, 0, 0, Math.PI*2); ctx.fill();
        }

        // 5. Overlay: Scanlines & Time
        ctx.fillStyle = 'rgba(0, 255, 0, 0.03)';
        for(let i = 0; i < height; i+=4) {
            ctx.fillRect(0, i, width, 1);
        }
        
        // Scan bar
        const scanY = (time * 50) % height;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.fillRect(0, scanY, width, 5);

    }, []);

    // --- Animation Loop ---
    const animate = useCallback((timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const delta = timestamp - lastTimeRef.current;
        lastTimeRef.current = timestamp;

        if (isPlaying) {
            // Update ref directly for smoothness
            playheadRef.current = (playheadRef.current + delta / 1000);
            if (playheadRef.current >= VIDEO_DURATION) {
                playheadRef.current = 0;
                setIsPlaying(false); // Stop at end
            }
            // Sync React state occasionally or every frame? 
            // Every frame is fine for 60fps in React 18+ usually, but can be heavy.
            setPlayhead(playheadRef.current);
        }

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                drawFrame(ctx, playheadRef.current, canvas.width, canvas.height);
            }
        }

        requestRef.current = requestAnimationFrame(animate);
    }, [isPlaying, drawFrame]); // Dependencies: only things that *change behavior*, not values

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [animate]);

    // --- Event Detection for UI ---
    const currentEvent = DETECTED_EVENTS.find(e => Math.abs(e.timestamp - playhead) < 1.5);

    // --- AI Integration ---
    const handleAnalyze = async () => {
        if (!query.trim()) return;
        setIsAnalyzing(true);
        setIsPlaying(false);
        setHighlightedEventId(null);
        setAiResponse('');
        setError('');

        try {
            const ai = await getAiClient();
            
            const prompt = `You are a Video Analysis AI. 
            Events Metadata: ${JSON.stringify(DETECTED_EVENTS)}
            User Query: "${query}"
            
            If the user asks about a specific event (like "red light" or "pedestrian"), find the matching event ID.
            Return JSON: { "answer": string, "relatedEventId": string | null }`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            answer: { type: Type.STRING },
                            relatedEventId: { type: Type.STRING }
                        }
                    }
                }
            });

            const data = JSON.parse(response.text);
            setAiResponse(data.answer);
            
            if (data.relatedEventId) {
                setHighlightedEventId(data.relatedEventId);
                const evt = DETECTED_EVENTS.find(e => e.id === data.relatedEventId);
                if (evt) updatePlayhead(evt.timestamp);
            }

            if (user && !user.progress.completedInteractives.includes(interactiveId)) {
                addPoints(25);
                updateProgress(interactiveId, 'interactive');
            }

        } catch (err) {
            console.error(err);
            setError('Analysis failed. Try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        lastTimeRef.current = 0; // Reset delta logic on toggle
    };

    const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        updatePlayhead(percentage * VIDEO_DURATION);
    };

    return (
        <div className="my-8 p-1 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-slate-900/40 shadow-neumorphic-out border border-white/20 backdrop-blur-md text-white">
            <div className="bg-slate-900/90 rounded-[22px] overflow-hidden p-6 md:p-8">
                
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-xl text-white flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-lg text-red-500 border border-red-500/30">
                            <span className="text-xl">📹</span>
                        </div>
                        Video Analyst Pro
                    </h4>
                    <div className="flex gap-2">
                        <span className="text-xs font-mono bg-black/40 border border-white/10 px-2 py-1 rounded text-slate-400">CAM-04A [LIVE]</span>
                        <span className="text-xs font-mono bg-black/40 border border-white/10 px-2 py-1 rounded text-green-400">REC</span>
                    </div>
                </div>

                {/* Video Monitor Area */}
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-6 group border border-slate-700 shadow-2xl">
                    
                    <canvas 
                        ref={canvasRef}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Event Overlay */}
                    {currentEvent && (
                        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 animate-fade-in-up max-w-xs">
                            <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                                currentEvent.type === 'critical' ? 'text-red-500' : 
                                currentEvent.type === 'warning' ? 'text-yellow-500' : 'text-blue-400'
                            }`}>
                                {currentEvent.type} EVENT DETECTED
                            </div>
                            <div className="text-lg font-bold text-white leading-tight">{currentEvent.label}</div>
                            <div className="text-xs text-gray-400 mt-1 font-mono">{currentEvent.description}</div>
                        </div>
                    )}

                    {/* Timeline Controls Overlay (Bottom) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-12 pb-4 px-4">
                        {/* Timeline Bar */}
                        <div 
                            className="relative h-8 bg-white/10 rounded-lg cursor-pointer group/timeline hover:bg-white/20 transition-colors"
                            onClick={handleTimelineClick}
                        >
                            {/* Events Markers */}
                            {DETECTED_EVENTS.map(ev => (
                                <div 
                                    key={ev.id}
                                    className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-4 rounded-full transition-all duration-300 z-10 
                                        ${highlightedEventId === ev.id ? 'bg-yellow-400 scale-150 h-6 shadow-[0_0_15px_yellow]' : 'bg-white/40 hover:bg-white hover:scale-125'}
                                    `}
                                    style={{ left: `${(ev.timestamp / VIDEO_DURATION) * 100}%` }}
                                    title={ev.label}
                                ></div>
                            ))}

                            {/* Playhead */}
                            <div 
                                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 shadow-[0_0_10px_rgba(239,68,68,0.8)] pointer-events-none"
                                style={{ left: `${(playhead / VIDEO_DURATION) * 100}%` }}
                            >
                                <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full"></div>
                            </div>
                        </div>

                        <div className="mt-3 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <button onClick={togglePlay} className="text-white hover:text-brand-primary transition-colors">
                                    {isPlaying ? (
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                    ) : (
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    )}
                                </button>
                                <span className="text-sm font-mono text-gray-300">
                                    00:{Math.floor(playhead).toString().padStart(2, '0')} <span className="text-gray-600">/ 00:{VIDEO_DURATION}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analysis Console */}
                <div className="flex flex-col gap-4">
                    <div className="flex gap-3">
                        <input 
                            type="text" 
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Ask the Agent (e.g., 'Did any car run a red light?')"
                            className="flex-grow px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-white placeholder-gray-500 shadow-inner font-mono text-sm"
                            onKeyPress={e => e.key === 'Enter' && handleAnalyze()}
                            disabled={isAnalyzing}
                        />
                        <button 
                            onClick={handleAnalyze} 
                            disabled={isAnalyzing || !query.trim()}
                            className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-primary/90 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            {isAnalyzing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <SparklesIcon />}
                            Analyze
                        </button>
                    </div>

                    {error && <div className="text-red-400 text-sm text-center">{error}</div>}

                    {/* Output Log */}
                    {aiResponse && (
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl animate-fade-in flex gap-4 items-start">
                            <div className="p-2 bg-blue-500 rounded-lg text-white shadow-lg shrink-0 mt-1">
                                <SparklesIcon />
                            </div>
                            <div>
                                <h5 className="font-bold text-blue-300 text-xs mb-1 uppercase tracking-wide">Agent Analysis</h5>
                                <p className="text-gray-200 text-sm leading-relaxed">{aiResponse}</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default VideoAnalystPro;
