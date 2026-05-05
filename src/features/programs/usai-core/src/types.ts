// Content types for curriculum sections
export type ContentItemType =
    | 'paragraph'
    | 'list'
    | 'code'
    | 'terminal'
    | 'mermaid'
    | 'interactive'
    | 'heading'
    | 'quote'
    | 'image' | 'video';

// All interactive component types from all modules
export type InteractiveComponentType =
    | 'AdversarialAttackSimulator'
    | 'AgentSystemDesigner'
    | 'AgenticWorkflowViz'
    | 'AiAlignmentTuner'
    | 'AiEthicsTracker'
    | 'AiPaletteSynthesizer'
    | 'AiSystemVisualizer'
    | 'AlgorithmVisualizer'
    | 'AmbientArchitect'
    | 'ApiKeyChatSimulator'
    | 'ArchitectureBuilderSandbox'
    | 'AudioVisualSyncLab'
    | 'BeginnerImageGen'
    | 'BenefitSorter'
    | 'BlockchainExplorer'
    | 'BusinessModelCanvas'
    | 'CinematicPromptSequencer'
    | 'CodeDebugger'
    | 'CompositorCanvasPro'
    | 'ContextWindowExplorer'
    | 'CourseConceptMatrix'
    | 'DataDecisionFlowchartBuilder'
    | 'DataVisualizer'
    | 'DiffusionFieldExplorer'
    | 'DockerCommandQuiz'
    | 'DreamspaceConstructor'
    | 'EmotionBlendMixer'
    | 'EnergyCarbonTracker'
    | 'EthicalBiasMirror'
    | 'EthicalDilemmaSimulator'
    | 'EthicalStyleInspector'
    | 'ExplainabilityPanel'
    | 'FeatureExplorer'
    | 'FundingPulseTicker'
    | 'FutureScenarioPoll'
    | 'GenerativeSculptor3D'
    | 'GestureAnimator'
    | 'HeroIntro'
    | 'HomeschoolKitRoadmap'
    | 'ImagePromptEnhancer'
    | 'InteractiveChatbot'
    | 'InteractiveDebates'
    | 'JobImpactSimulator'
    | 'LangGraphVisualizer'
    | 'LightingPhysicsLab'
    | 'LivePatentRadar'
    | 'LogicVsAi'
    | 'LossLandscapeNavigator'
    | 'MeetingSummarizer'
    | 'MelodyMakerAI'
    | 'MemoryDecayLab'
    | 'ModelArmsRaceTimeline'
    | 'ModelExplorer'
    | 'MotionPhysicsPlayground'
    | 'MultiAgentChatSandbox'
    | 'NeuralEvolutionChronicle'
    | 'NeuralNetworkPlayground'
    | 'ParadigmShiftExplorer'
    | 'ParameterUniverseExplorer'
    | 'PatternGenomeSynthesizer'
    | 'PedagogyMatcher'
    | 'PersonalizationSimulator'
    | 'PhysicsPainter'
    | 'PitchBuilder'
    | 'PoeticFusionGenerator'
    | 'PrivacyLensDashboard'
    | 'ProbabilitySelector'
    | 'ProfessionalEmailWriter'
    | 'PromptArchitectWorkbench'
    | 'PromptInjectionGame'
    | 'PromptMutationStudio'
    | 'RagBuilder'
    | 'RlhfTrainerGame'
    | 'RobotSimulator'
    | 'SceneDirectorXR'
    | 'SchedulePlanner'
    | 'SdgMatcher'
    | 'SensorDataInterpreter'
    | 'SimplePredictiveModel'
    | 'SmartContractEventListener'
    | 'SoundfieldComposer'
    | 'SpatialNarrativeEngine'
    | 'SpeechEmotionAnalyzer'
    | 'StoryboardForgePlus'
    | 'TextToAppGenerator'
    | 'TextureAlchemyLab'
    | 'TokenEconomySimulator'
    | 'TokenVisualizer'
    | 'UiFeedback'
    | 'VoiceDrivenEditingDesk'
    | 'VoiceMorphStudio'
    | 'HeroIntroMod2'
    | 'HeroIntroMod3'
    | 'HeroIntroMod4'
    | 'AiSystemsBlueprintVisualizer'
    | 'SkytowerArchitect'
    | 'PromptHealthDashboard'
    | 'SectionRenderer' // Not interactive but sometimes used in maps?
    | 'LiveOpsConsole' // Alias for FundingPulseTicker if needed
    | 'BreachDrillSimulator' // Alias
    | 'AccessVisualizer' // Alias
    | 'SLACommander' // Alias
    | 'PostMortemGenerator' // Alias
    | 'ReviewerQueueSim' // Alias
    | 'FeedbackLoopTrainer' // Alias
    | 'InsightComposer' // Alias
    | 'InsightSorter'
    // Module 3 New Components
    | 'CognitiveBiasDetector'
    | 'DecisionFatigueMeter'
    | 'DecisionMatrixCalculator'
    | 'DigitalJanitorLab'
    | 'ExecutiveBriefBuilder'
    | 'FactCheckerSimulator'
    | 'KnowledgeGraphBuilder'
    | 'ResearchAssistantWorkflow'
    | 'ScenarioSimulator'
    // Premium Widgets
    | 'FactOfTheDay'
    | 'AIPuzzle'
    | 'SectionQuiz'
    // Module 1 New Components (Curriculum Overhaul)
    | 'VocabularyLockIn'
    | 'MasteryCheckGate'
    | 'TemperaturePlayground'
    | 'TokenReceiptPrinter'
    | 'JsonSurgeon'
    | 'MiniAgentSimulator'
    | 'SemanticSearchLab'
    | 'ApproachDecisionTree'
    | 'RedTeamBot'
    | 'PromptUnitTester'
    | 'ModelPickerLab'
    | 'CredentialMintPreview'
    | 'ProjectSubmission'
    | 'DataDriftRiskLens'
    | 'OrbitalHabitatDesigner'
    | 'AiGovernanceCardGenerator'
    | 'MemoryRecallTuner';

