
import type { Curriculum } from '../types';

export const curriculumData: Curriculum = {
  title: 'Introduction to Machine Learning',
  summaryForAI:
    'ZEN AI VANGUARD is a comprehensive curriculum designed to take students from foundational AI concepts to advanced, real-world applications. It covers the architecture of AI, generative models for various modalities (text, image, audio, video, 3D), ethics, and hands-on projects. The course features interactive labs for concepts like prompt engineering, adversarial attacks, and AI ethics.',
  sections: [
    {
      id: 'overview',
      title: 'Course Overview',
      icon: 'BookOpen',
      content: [
        {
          type: 'interactive',
          content: '',
          component: 'HeroIntro',
          interactiveId: 'hero-intro'
        },
        {
          type: 'heading',
          content: 'ZEN VANGUARD: Intelligence Architect Program'
        },
        {
          type: 'paragraph',
          content:
            'This program takes you inside the machine mind, from the numerical weights that shape every AI response to the autonomous workflows already transforming industries. You will learn how modern AI systems work, how LLMs generate and fail, how to evaluate outputs with discipline, and how to move into later Vanguard build modules with real technical context instead of guesswork.'
        },
        {
          type: 'interactive',
          component: 'HomeschoolKitRoadmap',
          content: '',
          interactiveId: 'homeschool-roadmap'
        },
        {
          type: 'heading',
          content: 'The Four Pillars of Mastery'
        },
        {
          type: 'paragraph',
          content: "The curriculum is structured around four domains that define modern AI competence: understanding the architecture (how systems are built), creative capability (what they can generate), autonomous execution (how they act independently), and ethical grounding (how to deploy them responsibly)."
        },
        {
          type: 'interactive',
          component: 'CourseConceptMatrix',
          content: '',
          interactiveId: 'concept-matrix'
        },
        {
          type: 'heading',
          content: 'The Big Picture: From Code to Cognition'
        },
        {
          type: 'paragraph',
          content:
            "Software has gone through three fundamental shifts, and each one changed what 'programming' means. **Software 1.0** (1950-2012): Humans write explicit rules, computers follow them exactly. A spam filter checks for keywords like 'free money.' **Software 2.0** (2012-2023): Humans provide examples, computers discover patterns. A spam filter learns from millions of labeled emails what spam looks like, including patterns no human would write rules for. **Software 3.0** (2024+): Humans set goals, computers reason, plan, and act. A spam filter now reads your email context, drafts a reply, and schedules a follow-up autonomously."
        },
        {
          type: 'paragraph',
          content:
            "This isn't abstract. A radiologist using Software 1.0 writes rules to flag anomalies on X-rays. In 2.0, the system learns from 100,000 scans to spot tumors human eyes miss. In 3.0, it detects the anomaly, cross-references patient history, and schedules a follow-up appointment — all before the doctor sees the scan. Explore this evolution in the interactive below."
        },
        {
          type: 'interactive',
          content: '',
          component: 'ParadigmShiftExplorer',
          interactiveId: 'paradigm-shift-1'
        },
        {
          type: 'heading',
          content: 'Software 3.0: The Agentic Era'
        },
        {
          type: 'paragraph',
          content: "In Software 3.0, AI systems don't just answer questions — they operate. They reason through multi-step problems, select the right tools (web search, code execution, database queries), execute actions, evaluate the results, and adjust their approach. This Reason → Act → Observe loop is what makes AI 'agentic' — it pursues a goal across multiple steps without waiting for human input at each stage."
        },
        {
          type: 'interactive',
          component: 'AgenticWorkflowViz',
          content: '',
          interactiveId: 'agentic-loop-viz'
        },
        {
          type: 'heading',
          content: 'How the System "Thinks"'
        },
        {
          type: 'paragraph',
          content: "Every AI response follows a pipeline: raw data is ingested during training, patterns are compressed into numerical weights, and when you ask a question, the model runs inference — calculating the most probable output in milliseconds. Understanding this pipeline is what separates someone who uses AI from someone who builds with it."
        },
        {
          type: 'interactive',
          content: '',
          component: 'AiSystemVisualizer',
          interactiveId: 'overview-visualizer'
        },
        {
          type: 'heading',
          content: 'Curriculum Highlights',
        },
        {
          type: 'list',
          content: [
            '**Neural Blueprints:** Deep dives into transformer layers and self-attention mechanisms.',
            '**Generative Laboratory:** Hands-on training in text, image, and 3D asset synthesis.',
            '**Agent Orchestration:** Designing multi-agent systems using ReAct protocols.',
            '**Web3 & Ownership:** Exploring decentralized AI, model weights on-chain, and digital identity.',
            '**Ethical Safeguards:** Building alignment into the core of every system you deploy.',
          ],
        },
        {
          type: 'paragraph',
          content: 'With the roadmap clear, let\'s start by building an intuition for what AI actually is, how it works at a fundamental level, and where it is headed. The next section covers the foundations.'
        },
      ],
    },
    {
      id: 'ai-foundations',
      title: 'Foundations: The AI Revolution',
      icon: 'Sparkles',
      content: [
        {
          type: 'heading',
          content: 'What is Artificial Intelligence?'
        },
        {
          type: 'paragraph',
          content: "Artificial Intelligence is software that learns patterns from data instead of following hand-written rules. Traditional software requires a programmer to anticipate every scenario. AI systems discover patterns on their own — including patterns too complex for any human to code manually."
        },
        {
          type: 'paragraph',
          content: "**Concept:** A neural network is a mathematical structure loosely inspired by the brain — layers of simple units ('neurons') connected by numerical weights."
        },
        {
          type: 'paragraph',
          content: "**Example:** To classify images of cats vs. dogs, the network learns which pixel patterns (edges, textures, shapes) correlate with each label."
        },
        {
          type: 'paragraph',
          content: "**Real-world application:** This same architecture powers medical imaging systems that detect cancerous cells, fraud detection at banks, and the recommendation engine behind every streaming service you use."
        },
        {
          type: 'paragraph',
          content: "Use the **Neural Network Simulator** below to see this in action. Instead of writing a rule like 'if it has fur AND a tail, it's a dog,' the network weighs multiple inputs simultaneously and arrives at a probability."
        },
        {
          type: 'interactive',
          content: '',
          component: 'NeuralNetworkPlayground',
          interactiveId: 'neural-playground-1'
        },
        {
          type: 'paragraph',
          content: "The chatbot below uses simple rule-matching: it scans your input for keywords and returns a pre-written response. Compare this with ChatGPT, which generates novel responses by predicting the most probable next word. The gap between these two approaches is the gap between Software 1.0 and Software 2.0."
        },
        {
          type: 'interactive',
          content: '',
          component: 'InteractiveChatbot',
          interactiveId: 'foundations-chat'
        },
        {
          type: 'heading',
          content: 'How Large Language Models (LLMs) Work'
        },
        {
          type: 'paragraph',
          content: "Modern AI systems like ChatGPT and Gemini are built on Large Language Models (LLMs). Here's what actually happens when you type a message: your text is broken into tokens (numerical codes that represent word fragments), passed through billions of mathematical weights, and processed to predict the most probable next token. The model doesn't 'understand' language — it calculates statistical relationships between tokens at enormous scale."
        },
        {
          type: 'paragraph',
          content: "**Concept:** Tokenization converts human-readable text into numbers a computer can process."
        },
        {
          type: 'paragraph',
          content: "**Example:** The phrase 'The cat sat' might become [1996, 3287, 7834] — three numerical tokens."
        },
        {
          type: 'paragraph',
          content: "**Real-world application:** Every message you send to ChatGPT, every Google search suggestion, and every autocomplete on your phone starts with this tokenization step. Use the visualizer below to see exactly how a computer reads a sentence."
        },
        {
          type: 'interactive',
          content: '',
          component: 'TokenVisualizer',
          interactiveId: 'foundations-token-viz'
        },
        {
          type: 'paragraph',
          content: "Once the text is tokenized, the model's only job is to predict the next token. It doesn't retrieve facts from a database or 'know' anything. It calculates: given every token it has seen during training, what token is most likely to come next? This is why AI can sound confidently wrong — it optimizes for probability, not truth."
        },
        {
          type: 'interactive',
          content: '',
          component: 'ProbabilitySelector',
          interactiveId: 'foundations-probability'
        },
        {
          type: 'paragraph',
          content: "When you type 'The sky is', the model calculates that 'blue' has a much higher probability than 'green' or 'sandwich.' It does this calculation across billions of parameters (numerical weights tuned during training). The interactive below demonstrates the core principle: given input data, how does a model learn to predict the right output? This is the fundamental logic behind every AI system."
        },
        {
          type: 'interactive',
          content: '',
          component: 'SimplePredictiveModel',
          interactiveId: 'foundations-predict'
        },
        {
          type: 'heading',
          content: 'Improving Daily Life: Real-World Cases'
        },
        {
          type: 'paragraph',
          content: "AI is already reshaping professional work in measurable ways. Radiologists using AI-assisted tools read scans 30% faster with fewer missed diagnoses. Software engineers using AI pair programming report writing code 40–55% faster. Writers use AI to generate first drafts and overcome structural blocks, freeing time for editing and strategy. In the example below, try drafting a professional email — a task that typically takes 10–15 minutes of careful phrasing, done in seconds."
        },
        {
          type: 'interactive',
          content: '',
          component: 'ProfessionalEmailWriter',
          interactiveId: 'foundations-email'
        },
        {
          type: 'heading',
          content: 'What to Expect in the Future'
        },
        {
          type: 'paragraph',
          content: "As models become cheaper and faster, AI is shifting from reactive (answering questions) to agentic (performing multi-step tasks independently). Instead of asking 'What's the weather in Tokyo?', an agent handles 'Plan my Tokyo trip, book flights under $800, and block my calendar.' This shift raises critical questions about jobs, safety, and control that shape every module ahead."
        },
        {
          type: 'interactive',
          content: '',
          component: 'FutureScenarioPoll',
          interactiveId: 'foundations-poll'
        },
        {
          type: 'paragraph',
          content: 'You now have a grounded understanding of what AI is, how LLMs work, and where the field is headed. But understanding theory is different from experiencing capability firsthand. The next section lets you feel the creative power of generative AI directly — before we break down the models behind it.'
        }
      ]
    },
    {
      id: 'ai-magic-demo',
      title: 'Experience the Magic',
      icon: 'Sparkles',
      content: [
        {
          type: 'paragraph',
          content: "Before we dive into the specific models, let's experience the sheer creative power of modern Generative AI. These tools aren't just for retrieving information; they are engines of creation."
        },
        {
          type: 'heading',
          content: 'Text-to-Image: From Thought to Pixel'
        },
        {
          type: 'paragraph',
          content: "Generative AI can hallucinate new realities. By understanding the relationship between text and images, models like Gemini can visualize concepts that have never existed before. Try creating something now."
        },
        {
          type: 'interactive',
          content: '',
          component: 'BeginnerImageGen',
          interactiveId: 'magic-demo-image'
        },
        {
          type: 'heading',
          content: 'Text-to-App: Words into Software'
        },
        {
          type: 'paragraph',
          content: "Perhaps the most disruptive capability is the ability to write software just by describing it. In this simulation, select a prompt card—like a crypto dashboard or a game—to see how AI can write code and deploy a functional mini-app in seconds."
        },
        {
          type: 'interactive',
          content: '',
          component: 'TextToAppGenerator',
          interactiveId: 'magic-demo-app'
        },
        {
          type: 'paragraph',
          content: 'Impressive, right? But which models are powering these capabilities, and how do they differ? The next section maps the current landscape of AI models — their specializations, costs, and tradeoffs — so you can make informed choices about which tools to use.'
        }
      ]
    },
    {
      id: 'ai-models',
      title: 'AI Models Landscape (2025)',
      icon: 'CubeTransparent',
      content: [
        {
          type: 'paragraph',
          content: 'The field of AI is characterized by a rapidly evolving landscape of models from various providers. Understanding their capabilities, costs, and specializations is key. This interactive explorer provides a snapshot of the major models available in late 2025.'
        },
        {
          type: 'interactive',
          content: '',
          component: 'ModelExplorer',
          interactiveId: 'model-explorer-1'
        },
        {
          type: 'paragraph',
          content: 'Now that you have a map of the model landscape, it is time to go deep. Module 1 takes everything you have learned — foundations, generative demos, and model awareness — and builds it into real technical competence. Each section adds a new layer of understanding, from neural architecture to production deployment.'
        }
      ]
    },
    {
      id: 'module-1',
      title: 'Module 1: The Intelligence Inside',
      icon: 'Sparkles',
      content: [
        {
          type: 'paragraph',
          content: 'Every intelligent system, whether biological or artificial, transforms information into action. This section reveals how that happens inside AI models: how data becomes patterns, how patterns become meaning, and how meaning becomes decisions. Through interactive labs, model-powered visualizations, and simulations, you’ll literally watch intelligence form.',
        }
      ],
      subSections: [
        {
          id: '1-1',
          title: '1.1 Understanding the Machine Mind',
          content: [
            { type: 'paragraph', content: 'Before you can build with AI, you need to understand what is actually happening under the hood. This section breaks open the black box and shows you the components that make modern AI systems work — from the mathematical structures that process information to the API keys that grant access.' },
            { type: 'heading', content: 'Core Concepts' },
            {
              type: 'list', content: [
                'Neural networks are mathematical structures organized in layers — each layer extracts progressively more abstract features from input data.',
                'Transformers revolutionized AI by introducing self-attention — the ability to weigh the importance of every word in a sentence relative to every other word, all at once. This is why GPT can understand that "bank" means something different in "river bank" vs. "bank account."',
                'Context windows are the model\'s working memory — how much text it can "see" at once. Embeddings are its long-term memory — compressed numerical representations of meaning.',
                'Foundation models contain billions of parameters. Each parameter is a numerical weight — think of 175 billion dial settings that collectively determine how the model interprets input and generates output.',
              ]
            },
            {
              type: 'paragraph',
              content: '**What is a model, really?** A model is trained the way a doctor is trained: by exposure to thousands of cases until patterns become instinct. During training, the model reads billions of text examples and adjusts its parameters to minimize prediction errors. The result is a compressed record of patterns from training data, expressed through billions of numerical weights, that generates outputs by calculating the most probable next step.'
            },
            {
              type: 'paragraph',
              content: '**Parameters as boundaries:** When we say GPT-4 has 1.8 trillion parameters, we mean 1.8 trillion numerical values that collectively determine every output. Change one parameter and the output barely shifts. Change millions and the model behaves differently — this is how fine-tuning works.'
            },
            {
              type: 'paragraph',
              content: '**Outputs as probability-weighted guesses:** The model doesn\'t "know" the answer. It calculates which answer is most likely given everything it has seen. When it says "The capital of France is Paris," it\'s not retrieving a fact — it\'s calculating that "Paris" has the highest probability of following that sequence of tokens.'
            },
            { type: 'heading', content: 'Visualizations & Labs' },
            { type: 'interactive', content: '', component: 'NeuralEvolutionChronicle', interactiveId: 'neural-evolution-1' },
            { type: 'interactive', content: '', component: 'ModelArmsRaceTimeline', interactiveId: 'arms-race-1' },
            { type: 'interactive', content: '', component: 'ParameterUniverseExplorer', interactiveId: 'param-universe-1' },
            { type: 'interactive', content: '', component: 'ArchitectureBuilderSandbox', interactiveId: 'arch-builder-1' },
            { type: 'heading', content: 'The Power of the Key: API Access' },
            { type: 'paragraph', content: "An API key is a credential — like a building access card — that authenticates your requests to an AI model's server. Without it, your requests are rejected. With it, you can programmatically access the model's capabilities: generating text, analyzing images, embedding data, and more. Every commercial AI application, from chatbots to automated workflows, relies on API authentication." },
            { type: 'interactive', content: '', component: 'ApiKeyChatSimulator', interactiveId: 'api-key-sim-1' },
            { type: 'heading', content: 'How AI Actually Works' },
            { type: 'paragraph', content: "At its foundation, modern AI is applied statistics at enormous scale. The model finds patterns in training data and uses those patterns to make predictions. The chatbot below demonstrates a rule-based system — it matches keywords to pre-written responses. Compare this with how a real LLM generates novel responses by predicting the most probable next token. The difference between these two approaches is the difference between explicit programming and learned behavior." },
            { type: 'interactive', content: '', component: 'InteractiveChatbot', interactiveId: 'beginner-chat-1' },
            { type: 'paragraph', content: 'Now that you understand the architecture — neural layers, parameters, attention, and API access — the natural question is: how does all of this actually learn? In the next section, you will see the training process in action and discover how a model goes from random noise to reliable predictions.' },
            { type: 'interactive', content: '', component: 'SectionQuiz', interactiveId: 'quiz-1-1' },
          ]
        },
        {
          id: '1-2',
          title: '1.2 How Machines "Learn" Predictions',
          content: [
            { type: 'paragraph', content: 'You now know what a model is — billions of numerical weights organized in layers. But how do those weights get their values? The answer is training: a mathematical optimization process that adjusts every parameter until the model\'s predictions match reality as closely as possible. Let\'s see exactly how that works.' },
            { type: 'heading', content: 'Pattern Matching: The Line of Best Fit' },
            { type: 'paragraph', content: "At its simplest, machine learning is pattern matching. In the tool below, the blue dots represent real data — students' study hours plotted against their test scores. The blue line is the model's learned function — a mathematical rule it derived from that data. Drag the 'New Student' input to see how the model predicts an outcome for data it hasn't seen before. This is generalization: applying learned patterns to new situations." },
            { type: 'interactive', content: '', component: 'SimplePredictiveModel', interactiveId: 'simple-model-1' },
            { type: 'heading', content: 'Training: Gradient Descent' },
            { type: 'paragraph', content: '**Concept:** Training is the process of adjusting a model\'s parameters to minimize prediction errors.' },
            { type: 'paragraph', content: '**Example:** Imagine a blindfolded hiker on a mountain where altitude represents error — high ground is high error. The hiker feels the slope (the gradient) and takes a step downhill.' },
            { type: 'paragraph', content: '**Real-world application:** This is exactly how GPT-5 was trained — except instead of one hiker on one mountain, it\'s trillions of parameters being adjusted across a loss landscape with billions of dimensions, costing over $100 million in compute.' },
            { type: 'paragraph', content: 'In the simulation below, navigate the loss landscape to find the minimum error. Notice the learning rate tradeoff: large steps risk overshooting the optimum, while tiny steps waste compute. This tradeoff — between exploration speed and precision — is one of the fundamental engineering decisions in training any AI system.' },
            { type: 'interactive', content: '', component: 'LossLandscapeNavigator', interactiveId: 'loss-landscape-1' },
            { type: 'heading', content: 'From Numbers to Words' },
            { type: 'paragraph', content: "GPT, Gemini, and Claude do this exact same optimization — but on a massive scale. Instead of predicting a number from study hours, they predict the next token in a sequence by analyzing statistical relationships across trillions of training examples. The fundamental principle is identical: minimize error between prediction and reality." },
            { type: 'paragraph', content: 'Training gives a model its knowledge, but knowledge without values is dangerous. When we deploy these optimized systems into the real world — making decisions about who gets hired, who gets a loan, or how a car should react in an emergency — we are encoding human values into mathematics. The next section confronts the hardest question in AI: whose ethics should the machine follow?' },
            { type: 'interactive', content: '', component: 'SectionQuiz', interactiveId: 'quiz-1-2' },
          ]
        },
        {
          id: '1-3',
          title: '1.3 Ethics: Programming Morality',
          content: [
            { type: 'paragraph', content: 'You have seen how models learn from data through optimization. But optimization toward what? Every model has an objective function — a mathematical definition of "success." When that objective is applied to consequential decisions, the question stops being technical and becomes deeply human.' },
            { type: 'heading', content: 'The Trolley Problem' },
            { type: 'paragraph', content: "AI doesn't have a conscience — it has an objective function. When we let machines make consequential decisions (self-driving cars, loan approvals, hiring filters), we encode values into code. But whose values? And what happens when those values conflict?" },
            { type: 'paragraph', content: "In the simulation below, you face the classic ethical dilemma in AI: a self-driving car with failed brakes must choose between two outcomes. There is no 'correct' answer — only tradeoffs. Click each lane to see how Utilitarian ethics (maximize total welfare) and Deontological ethics (follow rules regardless of outcome) interpret the same scenario differently. This is the core challenge of AI alignment." },
            { type: 'interactive', content: '', component: 'EthicalDilemmaSimulator', interactiveId: 'dilemma-sim-1' },
            { type: 'heading', content: 'Hallucinations & Responsibility' },
            { type: 'paragraph', content: "Because AI optimizes for probability rather than truth, it can confidently generate false information — called 'hallucinations.' A model might cite a study that doesn't exist or invent a legal precedent. In professional settings, this isn't just wrong — it's a liability. If an AI-drafted report contains fabricated data, who bears responsibility? The user who trusted it? The company that deployed it? The lab that trained it? These questions are actively shaping AI regulation worldwide." },
            { type: 'paragraph', content: 'Ethics and responsibility start with data. A model can only be as fair, accurate, and useful as the data it was trained on. In the next section, we examine data itself — the raw fuel that powers every AI system — and why data quality is the single biggest determinant of whether AI helps or harms.' },
          ]
        },
        {
          id: '1-4',
          title: '1.4 Data as Fuel: Ingredients for Intelligence',
          content: [
            { type: 'paragraph', content: 'The previous section showed that AI systems can encode bias and produce hallucinations. Both of these failures trace back to the same root cause: the data the model was trained on. Understanding data — how it is collected, cleaned, and structured — is essential to building AI systems that actually work.' },
            { type: 'heading', content: 'Data Quality: Garbage In, Garbage Out' },
            { type: 'paragraph', content: "A model is only as good as its training data. If you train a hiring model on biased historical decisions, it will reproduce those biases at scale. If you train a medical model on incomplete records, it will miss diagnoses. Data quality isn't a technical detail — it's the foundation that determines whether an AI system helps or harms." },
            { type: 'paragraph', content: "In the **Data Quality Lab** below, observe how clean data produces a clear, learnable pattern. Click 'Add Noise' to simulate real-world data problems — errors, duplicates, mislabeled examples. Watch how the model's predictions degrade. This is why data engineering is one of the most critical (and undervalued) roles in AI." },
            { type: 'interactive', content: '', component: 'DataVisualizer', interactiveId: 'data-viz-1' },
            { type: 'heading', content: 'Multimodal AI: Beyond Text' },
            { type: 'paragraph', content: "Modern AI is multimodal — it processes text, images, audio, and video through shared mathematical representations. A model like Gemini can 'read' an image, describe it in text, and generate audio narration — all because these different data types are converted into the same numerical format (embeddings) that the model can reason about. Use the tool below to experience cross-modal generation." },
            { type: 'interactive', content: '', component: 'VoiceMorphStudio', interactiveId: 'beginner-voice-1' },
            { type: 'paragraph', content: 'Data quality determines what a model knows. But even a well-trained model is only as trustworthy as it is secure. In the next section, we explore how AI systems can be deliberately tricked — and why understanding these attack vectors is essential for anyone building production AI.' },
          ]
        },
        {
          id: '1-5',
          title: '1.5 Safety & Security: Fooling the AI',
          content: [
            { type: 'paragraph', content: 'A well-trained model on clean data still has a critical vulnerability: it can be deliberately fooled. This section covers two classes of attacks that exploit fundamental weaknesses in how AI perceives and processes information.' },
            { type: 'heading', content: 'Adversarial Attacks: Tricking the Machine' },
            { type: 'paragraph', content: "Computers don't \"see\" like we do. They look for specific patterns of pixels. This makes them vulnerable to **Adversarial Attacks**. These are physical or digital changes designed to break the AI's logic." },
            { type: 'paragraph', content: "In the simulation below, you are testing a **Self-Driving Car**. It currently sees a STOP sign. Try applying \"Adversarial Stickers\" to the sign. To you, it just looks like a sign with some graffiti. But watch the AI's dashboard. You can trick it into thinking the STOP sign is actually a SPEED LIMIT sign, causing a dangerous accident." },
            { type: 'interactive', content: '', component: 'AdversarialAttackSimulator', interactiveId: 'adversarial-sim-1' },
            { type: 'heading', content: 'Prompt Injection: Tricking the Guard' },
            { type: 'paragraph', content: "“Prompt Injection” is like hacking an AI by talking to it. You try to convince the AI to ignore its safety instructions and reveal secrets. It's a game of persuasion." },
            { type: 'paragraph', content: "Play the game below. The bot has a secret password it is sworn to protect. Can you trick it into telling you? (Hint: Try asking it to roleplay, or translate the secret.)" },
            { type: 'interactive', content: '', component: 'PromptInjectionGame', interactiveId: 'prompt-injection-1' },
            { type: 'paragraph', content: 'Adversarial attacks and prompt injection exploit the model at input time. But there is another fundamental limitation that affects every interaction: the model can only "see" a fixed window of text at once. Understanding this constraint — the context window — is essential for using AI effectively on anything longer than a short conversation.' },
          ]
        },
        {
          id: '1-6',
          title: '1.6 Memory: The Sliding Window',
          content: [
            { type: 'paragraph', content: 'You have seen how models can be tricked by adversarial inputs. But even without an attacker, models have a built-in blind spot: they can only process a limited amount of text at once. This section explores that constraint and what it means for real-world applications.' },
            { type: 'heading', content: 'The Context Window' },
            { type: 'paragraph', content: "**Concept:** A context window is the maximum amount of text a model can process at once — its working memory." },
            { type: 'paragraph', content: "**Example:** Think of reading a book through a 100-word window that slides forward. You can only see what's inside the window; everything before it is gone." },
            { type: 'paragraph', content: "**Real-world application:** This is why AI summarizes long documents incorrectly — when your 50-page contract exceeds the context window, the model literally cannot see the earlier pages while processing the later ones." },
            { type: 'paragraph', content: "In the **Sliding Window Explorer**, drag the slider and watch the highlighted 'window' move through the text. The model only processes what's inside this window. Everything outside is invisible — the model has no memory of it." },
            { type: 'interactive', content: '', component: 'ContextWindowExplorer', interactiveId: 'context-window-1' },
            { type: 'heading', content: 'Memory Decay in Practice' },
            { type: 'paragraph', content: "Because the context window is fixed, early messages in a long conversation eventually fall out of the model's working memory. In the lab below, have a conversation and watch the earliest messages fade. Once they disappear, the model has no knowledge they ever existed — it will contradict earlier statements and lose track of established context. This is why enterprise AI systems use external memory (databases, vector stores) to supplement the model's limited window." },
            { type: 'interactive', content: '', component: 'MemoryDecayLab', interactiveId: 'memory-decay-1' },
            { type: 'paragraph', content: 'Memory decay happens because the model treats all tokens equally within its window — or does it? In reality, the model assigns different levels of importance to different parts of the input. Understanding these attention patterns is the key to writing better prompts and debugging unexpected outputs. That is exactly what we explore next.' },
          ]
        },
        {
          id: '1-7',
          title: '1.7 Inside the Black Box',
          content: [
            { type: 'paragraph', content: 'The context window defines what the model can see; attention weights define what it actually focuses on. This section pries open the black box one layer deeper to show you exactly how the model decides which words matter most — and how inherited biases in training data silently steer those decisions.' },
            { type: 'heading', content: 'Attention Weights: What the Model Focuses On' },
            { type: 'paragraph', content: "When a model generates a response, it assigns different levels of attention to each token in your input. Some words heavily influence the output; others are barely noticed. Understanding this attention distribution is key to effective prompt engineering — if you know what the model focuses on, you can craft prompts that steer its attention precisely." },
            { type: 'paragraph', content: "Hover over the words in the panel below to see their attention weights. A higher percentage means the model relied heavily on that word. Notice how rewording your prompt shifts attention and changes the output — this is the mechanism behind prompt engineering." },
            { type: 'interactive', content: '', component: 'ExplainabilityPanel', interactiveId: 'xai-panel-1' },
            { type: 'heading', content: 'Bias: Inherited Prejudice' },
            { type: 'paragraph', content: "AI models learn from internet data — which contains every human bias, stereotype, and prejudice. When a model trained on biased data makes hiring recommendations, writes performance reviews, or generates images of 'professionals,' it can amplify societal inequities at scale. The **Ethical Bias Mirror** below simulates how meaning drifts when text passes through multiple AI transformations — revealing how bias compounds across processing stages." },
            { type: 'interactive', content: '', component: 'EthicalBiasMirror', interactiveId: 'bias-mirror-1' },
            { type: 'paragraph', content: 'You now understand the internal mechanics: architecture, training, attention, bias. It is time to put this knowledge to work. The next section is your first real-world project — using AI to solve an actual business problem from start to finish.' },
          ]
        },
        {
          id: '1-8',
          title: '1.8 Project: Real-World AI Application',
          content: [
            { type: 'paragraph', content: 'Theory is valuable, but competence is built through application. You have learned how models process information, how they learn, and where they fail. Now, take everything from sections 1.1–1.7 and apply it to a practical challenge: transforming unstructured chaos into structured action.' },
            { type: 'heading', content: 'Mission: Information to Action' },
            { type: 'paragraph', content: "You’ve learned the theory. Now, let’s solve a real problem. In the business world, information overload is the enemy. Your mission is to take a messy, chaotic brain dump and turn it into a crisp, actionable directive." },
            { type: 'paragraph', content: "Use the **Chaos-to-Order Engine** below. Imagine you just walked out of a frantic meeting. You have scribbled notes, fragments of sentences, and action items all jumbled together. Paste them in (or use the example). Watch how AI acts as your 'Chief of Staff', organizing the chaos into a professional email." },
            { type: 'interactive', content: '', component: 'MeetingSummarizer', interactiveId: 'beginner-sum-1' },
            { type: 'heading', content: 'Why This Matters' },
            { type: 'paragraph', content: "This isn't just about saving time; it's about clarity. AI excels at structure. By offloading the organization to AI, you free your brain to focus on the *decisions*." },
            { type: 'paragraph', content: 'You have now used AI to create value. But creation has costs — literal ones. Every AI query consumes electricity, generates carbon, and sends your data to a third party\'s server. The next section quantifies these costs and risks so you can make informed decisions about when and how to use AI.' },
          ]
        },
        {
          id: '1-9',
          title: '1.9 The Cost & Risks of Intelligence',
          content: [
            { type: 'paragraph', content: 'Every AI interaction has a hidden price tag — in energy, in privacy, and in environmental impact. After seeing what AI can create, it is equally important to understand what it costs. This section makes those costs visible.' },
            { type: 'heading', content: 'The Environmental Footprint' },
            { type: 'paragraph', content: "AI computation has a physical cost. Training GPT-4 consumed an estimated 50 gigawatt-hours of electricity — enough to power 4,600 U.S. homes for a year. A single ChatGPT query uses roughly 10x the energy of a Google search. As AI adoption scales to billions of daily queries, the aggregate energy and water consumption of data centers becomes a significant environmental concern." },
            { type: 'paragraph', content: "Use the **Energy Calculator** below to compare the energy footprint of different AI operations against everyday activities. Notice how larger, more capable models consume disproportionately more compute — this is the capability-efficiency tradeoff at the heart of AI infrastructure decisions." },
            { type: 'interactive', content: '', component: 'EnergyCarbonTracker', interactiveId: 'energy-tracker-1' },
            { type: 'heading', content: 'Privacy: The Data You Didn\'t Know You Shared' },
            { type: 'paragraph', content: "Every prompt you send to an AI model travels to a company's server. If you paste confidential data — client names, medical records, proprietary code — that information is now in a third party's infrastructure. Some providers use your inputs for training, meaning your data could influence future model outputs visible to other users." },
            { type: 'paragraph', content: "Test your data awareness with the **Privacy HUD**. Paste a block of text containing sensitive information (names, emails, addresses). Watch the system identify and redact every piece of PII (personally identifiable information). This is the kind of preprocessing step that should happen before any data touches an AI API." },
            { type: 'interactive', content: '', component: 'PrivacyLensDashboard', interactiveId: 'beginner-priv-1' },
            { type: 'paragraph', content: 'You now understand the full picture: how AI works, how it learns, where it fails, what it costs, and what it risks. Before moving into the advanced operator techniques, the next section gives you space to reflect on the creative dimension — how to use AI as an iterative thinking partner rather than a one-shot answer machine.' },
          ]
        },
        {
          id: '1-10',
          title: '1.10 Reflection: The Creative Spark',
          content: [
            { type: 'paragraph', content: 'You have built a strong foundation: architecture, training, ethics, data, security, memory, attention, application, and cost. This final foundational section explores a mindset shift — treating AI not as a vending machine that gives you one answer, but as a creative collaborator you iterate with.' },
            { type: 'heading', content: 'Iterative Creation' },
            { type: 'paragraph', content: "AI isn't a slot machine where you pull the lever once. It's an iterative collaborator. The most effective AI users treat generation as a cycle: provide a seed, evaluate the output, refine the prompt, and repeat. Each iteration narrows the gap between what you imagined and what the model produces." },
            { type: 'paragraph', content: "In the **Idea Evolution Lab**, enter a simple concept — even something mundane like 'a shoe.' Watch the AI mutate it through multiple creative lenses, generating variations you wouldn't have conceived independently. This iterative expansion is the foundation of AI-assisted creative workflows used in design studios, advertising agencies, and product teams." },
            { type: 'interactive', content: '', component: 'PromptMutationStudio', interactiveId: 'beginner-proj-1' },
            { type: 'heading', content: 'Mastery Check' },
            { type: 'paragraph', content: "Before proceeding to the advanced topics, verify your understanding of core concepts from sections 1.1–1.10. This gate requires 4/5 correct answers across recall, near-transfer, and far-transfer question types, plus a micro-build output where you convert a vague prompt into a structured prompt specification." },
            { type: 'interactive', content: '', component: 'MasteryCheckGate', interactiveId: 'mastery-check-1-10' },
            { type: 'paragraph', content: 'If you passed the mastery gate, you are ready for the advanced operator sections. The next ten sections (1.11–1.22) take you from understanding AI to engineering with it — covering model steering, cost management, structured outputs, agent loops, retrieval systems, security hardening, and production-grade reliability.' },
          ]
        },
        {
          id: '1-11',
          title: '1.11 The Model Control Panel — Steering Output',
          content: [
            { type: 'paragraph', content: 'With the core foundations locked in, your first advanced skill is learning to steer the model itself. Every AI API exposes parameters that control the randomness and creativity of outputs. Mastering these controls is what separates a casual user from a production engineer.' },
            { type: 'heading', content: 'Temperature, Top-K, and Top-P' },
            { type: 'paragraph', content: "Every model API exposes steering parameters that control *how* the model selects its next token. **Temperature** scales the probability distribution: at 0, the model is deterministic (always picks the most likely token); at 2, it's wildly creative (flattens probabilities across all options). **Top-K** limits the candidate pool to the K most likely tokens. **Top-P** (nucleus sampling) selects the smallest set of tokens whose cumulative probability exceeds P." },
            { type: 'paragraph', content: "Understanding these controls is the difference between getting reliable, repeatable outputs for production systems and getting surprising, creative outputs for brainstorming. The playground below lets you compare identical prompts at different temperature settings side-by-side." },
            { type: 'interactive', content: '', component: 'TemperaturePlayground', interactiveId: 'temp-playground-1' },
            { type: 'paragraph', content: 'Steering the model controls how it generates. But every token it generates comes with a cost. The next section shows you exactly how AI pricing works — and how understanding tokenization can save your organization thousands of dollars.' },
          ]
        },
        {
          id: '1-12',
          title: '1.12 Tokens as Currency — Cost Awareness',
          content: [
            { type: 'paragraph', content: 'You can now control how the model generates. The next critical skill is understanding how much that generation costs — because AI APIs charge by the token, and the difference between model tiers can be 100x.' },
            { type: 'heading', content: 'How Tokenization Drives Cost' },
            { type: 'paragraph', content: "AI APIs charge per token, not per word. A token is a subword unit — typically 3–4 characters in English. The word 'understanding' is 3 tokens. A 1,000-word essay is approximately 1,300 tokens. Your bill is (input tokens + output tokens) × price per token." },
            { type: 'paragraph', content: "Different model tiers have dramatically different costs: a fast/cheap model might charge $0.15 per million tokens, while a deep reasoning model charges $15–60 per million. Choosing the right tier for the right task is a core engineering skill. The **Token Receipt Printer** below lets you paste text and see estimated token counts and costs across model tiers." },
            { type: 'interactive', content: '', component: 'TokenReceiptPrinter', interactiveId: 'token-receipt-1' },
            { type: 'paragraph', content: 'You can steer the model and estimate the cost. But in production, you rarely want raw text back — you need structured data your application can parse and act on. The next section covers how to force models to output valid JSON and structured formats.' },
          ]
        },
        {
          id: '1-13',
          title: '1.13 The Shape of Data — JSON & Structured Outputs',
          content: [
            { type: 'paragraph', content: 'Cost management keeps your AI budget under control. But real applications do not just need text — they need structured, machine-readable outputs that downstream systems can consume without parsing errors.' },
            { type: 'heading', content: 'Why Structure Matters' },
            { type: 'paragraph', content: "Language models generate unstructured text by default. But production applications need structured data: JSON for APIs, tables for databases, schemas for validation. **Structured output mode** forces the model to generate valid JSON that conforms to a schema you define." },
            { type: 'paragraph', content: "The challenge: models sometimes produce malformed JSON — trailing commas, missing brackets, unquoted keys, or hallucinated fields. The **JSON Surgeon** lab below gives you broken JSON samples and challenges you to diagnose and fix them against a target schema." },
            { type: 'interactive', content: '', component: 'JsonSurgeon', interactiveId: 'json-surgeon-1' },
            { type: 'paragraph', content: 'Structured outputs turn the model into a reliable data source. But a model alone can only generate text — it cannot search the web, run code, or call APIs. To do those things, it needs tools. The next section introduces the agent pattern: a model that reasons about which tools to use and in what order.' },
          ]
        },
        {
          id: '1-14',
          title: '1.14 Tool Use and Agent Loops',
          content: [
            { type: 'paragraph', content: 'A model that outputs perfect JSON is useful. A model that can also search the web, execute code, and call APIs is transformative. This section introduces the agent pattern — the architecture that turns a passive text generator into an active problem solver.' },
            { type: 'heading', content: 'From Text to Action' },
            { type: 'paragraph', content: "A model alone can only generate text. An **agent** is a model plus tools plus a reasoning loop. The pattern is: (1) the model receives a task, (2) it decides which tool to call and with what arguments, (3) it observes the tool's output, (4) it decides whether to call another tool or return a final answer." },
            { type: 'paragraph', content: "Tools can be anything: web search, code execution, database queries, API calls, file I/O. The model acts as the *orchestrator* — it doesn't perform the actions directly but decides which actions to take and in what order. This is the foundation of autonomous AI systems." },
            { type: 'paragraph', content: "The **Mini Agent Simulator** below lets you walk through a 3-step agent loop: pick tools, observe results, and update the plan. It also shows common failure modes like calling tools in the wrong order or misinterpreting tool output." },
            { type: 'interactive', content: '', component: 'MiniAgentSimulator', interactiveId: 'agent-sim-1' },
            { type: 'paragraph', content: 'Agents can act, but they are limited by what the model already knows. What if the agent needs information from your private documents, databases, or recent events the model was never trained on? That is the problem RAG solves — and it is the focus of the next section.' },
          ]
        },
        {
          id: '1-15',
          title: '1.15 Retrieval and Memory — RAG Fundamentals',
          content: [
            { type: 'paragraph', content: 'Agents can use tools, but they still rely on the model\'s training data for knowledge. When your application needs to reference private documents, recent events, or domain-specific data the model has never seen, you need a way to inject that knowledge at query time. That technique is called RAG.' },
            { type: 'heading', content: 'Why Models Need External Knowledge' },
            { type: 'paragraph', content: "Language models have a knowledge cutoff — they don't know anything that happened after their training data ends. They also can't access your private documents, databases, or internal wikis. **RAG (Retrieval-Augmented Generation)** solves this by retrieving relevant documents at query time and injecting them into the prompt context." },
            { type: 'paragraph', content: "The RAG pipeline: (1) chunk your documents into passages, (2) convert each passage to an embedding vector, (3) at query time, embed the user's question, (4) find the most similar passages via vector similarity search, (5) inject retrieved passages into the prompt, (6) generate an answer grounded in retrieved facts." },
            { type: 'paragraph', content: "The **Semantic Search Lab** below demonstrates the difference between keyword search (exact string matching) and semantic search (meaning-based matching). Notice how semantic search finds relevant documents even when the exact words don't match." },
            { type: 'interactive', content: '', component: 'SemanticSearchLab', interactiveId: 'semantic-search-1' },
            { type: 'paragraph', content: 'You now have three powerful techniques: prompting, RAG, and agent tools. But how do you decide which to use for a given problem? The next section gives you a decision framework for choosing the right approach — because using the wrong technique is often worse than using none at all.' },
          ]
        },
        {
          id: '1-16',
          title: '1.16 When to Prompt, RAG, or Fine-Tune',
          content: [
            { type: 'paragraph', content: 'You have learned prompting, RAG, and tool use individually. In practice, the hardest skill is knowing which approach to apply to a given problem. This section provides a decision framework that prevents you from over-engineering simple tasks or under-engineering critical ones.' },
            { type: 'heading', content: 'The Approach Decision Tree' },
            { type: 'paragraph', content: "Not every problem needs the same solution. **Prompting** is cheapest and fastest — modify the instruction, not the model. **RAG** is best when you need the model to reference specific, changing data (policies, product catalogs, recent events). **Fine-tuning** is best when you need the model to adopt a specific behavior, tone, or domain expertise that can't be achieved through prompting alone." },
            {
              type: 'list', content: [
                "**Prompt engineering:** Best for general tasks, rapid iteration, and when quality is 'good enough.' Cost: free beyond API usage.",
                "**RAG:** Best when data changes frequently, accuracy on specific documents is critical, or the knowledge base is too large for a single prompt. Cost: embedding + vector DB storage.",
                "**Fine-tuning:** Best when you need consistent style/behavior, domain-specific vocabulary, or when prompting alone can't reach required quality. Cost: training compute + evaluation.",
              ]
            },
            { type: 'paragraph', content: "Use the **Approach Decision Tree** below to evaluate a use case and get a recommendation. Answer questions about your data, consistency needs, and budget to see which approach fits best." },
            { type: 'interactive', content: '', component: 'ApproachDecisionTree', interactiveId: 'approach-tree-1' },
            { type: 'paragraph', content: 'Choosing the right approach is half the battle. The other half is defending your system against attacks. The next section goes deeper into prompt injection — the most common AI-specific vulnerability — and shows you the defense techniques used in production.' },
          ]
        },
        {
          id: '1-17',
          title: '1.17 Security Fundamentals — Prompt Injection & Defenses',
          content: [
            { type: 'paragraph', content: 'You explored prompt injection briefly in section 1.5. Now we go deeper. In production, prompt injection is not a game — it is the most common attack vector against deployed AI systems. This section covers the full attack surface and the layered defenses used to mitigate it.' },
            { type: 'heading', content: 'The Attack Surface' },
            { type: 'paragraph', content: "AI systems are vulnerable to a unique class of attacks: **prompt injection.** An attacker crafts input that overrides the system prompt, causing the model to ignore safety rules, leak confidential information, or perform unauthorized actions. This is not hypothetical — prompt injection has been demonstrated against production systems from major providers." },
            { type: 'paragraph', content: "Common attack vectors include: direct instruction override ('Ignore all previous instructions...'), social engineering via role-play ('You are DAN...'), indirect injection via translated text, and prompt extraction attempts. Defenses include input sanitization, output filtering, instruction hierarchy enforcement, and adversarial testing." },
            { type: 'paragraph', content: "The **Red Team Bot** below lets you try pre-built prompt injection attacks against a defended system. See which attacks get blocked and which partially bypass defenses — and learn why each attack works or fails." },
            { type: 'interactive', content: '', component: 'RedTeamBot', interactiveId: 'red-team-1' },
            { type: 'paragraph', content: 'A secure system still needs to be a reliable one. Defenses stop attackers, but how do you ensure the system works correctly for legitimate users? The next section introduces the discipline of prompt testing — treating prompts as code that deserves the same rigor as any software you ship.' },
          ]
        },
        {
          id: '1-18',
          title: '1.18 Reliability Engineering — Testing & Validation',
          content: [
            { type: 'paragraph', content: 'Security hardens your system against attackers. Reliability engineering ensures it works correctly for everyone else. This section applies software testing discipline to AI: defining acceptance criteria, running automated checks, and catching regressions before they reach users.' },
            { type: 'heading', content: 'Prompts Are Code — Test Them Like Code' },
            { type: 'paragraph', content: "In traditional software, you write unit tests to verify that functions return expected outputs for given inputs. The same principle applies to prompts. A **prompt unit test** defines: (1) a specific prompt, (2) acceptance criteria for the output, and (3) pass/fail conditions." },
            { type: 'paragraph', content: "Acceptance criteria might include: 'output contains all 3 action items,' 'each item has an owner,' 'output is valid JSON,' or 'tone is professional.' Running these tests automatically across prompt versions ensures that changes don't introduce regressions." },
            { type: 'paragraph', content: "The **Prompt Unit Tester** below demonstrates this concept. Run 5 pre-defined tests, each with specific acceptance criteria, and observe the pass/fail results. This is how production AI teams validate prompt quality." },
            { type: 'interactive', content: '', component: 'PromptUnitTester', interactiveId: 'prompt-tester-1' },
            { type: 'paragraph', content: 'You can now test your prompts for quality. The final engineering decision is choosing which model to run those prompts on. The next section covers model selection — matching the right model tier to the right task based on volume, latency, accuracy, and cost.' },
          ]
        },
        {
          id: '1-19',
          title: '1.19 Model Selection — Picking the Right Tool',
          content: [
            { type: 'paragraph', content: 'Tested prompts need the right model behind them. Running a premium model on a simple classification task wastes money; running a cheap model on a complex legal analysis risks disaster. This section teaches you to match model tiers to task requirements.' },
            { type: 'heading', content: 'Not Every Task Needs the Smartest Model' },
            { type: 'paragraph', content: "Model selection is a cost-engineering decision. A classification task that processes 10,000 tickets per day can use a fast, cheap model — the task is well-defined and doesn't require deep reasoning. A legal contract analysis task that processes 10 documents per day should use a premium model — the stakes are high and the reasoning is complex." },
            { type: 'paragraph', content: "The three model tiers: **Fast/Cheap** (classification, simple extraction, high-volume), **Balanced** (general purpose, content generation, code assistance), and **Deep Reasoning** (complex analysis, math, multi-step logic). Choosing wrong is expensive: a premium model on a classification task costs 100x more with negligible accuracy improvement; a cheap model on a legal analysis task costs nothing but might miss a critical risk." },
            { type: 'interactive', content: '', component: 'ModelPickerLab', interactiveId: 'model-picker-1' },
            { type: 'paragraph', content: 'You have covered every major competency: architecture, training, steering, cost, structure, agents, RAG, security, reliability, and model selection. The next section introduces one final concept that ties your completed work to the broader ecosystem: verifiable credentials — cryptographic proof that you have demonstrated these skills.' },
          ]
        },
        {
          id: '1-20',
          title: '1.20 Web3 Bridge — Verifiable Credentials',
          content: [
            { type: 'paragraph', content: 'You have built a complete skill set across this module. Traditional certificates are static PDFs — easy to forge and impossible to verify programmatically. This section introduces a better model: verifiable credentials that are cryptographically signed and machine-readable.' },
            { type: 'heading', content: 'From Completion to Proof' },
            { type: 'paragraph', content: "Traditional certificates are PDFs — easy to forge, impossible to verify programmatically. **Verifiable credentials** are machine-readable, cryptographically signed, and optionally anchored on-chain. They contain: an issuer DID (decentralized identifier), a subject (the learner), claims (skills demonstrated), evidence hashes (cryptographic fingerprints of artifacts), and a digital signature." },
            { type: 'paragraph', content: "This module's credential follows the W3C Verifiable Credentials standard. When you complete the checkpoint below, you'll generate a credential JSON with evidence hashes, skill claims, and a cryptographic proof — the same format used by professional certification programs building on decentralized identity infrastructure." },
            { type: 'interactive', content: '', component: 'CredentialMintPreview', interactiveId: 'credential-mint-1' },
            { type: 'paragraph', content: 'With your credential framework ready, there is one step left: proving you can integrate all of these skills into a single, coherent application design. The capstone challenge is next.' },
          ]
        },
        {
          id: '1-21',
          title: '1.21 Capstone — Integrated Application',
          content: [
            { type: 'paragraph', content: 'Every section in this module taught one piece of the puzzle. The capstone is where you prove you can assemble them all. This is not a quiz — it is a design exercise that mirrors how real AI teams scope and plan production applications.' },
            { type: 'heading', content: 'Pulling It All Together' },
            { type: 'paragraph', content: "You've now covered: neural network architecture, gradient descent, tokenization, context windows, prompt engineering, model steering, cost management, structured outputs, tool use, RAG, security, reliability, and model selection. The capstone challenge integrates these skills." },
            {
              type: 'list', content: [
                "**Design a prompt spec** for a realistic business use case (customer support, document analysis, content generation)",
                "**Select the appropriate model tier** based on volume, latency, and accuracy requirements",
                "**Estimate token costs** using the Token Receipt Printer from section 1.12",
                "**Identify security risks** using the Red Team techniques from section 1.17",
                "**Define acceptance criteria** using the testing patterns from section 1.18",
              ]
            },
            { type: 'paragraph', content: "This is not a graded assignment — it's a self-assessment. Review each section's interactive component as needed. When you're confident you can design, cost, secure, and validate an AI application end-to-end, you're ready for the exit exam." },
            { type: 'paragraph', content: 'Once you feel confident in your capstone design, proceed to the final gate: the API-Readiness Exit Exam that validates your full Module 1 competence and unlocks progression to Module 2.' },
          ]
        },
        {
          id: '1-22',
          title: '1.22 API-Readiness Gate — Exit Exam',
          content: [
            { type: 'paragraph', content: 'This is the final gate. Everything from sections 1.1 through 1.21 converges here. Pass this exam and you will have earned your Module 1 verifiable credential — and you will be ready to build with the generative tools covered in Module 2.' },
            { type: 'heading', content: 'Final Assessment' },
            { type: 'paragraph', content: "This exit exam validates your readiness to work with AI model APIs in production. It covers terminology, architecture decisions, cost estimation, security awareness, and system design. Completion unlocks your Module 1 verifiable credential and progression to Module 2." },
            { type: 'paragraph', content: "The exam includes questions across all major topics: model architecture, tokenization, prompt engineering, structured outputs, agent patterns, RAG, security, reliability, and model selection. You need a passing score to proceed." },
            { type: 'interactive', content: '', component: 'SectionQuiz', interactiveId: 'quiz-1-exit' },
          ]
        }
      ]
    },
    {
      id: 'module-2',
      title: 'Module 2: Generative Intelligence',
      icon: 'Sparkles',
      content: [
        { type: 'paragraph', content: "You’ve learned how machines think. Now you’ll learn how they dream. Generative AI doesn’t simply process information—it creates. From text and art to sound, motion, and 3D space, these models convert data into new possibilities. This section turns you into a creative engineer, blending imagination with algorithmic precision." },
      ],
      subSections: [
        {
          id: '2-1',
          title: '2.1 The Science of Creation',
          content: [
            { type: 'paragraph', content: 'Module 1 taught you how AI processes and predicts. This module teaches you how it creates. We start with the fundamental mechanisms behind generation — the mathematics that turn noise into art, silence into music, and prompts into entire applications.' },
            { type: 'heading', content: 'How Generative AI Creates' },
            {
              type: 'list', content: [
                "**Probability distributions:** Generative models learn the statistical structure of their training data — what's likely to follow what. Generation is the process of sampling from these learned distributions.",
                "**Diffusion models:** These start with pure noise (random static) and iteratively remove it, step by step, until structured content emerges. Each denoising step is like a sculptor removing marble — the image was always 'inside' the noise, and the model reveals it gradually.",
                "**GANs (Generative Adversarial Networks):** Two networks compete — a generator creates content and a discriminator judges whether it's real or fake. The generator improves by learning to fool the discriminator.",
                "**Transformers:** The architecture behind GPT, Gemini, and Claude. They generate output token by token, using self-attention to maintain coherence across the entire sequence.",
                "**Multimodal embeddings:** Text, images, audio, and code can be converted into the same mathematical space (embeddings), allowing a single model to reason across modalities."
              ]
            },
            { type: 'heading', content: 'From Noise to Meaning: Diffusion in Action' },
            { type: 'paragraph', content: "Noise is random static — like TV snow. It has no structure, no pattern, no meaning. Diffusion models start with this randomness intentionally: it guarantees the model creates structure from scratch rather than copying. Each denoising step reveals more structure, guided by the text prompt you provide. The interactive below lets you control this process directly — adjust the number of steps, guidance scale (how closely the model follows your prompt), and sampling rate to see how quality trades off with compute." },
            { type: 'interactive', content: '', component: 'DiffusionFieldExplorer', interactiveId: 'diffusion-explorer-1' },
            { type: 'heading', content: 'Structured Prompting' },
            { type: 'paragraph', content: 'Effective prompting is engineering, not guessing. The key technique is structured decomposition: assign a **Role** ("Act as a senior copywriter"), set **Constraints** ("Use under 50 words, no jargon"), define **Format** ("Output as a bulleted list"), and specify **Style** ("Professional but warm"). Each element narrows the probability space the model samples from. Use the workbench below to practice building structured prompts.' },
            { type: 'interactive', content: '', component: 'PromptArchitectWorkbench', interactiveId: 'int-prompt-2' },
            { type: 'paragraph', content: 'You now understand the generation mechanisms and the prompt engineering principles that steer them. The next section focuses on language specifically — treating words as a design material and prompts as precision instruments.' },
          ]
        },
        {
          id: '2-2',
          title: '2.2 Language as Design',
          content: [
            { type: 'paragraph', content: 'The previous section covered how generative models work under the hood. Now we focus on the skill of using them effectively. Prompt engineering is where your intent meets the model\'s capability — and precision makes the difference between mediocre output and professional-grade results.' },
            { type: 'paragraph', content: "Words are code. Prompts are blueprints. Here you'll learn to steer models from chaos to coherence." },
            { type: 'heading', content: 'Interactive Studio – Prompt Architect Workbench' },
            { type: 'paragraph', content: 'Design complex prompts with nested roles and constraints. Define tone, medium, and structure. Gemini explains how each token alters attention weights.' },
            { type: 'interactive', content: '', component: 'PromptArchitectWorkbench', interactiveId: 'prompt-architect-1' },
            { type: 'heading', content: 'Choosing the Right Model' },
            { type: 'paragraph', content: "Not every task needs the smartest model. Use the Explorer below to compare models based on speed, cost, and specialty (like coding vs. writing)." },
            { type: 'interactive', content: '', component: 'ModelExplorer', interactiveId: 'int-model-2' },
            { type: 'paragraph', content: 'You can now engineer text with precision. The next section takes these same principles and applies them to the visual domain — where latent spaces, style transfer, and compositionality turn text prompts into images, scenes, and design systems.' },
          ]
        },
        {
          id: '2-3',
          title: '2.3 Visual Generation & Design Systems',
          content: [
            { type: 'paragraph', content: 'You have mastered text generation and prompt design. Now we enter the visual domain, where the same mathematical principles — embeddings, latent spaces, and diffusion — produce images, textures, and entire design systems from text descriptions.' },
            { type: 'heading', content: 'Core Concepts in Visual Generation' },
            {
              type: 'list', content: [
                "**Latent space:** A compressed mathematical representation where similar images live near each other. When you prompt 'a red car,' the model navigates to the region of latent space where red cars cluster.",
                "**Style transfer:** Applying the visual characteristics (color palette, brushstrokes, texture) of one image to the content of another. This works because style and content are encoded separately in the model's latent representations.",
                "**Compositionality:** Generating multiple objects that maintain correct spatial and logical relationships — a person holding a cup while standing on a bridge. This is one of the hardest challenges in image generation.",
                "**ControlNet & LoRA:** Techniques that let you fine-tune specific aspects of generation (pose, depth, edge structure) without retraining the entire model. LoRA (Low-Rank Adaptation) is particularly efficient — it modifies less than 1% of parameters to achieve targeted changes."
              ]
            },
            { type: 'paragraph', content: "These concepts are why prompt engineering works — your words navigate latent space to find the image you described. Understanding them lets you move from 'I hope this looks good' to 'I know exactly which parameters to adjust.'" },
            { type: 'heading', content: 'Visual Design Labs' },
            { type: 'interactive', content: '', component: 'CompositorCanvasPro', interactiveId: 'compositor-canvas-1' },
            { type: 'interactive', content: '', component: 'SceneDirectorXR', interactiveId: 'scene-director-1' },
            { type: 'interactive', content: '', component: 'PatternGenomeSynthesizer', interactiveId: 'pattern-synth-1' },
            { type: 'interactive', content: '', component: 'LightingPhysicsLab', interactiveId: 'lighting-lab-1' },
            { type: 'interactive', content: '', component: 'EthicalStyleInspector', interactiveId: 'style-inspector-1' },
            { type: 'heading', content: 'Insight Extraction' },
            { type: 'paragraph', content: "AI's analytical capability extends beyond generation. Use structured data tools to extract patterns from complex information, identify decision points, and build actionable frameworks. The flowchart builder below demonstrates how AI can map decision logic visually." },
            { type: 'interactive', content: '', component: 'DataDecisionFlowchartBuilder', interactiveId: 'int-flow-2' },
            { type: 'paragraph', content: 'Visual generation covers the spatial dimension. But AI\'s creative power extends to another fundamental domain: sound. The next section explores how the same generative principles apply to audio — from music composition to voice synthesis and spatial soundscapes.' },
          ]
        },
        {
          id: '2-4',
          title: '2.4 Sound, Music & Voice',
          content: [
            { type: 'paragraph', content: 'Images are spatial; sound is temporal. This section applies generative AI to the audio domain — where waveforms, frequencies, and rhythm become the raw materials for creation. From melody generation to voice cloning to ambient soundscapes, the same embedding principles power a completely different creative medium.' },
            { type: 'heading', content: 'Audio Fundamentals' },
            { type: 'paragraph', content: "Sound is data with rhythm. Waveforms ↔ vectors ↔ meaning." },
            { type: 'heading', content: 'Mini Apps' },
            { type: 'interactive', content: '', component: 'MelodyMakerAI', interactiveId: 'melody-maker-1' },
            { type: 'interactive', content: '', component: 'VoiceMorphStudio', interactiveId: 'voice-morph-1' },
            { type: 'interactive', content: '', component: 'AmbientArchitect', interactiveId: 'ambient-architect-1' },
            { type: 'interactive', content: '', component: 'SpeechEmotionAnalyzer', interactiveId: 'speech-analyzer-1' },
            { type: 'interactive', content: '', component: 'AudioVisualSyncLab', interactiveId: 'av-sync-lab-1' },
            { type: 'heading', content: 'Document Processing' },
            { type: 'paragraph', content: "AI can read and analyze documents faster than you. Test how AI handles context and summarization with the tool below." },
            { type: 'interactive', content: '', component: 'ContextWindowExplorer', interactiveId: 'int-doc-2' },
            { type: 'paragraph', content: 'Static images and standalone audio clips are powerful on their own. But the next frontier is combining them into motion — generating video sequences where consistency across frames, physics-aware movement, and cinematic timing all come together.' },
          ]
        },
        {
          id: '2-5',
          title: '2.5 Video & Motion Synthesis',
          content: [
            { type: 'paragraph', content: 'You have generated images and audio independently. Video combines both into a time-based medium where the model must maintain visual consistency, simulate physics, and synchronize motion across every frame. This is one of the hardest generative challenges — and the technology is advancing fast.' },
            { type: 'heading', content: 'Key Ideas' },
            {
              type: 'list', content: [
                "Motion generation = temporal diffusion.",
                "Consistency across frames requires latent coherence.",
                "New models (Gemini 2.5 Video Beta, Runway Gen-3, Pika 1.0) render text-to-video in seconds."
              ]
            },
            { type: 'heading', content: 'Mini Apps' },
            { type: 'interactive', content: '', component: 'StoryboardForgePlus', interactiveId: 'storyboard-forge-1' },
            { type: 'interactive', content: '', component: 'MotionPhysicsPlayground', interactiveId: 'motion-physics-1' },
            { type: 'interactive', content: '', component: 'CinematicPromptSequencer', interactiveId: 'prompt-sequencer-1' },
            { type: 'interactive', content: '', component: 'GestureAnimator', interactiveId: 'gesture-animator-1' },
            { type: 'interactive', content: '', component: 'VoiceDrivenEditingDesk', interactiveId: 'voice-editor-1' },
            { type: 'heading', content: 'Intermediate Image & Audio Concepts' },
            { type: 'paragraph', content: "Experiment with how lighting descriptions change the mood of a scene entirely." },
            { type: 'interactive', content: '', component: 'LightingPhysicsLab', interactiveId: 'int-light-2' },
            { type: 'paragraph', content: 'You can now generate in 2D (images), temporal (audio and video). The final creative frontier is spatial: full 3D environments that you can walk through, explore, and inhabit. The next section covers how AI is collapsing the barrier between describing a world and building one.' },
          ]
        },
        {
          id: '2-6',
          title: '2.6 3D Worlds & The Metaverse',
          content: [
            { type: 'paragraph', content: 'From flat images to temporal video, each modality added a new dimension. Now we add the final one: depth. This section explores how AI generates full 3D environments — meshes, textures, lighting, and spatial audio — from nothing more than a text description.' },
            { type: 'heading', content: 'Building the Immersive Web' },
            { type: 'paragraph', content: "We are transitioning from the 'Flat Web' (2D screens) to the 'Immersive Web' (3D experiences). AI is the engine making this possible at scale. Previously, creating a 3D asset required hours of manual labor by a skilled artist in Blender or Maya. Today, Generative AI can create 3D meshes, textures, and environments in seconds." },
            { type: 'heading', content: 'Key Technologies' },
            {
              type: 'list', content: [
                "**NeRFs (Neural Radiance Fields):** A method to reverse-engineer a 3D scene from a set of 2D photos. It uses a neural network to predict the light and density at any point in space, allowing for photorealistic rendering from any angle.",
                "**Gaussian Splatting:** A newer, faster alternative to NeRFs that represents 3D scenes as millions of 3D 'splats' (ellipsoids). This allows for real-time rendering of complex scenes on consumer hardware.",
                "**Text-to-3D:** Models like Shap-E and Point-E that can generate 3D point clouds or meshes directly from a text prompt, similar to how Stable Diffusion generates images."
              ]
            },
            { type: 'paragraph', content: "In the **Dreamspace Constructor** below, you become the architect. You don't need to know CAD or geometry. You simply describe the world you want to inhabit—its style, its lighting, its mood—and the AI calculates the physics of light and texture to bring it into existence." },
            { type: 'interactive', content: '', component: 'DreamspaceConstructor', interactiveId: 'dreamspace-1' },
            { type: 'heading', content: 'Spatial Audio: The Invisible Dimension' },
            { type: 'paragraph', content: "A true immersive world isn't silent. 'Spatial Audio' allows you to hear sound from specific directions (left, right, behind, above). This is crucial for presence. If a virtual bird flies over your head, you should hear it moving through space." },
            { type: 'interactive', content: '', component: 'SoundfieldComposer', interactiveId: 'soundfield-composer-1' },
            { type: 'paragraph', content: 'AI can now generate text, images, audio, video, and 3D worlds. This creative explosion raises an urgent question: when any media can be synthetically generated with near-perfect fidelity, how do we distinguish real from fake? The next section confronts the deepfake era and the trust crisis it creates.' },
          ]
        },
        {
          id: '2-7',
          title: '2.7 Ethics: Truth, Trust & The Deepfake Era',
          content: [
            { type: 'paragraph', content: 'Each modality you have explored — text, image, audio, video, 3D — can now be synthetically generated at near-human quality. That capability is extraordinary, and it is also dangerous. This section examines the trust crisis that generative AI has created and the tools being built to fight back.' },
            { type: 'heading', content: 'The Collapse of "Seeing is Believing"' },
            { type: 'paragraph', content: "For human history, a photograph or a voice recording was definitive proof of reality. Generative AI has broken this trust. We have entered an era where any media—video, audio, image—can be synthetically generated with near-perfect fidelity. This is the era of the **Deepfake**." },
            {
              type: 'list', content: [
                "**Identity Theft:** Voice cloning can simulate a CEO's voice to authorize fraudulent bank transfers.",
                "**Disinformation:** Synthetic videos can depict politicians saying things they never said, destabilizing democracies.",
                "**The Dead Internet Theory:** The hypothesis that the majority of internet content (posts, comments, reviews) is generated by bots talking to other bots."
              ]
            },
            { type: 'heading', content: 'Countermeasures: Watermarking & provenance' },
            { type: 'paragraph', content: "How do we fight back? Technology companies are developing standards like **C2PA** (Coalition for Content Provenance and Authenticity) to cryptographically sign media, proving its origin. Tools like Google's **SynthID** embed invisible watermarks into AI-generated content." },
            { type: 'heading', content: 'Simulation: The War Room' },
            { type: 'paragraph', content: "The best way to understand these risks is to debate them. In **The War Room**, you will face an AI opponent trained on millions of legal and ethical arguments. Your topic: **AI Regulation**. Should we pause development? Should we require licenses? Test your critical thinking against a machine." },
            { type: 'interactive', content: '', component: 'InteractiveDebates', interactiveId: 'interactive-debates-1' },
            { type: 'paragraph', content: 'Ethics and trust define the boundaries. But within those boundaries, AI is evolving beyond passive generation into active, autonomous work. The next section explores the cutting edge: agentic architectures where AI systems plan, execute, and collaborate without human supervision at every step.' },
          ]
        },
        {
          id: '2-8',
          title: '2.8 Agentic Architectures: From Chatbots to Workers',
          content: [
            { type: 'paragraph', content: 'You have seen what AI can create and the ethical questions that creation raises. Now we look at the next evolutionary step: AI systems that do not just respond to prompts but actively pursue goals, use tools, and coordinate with other agents to accomplish complex tasks autonomously.' },
            { type: 'heading', content: 'Beyond the Chatbot' },
            { type: 'paragraph', content: "Most people know AI as a chatbot: You ask a question, it gives an answer. This is 'Zero-Shot' interaction. The future, however, belongs to **Agents**. An Agent is an AI system that can use **Tools** (web search, calculators, code interpreters) and execute multi-step **Plans** to achieve a goal." },
            { type: 'heading', content: 'The ReAct Paradigm' },
            { type: 'paragraph', content: "Modern agents use a loop called **ReAct** (Reason + Act). They look at a problem, *Reason* about what to do next ('I need to search for the weather'), *Act* (perform the search), and then *Observe* the result. They repeat this loop until the task is done." },
            { type: 'heading', content: 'Orchestrating a Team' },
            { type: 'paragraph', content: "We are moving from single agents to **Multi-Agent Systems**. Imagine a virtual software company: A 'Product Manager' agent defines a feature, a 'Coder' agent writes it, and a 'QA' agent tests it. They talk to each other, critique each other's work, and iterate without human intervention." },
            { type: 'paragraph', content: "In the **Workflow Engine** below, you are the conductor. You will visualize a 'LangGraph'—a directed graph that defines how data flows between these specialized agents. This is the blueprint for modern enterprise automation." },
            { type: 'interactive', content: '', component: 'LangGraphVisualizer', interactiveId: 'int-graph-2' },
            { type: 'paragraph', content: 'Agents can do the work. But who captures the value? The next section shifts from technology to economics — examining the business models, market layers, and competitive moats that determine who wins in the AI era.' },
          ]
        },
        {
          id: '2-9',
          title: '2.9 The Business of AI: Building the Future',
          content: [
            { type: 'paragraph', content: 'Agents represent the technological frontier. But technology without a business model is a hobby. This section examines who is making money in AI, where the durable advantages lie, and how to translate your new technical skills into economic value.' },
            { type: 'heading', content: 'The Economic Landscape' },
            { type: 'paragraph', content: "We are in a gold rush. But who is making the money? The market is dividing into three layers:" },
            {
              type: 'list', content: [
                "**Infrastructure (The Shovels):** Companies like NVIDIA, AWS, and Azure providing the chips and cloud compute.",
                "**Foundation Models (The Gold):** OpenAI, Google, Anthropic building the massive brains (GPT-5, Gemini).",
                "**Applications (The Jewelry):** Startups building specific tools *on top* of these models (e.g., AI for lawyers, AI for video editing)."
              ]
            },
            { type: 'heading', content: 'The "Wrapper" Debate' },
            { type: 'paragraph', content: "A 'wrapper' is software that adds a user interface, specific workflows, or domain expertise on top of someone else's AI model. Investors debate wrappers because they wonder: if anyone can build on GPT-4, what stops a competitor from copying you overnight?" },
            { type: 'paragraph', content: "The question isn't whether you're a wrapper — it's whether you create value that's hard to replicate. In AI, traditional moats (feature advantages, switching costs) erode quickly. The durable moats are **Proprietary Data** (training data no competitor can access), **Deep Workflow Integration** (being embedded so deeply in a user's daily process that switching is painful), and **Compounding Network Effects** (each user making the product better for all users)." },
            { type: 'heading', content: 'Your Turn: The Startup Generator' },
            { type: 'paragraph', content: "You have the skills. Now, find the value. Use the **Startup Pitch Generator**. Input a raw problem you see in the world (e.g., 'Walking dogs is lonely'). The AI will use frameworks like 'Jobs to be Done' and 'Blue Ocean Strategy' to generate a compelling Elevator Pitch. This is how you translate technical skill into economic value." },
            { type: 'interactive', content: '', component: 'PitchBuilder', interactiveId: 'int-pitch-2' },
            { type: 'paragraph', content: 'You now understand the technology, the ethics, the agents, and the economics. One final question remains: where does this all end up? The last section looks at the horizon — AGI, superintelligence, and the fundamental restructuring of human work.' },
          ]
        },
        {
          id: '2-10',
          title: '2.10 The Horizon: AGI, ASI, and What Comes Next',
          content: [
            { type: 'paragraph', content: 'You have covered the full arc: from how AI generates content, to the ethical boundaries around creation, to autonomous agents, to the business landscape. This final section asks the biggest question of all: what happens when AI systems become as capable as — or more capable than — the humans who built them?' },
            { type: 'heading', content: 'The Path to AGI' },
            { type: 'paragraph', content: "We are standing on the shore of a vast ocean. Today's AI is 'Narrow' or 'Specialized'. The Holy Grail is **AGI (Artificial General Intelligence)**—a system that can perform *any* intellectual task that a human being can. Predictions for when we reach AGI range from 2027 to 2050." },
            { type: 'heading', content: 'Superintelligence (ASI)' },
            { type: 'paragraph', content: "Once we achieve AGI, the timeline accelerates. An AGI can research AI better than humans can. This recursive self-improvement could lead to **ASI (Artificial Superintelligence)**—an intellect that is much smarter than the best human brains in practically every field, including scientific creativity, general wisdom, and social skills." },
            { type: 'heading', content: 'The Post-Labor Economy' },
            { type: 'paragraph', content: "If machines can do all cognitive and physical labor cheaper than humans, what happens to the economy? Concepts like **Universal Basic Compute** (giving every citizen a share of AI processing power) or **Universal Basic Income** are moving from fringe theory to serious policy debate." },
            { type: 'paragraph', content: "Where do we go from here? Cast your vote in the **Future Scenario Poll**. See how your vision of the future aligns with the global community of AI pioneers." },
            { type: 'interactive', content: '', component: 'FutureScenarioPoll', interactiveId: 'future-poll-2' },
            { type: 'heading', content: 'Module Complete' },
            { type: 'paragraph', content: "You can now reason about how generative systems work, identify which AI approach fits a given problem, and design basic agent architectures. You understand the mechanisms behind text generation, image synthesis, audio processing, and 3D creation — and the ethical implications of each. The next module builds on these foundations with hands-on system design." },
          ]
        }
      ]
    }
  ],
};
