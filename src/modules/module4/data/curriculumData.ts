import type { Curriculum } from '../../../types';

export const curriculumData: Curriculum = {
    title: 'MODULE 4 — AI SYSTEMS MASTERY & PROFESSIONAL INTEGRATION',
    summaryForAI:
        "Module 4 of ZEN AI VANGUARD, 'AI Systems Mastery & Professional Integration,' elevates learners to operational experts. Section 1 focuses on systems engineering, covering system mapping, prompt control flows, agent framework comparisons (smolagents, LangGraph), advanced memory design (RAG), data pipelines (ETL), and MLOps principles like testing, observability, security, and human-in-the-loop governance. Section 2 transitions to strategic oversight, teaching data analytics and storytelling, anomaly/drift detection, cost optimization, ethical and bias audits, and legal/IP considerations. The module culminates in assembling a comprehensive Governance Pack, undergoing a crisis simulation, and credentialing their skills on-chain, preparing them for leadership roles in the AI-driven economy.",
    sections: [
        {
            id: 'part-1',
            title: 'Section 1 — Systems Engineering & Operational Excellence',
            content: [
                {
                    type: 'interactive',
                    content: '',
                    component: 'HeroIntroMod4',
                    interactiveId: 'hero-intro-mod4'
                },
                { type: 'paragraph', content: 'Welcome to the engine room of the AI revolution. In this section, we move beyond merely "prompting" models to engineering robust, scalable, and observable AI systems. You will learn to treat AI not as magic, but as a software component that requires rigorous architecture, testing, governance, documentation, and operational discipline.' },
                { type: 'paragraph', content: 'We begin where every engineering effort should: by understanding the systems already in place. The first subsection teaches you to reverse-engineer and visualize AI architectures before writing a single line of code.' },
            ],
            subSections: [
                {
                    id: '1-1',
                    title: '1.1 Systems Synthesis Lab',
                    content: [
                        { type: 'paragraph', content: 'True systems engineering starts with seeing the whole picture before touching any parts. This subsection teaches you the C4 Model for visualizing AI architectures — from high-level context down to individual prompt logic — and identifying dependencies, failure modes, and blast radii before writing a single line of code.' },
                        { type: 'heading', content: 'Architectural Reverse-Engineering & The C4 Model' },
                        { type: 'paragraph', content: 'True mastery begins with understanding the invisible structures that govern AI behavior. We adopt the **C4 Model** (Context, Containers, Components, Code) to visualize these architectures. This tiered approach allows us to zoom in from the high-level system context down to the individual prompt logic. Participants map their system’s "blast radius" — identifying which downstream services are affected if the model hallucinates or fails.' },
                        { type: 'paragraph', content: 'In this lab, you will decompose a monolithic AI application into micro-services. Consider a "Travel Agent AI". It isn\'t just one prompt; it is a constellation of services: a Flight Search API, a Hotel Booking Container, a User Profile Store, and a centralized Orchestration Agent. We visualize these dependencies to identify single points of failure and latency bottlenecks.' },
                        { type: 'heading', content: 'Interface Contracts & Data Lineage' },
                        { type: 'paragraph', content: 'The second phase examines system cohesion — how one layer’s output becomes another’s input. Using industry diagrams from firms like OpenAI Enterprise and Cohere, learners identify where context loss, token limits, or improper serialization cause degradation. They practice “contract thinking”: defining every interface with explicit I/O expectations (e.g., using Pydantic models or JSON schemas). Finally, they generate a visual “System Map” that becomes the Runbook’s foundation, including data lineage, privacy checkpoints, and human-in-the-loop nodes.' },
                        { type: 'heading', content: 'Interactive: AI Systems Blueprint Visualizer' },
                        { type: 'paragraph', content: 'Visualize your architecture before writing a single line of code. Users describe a complex system, even one that has never existed but remains physically plausible. Nano-Banana then generates an industrial-quality, state-of-the-art blueprint. As it builds, the AI analyzes the system architecture to identify potential bottlenecks or inefficiencies, suggesting intelligent improvements. The model learns from each query, refining its ability to forecast system behavior and construct robust, professional-grade mock-ups.' },
                        { type: 'interactive', content: [], component: 'AiSystemsBlueprintVisualizer', interactiveId: 'blueprint-visualizer-1' },
                        { type: 'quote', content: 'Corporate Use Example: Compliance officers visualize internal AI model dependencies to verify data lineage and SOC-2 alignment before audits.' },
                        { type: 'heading', content: 'Interactive: “Skytower Architect” — Structural Vision Generator' },
                        { type: 'paragraph', content: 'Apply systems thinking to physical engineering. Users must prompt Nano-Banana to generate the blueprint and visual concept for the tallest building in the world, including realistic engineering dimensions, load-bearing logic, and environmental context. The AI explains why each structural element exists and provides a "Design Integrity Check" to reveal whether the layout is structurally plausible.' },
                        { type: 'interactive', content: [], component: 'SkytowerArchitect', interactiveId: 'skytower-architect-1' },
                        { type: 'interactive', content: '', component: 'SectionQuiz', interactiveId: 'quiz-4-1' },
                        { type: 'paragraph', content: 'You can now see the architecture. The next step is controlling what flows through it. Prompt systems at production scale are not single instructions — they are versioned portfolios of templates with routing logic, mutation tracking, and drift detection.' },
                    ],
                },
                {
                    id: '1-2',
                    title: '1.2 Prompt Systems & Control Flow Optimization',
                    content: [
                        { type: 'paragraph', content: 'Architectural clarity tells you what exists. Prompt system design tells you how to control it. This subsection elevates prompting from craft to engineering — with version control, deterministic routing, mutation tracking, and drift detection for production prompt portfolios.' },
                        { type: 'heading', content: 'From Prompting to Engineering: Deterministic Control' },
                        { type: 'paragraph', content: 'Prompt engineering at professional scale becomes prompt system design — managing not one prompt, but a portfolio of templates routed by intent. We move beyond "magic words" to **Deterministic Control Flows**. Learners examine advanced control techniques such as dynamic variable substitution, meta-prompt chaining, and temperature modulation to enforce output consistency.' },
                        { type: 'paragraph', content: 'We analyze the **ReAct (Reason + Act)** pattern versus **Chain-of-Thought (CoT)** prompting. While CoT improves reasoning, ReAct allows the model to interact with external tools. You will design a "Router Chain" — a lightweight classification prompt that determines if a user query is "Support", "Sales", or "Technical", routing it to the appropriate specialized model (e.g., Gemini Flash for speed vs. Gemini Pro for reasoning).' },
                        { type: 'heading', content: 'Version Control for Cognitive Logic' },
                        { type: 'paragraph', content: 'In reflection, professionals learn that prompt systems mirror traditional software APIs: versioned, tested, and governed. They design version control for prompts (v1.0, v1.1, etc.) and document how each revision improved accuracy or safety. We discuss the concept of "Prompt Drift" — where model updates subtly change how a prompt is interpreted — and how to guard against it.' },
                        { type: 'heading', content: 'Interactive: Prompt Health Dashboard' },
                        { type: 'paragraph', content: 'Monitors prompts in live production and visualizes drift — using animated heatmaps that show which prompts produce high variance or hallucination. This tool simulates an enterprise MLOps environment where reliability is paramount.' },
                        { type: 'interactive', content: [], component: 'PromptHealthDashboard', interactiveId: 'prompt-health-dashboard-1' },
                        { type: 'interactive', content: [], component: 'PromptMutationStudio', interactiveId: 'prompt-mutation-studio-1' },
                        { type: 'quote', content: 'Corporate Use Example: Marketing teams can track which prompts yield off-brand tone or factual errors, generating a report for revision meetings.' },
                        { type: 'interactive', content: '', component: 'SectionQuiz', interactiveId: 'quiz-4-2' },
                        { type: 'paragraph', content: 'Controlling prompt flow is essential, but the real decision is which framework executes those flows. The next subsection compares the dominant agent frameworks head-to-head — revealing the tradeoffs between stateless chains, stateful graphs, and multi-agent collaboration.' },
                    ],
                },
                {
                    id: '1-3',
                    title: '1.3 Agent Framework Comparative Study',
                    content: [
                        { type: 'paragraph', content: 'You can design prompt systems. Now you need the framework to run them. This subsection provides a hands-on comparison of the dominant agent architectures — LangChain, LlamaIndex, and AutoGen — revealing when to use stateless chains, DAG-based graphs, or multi-agent conversation patterns.' },
                        { type: 'heading', content: 'The Landscape of Agency: LangChain vs. LlamaIndex vs. AutoGen' },
                        { type: 'paragraph', content: 'This unit formalizes understanding of the agent frameworks dominating industry. We analyze the trade-offs between "stateless" chains and "stateful" graphs. Learners perform a head-to-head comparison using identical tasks such as document retrieval or API summarization, benchmarking throughput, observability features, and reliability using a 50-sample workload.' },
                        { type: 'heading', content: 'DAGs vs. Sequential Chains' },
                        { type: 'paragraph', content: 'Instructors emphasize architectural literacy: how Directed Acyclic Graph (DAG) planning in **LangGraph** differs from linear sequential prompting, and how **LlamaIndex**’s vector store interfaces efficiently integrate with enterprise data lakes. We also explore multi-agent collaboration via **AutoGen**, where agents converse to solve problems. Each participant rebuilds one of their prior mini-apps inside a new framework to feel real-world migration friction and the cost of technical debt.' },
                        { type: 'heading', content: 'Interactive Components' },
                        { type: 'paragraph', content: '“Framework Arena” – a three-column console that executes sample workflows side-by-side, animating step counts, latency bars, and success rates in real time.' },
                        { type: 'interactive', content: [], component: 'MultiAgentChatSandbox', interactiveId: 'framework-arena-1' },
                        { type: 'paragraph', content: '“Migration Simulator” – learners drag one of their micro-apps into a new framework container; an animation shows rebuild time and dependency conflicts.' },
                        { type: 'interactive', content: [], component: 'AgentSystemDesigner', interactiveId: 'agent-system-designer-1' },
                        { type: 'quote', content: 'Leaderboard: frameworks earn stars for speed, transparency, and observability; students discuss why trade-offs emerge.' },
                        { type: 'paragraph', content: 'Frameworks execute logic. But agents are only useful if they can remember what happened. The next subsection dives into memory engineering — building RAG pipelines, vector stores, and semantic caches that give your agents persistent, cost-efficient recall.' },
                    ],
                },
                {
                    id: '1-4',
                    title: '1.4 Advanced Memory Design & Semantic Caching',
                    content: [
                        { type: 'paragraph', content: 'A framework without memory is a tool without context. This subsection teaches you to engineer three types of memory — episodic, semantic, and procedural — into your agents using vector stores, hierarchical indexing, and privacy-aware context management.' },
                        { type: 'heading', content: 'Cognitive Persistence: RAG & Vector Stores' },
                        { type: 'paragraph', content: 'AI systems become powerful only when they remember effectively. This lesson explores three memory types: episodic (chat history), semantic (knowledge embeddings), and procedural (rules or routines). Learners build hybrid retrieval-augmented-generation (RAG) pipelines that balance recall precision with cost efficiency. Using FAISS or Chroma vector stores, they experiment with **hierarchical indexing** and measure retrieval precision and recall.' },
                        { type: 'heading', content: 'Context Management & Sliding Windows' },
                        { type: 'paragraph', content: 'Instructors guide participants through context-aging algorithms that retire outdated knowledge, reducing hallucination risk while maintaining responsiveness. We introduce the concept of "Memory Consolidation" — using a background process to summarize conversation logs into long-term semantic notes. Learners also design privacy filters to exclude personal data from memory, echoing compliance practices in NIST’s AI Risk Management Framework.' },
                        { type: 'heading', content: 'Interactive: Memory Recall Tuner' },
                        { type: 'paragraph', content: 'A “holographic memory cube” interface lets users drag documents into 3D space to adjust chunk size, vector distance thresholds, and retrieval bias, visualized as glowing linkages that expand or contract dynamically.' },
                        { type: 'interactive', content: [], component: 'MemoryRecallTuner', interactiveId: 'memory-recall-tuner-1' },
                        { type: 'interactive', content: [], component: 'RagBuilder', interactiveId: 'rag-builder-1' },
                        { type: 'interactive', content: [], component: 'ContextWindowExplorer', interactiveId: 'context-window-explorer-1' },
                        { type: 'interactive', content: [], component: 'MemoryDecayLab', interactiveId: 'memory-decay-lab-1' },
                        { type: 'quote', content: 'Corporate Use Example: Legal or HR departments test document recall precision across policy datasets before deploying compliance bots.' },
                        { type: 'paragraph', content: 'Memory feeds the model; data pipelines feed the memory. The next subsection covers the critical upstream infrastructure: how to extract, clean, validate, and govern the data that flows into your AI systems.' },
                    ],
                },
                {
                    id: '1-5',
                    title: '1.5 Data Pipeline Engineering',
                    content: [
                        { type: 'paragraph', content: 'Your agents can remember, but only if the data feeding them is clean and trustworthy. This subsection teaches end-to-end data pipeline engineering — from raw extraction through cleaning, schema validation, and PII minimization — because garbage in still means garbage out, no matter how smart the model.' },
                        { type: 'heading', content: 'The Lifeblood of AI: ETL & Data Cleaning' },
                        { type: 'paragraph', content: 'Reliable AI begins with structured, explainable data. Professionals build an end-to-end ETL (Extract, Transform, Load) pipeline feeding their agents. They ingest diverse data sources — spreadsheets, PDFs, APIs — then apply cleaning steps using pandas and Great Expectations. We focus on the concept of "Garbage In, Garbage Out" at an industrial scale.' },
                        { type: 'heading', content: 'Schema Validation & Governance' },
                        { type: 'paragraph', content: 'Students document schema metadata and practice PII minimization by hashing or masking identifiers. They integrate validation checkpoints that flag anomalies (e.g., schema drift, null values) before data reaches the model. Visualization of their pipeline flow helps them see where human oversight or blockchain attestations could verify data provenance. We also touch on the concept of "Data Flywheels" — how user interactions feed back into the dataset to improve the model over time.' },
                        { type: 'heading', content: 'Interactive Experiences' },
                        { type: 'paragraph', content: '“Pipeline Constructor” – visual drag flow: ingest → clean → validate → store. Each stage animates with flowing particles; errors flash red when schema violations occur.' },
                        { type: 'interactive', content: [], component: 'DataDecisionFlowchartBuilder', interactiveId: 'pipeline-constructor-1' },
                        { type: 'paragraph', content: '“Data Sanity Scanner” – upload any CSV; the tool displays live completeness and validity scores and animates error bars as fixes are applied.' },
                        { type: 'interactive', content: [], component: 'DataVisualizer', interactiveId: 'data-sanity-scanner-1' },
                        { type: 'quote', content: 'Challenge: achieve a Data Quality Index ≥ 95 % before moving on.' },
                        { type: 'paragraph', content: 'Clean data goes in. But how do you know what comes out is correct? The next subsection covers testing and evaluation — the discipline of measuring AI quality with the same rigor applied to any production software system.' },
                    ],
                },
                {
                    id: '1-6',
                    title: '1.6 Testing & Evaluation Frameworks',
                    content: [
                        { type: 'paragraph', content: 'You have clean data, a framework, and memory. But how do you prove the system works? This subsection introduces multi-layer test suites — unit tests, scenario tests, batch validation, and the LLM-as-a-Judge pattern — to bring engineering rigor to non-deterministic systems.' },
                        { type: 'heading', content: 'Evaluating the Subjective: LLM-as-a-Judge' },
                        { type: 'paragraph', content: 'Evaluation is the heartbeat of professional AI. How do you test a system that is non-deterministic? Participants design multi-layer test suites: unit tests for tools, scenario tests for workflows, and batch tests for statistical validation. They use Hugging Face Evaluate, LangSmith, or custom Python scripts to compute F1, BLEU, and human-rubric scores.' },
                        { type: 'heading', content: 'Bias & Fairness Testing' },
                        { type: 'paragraph', content: 'The class discusses evaluation reproducibility: fixing seeds, tracking prompt versions, and reporting confidence intervals. We introduce the "LLM-as-a-Judge" pattern, where a stronger model (e.g., Gemini Pro) evaluates the outputs of a smaller, faster model (e.g., Gemini Flash). Instructors present findings from Stanford’s Center for Research on Foundation Models that show evaluation bias can misrepresent performance by up to 18% if sample sets aren’t randomized.' },
                        { type: 'heading', content: 'Interactive Labs' },
                        { type: 'paragraph', content: '“Eval Lab Dashboard” – upload test prompts; watch F1, BLEU, and cost histograms animate as runs complete. Clicking a bar shows representative outputs.' },
                        { type: 'interactive', content: [], component: 'RlhfTrainerGame', interactiveId: 'eval-lab-dashboard-1' },
                        { type: 'paragraph', content: '“Stochasticity Simulator” – toggle randomness; a live graph shows accuracy variance and stability index.' },
                        { type: 'interactive', content: [], component: 'LossLandscapeNavigator', interactiveId: 'stochasticity-simulator-1' },
                        { type: 'interactive', content: [], component: 'AdversarialAttackSimulator', interactiveId: 'adversarial-simulator-1' },
                        { type: 'quote', content: 'Game Mechanic: sustain ≥ 0.8 F1 across three consecutive batches to earn “Reliability Engineer.”' },
                        { type: 'paragraph', content: 'Testing tells you whether the system works. Observability tells you why it works — or why it stopped. The next subsection teaches you to instrument your AI systems with structured telemetry so you are never flying blind in production.' },
                    ],
                },
                {
                    id: '1-7',
                    title: '1.7 Observability & Telemetry',
                    content: [
                        { type: 'paragraph', content: 'Tests run at deployment time. Observability runs continuously. This subsection teaches you to build live dashboards that track latency, cost, accuracy, and user satisfaction in real time — so you catch problems before your users do.' },
                        { type: 'heading', content: 'Flying by Instruments: OpenTelemetry' },
                        { type: 'paragraph', content: 'Professionals need visibility into what their AI systems do when no one is watching. This lesson teaches instrumentation: collecting structured logs (timestamp, prompt ID, response hash, latency) and feeding them to analytic dashboards. Learners implement lightweight telemetry with Plotly Dash or Grafana, creating live KPI panels for accuracy, cost, and user satisfaction.' },
                        { type: 'heading', content: 'Tracing the Thought Process' },
                        { type: 'paragraph', content: 'The class explores traceability standards drawn from **OpenTelemetry** and Google’s MLOps Guidelines, emphasizing that every decision should be auditable. Students correlate spikes in latency with API cost bursts and visualize time-series correlations. We discuss the difference between "System Metrics" (latency, error rate) and "Business Metrics" (user intent resolution, satisfaction score).' },
                        { type: 'heading', content: 'Interactive Visualizers' },
                        { type: 'paragraph', content: '“Live Ops Console” – simulated control room where streams of events flow across a neon dashboard; latency spikes trigger glowing alerts.' },
                        { type: 'interactive', content: [], component: 'FundingPulseTicker', interactiveId: 'live-ops-console-1' },
                        { type: 'paragraph', content: '“Correlation Explorer” – drag metrics (cost, latency, user satisfaction) onto a canvas; animated lines reveal correlation strength (Pearson r).' },
                        { type: 'interactive', content: [], component: 'SimplePredictiveModel', interactiveId: 'correlation-explorer-1' },
                        { type: 'quote', content: 'Mini-App Tip: pressing “Auto-Explain” generates plain-English summaries (“Latency ↑ 15 % due to API queue”).' },
                        { type: 'paragraph', content: 'Observability reveals system behavior. Security ensures that behavior cannot be exploited. The next subsection covers the full threat landscape for AI systems — from key leakage and data poisoning to the OWASP Top 10 for LLMs.' },
                    ],
                },
                {
                    id: '1-8',
                    title: '1.8 Security & Secrets Operations',
                    content: [
                        { type: 'paragraph', content: 'You can observe your system. Now you defend it. This subsection addresses the escalating threat landscape for production AI — covering encryption, access control, key management, dependency auditing, and the OWASP Top 10 for LLMs.' },
                        { type: 'heading', content: 'Defense in Depth & OWASP Top 10' },
                        { type: 'paragraph', content: 'Modern AI environments face escalating security threats: data poisoning, prompt injection, key leakage. This unit teaches defense in depth. Learners study encryption basics, token-scope limitation, and RBAC (role-based access control). We analyze the **OWASP Top 10 for LLMs**, focusing on Prompt Injection and Insecure Output Handling.' },
                        { type: 'heading', content: 'Secrets Management & Hygiene' },
                        { type: 'paragraph', content: 'They simulate a key compromise drill, revoking credentials and redeploying environment variables while maintaining uptime. Instructors reference IBM’s Cybersecurity Index showing AI toolchain attacks up 62 % year-over-year, underscoring urgency. Learners audit dependency packages for known CVEs and implement automated scans via GitHub Dependabot or pip-audit. They also design communication protocols for disclosing breaches ethically and legally.' },
                        { type: 'heading', content: 'Simulations & Apps' },
                        { type: 'paragraph', content: '“Breach Drill Simulator” – interactive timeline: a key leak alert appears; learners click through containment steps. Correct order restores system integrity; missteps cost “trust points.”' },
                        { type: 'interactive', content: [], component: 'EthicalDilemmaSimulator', interactiveId: 'breach-drill-simulator-1' },
                        { type: 'paragraph', content: '“Access Visualizer” – animated network map showing RBAC layers; toggling a user’s permission immediately updates connection paths.' },
                        { type: 'interactive', content: [], component: 'LangGraphVisualizer', interactiveId: 'access-visualizer-1' },
                        { type: 'interactive', content: [], component: 'CodeDebugger', interactiveId: 'security-debugger-1' },
                        { type: 'quote', content: 'Tip: enable MFA node animation—blinking green locks mean compliance achieved.' },
                        { type: 'paragraph', content: 'Security keeps attackers out. Governance keeps legitimate users accountable. The next subsection covers human-in-the-loop architecture — designing systems where model confidence triggers human review, and human corrections improve the model over time.' },
                    ],
                },
                {
                    id: '1-9',
                    title: '1.9 Human-in-the-Loop Governance',
                    content: [
                        { type: 'paragraph', content: 'Security hardens the perimeter. Human-in-the-loop governance ensures accountability within it. This subsection teaches you to architect review queues, calibrate confidence thresholds, and design active learning loops where human corrections continuously improve model performance.' },
                        { type: 'heading', content: 'The Human Firewall & Active Learning' },
                        { type: 'paragraph', content: 'This lesson reconnects automation with accountability. Students architect workflows where humans verify critical decisions — contract approvals, HR summaries, medical triage drafts. They build review queues in which model confidence (< 0.7 score) triggers human validation. The lab quantifies performance improvements: typically, introducing reviewers increases accuracy by 12–18 % while limiting cost growth to 5 %.' },
                        { type: 'heading', content: 'Active Learning Loops' },
                        { type: 'paragraph', content: 'Discussion centers on cognitive ergonomics: preventing reviewer fatigue and documenting dissent. We explore **Active Learning**, where human corrections are fed back into the system to fine-tune future model versions. Learners design escalation policies and feedback loops that retrain prompts when humans override outputs.' },
                        { type: 'heading', content: 'Interactive Modules' },
                        { type: 'paragraph', content: '“Reviewer Queue Sim” – an AI/human moderation game where uncertain outputs queue for approval. Players must decide Approve/Revise/Reject under time pressure; accuracy and speed scores appear live.' },
                        { type: 'interactive', content: [], component: 'RlhfTrainerGame', interactiveId: 'reviewer-queue-sim-1' },
                        { type: 'paragraph', content: '“Feedback Loop Trainer” – each human correction retrains a toy model; a line chart shows precision rising as feedback accumulates.' },
                        { type: 'interactive', content: [], component: 'PersonalizationSimulator', interactiveId: 'feedback-loop-trainer-1' },
                        { type: 'quote', content: 'Fun Element: leaderboard tracks fastest reviewer to achieve < 5 % false positives.' },
                        { type: 'paragraph', content: 'Human governance handles normal operations. But what happens when everything goes wrong at once? The next subsection teaches incident response and SLA engineering — the discipline of surviving production failures gracefully.' },
                    ],
                },
                {
                    id: '1-10',
                    title: '1.10 Incident Response & SLA Engineering',
                    content: [
                        { type: 'paragraph', content: 'You have built, tested, observed, secured, and governed your system. This subsection is the final stress test: what happens when it breaks? You will define SLOs, calculate error budgets, run outage simulations, and practice the incident response procedures used by the world’s most reliable engineering organizations.' },
                        { type: 'heading', content: 'Reliability Engineering & SRE Principles' },
                        { type: 'paragraph', content: 'The capstone of Section 1 teaches resilience engineering. Learners define measurable Service-Level Objectives (SLOs) for uptime, latency, and accuracy, then translate them into Service-Level Agreements (SLAs) with hypothetical stakeholders. They conduct a live outage simulation, forcing their Space offline for 10 minutes while executing rollback and notification procedures.' },
                        { type: 'heading', content: 'The Error Budget' },
                        { type: 'paragraph', content: 'The cohort studies reliability statistics from Google SRE Reports showing that well-defined SLOs reduce downtime cost by 34 % annually. Students calculate mean time to detect (MTTD) and mean time to recover (MTTR)* for their system, embedding these metrics in their dashboards. We introduce the concept of "Error Budget" — the acceptable amount of failure allowed to foster innovation without breaking trust.' },
                        { type: 'heading', content: 'Interactive Simulation' },
                        { type: 'paragraph', content: '“SLA Commander” – a dashboard that randomly generates incidents (API failure, latency spike, cost overrun). Learners deploy rollback or reroute actions by pressing response buttons; MTTR and downtime cost update live.' },
                        { type: 'interactive', content: [], component: 'DockerCommandQuiz', interactiveId: 'sla-commander-1' },
                        { type: 'paragraph', content: '“Post-Mortem Generator” – after each drill, an animated report builds itself from logs; users edit narrative fields to complete the official document.' },
                        { type: 'interactive', content: [], component: 'MeetingSummarizer', interactiveId: 'post-mortem-generator-1' },
                        { type: 'quote', content: 'Achievement: keep uptime ≥ 99.5 % across three scenarios to earn “Resilience Architect.”' },
                        { type: 'paragraph', content: 'You have mastered the full engineering lifecycle: architecture, prompts, frameworks, memory, data, testing, observability, security, governance, and incident response. The final subsection ties it all together with a hands-on building activity — deploying an SOP Builder that exercises every skill from this section.' },
                    ],
                },
                {
                    id: '1-11',
                    title: '1.11 Building Activity',
                    content: [
                        { type: 'paragraph', content: 'This is the build. Everything from subsections 1.1 through 1.10 converges in a single deployment exercise. You will create a production-ready SOP Builder that demonstrates systems thinking, prompt engineering, structured output generation, and deployment discipline.' },
                        { type: 'heading', content: 'ZEN Simple SOP Builder' },
                        { type: 'paragraph', content: 'In this building activity, you will create a tool to generate Standard Operating Procedures (SOPs) using an LLM. Below is the code required to build this application using Gradio.' },
                        { type: 'heading', content: 'Application Code (app.py)' },
                        { type: 'paragraph', content: 'This is the main application logic. It handles the UI with Gradio, communicates with the LLM API, parses the JSON response, and visualizes the SOP steps using Matplotlib.' },
                        {
                            type: 'code', language: 'python', content: `import json
import textwrap
from typing import Dict, Any, List, Tuple

import gradio as gr
import requests
import matplotlib.pyplot as plt
from matplotlib.figure import Figure


# ============================================================
#  LLM CALLER (GPT-4.1 BY DEFAULT)
# ============================================================

def call_chat_completion(
    api_key: str,
    base_url: str,
    model: str,
    system_prompt: str,
    user_prompt: str,
    max_completion_tokens: int = 2000,
) -> str:
    """
    OpenAI-compatible chat completion call.

    - Uses new-style \`max_completion_tokens\` (for GPT-4.1, GPT-4o, etc.)
    - Falls back to \`max_tokens\` if the provider doesn't support it.
    - No temperature / top_p to avoid incompatibility with some models.
    """
    if not api_key:
        raise ValueError("API key is required.")

    if not base_url:
        base_url = "https://api.openai.com"

    url = base_url.rstrip("/") + "/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer \${api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "max_completion_tokens": max_completion_tokens,
    }

    resp = requests.post(url, headers=headers, json=payload, timeout=60)

    # Fallback for providers still expecting \`max_tokens\`
    if resp.status_code == 400 and "max_completion_tokens" in resp.text:
        payload.pop("max_completion_tokens", None)
        payload["max_tokens"] = max_completion_tokens
        resp = requests.post(url, headers=headers, json=payload, timeout=60)

    if resp.status_code != 200:
        raise RuntimeError(
            f"LLM API error: \${resp.status_code} - \${resp.text[:400]}"
        )

    data = resp.json()
    try:
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        raise RuntimeError(f"Unexpected LLM response format: \${e}\\n\\n\${json.dumps(data, indent=2)}") from e


# ============================================================
#  SOP PROMPT + PARSING
# ============================================================

SOP_SYSTEM_PROMPT = """
You are an expert process engineer. Produce SOPs strictly as JSON with this schema:

{
  "title": "string",
  "purpose": "string",
  "scope": "string",
  "definitions": ["string", ...],
  "roles": [
    {
      "name": "string",
      "responsibilities": ["string", ...]
    }
  ],
  "prerequisites": ["string", ...],
  "steps": [
    {
      "step_number": 1,
      "title": "string",
      "description": "string",
      "owner_role": "string",
      "inputs": ["string", ...],
      "outputs": ["string", ...]
    }
  ],
  "escalation": ["string", ...],
  "metrics": ["string", ...],
  "risks": ["string", ...],
  "versioning": {
    "version": "1.0",
    "owner": "string",
    "last_updated": "string"
  }
}

Return ONLY JSON. No explanation or commentary.
"""

def build_user_prompt(
    sop_title: str,
    description: str,
    industry: str,
    tone: str,
    detail_level: str,
) -> str:
    return f"""
SOP Title: \${sop_title or "Untitled SOP"}
Context: \${description or "N/A"}
Industry: \${industry or "General"}
Tone: \${tone or "Professional"}
Detail Level: \${detail_level or "Standard"}
Audience: mid-career professionals who need clarity and accountability.
""".strip()


def parse_sop_json(raw_text: str) -> Dict[str, Any]:
    """Extract JSON from LLM output, stripping code fences if present."""
    txt = raw_text.strip()

    if txt.startswith("\`\`\`"):
        parts = txt.split("\`\`\`")
        # choose the first part that looks like JSON
        txt = next((p for p in parts if "{" in p and "}" in p), parts[-1])

    first = txt.find("{")
    last = txt.rfind("}")
    if first == -1 or last == -1:
        raise ValueError("No JSON object detected in model output.")
    txt = txt[first:last + 1]

    return json.loads(txt)


def sop_to_markdown(sop: Dict[str, Any]) -> str:
    """Render SOP JSON → readable Markdown document."""

    def bullet(items):
        if not items:
            return "_None provided._"
        return "\\n".join(f"- \${i}" for i in items)

    md = []

    md.append(f"# \${sop.get('title', 'Standard Operating Procedure')}\\n")

    md.append("## 1. Purpose")
    md.append(sop.get("purpose", "N/A"))

    md.append("\\n## 2. Scope")
    md.append(sop.get("scope", "N/A"))

    md.append("\\n## 3. Definitions")
    md.append(bullet(sop.get("definitions", [])))

    md.append("\\n## 4. Roles & Responsibilities")
    for role in sop.get("roles", []):
        md.append(f"### \${role.get('name', 'Role')}")
        md.append(bullet(role.get("responsibilities", [])))

    md.append("\\n## 5. Prerequisites")
    md.append(bullet(sop.get("prerequisites", [])))

    md.append("\\n## 6. Procedure (Step-by-Step)")
    for step in sop.get("steps", []):
        md.append(f"### Step \${step.get('step_number', '?')}: \${step.get('title', 'Step')}")
        md.append(f"**Owner:** \${step.get('owner_role', 'N/A')}")
        md.append(step.get("description", ""))
        md.append("**Inputs:**")
        md.append(bullet(step.get("inputs", [])))
        md.append("**Outputs:**")
        md.append(bullet(step.get("outputs", [])))

    md.append("\\n## 7. Escalation")
    md.append(bullet(sop.get("escalation", [])))

    md.append("\\n## 8. Metrics")
    md.append(bullet(sop.get("metrics", [])))

    md.append("\\n## 9. Risks")
    md.append(bullet(sop.get("risks", [])))

    v = sop.get("versioning", {})
    md.append("\\n## 10. Version Control")
    md.append(f"- Version: \${v.get('version', '1.0')}")
    md.append(f"- Owner: \${v.get('owner', 'N/A')}")
    md.append(f"- Last Updated: \${v.get('last_updated', 'N/A')}")

    return "\\n\\n".join(md)


# ============================================================
#  IMPROVED DIAGRAM — AUTO-SIZED CARDS, NO OVERFLOW
# ============================================================

def create_sop_steps_figure(sop: Dict[str, Any]) -> Figure:
    """
    Draw each step as a stacked card with:
    - dynamic height based on description length
    - number block on the left
    - title + owner + wrapped description inside card
    """

    steps = sop.get("steps", [])
    if not steps:
        fig, ax = plt.subplots(figsize=(7, 2))
        ax.text(0.5, 0.5, "No steps available to visualize.", ha="center", va="center")
        ax.axis("off")
        fig.tight_layout()
        return fig

    # First pass: determine required height for each card
    card_heights = []
    total_height = 0.0

    for step in steps:
        desc_lines = textwrap.wrap(step.get("description", ""), width=70)
        # base height (title + owner) + 0.3 per line of description
        base = 1.0  # title + owner + padding
        per_line = 0.32
        h = base + per_line * max(len(desc_lines), 1)
        h += 0.3  # bottom padding
        card_heights.append(h)
        total_height += h

    # Add spacing between cards
    spacing = 0.4
    total_height += spacing * (len(steps) + 1)

    fig_height = min(20, max(5, total_height))
    fig, ax = plt.subplots(figsize=(10, fig_height))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, total_height)

    y = total_height - spacing  # start from top

    for step, h in zip(steps, card_heights):
        y_bottom = y - h
        y_top = y

        # Card boundaries
        x0 = 0.05
        x1 = 0.95

        # Draw outer card
        ax.add_patch(
            plt.Rectangle(
                (x0, y_bottom),
                x1 - x0,
                h,
                fill=False,
                linewidth=1.8,
            )
        )

        # Number block
        num_block_w = 0.08
        ax.add_patch(
            plt.Rectangle(
                (x0, y_bottom),
                num_block_w,
                h,
                fill=False,
                linewidth=1.6,
            )
        )

        # Step number text in the center of the number block
        ax.text(
            x0 + num_block_w / 2,
            y_bottom + h / 2,
            str(step.get("step_number", "?")),
            ha="center",
            va="center",
            fontsize=13,
            fontweight="bold",
        )

        # Text area start
        text_x = x0 + num_block_w + 0.02

        # Title
        ax.text(
            text_x,
            y_top - 0.25,
            step.get("title", ""),
            ha="left",
            va="top",
            fontsize=12,
            fontweight="bold",
        )

        # Owner
        owner = step.get("owner_role", "")
        if owner:
            owner_y = y_top - 0.55
            ax.text(
                text_x,
                owner_y,
                f"Owner: \${owner}",
                ha="left",
                va="top",
                fontsize=10,
                style="italic",
            )
        else:
            owner_y = y_top - 0.5

        # Description (wrapped)
        desc_lines = textwrap.wrap(step.get("description", ""), width=70)
        desc_y = owner_y - 0.4
        for line in desc_lines:
            ax.text(
                text_x,
                desc_y,
                line,
                ha="left",
                va="top",
                fontsize=9,
            )
            desc_y -= 0.3  # vertical spacing per line

        y = y_bottom - spacing  # move down for next card

    ax.axis("off")
    fig.tight_layout()
    return fig


# ============================================================
#  SAMPLE SCENARIOS
# ============================================================

SAMPLE_SOPS: Dict[str, Dict[str, str]] = {
    "Volunteer Onboarding": {
        "title": "Volunteer Onboarding",
        "description": "Onboard new volunteers including application review, background checks, orientation, training, and site placement.",
        "industry": "Nonprofit / Youth Development",
    },
    "Remote Employee Onboarding": {
        "title": "Remote Employee Onboarding",
        "description": "Design a remote onboarding SOP for hybrid employees including IT setup, HR paperwork, and culture onboarding.",
        "industry": "HR / General",
    },
    "IT Outage Response": {
        "title": "IT Outage Incident Response",
        "description": "Major outage response SOP including detection, triage, escalation, communication, restoration, and post-mortem.",
        "industry": "IT / Operations",
    },
}

def load_sample(sample_name: str) -> Tuple[str, str, str]:
    if not sample_name or sample_name not in SAMPLE_SOPS:
        return "", "", "General"
    s = SAMPLE_SOPS[sample_name]
    return s["title"], s["description"], s["industry"]


# ============================================================
#  MAIN HANDLER FOR GRADIO
# ============================================================

def generate_sop_ui(
    api_key_state: str,
    api_key_input: str,
    base_url: str,
    model_name: str,
    sop_title: str,
    description: str,
    industry: str,
    tone: str,
    detail_level: str,
) -> Tuple[str, str, Figure, str]:

    api_key = api_key_input or api_key_state
    if not api_key:
        return (
            "⚠️ Please enter your API key in the left panel.",
            "",
            create_sop_steps_figure({"steps": []}),
            api_key_state,
        )

    model = model_name or "gpt-4.1"

    user_prompt = build_user_prompt(sop_title, description, industry, tone, detail_level)

    try:
        raw = call_chat_completion(
            api_key=api_key,
            base_url=base_url,
            model=model,
            system_prompt=SOP_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            max_completion_tokens=2000,
        )

        sop = parse_sop_json(raw)
        md = sop_to_markdown(sop)
        fig = create_sop_steps_figure(sop)
        json_out = json.dumps(sop, indent=2, ensure_ascii=False)

        return md, json_out, fig, api_key  # persist key in session state

    except Exception as e:
        return (
            f"❌ Error generating SOP:\\n\\n\${e}",
            "",
            create_sop_steps_figure({"steps": []}),
            api_key_state,
        )


# ============================================================
#  GRADIO UI
# ============================================================

with gr.Blocks(title="ZEN Simple SOP Builder") as demo:
    gr.Markdown(
        \"\"\"
# 🧭 ZEN Simple SOP Builder

Generate clean, professional Standard Operating Procedures (SOPs) from a short description,  
plus an auto-generated visual diagram of the steps.

Powered by your own API key (GPT-4.1 by default).
\"\"\"
    )

    api_key_state = gr.State("")

    with gr.Row():
        # LEFT COLUMN — API + Samples
        with gr.Column(scale=1):
            gr.Markdown("### Step 1 — API & Model Settings")

            api_key_input = gr.Textbox(
                label="LLM API Key",
                placeholder="Enter your OpenAI (or compatible) API key",
                type="password",
            )

            base_url = gr.Textbox(
                label="Base URL",
                value="https://api.openai.com",
                placeholder="e.g. https://api.openai.com or custom OpenAI-compatible endpoint",
            )

            model_name = gr.Textbox(
                label="Model Name",
                value="gpt-4.1",
                placeholder="e.g. gpt-4.1, gpt-4o, etc.",
            )

            gr.Markdown("### Load a Sample SOP")

            sample_dropdown = gr.Dropdown(
                label="Sample scenarios",
                choices=list(SAMPLE_SOPS.keys()),
                value=None,
                info="Optional: load a ready-made example to test the tool.",
            )

            load_button = gr.Button("Load Sample into Form")

        # RIGHT COLUMN — SOP Description
        with gr.Column(scale=2):
            gr.Markdown("### Step 2 — Describe the SOP")

            sop_title = gr.Textbox(
                label="SOP Title",
                placeholder="e.g. Volunteer Onboarding Workflow",
            )

            description = gr.Textbox(
                label="Describe the process / context",
                placeholder="What should this SOP cover? Who is it for? Any constraints?",
                lines=6,
            )

            industry = gr.Textbox(
                label="Industry / Domain",
                value="General",
                placeholder="e.g. Nonprofit, HR, Education, Healthcare, IT",
            )

            tone = gr.Dropdown(
                label="Tone",
                choices=["Professional", "Executive", "Supportive", "Direct", "Compliance-focused"],
                value="Professional",
            )

            detail_level = gr.Dropdown(
                label="Detail Level",
                choices=["Standard", "High detail", "Checklist-style", "Overview only"],
                value="Standard",
            )

            generate_button = gr.Button("🚀 Generate SOP", variant="primary")

    gr.Markdown("### Step 3 — Generated SOP")

    with gr.Row():
        with gr.Column(scale=3):
            sop_output = gr.Markdown(
                label="SOP (Markdown)",
                value="Your SOP will appear here after generation.",
            )
        with gr.Column(scale=2):
            sop_json_output = gr.Code(
                label="Raw SOP JSON (for automation / export)",
                language="json",
            )

    gr.Markdown("### Step 4 — Visual Workflow Diagram")
    sop_figure = gr.Plot(label="SOP Steps Diagram")

    # Wire up actions
    load_button.click(
        fn=load_sample,
        inputs=[sample_dropdown],
        outputs=[sop_title, description, industry],
    )

    generate_button.click(
        fn=generate_sop_ui,
        inputs=[
            api_key_state,
            api_key_input,
            base_url,
            model_name,
            sop_title,
            description,
            industry,
            tone,
            detail_level,
        ],
        outputs=[sop_output, sop_json_output, sop_figure, api_key_state],
    )


if __name__ == "__main__":
    demo.launch()` },
                        { type: 'heading', content: 'Dependencies (requirements.txt)' },
                        { type: 'paragraph', content: 'These are the Python libraries required to run the application.' },
                        {
                            type: 'code', language: 'text', content: `gradio==5.49.1
requests
matplotlib
Pillow
numpy` },
                        { type: 'heading', content: 'Configuration (README.md)' },
                        { type: 'paragraph', content: 'This file configures the Hugging Face Space metadata.' },
                        {
                            type: 'code', language: 'markdown', content: `---
title: ZEN Simple SOP Builder
emoji: 🧭
colorFrom: indigo
colorTo: blue
sdk: gradio
sdk_version: 5.49.1
app_file: app.py
pinned: false
short_description: Generate clean SOPs and step visuals from descriptions.
---

For configuration details, see the Hugging Face Spaces Gradio documentation.` },
                        { type: 'interactive', content: [], component: 'ProjectSubmission', interactiveId: 'sop-builder-submission' }
                    ]
                },
            ],
        },
        {
            id: 'part-2',
            title: 'Section 2 — Governance, Analytics & Future Strategy',
            content: [
                { type: 'paragraph', content: 'Having mastered the engineering of AI systems, we now ascend to the bridge. Section 2 transforms you into a strategic operator capable of interpreting data, defending ethical decisions, navigating complex legal landscapes, and anticipating the future of work. You will learn to own the outcomes of your AI systems with competence, compliance, and conscience.' },
                { type: 'paragraph', content: 'We start with the most visible leadership skill: turning raw telemetry data into stories that drive executive decisions.' },
            ],
            subSections: [
                {
                    id: '2-1',
                    title: '2.1 Data Analytics & Storytelling',
                    content: [
                        { type: 'paragraph', content: 'Engineering builds the system. Leadership communicates what the system does. This subsection teaches you to transform raw metrics into compelling executive narratives that drive decisions — using the data storytelling frameworks employed by top consulting firms.' },
                        { type: 'heading', content: 'From Metrics to Meaning' },
                        { type: 'paragraph', content: 'The section opens by teaching professionals how to translate telemetry into meaning. Learners explore data-storytelling frameworks used at McKinsey Analytics and the World Bank—combining quantitative rigor with narrative empathy. Using their own logs, they calculate cost-per-task, P95 latency, and user-satisfaction correlations.' },
                        { type: 'heading', content: 'The Pyramid Principle' },
                        { type: 'paragraph', content: 'Students practice design clarity: minimal color palettes, annotated anomalies, and call-to-action captions. They apply the **Pyramid Principle** to structure their insights: start with the answer, then group supporting arguments, then provide data. They use Plotly Dash, Power BI, or Tableau Public to build a “State of My Agent” report containing three KPIs, two trends, and one anomaly. Tips & Tricks: always label units, keep y-axes consistent, and limit dashboards to seven visible charts to avoid cognitive overload.' },
                        { type: 'heading', content: 'Interactive Mini-App: “Insight Composer”' },
                        { type: 'paragraph', content: 'A drag-and-drop dashboard builder where users drop widgets (charts, annotations, call-outs) to see how clarity or clutter changes comprehension scores in real time.' },
                        { type: 'interactive', content: [], component: 'ExplainabilityPanel', interactiveId: 'insight-composer-1' },
                        { type: 'interactive', content: [], component: 'BenefitSorter', interactiveId: 'insight-sorter-1' },
                        { type: 'quote', content: 'Simulator Tip: Toggle "Executive Mode" to simulate how a C-suite viewer interprets visuals; it highlights jargon or missing context in red.' },
                        { type: 'paragraph', content: 'Data storytelling tells you what happened. But what if the data itself is shifting under your feet? The next subsection teaches you to detect model decay and data drift — the silent killers of deployed AI performance.' },
                    ],
                },
                {
                    id: '2-2',
                    title: '2.2 Anomaly & Drift Detection',
                    content: [
                        { type: 'paragraph', content: 'You can tell the story of your data. But what if the data is lying? Model decay and distribution shift cause AI systems to silently degrade over time. This subsection teaches you to detect, quantify, and respond to drift before it impacts your users.' },
                        { type: 'heading', content: 'The Entropy of AI: Concept vs. Data Drift' },
                        { type: 'paragraph', content: 'Professionals next confront model decay, the silent killer of deployed AI. Learners review how **Concept Drift** (user intent changes) and **Covariate Shift** (input data changes) arise. Examples include seasonal purchasing behavior or evolving language use (slang). They experiment with rolling-window z-scores and cosine-similarity thresholds to quantify deviation.' },
                        { type: 'heading', content: 'Automated Vigilance' },
                        { type: 'paragraph', content: 'Using their system logs, participants implement lightweight monitoring scripts that trigger Slack or Teams alerts when accuracy drops > 10 % from baseline. Instructors teach how to create labeled “gold” datasets that stay stable over time, allowing meaningful comparisons. Learners also visualize drift heatmaps to localize problematic data sources.' },
                        { type: 'heading', content: 'Interactive: Data Drift & Risk Lens' },
                        { type: 'paragraph', content: 'Generates time-series visualizations of changing data distributions. Anomaly clusters bloom like heat spots over time, and users can toggle between “Equity Mode” (bias detection) and “Drift Mode” (data stability).' },
                        { type: 'interactive', content: [], component: 'DataDriftRiskLens', interactiveId: 'data-drift-risk-lens-1' },
                        { type: 'interactive', content: [], component: 'AlgorithmVisualizer', interactiveId: 'outlier-detector-1' },
                        { type: 'quote', content: 'Corporate Use Example: AI operations teams catch model drift in customer-sentiment classification before it impacts quarterly reports.' },
                        { type: 'paragraph', content: 'Drift detection protects quality. Cost optimization protects your budget. The next subsection teaches FinOps for AI — how to cut token costs by 25% without losing accuracy, using semantic caching, model routing, and prompt trimming.' },
                    ],
                },
                {
                    id: '2-3',
                    title: '2.3 Cost & Efficiency Optimization',
                    content: [
                        { type: 'paragraph', content: 'Quality monitoring prevents degradation. Cost monitoring prevents bankruptcy. This subsection teaches the financial discipline of AI operations — how tokenization, model tiering, semantic caching, and prompt compression combine to slash costs without sacrificing capability.' },
                        { type: 'heading', content: 'FinOps for AI' },
                        { type: 'paragraph', content: 'Here efficiency meets sustainability. Students analyze token-usage logs, model-switching patterns, and caching effectiveness. They compute **cost elasticity**—how a 1 % change in context length affects total spend—and observe that trimming prompts by 20 % can cut monthly API costs by roughly 25 % without measurable accuracy loss.' },
                        { type: 'heading', content: 'Semantic Caching' },
                        { type: 'paragraph', content: 'Instructors discuss **Semantic Caching**—storing and reusing model responses for semantically similar queries—to drastically reduce compute. We also explore memory compression, quantization, and scheduled batching. They simulate a multi-model orchestration layer that routes short queries to Gemini Flash and complex reasoning to Gemini Pro, comparing energy and latency trade-offs.' },
                        { type: 'heading', content: 'Interactive App: “Token Tactician”' },
                        { type: 'paragraph', content: 'A sandbox where sliders control context length, model tier, and temperature; a live chart shows dollars, latency, and carbon footprint.' },
                        { type: 'interactive', content: [], component: 'TokenEconomySimulator', interactiveId: 'token-tactician-1' },
                        { type: 'interactive', content: [], component: 'EnergyCarbonTracker', interactiveId: 'energy-tracker-1' },
                        { type: 'quote', content: 'Game Element: reach the "Green Ops" badge by achieving ≥ 90 % accuracy with ≤ 70 % of baseline cost and energy.' },
                        { type: 'paragraph', content: 'Cost optimization ensures efficiency. Ethics ensures that efficiency does not come at the expense of fairness. The next subsection turns ethical principles into measurable metrics — running bias stress tests and computing fairness ratios on your deployed systems.' },
                    ],
                },
                {
                    id: '2-4',
                    title: '2.4 Ethics & Bias Audit Lab',
                    content: [
                        { type: 'paragraph', content: 'You have optimized for cost. Now you audit for fairness. This subsection transforms ethics from a philosophical discussion into a quantitative engineering practice — with bias stress tests, fairness metrics, and transparency frameworks that hold your system accountable.' },
                        { type: 'heading', content: 'Operationalizing Ethics: Fairness Metrics' },
                        { type: 'paragraph', content: 'This lab transforms ethics from a philosophy into a metric. Learners run bias stress tests on their AI agents using counterfactual prompts (e.g., identical résumés differing only by gender). They record output differentials and compute fairness ratios using metrics like **Demographic Parity** and **Equalized Odds**.' },
                        { type: 'heading', content: 'Transparency Frameworks' },
                        { type: 'paragraph', content: 'They explore frameworks such as NIST’s Explainability Guidelines and Google’s **Model Cards for Transparency**. Each participant drafts an Ethics Addendum summarizing potential harms, mitigation actions, and user disclosure language. Practical tip: rephrase prompts neutrally and audit vector datasets for overrepresented terms.' },
                        { type: 'heading', content: 'Simulator: “Bias Mirror”' },
                        { type: 'paragraph', content: 'A split-screen tool that runs paired prompts side-by-side, color-coding lexical bias and sentiment variance across different demographics or languages.' },
                        { type: 'interactive', content: [], component: 'EthicalBiasMirror', interactiveId: 'bias-mirror-1' },
                        { type: 'interactive', content: [], component: 'EthicalStyleInspector', interactiveId: 'style-inspector-1' },
                        { type: 'interactive', content: [], component: 'AiAlignmentTuner', interactiveId: 'alignment-tuner-1' },
                        { type: 'quote', content: 'Mini-Challenge: reach a fairness index ≥ 0.9 by editing prompts or re-weighting training data.' },
                        { type: 'paragraph', content: 'Ethics protects people. Law protects organizations. The next subsection navigates the legal minefield of AI — copyright, IP ownership, licensing, and the emerging doctrine of machine authorship.' },
                    ],
                },
                {
                    id: '2-5',
                    title: '2.5 Legal & Intellectual Property Workshop',
                    content: [
                        { type: 'paragraph', content: 'Ethical compliance is internal governance. Legal compliance is external survival. This subsection covers the copyright, IP, and licensing challenges that every AI-powered organization faces — from training data provenance to the question of who owns AI-generated output.' },
                        { type: 'heading', content: 'Navigating the Legal Minefield: Copyright & IP' },
                        { type: 'paragraph', content: 'Modern AI work touches law as much as code. This workshop introduces copyright ownership, data licensing, and liability. Students study landmark cases like Getty Images v Stability AI and Thaler v Perlmutter, learning why AI-generated works currently lack authorship under U.S. law, and how this impacts commercial strategy.' },
                        { type: 'heading', content: 'Data Traceability & Indemnification' },
                        { type: 'paragraph', content: 'Participants conduct a “data traceability audit”: for each training asset, they confirm source license and fair-use rationale. We discuss **Indemnification Clauses** in enterprise AI contracts and the emerging concept of "Machine Unlearning" for complying with the Right to be Forgotten. They practice drafting an open-source disclosure file (SPDX format) and a commercial terms sheet.' },
                        { type: 'heading', content: 'Interactive App: “License Lens”' },
                        { type: 'paragraph', content: 'A clickable flowchart that guides learners through fair-use, open-source, and commercial pathways; each decision node shows risk heatmaps.' },
                        { type: 'interactive', content: [], component: 'LivePatentRadar', interactiveId: 'license-lens-1' },
                        { type: 'interactive', content: [], component: 'SmartContractEventListener', interactiveId: 'smart-contract-1' },
                        { type: 'quote', content: 'Gamified Element: earn "Compliance Counselor" when all dataset sources reach green (fully documented).' },
                        { type: 'paragraph', content: 'Individual legal compliance is one thing. Global regulatory frameworks are another. The next subsection teaches you to navigate the EU AI Act, NIST RMF, and OECD principles — classifying your systems by risk tier and mapping policy requirements to your governance artifacts.' },
                    ],
                },
                {
                    id: '2-6',
                    title: '2.6 AI Policy & Regulatory Frameworks',
                    content: [
                        { type: 'paragraph', content: 'Legal compliance is reactive — responding to existing law. Policy fluency is proactive — anticipating regulations before they arrive. This subsection gives you fluency across the world’s major AI governance frameworks so you can build compliance into your systems from day one.' },
                        { type: 'heading', content: 'Global Policy Fluency: EU AI Act & NIST' },
                        { type: 'paragraph', content: 'Policy fluency is the hallmark of mature operators. Learners compare major governance frameworks—the **EU AI Act**, OECD AI Principles, and U.S. NIST RMF. They learn to classify systems into risk tiers (Unacceptable, High, Limited, Minimal) and understand the compliance burdens for each.' },
                        { type: 'heading', content: 'Translating Policy to Code' },
                        { type: 'paragraph', content: 'Students then map each policy requirement to their Governance Pack—transparency sections, risk register items, and audit logs. They practice writing plain-language policy summaries for non-lawyers, a skill in high demand as AI compliance officer roles grow 40 % year over year. We also touch on upcoming standards for watermarking and provenance.' },
                        { type: 'heading', content: 'Interactive Map: “Global Policy Atlas”' },
                        { type: 'paragraph', content: 'Hover over any country to see live AI-policy summaries and risk-tier classifications.' },
                        { type: 'interactive', content: [], component: 'AiEthicsTracker', interactiveId: 'global-policy-atlas-1' },
                        { type: 'interactive', content: [], component: 'PrivacyLensDashboard', interactiveId: 'privacy-lens-1' },
                        { type: 'quote', content: 'Mini-App: “Governance Mapper” lets users drag-and-drop policy icons (Transparency, Accountability, Human Oversight) onto their own project schematic; missing mappings flash amber until resolved.' },
                        { type: 'paragraph', content: 'You understand the laws and frameworks. Now it is time to produce the artifacts. The next subsection guides you through assembling the complete Governance Pack — six core documents that demonstrate professional-grade AI governance.' },
                    ],
                },
                {
                    id: '2-7',
                    title: '2.7 Governance Pack Assembly',
                    content: [
                        { type: 'paragraph', content: 'Frameworks tell you what to document. This subsection produces the documents. You will assemble six core governance artifacts — from Acceptable Use Policies to Red-Team Logs — validated against ISO 42001 and scored for completeness.' },
                        { type: 'heading', content: 'The Governance Artifact: System Cards' },
                        { type: 'paragraph', content: 'Now students consolidate their six core governance documents: Acceptable Use Policy, Data Retention Plan, Model Choice Rationale, Risk Register, Human Oversight Plan, and Deployment Plan with Red-Team Log. They validate each against enterprise checklists derived from **ISO 42001 (AI Management Systems)**.' },
                        { type: 'heading', content: 'Sign-off Culture' },
                        { type: 'paragraph', content: 'We introduce the concept of **System Cards**, which go beyond model cards to describe the entire sociotechnical system, including intended use cases and known limitations. Instructors stress version control and sign-off culture: a policy unsigned is a policy unenforced. Learners use Google Docs or Notion for collaborative review and insert metadata for author and revision date.' },
                        { type: 'heading', content: 'Interactive Workspace: “Governance Forge”' },
                        { type: 'paragraph', content: 'A structured template editor where learners fill policy fields, sign electronically, and generate an auto-scored compliance meter (0–100 %).' },
                        { type: 'interactive', content: [], component: 'PitchBuilder', interactiveId: 'governance-forge-1' },
                        { type: 'interactive', content: [], component: 'BusinessModelCanvas', interactiveId: 'business-model-1' },
                        { type: 'quote', content: 'Mini-Game: time-boxed “Policy Sprint” challenge—complete all required fields within 30 minutes while maintaining ≥ 90 % clarity; real-time hints reference ISO 42001 clauses.' },
                        { type: 'paragraph', content: 'Governance documents look impressive on paper. But do they hold up under pressure? The next subsection is a full crisis simulation — a live drill that tests your ability to lead through a multi-vector incident while executing your governance protocols.' },
                    ],
                },
                {
                    id: '2-8',
                    title: '2.8 Crisis Simulation & Compliance Drill',
                    content: [
                        { type: 'paragraph', content: 'You have written the governance documents. Now you prove they work. This subsection is a 90-minute crisis simulation — a data leak, model collapse, and viral press rumor all happening at once. Your leadership, communication, and governance protocols are tested under fire.' },
                        { type: 'heading', content: 'Leadership Under Fire: Game Day' },
                        { type: 'paragraph', content: 'AI leadership is proven in crisis. Teams simulate a multi-vector event: a data leak, model malfunction ("Model Collapse"), and viral press rumor happening simultaneously. They have 90 minutes to contain the incident, communicate externally, and restore service. Role-play assigns incident commander, legal officer, and spokesperson.' },
                        { type: 'heading', content: 'Forensics & Communications' },
                        { type: 'paragraph', content: 'The exercise mirrors tech industry “game days.” Data from Google SRE handbooks shows that organizations running quarterly drills recover 30 % faster than those that don’t. Learners use prebuilt templates for "holding statements" and regulator notifications. They practice basic **AI Forensics**—tracing the specific prompt or data point that caused the failure.' },
                        { type: 'heading', content: 'Simulator: “Crisis Command Center”' },
                        { type: 'paragraph', content: 'A live role-play dashboard that throws multi-threaded alerts (data leak, downtime, media inquiry). Learners assign roles, draft statements, and deploy rollback actions while the system measures response time and sentiment.' },
                        { type: 'interactive', content: [], component: 'EthicalDilemmaSimulator', interactiveId: 'crisis-command-center-1' },
                        { type: 'quote', content: 'Fun Twist: unexpected "curve-ball" prompts (e.g., regulator call) keep adrenaline high; best teams earn the "Calm Under Fire" badge.' },
                        { type: 'paragraph', content: 'You have survived the crisis. Now zoom out. The final learning subsection looks at the macro picture: how AI will reshape industries, create new roles, and redefine the relationship between human work and machine capability.' },
                    ],
                },
                {
                    id: '2-9',
                    title: '2.9 Future-of-Work & Human Role Seminar',
                    content: [
                        { type: 'paragraph', content: 'Crises test your operational discipline. This subsection broadens your perspective to the strategic horizon: how AI will reshape industries, create new professional roles, and redefine the balance between human judgment and machine capability in the decades ahead.' },
                        { type: 'heading', content: 'The Centaur Model: Human + AI' },
                        { type: 'paragraph', content: 'Here the curriculum broadens to societal and personal impact. Learners analyze World Economic Forum data showing AI will augment 300 million jobs globally rather than replace them if reskilling outpaces automation. We discuss the **Centaur Model** of work: humans integrated with AI agents achieving performance superior to either alone.' },
                        { type: 'heading', content: 'The AI Constitution' },
                        { type: 'paragraph', content: 'Discussion explores emerging roles—AI Systems Architect, Prompt Auditor, Agent Ethicist. Participants design a one-page "AI Constitution" for their agent defining rights (e.g., data integrity), duties (user consent), and oversight mechanisms. They also reflect on personal digital well-being—managing attention and trust in a hyper-automated workplace.' },
                        { type: 'heading', content: 'Interactive App: “Job Shift Visualizer”' },
                        { type: 'paragraph', content: 'Users adjust automation level sliders across industries; the chart predicts job-creation vs. displacement using OECD 2025 data.' },
                        { type: 'interactive', content: [], component: 'JobImpactSimulator', interactiveId: 'job-shift-visualizer-1' },
                        { type: 'interactive', content: [], component: 'FutureScenarioPoll', interactiveId: 'future-poll-1' },
                        { type: 'interactive', content: [], component: 'InteractiveDebates', interactiveId: 'debates-1' },
                        { type: 'interactive', content: [], component: 'SdgMatcher', interactiveId: 'sdg-matcher-1' },
                        { type: 'quote', content: 'Creative Exercise: draft and publish your agent’s AI Constitution in a collaborative board—others can endorse clauses, showing democratic governance in action.' },
                        { type: 'heading', content: 'Interactive: “Orbital Habitat Designer” — Applied Systems Thinking in Space' },
                        { type: 'paragraph', content: 'Learners instruct Nano-Banana to produce a fully realized orbital colony or moon-base layout, complete with life-support systems, habitat modules, and energy distribution diagrams. The model responds with an image and an accompanying system summary, with options to revise the design based on new mission parameters.' },
                        { type: 'interactive', content: [], component: 'OrbitalHabitatDesigner', interactiveId: 'orbital-habitat-designer-1' },
                        { type: 'paragraph', content: 'You have covered every dimension: engineering, testing, security, governance, analytics, ethics, law, policy, crisis response, and future strategy. The final subsection is where it all converges — assembling your professional portfolio and earning your verifiable credential.' },
                    ],
                },
                {
                    id: '2-10',
                    title: '2.10 Capstone Integration & Credentialing',
                    content: [
                        { type: 'paragraph', content: 'This is the culmination. Every skill, artifact, dashboard, and governance document you have produced across Module 4 converges in a single professional portfolio. Present it, verify it on-chain, and earn your ZEN Card Credential — proof of operational mastery in the AI era.' },
                        { type: 'heading', content: 'The Professional Portfolio' },
                        { type: 'paragraph', content: 'The final lesson ties technology, policy, and presentation into one coherent professional identity. Students assemble their live agent, Runbook, Governance Pack, and dashboard into a single digital portfolio. They prepare a 10-minute executive presentation using the ZEN format—three KPIs, two trends, one anomaly—aimed at a board-level audience.' },
                        { type: 'heading', content: 'Verifiable Credentials' },
                        { type: 'paragraph', content: 'All artifacts are hashed and recorded on-chain to issue their **ZEN Card Credential**, a verifiable credential (W3C standard) verifying competence in AI operations and governance. Instructors share employment statistics: 91 % of AI literacy graduates from the 2024 pilot secured career advancement within six months. Tips: keep slides visual, Runbook actionable, and governance verifiable.' },
                        { type: 'heading', content: 'Interactive: AI Governance Card Generator' },
                        { type: 'paragraph', content: 'Creates animated governance NFT certificates that include org name, responsible-AI pledge, timestamp, and blockchain TX ID — rendered in metallic holographic style.' },
                        { type: 'interactive', content: [], component: 'AiGovernanceCardGenerator', interactiveId: 'governance-card-generator-1' },
                        { type: 'interactive', content: [], component: 'NeuralEvolutionChronicle', interactiveId: 'chronicle-1' },
                        { type: 'quote', content: 'Corporate Use Example: Enterprises export blockchain-verified Responsible-AI compliance badges to embed in ESG or investor reports.' },
                        { type: 'paragraph', content: 'With your credential earned, one final challenge remains: deploying the Web Insight Brief Builder. This building activity integrates web scraping, LLM analysis, and structured output generation into a single production application.' },
                    ],
                },
                {
                    id: '2-11',
                    title: '2.11 Building Activity',
                    content: [
                        { type: 'paragraph', content: 'This is the final build. Everything from Module 4 — systems architecture, prompt engineering, data pipelines, observability, security, governance, and analytics — converges in this deployment exercise. The Web Insight Brief Builder turns any URL into an actionable executive brief, demonstrating the full operational lifecycle.' },
                        { type: 'heading', content: 'ZEN Web Insight Brief Builder' },
                        { type: 'paragraph', content: 'In this final building activity, you will create a tool that turns any URL or text into a structured executive brief using LLMs and optional web scraping.' },
                        { type: 'heading', content: 'Application Code (app.py)' },
                        { type: 'paragraph', content: 'This application uses Gradio for the interface, connects to an OpenAI-compatible LLM API for analysis, and optionally uses Firecrawl for robust web scraping.' },
                        {
                            type: 'code', language: 'python', content: `import json
import textwrap
from typing import Dict, Any, List, Tuple, Optional

import gradio as gr
import requests
import matplotlib.pyplot as plt
from matplotlib.figure import Figure


# ============================================================
#  LLM CALLER (OPENAI-COMPATIBLE, GPT-4.1 BY DEFAULT)
# ============================================================

def call_chat_completion(
    api_key: str,
    base_url: str,
    model: str,
    system_prompt: str,
    user_prompt: str,
    max_completion_tokens: int = 1800,
) -> str:
    """
    OpenAI-compatible /v1/chat/completions helper.

    - Uses new-style \`max_completion_tokens\` (for GPT-4.1, GPT-4o, etc.)
    - Falls back to legacy \`max_tokens\` if needed.
    - Does NOT send temperature/top_p so it's safe with strict models.
    """
    if not api_key:
        raise ValueError("LLM API key is required.")

    if not base_url:
        base_url = "https://api.openai.com"

    url = base_url.rstrip("/") + "/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer \${api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "max_completion_tokens": max_completion_tokens,
    }

    resp = requests.post(url, headers=headers, json=payload, timeout=60)

    # Fallback for providers that still expect \`max_tokens\`
    if resp.status_code == 400 and "max_completion_tokens" in resp.text:
        payload.pop("max_completion_tokens", None)
        payload["max_tokens"] = max_completion_tokens
        resp = requests.post(url, headers=headers, json=payload, timeout=60)

    if resp.status_code != 200:
        raise RuntimeError(
            f"LLM API error \${resp.status_code}: \${resp.text[:500]}"
        )

    data = resp.json()
    try:
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        raise RuntimeError(
            f"Unexpected LLM response format: \${e}\\n\\n\${json.dumps(data, indent=2)}"
        )


# ============================================================
#  FIRECRAWL SCRAPER (OPTIONAL)
# ============================================================

def call_firecrawl_scrape(
    firecrawl_key: str,
    url: str,
    formats: Optional[List[str]] = None,
) -> str:
    """
    Calls Firecrawl's /v0/scrape endpoint to get cleaned markdown/HTML
    for a single URL.

    Docs: https://docs.firecrawl.dev/api-reference/endpoint/scrape
    """
    if not firecrawl_key:
        raise ValueError("Firecrawl API key is missing.")

    if not url:
        raise ValueError("URL is required to use Firecrawl.")

    api_url = "https://api.firecrawl.dev/v0/scrape"
    headers = {
        "Authorization": f"Bearer \${firecrawl_key}",
        "Content-Type": "application/json",
    }

    payload: Dict[str, Any] = {"url": url}
    if formats:
        payload["formats"] = formats

    resp = requests.post(api_url, headers=headers, json=payload, timeout=60)

    if resp.status_code != 200:
        raise RuntimeError(
            f"Firecrawl error \${resp.status_code}: \${resp.text[:400]}"
        )

    data = resp.json()
    # Default: try markdown first, fall back to raw HTML or text if structure differs
    # Common shape: { "data": { "markdown": "..." } }
    if isinstance(data, dict):
        # Nested under "data"
        inner = data.get("data", {})
        if isinstance(inner, dict):
            if "markdown" in inner and isinstance(inner["markdown"], str):
                return inner["markdown"]
            if "html" in inner and isinstance(inner["html"], str):
                return inner["html"]
        # If the service changes shape, last fallback: stringify
    return json.dumps(data)


# ============================================================
#  ANALYSIS PROMPT + PARSING
# ============================================================

ANALYSIS_SYSTEM_PROMPT = """
You are an expert strategy analyst.

Given some web content (or pasted text) plus a short user description,
you will produce a concise, executive-ready analysis in JSON.

Return ONLY JSON using this schema:

{
  "executive_summary": "string",
  "key_points": ["string", ...],
  "opportunities": ["string", ...],
  "risks": ["string", ...],
  "recommended_actions": [
    {
      "title": "string",
      "area": "string",
      "description": "string"
    }
  ]
}
"""

def build_analysis_user_prompt(
    url: str,
    content_preview: str,
    user_notes: str,
    focus: str,
) -> str:
    truncated = content_preview[:6000]  # keep context reasonable
    return f"""
Source URL: \${url or "N/A"}

Focus area: \${focus}

User notes / context:
\${user_notes or "N/A"}

Scraped or pasted content (truncated if long):
\"\"\"\${truncated}\"\"\"
""".strip()


def parse_analysis_json(raw_text: str) -> Dict[str, Any]:
    """Strip fences and extract JSON payload."""
    txt = raw_text.strip()

    if txt.startswith("\`\`\`"):
        parts = txt.split("\`\`\`")
        txt = next((p for p in parts if "{" in p and "}" in p), parts[-1])

    first = txt.find("{")
    last = txt.rfind("}")
    if first == -1 or last == -1:
        raise ValueError("No JSON detected in model output.")

    return json.loads(txt[first:last + 1])


def analysis_to_markdown(analysis: Dict[str, Any]) -> str:
    """Render the JSON analysis as a short executive brief in Markdown."""

    def bullet(items: List[str]) -> str:
        if not items:
            return "_None identified._"
        return "\\n".join(f"- \${i}" for i in items)

    md: List[str] = []

    md.append("## Executive Summary")
    md.append(analysis.get("executive_summary", "N/A"))

    md.append("\\n## Key Points")
    md.append(bullet(analysis.get("key_points", [])))

    md.append("\\n## Opportunities")
    md.append(bullet(analysis.get("opportunities", [])))

    md.append("\\n## Risks")
    md.append(bullet(analysis.get("risks", [])))

    md.append("\\n## Recommended Actions")
    actions = analysis.get("recommended_actions", [])
    if not actions:
        md.append("_None suggested yet — refine your prompt or focus._")
    else:
        for idx, act in enumerate(actions, start=1):
            title = act.get("title", f"Action \${idx}")
            area = act.get("area", "General")
            desc = act.get("description", "")
            md.append(f"### \${idx}. \${title}")
            md.append(f"**Area:** \${area}")
            md.append(desc or "_No description provided._")

    return "\\n\\n".join(md)


# ============================================================
#  SIMPLE DATA VISUAL — COUNTS BY CATEGORY
# ============================================================

def analysis_to_figure(analysis: Dict[str, Any]) -> Figure:
    """
    Basic bar chart: how many items per category (points, opportunities, risks, actions).
    Visualizes "density" of insights.
    """
    labels = ["Key Points", "Opportunities", "Risks", "Actions"]
    values = [
        len(analysis.get("key_points", []) or []),
        len(analysis.get("opportunities", []) or []),
        len(analysis.get("risks", []) or []),
        len(analysis.get("recommended_actions", []) or []),
    ]

    fig, ax = plt.subplots(figsize=(5, 3))
    ax.bar(labels, values)
    ax.set_ylabel("Count")
    ax.set_title("Insight Density by Category")
    fig.tight_layout()
    return fig


# ============================================================
#  SAMPLE PRESETS
# ============================================================

SAMPLE_CONFIGS: Dict[str, Dict[str, str]] = {
    "AI / Tech Policy Article": {
        "url": "https://www.whitehouse.gov/briefing-room/",
        "notes": "Focus on AI policy, workforce impact, and org-readiness.",
        "focus": "Policy / Regulation",
    },
    "Competitor Product Page": {
        "url": "https://example.com/",
        "notes": "Assume this is a competitor's SaaS pricing page.",
        "focus": "Product / Market",
    },
    "Industry Research Report": {
        "url": "https://example.org/report",
        "notes": "Treat as a long-form industry trend report.",
        "focus": "Industry / Strategy",
    },
}

def load_sample(name: str) -> Tuple[str, str, str]:
    if not name or name not in SAMPLE_CONFIGS:
        return "", "", "General insight synthesis"
    cfg = SAMPLE_CONFIGS[name]
    return cfg["url"], cfg["notes"], cfg["focus"]


# ============================================================
#  MAIN HANDLER FOR GRADIO
# ============================================================

def generate_brief_ui(
    llm_key_state: str,
    llm_key_input: str,
    base_url: str,
    model_name: str,
    firecrawl_key: str,
    url: str,
    pasted_text: str,
    user_notes: str,
    focus: str,
):
    """
    Master UI handler:
    - decides whether to call Firecrawl (if key + URL)
    - merges scraped content with pasted text
    - calls LLM and renders outputs
    """
    llm_key = llm_key_input or llm_key_state
    if not llm_key:
        return (
            "⚠️ Please enter your LLM API key in the left panel.",
            "",
            analysis_to_figure({"key_points": [], "opportunities": [], "risks": [], "recommended_actions": []}),
            llm_key_state,
        )

    if not url and not pasted_text:
        return (
            "⚠️ Provide at least a URL or some pasted text.",
            "",
            analysis_to_figure({"key_points": [], "opportunities": [], "risks": [], "recommended_actions": []}),
            llm_key_state,
        )

    # 1. Scrape via Firecrawl if URL + key are set
    scraped_content = ""
    if url and firecrawl_key:
        try:
            scraped_content = call_firecrawl_scrape(firecrawl_key, url, formats=["markdown"])
        except Exception as e:
            scraped_content = f"(Firecrawl error: \${e})"

    # 2. Compose content preview (scraped + pasted)
    content_preview_parts = []
    if scraped_content:
        content_preview_parts.append(scraped_content)
    if pasted_text:
        content_preview_parts.append("\\n\\nUser-pasted text:\\n" + pasted_text)

    content_preview = "\\n\\n".join(content_preview_parts)

    # 3. Build prompt and call LLM
    user_prompt = build_analysis_user_prompt(url, content_preview, user_notes, focus)
    model = model_name or "gpt-4.1"

    try:
        raw = call_chat_completion(
            api_key=llm_key,
            base_url=base_url,
            model=model,
            system_prompt=ANALYSIS_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            max_completion_tokens=1800,
        )

        analysis = parse_analysis_json(raw)
        md = analysis_to_markdown(analysis)
        fig = analysis_to_figure(analysis)
        json_out = json.dumps(analysis, indent=2, ensure_ascii=False)

        return md, json_out, fig, llm_key

    except Exception as e:
        empty_fig = analysis_to_figure({"key_points": [], "opportunities": [], "risks": [], "recommended_actions": []})
        return f"❌ Error generating brief:\\n\\n\${e}", "", empty_fig, llm_key_state


# ============================================================
#  GRADIO UI
# ============================================================

with gr.Blocks(title="ZEN Web Insight Brief Builder") as demo:
    gr.Markdown(
        """
# 🌐 ZEN Web Insight Brief Builder

Turn any URL (plus optional Firecrawl scrape) into a structured,
actionable executive brief:

1. **Configure API keys** (LLM + optional Firecrawl)  
2. **Paste a URL and/or text**  
3. **Get an executive summary, risks, opportunities, and actions**
"""
    )

    llm_key_state = gr.State("")

    with gr.Row():
        # LEFT: API + samples
        with gr.Column(scale=1):
            gr.Markdown("### 1 — API & Model Settings")

            llm_key_input = gr.Textbox(
                label="LLM API Key",
                placeholder="OpenAI or compatible key",
                type="password",
            )

            base_url = gr.Textbox(
                label="LLM Base URL",
                value="https://api.openai.com",
                placeholder="e.g. https://api.openai.com",
            )

            model_name = gr.Textbox(
                label="Model Name",
                value="gpt-4.1",
                placeholder="e.g. gpt-4.1, gpt-4o, etc.",
            )

            gr.Markdown("#### Optional — Firecrawl (URL Scraper)")
            firecrawl_key = gr.Textbox(
                label="Firecrawl API Key (optional)",
                placeholder="Only needed if you want automatic URL scraping",
                type="password",
            )

            gr.Markdown("#### Sample Config")
            sample_dropdown = gr.Dropdown(
                label="Load a sample scenario",
                choices=list(SAMPLE_CONFIGS.keys()),
                value=None,
            )
            load_sample_btn = gr.Button("Load Sample")

        # RIGHT: content + config
        with gr.Column(scale=2):
            gr.Markdown("### 2 — Content & Focus")

            url_input = gr.Textbox(
                label="Source URL",
                placeholder="Paste a URL to analyze (works best with Firecrawl key, but optional)",
            )

            pasted_text = gr.Textbox(
                label="Or paste content manually",
                placeholder="Paste article text, notes, or report sections here.",
                lines=8,
            )

            user_notes = gr.Textbox(
                label="Your context / what you care about",
                placeholder="Example: Focus on youth workforce impacts and funding opportunities.",
                lines=3,
            )

            focus = gr.Dropdown(
                label="Focus lens",
                choices=[
                    "Policy / Regulation",
                    "Product / Market",
                    "Industry / Strategy",
                    "Risk & Compliance",
                    "Custom / Other",
                ],
                value="Industry / Strategy",
            )

            generate_btn = gr.Button("🚀 Generate Insight Brief", variant="primary")

    gr.Markdown("### 3 — Executive Brief")

    with gr.Row():
        with gr.Column(scale=3):
            brief_md = gr.Markdown(
                label="Brief",
                value="Your executive brief will appear here after generation.",
            )
        with gr.Column(scale=2):
            brief_json = gr.Code(
                label="Raw JSON (for automation / export)",
                language="json",
            )

    gr.Markdown("### 4 — Insight Density Visual")
    brief_fig = gr.Plot(label="Insight Density by Category")

    # Wiring
    load_sample_btn.click(
        load_sample,
        inputs=[sample_dropdown],
        outputs=[url_input, user_notes, focus],
    )

    generate_btn.click(
        generate_brief_ui,
        inputs=[
            llm_key_state,
            llm_key_input,
            base_url,
            model_name,
            firecrawl_key,
            url_input,
            pasted_text,
            user_notes,
            focus,
        ],
        outputs=[brief_md, brief_json, brief_fig, llm_key_state],
    )

if __name__ == "__main__":
    demo.launch()` },
                        { type: 'heading', content: 'Dependencies (requirements.txt)' },
                        { type: 'paragraph', content: 'Required Python libraries.' },
                        {
                            type: 'code', language: 'text', content: `gradio>=5.0.0,<6.0.0
requests>=2.31.0
matplotlib>=3.8.0` },
                        { type: 'heading', content: 'Configuration (README.md)' },
                        { type: 'paragraph', content: 'Metadata for the Hugging Face Space.' },
                        {
                            type: 'code', language: 'markdown', content: `---
title: ZEN Web Insight Brief Builder
emoji: 📊
colorFrom: indigo
colorTo: purple
sdk: gradio
sdk_version: 5.49.1
app_file: app.py
pinned: false
short_description: Turn any URL into an actionable executive brief
---

Configuration docs: https://huggingface.co/docs/hub/spaces-config-reference` },
                        { type: 'interactive', content: [], component: 'ProjectSubmission', interactiveId: 'insight-brief-builder-submission' }
                    ]
                }
            ],
        },
    ],
};
