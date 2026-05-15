import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAdminEmail } from '../../services/adminAccess';
import { useAuth } from '../../hooks/useAuth';
import {
    getProgramAccessDecision,
    getProgramCatalog,
    type ProgramCatalogItem,
    type ProgramKey,
    type UserProgramState,
} from '../programIntegrationContract';
import { programRegistrationAdapter } from '../programRegistrationAdapter';
import { getSyntheticStandaloneUserId } from '../components/ProgramAccessGate';
import { getActiveArsenalProgramBridgeCatalog, type ArsenalProgramBridgeItem } from '../arsenalProgramBridge';

const activeProgramOrder = ['vanguard', 'ai-pioneer'] as const satisfies readonly ProgramKey[];
type ActiveProgramKey = (typeof activeProgramOrder)[number];
type ActiveProgramCatalogItem = ProgramCatalogItem & { programKey: ActiveProgramKey };

const activeProgramKeys = new Set<ProgramKey>(activeProgramOrder);
const pathway = ['Learn', 'Build', 'Deploy', 'Verify'];
const TICK_COUNT = 96;
const DIAL_START_ANGLE = -132;
const DIAL_SWEEP = 304;
const SVG_SIZE = 360;
const CENTER = 180;

const previewHighlights: Record<ProgramKey, string[]> = {
    vanguard: ['Agent command systems', 'Workflow automation', 'Governance evidence', 'CREDS proof path', 'Vault artifacts', 'Operator portfolio'],
    'ai-pioneer': ['AI foundations', 'Prompt literacy', 'Responsible AI', 'Gradio builds', 'Hugging Face launch', 'Showcase proof'],
    'homeschool-kit': ['Family pacing', 'Portfolio records', 'Capstone planning'],
    'web3-literacy': ['Wallet safety', 'Credential literacy', 'Trust systems'],
    'train-a-trainer': ['Facilitation', 'Assessment', 'Cohort delivery'],
};

interface MetricProfile {
    readiness: number;
    coverage: number;
    confidence: number;
    label: string;
    route: string;
    owner: string;
    kpi: string;
    outcome: string;
}

const metrics: Record<ProgramKey, MetricProfile> = {
    vanguard: {
        readiness: 96,
        coverage: 91,
        confidence: 94,
        label: 'Flagship operator track',
        route: 'Operator command route',
        owner: 'Arsenal program ops',
        kpi: 'Deployment readiness',
        outcome: 'Production-minded AI systems portfolio with governance, agents, and dry-run credential evidence.',
    },
    'ai-pioneer': {
        readiness: 88,
        coverage: 84,
        confidence: 90,
        label: 'Youth builder track',
        route: 'Builder launch route',
        owner: 'ZEN youth programs',
        kpi: 'Live app proof',
        outcome: 'A live AI-powered Hugging Face Space with portfolio, reflection, and showcase proof.',
    },
    'homeschool-kit': {
        readiness: 34,
        coverage: 42,
        confidence: 51,
        label: 'Family track',
        route: 'Family route',
        owner: 'Content staging',
        kpi: 'Pacing completeness',
        outcome: 'Capstone AI project with portfolio records.',
    },
    'web3-literacy': {
        readiness: 28,
        coverage: 37,
        confidence: 49,
        label: 'Trust track',
        route: 'Credential route',
        owner: 'Credential staging',
        kpi: 'Simulation clarity',
        outcome: 'Wallet safety and credential literacy path.',
    },
    'train-a-trainer': {
        readiness: 31,
        coverage: 39,
        confidence: 53,
        label: 'Facilitator track',
        route: 'Cohort route',
        owner: 'Cohort staging',
        kpi: 'Delivery readiness',
        outcome: 'Cohort playbook and facilitator evidence.',
    },
};

const tones = {
    vanguard: {
        mark: 'VA',
        accent: '#ef4444',
        accent2: '#2563eb',
        pale: '#f8fafc',
        glow: 'rgba(239,68,68,.32)',
        shadow: 'rgba(37,99,235,.28)',
        gradient: 'from-[#f8fafc] via-[#ef4444] to-[#1d4ed8]',
    },
    'ai-pioneer': {
        mark: 'AI',
        accent: '#3b82f6',
        accent2: '#ef4444',
        pale: '#ffffff',
        glow: 'rgba(59,130,246,.34)',
        shadow: 'rgba(239,68,68,.22)',
        gradient: 'from-[#ffffff] via-[#3b82f6] to-[#dc2626]',
    },
} satisfies Record<ActiveProgramKey, {
    mark: string;
    accent: string;
    accent2: string;
    pale: string;
    glow: string;
    shadow: string;
    gradient: string;
}>;

const routeNodes = [
    { id: 'preview', label: 'Preview', x: 8, y: 50 },
    { id: 'vanguard', label: 'Vanguard', x: 31, y: 29, programKey: 'vanguard' as ProgramKey },
    { id: 'ai-pioneer', label: 'AI Pioneer', x: 31, y: 71, programKey: 'ai-pioneer' as ProgramKey },
    { id: 'register', label: 'Register', x: 63, y: 50 },
    { id: 'arsenal', label: 'Arsenal', x: 91, y: 50 },
];

const routeLinks = [
    ['preview', 'vanguard'],
    ['preview', 'ai-pioneer'],
    ['vanguard', 'register'],
    ['ai-pioneer', 'register'],
    ['register', 'arsenal'],
] as const;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const clampPercent = (value: number) => clamp(Math.round(value), 0, 100);
const formatMoney = (value: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
}).format(value);
const getNode = (id: string) => routeNodes.find((node) => node.id === id);
const isActiveProgramKey = (programKey: ProgramKey): programKey is ActiveProgramKey => activeProgramKeys.has(programKey);
const isActiveProgram = (program: ProgramCatalogItem): program is ActiveProgramCatalogItem => isActiveProgramKey(program.programKey);
const getActiveIndex = (programKey: ProgramKey) => activeProgramOrder.findIndex((activeKey) => activeKey === programKey);
const getUserId = (user: ReturnType<typeof useAuth>['user']) => user?.id ?? getSyntheticStandaloneUserId(user?.email);

const sortPrograms = (programs: ProgramCatalogItem[]) => (
    [...programs].sort((first, second) => {
        const firstIndex = getActiveIndex(first.programKey);
        const secondIndex = getActiveIndex(second.programKey);

        if (firstIndex >= 0 || secondIndex >= 0) {
            return (firstIndex >= 0 ? firstIndex : 99) - (secondIndex >= 0 ? secondIndex : 99);
        }

        return first.title.localeCompare(second.title);
    })
);

const polarToCartesian = (cx: number, cy: number, radius: number, angleDeg: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
        x: cx + radius * Math.cos(angleRad),
        y: cy + radius * Math.sin(angleRad),
    };
};

const describeArc = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? '0' : '1';

    return [
        'M',
        start.x.toFixed(3),
        start.y.toFixed(3),
        'A',
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x.toFixed(3),
        end.y.toFixed(3),
    ].join(' ');
};

const starPath = (cx: number, cy: number, outer: number, inner: number, points = 5) => {
    const path: string[] = [];

    for (let index = 0; index < points * 2; index += 1) {
        const radius = index % 2 === 0 ? outer : inner;
        const angle = -90 + (index * 180) / points;
        const point = polarToCartesian(cx, cy, radius, angle + 90);
        path.push(`${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`);
    }

    path.push('Z');
    return path.join(' ');
};

const getAngleFromPointer = (event: React.PointerEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

    return (angle + 360) % 360;
};

const angleToControl = (angle: number) => {
    const start = (DIAL_START_ANGLE + 360) % 360;
    const end = (DIAL_START_ANGLE + DIAL_SWEEP + 360) % 360;

    if (angle >= start) return clamp(((angle - start) / DIAL_SWEEP) * 100, 0, 100);
    if (angle <= end) return clamp(((angle + (360 - start)) / DIAL_SWEEP) * 100, 0, 100);
    return angle - end < start - angle ? 100 : 0;
};

const smootherstep = (edge0: number, edge1: number, value: number) => {
    const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return x * x * x * (x * (x * 6 - 15) + 10);
};

