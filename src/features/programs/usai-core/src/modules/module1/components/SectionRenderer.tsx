
import React, { Suspense } from 'react';
import type { ContentItem, Section } from '../types';
import CodeBlock from './CodeBlock';
import MermaidDiagram from './MermaidDiagram';
import SimulatedTerminal from './SimulatedTerminal';

// Lazy-load all interactive components
const AdversarialAttackSimulator = React.lazy(() => import('./interactive/AdversarialAttackSimulator'));
const AgentSystemDesigner = React.lazy(() => import('./interactive/AgentSystemDesigner'));
const AgenticWorkflowViz = React.lazy(() => import('./interactive/AgenticWorkflowViz'));
const AiAlignmentTuner = React.lazy(() => import('./interactive/AiAlignmentTuner'));
const AiEthicsTracker = React.lazy(() => import('./interactive/AiEthicsTracker'));
const AiPaletteSynthesizer = React.lazy(() => import('./interactive/AiPaletteSynthesizer'));
const AiSystemVisualizer = React.lazy(() => import('./interactive/AiSystemVisualizer'));
const AlgorithmVisualizer = React.lazy(() => import('./interactive/AlgorithmVisualizer'));
const AmbientArchitect = React.lazy(() => import('./interactive/AmbientArchitect'));
const ApiKeyChatSimulator = React.lazy(() => import('./interactive/ApiKeyChatSimulator'));
const ArchitectureBuilderSandbox = React.lazy(() => import('./interactive/ArchitectureBuilderSandbox'));
const AudioVisualSyncLab = React.lazy(() => import('./interactive/AudioVisualSyncLab'));
const BeginnerImageGen = React.lazy(() => import('./interactive/BeginnerImageGen'));
const BenefitSorter = React.lazy(() => import('./interactive/BenefitSorter'));
const BlockchainExplorer = React.lazy(() => import('./interactive/BlockchainExplorer'));
const BusinessModelCanvas = React.lazy(() => import('./interactive/BusinessModelCanvas'));
const CinematicPromptSequencer = React.lazy(() => import('./interactive/CinematicPromptSequencer'));
const CodeDebugger = React.lazy(() => import('./interactive/CodeDebugger'));
const CompositorCanvasPro = React.lazy(() => import('./interactive/CompositorCanvasPro'));
const ContextWindowExplorer = React.lazy(() => import('./interactive/ContextWindowExplorer'));
const CourseConceptMatrix = React.lazy(() => import('./interactive/CourseConceptMatrix'));
const DataDecisionFlowchartBuilder = React.lazy(() => import('./interactive/DataDecisionFlowchartBuilder'));
const DataVisualizer = React.lazy(() => import('./interactive/DataVisualizer'));
const DiffusionFieldExplorer = React.lazy(() => import('./interactive/DiffusionFieldExplorer'));
const DockerCommandQuiz = React.lazy(() => import('./interactive/DockerCommandQuiz'));
const DreamspaceConstructor = React.lazy(() => import('./interactive/DreamspaceConstructor'));
const EmotionBlendMixer = React.lazy(() => import('./interactive/EmotionBlendMixer'));
const EnergyCarbonTracker = React.lazy(() => import('./interactive/EnergyCarbonTracker'));
const EthicalBiasMirror = React.lazy(() => import('./interactive/EthicalBiasMirror'));
const EthicalDilemmaSimulator = React.lazy(() => import('./interactive/EthicalDilemmaSimulator'));
const EthicalStyleInspector = React.lazy(() => import('./interactive/EthicalStyleInspector'));
const ExplainabilityPanel = React.lazy(() => import('./interactive/ExplainabilityPanel'));
const FeatureExplorer = React.lazy(() => import('./interactive/FeatureExplorer'));
const FundingPulseTicker = React.lazy(() => import('./interactive/FundingPulseTicker'));
const FutureScenarioPoll = React.lazy(() => import('./interactive/FutureScenarioPoll'));
const GenerativeSculptor3D = React.lazy(() => import('./interactive/GenerativeSculptor3D'));
const GestureAnimator = React.lazy(() => import('./interactive/GestureAnimator'));
const HeroIntro = React.lazy(() => import('./interactive/HeroIntro'));
const HomeschoolKitRoadmap = React.lazy(() => import('./interactive/HomeschoolKitRoadmap'));
const ImagePromptEnhancer = React.lazy(() => import('./interactive/ImagePromptEnhancer'));
const InteractiveChatbot = React.lazy(() => import('./interactive/InteractiveChatbot'));
const InteractiveDebates = React.lazy(() => import('./interactive/InteractiveDebates'));
const JobImpactSimulator = React.lazy(() => import('./interactive/JobImpactSimulator'));
const LangGraphVisualizer = React.lazy(() => import('./interactive/LangGraphVisualizer'));
const LightingPhysicsLab = React.lazy(() => import('./interactive/LightingPhysicsLab'));
const LivePatentRadar = React.lazy(() => import('./interactive/LivePatentRadar'));
const LossLandscapeNavigator = React.lazy(() => import('./interactive/LossLandscapeNavigator'));
const MeetingSummarizer = React.lazy(() => import('./interactive/MeetingSummarizer'));
const MelodyMakerAI = React.lazy(() => import('./interactive/MelodyMakerAI'));
const MemoryDecayLab = React.lazy(() => import('./interactive/MemoryDecayLab'));
const ModelArmsRaceTimeline = React.lazy(() => import('./interactive/ModelArmsRaceTimeline'));
const ModelExplorer = React.lazy(() => import('./interactive/ModelExplorer'));
const MotionPhysicsPlayground = React.lazy(() => import('./interactive/MotionPhysicsPlayground'));
const MultiAgentChatSandbox = React.lazy(() => import('./interactive/MultiAgentChatSandbox'));
const NeuralEvolutionChronicle = React.lazy(() => import('./interactive/NeuralEvolutionChronicle'));
const NeuralNetworkPlayground = React.lazy(() => import('./interactive/NeuralNetworkPlayground'));
const ParadigmShiftExplorer = React.lazy(() => import('./interactive/ParadigmShiftExplorer'));
const ParameterUniverseExplorer = React.lazy(() => import('./interactive/ParameterUniverseExplorer'));
const PatternGenomeSynthesizer = React.lazy(() => import('./interactive/PatternGenomeSynthesizer'));
const PedagogyMatcher = React.lazy(() => import('./interactive/PedagogyMatcher'));
const PersonalizationSimulator = React.lazy(() => import('./interactive/PersonalizationSimulator'));
const PhysicsPainter = React.lazy(() => import('./interactive/PhysicsPainter'));
const PitchBuilder = React.lazy(() => import('./interactive/PitchBuilder'));
const PoeticFusionGenerator = React.lazy(() => import('./interactive/PoeticFusionGenerator'));
const PrivacyLensDashboard = React.lazy(() => import('./interactive/PrivacyLensDashboard'));
const ProbabilitySelector = React.lazy(() => import('./interactive/ProbabilitySelector'));
const ProfessionalEmailWriter = React.lazy(() => import('./interactive/ProfessionalEmailWriter'));
const PromptArchitectWorkbench = React.lazy(() => import('./interactive/PromptArchitectWorkbench'));
const PromptInjectionGame = React.lazy(() => import('./interactive/PromptInjectionGame'));
const PromptMutationStudio = React.lazy(() => import('./interactive/PromptMutationStudio'));
const RagBuilder = React.lazy(() => import('./interactive/RagBuilder'));
const RlhfTrainerGame = React.lazy(() => import('./interactive/RlhfTrainerGame'));
const RobotSimulator = React.lazy(() => import('./interactive/RobotSimulator'));
const SceneDirectorXR = React.lazy(() => import('./interactive/SceneDirectorXR'));
const SchedulePlanner = React.lazy(() => import('./interactive/SchedulePlanner'));
const SdgMatcher = React.lazy(() => import('./interactive/SdgMatcher'));
const SensorDataInterpreter = React.lazy(() => import('./interactive/SensorDataInterpreter'));
const SimplePredictiveModel = React.lazy(() => import('./interactive/SimplePredictiveModel'));
const SmartContractEventListener = React.lazy(() => import('./interactive/SmartContractEventListener'));
const SoundfieldComposer = React.lazy(() => import('./interactive/SoundfieldComposer'));
const SpatialNarrativeEngine = React.lazy(() => import('./interactive/SpatialNarrativeEngine'));
const SpeechEmotionAnalyzer = React.lazy(() => import('./interactive/SpeechEmotionAnalyzer'));
const StoryboardForgePlus = React.lazy(() => import('./interactive/StoryboardForgePlus'));
const TextToAppGenerator = React.lazy(() => import('./interactive/TextToAppGenerator'));
const TextureAlchemyLab = React.lazy(() => import('./interactive/TextureAlchemyLab'));
const TokenEconomySimulator = React.lazy(() => import('./interactive/TokenEconomySimulator'));
const TokenVisualizer = React.lazy(() => import('./interactive/TokenVisualizer'));
const UiFeedback = React.lazy(() => import('./interactive/UiFeedback'));
const VoiceDrivenEditingDesk = React.lazy(() => import('./interactive/VoiceDrivenEditingDesk'));
const VoiceMorphStudio = React.lazy(() => import('./interactive/VoiceMorphStudio'));
const SectionQuiz = React.lazy(() => import('./interactive/SectionQuiz'));
const VocabularyLockIn = React.lazy(() => import('./interactive/VocabularyLockIn'));
const MasteryCheckGate = React.lazy(() => import('./interactive/MasteryCheckGate'));
const TemperaturePlayground = React.lazy(() => import('./interactive/TemperaturePlayground'));
const TokenReceiptPrinter = React.lazy(() => import('./interactive/TokenReceiptPrinter'));
const JsonSurgeon = React.lazy(() => import('./interactive/JsonSurgeon'));
const MiniAgentSimulator = React.lazy(() => import('./interactive/MiniAgentSimulator'));
const SemanticSearchLab = React.lazy(() => import('./interactive/SemanticSearchLab'));
const ApproachDecisionTree = React.lazy(() => import('./interactive/ApproachDecisionTree'));
const RedTeamBot = React.lazy(() => import('./interactive/RedTeamBot'));
const PromptUnitTester = React.lazy(() => import('./interactive/PromptUnitTester'));
const ModelPickerLab = React.lazy(() => import('./interactive/ModelPickerLab'));
const CredentialMintPreview = React.lazy(() => import('./interactive/CredentialMintPreview'));

