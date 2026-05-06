import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(root, "..", "..");
const distDir = join(root, "exports");
mkdirSync(distDir, { recursive: true });

const logoPath = join(repoRoot, "src", "assets", "zen-logo.png");
const logo = `data:image/png;base64,${readFileSync(logoPath).toString("base64")}`;

const palette = {
  black: "#02050b",
  navy: "#061525",
  deep: "#081d32",
  panel: "#0a1624",
  line: "#86d7ff",
  cyan: "#5be7ff",
  gold: "#d8b264",
  white: "#f7fbff",
  muted: "#aebbd0",
  silver: "#d8e3ee",
};

const variants = [
  { id: "flagship-feed", label: "Instagram / LinkedIn Feed", width: 1080, height: 1350 },
  { id: "story-reel", label: "Story / Reel", width: 1080, height: 1920 },
  { id: "square", label: "Square Feed", width: 1080, height: 1080 },
  { id: "linkedin-wide", label: "LinkedIn Wide", width: 1920, height: 1080 },
  { id: "impact-growth-feed", label: "Impact Growth Feed", width: 1080, height: 1350 },
  { id: "impact-growth-story", label: "Impact Growth Story", width: 1080, height: 1920 },
  { id: "investor-impact-dossier", label: "Investor Impact Dossier", width: 1600, height: 2400 },
  { id: "investor-brief-wide", label: "Investor Brief Wide", width: 1920, height: 1080 },
];

const impactMetrics = {
  baselineYear: "Year 2 / 2024-2025",
  currentYear: "Year 3 / 2025-2026",
  learnersThen: 15000,
  learnersNow: 30000,
  appsThen: 12000,
  appsNow: 25000,
  countriesReached: 35,
  attestations: 8500,
  improvedAiConfidencePct: 94,
  appliedSkillsProfessionallyPct: 78,
  corporatePartnerships: 156,
  regions: [
    ["North America", 1200, 45],
    ["Europe", 800, 38],
    ["Asia Pacific", 600, 52],
    ["Latin America", 180, 67],
    ["Africa", 67, 89],
  ],
  trackCompletion: {
    homeschoolKit: 87,
    verifiableBuilderTrack: 72,
    agentOpsPro: 68,
  },
  launches: [
    ["Jarvis Voice App", "Voice-enabled AI assistant demo built on Hugging Face Spaces"],
    ["Alex Chatbot", "Conversational AI chatbot created by ZEN for dynamic interaction"],
    ["Qwen3-Coder WebDev", "Natural language to full web applications"],
  ],
  tracks: [
    ["Homeschool Kit", "Ages 11-18, parent-friendly, self-paced, printable guides", 87],
    ["Verifiable Builder Track", "On-chain attestations, token-gated submissions, SBT/NFT completer", 72],
    ["AgentOps Pro", "SLA table, cost per task, governance, incident post-mortems", 68],
  ],
  credentialingFlow: [
    ["Wallet Creation", 1000],
    ["Build -> Hash", 800],
    ["Submit -> Attest", 620],
    ["Token-Gated", 380],
    ["SBT / NFT", 150],
  ],
};

const growth = {
  learnerDelta: impactMetrics.learnersNow - impactMetrics.learnersThen,
  appDelta: impactMetrics.appsNow - impactMetrics.appsThen,
  learnerGrowthPct: Math.round(((impactMetrics.learnersNow - impactMetrics.learnersThen) / impactMetrics.learnersThen) * 100),
  appGrowthPct: Math.round(((impactMetrics.appsNow - impactMetrics.appsThen) / impactMetrics.appsThen) * 100),
  appOutputMultiple: (impactMetrics.appsNow / impactMetrics.appsThen).toFixed(2),
};

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const wrap = (text, maxChars) => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
};

const text = ({
  x,
  y,
  lines,
  size,
  fill = palette.white,
  weight = 600,
  anchor = "start",
  lineHeight = 1.18,
  tracking = 0,
  family = "Inter, Segoe UI, Arial, sans-serif",
  upper = false,
}) => {
  const step = Math.round(size * lineHeight);
  const content = lines
    .map((line, index) => {
      const value = esc(upper ? line.toUpperCase() : line);
      return `<tspan x="${x}" dy="${index === 0 ? 0 : step}">${value}</tspan>`;
    })
    .join("");
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${tracking}" text-anchor="${anchor}">${content}</text>`;
};

const rounded = ({ x, y, width, height, rx = 24, fill, stroke = palette.line, opacity = 1, strokeOpacity = 0.16 }) =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${fill}" fill-opacity="${opacity}" stroke="${stroke}" stroke-opacity="${strokeOpacity}"/>`;

const proofCard = ({ x, y, width, height, value, label, accent = palette.cyan }) => `
  <g transform="translate(${x} ${y})">
    ${rounded({ x: 0, y: 0, width, height, rx: 22, fill: "url(#panelGlass)" })}
    <rect x="0" y="0" width="${width}" height="4" rx="2" fill="${accent}" fill-opacity="0.9"/>
    ${text({ x: 24, y: 46, lines: wrap(value, Math.max(9, Math.floor(width / 19))), size: Math.min(31, width / 7.8), fill: palette.white, weight: 850, lineHeight: 0.98 })}
    ${text({ x: 24, y: height - 24, lines: wrap(label, Math.max(15, Math.floor(width / 9.5))).slice(0, 2), size: Math.min(16, width / 13), fill: palette.muted, weight: 680, lineHeight: 1.16 })}
  </g>`;

const systemNode = ({ x, y, width, title, body, accent = palette.cyan, anchor = "middle" }) => {
  const origin = anchor === "middle" ? -width / 2 : 0;
  const titleSize = Math.max(12, Math.min(15, width / 10.5));
  const bodySize = Math.max(10, Math.min(12.5, width / 14));
  return `
    <g transform="translate(${x} ${y})">
      ${rounded({ x: origin, y: -38, width, height: 76, rx: 18, fill: "#07192b", stroke: accent, strokeOpacity: 0.22 })}
      <circle cx="${origin + 22}" cy="-11" r="5" fill="${accent}"/>
      ${text({ x: origin + 38, y: -7, lines: [title], size: titleSize, fill: palette.white, weight: 820 })}
      ${text({ x: origin + 38, y: 18, lines: wrap(body, Math.floor(width / 8.4)).slice(0, 1), size: bodySize, fill: palette.muted, weight: 550 })}
    </g>`;
};

