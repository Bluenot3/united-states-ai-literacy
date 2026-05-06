import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(root, "..", "..");
const exportDir = join(root, "exports");
const previewDir = join(root, "previews");
mkdirSync(exportDir, { recursive: true });
mkdirSync(previewDir, { recursive: true });

const logoPath = join(repoRoot, "src", "assets", "zen-logo.png");
const logo = `data:image/png;base64,${readFileSync(logoPath).toString("base64")}`;

const metrics = {
  title: "AI Pioneer Program",
  subtitle: "Grant Impact Brief",
  span: "2023 to Year 3",
  distinction: "First youth AI literacy program in United States history",
  studentsPrevious: 15000,
  studentsCurrent: 30000,
  appsPrevious: 12000,
  appsCurrent: 25000,
  countries: 35,
  attestations: 8500,
  confidence: 94,
  professionalUse: 78,
  tracks: [
    {
      name: "Homeschool Kit",
      rate: 87,
      audience: "Ages 11-18",
      body: "Parent-friendly, self-paced AI starter labs with printable guides, offline mini-labs, family projects, and age-appropriate build sequences.",
    },
    {
      name: "Verifiable Builder Track",
      rate: 72,
      audience: "Students and builders",
      body: "Project builds, proof submissions, attestable skill records, portfolio evidence, and public verification pathways.",
    },
    {
      name: "AgentOps Pro",
      rate: 68,
      audience: "Career professionals",
      body: "Enterprise-oriented AI operations, SLA thinking, cost-per-task analysis, governance, incident response, and post-mortem literacy.",
    },
  ],
  launches: [
    ["Jarvis Voice App", "Voice-enabled AI assistant demo built on Hugging Face Spaces."],
    ["Alex Chatbot", "Conversational AI chatbot created for dynamic learner interaction."],
    ["Qwen3-Coder WebDev", "Natural language workflow for generating complete web applications."],
  ],
  funnel: [
    ["Wallet Creation", 1000],
    ["Build -> Hash", 800],
    ["Submit -> Attest", 620],
    ["Token-Gated", 380],
    ["SBT / NFT", 150],
  ],
  regions: [
    ["North America", 1200, 45],
    ["Europe", 800, 38],
    ["Asia Pacific", 600, 52],
    ["Latin America", 180, 67],
    ["Africa", 67, 89],
  ],
  journey: [
    ["2023", "Foundation", "Program inception, first AI literacy pilots, early learner labs, and first cloud-hosted AI demonstrations."],
    ["2024", "Pilot to Proof", "Curriculum refinement, project-based learning model, AI app showcase, and early verification architecture."],
    ["2025", "Scaled Output", "15,000 students and 12,000 apps built across the program ecosystem."],
    ["Year 3", "Expanded Reach", "30,000 students and 25,000 apps built, with Vanguard extending the pathway for adults and career professionals."],
  ],
};

const growth = {
  studentDelta: metrics.studentsCurrent - metrics.studentsPrevious,
  appDelta: metrics.appsCurrent - metrics.appsPrevious,
  studentPct: Math.round(((metrics.studentsCurrent - metrics.studentsPrevious) / metrics.studentsPrevious) * 100),
  appPct: Math.round(((metrics.appsCurrent - metrics.appsPrevious) / metrics.appsPrevious) * 100),
};

const fmt = (n) => n.toLocaleString("en-US");

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const metricCard = ({ value, label, note = "", tone = "cyan" }) => `
  <div class="metric ${tone}">
    <div class="metric-value">${esc(value)}</div>
    <div class="metric-label">${esc(label)}</div>
    ${note ? `<div class="metric-note">${esc(note)}</div>` : ""}
  </div>`;

const bar = ({ label, before, after, max, tone = "cyan" }) => `
  <div class="bar-block">
    <div class="bar-head">
      <strong>${esc(label)}</strong>
      <span>${fmt(before)} -> ${fmt(after)}</span>
    </div>
    <div class="bar-shell muted"><span style="width:${(before / max) * 100}%"></span></div>
    <div class="bar-shell ${tone}"><span style="width:${(after / max) * 100}%"></span></div>
    <div class="bar-foot"><span>Prior year</span><span>Year 3</span></div>
  </div>`;

