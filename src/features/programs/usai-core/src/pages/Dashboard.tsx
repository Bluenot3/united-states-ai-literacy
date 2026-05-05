import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useAuth } from '../hooks/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HHCard {
    q: string;
    ans: boolean;
    ex: string;
}

interface AATool {
    id: string;
    ico: string;
    name: string;
}

interface PEChip {
    id: string;
    label: string;
    text: string;
    pts: number;
}

interface SparkData {
    acc: number[];
    lat: number[];
    cost: number[];
    drift: number[];
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const HH_DATA: HHCard[] = [
    {
        q: 'GPT-4 was trained on data up to April 2023',
        ans: true,
        ex: 'Correct — OpenAI confirmed this cutoff date.',
    },
    {
        q: 'Claude can browse the internet in real-time',
        ans: false,
        ex: 'False — Claude has no live internet access by default.',
    },
    {
        q: 'LLMs predict the next token using probability',
        ans: true,
        ex: 'Correct — that\'s the core mechanism.',
    },
    {
        q: 'Increasing temperature makes outputs more deterministic',
        ans: false,
        ex: 'False — higher temp = more random, not less.',
    },
    {
        q: 'Prompt injection can override system instructions',
        ans: true,
        ex: 'Correct — a major security concern in production.',
    },
];

const AA_TOOLS: AATool[] = [
    { id: 'search', ico: '🔍', name: 'WEB SEARCH' },
    { id: 'email', ico: '📧', name: 'EMAIL SEND' },
    { id: 'db', ico: '🗄️', name: 'DATABASE' },
    { id: 'code', ico: '💻', name: 'CODE EXEC' },
    { id: 'llm', ico: '🧠', name: 'LLM CALL' },
    { id: 'scheduler', ico: '⏰', name: 'SCHEDULER' },
];

const AA_CORRECT = new Set(['search', 'email', 'scheduler']);

const PE_CHIPS: PEChip[] = [
    { id: 'role', label: 'ROLE', pts: 14, text: 'Act as an expert dog trainer with 10 years experience.' },
    { id: 'context', label: 'CONTEXT', pts: 18, text: 'The dog is 2 years old and struggles with recall commands.' },
    { id: 'format', label: 'FORMAT', pts: 20, text: 'Provide 3 specific training exercises with step-by-step instructions.' },
    { id: 'examples', label: 'EXAMPLES', pts: 16, text: 'For example, the "look at me" command should be practiced first.' },
    { id: 'constraints', label: 'CONSTRAINTS', pts: 12, text: 'Keep each exercise under 10 minutes. Use positive reinforcement only.' },
    { id: 'tone', label: 'TONE', pts: 8, text: 'Use encouraging, professional language suitable for beginners.' },
];

const SECTIONS = [
    { id: 's0', label: 'OVERVIEW' },
    { id: 's1', label: 'EXPERT PATH' },
    { id: 's2', label: 'MODULE 01' },
    { id: 's3', label: 'MODULE 02' },
    { id: 's4', label: 'MODULE 03' },
    { id: 's5', label: 'MODULE 04' },
    { id: 's6', label: 'DEPLOY' },
    { id: 's7', label: 'CREDENTIAL' },
];

const CODE_CONTENT = `# ZEN Vanguard Starter Template
# huggingface.co/new-space → SDK: Gradio
# Space Secret: OPENAI_API_KEY

import os
import gradio as gr
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def answer(question: str) -> str:
    if not os.getenv("OPENAI_API_KEY"):
        return "⚠ Add OPENAI_API_KEY in Space Secrets."
    resp = client.responses.create(
        model="gpt-4.1-mini", input=question
    )
    return resp.output_text

demo = gr.Interface(
    fn=answer,
    inputs=gr.Textbox(label="Ask your AI"),
    outputs=gr.Textbox(label="Response"),
    title="🤖 My ZEN AI App",
    theme=gr.themes.Soft()
)
demo.launch()`;

// ─── Subcomponents ────────────────────────────────────────────────────────────

// Super Advanced AgentCore SVG animation for Vanguard
const AgentCore: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const NS = 'http://www.w3.org/2000/svg';
        
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        
        const defs = document.createElementNS(NS, 'defs');
        defs.innerHTML = `
            <filter id="ultraGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur1" />
                <feGaussianBlur stdDeviation="3" result="blur2" />
                <feMerge>
                    <feMergeNode in="blur1" />
                    <feMergeNode in="blur2" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <radialGradient id="hologramBase" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
                <stop offset="25%" stop-color="#00d4ff" stop-opacity="0.95" />
                <stop offset="65%" stop-color="#7b2fff" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#050a18" stop-opacity="0" />
            </radialGradient>
            <pattern id="radarGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0, 212, 255, 0.05)" stroke-width="1"/>
            </pattern>
        `;
        svg.appendChild(defs);

        const cx = 200;
        const cy = 200;

        // Background Radar Grid
        const grid = document.createElementNS(NS, 'rect');
        grid.setAttribute('width', '400');
        grid.setAttribute('height', '400');
        grid.setAttribute('fill', 'url(#radarGrid)');
        svg.appendChild(grid);

        // Rotating Rings
        const ringsData = [
            { r: 60, stroke: '#00d4ff', w: 1, dash: '8 8', speed: 0.8 },
            { r: 75, stroke: '#00d4ff', w: 0.5, dash: '2 4 10 4', speed: -1.2 },
            { r: 120, stroke: '#7b2fff', w: 2, dash: '40 60', speed: 0.4 },
            { r: 128, stroke: '#7b2fff', w: 1, dash: '2 6', speed: 0.6 },
            { r: 155, stroke: '#00ff9f', w: 1.5, dash: '4 16', speed: -0.5 },
            { r: 165, stroke: '#00ff9f', w: 0.5, dash: '1 4', speed: 0.2 },
            { r: 190, stroke: 'rgba(255, 215, 0, 0.4)', w: 0.5, dash: '20 20 2 20', speed: 0.1 }
        ];

        const rGroups: SVGGElement[] = [];
        ringsData.forEach((ring) => {
            const g = document.createElementNS(NS, 'g');
            g.style.transformOrigin = `${cx}px ${cy}px`;
            
            const c = document.createElementNS(NS, 'circle');
            c.setAttribute('cx', String(cx));
            c.setAttribute('cy', String(cy));
            c.setAttribute('r', String(ring.r));
            c.setAttribute('fill', 'none');
            c.setAttribute('stroke', ring.stroke);
            c.setAttribute('stroke-width', String(ring.w));
            c.setAttribute('stroke-dasharray', ring.dash);
            c.setAttribute('opacity', '0.7');
            g.appendChild(c);
            
            svg.appendChild(g);
            rGroups.push(g);
        });

        // Core Element
        const coreGroup = document.createElementNS(NS, 'g');
        coreGroup.style.transformOrigin = `${cx}px ${cy}px`;
        
        const coreGlow = document.createElementNS(NS, 'circle');
        coreGlow.setAttribute('cx', String(cx));
        coreGlow.setAttribute('cy', String(cy));
        coreGlow.setAttribute('r', '38');
        coreGlow.setAttribute('fill', 'url(#hologramBase)');
        coreGlow.setAttribute('filter', 'url(#ultraGlow)');
        coreGroup.appendChild(coreGlow);