const background = (width, height) => `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#010309"/>
      <stop offset="42%" stop-color="#061527"/>
      <stop offset="100%" stop-color="#02050b"/>
    </linearGradient>
    <radialGradient id="haloCyan" cx="50%" cy="34%" r="65%">
      <stop offset="0%" stop-color="#5be7ff" stop-opacity="0.28"/>
      <stop offset="48%" stop-color="#0b3856" stop-opacity="0.11"/>
      <stop offset="100%" stop-color="#02050b" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="haloGold" cx="84%" cy="82%" r="50%">
      <stop offset="0%" stop-color="#d8b264" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#02050b" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="panelGlass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10243a" stop-opacity="0.86"/>
      <stop offset="54%" stop-color="#071522" stop-opacity="0.84"/>
      <stop offset="100%" stop-color="#0c1b2c" stop-opacity="0.72"/>
    </linearGradient>
    <linearGradient id="ctaGold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#b88734"/>
      <stop offset="45%" stop-color="#f2d385"/>
      <stop offset="100%" stop-color="#b88734"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#86d7ff" stroke-opacity="0.09" stroke-width="1"/>
    </pattern>
    <pattern id="microGrid" width="12" height="12" patternUnits="userSpaceOnUse">
      <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
    <filter id="softGlow" x="-35%" y="-35%" width="170%" height="170%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  <rect width="${width}" height="${height}" fill="url(#microGrid)"/>
  <rect width="${width}" height="${height}" fill="url(#haloCyan)"/>
  <rect width="${width}" height="${height}" fill="url(#haloGold)"/>
  <path d="M ${width * 0.08} ${height * 0.22} C ${width * 0.4} ${height * 0.08}, ${width * 0.58} ${height * 0.4}, ${width * 0.92} ${height * 0.18}" fill="none" stroke="${palette.cyan}" stroke-opacity="0.18" stroke-width="2"/>
  <path d="M ${width * 0.12} ${height * 0.82} C ${width * 0.42} ${height * 0.68}, ${width * 0.66} ${height * 0.98}, ${width * 0.94} ${height * 0.72}" fill="none" stroke="${palette.gold}" stroke-opacity="0.15" stroke-width="2"/>
`;

const header = ({ width, margin, y = 54, compact = false }) => `
  <g>
    <image href="${logo}" x="${margin}" y="${y - 29}" width="${compact ? 96 : 116}" height="${compact ? 38 : 46}" preserveAspectRatio="xMinYMid meet"/>
    ${text({ x: width - margin, y, lines: ["CIVIC AI LITERACY INFRASTRUCTURE"], size: compact ? 11 : 13, fill: palette.muted, weight: 760, anchor: "end", tracking: 2.2 })}
    <line x1="${margin}" y1="${y + 32}" x2="${width - margin}" y2="${y + 32}" stroke="${palette.line}" stroke-opacity="0.17"/>
  </g>`;

const ctaBlock = ({ x, y, width, height = 118, compact = false }) => `
  <g transform="translate(${x} ${y})">
    <rect width="${width}" height="${height}" rx="${compact ? 22 : 28}" fill="url(#ctaGold)"/>
    <rect x="3" y="3" width="${width - 6}" height="${height - 6}" rx="${compact ? 19 : 25}" fill="#07111d" fill-opacity="0.18"/>
    ${text({ x: 34, y: compact ? 45 : 51, lines: ["Partner With ZEN"], size: compact ? 28 : 34, fill: "#07111d", weight: 900 })}
    ${text({ x: 34, y: compact ? 75 : 85, lines: wrap("Build AI literacy, deployment capacity, and proof-linked workforce pathways.", compact ? 48 : 72), size: compact ? 13 : 16, fill: "#07111d", weight: 760, lineHeight: 1.15 })}
    <path d="M ${width - 76} ${height / 2} h34 m-14 -14 14 14 -14 14" fill="none" stroke="#07111d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;

const ecosystem = ({ cx, cy, radius, scale = 1, wide = false }) => {
  const ring = (r, opacity, stroke = palette.line) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${r * (wide ? 1.22 : 1)}" ry="${r * 0.72}" fill="none" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="1.4"/>`;

  const nodes = wide
    ? [
        { x: cx - radius * 1.14, y: cy - radius * 0.33, title: "AI Pioneer", body: "Youth literacy" },
        { x: cx + radius * 1.14, y: cy - radius * 0.33, title: "Vanguard", body: "Adult upskilling", accent: palette.gold },
        { x: cx - radius * 1.08, y: cy + radius * 0.5, title: "Arsenal", body: "Builder layer" },
        { x: cx + radius * 1.08, y: cy + radius * 0.5, title: "SBS", body: "Automation systems", accent: palette.gold },
        { x: cx, y: cy - radius * 0.95, title: "AI Social", body: "Community layer" },
        { x: cx, y: cy + radius * 1.03, title: "Web3 Proof", body: "Verified layer", accent: palette.gold },
      ]
    : [
        { x: cx - radius * 0.92, y: cy - radius * 0.58, title: "AI Pioneer", body: "Youth literacy" },
        { x: cx + radius * 0.92, y: cy - radius * 0.58, title: "Vanguard", body: "Adult upskilling", accent: palette.gold },
        { x: cx - radius * 0.92, y: cy + radius * 0.44, title: "Arsenal", body: "Builder layer" },
        { x: cx + radius * 0.92, y: cy + radius * 0.44, title: "SBS", body: "Automation systems", accent: palette.gold },
        { x: cx, y: cy - radius * 1.02, title: "AI Social", body: "Community layer" },
        { x: cx, y: cy + radius * 0.97, title: "Web3 Proof", body: "Verified layer", accent: palette.gold },
      ];

  const nodeWidth = 176 * scale;
  return `
    <g filter="url(#softGlow)">
      ${ring(radius * 1.05, 0.2)}
      ${ring(radius * 0.76, 0.17, palette.gold)}
      ${ring(radius * 0.48, 0.14)}
      <line x1="${cx - radius}" y1="${cy}" x2="${cx + radius}" y2="${cy}" stroke="${palette.line}" stroke-opacity="0.12"/>
      <line x1="${cx}" y1="${cy - radius * 0.75}" x2="${cx}" y2="${cy + radius * 0.75}" stroke="${palette.line}" stroke-opacity="0.12"/>
      <circle cx="${cx}" cy="${cy}" r="${radius * 0.31}" fill="#07192b" stroke="${palette.cyan}" stroke-opacity="0.45" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="${radius * 0.19}" fill="#0d263b" stroke="${palette.gold}" stroke-opacity="0.3"/>
      ${text({ x: cx, y: cy - 11 * scale, lines: ["ZEN"], size: 38 * scale, fill: palette.white, weight: 900, anchor: "middle", family: "Segoe UI, Arial, sans-serif" })}
      ${text({ x: cx, y: cy + 24 * scale, lines: ["ECOSYSTEM"], size: 12 * scale, fill: palette.gold, weight: 850, anchor: "middle", tracking: 2.4 })}
    </g>
    ${nodes
      .map((node) => systemNode({ ...node, width: nodeWidth, anchor: "middle" }))
      .join("")}`;
};

const proofCards = ({ x, y, width, cols, gap = 16, compact = false }) => {
  const items = [
    { value: "30,000", label: "Students reached in Year 3", accent: palette.gold },
    { value: "25,000", label: "Apps built across the movement" },
    { value: "+100%", label: "Student growth from 15,000", accent: palette.cyan },
    { value: "+108%", label: "App output growth from 12,000", accent: palette.gold },
  ];
  const cardWidth = (width - gap * (cols - 1)) / cols;
  const cardHeight = compact ? 104 : 124;
  return items
    .map((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      return proofCard({
        ...item,
        x: x + col * (cardWidth + gap),
        y: y + row * (cardHeight + gap),
        width: cardWidth,
        height: cardHeight,
      });
    })
    .join("");
};