const funnel = () => {
  const max = metrics.funnel[0][1];
  return `
    <div class="funnel">
      ${metrics.funnel
        .map(
          ([stage, count], index) => `
            <div class="funnel-row">
              <div class="funnel-stage">${esc(stage)}</div>
              <div class="funnel-track"><span class="${index % 2 ? "gold-bg" : "cyan-bg"}" style="width:${(count / max) * 100}%"></span></div>
              <div class="funnel-count">${fmt(count)}</div>
            </div>`
        )
        .join("")}
    </div>`;
};

const trackCards = () =>
  metrics.tracks
    .map(
      (track, index) => `
        <div class="track ${index % 2 ? "gold" : "cyan"}">
          <div>
            <div class="track-name">${esc(track.name)}</div>
            <div class="track-audience">${esc(track.audience)}</div>
            <p>${esc(track.body)}</p>
          </div>
          <div class="gauge">${track.rate}%</div>
        </div>`
    )
    .join("");

const page = (kicker, title, body, content, pageClass = "") => `
  <section class="page ${pageClass}">
    <div class="page-bg"></div>
    <header>
      <img src="${logo}" alt="ZEN logo" />
      <div>Grant Submission Attachment</div>
    </header>
    <main>
      <div class="kicker">${esc(kicker)}</div>
      <h1>${title}</h1>
      ${body ? `<p class="lead">${esc(body)}</p>` : ""}
      ${content}
    </main>
    <footer>
      <span>ZEN AI Co. / AI Pioneer Program</span>
      <span>${esc(metrics.span)}</span>
    </footer>
  </section>`;

