/**
 * ZEN Live Labs — externally hosted, free interactive demos embedded into the
 * Pioneer quests.
 *
 * Why: most of the concept apps in this program are simulations we render
 * ourselves. A few concepts (real diffusion, real speech recognition, real
 * model comparison) land far harder when a learner drives an actual model.
 * Hugging Face Spaces host those for free, so the program can show real
 * inference without spending a ZEN API key on every classroom click.
 *
 * ── Embedding rules ────────────────────────────────────────────────────
 * Hugging Face documents Space embedding: a Space at `owner/name` is framable
 * at `https://<owner>-<name>.hf.space` (lowercased, non-alphanumerics → `-`).
 * That is what `spaceUrl()` implements.
 *
 * Not every third-party site permits framing. Anything known or suspected to
 * send X-Frame-Options / frame-ancestors is marked `mode: 'launch'` and gets a
 * button that opens a new tab instead of a dead grey box. NVIDIA's playground
 * is in that bucket: it is behind a login and is not an embeddable widget.
 *
 * ── Maintenance ────────────────────────────────────────────────────────
 * Community Spaces move, sleep, or get deleted. This file is the single place
 * to fix that: change `owner`/`name`, or flip `mode` to 'launch'. The UI
 * always renders an "open in a new tab" affordance next to an embed, so a
 * Space that stops framing degrades into a working link rather than a break.
 *
 * NOTE: the URLs below could not be liveness-checked from the build
 * environment (egress to huggingface.co is blocked there). Verify in a browser
 * before a classroom relies on any single one.
 */

export type LiveLabMode = 'embed' | 'launch';

export interface LiveLab {
    id: string;
    title: string;
    /** What the learner should notice — shown above the frame. */
    teaches: string;
    /** The concrete thing to try, so nobody stares at a blank prompt box. */
    tryThis: string;
    provider: 'huggingface' | 'nvidia';
    mode: LiveLabMode;
    /** For Hugging Face Spaces. */
    owner?: string;
    name?: string;
    /** For launch-only entries, or to override the derived URL. */
    url?: string;
    /** Runs entirely in the learner's browser — no queue, no server cost. */
    onDevice?: boolean;
    /** Iframe height at desktop widths. */
    height?: number;
    /** Permissions the embed genuinely needs. */
    allow?: string;
}

/** Hugging Face's documented Space embed host. */
export const spaceUrl = (owner: string, name: string): string => {
    const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return `https://${slug(owner)}-${slug(name)}.hf.space`;
};

export const liveLabUrl = (lab: LiveLab): string => (
    lab.url ?? (lab.owner && lab.name ? spaceUrl(lab.owner, lab.name) : '')
);

export const LIVE_LABS: LiveLab[] = [
    {
        id: 'flux-image',
        title: 'Real text-to-image, live',
        teaches: 'The prompt you write is the only instruction the model gets. Change one word and watch how much moves.',
        tryThis: 'Generate "a lighthouse in a storm". Then add "at golden hour, wide shot, calm" and compare.',
        provider: 'huggingface',
        mode: 'embed',
        owner: 'black-forest-labs',
        name: 'FLUX.1-schnell',
        height: 720,
    },
    {
        id: 'sdxl-turbo',
        title: 'Fast diffusion sandbox',
        teaches: 'Diffusion starts from noise and removes it step by step. Fewer steps means faster and rougher.',
        tryThis: 'Run the same prompt twice. The seed changes, so the picture changes — that is sampling, not the model changing its mind.',
        provider: 'huggingface',
        mode: 'embed',
        owner: 'stabilityai',
        name: 'stable-diffusion-3.5-large-turbo',
        height: 720,
    },
    {
        id: 'whisper-web',
        title: 'Speech recognition, on your device',
        teaches: 'This one downloads the model into your browser and never sends your audio anywhere. Local inference is a real privacy choice.',
        tryThis: 'Record a sentence with a proper noun in it. See what the model gets wrong, and think about why.',
        provider: 'huggingface',
        mode: 'embed',
        owner: 'Xenova',
        name: 'whisper-web',
        onDevice: true,
        height: 640,
        allow: 'microphone',
    },
    {
        id: 'bg-removal',
        title: 'Segmentation you can see',
        teaches: 'Removing a background means the model decided, pixel by pixel, what counts as "subject".',
        tryThis: 'Upload something with messy edges — hair, leaves, glass. That is where segmentation gets hard.',
        provider: 'huggingface',
        mode: 'embed',
        owner: 'not-lain',
        name: 'background-removal',
        height: 640,
    },
    {
        id: 'arena',
        title: 'Blind model comparison',
        teaches: 'Two models answer the same prompt anonymously and you pick the better one. This is how leaderboards are actually built.',
        tryThis: 'Ask something you already know the answer to. Judging is much easier when you can check.',
        provider: 'huggingface',
        mode: 'embed',
        owner: 'lmarena-ai',
        name: 'chatbot-arena-leaderboard',
        height: 760,
    },
    {
        id: 'nvidia-playground',
        title: 'NVIDIA model playground',
        teaches: 'Production model catalogues expose the same knobs you have been using: system prompt, temperature, token limit.',
        tryThis: 'Open a model card and change temperature from 0.2 to 1.0 on the same prompt. Watch the answer loosen.',
        provider: 'nvidia',
        // Login-gated and not an embeddable widget — always opens in a new tab.
        mode: 'launch',
        url: 'https://build.nvidia.com/explore/discover',
    },
];

export const getLiveLab = (id: string): LiveLab | undefined => LIVE_LABS.find((lab) => lab.id === id);

/**
 * Which live labs belong on which quest. Keyed by curriculum section id so a
 * quest picks up its labs without touching page code.
 */
export const LIVE_LABS_BY_SECTION: Record<string, string[]> = {
    'm1-s1': ['arena'],
    'm1-s2': ['flux-image', 'sdxl-turbo', 'bg-removal'],
    'm2-s3': ['arena', 'nvidia-playground'],
    'm2-s4': ['nvidia-playground'],
    'm3-s6': ['whisper-web'],
};

export const liveLabsForSection = (sectionId: string): LiveLab[] => (
    (LIVE_LABS_BY_SECTION[sectionId] ?? [])
        .map(getLiveLab)
        .filter((lab): lab is LiveLab => Boolean(lab))
);