const componentMap: { [key: string]: React.LazyExoticComponent<React.FC<any>> } = {
    AdversarialAttackSimulator,
    AgentSystemDesigner,
    AgenticWorkflowViz,
    AiAlignmentTuner,
    AiEthicsTracker,
    AiPaletteSynthesizer,
    AiSystemVisualizer,
    AlgorithmVisualizer,
    AmbientArchitect,
    ApiKeyChatSimulator,
    ArchitectureBuilderSandbox,
    AudioVisualSyncLab,
    BeginnerImageGen,
    BenefitSorter,
    BlockchainExplorer,
    BusinessModelCanvas,
    CinematicPromptSequencer,
    CodeDebugger,
    CompositorCanvasPro,
    SectionQuiz,
    ContextWindowExplorer,
    CourseConceptMatrix,
    DataDecisionFlowchartBuilder,
    DataVisualizer,
    DiffusionFieldExplorer,
    DockerCommandQuiz,
    DreamspaceConstructor,
    EmotionBlendMixer,
    EnergyCarbonTracker,
    EthicalBiasMirror,
    EthicalDilemmaSimulator,
    EthicalStyleInspector,
    ExplainabilityPanel,
    FeatureExplorer,
    FundingPulseTicker,
    FutureScenarioPoll,
    GenerativeSculptor3D,
    GestureAnimator,
    HeroIntro,
    HomeschoolKitRoadmap,
    ImagePromptEnhancer,
    InteractiveChatbot,
    InteractiveDebates,
    JobImpactSimulator,
    LangGraphVisualizer,
    LightingPhysicsLab,
    LivePatentRadar,
    LossLandscapeNavigator,
    MeetingSummarizer,
    MelodyMakerAI,
    MemoryDecayLab,
    ModelArmsRaceTimeline,
    ModelExplorer,
    MotionPhysicsPlayground,
    MultiAgentChatSandbox,
    NeuralEvolutionChronicle,
    NeuralNetworkPlayground,
    ParadigmShiftExplorer,
    ParameterUniverseExplorer,
    PatternGenomeSynthesizer,
    PedagogyMatcher,
    PersonalizationSimulator,
    PhysicsPainter,
    PitchBuilder,
    PoeticFusionGenerator,
    PrivacyLensDashboard,
    ProbabilitySelector,
    ProfessionalEmailWriter,
    PromptArchitectWorkbench,
    PromptInjectionGame,
    PromptMutationStudio,
    RagBuilder,
    RlhfTrainerGame,
    RobotSimulator,
    SceneDirectorXR,
    SchedulePlanner,
    SdgMatcher,
    SensorDataInterpreter,
    SimplePredictiveModel,
    SmartContractEventListener,
    SoundfieldComposer,
    SpatialNarrativeEngine,
    SpeechEmotionAnalyzer,
    StoryboardForgePlus,
    TextToAppGenerator,
    TextureAlchemyLab,
    TokenEconomySimulator,
    TokenVisualizer,
    UiFeedback,
    VoiceDrivenEditingDesk,
    VoiceMorphStudio,
    VocabularyLockIn,
    MasteryCheckGate,
    TemperaturePlayground,
    TokenReceiptPrinter,
    JsonSurgeon,
    MiniAgentSimulator,
    SemanticSearchLab,
    ApproachDecisionTree,
    RedTeamBot,
    PromptUnitTester,
    ModelPickerLab,
    CredentialMintPreview,
};