        const hexSize = 25;
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
            const angle_deg = 60 * i + 30;
            const angle_rad = Math.PI / 180 * angle_deg;
            hexPoints.push(`${cx + hexSize * Math.cos(angle_rad)},${cy + hexSize * Math.sin(angle_rad)}`);
        }
        const hex = document.createElementNS(NS, 'polygon');
        hex.setAttribute('points', hexPoints.join(' '));
        hex.setAttribute('fill', 'rgba(0, 212, 255, 0.1)');
        hex.setAttribute('stroke', '#ffffff');
        hex.setAttribute('stroke-width', '2');
        coreGroup.appendChild(hex);

        const innerTriangle = document.createElementNS(NS, 'polygon');
        const triPoints = [];
        for (let i = 0; i < 3; i++) {
            const angle_deg = 120 * i - 90;
            const angle_rad = Math.PI / 180 * angle_deg;
            triPoints.push(`${cx + 15 * Math.cos(angle_rad)},${cy + 15 * Math.sin(angle_rad)}`);
        }
        innerTriangle.setAttribute('points', triPoints.join(' '));
        innerTriangle.setAttribute('fill', '#00ff9f');
        innerTriangle.setAttribute('filter', 'url(#ultraGlow)');
        coreGroup.appendChild(innerTriangle);

        svg.appendChild(coreGroup);

        // Nodes Network
        const nodesData = [
            { id: 'LLM NEURAL', sub: 'MODEL: VANGUARD-7B', r: 75, angle: 0, color: '#00ff9f', baseSpeed: 1.8 },
            { id: 'RAG KNOWLEDGE', sub: 'VECTOR DB: ONLINE', r: 124, angle: 90, color: '#ffb86c', baseSpeed: -0.9 },
            { id: 'EXTERNAL TOOLS', sub: 'APIs: 4 ACTIVE', r: 124, angle: 210, color: '#ff5555', baseSpeed: -0.9 },
            { id: 'ORCHESTRATOR', sub: 'STATUS: ROUTING', r: 124, angle: 330, color: '#00d4ff', baseSpeed: -0.9 },
            { id: 'TELEMETRY', sub: 'OBSERVABILITY: 100%', r: 160, angle: 45, color: '#00d4ff', baseSpeed: 0.5 },
            { id: 'FINOPS', sub: 'BURN: LOGGED', r: 160, angle: 180, color: '#bd93f9', baseSpeed: 0.5 },
            { id: 'GUARDRAILS', sub: 'POLICY: ENFORCED', r: 160, angle: 270, color: '#ffb86c', baseSpeed: 0.5 },
        ];

        const gLines: SVGLineElement[] = [];
        nodesData.forEach((n) => {
            const line = document.createElementNS(NS, 'line');
            line.setAttribute('stroke', n.color);
            line.setAttribute('stroke-opacity', '0.5');
            line.setAttribute('stroke-width', '1.5');
            line.setAttribute('stroke-dasharray', '4 4');
            svg.insertBefore(line, coreGroup);
            gLines.push(line);
        });

        const gNodes: SVGGElement[] = [];
        nodesData.forEach((n) => {
            const g = document.createElementNS(NS, 'g');
            
            const s = document.createElementNS(NS, 'rect');
            s.setAttribute('x', '-14');
            s.setAttribute('y', '-14');
            s.setAttribute('width', '28');
            s.setAttribute('height', '28');
            s.setAttribute('fill', '#050a18');
            s.setAttribute('stroke', n.color);
            s.setAttribute('stroke-width', '1.5');
            s.setAttribute('transform', 'rotate(45)');
            s.setAttribute('filter', 'url(#ultraGlow)');
            g.appendChild(s);
            
            const inner = document.createElementNS(NS, 'circle');
            inner.setAttribute('r', '5');
            inner.setAttribute('fill', '#fff');
            g.appendChild(inner);

            const tGroup = document.createElementNS(NS, 'g');
            // Offset text to the right instead of centered, to look like a callout
            tGroup.setAttribute('transform', 'translate(18, -6)');
            
            const text = document.createElementNS(NS, 'text');
            text.setAttribute('x', '0');
            text.setAttribute('y', '0');
            text.setAttribute('style', `font-family:Orbitron,monospace;font-size:9px;font-weight:700;fill:${n.color};text-shadow:0 0 6px ${n.color}`);
            text.textContent = n.id;
            tGroup.appendChild(text);

            const subText = document.createElementNS(NS, 'text');
            subText.setAttribute('x', '0');
            subText.setAttribute('y', '12');
            subText.setAttribute('style', 'font-family:Orbitron,monospace;font-size:7px;fill:rgba(255,255,255,0.7);');
            subText.textContent = n.sub;
            tGroup.appendChild(subText);

            g.appendChild(tGroup);
            svg.appendChild(g);
            gNodes.push(g);
        });

        let stopped = false;
        const start = performance.now();

        const tick = (now: number) => {
            if (stopped) return;
            const t = (now - start) * 0.0004;
            
            rGroups.forEach((g, i) => {
                const angle = t * ringsData[i].speed * 30;
                g.style.transform = `rotate(${angle}deg)`;
            });

            const pulse = Math.sin(t * 4);
            coreGlow.setAttribute('r', String(38 + pulse * 3));
            innerTriangle.style.transform = `rotate(${t * 80}deg)`;
            hex.style.transform = `rotate(${t * -20}deg)`;

            nodesData.forEach((n, i) => {
                let currentAngle = (n.angle * Math.PI / 180) + (t * n.baseSpeed);
                let nx = cx + n.r * Math.cos(currentAngle);
                let ny = cy + n.r * Math.sin(currentAngle);
                
                gNodes[i].setAttribute('transform', `translate(${nx}, ${ny})`);
                
                gLines[i].setAttribute('x1', String(cx));
                gLines[i].setAttribute('y1', String(cy));
                gLines[i].setAttribute('x2', String(nx));
                gLines[i].setAttribute('y2', String(ny));
            });

            if (Math.random() < 0.08) {
                const targetIdx = Math.floor(Math.random() * nodesData.length);
                const n = nodesData[targetIdx];
                const p = document.createElementNS(NS, 'circle');
                p.setAttribute('r', '3');
                p.setAttribute('fill', '#ffffff');
                p.setAttribute('filter', 'url(#ultraGlow)');
                svg.appendChild(p);

                let pStart = performance.now();
                const reverse = Math.random() > 0.5;
                const pTick = (pNow: number) => {
                    if (stopped) return;
                    let pt = (pNow - pStart) / 400;
                    if (pt >= 1) {
                        try{ svg.removeChild(p); } catch(e){}
                        return;
                    }
                    let prog = reverse ? (1 - pt) : pt; 
                    let currentAngle = (n.angle * Math.PI / 180) + (((pNow - start) * 0.0004) * n.baseSpeed);
                    let nx = cx + n.r * Math.cos(currentAngle);
                    let ny = cy + n.r * Math.sin(currentAngle);
                    let curX = cx + (nx - cx) * prog;
                    let curY = cy + (ny - cy) * prog;
                    p.setAttribute('cx', String(curX));
                    p.setAttribute('cy', String(curY));
                    requestAnimationFrame(pTick);
                };
                requestAnimationFrame(pTick);
            }
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);

        return () => { stopped = true; };
    }, []);

    return (
        <svg
            ref={svgRef}
            viewBox="0 0 400 400"
            style={{ width: '100%', maxHeight: '420px', display: 'block', filter: 'drop-shadow(0 0 30px rgba(0,212,255,0.25))' }}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
        />
    );
};