const metricBar = ({ x, y, width, label, before, after, max, accent = palette.cyan }) => {
  const beforeWidth = Math.max(18, (before / max) * width);
  const afterWidth = Math.max(18, (after / max) * width);
  return `
    <g transform="translate(${x} ${y})">
      ${text({ x: 0, y: 0, lines: [label], size: 16, fill: palette.white, weight: 820 })}
      ${text({ x: width, y: 0, lines: [`${before.toLocaleString()} -> ${after.toLocaleString()}`], size: 14, fill: palette.muted, weight: 680, anchor: "end" })}
      <rect x="0" y="22" width="${width}" height="14" rx="7" fill="#081d32" stroke="${palette.line}" stroke-opacity="0.12"/>
      <rect x="0" y="22" width="${beforeWidth}" height="14" rx="7" fill="${palette.gold}" fill-opacity="0.42"/>
      <rect x="0" y="48" width="${width}" height="18" rx="9" fill="#081d32" stroke="${palette.line}" stroke-opacity="0.12"/>
      <rect x="0" y="48" width="${afterWidth}" height="18" rx="9" fill="${accent}" fill-opacity="0.88"/>
      ${text({ x: 0, y: 91, lines: ["LAST YEAR"], size: 10, fill: palette.gold, weight: 850, tracking: 2.2 })}
      ${text({ x: width, y: 91, lines: ["YEAR 3"], size: 10, fill: accent, weight: 850, tracking: 2.2, anchor: "end" })}
    </g>`;
};

const miniKpi = ({ x, y, width, height = 126, value, label, note, accent = palette.cyan }) => `
  <g transform="translate(${x} ${y})">
    ${rounded({ x: 0, y: 0, width, height, rx: 20, fill: "url(#panelGlass)", stroke: accent, strokeOpacity: 0.18 })}
    <rect x="0" y="0" width="${width}" height="4" rx="2" fill="${accent}" fill-opacity="0.9"/>
    ${text({ x: 22, y: 48, lines: [value], size: Math.min(36, width / 5.4), fill: palette.white, weight: 900 })}
    ${text({ x: 22, y: 78, lines: wrap(label, Math.floor(width / 8.3)).slice(0, 2), size: 13.5, fill: palette.silver, weight: 720, lineHeight: 1.12 })}
    ${note ? text({ x: 22, y: height - 19, lines: wrap(note, Math.floor(width / 8.8)).slice(0, 1), size: 11, fill: palette.muted, weight: 590 }) : ""}
  </g>`;

const sectionLabel = ({ x, y, label }) =>
  text({ x, y, lines: [label], size: 13, fill: palette.gold, weight: 850, tracking: 3.2 });

const investorLineChart = ({ x, y, width, height }) => {
  const points = [
    ["2023", 0.08, 0.84, "Foundation", "First youth AI literacy program"],
    ["2024", 0.34, 0.62, "Pilot to scale", "Deployable AI literacy pipeline"],
    ["2025", 0.62, 0.38, "15k / 12k", "Students / apps last year"],
    ["Year 3", 0.9, 0.13, "30k / 25k", "Students / apps now"],
  ];
  const path = points.map(([, px, py], index) => `${index === 0 ? "M" : "L"} ${px * width} ${py * height}`).join(" ");
  return `
    <g transform="translate(${x} ${y})">
      ${rounded({ x: 0, y: 0, width, height, rx: 22, fill: "url(#panelGlass)" })}
      ${text({ x: 26, y: 42, lines: ["Growth Since 2023"], size: 22, fill: palette.white, weight: 900 })}
      ${text({ x: 26, y: 70, lines: ["From historic pilot to scaled AI literacy and app-building infrastructure."], size: 13, fill: palette.muted, weight: 590 })}
      <g transform="translate(42 102)">
        <line x1="0" y1="${height - 168}" x2="${width - 84}" y2="${height - 168}" stroke="${palette.line}" stroke-opacity="0.18"/>
        <line x1="0" y1="0" x2="0" y2="${height - 168}" stroke="${palette.line}" stroke-opacity="0.18"/>
        <path d="${path}" transform="scale(${(width - 84) / width} ${(height - 168) / height})" fill="none" stroke="${palette.cyan}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        ${points
          .map(([year, px, py, value, note], index) => {
            const cx = px * (width - 84);
            const cy = py * (height - 168);
            return `
              <g transform="translate(${cx} ${cy})">
                <circle r="11" fill="${index === points.length - 1 ? palette.gold : palette.cyan}" filter="url(#softGlow)"/>
                ${text({ x: 0, y: 34, lines: [year], size: 12, fill: palette.gold, weight: 850, anchor: "middle", tracking: 1.6 })}
                ${text({ x: 0, y: index % 2 ? -24 : -36, lines: [value], size: 14, fill: palette.white, weight: 850, anchor: "middle" })}
                ${text({ x: 0, y: index % 2 ? -6 : -18, lines: wrap(note, 18).slice(0, 1), size: 9.5, fill: palette.muted, weight: 590, anchor: "middle" })}
              </g>`;
          })
          .join("")}
      </g>
    </g>`;
};

const investorFunnel = ({ x, y, width, height }) => {
  const max = impactMetrics.credentialingFlow[0][1];
  return `
    <g transform="translate(${x} ${y})">
      ${rounded({ x: 0, y: 0, width, height, rx: 22, fill: "url(#panelGlass)" })}
      ${text({ x: 24, y: 42, lines: ["Credentialing Funnel"], size: 22, fill: palette.white, weight: 900 })}
      ${text({ x: 24, y: 70, lines: ["Privacy-by-design proof flow from wallet creation to SBT/NFT completion."], size: 13, fill: palette.muted, weight: 590 })}
      ${impactMetrics.credentialingFlow
        .map(([stage, count], index) => {
          const barW = ((count / max) * (width - 170));
          const yy = 104 + index * 55;
          return `
            <g transform="translate(24 ${yy})">
              ${text({ x: 0, y: 16, lines: [stage], size: 13, fill: palette.white, weight: 780 })}
              <rect x="136" y="3" width="${width - 184}" height="20" rx="10" fill="#081d32" stroke="${palette.line}" stroke-opacity="0.1"/>
              <rect x="136" y="3" width="${barW}" height="20" rx="10" fill="${index % 2 ? palette.gold : palette.cyan}" fill-opacity="0.86"/>
              ${text({ x: width - 54, y: 18, lines: [count.toLocaleString()], size: 13, fill: palette.silver, weight: 820, anchor: "end" })}
            </g>`;
        })
        .join("")}
      ${text({ x: 24, y: height - 24, lines: ["On-chain record design stores hashes and cohort IDs, not learner PII."], size: 12, fill: palette.muted, weight: 620 })}
    </g>`;
};

