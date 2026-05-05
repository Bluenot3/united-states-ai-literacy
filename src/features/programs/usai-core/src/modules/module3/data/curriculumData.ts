
import type { Curriculum } from '../types';

export const curriculumData: Curriculum = {
    title: 'Module 3: Personal Intelligence & Cognitive Systems',
    summaryForAI:
        'Module 3 of ZEN AI VANGUARD, "Personal Intelligence & Cognitive Systems," teaches learners to build a "Second Brain" for information management and a "Second Mind" for decision-making. Part 1 covers the Architecture of a Second Brain: cognitive overload solutions, digital hygiene protocols, RAG-based retrieval, hallucination detection, knowledge graphs, research workflows, email automation, and security. Part 2 covers Cognitive Leverage & Decision Systems: decision fatigue management, weighted decision matrices, scenario simulation, workflow automation, bias detection, executive communication (BLUF), ethics of automated choice, and advanced prompt engineering. The module culminates in two Hugging Face Space deployments: the Omni Studio (personal RAG engine) and the Decision Nexus (AI strategic engine).',
    sections: [
        {
            id: 'overview',
            title: 'Module 3 Overview',
            content: [
                {
                    type: 'interactive',
                    content: '',
                    component: 'HeroIntroMod3',
                    interactiveId: 'hero-intro-mod3'
                },
                {
                    type: 'heading',
                    content: 'Theme: Personal Intelligence & Cognitive Systems',
                },
                {
                    type: 'paragraph',
                    content:
                        'Module 3 covers personal intelligence infrastructure: how to build systems that capture, organize, and retrieve information on demand, and how to use AI to make better decisions under uncertainty. By the end, you will deploy a personal RAG engine, a decision-support system, and a stronger repeatable workflow for research, planning, and execution.',
                },
                {
                    type: 'quote',
                    content: 'Information dominance is not about consuming more—it is about strategically capturing, indexing, and retrieving the right knowledge at the right time.'
                },
                {
                    type: 'paragraph',
                    content: 'By the end of this module, you will deploy two powerful AI applications to Hugging Face Spaces: the Omni Studio (your personal RAG engine) and the Decision Nexus (your AI strategic calculator).'
                },
                {
                    type: 'interactive',
                    content: '',
                    component: 'FactOfTheDay',
                    interactiveId: 'fact-of-the-day'
                },
                {
                    type: 'interactive',
                    content: '',
                    component: 'AIPuzzle',
                    interactiveId: 'ai-puzzle-challenge'
                }
            ],
        },
        {
            id: 'part-1',
            title: 'PART 1: The Architecture of a Second Brain',
            content: [
                {
                    type: 'heading',
                    content: 'Theme: Information Dominance'
                },
                {
                    type: 'paragraph',
                    content: 'Part 1 addresses a universal professional challenge: information overload. The average knowledge worker manages hundreds of daily inputs across email, documents, messages, and meetings. Without a system, critical information is lost and high-level strategic thinking becomes impossible. This section teaches you to build a personal information architecture — a digital system that captures, organizes, and retrieves knowledge instantly, freeing cognitive resources for analysis and decision-making.'
                }
            ],
            subSections: [
                {
                    id: '3-1',
                    title: '3.1 The Era of Cognitive Overload',
                    content: [
                        { type: 'paragraph', content: 'Before you can build a system to manage information, you need to understand why your current approach is failing. This section makes the invisible cost of cognitive overload visible — and introduces the foundational principle that separates professionals who drown in information from those who dominate with it.' },
                        { type: 'heading', content: 'The Biological Bottleneck' },
                        { type: 'paragraph', content: 'The modern professional consumes roughly 34 gigabytes of information daily. Your biological brain, evolved for the savanna, cannot process this throughput.' },
                        {
                            type: 'list', content: [
                                '**The Problem:** "Open Loops." Every unrecorded task, forgotten meeting, or lost file drains cognitive resources even when you aren\'t actively thinking about it. Research shows this consumes up to 40% of productive capacity.',
                                '**The Solution:** Index, don\'t memorize. Treat your brain as a processor, not a hard drive.',
                                '**The Principle:** Stop using working memory for storage. Use it exclusively for processing, analysis, and judgment.',
                                '**The Protocol:** If a thought enters your mind, it must immediately leave it and enter your trusted capture system. This is the foundation of every productivity system from GTD to Zettelkasten.'
                            ]
                        },
                        { type: 'heading', content: 'Interactive: Memory Decay Lab' },
                        { type: 'paragraph', content: 'Visualize how your brain forgets information over time without a capture system. See the Ebbinghaus forgetting curve in action.' },
                        { type: 'interactive', content: '', component: 'MemoryDecayLab', interactiveId: 'memory-decay-lab-1' },
                        { type: 'interactive', content: '', component: 'SectionQuiz', interactiveId: 'quiz-3-1' },
                        { type: 'paragraph', content: 'You now understand the cost of cognitive overload. But capturing information is only useful if the data going into your system is clean and structured. The next section teaches you the metadata engineering protocols that make everything downstream — search, synthesis, and retrieval — actually work.' },
                    ],
                },
                {
                    id: '3-2',
                    title: '3.2 Digital Hygiene & The "Clean Input" Protocol',
                    content: [
                        { type: 'paragraph', content: 'Cognitive overload is the disease; digital hygiene is the first treatment. Before you feed information to AI, you must ensure that information is structured enough for the AI to use. This section introduces the Vanguard metadata protocols that transform chaotic files into a queryable knowledge base.' },
                        { type: 'heading', content: 'Metadata Engineering' },
                        { type: 'paragraph', content: 'AI is only as smart as the data you feed it. If your digital life is a swamp of Untitled_Doc_Final_v2.pdf, even GPT-5 will hallucinate. To build a Personal Intelligence Engine, you must master Metadata Engineering.' },
                        {
                            type: 'list', content: [
                                '**The Universal Header:** The Vanguard protocol of adding a 3-line "Context Block" to the top of every document. Example: [PROJECT: Apollo] | [TYPE: Meeting Notes] | [DATE: 2025-10-12]',
                                '**Filename Sovereignty:** Never use spaces. Use ISO dates. (2025-10-12_Project-Zeus_Contract.pdf)',
                                '**Why:** This allows future AI agents to instantly categorize the file without reading the whole text.'
                            ]
                        },
                        { type: 'heading', content: 'Lab: The Digital Janitor' },
                        { type: 'paragraph', content: 'You are given a "Toxic Drive" simulation. You must rename and tag files to restore the AI\'s ability to search them using Vanguard protocols.' },
                        { type: 'interactive', content: '', component: 'DigitalJanitorLab', interactiveId: 'digital-janitor-lab-1' },
                        { type: 'interactive', content: '', component: 'SectionQuiz', interactiveId: 'quiz-3-2' },
                        { type: 'paragraph', content: 'Your files are now clean and structured. The next leap is from searching for files to querying for answers. The next section introduces RAG as a lifestyle — the ability to ask natural-language questions and get instant, sourced answers from your personal knowledge base.' },
                    ],
                },
                {
                    id: '3-3',
                    title: '3.3 The Art of Retrieval (RAG as a Lifestyle)',
                    content: [
                        { type: 'paragraph', content: 'Clean data is the foundation. Now you build the retrieval layer on top of it. This section transforms you from someone who searches for files into someone who queries for answers — a shift that will save you weeks of productive time per year.' },
                        { type: 'heading', content: 'From Searching to Querying' },
                        { type: 'paragraph', content: 'Retrieval Augmented Generation (RAG) is not just code; it is a new way of interacting with reality. You will learn to stop "searching" (looking for a file) and start "querying" (asking for an answer).' },
                        {
                            type: 'list', content: [
                                '**Keyword vs. Semantic Search:** Keywords find "Invoice." Semantic Search finds "How much did we overspend in Q3?"',
                                '**The "Synthesize" Command:** The ability to command your AI to "Read these 5 disparate emails and output a single \'State of the Union\' summary."',
                                '**The Time Dividend:** By retrieving answers in seconds rather than minutes, you reclaim approximately 15 days of life per year.'
                            ]
                        },
                        { type: 'heading', content: 'Interactive: RAG Builder' },
                        { type: 'paragraph', content: 'Build your own retrieval system by uploading documents and querying them with natural language.' },
                        { type: 'interactive', content: '', component: 'RagBuilder', interactiveId: 'rag-builder-1' },
                        { type: 'paragraph', content: 'RAG gives you speed. But speed without accuracy is dangerous. The next section addresses the critical vulnerability of AI-powered retrieval: hallucination. You will learn the verification protocols used by intelligence analysts to separate AI fact from AI fiction.' },
                    ],
                },
                {
                    id: '3-4',
                    title: '3.4 Hallucinations vs. Reality (The Trust Architecture)',
                    content: [
                        { type: 'paragraph', content: 'Your retrieval system can find answers in seconds. But can you trust those answers? AI hallucination is not an edge case — it is a chronic condition. This section teaches the rigorous verification workflow that ensures your Second Brain gives you facts, not fiction.' },
                        { type: 'heading', content: 'Trust but Verify' },
                        { type: 'paragraph', content: 'In a professional setting, an AI hallucination is not a "glitch"—it is a liability. You will learn the rigorous "Trust but Verify" workflow used by intelligence analysts.' },
                        {
                            type: 'list', content: [
                                '**Source Triangulation:** Never accept an AI fact without demanding a citation. If there is no link, there is no truth.',
                                '**The "I Don\'t Know" Protocol:** Configuring your personal AI (via System Prompts) to admit ignorance rather than invent fiction.'
                            ]
                        },
                        { type: 'heading', content: 'Simulator: The Fact-Checker' },
                        { type: 'paragraph', content: 'You act as the editor. The AI generates a convincing report on "Market Trends." You must use the source docs to spot the subtle lies hidden in the text.' },
                        { type: 'interactive', content: '', component: 'FactCheckerSimulator', interactiveId: 'fact-checker-1' },
                        { type: 'paragraph', content: 'You can now retrieve and verify. But isolated facts are not intelligence — connections between facts are. The next section teaches you to build a personal knowledge graph that links people, projects, and insights into a network of meaning.' },
                    ],
                },
                {
                    id: '3-5',
                    title: '3.5 Personal Knowledge Graphs (Connecting the Dots)',
                    content: [
                        { type: 'paragraph', content: 'Retrieval finds individual facts. Knowledge graphs reveal how those facts connect. This section introduces graph thinking — the practice of linking people, projects, and ideas into a relational network that surfaces insights no flat search could ever find.' },
                        { type: 'heading', content: 'Graph Thinking' },
                        { type: 'paragraph', content: 'Information is useless in isolation. True intelligence comes from connections. A "Knowledge Graph" is a system where data points are linked by relationships.' },
                        {
                            type: 'list', content: [
                                '**Graph Thinking:** Linking Person: Alice → Meeting: Q3 Review → Project: Zeus → Outcome: Failed.',
                                '**The CRM of Ideas:** Building a system where meeting someone new automatically surfaces every relevant article, note, and project you\'ve ever stored about their industry.',
                                '**Future-Proofing:** Structuring your notes in Markdown, the only format that will be readable by the AI agents of 2030, 2040, and 2050.'
                            ]
                        },
                        { type: 'heading', content: 'App: Knowledge Graph Builder' },
                        { type: 'paragraph', content: 'Build and visualize your personal knowledge graph. Add nodes (people, projects, ideas) and connect them with meaningful relationships.' },
                        { type: 'interactive', content: '', component: 'KnowledgeGraphBuilder', interactiveId: 'knowledge-graph-1' },
                        { type: 'paragraph', content: 'Your knowledge graph connects what you already know. But new information arrives constantly. The next section teaches you a systematic workflow for ingesting fresh intelligence from the web and distilling it into your Second Brain in minutes.' },
                    ],
                },
                {
                    id: '3-6',
                    title: '3.6 The "Research Assistant" Workflow (Web to Wisdom)',
                    content: [
                        { type: 'paragraph', content: 'A knowledge graph is only as good as the inputs feeding it. This section closes the loop by teaching you how to efficiently pull intelligence from the web and refine it into actionable knowledge — without drowning in browser tabs.' },
                        { type: 'heading', content: 'The Hunter-Gatherer Protocol' },
                        { type: 'paragraph', content: 'Stop opening 50 browser tabs. You will master the "Hunter-Gatherer" workflow using your Omni Studio.' },
                        {
                            type: 'list', content: [
                                '**Hunt:** Identify high-value URLs (The Sources).',
                                '**Gather (Scrape):** Use Firecrawl (via Omni Studio) to ingest the raw text into your Second Brain.',
                                '**Distill:** Have the AI strip away the ads, banners, and fluff, presenting you with only the "Signal."'
                            ]
                        },
                        { type: 'heading', content: 'Lab: The 5-Minute Expert' },
                        { type: 'paragraph', content: 'Practice the Hunt → Gather → Distill workflow. Use your AI to ingest a complex source and extract only the essential insights.' },
                        { type: 'interactive', content: '', component: 'ResearchAssistantWorkflow', interactiveId: 'research-assistant-1' },
                        { type: 'paragraph', content: 'You can now capture, retrieve, verify, connect, and research. The next section addresses the highest-volume communication channel in professional life: email. You will learn to scale your voice without losing its authenticity.' },
                    ],
                },
                {
                    id: '3-7',
                    title: '3.7 Email & Communication Automation (Your Voice, Scaled)',
                    content: [
                        { type: 'paragraph', content: 'Research gives you raw intelligence. Communication turns that intelligence into action. This section teaches you to automate the most time-consuming communication task in professional life — email — while preserving your authentic voice.' },
                        { type: 'heading', content: 'Style Transfer' },
                        { type: 'paragraph', content: 'Most AI-written emails sound robotic ("I hope this email finds you well"). You will train your system to write in your voice.' },
                        {
                            type: 'list', content: [
                                '**Style Transfer:** Feeding the AI your last 50 sent emails to analyze your tone, cadence, and sign-offs.',
                                '**The "Contextual Reply":** Drafting responses that reference attached PDFs without you needing to read them fully.',
                                '**The Out-of-Office Agent:** A conceptual design for an agent that drafts replies while you sleep, creating a "Draft Folder" ready for your approval at 8:00 AM.'
                            ]
                        },
                        { type: 'heading', content: 'App: Professional Email Writer' },
                        { type: 'paragraph', content: 'Generate professional emails that match your voice and style. Train the system on your preferences.' },
                        { type: 'interactive', content: '', component: 'ProfessionalEmailWriter', interactiveId: 'email-writer-1' },
                        { type: 'paragraph', content: 'Your Second Brain is now a powerful information engine. But power creates risk. Before you deploy it, you need to understand exactly what data should never touch a cloud model. The next section covers the red lines of personal AI security.' },
                    ],
                },
                {
                    id: '3-8',
                    title: '3.8 Security & Privacy in Personal AI',
                    content: [
                        { type: 'paragraph', content: 'You have built a system that captures, retrieves, and communicates. Now you must secure it. Every piece of data you feed to AI creates a privacy surface. This section defines the boundaries — what stays local, what goes to the cloud, and what never touches an AI model at all.' },
                        { type: 'heading', content: 'The Red Lines of Personal Data' },
                        { type: 'paragraph', content: 'When you feed your life into an AI, you create a massive privacy risk. We cover the "Red Lines" of personal data.' },
                        {
                            type: 'list', content: [
                                '**The PII Protocol:** What never goes into a cloud model (Social Security Numbers, Passwords, Health Data, Biometrics).',
                                '**Local vs. Cloud:** Understanding when to use a Local LLM (Ollama/Llama 3) for privacy vs. a Cloud Frontier Model (GPT-5) for intelligence.',
                                '**Data Sovereignty:** Owning your notes. If your "Second Brain" is locked inside a proprietary app, you do not own it. You are renting it.'
                            ]
                        },
                        { type: 'heading', content: 'Dashboard: Privacy Lens' },
                        { type: 'paragraph', content: 'Visualize the privacy implications of your data sharing decisions. See what should stay local vs. what can safely go to the cloud.' },
                        { type: 'interactive', content: '', component: 'PrivacyLensDashboard', interactiveId: 'privacy-dashboard-1' },
                        { type: 'paragraph', content: 'You now have the complete toolkit: capture, hygiene, retrieval, verification, graph thinking, research, communication, and security. The next section is your first pressure test — a real-world crisis scenario that forces you to use every tool under time constraint.' },
                    ],
                },
                {
                    id: '3-9',
                    title: '3.9 Capstone 1 Scenario: The "Crisis at 8 AM"',
                    content: [
                        { type: 'paragraph', content: 'You have built the tools. Now you prove they work under pressure. This capstone scenario drops you into a Monday-morning crisis and gives you 15 minutes to turn chaos into a professional client update.' },
                        { type: 'heading', content: 'Survival Mode Activated' },
                        { type: 'paragraph', content: 'It is Monday morning. You have missed 3 meetings, have 200 unread emails, and a client is demanding a status update by 9:00 AM.' },
                        {
                            type: 'list', content: [
                                '**The Mission:** Use your Omni Studio tools to survive.',
                                '**Step 1:** Ingest the meeting transcripts (Web/Files).',
                                '**Step 2:** Synthesize the "Action Items" and "Blockers."',
                                '**Step 3:** Draft the client update citing the transcripts.',
                                '**Outcome:** Turning 2 hours of panic into 15 minutes of execution.'
                            ]
                        },
                        { type: 'heading', content: 'Tool: Meeting Summarizer' },
                        { type: 'paragraph', content: 'Practice synthesizing meeting transcripts into actionable summaries with key decisions and action items.' },
                        { type: 'interactive', content: '', component: 'MeetingSummarizer', interactiveId: 'meeting-summarizer-1' },
                        { type: 'paragraph', content: 'You survived the crisis. Now it is time to make your Second Brain permanent. The next section prepares you for deployment — taking everything you have built and putting it online, accessible from any device, 24/7.' },
                    ],
                },
                {
                    id: '3-10',
                    title: '3.10 Preparing for Deployment (The Food Truck Analogy 2.0)',
                    content: [
                        { type: 'paragraph', content: 'Your Second Brain works locally. Now let us make it work everywhere. This section revisits the deployment pipeline, preparing you to build and ship the Omni Studio — your personal RAG engine running 24/7 on Hugging Face.' },
                        { type: 'heading', content: 'The Deployment Pipeline' },
                        { type: 'paragraph', content: 'We revisit the Deployment Pipeline. You are about to build the Omni Studio.' },
                        {
                            type: 'list', content: [
                                '**The Menu (app.py):** The logic that connects OpenAI to your files and the web.',
                                '**The Ingredients (requirements.txt):** The libraries (Firecrawl, Gradio) that make it possible.',
                                '**The Truck (Hugging Face):** The server that keeps your Second Brain online 24/7, accessible from your phone or laptop.'
                            ]
                        },
                        { type: 'heading', content: 'Quiz: Deployment Commands' },
                        { type: 'paragraph', content: 'Test your knowledge of essential deployment commands and concepts.' },
                        { type: 'interactive', content: '', component: 'DockerCommandQuiz', interactiveId: 'deployment-quiz-1' },
                        { type: 'paragraph', content: 'You understand the deployment architecture. The next section gives you the actual code — paste it, configure your keys, and your personal intelligence engine goes live.' },
                    ],
                },
                {
                    id: '3-11',
                    title: '3.11 Build The Omni Studio (Implementation)',
                    content: [
                        { type: 'paragraph', content: 'This is the build. Everything from sections 3.1 through 3.10 culminates here. Follow the steps below to deploy your Omni Studio — the first of two applications you will deliver in this module.' },
                        { type: 'heading', content: 'Your Personal RAG Engine' },
                        { type: 'paragraph', content: 'This is your Personal RAG Engine. It connects a "Brain" (OpenAI) to "Eyes" (Firecrawl) and "Memory" (Your Files). You will use this daily to chat with your own documents and the web.' },
                        { type: 'heading', content: 'Space Architecture Guide' },
                        {
                            type: 'list', content: [
                                'Create a new Space on Hugging Face.',
                                'Paste requirements.txt.',
                                'Paste app.py.',
                                'Add your API Keys in Settings (OPENAI_API_KEY, FIRECRAWL_API_KEY).'
                            ]
                        },
                        { type: 'heading', content: 'requirements.txt' },
                        {
                            type: 'code', language: 'plaintext', content: `gradio==5.49.1
openai>=1.50.0
requests>=2.31.0
tiktoken>=0.7.0
firecrawl-py>=4.6.0` },
                        { type: 'heading', content: 'app.py' },
                        {
                            type: 'code', language: 'python', content: `import os
from typing import List, Dict, Any, Tuple, Optional
import requests
import gradio as gr
from openai import OpenAI

# Firecrawl SDK (used for scraping URLs into markdown)
try:
    from firecrawl import Firecrawl
except ImportError:
    Firecrawl = None  # handled gracefully below

# -------------------- CONFIG --------------------
CHAT_MODEL = "gpt-4o"  # main chat model

DEFAULT_SYSTEM_PROMPT = """You are a Retrieval-Augmented Generation (RAG) assistant.
Rules:
- Answer ONLY using the provided knowledge base context and system instructions.
- If the answer is not clearly supported by the context, say "I don't know based on the current knowledge base."
- Do not invent sources, statistics, or facts that are not present in the context.
- When applicable, cite which source you used (e.g., "According to the uploaded file" or "Based on zenai.world").
- Be clear, concise, and structured.
"""

PRESET_CONFIGS = {
    "None (manual setup)": {
        "system": DEFAULT_SYSTEM_PROMPT,
        "urls": "",
        "text": "",
    },
    "ZEN Sites Deep QA": {
        "system": DEFAULT_SYSTEM_PROMPT
        + "\\n\\nYou specialize in answering questions about ZEN AI's mission, programs, and AI Pioneer.",
        "urls": "https://zenai.world\\nhttps://us.zenai.biz",
        "text": "ZEN AI is building the first global AI × Web3 literacy and automation movement.",
    },
    "Research Notebook": {
        "system": DEFAULT_SYSTEM_PROMPT
        + "\\n\\nYou help the user explore, connect, and synthesize insights from their personal notes and documents.",
        "urls": "",
        "text": "Use this as a sandbox for notebooks, transcripts, and long-form notes.",
    },
}

# -------------------- TEXT HELPERS --------------------
def chunk_text(text: str, max_chars: int = 2000, overlap: int = 200) -> List[str]:
    text = (text or "").strip()
    if not text: return []
    chunks = []
    start = 0
    length = len(text)
    while start < length:
        end = min(start + max_chars, length)
        chunk = text[start:end]
        chunks.append(chunk)
        if end >= length: break
        start = max(0, end - overlap)
    return chunks

def tokenize(text: str) -> List[str]:
    cleaned = []
    for ch in text.lower():
        if ch.isalnum(): cleaned.append(ch)
        else: cleaned.append(" ")
    return [tok for tok in "".join(cleaned).split() if tok]

# -------------------- DATA SOURCE HELPERS --------------------
def fetch_url_text(url: str) -> str:
    try:
        resp = requests.get(url, timeout=12)
        resp.raise_for_status()
        text = resp.text
        for tag in ["<script", "<style"]:
            if tag in text: text = text.split(tag)[0]
        text = text.replace("<", " ").replace(">", " ")
        return text
    except Exception as e: return f"[Error fetching {url}: {e}]"

def read_file_text(path: str) -> str:
    if not path: return ""
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f: return f.read()
    except Exception as e: return f"[Error reading file: {e}]"

# -------------------- FIRECRAWL HELPERS --------------------
def firecrawl_scrape_url(firecrawl_api_key: str, url: str) -> str:
    firecrawl_api_key = (firecrawl_api_key or "").strip()
    if not firecrawl_api_key: return "[Firecrawl error: no API key.]"
    if Firecrawl is None: return "[Firecrawl error: SDK not installed.]"
    try:
        fc = Firecrawl(api_key=firecrawl_api_key)
        doc = fc.scrape_url(url, params={"formats": ["markdown"]})
        return doc.get("markdown", "")
    except Exception as e: return f"[Firecrawl error for {url}: {e}]"

# -------------------- LOCAL KB BUILD --------------------
def build_local_kb(api_key, fc_key, urls_text, raw_text, file_paths):
    docs = []
    urls = [u.strip() for u in (urls_text or "").splitlines() if u.strip()]
    for u in urls:
        if fc_key: txt = firecrawl_scrape_url(fc_key, u)
        else: txt = fetch_url_text(u)
        docs.append({"source": u, "text": txt})
    
    if raw_text: docs.append({"source": "Raw Text", "text": raw_text})
    if file_paths:
        for p in file_paths:
            docs.append({"source": os.path.basename(p), "text": read_file_text(p)})
            
    if not docs: return "⚠️ No sources.", []
    
    kb_chunks = []
    for d in docs:
        chunks = chunk_text(d["text"])
        for idx, ch in enumerate(chunks):
            kb_chunks.append({"source": d["source"], "text": ch, "tokens": tokenize(ch)})
            
    return f"✅ Built with {len(docs)} sources.", kb_chunks

def retrieve_context(kb, query):
    if not kb: return ""
    q_tokens = set(tokenize(query))
    scored = []
    for d in kb:
        overlap = len(q_tokens & set(d["tokens"]))
        if overlap > 0: scored.append((overlap, d))
    scored.sort(key=lambda x: x[0], reverse=True)
    
    context = ""
    for score, d in scored[:5]:
        context += f"[Source: {d['source']}]\\n{d['text']}\\n\\n"
    return context

# -------------------- CHAT LOGIC --------------------
def chat(user_msg, api_key, kb, sys_prompt, history):
    if not user_msg: return history, history
    if not api_key: return history + [["", "❌ Please save API Key."]], history
    
    context = retrieve_context(kb, user_msg)
    client = OpenAI(api_key=api_key)
    
    messages = [{"role": "system", "content": sys_prompt + f"\\n\\nCONTEXT:\\n{context}"}]
    for u, a in history[-3:]:
        messages.append({"role": "user", "content": u})
        messages.append({"role": "assistant", "content": a})
    messages.append({"role": "user", "content": user_msg})
    
    try:
        resp = client.chat.completions.create(model=CHAT_MODEL, messages=messages)
        answer = resp.choices[0].message.content
    except Exception as e: answer = f"Error: {e}"
    
    new_history = history + [[user_msg, answer]]
    return new_history, new_history

# -------------------- UI --------------------
with gr.Blocks(title="Omni Studio") as demo:
    gr.Markdown("# 🧠 Omni Studio: Personal RAG Engine")
    
    api_key = gr.State("")
    fc_key = gr.State("")
    kb = gr.State([])
    history = gr.State([])
    
    with gr.Row():
        with gr.Column():
            k1 = gr.Textbox(label="OpenAI API Key", type="password")
            k2 = gr.Textbox(label="Firecrawl Key (Optional)", type="password")
            b1 = gr.Button("Save Keys")
            
            preset = gr.Dropdown(list(PRESET_CONFIGS.keys()), label="Preset", value="None (manual setup)")
            sys = gr.Textbox(label="System Prompt", lines=5, value=DEFAULT_SYSTEM_PROMPT)
            urls = gr.Textbox(label="URLs", lines=3)
            files = gr.File(label="Upload Docs", file_count="multiple")
            b2 = gr.Button("Build Knowledge Base", variant="primary")
            status = gr.Markdown("Status: Idle")
            
        with gr.Column():
            chatbot = gr.Chatbot(height=500)
            msg = gr.Textbox(label="Your Question")
            b3 = gr.Button("Send")
            
    b1.click(lambda k1, k2: (k1, k2), inputs=[k1, k2], outputs=[api_key, fc_key])
    preset.change(lambda x: (PRESET_CONFIGS[x]["system"], PRESET_CONFIGS[x]["urls"], PRESET_CONFIGS[x]["text"]), inputs=[preset], outputs=[sys, urls, urls])
    b2.click(build_local_kb, inputs=[api_key, fc_key, urls, urls, files], outputs=[status, kb])
    b3.click(chat, inputs=[msg, api_key, kb, sys, history], outputs=[chatbot, history])

if __name__ == "__main__":
    demo.launch()` },
                    ],
                },
            ]
        },
        {
            id: 'part-2',
            title: 'PART 2: Cognitive Leverage & Decision Systems',
            content: [
                {
                    type: 'heading',
                    content: 'Theme: Strategic Dominance'
                },
                {
                    type: 'paragraph',
                    content: 'Part 1 gave you information retrieval systems. Part 2 gives you decision-support systems. High-stakes professional environments are defined by uncertainty. The difference between effective and ineffective decision-making under uncertainty is structure: explicit criteria, weighted variables, scenario analysis, and systematic bias detection. This section teaches you to use AI as a decision-support engine — not just to summarize information, but to weigh options, simulate outcomes, and force clarity when the stakes are high.'
                },
                {
                    type: 'paragraph',
                    content: 'We start with the most fundamental bottleneck: decision fatigue — the invisible force that degrades every choice you make after the first few hours of your day.'
                }
            ],
            subSections: [
                {
                    id: '3-12',
                    title: '3.12 Decision Fatigue & The Executive Function Gap',
                    content: [
                        { type: 'paragraph', content: 'Before you can improve your decision-making, you need to understand why it fails. The answer is biological: your brain runs on a finite fuel supply, and every decision burns it. This section quantifies the cost and introduces the framework for conserving cognitive resources.' },
                        { type: 'heading', content: 'Why Smart People Make Bad Choices at 4 PM' },
                        { type: 'paragraph', content: 'Why do smart professionals make terrible choices at 4:00 PM?' },
                        {
                            type: 'list', content: [
                                '**The Science:** Executive function consumes glucose. Every decision — from "What to wear?" to "Should we merge?" — draws from the same cognitive fuel tank. When it\'s depleted, you default to the path of least resistance.',
                                '**The Framework:** Classify decisions as Type 1 (reversible, low-stakes) or Type 2 (irreversible, high-stakes). Automate or template Type 1 decisions to preserve cognitive resources for Type 2.',
                                '**The Application:** Offload the structure of decision-making to AI — criteria identification, option comparison, scenario modeling — so your brain only provides the final judgment.'
                            ]
                        },
                        { type: 'heading', content: 'Interactive: Decision Fatigue Meter' },
                        { type: 'paragraph', content: 'Visualize your cognitive battery depletion throughout the day. Learn which decisions to automate.' },
                        { type: 'interactive', content: '', component: 'DecisionFatigueMeter', interactiveId: 'decision-fatigue-1' },
                        { type: 'paragraph', content: 'You now understand why decision quality degrades. The next step is replacing intuition with structure. The Weighted Decision Matrix turns subjective judgment into objective calculation — and AI handles the math instantly.' },
                    ],
                },
                {
                    id: '3-13',
                    title: '3.13 The Weighted Decision Matrix (Mathematizing Choice)',
                    content: [
                        { type: 'paragraph', content: 'Decision fatigue is the disease; structured decision-making is the cure. This section introduces the Weighted Decision Matrix — a framework that replaces gut feeling with explicit criteria and calculated scores.' },
                        { type: 'heading', content: 'Deciding by Weighted Variables' },
                        { type: 'paragraph', content: 'Intuition is unrecognized pattern matching — useful but prone to cognitive biases. Structured decision-making replaces intuition with explicit criteria and weighted variables.' },
                        {
                            type: 'list', content: [
                                '**The Framework:** Listing Options (Rows) vs. Criteria (Columns) vs. Weights (Importance).',
                                '**AI\'s Role:** Humans are bad at mental math. AI excels at calculating weighted scores instantly.'
                            ]
                        },
                        { type: 'heading', content: 'Concept Lab: Decision Matrix Calculator' },
                        { type: 'paragraph', content: 'Break down a real decision (e.g., "Which vendor to hire?") into variables (Cost, Speed, Quality) and assign weights. The AI runs the math.' },
                        { type: 'interactive', content: '', component: 'DecisionMatrixCalculator', interactiveId: 'decision-matrix-1' },
                        { type: 'paragraph', content: 'A decision matrix tells you the best option today. But what about tomorrow? The next section teaches you to stress-test your decisions against multiple futures — using simulation and pre-mortem analysis to find the potholes before you drive over them.' },
                    ],
                },
                {
                    id: '3-14',
                    title: '3.14 Simulation Theory (Predicting the Future)',
                    content: [
                        { type: 'paragraph', content: 'The decision matrix gives you a snapshot. Simulation gives you a movie. This section teaches you to run pre-mortems and scenario projections that reveal how your decision performs across multiple possible futures.' },
                        { type: 'heading', content: 'Monte Carlo Your Life Choices' },
                        { type: 'paragraph', content: 'Use AI to run simulations on your life choices and see potential futures before they happen.' },
                        {
                            type: 'list', content: [
                                '**Scenario Planning:** "Assume the economy crashes in Q4, and our budget is cut by 20%. How does my project plan change?"',
                                '**The Pre-Mortem:** Asking the AI: "Imagine it is one year from now and this project failed catastrophically. Write the autopsy report explaining exactly why."',
                                '**Outcome:** Seeing the potholes before you drive over them.'
                            ]
                        },
                        { type: 'heading', content: 'App: Scenario Simulator' },
                        { type: 'paragraph', content: 'Run pre-mortem analyses and scenario projections. See how different variables affect your outcomes.' },
                        { type: 'interactive', content: '', component: 'ScenarioSimulator', interactiveId: 'scenario-simulator-1' },
                        { type: 'paragraph', content: 'Simulation helps you decide the important things. But most of your day is consumed by unimportant things. The next section teaches you to identify and automate the trivial decisions that drain your cognitive reserves.' },
                    ],
                },
                {
                    id: '3-15',
                    title: '3.15 Automating the "Trivial Many" (Workflow Automation)',
                    content: [
                        { type: 'paragraph', content: 'You can now make better Type 2 (high-stakes) decisions. This section tackles the other side: eliminating the hundreds of Type 1 (trivial) decisions that silently consume your cognitive budget throughout the day.' },
                        { type: 'heading', content: 'Protect the Critical Few' },
                        { type: 'paragraph', content: 'Identify the low-value decisions that clog your day (The "Trivial Many") and automate them to protect the "Critical Few."' },
                        {
                            type: 'list', content: [
                                '**Calendar Tetris:** Using AI to optimize your schedule—clustering meetings, protecting "Deep Work" blocks, and ensuring travel time.',
                                '**The Meeting Decliner:** An AI script that evaluates a meeting invite and suggests: "Decline, this could be an email." or "Delegate to Sarah."'
                            ]
                        },
                        { type: 'heading', content: 'Tool: Schedule Planner' },
                        { type: 'paragraph', content: 'Optimize your calendar by identifying which activities are trivial and which are critical.' },
                        { type: 'interactive', content: '', component: 'SchedulePlanner', interactiveId: 'schedule-planner-1' },
                        { type: 'paragraph', content: 'Automation handles the trivial. But even your critical decisions are vulnerable to invisible distortions. The next section exposes the cognitive biases that corrupt human judgment — and shows you how to use AI as a bias-detection mirror.' },
                    ],
                },
                {
                    id: '3-16',
                    title: '3.16 Bias Detection in Decision Making',
                    content: [
                        { type: 'paragraph', content: 'Automation protects your time. Bias detection protects your judgment. This section reveals the cognitive exploits — confirmation bias, sunk cost fallacy, recency bias — that silently corrupt even the most structured decision process, and teaches you to use AI as a neutral third party to catch them.' },
                        { type: 'heading', content: 'Your Brain is Riddled with Bugs' },
                        { type: 'paragraph', content: 'Your brain is riddled with bugs: Confirmation Bias, Sunk Cost Fallacy, Recency Bias.' },
                        {
                            type: 'list', content: [
                                '**The Neutral Third Party:** Using AI as a mirror. "I want to continue this project because I\'ve already spent $10k. Tell me if I am falling for the Sunk Cost Fallacy."',
                                '**The Steelman Argument:** Forcing the AI to argue against your favorite idea with the strongest possible logic. If you can\'t defeat the AI\'s argument, your idea is weak.'
                            ]
                        },
                        { type: 'heading', content: 'Simulator: Cognitive Bias Detector' },
                        { type: 'paragraph', content: 'Test your ability to identify cognitive biases in real-world decision scenarios.' },
                        { type: 'interactive', content: '', component: 'CognitiveBiasDetector', interactiveId: 'bias-detector-1' },
                        { type: 'paragraph', content: 'You can now make unbiased decisions. But a great decision is worthless if you cannot communicate it clearly. The next section teaches the BLUF protocol — the military-grade communication format that ensures your analysis drives action.' },
                    ],
                },
                {
                    id: '3-17',
                    title: '3.17 The "Executive Brief" Protocol (Communication Strategy)',
                    content: [
                        { type: 'paragraph', content: 'Making the right decision is half the job. Communicating it so others act on it is the other half. This section teaches the Executive Brief protocol — a structured format that turns rambling analysis into crisp, actionable communication.' },
                        { type: 'heading', content: 'BLUF: Bottom Line Up Front' },
                        { type: 'paragraph', content: 'A great decision is useless if you cannot communicate it.' },
                        {
                            type: 'list', content: [
                                '**The BLUF (Bottom Line Up Front):** Training AI to rewrite your rambling thoughts into military-grade precision. "Here is the recommendation. Here is the cost. Here is the risk."',
                                '**Visualizing the Choice:** Turning your Weighted Decision Matrix into a text-based chart that ends the debate in the boardroom.'
                            ]
                        },
                        { type: 'heading', content: 'Tool: Executive Brief Builder' },
                        { type: 'paragraph', content: 'Transform messy notes into structured executive briefs with the BLUF protocol.' },
                        { type: 'interactive', content: '', component: 'ExecutiveBriefBuilder', interactiveId: 'executive-brief-1' },
                        { type: 'paragraph', content: 'You can now decide and communicate. But one critical question remains: where should AI decide, and where must humans retain control? The next section draws the ethical bright lines of automated choice.' },
                    ],
                },
                {
                    id: '3-18',
                    title: '3.18 Ethics of Automated Choice (The Human in the Loop Redux)',
                    content: [
                        { type: 'paragraph', content: 'Efficiency is not the only metric. Some decisions carry moral weight that no algorithm should bear alone. This section defines the ethical boundaries of automated decision-making — where AI should advise, and where humans must remain the final authority.' },
                        { type: 'heading', content: 'When Is It Immoral to Let AI Decide?' },
                        { type: 'paragraph', content: 'When is it immoral to let AI decide?' },
                        {
                            type: 'list', content: [
                                '**People Operations:** Hiring, firing, and discipline are "Human Only" zones. AI can screen, but it must never decide.',
                                '**The "Black Box" Danger:** If the AI says "Do X," and you cannot explain why to your board, you are not a leader; you are a follower.',
                                '**Rule:** AI provides the Data. Humans provide the Values.'
                            ]
                        },
                        { type: 'heading', content: 'Simulator: Ethical Dilemma' },
                        { type: 'paragraph', content: 'Navigate ethical scenarios where you must decide what AI should and should not automate.' },
                        { type: 'interactive', content: '', component: 'EthicalDilemmaSimulator', interactiveId: 'ethics-simulator-1' },
                        { type: 'paragraph', content: 'Ethics shapes what AI should do. Advanced prompting shapes what AI can do. The next section upgrades your prompting from basic instructions to strategic engineering — chain of thought, persona, and Socratic techniques that unlock the full reasoning capacity of modern models.' },
                    ],
                },
                {
                    id: '3-19',
                    title: '3.19 Advanced Prompt Engineering for Strategy',
                    content: [
                        { type: 'paragraph', content: 'You have the frameworks: matrices, simulations, automation, bias detection, communication, and ethics. This section gives you the advanced prompting techniques that make all of them more powerful — turning AI from a simple assistant into a strategic thinking partner.' },
                        { type: 'heading', content: 'Beyond "Write a Blog Post"' },
                        { type: 'paragraph', content: 'Moving beyond "Write a blog post" to "Design a Strategy."' },
                        {
                            type: 'list', content: [
                                '**Chain of Thought Prompting:** Forcing the AI to show its work step-by-step ("First, I analyzed the market... Then, I looked at competitors...").',
                                '**Persona Prompting:** "Act as Steve Jobs. Critique this product launch plan. Be harsh."',
                                '**Socratic Prompting:** "Don\'t give me the answer. Ask me 3 questions to help me clarify my own thinking."'
                            ]
                        },
                        { type: 'heading', content: 'Workbench: Prompt Architect' },
                        { type: 'paragraph', content: 'Experiment with advanced prompting techniques for strategic thinking.' },
                        { type: 'interactive', content: '', component: 'PromptArchitectWorkbench', interactiveId: 'prompt-architect-1' },
                        { type: 'paragraph', content: 'You now have every tool in the Decision Systems arsenal. The next section is your final pressure test — a high-stakes scenario that forces you to use decision matrices, simulation, and executive communication to navigate a billion-dollar pivot.' },
                    ],
                },
                {
                    id: '3-20',
                    title: '3.20 Capstone 2 Scenario: The "Billion Dollar Pivot"',
                    content: [
                        { type: 'paragraph', content: 'Every technique you have learned in Part 2 converges here. This capstone scenario puts you in the CEO chair and forces you to make a bet-the-company decision using the full toolkit: weighted criteria, scenario analysis, bias detection, and executive communication.' },
                        { type: 'heading', content: 'CEO Decision Mode' },
                        { type: 'paragraph', content: 'You are the CEO of a mid-sized company. You must decide whether to pivot to a new, risky market or double down on your current, shrinking market.' },
                        {
                            type: 'list', content: [
                                '**The Mission:** Use the "Decision Nexus" (your next build) to mathematically calculate the best path.',
                                '**Input:** Market size, risk, team capability, cost.',
                                '**Process:** Weight the criteria. Score the options.',
                                '**Output:** A data-backed decision memo that justifies your choice.'
                            ]
                        },
                        { type: 'heading', content: 'Tool: Pitch Builder' },
                        { type: 'paragraph', content: 'Practice building and presenting your pivot decision with supporting data.' },
                        { type: 'interactive', content: '', component: 'PitchBuilder', interactiveId: 'pitch-builder-1' },
                        { type: 'paragraph', content: 'You made the call. Now it is time to build the tool that made it possible. The next section prepares you for deploying your second Hugging Face Space — the Decision Nexus, a strategic calculator that turns weighted criteria into data-backed recommendations.' },
                    ],
                },
                {
                    id: '3-21',
                    title: '3.21 Deployment 2: The Logic Engine',
                    content: [
                        { type: 'paragraph', content: 'The capstone proved the concept. Now you build the product. This section takes the decision logic you have been using throughout Part 2 and packages it into a deployable application — your second Hugging Face Space.' },
                        { type: 'heading', content: 'A Calculator of Fate' },
                        { type: 'paragraph', content: 'For your second Hugging Face Space, you will build something different. Not a chatbot, but a Calculator of Fate.' },
                        {
                            type: 'list', content: [
                                '**Goal:** A tool where you input options + criteria, and the AI/Algorithm outputs a ranked score and an explanation.',
                                '**The Stack:** Same tech (Gradio/Python), new application (Logic & Math).'
                            ]
                        },
                        { type: 'heading', content: 'Quiz: Deployment Commands' },
                        { type: 'paragraph', content: 'Review the deployment process before building your Decision Nexus.' },
                        { type: 'interactive', content: '', component: 'DockerCommandQuiz', interactiveId: 'deployment-quiz-2' },
                        { type: 'paragraph', content: 'You have the architecture. The next section gives you the code. Paste it, deploy it, and your AI strategic engine goes live — the second and final build of Module 3.' },
                    ],
                },
                {
                    id: '3-22',
                    title: '3.22 Build The Decision Nexus (Implementation)',
                    content: [
                        { type: 'paragraph', content: 'This is the final build. Everything from sections 3.12 through 3.21 is encapsulated in the code below. Deploy it and you will have completed both deliverables for Module 3: the Omni Studio (information) and the Decision Nexus (strategy).' },
                        { type: 'heading', content: 'Your AI Strategic Engine' },
                        { type: 'paragraph', content: 'This app allows you to input a decision (e.g., "Job A vs. Job B"), define criteria (Salary, Location, Growth), and receive an objective, calculated score.' },
                        { type: 'heading', content: 'Space Architecture' },
                        {
                            type: 'list', content: [
                                'Create a NEW Space on Hugging Face (e.g., Decision-Nexus).',
                                'Paste requirements.txt.',
                                'Paste the NEW app.py below.',
                                'Add your OPENAI_API_KEY in Settings.'
                            ]
                        },
                        { type: 'heading', content: 'requirements.txt' },
                        {
                            type: 'code', language: 'plaintext', content: `gradio==5.49.1
pandas>=2.0.0
openai>=1.50.0` },
                        { type: 'heading', content: 'app.py' },
                        {
                            type: 'code', language: 'python', content: `import gradio as gr
import pandas as pd
from openai import OpenAI

# A specialized tool for making weighted decisions
# Input: Options, Criteria, Weights -> Output: Ranked Table & Explanation

def calculate_decision(api_key, decision_topic, options_str, criteria_str):
    if not api_key: return "Please enter OpenAI Key", None
    
    # 1. Parse Inputs
    options = [o.strip() for o in options_str.split(',')]
    criteria_raw = [c.strip() for c in criteria_str.split(',')]
    
    # Simple logic: Equal weights for now, or AI can determine weights
    # We will ask GPT to score each option against criteria (1-10)
    
    prompt = f"""
    Act as a rational decision engine.
    Topic: {decision_topic}
    Options: {options}
    Criteria: {criteria_raw}
    
    Task:
    1. Evaluate each Option against each Criteria on a scale of 1-10.
    2. Be critical and realistic.
    3. Return a CSV formatted string with columns: Option, {', '.join(criteria_raw)}, Total_Score.
    4. Followed by a brief textual explanation of the winner.
    """
    
    client = OpenAI(api_key=api_key)
    try:
        resp = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )
        output = resp.choices[0].message.content
        return output
    except Exception as e:
        return f"Error: {e}"

# UI Layout
with gr.Blocks(title="Decision Nexus") as demo:
    gr.Markdown("# ⚖️ Decision Nexus: AI Strategic Engine")
    gr.Markdown("Define your choices, set your criteria, and let the engine calculate the optimal path.")
    
    with gr.Row():
        key = gr.Textbox(label="OpenAI API Key", type="password")
    
    with gr.Row():
        topic = gr.Textbox(label="Decision Topic", placeholder="e.g. Which job offer to accept?")
        opts = gr.Textbox(label="Options (comma separated)", placeholder="Startup, Corporate, Freelance")
        crit = gr.Textbox(label="Criteria (comma separated)", placeholder="Salary, Freedom, Risk, Growth")
        
    btn = gr.Button("Analyze & Calculate", variant="primary")
    result = gr.Markdown("### Results will appear here...")
    
    btn.click(calculate_decision, inputs=[key, topic, opts, crit], outputs=[result])

if __name__ == "__main__":
    demo.launch()` },
                    ],
                },
            ]
        }
    ],
};
