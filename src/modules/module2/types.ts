
export type ContentItemType =
  | 'paragraph'
  | 'list'
  | 'code'
  | 'terminal'
  | 'mermaid'
  | 'interactive'
  | 'heading'
  | 'quote'
  | 'image';

export type InteractiveComponentType =
  | 'AdversarialAttackSimulator'
  | 'AgentCiCdPipeline'
  | 'AgentSystemDesigner'
  | 'AiAlignmentTuner'
  | 'AiEthicsTracker'
  | 'AiPaletteSynthesizer'
  | 'AlgorithmVisualizer'
  | 'AmbientArchitect'
  | 'ArchitectureBuilderSandbox'
  | 'AudioVisualSyncLab'
  | 'BenefitSorter'
  | 'BlockchainExplorer'
  | 'BusinessModelCanvas'
  | 'CapstoneAgentBuilder'
  | 'CapstoneOrgArchitect'
  | 'CinematicPromptSequencer'
  | 'CodeDebugger'
  | 'CompositorCanvasPro'
  | 'ContextWindowExplorer'
  | 'DataDecisionFlowchartBuilder'
  | 'DataVisualizer'
  | 'DecisionAuditLog'
  | 'DiffusionFieldExplorer'
  | 'DockerCommandQuiz'
  | 'DreamspaceConstructor'
  | 'EmotionBlendMixer'
  | 'EnergyCarbonTracker'
  | 'EthicalBiasMirror'
  | 'EthicalDilemmaSimulator'
  | 'EthicalStyleInspector'
  | 'EventOpsLab'
  | 'ExplainabilityPanel'
  | 'FeatureExplorer'
  | 'FuelOrbs'
  | 'FundingPulseTicker'
  | 'FutureScenarioPoll'
  | 'GenerativeSculptor3D'
  | 'GestureAnimator'
  | 'GlobalPolicyMap'
  | 'GovernanceDecisionSimulator'
  | 'HitlLab'
  | 'HitlRagSimulator'
  | 'HuggingFaceGuide'
  | 'ImagePromptEnhancer'
  | 'InteractiveChatbot'
  | 'InteractiveDebates'
  | 'JobImpactSimulator'
  | 'JurisdictionAwareRag'
  | 'LangGraphVisualizer'
  | 'LightingPhysicsLab'
  | 'LivePatentRadar'
  | 'LossLandscapeNavigator'
  | 'MeetingSummarizer'
  | 'MelodyMakerAI'
  | 'MemoryDecayLab'
  | 'MemoryVaultXR'
  | 'ModelArmsRaceTimeline'
  | 'MotionPhysicsPlayground'
  | 'MultiAgentChatSandbox'
  | 'NeuralEvolutionChronicle'
  | 'NeuroSymbolicQuantumLab'
  | 'ParameterUniverseExplorer'
  | 'PatternGenomeSynthesizer'
  | 'PedagogyMatcher'
  | 'PersonalizationSimulator'
  | 'PhysicsPainter'
  | 'PitchBuilder'
  | 'PoeticFusionGenerator'
  | 'PrivacyLensDashboard'
  | 'ProfessionalEmailWriter'
  | 'PromptArchitectWorkbench'
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
  | 'TextureAlchemyLab'
  | 'TokenEconomySimulator'
  | 'ToolCallDashboard'
  | 'TransparencyScorecard'
  | 'UiFeedback'
  | 'VideoAnalystPro'
  | 'VoiceDrivenEditingDesk'
  | 'VoiceMorphStudio'
  | 'HeroIntroMod2'
  | 'SectionQuiz';

export interface ContentItem {
  type: ContentItemType;
  content: string | string[];
  language?: 'python' | 'solidity' | 'bash' | 'javascript';
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
  content: ContentItem[];
  subSections?: Section[];
}

export interface Curriculum {
  title: string;
  summaryForAI: string;
  sections: Section[];
}

export interface User {
  email: string;
  name: string;
  picture?: string;
  points: number;
  progress: {
    completedSections: string[];
    completedInteractives: string[];
  };
}

export interface InteractiveComponentProps {
  interactiveId: string;
}
