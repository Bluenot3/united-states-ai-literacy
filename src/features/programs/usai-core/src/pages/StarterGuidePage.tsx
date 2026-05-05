import React from 'react';
import { Link } from 'react-router-dom';

const huggingFaceMetadata = `---
title: My First AI Space
emoji: rocket
colorFrom: blue
colorTo: cyan
sdk: gradio
sdk_version: 5.49.1
app_file: app.py
pinned: false
short_description: Beginner AI project
---`;

const pythonExample = `import os
import gradio as gr
from openai import OpenAI

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

def answer(question: str) -> str:
    if not api_key:
        return "Missing OPENAI_API_KEY secret in your Hugging Face Space."

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=question
    )
    return response.output_text

demo = gr.Interface(fn=answer, inputs="text", outputs="text")
demo.launch()`;

const sections = [
    {
        title: 'What AI means',
        body: 'AI is a broad category for software that performs tasks that usually require human judgment. Machine learning is one way to build AI by learning patterns from examples. LLMs are language models trained to predict and generate text, which is why they feel conversational.',
    },
    {
        title: 'What an LLM actually does',
        body: 'An LLM does not think like a person. It predicts likely next tokens based on patterns from training data and current context. That means it can be useful, but it can also be wrong, overconfident, or out of date.',
    },
    {
        title: 'What automation means',
        body: 'Automation is using software to run repeatable work with less manual effort. In practice, that means an AI model is only one part of a system. The full workflow also needs triggers, tools, rules, logging, and a review step when mistakes would matter.',
    },
];

const deploymentChecklist = [
    'Create a small app with one job and one clear user input.',
    'Keep secrets out of code. Store API keys in environment variables or Hugging Face Space secrets.',
    'Use a backend proxy for private model keys when you build a browser-based production app.',
    'Write a friendly error state for missing keys, rate limits, and bad input.',
    'Document what the app does, what model it uses, and how to run it.',
    'Test on desktop and mobile before sharing the link.',
];

const guideCards = [
    {
        title: 'Beginner path',
        items: ['Start with the Program Hub.', 'Read this guide once.', 'Choose AI Pioneer if you want the cleanest zero-background path.'],
    },
    {
        title: 'Builder path',
        items: ['Use Vanguard if you already know the basics.', 'Focus on one module until you ship one finished artifact.', 'Keep notes on prompts, screenshots, and lessons learned.'],
    },
    {
        title: 'Deployment path',
        items: ['Package one small app.', 'Move secrets into environment variables.', 'Publish to Hugging Face Spaces or Vercel with a clear README.'],
    },
];

const StarterGuidePage: React.FC = () => {
    return (
        <div className="pb-20 lg:pb-8">
            <div className="mx-auto max-w-6xl">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">Starter Guide</p>
                            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                                Learn the core ideas, then ship one real thing.
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                                This page is the shortest path from zero context to a finished beginner-level AI project.
                                It covers the language of AI and LLMs, how automation systems are structured, and the exact
                                minimum you need to deploy a Hugging Face Space with an API key handled safely.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link to="/hub" className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                                Open Program Hub
                            </Link>
                            <Link to="/dashboard" className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
                                Open Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {guideCards.map((card) => (
                        <div key={card.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
                            <h2 className="text-lg font-bold text-white">{card.title}</h2>
                            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                {card.items.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <span className="mt-2 h-2 w-2 rounded-full bg-cyan-400" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-sm sm:p-8">
                        <h2 className="text-2xl font-bold text-white">Core concepts in plain language</h2>
                        <div className="mt-6 space-y-6">
                            {sections.map((section) => (
                                <div key={section.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                                    <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-300">{section.body}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">Minimum deployment target</p>
                        <h2 className="mt-4 text-2xl font-bold text-white">Build one Hugging Face Space</h2>
                        <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-200">
                            <li>1. Create a new Hugging Face Space and choose the Gradio SDK.</li>
                            <li>2. Add README metadata so the Space deploys with the right app file and SDK version.</li>
                            <li>3. Put your API key in the Space secret settings, not in `app.py`.</li>
                            <li>4. Read the key with `os.getenv(...)` and fail clearly if it is missing.</li>
                            <li>5. Test on mobile before sharing the live link.</li>
                        </ol>
                    </section>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
                        <h2 className="text-2xl font-bold text-white">README metadata for a Hugging Face Space</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                            Keep the metadata block at the top of your `README.md`. That tells Hugging Face which SDK to use
                            and where your app entry point lives.
                        </p>
                        <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-cyan-200">
                            <code>{huggingFaceMetadata}</code>
                        </pre>
                    </section>

                    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
                        <h2 className="text-2xl font-bold text-white">Minimal `app.py` pattern</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                            This is the important part: read secrets from the environment, handle missing configuration, and keep
                            the app small enough that you can debug it.
                        </p>
                        <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-emerald-200">
                            <code>{pythonExample}</code>
                        </pre>
                    </section>
                </div>

                <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
                    <h2 className="text-2xl font-bold text-white">Production habits that matter</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {deploymentChecklist.map((item) => (
                            <div key={item} className="rounded-2xl border border-white/8 bg-slate-900/70 p-5 text-sm leading-7 text-slate-300">
                                {item}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StarterGuidePage;