const calculateDial = (controlValue: number, selectedProgramKey: ActiveProgramKey) => {
    const value = clamp(controlValue, 0, 100);
    const normalized = value / 100;
    const smooth = smootherstep(0, 1, normalized);
    const selectedMetric = metrics[selectedProgramKey];
    const resonance = Math.sin(normalized * Math.PI * 2.2) * 0.5 + 0.5;
    const previewReadiness = clampPercent(selectedMetric.readiness - 10 + smooth * 14 + resonance * 3);
    const buildCoverage = clampPercent(selectedMetric.coverage - 12 + smooth * 18);
    const launchConfidence = clampPercent(selectedMetric.confidence - 8 + smooth * 10 - (normalized > 0.86 ? 3 : 0));
    const artifactYield = clamp(Math.round(4 + normalized * 9 + resonance * 2), 4, 15);
    const operatingScore = clampPercent((previewReadiness + buildCoverage + launchConfidence) / 3);
    const monthlyValue = 6200 + Math.round(Math.pow(normalized, 1.18) * 13200 + smooth * 2600 + selectedMetric.readiness * 42 + resonance * 360);
    const roi = Math.round((3.4 + normalized * 5.2 + smooth * 2.1 + resonance * 0.32) * 10) / 10;
    const systems = clamp(Math.round(3 + normalized * 9), 3, 12);
    const rollout = clamp(Math.round(9 - normalized * 5), 3, 9);
    const cost = Math.round(245 + systems * 37 + roi * 18);
    const payback = clamp(Math.round(44 - normalized * 30 + (selectedProgramKey === 'ai-pioneer' ? 2 : 0)), 8, 45);

    return {
        previewReadiness,
        buildCoverage,
        launchConfidence,
        artifactYield,
        operatingScore,
        monthlyValue,
        roi,
        systems,
        rollout,
        cost,
        payback,
        resonance,
        normalized,
        phase: normalized * 360,
        glow: 0.35 + normalized * 0.65,
    };
};

const runSelfTests = () => {
    console.assert(activeProgramOrder[0] === 'vanguard', 'Vanguard must remain first.');
    console.assert(activeProgramOrder[1] === 'ai-pioneer', 'AI Pioneer must remain second.');
    console.assert(pathway.join('|') === 'Learn|Build|Deploy|Verify', 'Pathway copy changed unexpectedly.');
    console.assert(TICK_COUNT >= 96, 'Dial should keep instrument-grade precision ticks.');
    console.assert(describeArc(100, 100, 50, 0, 180).startsWith('M'), 'SVG arc helper should return a path.');
    console.assert(starPath(10, 10, 5, 2).includes('Z'), 'Star geometry should close cleanly.');
    console.assert(Math.round(angleToControl(228)) === 0 && Math.round(angleToControl(172)) === 100, 'Pointer angle mapping should match dial endpoints.');
    activeProgramOrder.forEach((programKey) => {
        console.assert(previewHighlights[programKey].length >= 6, `Missing preview highlights for ${programKey}.`);
        console.assert(Boolean(tones[programKey].accent && tones[programKey].gradient), `Missing tone for ${programKey}.`);
        console.assert(calculateDial(52, programKey).operatingScore > 0, `Invalid dial score for ${programKey}.`);
    });
    routeLinks.forEach(([from, to]) => console.assert(Boolean(getNode(from) && getNode(to)), `Invalid route ${from} to ${to}.`));
};

runSelfTests();

const useCountUp = (value: number, durationMs = 620) => {
    const [displayValue, setDisplayValue] = useState(value);
    const previousValueRef = useRef(value);

    useEffect(() => {
        const startValue = previousValueRef.current;
        const startedAt = performance.now();
        let animationFrame = 0;

        const tick = (now: number) => {
            const progress = Math.min(1, (now - startedAt) / durationMs);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(startValue + (value - startValue) * eased);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(tick);
            } else {
                previousValueRef.current = value;
            }
        };

        animationFrame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animationFrame);
    }, [durationMs, value]);

    return displayValue;
};

const useSpringValue = (target: number, config = { stiffness: 0.105, damping: 0.875, precision: 0.0008 }) => {
    const [value, setValue] = useState(target);
    const valueRef = useRef(target);
    const velocityRef = useRef(0);
    const targetRef = useRef(target);

    useEffect(() => {
        targetRef.current = target;
    }, [target]);

    useEffect(() => {
        let animationFrame = 0;

        const tick = () => {
            const current = valueRef.current;
            const delta = targetRef.current - current;
            velocityRef.current = velocityRef.current * config.damping + delta * config.stiffness;
            const next = current + velocityRef.current;
            valueRef.current = Math.abs(delta) < config.precision && Math.abs(velocityRef.current) < config.precision ? targetRef.current : next;
            setValue(valueRef.current);
            animationFrame = requestAnimationFrame(tick);
        };

        animationFrame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animationFrame);
    }, [config.damping, config.precision, config.stiffness]);

    return value;
};

const usePointerVars = <T extends HTMLElement>() => {
    const ref = useRef<T | null>(null);
    const onPointerMove = useCallback((event: React.PointerEvent<T>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
        event.currentTarget.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
        event.currentTarget.style.setProperty('--pointer-opacity', '1');
    }, []);
    const onPointerLeave = useCallback((event: React.PointerEvent<T>) => {
        event.currentTarget.style.setProperty('--pointer-opacity', '0');
    }, []);

    return { ref, onPointerMove, onPointerLeave };
};

const ValueNumber: React.FC<{ value: number; suffix?: string; className?: string }> = ({ value, suffix = '', className = '' }) => {
    const animatedValue = useCountUp(value);

    return (
        <span
            className={`inline-block bg-[linear-gradient(112deg,#ffffff_0%,#f8fafc_15%,#bfdbfe_34%,#ef4444_55%,#2563eb_78%,#ffffff_100%)] bg-[length:330%_100%] bg-clip-text font-black tracking-[-0.07em] text-transparent drop-shadow-[0_0_24px_rgba(59,130,246,.20)] ${className}`}
            style={{ animation: 'zenValueShine 4.8s ease-in-out infinite' }}
        >
            {Math.round(animatedValue)}{suffix}
        </span>
    );
};

const MoneyValueNumber: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => {
    const animatedValue = useCountUp(value);

    return (
        <span
            className={`inline-block bg-[linear-gradient(112deg,#ffffff_0%,#eef6ff_16%,#bcd7ff_28%,#ffffff_42%,#e11d48_58%,#ffffff_72%,#60a5fa_92%)] bg-[length:340%_100%] bg-clip-text font-black leading-[.82] tracking-[-.105em] text-transparent ${className}`}
            style={{ animation: 'zenValueShine 4.4s ease-in-out infinite' }}
        >
            {formatMoney(animatedValue)}
        </span>
    );
};

const CanvasSignalField: React.FC<{ control: number; selectedProgramKey: ActiveProgramKey }> = ({ control, selectedProgramKey }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; radius: number; phase: number; red: boolean }>>([]);
    const controlRef = useRef(control);

    useEffect(() => {
        controlRef.current = control;
    }, [control]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;

        const context = canvas.getContext('2d', { alpha: true });
        if (!context) return undefined;

        let animationFrame = 0;

        const buildParticles = (width: number, height: number) => {
            particlesRef.current = Array.from({ length: 58 }, (_, index) => {
                const seed = Math.sin(index * 127.1) * 43758.5453;
                const random = seed - Math.floor(seed);

                return {
                    x: random * width,
                    y: ((Math.sin(index * 41.9) + 1) / 2) * height,
                    vx: 0.014 + (index % 6) * 0.008,
                    vy: -0.014 + (index % 7) * 0.005,
                    radius: 0.62 + (index % 4) * 0.18,
                    phase: random * Math.PI * 2,
                    red: selectedProgramKey === 'vanguard' ? index % 2 === 0 : index % 3 === 0,
                };
            });
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const width = canvas.clientWidth || 1;
            const height = canvas.clientHeight || 1;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            buildParticles(width, height);
        };

        const render = (time: number) => {
            const width = canvas.clientWidth || 1;
            const height = canvas.clientHeight || 1;
            const energy = controlRef.current / 100;
            const particles = particlesRef.current;

            context.clearRect(0, 0, width, height);

            particles.forEach((particle, index) => {
                const drift = Math.sin(time * 0.00018 + particle.phase + energy * 3.2) * 0.035;
                particle.x += (particle.vx + drift * 0.05) * (0.92 + energy * 0.24);
                particle.y += (particle.vy + drift * 0.03) * (0.92 + energy * 0.24) + Math.sin(time * 0.00055 + particle.phase) * 0.01;

                if (particle.x > width + 10) particle.x = -10;
                if (particle.y < -10) particle.y = height + 10;
                if (particle.y > height + 10) particle.y = -10;

                for (let connectionIndex = index + 1; connectionIndex < particles.length; connectionIndex += 1) {
                    const next = particles[connectionIndex];
                    const dx = particle.x - next.x;
                    const dy = particle.y - next.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 92) {
                        const alpha = (1 - distance / 92) * (0.07 + energy * 0.05);
                        const stroke = particle.red ? '248, 113, 113' : '147, 197, 253';
                        context.strokeStyle = `rgba(${stroke}, ${alpha})`;
                        context.lineWidth = 0.55;
                        context.beginPath();
                        context.moveTo(particle.x, particle.y);
                        context.lineTo(next.x, next.y);
                        context.stroke();
                    }
                }

                const pulse = 0.34 + Math.sin(time * 0.001 + particle.phase + energy * Math.PI) * 0.2;
                context.fillStyle = particle.red ? `rgba(255, 232, 232, ${0.09 + pulse * 0.14})` : `rgba(232, 242, 255, ${0.10 + pulse * 0.15})`;
                context.beginPath();
                context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                context.fill();
            });

            animationFrame = requestAnimationFrame(render);
        };

        resize();
        window.addEventListener('resize', resize);
        animationFrame = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        };
    }, [selectedProgramKey]);

    return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-70 mix-blend-screen" aria-hidden="true" />;
};

