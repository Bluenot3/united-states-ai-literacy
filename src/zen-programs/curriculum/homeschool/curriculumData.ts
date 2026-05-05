// AI Pioneer Homeschool Kit Curriculum
import type { ProgramCurriculum } from '../../types';

export const homeschoolCurriculum: ProgramCurriculum = {
    title: 'AI Pioneer Homeschool Kit',
    description: 'Complete AI curriculum with daily routines, projects, and transcript documentation.',
    sections: [
        {
            id: 'overview',
            title: 'Homeschool Kit Overview',
            icon: '🏠',
            content: [
                { type: 'heading', content: 'Welcome to the AI Pioneer Homeschool Kit' },
                { type: 'paragraph', content: 'This kit transforms AI literacy into a complete learning experience. Designed for homeschool families, it includes daily routines, project-based learning, portfolio building, and official transcript documentation for college applications.' },
                { type: 'heading', content: 'What\'s Included' },
                {
                    type: 'list', content: [
                        'Structured daily/weekly learning schedules',
                        'Hands-on projects aligned with state standards',
                        'Digital citizenship and safety curriculum',
                        'Portfolio templates and transcript documentation'
                    ]
                }
            ]
        },
        {
            id: 'module-1',
            title: 'Module 1: Foundations',
            icon: '📚',
            content: [
                { type: 'heading', content: 'Building the Base' },
                { type: 'paragraph', content: 'Before diving into AI tools, we establish foundational skills in digital literacy, computational thinking, and safe online practices.' }
            ],
            subSections: [
                {
                    id: '1-1',
                    title: '1.1 AI & Digital Citizenship',
                    content: [
                        { type: 'heading', content: 'Being a Good Digital Citizen' },
                        { type: 'paragraph', content: 'AI amplifies our actions online. Learning to be responsible, kind, and safe online is more important than ever. This unit covers digital footprints, online privacy, and ethical technology use.' },
                        {
                            type: 'list', content: [
                                'Understanding your digital footprint',
                                'Privacy settings and personal information',
                                'Identifying misinformation and deepfakes',
                                'Respectful online communication'
                            ]
                        }
                    ]
                },
                {
                    id: '1-2',
                    title: '1.2 Learning Routines',
                    content: [
                        { type: 'heading', content: 'Daily AI Learning Schedule' },
                        { type: 'paragraph', content: 'Consistency builds mastery. We provide a structured approach that fits into your homeschool day without overwhelming other subjects.' },
                        { type: 'heading', content: 'Sample Weekly Schedule' },
                        {
                            type: 'list', content: [
                                'Monday: New concept introduction (30 min)',
                                'Tuesday: Hands-on practice (45 min)',
                                'Wednesday: Project work (1 hour)',
                                'Thursday: Review and reflection (30 min)',
                                'Friday: Creative exploration (45 min)'
                            ]
                        }
                    ]
                },
                {
                    id: '1-3',
                    title: '1.3 Setting Up Your Workspace',
                    content: [
                        { type: 'heading', content: 'Tools and Environment' },
                        { type: 'paragraph', content: 'A good learning environment accelerates progress. This unit helps you set up age-appropriate AI tools, parental controls, and a productive digital workspace.' },
                        {
                            type: 'list', content: [
                                'Recommended AI tools for different ages',
                                'Parental oversight and monitoring options',
                                'Creating a distraction-free learning zone',
                                'Hardware and software requirements'
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'module-2',
            title: 'Module 2: Programming & Computational Thinking',
            icon: '💻',
            content: [
                { type: 'heading', content: 'Thinking Like a Computer Scientist' },
                { type: 'paragraph', content: 'You don\'t need to be a programmer to think computationally. This module teaches the logical thinking patterns that underlie all technology.' }
            ],
            subSections: [
                {
                    id: '2-1',
                    title: '2.1 Algorithms in Everyday Life',
                    content: [
                        { type: 'heading', content: 'Step-by-Step Thinking' },
                        { type: 'paragraph', content: 'An algorithm is just a set of steps to solve a problem. You already use algorithms every day—recipes, directions, game rules. This unit makes that thinking explicit.' },
                        { type: 'heading', content: 'Practice Exercise' },
                        { type: 'paragraph', content: 'Write an algorithm for making a sandwich. Be precise enough that a robot could follow it. This exercise reveals how detailed computer instructions need to be.' }
                    ]
                },
                {
                    id: '2-2',
                    title: '2.2 Visual Programming',
                    content: [
                        { type: 'heading', content: 'Code Without Typing' },
                        { type: 'paragraph', content: 'Block-based programming tools like Scratch let you build programs by dragging and dropping. This is the perfect on-ramp to computational thinking without syntax frustrations.' },
                        {
                            type: 'list', content: [
                                'Scratch: Animation and games',
                                'Blockly: Logic puzzles and algorithms',
                                'MIT App Inventor: Mobile apps'
                            ]
                        }
                    ]
                },
                {
                    id: '2-3',
                    title: '2.3 Introduction to Python',
                    content: [
                        { type: 'heading', content: 'Real Programming Basics' },
                        { type: 'paragraph', content: 'Python is the most popular language for AI. This unit introduces basic concepts: variables, loops, and functions. AI assistants make learning to code easier than ever.' },
                        { type: 'heading', content: 'AI-Assisted Learning' },
                        { type: 'paragraph', content: 'Use AI as your coding tutor. Ask it to explain errors, suggest improvements, and help you understand concepts. This is how professional developers work.' }
                    ]
                }
            ]
        },
        {
            id: 'module-3',
            title: 'Module 3: AI Projects & Creativity Studio',
            icon: '🎨',
            content: [
                { type: 'heading', content: 'Project-Based Learning' },
                { type: 'paragraph', content: 'Hands-on projects cement knowledge. This module provides guided projects that demonstrate AI skills while building portfolio pieces.' }
            ],
            subSections: [
                {
                    id: '3-1',
                    title: '3.1 AI Art Studio',
                    content: [
                        { type: 'heading', content: 'Creating with AI' },
                        { type: 'paragraph', content: 'Learn to use AI image generators as creative tools. Understand prompt engineering, style control, and the ethics of AI-generated art.' },
                        { type: 'heading', content: 'Project: Illustrated Story' },
                        { type: 'paragraph', content: 'Write a short story and use AI to create illustrations for each scene. This combines creative writing with visual art skills.' }
                    ]
                },
                {
                    id: '3-2',
                    title: '3.2 AI Writing Assistant',
                    content: [
                        { type: 'heading', content: 'Writing with AI Support' },
                        { type: 'paragraph', content: 'AI should enhance your writing, not replace it. This unit teaches how to use AI for brainstorming, editing, and research while maintaining your authentic voice.' },
                        { type: 'heading', content: 'The Right Balance' },
                        {
                            type: 'list', content: [
                                '✅ Using AI to brainstorm ideas',
                                '✅ Getting feedback on drafts',
                                '✅ Research assistance',
                                '❌ Having AI write for you',
                                '❌ Submitting AI work as your own'
                            ]
                        }
                    ]
                },
                {
                    id: '3-3',
                    title: '3.3 Capstone Project',
                    content: [
                        { type: 'heading', content: 'Your Signature Creation' },
                        { type: 'paragraph', content: 'Choose a project that matters to you. It could be a tool that helps your family, a creative work, or something that solves a community problem. This becomes the centerpiece of your portfolio.' }
                    ]
                }
            ]
        },
        {
            id: 'module-4',
            title: 'Module 4: Entrepreneurship & Portfolio',
            icon: '📋',
            content: [
                { type: 'heading', content: 'From Skills to Opportunities' },
                { type: 'paragraph', content: 'This module prepares your work for the real world—college applications, competitions, and even freelance opportunities.' }
            ],
            subSections: [
                {
                    id: '4-1',
                    title: '4.1 Portfolio Development',
                    content: [
                        { type: 'heading', content: 'Documenting Your Journey' },
                        { type: 'paragraph', content: 'Every project should be documented with screenshots, explanations, and reflections. We provide templates that organize your work professionally.' },
                        {
                            type: 'list', content: [
                                'Project description and goals',
                                'Process documentation with screenshots',
                                'Challenges faced and solutions found',
                                'Skills demonstrated and learned'
                            ]
                        }
                    ]
                },
                {
                    id: '4-2',
                    title: '4.2 Transcript Documentation',
                    content: [
                        { type: 'heading', content: 'Official Course Credits' },
                        { type: 'paragraph', content: 'Homeschool students need documentation. We provide transcript-ready course descriptions, learning objectives, and assessment rubrics that satisfy college admissions requirements.' },
                        { type: 'heading', content: 'Course Credit Information' },
                        { type: 'paragraph', content: 'The complete Homeschool Kit represents approximately 1 semester of technology/computer science credit (0.5 credits). All materials align with ISTE standards.' }
                    ]
                },
                {
                    id: '4-3',
                    title: '4.3 Entrepreneurship Basics',
                    content: [
                        { type: 'heading', content: 'Turning Skills Into Value' },
                        { type: 'paragraph', content: 'Your AI skills are valuable. This unit introduces basic entrepreneurship concepts: identifying problems, creating solutions, and understanding how value is created and exchanged.' },
                        { type: 'heading', content: 'Youth Entrepreneurship Ideas' },
                        {
                            type: 'list', content: [
                                'AI tutoring for other students',
                                'Social media management for local businesses',
                                'Digital art commissions',
                                'App or tool development'
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