const css = `
  @page { size: Letter; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #02050b; color: #f7fbff; font-family: "Segoe UI", Arial, sans-serif; }
  .page {
    width: 8.5in;
    height: 11in;
    position: relative;
    overflow: hidden;
    page-break-after: always;
    background:
      radial-gradient(circle at 50% 28%, rgba(91,231,255,.22), transparent 42%),
      radial-gradient(circle at 82% 78%, rgba(216,178,100,.16), transparent 38%),
      linear-gradient(135deg, #02050b 0%, #061525 48%, #02050b 100%);
  }
  .page-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(134,215,255,.055) 1px, transparent 1px),
      linear-gradient(90deg, rgba(134,215,255,.055) 1px, transparent 1px);
    background-size: 32px 32px;
    opacity: .75;
  }
  .page::before, .page::after {
    content: "";
    position: absolute;
    width: 900px; height: 260px;
    border: 1px solid rgba(91,231,255,.16);
    border-radius: 50%;
    transform: rotate(-12deg);
  }
  .page::before { top: 170px; left: -120px; }
  .page::after { bottom: 130px; right: -260px; border-color: rgba(216,178,100,.15); }
  header, main, footer { position: relative; z-index: 2; }
  header {
    display: flex; align-items: center; justify-content: space-between;
    margin: .42in .5in 0; padding-bottom: .16in;
    border-bottom: 1px solid rgba(134,215,255,.18);
    color: #aebbd0; text-transform: uppercase; font-size: 9px; letter-spacing: 2.5px; font-weight: 800;
  }
  header img { width: 58px; height: 31px; object-fit: contain; }
  main { margin: .28in .5in 0; }
  footer {
    position: absolute; left: .5in; right: .5in; bottom: .28in;
    display: flex; justify-content: space-between;
    color: #aebbd0; font-size: 8px; letter-spacing: 2px; text-transform: uppercase; font-weight: 800;
  }
  .kicker { color: #d8b264; text-transform: uppercase; letter-spacing: 4px; font-size: 10px; font-weight: 900; margin-bottom: 16px; }
  h1 { margin: 0; font-size: 58px; line-height: .98; letter-spacing: 0; max-width: 660px; }
  h2 { margin: 0 0 12px; font-size: 24px; line-height: 1.1; }
  h3 { margin: 0 0 8px; font-size: 18px; }
  p { margin: 0; color: #d8e3ee; font-size: 13px; line-height: 1.35; }
  .lead { margin-top: 26px; max-width: 710px; font-size: 18px; line-height: 1.34; color: #edf6ff; font-weight: 650; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 34px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .metric {
    min-height: 112px; border-radius: 18px; padding: 18px;
    background: linear-gradient(145deg, rgba(16,36,58,.88), rgba(7,21,34,.84));
    border: 1px solid rgba(134,215,255,.14); border-top: 3px solid #5be7ff;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
  }
  .metric.gold { border-top-color: #d8b264; }
  .metric-value { font-size: 30px; font-weight: 950; line-height: 1; }
  .metric-label { margin-top: 11px; font-size: 11px; color: #eaf4ff; font-weight: 800; line-height: 1.2; }
  .metric-note { margin-top: 12px; font-size: 9px; color: #aebbd0; }
  .panel {
    border-radius: 22px; padding: 22px;
    background: linear-gradient(145deg, rgba(16,36,58,.88), rgba(7,21,34,.82));
    border: 1px solid rgba(134,215,255,.16);
  }
  .big-panel { margin-top: 26px; min-height: 250px; }
  .bar-block { margin-top: 18px; }
  .bar-head, .bar-foot { display: flex; justify-content: space-between; align-items: baseline; }
  .bar-head strong { font-size: 14px; }
  .bar-head span { color: #d8e3ee; font-size: 12px; font-weight: 800; }
  .bar-foot { margin-top: 7px; color: #d8b264; text-transform: uppercase; letter-spacing: 2px; font-size: 8px; font-weight: 900; }
  .bar-shell { height: 14px; border-radius: 12px; background: #07192b; margin-top: 9px; overflow: hidden; border: 1px solid rgba(134,215,255,.08); }
  .bar-shell span { display: block; height: 100%; border-radius: 12px; background: #5be7ff; }
  .bar-shell.muted span { background: rgba(216,178,100,.48); }
  .bar-shell.gold span { background: #d8b264; }
  .timeline { margin-top: 28px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .timeline-card { min-height: 175px; padding: 18px; border-radius: 18px; background: rgba(7,25,43,.84); border: 1px solid rgba(134,215,255,.17); }
  .year { color: #d8b264; font-weight: 950; letter-spacing: 2px; font-size: 12px; }
  .timeline-card strong { display: block; margin: 10px 0 8px; font-size: 16px; }
  .pipeline { display: grid; grid-template-columns: repeat(6, 1fr); gap: 9px; margin-top: 28px; }
  .pipe-step { min-height: 110px; padding: 16px 12px; border-radius: 18px; background: rgba(7,25,43,.86); border: 1px solid rgba(134,215,255,.18); text-align: center; }
  .pipe-num { width: 30px; height: 30px; border-radius: 50%; margin: 0 auto 10px; display: grid; place-items: center; background: #5be7ff; color: #061525; font-weight: 950; }
  .pipe-step:nth-child(even) .pipe-num { background: #d8b264; }
  .funnel-row { display: grid; grid-template-columns: 120px 1fr 54px; gap: 12px; align-items: center; margin-top: 18px; }
  .funnel-stage { font-size: 12px; font-weight: 850; }
  .funnel-count { text-align: right; color: #d8e3ee; font-weight: 900; font-size: 12px; }
  .funnel-track { height: 18px; border-radius: 12px; background: #07192b; overflow: hidden; border: 1px solid rgba(134,215,255,.08); }
  .funnel-track span { display: block; height: 100%; border-radius: 12px; }
  .cyan-bg { background: #5be7ff; } .gold-bg { background: #d8b264; }
  .track { min-height: 180px; padding: 20px; border-radius: 20px; background: rgba(7,25,43,.88); border: 1px solid rgba(134,215,255,.16); display: flex; justify-content: space-between; gap: 14px; }
  .track.gold { border-color: rgba(216,178,100,.22); }
  .track-name { font-size: 18px; font-weight: 950; }
  .track-audience { margin: 8px 0 10px; color: #d8b264; text-transform: uppercase; letter-spacing: 2px; font-size: 8px; font-weight: 900; }
  .gauge { flex: 0 0 68px; width: 68px; height: 68px; border-radius: 50%; border: 6px solid #5be7ff; display: grid; place-items: center; font-weight: 950; align-self: flex-start; }
  .track.gold .gauge { border-color: #d8b264; }
  .launch { min-height: 128px; padding: 18px; border-radius: 18px; background: rgba(7,25,43,.86); border: 1px solid rgba(134,215,255,.17); }
  .launch strong { display: block; font-size: 17px; margin-bottom: 10px; }
  .region-row { display: grid; grid-template-columns: 125px 1fr 44px; gap: 12px; align-items: center; margin-top: 16px; }
  .region-row strong { font-size: 12px; }
  .region-row .bar-shell { margin-top: 0; height: 13px; }
  .region-row span:last-child { color: #5be7ff; font-size: 11px; font-weight: 900; text-align: right; }
  .story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; }
  .callout { padding: 22px; border-radius: 22px; background: rgba(216,178,100,.13); border: 1px solid rgba(216,178,100,.24); }
  .callout strong { display: block; font-size: 22px; margin-bottom: 10px; }
  .checklist { columns: 2; column-gap: 26px; margin: 18px 0 0; padding: 0; list-style: none; }
  .checklist li { break-inside: avoid; margin: 0 0 10px; color: #d8e3ee; font-size: 12.5px; line-height: 1.28; }
  .checklist li::before { content: ""; display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #5be7ff; margin-right: 9px; }
  .final-title { font-size: 40px; }
  .proof-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 24px; }
  .compact-page main { margin-top: .2in; }
  .compact-page .kicker { margin-bottom: 12px; }
  .compact-page h1 { font-size: 46px; line-height: .96; max-width: 620px; }
  .compact-page .lead { margin-top: 18px; font-size: 15.5px; line-height: 1.28; }
  .compact-page .track {
    min-height: 125px;
    padding: 16px 20px;
    border-radius: 18px;
  }
  .compact-page .track-name { font-size: 17px; }
  .compact-page .track-audience { margin: 7px 0 8px; }
  .compact-page .track p { max-width: 560px; font-size: 12.5px; line-height: 1.25; }
  .compact-page .gauge {
    flex-basis: 60px;
    width: 60px;
    height: 60px;
    border-width: 5px;
    font-size: 15px;
  }
  .compact-page .panel { padding: 16px 18px; border-radius: 18px; }
  .compact-page .panel h2 { font-size: 20px; margin-bottom: 8px; }
  .compact-page .panel p { font-size: 12.3px; line-height: 1.25; }
  .compact-page .checklist { margin-top: 12px; column-gap: 20px; }
  .compact-page .checklist li { margin-bottom: 7px; font-size: 11.5px; line-height: 1.2; }
`;

