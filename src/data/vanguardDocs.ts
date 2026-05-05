export type VanguardDocSection = {
    id: string;
    title: string;
    body: string;
    bullets?: string[];
    checklist?: string[];
    code?: {
        language: string;
        title: string;
        content: string;
    };
};

export type VanguardDocument = {
    id: string;
    category: string;
    title: string;
    summary: string;
    audience: string;
    estimatedRead: string;
    tags: string[];
    aiPromptSeed: string;
    quickActions: Array<{
        label: string;
        description: string;
        to: string;
    }>;
    sections: VanguardDocSection[];
};

export const vanguardDocs: VanguardDocument[] = [
    {
        id: 'start-here',
        category: 'Orientation',
        title: 'Start Here: How Vanguard Works',
        summary: 'A straight-line explanation of what to open first, where to practice, and how to leave with something real.',
        audience: 'New learners and returning operators',
        estimatedRead: '6 min',
        tags: ['overview', 'workflow', 'beginner'],
        aiPromptSeed: 'Help the learner understand where to start in Vanguard and what to do next.',
        quickActions: [
            { label: 'Open Dashboard', description: 'See the command deck and next actions.', to: '/dashboard' },
            { label: 'Open Starter Guide', description: 'Review the condensed beginner path.', to: '/guide' },
            { label: 'Open Module 1', description: 'Start with the fundamentals track.', to: '/module/1' },
        ],
        sections: [
            {
                id: 'what-vanguard-is',
                title: 'What Vanguard is for',
                body: 'Vanguard is not meant to be consumed like a static course. It is a guided system for moving from AI literacy into deployable workflows, repeatable operating patterns, and portfolio-ready outputs.',
                bullets: [
                    'Use the dashboard for orientation and progress.',
                    'Use the docs library for answers, playbooks, and setup help.',
                    'Use the modules when you are actively learning and building.',
                ],
            },
            {
                id: 'best-starting-path',
                title: 'Best starting path',
                body: 'If you are unsure where to begin, use the shortest reliable sequence: read the Starter Guide, finish the early sections of Module 1, then deploy one small app. That gives the later modules context and keeps them from feeling abstract.',
                checklist: [
                    'Read the Starter Guide once.',
                    'Complete enough of Module 1 to explain models, prompts, and automation clearly.',
                    'Use this docs page whenever you need a practical reference.',
                    'Treat every module like a sprint that should end with a usable artifact.',
                ],
            },
            {
                id: 'where-to-go-next',
                title: 'Where to go next',
                body: 'Choose one action after every learning session. The best next step is usually one module section, one deployment improvement, or one reusable note or workflow that you can use again later.',
                bullets: [
                    'Need AI vocabulary: go to Module 1.',
                    'Need tool use and workflows: go to Module 2.',
                    'Need retrieval and personal systems: go to Module 3.',
                    'Need hardening and review: go to Module 4.',
                ],
            },
        ],
    },
    {
        id: 'ai-llm-reference',
        category: 'Foundations',
        title: 'AI, LLMs, and Automation Quick Reference',
        summary: 'A practical explanation of how modern AI systems fit together and where models stop being enough on their own.',
        audience: 'Learners building a clear mental model',
        estimatedRead: '8 min',
        tags: ['ai', 'llm', 'automation', 'architecture'],
        aiPromptSeed: 'Explain AI, LLMs, and automation in plain language and connect them to system design.',
        quickActions: [
            { label: 'Continue Module 1', description: 'Go deeper on the fundamentals.', to: '/module/1' },
            { label: 'Open Module 2', description: 'See how workflows expand beyond chat.', to: '/module/2' },
            { label: 'Back to Dashboard', description: 'Return to the command deck.', to: '/dashboard' },
        ],
        sections: [
            {
                id: 'ai-vs-llm',
                title: 'AI versus LLM',
                body: 'AI is the broad category. An LLM is one kind of AI model optimized for language. That matters because the real product is usually a model plus instructions plus retrieval plus tools plus validation, not just the model by itself.',
                bullets: [
                    'AI can include vision, prediction, ranking, speech, planning, and automation.',
                    'An LLM predicts and transforms language based on context and training patterns.',
                    'The model is one capability inside a larger system.',
                ],
            },
            {
                id: 'why-models-fail',
                title: 'Why models fail in production',
                body: 'A model can sound confident while still being wrong or incomplete. Production systems add structured outputs, grounding, retrieval, validation, memory rules, and observability so those failures are easier to catch.',
                checklist: [
                    'Constrain outputs when exact structure matters.',
                    'Keep critical business logic outside the model when possible.',
                    'Add retrieval when current or private knowledge matters.',
                    'Log prompts and failure cases for review.',
                ],
            },
            {
                id: 'automation-stack',
                title: 'What automation adds',
                body: 'Automation turns model capability into a workflow. It adds triggers, sequences, integrations, retries, state changes, and review steps. The model handles language or judgment. The automation layer decides when action happens and what tool is used.',
            },
        ],
    },
    {
        id: 'hf-deployment',
        category: 'Deploy',
        title: 'Hugging Face Space Deployment Blueprint',
        summary: 'The minimum reliable path for packaging, documenting, and deploying a Space with secrets handled correctly.',
        audience: 'Builders shipping live AI apps',
        estimatedRead: '9 min',
        tags: ['hugging face', 'deployment', 'gradio', 'spaces'],
        aiPromptSeed: 'Help the learner deploy a Hugging Face Space cleanly and debug common failures.',
        quickActions: [
            { label: 'Open Starter Guide', description: 'Review the baseline deployment explanation.', to: '/guide' },
            { label: 'Open Module 2', description: 'Pair deployment with workflow building.', to: '/module/2' },
            { label: 'Open Module 4', description: 'Review production hardening.', to: '/module/4' },
        ],
        sections: [
            {
                id: 'space-metadata',
                title: 'Space metadata matters',
                body: 'A Hugging Face Space depends on the README metadata block to know how to run. If that metadata is wrong, the app may not deploy or may point at the wrong entry file.',
                code: {
                    language: 'yaml',
                    title: 'Recommended metadata block',
                    content: `---
title: Vanguard Demo Space
emoji: robot
colorFrom: blue
colorTo: cyan
sdk: gradio
sdk_version: 5.49.1
app_file: app.py
pinned: false
short_description: Vanguard deployment demo
---`,
                },
            },
            {
                id: 'safe-secret-handling',
                title: 'Safe API key handling',
                body: 'Put the API key in the Space secret settings, not in source code. Read it from the environment and fail clearly if it is missing.',
                code: {
                    language: 'python',
                    title: 'Minimal environment pattern',
                    content: `import os
import gradio as gr
from openai import OpenAI

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None

def answer(question: str) -> str:
    if not client:
        return "Missing OPENAI_API_KEY secret in this Space."
    response = client.responses.create(model="gpt-4.1-mini", input=question)
    return response.output_text`,
                },
            },
            {
                id: 'deployment-check',
                title: 'Deployment checklist',
                body: 'The fastest way to ship is to keep the first version narrow and obvious. One clear input, one clear output, one short README, and explicit error states for missing keys and bad input.',
                checklist: [
                    'Keep the app small enough to debug in one sitting.',
                    'Test empty input, bad input, and missing secret cases.',
                    'Check the Space on mobile before sharing it.',
                    'Document what the app does and what model it uses.',
                ],
            },
        ],
    },
    {
        id: 'production-readiness',
        category: 'Operate',
        title: 'Production Readiness Checklist for AI Apps',
        summary: 'A concise hardening checklist for stability, speed, supportability, and trust before you call an AI app finished.',
        audience: 'Builders preparing to demo, launch, or hand off a system',
        estimatedRead: '7 min',
        tags: ['production', 'qa', 'stability', 'performance'],
        aiPromptSeed: 'Review an AI app for production readiness and prioritize the next improvements by impact.',
        quickActions: [
            { label: 'Open Module 4', description: 'Go deeper on governance and hardening.', to: '/module/4' },
            { label: 'Open Module 3', description: 'Strengthen retrieval and decision flows.', to: '/module/3' },
            { label: 'Open Hub', description: 'Compare Vanguard with other programs.', to: '/hub' },
        ],
        sections: [
            {
                id: 'performance-basics',
                title: 'Performance basics',
                body: 'Users interpret waiting as instability. Tighten the first load, remove unnecessary dependencies, keep screens visually complete during fetches, and prefer stable shells over reveal-heavy layouts that make the page feel blank.',
                bullets: [
                    'Keep the first screen readable immediately.',
                    'Avoid layout shifts that make the page feel broken.',
                    'Prefer dense navigation and direct actions over visual delay.',
                ],
            },
            {
                id: 'quality-and-testing',
                title: 'Quality and testing',
                body: 'A production-ready AI app needs more than a working prompt. Test mobile layouts, empty states, model outages, rate limits, and the most common failure paths. Then make sure the user always knows what to do next.',
                checklist: [
                    'Test mobile and desktop separately.',
                    'Verify failure behavior when the model or API is unavailable.',
                    'Check that the user always has a next action.',
                    'Review the app with a first-time user mindset.',
                ],
            },
            {
                id: 'handoff',
                title: 'Make the system handoff-ready',
                body: 'If another person cannot explain the system, operate it, or extend it safely, the work is not really complete. Leave readable configuration, explicit environment variables, and a documented run path.',
            },
        ],
    },
];

export const vanguardDocCategories = Array.from(new Set(vanguardDocs.map((document) => document.category)));

export function getVanguardDocById(docId: string | null | undefined): VanguardDocument | undefined {
    if (!docId) {
        return undefined;
    }

    return vanguardDocs.find((document) => document.id === docId);
}
