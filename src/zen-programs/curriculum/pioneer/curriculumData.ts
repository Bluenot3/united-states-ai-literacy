// AI Pioneer Program Curriculum - Youth Ages 11-18
import type { ProgramCurriculum } from '../../types';

export const pioneerCurriculum: ProgramCurriculum = {
    title: 'AI Pioneer Program',
    description: 'A build-first youth AI literacy course where students launch a real AI-powered Hugging Face Space by week 4 or week 5.',
    sections: [
        {
            id: 'overview',
            title: 'Program Overview: Build and Launch',
            icon: 'AI',
            content: [
                { type: 'heading', content: 'Your Mission' },
                { type: 'paragraph', content: 'The AI Pioneer Program is a build-first course for students ages 11-18. The central milestone is not just learning about AI. You will choose an AI app idea, build a simple Gradio or Streamlit project, deploy it on Hugging Face Spaces by week 4 or week 5, and connect the public URL to a portfolio or showcase artifact.' },
                { type: 'heading', content: 'Launch Milestone' },
                {
                    type: 'list',
                    content: [
                        'Week 1: Understand AI, responsible use, creative tools, and choose a project direction.',
                        'Week 2: Turn the idea into a simple AI app or agent blueprint.',
                        'Week 3: Learn API key safety and build a working app.py with requirements.txt and README.md.',
                        'Week 4 or 5: Create a Hugging Face Space, add Space Secrets, test the public URL, and submit it.',
                        'Week 5 or 6: Improve the demo, gather feedback, and prepare credential-ready evidence.'
                    ],
                },
                { type: 'quote', content: 'Safety rule: never paste real API keys into code, chat messages, screenshots, public repos, README files, or localStorage. Use environment variables and Hugging Face Space Secrets.' },
                { type: 'heading', content: 'Final Proof' },
                {
                    type: 'list',
                    content: [
                        'A selected AI app or agent idea',
                        'A one-page project blueprint',
                        'Starter files: app.py, requirements.txt, and README.md',
                        'A live Hugging Face Space URL',
                        'A portfolio or showcase link',
                        'A responsible AI reflection and credential evidence checklist'
                    ],
                },
            ],
        },
        {
            id: 'module-1',
            title: 'Module 1: Foundations, Creativity, and Responsible AI',
            icon: 'M1',
            content: [
                { type: 'heading', content: 'Purpose' },
                { type: 'paragraph', content: 'Students understand what AI is, use creative AI tools safely, and choose a project direction. This module turns AI from a mystery into a practical tool that must be used with judgment.' },
                { type: 'heading', content: 'Required Outcome' },
                { type: 'paragraph', content: 'By the end of this module, each student has a project idea, starter assets, and a build journal entry.' },
            ],
            subSections: [
                {
                    id: '1-1',
                    title: '1.1 AI Basics Without the Hype',
                    content: [
                        { type: 'heading', content: 'What AI Is' },
                        { type: 'paragraph', content: 'Artificial intelligence is software that finds patterns and uses those patterns to make predictions, generate content, classify information, or help complete tasks. It does not understand the world like a person. It works from data, probability, and instructions.' },
                        {
                            type: 'list',
                            content: [
                                'Machine learning: systems that learn patterns from examples',
                                'Large language models: systems that predict and generate text',
                                'Multimodal AI: systems that work with text, images, audio, or video',
                                'Generative AI: systems that create new outputs from prompts'
                            ],
                        },
                        { type: 'quote', content: 'Build journal: write one paragraph explaining one AI tool you have used and what you think it is actually doing behind the scenes.' },
                    ],
                },
                {
                    id: '1-2',
                    title: '1.2 LLMs, Multimodal AI, and Creative Examples',
                    content: [
                        { type: 'heading', content: 'From Text to Media' },
                        { type: 'paragraph', content: 'AI tools can now draft text, summarize notes, generate images, create music ideas, describe video, and help write code. The skill is learning what each tool is good for and where it can fail.' },
                        {
                            type: 'list',
                            content: [
                                'Text example: study guide generator',
                                'Image example: concept art for a science project',
                                'Audio example: voice or music idea sketch',
                                'Code example: a simple app interface',
                                'Research example: first-pass summary that still needs fact checking'
                            ],
                        },
                        { type: 'quote', content: 'Creative artifact lab: create one safe AI-assisted artifact for your project idea. Do not use real personal information, private photos, school records, or private family details.' },
                    ],
                },
                {
                    id: '1-3',
                    title: '1.3 Prompt Literacy',
                    content: [
                        { type: 'heading', content: 'Prompts Are Instructions' },
                        { type: 'paragraph', content: 'A prompt is the instruction you give an AI system. Strong prompts include the role, task, audience, constraints, format, and examples. The goal is not to trick the AI. The goal is to communicate clearly.' },
                        {
                            type: 'list',
                            content: [
                                'Role: Tell the AI what perspective to use.',
                                'Task: State exactly what you want.',
                                'Audience: Explain who the output is for.',
                                'Constraints: Add safety, length, tone, or source limits.',
                                'Format: Ask for bullets, a table, a script, or JSON when useful.',
                                'Examples: Show the kind of answer you want.'
                            ],
                        },
                        { type: 'quote', content: 'Build journal: save your best project prompt and one revision that made it better.' },
                    ],
                },
                {
                    id: '1-4',
                    title: '1.4 Hallucinations, Bias, Privacy, and Responsible AI',
                    content: [
                        { type: 'heading', content: 'AI Can Be Confident and Wrong' },
                        { type: 'paragraph', content: 'A hallucination is an AI output that sounds real but is false, unsupported, or made up. Bias happens when data or design choices make a system treat people or ideas unfairly. Privacy risk happens when private information is entered into tools that may store or process it.' },
                        {
                            type: 'list',
                            content: [
                                'Check important claims with reliable sources.',
                                'Do not enter passwords, addresses, private photos, school records, or family information.',
                                'Ask whether an output is fair to different people and communities.',
                                'Label AI assistance honestly in your project notes.',
                                'Use AI to support your thinking, not replace your responsibility.'
                            ],
                        },
                        { type: 'quote', content: 'Responsible AI gate: identify one possible hallucination risk, one privacy risk, and one bias risk for your project idea.' },
                    ],
                },
                {
                    id: '1-5',
                    title: '1.5 Project Idea Selection Gate',
                    content: [
                        { type: 'heading', content: 'Choose a Buildable Idea' },
                        { type: 'paragraph', content: 'Your first AI app should be simple, useful, and safe. It should take text input, apply a clear prompt or model behavior, and return a helpful response. Keep the first version small enough to launch.' },
                        {
                            type: 'list',
                            content: [
                                'Idea: What will the app help someone do?',
                                'User: Who is it for?',
                                'Input: What will the user type, upload, or choose?',
                                'Output: What should the AI return?',
                                'Safety: What should the app refuse, avoid, or warn about?',
                                'Starter assets: prompts, example questions, images, or notes you can safely use'
                            ],
                        },
                        { type: 'quote', content: 'Completion gate: submit a project idea title, one-sentence purpose, target user, starter prompt, safety note, and one build journal entry.' },
                    ],
                },
            ],
        },
        {
            id: 'module-2',
            title: 'Module 2: Agents, Tools, and Project Blueprint',
            icon: 'M2',
            content: [
                { type: 'heading', content: 'Purpose' },
                { type: 'paragraph', content: 'Students understand agents and convert their idea into a simple app or agent blueprint. The blueprint becomes the plan for the Hugging Face Space build.' },
                { type: 'heading', content: 'Required Outcome' },
                { type: 'paragraph', content: 'By the end of this module, each student has a one-page AI app or agent blueprint.' },
            ],
            subSections: [
                {
                    id: '2-1',
                    title: '2.1 What an AI Agent Is',
                    content: [
                        { type: 'heading', content: 'From Answering to Acting' },
                        { type: 'paragraph', content: 'A chatbot mostly responds. An agent works toward a goal by deciding what to do next, using tools, checking results, and trying again. For this course, think of an agent as an AI helper with a goal, a prompt, and optional tools.' },
                        {
                            type: 'list',
                            content: [
                                'Thought: the agent decides what might help',
                                'Action: the agent uses a tool or writes an answer',
                                'Observation: the agent checks what happened',
                                'Repeat: the agent continues until the task is complete or asks for help'
                            ],
                        },
                        { type: 'quote', content: 'Youth-friendly version: think, try, check, improve.' },
                    ],
                },
                {
                    id: '2-2',
                    title: '2.2 Tools as Python Functions',
                    content: [
                        { type: 'heading', content: 'A Tool Is a Function the App Can Use' },
                        { type: 'paragraph', content: 'In beginner Python, a function is a named set of steps. An AI tool can be as simple as a function that formats text, scores an answer, looks up a saved list, or builds a better prompt.' },
                        {
                            type: 'list',
                            content: [
                                'Input: information the function receives',
                                'Process: steps the function runs',
                                'Output: result the function gives back',
                                'Guardrail: a safety check before or after the function runs'
                            ],
                        },
                        { type: 'quote', content: 'Blueprint note: list one optional tool your app could use later. Keep version 1 simple enough to launch.' },
                    ],
                },
                {
                    id: '2-3',
                    title: '2.3 Model + Prompt + Tool + Interface',
                    content: [
                        { type: 'heading', content: 'The Four-Part App Model' },
                        { type: 'paragraph', content: 'Most beginner AI apps can be planned with four pieces: a model, a prompt, optional tools, and an interface. The interface is what the user sees. Gradio and Streamlit are beginner-friendly ways to make that interface.' },
                        {
                            type: 'list',
                            content: [
                                'Model: the AI system that generates the response',
                                'Prompt: the instruction that shapes behavior',
                                'Tool: optional Python function or helper logic',
                                'Interface: Gradio or Streamlit screen for the user',
                                'Secret: private token stored outside the code'
                            ],
                        },
                    ],
                },
                {
                    id: '2-4',
                    title: '2.4 Agent Frameworks: smolagents, LangGraph, and LlamaIndex',
                    content: [
                        { type: 'heading', content: 'Three Names You May Hear' },
                        { type: 'paragraph', content: 'You do not need a heavy agent framework for your first AI Space. Still, it helps to know the map. smolagents is a lighter way to build agent behavior. LangGraph helps create reliable multi-step agent flows. LlamaIndex is often used for apps that retrieve information from documents or knowledge bases.' },
                        {
                            type: 'list',
                            content: [
                                'smolagents: good for simple tool-using agent experiments',
                                'LangGraph: good for controlled workflows with steps and state',
                                'LlamaIndex: good for retrieval and document-based apps',
                                'Course version 1: use simple Gradio or Streamlit first, then extend later'
                            ],
                        },
                        { type: 'quote', content: 'Decision rule: if your idea can launch without a framework, launch the simple version first.' },
                    ],
                },
                {
                    id: '2-5',
                    title: '2.5 Project Blueprint Gate',
                    content: [
                        { type: 'heading', content: 'One-Page Blueprint' },
                        { type: 'paragraph', content: 'Before writing code, write a one-page plan. This prevents the project from becoming too large and gives reviewers a clear way to help.' },
                        {
                            type: 'list',
                            content: [
                                'App name and one-sentence mission',
                                'Target user and problem',
                                'Main input and output',
                                'Starter system prompt',
                                'Interface choice: Gradio or Streamlit',
                                'Files needed: app.py, requirements.txt, README.md',
                                'Secret name: HF_TOKEN',
                                'Safety note and missing-key behavior',
                                'Public URL submission plan'
                            ],
                        },
                        { type: 'quote', content: 'Completion gate: confirm the final app idea and submit the one-page AI app or agent blueprint.' },
                    ],
                },
            ],
        },
        {
            id: 'module-3',
            title: 'Module 3: API Keys, Gradio, and First Working AI App',
            icon: 'M3',
            content: [
                { type: 'heading', content: 'Purpose' },
                { type: 'paragraph', content: 'Students build their first working AI-powered app safely. This is the critical module because it turns the blueprint into real files ready for deployment.' },
                { type: 'heading', content: 'Required Outcome' },
                { type: 'paragraph', content: 'By the end of this module, each student has a working AI mini-app ready to deploy.' },
            ],
            subSections: [
                {
                    id: '3-1',
                    title: '3.1 API Keys and Tokens',
                    content: [
                        { type: 'heading', content: 'What API Keys Are' },
                        { type: 'paragraph', content: 'An API key or token is like a private pass that lets an app use a service. If someone steals it, they may use your account, spend credits, break rules under your name, or get the token revoked.' },
                        {
                            type: 'list',
                            content: [
                                'Never paste real keys into app.py.',
                                'Never paste keys into README.md.',
                                'Never commit keys to GitHub.',
                                'Never store keys in localStorage.',
                                'Never share keys in screenshots or chat.',
                                'Use environment variables and Space Secrets.'
                            ],
                        },
                        { type: 'quote', content: 'Safety gate: explain what could go wrong if HF_TOKEN is leaked and where it should be stored instead.' },
                    ],
                },
                {
                    id: '3-2',
                    title: '3.2 Environment Variables and Hugging Face Space Secrets',
                    content: [
                        { type: 'heading', content: 'Secrets Stay Outside Code' },
                        { type: 'paragraph', content: 'An environment variable is a value your app can read without writing the private value into the code. Hugging Face Spaces lets you add private Space Secrets in the Space settings. Your code reads the secret by name, such as HF_TOKEN.' },
                        {
                            type: 'list',
                            content: [
                                'Secret name for this course: HF_TOKEN',
                                'Code reads it with os.getenv("HF_TOKEN")',
                                'If the secret is missing, the app should show a safe error message',
                                'The public app should never print the token value',
                                'The README should tell users to add their own secret, not include yours'
                            ],
                        },
                    ],
                },
                {
                    id: '3-3',
                    title: '3.3 Gradio and Streamlit Intro',
                    content: [
                        { type: 'heading', content: 'Two Beginner Interfaces' },
                        { type: 'paragraph', content: 'Gradio is a fast way to build AI demos with inputs and outputs. Streamlit is a fast way to build simple app pages with controls, text, and charts. Either can work on Hugging Face Spaces.' },
                        {
                            type: 'list',
                            content: [
                                'Choose Gradio for a simple prompt-in, response-out AI demo.',
                                'Choose Streamlit for a page-style app with multiple sections.',
                                'Use the starter template before customizing.',
                                'Keep the first version small enough to debug.'
                            ],
                        },
                        { type: 'quote', content: 'Course recommendation: use the Minimal Gradio Hugging Face Space template first unless your facilitator asks for Streamlit.' },
                    ],
                },
                {
                    id: '3-4',
                    title: '3.4 Build app.py',
                    content: [
                        { type: 'heading', content: 'The Main App File' },
                        { type: 'paragraph', content: 'The app.py file contains the Python code for your Space. Your first version should import libraries, read HF_TOKEN safely, define one response function, create a Gradio or Streamlit interface, and launch the app.' },
                        {
                            type: 'list',
                            content: [
                                'Import os and the UI library.',
                                'Read HF_TOKEN with os.getenv.',
                                'Return a safe missing-key message if HF_TOKEN is missing.',
                                'Call the model inside try/except so errors do not crash the page.',
                                'Use a student-safe title and description.',
                                'Do not include real token values anywhere in app.py.'
                            ],
                        },
                    ],
                },
                {
                    id: '3-5',
                    title: '3.5 Add requirements.txt and README.md',
                    content: [
                        { type: 'heading', content: 'The Support Files' },
                        { type: 'paragraph', content: 'Hugging Face Spaces needs to know what Python packages to install. That list goes in requirements.txt. Your README.md explains what the app does, how to use it, and what safety boundaries it has.' },
                        {
                            type: 'list',
                            content: [
                                'requirements.txt includes gradio and huggingface_hub for the minimal template.',
                                'README.md includes app purpose, audience, how to run, limitations, and responsible AI note.',
                                'README.md may say the app expects HF_TOKEN as a Space Secret.',
                                'README.md must not include any real token value.',
                                'README.md should include your portfolio reflection after launch.'
                            ],
                        },
                    ],
                },
                {
                    id: '3-6',
                    title: '3.6 Preview Test and Ready-to-Deploy Gate',
                    content: [
                        { type: 'heading', content: 'Test Before Launch' },
                        { type: 'paragraph', content: 'A working local preview is helpful, but not every classroom will run local Python. At minimum, review the files carefully and test the app inside the Hugging Face Space after upload.' },
                        {
                            type: 'list',
                            content: [
                                'app.py exists and has no real token values.',
                                'requirements.txt exists and lists required packages.',
                                'README.md exists and explains the project.',
                                'The app handles missing HF_TOKEN safely.',
                                'The app has a clear title and user input.',
                                'The prompt matches the project blueprint.',
                                'The safety note is visible in README.md or app description.'
                            ],
                        },
                        { type: 'quote', content: 'Completion gate: submit app.py, requirements.txt, README.md, and a short note confirming no real API key or token is stored in code, README, screenshots, chat, or localStorage.' },
                    ],
                },
            ],
        },
        {
            id: 'module-4',
            title: 'Module 4: Hugging Face Space Launch',
            icon: 'M4',
            content: [
                { type: 'heading', content: 'Purpose' },
                { type: 'paragraph', content: 'Students launch publicly. This module is the course milestone: a real Hugging Face Space URL submitted by week 4 or week 5.' },
                { type: 'heading', content: 'Required Outcome' },
                { type: 'paragraph', content: 'By the end of this module, each student submits a live Hugging Face Space URL.' },
            ],
            subSections: [
                {
                    id: '4-1',
                    title: '4.1 Create Your Hugging Face Account and Space',
                    content: [
                        { type: 'heading', content: 'Create the Deployment Surface' },
                        { type: 'paragraph', content: 'Hugging Face Spaces hosts AI demos in the browser. Create an account with facilitator or family guidance, then create a new Space for your project.' },
                        {
                            type: 'list',
                            content: [
                                'Create or sign into a Hugging Face account.',
                                'Create a new Space.',
                                'Choose Gradio or Streamlit to match your template.',
                                'Use a safe Space name that does not expose private personal information.',
                                'Set visibility according to facilitator or family guidance.'
                            ],
                        },
                    ],
                },
                {
                    id: '4-2',
                    title: '4.2 Upload app.py, requirements.txt, and README.md',
                    content: [
                        { type: 'heading', content: 'Add the Project Files' },
                        { type: 'paragraph', content: 'Your Space needs the same three files prepared in Module 3. Keep filenames exact: app.py, requirements.txt, and README.md.' },
                        {
                            type: 'list',
                            content: [
                                'Add or upload app.py.',
                                'Add or upload requirements.txt.',
                                'Add or upload README.md.',
                                'Wait for the Space build logs to run.',
                                'If the build fails, read the first clear error message before changing code.'
                            ],
                        },
                    ],
                },
                {
                    id: '4-3',
                    title: '4.3 Add Space Secrets',
                    content: [
                        { type: 'heading', content: 'Add HF_TOKEN Safely' },
                        { type: 'paragraph', content: 'In your Space settings, add a private secret named HF_TOKEN. The value is your token. The public code only refers to the name HF_TOKEN and never shows the value.' },
                        {
                            type: 'list',
                            content: [
                                'Open Space settings.',
                                'Find Secrets or Variables.',
                                'Add secret name: HF_TOKEN.',
                                'Paste the token value only into the secret value field.',
                                'Restart or rebuild the Space if needed.',
                                'Do not paste the token into the README, app description, code, comments, or screenshots.'
                            ],
                        },
                        { type: 'quote', content: 'Security checkpoint: if your token ever appears publicly, revoke it and create a new one. Do not try to hide it by editing only one file.' },
                    ],
                },
                {
                    id: '4-4',
                    title: '4.4 Test the Public URL and Debug Common Errors',
                    content: [
                        { type: 'heading', content: 'Public Test' },
                        { type: 'paragraph', content: 'Open the Space URL in a browser and test it like a first-time user. Try one normal input, one confusing input, and one safety-boundary input.' },
                        {
                            type: 'list',
                            content: [
                                'Missing HF_TOKEN: add the Space Secret and restart.',
                                'Module not found: check spelling in requirements.txt.',
                                'Build failed: read logs for the first real error.',
                                'App loads but model fails: check token permissions and model availability.',
                                'Output is unsafe or off-topic: improve the system prompt and README safety note.'
                            ],
                        },
                    ],
                },
                {
                    id: '4-5',
                    title: '4.5 Submit Space URL and Portfolio Link',
                    content: [
                        { type: 'heading', content: 'Launch Evidence' },
                        { type: 'paragraph', content: 'The course milestone is complete when the public demo opens and the URL is submitted. The portfolio artifact can be a page, document, slide, or showcase entry that links to the Space and explains the project.' },
                        {
                            type: 'list',
                            content: [
                                'Submit the public Hugging Face Space URL.',
                                'Submit a portfolio or showcase link if available.',
                                'Include the app name and one-sentence purpose.',
                                'Include a screenshot or short demo note.',
                                'Include a responsible AI note and known limitation.',
                                'Confirm no real API key or token appears in public files.'
                            ],
                        },
                        { type: 'quote', content: 'Completion gate: live Hugging Face Space URL submitted by week 4 or week 5, plus portfolio/showcase connection.' },
                    ],
                },
            ],
        },
        {
            id: 'module-5',
            title: 'Module 5: Improve the App',
            icon: 'M5',
            content: [
                { type: 'heading', content: 'Purpose' },
                { type: 'paragraph', content: 'Students improve the app into something worth showing. Version 1 proves launch ability. Version 2 improves usefulness, clarity, and safety.' },
                { type: 'heading', content: 'Required Outcome' },
                { type: 'paragraph', content: 'By the end of this module, each student has a stronger public demo.' },
            ],
            subSections: [
                {
                    id: '5-1',
                    title: '5.1 UI Polish and Better Prompts',
                    content: [
                        { type: 'heading', content: 'Make the Demo Clear' },
                        { type: 'paragraph', content: 'Polish does not mean decoration. It means the user understands what the app does, what to type, what to expect, and what the safety limits are.' },
                        {
                            type: 'list',
                            content: [
                                'Improve the title and description.',
                                'Add example prompts or usage hints.',
                                'Make the system prompt more specific.',
                                'Add a role or task selector if it helps.',
                                'Add a visible safety note.',
                                'Keep the app simple enough to maintain.'
                            ],
                        },
                    ],
                },
                {
                    id: '5-2',
                    title: '5.2 Optional Extensions',
                    content: [
                        { type: 'heading', content: 'Choose One Extension Only' },
                        { type: 'paragraph', content: 'Advanced features are optional. Choose one extension that supports your app purpose. Do not add features just to make the project look complicated.' },
                        {
                            type: 'list',
                            content: [
                                'Optional file upload: let the user provide a small text file or image if your framework supports it.',
                                'Optional memory explanation: describe what the app remembers during one session and what it does not store.',
                                'Optional RAG explanation: explain how future document retrieval could improve the app.',
                                'Optional multimodal extension: add image or audio only if it fits the project purpose.',
                                'Optional examples: add a small safe test set for reviewers.'
                            ],
                        },
                    ],
                },
                {
                    id: '5-3',
                    title: '5.3 Peer Review and Bug-Fix Checklist',
                    content: [
                        { type: 'heading', content: 'Test With Another Person' },
                        { type: 'paragraph', content: 'Peer review helps you find confusing instructions, weak prompts, unsafe outputs, and broken demo paths before final showcase.' },
                        {
                            type: 'list',
                            content: [
                                'Reviewer can explain what the app does.',
                                'Reviewer can use the app without extra help.',
                                'Normal input returns a useful result.',
                                'Confusing input fails gracefully or asks for clarification.',
                                'Unsafe input is refused or redirected.',
                                'README.md matches the actual app.',
                                'Public URL still works after changes.'
                            ],
                        },
                        { type: 'quote', content: 'Completion gate: submit one peer feedback note, one bug fixed, one prompt improvement, and the updated public Space URL.' },
                    ],
                },
            ],
        },
        {
            id: 'module-6',
            title: 'Module 6: Portfolio, Demo, and Credential Readiness',
            icon: 'M6',
            content: [
                { type: 'heading', content: 'Purpose' },
                { type: 'paragraph', content: 'Students package proof of skill. The goal is to leave with a public project, a reflection, and evidence ready for review.' },
                { type: 'heading', content: 'Required Outcome' },
                { type: 'paragraph', content: 'By the end of this module, each student has a public project, reflection, and credential-ready evidence.' },
            ],
            subSections: [
                {
                    id: '6-1',
                    title: '6.1 Portfolio and Showcase Package',
                    content: [
                        { type: 'heading', content: 'Show the Work Clearly' },
                        { type: 'paragraph', content: 'Your portfolio entry should make it easy for someone to understand the project, open the demo, and see what you learned. Keep it honest and specific.' },
                        {
                            type: 'list',
                            content: [
                                'Final Hugging Face Space URL',
                                'Portfolio or showcase link',
                                'Project name and one-sentence purpose',
                                'Target user and problem',
                                'Screenshot or short demo summary',
                                'Key files prepared: app.py, requirements.txt, README.md',
                                'Known limitations and next improvement'
                            ],
                        },
                    ],
                },
                {
                    id: '6-2',
                    title: '6.2 Responsible AI Reflection and Demo Script',
                    content: [
                        { type: 'heading', content: 'Explain Your Judgment' },
                        { type: 'paragraph', content: 'A strong AI project is not only technical. You should be able to explain how you handled privacy, hallucinations, bias, safety, and appropriate use.' },
                        {
                            type: 'list',
                            content: [
                                'What does your app do?',
                                'Who is it for?',
                                'What should users not use it for?',
                                'What privacy choices did you make?',
                                'How does it handle missing HF_TOKEN or errors?',
                                'What did peer feedback change?',
                                'What would you improve next?'
                            ],
                        },
                        { type: 'quote', content: 'Demo script: 30 seconds for the problem, 60 seconds for the live demo, 30 seconds for safety and reflection.' },
                    ],
                },
                {
                    id: '6-3',
                    title: '6.3 Credential Evidence and ZEN Card Readiness',
                    content: [
                        { type: 'heading', content: 'Evidence Checklist' },
                        { type: 'paragraph', content: 'Credential readiness means your evidence is organized enough for a reviewer to verify what you built and what you learned. ZEN Card readiness means the evidence could later connect to a verified credential record when that pipeline is available.' },
                        {
                            type: 'list',
                            content: [
                                'Live Space URL opens publicly or according to facilitator settings.',
                                'README.md explains purpose, setup, limitations, and responsible AI note.',
                                'No real API keys or tokens appear in public code or docs.',
                                'Portfolio/showcase link is available.',
                                'Build journal includes idea, blueprint, launch notes, and reflection.',
                                'Peer feedback is documented.',
                                'Final demo script is ready.',
                                'Facilitator can verify the submitted evidence.'
                            ],
                        },
                        { type: 'quote', content: 'Final completion gate: submit final Space URL, portfolio/showcase link, project description, responsible AI reflection, demo script, peer feedback note, and credential evidence checklist.' },
                    ],
                },
            ],
        },
    ],
};