const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>AI Pioneer Program Grant Impact Brief</title>
  <style>${css}</style>
</head>
<body>
${page(
  "AI Pioneer Program / Grant Impact Brief",
  "First Youth AI Literacy Program in United States History",
  "A concise, grant-ready visual brief documenting the first youth AI literacy program in United States history and its growth from the 2023 foundation to Year 3 scale: 30,000 students reached and 25,000 apps built.",
  `
    <div class="grid-4">
      ${metricCard({ value: fmt(metrics.studentsCurrent), label: "Students reached", note: `+${fmt(growth.studentDelta)} since last year`, tone: "gold" })}
      ${metricCard({ value: fmt(metrics.appsCurrent), label: "Apps built", note: `+${fmt(growth.appDelta)} since last year` })}
      ${metricCard({ value: `+${growth.studentPct}%`, label: "Student growth", note: `${fmt(metrics.studentsPrevious)} -> ${fmt(metrics.studentsCurrent)}` })}
      ${metricCard({ value: `+${growth.appPct}%`, label: "App output growth", note: `${fmt(metrics.appsPrevious)} -> ${fmt(metrics.appsCurrent)}`, tone: "gold" })}
    </div>
    <div class="panel big-panel">
      <h2>Movement Impact</h2>
      <p>The program is historic because it connects AI curiosity, guided learning, deployed applications, public skill records, and future workforce readiness into one visible learning pipeline.</p>
      <div class="pipeline">
        ${["Curiosity", "Guided Labs", "Apps Built", "Hash + Attest", "Public Proof", "Competency"].map((label, index) => `<div class="pipe-step"><div class="pipe-num">${index + 1}</div><strong>${label}</strong></div>`).join("")}
      </div>
    </div>
  `
)}
${page(
  "Growth Since 2023",
  "From Foundation to Year 3 Scale",
  "The program has moved from early AI literacy pilots into a scaled learning and deployment system with measurable learner reach and app output.",
  `
    <div class="panel">
      ${bar({ label: "Students reached", before: metrics.studentsPrevious, after: metrics.studentsCurrent, max: metrics.studentsCurrent, tone: "gold" })}
      ${bar({ label: "Apps built", before: metrics.appsPrevious, after: metrics.appsCurrent, max: metrics.studentsCurrent })}
    </div>
    <div class="timeline">
      ${metrics.journey.map(([year, title, body]) => `<div class="timeline-card"><div class="year">${esc(year)}</div><strong>${esc(title)}</strong><p>${esc(body)}</p></div>`).join("")}
    </div>
    <div class="story-grid">
      <div class="callout"><strong>Grant-Relevant Signal</strong><p>Growth is not limited to enrollment. App output grew faster than learner reach, showing that participants are moving from awareness into creation and deployment.</p></div>
      <div class="callout"><strong>Outcome Pattern</strong><p>The strongest program evidence is the connection between learning tracks, hands-on builds, public proof, and practical AI confidence.</p></div>
    </div>
  `
)}
${page(
  "Program Architecture",
  "Learning Tracks Built for Different Entry Points",
  "The program is organized around practical pathways that meet learners where they are: family learning, verifiable builder portfolios, and career-oriented AI operations.",
  `
    <div class="grid-2" style="grid-template-columns:1fr; gap:10px;">
      ${trackCards()}
    </div>
    <div class="panel" style="margin-top:14px;">
      <h2>ZENnovation Academy</h2>
      <p>ZENnovation Academy provides the education layer for future innovators. Each program launch demonstrates practical AI applications built by participants, turning abstract literacy into usable digital artifacts.</p>
      <ul class="checklist">
        <li>Parent-guided AI starter labs</li>
        <li>Self-paced student builds</li>
        <li>Portfolio-ready project outputs</li>
        <li>Industry-recognizable AI fluency</li>
        <li>Governance and responsible AI literacy</li>
        <li>App, chatbot, voice, and web development examples</li>
      </ul>
    </div>
  `,
  "compact-page"
)}
${page(
  "Builder Output",
  "Pioneer Launches Demonstrate Real Skills",
  "The program is designed around visible learner output. Participants build, deploy, and present AI-enabled projects instead of only completing passive coursework.",
  `
    <div class="proof-grid">
      ${metrics.launches.map(([title, body]) => `<div class="launch"><strong>${esc(title)}</strong><p>${esc(body)}</p></div>`).join("")}
    </div>
    <div class="panel" style="margin-top:26px;">
      <h2>25,000 Apps Built Across the Movement</h2>
      <p>This app-building output includes AI assistants, chatbots, automation concepts, generative media workflows, web application prototypes, and portfolio artifacts that demonstrate applied AI literacy.</p>
      <div class="grid-4">
        ${metricCard({ value: "Voice", label: "AI assistant demos", note: "Jarvis-style interaction" })}
        ${metricCard({ value: "Chat", label: "Conversational AI", note: "dynamic response systems", tone: "gold" })}
        ${metricCard({ value: "Web", label: "Natural language apps", note: "Qwen3-Coder WebDev" })}
        ${metricCard({ value: "Ops", label: "Automation literacy", note: "workflows and governance", tone: "gold" })}
      </div>
    </div>
  `
)}
${page(
  "Credentialing Pipeline",
  "A Privacy-by-Design Path to Public Skill Records",
  "The credentialing layer turns learning and building into verifiable evidence while avoiding public exposure of learner PII.",
  `
    <div class="panel">
      <h2>Credentialing Flow</h2>
      ${funnel()}
    </div>
    <div class="grid-2" style="margin-top:24px;">
      <div class="callout"><strong>Verification Model</strong><p>Submissions can be represented with hashes and cohort IDs, allowing employer or school verification through a single link without placing private learner data on-chain.</p></div>
      <div class="callout"><strong>Grant-Relevant Value</strong><p>The program creates portable evidence of skill development, project completion, and applied competency for students, families, schools, and workforce pathways.</p></div>
    </div>
    <div class="grid-4">
      ${metricCard({ value: fmt(metrics.attestations), label: "Attestations and skill-record events", note: "program operating metric", tone: "gold" })}
      ${metricCard({ value: "Hash", label: "Build evidence", note: "proof without exposing PII" })}
      ${metricCard({ value: "SBT/NFT", label: "Completer path", note: "portable recognition", tone: "gold" })}
      ${metricCard({ value: "1 link", label: "Verification experience", note: "school and employer review" })}
    </div>
  `
)}
${page(
  "Global Impact and Learner Outcomes",
  "Reach, Confidence, and Applied Use",
  "The program shows growth across geography, learner confidence, skill application, and completion rates.",
  `
    <div class="grid-4">
      ${metricCard({ value: `${metrics.countries}`, label: "Countries reached", note: "global AI literacy footprint", tone: "gold" })}
      ${metricCard({ value: `${metrics.confidence}%`, label: "Report improved AI confidence", note: "learner outcome" })}
      ${metricCard({ value: `${metrics.professionalUse}%`, label: "Applied skills professionally", note: "adult and workforce signal", tone: "gold" })}
      ${metricCard({ value: "3", label: "Learning pathways", note: "youth, builders, professionals" })}
    </div>
    <div class="panel" style="margin-top:26px;">
      <h2>Geographic Reach</h2>
      ${metrics.regions
        .map(([region, learners, pct], index) => `<div class="region-row"><strong>${esc(region)}</strong><div class="bar-shell ${index % 2 ? "gold" : "cyan"}"><span style="width:${Math.max(5, (learners / 1200) * 100)}%"></span></div><span>+${pct}%</span></div>`)
        .join("")}
    </div>
    <div class="panel" style="margin-top:22px;">
      <h2>Skills Distribution</h2>
      <ul class="checklist">
        <li>Prompt engineering</li>
        <li>AI assistants and chatbots</li>
        <li>Web application prototyping</li>
        <li>Web3 and credential literacy</li>
        <li>AgentOps and governance</li>
        <li>Portfolio-ready project presentation</li>
      </ul>
    </div>
  `
)}
${page(
  "Year 3 and Beyond",
  "Scaling the AI Literacy Movement Responsibly",
  "The next stage expands access, localization, institutional readiness, and advanced infrastructure while keeping learner outcomes and privacy at the center.",
  `
    <div class="grid-2">
      <div class="panel"><h2>Localization</h2><p>English-language content expands toward Spanish and French access, supporting broader participation across families, schools, and international communities.</p></div>
      <div class="panel"><h2>District Readiness</h2><p>Program materials, completion evidence, and deployable learning artifacts can support district and school-based AI literacy adoption.</p></div>
      <div class="panel"><h2>AI Arena Expansion</h2><p>Program showcases and launch environments create a stronger public demonstration layer for learner-built AI systems.</p></div>
      <div class="panel"><h2>Web5 Foundations</h2><p>Future infrastructure can strengthen identity, portability, privacy, and learner-owned proof as the ecosystem matures.</p></div>
    </div>
    <div class="panel" style="margin-top:28px;">
      <h2>Historic Achievement Summary</h2>
      <ul class="checklist">
        <li>first youth AI literacy program in United States history</li>
        <li>Scaled from 15,000 to 30,000 students</li>
        <li>Scaled from 12,000 to 25,000 apps built</li>
        <li>Built a pathway from curiosity to deployed work</li>
        <li>Introduced verifiable skill-record infrastructure</li>
        <li>Expanded youth learning into adult workforce acceleration through Vanguard</li>
      </ul>
    </div>
  `
)}
${page(
  "Grant Attachment Summary",
  "A Complete Pipeline from Curiosity to Competency",
  "The AI Pioneer Program is a scaled, outcomes-oriented AI literacy initiative that combines access, applied building, privacy-aware verification, and future workforce preparation.",
  `
    <div class="grid-4">
      ${metricCard({ value: fmt(metrics.studentsCurrent), label: "students", note: "Year 3 reach", tone: "gold" })}
      ${metricCard({ value: fmt(metrics.appsCurrent), label: "apps built", note: "deployed learning evidence" })}
      ${metricCard({ value: `${metrics.confidence}%`, label: "AI confidence", note: "reported learner gain", tone: "gold" })}
      ${metricCard({ value: `${metrics.professionalUse}%`, label: "professional use", note: "applied skills" })}
    </div>
    <div class="panel" style="margin-top:28px;">
      <h2 class="final-title">Why This Matters for Grant Review</h2>
      <p style="font-size:16px;">This program is positioned to expand equitable AI literacy by giving learners a complete path from early curiosity to hands-on building, project deployment, skill verification, and future workforce readiness. It is an implementation pipeline with measurable growth, visible outputs, and privacy-aware proof of learning.</p>
    </div>
    <div class="panel" style="margin-top:22px;">
      <h2>Submission Note</h2>
      <p>This attachment avoids unsupported credentialing claims, federal endorsement language, and commercial calls to action. It is formatted as a grant-review evidence brief focused on public benefit, educational outcomes, and scalable program impact.</p>
    </div>
  `
)}
</body>
</html>`;

const readme = `# AI Pioneer Program Grant Attachment