const trackCard = ({ x, y, width, title, body, rate, accent = palette.cyan }) => `
  <g transform="translate(${x} ${y})">
    ${rounded({ x: 0, y: 0, width, height: 118, rx: 18, fill: "url(#panelGlass)", stroke: accent, strokeOpacity: 0.18 })}
    <circle cx="${width - 54}" cy="52" r="34" fill="#07192b" stroke="${accent}" stroke-width="6" stroke-opacity="0.9"/>
    ${text({ x: width - 54, y: 58, lines: [`${rate}%`], size: 16, fill: palette.white, weight: 900, anchor: "middle" })}
    ${text({ x: 22, y: 34, lines: [title], size: 17, fill: palette.white, weight: 880 })}
    ${text({ x: 22, y: 62, lines: wrap(body, Math.floor((width - 120) / 8)).slice(0, 2), size: 12.5, fill: palette.muted, weight: 590, lineHeight: 1.18 })}
    ${text({ x: 22, y: 98, lines: ["completion rate"], size: 10, fill: accent, weight: 850, tracking: 1.8 })}
  </g>`;

const launchCard = ({ x, y, width, title, body, index }) => `
  <g transform="translate(${x} ${y})">
    ${rounded({ x: 0, y: 0, width, height: 104, rx: 18, fill: "#07192b", stroke: index % 2 ? palette.gold : palette.cyan, strokeOpacity: 0.22 })}
    ${text({ x: 20, y: 34, lines: [title], size: 16, fill: palette.white, weight: 870 })}
    ${text({ x: 20, y: 62, lines: wrap(body, Math.floor(width / 8.4)).slice(0, 2), size: 12, fill: palette.muted, weight: 580, lineHeight: 1.18 })}
  </g>`;

const geoReach = ({ x, y, width, height }) => {
  const max = Math.max(...impactMetrics.regions.map(([, learners]) => learners));
  return `
    <g transform="translate(${x} ${y})">
      ${rounded({ x: 0, y: 0, width, height, rx: 22, fill: "url(#panelGlass)" })}
      ${text({ x: 24, y: 42, lines: ["Geographic Reach"], size: 22, fill: palette.white, weight: 900 })}
      ${text({ x: 24, y: 70, lines: [`${impactMetrics.countriesReached} countries reached across youth, family, professional, and partner pathways.`], size: 13, fill: palette.muted, weight: 590 })}
      ${impactMetrics.regions
        .map(([region, learners, pct], index) => {
          const yy = 105 + index * 44;
          const barW = (learners / max) * (width - 230);
          return `
            <g transform="translate(24 ${yy})">
              ${text({ x: 0, y: 15, lines: [region], size: 13, fill: palette.white, weight: 780 })}
              <rect x="132" y="4" width="${width - 210}" height="15" rx="7.5" fill="#081d32"/>
              <rect x="132" y="4" width="${barW}" height="15" rx="7.5" fill="${index % 2 ? palette.gold : palette.cyan}" fill-opacity="0.82"/>
              ${text({ x: width - 56, y: 16, lines: [`+${pct}%`], size: 12, fill: index % 2 ? palette.gold : palette.cyan, weight: 850, anchor: "end" })}
            </g>`;
        })
        .join("")}
    </g>`;
};

const compactMetric = ({ x, y, width, value, label, accent = palette.cyan }) => `
  <g transform="translate(${x} ${y})">
    ${rounded({ x: 0, y: 0, width, height: 106, rx: 20, fill: "url(#panelGlass)", stroke: accent, strokeOpacity: 0.18 })}
    ${text({ x: 22, y: 42, lines: [value], size: Math.min(34, width / 5.3), fill: palette.white, weight: 900 })}
    ${text({ x: 22, y: 74, lines: wrap(label, Math.max(16, Math.floor(width / 8))).slice(0, 2), size: 13, fill: palette.muted, weight: 640, lineHeight: 1.15 })}
  </g>`;

const credentialFlow = ({ x, y, width, compact = false }) => {
  const gap = compact ? 10 : 14;
  const stepWidth = (width - gap * (impactMetrics.credentialingFlow.length - 1)) / impactMetrics.credentialingFlow.length;
  return `
    <g transform="translate(${x} ${y})">
      ${text({ x: 0, y: 0, lines: ["Credentialing Pipeline"], size: compact ? 17 : 20, fill: palette.white, weight: 880 })}
      ${text({ x: 0, y: compact ? 25 : 30, lines: ["Wallet -> build hash -> attestation -> token gate -> SBT/NFT"], size: compact ? 11 : 13, fill: palette.muted, weight: 590 })}
      ${impactMetrics.credentialingFlow
        .map(([label, count], index) => `
          <g transform="translate(${index * (stepWidth + gap)} ${compact ? 50 : 62})">
            ${rounded({ x: 0, y: 0, width: stepWidth, height: compact ? 82 : 94, rx: 16, fill: "#07192b", stroke: index % 2 ? palette.gold : palette.cyan, strokeOpacity: 0.2 })}
            ${text({ x: stepWidth / 2, y: compact ? 30 : 35, lines: [String(index + 1)], size: compact ? 18 : 22, fill: index % 2 ? palette.gold : palette.cyan, weight: 900, anchor: "middle" })}
            ${text({ x: stepWidth / 2, y: compact ? 53 : 62, lines: [count.toLocaleString()], size: compact ? 14 : 16, fill: palette.white, weight: 850, anchor: "middle" })}
            ${text({ x: stepWidth / 2, y: compact ? 72 : 83, lines: wrap(label, compact ? 8 : 10).slice(0, 1), size: compact ? 8.5 : 9.5, fill: palette.muted, weight: 680, anchor: "middle" })}
          </g>`)
        .join("")}
    </g>`;
};

const pillarRows = ({ x, y, width, compact = false }) => {
  const rows = [
    ["Programs", "AI Pioneer for youth. Vanguard for adults and career professionals."],
    ["Platforms", "Arsenal connects apps, websites, agents, automations, and command workflows."],
    ["Operations", "Smart Business Solutions translates AI capability into real business infrastructure."],
    ["Proof", "Portable evidence of learning, building, deployment, and achievement."],
  ];
  const rowHeight = compact ? 70 : 82;
  return `
    <g transform="translate(${x} ${y})">
      ${rows
        .map(([label, body], index) => `
          <g transform="translate(0 ${index * rowHeight})">
            ${rounded({ x: 0, y: 0, width, height: rowHeight - 12, rx: 18, fill: "url(#panelGlass)" })}
            <rect x="0" y="0" width="5" height="${rowHeight - 12}" rx="2.5" fill="${index % 2 ? palette.gold : palette.cyan}"/>
            ${text({ x: 24, y: 27, lines: [label], size: compact ? 15 : 18, fill: palette.white, weight: 850 })}
            ${text({ x: 24, y: compact ? 49 : 54, lines: wrap(body, compact ? 52 : 68).slice(0, 2), size: compact ? 12.5 : 14, fill: palette.muted, weight: 560, lineHeight: 1.15 })}
          </g>`)
        .join("")}
    </g>`;
};

