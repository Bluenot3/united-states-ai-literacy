// ZEN Arena Curriculum
import type { ProgramCurriculum } from '../../types';

export const arenaCurriculum: ProgramCurriculum = {
    title: 'ZEN Arena',
    description: 'AI model testing, prompt engineering, and deployment patterns.',
    sections: [
        {
            id: 'overview',
            title: 'Arena Overview',
            icon: '⚔️',
            content: [
                { type: 'heading', content: 'Welcome to the ZEN Arena' },
                { type: 'paragraph', content: 'The Arena is where you test your skills against real AI challenges. Compare models, optimize prompts, experiment with tools, and learn deployment patterns used by professionals.' },
                { type: 'heading', content: 'What You\'ll Master' },
                {
                    type: 'list', content: [
                        'Model selection and comparison',
                        'Advanced prompt engineering',
                        'Tool and agent experimentation',
                        'Production deployment patterns'
                    ]
                }
            ]
        },
        {
            id: 'module-1',
            title: 'Module 1: Model Basics & Selection',
            icon: '🤖',
            content: [
                { type: 'heading', content: 'Choosing the Right Model' },
                { type: 'paragraph', content: 'Not all AI models are equal. Different tasks require different models. This module teaches you to select the right tool for the job.' }
            ],
            subSections: [
                {
                    id: '1-1',
                    title: '1.1 The Model Landscape',
                    content: [
                        { type: 'heading', content: 'Major Providers and Models' },
                        { type: 'paragraph', content: 'OpenAI, Anthropic, Google, Meta, and others all offer different models with different strengths. Understanding the landscape helps you make informed choices.' },
                        {
                            type: 'list', content: [
                                'OpenAI: GPT-4, GPT-4o, o1, o3',
                                'Anthropic: Claude 3.5, Claude 4',
                                'Google: Gemini 2.0, Gemini 2.5',
                                'Meta: Llama 3.x (open source)',
                                'Open Source: Mistral, Qwen, DeepSeek'
                            ]
                        }
                    ]
                },
                {
                    id: '1-2',
                    title: '1.2 Model Characteristics',
                    content: [
                        { type: 'heading', content: 'Speed, Cost, and Capability' },
                        { type: 'paragraph', content: 'Every model has tradeoffs. Larger models are smarter but slower and more expensive. Smaller models are faster and cheaper but less capable.' },
                        { type: 'heading', content: 'Key Metrics' },
                        {
                            type: 'list', content: [
                                'Context window: How much text it can "remember"',
                                'Latency: How fast it responds',
                                'Cost: Price per token (input vs output)',
                                'Benchmark scores: Performance on standardized tests'
                            ]
                        }
                    ]
                },
                {
                    id: '1-3',
                    title: '1.3 Model Selection Strategy',
                    content: [
                        { type: 'heading', content: 'Matching Task to Model' },
                        { type: 'paragraph', content: 'Start with the cheapest model that might work. Test it. If it fails, move up. Don\'t pay for intelligence you don\'t need.' },
                        {
                            type: 'list', content: [
                                'Simple tasks: Small/fast models (GPT-4o-mini, Gemini Flash)',
                                'Complex reasoning: Large models (o3, Claude 4)',
                                'Code: Code-specialized models',
                                'Creative: Models known for creativity'
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'module-2',
            title: 'Module 2: Prompt Testing & Evaluation',
            icon: '🔬',
            content: [
                { type: 'heading', content: 'Scientific Prompt Engineering' },
                { type: 'paragraph', content: 'Professional prompt engineering is systematic, not random. This module teaches you to test, measure, and improve prompts methodically.' }
            ],
            subSections: [
                {
                    id: '2-1',
                    title: '2.1 Evaluation Frameworks',
                    content: [
                        { type: 'heading', content: 'Measuring Prompt Quality' },
                        { type: 'paragraph', content: 'You can\'t improve what you can\'t measure. Define clear criteria for what "good" looks like before you start optimizing.' },
                        {
                            type: 'list', content: [
                                'Accuracy: Is the output factually correct?',
                                'Relevance: Does it answer the actual question?',
                                'Completeness: Is anything missing?',
                                'Format: Does it follow the requested structure?'
                            ]
                        }
                    ]
                },
                {
                    id: '2-2',
                    title: '2.2 A/B Testing Prompts',
                    content: [
                        { type: 'heading', content: 'Compare Systematically' },
                        { type: 'paragraph', content: 'Create two versions of a prompt. Run them on the same test cases. Compare results. The winner becomes your new baseline.' },
                        { type: 'heading', content: 'Testing Process' },
                        {
                            type: 'list', content: [
                                '1. Create test cases with known good outputs',
                                '2. Run both prompts on all test cases',
                                '3. Score outputs against your criteria',
                                '4. Keep the winner, iterate'
                            ]
                        }
                    ]
                },
                {
                    id: '2-3',
                    title: '2.3 Edge Cases and Failure Modes',
                    content: [
                        { type: 'heading', content: 'Finding the Breaking Points' },
                        { type: 'paragraph', content: 'Every prompt has edge cases where it fails. Finding and fixing these before deployment prevents embarrassing failures in production.' },
                        { type: 'paragraph', content: 'Test with unusual inputs, adversarial examples, and edge cases. Document failure modes and either fix them or add guardrails.' }
                    ]
                }
            ]
        },
        {
            id: 'module-3',
            title: 'Module 3: Tooling & Agent Experiments',
            icon: '🧪',
            content: [
                { type: 'heading', content: 'Building AI Systems' },
                { type: 'paragraph', content: 'A single prompt is just the beginning. Real AI systems combine models, tools, and orchestration. This module covers the building blocks.' }
            ],
            subSections: [
                {
                    id: '3-1',
                    title: '3.1 Function Calling',
                    content: [
                        { type: 'heading', content: 'Giving AI Tools' },
                        { type: 'paragraph', content: 'Modern AI APIs support "function calling"—defining tools the model can use. The model decides when to use each tool and with what parameters.' },
                        {
                            type: 'list', content: [
                                'Define functions with descriptions and parameters',
                                'Model chooses when and how to call them',
                                'Execute the function, return results to model',
                                'Model incorporates results into response'
                            ]
                        }
                    ]
                },
                {
                    id: '3-2',
                    title: '3.2 Multi-Agent Patterns',
                    content: [
                        { type: 'heading', content: 'Agents Working Together' },
                        { type: 'paragraph', content: 'Complex tasks benefit from multiple specialized agents. A "manager" agent coordinates "worker" agents, each expert in different domains.' },
                        { type: 'heading', content: 'Common Patterns' },
                        {
                            type: 'list', content: [
                                'Supervisor: One agent coordinates others',
                                'Debate: Agents argue to find best answer',
                                'Pipeline: Each agent handles one step',
                                'Swarm: Agents work in parallel, aggregate results'
                            ]
                        }
                    ]
                },
                {
                    id: '3-3',
                    title: '3.3 Memory and Context Management',
                    content: [
                        { type: 'heading', content: 'Beyond the Context Window' },
                        { type: 'paragraph', content: 'AI models have limited memory. Long conversations or large datasets require external memory systems—databases, vector stores, and retrieval systems.' }
                    ]
                }
            ]
        },
        {
            id: 'module-4',
            title: 'Module 4: Deployment Patterns',
            icon: '🚀',
            content: [
                { type: 'heading', content: 'From Prototype to Production' },
                { type: 'paragraph', content: 'Getting something working in a notebook is just the start. Production deployment requires error handling, monitoring, and cost management.' }
            ],
            subSections: [
                {
                    id: '4-1',
                    title: '4.1 Error Handling and Fallbacks',
                    content: [
                        { type: 'heading', content: 'Graceful Degradation' },
                        { type: 'paragraph', content: 'APIs fail. Models hallucinate. Rate limits hit. Production systems need fallback strategies for every failure mode.' },
                        {
                            type: 'list', content: [
                                'Retry with exponential backoff',
                                'Fallback to simpler model',
                                'Cache common responses',
                                'Graceful error messages to users'
                            ]
                        }
                    ]
                },
                {
                    id: '4-2',
                    title: '4.2 Cost Management',
                    content: [
                        { type: 'heading', content: 'AI Can Get Expensive Fast' },
                        { type: 'paragraph', content: 'Token costs add up. Without controls, a popular feature can blow your budget. This unit covers cost monitoring and optimization.' },
                        { type: 'heading', content: 'Cost Control Strategies' },
                        {
                            type: 'list', content: [
                                'Set hard budgets with alerts',
                                'Use smaller models for simple tasks',
                                'Cache frequent requests',
                                'Rate limit per user/session'
                            ]
                        }
                    ]
                },
                {
                    id: '4-3',
                    title: '4.3 Monitoring and Observability',
                    content: [
                        { type: 'heading', content: 'Seeing What\'s Happening' },
                        { type: 'paragraph', content: 'In production, you need visibility into what your AI is doing. Log prompts, responses, latency, and errors. Review regularly for issues and improvement opportunities.' },
                        {
                            type: 'list', content: [
                                'Log all prompts and responses',
                                'Track latency and error rates',
                                'Monitor cost per request',
                                'Review outputs for quality issues'
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