Final grant-ready PDF:

- \`exports/AI_Pioneer_Program_Grant_Impact_Brief.pdf\`

Supporting files:

- \`AI_Pioneer_Program_Grant_Impact_Brief.html\`
- \`grant-impact-data.json\`
- \`previews/page-*.png\`

Content posture:

- No commercial CTA language.
- No financial return language.
- No unsupported credentialing claim.
- No federal endorsement claim.
- Grant-review framing focused on program history, growth, learner outcomes, credentialing architecture, privacy-aware verification, and public benefit.
`;

const data = {
  sourceFile: "C:\\Users\\AlexT\\Downloads\\AI_Pioneer_Program.pdf",
  sourceNote: "Source PDF was image-based in local extraction. This brief uses the user-provided program content and metrics from the conversation plus the local ZEN campaign metrics.",
  metrics,
  growth,
  publicationSafety: [
    "No commercial CTA language.",
    "No financial return language.",
    "No unsupported credentialing claim.",
    "No federal endorsement claim.",
    "Uses privacy-by-design language instead of unverified GDPR compliance language.",
  ],
};

writeFileSync(join(root, "AI_Pioneer_Program_Grant_Impact_Brief.html"), html, "utf8");
writeFileSync(join(root, "grant-impact-data.json"), `${JSON.stringify(data, null, 2)}\n`, "utf8");
writeFileSync(join(root, "README.md"), readme, "utf8");

const browser = await chromium.launch();
try {
  const pageHandle = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 2 });
  await pageHandle.setContent(html, { waitUntil: "load" });
  await pageHandle.pdf({
    path: join(exportDir, "AI_Pioneer_Program_Grant_Impact_Brief.pdf"),
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
  });

  const pages = await pageHandle.locator(".page").all();
  for (let i = 0; i < pages.length; i += 1) {
    await pages[i].screenshot({ path: join(previewDir, `page-${String(i + 1).padStart(2, "0")}.png`) });
  }
  await pageHandle.close();
} finally {
  await browser.close();
}

console.log(`Created grant brief PDF and previews in ${root}`);
