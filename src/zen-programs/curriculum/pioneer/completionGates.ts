export type PioneerCompletionGateMode = 'journal' | 'worksheet' | 'file-submission' | 'url-submission' | 'evidence-checklist';

export interface PioneerCompletionGate {
    id: string;
    moduleId: string;
    title: string;
    mode: PioneerCompletionGateMode;
    requiredEvidence: string[];
}

export const pioneerCompletionGates: PioneerCompletionGate[] = [
    {
        id: 'module-1-project-direction',
        moduleId: 'module-1',
        title: 'Project idea selected',
        mode: 'journal',
        requiredEvidence: [
            'Project idea title',
            'One-sentence purpose',
            'Target user',
            'Starter prompt',
            'Safety note',
            'Build journal entry',
        ],
    },
    {
        id: 'module-1-responsible-ai-quiz',
        moduleId: 'module-1',
        title: 'Responsible AI quiz completed',
        mode: 'evidence-checklist',
        requiredEvidence: [
            'Hallucination risk explained',
            'Bias risk explained',
            'Privacy boundary explained',
            'One safe-use rule for the project',
        ],
    },
    {
        id: 'module-2-ai-app-blueprint',
        moduleId: 'module-2',
        title: 'App blueprint completed',
        mode: 'worksheet',
        requiredEvidence: [
            'Confirmed final app idea',
            'Model plus prompt plus tool plus interface plan',
            'Secret name listed as HF_TOKEN',
            'Public URL submission plan',
        ],
    },
    {
        id: 'module-3-api-key-safety-quiz',
        moduleId: 'module-3',
        title: 'API key safety quiz completed',
        mode: 'evidence-checklist',
        requiredEvidence: [
            'Explains why API keys are private',
            'Names HF_TOKEN as the expected secret',
            'Identifies Hugging Face Space Secrets as the safe storage location',
            'Confirms keys are not stored in localStorage',
        ],
    },
    {
        id: 'module-3-working-mini-app',
        moduleId: 'module-3',
        title: 'First app runs',
        mode: 'file-submission',
        requiredEvidence: [
            'app.py',
            'Missing HF_TOKEN handled safely',
            'No real API keys or tokens stored in code, README files, screenshots, chat, or localStorage',
        ],
    },
    {
        id: 'module-3-hugging-face-files-prepared',
        moduleId: 'module-3',
        title: 'Hugging Face files prepared',
        mode: 'file-submission',
        requiredEvidence: [
            'app.py',
            'requirements.txt',
            'README.md',
            'README includes project purpose and responsible AI note',
        ],
    },
    {
        id: 'module-4-space-deployed',
        moduleId: 'module-4',
        title: 'Space deployed',
        mode: 'url-submission',
        requiredEvidence: [
            'Hugging Face Space created',
            'Space Secrets configured',
            'Build logs checked',
            'Public app loads',
        ],
    },
    {
        id: 'module-4-live-space-url',
        moduleId: 'module-4',
        title: 'Space URL submitted',
        mode: 'url-submission',
        requiredEvidence: [
            'Public Hugging Face Space URL',
            'App name and one-sentence purpose',
            'Screenshot or short demo note',
        ],
    },
    {
        id: 'module-4-portfolio-link-submitted',
        moduleId: 'module-4',
        title: 'Portfolio link submitted',
        mode: 'url-submission',
        requiredEvidence: [
            'Portfolio or showcase URL',
            'Live Space URL included',
            'Project description included',
            'Responsible AI note included',
        ],
    },
    {
        id: 'module-5-improved-public-demo',
        moduleId: 'module-5',
        title: 'Demo-ready',
        mode: 'evidence-checklist',
        requiredEvidence: [
            'Peer feedback note',
            'One fixed bug',
            'One prompt improvement',
            'Updated public Space URL',
        ],
    },
    {
        id: 'module-6-final-reflection-submitted',
        moduleId: 'module-6',
        title: 'Final reflection submitted',
        mode: 'evidence-checklist',
        requiredEvidence: [
            'What was built',
            'Who it serves',
            'What changed after feedback',
            'How API keys were protected',
            'Known limitations',
        ],
    },
    {
        id: 'module-6-credential-ready-evidence',
        moduleId: 'module-6',
        title: 'Credential evidence ready',
        mode: 'evidence-checklist',
        requiredEvidence: [
            'Final Space URL',
            'Portfolio or showcase link',
            'Project description',
            'Responsible AI reflection',
            'Demo script',
            'Peer feedback note',
            'Credential evidence checklist',
        ],
    },
];