// Sparkline component
const Sparkline: React.FC<{ points: number[]; min: number; max: number; stroke: string }> = ({ points, min, max, stroke }) => {
    const n = points.length;
    if (n < 2) return <svg className="m-spark" viewBox="0 0 100 24" />;
    const pts = points.map((v, i) => {
        const x = ((i / (n - 1)) * 100).toFixed(1);
        const y = Math.max(1, Math.min(23, 24 - ((v - min) / (max - min)) * 24)).toFixed(1);
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg className="m-spark" viewBox="0 0 100 24">
            <polyline fill="none" stroke={stroke} strokeWidth="1.5" opacity=".65" points={pts} />
        </svg>
    );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    // Section state
    const [currentSection, setCurrentSection] = useState(0);
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    // HH state
    const [hhFlipped, setHhFlipped] = useState<Set<number>>(new Set());
    const [hhKey, setHhKey] = useState(0);

    // AA state
    const [aaSelected, setAaSelected] = useState<Set<string>>(new Set());
    const [aaLoops, setAaLoops] = useState<string | null>(null);
    const [aaGuard, setAaGuard] = useState<string | null>(null);
    const [aaLog, setAaLog] = useState<{ ico: string; msg: string; color: string }[]>([]);
    const [aaStatus, setAaStatus] = useState('SELECT TOOLS');
    const [aaStatusColor, setAaStatusColor] = useState('rgba(0,212,255,.55)');
    const [aaDeploying, setAaDeploying] = useState(false);

    // PE state
    const [peAdded, setPeAdded] = useState<Set<string>>(new Set());
    const [peScore, setPeScore] = useState(6);

    // Live metrics state
    const [metrics, setMetrics] = useState({ acc: 94.1, lat: 342, cost: 0.0012, drift: 0.07 });
    const [sparkData, setSparkData] = useState<SparkData>({ acc: [], lat: [], cost: [], drift: [] });
    const dashStarted = useRef(false);

    // Copy button
    const [copied, setCopied] = useState(false);

    // Counter animation for S0
    const [counts, setCounts] = useState({ modules: 0, states: 0, countries: 0, labs: 0 });
    const countersRun = useRef(false);

    // XP display
    const xpLevels = [
        { n: 'NOVICE', max: 300 },
        { n: 'APPRENTICE', max: 700 },
        { n: 'BUILDER', max: 1400 },
        { n: 'OPERATOR', max: 2500 },
        { n: 'ARCHITECT', max: 9999 },
    ];
    const userXP = (user as { totalPoints?: number })?.totalPoints ?? 0;
    const lvlIdx = xpLevels.findIndex((l) => userXP < l.max);
    const levelIdx = lvlIdx === -1 ? 4 : lvlIdx;
    const level = xpLevels[levelIdx]!;
    const prevMax = levelIdx > 0 ? xpLevels[levelIdx - 1]!.max : 0;
    const xpPct = Math.min(100, ((userXP - prevMax) / (level.max - prevMax)) * 100);

    // ── Counter animation ────────────────────────────────────────────────────
    const startCounters = useCallback(() => {
        if (countersRun.current) return;
        countersRun.current = true;
        const targets = { modules: 4, states: 42, countries: 12, labs: 50 };
        const dur = 1200;
        const start = performance.now();
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / dur);
            const ease = 1 - Math.pow(1 - t, 3);
            setCounts({
                modules: Math.round(targets.modules * ease),
                states: Math.round(targets.states * ease),
                countries: Math.round(targets.countries * ease),
                labs: Math.round(targets.labs * ease),
            });
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, []);

    // ── Live Dashboard ───────────────────────────────────────────────────────
    const startDash = useCallback(() => {
        if (dashStarted.current) return;
        dashStarted.current = true;

        // Seed initial data
        const seed: SparkData = { acc: [], lat: [], cost: [], drift: [] };
        for (let i = 0; i < 20; i++) {
            seed.acc.push(93 + Math.random() * 3);
            seed.lat.push(300 + Math.random() * 100);
            seed.cost.push(0.001 + Math.random() * 0.0005);
            seed.drift.push(0.04 + Math.random() * 0.04);
        }
        setSparkData(seed);

        const tick = () => {
            setSparkData((prev) => {
                const bump = Math.random() < 0.018 ? 0.09 : 0;
                const newDrift = Math.min(0.15, (prev.drift[prev.drift.length - 1] ?? 0.07) * 0.95 + Math.random() * 0.01 + bump);
                const push = <T,>(arr: T[], val: T): T[] => {
                    const next = [...arr, val];
                    if (next.length > 20) next.shift();
                    return next;
                };
                return {
                    acc: push(prev.acc, 93 + Math.random() * 3),
                    lat: push(prev.lat, 300 + Math.random() * 100),
                    cost: push(prev.cost, 0.001 + Math.random() * 0.0005),
                    drift: push(prev.drift, newDrift),
                };
            });
            setMetrics((prev) => {
                const bump = Math.random() < 0.018 ? 0.09 : 0;
                const newDrift = Math.min(0.15, prev.drift * 0.95 + Math.random() * 0.01 + bump);
                return {
                    acc: 93 + Math.random() * 3,
                    lat: 300 + Math.random() * 100,
                    cost: 0.001 + Math.random() * 0.0005,
                    drift: newDrift,
                };
            });
        };

        const id = setInterval(tick, 900);
        return id;
    }, []);

    // ── Section navigation ───────────────────────────────────────────────────
    const goTo = useCallback((idx: number) => {
        setCurrentSection(idx);
        if (idx === 0) setTimeout(startCounters, 100);
        if (idx === 5) startDash();
    }, [startCounters, startDash]);

    // Trigger counter on mount if on S0
    useEffect(() => {
        if (currentSection === 0) startCounters();
    }, [currentSection, startCounters]);

    // Dash interval cleanup
    useEffect(() => {
        let id: ReturnType<typeof setInterval> | undefined;
        if (currentSection === 5) {
            id = startDash();
        }
        return () => {
            if (id !== undefined) clearInterval(id);
        };
    }, [currentSection, startDash]);

    // ── Section fade animations ──────────────────────────────────────────────
    useEffect(() => {
        const el = sectionRefs.current[currentSection];
        if (!el) return;
        const fus = el.querySelectorAll<HTMLElement>('.fu');
        fus.forEach((f) => {
            f.classList.remove('go');
            void (f as HTMLElement & { offsetWidth: number }).offsetWidth;
            f.classList.add('go');
        });
    }, [currentSection]);

    // ── HH Flip ──────────────────────────────────────────────────────────────
    const hhFlip = (idx: number) => {
        if (hhFlipped.has(idx)) return;
        setHhFlipped((prev) => new Set([...prev, idx]));
    };

    const hhReset = () => {
        setHhFlipped(new Set());
        setHhKey((k) => k + 1);
    };

    // ── AA Deploy ────────────────────────────────────────────────────────────
    const aaDeploy = () => {
        if (aaDeploying) return;
        setAaDeploying(true);
        setAaLog([]);
        setAaStatus('RUNNING...');
        setAaStatusColor('#ffd700');

        const toolsOk = AA_CORRECT.size === aaSelected.size && [...AA_CORRECT].every((t) => aaSelected.has(t));
        const cfgOk = aaLoops === '3' && aaGuard === 'on';
        const success = toolsOk && cfgOk;

        const steps = success
            ? [
                { ico: '🔍', msg: 'WEB_SEARCH: Fetching top AI news...', color: '#00d4ff' },
                { ico: '⚙', msg: 'Processing 12 articles (RAG similarity > 0.85)', color: '#a78bff' },
                { ico: '📝', msg: 'Generating executive summary...', color: '#ffd700' },
                { ico: '📧', msg: 'EMAIL_SEND: Delivered to team@company.com', color: '#00ff9f' },
                { ico: '✅', msg: 'Agent complete. Next run: tomorrow 08:00', color: '#00ff9f' },
            ]
            : [
                {
                    ico: '⚠',
                    msg: !toolsOk
                        ? 'Missing tools: ' + [...AA_CORRECT].filter((t) => !aaSelected.has(t)).join(', ')
                        : 'Wrong loop config — risk of infinite execution',
                    color: '#ff5733',
                },
                { ico: '✗', msg: 'Agent failed. Review selection and retry.', color: '#ff5733' },
            ];

        steps.forEach((s, i) => {
            setTimeout(() => {
                setAaLog((prev) => [...prev, s]);
            }, i * 450);
        });

        setTimeout(() => {
            setAaStatus(success ? '✓ DEPLOYED' : '✗ FAILED');
            setAaStatusColor(success ? '#00ff9f' : '#ff5733');
            setAaDeploying(false);
        }, steps.length * 450 + 200);
    };

    // ── PE Update ────────────────────────────────────────────────────────────
    const peAddChip = (chip: PEChip) => {
        if (peAdded.has(chip.id)) return;
        setPeAdded((prev) => new Set([...prev, chip.id]));
        setPeScore((prev) => Math.min(100, prev + chip.pts));
    };

    const pePreviewContent = useMemo(() => {
        if (peAdded.size === 0) {
            return <span style={{ color: 'rgba(255,255,255,.28)' }}>"write something about dogs"</span>;
        }
        const parts: React.ReactNode[] = [
            <span key="base" style={{ color: 'rgba(255,255,255,.55)' }}>USER: write something about dogs</span>,
        ];
        if (peAdded.has('role')) parts.push(<><br /><span key="role" style={{ color: '#a78bff' }}>SYSTEM: Act as an expert dog trainer with 10 years experience.</span></>);
        if (peAdded.has('context')) parts.push(<><br /><span key="ctx" style={{ color: '#89dceb' }}>CONTEXT: The dog is 2 years old and struggles with recall commands.</span></>);
        if (peAdded.has('format')) parts.push(<><br /><span key="fmt" style={{ color: '#ffd700' }}>FORMAT: Provide 3 specific training exercises with step-by-step instructions.</span></>);
        if (peAdded.has('examples')) parts.push(<><br /><span key="ex" style={{ color: '#a6e3a1' }}>EXAMPLES: For example, the "look at me" command should be practiced first.</span></>);
        if (peAdded.has('constraints')) parts.push(<><br /><span key="con" style={{ color: '#ff6b9d' }}>CONSTRAINTS: Keep each exercise under 10 minutes. Use positive reinforcement only.</span></>);
        if (peAdded.has('tone')) parts.push(<><br /><span key="tone" style={{ color: '#f9e2af' }}>TONE: Use encouraging, professional language suitable for beginners.</span></>);
        return <>{parts}</>;
    }, [peAdded]);

    const pePctColor = peScore >= 80 ? '#00ff9f' : peScore >= 50 ? '#ffd700' : '#ff5733';

    // ── Copy Code ────────────────────────────────────────────────────────────
    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(CODE_CONTENT);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = CODE_CONTENT;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
    };

    // ── Toggle AA tool ───────────────────────────────────────────────────────
    const toggleAATool = (id: string) => {
        setAaSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    // ── Drift alert ──────────────────────────────────────────────────────────
    const driftAlert = metrics.drift > 0.10;

    // ── Bottom nav mapping ───────────────────────────────────────────────────
    const BN_TARGETS = [0, 1, 2, 6, 7];
    const BN_ICONS = ['⌂', '◫', '⚡', '▲', '◉'];
    const BN_LABELS = ['HOME', 'DOCS', 'PROGRAMS', 'GUIDE', 'PROFILE'];
    const getActiveTab = (si: number) => {
        const zones = [[0], [1], [2, 3, 4, 5], [6], [7]];
        for (let t = 0; t < zones.length; t++) if (zones[t]!.includes(si)) return t;
        return 0;
    };

    if (!user) return null;

    return (
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", background: 'var(--bg)', color: '#fff', minHeight: '100vh', position: 'relative' }}>
            {/* ── HEADER ── */}
            <header className="ag-header">
                <div className="logo">
                    <div className="logo-hex">Z</div>
                    ZEN AI
                </div>
                <div className="hdr-sep" />
                <div className="xp-wrap">
                    <span className="xp-level">{level.n}</span>
                    <div className="xp-bar-outer">
                        <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
                    </div>
                    <span className="xp-num">{userXP} / {level.max} XP</span>
                </div>
                <div className="hdr-right">
                    <div className="hdr-badge">ZEN-AIL-2026</div>
                    <span style={{ color: 'rgba(255,255,255,.6)', fontSize: '.62rem', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {(user as { name?: string }).name ?? user.email}
                    </span>
                </div>
            </header>

            {/* ── PROGRESS BAR ── */}
            <div className="ag-prog">
                <div className="prog-f" style={{ width: `${((currentSection + 1) / SECTIONS.length) * 100}%` }} />
            </div>

            {/* ── MAIN CARD ── */}
            <div className="ag-app">
                <div className="ag-scene">
                    <div className="card3d" id="ag-card">
                        <div className="card-border" />
                        <div className="ag-glass">
                            <div className="ag-specular" />
                            <div className="ag-scan" />
                            <div className="ag-corner tl" />
                            <div className="ag-corner tr" />
                            <div className="ag-corner bl" />
                            <div className="ag-corner br" />

                            {/* ── S0: OVERVIEW / HERO ── */}
                            <div
                                ref={(el) => { sectionRefs.current[0] = el; }}
                                className={`sec${currentSection === 0 ? ' on' : ''}`}
                                id="s0"
                            >
                                <div className="tag-line fu d1">AI Systems Mastery Track</div>
                                <div className="two fu d2" style={{ gap: '1.2rem' }}>
                                    <div className="left" style={{ gap: '.7rem' }}>
                                        <h1 className="holo">ZEN Vanguard.<br />You don't just<br />learn AI. You build it.</h1>
                                        <p className="sub" style={{ fontSize: '.76rem' }}>
                                            <strong>Professional Operator Track.</strong> Move from prompting to deploying autonomous workflows, RAG systems, and audited AI architecture.
                                        </p>
                                        <div className="stats">
                                            <div className="stat">
                                                <div className="sn">{counts.modules}</div>
                                                <div className="sl">Core Modules</div>
                                            </div>
                                            <div className="stat">
                                                <div className="sn" style={{ color: 'var(--y)', textShadow: '0 0 14px rgba(255,215,0,.4)' }}>12+</div>
                                                <div className="sl">Deployments</div>
                                            </div>
                                            <div className="stat">
                                                <div className="sn" style={{ color: '#a78bff', textShadow: '0 0 14px rgba(167,139,255,.4)' }}>Agent</div>
                                                <div className="sl">Orchestration</div>
                                            </div>
                                            <div className="stat">
                                                <div className="sn" style={{ color: 'var(--g)', textShadow: '0 0 14px rgba(0,255,159,.4)' }}>Live</div>
                                                <div className="sl">Telemetry</div>
                                            </div>
                                        </div>
                                        <div className="tags">
                                            <span className="tag tc">Production RAG</span>
                                            <span className="tag tg">Tool-Calling</span>
                                            <span className="tag tp">Ethics &amp; Bias</span>
                                            <span className="tag tn">FinOps Controls</span>
                                        </div>
                                    </div>
                                    <div className="right" style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <AgentCore />
                                    </div>
                                </div>
                            </div>

                            {/* ── S1: EXPERT PATH ── */}
                            <div
                                ref={(el) => { sectionRefs.current[1] = el; }}
                                className={`sec${currentSection === 1 ? ' on' : ''}`}
                                id="s1"
                            >
                                <div className="tag-line fu d1">Your Journey</div>
                                <h2 className="mod fu d2">Zero to AI Architect — 4 Modules</h2>
                                <p className="sub fu d3" style={{ fontSize: '.74rem' }}>
                                    Other programs teach you <em>about</em> AI. ZEN makes you someone who can <strong>build, deploy, audit and lead</strong> AI systems.
                                </p>
                                <div className="path-stages fu d4">
                                    <div className="ps">
                                        <div className="ps-num" style={{ background: 'rgba(0,212,255,.12)', border: '1px solid rgba(0,212,255,.28)', color: 'var(--c)' }}>01</div>
                                        <div>
                                            <div className="ps-title">LITERATE — Understand what's actually happening</div>
                                            <div className="ps-desc">Tokens, transformers, hallucinations, API keys. Speak the language of AI without the hype.</div>
                                            <div className="ps-caps">
                                                <span className="ps-cap" style={{ background: 'rgba(0,212,255,.08)', border: '1px solid rgba(0,212,255,.2)', color: 'var(--c)' }}>Spot weak outputs</span>
                                                <span className="ps-cap" style={{ background: 'rgba(0,212,255,.08)', border: '1px solid rgba(0,212,255,.2)', color: 'var(--c)' }}>Explain models precisely</span>
                                                <span className="ps-cap" style={{ background: 'rgba(0,212,255,.08)', border: '1px solid rgba(0,212,255,.2)', color: 'var(--c)' }}>Handle API keys safely</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ps">
                                        <div className="ps-num" style={{ background: 'rgba(255,215,0,.1)', border: '1px solid rgba(255,215,0,.26)', color: 'var(--y)' }}>02</div>
                                        <div>
                                            <div className="ps-title">BUILDER — Ship your first live AI app</div>
                                            <div className="ps-desc">Structured prompts, API calls, deployed Hugging Face Space in 60 minutes.</div>
                                            <div className="ps-caps">
                                                <span className="ps-cap" style={{ background: 'rgba(255,215,0,.08)', border: '1px solid rgba(255,215,0,.18)', color: 'var(--y)' }}>Prompt engineering</span>
                                                <span className="ps-cap" style={{ background: 'rgba(255,215,0,.08)', border: '1px solid rgba(255,215,0,.18)', color: 'var(--y)' }}>Live deployed app</span>
                                                <span className="ps-cap" style={{ background: 'rgba(255,215,0,.08)', border: '1px solid rgba(255,215,0,.18)', color: 'var(--y)' }}>Structured JSON output</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ps">
                                        <div className="ps-num" style={{ background: 'rgba(123,47,255,.1)', border: '1px solid rgba(123,47,255,.28)', color: '#a78bff' }}>03</div>
                                        <div>
                                            <div className="ps-title">AUTOMATOR — Agents that work for you</div>
                                            <div className="ps-desc">Chain tools, build RAG systems, deploy agents running multi-step workflows autonomously.</div>
                                            <div className="ps-caps">
                                                <span className="ps-cap" style={{ background: 'rgba(123,47,255,.08)', border: '1px solid rgba(123,47,255,.2)', color: '#a78bff' }}>Autonomous agents</span>
                                                <span className="ps-cap" style={{ background: 'rgba(123,47,255,.08)', border: '1px solid rgba(123,47,255,.2)', color: '#a78bff' }}>RAG pipelines</span>
                                                <span className="ps-cap" style={{ background: 'rgba(123,47,255,.08)', border: '1px solid rgba(123,47,255,.2)', color: '#a78bff' }}>Knowledge systems</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ps">
                                        <div className="ps-num" style={{ background: 'rgba(0,255,159,.08)', border: '1px solid rgba(0,255,159,.24)', color: 'var(--g)' }}>04</div>
                                        <div>
                                            <div className="ps-title">ARCHITECT — Operate production AI at scale</div>
                                            <div className="ps-desc">Monitor drift, optimize costs, audit bias, navigate the EU AI Act. Lead teams building AI.</div>
                                            <div className="ps-caps">
                                                <span className="ps-cap" style={{ background: 'rgba(0,255,159,.07)', border: '1px solid rgba(0,255,159,.17)', color: 'var(--g)' }}>Systems governance</span>
                                                <span className="ps-cap" style={{ background: 'rgba(0,255,159,.07)', border: '1px solid rgba(0,255,159,.17)', color: 'var(--g)' }}>FinOps for AI</span>
                                                <span className="ps-cap" style={{ background: 'rgba(0,255,159,.07)', border: '1px solid rgba(0,255,159,.17)', color: 'var(--g)' }}>Verifiable credential</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── S2: MODULE 01 — HALLUCINATION HUNT ── */}
                            <div
                                ref={(el) => { sectionRefs.current[2] = el; }}
                                className={`sec${currentSection === 2 ? ' on' : ''}`}
                                id="s2"
                            >
                                <div className="tag-line fu d1">Module 01 · Game Lab</div>
                                <h2 className="mod fu d2">The Intelligence Inside</h2>
                                <div className="two fu d3">
                                    <div className="left">
                                        <p className="sub" style={{ fontSize: '.74rem' }}>No mysticism. Understand what's <strong>actually happening</strong> inside every AI response.</p>
                                        <div className="clist">
                                            <div className="ci"><div className="ci-ico">🔢</div><div><div className="ci-t">Token</div><div className="ci-d">Numerical text fragment — the unit of all LLM processing</div></div></div>
                                            <div className="ci"><div className="ci-ico">🧠</div><div><div className="ci-t">Self-Attention</div><div className="ci-d">Every token weighs every other token simultaneously</div></div></div>
                                            <div className="ci"><div className="ci-ico">🎯</div><div><div className="ci-t">Hallucination</div><div className="ci-d">Confident but wrong — optimizes probability not truth</div></div></div>
                                            <div className="ci"><div className="ci-ico">🔑</div><div><div className="ci-t">API Key</div><div className="ci-d">Your credential. Never hardcode. Always env variables.</div></div></div>
                                            <div className="ci"><div className="ci-ico">💉</div><div><div className="ci-t">Prompt Injection</div><div className="ci-d">Malicious input overriding system instructions</div></div></div>
                                        </div>
                                        <div className="tags" style={{ marginTop: '.1rem' }}>
                                            <span className="tag tc">Gradient Descent</span>
                                            <span className="tag tp">Embeddings</span>
                                            <span className="tag tg">Context Window</span>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className="gp">
                                            <div className="gp-header">
                                                <div className="gp-title" style={{ color: 'var(--r)' }}>🔍 HALLUCINATION HUNT</div>
                                                <div className="gp-score">{hhFlipped.size} / 5</div>
                                            </div>
                                            <div className="gp-inst">
                                                5 AI claims. Click each card to reveal{' '}
                                                <strong style={{ color: 'var(--g)' }}>TRUE</strong> or{' '}
                                                <strong style={{ color: '#ff5733' }}>HALLUCINATED</strong>.
                                            </div>
                                            <div className="hh-cards" key={hhKey}>
                                                {HH_DATA.map((item, i) => (
                                                    <div
                                                        key={i}
                                                        className={`hh-card${hhFlipped.has(i) ? ' flipped' : ''}`}
                                                        onClick={() => hhFlip(i)}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') hhFlip(i); }}
                                                    >
                                                        <div className="hh-inner">
                                                            <div className="hh-front">
                                                                <span className="hh-ico">❓</span>
                                                                <span className="hh-q">{item.q}</span>
                                                            </div>
                                                            <div className={`hh-back ${item.ans ? 'true-back' : 'false-back'}`}>
                                                                <span className="hh-verdict" style={{ color: item.ans ? '#00ff9f' : '#ff5733' }}>
                                                                    {item.ans ? '✓ TRUE' : '✗ FAKE'}
                                                                </span>
                                                                <span className="hh-explain">{item.ex}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="hh-score-row">
                                                <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '.56rem', color: 'rgba(255,255,255,.38)' }}>
                                                    {hhFlipped.size === 5 ? 'Complete! All cards revealed.' : ''}
                                                </div>
                                                <button className="hh-reset" onClick={hhReset}>↺ RESET</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── S3: MODULE 02 — AGENT ARCHITECT ── */}
                            <div
                                ref={(el) => { sectionRefs.current[3] = el; }}
                                className={`sec${currentSection === 3 ? ' on' : ''}`}
                                id="s3"
                            >
                                <div className="tag-line fu d1">Module 02 · Game Lab</div>
                                <h2 className="mod fu d2">Agents &amp; Automation</h2>
                                <div className="two fu d3">
                                    <div className="left">
                                        <p className="sub" style={{ fontSize: '.74rem' }}>Software 3.0: AI systems that <strong>reason, plan, act, observe</strong>. Build agents running autonomously.</p>
                                        <div className="clist">
                                            <div className="ci"><div className="ci-ico">🔁</div><div><div className="ci-t">Reason → Act → Observe</div><div className="ci-d">The agentic loop — think, execute, evaluate, repeat</div></div></div>
                                            <div className="ci"><div className="ci-ico">🔧</div><div><div className="ci-t">Tool Calling</div><div className="ci-d">Model selects and invokes real tools: search, DB, email</div></div></div>
                                            <div className="ci"><div className="ci-ico">📚</div><div><div className="ci-t">RAG</div><div className="ci-d">Fetch real facts before generating — kills hallucinations</div></div></div>
                                            <div className="ci"><div className="ci-ico">🛡</div><div><div className="ci-t">Guardrails</div><div className="ci-d">Safety constraints preventing dangerous or infinite loops</div></div></div>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className="gp">
                                            <div className="gp-header">
                                                <div className="gp-title" style={{ color: 'var(--y)' }}>🏗 AGENT ARCHITECT</div>
                                                <div className="gp-score" style={{ color: aaStatusColor }}>{aaStatus}</div>
                                            </div>
                                            <div className="aa-scenario">
                                                📋 <strong>Scenario:</strong> Build an agent that researches top AI news daily and emails a summary to your team at 8am.
                                            </div>
                                            <div className="aa-tools">
                                                {AA_TOOLS.map((tool) => (
                                                    <div
                                                        key={tool.id}
                                                        className={`aa-tool${aaSelected.has(tool.id) ? ' selected' : ''}`}
                                                        onClick={() => toggleAATool(tool.id)}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleAATool(tool.id); }}
                                                    >
                                                        <span className="aa-tool-ico">{tool.ico}</span>
                                                        <div className="aa-tool-name">{tool.name}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="aa-configs">
                                                <span className="aa-cfg-label">LOOPS:</span>
                                                <div className="aa-cfg-opts">
                                                    {['1', '3', '∞'].map((v) => (
                                                        <span
                                                            key={v}
                                                            className={`aa-cfg-opt${aaLoops === v ? ' sel' : ''}`}
                                                            onClick={() => setAaLoops(v)}
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => { if (e.key === 'Enter') setAaLoops(v); }}
                                                        >{v}</span>
                                                    ))}
                                                </div>
                                                <span className="aa-cfg-label" style={{ marginLeft: '.3rem' }}>GUARDRAILS:</span>
                                                <div className="aa-cfg-opts">
                                                    {['off', 'on'].map((v) => (
                                                        <span
                                                            key={v}
                                                            className={`aa-cfg-opt${aaGuard === v ? ' sel' : ''}`}
                                                            onClick={() => setAaGuard(v)}
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => { if (e.key === 'Enter') setAaGuard(v); }}
                                                        >{v.toUpperCase()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <button className="aa-deploy" onClick={aaDeploy} disabled={aaDeploying}>
                                                ▶ DEPLOY AGENT
                                            </button>
                                            <div className="aa-log">
                                                {aaLog.map((entry, i) => (
                                                    <div key={i} className="aa-entry show">
                                                        <span style={{ fontSize: '.75rem' }}>{entry.ico}</span>
                                                        <span style={{ color: entry.color }}>{entry.msg}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── S4: MODULE 03 — PROMPT ENGINEER ── */}
                            <div
                                ref={(el) => { sectionRefs.current[4] = el; }}
                                className={`sec${currentSection === 4 ? ' on' : ''}`}
                                id="s4"
                            >
                                <div className="tag-line fu d1">Module 03 · Game Lab</div>
                                <h2 className="mod fu d2">Personal Intelligence</h2>
                                <div className="two fu d3">
                                    <div className="left">
                                        <p className="sub" style={{ fontSize: '.74rem' }}>Build a <strong>Second Brain</strong> with semantic search, knowledge graphs, and privacy-first design.</p>
                                        <div className="clist">
                                            <div className="ci"><div className="ci-ico">🔍</div><div><div className="ci-t">Semantic Search</div><div className="ci-d">Find by meaning not keywords — surfaces what you meant</div></div></div>
                                            <div className="ci"><div className="ci-ico">🕸</div><div><div className="ci-t">Knowledge Graph</div><div className="ci-d">Concepts as nodes, relationships as edges</div></div></div>
                                            <div className="ci"><div className="ci-ico">📦</div><div><div className="ci-t">Chunking</div><div className="ci-d">Split docs into embeddable pieces for retrieval</div></div></div>
                                            <div className="ci"><div className="ci-ico">🔒</div><div><div className="ci-t">Privacy Boundary</div><div className="ci-d">Design what stays local vs what goes to the cloud</div></div></div>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className="gp">
                                            <div className="gp-header">
                                                <div className="gp-title" style={{ color: '#a78bff' }}>✍ PROMPT ENGINEER</div>
                                                <div className="gp-score">{peScore >= 80 ? '✓ EXCELLENT' : 'TARGET: 80%'}</div>
                                            </div>
                                            <div className="gp-inst">Upgrade this weak prompt. Click components to add them.</div>
                                            <div className="pe-preview">{pePreviewContent}</div>
                                            <div className="pe-score-wrap">
                                                <span className="pe-score-label">QUALITY</span>
                                                <div className="pe-bar-outer">
                                                    <div className="pe-bar-fill" style={{ width: `${Math.min(100, peScore)}%` }} />
                                                </div>
                                                <span className="pe-score-pct" style={{ color: pePctColor }}>{Math.min(100, peScore)}%</span>
                                            </div>
                                            <div className="pe-chips">
                                                {PE_CHIPS.map((chip) => (
                                                    <span
                                                        key={chip.id}
                                                        className={`pe-chip${peAdded.has(chip.id) ? ' used' : ''}`}
                                                        onClick={() => peAddChip(chip)}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') peAddChip(chip); }}
                                                    >
                                                        {peAdded.has(chip.id) ? `✓ ${chip.label}` : `+ ${chip.label}`}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="pe-target">Target: reach <span>80%</span> to complete this module</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── S5: MODULE 04 — LIVE DASHBOARD ── */}
                            <div
                                ref={(el) => { sectionRefs.current[5] = el; }}
                                className={`sec${currentSection === 5 ? ' on' : ''}`}
                                id="s5"
                            >
                                <div className="tag-line fu d1">Module 04 · Live Lab</div>
                                <h2 className="mod fu d2">Systems Mastery</h2>
                                <div className="two fu d3">
                                    <div className="left">
                                        <p className="sub" style={{ fontSize: '.74rem' }}>Operate AI like a <strong>professional engineering team</strong>. Monitor, optimize, audit, comply.</p>
                                        <div className="chain">
                                            <div className="chain-i">
                                                <div className="chain-dot" />
                                                <div><div className="ct">Model Drift Detection</div><div className="cd">Catch accuracy decay before production fails</div></div>
                                            </div>
                                            <div className="chain-i">
                                                <div className="chain-dot" style={{ background: 'var(--y)', boxShadow: '0 0 6px rgba(255,215,0,.45)' }} />
                                                <div><div className="ct">FinOps for AI</div><div className="cd">Token economics, caching, cost-per-run budgets</div></div>
                                            </div>
                                            <div className="chain-i">
                                                <div className="chain-dot" style={{ background: '#a78bff', boxShadow: '0 0 6px rgba(167,139,255,.45)' }} />
                                                <div><div className="ct">Bias &amp; Ethics Audit</div><div className="cd">Systematic fairness testing before models ship</div></div>
                                            </div>
                                            <div className="chain-i">
                                                <div className="chain-dot" style={{ background: 'var(--g)', boxShadow: '0 0 6px rgba(0,255,159,.45)' }} />
                                                <div><div className="ct">EU AI Act · NIST RMF</div><div className="cd">Know what applies, what to document, what's risky</div></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className="gp" style={{ gap: '.45rem' }}>
                                            <div className="gp-title" style={{ color: 'var(--g)' }}>📊 LIVE AI SYSTEMS DASHBOARD</div>
                                            <div className="dash-grid">
                                                <div className="metric">
                                                    <div className="m-label">Accuracy</div>
                                                    <div className="m-val" style={{ color: 'var(--g)' }}>{metrics.acc.toFixed(1)}%</div>
                                                    <Sparkline points={sparkData.acc} min={90} max={97} stroke="#00ff9f" />
                                                </div>
                                                <div className="metric">
                                                    <div className="m-label">Latency</div>
                                                    <div className="m-val" style={{ color: 'var(--c)' }}>{Math.round(metrics.lat)}ms</div>
                                                    <Sparkline points={sparkData.lat} min={280} max={420} stroke="#00d4ff" />
                                                </div>
                                                <div className="metric">
                                                    <div className="m-label">Cost / 1k tok</div>
                                                    <div className="m-val" style={{ color: 'var(--y)' }}>${metrics.cost.toFixed(4)}</div>
                                                    <Sparkline points={sparkData.cost} min={0.0009} max={0.0016} stroke="#ffd700" />
                                                </div>
                                                <div className="metric" style={{ background: 'rgba(255,87,51,.038)', borderColor: 'rgba(255,87,51,.12)' }}>
                                                    <div className="m-label" style={{ color: 'rgba(255,87,51,.58)' }}>Drift Score</div>
                                                    <div className="m-val" style={{ color: '#ff5733' }}>{metrics.drift.toFixed(3)}</div>
                                                    <Sparkline points={sparkData.drift} min={0} max={0.16} stroke="#ff5733" />
                                                </div>
                                            </div>
                                            <div className="drift-card">
                                                <span style={{ fontFamily: "'Orbitron',monospace", fontSize: '.5rem', letterSpacing: '1.8px', color: 'rgba(255,87,51,.7)' }}>DRIFT MONITOR</span>
                                                <span style={{ fontFamily: "'Orbitron',monospace", fontSize: '.8rem', fontWeight: 700, color: driftAlert ? '#ff5733' : '#00ff9f' }}>
                                                    {driftAlert ? 'ELEVATED' : 'NOMINAL'}
                                                </span>
                                                {driftAlert && <div className="drift-badge">⚠ ALERT</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── S6: DEPLOY ── */}
                            <div
                                ref={(el) => { sectionRefs.current[6] = el; }}
                                className={`sec${currentSection === 6 ? ' on' : ''}`}
                                id="s6"
                            >
                                <div className="tag-line fu d1">Deploy Your AI</div>
                                <h2 className="mod fu d2" style={{ fontSize: 'clamp(.86rem,1.7vw,1.2rem)' }}>From Zero to Live App in 60 Seconds</h2>
                                <div className="two fu d3" style={{ gridTemplateColumns: '30% 1fr' }}>
                                    <div className="left" style={{ gap: '.48rem' }}>
                                        <p className="sub" style={{ fontSize: '.7rem' }}>Exact template from the ZEN Starter Guide. Swap model, add secret, deploy.</p>
                                        <div className="chain" style={{ gap: '.3rem' }}>
                                            <div className="chain-i">
                                                <div className="chain-dot" style={{ width: '7px', height: '7px' }} />
                                                <div><div className="ct" style={{ fontSize: '.62rem' }}>Create Space at huggingface.co</div></div>
                                            </div>
                                            <div className="chain-i">
                                                <div className="chain-dot" style={{ width: '7px', height: '7px', background: 'var(--y)', boxShadow: '0 0 5px rgba(255,215,0,.38)' }} />
                                                <div><div className="ct" style={{ fontSize: '.62rem' }}>Set SDK: Gradio · upload app.py</div></div>
                                            </div>
                                            <div className="chain-i">
                                                <div className="chain-dot" style={{ width: '7px', height: '7px', background: 'var(--g)', boxShadow: '0 0 5px rgba(0,255,159,.38)' }} />
                                                <div><div className="ct" style={{ fontSize: '.62rem' }}>Add OPENAI_API_KEY as Space Secret</div></div>
                                            </div>
                                            <div className="chain-i">
                                                <div className="chain-dot" style={{ width: '7px', height: '7px', background: '#a78bff', boxShadow: '0 0 5px rgba(167,139,255,.38)' }} />
                                                <div><div className="ct" style={{ fontSize: '.62rem' }}>Click Deploy → share the link</div></div>
                                            </div>
                                        </div>
                                        <div className="hf-bar" style={{ marginTop: 'auto' }}>
                                            <div>
                                                <div className="hf-name">🤗 Hugging Face Spaces</div>
                                                <div className="hf-desc">Free · No credit card · Live instantly</div>
                                            </div>
                                            <button className="hf-btn" onClick={() => window.open('https://huggingface.co/new-space', '_blank')}>
                                                LAUNCH →
                                            </button>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className="code-wrap">
                                            <button className={`cpbtn${copied ? ' done' : ''}`} onClick={copyCode}>
                                                {copied ? 'COPIED ✓' : 'COPY'}
                                            </button>
                                            <pre className="code">
                                                <span className="cc"># ZEN Vanguard Starter Template</span>{'\n'}
                                                <span className="cc"># huggingface.co/new-space → SDK: Gradio</span>{'\n'}
                                                <span className="cc"># Space Secret: OPENAI_API_KEY</span>{'\n\n'}
                                                <span className="ck">import</span> <span className="cv">os</span>{'\n'}
                                                <span className="ck">import</span> <span className="cv">gradio</span> <span className="ck">as</span> <span className="cv">gr</span>{'\n'}
                                                <span className="ck">from</span> <span className="cv">openai</span> <span className="ck">import</span> <span className="cf">OpenAI</span>{'\n\n'}
                                                <span className="cv">client</span> = <span className="cf">OpenAI</span>(api_key=<span className="cv">os</span>.<span className="cf">getenv</span>(<span className="cs">"OPENAI_API_KEY"</span>)){'\n\n'}
                                                <span className="ck">def</span> <span className="cf">answer</span>(question: <span className="cv">str</span>) -{'>'} <span className="cv">str</span>:{'\n'}
                                                {'    '}<span className="ck">if not</span> <span className="cv">os</span>.<span className="cf">getenv</span>(<span className="cs">"OPENAI_API_KEY"</span>):{'\n'}
                                                {'        '}<span className="ck">return</span> <span className="cs">"⚠ Add OPENAI_API_KEY in Space Secrets."</span>{'\n'}
                                                {'    '}resp = <span className="cv">client</span>.responses.<span className="cf">create</span>({'\n'}
                                                {'        '}model=<span className="cs">"gpt-4.1-mini"</span>, input=question{'\n'}
                                                {'    '}){'\n'}
                                                {'    '}<span className="ck">return</span> resp.output_text{'\n\n'}
                                                demo = <span className="cv">gr</span>.<span className="cf">Interface</span>({'\n'}
                                                {'    '}fn=<span className="cf">answer</span>,{'\n'}
                                                {'    '}inputs=<span className="cv">gr</span>.<span className="cf">Textbox</span>(label=<span className="cs">"Ask your AI"</span>),{'\n'}
                                                {'    '}outputs=<span className="cv">gr</span>.<span className="cf">Textbox</span>(label=<span className="cs">"Response"</span>),{'\n'}
                                                {'    '}title=<span className="cs">"🤖 My ZEN AI App"</span>,{'\n'}
                                                {'    '}theme=<span className="cv">gr</span>.<span className="cf">themes</span>.<span className="cf">Soft</span>(){'\n'}
                                                ){'\n'}
                                                demo.<span className="cf">launch</span>()
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── S7: CERTIFICATE ── */}
                            <div
                                ref={(el) => { sectionRefs.current[7] = el; }}
                                className={`sec${currentSection === 7 ? ' on' : ''}`}
                                id="s7"
                            >
                                <div className="tag-line fu d1">Your Credential</div>
                                <h2 className="mod fu d2" style={{ fontSize: 'clamp(.82rem,1.6vw,1.12rem)' }}>Certificate of Achievement — Intelligence Architect</h2>
                                <div className="cred-wrap fu d3">
                                    <div className="wm" />
                                    <div className="cert">
                                        <div className="cert-co">⬡ ZEN AI CO. ⬡</div>
                                        <div className="cert-name">ZEN AI CO.</div>
                                        <div style={{ fontSize: '.36rem', letterSpacing: '2px', color: 'rgba(255,255,255,.3)', fontFamily: "'Orbitron',monospace", textAlign: 'center' }}>
                                            FOUNDED UPON THE PRINCIPLE THAT AI LITERACY IS INFRASTRUCTURE
                                        </div>
                                        <div className="cert-div" />
                                        <div className="cert-title-bx">
                                            <div className="cert-title-tx">CERTIFICATE OF ACHIEVEMENT</div>
                                        </div>
                                        <div className="cert-it">This Certifies That</div>
                                        <div className="cert-line" />
                                        <div className="cert-body">Has Successfully Completed the ZEN Vanguard Intelligence Architect Program</div>
                                        <div className="cert-bullets">
                                            <span className="cb">» Applied AI Fundamentals &amp; LLM Architecture</span>
                                            <span className="cb">» Agents, Automation &amp; RAG Systems</span>
                                            <span className="cb">» Personal Intelligence &amp; Knowledge Systems</span>
                                            <span className="cb">» AI Systems Mastery &amp; Regulatory Compliance</span>
                                        </div>
                                        <div className="cert-foot">
                                            <div>
                                                <div className="csn">Alexander Leschik</div>
                                                <div className="cst">FOUNDER &amp; CHAIRMAN</div>
                                            </div>
                                            <div className="cert-seal">
                                                <div className="cs-t">ZEN AI</div>
                                                <div className="cs-t">2026</div>
                                            </div>
                                            <div>
                                                <div className="csn">Ella Roxman</div>
                                                <div className="cst">VICE COMMISSIONER</div>
                                            </div>
                                        </div>
                                        <div className="cert-id-row">
                                            <div className="cid">ID: ZEN-AIL-2026-000</div>
                                            <div className="cid">zenai.world</div>
                                        </div>
                                    </div>
                                    <div className="cred-lock">
                                        <div className="lock-ring">🔒</div>
                                        <div className="lt-m">PREVIEW MODE</div>
                                        <div className="lt-s">Complete all 4 modules and deploy your capstone to unlock your verified credential</div>
                                        <button className="earn-btn" onClick={() => alert('Complete all modules at zenai.world to unlock your credential.')}>
                                            EARN YOUR CREDENTIAL
                                        </button>
                                        <div style={{ fontSize: '.58rem', color: 'rgba(255,255,255,.24)', fontFamily: "'JetBrains Mono',monospace" }}>
                                            Verify: zenai.world · ID: ZEN-AIL-2026-000
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>{/* end ag-glass */}
                    </div>{/* end card3d */}
                </div>{/* end ag-scene */}
            </div>{/* end ag-app */}

            {/* ── DOT NAV ── */}
            <nav className="dot-nav" aria-label="Section navigation">
                {SECTIONS.map((sec, i) => (
                    <div
                        key={sec.id}
                        className={`dn${currentSection === i ? ' on' : ''}`}
                        role="button"
                        tabIndex={0}
                        aria-label={`Go to ${sec.label}`}
                        onClick={() => goTo(i)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(i); } }}
                    >
                        <span className="dn-lbl">{sec.label}</span>
                        <div className="dn-d" />
                    </div>
                ))}
            </nav>

            {/* ── BOTTOM NAV ── */}
            <nav className="bnav" aria-label="Main navigation">
                {BN_TARGETS.map((target, t) => {
                    const activeTab = getActiveTab(currentSection);
                    return (
                        <button
                            key={t}
                            className={`bn-tab${activeTab === t ? ' bn-active' : ''}`}
                            onClick={() => goTo(target)}
                            title={BN_LABELS[t]}
                        >
                            <span className="bn-ico">{BN_ICONS[t]}</span>
                            <span className="bn-lbl">{BN_LABELS[t]}</span>
                            <span className="bn-done-dot" />
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Dashboard;
