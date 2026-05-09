import React from 'react';
import { pioneerCompletionGates } from '../curriculum/pioneer/completionGates';
import { pioneerStarterTemplates, type PioneerStarterTemplate } from '../curriculum/pioneer/starterTemplates';
import ProgramCodeBlock from './ProgramCodeBlock';

const featuredTemplateIds = [
    'minimal-gradio-hugging-face-space',
    'runtime-byok-demo',
    'portfolio-embed-snippet',
];

const apiSafetyCallouts = [
    'Never paste real API keys into public code.',
    'Use Hugging Face Space Secrets.',
    'Secret name should be HF_TOKEN.',
    'Runtime BYOK demos are for testing only.',
    'Do not store keys in localStorage.',
];

const featuredTemplates = featuredTemplateIds
    .map((templateId) => pioneerStarterTemplates.find((template) => template.id === templateId))
    .filter((template): template is PioneerStarterTemplate => Boolean(template));

const PioneerLearningAssets: React.FC = () => (
    <section className="min-w-0 max-w-full space-y-6 overflow-hidden">
        <div className="min-w-0 max-w-full rounded-[1.9rem] border border-cyan-300/15 bg-cyan-300/[0.04] p-6 shadow-zen-card backdrop-blur-xl sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-200/80">API safety callouts</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
                {apiSafetyCallouts.map((callout) => (
                    <div key={callout} className="rounded-2xl border border-cyan-300/10 bg-slate-950/40 p-4 text-sm leading-7 text-slate-200">
                        {callout}
                    </div>
                ))}
            </div>
        </div>

        <div className="min-w-0 max-w-full rounded-[1.9rem] border border-zen-gold/10 bg-zen-surface/60 p-6 shadow-zen-card backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/60">Starter Templates</p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-white">Copyable launch assets</h3>
                </div>
                <p className="max-w-xl text-sm leading-7 text-slate-400">
                    Copy these files into a Hugging Face Space. They are shown as learning assets only and are never executed in this page.
                </p>
            </div>

            <div className="mt-6 space-y-8">
                {featuredTemplates.map((template) => (
                    <article key={template.id} className="min-w-0 max-w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">{template.recommendedModule}</p>
                                <h4 className="mt-2 text-xl font-bold text-white">{template.title}</h4>
                                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">{template.description}</p>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                            {template.safetyNotes.map((note) => (
                                <div key={note} className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-4 text-sm leading-7 text-amber-50/90">
                                    {note}
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 space-y-4">
                            {template.files.map((file) => (
                                <ProgramCodeBlock
                                    key={`${template.id}-${file.path}`}
                                    code={file.content}
                                    filename={file.path}
                                    language={file.language}
                                    title={file.path}
                                />
                            ))}
                        </div>
                    </article>
                ))}
            </div>
        </div>

        <div className="min-w-0 max-w-full rounded-[1.9rem] border border-emerald-300/15 bg-emerald-300/[0.04] p-6 shadow-zen-card backdrop-blur-xl sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-200/80">Launch readiness checkpoints</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-white">Not submitted here yet</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
                These milestones are future-ready IDs for later wiring. They do not change backend progress or mark work as submitted.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
                {pioneerCompletionGates.map((gate) => (
                    <div
                        key={gate.id}
                        data-gate-id={gate.id}
                        className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                    >
                        <div className="flex items-start gap-3">
                            <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border border-emerald-200/30 text-[10px] text-emerald-100">
                            </span>
                            <div className="min-w-0">
                                <h4 className="text-sm font-bold text-white">{gate.title}</h4>
                                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200/60">
                                    {gate.moduleId} / {gate.mode} / {gate.id}
                                </p>
                                <ul className="mt-3 space-y-2">
                                    {gate.requiredEvidence.map((evidence) => (
                                        <li key={evidence} className="text-sm leading-6 text-slate-300">
                                            {evidence}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default PioneerLearningAssets;