const Chip: React.FC<{ label: string; muted?: boolean; hot?: boolean }> = ({ label, muted = false, hot = false }) => (
    <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
        muted
            ? 'border-white/10 bg-white/[.025] text-[#778195]'
            : hot
                ? 'border-[rgba(248,250,252,.34)] bg-[linear-gradient(135deg,rgba(239,68,68,.16),rgba(37,99,235,.15))] text-white'
                : 'border-[rgba(96,165,250,.24)] bg-[rgba(15,23,42,.62)] text-[#dbeafe]'
    }`}>
        {label}
    </span>
);

const PathwayDial: React.FC<{
    selectedProgramKey: ActiveProgramKey;
    selectedProgramTitle: string;
    control: number;
    setControl: React.Dispatch<React.SetStateAction<number>>;
}> = ({ selectedProgramKey, selectedProgramTitle, control, setControl }) => {
    const dialRef = useRef<HTMLDivElement | null>(null);
    const [dragging, setDragging] = useState(false);
    const displayControl = useSpringValue(control);
    const dial = useMemo(() => calculateDial(displayControl, selectedProgramKey), [displayControl, selectedProgramKey]);
    const tone = tones[selectedProgramKey];
    const controlEnd = DIAL_START_ANGLE + displayControl * (DIAL_SWEEP / 100);
    const readinessEnd = DIAL_START_ANGLE + dial.previewReadiness * (DIAL_SWEEP / 100);
    const coverageEnd = DIAL_START_ANGLE + dial.buildCoverage * (DIAL_SWEEP / 100);
    const confidenceEnd = DIAL_START_ANGLE + dial.launchConfidence * (DIAL_SWEEP / 100);
    const controlArc = describeArc(180, 180, 145, DIAL_START_ANGLE, controlEnd);
    const haloArc = describeArc(CENTER, CENTER, 154, DIAL_START_ANGLE, controlEnd);
    const microArc = describeArc(CENTER, CENTER, 162, Math.max(DIAL_START_ANGLE, controlEnd - 20), controlEnd);
    const roiEnd = 34 + clamp(dial.roi * 18, 20, 304);
    const roiArc = describeArc(CENTER, CENTER, 96, 34, roiEnd);
    const readinessArc = describeArc(180, 180, 120, DIAL_START_ANGLE, readinessEnd);
    const coverageArc = describeArc(180, 180, 96, DIAL_START_ANGLE, coverageEnd);
    const confidenceArc = describeArc(180, 180, 72, DIAL_START_ANGLE, confidenceEnd);
    const knob = polarToCartesian(180, 180, 120, controlEnd);
    const outerKnob = polarToCartesian(180, 180, 145, controlEnd);
    const roiComet = polarToCartesian(CENTER, CENTER, 96, roiEnd);
    const confidenceComet = polarToCartesian(CENTER, CENTER, 72, confidenceEnd);
    const majorTick = Math.round((displayControl / 100) * (TICK_COUNT - 1));
    const spectralBeads = useMemo(() => Array.from({ length: 84 }, (_, index) => {
        const angle = DIAL_START_ANGLE + index * (DIAL_SWEEP / 83);
        const point = polarToCartesian(CENTER, CENTER, 170, angle);
        const normalizedIndex = index / 83;
        const distanceToControl = Math.abs(normalizedIndex - displayControl / 100);
        const isActive = normalizedIndex <= displayControl / 100;
        const bloom = clamp(1 - distanceToControl * 12, 0, 1);

        return { point, isActive, bloom, index };
    }), [displayControl]);
    const calibrationLabels = [0, 20, 40, 60, 80, 100].map((value) => ({
        value,
        point: polarToCartesian(CENTER, CENTER, 187, DIAL_START_ANGLE + (value / 100) * DIAL_SWEEP),
    }));
    const gemTrail = Array.from({ length: 7 }, (_, index) => ({
        point: polarToCartesian(CENTER, CENTER, 120, controlEnd - (index + 1) * 3.25),
        index,
        opacity: 0.34 - index * 0.04,
        radius: 8.5 - index * 0.78,
    }));
    const haloTrail = Array.from({ length: 6 }, (_, index) => ({
        point: polarToCartesian(CENTER, CENTER, 145, controlEnd - (index + 1) * 4.05),
        index,
        opacity: 0.24 - index * 0.032,
        radius: 3.6 - index * 0.26,
    }));
    const dialStars = useMemo(() => Array.from({ length: 42 }, (_, index) => {
        const ring = index % 3;
        const radius = ring === 0 ? 44 : ring === 1 ? 60 : 86;
        const angle = 18 + index * 37.2;
        const point = polarToCartesian(CENTER, CENTER, radius, angle);
        const opacity = 0.12 + ((index * 13) % 18) / 100;
        const size = 1.8 + (index % 4) * 0.28;

        return { point, opacity, size, index };
    }), []);

    const setFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!dialRef.current) return;
        const angle = getAngleFromPointer(event, dialRef.current);
        setControl(angleToControl(angle));
    };

    const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        event.preventDefault();
        setControl((current) => clamp(current - event.deltaY / 8, 0, 100));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') setControl((current) => clamp(current + 3, 0, 100));
        if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') setControl((current) => clamp(current - 3, 0, 100));
        if (event.key === 'Home') setControl(0);
        if (event.key === 'End') setControl(100);
    };

    return (
        <section className="relative min-h-[520px] overflow-hidden rounded-[38px] border border-[rgba(148,163,184,.18)] bg-[linear-gradient(145deg,rgba(2,6,23,.92),rgba(15,23,42,.86))] p-5 shadow-[24px_24px_70px_rgba(0,0,0,.48),-16px_-16px_52px_rgba(59,130,246,.08),0_0_92px_rgba(239,68,68,.12)] lg:min-h-[620px]">
            <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_22%_18%,rgba(59,130,246,.26),transparent_34%),radial-gradient(circle_at_78%_22%,rgba(239,68,68,.22),transparent_32%),linear-gradient(rgba(248,250,252,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(248,250,252,.055)_1px,transparent_1px)] [background-size:auto,auto,34px_34px,34px_34px]" />
            <CanvasSignalField control={displayControl} selectedProgramKey={selectedProgramKey} />
            <div className="pointer-events-none absolute -left-24 top-4 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-28 bottom-8 h-80 w-80 rounded-full bg-red-500/20 blur-3xl" />
            <div className="relative z-10 flex h-full flex-col">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[.28em] text-[#bfdbfe]">Pathway dial</p>
                        <h2 className="mt-2 max-w-xl text-3xl font-black leading-[.96] tracking-[-.055em] text-white sm:text-4xl">
                            Tune the preview route for {selectedProgramTitle}.
                        </h2>
                    </div>
                    <Chip label={`${programRegistrationAdapter.mode === 'supabase' ? 'Supabase live' : 'Supabase-ready'} registration`} hot />
                </div>

                <div
                    ref={dialRef}
                    role="slider"
                    tabIndex={0}
                    aria-label="Tune selected program readiness"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(control)}
                    onWheel={handleWheel}
                    onKeyDown={handleKeyDown}
                    onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        setDragging(true);
                        setFromPointer(event);
                    }}
                    onPointerMove={(event) => dragging && setFromPointer(event)}
                    onPointerUp={(event) => {
                        event.currentTarget.releasePointerCapture(event.pointerId);
                        setDragging(false);
                    }}
                    onPointerCancel={() => setDragging(false)}
                    className="group relative mx-auto mt-7 grid aspect-square w-full max-w-[500px] cursor-grab place-items-center rounded-full outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-white/70"
                    style={{ '--dial-phase': `${dial.phase}deg`, '--dial-glow': dial.glow } as React.CSSProperties}
                >
                    <div className="pointer-events-none absolute inset-[-7%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,.14),transparent_26%),radial-gradient(circle_at_34%_28%,rgba(30,64,175,.42),transparent_34%),radial-gradient(circle_at_72%_66%,rgba(185,28,28,.36),transparent_42%)] blur-2xl opacity-[calc(.58+var(--dial-glow)*.34)] transition-opacity" />
                    <div className="pointer-events-none absolute inset-[1.5%] rounded-full border border-white/[.045] bg-[radial-gradient(circle_at_34%_22%,rgba(255,255,255,.15),transparent_18%),radial-gradient(circle_at_72%_72%,rgba(59,130,246,.12),transparent_24%)] shadow-[inset_0_1px_0_rgba(255,255,255,.09),inset_18px_18px_60px_rgba(0,0,0,.24)]" />
                    <div className="machined-dial pointer-events-none absolute inset-[3.5%] rounded-full opacity-80" />
                    <div className="patriot-engraved-face pointer-events-none absolute inset-[5.7%] rounded-full opacity-[calc(.28+var(--dial-glow)*.16)]" />
                    <div className="dial-aura pointer-events-none absolute inset-[8%] rounded-full bg-[conic-gradient(from_var(--dial-phase),rgba(30,64,175,.0),rgba(59,130,246,.36),rgba(255,255,255,.22),rgba(190,18,60,.34),rgba(30,64,175,.0))] blur-2xl opacity-[calc(.34+var(--dial-glow)*.46)]" />
                    <div className="pointer-events-none absolute inset-[13%] rounded-full bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,.055)_42%,rgba(191,219,254,.075)_50%,transparent_64%)] blur-[1px]" />
                    <div className="pointer-events-none absolute inset-[18%] rounded-full border border-white/10 bg-[#071225]/58 shadow-[inset_24px_24px_58px_rgba(0,0,0,.52),inset_-16px_-16px_42px_rgba(59,130,246,.09),0_0_110px_rgba(30,64,175,.16)]" />
                    <div className="lens-caustic pointer-events-none absolute inset-[22%] rounded-full opacity-[calc(.18+var(--dial-glow)*.28)]" />
                    <div className="pointer-events-none absolute inset-[29%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_44%_32%,rgba(255,255,255,.12),transparent_26%),rgba(7,18,37,.54)] shadow-[inset_14px_14px_34px_rgba(0,0,0,.55),inset_-10px_-10px_26px_rgba(59,130,246,.07)]" />
                    <div className="inner-orb pointer-events-none absolute inset-[37%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,.18),transparent_26%),radial-gradient(circle_at_70%_70%,rgba(190,18,60,.14),transparent_34%),rgba(7,18,37,.38)] shadow-[inset_8px_8px_26px_rgba(0,0,0,.48),inset_-6px_-6px_20px_rgba(59,130,246,.08),0_0_46px_rgba(59,130,246,.10)]" />

                    <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} aria-hidden="true">
                        <defs>
                            <linearGradient id="programDialPrimary" x1="40" y1="30" x2="330" y2="330" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#ffffff" />
                                <stop offset=".22" stopColor="#bfdbfe" />
                                <stop offset=".49" stopColor={tone.accent2} />
                                <stop offset=".75" stopColor={tone.accent} />
                                <stop offset="1" stopColor="#ffffff" />
                            </linearGradient>
                            <linearGradient id="programDialBlue" x1="330" y1="30" x2="40" y2="330" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#e11d48" />
                                <stop offset=".46" stopColor="#ffffff" />
                                <stop offset="1" stopColor="#60a5fa" />
                            </linearGradient>
                            <linearGradient id="programDialHalo" x1="40" y1="330" x2="330" y2="40" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#1d4ed8" />
                                <stop offset=".48" stopColor="#ffffff" />
                                <stop offset="1" stopColor="#be123c" />
                            </linearGradient>
                            <linearGradient id="programDialGlint" x1="65" y1="54" x2="288" y2="306" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#ffffff" stopOpacity=".56" />
                                <stop offset=".28" stopColor="#ffffff" stopOpacity=".08" />
                                <stop offset=".62" stopColor="#93c5fd" stopOpacity=".15" />
                                <stop offset="1" stopColor="#e11d48" stopOpacity=".06" />
                            </linearGradient>
                            <filter id="programDialGlow" x="-45%" y="-45%" width="190%" height="190%">
                                <feGaussianBlur stdDeviation="5.8" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                            <filter id="programSoftGlow" x="-35%" y="-35%" width="170%" height="170%">
                                <feGaussianBlur stdDeviation="2.6" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                            <filter id="programEtchedInset" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="1" stdDeviation="0.6" floodColor="#000000" floodOpacity="0.55" />
                                <feDropShadow dx="0" dy="-0.6" stdDeviation="0.35" floodColor="#ffffff" floodOpacity="0.12" />
                            </filter>
                            <radialGradient id="programGlassFace" cx="35%" cy="28%" r="78%">
                                <stop offset="0" stopColor="#ffffff" stopOpacity=".12" />
                                <stop offset=".38" stopColor="#bfdbfe" stopOpacity=".04" />
                                <stop offset=".74" stopColor="#be123c" stopOpacity=".055" />
                                <stop offset="1" stopColor="#020617" stopOpacity=".24" />
                            </radialGradient>
                            <pattern id="programFlagStripes" patternUnits="userSpaceOnUse" width="360" height="28">
                                <rect width="360" height="14" fill="rgba(190,18,60,.20)" />
                                <rect y="14" width="360" height="14" fill="rgba(255,255,255,.10)" />
                            </pattern>
                            <clipPath id="programDialFaceClip">
                                <circle cx="180" cy="180" r="148" />
                            </clipPath>
                        </defs>

                        <circle cx="180" cy="180" r="152" fill="rgba(2,6,23,.10)" stroke="rgba(59,130,246,.12)" strokeWidth="26" />
                        <circle cx="180" cy="180" r="149" fill="url(#programGlassFace)" stroke="rgba(255,255,255,.045)" strokeWidth="1" />
                        <g clipPath="url(#programDialFaceClip)" opacity=".23">
                            <rect x="0" y="0" width="360" height="360" fill="url(#programFlagStripes)" transform="rotate(-18 180 180) translate(0 2)" />
                            <rect x="78" y="72" width="118" height="84" rx="18" fill="rgba(30,64,175,.25)" transform="rotate(-18 137 114)" />
                        </g>
                        <g opacity=".72">
                            {dialStars.map(({ point, opacity, size, index }) => (
                                <path key={`dial-star-${index}`} d={starPath(point.x, point.y, size, size * 0.45)} fill="rgba(255,255,255,.76)" opacity={opacity} />
                            ))}
                        </g>
                        <path d="M 82 112 C 121 54 238 55 277 113" fill="none" stroke="url(#programDialGlint)" strokeWidth="2.2" strokeLinecap="round" opacity=".58" />
                        <path d="M 72 139 C 114 82 250 82 290 139" fill="none" stroke="rgba(255,255,255,.075)" strokeWidth=".8" strokeLinecap="round" opacity=".72" />
                        <circle cx="180" cy="180" r="166" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="1" />
                        <circle cx="180" cy="180" r="158" fill="none" stroke="rgba(191,219,254,.10)" strokeWidth="1.4" strokeDasharray="2 12" />
                        <circle cx="180" cy="180" r="174" fill="none" stroke="rgba(255,255,255,.035)" strokeWidth=".8" strokeDasharray=".6 7" />
                        <circle cx="180" cy="180" r="111" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth=".9" strokeDasharray=".7 8" />
                        <circle cx="180" cy="180" r="137" fill="none" stroke="rgba(0,0,0,.34)" strokeWidth="1.2" />
                        <circle cx="180" cy="180" r="136" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth=".7" />

                        <path d={haloArc} fill="none" stroke="url(#programDialHalo)" strokeWidth="12" strokeLinecap="round" opacity=".08" filter="url(#programDialGlow)" />
                        <path d={haloArc} fill="none" stroke="url(#programDialHalo)" strokeWidth="8" strokeLinecap="round" opacity=".16" filter="url(#programDialGlow)" />
                        <path d={microArc} fill="none" stroke="#ffffff" strokeWidth="3.4" strokeLinecap="round" opacity=".16" filter="url(#programSoftGlow)" />
                        <path d={microArc} fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity=".92" filter="url(#programSoftGlow)" />
                        <path d={controlArc} fill="none" stroke="url(#programDialHalo)" strokeLinecap="round" strokeWidth="3" opacity=".84" filter="url(#programSoftGlow)" />
                        <circle cx="180" cy="180" r="132" fill="none" stroke="rgba(255,255,255,.045)" strokeWidth="2" strokeDasharray="1.2 10" />
                        <circle cx="180" cy="180" r="120" fill="none" stroke="rgba(255,255,255,.075)" strokeWidth="16" />
                        <circle cx="180" cy="180" r="96" fill="none" stroke="rgba(239,68,68,.105)" strokeWidth="10" />
                        <circle cx="180" cy="180" r="72" fill="none" stroke="rgba(59,130,246,.125)" strokeWidth="7" />

                        <path d="M78 180 C98 96 258 96 282 180" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="1.2" strokeDasharray="5 12" className="dial-thread" />
                        <path d="M91 224 C125 304 238 304 270 224" fill="none" stroke="rgba(239,68,68,.085)" strokeWidth="1.1" strokeDasharray="4 10" className="dial-thread slow" />
                        <path d="M68 142 C112 45 250 45 294 142" fill="none" stroke="rgba(96,165,250,.085)" strokeWidth="1" strokeDasharray="3 11" className="dial-thread ultra" />
                        <path d={readinessArc} fill="none" stroke="url(#programDialPrimary)" strokeWidth="22" strokeLinecap="round" opacity=".18" filter="url(#programDialGlow)" />
                        <path d={readinessArc} fill="none" stroke="url(#programDialPrimary)" strokeWidth="16" strokeLinecap="round" filter="url(#programDialGlow)" />
                        <path d={roiArc} fill="none" stroke="url(#programDialBlue)" strokeWidth="15" strokeLinecap="round" opacity=".18" filter="url(#programDialGlow)" />
                        <path d={roiArc} fill="none" stroke="url(#programDialBlue)" strokeWidth="10" strokeLinecap="round" filter="url(#programDialGlow)" />
                        <path d={coverageArc} fill="none" stroke="url(#programDialBlue)" strokeLinecap="round" strokeWidth="8" opacity=".72" filter="url(#programSoftGlow)" />
                        <path d={confidenceArc} fill="none" stroke="url(#programDialPrimary)" strokeWidth="10" strokeLinecap="round" opacity=".15" filter="url(#programSoftGlow)" />
                        <path d={confidenceArc} fill="none" stroke="url(#programDialPrimary)" strokeWidth="7" strokeLinecap="round" opacity=".78" />
                        {Array.from({ length: TICK_COUNT }, (_, index) => {
                            const angle = DIAL_START_ANGLE + index * (DIAL_SWEEP / (TICK_COUNT - 1));
                            const active = index / (TICK_COUNT - 1) <= displayControl / 100;
                            const outer = polarToCartesian(CENTER, CENTER, index % 8 === 0 ? 162 : 157, angle);
                            const inner = polarToCartesian(CENTER, CENTER, index % 8 === 0 ? 141 : 150, angle);
                            const isMajor = index % 8 === 0;
                            const isFocus = Math.abs(index - majorTick) <= 1;
                            const activeStroke = index % 3 === 0 ? 'rgba(248,113,113,.62)' : 'rgba(147,197,253,.58)';
                            return (
                                <line
                                    key={index}
                                    x1={inner.x}
                                    y1={inner.y}
                                    x2={outer.x}
                                    y2={outer.y}
                                    stroke={isFocus ? 'rgba(255,255,255,.98)' : active ? (isMajor ? 'rgba(255,255,255,.78)' : activeStroke) : isMajor ? 'rgba(255,255,255,.25)' : 'rgba(191,219,254,.14)'}
                                    strokeWidth={isFocus ? 2 : isMajor ? 1.35 : 0.7}
                                    opacity={isFocus ? 1 : active ? .94 : .72}
                                    filter={isFocus ? 'url(#programSoftGlow)' : undefined}
                                />
                            );
                        })}

                        {calibrationLabels.map(({ value, point }) => (
                            <text key={value} x={point.x} y={point.y} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,.30)" fontSize="7" fontWeight="900" letterSpacing="1" filter="url(#programEtchedInset)">
                                {value}
                            </text>
                        ))}
                        {spectralBeads.map(({ point, isActive, bloom, index }) => (
                            <circle key={`dial-bead-${index}`} cx={point.x} cy={point.y} r={0.92 + bloom * 1.48} fill={isActive ? (index % 3 === 0 ? '#fb7185' : '#bfdbfe') : 'rgba(191,219,254,.30)'} opacity={isActive ? .44 + bloom * .54 : .3} filter={bloom > .06 ? 'url(#programSoftGlow)' : undefined} className={bloom > .45 ? 'bead-bloom' : undefined} />
                        ))}
                        {haloTrail.map(({ point, index, opacity, radius }) => (
                            <circle key={`halo-trail-${index}`} cx={point.x} cy={point.y} r={radius} fill="#ffffff" opacity={opacity} filter="url(#programSoftGlow)" />
                        ))}
                        {gemTrail.map(({ point, index, opacity, radius }) => (
                            <circle key={`gem-trail-${index}`} cx={point.x} cy={point.y} r={radius} fill={index % 2 === 0 ? '#93c5fd' : '#fb7185'} opacity={opacity} filter="url(#programDialGlow)" />
                        ))}
                        <g opacity=".9">
                            <circle cx="180" cy="32" r="4" fill="#ffffff" filter="url(#programSoftGlow)" />
                            <circle cx="302" cy="124" r="4.5" fill="#60a5fa" filter="url(#programSoftGlow)" />
                            <circle cx="263" cy="291" r="3.6" fill="#e11d48" filter="url(#programSoftGlow)" />
                            <circle cx="76" cy="280" r="4.4" fill="#ffffff" filter="url(#programSoftGlow)" />
                            <circle cx="55" cy="126" r="3.4" fill="#93c5fd" filter="url(#programSoftGlow)" />
                            <text x="180" y="19" textAnchor="middle" fill="rgba(255,255,255,.38)" fontSize="6.8" fontWeight="800" letterSpacing="2">VALUE</text>
                            <text x="317" y="181" textAnchor="middle" fill="rgba(248,113,113,.38)" fontSize="6.2" fontWeight="800" letterSpacing="1.5">ROI</text>
                            <text x="43" y="181" textAnchor="middle" fill="rgba(147,197,253,.38)" fontSize="6.2" fontWeight="800" letterSpacing="1.5">CONF</text>
                        </g>
                        <circle cx={outerKnob.x} cy={outerKnob.y} r="7.5" fill="rgba(255,255,255,.12)" filter="url(#programDialGlow)" />
                        <circle cx={outerKnob.x} cy={outerKnob.y} r="4" fill="#ffffff" opacity=".86" filter="url(#programDialGlow)" />
                        <circle cx={roiComet.x} cy={roiComet.y} r="3.6" fill="#fb7185" opacity=".82" filter="url(#programSoftGlow)" />
                        <circle cx={confidenceComet.x} cy={confidenceComet.y} r="2.8" fill="#60a5fa" opacity=".78" filter="url(#programSoftGlow)" />
                        <circle cx={knob.x} cy={knob.y} r="22" fill="rgba(255,255,255,.12)" filter="url(#programDialGlow)" />
                        <circle cx={knob.x} cy={knob.y} r="16" fill="url(#programDialPrimary)" stroke="rgba(255,255,255,.86)" strokeWidth="3" filter="url(#programDialGlow)" />
                        <path d={starPath(knob.x - .5, knob.y - .5, 5.3, 2.35)} fill="rgba(2,6,23,.72)" opacity=".82" />
                        <circle cx={knob.x - 4.5} cy={knob.y - 5.2} r="3.6" fill="rgba(255,255,255,.84)" />
                    </svg>

                    <div className="relative z-10 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[.26em] text-[#bfdbfe]">Pathway value</p>
                        <MoneyValueNumber value={dial.monthlyValue} className="mt-3 text-[3.1rem] sm:text-[4.8rem] lg:text-[5.8rem]" />
                        <div className="mx-auto mt-3 h-px w-[78%] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                        <p className="mx-auto mt-3 max-w-[260px] text-xs font-semibold leading-5 text-slate-200">
                            {selectedProgramTitle} / {dial.operatingScore}% operating score / {dial.roi}x ROI
                        </p>
                        <p className="mt-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#bfdbfe]/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100">
                            Scroll, drag the star core, or use arrow keys
                        </p>
                    </div>
                </div>

                <div className="relative z-10 mt-auto grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        ['Systems', dial.systems],
                        ['Rollout', `${dial.rollout}w`],
                        ['Cost', formatMoney(dial.cost)],
                        ['Payback', `${dial.payback}d`],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-[22px] border border-white/10 bg-slate-950/62 px-3 py-3 text-center shadow-[inset_5px_5px_14px_rgba(0,0,0,.42),inset_-4px_-4px_12px_rgba(59,130,246,.06)]">
                            <p className="text-[9px] font-black uppercase tracking-[.18em] text-slate-400">{label}</p>
                            <p className="mt-1 text-xl font-black tracking-[-.055em] text-white sm:text-2xl">{value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ProgramSignalMap: React.FC<{ selectedProgramKey: ActiveProgramKey; onSelect: (programKey: ActiveProgramKey) => void }> = ({ selectedProgramKey, onSelect }) => {
    const tone = tones[selectedProgramKey];

    return (
        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/54 p-5 shadow-[inset_8px_8px_20px_rgba(0,0,0,.42),inset_-6px_-6px_18px_rgba(37,99,235,.08)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(37,99,235,.18),transparent_34%),radial-gradient(circle_at_82%_62%,rgba(239,68,68,.14),transparent_34%)]" />
            <div className="relative">
                <p className="text-[10px] font-black uppercase tracking-[.28em] text-[#bfdbfe]">Release route</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-.035em] text-white">Preview to Arsenal unlock</h2>
                <svg className="mt-5 aspect-[16/7] w-full rounded-[24px] border border-white/10 bg-slate-950/70" viewBox="0 0 100 48" role="img" aria-label="Program registration route map">
                    <defs>
                        <radialGradient id="routeMapGlow">
                            <stop offset="0" stopColor={tone.pale} stopOpacity=".72" />
                            <stop offset=".48" stopColor={tone.accent} stopOpacity=".48" />
                            <stop offset="1" stopColor={tone.accent2} stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    {routeLinks.map(([from, to]) => {
                        const fromNode = getNode(from);
                        const toNode = getNode(to);
                        if (!fromNode || !toNode) return null;
                        const active = fromNode.programKey === selectedProgramKey || toNode.programKey === selectedProgramKey || from === 'register' || to === 'register';

                        return (
                            <line
                                key={`${from}-${to}`}
                                x1={fromNode.x}
                                y1={fromNode.y * .48}
                                x2={toNode.x}
                                y2={toNode.y * .48}
                                stroke={active ? tone.pale : 'rgba(148,163,184,.28)'}
                                strokeLinecap="round"
                                strokeWidth={active ? 1.3 : .75}
                                strokeDasharray={active ? '0' : '2 3'}
                            />
                        );
                    })}
                    {routeNodes.map((node) => {
                        const active = node.programKey === selectedProgramKey || (!node.programKey && ['preview', 'register', 'arsenal'].includes(node.id));
                        const programNode = Boolean(node.programKey);

                        return (
                            <g
                                key={node.id}
                                role={programNode ? 'button' : undefined}
                                tabIndex={programNode ? 0 : undefined}
                                onClick={() => node.programKey && isActiveProgramKey(node.programKey) && onSelect(node.programKey)}
                                onKeyDown={(event) => {
                                    if (node.programKey && isActiveProgramKey(node.programKey) && (event.key === 'Enter' || event.key === ' ')) onSelect(node.programKey);
                                }}
                                className={programNode ? 'cursor-pointer outline-none' : undefined}
                            >
                                {active && <circle cx={node.x} cy={node.y * .48} r={programNode ? 8.5 : 6.4} fill="url(#routeMapGlow)" />}
                                <circle cx={node.x} cy={node.y * .48} r={programNode ? 3.8 : 3.1} fill={active ? tone.accent : '#1e293b'} stroke={active ? '#ffffff' : 'rgba(148,163,184,.36)'} strokeWidth=".55" />
                                <text x={node.x} y={node.y * .48 + 7.5} textAnchor="middle" fill={active ? '#ffffff' : '#94a3b8'} fontSize="2.8" fontWeight="900">{node.label}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </section>
    );
};

interface ProgramCardProps {
    program: ActiveProgramCatalogItem;
    bridge: ArsenalProgramBridgeItem;
    state?: UserProgramState;
    isAuthenticated: boolean;
    isAdmin: boolean;
    selected: boolean;
    onSelect: (programKey: ActiveProgramKey) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, bridge, state, isAuthenticated, isAdmin, selected, onSelect }) => {
    const pointer = usePointerVars<HTMLElement>();
    const metric = metrics[program.programKey];
    const tone = tones[program.programKey];
    const decision = getProgramAccessDecision({ program, userState: state, isAuthenticated, isAdmin });
    const skills = (program.metadata.skills as string[] | undefined) ?? [];
    const chips = [...previewHighlights[program.programKey], ...skills].slice(0, 9);
    const registered = state?.registrationStatus === 'waitlisted' || state?.registrationStatus === 'invited' || state?.registrationStatus === 'enrolled';

    return (
        <article
            id={program.programKey}
            ref={pointer.ref}
            onPointerMove={pointer.onPointerMove}
            onPointerLeave={pointer.onPointerLeave}
            onFocus={() => onSelect(program.programKey)}
            onMouseEnter={() => onSelect(program.programKey)}
            className={`program-course-card ${program.programKey === 'ai-pioneer' ? 'ai-pioneer-field' : 'vanguard-field'} group relative min-h-[640px] overflow-hidden rounded-[38px] border p-5 transition duration-500 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-white/55 ${
                selected
                    ? 'border-white/28 bg-[linear-gradient(145deg,rgba(15,23,42,.94),rgba(30,41,59,.78))] shadow-[26px_26px_76px_rgba(0,0,0,.56),0_0_96px_rgba(59,130,246,.16),0_0_88px_rgba(239,68,68,.12)]'
                    : 'border-white/12 bg-[linear-gradient(145deg,rgba(15,23,42,.78),rgba(2,6,23,.86))] shadow-[18px_18px_54px_rgba(0,0,0,.46),-10px_-10px_34px_rgba(59,130,246,.06)]'
            }`}
            style={{ '--tone-glow': tone.glow, '--tone-shadow': tone.shadow } as React.CSSProperties}
        >
            <div className="pointer-events-none absolute inset-0 opacity-[var(--pointer-opacity,0)] transition-opacity duration-300" style={{ background: `radial-gradient(circle at var(--pointer-x,50%) var(--pointer-y,50%), ${tone.glow}, transparent 42%)` }} />
            <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.18),transparent_22%),radial-gradient(circle,rgba(59,130,246,.22),transparent_66%)] blur-2xl transition duration-500 group-hover:scale-110" />
            <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[.10] to-transparent opacity-0 transition duration-700 group-hover:translate-x-[330%] group-hover:opacity-100" />
            <div className="relative z-10 flex h-full flex-col">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => onSelect(program.programKey)}
                        className={`inline-flex items-center gap-3 rounded-[24px] border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-white/55 ${
                            selected ? `border-white/20 bg-gradient-to-br ${tone.gradient} text-slate-950` : 'border-white/12 bg-slate-950/58 text-white'
                        }`}
                    >
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-[16px] bg-slate-950/88 text-xs font-black text-white shadow-[inset_4px_4px_10px_rgba(0,0,0,.42)]">{tone.mark}</span>
                        <span>
                            <span className="block text-[10px] font-black uppercase tracking-[.22em]">{selected ? 'Selected' : 'Inspect'}</span>
                            <span className="mt-0.5 block text-xs font-semibold">{metric.label}</span>
                        </span>
                    </button>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Chip label="Preview open" hot={selected} />
                        {registered && <Chip label="You're on the list" hot />}
                    </div>
                </div>

                <div className="mt-7">
                    <p className="text-[11px] font-black uppercase tracking-[.32em] text-[#bfdbfe]">{metric.route}</p>
                    <h2 className="mt-3 max-w-2xl text-5xl font-black leading-[.9] tracking-[-.055em] text-white lg:text-6xl">
                        {program.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">{program.shortDescription}</p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                        ['Readiness', metric.readiness, '%'],
                        ['Coverage', metric.coverage, '%'],
                        ['Confidence', metric.confidence, '%'],
                    ].map(([label, value, suffix]) => (
                        <div key={label} className="rounded-[24px] border border-white/10 bg-slate-950/58 px-4 py-3 shadow-[inset_6px_6px_16px_rgba(0,0,0,.42),inset_-5px_-5px_14px_rgba(59,130,246,.06)]">
                            <p className="text-[10px] font-black uppercase tracking-[.18em] text-slate-400">{label}</p>
                            <ValueNumber value={Number(value)} suffix={String(suffix)} className="mt-1 text-3xl" />
                        </div>
                    ))}
                </div>

                <div className="mt-5 rounded-[28px] border border-white/10 bg-slate-950/56 p-5 shadow-[inset_8px_8px_22px_rgba(0,0,0,.42),inset_-6px_-6px_18px_rgba(37,99,235,.08)]">
                    <div className="grid gap-4 md:grid-cols-[1fr_.85fr]">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[.24em] text-white">What they build</p>
                            <p className="mt-2 text-sm leading-7 text-slate-100">{String(program.metadata.coreOutput ?? metric.outcome)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[.24em] text-[#bfdbfe]">Credential</p>
                            <p className="mt-2 text-sm leading-7 text-slate-100">{program.credentialLabel}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <p className="text-[10px] font-black uppercase tracking-[.24em] text-slate-400">Course coverage</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {chips.map((chip, index) => <Chip key={`${program.programKey}-${chip}-${index}`} label={chip} hot={selected && index < 4} />)}
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2">
                    {pathway.map((step, index) => (
                        <div key={step} className={`rounded-[18px] border px-2 py-3 text-center ${
                            selected && index <= 2 ? 'border-white/18 bg-white/[.08]' : 'border-white/10 bg-slate-950/44'
                        }`}>
                            <p className="text-[10px] font-black uppercase tracking-[.14em] text-white">{step}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-6">
                    <div className="mb-4 rounded-[22px] border border-white/10 bg-slate-950/50 px-4 py-3 text-xs leading-6 text-slate-200">
                        <span className="font-black text-white">Arsenal control layer:</span> {bridge.roleInArsenal}
                    </div>
                    {registered && (
                        <div className="mb-4 rounded-[20px] border border-white/18 bg-white/[.08] px-4 py-3 text-sm leading-6 text-white">
                            You're on the list. We'll notify you when enrollment opens.
                        </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to={bridge.overviewRoute}
                            className={`rounded-full bg-gradient-to-r ${tone.gradient} px-5 py-3 text-sm font-black text-slate-950 shadow-[0_20px_42px_rgba(0,0,0,.38)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/60`}
                        >
                            Preview program
                        </Link>
                        {decision.canRegister && (
                            <Link
                                to={`/programs/${program.slug}/register`}
                                className="rounded-full border border-white/20 bg-white/[.07] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[.11] focus:outline-none focus:ring-2 focus:ring-white/60"
                            >
                                Register interest
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

const FutureTrackRail: React.FC<{ programs: ProgramCatalogItem[]; isAdmin: boolean }> = ({ programs, isAdmin }) => (
    <section className="rounded-[30px] border border-white/8 bg-slate-950/48 p-4 shadow-[inset_7px_7px_18px_rgba(0,0,0,.34),inset_-6px_-6px_18px_rgba(37,99,235,.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[.28em] text-[#bfdbfe]">{isAdmin ? 'Admin tracks' : 'Future tracks'}</p>
                <h2 className="mt-1 text-xl font-black text-white">{isAdmin ? 'Unlocked for owner review' : 'Visible, but intentionally gated'}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-400">
                {isAdmin
                    ? 'royaltokens@gmail.com can inspect every staged program before public release.'
                    : 'All other programs stay muted until Arsenal admins publish or unlock them.'}
            </p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
            {programs.map((program) => (
                <article key={program.programKey} className={`min-h-[168px] rounded-[22px] border border-white/8 bg-slate-950/66 p-4 ${isAdmin ? 'opacity-100' : 'opacity-45 grayscale'}`}>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-[14px] border border-white/10 bg-white/[.04] text-xs font-black text-slate-300">
                            {String(program.metadata.icon ?? program.title.slice(0, 2)).slice(0, 2)}
                        </span>
                        <Chip label={isAdmin ? 'Admin unlocked' : 'Staged / gated'} muted={!isAdmin} />
                    </div>
                    <h3 className="mt-3 text-lg font-black text-white">{program.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {(previewHighlights[program.programKey] ?? []).slice(0, 3).map((chip) => <Chip key={`${program.programKey}-${chip}`} label={chip} muted />)}
                    </div>
                    {isAdmin && (
                        <Link
                            to={`/programs/${program.slug}`}
                            className="mt-4 inline-flex rounded-full border border-white/20 bg-white/[.07] px-4 py-2 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-white/[.11] focus:outline-none focus:ring-2 focus:ring-white/60"
                        >
                            Admin preview
                        </Link>
                    )}
                </article>
            ))}
        </div>
    </section>
);

const ProgramSuitePage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const isAdmin = isAdminEmail(user?.email);
    const [states, setStates] = useState<UserProgramState[]>([]);
    const [selectedProgramKey, setSelectedProgramKey] = useState<ActiveProgramKey>('vanguard');
    const [control, setControl] = useState(58);
    const userId = getUserId(user);

    useEffect(() => {
        let active = true;
        void programRegistrationAdapter.getCurrentUserProgramStates(userId)
            .then((nextStates) => {
                if (active) setStates(nextStates);
            })
            .catch((error) => console.warn('Program registration adapter fallback state unavailable.', error));

        return () => {
            active = false;
        };
    }, [userId]);

    const statesByProgramKey = useMemo(() => new Map(states.map((state) => [state.programKey, state])), [states]);
    const programs = useMemo(() => sortPrograms(getProgramCatalog()), []);
    const activePrograms = programs.filter(isActiveProgram);
    const futurePrograms = programs.filter((program) => !activeProgramKeys.has(program.programKey));
    const selectedProgram = activePrograms.find((program) => program.programKey === selectedProgramKey) ?? activePrograms[0];
    const bridgeByProgramKey = useMemo(() => new Map(
        getActiveArsenalProgramBridgeCatalog({
            userProgramStates: states,
            isAuthenticated,
            isAdmin,
        }).map((bridge) => [bridge.programKey, bridge]),
    ), [isAdmin, isAuthenticated, states]);

    return (
        <div className="program-suite-redblue min-h-screen overflow-x-hidden bg-[#020617] px-4 pb-12 pt-7 text-white sm:px-6 lg:px-8">
            <style>
                {`
                    .program-suite-redblue {
                        background:
                            radial-gradient(circle at 16% 0%, rgba(37,99,235,.28), transparent 32%),
                            radial-gradient(circle at 84% 10%, rgba(239,68,68,.22), transparent 30%),
                            linear-gradient(180deg, #020617 0%, #08111f 44%, #020617 100%);
                    }
                    .program-suite-redblue [id] { scroll-margin-top: 28px; }
                    .program-course-card { isolation: isolate; }
                    .program-course-card::before {
                        content: '';
                        position: absolute;
                        inset: -1px;
                        z-index: 0;
                        border-radius: inherit;
                        padding: 1px;
                        background: conic-gradient(from 160deg at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(255,255,255,.50), rgba(37,99,235,.34), rgba(239,68,68,.30), rgba(255,255,255,.12), rgba(255,255,255,.50));
                        mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                        mask-composite: exclude;
                        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                        -webkit-mask-composite: xor;
                        opacity: calc(.28 + (var(--pointer-opacity, 0) * .34));
                        pointer-events: none;
                    }
                    .vanguard-field::after {
                        content: '';
                        position: absolute;
                        inset: 0;
                        z-index: 0;
                        background:
                            linear-gradient(112deg, transparent 0 38%, rgba(255,255,255,.08) 48%, transparent 58%),
                            radial-gradient(circle at 22% 18%, rgba(239,68,68,.18), transparent 36%),
                            radial-gradient(circle at 78% 76%, rgba(37,99,235,.18), transparent 40%);
                        opacity: .85;
                        pointer-events: none;
                    }
                    .ai-pioneer-field::after {
                        content: '';
                        position: absolute;
                        inset: 0;
                        z-index: 0;
                        background:
                            radial-gradient(circle at 18% 18%, rgba(255,255,255,.50) 0 1px, transparent 1.8px),
                            radial-gradient(circle at 30% 30%, rgba(255,255,255,.34) 0 1px, transparent 1.8px),
                            radial-gradient(circle at 42% 16%, rgba(255,255,255,.28) 0 1px, transparent 1.8px),
                            repeating-linear-gradient(168deg, rgba(255,255,255,.035) 0 9px, rgba(239,68,68,.075) 9px 15px, rgba(37,99,235,.045) 15px 23px, transparent 23px 34px),
                            radial-gradient(circle at 70% 28%, rgba(37,99,235,.22), transparent 38%),
                            radial-gradient(circle at 22% 82%, rgba(239,68,68,.16), transparent 36%);
                        background-size: 58px 58px, 84px 84px, 112px 112px, auto, auto, auto;
                        opacity: .50;
                        animation: patrioticDrift 24s linear infinite;
                        pointer-events: none;
                    }
                    .machined-dial {
                        background:
                            repeating-conic-gradient(from 0deg, rgba(255,255,255,.055) 0deg, rgba(255,255,255,.012) .85deg, transparent 1.8deg, transparent 4.2deg),
                            radial-gradient(circle, transparent 0 50%, rgba(255,255,255,.045) 51%, transparent 52% 100%);
                        mask-image: radial-gradient(circle, transparent 0 42%, black 43% 78%, transparent 79%);
                        animation: faceSheen 12s ease-in-out infinite;
                    }
                    .patriot-engraved-face {
                        background-image: linear-gradient(45deg, rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(-45deg, rgba(147,197,253,.028) 1px, transparent 1px);
                        background-size: 38px 38px;
                        mask-image: radial-gradient(circle, transparent 0 35%, black 36% 84%, transparent 85%);
                        animation: microEtch 26s linear infinite;
                    }
                    .dial-aura {
                        animation: auraTurn 52s linear infinite;
                        transform-origin: center;
                        will-change: transform;
                    }
                    .lens-caustic {
                        background: conic-gradient(from 125deg, transparent, rgba(255,255,255,.06), transparent, rgba(59,130,246,.08), transparent, rgba(225,29,72,.07), transparent);
                        animation: causticGlide 8s ease-in-out infinite;
                    }
                    .inner-orb {
                        animation: innerOrbBreathe 5.8s ease-in-out infinite;
                    }
                    .dial-thread { animation: dialThread 8s linear infinite; }
                    .dial-thread.slow { animation-duration: 12s; }
                    .dial-thread.ultra { animation-duration: 5.4s; animation-delay: -1.2s; }
                    .bead-bloom { animation: beadPulse 1.8s ease-in-out infinite; }
                    @keyframes zenValueShine {
                        0% { background-position: 0% 50%; filter: drop-shadow(0 0 10px rgba(37,99,235,.14)); }
                        50% { background-position: 100% 50%; filter: drop-shadow(0 0 30px rgba(239,68,68,.22)); }
                        100% { background-position: 0% 50%; filter: drop-shadow(0 0 14px rgba(59,130,246,.20)); }
                    }
                    @keyframes patrioticDrift {
                        from { background-position: 0 0, 0 0, 0 0, 0 0, 0 0, 0 0; }
                        to { background-position: 58px 58px, -84px 84px, 112px -112px, 180px 0, 0 0, 0 0; }
                    }
                    @keyframes dialThread { to { stroke-dashoffset: -96; } }
                    @keyframes auraTurn { from { transform: rotate(0deg) scale(1); } to { transform: rotate(360deg) scale(1); } }
                    @keyframes causticGlide { 0%, 100% { transform: rotate(0deg) scale(1); filter: blur(0px); } 50% { transform: rotate(11deg) scale(1.025); filter: blur(.4px); } }
                    @keyframes innerOrbBreathe { 0%, 100% { transform: scale(.992); opacity: .9; } 50% { transform: scale(1.012); opacity: 1; } }
                    @keyframes beadPulse { 0%, 100% { opacity: .85; } 50% { opacity: 1; } }
                    @keyframes faceSheen { 0%, 100% { transform: rotate(0deg); opacity: .36; } 50% { transform: rotate(3deg); opacity: .52; } }
                    @keyframes microEtch { from { background-position: 0 0, 0 0; } to { background-position: 38px 38px, -38px 38px; } }
                    @media (prefers-reduced-motion: reduce) {
                        * { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; }
                    }
                `}
            </style>

            <main className="relative z-10 mx-auto max-w-[1680px]">
                <header className="mb-6 flex flex-wrap items-end justify-between gap-5">
                    <div>
                        <h1 className="max-w-5xl bg-[linear-gradient(112deg,#ffffff_0%,#bfdbfe_22%,#ef4444_54%,#2563eb_80%,#ffffff_100%)] bg-clip-text text-4xl font-black leading-[.9] tracking-[-.06em] text-transparent sm:text-6xl lg:text-7xl">
                            Choose the next ZEN operating track.
                        </h1>
                        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                            Vanguard and AI Pioneer stay available for preview and registration while every other program remains staged behind Arsenal release controls.
                        </p>
                    </div>
                    <div className="grid min-w-[280px] grid-cols-3 gap-2 rounded-[26px] border border-white/10 bg-slate-950/58 p-2 shadow-[inset_6px_6px_16px_rgba(0,0,0,.44),inset_-5px_-5px_14px_rgba(37,99,235,.07)]">
                        {[
                            ['Active', activePrograms.length],
                            ['Gated', futurePrograms.length],
                            ['Stage', 1],
                        ].map(([label, value]) => (
                            <div key={label} className="rounded-[18px] bg-white/[.04] px-3 py-3 text-center">
                                <p className="text-[10px] font-black uppercase tracking-[.18em] text-slate-400">{label}</p>
                                <ValueNumber value={Number(value)} className="mt-1 text-3xl" />
                            </div>
                        ))}
                    </div>
                </header>

                <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(440px,560px)_minmax(0,1fr)]">
                    {activePrograms.map((program, index) => {
                        const card = (
                            <ProgramCard
                                key={program.programKey}
                                program={program}
                                bridge={bridgeByProgramKey.get(program.programKey) as ArsenalProgramBridgeItem}
                                state={statesByProgramKey.get(program.programKey)}
                                isAuthenticated={isAuthenticated}
                                isAdmin={isAdmin}
                                selected={program.programKey === selectedProgramKey}
                                onSelect={setSelectedProgramKey}
                            />
                        );

                        if (index === 0) {
                            return card;
                        }

                        return (
                            <React.Fragment key={program.programKey}>
                                <PathwayDial
                                    selectedProgramKey={selectedProgramKey}
                                    selectedProgramTitle={selectedProgram?.title ?? 'selected program'}
                                    control={control}
                                    setControl={setControl}
                                />
                                {card}
                            </React.Fragment>
                        );
                    })}
                </section>

                <div className="mt-5 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
                    <ProgramSignalMap selectedProgramKey={selectedProgramKey} onSelect={setSelectedProgramKey} />
                    <FutureTrackRail programs={futurePrograms} isAdmin={isAdmin} />
                </div>
            </main>
        </div>
    );
};

export default ProgramSuitePage;