const frame = ({ width, height, variant }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="ZEN Vanguard and AI Pioneer Program social campaign poster">
    ${background(width, height)}
    ${variant(width, height)}
  </svg>`;

const portraitVariant = (width, height, mode = "feed") => {
  const margin = 64;
  const story = mode === "story";
  const square = mode === "square";
  const heroY = square ? 150 : 168;
  const titleSize = square ? 50 : 62;
  const subtitleWidth = square ? 54 : 66;
  const proofY = square ? 392 : 452;
  const cols = 2;
  const proofWidth = width - margin * 2;
  const ecosystemY = square ? 780 : story ? 980 : 930;
  const ecoRadius = square ? 120 : story ? 205 : 165;
  const pillarsY = story ? 1252 : 980;
  const ctaY = story ? 1740 : square ? 930 : 1192;
  const ctaHeight = square ? 110 : 120;

  return `
    ${header({ width, margin, y: 58, compact: square })}
    ${text({ x: margin, y: heroY - 48, lines: ["PARTNER / FUNDER BRIEF"], size: 13, fill: palette.gold, weight: 850, tracking: 3.6 })}
    ${text({ x: margin, y: heroY + 24, lines: ["ZEN Vanguard +", "AI Pioneer Program"], size: titleSize, fill: palette.white, weight: 900, lineHeight: 1.02, family: "Segoe UI, Arial, sans-serif" })}
    ${text({
      x: margin,
      y: heroY + (square ? 146 : 172),
      lines: wrap("From the first youth AI literacy program in United States history to an adult workforce pathway for AI, automation, and future-ready digital skills.", subtitleWidth),
      size: square ? 18 : 20,
      fill: palette.silver,
      weight: 570,
      lineHeight: 1.32,
    })}
    ${proofCards({ x: margin, y: proofY, width: proofWidth, cols, compact: square })}
    ${ecosystem({ cx: width / 2, cy: ecosystemY, radius: ecoRadius, scale: square ? 0.68 : story ? 0.82 : 0.78 })}
    ${
      square || !story
        ? ""
        : `${text({ x: margin, y: pillarsY - 26, lines: ["ECOSYSTEM OPERATING LAYER"], size: 13, fill: palette.gold, weight: 850, tracking: 3.2 })}
           ${pillarRows({ x: margin, y: pillarsY, width: width - margin * 2, compact: !story })}`
    }
    ${!square && !story ? text({ x: margin, y: 1152, lines: ["AI literacy. Deployment capacity. Automation infrastructure. Verified proof."], size: 18, fill: palette.muted, weight: 660 }) : ""}
    ${ctaBlock({ x: margin, y: ctaY, width: width - margin * 2, height: ctaHeight, compact: square })}
    ${square ? "" : text({ x: width / 2, y: height - 34, lines: ["ZEN AI CO. / EDUCATION + AUTOMATION + AI AGENTS + WEB3 PROOF"], size: 11, fill: palette.muted, weight: 720, anchor: "middle", tracking: 2 })}
  `;
};

const wideVariant = (width, height) => {
  const margin = 82;
  return `
    ${header({ width, margin, y: 58 })}
    ${text({ x: margin, y: 174, lines: ["PARTNER / FUNDER BRIEF"], size: 14, fill: palette.gold, weight: 850, tracking: 3.8 })}
    ${text({ x: margin, y: 258, lines: ["ZEN Vanguard +", "AI Pioneer Program"], size: 72, fill: palette.white, weight: 900, lineHeight: 1.02, family: "Segoe UI, Arial, sans-serif" })}
    ${text({
      x: margin,
      y: 426,
      lines: wrap("From the first youth AI literacy program in United States history to an adult workforce pathway for AI, automation, and future-ready digital skills.", 58),
      size: 22,
      fill: palette.silver,
      weight: 570,
      lineHeight: 1.32,
    })}
    ${proofCards({ x: margin, y: 558, width: 760, cols: 2, compact: false })}
    ${ctaBlock({ x: margin, y: 866, width: 760, height: 120 })}
    ${ecosystem({ cx: 1334, cy: 520, radius: 330, scale: 1.08, wide: true })}
    ${text({ x: 1016, y: 910, lines: ["ZEN ECOSYSTEM OPERATING LAYER"], size: 13, fill: palette.gold, weight: 850, tracking: 3.4 })}
    ${text({ x: 1016, y: 952, lines: ["Programs  /  Platforms  /  Operations  /  Verified Proof"], size: 22, fill: palette.white, weight: 820 })}
    ${text({ x: 1016, y: 986, lines: ["AI Pioneer, Vanguard, Arsenal, SBS, AI Social, and Web3 proof represented as one deployable ecosystem."], size: 15, fill: palette.muted, weight: 560 })}
    ${text({ x: width / 2, y: height - 34, lines: ["ZEN AI CO. / EDUCATION + AUTOMATION + AI AGENTS + WEB3 PROOF"], size: 11, fill: palette.muted, weight: 720, anchor: "middle", tracking: 2 })}
  `;
};

const impactGrowthVariant = (width, height, mode = "feed") => {
  const story = mode === "story";
  const margin = 64;
  const heroY = 150;
  const chartY = story ? 610 : 540;
  const maxBar = Math.max(impactMetrics.learnersNow, impactMetrics.appsNow);
  const cardWidth = (width - margin * 2 - 18) / 2;
  const lowerY = story ? 1010 : 890;
  const trackY = story ? 1320 : 1092;
  const ctaY = story ? 1732 : 1210;

  return `
    ${header({ width, margin, y: 58 })}
    ${text({ x: margin, y: heroY - 42, lines: ["YEAR 3 IMPACT METRICS"], size: 13, fill: palette.gold, weight: 850, tracking: 3.5 })}
    ${text({ x: margin, y: heroY + 22, lines: ["30,000 Students.", "25,000 Apps Built."], size: 58, fill: palette.white, weight: 900, lineHeight: 1.03, family: "Segoe UI, Arial, sans-serif" })}
    ${text({
      x: margin,
      y: heroY + 158,
      lines: wrap("The 3rd Annual AI Pioneer Program doubles student reach and more than doubles app output, extending ZEN from youth AI literacy into adult workforce acceleration through Vanguard.", 69),
      size: 20,
      fill: palette.silver,
      weight: 570,
      lineHeight: 1.3,
    })}
    ${compactMetric({ x: margin, y: heroY + 268, width: cardWidth, value: "+100%", label: "student growth from 15,000 to 30,000", accent: palette.gold })}
    ${compactMetric({ x: margin + cardWidth + 18, y: heroY + 268, width: cardWidth, value: "+108%", label: "app growth from 12,000 to 25,000" })}
    ${metricBar({ x: margin, y: chartY, width: width - margin * 2, label: "Students reached", before: impactMetrics.learnersThen, after: impactMetrics.learnersNow, max: maxBar, accent: palette.gold })}
    ${metricBar({ x: margin, y: chartY + 132, width: width - margin * 2, label: "Apps built", before: impactMetrics.appsThen, after: impactMetrics.appsNow, max: maxBar })}
    <g transform="translate(${margin} ${lowerY})">
      ${text({ x: 0, y: 0, lines: ["Operating Impact"], size: 13, fill: palette.gold, weight: 850, tracking: 3.2 })}
      ${compactMetric({ x: 0, y: 30, width: cardWidth, value: `${impactMetrics.countriesReached}`, label: "countries reached through global AI literacy pathways" })}
      ${compactMetric({ x: cardWidth + 18, y: 30, width: cardWidth, value: `${impactMetrics.attestations.toLocaleString()}`, label: "attestations and public skill-record events", accent: palette.gold })}
      ${compactMetric({ x: 0, y: 154, width: cardWidth, value: `${impactMetrics.improvedAiConfidencePct}%`, label: "learners report improved AI confidence", accent: palette.gold })}
      ${compactMetric({ x: cardWidth + 18, y: 154, width: cardWidth, value: `${impactMetrics.appliedSkillsProfessionallyPct}%`, label: "applied skills professionally" })}
    </g>
    ${
      story
        ? `${credentialFlow({ x: margin, y: trackY, width: width - margin * 2 })}
           ${text({ x: margin, y: trackY + 188, lines: ["Privacy by design: PII never stored on-chain; only hashes and cohort IDs used for verification."], size: 15, fill: palette.muted, weight: 610 })}`
        : `${text({ x: margin, y: 1170, lines: ["Curiosity -> deployed apps -> skill records -> workforce pathways."], size: 16, fill: palette.silver, weight: 670 })}`
    }
    ${ctaBlock({ x: margin, y: ctaY, width: width - margin * 2, height: 112, compact: !story })}
    ${text({ x: width / 2, y: height - 34, lines: ["AI PIONEER + VANGUARD / ZEN AI CO. YEAR 3 IMPACT"], size: 11, fill: palette.muted, weight: 720, anchor: "middle", tracking: 2 })}
  `;
};

const investorDossierVariant = (width, height) => {
  const margin = 78;
  const inner = width - margin * 2;
  const kpiGap = 18;
  const kpiW = (inner - kpiGap * 3) / 4;
  const halfGap = 22;
  const halfW = (inner - halfGap) / 2;
  const trackW = (inner - 32) / 3;
  return `
    ${header({ width, margin, y: 64 })}
    ${sectionLabel({ x: margin, y: 146, label: "INVESTOR IMPACT DOSSIER / YEAR 3" })}
    ${text({ x: margin, y: 236, lines: ["ZEN AI Literacy", "Pipeline at Scale"], size: 82, fill: palette.white, weight: 900, lineHeight: 1.02, family: "Segoe UI, Arial, sans-serif" })}
    ${text({
      x: margin,
      y: 425,
      lines: wrap("The 3rd Annual AI Pioneer Program extends the first youth AI literacy program in United States history into a larger infrastructure layer for deployed apps, verifiable skill records, Vanguard adult pathways, and operational AI competency.", 112),
      size: 24,
      fill: palette.silver,
      weight: 570,
      lineHeight: 1.3,
    })}
    ${miniKpi({ x: margin, y: 548, width: kpiW, value: "30,000", label: "students reached", note: "+15,000 YoY", accent: palette.gold })}
    ${miniKpi({ x: margin + (kpiW + kpiGap), y: 548, width: kpiW, value: "25,000", label: "apps built", note: "+13,000 YoY" })}
    ${miniKpi({ x: margin + (kpiW + kpiGap) * 2, y: 548, width: kpiW, value: "35", label: "countries reached", note: "global distribution", accent: palette.gold })}
    ${miniKpi({ x: margin + (kpiW + kpiGap) * 3, y: 548, width: kpiW, value: "8,500", label: "attestations", note: "skill-record events" })}
    ${investorLineChart({ x: margin, y: 720, width: halfW, height: 430 })}
    ${investorFunnel({ x: margin + halfW + halfGap, y: 720, width: halfW, height: 430 })}
    ${sectionLabel({ x: margin, y: 1228, label: "LEARNING TRACKS / COMPLETION PERFORMANCE" })}
    ${impactMetrics.tracks
      .map(([title, body, rate], index) =>
        trackCard({
          x: margin + index * (trackW + 16),
          y: 1264,
          width: trackW,
          title,
          body,
          rate,
          accent: index % 2 ? palette.gold : palette.cyan,
        })
      )
      .join("")}
    ${geoReach({ x: margin, y: 1446, width: halfW, height: 352 })}
    <g transform="translate(${margin + halfW + halfGap} 1446)">
      ${rounded({ x: 0, y: 0, width: halfW, height: 352, rx: 22, fill: "url(#panelGlass)" })}
      ${text({ x: 24, y: 42, lines: ["Movement Pipeline"], size: 22, fill: palette.white, weight: 900 })}
      ${text({ x: 24, y: 74, lines: wrap("The core investor thesis is a complete path from AI curiosity to deployed work and verifiable professional competency.", 58), size: 13.5, fill: palette.muted, weight: 590, lineHeight: 1.22 })}
      ${["Curiosity", "Guided labs", "Apps built", "Hash + attest", "Public proof", "Workforce pathway"]
        .map((label, index) => {
          const row = Math.floor(index / 2);
          const col = index % 2;
          return `
            <g transform="translate(${24 + col * ((halfW - 72) / 2 + 24)} ${124 + row * 66})">
              ${rounded({ x: 0, y: 0, width: (halfW - 72) / 2, height: 48, rx: 14, fill: "#07192b", stroke: index % 2 ? palette.gold : palette.cyan, strokeOpacity: 0.2 })}
              ${text({ x: 18, y: 30, lines: [label], size: 14, fill: palette.white, weight: 800 })}
            </g>`;
        })
        .join("")}
      ${text({ x: 24, y: 326, lines: ["Privacy by design: proof can be verified without placing learner PII on-chain."], size: 12.5, fill: palette.muted, weight: 620 })}
    </g>
    ${sectionLabel({ x: margin, y: 1878, label: "PIONEER LAUNCHES / PROOF OF BUILDER OUTPUT" })}
    ${impactMetrics.launches
      .map(([title, body], index) =>
        launchCard({
          x: margin + index * (trackW + 16),
          y: 1914,
          width: trackW,
          title,
          body,
          index,
        })
      )
      .join("")}
    <g transform="translate(${margin} 2078)">
      ${rounded({ x: 0, y: 0, width: inner, height: 168, rx: 26, fill: "url(#panelGlass)", stroke: palette.gold, strokeOpacity: 0.2 })}
      ${text({ x: 28, y: 48, lines: ["Why This Is Investable"], size: 26, fill: palette.white, weight: 900 })}
      ${text({ x: 28, y: 88, lines: wrap("ZEN is not a single course. It is a repeatable infrastructure model for AI literacy, app deployment, proof-linked credentials, adult upskilling, and operational automation capacity across education, workforce, and partner ecosystems.", 132), size: 18, fill: palette.silver, weight: 590, lineHeight: 1.28 })}
      ${text({ x: 28, y: 140, lines: ["Investor signal: doubled learner reach, more than doubled app output, and a verifiable skill-record pipeline."], size: 16, fill: palette.gold, weight: 760 })}
    </g>
    <g transform="translate(${margin} 2280)">
      <rect width="${inner}" height="82" rx="24" fill="url(#ctaGold)"/>
      <rect x="3" y="3" width="${inner - 6}" height="76" rx="21" fill="#07111d" fill-opacity="0.18"/>
      ${text({ x: 34, y: 51, lines: ["Partner With ZEN"], size: 30, fill: "#07111d", weight: 900 })}
      <path d="M ${inner - 90} 41 h46 m-18 -18 18 18 -18 18" fill="none" stroke="#07111d" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  `;
};

const investorWideVariant = (width, height) => {
  const margin = 74;
  const leftW = 720;
  const rightX = margin + leftW + 44;
  const rightW = width - rightX - margin;
  const kpiW = (leftW - 18) / 2;
  return `
    ${header({ width, margin, y: 58 })}
    ${sectionLabel({ x: margin, y: 146, label: "INVESTOR BRIEF / YEAR 3 SCALE" })}
    ${text({ x: margin, y: 232, lines: ["30,000 Students.", "25,000 Apps Built."], size: 68, fill: palette.white, weight: 900, lineHeight: 1.05, family: "Segoe UI, Arial, sans-serif" })}
    ${text({ x: margin, y: 386, lines: wrap("The first youth AI literacy program in United States history has grown into a full pipeline for deployed AI apps, skill records, adult workforce pathways, and operational AI literacy infrastructure.", 62), size: 20, fill: palette.silver, weight: 570, lineHeight: 1.28 })}
    ${miniKpi({ x: margin, y: 510, width: kpiW, value: "+100%", label: "student growth", note: "15,000 -> 30,000", accent: palette.gold })}
    ${miniKpi({ x: margin + kpiW + 18, y: 510, width: kpiW, value: "+108%", label: "app output growth", note: "12,000 -> 25,000" })}
    ${miniKpi({ x: margin, y: 654, width: kpiW, value: "8,500", label: "attestations", note: "skill-record events" })}
    ${miniKpi({ x: margin + kpiW + 18, y: 654, width: kpiW, value: "156", label: "corporate partnerships", note: "partner ecosystem", accent: palette.gold })}
    ${ctaBlock({ x: margin, y: 862, width: leftW, height: 110, compact: true })}
    ${investorLineChart({ x: rightX, y: 132, width: rightW, height: 330 })}
    ${investorFunnel({ x: rightX, y: 488, width: rightW * 0.52, height: 378 })}
    ${geoReach({ x: rightX + rightW * 0.55, y: 488, width: rightW * 0.45, height: 378 })}
    ${sectionLabel({ x: rightX, y: 920, label: "TRACKS + LAUNCH OUTPUT" })}
    ${impactMetrics.tracks
      .map(([title, body, rate], index) =>
        trackCard({
          x: rightX + index * ((rightW - 28) / 3 + 14),
          y: 950,
          width: (rightW - 28) / 3,
          title,
          body,
          rate,
          accent: index % 2 ? palette.gold : palette.cyan,
        })
      )
      .join("")}
  `;
};

const svgFor = (variant) => {
  const layouts = {
    "flagship-feed": (w, h) => portraitVariant(w, h, "feed"),
    "story-reel": (w, h) => portraitVariant(w, h, "story"),
    square: (w, h) => portraitVariant(w, h, "square"),
    "linkedin-wide": wideVariant,
    "impact-growth-feed": (w, h) => impactGrowthVariant(w, h, "feed"),
    "impact-growth-story": (w, h) => impactGrowthVariant(w, h, "story"),
    "investor-impact-dossier": investorDossierVariant,
    "investor-brief-wide": investorWideVariant,
  };
  return frame({ width: variant.width, height: variant.height, variant: layouts[variant.id] });
};

const readme = `# ZEN Vanguard + AI Pioneer Social Campaign Pack

Generated assets for a partner/funder-facing social campaign.

## Exports

${variants.map((variant) => `- \`${variant.id}.png\` and \`${variant.id}.svg\` - ${variant.label} (${variant.width}x${variant.height})`).join("\n")}

## Claim Safety

- Uses: "first youth AI literacy program in United States history".
- Uses the user-provided Year 3 metrics: 30,000 students and 25,000 apps built.
- Uses the user-provided Year 2 baseline: 15,000 students and 12,000 apps built.
- Uses: "proof-linked" and "verified proof" language.
- Avoids: "accredited", federal endorsement language, fake seals, and partner logos.
- Keeps GDPR/compliance phrasing out of the public graphics pending legal approval.

## Regenerate

Run:

\`\`\`bash
node output/zen-social-campaign/generate-campaign.mjs
\`\`\`

The script writes refreshed SVG and PNG files into \`output/zen-social-campaign/exports\`.
`;

const captions = `# ZEN Vanguard + AI Pioneer Social Captions

## Partner / Funder Caption

ZEN is building AI literacy infrastructure that moves beyond awareness into deployment, proof, and workforce capacity.

The 3rd Annual AI Pioneer Program continues the first youth AI literacy program in United States history. Last year, the movement reached 15,000 students and 12,000 apps built. Year 3 now scales that to 30,000 students and 25,000 apps built.

That is 100% student growth and 108% app-output growth, with Vanguard expanding the pathway for adults and career professionals.

Partner With ZEN to build AI literacy, deployment capacity, and proof-linked workforce pathways.

## Adult Workforce Caption

Vanguard is the adult expansion of ZEN's AI literacy ecosystem.

It is built for career professionals who need practical fluency in AI, automation, agents, workflows, and digital systems, not abstract theory.

The pathway connects learning to building, and building to real operational capacity.

Partner With ZEN to bring future-ready AI capability to your workforce.

## Year 3 Growth Caption

Year 3 marks a scale shift for ZEN.

15,000 students became 30,000.
12,000 apps built became 25,000.

The 3rd Annual AI Pioneer Program now connects youth AI literacy, cloud-hosted app creation, public skill records, and adult workforce expansion through Vanguard.

This is the movement layer: curiosity -> deployed apps -> attestable proof -> professional competency.

Partner With ZEN.

## Ecosystem Overview Caption

ZEN connects youth AI literacy, adult workforce pathways, automation systems, AI agents, community layers, and proof-linked credentials into one ecosystem.

AI Pioneer introduces students to building with AI.
Vanguard expands that foundation for adults and professionals.
Arsenal powers the builder layer.
Smart Business Solutions translates capability into operational infrastructure.

Partner With ZEN to help communities learn AI, build with AI, and deploy what they create.

## 3rd Annual AI Pioneer Announcement

The 3rd Annual AI Pioneer Program builds on a historic foundation: the first youth AI literacy program in United States history.

Students ages 11-18 do more than learn about AI. They build cloud-hosted AI-powered agents, explore automation, and begin developing the skills needed to participate in the next generation of digital infrastructure.

ZEN is expanding that work through Vanguard, Arsenal, Smart Business Solutions, AI Social, and proof-linked credential pathways.

Partner With ZEN.
`;

const metricData = {
  campaign: "ZEN Vanguard + 3rd Annual AI Pioneer Program",
  audience: "Partners and funders",
  sourcePosture: "User-provided campaign metrics plus existing local ZEN marketing canon.",
  headlineMetrics: {
    baseline: {
      label: impactMetrics.baselineYear,
      students: impactMetrics.learnersThen,
      appsBuilt: impactMetrics.appsThen,
    },
    current: {
      label: impactMetrics.currentYear,
      students: impactMetrics.learnersNow,
      appsBuilt: impactMetrics.appsNow,
    },
    growth: {
      studentsAdded: growth.learnerDelta,
      studentGrowthPercent: growth.learnerGrowthPct,
      appsAdded: growth.appDelta,
      appGrowthPercent: growth.appGrowthPct,
      appOutputMultiple: Number(growth.appOutputMultiple),
    },
  },
  investorThesis: [
    "ZEN is not a single course; it is a repeatable infrastructure model for AI literacy, deployment, attestable proof, and workforce capacity.",
    "The movement doubled learner reach and more than doubled app output from Year 2 to Year 3.",
    "Vanguard expands youth AI literacy into adult and career-professional upskilling.",
    "The credentialing path creates public skill records without requiring learner PII to be stored on-chain.",
  ],
  operatingMetrics: {
    countriesReached: impactMetrics.countriesReached,
    attestations: impactMetrics.attestations,
    improvedAiConfidencePercent: impactMetrics.improvedAiConfidencePct,
    appliedSkillsProfessionallyPercent: impactMetrics.appliedSkillsProfessionallyPct,
    corporatePartnerships: impactMetrics.corporatePartnerships,
    trackCompletionPercent: impactMetrics.trackCompletion,
    geographicDistribution: impactMetrics.regions.map(([region, learners, growthPercent]) => ({
      region,
      learners,
      growthPercent,
    })),
  },
  launchExamples: [
    "Jarvis Voice App - voice-enabled AI assistant demo built on Hugging Face Spaces",
    "Alex Chatbot - conversational AI chatbot for dynamic interaction",
    "Qwen3-Coder WebDev - natural language to full web applications",
  ],
  learningTracks: [
    "Homeschool Kit - ages 11-18, parent-friendly, self-paced, printable guides",
    "Verifiable Builder Track - attestations, token-gated submissions, SBT/NFT completer path",
    "AgentOps Pro - SLA tables, cost per task, governance, incident post-mortems",
  ],
  credentialingFlow: impactMetrics.credentialingFlow.map(([stage, count]) => ({ stage, count })),
  publicationNotes: [
    "Do not use accredited language in this campaign pack.",
    "Do not imply federal or government endorsement.",
    "Treat GDPR-compliance wording as legal-review required before public posting.",
    "PII-on-chain claim can be phrased as privacy-by-design if internally validated.",
  ],
};

const metricsMarkdown = `# ZEN Year 3 Impact Metrics

## Headline Growth

| Metric | ${impactMetrics.baselineYear} | ${impactMetrics.currentYear} | Growth |
|---|---:|---:|---:|
| Students reached | ${impactMetrics.learnersThen.toLocaleString()} | ${impactMetrics.learnersNow.toLocaleString()} | +${growth.learnerDelta.toLocaleString()} / +${growth.learnerGrowthPct}% |
| Apps built | ${impactMetrics.appsThen.toLocaleString()} | ${impactMetrics.appsNow.toLocaleString()} | +${growth.appDelta.toLocaleString()} / +${growth.appGrowthPct}% |

## Core Narrative

The 3rd Annual AI Pioneer Program continues the first youth AI literacy program in United States history and now operates at Year 3 scale: ${impactMetrics.learnersNow.toLocaleString()} students and ${impactMetrics.appsNow.toLocaleString()} apps built.

The movement has grown from ${impactMetrics.learnersThen.toLocaleString()} students and ${impactMetrics.appsThen.toLocaleString()} apps built last year to a larger pipeline connecting AI curiosity, deployed applications, public skill records, and adult workforce pathways through Vanguard.

## Operating Metrics

| Metric | Value |
|---|---:|
| Countries reached | ${impactMetrics.countriesReached} |
| Attestations / skill-record events | ${impactMetrics.attestations.toLocaleString()} |
| Learners reporting improved AI confidence | ${impactMetrics.improvedAiConfidencePct}% |
| Learners applying skills professionally | ${impactMetrics.appliedSkillsProfessionallyPct}% |
| Corporate partnerships | ${impactMetrics.corporatePartnerships} |

## Investor Thesis

- ZEN is not a single course; it is a repeatable infrastructure model for AI literacy, deployment, attestable proof, and workforce capacity.
- The movement doubled learner reach and more than doubled app output from Year 2 to Year 3.
- Vanguard expands youth AI literacy into adult and career-professional upskilling.
- The credentialing path creates public skill records without requiring learner PII to be stored on-chain.

## Geographic Reach

| Region | Learners | Growth |
|---|---:|---:|
${impactMetrics.regions.map(([region, learners, pct]) => `| ${region} | ${learners.toLocaleString()} | +${pct}% |`).join("\n")}

## Learning Tracks

| Track | Positioning | Completion Rate |
|---|---|---:|
| Homeschool Kit | Ages 11-18, parent-friendly, self-paced, printable guides | ${impactMetrics.trackCompletion.homeschoolKit}% |
| Verifiable Builder Track | Build projects, submit proof, receive attestable skill records | ${impactMetrics.trackCompletion.verifiableBuilderTrack}% |
| AgentOps Pro | SLA tables, cost per task, governance, incident post-mortems | ${impactMetrics.trackCompletion.agentOpsPro}% |

## Credentialing Pipeline

| Stage | Count |
|---|---:|
${impactMetrics.credentialingFlow.map(([stage, count]) => `| ${stage} | ${count.toLocaleString()} |`).join("\n")}

## Launch Examples

- Jarvis Voice App: voice-enabled AI assistant demo built on Hugging Face Spaces.
- Alex Chatbot: conversational AI chatbot created by ZEN for dynamic interaction.
- Qwen3-Coder WebDev: natural language to full web applications.

## Claim Safety

- Public graphics avoid accreditation claims.
- Public graphics avoid government endorsement language.
- "GDPR Compliant" should be treated as legal-review required before public use.
- Safe public phrasing: "Privacy by design. PII is not stored on-chain; verification uses hashes and cohort IDs."
`;

for (const variant of variants) {
  writeFileSync(join(distDir, `${variant.id}.svg`), svgFor(variant), "utf8");
}

writeFileSync(join(root, "README.md"), readme, "utf8");
writeFileSync(join(root, "social-captions.md"), captions, "utf8");
writeFileSync(join(root, "impact-metrics.json"), `${JSON.stringify(metricData, null, 2)}\n`, "utf8");
writeFileSync(join(root, "impact-metrics.md"), metricsMarkdown, "utf8");

const browser = await chromium.launch();
try {
  for (const variant of variants) {
    const page = await browser.newPage({
      viewport: { width: variant.width, height: variant.height },
      deviceScaleFactor: 1,
    });
    await page.setContent(
      `<html><head><style>html,body{margin:0;width:${variant.width}px;height:${variant.height}px;background:#02050b;overflow:hidden;}svg{display:block;width:${variant.width}px;height:${variant.height}px;}</style></head><body>${svgFor(variant)}</body></html>`,
      { waitUntil: "load" }
    );
    await page.screenshot({ path: join(distDir, `${variant.id}.png`), type: "png", fullPage: false });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(`Generated ${variants.length} social campaign variants in ${distDir}`);
