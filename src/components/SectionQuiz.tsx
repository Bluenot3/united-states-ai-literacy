import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { programRegistrationAdapter } from '../zen-programs/programRegistrationAdapter';
import { submitVanguardQuizAttempt, type VerifiedQuizAttemptResult } from '../services/programAccess';
import { usePublishedQuizOverride } from '../hooks/useContentOverrides';
import {
    parsePublicQuizPayload,
    quizCompletionKey,
    type ContentOverride,
    type PublicQuizQuestion,
} from '../services/contentOverrides';

// ─── Quiz Data ───────────────────────────────────────────────
const QUIZ_DATA: Record<string, PublicQuizQuestion[]> = {
    // ── Module 1 Section 1: Understanding the Machine Mind ──
    'quiz-1-1': [
        {
            question: 'What is the primary function of "self-attention" in a Transformer model?',
            options: [
                'To memorize the entire training dataset',
                'To weigh the importance of every word relative to every other word in a sentence',
                'To compress images into tokens',
                'To encrypt user prompts for safety',
            ],
            explanation: 'Self-attention allows the model to understand context by relating every token to every other token simultaneously — this is what lets it distinguish "bank" (financial) from "bank" (river).',
        },
        {
            question: 'What does the "context window" of an LLM represent?',
            options: [
                'The total size of the model\'s training data',
                'The maximum amount of text it can process at once',
                'The number of GPUs used during inference',
                'The model\'s long - term memory capacity',
            ],
            explanation: 'The context window is the model\'s working memory — how many tokens it can "see" in a single pass. Everything outside it is invisible.',
        },
        {
            question: 'When GPT-4 generates a response, what is it actually doing?',
            options: [
                'Searching a database of pre-written answers',
                'Running a Google search in the background',
                'Calculating the most probable next token based on its parameters',
                'Copying responses from its training data verbatim',
            ],
            explanation: 'LLMs are fundamentally next-token predictors. They calculate probability distributions over their vocabulary and sample the most likely continuation.',
        },
        {
            question: 'What is an API key in the context of AI systems?',
            options: [
                'A physical USB key that unlocks GPU hardware',
                'A credential that authenticates your requests to an AI model\'s server',
                'A secret prompt that bypasses safety filters',
                'A license to sell AI-generated content',
            ],
            explanation: 'An API key is like a building access card — it verifies your identity and permissions when making programmatic requests to an AI service.',
        },
        {
            question: 'What are "parameters" in a neural network?',
            options: [
                'The questions users ask the model',
                'The programming languages it supports',
                'Numerical weights that collectively determine how the model processes input',
                'The physical servers that host the model',
            ],
            explanation: 'Parameters are billions of numerical values tuned during training. They encode the patterns the model has learned and shape every output it generates.',
        },
    ],

    // ── Module 1 Section 2: How Machines Learn ──
    'quiz-1-2': [
        {
            question: 'What is "gradient descent" in machine learning?',
            options: [
                'A method to increase the model\'s vocabulary',
                'The process of adjusting parameters to minimize prediction errors',
                'A technique for compressing large datasets',
                'A way to speed up API response times',
            ],
            explanation: 'Gradient descent is like a blindfolded hiker feeling the slope and stepping downhill — the model iteratively adjusts its weights to reduce the gap between prediction and reality.',
        },
        {
            question: 'What happens if the learning rate is set too high during training?',
            options: [
                'The model trains faster and more accurately',
                'The model risks overshooting the optimal solution',
                'The model automatically switches to a better algorithm',
                'Nothing — learning rate has no effect on training',
            ],
            explanation: 'A high learning rate means large parameter updates each step. This can cause the optimization to "bounce" over the minimum, never converging on the best solution.',
        },
        {
            question: 'What does "generalization" mean in machine learning?',
            options: [
                'Training on as much data as possible',
                'The model\'s ability to make accurate predictions on data it hasn\'t seen before',
                'Converting text to numerical tokens',
                'Using one model for all possible tasks',
            ],
            explanation: 'Generalization is the core goal of ML — learning patterns from training data that transfer to new, unseen situations rather than memorizing specific examples.',
        },
        {
            question: 'In the "loss landscape" analogy, what does altitude represent?',
            options: [
                'The model\'s confidence level',
                'The prediction error',
                'The number of parameters',
                'The training time',
            ],
            explanation: 'In the loss landscape, high ground = high error. Training is the process of finding the lowest valley (minimum error) through gradient descent.',
        },
        {
            question: 'How do modern LLMs like GPT and Gemini fundamentally predict output?',
            options: [
                'By looking up answers in an encyclopedia',
                'By predicting the most probable next token based on statistical patterns in training data',
                'By running simulations of every possible response',
                'By asking other AI models for help',
            ],
            explanation: 'The core mechanism is identical to simple prediction models but at massive scale — minimize the error between predicted and actual next tokens across trillions of training examples.',
        },
    ],

    // Module 1 exit gate: API readiness across the full foundations module
    'quiz-1-exit': [
        {
            question: 'Which design is safest for calling a paid AI model from a public web app?',
            options: [
                'Put the provider API key in the browser bundle so every user can call it directly',
                'Send requests through a protected server endpoint that keeps the provider key secret',
                'Place the provider API key in an HTML comment',
                'Ask users to share one permanent API key',
            ],
            explanation: 'Provider secrets belong on trusted server infrastructure. A protected endpoint can authenticate users, enforce limits, log failures, and call the model without exposing the key in the browser.',
        },
        {
            question: 'A task needs low cost and high volume, but only moderate reasoning. What is the strongest model-selection approach?',
            options: [
                'Always use the largest model available',
                'Choose the smallest model that reliably meets the task acceptance criteria',
                'Choose a model only by its release date',
                'Randomly rotate models on every request',
            ],
            explanation: 'Model choice is an engineering tradeoff. Test quality against explicit criteria, then use the least expensive and fastest model that consistently clears the required bar.',
        },
        {
            question: 'Why are structured outputs useful when an application must consume a model response?',
            options: [
                'They make every model answer factually correct',
                'They provide a predictable schema that code can validate and process',
                'They eliminate token costs',
                'They allow API keys to be sent safely to the browser',
            ],
            explanation: 'A schema makes model output machine-readable and testable. The application should still validate the returned fields and handle missing or invalid values.',
        },
        {
            question: 'What is the best response when an AI output could affect an important real-world decision?',
            options: [
                'Trust it if the writing sounds confident',
                'Publish it immediately if the model is popular',
                'Verify important claims against reliable sources and keep appropriate human review',
                'Increase temperature until the answer changes',
            ],
            explanation: 'Fluent output can still be wrong. High-impact uses need source verification, clear acceptance criteria, and human oversight appropriate to the risk.',
        },
        {
            question: 'Before shipping an API-backed AI feature, which test plan is most complete?',
            options: [
                'Test one ideal prompt and ship if it works',
                'Check only that the interface looks polished',
                'Test normal, edge, adversarial, and failure cases while measuring quality, latency, and cost',
                'Remove error messages so failures are less visible',
            ],
            explanation: 'Production readiness includes behavior under expected and unexpected inputs, clear failure handling, security checks, and measurable thresholds for quality, speed, and spend.',
        },
    ],

    // ── Module 2 Section 1: Workflow Orchestration ──
    'quiz-2-1': [
        {
            question: 'What is the fundamental difference between "automation" and an "agent"?',
            options: [
                'Agents are faster than automation',
                'Automation follows predefined steps; agents decide what to do',
                'Agents are cheaper to run',
                'There is no difference',
            ],
            explanation: 'Automation executes scripts. Agents reason, plan, and adapt. This distinction is what makes Software 3.0 fundamentally different from previous paradigms.',
        },
        {
            question: 'What role does "orchestration" play in AI systems?',
            options: [
                'It trains the model from scratch',
                'It coordinates multiple tools, models, and workflows into a cohesive pipeline',
                'It only handles error logging',
                'It converts text to speech',
            ],
            explanation: 'Orchestration is the "conductor" that sequences and coordinates individual components — API calls, model inferences, data transformations — into reliable workflows.',
        },
        {
            question: 'Why is workflow orchestration considered a "career-defining skill"?',
            options: [
                'It\'s the easiest AI skill to learn',
                'Once designed, workflows can operate continuously at massive scale across teams and time zones',
                'It only applies to very large companies',
                'It replaces the need for any other AI knowledge',
            ],
            explanation: 'Orchestration transforms individual tools into organizational leverage — a well-designed workflow multiplies human capability across time, geography, and scale.',
        },
        {
            question: 'What distinguishes a "stateful" workflow from a "stateless" one?',
            options: [
                'Stateful workflows run faster',
                'Stateful workflows remember context from previous steps; stateless ones treat each step independently',
                'Stateless workflows are more expensive',
                'There is no practical difference in AI systems',
            ],
            explanation: 'Statefulness is crucial for complex agents that need to track progress, remember decisions, and adapt their plan across multi-step operations.',
        },
        {
            question: 'In a modern AI platform, how do orchestrations, automations, and agents relate?',
            options: [
                'They are three separate systems that never interact',
                'They are combined in a layered architecture where orchestrations coordinate, automations execute reliably, and agents reason adaptively',
                'Agents have replaced both orchestrations and automations entirely',
                'Automations are the only component needed in production',
            ],
            explanation: 'Modern AI platforms layer all three: orchestration provides structure, automation provides reliability, and agents provide reasoning and adaptability.',
        },
    ],

    // ── Module 2 Section 2: Knowledge Retrieval & RAG ──
    'quiz-2-2': [
        {
            question: 'What problem does RAG (Retrieval-Augmented Generation) solve?',
            options: [
                'It makes models train faster',
                'It grounds AI responses in real source material instead of relying on training data alone',
                'It reduces the model\'s parameter count',
                'It translates between programming languages',
            ],
            explanation: 'RAG ensures answers are sourced from verified documents rather than the model\'s potentially outdated or hallucinated training knowledge.',
        },
        {
            question: 'What is an "embedding" in the context of RAG?',
            options: [
                'A file format for PDFs',
                'A numerical representation of meaning that enables semantic search',
                'A type of API key',
                'A method for compressing images',
            ],
            explanation: 'Embeddings convert text into vectors that capture semantic meaning — allowing "revenue growth" to match "income increase" even though the words differ.',
        },
        {
            question: 'In a RAG pipeline, what happens during the "chunking" stage?',
            options: [
                'The model is split across multiple GPUs',
                'Documents are segmented into smaller, meaningful units for embedding',
                'User queries are translated to SQL',
                'Responses are formatted for the frontend',
            ],
            explanation: 'Chunking breaks large documents into digestible segments. Chunk size and overlap are critical tuning parameters that affect retrieval precision.',
        },
        {
            question: 'What is the key difference between RAG (external knowledge) and Agent Memory (internal state)?',
            options: [
                'They are identical systems',
                'RAG retrieves facts and is stateless; Memory stores preferences and is persistent across interactions',
                'Memory is always more accurate than RAG',
                'RAG only works with images',
            ],
            explanation: 'RAG is for authoritative knowledge (policies, manuals). Memory is for experiential state (user preferences, past decisions). Confusing them causes system failures.',
        },
        {
            question: 'Why is RAG described as giving AI "truth"?',
            options: [
                'Because RAG models never make mistakes',
                'Because it ensures responses are grounded in verifiable source documents rather than statistical guesses',
                'Because it was invented by a philosophy department',
                'Because it eliminates the need for human review',
            ],
            explanation: 'Without retrieval, AI is eloquent but unreliable. With retrieval, outputs can be traced to sources, verified, and audited — essential for enterprise trust.',
        },
    ],

    // ── Module 3 Section 1: Cognitive Overload ──
    'quiz-3-1': [
        {
            question: 'What are "open loops" in the context of cognitive overload?',
            options: [
                'Unfinished for-loops in code',
                'Unrecorded tasks and forgotten items that drain cognitive resources even passively',
                'Circular dependencies in neural networks',
                'Open browser tabs',
            ],
            explanation: 'Open loops consume up to 40% of productive capacity. Every unrecorded thought, task, or commitment occupies working memory even when you\'re not actively thinking about it.',
        },
        {
            question: 'What is the core principle of the "Second Brain" approach?',
            options: [
                'Memorize everything using mnemonic techniques',
                'Use your brain as a processor, not a hard drive — index rather than memorize',
                'Rely entirely on AI for all decisions',
                'Avoid using any digital tools',
            ],
            explanation: 'The biological brain is optimized for processing and judgment, not storage. External systems should handle capture and retrieval, freeing cognition for analysis.',
        },
        {
            question: 'According to the curriculum, how much information does the modern professional consume daily?',
            options: [
                'About 1 megabyte',
                'Approximately 34 gigabytes',
                'Exactly 100 pages',
                'Less than 500 kilobytes',
            ],
            explanation: 'The human brain, evolved for savanna-level input, now faces 34 GB of daily information — orders of magnitude beyond its natural processing capacity.',
        },
        {
            question: 'What does the "capture protocol" require?',
            options: [
                'Recording everything in a spreadsheet',
                'If a thought enters your mind, it must immediately leave it and enter a trusted capture system',
                'Taking handwritten notes only',
                'Scheduling weekly brain dumps',
            ],
            explanation: 'Immediate capture is the foundation of every productivity system from GTD to Zettelkasten — it prevents open loops from forming and consuming working memory.',
        },
        {
            question: 'What does the "Memory Decay Lab" demonstrate?',
            options: [
                'How RAM degrades over time in computers',
                'The Ebbinghaus forgetting curve — how quickly uncaptured information is lost',
                'How to improve your memory through exercise',
                'The lifespan of hard drives',
            ],
            explanation: 'The forgetting curve shows that without reinforcement or capture, we lose ~70% of new information within 24 hours — making immediate capture essential.',
        },
    ],

    // ── Module 3 Section 2: Digital Hygiene ──
    'quiz-3-2': [
        {
            question: 'What is the "Universal Header" in Vanguard\'s metadata protocol?',
            options: [
                'A CSS styling rule for headers',
                'A 3-line context block added to the top of every document (Project, Type, Date)',
                'A standardized email signature',
                'A header tag in HTML',
            ],
            explanation: 'The Universal Header ([PROJECT] | [TYPE] | [DATE]) enables future AI agents to instantly categorize any file without reading its full contents.',
        },
        {
            question: 'Why does the "Filename Sovereignty" rule prohibit spaces in filenames?',
            options: [
                'Spaces make files larger',
                'Spaces break many automated tools, scripts, and AI parsing systems',
                'It\'s purely an aesthetic choice',
                'Spaces are not allowed in any operating system',
            ],
            explanation: 'Clean filenames with ISO dates (e.g., 2025-10-12_Project-Zeus_Contract.pdf) enable reliable automated processing across all platforms and AI agents.',
        },
        {
            question: 'Why is metadata engineering critical for AI-powered retrieval?',
            options: [
                'It makes documents look more professional',
                'Without clean metadata, even advanced AI systems will hallucinate or fail to find relevant files',
                'It reduces file sizes by 50%',
                'It\'s only useful for government documents',
            ],
            explanation: 'AI is only as smart as the data you feed it. If your digital life is a swamp of Untitled_Doc_Final_v2.pdf, even GPT-5 will produce unreliable results.',
        },
        {
            question: 'What is the purpose of the "Digital Janitor Lab"?',
            options: [
                'To teach users how to clean their computer hardware',
                'To practice renaming and tagging disorganized files using Vanguard protocols',
                'To delete unnecessary system files',
                'To install antivirus software',
            ],
            explanation: 'The lab gamifies the process of transforming a "toxic drive" of messy files into a structured, AI-searchable knowledge base using proper naming conventions.',
        },
        {
            question: 'Which file format does the curriculum recommend for future-proofing your notes?',
            options: [
                'Microsoft Word (.docx)',
                'Markdown (.md)',
                'PDF',
                'Google Docs',
            ],
            explanation: 'Markdown is the only format that will be universally readable by AI agents of 2030, 2040, and 2050 — it\'s plain text, portable, and not locked into any proprietary ecosystem.',
        },
    ],

    // ── Module 4 Section 1: Systems Synthesis Lab ──
    'quiz-4-1': [
        {
            question: 'What is the "C4 Model" used for in AI systems engineering?',
            options: [
                'A method for training neural networks',
                'A tiered visualization approach (Context, Containers, Components, Code) for system architecture',
                'A classification of AI model sizes',
                'A coding competition framework',
            ],
            explanation: 'The C4 Model lets engineers zoom from high-level system context down to individual code logic — essential for understanding dependencies and failure modes.',
        },
        {
            question: 'What does "blast radius" mean in the context of an AI system?',
            options: [
                'The physical area affected by server cooling',
                'Which downstream services are affected if the AI model hallucinates or fails',
                'The maximum number of users the system can serve',
                'The range of topics the model can discuss',
            ],
            explanation: 'Blast radius mapping identifies single points of failure — if your travel agent AI\'s flight search fails, does the entire booking pipeline collapse?',
        },
        {
            question: 'What is "contract thinking" in systems design?',
            options: [
                'Negotiating legal agreements with AI vendors',
                'Defining every interface with explicit input/output expectations (e.g., JSON schemas)',
                'Writing employment contracts for AI engineers',
                'Calculating the cost of AI API usage',
            ],
            explanation: 'Contract thinking ensures system cohesion — each component\'s output perfectly matches the next component\'s expected input, preventing data loss and degradation.',
        },
        {
            question: 'Why is "architectural reverse-engineering" taught as the first step in Module 4?',
            options: [
                'To learn how to copy competitor products',
                'Because understanding invisible structures that govern AI behavior is the foundation of mastery',
                'It\'s a legal requirement',
                'To practice debugging syntax errors',
            ],
            explanation: 'You can\'t engineer what you don\'t understand. Reverse-engineering existing systems reveals dependencies, bottlenecks, and design patterns that inform your own builds.',
        },
        {
            question: 'What is the purpose of the "System Map" generated in this section?',
            options: [
                'A geographical map of data centers',
                'A visual runbook showing data lineage, privacy checkpoints, and human-in-the-loop nodes',
                'A list of all AI models available',
                'A map of the company organizational chart',
            ],
            explanation: 'The System Map becomes the operational runbook — it documents how data flows, where humans must approve, and what privacy requirements exist at each stage.',
        },
    ],

    // ── Module 4 Section 2: Prompt Systems & Control Flow ──
    'quiz-4-2': [
        {
            question: 'What is the difference between ReAct and Chain-of-Thought (CoT) prompting?',
            options: [
                'They are identical techniques with different names',
                'CoT improves reasoning within the model; ReAct allows the model to interact with external tools',
                'ReAct is slower but CoT is free',
                'CoT is only for image models',
            ],
            explanation: 'Chain-of-Thought makes the model "think step by step" internally. ReAct (Reason + Act) goes further — the model can call APIs, search the web, and execute code.',
        },
        {
            question: 'What is "prompt drift"?',
            options: [
                'When a user forgets what they prompted',
                'When model updates subtly change how a prompt is interpreted, degrading performance',
                'When prompts are translated into another language',
                'When prompts exceed the context window',
            ],
            explanation: 'Prompt drift is a silent production risk. A prompt that worked perfectly with GPT-4 may produce different results after a model update — requiring version control and monitoring.',
        },
        {
            question: 'What does a "Router Chain" do in a prompt system?',
            options: [
                'Encrypts prompts for security',
                'Classifies user intent and routes queries to specialized models (e.g., Flash for speed vs Pro for reasoning)',
                'Translates prompts between languages',
                'Compresses prompts to save tokens',
            ],
            explanation: 'Router chains are lightweight classifiers that determine if a query is "Support", "Sales", or "Technical" and direct it to the optimal model — balancing cost and capability.',
        },
        {
            question: 'Why do prompt systems need version control?',
            options: [
                'To comply with copyright law',
                'Because prompts mirror software APIs — they need to be versioned, tested, and governed to track improvements and guard against drift',
                'Version control is optional and rarely useful',
                'Only because it\'s a company policy requirement',
            ],
            explanation: 'Each prompt revision (v1.0, v1.1) should be documented with how it improved accuracy or safety — enabling rollback when model updates cause regressions.',
        },
        {
            question: 'What does the "Prompt Health Dashboard" monitor?',
            options: [
                'The physical health of the server hardware',
                'Prompt performance in production — visualizing drift, variance, and hallucination rates via animated heatmaps',
                'The number of users online',
                'Internet connection speed',
            ],
            explanation: 'In enterprise MLOps, prompt reliability is paramount. The dashboard surfaces which prompts produce high variance or off-brand outputs, enabling data-driven revision.',
        },
    ],
};

