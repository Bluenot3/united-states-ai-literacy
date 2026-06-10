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
                        app('Prediction Engine Simulator', 'A live demo of next-token prediction with confidence bars. Pick a starter and see the model\'s top guesses.', 'This is the core lesson of Section 1: LLMs predict patterns. They do not think. That is why the same prompt can produce different answers.', undefined, 'Demo', {
                            interactive: 'prediction-engine',
                            instructions: ['Pick a sentence starter.', 'Read the top 4 candidate tokens and their confidence.', 'Explain why the order can flip between runs.'],
                            completionHint: 'Start here — this single demo unlocks every other concept in Section 1.',
                        }),
                        app('Token Budget Visualizer', 'Paste text and watch it split into tokens. A context-window meter shows how much of the model\'s budget you used.', 'Tokens are the unit AI tools count, charge, and forget. Builders who think in tokens ship apps that stay fast and cheap.', undefined, 'Demo', {
                            interactive: 'token-budget',
                            instructions: ['Paste a paragraph.', 'Read the token count and meter.', 'Try shortening the text — watch the meter drop.'],
                        }),
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
                        app('Persona Agent Builder', 'Design an AI agent identity — role, audience, tone, hard limit, goal. The tool generates a ready-to-paste system prompt.', 'This is the strongest single move in prompt engineering: stop asking the model questions; tell it who to be.', undefined, 'Demo', {
                            interactive: 'persona-agent',
                            instructions: ['Fill role, audience, limit, and goal.', 'Pick a tone.', 'Copy the system prompt and try it in any chat tool.'],
                            completionHint: 'Save the system prompt as part of your Persona artifact for this section.',
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
            title: 'Module 3: AI App Building, Code & Knowledge',
            icon: 'M3',
            content: [
                { type: 'heading', content: 'What you will do' },
                {
                    type: 'list',
                    content: [
                        'Ship 2 — build (or plan) ZEN Code Forge, a code-generation app you can read, test, and trust.',
                        'Ship 3 — build (or plan) ZEN Knowledge Brain, a grounded notes-based Q&A app that cites its sources.',
                        'Practice reading AI-written code, spotting bugs, and refusing to answer when you do not know.',
                    ],
                },
                {
                    type: 'callout',
                    title: 'Why this module matters',
                    content: 'Module 2 proved you can deploy an AI app. Module 3 levels you up into the two hardest, most useful kinds of AI apps in the world: apps that write code, and apps that answer questions from a real knowledge base. After this, you stop being a prompter and start being a builder of systems.',
                    tone: 'info',
                },
            ],
            subSections: [
                {
                    id: 'm3-s5',
                    title: 'Section 1: Ship 2 — ZEN Code Forge',
                    icon: '01',
                    content: [
                        { type: 'heading', content: 'Module 3 · Week 5 · Section 1' },
                        {
                            type: 'callout',
                            title: 'Core question',
                            content: 'Can my app write working code?',
                            tone: 'info',
                        },
                        {
                            type: 'callout',
                            title: 'Student outcome',
                            content: 'You understand how AI code-generation apps work, you can read AI-written code before trusting it, and you can prepare a simple Code Forge-style app artifact — either a live URL or a polished Code Reading Log.',
                            tone: 'success',
                        },
                        { type: 'heading', content: 'Learn' },
                        {
                            type: 'paragraph',
                            content: 'AI can write code in seconds. That does not mean the code works, is safe, or does what you actually asked. In Ship 2 you build the mindset of a real engineer: AI writes a draft, you are the operator who reads, tests, and decides whether it ships.',
                        },
                        {
                            type: 'list',
                            content: [
                                'AI code is a draft, not a guarantee.',
                                'Read before running — always.',
                                'Never paste secrets, real API keys, or passwords into code you got from an AI.',
                                'Test small before scaling: one input, one function, one outcome at a time.',
                                'Explain what the code should do, in your own words, before you trust it.',
                            ],
                        },
                        {
                            type: 'callout',
                            title: 'Helper for younger Pioneers',
                            content: 'Think of AI-written code like a homework answer from a smart friend. It might be right. It might be totally wrong with great confidence. You still have to read it, understand it, and put your name on it before you turn it in.',
                            tone: 'info',
                        },
                        { type: 'heading', content: 'Concept cards' },
                        app('Code-generation app concept', 'A Code Forge-style app takes a request like "write a Python function that reverses a string" and returns working code plus an explanation.', 'This is the pattern behind GitHub Copilot, Cursor, Claude Code, and the code panel of every major AI chat product.', undefined, 'Ready', {
                            instructions: ['Imagine one small coding task you would actually want help with.', 'Write the request in one clear sentence.', 'Note what language you want back.'],
                            completionHint: 'Launch card — used as a teaching concept for the Code Forge ship.',
                        }),
                        app('Language picker card', 'A simple dropdown: Python, JavaScript, HTML, SQL, Bash. The model is told which language to write.', 'Telling the model the target language up front cuts errors massively. Vague prompts produce vague code.', undefined, 'Ready', {
                            instructions: ['Pick your default language.', 'Note one task that is easier in that language.', 'Note one task you would switch languages for.'],
                        }),
                        app('Copy button card', 'A one-click copy button on every code block so students move code into a real editor to test it.', 'Reading code in a chat window is not enough. Real engineers run code in real environments.', undefined, 'Ready', {
                            instructions: ['Decide where you will run the copied code (Replit, VS Code, browser console, terminal).', 'Confirm you have that environment open before generating code.', 'Plan one tiny test you will run first.'],
                        }),
                        {
                            type: 'callout',
                            title: 'Explain-before-run rule',
                            content: 'Before you run any AI-written code, say out loud (or write down) what it should do, line by line, in plain English. If you cannot explain it, do not run it. This single rule separates safe AI builders from the people who break production.',
                            tone: 'warning',
                        },
                        { type: 'heading', content: 'Safety' },
                        app('Safe code checklist', 'A five-point check before running any AI-generated code: do I understand it, does it touch the network, does it touch the filesystem, does it ask for secrets, can I roll it back?', 'This is the same checklist senior engineers run in their head every day.', undefined, 'Ready', {
                            instructions: ['Save the five points somewhere visible.', 'Apply them to the next snippet you generate.', 'Refuse to run anything that fails the check.'],
                        }),
                        app('What makes code dangerous?', 'Code is dangerous when it deletes files, sends data to unknown servers, executes shell commands you did not approve, or hardcodes secrets.', 'Knowing the danger signs lets you spot bad AI suggestions instantly — before they cost you.', undefined, 'Ready', {
                            instructions: ['List the four danger signs from memory.', 'Find one example of each in real-world code online.', 'Decide what you would change before running it.'],
                        }),
                        {
                            type: 'callout',
                            title: 'Never paste real secrets',
                            content: 'Never paste real API keys, passwords, database URLs, or tokens into an AI prompt or AI-generated code you share. Use only fake placeholders like sk-demo-REPLACE_WITH_YOUR_OWN_KEY. If a real secret ever lands in chat, rotate it immediately.',
                            tone: 'warning',
                        },
                        { type: 'heading', content: 'Activities' },
                        app('Code Reading Log', 'A short log: paste a snippet of AI-generated code, then write what each block does in your own words, then mark it Safe to Run / Needs Edits / Refuse.', 'This is the single fastest way to build engineering intuition. It turns passive copy-paste into active understanding.', undefined, 'Ready', {
                            instructions: ['Generate one small snippet from any AI tool.', 'Walk through it line by line in plain English.', 'Mark it Safe / Needs Edits / Refuse and explain why.'],
                            completionHint: 'You can submit this log as your Section 1 artifact instead of a live app.',
                        }),
                        app('Bug Hunt', 'You will be given (or you generate) a snippet with at least one bug. Your job is to find it without running it first.', 'Real engineers can read code and predict failures. This activity trains that exact muscle.', undefined, 'Ready', {
                            instructions: ['Read the snippet twice without running it.', 'Mark the suspicious line.', 'Write what should happen vs what will happen.', 'Then run it to confirm.'],
                        }),
                        { type: 'heading', content: 'Ship 2 plan — ZEN Code Forge' },
                        app('ZEN Code Forge — launch plan', 'A Gradio app with a prompt box, a language picker, and a code output box. The user describes a task, picks a language, and gets a code draft with an explanation.', 'This is your second public AI app. Even if you only ship the plan this week, the plan itself is real engineering work.', undefined, 'Ready', {
                            instructions: ['Sketch the UI: prompt box, language dropdown, output area, copy button.', 'Write the system instruction: "You are ZEN Code Forge. Generate readable, commented, safe code in the chosen language. Refuse dangerous requests."', 'List the files you would need: app.py, requirements.txt, README.md.', 'Decide your artifact: live Hugging Face Space URL or detailed launch plan.'],
                            completionHint: 'Launch card — pair this plan with the starter code below.',
                        }),
                        { type: 'heading', content: 'Starter code: ZEN Code Forge (app.py)' },
                        {
                            type: 'code',
                            language: 'python',
                            content: `import os
import gradio as gr
from openai import OpenAI

# Read the key from Hugging Face Space Secrets.
# NEVER hardcode a real key. The placeholder below is fake and safe.
API_KEY = os.environ.get("OPENAI_API_KEY", "sk-demo-REPLACE_WITH_YOUR_OWN_KEY")
client = OpenAI(api_key=API_KEY)

SYSTEM_PROMPT = (
    "You are ZEN Code Forge. Generate clear, well-commented code "
    "in the language the user picks. Explain what the code does in "
    "plain English at the top. Refuse dangerous requests like "
    "deleting files, scraping private data, or hardcoding secrets."
)

LANGUAGES = ["Python", "JavaScript", "HTML", "SQL", "Bash"]

def forge(task: str, language: str) -> str:
    if not task.strip():
        return "Describe the coding task you want."
    user_prompt = f"Language: {language}\\nTask: {task}"
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
    )
    return response.choices[0].message.content

demo = gr.Interface(
    fn=forge,
    inputs=[
        gr.Textbox(label="What should the code do?", lines=4),
        gr.Dropdown(LANGUAGES, label="Language", value="Python"),
    ],
    outputs=gr.Code(label="Code draft (read before running)"),
    title="ZEN Code Forge",
    description="Built by a ZEN AI Pioneer. AI writes the draft. You are the operator.",
)

if __name__ == "__main__":
    demo.launch()
`,
                        },
                        {
                            type: 'callout',
                            title: 'Advanced challenge (older Pioneers)',
                            content: 'Extend Code Forge: add a second dropdown for difficulty (Beginner / Intermediate / Expert), add three one-click example prompts, add a copy button using gr.Code, and improve the system instruction so the model always returns a plain-English explanation BEFORE the code block.',
                            tone: 'warning',
                        },
                        { type: 'heading', content: 'Artifact checkpoint' },
                        {
                            type: 'lab',
                            id: 'm3-s5-code-forge-ship',
                            title: 'Artifact: Code Forge URL or Code Reading Log',
                            objective: 'Ship a working ZEN Code Forge Space, OR turn in a polished Code Reading Log that proves you can read AI-generated code.',
                            steps: [
                                'Pick your path: deploy Code Forge on Hugging Face Spaces, or complete a 3-snippet Code Reading Log.',
                                'If shipping: create the Space, add the secret OPENAI_API_KEY (your real key, never in code), paste the starter app.py, and confirm it boots.',
                                'If logging: generate 3 code snippets, walk through each line by line, mark each Safe / Needs Edits / Refuse, and explain why.',
                                'Save your artifact link (Space URL) or your log (doc, PDF, or screenshot).',
                                'Submit it as your Section 1 artifact.',
                            ],
                            expectedOutput: 'A live Hugging Face Space URL for ZEN Code Forge, OR a 3-snippet Code Reading Log with safety verdicts.',
                            reflectionPrompt: 'One thing I checked before running AI-written code was…',
                        },
                        {
                            type: 'callout',
                            title: 'Completion CTA',
                            content: 'Save your artifact and reflection, then mark this section complete. Section 2 levels you up again: you will build an app that answers questions from a real knowledge base, not just from the model\'s memory.',
                            tone: 'success',
                        },
                    ],
                },
                {
                    id: 'm3-s6',
                    title: 'Section 2: Ship 3 — ZEN Knowledge Brain',
                    icon: '02',
                    content: [
                        { type: 'heading', content: 'Module 3 · Week 6 · Section 2' },
                        {
                            type: 'callout',
                            title: 'Core question',
                            content: 'Can my app know what I know?',
                            tone: 'info',
                        },
                        {
                            type: 'callout',
                            title: 'Student outcome',
                            content: 'You understand grounded AI, notes-based Q&A, RAG-style behavior, citations, source quality, and honest refusal. You ship (or fully plan) ZEN Knowledge Brain — an app that answers from YOUR notes, not just the model\'s guess.',
                            tone: 'success',
                        },
                        { type: 'heading', content: 'Learn' },
                        {
                            type: 'paragraph',
                            content: 'Most AI apps guess. They have memorized a huge chunk of the internet, but they have no idea what is true for YOU — your school, your team, your project, your country. A grounded AI app fixes this: you give it your real notes, and it only answers from those notes. If the answer is not in the notes, the app says so honestly.',
                        },
                        {
                            type: 'list',
                            content: [
                                'Grounding means the AI answers from a specific source you give it — not from its general training.',
                                'RAG (Retrieval-Augmented Generation) is the pattern: retrieve the right notes, then generate the answer using only those notes.',
                                'Citations show which note the answer came from, so a human can verify it.',
                                'Honest refusal means the app says "I do not know" when the answer is not in the notes — that is a feature, not a bug.',
                                'Garbage in, garbage out: weak notes produce weak answers, no matter how good the model is.',
                            ],
                        },
                        {
                            type: 'callout',
                            title: 'Helper for younger Pioneers',
                            content: 'Think of grounded AI like an open-book test. A regular AI is taking the test from memory and sometimes makes things up. A grounded AI has the actual book open, points at the page, and only answers what the book actually says.',
                            tone: 'info',
                        },
                        { type: 'heading', content: 'Concept cards' },
                        app('What is RAG?', 'RAG = Retrieval-Augmented Generation. The app first searches your notes for the most relevant pieces, then asks the model to answer using only those pieces.', 'This is how serious AI apps stay accurate: customer-support bots, legal assistants, study buddies, internal company tools.', undefined, 'Ready', {
                            instructions: ['Say the two steps out loud: 1) retrieve, 2) generate.', 'Pick one knowledge base you would build (school notes, sports stats, family recipes).', 'Note one question the app should be able to answer.'],
                            completionHint: 'Launch card — teaching concept for the Knowledge Brain ship.',
                        }),
                        app('Embeddings — fingerprints for ideas', 'Embeddings turn each note into a list of numbers that represents its meaning. Similar ideas get similar fingerprints, so the app can find the right note even when the question uses different words.', 'This is the magic that makes RAG work. You do not need to memorize the math — you need to know the idea.', undefined, 'Ready', {
                            instructions: ['Picture each note as a unique fingerprint.', 'Picture a question also getting a fingerprint.', 'The app finds the notes whose fingerprints are closest to the question.'],
                        }),
                        app('Paste-your-notes knowledge app', 'A simple Knowledge Brain UI: one big text box where you paste your notes, one question box, one answer box that cites which note was used.', 'This is the smallest possible RAG app — and it is enough to feel the difference between grounded and guessing.', undefined, 'Ready', {
                            instructions: ['Decide what notes you will paste (study guide, project doc, sports stats, recipes).', 'Write 3 questions the app should answer correctly from those notes.', 'Write 1 question it should refuse because the answer is NOT in the notes.'],
                        }),
                        app('Citation chips / source card', 'Every answer comes with a chip like [Note 2] or a short source card showing the exact text the answer came from.', 'Citations are how a human verifies an AI answer. No citation = no trust.', undefined, 'Ready', {
                            instructions: ['Design the chip: number, short label, or first 8 words of the source.', 'Decide what happens when a user clicks it (expand the full note).', 'Confirm every answer in your app will have at least one chip.'],
                        }),
                        {
                            type: 'callout',
                            title: 'Honest refusal',
                            content: 'When the answer is not in the notes, the app should say "I do not know from the notes you gave me." That is the most trustworthy thing an AI app can say. A confident wrong answer is worse than an honest "I do not know."',
                            tone: 'warning',
                        },
                        { type: 'heading', content: 'Activities' },
                        app('Before/after grounding test', 'Ask the same question two ways: once to a plain chat model with no notes, once to your Knowledge Brain with the notes attached. Compare the two answers.', 'You will see the grounded answer is more accurate, more specific, and citable. This is the proof that grounding matters.', undefined, 'Ready', {
                            instructions: ['Pick one question only you (or your school/team) can answer correctly.', 'Ask a plain AI chat (no notes) — record the answer.', 'Ask your Knowledge Brain with your notes — record the answer.', 'Write a 3-sentence comparison.'],
                            completionHint: 'You can submit this comparison as your Section 2 artifact instead of a live URL.',
                        }),
                        app('Garbage in, garbage out lab', 'Test what happens when you feed the app bad notes: typos, contradictions, outdated info, or random unrelated text.', 'You will see that grounding does not save bad sources. The quality of your notes IS the quality of your app.', undefined, 'Ready', {
                            instructions: ['Take your good notes and intentionally break them (typos, wrong dates, contradictions).', 'Ask the same questions again.', 'Note exactly how the app fails.', 'Write one rule about source quality.'],
                        }),
                        { type: 'heading', content: 'Safety' },
                        app('Hugging Face Secrets lesson card', 'Secrets in a Hugging Face Space are environment variables (like OPENAI_API_KEY) that your code can read but the public cannot see.', 'This is how grown-up AI apps protect keys. Never hardcode a key in app.py — always read it from a secret.', 'https://huggingface.co/docs/hub/spaces-overview#managing-secrets', 'External', {
                            instructions: ['Open Settings → Variables and secrets on your Space.', 'Add OPENAI_API_KEY (or your provider key) as a secret, not a public variable.', 'Confirm your code uses os.environ.get(...) to read it.', 'Confirm the fake placeholder sk-demo-REPLACE_WITH_YOUR_OWN_KEY is the only key string in your committed code.'],
                        }),
                        {
                            type: 'callout',
                            title: 'Never paste real secrets — still true',
                            content: 'Same rule as Ship 2. Real keys live in Space Secrets only. Use sk-demo-REPLACE_WITH_YOUR_OWN_KEY as the placeholder in any code you share, screenshot, or commit.',
                            tone: 'warning',
                        },
                        { type: 'heading', content: 'Ship 3 plan — ZEN Knowledge Brain' },
                        app('ZEN Knowledge Brain — launch plan', 'A Gradio app with a notes textarea, a question box, and an answer box that quotes the note it used. If no note matches, the app refuses honestly.', 'This is your third public AI app. Plan it carefully — citations and refusal are what make it trustworthy.', undefined, 'Ready', {
                            instructions: ['Sketch the UI: notes textarea, question box, answer box, citation chip.', 'Write the system instruction: "Answer ONLY from the notes below. Quote the exact sentence you used. If the answer is not in the notes, say I do not know from the notes you gave me."', 'Decide what counts as "good notes" for your domain.', 'Decide your artifact: live Hugging Face Space URL or Grounding Test Report.'],
                            completionHint: 'Launch card — pair this plan with the starter code below.',
                        }),
                        { type: 'heading', content: 'Starter code: ZEN Knowledge Brain (app.py)' },
                        {
                            type: 'code',
                            language: 'python',
                            content: `import os
import gradio as gr
from openai import OpenAI

# Read the key from Hugging Face Space Secrets.
# NEVER hardcode a real key. The placeholder below is fake and safe.
API_KEY = os.environ.get("OPENAI_API_KEY", "sk-demo-REPLACE_WITH_YOUR_OWN_KEY")
client = OpenAI(api_key=API_KEY)

SYSTEM_PROMPT = (
    "You are ZEN Knowledge Brain. Answer ONLY using the notes the "
    "user provides below. Quote the exact sentence you used as a "
    "citation. If the answer is not in the notes, say: "
    "'I do not know from the notes you gave me.' Do not guess."
)

def brain(notes: str, question: str) -> str:
    if not notes.strip():
        return "Paste your notes first."
    if not question.strip():
        return "Ask a question about the notes."
    user_prompt = f"NOTES:\\n{notes}\\n\\nQUESTION:\\n{question}"
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
    )
    return response.choices[0].message.content

demo = gr.Interface(
    fn=brain,
    inputs=[
        gr.Textbox(label="Your notes (paste here)", lines=12),
        gr.Textbox(label="Your question", lines=2),
    ],
    outputs=gr.Textbox(label="Grounded answer (with citation)", lines=10),
    title="ZEN Knowledge Brain",
    description="Built by a ZEN AI Pioneer. Grounded answers only. Honest refusal when the notes do not know.",
)

if __name__ == "__main__":
    demo.launch()
`,
                        },
                        {
                            type: 'callout',
                            title: 'Advanced challenge (older Pioneers)',
                            content: 'Level up your Knowledge Brain: add a file upload so users can attach .txt or .md notes, return a numbered citation list ([1], [2], [3]) tied to the exact note chunks used, and add a confidence label (High / Medium / Low / Refuse) to every answer.',
                            tone: 'warning',
                        },
                        { type: 'heading', content: 'Artifact checkpoint' },
                        {
                            type: 'lab',
                            id: 'm3-s6-knowledge-brain-ship',
                            title: 'Artifact: Knowledge Brain URL or Grounding Test Report',
                            objective: 'Ship a working ZEN Knowledge Brain Space, OR turn in a Grounding Test Report that proves you understand grounded vs guessing.',
                            steps: [
                                'Pick your path: deploy Knowledge Brain on Hugging Face Spaces, or write a Grounding Test Report.',
                                'If shipping: create the Space, add OPENAI_API_KEY as a Space Secret (never in code), paste the starter app.py, and confirm it answers from your notes and refuses honestly.',
                                'If reporting: pick one question only your notes can answer, ask it of a plain AI and of a grounded AI, and write the side-by-side comparison.',
                                'Save your artifact link (Space URL) or your report (doc, PDF, or screenshot).',
                                'Submit it as your Section 2 artifact.',
                            ],
                            expectedOutput: 'A live Hugging Face Space URL for ZEN Knowledge Brain, OR a Grounding Test Report comparing grounded vs ungrounded answers.',
                            reflectionPrompt: 'One thing only my app can answer correctly is…',
                        },
                        {
                            type: 'callout',
                            title: 'Completion CTA',
                            content: 'Save your artifact and reflection, then mark this section complete. Module 4 is where you red-team everything you have built, lock the scope of your capstone, and prepare for the Week 8 showcase and certificate.',
                            tone: 'success',
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
