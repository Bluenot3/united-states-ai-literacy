
import type { Curriculum } from '../types';

export const curriculumData: Curriculum = {
  title: 'Module 2: Agents & Automation Frameworks',
  summaryForAI:
    'Module 2 of ZEN AI VANGUARD focuses on transforming creators into AI systems architects. It covers designing, deploying, and governing intelligent, autonomous agents. The curriculum is split into two parts: "Agentic Foundations & Reasoning Systems" and "Advanced Automation & Governance Frameworks". It includes hands-on labs and simulations for concepts like multi-step reasoning, memory architectures, tool usage, collaborative agents, security, workflow orchestration, RAG, multi-modal agents, and governance.',
  sections: [
    {
      id: 'overview',
      title: 'Module Overview',
      content: [
        {
          type: 'interactive',
          content: '',
          component: 'HeroIntroMod2',
          interactiveId: 'hero-intro-mod2'
        },
        {
          type: 'paragraph',
          content:
            'Module 2 moves from understanding AI to building with it. You will learn to design, deploy, and govern autonomous agents that reason, act, and adapt. By the end, you will be able to architect multi-agent systems, connect models to tools and APIs, build memory and orchestration patterns, and apply governance frameworks to real deployments.',
        },
        {
          type: 'quote',
          content: 'Everything here is self-paced, immersive, and tile-based: each section and lab appears as its own tile inside the AI.dev dashboard.'
        }
      ],
    },
    {
      id: 'part-1',
      title: 'PART 1: Agentic Foundations & Reasoning Systems',
      content: [
        {
          type: 'paragraph',
          content: 'This first part lays the groundwork for understanding what an intelligent agent is, how it thinks, remembers, and acts in the world. We will explore the core components that enable autonomy and sophisticated reasoning.'
        }
      ],
      subSections: [
        {
          id: '1-1',
          title: '1.1 What Is an Agent? (Architecture & Core Components)',
          content: [
            {
              type: 'paragraph',
              content: 'An Agent is not “a chatbot with extra steps.” An Agent is a self-directed computational entity capable of perceiving its environment, reasoning about it, deciding what to do next, taking actions, evaluating the consequences, updating its internal state, and pursuing goals across time.'
            },
            {
              type: 'quote',
              content: 'Where Module 1 taught how to use AI… Module 2 teaches how to build entities that use the world.'
            },
            {
              type: 'paragraph',
              content: 'Agents represent a fundamental shift in how software operates. Traditional software waits for instructions; agents pursue objectives. They will reshape knowledge work, scientific research, business operations, and infrastructure management.'
            },
            {
              type: 'heading',
              content: 'The Modern Formula for an Agent'
            },
            {
              type: 'mermaid',
              content: `graph TD
    UserGoal("User Goal") --> CognitiveCore
    subgraph Agent_Architecture ["Agent Architecture: The Cognitive Stack"]
        CognitiveCore("Cognitive Engine / LLM")
        STM("Short-Term Memory / Context")
        LTM("Long-Term Memory / Vector DB")
        Tools("Tools & Actions")
        Loop("Autonomy Loop")
    end
    CognitiveCore <--> STM
    CognitiveCore <--> LTM
    CognitiveCore --> Loop
    Loop --> Tools
    Tools --> Environment("External World / APIs / Internet")
    Environment --> Loop
    style Agent_Architecture fill:#f9fafb,stroke:#8b5cf6,stroke-width:2px`
            },
            {
              type: 'list',
              content: [
                'A Cognitive Engine: The LLM that produces reasoning, planning, critique, adaptation, and interpretation. It runs “reasoning loops” that continually revise the plan based on new context.',
                'Short-Term Memory (STM): The working context window, where the agent holds the immediate problem state.',
                'Long-Term Memory (LTM): Persistent storage for user preferences, past decisions, evidence, intermediate results, and knowledge the agent builds over time.',
                'Tools + Actions: An agent is only as powerful as the actions it can take. Tools may include Web search, APIs, Databases, File generation, Function calling, and External services.',
                'Goal Structures: Direct, Conditional, Recursive, or Hierarchical goals.',
                'Autonomy Loop: The agent repeatedly Observes → Reasons → Plans → Acts → Evaluates → Updates → Repeats. This loop is what gives agents “agency.”'
              ]
            },
            {
              type: 'heading',
              content: '🌍 Why Agents Matter for the Next 1,000 Years'
            },
            {
              type: 'paragraph',
              content: 'Agents represent a shift in computation comparable to the printing press, industrial mechanization, or the internet. They are becoming workers, researchers, scientists, policy engines, and digital diplomats.'
            },
            {
              type: 'paragraph',
              content: 'They will power autonomous business processes, self-repairing software systems, planetary-scale monitoring networks, AI-driven scientific discovery, and real-time climate prediction. Agents are not simply tools — they are the operational infrastructure of next-generation organizations.'
            },
            {
              type: 'heading',
              content: '🧠 How Agents Think: Gemini 2.5 Pro Narrated Walkthrough'
            },
            {
              type: 'quote',
              content: '“I begin by interpreting your goal. I break it into subgoals. I check my memory for relevant facts. I choose which tools to call. I execute tools, analyze results, and revise my plan. If results fail quality thresholds, I try alternate paths. I log my decisions so future loops improve.”'
            },
            {
              type: 'heading',
              content: '🩻 App: Agent Anatomy Visualizer (Nano-Banana Engine)'
            },
            {
              type: 'paragraph',
              content: 'The interactive below visualizes agent cognition in real-time. It decomposes a live agent run into four layers: the Cognitive Core (reasoning and planning), Memory Layer (short-term and long-term storage), Tool Interface (API calls and external actions), and Autonomy Loop Metrics (decision quality over time).'
            },
            {
              type: 'heading',
              content: '🛠 Interactive Task: Build a Multi-Agent Team'
            },
            {
              type: 'paragraph',
              content: 'Task: Create a report on the impact of AI on climate change. You must assemble a 4-agent team and assign roles: Researcher, Summarizer, Critic, and Planner.'
            },
            {
              type: 'interactive',
              content: '',
              component: 'AgentSystemDesigner',
              interactiveId: 'agent-anatomy-1'
            },
            {
              type: 'heading',
              content: '🧬 The Big Ideas'
            },
            {
              type: 'list',
              content: [
                'Agents are autonomous computational entities, not enhanced chatbots.',
                'They operate across time, adapting behavior based on accumulated experience.',
                'Memory provides context, continuity, and the foundation for learning.',
                'Tools transform reasoning into real-world actions.',
                'Goal structures convert open-ended computation into purposeful behavior.',
                'Reasoning loops enable self-correction and iterative improvement.',
                'Multi-agent teams achieve outcomes beyond any single agent.'
              ]
            }
          ],
        },
        {
          id: '1-2',
          title: '1.2 Planning and Chain of Thought (Real Multi-Step Intelligence)',
          content: [
            {
              type: 'paragraph',
              content: 'In Module 1, learners saw how LLMs produce explanations and step-by-step reasoning. In Module 2, we go deeper: planning is no longer something you do and the model follows. Now, the agent becomes the planner, continuously restructuring its own strategy as it interacts with tools, data, and changing environments.'
            },
            {
              type: 'heading',
              content: 'What Planning Really Is in Agentic Systems'
            },
            {
              type: 'paragraph',
              content: 'A plan is not a list of steps. A plan in an agent is a dynamic cognitive graph—a living structure that updates as the agent interprets goals, breaks them into sub-goals, chooses reasoning strategies, calls tools, analyzes results, rewrites the plan, and closes loops or opens new ones.'
            },
            {
              type: 'mermaid',
              content: `graph LR
    Goal("Goal: Write Report") --> Plan("Initial Plan")
    Plan --> Step1("Gather Data")
    Step1 --> Check{"Enough Info?"}
    Check -- No --> ToolSearch("Tool: Search")
    ToolSearch --> Evaluate("Evaluate Results")
    Evaluate --> Check
    Check -- Yes --> Step2("Synthesize")
    Step2 --> Critique("Self-Critique")
    Critique --> Refine("Refine Draft")
    Refine --> Final("Final Output")
    style Goal fill:#f3e8ff,stroke:#8b5cf6,stroke-width:2px
    style Check fill:#fef3c7,stroke:#f59e0b
    style ToolSearch fill:#d1fae5,stroke:#10b981
    style Evaluate fill:#fee2e2,stroke:#ef4444`
            },
            {
              type: 'paragraph',
              content: 'This transforms a linear task like “Write a report on renewable energy” into a structured intelligence workflow: Gather data → cross-compare → validate → synthesize → critique → assemble → optimize. Agents do this repeatedly, adjusting their own path—something no traditional software system could do.'
            },
            {
              type: 'heading',
              content: '🧠 Chain of Thought (CoT) as the Agent’s Inner Dialogue'
            },
            {
              type: 'paragraph',
              content: 'Chain of Thought is the “internal reasoning voice” the agent uses to navigate uncertainty. CoT is where agents detect contradictions, highlight missing information, generate alternative paths, reason about consequences, and evaluate whether progress is real or imagined.'
            },
            {
              type: 'paragraph',
              content: 'In world-class agentic systems, CoT can branch into parallel reasoning threads. These threads can vote or synthesize. Agents can maintain multiple competing hypotheses, pruning weak ones and promoting strong ones. This is how modern agents outperform static scripts—and sometimes outthink humans.'
            },
            {
              type: 'heading',
              content: '📊 Plan-Graph Reasoning'
            },
            {
              type: 'paragraph',
              content: 'Traditional planning is sequential. But real-world problems are graph-structured. A Plan-Graph represents reasoning steps as nodes, links causal relationships, highlights decision forks, visualizes dependencies, supports backtracking, and enables tool choice logic.'
            },
            {
              type: 'paragraph',
              content: 'Plan-graph thinking is the foundation of enterprise-grade AI automation, allowing professionals to design multi-stage analysis workflows and decision simulations.'
            },
            {
              type: 'heading',
              content: '⚡ Mini App: Plan-Graph Simulator (Gemini-Powered Visualization)'
            },
            {
              type: 'paragraph',
              content: 'This upgraded simulator lets you see how agent reasoning forms, evolves, and responds to changes. Rearrange the reasoning nodes to build a robust plan. The app instantly shows how tool choice shifts and which paths become more efficient.'
            },
            {
              type: 'interactive',
              content: '',
              component: 'LangGraphVisualizer',
              interactiveId: 'plan-graph-simulator-1'
            },
            {
              type: 'heading',
              content: 'What This Builds in the Learner'
            },
            {
              type: 'list',
              content: [
                'Planning is not linear; it is structural.',
                'Better plans create more robust agents.',
                'The order of reasoning deeply affects performance.',
                'Tool choice should follow strategy, not intuition.',
                'Evaluation loops make agents resilient to uncertainty.'
              ]
            }
          ]
        },
        {
          id: '1-3',
          title: '1.3 Memory Architectures (How Agents Build, Store, and Evolve Knowledge)',
          content: [
            { type: 'paragraph', content: 'Humans cannot operate without memory. Agents are no different — but their memory structures are explicit, engineered, and tunable, making them one of the most important levers for increasing intelligence.' },
            { type: 'quote', content: 'If the “LLM” is the mind of the agent, then memory is the nervous system that lets it act coherently across time.' },
            { type: 'paragraph', content: 'Module 1 introduced context windows. Module 2 formalizes the three dominant memory classes used in modern agentic systems:' },
            { type: 'heading', content: '🧠 1. Short-Term Memory (STM) — The Working Brain' },
            { type: 'paragraph', content: 'Short-term memory is where agents hold immediate, task-relevant information: the last user message, the intermediate reasoning chain, active tool responses, and in-flight context needed for the next step.' },
            {
              type: 'list', content: [
                'STM is volatile and disappears when the task ends or when the context window overflows.',
                'STM determines what the agent can think about right now.',
                'An agent with weak STM feels forgetful or inconsistent. An agent with well-managed STM feels focused and intelligent.'
              ]
            },
            { type: 'heading', content: '📚 2. Long-Term Memory (LTM) — The Knowledge Warehouse' },
            { type: 'paragraph', content: 'Where STM is fleeting, long-term memory is durable. This is where agents store persistent knowledge: user preferences, recurring tasks, personal style patterns, work instructions, file references, domain knowledge, and embeddings of documents.' },
            { type: 'paragraph', content: 'LTM transforms agents from “tools” into specialists that evolve with the user over months or years. The most advanced agents use Vector databases (like Supabase pgvector or Pinecone) to store embeddings and Retrieval controllers to pull relevant memories into STM.' },
            { type: 'heading', content: '🌀 3. Episodic Memory — The Story of the Agent’s Life' },
            { type: 'paragraph', content: 'Episodic memory tracks interactions across time: "What happened earlier?", "What failed last week?", "What tools worked best?". It allows the agent to learn patterns about the user, the environment, and its own performance.' },
            { type: 'heading', content: '🔮 How These Memory Systems Work Together' },
            {
              type: 'mermaid', content: `graph TD
    User("User Input") --> STM
    subgraph Cognition_Engine [The Cognitive Loop]
        STM("STM: Working Context") <--> CognitiveCore("LLM: Reasoning")
        CognitiveCore --> Retrieval("Retrieval Controller")
        Retrieval --> LTM("LTM: Vector DB")
        Retrieval --> Episodic("Episodic Logs")
        LTM -- "Relevant Facts" --> STM
        Episodic -- "Past Patterns" --> STM
    end
    CognitiveCore --> Action("Tool / Action")
    Action --> STM
    style Cognition_Engine fill:#f9fafb,stroke:#8b5cf6,stroke-width:2px`
            },
            { type: 'heading', content: '🧪 Lab: Memory Vault XR (Expanded)' },
            { type: 'paragraph', content: 'In this interactive lab, you will see how AI literally remembers "meaning", not just text. Type facts or preferences, and watch Gemini map them into a semantic vector space. Queries retrieve memories based on geometric distance, revealing the shape of knowledge.' },
            { type: 'interactive', content: '', component: 'MemoryVaultXR', interactiveId: 'memory-vault-xr-1' },
            { type: 'heading', content: '💭 Lab: Memory Decay Lab' },
            { type: 'paragraph', content: 'Memory decay is a feature, not a bug. This lab simulates how agents forget as context windows overflow, visualizing which details remain in STM, which are archived to LTM, and which are lost.' },
            { type: 'interactive', content: '', component: 'MemoryDecayLab', interactiveId: 'memory-decay-lab-1' },
            { type: 'heading', content: '🎓 Outcome' },
            { type: 'paragraph', content: 'Memory is the foundation of agent intelligence, the source of personality, and the key to long-term usefulness. It determines how an agent becomes your second brain.' }
          ],
        },
        {
          id: '1-4',
          title: '1.4 Tool Usage & API Control (How Agents Take Real Action)',
          content: [
            { type: 'paragraph', content: 'Reasoning gives an agent a mind. Tools give an agent hands. Without tools, an agent is a brilliant but paralyzed thinker. With tools, it becomes a world-operating intelligence capable of transforming data, manipulating systems, and executing tasks.' },
            { type: 'quote', content: 'Tool usage is the defining leap from: 🧠 “AI that talks” → 🤖 “AI that acts.”' },
            { type: 'heading', content: '🔌 What Is a Tool? (Precise, Modern Definition)' },
            { type: 'paragraph', content: 'A Tool is an external function that the agent can call to cause a real change in the environment.' },
            {
              type: 'list', content: [
                'Computational Tools: Calculators, statistical engines, format converters.',
                'Data Access Tools: SQL queries, CRM lookups, Knowledge base retrieval.',
                'Service/API Tools: Web search, Email sending, Calendar scheduling.',
                'Physical World Tools (IoT): Smart sensors, Cameras, Drones, HVAC controls.',
                'Blockchain Tools: Transaction builders, Token minting, Smart contract execution.'
              ]
            },
            { type: 'heading', content: '🕹 Tool Execution Loop: The Agent’s “Hands”' },
            {
              type: 'mermaid', content: `graph LR
    Plan --> Select[Select Tool]
    Select --> Prep[Prepare Input JSON]
    Prep --> Exec[Execute API Call]
    Exec --> Eval{Evaluate Result}
    Eval -- Success --> Mem[Store in Memory]
    Eval -- Fail --> Retry[Retry / Escalate]
    Mem --> Iterate[Next Step]`
            },
            { type: 'paragraph', content: 'This loop allows the agent to test multiple tools, retry on failure, switch strategies, and chain actions together—continuously, 24/7.' },
            { type: 'heading', content: '🧪 Interactive Console: The Agent Command Center' },
            { type: 'paragraph', content: 'This console is your first exposure to live tool control. Issue natural language commands, and watch the agent parse your intent, select the correct tool (IoT, Search, Blockchain, or Math), execute it, and log the structured JSON data.' },
            { type: 'interactive', content: '', component: 'ToolCallDashboard', interactiveId: 'tool-call-dashboard-1' },
            { type: 'heading', content: '🪙 Mint 1 ZLT Token (Blockchain Demo)' },
            { type: 'paragraph', content: 'Within the console above, try commands like "Mint 50 ZLT tokens". This demonstrates how agents interact with Web3 infrastructure by constructing transaction payloads and creating verifiable, immutable records on-chain.' },
            { type: 'heading', content: '🎓 Outcome' },
            { type: 'paragraph', content: 'By mastering tool usage, you understand how agents evolve from chatbots into autonomous systems that can participate in business, society, and the physical world.' }
          ],
        },
        {
          id: '1-5',
          title: '1.5 Autonomy & Goal Setting (How Agents Turn Intent Into Action)',
          content: [
            { type: 'paragraph', content: 'Autonomy is the defining trait that separates an LLM from an Agent. An LLM answers questions; an Agent interprets goals, creates tasks, evaluates priorities, and continues working until the job is done.' },
            { type: 'quote', content: 'Autonomy = sustained, self-directed behavior driven by goals instead of instructions.' },
            { type: 'paragraph', content: 'A goal is a state the agent seeks to bring into reality, defined by desired outcomes, constraints, context, and success conditions. This section introduces the world of intent interpreters and self-tasking loops.' },
            { type: 'heading', content: '🧠 Prompt → Plan Engine' },
            {
              type: 'mermaid', content: `graph LR
    Input("User Prompt") --> Intent("Intent Classifier")
    Intent --> Constraints("Constraint Extractor")
    Constraints --> Generator("Task Generator")
    Generator --> Optimizer("Dependency Optimizer")
    Optimizer --> Plan("Final Execution Plan")`
            },
            { type: 'paragraph', content: 'Modern agents follow a conversion loop: Interpret Intent → Extract Constraints → Generate Subtasks → Prioritize → Assign Tools → Execute. This is internal project management.' },
            { type: 'heading', content: '🔁 The Autonomy Loop' },
            {
              type: 'mermaid', content: `graph TD
    Goal("Goal defined") --> Decompose("Decompose into Subtasks")
    Decompose --> Prioritize("Prioritize & Schedule")
    Prioritize --> Act("Execute Next Action")
    Act --> Observe("Observe Outcome")
    Observe --> Evaluate{"Goal Met?"}
    Evaluate -- No --> Adjust("Adjust Plan")
    Adjust --> Prioritize
    Evaluate -- Yes --> Complete("Success State")
    style Goal fill:#f3e8ff,stroke:#8b5cf6,stroke-width:2px
    style Act fill:#d1fae5,stroke:#10b981
    style Adjust fill:#fee2e2,stroke:#ef4444`
            },
            { type: 'paragraph', content: 'The critical insight: As long as the goal is unmet, the agent continues. This allows systems to run overnight, handle errors, and execute multi-step workflows without human babysitting.' },
            { type: 'heading', content: '🛠 Experience: Goal Forge Workbench' },
            { type: 'paragraph', content: 'The Goal Forge Workbench turns abstract autonomy into a visible system. Set a goal (e.g., "Build my daily schedule"), and watch the agent interpret intent, generate prioritized subtasks with reasoning, and simulate execution. You will see how the agent balances cognitive load, dependencies, and constraints in real-time.' },
            { type: 'interactive', content: '', component: 'SchedulePlanner', interactiveId: 'goal-forge-1' },
            { type: 'heading', content: '🔍 Why This Matters' },
            { type: 'paragraph', content: 'Autonomy is the river from which all future agentic systems flow—from autonomous HR departments to climate modeling engines. Understanding how goals turn into plans is foundational for designing safe, reliable, and scalable AI architectures.' }
          ],
        },
        {
          id: '1-6',
          title: '1.6 Collaborative Agents (How Digital Teams Work Together)',
          content: [
            { type: 'paragraph', content: 'If Section 1.5 introduced autonomy for a single agent, Section 1.6 expands the learner’s worldview: True intelligence emerges when multiple agents collaborate, challenge each other, specialize, and coordinate.' },
            { type: 'quote', content: 'Multi-agent systems are not just “more agents.” They are networked collectives capable of producing work that surpasses any single AI—or human—working alone.' },
            { type: 'paragraph', content: 'This section trains the learner to think in teams, not tools. A collaborative agent is an autonomous AI that cooperates with other agents, each holding unique skills, private memory, reasoning styles, and roles.' },
            { type: 'heading', content: '🕸 How Collaborative Agents Coordinate (The Five-Agent Workflow)' },
            { type: 'paragraph', content: 'Most modern multi-agent systems use a variation of the Planner-Researcher-Writer-Critic-Integrator pattern. These agents communicate in cycles, creating cross-verification and redundancy.' },
            {
              type: 'mermaid', content: `graph TD
    User((User Input)) --> Planner
    subgraph Digital_Organization [The Agent Team]
        Planner{Planner}
        Researcher[Researcher]
        Writer[Writer]
        Critic[Critic]
        Integrator((Integrator))
        
        SharedMem[(Shared Memory / Workspace)]
        
        Planner -- "Assigns Tasks" --> Researcher
        Planner -- "Assigns Tasks" --> Writer
        
        Researcher -- "Evidence" --> SharedMem
        Writer -- "Drafts" --> SharedMem
        
        SharedMem -- "Read Context" --> Critic
        Critic -- "Feedback" --> Writer
        Critic -- "Feedback" --> Researcher
        
        Writer -- "Final Draft" --> Integrator
    end
    Integrator --> FinalOutput[Final Deliverable]
    
    style Planner fill:#e0e7ff,stroke:#4338ca
    style Researcher fill:#dcfce7,stroke:#15803d
    style Writer fill:#f3e8ff,stroke:#7e22ce
    style Critic fill:#fee2e2,stroke:#b91c1c
    style Integrator fill:#fef3c7,stroke:#b45309`
            },
            {
              type: 'list', content: [
                'Planner: Interprets goals and decomposes tasks.',
                'Researcher: Finds information and gathers evidence.',
                'Writer: Generates structured content and visuals.',
                'Critic: Performs fact-checking and quality scoring.',
                'Integrator: Merges outputs and resolves conflicts.'
              ]
            },
            { type: 'heading', content: '🔗 Emergent Properties of Agent Teams' },
            { type: 'paragraph', content: 'When AI agents collaborate, they produce emergent behaviors like innovation by synthesis, error reduction (by cross-checking), and consensus building. These behaviors mirror human organizational intelligence.' },
            { type: 'heading', content: '🧪 Simulation: Team Matrix' },
            { type: 'paragraph', content: 'The Team Matrix is your interactive laboratory for witnessing digital teamwork. Set a complex goal, and watch a 5-agent team activate. You will see roles light up, messages exchange, "Shared Memory" update, and a consensus emerge in real-time. This is not a static demo—it is a live simulation of an autonomous workplace.' },
            { type: 'interactive', content: '', component: 'MultiAgentChatSandbox', interactiveId: 'team-matrix-1' },
            { type: 'heading', content: '🎓 Outcome' },
            { type: 'paragraph', content: 'By the end of this section, you will understand that the future is not “an AI model,” but an intelligent society of models working together. This architecture underpins future enterprises, labs, and city-scale AI systems.' }
          ],
        },
        {
          id: '1-7',
          title: '1.7 Evaluation & Feedback Loops (How Agents Learn What “Good” Means)',
          content: [
            { type: 'paragraph', content: 'Even the smartest agent does not automatically know what a “good” answer is. It doesn’t know your organization’s tone, accuracy thresholds, or ethics. It must learn these things through feedback loops—repeated cycles where the AI receives a signal that says: "This output is better than that one."' },
            { type: 'quote', content: 'You don’t teach the AI what to say… You teach it what humans reward.' },
            { type: 'heading', content: '🌱 What Is a Feedback Loop?' },
            { type: 'paragraph', content: 'A feedback loop is a cycle where the agent produces something, a human rates it, the feedback is stored, and the agent adjusts its future behavior. This is the foundation of modern AI alignment.' },
            { type: 'heading', content: '🏆 RLHF — Reward Learning From Human Feedback' },
            {
              type: 'mermaid', content: `graph TD
    Prompt("Prompt: 'Explain Quantum Computing'") --> AI
    AI("AI Model") --> A("Draft A")
    AI --> B("Draft B")
    A --> Human("Human Rater")
    B --> Human
    Human -- "Prefers B" --> Reward("Reward Signal")
    Reward --> Update("Update Model Weights")
    Update --> AI
    style Reward fill:#dcfce7,stroke:#15803d
    style Human fill:#e0e7ff,stroke:#4338ca`
            },
            { type: 'paragraph', content: 'RLHF is the method used to train modern AIs. Humans compare answers (e.g., "B is clearer than A"), creating a reward signal. The model updates its internal priorities to favor traits like clarity and simplicity.' },
            { type: 'heading', content: '🔁 Self-Evaluation Loops' },
            { type: 'paragraph', content: 'A breakthrough in modern agent design is self-evaluation, where agents check their own work, score reasoning, and revise drafts before outputting. This reduces the need for human correction.' },
            { type: 'heading', content: '🎮 Human-Feedback Trainer Game' },
            { type: 'paragraph', content: 'This simulator lets you act as the Human Rater. You will be given a mission (e.g., "Train the AI to be Professional"). In each round, choose the better response. Your choices generate a live "Reward Signal" on the graph, visually demonstrating how feedback steers the model\'s behavior.' },
            { type: 'interactive', content: '', component: 'RlhfTrainerGame', interactiveId: 'feedback-trainer-1' },
            { type: 'heading', content: '📈 Reward Curves' },
            { type: 'paragraph', content: 'The graph above visualizes the "Reward Curve". An upward curve means the agent is improving and aligning with your goals. A flat or chaotic curve indicates unstable reasoning. This visualization makes invisible cognitive processes understandable.' },
            { type: 'heading', content: '🎓 Outcome' },
            { type: 'paragraph', content: 'Learners leave this section understanding that they don’t need to code to train AI. Their feedback shapes future behavior. Evaluation is the backbone of trusted AI.' }
          ],
        },
        {
          id: '1-8',
          title: '1.8 Security & Containment (How We Keep Autonomous Agents Safe, Controlled, and Predictable)',
          content: [
            {
              type: 'paragraph',
              content: 'As agents become more capable — reasoning, planning, taking actions, calling tools, and collaborating — the most important responsibility becomes controlling what they are allowed to do. Powerful systems require powerful guardrails.'
            },
            {
              type: 'heading',
              content: 'Security & Containment Ensures:'
            },
            {
              type: 'list',
              content: [
                'Agents cannot exceed their permissions.',
                'Agents cannot damage systems or data.',
                'Agents cannot act outside your intended boundaries.',
                'Adversarial inputs cannot trick the model.',
                'Harmful actions are blocked before execution.'
              ]
            },
            {
              type: 'quote',
              content: 'An autonomous agent is like an employee with perfect memory, instant speed, and access to many tools. So we must give it policies, limits, sandboxes, and firewalls.'
            },
            {
              type: 'heading',
              content: '🔒 What Is Containment? (Plain Language Definition)'
            },
            {
              type: 'paragraph',
              content: 'Containment is the practice of running agents inside safe boundaries so they cannot access restricted files, send unauthorized messages, or use dangerous tools. Think of it like a secure workspace where an agent can operate freely — but only inside the walls you define.'
            },
            {
              type: 'heading',
              content: '🧪 What Is Sandboxing?'
            },
            {
              type: 'paragraph',
              content: 'A sandbox is a secure digital environment where the agent is shielded from the real system. It can only use approved tools, cannot see sensitive data, and cannot make system-wide changes. Sandboxing is how companies safely test and deploy autonomous scheduling agents, HR assistants, and financial report generators.'
            },
            {
              type: 'heading',
              content: '🧨 What Are Adversarial Attacks?'
            },
            {
              type: 'paragraph',
              content: 'An adversarial attack is when someone tries to trick the AI into behaving incorrectly. These tricks can be tiny — even changes the human eye can’t see. For example, adding small noise to an image can cause the model to misclassify a panda as a gibbon.'
            },
            {
              type: 'interactive',
              component: 'AdversarialAttackSimulator',
              interactiveId: 'red-team-lab-1',
              content: ''
            },
            {
              type: 'heading',
              content: '🛡 Defense Strategies'
            },
            {
              type: 'mermaid',
              content: `graph TD
    Input(User Input) --> Firewall{Input Firewall}
    Firewall -- Malicious --> Block[Block & Log]
    Firewall -- Safe --> Agent[Agent Model]
    Agent --> Plan[Generate Plan]
    Plan --> Policy{Containment Policy}
    Policy -- Violation --> Block
    Policy -- Approved --> Action[Execute Tool]
    Action --> Output[Output Filter]
    Output --> User`
            },
            {
              type: 'list',
              content: [
                'Input Firewalls: Check every message or file for malicious intent.',
                'Output Filters: Block harmful or unsafe content before it leaves the agent.',
                'Permission Systems: Limit which tools and actions the agent can use.',
                'Audit Logs: Record every tool call and action for accountability.'
              ]
            },
            {
              type: 'heading',
              content: '🎓 Outcome'
            },
            {
              type: 'paragraph',
              content: 'By the end of this section, you know why agents need boundaries, what sandboxing is, and how adversarial attacks work. This prepares you for advanced topics where agents act across systems.'
            }
          ]
        },
        {
          id: '1-9',
          title: '1.9 Deployment Pipelines (How Agents Move From Idea → Reality → Production)',
          content: [
            { type: 'paragraph', content: 'Everything earlier in this module taught you how agents think, plan, remember, collaborate, and stay safe. Section 1.9 teaches you how agents actually reach the real world — how they go from a prototype to a fully deployed, production-grade digital worker.' },
            { type: 'quote', content: 'Deployment Pipelines are the machinery that take an agent from “just code” to “trusted employee.”' },
            { type: 'heading', content: '🛠 What Is a Deployment Pipeline?' },
            { type: 'paragraph', content: 'A deployment pipeline is a structured, step-by-step process that moves an AI agent from development to production in a safe, controlled way. Think of it as the onboarding process for a new AI employee. Just as you would never throw a new hire into a critical project with no training, organizations never release agents without running them through a pipeline.' },
            {
              type: 'list', content: [
                'Stage 1: Development — The Creativity Zone. Designing responsibilities, writing identity, and connecting tools.',
                'Stage 2: Testing — The Quality & Safety Zone. Running accuracy, reliability, safety, and adversarial tests in a sandbox.',
                'Stage 3: Governance — The Compliance & Oversight Zone. Policy alignment, risk classification, and audit logging.',
                'Stage 4: Deployment — The Real World Zone. Releasing the agent to production to perform real work.'
              ]
            },
            { type: 'heading', content: '🔄 What Is CI/CD for Agents?' },
            { type: 'paragraph', content: 'CI/CD (Continuous Integration / Continuous Deployment) automates the pipeline. Every change is tested, scanned, and validated automatically. This ensures agents evolve over time without requiring huge manual effort.' },
            { type: 'heading', content: '🧰 App: Agent CI/CD Pipeline' },
            { type: 'paragraph', content: 'This interactive tool walks you through the exact steps used by real AI teams. Use Learning Mode to explore the stages, Simulation Mode to act as a release manager, and Quiz Mode to test your knowledge.' },
            { type: 'interactive', content: '', component: 'AgentCiCdPipeline', interactiveId: 'ci-cd-pipeline-1' },
            { type: 'heading', content: '📈 Why This Matters' },
            { type: 'paragraph', content: 'Deployment pipelines make agents trustworthy for HR, finance, operations, and healthcare. Every professional will interact with agents in production, and understanding this process is essential for organizational AI governance.' }
          ],
        },
        {
          id: '1-10',
          title: '1.10 Capstone 1 — Build a Single-Purpose Agent (Your First Real Digital Worker)',
          content: [
            { type: 'paragraph', content: 'Sections 1.1–1.9 covered how agents think, plan, remember, collaborate, stay safe, and use tools. This capstone integrates all of those skills into a single design exercise: building a focused, deployable agent for a specific task.' },
            { type: 'heading', content: '🎯 What Is a Single-Purpose Agent?' },
            { type: 'paragraph', content: 'A single-purpose agent is a focused, specialized AI worker designed to perform one job extremely well. Examples include daily briefing generators, HR onboarding summarizers, safety compliance checkers, and email triage assistants. Single-purpose agents are predictable, reliable, and easy to govern.' },
            { type: 'heading', content: '🧱 The Four Core Components' },
            {
              type: 'list', content: [
                '1. A Plan: A step-by-step reasoning structure (goal, subtasks, fallbacks).',
                '2. A Memory Architecture: Short-term context and long-term preferences.',
                '3. A Tool or API: Real functions like summarization, data lookup, or email drafting.',
                '4. Ethical Guardrails: Privacy boundaries, safe tone, and error handling.'
              ]
            },
            { type: 'heading', content: '🧭 Gemini Guides Step-by-Step' },
            { type: 'paragraph', content: 'Gemini acts as your senior engineer and walks you through the phases of agent creation: Define the Job, Write Identity, Construct the Plan, Add Safety Rules, Connect Tools, and Test & Refine. This mirrors how real agent engineers build production agents.' },
            { type: 'heading', content: '📽 Nano-Banana Timeline Animation' },
            { type: 'paragraph', content: 'Nano-Banana visualizes every internal step your agent takes from start → finish. You literally watch your agent think: reasoning nodes, memory retrieval, tool calls, and guardrail triggers. This gives you an intuitive grasp of how plans become action.' },
            { type: 'heading', content: '📝 Capstone Exercise: Meeting Transcript Agent' },
            { type: 'paragraph', content: 'In this capstone, you will design an agent to "Summarize meeting transcripts in a structured, actionable, policy-aligned format." You must define its mission, memory behavior, API usage, and guardrails before deploying it to the sandbox.' },
            { type: 'interactive', content: '', component: 'CapstoneAgentBuilder', interactiveId: 'capstone-1-agent' },
            { type: 'heading', content: '🎓 Outcome' },
            { type: 'paragraph', content: 'By the end of this capstone, you will have designed an agent with a defined mission, a reasoning plan, a memory architecture, and operational guardrails — and observed how it processes tasks in real-time.' }
          ],
        },
        {
          id: '1-11',
          title: '1.11 Build an Agent | Agent Assembly',
          content: [
            { type: 'interactive', component: 'HuggingFaceGuide', interactiveId: 'hf-guide-1-11', content: '' },
            { type: 'heading', content: 'What you’re building' },
            { type: 'paragraph', content: 'You’re building a Hugging Face Space, which is a hosted mini-app. People visit a link and see a UI. The server behind it runs your Python code.' },
            { type: 'paragraph', content: 'Inside a typical Space:' },
            {
              type: 'list', content: [
                'app.py = the brain + interface definition. It’s the Python file that defines what the user sees (buttons, inputs, outputs), defines what happens when they click or submit, calls APIs (OpenAI, Gemini, etc.) or local logic, and returns results back to the UI.',
                'requirements.txt = the shopping list. A list of Python packages your app.py needs (example: gradio, openai, pandas). Hugging Face reads this file and installs those libraries automatically.'
              ]
            },
            { type: 'paragraph', content: 'Once both are in place, Hugging Face builds the environment, runs app.py, and your app goes live.' },

            { type: 'heading', content: 'The simplest analogy' },
            { type: 'paragraph', content: 'Think of a Space like a food truck:' },
            {
              type: 'list', content: [
                'app.py = the menu + the chef’s recipe steps',
                'requirements.txt = the ingredients list you need delivered',
                'Hugging Face = the truck, kitchen, staff, and power supply',
                'The Space URL = where customers walk up and order'
              ]
            },

            { type: 'heading', content: 'What happens behind the scenes when you paste these files' },
            { type: 'paragraph', content: 'When you commit or save your files in a Space:' },
            {
              type: 'list', content: [
                'Hugging Face reads your repo files.',
                'It sees requirements.txt and installs everything listed.',
                'It starts your app (usually via Gradio).',
                'It creates a public webpage for it.',
                'It keeps it running and rebuilds automatically when you update code.'
              ]
            },
            { type: 'paragraph', content: 'If your Space breaks, it’s usually because a library wasn’t listed in requirements.txt, a version mismatch happened, an API key wasn’t set correctly, or the app crashes due to a Python error.' },

            { type: 'heading', content: 'What “Gradio” is (because you’ll see it constantly)' },
            { type: 'paragraph', content: 'Most Spaces like yours use Gradio, which is a Python library that makes instant web UIs. Meaning: you don’t write HTML/CSS for a basic app. You write Python like: define inputs (textbox, file upload), define outputs (text, charts, images), define what function runs. Then Gradio generates the website automatically. So: Gradio = the UI engine.' },

            { type: 'heading', content: 'Step-by-step: creating the Space and pasting the files' },
            {
              type: 'list', content: [
                '1) Create a Space: Go to Hugging Face → Spaces → Create new Space. Choose SDK: Gradio. Visibility: Public or Private (either works). Give it a name.',
                '2) Open the file editor: You’ll see a repo-like file view (like GitHub in a browser).',
                '3) Paste app.py: Create or open app.py. Paste the provided code exactly. Save / Commit.',
                '4) Paste requirements.txt: Create or open requirements.txt. Paste the required packages exactly. Save / Commit.',
                '5) Watch it build: There will be a build log. It will show installing dependencies, starting the app, and errors if anything fails. When it finishes, your Space has a live URL and a running UI.'
              ]
            },

            { type: 'heading', content: 'The one thing that confuses beginners: API keys' },
            { type: 'paragraph', content: 'If your app calls OpenAI / Google / etc., it needs a secret key. You do not paste keys inside app.py. Instead: Space Settings → Secrets. Add something like: OPENAI_API_KEY = your_key_here or GOOGLE_API_KEY = your_key_here. Then in code, it reads from environment variables. This is safer and the normal professional method.' },

            { type: 'heading', content: 'How to know it’s working' },
            {
              type: 'list', content: [
                'You’ll know it’s working if: the build finishes successfully, the Space shows a UI, buttons produce outputs, logs show no crashes.',
                'You’ll know what’s wrong if: build log shows “ModuleNotFoundError” → missing dependency in requirements, build log shows “KeyError / missing env var” → secret not set, the UI loads but outputs are blank → code error or API error.'
              ]
            },

            { type: 'heading', content: 'What you get when it works (why this matters)' },
            { type: 'paragraph', content: 'Once your Space runs, you have: a shareable live app link, a hosted demo you can embed in your ecosystem, a repeatable template for future modules, and a deploy pipeline learners can actually understand. This is how ZEN turns curriculum into real artifacts: learn → deploy → share → credential.' },
            { type: 'heading', content: 'requirements.txt' },
            { type: 'code', language: 'bash', content: `gradio>=5.49.1\nopenai>=1.40.0\nPillow>=10.0.0\npython-dotenv>=1.0.1` },
            { type: 'heading', content: 'app.py' },
            { type: 'code', language: 'python', content: `import os\n# ... (Full Agent Assembler Python Code) ...\nif __name__ == "__main__":\n    demo.launch()` }
          ]
        },
      ]
    },
    {
      id: 'part-2',
      title: 'PART 2: Advanced Automation & Governance Frameworks',
      content: [
        { type: 'paragraph', content: 'Building on agentic foundations, this module explores how to orchestrate large-scale systems, manage complex knowledge bases, and implement robust governance frameworks for responsible automation.' }
      ],
      subSections: [
        {
          id: '2-1',
          title: '2.1 Workflow Orchestration',
          content: [
            {
              type: 'paragraph',
              content: 'Workflow orchestration is the practice of designing, coordinating, and governing how data, decisions, and actions move through an AI-powered system from start to finish. Rather than treating AI as a single tool, orchestration treats AI as a participant inside a living system—one that reacts to signals, makes decisions, and produces outcomes automatically.'
            },
            {
              type: 'paragraph',
              content: 'In modern AI systems, orchestration is what transforms isolated capabilities into end-to-end intelligence pipelines. This is how raw data becomes insight, insight becomes action, and action becomes continuous improvement.'
            },
            {
              type: 'heading',
              content: 'From Linear Tasks to Intelligent Flows'
            },
            {
              type: 'paragraph',
              content: 'Most people begin automation by thinking in tasks:\n• fetch data\n• clean data\n• run a model\n• send output'
            },
            {
              type: 'paragraph',
              content: 'Orchestration introduces a higher level of thinking: flows.'
            },
            {
              type: 'paragraph',
              content: 'A flow is not just a sequence of steps. It is a structure that defines:\n• how work begins\n• how context is preserved across steps\n• where decisions are made\n• how systems respond to uncertainty or failure'
            },
            {
              type: 'paragraph',
              content: 'This shift—from tasks to flows—is foundational to building scalable AI systems.'
            },
            {
              type: 'heading',
              content: 'Understanding Nodes as Functional Intelligence Units'
            },
            {
              type: 'paragraph',
              content: 'In this environment, each node represents a functional intelligence unit within a larger workflow. Nodes typically fall into four categories:'
            },
            {
              type: 'list',
              content: [
                'Input Nodes: These introduce data into the system (e.g., IoT sensor streams, API data pulls, direct user input).',
                'Transformation Nodes: These modify, enrich, or prepare data (e.g., data cleaning, feature engineering, normalization).',
                'Decision Nodes: These analyze data and determine what happens next (e.g., predictive models, classification models, confidence-based routing).',
                'Action Nodes: These create outcomes in the real world (e.g., generating reports, updating dashboards, sending alerts).'
              ]
            },
            {
              type: 'paragraph',
              content: 'A single workflow may contain all four categories working together.'
            },
            {
              type: 'heading',
              content: 'Sequential vs Parallel Execution'
            },
            {
              type: 'paragraph',
              content: 'Not all steps need to happen one at a time. Well-designed orchestration systems deliberately choose between:\n• sequential execution, where each step depends on the last\n• parallel execution, where independent steps run simultaneously'
            },
            {
              type: 'paragraph',
              content: 'Parallel execution dramatically reduces latency and is essential in real-time systems such as monitoring, fraud detection, or live analytics dashboards. Advanced workflows dynamically decide whether steps should run sequentially or in parallel based on data conditions and system load.'
            },
            {
              type: 'heading',
              content: 'Context Is the Real Payload'
            },
            {
              type: 'paragraph',
              content: 'Modern workflows do not simply pass files from step to step. They pass context. Context includes structured data, metadata, model confidence scores, timestamps, and decision history.'
            },
            {
              type: 'paragraph',
              content: 'As a workflow progresses, this context grows richer. Each node adds understanding rather than replacing it. This accumulated context enables downstream steps—and AI agents—to reason more effectively. This is the foundation of agentic AI, where decisions are informed by everything that has happened before.'
            },
            {
              type: 'heading',
              content: 'Interactive Simulation: Data-to-Decision Flowchart Builder'
            },
            {
              type: 'paragraph',
              content: 'Use the Flowchart Builder below to simulate how orchestration works in practice. Select up to five nodes, arrange them to represent a real-world workflow, and click “Explain Flowchart” to see how data, decisions, and actions propagate through the system.'
            },
            {
              type: 'interactive',
              content: '',
              component: 'DataDecisionFlowchartBuilder',
              interactiveId: 'orchestration-canvas-1'
            },
            {
              type: 'heading',
              content: 'Decision Logic and Branching Paths'
            },
            {
              type: 'paragraph',
              content: 'Workflow orchestration becomes powerful when flows can branch. Branching allows systems to respond intelligently: If confidence is high → automate. If confidence is medium → request review. If confidence is low → retry or escalate.'
            },
            {
              type: 'paragraph',
              content: 'Branching logic can be rule-based, probability-based, or AI-driven using natural language reasoning. In advanced systems, large language models evaluate the full workflow context and decide which path should be taken next.'
            },
            {
              type: 'heading',
              content: 'Human-in-the-Loop Design'
            },
            {
              type: 'paragraph',
              content: 'The most effective AI workflows deliberately include humans at key decision points. Rather than replacing people, orchestration ensures humans focus on judgment, oversight, and exception handling.'
            },
            {
              type: 'list',
              content: [
                'Approval checkpoints',
                'Review queues',
                'Override mechanisms',
                'Audit trails'
              ]
            },
            {
              type: 'paragraph',
              content: 'This design dramatically increases trust, safety, and adoption.'
            },
            {
              type: 'heading',
              content: 'Error Handling and Resilience'
            },
            {
              type: 'paragraph',
              content: 'Production workflows are built with the assumption that things will fail. Professional orchestration systems include retry logic with exponential backoff, fallback models or alternate data sources, graceful degradation, and detailed observability. A workflow that only works when everything goes right is a demo. A resilient workflow is a system.'
            },
            {
              type: 'heading',
              content: 'Orchestration, Automation, and Agents'
            },
            {
              type: 'paragraph',
              content: 'Understanding the distinction is vital: Automation executes steps. Orchestration coordinates systems. Agents decide what to do.'
            },
            {
              type: 'list',
              content: [
                'Workflows provide structure and safety.',
                'Automations provide reliability.',
                'Agents provide reasoning and adaptability.'
              ]
            },
            {
              type: 'paragraph',
              content: 'Modern AI platforms combine all three in a layered architecture essential for building next-generation AI systems.'
            },
            {
              type: 'heading',
              content: 'Why Workflow Orchestration Is a Career-Defining Skill'
            },
            {
              type: 'paragraph',
              content: 'Workflow orchestration is how individual tools become leverage. Once a workflow is designed, it can operate continuously, across teams, across time zones, and at massive scale. This is why orchestration sits at the center of modern AI operations, from startups to governments.'
            },
            {
              type: 'paragraph',
              content: 'If AI is intelligence, workflow orchestration is agency. Mastering this skill means you are no longer just using AI—you are designing systems that think and act.'
            },
            { type: 'interactive', content: '', component: 'SectionQuiz', interactiveId: 'quiz-2-1' }
          ]
        },
        {
          id: '2-2',
          title: '2.2 Knowledge Retrieval & RAG',
          content: [
            {
              type: 'paragraph',
              content: 'Knowledge Retrieval and Retrieval-Augmented Generation (RAG) are the systems that allow AI to consult external knowledge before responding. Rather than relying solely on what a model learned during training, RAG enables AI to retrieve relevant information at runtime, reason over it, and generate grounded, traceable outputs.'
            },
            {
              type: 'paragraph',
              content: 'In modern AI systems, RAG is what turns a general model into a situationally intelligent system—one that can operate accurately inside real organizations, live datasets, and continuously changing environments.'
            },
            {
              type: 'heading',
              content: 'Why Retrieval Is Mandatory in Real AI Systems'
            },
            {
              type: 'paragraph',
              content: 'Language models do not possess live memory of documents, policies, or proprietary data. Without retrieval, systems must either guess or hallucinate.'
            },
            {
              type: 'paragraph',
              content: 'RAG solves this by ensuring that answers are grounded in source material, knowledge stays current without retraining, private data remains controlled and auditable, and models can explicitly say “I don’t know”. This is why nearly all production-grade AI systems rely on retrieval.'
            },
            {
              type: 'heading',
              content: 'Core RAG Pipeline (Operational View)'
            },
            {
              type: 'paragraph',
              content: 'A real RAG system operates as a coordinated pipeline:'
            },
            {
              type: 'list',
              content: [
                'Knowledge Ingestion: Documents, databases, APIs, dashboards, and logs are collected into a knowledge domain.',
                'Chunking & Embedding: Content is segmented into meaningful units and converted into semantic embeddings that capture meaning, not keywords.',
                'Indexing & Storage: Embeddings are stored in a vector-based knowledge store optimized for similarity search.',
                'Query-Time Retrieval: User or agent queries are embedded and matched against stored knowledge to retrieve the most relevant context.',
                'Context Assembly: Retrieved knowledge is ranked, filtered, deduplicated, and assembled into a bounded context window.',
                'Grounded Generation: The language model generates an answer strictly using the retrieved context.'
              ]
            },
            {
              type: 'paragraph',
              content: 'Each stage is independently tunable—and each stage can fail if poorly designed.'
            },
            {
              type: 'heading',
              content: 'Live RAG Demo: Knowledge Retrieval Playground'
            },
            {
              type: 'paragraph',
              content: 'This live RAG mini-app allows you to explore the entire pipeline. Ask questions, view retrieved chunks, inspect similarity scores, and even disable retrieval to observe hallucination behavior side-by-side.'
            },
            {
              type: 'interactive',
              content: '',
              component: 'RagBuilder',
              interactiveId: 'rag-builder-pro-1'
            },
            {
              type: 'heading',
              content: 'Multi-Document Reasoning Simulator'
            },
            {
              type: 'paragraph',
              content: 'Real knowledge is rarely stored in a single document. AI must reason across multiple sources simultaneously. Learners can retrieve content from multiple documents, see how conflicting information is surfaced, observe how the system reconciles or flags discrepancies, and inspect which sources influenced each part of the response.'
            },
            {
              type: 'paragraph',
              content: 'This teaches the difference between simple lookup and cross-document reasoning, which is critical in research, policy analysis, and enterprise settings.'
            },
            {
              type: 'heading',
              content: 'Embeddings: How Meaning Is Retrieved'
            },
            {
              type: 'paragraph',
              content: 'Embeddings convert text into numerical representations of meaning. This allows systems to retrieve information even when phrasing differs. Key concepts include semantic similarity vs keyword matching, query expansion, the impact of chunk size and overlap, and tradeoffs between precision and recall.'
            },
            {
              type: 'heading',
              content: 'RAG vs Agent Memory (Explicit Comparison)'
            },
            {
              type: 'paragraph',
              content: 'RAG and Memory serve different purposes. RAG (External Knowledge) is stateless at query time, retrieves facts, is authoritative, and ideal for policies or manuals. Agent Memory (Internal State) is persistent across interactions, stores preferences and decisions, is experiential, and ideal for personalization and planning.'
            },
            {
              type: 'paragraph',
              content: 'Failure modes occur when memory is misused as knowledge or when retrieval is missing entirely.'
            },
            {
              type: 'heading',
              content: 'RAG Inside Workflow-Driven AI Agents'
            },
            {
              type: 'paragraph',
              content: 'RAG does not operate in isolation. It is embedded inside orchestrated workflows and agent decision loops: Trigger → Retrieve → Reason → Decide → Act.'
            },
            {
              type: 'mermaid',
              content: `graph LR
    Trigger(Trigger Event) --> Retrieve[Retrieve Knowledge]
    Retrieve --> Reason[Reason & Plan]
    Reason --> Decide{Decision Point}
    Decide -- High Confidence --> Act[Execute Action]
    Decide -- Ambiguous --> Ask[Ask Human]
    Act --> Log(Audit Log)`
            },
            {
              type: 'paragraph',
              content: 'Examples include retrieving knowledge before classification, policies before approval decisions, historical context before summarization, and evidence before alerting humans.'
            },
            {
              type: 'heading',
              content: 'Security, Privacy, and Governance in RAG Systems'
            },
            {
              type: 'paragraph',
              content: 'Production RAG systems enforce role-based retrieval, access-controlled embeddings, query and response logging, and auditability of sources. Learners explore how retrieval scopes change based on user role and how improper access control leads to leakage.'
            },
            {
              type: 'heading',
              content: 'Why RAG Is Foundational to Trustworthy AI'
            },
            {
              type: 'paragraph',
              content: 'Without retrieval, AI is impressive but unreliable. With retrieval, AI becomes grounded, current, and accountable. RAG is the backbone of enterprise copilots, research assistants, policy analysis systems, intelligent dashboards, and personalized learning engines.'
            },
            {
              type: 'paragraph',
              content: 'If workflow orchestration gives AI structure, and agents give AI agency, then RAG gives AI truth. Mastering this concept means you understand how real AI systems stay accurate in the real world—not just eloquent in conversation.'
            },
            { type: 'interactive', content: '', component: 'SectionQuiz', interactiveId: 'quiz-2-2' }
          ]
        },
        {
          id: '2-3',
          title: '2.3 Multi-Modal Agents',
          content: [
            { type: 'paragraph', content: 'Multi-modal agents are AI systems that can perceive, reason, and act across multiple forms of input and output simultaneously—including text, images, audio, video, structured data, and real-time signals.' },
            { type: 'paragraph', content: 'Unlike single-mode assistants, multi-modal agents operate more like humans: they interpret context holistically, synthesize information across senses, and choose actions based on a unified understanding of the environment. This is a foundational shift from “chatbots” to situationally aware AI operators.' },
            { type: 'heading', content: 'What Makes an Agent Truly Multi-Modal' },
            { type: 'paragraph', content: 'A system is not multi-modal simply because it accepts images or audio. True multi-modal agents must:' },
            { type: 'list', content: ['Ingest multiple modalities at once', 'Align meaning across modalities', 'Reason over combined context', 'Decide actions based on fused signals', 'Act across one or more output channels'] },
            { type: 'paragraph', content: 'Multi-modal intelligence is about integration, not feature count.' },
            { type: 'heading', content: 'Modalities as Signals, Not Attachments' },
            { type: 'paragraph', content: 'In production systems, modalities are treated as signals, not files.' },
            { type: 'list', content: ['Image: A spatial signal', 'Audio: A temporal signal', 'Text: A semantic signal', 'Sensor data: A quantitative signal'] },
            { type: 'paragraph', content: 'A multi-modal agent does not process these independently. It fuses them into a single contextual representation before reasoning. This fusion step is where intelligence emerges.' },
            { type: 'interactive', component: 'AudioVisualSyncLab', interactiveId: 'multi-modal-lab-1', content: '' },
            { type: 'heading', content: 'Core Multi-Modal Agent Architecture' },
            { type: 'paragraph', content: 'A modern multi-modal agent pipeline includes:' },
            {
              type: 'list', content: [
                'Multi-Modal Input Layer: Text, images, audio, video, sensor streams, and structured data arrive concurrently.',
                'Modality Encoders: Each modality is transformed into a compatible internal representation (embeddings).',
                'Cross-Modal Fusion: Signals are aligned and merged so meaning can be reasoned across modalities.',
                'Context Assembly (with RAG): External knowledge is retrieved to ground interpretation.',
                'Reasoning Core: The agent evaluates the full context and decides what to do next.',
                'Action Layer: Outputs may include text, visual annotations, alerts, API calls, or workflow transitions.'
              ]
            },
            { type: 'paragraph', content: 'Every stage is orchestrated—not improvised.' },
            { type: 'heading', content: 'Live RAG Demo: Multi-Modal Knowledge Grounding' },
            { type: 'paragraph', content: 'In this section, we explore how agents reason when multiple documents and modalities are involved at once. Learners can supply multiple documents plus an image or dataset, observe how relevance is weighted across sources, inspect which modality contributed to each conclusion, and detect conflicts between visual evidence and text sources. This teaches learners how agents resolve ambiguity—not just retrieve facts.' },
            { type: 'interactive', component: 'VideoAnalystPro', interactiveId: 'video-analyst-1', content: '' },
            { type: 'heading', content: 'RAG vs Agent Memory in Multi-Modal Systems' },
            { type: 'paragraph', content: 'RAG and Memory serve different roles in multi-modal agents:' },
            {
              type: 'list', content: [
                'RAG: Retrieves external reference knowledge, grounds interpretation of images/audio, authoritative and auditable, resets each query.',
                'Agent Memory: Stores prior observations/decisions, remembers user preferences, accumulates experiential context, can drift if misused as fact.'
              ]
            },
            { type: 'paragraph', content: 'Failure modes appear when agents rely on memory instead of retrieval for factual grounding.' },
            { type: 'heading', content: 'Multi-Modal Agents Inside Workflow Orchestration' },
            { type: 'paragraph', content: 'Multi-modal agents are rarely standalone. They operate inside orchestrated workflows. A typical pipeline: Trigger → Observe (multi-modal) → Retrieve → Reason → Decide → Act → Log.' },
            {
              type: 'mermaid', content: `graph LR
    Trigger(Sensor/Input) --> Observe[Multi-Modal Observation]
    Observe --> Retrieve[RAG Lookup]
    Retrieve --> Reason[Fusion & Reasoning]
    Reason --> Decide{Decision}
    Decide -- Alert --> Act[Execute Action]
    Decide -- Log --> LogDB[(Audit Log)]` },
            { type: 'paragraph', content: 'Examples include image + sensor data triggering alerts, or video + text driving compliance review.' },
            { type: 'heading', content: 'Safety, Reliability, and Governance' },
            { type: 'paragraph', content: 'Multi-modal agents introduce new risks like visual misinterpretation, audio ambiguity, and context overload. Guardrails must include confidence thresholds per modality, retrieval-based grounding, audit trails linking outputs to sources, and escalation paths to human reviewers.' },
            { type: 'heading', content: 'Why Multi-Modal Agents Represent the Next Leap' },
            { type: 'paragraph', content: 'Single-modal AI responds. Multi-modal agents perceive. They enable intelligent monitoring systems, advanced copilots, autonomous operations, and immersive learning platforms. When combined with orchestration, RAG, and memory, multi-modal agents move AI from conversation into actionable intelligence.' }
          ]
        },
        {
          id: '2-4',
          title: '2.4 Event-Driven Automation',
          content: [
            { type: 'paragraph', content: 'Event-driven automation is the architectural pattern that allows systems to react immediately when something meaningful happens. Instead of running on fixed schedules or manual triggers, event-driven systems listen for signals and respond in real time.' },
            { type: 'paragraph', content: 'In AI-native systems, events are the nervous system. They are how workflows wake up, how agents receive stimuli, and how intelligence propagates through an organization.' },
            { type: 'heading', content: 'What Counts as an Event?' },
            { type: 'paragraph', content: 'An event is any state change or signal that matters. They are moments of significance that demand attention, not just tasks on a checklist.' },
            {
              type: 'list', content: [
                'A form submission',
                'A database update',
                'A sensor threshold crossing',
                'A new file upload',
                'A user action',
                'A model confidence shift',
                'An external API webhook'
              ]
            },
            { type: 'heading', content: 'Event-Driven vs Schedule-Driven Systems' },
            {
              type: 'mermaid', content: `graph TD
    subgraph Schedule ["Schedule-Driven (Traditional)"]
        Clock((Clock)) -- "Every Hour" --> Batch[Batch Process]
        Batch --> Check{Changes?}
        Check -- Yes --> Run[Run Task]
        Check -- No --> Waste[Compute Wasted]
    end
    subgraph Event ["Event-Driven (Modern)"]
        Signal((Signal)) -- "Instant" --> Trigger[Wake Agent]
        Trigger --> Action[Execute Action]
        Action --> Sleep[Scale to Zero]
    end
    style Signal fill:#dcfce7,stroke:#15803d
    style Trigger fill:#dcfce7,stroke:#15803d
    style Action fill:#dcfce7,stroke:#15803d`
            },
            {
              type: 'list', content: [
                'Traditional (Time-based): Run every hour, sync nightly, batch process weekly.',
                'Event-Driven (Signal-based): Respond instantly, scale dynamically, reduce wasted computation.'
              ]
            },
            { type: 'heading', content: 'Core Event-Driven Architecture' },
            { type: 'paragraph', content: 'A modern event-driven system decouples the signal from the action, allowing systems to scale and evolve without breaking.' },
            {
              type: 'list', content: [
                'Event Sources: Where signals originate (apps, devices, users, models).',
                'Event Bus or Stream: A system (like Kafka or EventBridge) that routes events to interested workflows.',
                'Event Consumers: Workflows or agents that wake up for specific event types.',
                'Action Handlers: Systems that execute outcomes based on decisions.'
              ]
            },
            { type: 'heading', content: '🎛️ Interactive Lab: EventOps Mission Control' },
            { type: 'paragraph', content: 'Use this simulator to manage a live event stream. Tune sensitivity thresholds to balance false alarms vs missed risks, replay specific event sequences to debug workflow logic, and handle a massive "Event Storm" incident.' },
            { type: 'interactive', component: 'EventOpsLab', interactiveId: 'event-ops-lab-1', content: '' },
            { type: 'heading', content: 'Event-Driven Agents in Orchestrated Workflows' },
            { type: 'paragraph', content: 'Event-driven automation is most powerful when paired with agents. Instead of simple "If This Then That" rules, events trigger intelligent cognitive loops.' },
            {
              type: 'mermaid', content: `graph LR
    Event((Event)) --> Retrieve[Retrieve Context]
    Retrieve --> Reason[Agent Reasoning]
    Reason --> Decide{Decision}
    Decide --> Act[Execute Tool]
    Act --> Emit((Emit New Event))
    style Event fill:#f3e8ff,stroke:#7e22ce
    style Emit fill:#f3e8ff,stroke:#7e22ce`
            },
            { type: 'heading', content: 'RAG vs Agent Memory in Event Systems' },
            { type: 'paragraph', content: 'When an event wakes an agent, where does it get its context?' },
            {
              type: 'list', content: [
                'RAG (Retrieval): Fetches external, authoritative knowledge per event (e.g., "What is the current policy for refunding this specific item?"). Resets every cycle to ensure correctness.',
                'Agent Memory: Remembers prior events and outcomes (e.g., "This user has asked for a refund 3 times this week"). Enables pattern recognition but risks bias if used as fact storage.'
              ]
            },
            { type: 'heading', content: 'Reliability, Ordering, and Idempotency' },
            { type: 'paragraph', content: 'Real-world event streams are messy. Events arrive out of order, duplicate, or fail. Engineering reliability means building systems that can handle this chaos.' },
            {
              type: 'list', content: [
                'Idempotency: Ensuring that processing the same event twice doesn’t result in double actions (e.g., charging a card twice).',
                'Dead-Letter Queues: A "graveyard" for failed events so they can be inspected and replayed later, rather than blocking the system.',
                'Event Replay: The ability to "rewind" the stream and re-process past events to fix bugs or backfill data.'
              ]
            },
            { type: 'heading', content: 'Why This Changes Everything' },
            { type: 'paragraph', content: 'When combined with orchestration, RAG, and agents, events turn AI systems into living infrastructures. If workflows give structure, RAG gives truth, and agents give agency, then events give AI reflexes.' }
          ]
        },
        {
          id: '2-5',
          title: '2.5 Human-in-the-Loop',
          content: [
            { type: 'paragraph', content: 'Human-in-the-Loop (HITL) systems intentionally place humans at critical decision points inside automated and AI-driven workflows. Rather than removing people, HITL design ensures that human judgment is applied where it creates the most leverage—especially in high-risk, ambiguous, or high-impact situations.' },
            { type: 'paragraph', content: 'In modern AI systems, HITL is not a fallback. It is a core architectural feature that enables trust, safety, learning, and continuous improvement.' },
            { type: 'heading', content: 'Why Humans Still Matter in Automated Systems' },
            {
              type: 'list', content: [
                'AI systems excel at: scale, speed, pattern recognition.',
                'Humans excel at: judgment, ethics, contextual nuance, accountability.'
              ]
            },
            { type: 'paragraph', content: 'HITL systems combine these strengths rather than forcing one to replace the other.' },
            { type: 'heading', content: 'Core HITL Patterns in AI Systems' },
            {
              type: 'mermaid', content: `graph TD
    subgraph Patterns ["HITL Patterns"]
        Gate[Approval Gates]
        Queue[Review Queues]
        Esc[Escalation Paths]
        Override[Override Mechanisms]
    end
    AI((AI Agent)) --> Gate
    AI --> Queue
    AI -- "Low Confidence" --> Esc
    Human((Human)) -- "Correction" --> Override`
            },
            {
              type: 'list', content: [
                'Approval Gates: Automation pauses until a human approves or rejects an action.',
                'Review Queues: Humans review only low-confidence or high-impact cases.',
                'Escalation Paths: Complex or ambiguous cases are routed to specialists.',
                'Override Mechanisms: Humans can reverse or modify automated decisions.'
              ]
            },
            { type: 'heading', content: '🎛️ HITL Control Center (Existing Lab)' },
            { type: 'paragraph', content: 'Explore the different patterns of human intervention in this interactive lab. Act as the "Gatekeeper" for high-risk decisions, audit UI safety, and manage an approval simulation.' },
            { type: 'interactive', component: 'HitlLab', interactiveId: 'hitl-lab-1', content: '' },
            { type: 'heading', content: 'Live RAG Demo: Human-Grounded Decision Support' },
            { type: 'paragraph', content: 'Human decisions are only as good as the information presented. This simulator demonstrates how Retrieval Augmented Generation (RAG) empowers human reviewers by surfacing relevant policies and history alongside AI recommendations.' },
            { type: 'paragraph', content: 'Compare decision quality when you have context (RAG ON) versus when you are flying blind (RAG OFF).' },
            { type: 'interactive', component: 'HitlRagSimulator', interactiveId: 'hitl-rag-1', content: '' },
            { type: 'heading', content: 'RAG vs Agent Memory in HITL Systems' },
            {
              type: 'list', content: [
                'RAG: Retrieves authoritative reference material (e.g., "Policy 4.2"). Supports compliance and accuracy. Resets per decision.',
                'Agent Memory: Remembers past decisions and human feedback (e.g., "User rejected this type of request last time"). Adapts recommendations over time.'
              ]
            },
            { type: 'heading', content: 'HITL Inside Workflow Orchestration' },
            {
              type: 'mermaid', content: `graph LR
    Trigger(Trigger) --> Analyze[AI Analysis]
    Analyze --> Retrieve[Retrieve Context]
    Retrieve --> Propose[AI Proposal]
    Propose --> Human{Human Review}
    Human -- Approve --> Act[Execute Action]
    Human -- Reject --> Log[Log Reason]
    Act --> Audit(Audit Trail)`
            },
            { type: 'paragraph', content: 'This workflow reinforces that HITL is a designed system behavior, not an improvisation. Context is preserved across the pause, and every decision is audited.' },
            { type: 'heading', content: 'Why Human-in-the-Loop Is a Force Multiplier' },
            { type: 'paragraph', content: 'HITL systems scale judgment, not just automation. They enable safer AI deployment, faster human decision-making, continuous learning, and organizational trust.' },
            { type: 'quote', content: 'If events give AI reflexes, workflows give structure, RAG gives truth, and agents give agency, then HITL gives AI wisdom.' }
          ]
        },
        {
          id: '2-6',
          title: '2.6 Governance & Transparency',
          content: [
            { type: 'paragraph', content: 'Governance and transparency are the systems that ensure AI behaves predictably, responsibly, and explainably as it scales. They define who can do what, why decisions were made, and how outcomes can be audited, challenged, or improved.' },
            { type: 'quote', content: 'In modern AI systems, governance is not paperwork. It is infrastructure.' },
            { type: 'heading', content: 'What Governance Means in AI Systems' },
            {
              type: 'list', content: [
                'AI Governance establishes: decision boundaries, accountability structures, access controls, traceability of outcomes.',
                'Transparency ensures: decisions can be explained, data sources are visible, models are not black boxes, humans remain in control.'
              ]
            },
            { type: 'heading', content: 'Governance as a System, Not a Policy' },
            { type: 'paragraph', content: 'Static policies fail in dynamic systems. Modern governance is embedded directly into workflows, agents, event handling, and data access layers. This ensures rules are enforced automatically rather than manually interpreted.' },
            { type: 'heading', content: '⚖️ Live RAG Demo: Policy-Aware Decision Making' },
            { type: 'paragraph', content: 'This simulator demonstrates how an AI agent uses RAG to enforce policies in real-time. Compare how the agent behaves when strictly following written rules (RAG) versus relying on past habits (Memory). Observe how the system handles conflicting rules.' },
            { type: 'interactive', component: 'GovernanceDecisionSimulator', interactiveId: 'gov-decision-1', content: '' },
            { type: 'heading', content: 'Transparency Through Explainability' },
            { type: 'paragraph', content: 'Transparent systems explain what decision was made, which data was used, which rules applied, and what confidence the system had. This builds trust.' },
            { type: 'interactive', component: 'TransparencyScorecard', interactiveId: 'transparency-score-1', content: '' },
            { type: 'heading', content: 'Logging, Traceability, and Auditability' },
            { type: 'paragraph', content: 'Governed systems log inputs, retrieved knowledge, decisions, human interventions, and outputs. Traceability is treated as a first-class system feature, enabling compliance audits and incident investigation.' },
            { type: 'interactive', component: 'DecisionAuditLog', interactiveId: 'audit-log-1', content: '' },
            { type: 'heading', content: 'Privacy & Data Governance' },
            { type: 'paragraph', content: 'Use the Privacy Lens Dashboard below to explore how sensitive data is detected, redacted, and managed within AI workflows to ensure compliance and privacy.' },
            { type: 'interactive', component: 'PrivacyLensDashboard', interactiveId: 'privacy-lens-1', content: '' },
            { type: 'heading', content: 'Why Governance & Transparency Are Non-Negotiable' },
            { type: 'paragraph', content: 'As AI systems act with greater autonomy, governance becomes the backbone of legitimacy. If events give AI reflexes, workflows give structure, RAG gives truth, agents give agency, and humans give wisdom—then governance gives AI legitimacy.' }
          ]
        },
        {
          id: '2-7',
          title: '2.7 AI Economy & Resource Optimization (Make Agents Powerful and Efficient)',
          content: [
            {
              type: 'paragraph',
              content: 'You’ve now built workflows (2.1), attached private knowledge (2.2), added multi-modal inputs (2.3), made systems run in real time (2.4), kept humans in control (2.5), and governed sensitive data (2.6). Now comes the part most “AI courses” skip—until the invoice hits: AI systems are not free. Every message, retrieval, tool call, and multimodal step consumes budget, time, and energy.'
            },
            {
              type: 'quote',
              content: 'This is “AgentOps economics”: if you can optimize this, you can run AI like an enterprise—without burning cash or crashing systems.'
            },
            {
              type: 'heading',
              content: '🧠 The Core Idea: “Cost vs Output”'
            },
            {
              type: 'paragraph',
              content: 'Every agent workflow has three bills:\n1. **Compute Bill**: Model tokens, context window size, multimodal processing, long outputs.\n2. **Tooling Bill**: Search/RAG retrieval, vector database queries, API calls, file handling.\n3. **Operations Bill**: Latency (time), retries, failures, monitoring, human approvals.'
            },
            {
              type: 'paragraph',
              content: 'Optimization is the skill of getting higher-quality outcomes with lower cost, at higher reliability, in less time. It’s the difference between a "Cool demo" and "A system that runs every day for thousands of users."'
            },
            {
              type: 'heading',
              content: '🧰 App: Token Economy Simulator 2.0 (Mission Control)'
            },
            {
              type: 'paragraph',
              content: 'This simulator is your sandbox for mastering the economics of agent systems. It behaves like a strategy game + operations dashboard combined. Use the **Metrics Panel** to track cost, latency, and quality. Use the **Optimization Levers** to tune your architecture.'
            },
            {
              type: 'interactive',
              content: '',
              component: 'TokenEconomySimulator',
              interactiveId: 'token-economy-2'
            },
            {
              type: 'heading',
              content: '⚙️ The 7 Levers of Optimization'
            },
            {
              type: 'list',
              content: [
                'Model Routing: Use smaller models for classification/routing, larger models for reasoning.',
                'Context Budgeting: Trim long transcripts and summarize before reasoning to save tokens.',
                'RAG Tuning: Reduce chunk spam, increase precision, and enforce citation coverage.',
                'Caching: Don’t recompute what you already know. Cache frequent hits.',
                'Batching: Process multiple events together to handle "event storms" efficiently.',
                'Guardrails as Cost Control: Block runaway loops and infinite tool calls early.',
                'Failure Strategy: Use graceful degradation (fallback tools) instead of blind retries.'
              ]
            },
            {
              type: 'heading',
              content: '🎮 Gamified Labs'
            },
            {
              type: 'list',
              content: [
                'Mini-Game 1: “Budget Boss Fight” — Keep a workflow under a daily budget while meeting a quality target against a wave of events.',
                'Mini-Game 2: “Latency Drag Race” — Watch a heavy pipeline race against an optimized one. Unlock upgrades like caching to win.',
                'Mini-Game 3: “The Hallucination Tax” — See how weak grounding leads to higher risk scores and expensive human reviews.'
              ]
            },
            {
              type: 'heading',
              content: '🔗 Integration Scenarios'
            },
            {
              type: 'paragraph',
              content: 'Apply these concepts to real architectures:\n\n**Scenario A: Orchestrated RAG Helpdesk**\nOptimization: Reduce retrieval waste, add caching for common questions, route low-risk answers to fast models.\n\n**Scenario B: Multimodal Safety Review**\nOptimization: Only use multimodal inference when confidence requires it; store safe summaries instead of raw media.\n\n**Scenario C: Real-Time Ops**\nOptimization: Batch processing, cooldown windows, and graceful degradation during event storms.'
            },
            {
              type: 'heading',
              content: '🎓 Outcome'
            },
            {
              type: 'paragraph',
              content: 'You are now equipped to build production-grade agent systems that are fast enough to feel magical, cheap enough to scale, and reliable enough to trust.'
            }
          ]
        },
        {
          id: '2-8',
          title: '2.8 Global Coordination & Policy Integration',
          content: [
            { type: 'paragraph', content: 'Global coordination and policy integration are the systems that allow AI to operate consistently, lawfully, and ethically across borders, jurisdictions, and institutions. As AI systems scale beyond a single organization or country, they must navigate overlapping regulations, cultural norms, and governance frameworks—often simultaneously.' },
            { type: 'quote', content: 'In modern AI deployments, global coordination is not optional. It is the difference between scalable impact and systemic failure.' },
            { type: 'heading', content: 'Why Global Context Matters for AI Systems' },
            {
              type: 'list', content: [
                'AI systems increasingly operate across: countries, regulatory regimes, languages, cultures, and institutional structures.',
                'A decision that is compliant in one jurisdiction may be illegal or unethical in another.',
                'Global coordination ensures AI systems adapt intelligently to where and how they operate.'
              ]
            },
            { type: 'heading', content: 'Policy as Executable Knowledge' },
            { type: 'paragraph', content: 'Policies are not static documents in advanced systems. They are retrievable, interpretable, and enforceable knowledge. International regulations, regional laws, and ethical frameworks are encoded as retrievable knowledge and applied dynamically at runtime.' },
            { type: 'heading', content: '🌐 Live RAG Demo: Jurisdiction-Aware Policy Retrieval' },
            { type: 'paragraph', content: 'This interactive demo allows you to simulate a global AI agent. Select a region and an action to see how the RAG system retrieves specific compliance documents and adjusts the agent\'s decision logic in real-time.' },
            { type: 'interactive', component: 'JurisdictionAwareRag', interactiveId: 'jurisdiction-rag-1', content: '' },
            { type: 'heading', content: 'Multi-Document Reasoning Across Policy Frameworks' },
            { type: 'paragraph', content: 'Global policy compliance requires reconciling multiple documents at once. AI systems must identify conflicts between frameworks, prioritize rules based on jurisdiction, and surface unresolved ambiguity for human review.' },
            { type: 'heading', content: 'RAG vs Agent Memory in Global Policy Systems' },
            {
              type: 'list', content: [
                'RAG: Retrieves authoritative policy sources. Updates instantly as regulations change. Jurisdiction-specific and auditable.',
                'Agent Memory: Remembers prior regional decisions. Tracks operational precedent. Improves efficiency—but not authority.'
              ]
            },
            { type: 'heading', content: 'Policy-Aware Agents Inside Orchestrated Workflows' },
            {
              type: 'mermaid', content: `graph LR
    Trigger(Trigger) --> Identify[Identify Jurisdiction]
    Identify --> Retrieve[Retrieve Policies]
    Retrieve --> Evaluate[Evaluate Rules]
    Evaluate --> Decide{Decision}
    Decide -- Compliant --> Act[Execute Action]
    Decide -- Violation --> Block[Block & Log]
    Act --> Log(Compliance Log)`
            },
            { type: 'heading', content: 'Global Policy Map' },
            { type: 'paragraph', content: 'Explore how rules and risks differ across key global regions. Click on a region to see its specific regulatory focus and primary risks.' },
            { type: 'interactive', component: 'GlobalPolicyMap', interactiveId: 'global-policy-map-1', content: '' },
            { type: 'heading', content: 'Transparency and Trust Across Borders' },
            { type: 'paragraph', content: 'Transparency must scale globally. Systems must explain decisions in region-appropriate terms, expose applicable policies, and preserve audit trails across jurisdictions. Trust is treated as a design outcome, not a marketing claim.' },
            { type: 'heading', content: 'Live Patent Radar (Legacy System)' },
            { type: 'paragraph', content: 'Monitor global innovation trends and intellectual property filings in real-time using this legacy tracking module.' },
            { type: 'interactive', component: 'LivePatentRadar', interactiveId: 'patent-radar-1', content: '' },
            { type: 'heading', content: 'Why Global Coordination Is a Strategic Capability' },
            { type: 'paragraph', content: 'AI systems that scale globally without coordination become liabilities. Systems that integrate policy intelligently become platforms. If governance gives AI legitimacy, then global coordination gives AI license to operate at planetary scale.' }
          ]
        },
        {
          id: '2-9',
          title: '2.9 Future Frontiers — Neuro-Symbolic & Quantum Agents',
          content: [
            { type: 'paragraph', content: 'This section explores where AI is heading next—and it does so without assuming a technical background. You do not need to understand math, physics, or computer science to understand the ideas here. What matters is grasping why these approaches exist and what problems they are trying to solve.' },
            { type: 'quote', content: 'At a high level, both neuro-symbolic agents and quantum agents exist because today’s AI—while powerful—still has important limits.' },
            { type: 'heading', content: 'Why Today’s AI Has Limits' },
            { type: 'paragraph', content: 'Modern AI is excellent at spotting patterns, generating language, recognizing images, and making predictions. But it struggles with strict logic and rules, long-term consistency, deep reasoning across facts, and certainty and proof.' },
            { type: 'heading', content: 'Neuro-Symbolic Agents (Plain-Language Explanation)' },
            { type: 'paragraph', content: 'Think of neuro-symbolic AI as a partnership between intuition and logic. Neural AI is intuitive—it “feels” patterns. Symbolic AI is logical—it follows rules. Neuro-symbolic agents combine both.' },
            { type: 'paragraph', content: 'Simple Analogy: Imagine a doctor. Their intuition comes from experience (“this feels like flu”). Their logic comes from rules (“if X and Y, then Z”). Neuro-symbolic agents work the same way.' },
            { type: 'heading', content: 'Symbolic Logic Engine' },
            { type: 'paragraph', content: 'Before exploring the hybrid model, interact with this visualizer to see how pure "Symbolic AI" operates: strictly following rules step-by-step, with no intuition.' },
            { type: 'interactive', component: 'AlgorithmVisualizer', interactiveId: 'symbolic-logic-1', content: '' },
            { type: 'heading', content: 'Interactive Lab: Neuro-Symbolic & Quantum Concepts' },
            { type: 'paragraph', content: 'Explore these advanced concepts hands-on. Use the **Logic Mixer** to blend intuition with rules, test **Rule-Aware RAG** to see how constraints change outcomes, and simulate **Quantum Search** to understand parallel decision making.' },
            { type: 'interactive', component: 'NeuroSymbolicQuantumLab', interactiveId: 'future-tech-lab-1', content: '' },
            { type: 'heading', content: 'Quantum Agents (Conceptual, Not Technical)' },
            { type: 'paragraph', content: 'Quantum agents are not magic and they are not science fiction—but they are early. A normal computer tries one path at a time. A quantum system explores many paths at once, then selects the best outcome.' },
            { type: 'heading', content: 'RAG vs Agent Memory in Future Agents' },
            {
              type: 'list', content: [
                'RAG (Truth): Like checking a rulebook. Always current. Resets each question.',
                'Agent Memory (Experience): Like remembering past conversations. Helpful for personalization. Dangerous if mistaken for facts.'
              ]
            },
            { type: 'heading', content: 'Future Agents Inside Workflows' },
            {
              type: 'mermaid', content: `graph LR
    Trigger --> Retrieve[Retrieve Knowledge]
    Retrieve --> Apply[Apply Rules]
    Apply --> Evaluate{Evaluate Possibilities}
    Evaluate --> Decide[Select Best Path]
    Decide --> Act --> Log` },
            { type: 'paragraph', content: 'Even futuristic agents operate inside workflows. Structure always remains—even as intelligence improves.' },
            { type: 'heading', content: 'Why This Matters for the Future' },
            { type: 'paragraph', content: 'Future AI will not replace humans—it will explain itself better, respect rules more clearly, expose uncertainty honestly, and work alongside human judgment. If today’s AI gives us speed, future AI gives us reasoning we can trust.' }
          ]
        },
        {
          id: '2-10',
          title: '2.10 Capstone 2 — Design an Autonomous Organization',
          content: [
            { type: 'paragraph', content: 'This capstone brings together everything you’ve learned in Module 2 into a single, coherent system: an autonomous organization. Not a company with employees replaced by AI—but an organization where AI systems handle coordination, knowledge, decisions, and actions automatically, with humans providing direction, judgment, and governance.' },
            { type: 'quote', content: 'No single model does this. It emerges from architecture.' },
            { type: 'heading', content: 'System-Level View (Putting It All Together)' },
            {
              type: 'list', content: [
                '1. Event Layer: Signals that wake the system up (user actions, data changes, alerts)',
                '2. Knowledge Layer (RAG): Documents, policies, and references the system can look up',
                '3. Agent Layer: Reasoning units that decide what to do',
                '4. Workflow Layer: Orchestration that governs order, branching, and escalation',
                '5. Governance & Human Layer: Rules, transparency, and human judgment'
              ]
            },
            { type: 'heading', content: '🏛️ Capstone App: Autonomous Org Architect' },
            { type: 'paragraph', content: 'Design your own autonomous organization by configuring each of the 5 layers. Define triggers, knowledge sources, agent roles, and governance rules. Then, run a live simulation to see how an event flows through your architecture.' },
            { type: 'interactive', component: 'CapstoneOrgArchitect', interactiveId: 'capstone-2-architect', content: '' },
            { type: 'heading', content: 'Capstone Scenario: Autonomous Operations Simulation' },
            { type: 'paragraph', content: 'In the simulation above, you observed the full loop: An event occurs -> Knowledge is retrieved -> Agents reason across documents -> Policies are applied -> A decision is proposed -> Humans intervene if needed -> Actions are taken -> Everything is logged.' },
            { type: 'heading', content: 'Preparing for Section 2.11 (Implementation)' },
            { type: 'paragraph', content: 'At this point, you are not starting from zero. You already understand the architecture, recognize the components, and know why each piece exists. Section 2.11 simply turns this design into a working, copy-pasteable Hugging Face Space. The code will no longer feel mysterious—it will feel familiar.' },
            { type: 'heading', content: 'Why This Capstone Matters' },
            { type: 'paragraph', content: 'This capstone develops the skill of systems-level thinking. Once you can design an architecture that coordinates multiple intelligent components, you can reason about how any complex organization — from startups to government agencies — can leverage autonomous AI systems.' }
          ]
        },
        {
          id: '2-11',
          title: '2.11 Build an Omni Studio',
          content: [
            { type: 'interactive', component: 'HuggingFaceGuide', interactiveId: 'hf-guide-1', content: '' },
            { type: 'heading', content: 'What you’re building' },
            { type: 'paragraph', content: 'You’re building a Hugging Face Space, which is a hosted mini-app. People visit a link and see a UI. The server behind it runs your Python code.' },
            { type: 'paragraph', content: 'Inside a typical Space:' },
            {
              type: 'list', content: [
                'app.py = the brain + interface definition. It’s the Python file that defines what the user sees (buttons, inputs, outputs), defines what happens when they click or submit, calls APIs (OpenAI, Gemini, etc.) or local logic, and returns results back to the UI.',
                'requirements.txt = the shopping list. A list of Python packages your app.py needs (example: gradio, openai, pandas). Hugging Face reads this file and installs those libraries automatically.'
              ]
            },
            { type: 'paragraph', content: 'Once both are in place, Hugging Face builds the environment, runs app.py, and your app goes live.' },

            { type: 'heading', content: 'The simplest analogy' },
            { type: 'paragraph', content: 'Think of a Space like a food truck:' },
            {
              type: 'list', content: [
                'app.py = the menu + the chef’s recipe steps',
                'requirements.txt = the ingredients list you need delivered',
                'Hugging Face = the truck, kitchen, staff, and power supply',
                'The Space URL = where customers walk up and order'
              ]
            },

            { type: 'heading', content: 'What happens behind the scenes when you paste these files' },
            { type: 'paragraph', content: 'When you commit or save your files in a Space:' },
            {
              type: 'list', content: [
                'Hugging Face reads your repo files.',
                'It sees requirements.txt and installs everything listed.',
                'It starts your app (usually via Gradio).',
                'It creates a public webpage for it.',
                'It keeps it running and rebuilds automatically when you update code.'
              ]
            },
            { type: 'paragraph', content: 'If your Space breaks, it’s usually because a library wasn’t listed in requirements.txt, a version mismatch happened, an API key wasn’t set correctly, or the app crashes due to a Python error.' },

            { type: 'heading', content: 'What “Gradio” is (because you’ll see it constantly)' },
            { type: 'paragraph', content: 'Most Spaces like yours use Gradio, which is a Python library that makes instant web UIs. Meaning: you don’t write HTML/CSS for a basic app. You write Python like: define inputs (textbox, file upload), define outputs (text, charts, images), define what function runs. Then Gradio generates the website automatically. So: Gradio = the UI engine.' },

            { type: 'heading', content: 'Step-by-step: creating the Space and pasting the files' },
            {
              type: 'list', content: [
                '1) Create a Space: Go to Hugging Face → Spaces → Create new Space. Choose SDK: Gradio. Visibility: Public or Private (either works). Give it a name.',
                '2) Open the file editor: You’ll see a repo-like file view (like GitHub in a browser).',
                '3) Paste app.py: Create or open app.py. Paste the provided code exactly. Save / Commit.',
                '4) Paste requirements.txt: Create or open requirements.txt. Paste the required packages exactly. Save / Commit.',
                '5) Watch it build: There will be a build log. It will show installing dependencies, starting the app, and errors if anything fails. When it finishes, your Space has a live URL and a running UI.'
              ]
            },

            { type: 'heading', content: 'The one thing that confuses beginners: API keys' },
            { type: 'paragraph', content: 'If your app calls OpenAI / Google / etc., it needs a secret key. You do not paste keys inside app.py. Instead: Space Settings → Secrets. Add something like: OPENAI_API_KEY = your_key_here or GOOGLE_API_KEY = your_key_here. Then in code, it reads from environment variables. This is safer and the normal professional method.' },

            { type: 'heading', content: 'How to know it’s working' },
            {
              type: 'list', content: [
                'You’ll know it’s working if: the build finishes successfully, the Space shows a UI, buttons produce outputs, logs show no crashes.',
                'You’ll know what’s wrong if: build log shows “ModuleNotFoundError” → missing dependency in requirements, build log shows “KeyError / missing env var” → secret not set, the UI loads but outputs are blank → code error or API error.'
              ]
            },

            { type: 'heading', content: 'What you get when it works (why this matters)' },
            { type: 'paragraph', content: 'Once your Space runs, you have: a shareable live app link, a hosted demo you can embed in your ecosystem, a repeatable template for future modules, and a deploy pipeline learners can actually understand. This is how ZEN turns curriculum into real artifacts: learn → deploy → share → credential.' },

            { type: 'heading', content: 'app.py' },
            {
              type: 'code', language: 'python', content: `import os
from typing import List, Dict, Any, Tuple, Optional

import requests
import gradio as gr
from openai import OpenAI

# Firecrawl SDK (used for scraping URLs into markdown)
try:
    from firecrawl import Firecrawl
except ImportError:
    Firecrawl = None  # handled gracefully below

# -------------------- CONFIG --------------------

CHAT_MODEL = "gpt-5"  # main chat model

DEFAULT_SYSTEM_PROMPT = """You are a Retrieval-Augmented Generation (RAG) assistant.

Rules:
- Answer ONLY using the provided knowledge base context and system instructions.
- If the answer is not clearly supported by the context, say "I don’t know based on the current knowledge base."
- Do not invent sources, statistics, or facts that are not present in the context.
- When applicable, cite which source you used (e.g., "According to the uploaded file" or "Based on zenai.world").
- Be clear, concise, and structured.
"""

PRESET_CONFIGS = {
    "None (manual setup)": {
        "system": DEFAULT_SYSTEM_PROMPT,
        "urls": "",
        "text": "",
    },
    "ZEN Sites Deep QA (zenai.world + AI Arena)": {
        "system": DEFAULT_SYSTEM_PROMPT
        + "\\n\\nYou specialize in answering questions about ZEN AI’s mission, programs, AI Pioneer, and ZEN AI Arena.",
        "urls": "https://zenai.world\\nhttps://us.zenai.biz",
        "text": (
            "ZEN AI is building the first global AI × Web3 literacy and automation movement, "
            "with youth, homeschool, and professional tracks and blockchain-verified credentials."
        ),
    },
    "AI Policy & Governance Starter": {
        "system": DEFAULT_SYSTEM_PROMPT
        + "\\n\\nYou act as a neutral policy explainer. Summarize clearly, highlight key risks, opportunities, and practical implications.",
        "urls": "https://oecd.ai/en/ai-principles",
        "text": "Use this preset for high-level AI policy, governance, and principles exploration.",
    },
    "Research Notebook / Personal RAG Sandbox": {
        "system": DEFAULT_SYSTEM_PROMPT
        + "\\n\\nYou help the user explore, connect, and synthesize insights from their personal notes and documents.",
        "urls": "",
        "text": "Use this as a sandbox for notebooks, transcripts, and long-form notes.",
    },
}

# -------------------- TEXT HELPERS --------------------


def chunk_text(text: str, max_chars: int = 2000, overlap: int = 200) -> List[str]:
    """Simple character-based chunking with overlap."""
    text = (text or "").strip()
    if not text:
        return []
    chunks = []
    start = 0
    length = len(text)
    while start < length:
        end = min(start + max_chars, length)
        chunk = text[start:end]
        chunks.append(chunk)
        if end >= length:
            break
        start = max(0, end - overlap)
    return chunks


def tokenize(text: str) -> List[str]:
    """Very simple tokenizer: lowercase, keep alphanumerics, split on spaces."""
    cleaned = []
    for ch in text.lower():
        if ch.isalnum():
            cleaned.append(ch)
        else:
            cleaned.append(" ")
    return [tok for tok in "".join(cleaned).split() if tok]


# -------------------- DATA SOURCE HELPERS --------------------


def fetch_url_text(url: str) -> str:
    """Fallback: fetch text from a URL via simple HTTP."""
    try:
        resp = requests.get(url, timeout=12)
        resp.raise_for_status()
        text = resp.text

        # crude HTML stripping: cut off at first script/style and remove angle brackets
        for tag in ["<script", "<style"]:
            if tag in text:
                text = text.split(tag)[0]

        text = text.replace("<", " ").replace(">", " ")
        return text
    except Exception as e:
        return f"[Error fetching {url}: {e}]"


def read_file_text(path: str) -> str:
    """Read text from simple text-based files; skip others safely."""
    if not path:
        return ""
    path_lower = path.lower()
    try:
        if any(path_lower.endswith(ext) for ext in [".txt", ".md", ".csv", ".json"]):
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        return f"[Unsupported file type for RAG content: {os.path.basename(path)}]"
    except Exception as e:
        return f"[Error reading file {os.path.basename(path)}: {e}]"


# -------------------- FIRECRAWL HELPERS --------------------


def extract_markdown_from_firecrawl_result(result: Any) -> str:
    """
    Firecrawl scrape(...) can return Document-like objects or dicts.
    We try to collect all markdown text into one big string.
    """
    texts: List[str] = []

    def _collect(obj: Any):
        if obj is None:
            return

        # Document-like object with attribute markdown
        md = getattr(obj, "markdown", None)
        if isinstance(md, str) and md.strip():
            texts.append(md)
            return

        # Dict-shaped
        if isinstance(obj, dict):
            if isinstance(obj.get("markdown"), str):
                texts.append(obj["markdown"])
            data = obj.get("data")
            if data is not None:
                _collect(data)
            return

        # Iterable (list/tuple of docs)
        if isinstance(obj, (list, tuple)):
            for item in obj:
                _collect(item)
            return

    _collect(result)
    if texts:
        return "\\n\\n".join(texts)
    # Fallback: string representation if nothing else worked
    return str(result)


def firecrawl_scrape_url(firecrawl_api_key: str, url: str) -> str:
    """
    Use Firecrawl to scrape a single URL and return markdown.
    This is intentionally *not* a full crawl to keep it fast.
    """
    firecrawl_api_key = (firecrawl_api_key or "").strip()
    if not firecrawl_api_key:
        return "[Firecrawl error: no Firecrawl API key provided.]"

    if Firecrawl is None:
        return "[Firecrawl error: firecrawl-py is not installed. Add it to requirements.txt.]"

    try:
        fc = Firecrawl(api_key=firecrawl_api_key)
        # Fast single-page scrape → markdown suitable for RAG
        doc = fc.scrape(url, formats=["markdown"])
        markdown = extract_markdown_from_firecrawl_result(doc)
        return markdown
    except Exception as e:
        return f"[Firecrawl error for {url}: {e}]"


# -------------------- LOCAL KB BUILD (NO OPENAI EMBEDDINGS) --------------------


def build_local_kb(docs: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], str]:
    """
    Build a local KB with lexical features only (no OpenAI embeddings).
    Each KB entry: {id, source, text, tokens}
    """
    kb_chunks: List[Dict[str, Any]] = []
    total_chunks = 0

    for d in docs:
        source = d.get("source", "unknown")
        text = d.get("text", "")
        chunks = chunk_text(text, max_chars=2000, overlap=200)

        for idx, ch in enumerate(chunks):
            tokens = tokenize(ch)
            kb_chunks.append(
                {
                    "id": f"{source}_{idx}",
                    "source": source,
                    "text": ch,
                    "tokens": tokens,
                }
            )
            total_chunks += 1

    status = f"✅ Knowledge base built with {len(docs)} documents and {total_chunks} chunks (lexical retrieval)."
    return kb_chunks, status


def retrieve_context_local(
    kb: List[Dict[str, Any]],
    query: str,
    top_k: int = 5,
) -> Tuple[str, str]:
    """
    Retrieve top-k relevant chunks from KB for the query using simple lexical matching:
    score = number of overlapping tokens between query and chunk.
    """
    if not kb:
        return "", "ℹ️ No knowledge base yet. The model will answer from instructions only."

    q_tokens = tokenize(query)
    if not q_tokens:
        return "", "ℹ️ Query has no meaningful tokens; answering from instructions only."

    q_set = set(q_tokens)

    scored: List[Tuple[int, Dict[str, Any]]] = []
    for d in kb:
        tokens = d.get("tokens") or []
        if not tokens:
            continue
        t_set = set(tokens)
        overlap = len(q_set & t_set)
        if overlap > 0:
            scored.append((overlap, d))

    if not scored:
        return "", "ℹ️ No lexical overlap with knowledge base; answering from instructions only."

    scored.sort(key=lambda x: x[0], reverse=True)
    top = [d for (score, d) in scored[:top_k]]

    context_parts = []
    for idx, d in enumerate(top, start=1):
        src = d.get("source", "unknown")
        txt = d.get("text", "")
        context_parts.append(
            f"[Chunk {idx} | Source: {src}]\\n{txt}\\n"
        )

    context = "\\n\\n---\\n\\n".join(context_parts)
    debug = f"📚 Retrieved {len(top)} chunks from KB via lexical retrieval (no embeddings)."
    return context, debug


# -------------------- GRADIO CALLBACKS --------------------


def save_api_key(api_key: str):
    api_key = (api_key or "").strip()
    if not api_key:
        return "❌ No API key provided.", ""
    masked = f"{api_key[:4]}...{api_key[-4:]}" if len(api_key) >= 8 else "******"
    status = f"✅ OpenAI key saved for this session: \`{masked}\`"
    return status, api_key


def save_firecrawl_key(fc_key: str):
    fc_key = (fc_key or "").strip()
    if not fc_key:
        return "⚠️ No Firecrawl API key provided.", ""
    masked = f"{fc_key[:3]}...{fc_key[-4:]}" if len(fc_key) >= 8 else "******"
    status = f"✅ Firecrawl key saved for this session: \`{masked}\`"
    return status, fc_key


def apply_preset(preset_name: str):
    cfg = PRESET_CONFIGS.get(preset_name) or PRESET_CONFIGS["None (manual setup)"]
    return cfg["system"], cfg["urls"], cfg["text"]


def build_knowledge_base(
    api_key: str,
    firecrawl_api_key: str,
    urls_text: str,
    raw_text: str,
    file_paths: Optional[List[str]],
):
    """
    Build knowledge base using:
    - Firecrawl scrape for URLs (if Firecrawl key provided and SDK available)
    - Fallback to simple HTTP fetch if Firecrawl not available
    - Raw text
    - Files

    Note: api_key is kept in the signature for symmetry and potential future use,
    but not required for lexical-only indexing.
    """
    api_key = (api_key or "").strip()
    if not api_key:
        return "❌ Please save your OpenAI API key first.", []

    firecrawl_api_key = (firecrawl_api_key or "").strip()

    docs: List[Dict[str, Any]] = []

    # URLs
    urls = [u.strip() for u in (urls_text or "").splitlines() if u.strip()]
    for u in urls:
        text_from_url = ""
        if firecrawl_api_key:
            # Try Firecrawl first (single-page scrape)
            fc_text = firecrawl_scrape_url(firecrawl_api_key, u)
            if not fc_text.startswith("[Firecrawl error"):
                text_from_url = fc_text
            else:
                # Firecrawl failed; fallback to simple fetch
                text_from_url = fetch_url_text(u)
        else:
            # No Firecrawl key → simple fetch
            text_from_url = fetch_url_text(u)

        docs.append({"source": u, "text": text_from_url})

    # Raw text
    if raw_text and raw_text.strip():
        docs.append({"source": "Raw Text Block", "text": raw_text})

    # Files
    if file_paths:
        for p in file_paths:
            if not p:
                continue
            txt = read_file_text(p)
            src_name = os.path.basename(p)
            docs.append({"source": f"File: {src_name}", "text": txt})

    if not docs:
        return "⚠️ No knowledge sources provided (URLs, text, or files).", []

    kb, status = build_local_kb(docs)
    return status, kb


def extract_text_from_response(resp: Any) -> str:
    """
    Extract plain text from the Responses API result.
    We assume structure like:
        resp.output -> list of output items
        each item.content -> list of content parts with .text or ['text']
    """
    if resp is None:
        return ""

    texts: List[str] = []

    # New Responses API usually has resp.output
    output = getattr(resp, "output", None) or getattr(resp, "data", None)
    if output is None:
        # Fallback to just stringifying
        return str(resp)

    if not isinstance(output, (list, tuple)):
        output = [output]

    for item in output:
        content = getattr(item, "content", None)
        if content is None and isinstance(item, dict):
            content = item.get("content")
        if content is None:
            continue

        if not isinstance(content, (list, tuple)):
            content = [content]

        for part in content:
            # Part might be object with .text
            txt = getattr(part, "text", None)
            if isinstance(txt, str) and txt.strip():
                texts.append(txt)
                continue

            # Or dict-like
            if isinstance(part, dict):
                t = part.get("text")
                if isinstance(t, str) and t.strip():
                    texts.append(t)
                    continue

            # Fallback, stringify
            texts.append(str(part))

    return "\\n".join(texts).strip()


def chat_with_rag(
    user_message: str,
    api_key: str,
    kb: List[Dict[str, Any]],
    system_prompt: str,
    history_pairs: List[List[str]],
):
    """
    history_pairs: list of [user_str, assistant_str] pairs for the UI Chatbot.
    We'll rebuild conversation history for the Responses API each time.
    """
    user_message = (user_message or "").strip()
    api_key = (api_key or "").strip()
    system_prompt = (system_prompt or "").strip()

    if not user_message:
        return history_pairs, history_pairs, "❌ Please enter a question."

    if not api_key:
        return history_pairs, history_pairs, "❌ Please save your OpenAI API key first."

    if not system_prompt:
        system_prompt = DEFAULT_SYSTEM_PROMPT

    # Retrieve context from KB (local lexical retrieval)
    context, debug_retrieval = retrieve_context_local(kb, user_message)

    client = OpenAI(api_key=api_key)

    # Build input for Responses API
    input_messages: List[Dict[str, Any]] = []

    combined_system = (
        DEFAULT_SYSTEM_PROMPT.strip()
        + "\\n\\n---\\n\\nUser System Instructions:\\n"
        + system_prompt.strip()
    )
    input_messages.append(
        {
            "role": "system",
            "content": [{"type": "input_text", "text": combined_system}],
        }
    )

    if context:
        context_block = (
            "You have access to the following knowledge base context.\\n"
            "You MUST base your answer ONLY on this context and the system instructions.\\n"
            "If the answer is not supported by the context, say you don’t know.\\n\\n"
            f"{context}"
        )
        input_messages.append(
            {
                "role": "system",
                "content": [{"type": "input_text", "text": context_block}],
            }
        )

    # Rebuild conversation history from pairs (last few turns)
    recent_pairs = history_pairs[-5:] if history_pairs else []
    for u, a in recent_pairs:
        input_messages.append(
            {
                "role": "user",
                "content": [{"type": "input_text", "text": u}],
            }
        )
        input_messages.append(
            {
                "role": "assistant",
                "content": [{"type": "output_text", "text": a}],
            }
        )

    # Current user message
    input_messages.append(
        {
            "role": "user",
            "content": [{"type": "input_text", "text": user_message}],
        }
    )

    # Call OpenAI GPT-5 via Responses API
    try:
        resp = client.responses.create(
            model=CHAT_MODEL,
            input=input_messages,
            # no temperature, no token params -> avoid unsupported parameter errors
        )
        answer = extract_text_from_response(resp)
        if not answer.strip():
            answer = "⚠️ Model returned an empty response object. This may be an API issue."
    except Exception as e:
        answer = f"⚠️ OpenAI API error: {e}"

    # Update UI history as list of [user, assistant] pairs
    new_history = history_pairs + [[user_message, answer]]

    return new_history, new_history, debug_retrieval


def clear_chat():
    return [], [], "Chat cleared."


# -------------------- UI LAYOUT --------------------

with gr.Blocks(title="RAG Chatbot — GPT-5 + URLs / Files / Text + Firecrawl") as demo:
    gr.Markdown(
        """
# 🔍 RAG Chatbot — GPT-5 + URLs / Files / Text + Firecrawl

1. Enter your **OpenAI API key** and click **Save**.  
2. (Optional) Enter your **Firecrawl API key** and save it.  
3. Choose a preset (e.g. **ZEN Sites Deep QA**) — this auto-loads URLs like \`https://zenai.world\`.  
4. Click **Grab / Retrieve Knowledge (Firecrawl + Lexical Index)** to scrape URLs + index everything.  
5. Ask questions — the bot will answer **only** from your knowledge and system instructions.
"""
    )

    api_key_state = gr.State("")
    firecrawl_key_state = gr.State("")
    kb_state = gr.State([])
    chat_state = gr.State([])  # list of [user, assistant] pairs

    # default preset on load -> ZEN
    default_preset_name = "ZEN Sites Deep QA (zenai.world + AI Arena)"
    default_preset_cfg = PRESET_CONFIGS[default_preset_name]

    with gr.Row():
        with gr.Column(scale=1):
            gr.Markdown("### 🔑 API & System")

            api_key_box = gr.Textbox(
                label="OpenAI API Key",
                placeholder="sk-...",
                type="password",
            )
            save_api_btn = gr.Button("Save OpenAI API Key", variant="primary")
            save_status = gr.Markdown("OpenAI API key not set.")

            firecrawl_key_box = gr.Textbox(
                label="Firecrawl API Key (optional)",
                placeholder="fc-...",
                type="password",
            )
            save_firecrawl_btn = gr.Button("Save Firecrawl Key")
            firecrawl_status = gr.Markdown(
                "Firecrawl key not set (will fall back to simple URL fetch)."
            )

            preset_dropdown = gr.Dropdown(
                label="Presets",
                choices=list(PRESET_CONFIGS.keys()),
                value=default_preset_name,
            )

            system_box = gr.Textbox(
                label="System Instructions",
                lines=8,
                value=default_preset_cfg["system"],
            )

            gr.Markdown("### 📚 Knowledge Sources")

            urls_box = gr.Textbox(
                label="Knowledge URLs (one per line)",
                lines=4,
                value=default_preset_cfg["urls"],
                placeholder="https://zenai.world\\nhttps://us.zenai.biz",
            )

            raw_text_box = gr.Textbox(
                label="Additional Knowledge Text",
                lines=6,
                value=default_preset_cfg["text"],
                placeholder="Paste any notes, docs, or reference text here...",
            )

            files_input = gr.File(
                label="Upload Knowledge Files (.txt, .md, .csv, .json)",
                file_count="multiple",
                type="filepath",
            )

            grab_kb_btn = gr.Button(
                "Grab / Retrieve Knowledge (Firecrawl + Lexical Index)",
                variant="secondary",
            )
            kb_status_md = gr.Markdown("ℹ️ No knowledge base built yet.")

        with gr.Column(scale=2):
            gr.Markdown("### 💬 RAG Chat")

            # Classic Chatbot format: list of [user, assistant] pairs
            chatbot = gr.Chatbot(
                label="RAG Chatbot (GPT-5)",
                height=450,
            )

            user_input = gr.Textbox(
                label="Ask a question",
                lines=3,
                placeholder="Ask about zenai.world, AI Arena, or your uploaded docs...",
            )

            with gr.Row():
                send_btn = gr.Button("Send", variant="primary")
                clear_btn = gr.Button("Clear Chat")

            debug_md = gr.Markdown(
                "ℹ️ Retrieval debug info will appear here after each answer."
            )

    # Wiring: save OpenAI API key
    save_api_btn.click(
        fn=save_api_key,
        inputs=[api_key_box],
        outputs=[save_status, api_key_state],
    )

    # Wiring: save Firecrawl API key
    save_firecrawl_btn.click(
        fn=save_firecrawl_key,
        inputs=[firecrawl_key_box],
        outputs=[firecrawl_status, firecrawl_key_state],
    )

    # Wiring: presets
    preset_dropdown.change(
        fn=apply_preset,
        inputs=[preset_dropdown],
        outputs=[system_box, urls_box, raw_text_box],
    )

    # Wiring: build knowledge base (Firecrawl + lexical index)
    grab_kb_btn.click(
        fn=build_knowledge_base,
        inputs=[api_key_state, firecrawl_key_state, urls_box, raw_text_box, files_input],
        outputs=[kb_status_md, kb_state],
    )

    # Wiring: chat send (button)
    send_btn.click(
        fn=chat_with_rag,
        inputs=[user_input, api_key_state, kb_state, system_box, chat_state],
        outputs=[chatbot, chat_state, debug_md],
    )

    # Wiring: chat send (Enter key)
    user_input.submit(
        fn=chat_with_rag,
        inputs=[user_input, api_key_state, kb_state, system_box, chat_state],
        outputs=[chatbot, chat_state, debug_md],
    )

    # Wiring: clear chat
    clear_btn.click(
        fn=clear_chat,
        inputs=[],
        outputs=[chatbot, chat_state, debug_md],
    )

if __name__ == "__main__":
    demo.launch()
` },
            { type: 'heading', content: 'requirements.txt' },
            { type: 'code', language: 'bash', content: `gradio==5.49.1\nopenai>=1.50.0\nrequests>=2.31.0\ntiktoken>=0.7.0\nfirecrawl-py>=4.6.0` },
            { type: 'interactive', component: 'FuelOrbs', interactiveId: 'fuel-orbs-1', content: '' }
          ]
        }
      ]
    },
    {
      id: 'deliverables',
      title: 'Learner Deliverables',
      content: [{ type: 'list', content: ['Agent Blueprints', 'Governance Policy Report', 'Energy Dashboard', 'Demo Video', 'Reflection Essay'] }]
    },
    {
      id: 'outcome',
      title: 'Outcome',
      content: [{ type: 'list', content: ['Build autonomous systems', 'Govern with ethics', 'Optimize cost', 'Earn ZEN VANGUARD credential'] }]
    }
  ],
};
