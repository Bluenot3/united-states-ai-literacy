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
            title: 'Module 2: Builder Studio and Platform Thinking',
            icon: 'M2',
            content: [
                { type: 'heading', content: 'What you will do' },
                {
                    type: 'list',
                    content: [
                        'Review early work and turn it into a clearer project blueprint.',
                        'Explore 3D, comics, teachable models, notebooks, games, and platform launch ideas.',
                        'Prepare reusable copy, code direction, and a first learning-environment preview.',
                    ],
                },
            ],
            subSections: [
                {
                    id: 'm2-s3',
                    title: 'Section 3: Review, 3D, Comics, and Project CTA',
                    icon: '03',
                    content: [
                        { type: 'heading', content: 'Learn' },
                        {
                            type: 'paragraph',
                            content: 'Students review their first-half direction, explore richer media, and turn creative output into a project they can explain and share.',
                        },
                        { type: 'heading', content: 'Explore' },
                        app('AI to 3D Environment Demo', 'A Trellis/Hunyuan-style 3D generation experience.', 'Shows that AI can build spatial assets, not only text and images.', undefined, 'Demo'),
                        app('Dynamic Image Generator', 'A creative image generation workspace.', 'Use it as another fast path to visual output.', undefined, 'Demo'),
                        app('ZEN AI Learning Environment', 'A preview of a guided AI learning space.', 'Shows how tools can become structured learning products.', undefined, 'Demo'),
                        app('AI Comic Factory', 'A comic/story generation activity.', 'Connects narrative, images, and prompt sequencing.', undefined, 'External'),
                        {
                            type: 'lab',
                            id: 'm2-s3-project-cta',
                            title: 'Build checkpoint: project code/copy CTA',
                            objective: 'Write a project CTA and collect the copy/code direction needed for the next build.',
                            steps: [
                                'Choose one creative output from the section.',
                                'Write a one-sentence project purpose.',
                                'Draft a launch CTA for a user.',
                                'List the code or app pieces you need next.',
                            ],
                            expectedOutput: 'Project purpose, CTA copy, and next-build checklist.',
                            reflectionPrompt: 'What would make someone want to open or try your project?',
                        },
                    ],
                },
                {
                    id: 'm2-s4',
                    title: 'Section 4: Prompt Platform, Teachable Models, and Games',
                    icon: '04',
                    content: [
                        { type: 'heading', content: 'Learn' },
                        {
                            type: 'paragraph',
                            content: 'This section introduces platform thinking: prompts, model training, research notebooks, games, and launch-ready learning environments.',
                        },
                        { type: 'heading', content: 'Explore' },
                        app('Prompt Advancement Platform', 'A structured prompt improvement workspace.', 'Turns prompt writing into a repeatable skill loop.', undefined, 'Demo'),
                        app('ZEN-X Creative Forge', 'A creative build environment for turning ideas into outputs.', 'Use it to connect imagination with execution.', undefined, 'Demo'),
                        app('Teachable Machine', 'Train a small model with examples.', 'Makes machine learning visible without advanced code.', 'https://teachablemachine.withgoogle.com/', 'External'),
                        app('NotebookLM', 'A research and source-understanding workspace.', 'Shows how references and files can guide better AI work.', 'https://notebooklm.google.com/', 'External'),
                        app('AI Game Generator', 'A generator for playable mini-game ideas or code.', 'Move from media creation into interactive products.', undefined, 'Demo'),
                        app('Learning Environment Code Preview', 'A preview of how a launchable platform is assembled.', 'Connect design, copy, code, and your evidence into one project direction.', undefined, 'Optional'),
                        {
                            type: 'lab',
                            id: 'm2-s4-platform-blueprint',
                            title: 'Build checkpoint: platform blueprint',
                            objective: 'Turn one idea into a simple platform or game blueprint.',
                            steps: [
                                'Name the tool, game, or learning environment.',
                                'Define the user and the task it helps with.',
                                'Choose one model/tool source.',
                                'Write the first three user actions.',
                            ],
                            expectedOutput: 'A one-page blueprint for a launchable AI tool or game.',
                            reflectionPrompt: 'What is the smallest useful version you could build first?',
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