// ─── Pass Threshold ──────────────────────────────────────────
const QUIZ_MODULE_PATTERN = /^quiz-([1-4])(?:-|$)/;

type QuizPersistenceStatus = 'idle' | 'saving' | 'saved' | 'error';

// ─── Component ───────────────────────────────────────────────
interface SectionQuizProps {
    interactiveId: string;
    quizOverride?: ContentOverride | null;
    moduleId?: 1 | 2 | 3 | 4;
}

export function getShippedQuizQuestions(quizId: string): PublicQuizQuestion[] {
    return (QUIZ_DATA[quizId] ?? []).map((question) => ({
        ...question,
        options: [...question.options],
    }));
}

const SectionQuiz: React.FC<SectionQuizProps> = ({ interactiveId, quizOverride, moduleId: moduleIdProp }) => {
    const { user, updateModuleProgress } = useAuth();
    const overrideLookup = usePublishedQuizOverride(interactiveId, !quizOverride);
    const effectiveOverride = quizOverride ?? overrideLookup.override;
    const publicOverride = useMemo(
        () => parsePublicQuizPayload(effectiveOverride?.payload),
        [effectiveOverride?.payload],
    );
    const questions = useMemo(() => {
        if (publicOverride?.quiz_id === interactiveId && publicOverride.questions.length > 0) {
            return publicOverride.questions;
        }
        return getShippedQuizQuestions(interactiveId);
    }, [interactiveId, publicOverride]);
    const passingPercent = publicOverride?.passing_percent ?? 60;
    const requiredCorrect = Math.ceil(questions.length * passingPercent / 100);
    const completionId = effectiveOverride
        ? quizCompletionKey(effectiveOverride, interactiveId)
        : interactiveId;
    const moduleId = useMemo(() => {
        if (moduleIdProp) return moduleIdProp;
        const match = interactiveId.match(QUIZ_MODULE_PATTERN);
        return match ? Number(match[1]) as 1 | 2 | 3 | 4 : null;
    }, [interactiveId, moduleIdProp]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [finished, setFinished] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [selectedOptionIndexes, setSelectedOptionIndexes] = useState<number[]>([]);
    const [verifiedResult, setVerifiedResult] = useState<VerifiedQuizAttemptResult | null>(null);
    const [attemptNumber, setAttemptNumber] = useState(1);
    const [attemptedAt, setAttemptedAt] = useState<string | null>(null);
    const [saveRevision, setSaveRevision] = useState(0);
    const [persistenceStatus, setPersistenceStatus] = useState<QuizPersistenceStatus>('idle');
    const saveOperationRef = useRef<{ key: string; promise: Promise<VerifiedQuizAttemptResult> } | null>(null);

    const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0;
    const passed = verifiedResult?.passed === true;

    useEffect(() => {
        if (!finished || !attemptedAt) {
            return;
        }

        const userId = user?.id;
        if (!userId || !moduleId) {
            setPersistenceStatus('error');
            return;
        }

        const persistenceKey = `${userId}:${completionId}:${attemptNumber}:${attemptedAt}`;
        let operation = saveOperationRef.current;

        if (!operation || operation.key !== persistenceKey) {
            operation = {
                key: persistenceKey,
                promise: (async () => {
                    const verified = await submitVanguardQuizAttempt(interactiveId, selectedOptionIndexes);
                    await programRegistrationAdapter.updateProgramProgress({
                        userId,
                        programKey: 'vanguard',
                        moduleKey: `module-${moduleId}`,
                        lessonKey: interactiveId,
                        progressPercent: Math.round((verified.correct / verified.total) * 100),
                        status: verified.passed ? 'completed' : 'started',
                        metadata: {
                            correct: verified.correct,
                            incorrect: verified.incorrect,
                            total: verified.total,
                            passed: verified.passed,
                            attemptedAt: verified.attemptedAt,
                            attemptNumber,
                        },
                    });
                    return verified;
                })(),
            };
            saveOperationRef.current = operation;
        }

        let active = true;
        setPersistenceStatus('saving');

        void operation.promise
            .then((verified) => {
                if (!active) return;
                setVerifiedResult(verified);
                setScore(verified.correct);
                if (verified.passed) {
                    updateModuleProgress(moduleId, completionId, 'interactive');
                    setShowConfetti(true);
                    window.setTimeout(() => setShowConfetti(false), 3000);
                }
                setPersistenceStatus('saved');
            })
            .catch(() => {
                if (!active) return;
                setPersistenceStatus('error');
            });

        return () => {
            active = false;
        };
    }, [
        attemptNumber,
        attemptedAt,
        completionId,
        finished,
        interactiveId,
        moduleId,
        questions.length,
        saveRevision,
        selectedOptionIndexes,
        updateModuleProgress,
        user?.id,
    ]);

    const handleSelect = useCallback((option: string, optionIndex: number) => {
        if (selected) return;
        setSelected(option);
        setSelectedOptionIndexes((current) => {
            const next = [...current];
            next[currentIndex] = optionIndex;
            return next;
        });
        setAnsweredCount((c) => c + 1);
    }, [currentIndex, selected]);

    const handleNext = useCallback(() => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((i) => i + 1);
            setSelected(null);
        } else {
            setAttemptedAt(new Date().toISOString());
            setFinished(true);
        }
    }, [currentIndex, questions.length]);

    const handleRetry = useCallback(() => {
        saveOperationRef.current = null;
        setCurrentIndex(0);
        setScore(0);
        setSelected(null);
        setFinished(false);
        setShowConfetti(false);
        setAnsweredCount(0);
        setSelectedOptionIndexes([]);
        setVerifiedResult(null);
        setAttemptNumber((attempt) => attempt + 1);
        setAttemptedAt(null);
        setPersistenceStatus('idle');
    }, []);

    const handleRetrySave = useCallback(() => {
        saveOperationRef.current = null;
        setPersistenceStatus('idle');
        setSaveRevision((revision) => revision + 1);
    }, []);

    if (!quizOverride && overrideLookup.loading) {
        return <div className="p-8 text-center text-brand-text-light">Loading the current quiz definitionâ€¦</div>;
    }

    if (!quizOverride && overrideLookup.error) {
        return (
            <div className="my-8 rounded-xl border border-red-400/20 bg-red-500/5 p-6 text-center text-red-200">
                This quiz could not be loaded securely. Check your connection and refresh before continuing.
            </div>
        );
    }

    if (questions.length === 0) {
        return <div className="text-brand-text-light p-8 text-center">Quiz data not found.</div>;
    }

    // ── Completed State ──
    if (finished) {
        return (
            <div className="relative my-10 overflow-hidden">
                {/* Confetti Particles */}
                {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full animate-confetti-fall"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    width: `${6 + Math.random() * 8}px`,
                                    height: `${6 + Math.random() * 8}px`,
                                    background: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4'][i % 6],
                                    animationDelay: `${Math.random() * 1.5}s`,
                                    animationDuration: `${1.5 + Math.random() * 2}s`,
                                }}
                            />
                        ))}
                    </div>
                )}

                <div className="relative z-10 rounded-2xl border border-white/[0.08] p-8 md:p-10 text-center"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                        backdropFilter: 'blur(24px) saturate(150%)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}>
                    {/* Score Ring */}
                    <div className="mx-auto w-32 h-32 relative mb-6">
                        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                            <circle
                                cx="60" cy="60" r="52" fill="none"
                                stroke={passed ? '#10B981' : '#EF4444'}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${(score / questions.length) * 327} 327`}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-brand-text">{score}/{questions.length}</span>
                            <span className="text-xs font-medium text-brand-text-light mt-0.5">SCORE</span>
                        </div>
                    </div>

                    <h3 className="text-2xl font-outfit font-black text-brand-text mb-2">
                        {passed
                            ? persistenceStatus === 'saved' ? '🎉 Section Complete!' : '🎉 Passing Score!'
                            : '📚 Keep Learning!'}
                    </h3>
                    <p className="text-brand-text-light mb-6 max-w-md mx-auto">
                        {passed
                            ? `Excellent work! You scored ${score} out of ${questions.length}. You've demonstrated solid understanding of this section.`
                            : `You scored ${score} out of ${questions.length}. You need ${requiredCorrect} correct answers to pass. Review the material and try again!`}
                    </p>

                    <div
                        role="status"
                        aria-live="polite"
                        className={`mb-6 text-sm font-semibold ${persistenceStatus === 'error'
                            ? 'text-red-400'
                            : persistenceStatus === 'saved'
                                ? 'text-emerald-400'
                                : 'text-brand-text-light'
                            }`}
                    >
                        {persistenceStatus === 'saving' && 'Saving this attempt…'}
                        {persistenceStatus === 'saved' && `Attempt ${attemptNumber} saved.`}
                        {persistenceStatus === 'error' && (
                            <span className="inline-flex flex-wrap items-center justify-center gap-3">
                                <span>Could not save this attempt score.</span>
                                <button
                                    type="button"
                                    onClick={handleRetrySave}
                                    className="rounded-lg border border-red-400/30 px-3 py-1.5 text-red-300 transition-colors hover:bg-red-500/10"
                                >
                                    Retry save
                                </button>
                            </span>
                        )}
                    </div>

                    {!passed && (
                        <button
                            onClick={handleRetry}
                            className="group relative px-8 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                            style={{
                                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                                boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
                            }}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21h5v-5" /></svg>
                                Retry Quiz
                            </span>
                        </button>
                    )}

                    {passed && (
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            {persistenceStatus === 'saved' ? 'Passed and saved' : 'Passing score'}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const q = questions[currentIndex];

    // ── Question State ──
    return (
        <div className="my-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full"
                    style={{
                        background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                        boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                </div>
                <div>
                    <h4 className="font-outfit font-bold text-lg text-brand-text">Section Quiz</h4>
                    <p className="text-xs text-brand-text-light">Test your understanding • {questions.length} questions</p>
                </div>
            </div>

            {/* Main Card */}
            <div
                className="rounded-2xl border border-white/[0.08] overflow-hidden transition-transform duration-300"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                    backdropFilter: 'blur(24px) saturate(150%)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
            >
                {/* Progress Bar */}
                <div className="h-1 bg-white/[0.04] overflow-hidden">
                    <div
                        className="h-full transition-all duration-500 ease-out rounded-r-full"
                        style={{
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #06B6D4)',
                        }}
                    />
                </div>

                <div className="p-6 md:p-8">
                    {/* Question Counter */}
                    <div className="flex items-center justify-between mb-5">
                        <span className="text-xs font-semibold text-brand-text-light tracking-wider uppercase">
                            Question {currentIndex + 1} of {questions.length}
                        </span>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/[0.05] text-brand-text-light">
                            Score: {score}/{answeredCount}
                        </span>
                    </div>

                    {/* Question */}
                    <h3 className="text-xl font-outfit font-bold text-brand-text mb-6 leading-snug">
                        {q.question}
                    </h3>

                    {/* Options */}
                    <div className="grid gap-3">
                        {q.options.map((option, idx) => {
                            const isSelected = selected === option;

                            let optionStyle: React.CSSProperties = {
                                background: 'rgba(255,255,255,0.03)',
                                borderColor: 'rgba(255,255,255,0.08)',
                            };
                            let labelColor = 'text-brand-text-light';

                            if (isSelected) {
                                optionStyle = {
                                    background: 'rgba(59,130,246,0.12)',
                                    borderColor: 'rgba(59,130,246,0.4)',
                                };
                                labelColor = 'text-blue-300';
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleSelect(option, idx)}
                                    disabled={!!selected}
                                    className={`group relative flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${!selected ? 'hover:bg-white/[0.06] hover:border-white/[0.15] hover:scale-[1.01] active:scale-[0.99] cursor-pointer' : ''
                                        } ${labelColor}`}
                                    style={optionStyle}
                                >
                                    <span className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border border-white/10 bg-white/[0.04] mt-0.5"
                                        style={isSelected ? { background: 'rgba(59,130,246,0.2)', borderColor: 'rgba(59,130,246,0.4)' } : {}}>
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="text-[15px] leading-relaxed font-medium">{option}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Explanation */}
                    {selected && (
                        <div className="mt-5 p-4 rounded-xl border border-white/[0.06]"
                            style={{ background: 'rgba(59,130,246,0.06)' }}>
                            <p className="text-sm font-semibold mb-1 text-blue-300">
                                Answer recorded
                            </p>
                            <p className="text-sm text-brand-text-light leading-relaxed">Your full attempt is scored securely after the last question.</p>
                        </div>
                    )}

                    {/* Next Button */}
                    {selected && (
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleNext}
                                className="group flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                                style={{
                                    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                                    boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                                }}
                            >
                                {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><polyline points="9 18 15 12 9 6" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SectionQuiz;
