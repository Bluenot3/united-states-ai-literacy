// Train-the-Trainer (T3) Curriculum
import type { ProgramCurriculum } from '../../types';

export const t3Curriculum: ProgramCurriculum = {
    title: 'Train-the-Trainer (T3)',
    description: 'Certification program for educators, facilitators, and program administrators.',
    sections: [
        {
            id: 'overview',
            title: 'T3 Program Overview',
            icon: '👨‍🏫',
            content: [
                { type: 'heading', content: 'Become a Certified ZEN Facilitator' },
                { type: 'paragraph', content: 'The Train-the-Trainer program prepares educators to deliver ZEN AI curriculum in schools, community centers, and organizations. You\'ll learn pedagogy, facilitation techniques, and how to adapt content for diverse audiences.' },
                { type: 'heading', content: 'What You\'ll Gain' },
                {
                    type: 'list', content: [
                        'Official ZEN Facilitator certification',
                        'Access to all curriculum materials and resources',
                        'Training on delivery methods (in-person, hybrid, online)',
                        'Evaluation frameworks and assessment tools'
                    ]
                }
            ]
        },
        {
            id: 'module-1',
            title: 'Module 1: ZEN Teaching Standards & Safety',
            icon: '📋',
            content: [
                { type: 'heading', content: 'The ZEN Approach' },
                { type: 'paragraph', content: 'ZEN programs follow specific standards for quality, safety, and effectiveness. This module covers our core principles and non-negotiable safety requirements.' }
            ],
            subSections: [
                {
                    id: '1-1',
                    title: '1.1 Core Teaching Principles',
                    content: [
                        { type: 'heading', content: 'The ZEN Philosophy' },
                        { type: 'paragraph', content: 'We teach AI as a tool for human empowerment, not replacement. Students should feel capable, safe, and inspired—never intimidated or left behind.' },
                        {
                            type: 'list', content: [
                                'Every learner can succeed with proper support',
                                'Hands-on experience beats passive learning',
                                'Safety and ethics are non-negotiable foundations',
                                'Real-world application drives engagement'
                            ]
                        }
                    ]
                },
                {
                    id: '1-2',
                    title: '1.2 Youth Safety Requirements',
                    content: [
                        { type: 'heading', content: 'Protecting Young Learners' },
                        { type: 'paragraph', content: 'When teaching minors, additional safeguards are essential. This unit covers content filtering, privacy protection, and appropriate AI tool selection.' },
                        { type: 'heading', content: 'Mandatory Protocols' },
                        {
                            type: 'list', content: [
                                'Age-appropriate content filtering on all AI tools',
                                'No collection or storage of student personal data',
                                'Parental consent procedures for online activities',
                                'Clear guidelines for student-AI interactions'
                            ]
                        }
                    ]
                },
                {
                    id: '1-3',
                    title: '1.3 Accessibility Standards',
                    content: [
                        { type: 'heading', content: 'Inclusive Education' },
                        { type: 'paragraph', content: 'All ZEN programs must be accessible to learners with diverse needs. This includes accommodations for visual, auditory, motor, and cognitive differences.' },
                        { type: 'paragraph', content: 'AI tools can actually enhance accessibility—text-to-speech, image descriptions, simplified explanations—when used thoughtfully.' }
                    ]
                }
            ]
        },
        {
            id: 'module-2',
            title: 'Module 2: Facilitation Playbooks',
            icon: '📖',
            content: [
                { type: 'heading', content: 'From Content to Delivery' },
                { type: 'paragraph', content: 'Knowing AI isn\'t enough. You need to know how to teach it. This module provides ready-to-use lesson plans and facilitation techniques.' }
            ],
            subSections: [
                {
                    id: '2-1',
                    title: '2.1 Lesson Plan Structure',
                    content: [
                        { type: 'heading', content: 'The ZEN Lesson Framework' },
                        { type: 'paragraph', content: 'Every ZEN lesson follows a consistent structure: Hook, Explore, Apply, Reflect. This provides predictability while allowing flexibility.' },
                        {
                            type: 'list', content: [
                                'Hook (5 min): Capture attention with a compelling example',
                                'Explore (15 min): Guided discovery of concepts',
                                'Apply (20 min): Hands-on practice with support',
                                'Reflect (10 min): Consolidate and connect learning'
                            ]
                        }
                    ]
                },
                {
                    id: '2-2',
                    title: '2.2 Delivery Formats',
                    content: [
                        { type: 'heading', content: 'Adapting to Your Context' },
                        { type: 'paragraph', content: 'ZEN curriculum works in multiple formats. This unit covers adaptations for in-person classrooms, hybrid settings, and fully online delivery.' },
                        { type: 'heading', content: 'Format Considerations' },
                        {
                            type: 'list', content: [
                                'In-person: Maximize hands-on activities and peer collaboration',
                                'Hybrid: Clear structure for online and offline components',
                                'Online: Engagement strategies to maintain attention',
                                'Self-paced: Scaffolding and checkpoint assessments'
                            ]
                        }
                    ]
                },
                {
                    id: '2-3',
                    title: '2.3 Handling Technical Issues',
                    content: [
                        { type: 'heading', content: 'When Technology Fails' },
                        { type: 'paragraph', content: 'AI tools go down. Internet connections fail. This unit prepares you with backup plans and offline activities that maintain learning momentum.' }
                    ]
                }
            ]
        },
        {
            id: 'module-3',
            title: 'Module 3: Evaluation & Verification',
            icon: '✅',
            content: [
                { type: 'heading', content: 'Measuring Learning' },
                { type: 'paragraph', content: 'Assessment in AI education requires new approaches. This module covers rubrics, portfolios, and verification of student work.' }
            ],
            subSections: [
                {
                    id: '3-1',
                    title: '3.1 Assessment Strategies',
                    content: [
                        { type: 'heading', content: 'Beyond Multiple Choice' },
                        { type: 'paragraph', content: 'AI skills are demonstrated through creation, not selection. Our assessment approach emphasizes portfolios, projects, and process documentation.' },
                        {
                            type: 'list', content: [
                                'Project-based assessments with rubrics',
                                'Portfolio review checkpoints',
                                'Peer feedback and collaboration scores',
                                'Reflection and self-assessment'
                            ]
                        }
                    ]
                },
                {
                    id: '3-2',
                    title: '3.2 Rubrics and Standards',
                    content: [
                        { type: 'heading', content: 'Consistent Evaluation' },
                        { type: 'paragraph', content: 'ZEN provides standardized rubrics for all major assessments. This ensures consistency across facilitators and programs.' },
                        { type: 'heading', content: 'Rubric Categories' },
                        {
                            type: 'list', content: [
                                'Technical proficiency: Demonstrated skill with tools',
                                'Critical thinking: Analysis and evaluation',
                                'Creativity: Original application of concepts',
                                'Safety awareness: Understanding of risks and ethics'
                            ]
                        }
                    ]
                },
                {
                    id: '3-3',
                    title: '3.3 Detecting AI Misuse',
                    content: [
                        { type: 'heading', content: 'Academic Integrity in the AI Age' },
                        { type: 'paragraph', content: 'Students may use AI to complete assignments inappropriately. This unit covers detection strategies and—more importantly—how to design assignments that encourage appropriate AI use.' }
                    ]
                }
            ]
        },
        {
            id: 'module-4',
            title: 'Module 4: Scaling Programs',
            icon: '📈',
            content: [
                { type: 'heading', content: 'Growing Your Impact' },
                { type: 'paragraph', content: 'Once you\'re a certified facilitator, you can bring ZEN programs to your organization. This module covers implementation at scale.' }
            ],
            subSections: [
                {
                    id: '4-1',
                    title: '4.1 Institutional Integration',
                    content: [
                        { type: 'heading', content: 'Working Within Systems' },
                        { type: 'paragraph', content: 'Schools and organizations have existing structures. This unit covers how to integrate ZEN curriculum with existing requirements, schedules, and administrative processes.' },
                        {
                            type: 'list', content: [
                                'Aligning with state and national standards',
                                'Integration with existing technology curriculum',
                                'Administrative approval processes',
                                'Resource and budget planning'
                            ]
                        }
                    ]
                },
                {
                    id: '4-2',
                    title: '4.2 Training Other Facilitators',
                    content: [
                        { type: 'heading', content: 'Building Capacity' },
                        { type: 'paragraph', content: 'As a certified T3 graduate, you can train other facilitators in your organization. This unit covers how to run effective train-the-trainer sessions.' }
                    ]
                },
                {
                    id: '4-3',
                    title: '4.3 Quality Assurance',
                    content: [
                        { type: 'heading', content: 'Maintaining Standards at Scale' },
                        { type: 'paragraph', content: 'Growth shouldn\'t mean quality decline. This unit covers monitoring, feedback loops, and continuous improvement processes.' },
                        { type: 'heading', content: 'Quality Indicators' },
                        {
                            type: 'list', content: [
                                'Student completion and satisfaction rates',
                                'Learning outcome assessments',
                                'Facilitator feedback and support needs',
                                'Parent and stakeholder surveys'
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
