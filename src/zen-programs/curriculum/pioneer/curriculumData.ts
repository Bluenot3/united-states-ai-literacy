// AI Pioneer Program Curriculum - Youth Ages 11-18
import type { ProgramCurriculum } from '../../types';

export const pioneerCurriculum: ProgramCurriculum = {
    title: 'AI Pioneer Program',
    description: 'The first youth AI literacy program in U.S. history. Designed for ages 11-18.',
    sections: [
        {
            id: 'overview',
            title: 'Program Overview',
            icon: '🚀',
            content: [
                { type: 'heading', content: 'Welcome to the AI Pioneer Program' },
                { type: 'paragraph', content: 'You are about to become one of the first young people in America certified in AI literacy. This program teaches you how AI really works—not just how to use it, but how to build with it, stay safe, and prepare for a future where AI is everywhere.' },
                { type: 'heading', content: 'What You Will Learn' },
                {
                    type: 'list', content: [
                        'How AI "thinks" and makes decisions',
                        'Building your first AI-powered applications',
                        'Staying safe and spotting AI risks',
                        'Creating a portfolio that proves your skills'
                    ]
                }
            ]
        },
        {
            id: 'module-1',
            title: 'Module 1: AI Foundations & Safety',
            icon: '🧠',
            content: [
                { type: 'heading', content: 'Understanding Artificial Intelligence' },
                { type: 'paragraph', content: 'AI is software that learns from examples instead of following step-by-step instructions. When you teach a dog to sit, you show it what sitting looks like and reward it. AI works similarly—it looks at millions of examples to learn patterns.' }
            ],
            subSections: [
                {
                    id: '1-1',
                    title: '1.1 What is AI?',
                    content: [
                        { type: 'heading', content: 'The Brain vs. The Computer' },
                        { type: 'paragraph', content: 'Your brain has roughly 86 billion neurons that fire electrical signals. AI models have "artificial neurons" called parameters—some have trillions of them. But here\'s the key difference: your brain understands meaning. AI only understands patterns and probability.' },
                        { type: 'heading', content: 'How ChatGPT "Thinks"' },
                        { type: 'paragraph', content: 'When you ask ChatGPT a question, it doesn\'t "know" the answer. Instead, it predicts the most likely next word based on patterns in all the text it was trained on. It\'s like an incredibly sophisticated autocomplete.' },
                        {
                            type: 'list', content: [
                                'Input: Your question gets converted to numbers (tokens)',
                                'Processing: The model calculates probabilities for what comes next',
                                'Output: It picks the most likely words, one at a time'
                            ]
                        }
                    ]
                },
                {
                    id: '1-2',
                    title: '1.2 AI Safety Fundamentals',
                    content: [
                        { type: 'heading', content: 'The Trust Problem' },
                        { type: 'paragraph', content: 'AI can sound very confident while being completely wrong. This is called a "hallucination." Never trust AI for medical advice, legal decisions, or anything where being wrong could hurt you or others.' },
                        { type: 'heading', content: 'Protecting Your Information' },
                        { type: 'paragraph', content: 'Never share personal information with AI chatbots: your full name, address, school, passwords, photos of yourself, or private conversations. Anything you type gets sent to a company\'s servers.' },
                        {
                            type: 'list', content: [
                                '❌ Don\'t share: Real name, school, address, phone number',
                                '❌ Don\'t share: Passwords, private photos, family info',
                                '✅ Do use: Generic questions, homework help, creative writing'
                            ]
                        }
                    ]
                },
                {
                    id: '1-3',
                    title: '1.3 Spotting AI-Generated Content',
                    content: [
                        { type: 'heading', content: 'Deepfakes and Synthetic Media' },
                        { type: 'paragraph', content: 'AI can now create fake videos of real people saying things they never said. This is called a "deepfake." Learning to spot these is a critical skill for the future.' },
                        { type: 'heading', content: 'Red Flags to Watch For' },
                        {
                            type: 'list', content: [
                                'Unnatural blinking or eye movements',
                                'Weird shadows or lighting on the face',
                                'Audio that doesn\'t quite match lip movements',
                                'Too-perfect skin or strange hair boundaries'
                            ]
                        },
                        { type: 'paragraph', content: 'When in doubt, ask yourself: "Where did this come from? Is there a reliable source confirming this is real?"' }
                    ]
                }
            ]
        },
        {
            id: 'module-2',
            title: 'Module 2: Building Your First AI App',
            icon: '⚙️',
            content: [
                { type: 'heading', content: 'From User to Builder' },
                { type: 'paragraph', content: 'Most people just use AI. You\'re going to learn to build with it. This module teaches you to go from typing questions to creating actual applications.' }
            ],
            subSections: [
                {
                    id: '2-1',
                    title: '2.1 Prompt Engineering Basics',
                    content: [
                        { type: 'heading', content: 'The Art of Asking' },
                        { type: 'paragraph', content: 'The way you ask AI a question matters enormously. A vague question gets a vague answer. A specific, well-structured prompt gets exactly what you need.' },
                        { type: 'heading', content: 'The RISEN Framework' },
                        {
                            type: 'list', content: [
                                'Role: "Act as a history teacher..."',
                                'Instructions: "Explain the causes of..."',
                                'Steps: "First, list... Then, describe..."',
                                'End goal: "The explanation should help a 7th grader understand..."',
                                'Narrowing: "Use simple words, no more than 3 paragraphs"'
                            ]
                        }
                    ]
                },
                {
                    id: '2-2',
                    title: '2.2 Text-to-Image Generation',
                    content: [
                        { type: 'heading', content: 'Painting with Words' },
                        { type: 'paragraph', content: 'AI image generators turn text descriptions into pictures. The more specific you are, the better the result. Think like a movie director: describe the scene, lighting, style, and mood.' },
                        { type: 'heading', content: 'Prompt Anatomy' },
                        {
                            type: 'list', content: [
                                'Subject: What is in the image (a robot, a castle, a person)',
                                'Style: How it looks (photorealistic, cartoon, oil painting)',
                                'Lighting: The mood (golden hour, dramatic shadows, soft)',
                                'Details: Specific elements (wearing a blue hat, in a forest)'
                            ]
                        }
                    ]
                },
                {
                    id: '2-3',
                    title: '2.3 Building a Simple AI Tool',
                    content: [
                        { type: 'heading', content: 'Your First AI Creation' },
                        { type: 'paragraph', content: 'You don\'t need to write complex code to build AI tools. Using no-code platforms and AI assistants, you can create useful applications in minutes.' },
                        { type: 'heading', content: 'Project: Homework Helper Bot' },
                        { type: 'paragraph', content: 'Create a custom AI assistant that helps you study. Give it a specific subject, tell it your grade level, and instruct it to quiz you on key concepts. You can share this with classmates.' }
                    ]
                }
            ]
        },
        {
            id: 'module-3',
            title: 'Module 3: Agents & Automations',
            icon: '🤖',
            content: [
                { type: 'heading', content: 'AI That Takes Action' },
                { type: 'paragraph', content: 'Regular AI just answers questions. AI Agents can actually do things: search the web, run calculations, send emails, and complete multi-step tasks. This is the next frontier.' }
            ],
            subSections: [
                {
                    id: '3-1',
                    title: '3.1 What Are AI Agents?',
                    content: [
                        { type: 'heading', content: 'From Chatbot to Worker' },
                        { type: 'paragraph', content: 'An AI Agent is like a smart assistant that can use tools. Instead of just telling you how to do something, it actually does it. Imagine asking for flight options and having the AI actually search, compare, and book.' },
                        { type: 'heading', content: 'The Agent Loop' },
                        {
                            type: 'list', content: [
                                '1. Observe: The agent reads your request',
                                '2. Think: It decides what action to take',
                                '3. Act: It uses a tool (search, calculate, etc.)',
                                '4. Repeat: It loops until the task is done'
                            ]
                        }
                    ]
                },
                {
                    id: '3-2',
                    title: '3.2 Tools and Capabilities',
                    content: [
                        { type: 'heading', content: 'Giving AI Superpowers' },
                        { type: 'paragraph', content: 'By itself, an AI can only generate text. But when you connect it to tools, it becomes much more powerful. Tools are like apps the AI can use.' },
                        {
                            type: 'list', content: [
                                'Web Search: Find current information',
                                'Calculator: Do precise math',
                                'Code Interpreter: Write and run programs',
                                'Image Generator: Create pictures',
                                'Database: Store and retrieve information'
                            ]
                        }
                    ]
                },
                {
                    id: '3-3',
                    title: '3.3 Building Your First Agent',
                    content: [
                        { type: 'heading', content: 'Project: Research Agent' },
                        { type: 'paragraph', content: 'Create an AI agent that can research a topic for you. Give it access to web search and have it compile a summary with sources. This is a skill that will be valuable in high school and beyond.' }
                    ]
                }
            ]
        },
        {
            id: 'module-4',
            title: 'Module 4: Publish, Showcase, Verify',
            icon: '🏆',
            content: [
                { type: 'heading', content: 'Proving Your Skills' },
                { type: 'paragraph', content: 'Knowledge without proof is just a claim. This module teaches you to document your work, build a portfolio, and earn verifiable credentials that colleges and employers will recognize.' }
            ],
            subSections: [
                {
                    id: '4-1',
                    title: '4.1 Building Your Portfolio',
                    content: [
                        { type: 'heading', content: 'Show, Don\'t Tell' },
                        { type: 'paragraph', content: 'Anyone can say they know AI. A portfolio proves it. Document every project you build, explain your process, and showcase the results.' },
                        { type: 'heading', content: 'Portfolio Elements' },
                        {
                            type: 'list', content: [
                                'Project screenshots and descriptions',
                                'Problem you solved and your approach',
                                'What you learned and challenges faced',
                                'Links to live demos when possible'
                            ]
                        }
                    ]
                },
                {
                    id: '4-2',
                    title: '4.2 Verifiable Credentials',
                    content: [
                        { type: 'heading', content: 'Blockchain-Backed Proof' },
                        { type: 'paragraph', content: 'Your AI Pioneer certificate isn\'t just a PDF. It\'s cryptographically signed and can be verified by anyone. This is the future of credentials—unforgeable proof of your achievements.' },
                        { type: 'heading', content: 'What This Means for You' },
                        { type: 'paragraph', content: 'When you apply to college or for jobs, you\'ll have concrete, verifiable proof that you completed this program and demonstrated AI literacy skills. No one can take that away or fake it.' }
                    ]
                },
                {
                    id: '4-3',
                    title: '4.3 Next Steps',
                    content: [
                        { type: 'heading', content: 'Your AI Journey Continues' },
                        { type: 'paragraph', content: 'Completing the AI Pioneer Program is just the beginning. From here, you can explore advanced programs, teach others, or start building AI-powered projects that solve real problems.' },
                        {
                            type: 'list', content: [
                                'Join the ZEN Pioneer community',
                                'Explore the Vanguard professional track',
                                'Help train the next generation of pioneers',
                                'Start your own AI-powered project'
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
