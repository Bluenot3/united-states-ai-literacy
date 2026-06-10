// AI Pioneer Program Curriculum - Youth Ages 11-18
import type { ProgramCurriculum, ProgramResourceContentItem } from '../../types';

const app = (
    title: string,
    what: string,
    why: string,
    href?: string,
    status: ProgramResourceContentItem['status'] = 'External',
    options: Pick<ProgramResourceContentItem, 'embed' | 'instructions' | 'completionHint' | 'interactive'> = {},
): ProgramResourceContentItem => ({
    type: 'resource',
    title,
    what,
    why,
    href,
    status,
    ...options,
});

export const pioneerCurriculum: ProgramCurriculum = {
    title: 'ZEN AI Pioneer Program',
    description: 'Build, launch, and showcase real AI tools through a compact 4-module, 8-section builder path.',
    sections: [
        {
            id: 'module-1',
            title: 'Module 1: Foundations and Creative AI',
            icon: 'M1',
            content: [
                { type: 'heading', content: 'What you will do' },
                {
                    type: 'list',
                    content: [
                        'Understand ZEN-X, generative AI, prompts, and safe tool use.',
                        'Explore prompt, image, benchmark, dashboard, and API demos.',
                        'Choose a mission badge and capture your first build direction.',
                    ],
                },
                {
                    type: 'callout',
                    title: 'Estimated time',
                    content: 'Two self-paced sections. Explore the tools, capture evidence, and move to the build checkpoint when your work is clear.',
                    tone: 'info',
                },
            ],
            subSections: [
                {
                    id: 'm1-s1',
                    title: 'Section 1: Welcome, ZEN-X, and Prompt Play',
                    icon: '01',
                    content: [
                        { type: 'heading', content: 'Learn' },
                        {
                            type: 'paragraph',
                            content: 'Welcome to the AI Pioneer Program. This opening section turns AI from a mystery into a set of tools you can test, question, and use with good judgment.',
                        },
                        {
                            type: 'callout',
                            title: 'How this first section works',
                            content: 'You will learn one core idea at a time, try the matching interactive app, save one piece of evidence, then move to the next checkpoint. You do not need to know coding or advanced AI vocabulary before you start.',
                            tone: 'success',
                        },
                        {
                            type: 'callout',
                            title: 'What is AI?',
                            content: 'Artificial intelligence is software that can recognize patterns, follow instructions, generate content, and help people make or analyze things. It is powerful, but it still needs human goals, judgment, and safety checks.',
                            tone: 'info',
                        },
                        {
                            type: 'callout',
                            title: 'What is a prompt?',
                            content: 'A prompt is the instruction you give an AI system. A weak prompt is vague. A strong prompt gives the task, context, details, constraints, and the output you want.',
                            tone: 'info',
                        },
                        {
                            type: 'callout',
                            title: 'ZEN-X in plain language',
                            content: 'ZEN-X is the course model for thinking about multimodal AI: text, image, code, simulation, and secure tool access working together.',
                            tone: 'info',
                        },
                        {
                            type: 'list',
                            content: [
                                'AI is the tool: it can generate, classify, summarize, code, simulate, and compare.',
                                'The prompt is the instruction: it tells the tool what job to do.',
                                'The output is the result: text, image, plan, code, answer, or decision support.',
                                'Your judgment is the control system: you check accuracy, safety, usefulness, and fairness.',
                            ],
                        },
                        {
                            type: 'list',
                            content: [
                                'Input: the question, image, file, setting, or instruction you give the system.',
                                'Model: the AI system that uses patterns and tool access to create a response.',
                                'Output: the answer, image, plan, code, comparison, or decision support you receive.',
                                'Human check: your review for accuracy, safety, usefulness, and fairness before sharing.',
                            ],
                        },
                        {
                            type: 'list',
                            content: [
                                'Start: write one simple idea and turn it into a better prompt.',
                                'Explore: compare model outputs, benchmarks, dashboards, and simulations.',
                                'Build: choose a social-good mission and capture your first evidence.',
                                'Reflect: explain where AI felt useful, surprising, or risky.',
                            ],
                        },
                        {
                            type: 'callout',
                            title: 'Your goal',
                            content: 'By the end of this section, you should be able to explain that AI tools do not "think" like humans. They respond to patterns, instructions, data, and tool access.',
                            tone: 'success',
                        },
                        { type: 'heading', content: 'Explore' },
                        app('AI Signal Loop', 'A visual map that shows how your input moves through a model, becomes an output, and comes back to you for a human check.', 'Use this first so AI feels like a system you can control, not a mystery box.', undefined, 'Ready', {
                            interactive: 'ai-signal-loop',
                            instructions: ['Choose a scenario.', 'Follow input, model, output, and human check.', 'Explain why the human check matters.'],
                            completionHint: 'This is the first concept to understand before using the other tools.',
                        }),
                        app('AI or Not AI? Checkpoint', 'A quick challenge where you decide whether everyday technology is using AI.', 'You will learn the difference between normal software, automation, and pattern-based AI.', undefined, 'Ready', {
                            interactive: 'ai-or-not-check',
                            instructions: ['Read each example.', 'Choose AI or not AI.', 'Check the explanation before moving on.'],
                        }),
                        app('AI Coach Console', 'A built-in coach that explains AI ideas in clear language and gives you one safety check.', 'Use it when a concept feels confusing, then explain the answer back in your own words.', undefined, 'Ready', {
                            interactive: 'ai-coach-console',
                            instructions: ['Choose a beginner question or write your own.', 'Ask the AI Coach if the AI proxy is connected.', 'Read the answer and explain the idea in your own words.'],
                            completionHint: 'This uses the secure server AI proxy when configured and shows a guide answer when offline.',
                        }),
                        app('AI Vocabulary Quest', 'A fast matching game for the words you will hear all through the program: AI, model, data, neural network, computer vision, and generative AI.', 'When the words become clear, the tools become less confusing and much easier to control.', undefined, 'Ready', {
                            interactive: 'ai-vocab-quest',
                            instructions: ['Choose a concept card.', 'Read the simple definition and example.', 'Mark the words you can explain in your own voice.'],
                        }),
                        app('Neural Network Lab', 'A visual mini-lab that shows how examples move through layers and become a prediction.', 'You will see why training examples, hidden patterns, and confidence scores matter before trusting an AI answer.', undefined, 'Ready', {
                            interactive: 'neural-network-lab',
                            instructions: ['Pick a scenario.', 'Adjust training examples and signal strength.', 'Explain how the model reaches a prediction.'],
                        }),
                        app('Computer Vision Scanner', 'A built-in scanner that breaks an image into pixels, edges, shapes, labels, and confidence.', 'You will learn that computer vision does not magically understand an image. It detects visual patterns and still needs a human check.', undefined, 'Ready', {
                            interactive: 'computer-vision-lab',
                            instructions: ['Choose a scene.', 'Select the visual clues the model should inspect.', 'Check the confidence and risk note.'],
                        }),
                        app('Model Behavior Mixer', 'A live control board that shows how data quality, context, noise, and human review change AI reliability.', 'You will learn why the same AI tool can be helpful, vague, or wrong depending on the signal you give it and the review you apply.', undefined, 'Ready', {
                            interactive: 'model-behavior-mixer',
                            instructions: ['Choose a model job.', 'Move the data, context, noise, and review controls.', 'Explain why the trust score changed.'],
                            completionHint: 'Use this to understand that AI is not magic. It reacts to signals, patterns, limits, and human checks.',
                        }),
                        app('Prompt Formula Builder', 'A step-by-step builder for task, context, details, limits, and output format.', 'Shows that strong prompts are built, not guessed.', undefined, 'Ready', {
                            interactive: 'prompt-formula-builder',
                            instructions: ['Fill in each prompt ingredient.', 'Read the generated prompt.', 'Use it as your first polished Section 1 artifact.'],
                        }),
                        app('Prompt Enhancer Studio', 'Type a rough idea and turn it into a clear instruction an AI tool can follow.', 'You will see how task, context, details, constraints, and output format make a prompt stronger.', 'https://v0-zen-ai-pioneer.vercel.app/', 'Ready', {
                            interactive: 'prompt-upgrader',
                            instructions: ['Type one rough idea.', 'Choose a goal and output format.', 'Upgrade it into a prompt you could actually use.'],
                            completionHint: 'The original prompt enhancer app is still available through Open tool for comparison.',
                        }),
                        app('Prompt Power Meter', 'A side-by-side simulator that shows how a basic prompt and a controlled prompt can produce very different results.', 'You will see prompting as control: clearer task, stronger boundaries, better output, and a smarter human check.', undefined, 'Ready', {
                            interactive: 'prompt-power-meter',
                            instructions: ['Type one rough idea.', 'Adjust specificity, constraints, and examples.', 'Compare the basic prompt with the controlled prompt before saving your strongest version.'],
                            completionHint: 'Use this after Prompt Enhancer Studio to see why prompt quality changes the result.',
                        }),
                        app('Starter Prompt Library', 'A starter deck of beginner-safe prompts you can remix before opening the full prompt library.', 'You will see how changing the subject, audience, goal, tone, and output changes what the AI gives back.', 'https://v0-prompt-list-improvements.vercel.app/', 'Ready', {
                            interactive: 'prompt-library',
                            instructions: ['Pick one prompt card.', 'Change one part of it.', 'Copy your improved version into your notes.'],
                            completionHint: 'Open the full prompt library only after you understand how to remix one prompt card here.',
                        }),
                        app('Prompt Remix Lab', 'A built-in playground for creative prompt remixing.', 'Practice improving a prompt in small steps without any setup or coding.', undefined, 'Ready', {
                            interactive: 'prompt-remix',
                            instructions: ['Type a rough idea.', 'Press Remix.', 'Compare the rough prompt with the upgraded prompt.'],
                        }),
                        app('Particle Control Lab', 'A mini visual controls lab where sliders and choices change what happens on screen.', 'You will see that AI-powered apps are controlled by settings, inputs, and design choices.', undefined, 'Ready', {
                            interactive: 'particle-lab',
                            instructions: ['Move the controls.', 'Change the effect type.', 'Notice how settings change the system preview.'],
                        }),
                        app('MC-Bench.ai Build-Off', 'A live Minecraft-style build-off for AI models.', 'You can see that AI models are compared by results people can inspect, vote on, and question.', 'https://mcbench.ai/', 'External', {
                            embed: true,
                            instructions: ['Open or view the build-off.', 'Read what users vote on.', 'Explain why human votes can become benchmark data.'],
                        }),
                        app('Top AI Models Dashboard', 'Interactive model/spec/facts comparison.', 'You will learn to compare AI models by strengths, limits, and use cases instead of hype.', 'https://v0-interactive-ai-dashboard-sable.vercel.app/', 'External', {
                            embed: true,
                            instructions: ['Compare two models.', 'Find one strength and one limitation.', 'Write down which model you would test first and why.'],
                        }),
                        app('AI Unlocked Simulation', 'A simulation showing how AI works.', 'Watch the AI pipeline move from input to processing to output so the system becomes easier to explain.', 'https://ai-unlocked-interactive-guide.lovable.app', 'External', {
                            embed: true,
                            instructions: ['Follow the simulation path.', 'Look for input, processing, and output.', 'Describe the AI pipeline in one sentence.'],
                        }),
                        app('API Key Orb', 'A safe training demo for revealing and using an API-style key.', 'Introduces the idea that tools need secure access credentials without exposing real secrets.', undefined, 'Demo', {
                            interactive: 'api-orb',
                            instructions: ['Click the orb.', 'Read the fake training key.', 'Explain why real keys must stay private.'],
                        }),
                        app('Mission Badge Selector', 'Choose a social-good mission badge for your first build direction.', 'Connect your AI practice to a purpose: helping people, communities, learning, or the planet.', undefined, 'Ready', {
                            interactive: 'mission-badges',
                            instructions: ['Read the badge options.', 'Choose one mission.', 'Use it to guide your first project idea.'],
                        }),
                        {
                            type: 'lab',
                            id: 'm1-s1-first-prompt',
                            title: 'Build checkpoint: first Pioneer prompt and mission',
                            objective: 'Create one starter prompt, improve it twice, and connect it to a social-good mission.',
                            steps: [
                                'Write a basic creative prompt.',
                                'Add subject, style, details, and safety boundaries.',
                                'Test the prompt in one playground or embedded app.',
                                'Choose a mission badge that gives the prompt a purpose.',
                                'Save the best prompt, result, or screenshot.',
                            ],
                            expectedOutput: 'A polished prompt, one saved result or screenshot, and one selected mission badge.',
                            reflectionPrompt: 'What changed when you made the prompt more specific, and how could your mission badge shape the project?',
                        },
                    ],
                },
                {
                    id: 'm1-s2',
                    title: 'Section 2: Prompt, Image, Chatbots, and Deepfakes',
                    icon: '02',
                    content: [
                        { type: 'heading', content: 'Learn' },
                        {
                            type: 'paragraph',
                            content: 'This section moves from simple prompting into image creation, chatbot anatomy, file references, and responsible evaluation of synthetic media.',
                        },
                        {
                            type: 'callout',
                            title: 'Creative quality loop',
                            content: 'Your goal is not one perfect answer on the first try. Your goal is to describe, generate, inspect, improve, and save evidence of what changed.',
                            tone: 'info',
                        },
                        {
                            type: 'list',
                            content: [
                                'Prompt architecture: subject, style, lighting, composition, detail, aspect ratio, and constraints.',
                                'Image workflow: idea, refined prompt, generation, review, save.',
                                'Chatbot anatomy: tokenizer, formatter, network request, stream processor, and renderer.',
                                'Deepfake literacy: source checking, visual clues, intent, and trust boundaries.',
                            ],
                        },
                        {
                            type: 'callout',
                            title: 'Your goal',
                            content: 'By the end of this section, you should be able to design a stronger image prompt, explain the basic parts of a chatbot, and name one way synthetic media can be misused.',
                            tone: 'success',
                        },
                        { type: 'heading', content: 'Explore' },
                        app('Image Prompt Recipe Builder', 'A built-in image prompt builder for subject, setting, style, camera, lighting, and safety limits.', 'Use the recipe pieces to create stronger visuals without staring at a blank prompt box.', undefined, 'Ready', {
                            interactive: 'image-recipe-builder',
                            instructions: ['Choose the visual ingredients.', 'Read the generated image prompt.', 'Save or copy the version you would test.'],
                        }),
                        app('Diffusion Image Lab', 'A visual simulator that turns noise into structure, details, and a final image direction.', 'You will understand the basic idea behind many image generators: start from noise, follow the prompt, and refine step by step.', undefined, 'Ready', {
                            interactive: 'diffusion-lab',
                            instructions: ['Move the generation stage.', 'Change the prompt ingredients.', 'Explain what changes between noise and final image.'],
                        }),
                        app('Generative Quality Lens', 'A visual control board for checking how prompt clarity, style direction, safety, and evidence change media quality.', 'You will learn how to guide image, audio, and video tools with quality controls instead of only hoping the first result is good.', undefined, 'Ready', {
                            interactive: 'media-quality-lens',
                            instructions: ['Choose a media type.', 'Tune the quality controls.', 'Use the final prompt and review checklist before generating or sharing.'],
                            completionHint: 'This prepares you to use the Generative Media Studio with better control.',
                        }),
                        app('Generative Media Studio', 'A native studio for comparing text, image, audio, and video generation recipes.', 'You will see that generative media uses the same core loop: prompt, model, output, review, and improve.', undefined, 'Demo', {
                            interactive: 'generative-media-lab',
                            instructions: ['Choose a media type.', 'Write a short idea.', 'Generate a studio brief or use the offline coach if AI is not connected.'],
                        }),
                        app('Prompt Pioneer Playground', 'A tool for remixing and strengthening prompts.', 'Practice iteration: test, improve, compare, and keep the best version.', 'https://prompt-pioneer-play.lovable.app', 'Ready', {
                            embed: true,
                            instructions: ['Type a simple idea.', 'Remix it.', 'Copy the best version for your image prompt.'],
                        }),
                        app('Advanced Prompt Architect', 'A structured image-prompt builder with style, lighting, composition, aspect ratio, and negative prompt thinking.', 'Think like a prompt architect: choose the ingredients instead of hoping the tool guesses correctly.', undefined, 'Demo', {
                            interactive: 'prompt-architect',
                            instructions: ['Define a subject.', 'Choose style and lighting.', 'Generate a refined prompt you could use in an image tool.'],
                        }),
                        app('Pioneer Studio', 'A creative studio for core vision, remixing, style direction, and technical parameters.', 'Keeps prompts, image settings, and build notes organized for later showcase evidence.', undefined, 'Demo', {
                            interactive: 'pioneer-studio',
                            instructions: ['Enter a core vision.', 'Tune complexity, sharpness, and aspect ratio.', 'Save the studio brief.'],
                        }),
                        app('Chatbot Design Anatomy', 'An interactive chatbot interface anatomy demo.', 'Shows that a chatbot is a system: input, formatting, network, streaming, and rendering.', 'https://v0-ai-chatbot-design-anatomy.vercel.app/', 'External', {
                            embed: true,
                            interactive: 'chatbot-anatomy',
                            instructions: ['Open the anatomy demo if the embed is blocked.', 'Find tokenizer, formatter, network, stream processor, and renderer.', 'Write what each part does.'],
                        }),
                        app('Power of an API Key', 'A live API demo for tool-powered AI.', 'Shows why keys must be protected and how apps connect to models.', 'https://v0-open-ai-api-demo.vercel.app/', 'Requires key', {
                            embed: true,
                            instructions: ['Use only a training or demo key provided inside the course.', 'Never paste a personal real key into a public or unknown page.', 'Notice which features need secure access.'],
                        }),
                        app('Deepfake Trust Check', 'A built-in media-literacy check for AI-generated images, audio, and video.', 'Practice slowing down, checking the source, and asking what could be fake before you share.', undefined, 'Ready', {
                            interactive: 'deepfake-check',
                            instructions: ['Read the scenario.', 'Choose the safest response.', 'Write one trust rule.'],
                        }),
                        app('Mission Badge Selector', 'Choose or revise your social-good mission badge.', 'Connects building with purpose and responsible impact.', undefined, 'Demo', {
                            interactive: 'mission-badges',
                            instructions: ['Choose one badge.', 'Write how your image/chatbot idea could support that mission.'],
                        }),
                        {
                            type: 'lab',
                            id: 'm1-s2-image-chatbot',
                            title: 'Build checkpoint: image plus chatbot map',
                            objective: 'Create a better image prompt and explain one chatbot pipeline.',
                            steps: [
                                'Generate or draft a high-quality image prompt.',
                                'Label the main parts of a chatbot response flow.',
                                'Write one deepfake safety rule.',
                                'Choose one mission badge.',
                            ],
                            expectedOutput: 'Image prompt, chatbot anatomy note, deepfake rule, and mission badge.',
                            reflectionPrompt: 'Where should you be most careful when using image or chatbot tools?',
                        },
                    ],
                },
            ],
        },
        {
            id: 'module-2',
            title: 'Module 2: Models, Modalities & First Deployment',
            icon: 'M2',
            content: [
                { type: 'heading', content: 'What you will do' },
                {
                    type: 'list',
                    content: [
                        'Compare AI models across text, image, audio, video, 3D, and code.',
                        'Pick the right model for the right job and back it up with evidence.',
                        'Prepare or deploy your first public AI app: the ZEN Text Genie on Hugging Face Spaces.',
                    ],
                },
                {
                    type: 'callout',
                    title: 'Why this module matters',
                    content: 'This is where you stop being only an AI user and start becoming an AI builder. By the end you will know which model to reach for, and you will have a real plan (or live URL) for a public AI app with your name on it.',
                    tone: 'info',
                },
            ],
            subSections: [
                {
                    id: 'm2-s3',
                    title: 'Section 1: Models, Modalities & the Arena',
                    icon: '01',
                    content: [
                        { type: 'heading', content: 'Module 2 · Week 3 · Section 1' },
                        {
                            type: 'callout',
                            title: 'Core question',
                            content: 'Which AI should I use for which job?',
                            tone: 'info',
                        },
                        {
                            type: 'callout',
                            title: 'Student outcome',
                            content: 'You can compare AI models across text, image, audio, video, 3D, and code, name what each model is strong and weak at, and defend your pick for a real task with evidence.',
                            tone: 'success',
                        },
                        { type: 'heading', content: 'Learn' },
                        {
                            type: 'paragraph',
                            content: 'Not all AI models are good at the same job. A model that writes great essays may stumble at math. An image model may be amazing at portraits and useless at charts. A great AI builder picks the right model for the mission instead of using one model for everything.',
                        },
                        {
                            type: 'list',
                            content: [
                                'Modality is the kind of input or output a model handles: text, image, audio, video, 3D, or code.',
                                'Capability is what the model is actually good at: reasoning, summarizing, drawing, coding, transcribing, translating.',
                                'Cost and speed matter: bigger is not always better, especially for fast or cheap tasks.',
                                'Safety and limits matter: every model has things it should refuse or warn about.',
                            ],
                        },
                        {
                            type: 'callout',
                            title: 'Helper for younger Pioneers',
                            content: 'Think of AI models like athletes. Some are sprinters, some are swimmers, some are climbers. They are all elite, but you would not send a swimmer up a mountain. Your job is to be the coach who picks the right athlete for the event.',
                            tone: 'info',
                        },
                        { type: 'heading', content: 'Modality cards' },
                        app('Text models', 'Models like GPT, Claude, Gemini, and Llama. They read and write language: essays, summaries, plans, ideas, conversations.', 'Best for writing, explaining, planning, tutoring, brainstorming, and structured reasoning.', undefined, 'Ready', {
                            instructions: ['Pick a real text task you do every week.', 'Predict which text model would handle it best.', 'Note one weakness to watch out for.'],
                            completionHint: 'Launch card — no interactive, used as a teaching card.',
                        }),
                        app('Image models', 'Models like Imagen, DALL·E, Midjourney, Flux, and Stable Diffusion. They turn prompts into pictures.', 'Best for art direction, mockups, illustrations, mood boards, and visual storytelling. Weak at exact text inside images and precise diagrams.', undefined, 'Ready', {
                            instructions: ['Describe one visual you wish you had.', 'Pick a model you would try first.', 'Note one thing the model probably cannot do well.'],
                        }),
                        app('Audio models', 'Speech-to-text (Whisper), text-to-speech (ElevenLabs, PlayHT), and music tools (Suno, Udio).', 'Best for transcription, narration, podcasts, voiceovers, and music sketches. Weak at copying real people without permission — that is a safety line, not a feature.', undefined, 'Ready', {
                            instructions: ['Choose a real audio job: notes, voiceover, song.', 'Pick one model.', 'Write one rule about consent before cloning a voice.'],
                        }),
                        app('Video models', 'Models like Veo, Sora, Runway, Kling, and Pika. They generate short clips from text or images.', 'Best for short scenes, social clips, and storyboards. Weak at long, consistent characters and high-stakes realism.', undefined, 'Ready', {
                            instructions: ['Write one short clip idea.', 'Pick a model.', 'Note one limit (length, characters, motion).'],
                        }),
                        app('3D models', 'Tools like Trellis, Hunyuan 3D, Meshy, and Luma. They generate 3D meshes or scenes.', 'Best for game assets, prototypes, AR, and product mockups. Still early — expect to clean up the output.', undefined, 'Ready', {
                            instructions: ['Pick a 3D object you would want.', 'Choose a tool to try.', 'Note one cleanup step you would expect.'],
                        }),
                        app('Code models', 'Models like GPT-Codex, Claude Code, Gemini Code, and open models from Hugging Face. They write, explain, and debug code.', 'Best for boilerplate, refactors, explanations, and pair-programming. Weak when the task is vague or when no tests exist.', undefined, 'Ready', {
                            instructions: ['Pick a small coding task.', 'Choose a code model.', 'Write one test you would run before trusting the output.'],
                        }),
                        { type: 'heading', content: 'Explore' },
                        app('AI Arena — model comparison', 'Open a live model arena (Chatbot Arena or LMSYS) and put two models head-to-head on the same prompt.', 'You will see that the same prompt produces different answers. The Arena is how the AI community decides which model wins, blind.', 'https://lmarena.ai/', 'External', {
                            embed: true,
                            instructions: ['Open the Arena.', 'Send the same prompt to two anonymous models.', 'Vote for the better answer and note why.'],
                        }),
                        app('Model strengths & weaknesses card', 'A printable/scrollable map of what top models do well and where they fall short.', 'Helps you stop guessing and start choosing models like a pro.', undefined, 'Ready', {
                            instructions: ['Scroll the strengths column.', 'Find one model that fits your project.', 'Write down its biggest known weakness.'],
                            completionHint: 'Launch card — pair this with the Arena activity above.',
                        }),
                        app('Choose the best model for the mission', 'A short scenario sorter: given a real task, pick the modality and a model family that fits it.', 'This is the core skill of Module 2: matching the model to the mission.', undefined, 'Ready', {
                            instructions: ['Read each scenario card.', 'Pick a modality (text, image, audio, video, 3D, code).', 'Pick one model family and defend the choice in one sentence.'],
                        }),
                        app('Token & cost simulator', 'A lightweight calculator: estimate how many tokens a prompt + response uses and what it might cost.', 'AI is not free. Builders who understand cost ship apps that actually survive.', undefined, 'Demo', {
                            instructions: ['Paste a typical prompt.', 'Estimate input and output tokens.', 'Multiply by a published price to see daily cost at 100 users.'],
                            completionHint: 'Launch card — coming next as a built-in interactive. For now, use OpenAI / Anthropic / Google pricing pages as references.',
                        }),
                        app('3-Provider Comparison Report template', 'A simple report shape: same prompt, three providers, side-by-side answers, your pick, and your reason.', 'This is the artifact you will turn in for this section. It proves you can compare models like an analyst.', undefined, 'Ready', {
                            instructions: ['Pick one real prompt.', 'Run it on three providers (any combination of GPT, Claude, Gemini, Llama, Mistral, etc.).', 'Fill the report: winner, why, and one risk.'],
                            completionHint: 'You will submit this as the artifact for Section 1.',
                        }),
                        {
                            type: 'callout',
                            title: 'Advanced challenge (older Pioneers)',
                            content: 'Run the same prompt on an open-weights model (Llama 3, Mistral, Qwen) via Hugging Face and on a frontier closed model. Defend whether the open model is "good enough" for your use case — and explain when you would still pay for the frontier model.',
                            tone: 'warning',
                        },
                        { type: 'heading', content: 'Artifact checkpoint' },
                        {
                            type: 'lab',
                            id: 'm2-s3-model-comparison-report',
                            title: 'Artifact: Model Comparison Report',
                            objective: 'Produce a 3-provider comparison report and defend your model pick for one real task.',
                            steps: [
                                'Choose one real task you actually care about.',
                                'Run the same prompt on three different AI models.',
                                'Capture each response (paste, screenshot, or link).',
                                'Pick a winner and write one paragraph: why it won, what it lost on, and one risk.',
                                'Save the report — link, doc, PDF, or screenshot — as your Section 1 artifact.',
                            ],
                            expectedOutput: 'A Model Comparison Report (link, doc, or image) showing 3 providers, your pick, and your reason.',
                            reflectionPrompt: 'The best model for my task was ___ because…',
                        },
                        {
                            type: 'callout',
                            title: 'Completion CTA',
                            content: 'Save your Model Comparison Report and reflection, then mark this section complete. Section 2 is where you ship your first real AI app.',
                            tone: 'success',
                        },
                    ],
                },
                {
                    id: 'm2-s4',
                    title: 'Section 2: Ship 1 — ZEN Text Genie',
                    icon: '02',
                    content: [
                        { type: 'heading', content: 'Module 2 · Week 4 · Section 2' },
                        {
                            type: 'callout',
                            title: 'Core question',
                            content: 'Can I put a working AI app on the internet?',
                            tone: 'info',
                        },
                        {
                            type: 'callout',
                            title: 'Student outcome',
                            content: 'You prepare or deploy your first public AI app — the ZEN Text Genie — on a Hugging Face Space, using a safe API-key pattern and a real deployment checklist.',
                            tone: 'success',
                        },
                        { type: 'heading', content: 'Learn' },
                        {
                            type: 'paragraph',
                            content: 'Until now you have used other people\'s AI apps. In Ship 1 you build and publish your own. The ZEN Text Genie is a tiny text-generation app: a user types a prompt, your app calls an AI model, your app returns the response — live on the internet, with your name on it.',
                        },
                        {
                            type: 'list',
                            content: [
                                'Hugging Face Spaces is a free hosting platform for AI apps.',
                                'Gradio is a Python library that turns a function into a web UI in about 15 lines.',
                                'Every Space needs at minimum: app.py, requirements.txt, and a README.md.',
                                'Your API key is a secret. It goes in Space Secrets — never in your code, never in a screenshot.',
                            ],
                        },
                        {
                            type: 'callout',
                            title: 'Helper for younger Pioneers',
                            content: 'Think of a Hugging Face Space like a tiny website that runs a tiny AI app. You give it the recipe (app.py), the ingredients list (requirements.txt), and the menu (README.md). Hugging Face does the cooking and serving.',
                            tone: 'info',
                        },
                        { type: 'heading', content: 'Hugging Face Spaces explainer' },
                        app('What is a Hugging Face Space?', 'Free hosting for AI apps. You push code, Hugging Face runs it, you get a public URL.', 'This is the cleanest path from "I have an idea" to "anyone in the world can try it."', 'https://huggingface.co/spaces', 'External', {
                            instructions: ['Open the Spaces homepage.', 'Browse two Gradio Spaces you like.', 'Note one feature you would copy.'],
                        }),
                        app('Gradio app template', 'A starter Gradio app you can copy: input box, button, output box.', 'You will adapt this exact template for the ZEN Text Genie.', 'https://www.gradio.app/guides/quickstart', 'External', {
                            instructions: ['Read the quickstart.', 'Find the "Interface" pattern.', 'Decide what your input and output will be.'],
                        }),
                        {
                            type: 'heading',
                            content: 'What files does my Space need?',
                        },
                        app('app.py', 'The Python file that defines your AI app. This is the heart of the Space.', 'Everything the user clicks, types, and sees comes from here.', undefined, 'Ready', {
                            instructions: ['Open the code sample below.', 'Find the function the user actually triggers.', 'Find where the API key is read from environment variables.'],
                        }),
                        app('requirements.txt', 'A plain-text list of Python packages your Space needs (gradio, openai, etc.).', 'Without this file, Hugging Face does not know what to install — your Space will not boot.', undefined, 'Ready', {
                            instructions: ['List every package your app imports.', 'Pin versions for stability if you can.', 'Keep it short — only what you actually use.'],
                        }),
                        app('README.md', 'A markdown file describing your Space + a YAML header Hugging Face reads for the title, emoji, color, and SDK.', 'This is what users see first. Make it clear, honest, and proud.', undefined, 'Ready', {
                            instructions: ['Write a one-sentence purpose.', 'List one thing the app does well.', 'List one thing it cannot do (be honest).'],
                        }),
                        { type: 'heading', content: 'Starter code: ZEN Text Genie (app.py)' },
                        {
                            type: 'code',
                            language: 'python',
                            content: `import os
import gradio as gr
from openai import OpenAI

# Read the key from Hugging Face Space Secrets.
# NEVER hardcode a real key. The demo placeholder below
# is intentionally fake and safe to share.
API_KEY = os.environ.get("OPENAI_API_KEY", "sk-demo-REPLACE_WITH_YOUR_OWN_KEY")
client = OpenAI(api_key=API_KEY)

SYSTEM_PROMPT = (
    "You are the ZEN Text Genie. You write clear, useful, "
    "age-appropriate responses for students 11-18. "
    "If the user asks for something unsafe, refuse politely."
)

def genie(user_prompt: str) -> str:
    if not user_prompt.strip():
        return "Type a prompt to wake the Genie."
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
    )
    return response.choices[0].message.content

demo = gr.Interface(
    fn=genie,
    inputs=gr.Textbox(label="Your prompt", lines=4),
    outputs=gr.Textbox(label="Genie response", lines=10),
    title="ZEN Text Genie",
    description="Built by a ZEN AI Pioneer.",
)

if __name__ == "__main__":
    demo.launch()
`,
                        },
                        {
                            type: 'code',
                            language: 'text',
                            content: `gradio>=4.0.0
openai>=1.0.0
`,
                        },
                        { type: 'heading', content: 'Safe API key pattern' },
                        {
                            type: 'callout',
                            title: 'Key safety — non-negotiable',
                            content: 'Real keys never go into app.py, never into git, never into screenshots, never into chat with strangers. Use Hugging Face Space Secrets. If a key ever leaks, rotate it immediately.',
                            tone: 'warning',
                        },
                        app('Demo key field (safe)', 'A masked input you can use to practice the pattern with a fake placeholder key. Your key is never saved.', 'Builds the muscle memory of masking, not logging, and not committing keys.', undefined, 'Demo', {
                            interactive: 'api-orb',
                            instructions: ['Open the demo field.', 'Paste the placeholder key sk-demo-REPLACE_WITH_YOUR_OWN_KEY.', 'Confirm the field is masked and never persisted.'],
                            completionHint: 'Demo only. Backend handled by Codex — no real key is sent anywhere.',
                        }),
                        { type: 'heading', content: 'Deployment checklist' },
                        {
                            type: 'list',
                            content: [
                                'Create a free Hugging Face account.',
                                'Click "New Space" and choose the Gradio SDK.',
                                'Upload (or paste) app.py, requirements.txt, and README.md.',
                                'Go to Settings → Variables and Secrets and add OPENAI_API_KEY.',
                                'Wait for the Space to build (1–3 minutes).',
                                'Open the public URL and test one prompt.',
                                'Copy the URL — this is your artifact.',
                            ],
                        },
                        { type: 'heading', content: 'Error interpreter' },
                        app('Common deploy errors', 'A quick reference for the 5 errors most first-time Spaces hit.', 'When something breaks, you want a checklist — not panic.', undefined, 'Ready', {
                            instructions: [
                                'ModuleNotFoundError → add the package to requirements.txt.',
                                'AuthenticationError → your key is missing or wrong; check Space Secrets.',
                                'Space build failed → open the build log; usually requirements.txt typo.',
                                'App is stuck on "loading" → demo.launch() probably missing or indented wrong.',
                                'Rate limit → switch to a smaller model or add a usage note in README.md.',
                            ],
                        }),
                        { type: 'heading', content: 'Launch readiness checklist' },
                        {
                            type: 'list',
                            content: [
                                'My Space has a clear title and a one-sentence description.',
                                'My README explains what the app does and what it cannot do.',
                                'My API key is in Secrets, not in app.py.',
                                'I tested at least three prompts and the responses are reasonable.',
                                'I have the public URL ready to submit.',
                            ],
                        },
                        { type: 'heading', content: 'Submit your Space' },
                        app('Submit Hugging Face Space URL or Deployment Plan', 'Drop your live Space URL — or, if you have not deployed yet, paste your written deployment plan.', 'Either path counts as the Ship 1 artifact. Backend submission is handled by Codex; for now, paste it in your Pioneer notes or share it with your facilitator.', undefined, 'Ready', {
                            instructions: [
                                'If deployed: copy the huggingface.co/spaces/your-name/zen-text-genie URL.',
                                'If not deployed yet: write a 5-line plan (files, model, key location, test prompt, launch date).',
                                'Save it in your Pioneer notebook for facilitator review.',
                            ],
                            completionHint: 'Backend handled by Codex — real submission endpoint coming next.',
                        }),
                        {
                            type: 'callout',
                            title: 'Advanced challenge (older Pioneers)',
                            content: 'Upgrade the ZEN Text Genie: add gr.Examples for one-click demos, restyle with a custom theme, add a temperature slider, and replace the system prompt with a persona of your own. Document each upgrade in the README.',
                            tone: 'warning',
                        },
                        { type: 'heading', content: 'Artifact checkpoint' },
                        {
                            type: 'lab',
                            id: 'm2-s4-text-genie-ship',
                            title: 'Artifact: ZEN Text Genie URL or Deployment Plan',
                            objective: 'Ship the ZEN Text Genie or produce a deployment plan strong enough to ship from.',
                            steps: [
                                'Adapt the starter app.py to your own purpose and system prompt.',
                                'Prepare requirements.txt and a README.md with title, purpose, and limits.',
                                'Either deploy to Hugging Face Spaces with your key in Secrets, or write a complete deployment plan.',
                                'Test three prompts (if deployed) and capture the public URL.',
                                'Submit the URL or the plan as your Ship 1 artifact.',
                            ],
                            expectedOutput: 'A live ZEN Text Genie URL on Hugging Face, or a written deployment plan with files, key strategy, and launch steps.',
                            reflectionPrompt: 'The hardest part of deploying was…',
                        },
                        {
                            type: 'callout',
                            title: 'Completion CTA',
                            content: 'Save your Space URL (or your plan) and your reflection, then mark this section complete. Module 3 takes the Genie pattern and pushes it into code-generation and grounded knowledge apps.',
                            tone: 'success',
                        },
                    ],
                },
            ],
        },
        {
            id: 'module-3',
            title: 'Module 3: Working AI Apps and Launch Prep',
            icon: 'M3',
            content: [
                { type: 'heading', content: 'What you will do' },
                {
                    type: 'list',
                    content: [
                        'Review the first half and compare stronger AI systems.',
                        'Use dashboards, science simulations, model labs, and agent frameworks.',
                        'Prepare a public Hugging Face launch direction.',
                    ],
                },
            ],
            subSections: [
                {
                    id: 'm3-s5',
                    title: 'Section 5: Review, Dashboards, Science, and Agents',
                    icon: '05',
                    content: [
                        { type: 'heading', content: 'Learn' },
                        {
                            type: 'paragraph',
                            content: 'Students consolidate the first half, inspect stronger tools, and connect AI literacy to science, dashboards, agents, and model experimentation.',
                        },
                        { type: 'heading', content: 'Explore' },
                        app('Interactive Stats Dashboard', 'A dashboard for reviewing AI stats and patterns.', 'Builds the habit of comparing evidence instead of guessing.', undefined, 'Demo'),
                        app('AI Review App', 'A structured review tool for checking project quality.', 'Supports better iteration before launch.', undefined, 'Demo'),
                        app('NASA / Science Simulation', 'A science-focused AI simulation activity.', 'Shows AI as a tool for discovery and explanation.', undefined, 'External'),
                        app('NVIDIA Build', 'NVIDIA learning/build resources.', 'Connect your project ideas to industry-grade AI tooling.', 'https://build.nvidia.com/', 'External'),
                        app('Google Labs', 'Experimental Google AI tools.', 'Observe where AI products are heading and what new interfaces make possible.', 'https://labs.google/', 'External'),
                        app('AI Test Kitchen / Data Science Agent', 'Experimental AI and data science workflows.', 'Introduces testing, analysis, and agent-assisted work.', undefined, 'External'),
                        app('TensorFlow Playground', 'A visual neural-network playground.', 'Makes model training and decision boundaries visible.', 'https://playground.tensorflow.org/', 'External'),
                        app('Enhanced AI Agent Framework', 'A structured view of observe, think, act, and repeat.', 'Prepare for tool-using AI systems by seeing the agent loop clearly.', undefined, 'Demo'),
                        {
                            type: 'lab',
                            id: 'm3-s5-agent-review',
                            title: 'Build checkpoint: agent review card',
                            objective: 'Review your project through the lens of an AI agent.',
                            steps: [
                                'List what the app observes from the user.',
                                'List what it decides or generates.',
                                'List any tool, model, or data source it uses.',
                                'Write one test you should run before sharing.',
                            ],
                            expectedOutput: 'An agent review card with one launch-readiness test.',
                            reflectionPrompt: 'What could your app get wrong, and how will you warn users?',
                        },
                    ],
                },
                {
                    id: 'm3-s6',
                    title: 'Section 6: Create, Launch Direction, and HF Space',
                    icon: '06',
                    content: [
                        { type: 'heading', content: 'Learn' },
                        {
                            type: 'paragraph',
                            content: 'Students move from exploring into launching: image generation, trends, API/tool access, and a Hugging Face Space direction.',
                        },
                        { type: 'heading', content: 'Explore' },
                        app('Image Generation Studio', 'A focused image-generation workflow.', 'Improve your project visuals and prompts with a repeatable quality loop.', undefined, 'Demo'),
                        app('ZEN Trends Board', 'A board for tracking AI trends and project ideas.', 'Connect your builds to real-world changes you can explain.', undefined, 'Demo'),
                        app('API Orb / Tool Access', 'A reminder flow for using keys and tool access safely.', 'Keeps deployment habits secure before public launch.', undefined, 'Requires key'),
                        app('Hugging Face Spaces', 'A place to publish a live AI app.', 'Create a public demo URL and real deployment proof when your project is ready.', 'https://huggingface.co/spaces', 'External'),
                        app('AI-Powered Game Generator', 'Optional game generation if time allows.', 'Adds a playful stretch path without making the core course longer.', undefined, 'Optional'),
                        {
                            type: 'lab',
                            id: 'm3-s6-space-plan',
                            title: 'Build checkpoint: Hugging Face launch plan',
                            objective: 'Prepare a safe public launch direction.',
                            steps: [
                                'Choose Image Generator, Game Generator, or another approved tool.',
                                'Name the Space and write a short description.',
                                'List required files and secrets.',
                                'Write one responsible AI note for the README.',
                            ],
                            expectedOutput: 'Hugging Face Space launch plan with files, secrets, and README note.',
                            reflectionPrompt: 'What should never be pasted into code, screenshots, or public notes?',
                        },
                    ],
                },
            ],
        },
        {
            id: 'module-4',
            title: 'Module 4: Showcase, Credential, and Next Build',
            icon: 'M4',
            content: [
                { type: 'heading', content: 'What you will do' },
                {
                    type: 'list',
                    content: [
                        'Improve, automate, and share your creation.',
                        'Prepare final screenshots, README notes, demo script, and evidence pack.',
                        'Complete the showcase reflection and next 7-day build plan.',
                    ],
                },
            ],
            subSections: [
                {
                    id: 'm4-s7',
                    title: 'Section 7: Launch, Automate, and Prepare Final Innovation',
                    icon: '07',
                    content: [
                        { type: 'heading', content: 'Learn' },
                        {
                            type: 'paragraph',
                            content: 'This section is about improving the creation so it feels ready to show. Students focus on stronger visuals, better generation quality, and clear sharing.',
                        },
                        { type: 'heading', content: 'Explore' },
                        app('ZEN AI Visions', 'A creative image focus workspace.', 'Make final project visuals feel intentional, clear, and ready to share.', undefined, 'Demo'),
                        app('Higher-Quality Generation Flow', 'A refinement loop for better prompts and outputs.', 'Teaches improvement instead of one-shot generation.', undefined, 'Demo'),
                        app('Automation and Sharing Checklist', 'A launch checklist for links, screenshots, and evidence.', 'Makes final prep concrete and less stressful.', undefined, 'Ready'),
                        {
                            type: 'lab',
                            id: 'm4-s7-final-polish',
                            title: 'Build checkpoint: final innovation polish',
                            objective: 'Prepare your project for the showcase.',
                            steps: [
                                'Fix one confusing part of the app or project page.',
                                'Create or choose one strong screenshot.',
                                'Write a 30-second demo script.',
                                'Check links, secrets, and responsible AI notes.',
                            ],
                            expectedOutput: 'Polished project page, screenshot, and short demo script.',
                            reflectionPrompt: 'What changed between your first idea and your final version?',
                        },
                    ],
                },
                {
                    id: 'm4-s8',
                    title: 'Section 8: Showcase, Credentialing, and Next 7 Days',
                    icon: '08',
                    content: [
                        { type: 'heading', content: 'Learn' },
                        {
                            type: 'paragraph',
                            content: 'The final section turns project work into proof: QA, README, screenshots, demo script, evidence pack, reflection, and a realistic next build plan.',
                        },
                        {
                            type: 'callout',
                            title: 'Showcase standard',
                            content: 'A finished Pioneer project should be understandable by someone who was not in the room: what it does, who it helps, how to open it, what evidence proves it works, and what its limits are.',
                            tone: 'success',
                        },
                        { type: 'heading', content: 'Complete' },
                        {
                            type: 'lab',
                            id: 'm4-s8-evidence-pack',
                            title: 'Final lab: evidence pack',
                            objective: 'Assemble the proof needed for showcase and credential review.',
                            steps: [
                                'Add or update README with purpose, setup, and responsible AI note.',
                                'Collect screenshots and the public demo link.',
                                'Write a demo script and final QA checklist.',
                                'Submit reflection and next 7-day build plan.',
                            ],
                            expectedOutput: 'README, screenshots, demo script, evidence pack, reflection, and next 7-day plan.',
                            reflectionPrompt: 'What will you build or improve in the next 7 days?',
                        },
                    ],
                },
            ],
        },
    ],
};
