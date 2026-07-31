/**
 * AI Pioneer console — standalone design preview.
 *
 * The real route (/programs/pioneer) sits behind auth + billing entitlement,
 * so it cannot be shown to a reviewer without an account. This harness mounts
 * the same page with only the context it genuinely needs, no Supabase, no
 * Stripe, and no server — so the console can be reviewed as a static bundle.
 *
 * It is a review tool, not part of the app: nothing in src/ imports it, and it
 * is built by vite.preview.config.ts into dist-preview/, never by the app build.
 *
 *   npm run preview:pioneer   # dev server
 *   npm run build:preview     # static bundle in dist-preview/
 *
 * Progress lives in localStorage, so a reviewer can click through, earn XP and
 * rank up exactly as a learner would. `?seed=mid` starts part-way through so
 * the completed states are visible without clicking everything first.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ArsenalProvider } from '../src/contexts/ArsenalContext';
import ProgramDashboardPage from '../src/zen-programs/pages/ProgramDashboardPage';
import '../src/index.css';

const params = new URLSearchParams(window.location.search);

if (params.get('seed') === 'mid') {
    localStorage.setItem(
        'zenPrograms.pioneer.progress',
        JSON.stringify({
            completedSections: ['m1-s1', 'm1-s2', 'm2-s3'],
            completedLabs: ['m1-s1-first-prompt', 'm1-s2-image-chatbot'],
            exploredResources: [
                'AI Signal Loop', 'AI or Not AI? Checkpoint', 'AI Coach Console', 'AI Vocabulary Quest',
                'Neural Network Lab', 'Computer Vision Scanner', 'Model Behavior Mixer',
                'Prompt Formula Builder', 'Prompt Enhancer Studio', 'Prompt Power Meter',
                'Starter Prompt Library', 'Prompt Remix Lab',
            ],
            reflections: {},
            lastViewedSection: 'module-1',
            startedAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
        }),
    );
}

if (params.get('seed') === 'reset') {
    localStorage.removeItem('zenPrograms.pioneer.progress');
    localStorage.removeItem('zenPrograms.pioneer.questSteps');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MemoryRouter initialEntries={['/programs/pioneer']}>
            <ArsenalProvider>
                <Routes>
                    <Route path="/programs/:programId" element={<ProgramDashboardPage />} />
                </Routes>
            </ArsenalProvider>
        </MemoryRouter>
    </React.StrictMode>,
);