interface SectionRendererProps {
    item: ContentItem;
    section: Section;
    itemIndex: number;
}

const formatText = (text: string): React.ReactNode => {
    if (!text) return '';

    // Split by markdown patterns: **bold**, *italic*, `code`
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-brand-text">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={index} className="italic text-brand-primary/80 font-medium">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={index} className="bg-brand-primary/[0.07] px-2 py-0.5 rounded-lg text-sm font-mono text-brand-primary border border-brand-primary/10">{part.slice(1, -1)}</code>;
        }
        return part;
    });
};

const SectionRenderer: React.FC<SectionRendererProps> = ({ item, section, itemIndex }) => {
    const animationStyle = { animationDelay: `${300 + itemIndex * 80}ms` } as React.CSSProperties;

    switch (item.type) {
        case 'paragraph':
            return <p className="mb-7 text-lg text-brand-text-light leading-[1.8] animate-slide-in-up" style={animationStyle}>{formatText(item.content as string)}</p>;
        case 'heading':
            return <h3 className="text-xl md:text-2xl font-outfit font-black text-brand-text mb-5 mt-10 tracking-tight animate-slide-in-up" style={animationStyle}>{formatText(item.content as string)}</h3>;
        case 'quote':
            return (
                <blockquote className="relative border-l-4 border-gradient-to-b from-brand-primary to-brand-cyan pl-6 my-8 py-2 animate-slide-in-up" style={animationStyle}>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-primary to-brand-cyan rounded-full" style={{ marginLeft: '-3px' }} />
                    <p className="text-xl italic text-brand-text-light/90 leading-relaxed font-light">{formatText(item.content as string)}</p>
                </blockquote>
            );
        case 'list':
            if (Array.isArray(item.content)) {
                return (
                    <ul className="mb-8 pl-2 text-lg text-brand-text-light space-y-3">
                        {item.content.map((li, i) =>
                            <li
                                key={i}
                                className="animate-slide-in-up flex items-start gap-3"
                                style={{ animationDelay: `${300 + itemIndex * 80 + (i * 60)}ms` }}
                            >
                                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-brand-primary/60 flex-shrink-0" />
                                <span className="leading-[1.8]">{formatText(li)}</span>
                            </li>
                        )}
                    </ul>
                );
            }
            return null;
        case 'code':
            return (
                <div className="my-8 animate-slide-in-up" style={animationStyle}>
                    <CodeBlock code={item.content as string} language={item.language || 'javascript'} />
                </div>
            );
        case 'terminal':
            return <div className="animate-slide-in-up" style={animationStyle}><SimulatedTerminal
                code={item.content as string}
                language={item.language || 'bash'}
                output={item.output || ''}
                effectId={item.effectId}
                onRunCustomEffect={item.onRunCustomEffect}
            /></div>;
        case 'mermaid':
            return <div className="animate-slide-in-up" style={animationStyle}><MermaidDiagram chart={item.content as string} /></div>;
        case 'image':
            return <img src={item.content as string} alt={item.alt || ''} className="my-8 rounded-2xl shadow-elevated animate-slide-in-up" style={animationStyle} />;
        case 'interactive':
            if (item.component) {
                const InteractiveComponent = componentMap[item.component];
                if (InteractiveComponent) {
                    return (
                        <div className="animate-slide-in-up my-6" style={animationStyle}>
                            <div className="flex items-center gap-3 mb-4 pl-1">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/25 bg-violet-400/[0.08]">
                                    <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                                    </svg>
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-violet-300">Interactive Lab</span>
                            </div>
                            <Suspense fallback={
                                <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(160deg,rgba(7,14,30,0.95),rgba(12,20,39,0.9))] p-12 flex flex-col items-center justify-center gap-4">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full border-2 border-violet-400/20 border-t-violet-400 animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-violet-400/60" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 font-medium">Loading Lab...</p>
                                </div>
                            }>
                                <InteractiveComponent interactiveId={item.interactiveId || section.id} />
                            </Suspense>
                        </div>
                    );
                }
            }
            return <div className="text-red-400 my-8 p-5 bg-red-950/30 border border-red-500/25 rounded-2xl">Error: Interactive component "{item.component}" not found.</div>;
        default:
            return null;
    }
};

export default SectionRenderer;