export interface ContentItem {
    type: ContentItemType;
    content: string | string[];
    language?: 'python' | 'solidity' | 'bash' | 'javascript' | 'plaintext' | 'json' | 'markdown' | 'text';
    output?: string;
    component?: InteractiveComponentType;
    effectId?: string;
    onRunCustomEffect?: () => void;
    interactiveId?: string;
    alt?: string;
}

export interface Section {
    id: string;
    title: string;
    icon?: string;
    content: ContentItem[];
    subSections?: Section[];
}

export interface Curriculum {
    title: string;
    summaryForAI: string;
    sections: Section[];
}

// Module-specific progress tracking
export interface ModuleProgress {
    completedSections: string[];
    completedInteractives: string[];
    points: number;
    startedAt: string | null;
    completedAt: string | null;
    lastViewedSection: string;
    certificateId: string | null;
    certificateHash: string | null;
}

// Session record for analytics
export interface SessionRecord {
    startedAt: string;
    endedAt: string;
    moduleId: number;
    sectionsViewed: string[];
}

// Main user type with multi-module tracking
export interface User {
    email: string;
    name: string;
    picture?: string;
    createdAt: string;
    totalPoints: number;
    modules: {
        1: ModuleProgress;
        2: ModuleProgress;
        3: ModuleProgress;
        4: ModuleProgress;
    };
    finalCertificationId: string | null;
    finalCertificationHash: string | null;
    sessionHistory: SessionRecord[];
    progress?: ModuleProgress;
    assignments?: Assignment[];
    metadata?: unknown;
}

// Certificate types
export interface Certificate {
    id: string;
    type: 'module' | 'final';
    moduleNumber?: 1 | 2 | 3 | 4;
    userName: string;
    userEmail: string;
    issuedAt: string;
    performance: {
        sectionsCompleted: number;
        totalSections: number;
        interactivesCompleted: number;
        pointsEarned: number;
        completionPercentage: number;
    };
    sha256Hash: string;
    blockNumber: number;
    previousHash: string;
}

export interface InteractiveComponentProps {
    interactiveId: string;
}

// Module metadata
export interface ModuleInfo {
    id: 1 | 2 | 3 | 4;
    title: string;
    description: string;
    icon: string;
    totalSections: number;
    color: string;
}

// Dashboard statistics
export interface DashboardStats {
    overallProgress: number;
    totalPoints: number;
    modulesCompleted: number;
    certificatesEarned: number;
    currentStreak: number;
    totalTimeSpent: number;
}

// Admin & Analytics types
export interface Assignment {
    id: string;
    title: string;
    moduleId: number;
    dueDate?: string;
    assignedAt: string;
    completedAt?: string;
    status: 'pending' | 'in-progress' | 'completed' | 'overdue';
}

export interface Message {
    id: string;
    from: 'admin' | 'student';
    fromId: string;
    toId: string;
    subject: string;
    body: string;
    sentAt: string;
    readAt?: string;
    type: 'direct' | 'announcement' | 'reminder';
}

export interface ActivityEvent {
    id: string;
    studentId: string;
    studentName: string;
    type: 'section_complete' | 'interactive_complete' | 'login' | 'certificate_earned' | 'assignment_started' | 'quiz_passed' | 'points_earned';
    description: string;
    timestamp: string;
    moduleId?: number;
    points?: number;
}

export interface Student {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    enrolledAt: string;
    lastActive: string;
    totalPoints: number;
    moduleProgress: {
        [key: number]: ModuleProgress;
    };
    assignments: Assignment[];
    status: 'active' | 'inactive' | 'at-risk';
    sessionHistory: SessionRecord[];
}

export interface AdminStats {
    totalStudents: number;
    activeToday: number;
    averageProgress: number;
    certificatesIssued: number;
    atRiskStudents: number;
    completionRate: number;
    averageEngagementTime: string;
    weeklyGrowth: number;
    totalSectionsCompleted: number;
    totalInteractivesCompleted: number;
    totalPoints: number;
}
