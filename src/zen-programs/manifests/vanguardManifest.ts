import type { InteractiveComponentType } from '../../types';

export type VanguardRuntimeType = 'webllm' | 'api' | 'simulated-ai' | 'local-logic' | 'static';
export type VanguardCompletionMode = 'section-scroll' | 'interactive-hook' | 'manual' | 'read-only' | 'none';
export type VanguardReadiness = 'ready' | 'needs-binding' | 'orphaned' | 'review';
export type VanguardModuleNumber = 1 | 2 | 3 | 4;

export interface VanguardManifestMiniApp {
    programId: string;
    moduleId: string;
    sectionId: string;
    lessonId: string;
    miniAppId: string;
    componentName: InteractiveComponentType | 'ManualArtifactGatePlaceholder' | string;
    route: string;
    runtimeType: VanguardRuntimeType;
    artifactType: string;
    completionMode: VanguardCompletionMode;
    canonicalSection: boolean;
    isWrapperContent: boolean;
    readiness: VanguardReadiness;
    issues: string[];
    sourceFile?: string | null;
}

export interface VanguardManifestLesson {
    programId: string;
    moduleId: string;
    sectionId: string;
    lessonId: string;
    title: string;
    route: string;
    runtimeType: VanguardRuntimeType;
    artifactType: string;
    completionMode: VanguardCompletionMode;
    canonicalSection: boolean;
    isWrapperContent: boolean;
    readiness: VanguardReadiness;
    issues: string[];
    miniApps: VanguardManifestMiniApp[];
}

export interface VanguardManifestSection {
    programId: string;
    moduleId: string;
    sectionId: string;
    title: string;
    route: string;
    runtimeType: VanguardRuntimeType;
    artifactType: string;
    completionMode: VanguardCompletionMode;
    canonicalSection: boolean;
    isWrapperContent: boolean;
    readiness: VanguardReadiness;
    issues: string[];
    lessons: VanguardManifestLesson[];
    miniApps: VanguardManifestMiniApp[];
}

export interface VanguardManifestModule {
    programId: string;
    moduleId: string;
    moduleNumber: VanguardModuleNumber;
    title: string;
    route: string;
    trackableTotal: number;
    sections: VanguardManifestSection[];
    issues: string[];
}

export interface VanguardCrossModuleDependency {
    componentName: string;
    importingModuleId: string;
    importingFile: string;
    sourceFile: string;
    recommendedAction: 'bind' | 'promote-to-shared' | 'archive-later' | 'review';
    reason: string;
}

export interface VanguardCompletionHookTodo {
    moduleId: string;
    sectionId: string;
    lessonId: string;
    miniAppId: string;
    componentName: string;
    sourceFile: string;
    currentCompletionMode: VanguardCompletionMode;
    recommendedAction: string;
}

export interface VanguardManifest {
    programId: string;
    routeBase: string;
    sourceOfTruth: string;
    bridgePurpose: string;
    credentialBoundary: string;
    trackableTotals: Record<VanguardModuleNumber, number>;
    modules: VanguardManifestModule[];
    miniApps: VanguardManifestMiniApp[];
    completionHookTodos: VanguardCompletionHookTodo[];
    crossModuleDependencies: VanguardCrossModuleDependency[];
    mergeBlockers: string[];
}

export const vanguardManifest = {
    "programId": "vanguard",
    "routeBase": "/module",
    "sourceOfTruth": "repo-curriculumData",
    "bridgePurpose": "Arsenal/Lovable merge-readiness contract only. Not a Notion source-of-truth sync.",
    "credentialBoundary": "Credential simulation / dry-run attestation workbench. Not production issuer pipeline.",
    "trackableTotals": {
        "1": 38,
        "2": 27,
        "3": 25,
        "4": 24
    },
    "modules": [
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "moduleNumber": 1,
            "title": "AI Foundations",
            "route": "/module/1",
            "trackableTotal": 38,
            "sections": [
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-1",
                    "sectionId": "overview",
                    "title": "Course Overview",
                    "route": "/module/1",
                    "runtimeType": "static",
                    "artifactType": "wrapper-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": false,
                    "isWrapperContent": true,
                    "readiness": "review",
                    "issues": [
                        "Top-level wrapper content is preserved for Vanguard runtime behavior but excluded from Arsenal canonical 4x2 ingestion."
                    ],
                    "lessons": [],
                    "miniApps": [
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "overview",
                            "lessonId": "vanguard-module-1-overview-wrapper-content",
                            "miniAppId": "hero-intro",
                            "componentName": "HeroIntro",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/HeroIntro.tsx"
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "overview",
                            "lessonId": "vanguard-module-1-overview-wrapper-content",
                            "miniAppId": "homeschool-roadmap",
                            "componentName": "HomeschoolKitRoadmap",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/HomeschoolKitRoadmap.tsx"
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "overview",
                            "lessonId": "vanguard-module-1-overview-wrapper-content",
                            "miniAppId": "concept-matrix",
                            "componentName": "CourseConceptMatrix",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/CourseConceptMatrix.tsx"
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "overview",
                            "lessonId": "vanguard-module-1-overview-wrapper-content",
                            "miniAppId": "paradigm-shift-1",
                            "componentName": "ParadigmShiftExplorer",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/ParadigmShiftExplorer.tsx"
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "overview",
                            "lessonId": "vanguard-module-1-overview-wrapper-content",
                            "miniAppId": "agentic-loop-viz",
                            "componentName": "AgenticWorkflowViz",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/AgenticWorkflowViz.tsx"
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "overview",
                            "lessonId": "vanguard-module-1-overview-wrapper-content",
                            "miniAppId": "overview-visualizer",
                            "componentName": "AiSystemVisualizer",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/AiSystemVisualizer.tsx"
                        }
                    ]
                },
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-1",
                    "sectionId": "ai-foundations",
                    "title": "Foundations: The AI Revolution",
                    "route": "/module/1",
                    "runtimeType": "static",
                    "artifactType": "wrapper-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": false,
                    "isWrapperContent": true,
                    "readiness": "review",
                    "issues": [
                        "Top-level wrapper content is preserved for Vanguard runtime behavior but excluded from Arsenal canonical 4x2 ingestion."
                    ],
                    "lessons": [],
                    "miniApps": [
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "ai-foundations",
                            "lessonId": "vanguard-module-1-ai-foundations-wrapper-content",
                            "miniAppId": "neural-playground-1",
                            "componentName": "NeuralNetworkPlayground",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/NeuralNetworkPlayground.tsx"
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "ai-foundations",
                            "lessonId": "vanguard-module-1-ai-foundations-wrapper-content",
                            "miniAppId": "foundations-chat",
                            "componentName": "InteractiveChatbot",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/InteractiveChatbot.tsx"
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "ai-foundations",
                            "lessonId": "vanguard-module-1-ai-foundations-wrapper-content",
                            "miniAppId": "foundations-token-viz",
                            "componentName": "TokenVisualizer",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/TokenVisualizer.tsx"
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "ai-foundations",
                            "lessonId": "vanguard-module-1-ai-foundations-wrapper-content",
                            "miniAppId": "foundations-probability",
                            "componentName": "ProbabilitySelector",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/ProbabilitySelector.tsx"
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "ai-foundations",
                            "lessonId": "vanguard-module-1-ai-foundations-wrapper-content",
                            "miniAppId": "foundations-predict",
                            "componentName": "SimplePredictiveModel",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/SimplePredictiveModel.tsx"
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "ai-foundations",
                            "lessonId": "vanguard-module-1-ai-foundations-wrapper-content",
                            "miniAppId": "foundations-email",
                            "componentName": "ProfessionalEmailWriter",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/ProfessionalEmailWriter.tsx"
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "ai-foundations",
                            "lessonId": "vanguard-module-1-ai-foundations-wrapper-content",
                            "miniAppId": "foundations-poll",
                            "componentName": "FutureScenarioPoll",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/FutureScenarioPoll.tsx"
                        }
                    ]
                },
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-1",
                    "sectionId": "ai-magic-demo",
                    "title": "Experience the Magic",
                    "route": "/module/1",
                    "runtimeType": "static",
                    "artifactType": "wrapper-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": false,
                    "isWrapperContent": true,
                    "readiness": "review",
                    "issues": [
                        "Top-level wrapper content is preserved for Vanguard runtime behavior but excluded from Arsenal canonical 4x2 ingestion."
                    ],
                    "lessons": [],
                    "miniApps": [
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "ai-magic-demo",
                            "lessonId": "vanguard-module-1-ai-magic-demo-wrapper-content",
                            "miniAppId": "magic-demo-image",
                            "componentName": "BeginnerImageGen",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/BeginnerImageGen.tsx"
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "ai-magic-demo",
                            "lessonId": "vanguard-module-1-ai-magic-demo-wrapper-content",
                            "miniAppId": "magic-demo-app",
                            "componentName": "TextToAppGenerator",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/TextToAppGenerator.tsx"
                        }
                    ]
                },
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-1",
                    "sectionId": "ai-models",
                    "title": "AI Models Landscape (2025)",
                    "route": "/module/1",
                    "runtimeType": "static",
                    "artifactType": "wrapper-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": false,
                    "isWrapperContent": true,
                    "readiness": "review",
                    "issues": [
                        "Top-level wrapper content is preserved for Vanguard runtime behavior but excluded from Arsenal canonical 4x2 ingestion."
                    ],
                    "lessons": [],
                    "miniApps": [
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "ai-models",
                            "lessonId": "vanguard-module-1-ai-models-wrapper-content",
                            "miniAppId": "model-explorer-1",
                            "componentName": "ModelExplorer",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module1/components/interactive/ModelExplorer.tsx"
                        }
                    ]
                },
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-1",
                    "sectionId": "module-1",
                    "title": "Module 1: The Intelligence Inside",
                    "route": "/module/1",
                    "runtimeType": "static",
                    "artifactType": "canonical-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": true,
                    "isWrapperContent": false,
                    "readiness": "ready",
                    "issues": [],
                    "lessons": [
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-1",
                            "title": "1.1 Understanding the Machine Mind",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-1",
                                    "miniAppId": "neural-evolution-1",
                                    "componentName": "NeuralEvolutionChronicle",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/NeuralEvolutionChronicle.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-1",
                                    "miniAppId": "arms-race-1",
                                    "componentName": "ModelArmsRaceTimeline",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/ModelArmsRaceTimeline.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-1",
                                    "miniAppId": "param-universe-1",
                                    "componentName": "ParameterUniverseExplorer",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/ParameterUniverseExplorer.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-1",
                                    "miniAppId": "arch-builder-1",
                                    "componentName": "ArchitectureBuilderSandbox",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/ArchitectureBuilderSandbox.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-1",
                                    "miniAppId": "api-key-sim-1",
                                    "componentName": "ApiKeyChatSimulator",
                                    "route": "/module/1",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module1/components/interactive/ApiKeyChatSimulator.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-1",
                                    "miniAppId": "beginner-chat-1",
                                    "componentName": "InteractiveChatbot",
                                    "route": "/module/1",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language.",
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/InteractiveChatbot.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-1",
                                    "miniAppId": "quiz-1-1",
                                    "componentName": "SectionQuiz",
                                    "route": "/module/1",
                                    "runtimeType": "static",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/SectionQuiz.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-2",
                            "title": "1.2 How Machines \"Learn\" Predictions",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-2",
                                    "miniAppId": "simple-model-1",
                                    "componentName": "SimplePredictiveModel",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/SimplePredictiveModel.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-2",
                                    "miniAppId": "loss-landscape-1",
                                    "componentName": "LossLandscapeNavigator",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module1/components/interactive/LossLandscapeNavigator.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-2",
                                    "miniAppId": "quiz-1-2",
                                    "componentName": "SectionQuiz",
                                    "route": "/module/1",
                                    "runtimeType": "static",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/SectionQuiz.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-3",
                            "title": "1.3 Ethics: Programming Morality",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-3",
                                    "miniAppId": "dilemma-sim-1",
                                    "componentName": "EthicalDilemmaSimulator",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module1/components/interactive/EthicalDilemmaSimulator.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-4",
                            "title": "1.4 Data as Fuel: Ingredients for Intelligence",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-4",
                                    "miniAppId": "data-viz-1",
                                    "componentName": "DataVisualizer",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module1/components/interactive/DataVisualizer.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-4",
                                    "miniAppId": "beginner-voice-1",
                                    "componentName": "VoiceMorphStudio",
                                    "route": "/module/1",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module1/components/interactive/VoiceMorphStudio.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-5",
                            "title": "1.5 Safety & Security: Fooling the AI",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-5",
                                    "miniAppId": "adversarial-sim-1",
                                    "componentName": "AdversarialAttackSimulator",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module1/components/interactive/AdversarialAttackSimulator.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-5",
                                    "miniAppId": "prompt-injection-1",
                                    "componentName": "PromptInjectionGame",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/PromptInjectionGame.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-6",
                            "title": "1.6 Memory: The Sliding Window",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-6",
                                    "miniAppId": "context-window-1",
                                    "componentName": "ContextWindowExplorer",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/ContextWindowExplorer.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-6",
                                    "miniAppId": "memory-decay-1",
                                    "componentName": "MemoryDecayLab",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/MemoryDecayLab.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-7",
                            "title": "1.7 Inside the Black Box",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-7",
                                    "miniAppId": "xai-panel-1",
                                    "componentName": "ExplainabilityPanel",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module1/components/interactive/ExplainabilityPanel.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-7",
                                    "miniAppId": "bias-mirror-1",
                                    "componentName": "EthicalBiasMirror",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/EthicalBiasMirror.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-8",
                            "title": "1.8 Project: Real-World AI Application",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-8",
                                    "miniAppId": "beginner-sum-1",
                                    "componentName": "MeetingSummarizer",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/MeetingSummarizer.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-9",
                            "title": "1.9 The Cost & Risks of Intelligence",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-9",
                                    "miniAppId": "energy-tracker-1",
                                    "componentName": "EnergyCarbonTracker",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module1/components/interactive/EnergyCarbonTracker.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-9",
                                    "miniAppId": "beginner-priv-1",
                                    "componentName": "PrivacyLensDashboard",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/PrivacyLensDashboard.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-10",
                            "title": "1.10 Reflection: The Creative Spark",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-10",
                                    "miniAppId": "beginner-proj-1",
                                    "componentName": "PromptMutationStudio",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/PromptMutationStudio.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-10",
                                    "miniAppId": "mastery-check-1-10",
                                    "componentName": "MasteryCheckGate",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language.",
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/MasteryCheckGate.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-11",
                            "title": "1.11 The Model Control Panel - Steering Output",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-11",
                                    "miniAppId": "temp-playground-1",
                                    "componentName": "TemperaturePlayground",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/TemperaturePlayground.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-12",
                            "title": "1.12 Tokens as Currency - Cost Awareness",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-12",
                                    "miniAppId": "token-receipt-1",
                                    "componentName": "TokenReceiptPrinter",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language.",
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/TokenReceiptPrinter.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-13",
                            "title": "1.13 The Shape of Data - JSON & Structured Outputs",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-13",
                                    "miniAppId": "json-surgeon-1",
                                    "componentName": "JsonSurgeon",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language.",
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/JsonSurgeon.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-14",
                            "title": "1.14 Tool Use and Agent Loops",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-14",
                                    "miniAppId": "agent-sim-1",
                                    "componentName": "MiniAgentSimulator",
                                    "route": "/module/1",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/MiniAgentSimulator.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-15",
                            "title": "1.15 Retrieval and Memory - RAG Fundamentals",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-15",
                                    "miniAppId": "semantic-search-1",
                                    "componentName": "SemanticSearchLab",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language.",
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/SemanticSearchLab.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-16",
                            "title": "1.16 When to Prompt, RAG, or Fine-Tune",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-16",
                                    "miniAppId": "approach-tree-1",
                                    "componentName": "ApproachDecisionTree",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language.",
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/ApproachDecisionTree.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-17",
                            "title": "1.17 Security Fundamentals - Prompt Injection & Defenses",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-17",
                                    "miniAppId": "red-team-1",
                                    "componentName": "RedTeamBot",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language.",
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/RedTeamBot.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-18",
                            "title": "1.18 Reliability Engineering - Testing & Validation",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-18",
                                    "miniAppId": "prompt-tester-1",
                                    "componentName": "PromptUnitTester",
                                    "route": "/module/1",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/PromptUnitTester.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-19",
                            "title": "1.19 Model Selection - Picking the Right Tool",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-19",
                                    "miniAppId": "model-picker-1",
                                    "componentName": "ModelPickerLab",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/ModelPickerLab.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-20",
                            "title": "1.20 Web3 Bridge - Verifiable Credentials",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-20",
                                    "miniAppId": "credential-mint-1",
                                    "componentName": "CredentialMintPreview",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/CredentialMintPreview.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-21",
                            "title": "1.21 Capstone - Integrated Application",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "content-only-lesson",
                            "completionMode": "manual",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "needs-binding",
                            "issues": [
                                "No lesson-bound mini-app discovered in curriculumData for this lesson."
                            ],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-21",
                                    "miniAppId": "vanguard-module-1-1-21-manual-artifact-gate",
                                    "componentName": "ManualArtifactGatePlaceholder",
                                    "route": "/module/1",
                                    "runtimeType": "static",
                                    "artifactType": "manual-artifact-gate",
                                    "completionMode": "manual",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Manifest-level placeholder only. Bind to the existing artifact/submission pattern before treating as an interactive mini-app."
                                    ],
                                    "sourceFile": null
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-1",
                            "lessonId": "1-22",
                            "title": "1.22 API-Readiness Gate - Exit Exam",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-1",
                                    "lessonId": "1-22",
                                    "miniAppId": "quiz-1-exit",
                                    "componentName": "SectionQuiz",
                                    "route": "/module/1",
                                    "runtimeType": "static",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/SectionQuiz.tsx"
                                }
                            ]
                        }
                    ],
                    "miniApps": []
                },
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-1",
                    "sectionId": "module-2",
                    "title": "Module 2: Generative Intelligence",
                    "route": "/module/1",
                    "runtimeType": "static",
                    "artifactType": "canonical-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": true,
                    "isWrapperContent": false,
                    "readiness": "ready",
                    "issues": [],
                    "lessons": [
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-2",
                            "lessonId": "2-1",
                            "title": "2.1 The Science of Creation",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-1",
                                    "miniAppId": "diffusion-explorer-1",
                                    "componentName": "DiffusionFieldExplorer",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/DiffusionFieldExplorer.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-1",
                                    "miniAppId": "int-prompt-2",
                                    "componentName": "PromptArchitectWorkbench",
                                    "route": "/module/1",
                                    "runtimeType": "webllm",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [
                                        "WebLLM path is device- and browser-dependent and falls back when WebGPU or local model init fails."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/PromptArchitectWorkbench.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-2",
                            "lessonId": "2-2",
                            "title": "2.2 Language as Design",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-2",
                                    "miniAppId": "prompt-architect-1",
                                    "componentName": "PromptArchitectWorkbench",
                                    "route": "/module/1",
                                    "runtimeType": "webllm",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [
                                        "WebLLM path is device- and browser-dependent and falls back when WebGPU or local model init fails."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/PromptArchitectWorkbench.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-2",
                                    "miniAppId": "int-model-2",
                                    "componentName": "ModelExplorer",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module1/components/interactive/ModelExplorer.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-2",
                            "lessonId": "2-3",
                            "title": "2.3 Visual Generation & Design Systems",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-3",
                                    "miniAppId": "compositor-canvas-1",
                                    "componentName": "CompositorCanvasPro",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/CompositorCanvasPro.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-3",
                                    "miniAppId": "scene-director-1",
                                    "componentName": "SceneDirectorXR",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/SceneDirectorXR.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-3",
                                    "miniAppId": "pattern-synth-1",
                                    "componentName": "PatternGenomeSynthesizer",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/PatternGenomeSynthesizer.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-3",
                                    "miniAppId": "lighting-lab-1",
                                    "componentName": "LightingPhysicsLab",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/LightingPhysicsLab.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-3",
                                    "miniAppId": "style-inspector-1",
                                    "componentName": "EthicalStyleInspector",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/EthicalStyleInspector.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-3",
                                    "miniAppId": "int-flow-2",
                                    "componentName": "DataDecisionFlowchartBuilder",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/DataDecisionFlowchartBuilder.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-2",
                            "lessonId": "2-4",
                            "title": "2.4 Sound, Music & Voice",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-4",
                                    "miniAppId": "melody-maker-1",
                                    "componentName": "MelodyMakerAI",
                                    "route": "/module/1",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/MelodyMakerAI.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-4",
                                    "miniAppId": "voice-morph-1",
                                    "componentName": "VoiceMorphStudio",
                                    "route": "/module/1",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module1/components/interactive/VoiceMorphStudio.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-4",
                                    "miniAppId": "ambient-architect-1",
                                    "componentName": "AmbientArchitect",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/AmbientArchitect.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-4",
                                    "miniAppId": "speech-analyzer-1",
                                    "componentName": "SpeechEmotionAnalyzer",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module1/components/interactive/SpeechEmotionAnalyzer.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-4",
                                    "miniAppId": "av-sync-lab-1",
                                    "componentName": "AudioVisualSyncLab",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/AudioVisualSyncLab.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-4",
                                    "miniAppId": "int-doc-2",
                                    "componentName": "ContextWindowExplorer",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/ContextWindowExplorer.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-2",
                            "lessonId": "2-5",
                            "title": "2.5 Video & Motion Synthesis",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-5",
                                    "miniAppId": "storyboard-forge-1",
                                    "componentName": "StoryboardForgePlus",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/StoryboardForgePlus.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-5",
                                    "miniAppId": "motion-physics-1",
                                    "componentName": "MotionPhysicsPlayground",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module1/components/interactive/MotionPhysicsPlayground.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-5",
                                    "miniAppId": "prompt-sequencer-1",
                                    "componentName": "CinematicPromptSequencer",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/CinematicPromptSequencer.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-5",
                                    "miniAppId": "gesture-animator-1",
                                    "componentName": "GestureAnimator",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/GestureAnimator.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-5",
                                    "miniAppId": "voice-editor-1",
                                    "componentName": "VoiceDrivenEditingDesk",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/VoiceDrivenEditingDesk.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-5",
                                    "miniAppId": "int-light-2",
                                    "componentName": "LightingPhysicsLab",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/LightingPhysicsLab.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-2",
                            "lessonId": "2-6",
                            "title": "2.6 3D Worlds & The Metaverse",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-6",
                                    "miniAppId": "dreamspace-1",
                                    "componentName": "DreamspaceConstructor",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/DreamspaceConstructor.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-6",
                                    "miniAppId": "soundfield-composer-1",
                                    "componentName": "SoundfieldComposer",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module1/components/interactive/SoundfieldComposer.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-2",
                            "lessonId": "2-7",
                            "title": "2.7 Ethics: Truth, Trust & The Deepfake Era",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-7",
                                    "miniAppId": "interactive-debates-1",
                                    "componentName": "InteractiveDebates",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/InteractiveDebates.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-2",
                            "lessonId": "2-8",
                            "title": "2.8 Agentic Architectures: From Chatbots to Workers",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-8",
                                    "miniAppId": "int-graph-2",
                                    "componentName": "LangGraphVisualizer",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/LangGraphVisualizer.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-2",
                            "lessonId": "2-9",
                            "title": "2.9 The Business of AI: Building the Future",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-9",
                                    "miniAppId": "int-pitch-2",
                                    "componentName": "PitchBuilder",
                                    "route": "/module/1",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/PitchBuilder.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-1",
                            "sectionId": "module-2",
                            "lessonId": "2-10",
                            "title": "2.10 The Horizon: AGI, ASI, and What Comes Next",
                            "route": "/module/1",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-1",
                                    "sectionId": "module-2",
                                    "lessonId": "2-10",
                                    "miniAppId": "future-poll-2",
                                    "componentName": "FutureScenarioPoll",
                                    "route": "/module/1",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module1/components/interactive/FutureScenarioPoll.tsx"
                                }
                            ]
                        }
                    ],
                    "miniApps": []
                }
            ],
            "issues": [
                "Contains 4 top-level content blocks outside the target two-section structure: overview, ai-foundations, ai-magic-demo, ai-models.",
                "Configured progress total (50) does not match discovered trackable section count (38)."
            ]
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "moduleNumber": 2,
            "title": "Agents & Automation Frameworks",
            "route": "/module/2",
            "trackableTotal": 27,
            "sections": [
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-2",
                    "sectionId": "overview",
                    "title": "Module Overview",
                    "route": "/module/2",
                    "runtimeType": "static",
                    "artifactType": "wrapper-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": false,
                    "isWrapperContent": true,
                    "readiness": "review",
                    "issues": [
                        "Top-level wrapper content is preserved for Vanguard runtime behavior but excluded from Arsenal canonical 4x2 ingestion."
                    ],
                    "lessons": [],
                    "miniApps": [
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "overview",
                            "lessonId": "vanguard-module-2-overview-wrapper-content",
                            "miniAppId": "hero-intro-mod2",
                            "componentName": "HeroIntroMod2",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module2/components/interactive/HeroIntroMod2.tsx"
                        }
                    ]
                },
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-2",
                    "sectionId": "part-1",
                    "title": "PART 1: Agentic Foundations & Reasoning Systems",
                    "route": "/module/2",
                    "runtimeType": "static",
                    "artifactType": "canonical-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": true,
                    "isWrapperContent": false,
                    "readiness": "ready",
                    "issues": [],
                    "lessons": [
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-1",
                            "lessonId": "1-1",
                            "title": "1.1 What Is an Agent? (Architecture & Core Components)",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-1",
                                    "lessonId": "1-1",
                                    "miniAppId": "agent-anatomy-1",
                                    "componentName": "AgentSystemDesigner",
                                    "route": "/module/2",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module2/components/interactive/AgentSystemDesigner.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-1",
                            "lessonId": "1-2",
                            "title": "1.2 Planning and Chain of Thought (Real Multi-Step Intelligence)",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-1",
                                    "lessonId": "1-2",
                                    "miniAppId": "plan-graph-simulator-1",
                                    "componentName": "LangGraphVisualizer",
                                    "route": "/module/2",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module2/components/interactive/LangGraphVisualizer.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-1",
                            "lessonId": "1-3",
                            "title": "1.3 Memory Architectures (How Agents Build, Store, and Evolve Knowledge)",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-1",
                                    "lessonId": "1-3",
                                    "miniAppId": "memory-vault-xr-1",
                                    "componentName": "MemoryVaultXR",
                                    "route": "/module/2",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/MemoryVaultXR.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-1",
                                    "lessonId": "1-3",
                                    "miniAppId": "memory-decay-lab-1",
                                    "componentName": "MemoryDecayLab",
                                    "route": "/module/2",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/MemoryDecayLab.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-1",
                            "lessonId": "1-4",
                            "title": "1.4 Tool Usage & API Control (How Agents Take Real Action)",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-1",
                                    "lessonId": "1-4",
                                    "miniAppId": "tool-call-dashboard-1",
                                    "componentName": "ToolCallDashboard",
                                    "route": "/module/2",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/ToolCallDashboard.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-1",
                            "lessonId": "1-5",
                            "title": "1.5 Autonomy & Goal Setting (How Agents Turn Intent Into Action)",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-1",
                                    "lessonId": "1-5",
                                    "miniAppId": "goal-forge-1",
                                    "componentName": "SchedulePlanner",
                                    "route": "/module/2",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/SchedulePlanner.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-1",
                            "lessonId": "1-6",
                            "title": "1.6 Collaborative Agents (How Digital Teams Work Together)",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-1",
                                    "lessonId": "1-6",
                                    "miniAppId": "team-matrix-1",
                                    "componentName": "MultiAgentChatSandbox",
                                    "route": "/module/2",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/MultiAgentChatSandbox.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-1",
                            "lessonId": "1-7",
                            "title": "1.7 Evaluation & Feedback Loops (How Agents Learn What \"Good\" Means)",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-1",
                                    "lessonId": "1-7",
                                    "miniAppId": "feedback-trainer-1",
                                    "componentName": "RlhfTrainerGame",
                                    "route": "/module/2",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/RlhfTrainerGame.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-1",
                            "lessonId": "1-8",
                            "title": "1.8 Security & Containment (How We Keep Autonomous Agents Safe, Controlled, and Predictable)",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-1",
                                    "lessonId": "1-8",
                                    "miniAppId": "red-team-lab-1",
                                    "componentName": "AdversarialAttackSimulator",
                                    "route": "/module/2",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/AdversarialAttackSimulator.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-1",
                            "lessonId": "1-9",
                            "title": "1.9 Deployment Pipelines (How Agents Move From Idea -> Reality -> Production)",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-1",
                                    "lessonId": "1-9",
                                    "miniAppId": "ci-cd-pipeline-1",
                                    "componentName": "AgentCiCdPipeline",
                                    "route": "/module/2",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module2/components/interactive/AgentCiCdPipeline.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-1",
                            "lessonId": "1-10",
                            "title": "1.10 Capstone 1 - Build a Single-Purpose Agent (Your First Real Digital Worker)",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-1",
                                    "lessonId": "1-10",
                                    "miniAppId": "capstone-1-agent",
                                    "componentName": "CapstoneAgentBuilder",
                                    "route": "/module/2",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/CapstoneAgentBuilder.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-1",
                            "lessonId": "1-11",
                            "title": "1.11 Build an Agent | Agent Assembly",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-1",
                                    "lessonId": "1-11",
                                    "miniAppId": "hf-guide-1-11",
                                    "componentName": "HuggingFaceGuide",
                                    "route": "/module/2",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/HuggingFaceGuide.tsx"
                                }
                            ]
                        }
                    ],
                    "miniApps": []
                },
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-2",
                    "sectionId": "part-2",
                    "title": "PART 2: Advanced Automation & Governance Frameworks",
                    "route": "/module/2",
                    "runtimeType": "static",
                    "artifactType": "canonical-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": true,
                    "isWrapperContent": false,
                    "readiness": "ready",
                    "issues": [],
                    "lessons": [
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-2",
                            "lessonId": "2-1",
                            "title": "2.1 Workflow Orchestration",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-1",
                                    "miniAppId": "orchestration-canvas-1",
                                    "componentName": "DataDecisionFlowchartBuilder",
                                    "route": "/module/2",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/DataDecisionFlowchartBuilder.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-1",
                                    "miniAppId": "quiz-2-1",
                                    "componentName": "SectionQuiz",
                                    "route": "/module/2",
                                    "runtimeType": "static",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/SectionQuiz.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-2",
                            "lessonId": "2-2",
                            "title": "2.2 Knowledge Retrieval & RAG",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-2",
                                    "miniAppId": "rag-builder-pro-1",
                                    "componentName": "RagBuilder",
                                    "route": "/module/2",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/RagBuilder.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-2",
                                    "miniAppId": "quiz-2-2",
                                    "componentName": "SectionQuiz",
                                    "route": "/module/2",
                                    "runtimeType": "static",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/SectionQuiz.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-2",
                            "lessonId": "2-3",
                            "title": "2.3 Multi-Modal Agents",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-3",
                                    "miniAppId": "multi-modal-lab-1",
                                    "componentName": "AudioVisualSyncLab",
                                    "route": "/module/2",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/AudioVisualSyncLab.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-3",
                                    "miniAppId": "video-analyst-1",
                                    "componentName": "VideoAnalystPro",
                                    "route": "/module/2",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/VideoAnalystPro.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-2",
                            "lessonId": "2-4",
                            "title": "2.4 Event-Driven Automation",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-4",
                                    "miniAppId": "event-ops-lab-1",
                                    "componentName": "EventOpsLab",
                                    "route": "/module/2",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/EventOpsLab.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-2",
                            "lessonId": "2-5",
                            "title": "2.5 Human-in-the-Loop",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-5",
                                    "miniAppId": "hitl-lab-1",
                                    "componentName": "HitlLab",
                                    "route": "/module/2",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/HitlLab.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-5",
                                    "miniAppId": "hitl-rag-1",
                                    "componentName": "HitlRagSimulator",
                                    "route": "/module/2",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module2/components/interactive/HitlRagSimulator.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-2",
                            "lessonId": "2-6",
                            "title": "2.6 Governance & Transparency",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-6",
                                    "miniAppId": "gov-decision-1",
                                    "componentName": "GovernanceDecisionSimulator",
                                    "route": "/module/2",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module2/components/interactive/GovernanceDecisionSimulator.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-6",
                                    "miniAppId": "transparency-score-1",
                                    "componentName": "TransparencyScorecard",
                                    "route": "/module/2",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module2/components/interactive/TransparencyScorecard.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-6",
                                    "miniAppId": "audit-log-1",
                                    "componentName": "DecisionAuditLog",
                                    "route": "/module/2",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module2/components/interactive/DecisionAuditLog.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-6",
                                    "miniAppId": "privacy-lens-1",
                                    "componentName": "PrivacyLensDashboard",
                                    "route": "/module/2",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/PrivacyLensDashboard.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-2",
                            "lessonId": "2-7",
                            "title": "2.7 AI Economy & Resource Optimization (Make Agents Powerful and Efficient)",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-7",
                                    "miniAppId": "token-economy-2",
                                    "componentName": "TokenEconomySimulator",
                                    "route": "/module/2",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module2/components/interactive/TokenEconomySimulator.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-2",
                            "lessonId": "2-8",
                            "title": "2.8 Global Coordination & Policy Integration",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-8",
                                    "miniAppId": "jurisdiction-rag-1",
                                    "componentName": "JurisdictionAwareRag",
                                    "route": "/module/2",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module2/components/interactive/JurisdictionAwareRag.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-8",
                                    "miniAppId": "global-policy-map-1",
                                    "componentName": "GlobalPolicyMap",
                                    "route": "/module/2",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module2/components/interactive/GlobalPolicyMap.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-8",
                                    "miniAppId": "patent-radar-1",
                                    "componentName": "LivePatentRadar",
                                    "route": "/module/2",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/LivePatentRadar.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-2",
                            "lessonId": "2-9",
                            "title": "2.9 Future Frontiers - Neuro-Symbolic & Quantum Agents",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-9",
                                    "miniAppId": "symbolic-logic-1",
                                    "componentName": "AlgorithmVisualizer",
                                    "route": "/module/2",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module2/components/interactive/AlgorithmVisualizer.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-9",
                                    "miniAppId": "future-tech-lab-1",
                                    "componentName": "NeuroSymbolicQuantumLab",
                                    "route": "/module/2",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module2/components/interactive/NeuroSymbolicQuantumLab.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-2",
                            "lessonId": "2-10",
                            "title": "2.10 Capstone 2 - Design an Autonomous Organization",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-10",
                                    "miniAppId": "capstone-2-architect",
                                    "componentName": "CapstoneOrgArchitect",
                                    "route": "/module/2",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module2/components/interactive/CapstoneOrgArchitect.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-2",
                            "sectionId": "part-2",
                            "lessonId": "2-11",
                            "title": "2.11 Build an Omni Studio",
                            "route": "/module/2",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-11",
                                    "miniAppId": "hf-guide-1",
                                    "componentName": "HuggingFaceGuide",
                                    "route": "/module/2",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module2/components/interactive/HuggingFaceGuide.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-2",
                                    "sectionId": "part-2",
                                    "lessonId": "2-11",
                                    "miniAppId": "fuel-orbs-1",
                                    "componentName": "FuelOrbs",
                                    "route": "/module/2",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module2/components/interactive/FuelOrbs.tsx"
                                }
                            ]
                        }
                    ],
                    "miniApps": []
                },
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-2",
                    "sectionId": "deliverables",
                    "title": "Learner Deliverables",
                    "route": "/module/2",
                    "runtimeType": "static",
                    "artifactType": "wrapper-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": false,
                    "isWrapperContent": true,
                    "readiness": "review",
                    "issues": [
                        "Top-level wrapper content is preserved for Vanguard runtime behavior but excluded from Arsenal canonical 4x2 ingestion."
                    ],
                    "lessons": [],
                    "miniApps": []
                },
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-2",
                    "sectionId": "outcome",
                    "title": "Outcome",
                    "route": "/module/2",
                    "runtimeType": "static",
                    "artifactType": "wrapper-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": false,
                    "isWrapperContent": true,
                    "readiness": "review",
                    "issues": [
                        "Top-level wrapper content is preserved for Vanguard runtime behavior but excluded from Arsenal canonical 4x2 ingestion."
                    ],
                    "lessons": [],
                    "miniApps": []
                }
            ],
            "issues": [
                "Contains 3 top-level content blocks outside the target two-section structure: overview, deliverables, outcome.",
                "Configured progress total (40) does not match discovered trackable section count (27)."
            ]
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "moduleNumber": 3,
            "title": "Personal Intelligence & Cognitive Systems",
            "route": "/module/3",
            "trackableTotal": 25,
            "sections": [
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-3",
                    "sectionId": "overview",
                    "title": "Module 3 Overview",
                    "route": "/module/3",
                    "runtimeType": "static",
                    "artifactType": "wrapper-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": false,
                    "isWrapperContent": true,
                    "readiness": "review",
                    "issues": [
                        "Top-level wrapper content is preserved for Vanguard runtime behavior but excluded from Arsenal canonical 4x2 ingestion."
                    ],
                    "lessons": [],
                    "miniApps": [
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "overview",
                            "lessonId": "vanguard-module-3-overview-wrapper-content",
                            "miniAppId": "hero-intro-mod3",
                            "componentName": "HeroIntroMod3",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module3/components/interactive/HeroIntroMod3.tsx"
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "overview",
                            "lessonId": "vanguard-module-3-overview-wrapper-content",
                            "miniAppId": "fact-of-the-day",
                            "componentName": "FactOfTheDay",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module3/components/interactive/FactOfTheDay.tsx"
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "overview",
                            "lessonId": "vanguard-module-3-overview-wrapper-content",
                            "miniAppId": "ai-puzzle-challenge",
                            "componentName": "AIPuzzle",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "wrapper-mini-app",
                            "completionMode": "section-scroll",
                            "canonicalSection": false,
                            "isWrapperContent": true,
                            "readiness": "review",
                            "issues": [
                                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
                            ],
                            "sourceFile": "src/modules/module3/components/interactive/AIPuzzle.tsx"
                        }
                    ]
                },
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-3",
                    "sectionId": "part-1",
                    "title": "PART 1: The Architecture of a Second Brain",
                    "route": "/module/3",
                    "runtimeType": "static",
                    "artifactType": "canonical-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": true,
                    "isWrapperContent": false,
                    "readiness": "ready",
                    "issues": [],
                    "lessons": [
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-1",
                            "lessonId": "3-1",
                            "title": "3.1 The Era of Cognitive Overload",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-1",
                                    "lessonId": "3-1",
                                    "miniAppId": "memory-decay-lab-1",
                                    "componentName": "MemoryDecayLab",
                                    "route": "/module/3",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/MemoryDecayLab.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-1",
                                    "lessonId": "3-1",
                                    "miniAppId": "quiz-3-1",
                                    "componentName": "SectionQuiz",
                                    "route": "/module/3",
                                    "runtimeType": "static",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/SectionQuiz.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-1",
                            "lessonId": "3-2",
                            "title": "3.2 Digital Hygiene & The \"Clean Input\" Protocol",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-1",
                                    "lessonId": "3-2",
                                    "miniAppId": "digital-janitor-lab-1",
                                    "componentName": "DigitalJanitorLab",
                                    "route": "/module/3",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language.",
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/DigitalJanitorLab.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-1",
                                    "lessonId": "3-2",
                                    "miniAppId": "quiz-3-2",
                                    "componentName": "SectionQuiz",
                                    "route": "/module/3",
                                    "runtimeType": "static",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/SectionQuiz.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-1",
                            "lessonId": "3-3",
                            "title": "3.3 The Art of Retrieval (RAG as a Lifestyle)",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-1",
                                    "lessonId": "3-3",
                                    "miniAppId": "rag-builder-1",
                                    "componentName": "RagBuilder",
                                    "route": "/module/3",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/RagBuilder.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-1",
                            "lessonId": "3-4",
                            "title": "3.4 Hallucinations vs. Reality (The Trust Architecture)",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-1",
                                    "lessonId": "3-4",
                                    "miniAppId": "fact-checker-1",
                                    "componentName": "FactCheckerSimulator",
                                    "route": "/module/3",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/FactCheckerSimulator.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-1",
                            "lessonId": "3-5",
                            "title": "3.5 Personal Knowledge Graphs (Connecting the Dots)",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-1",
                                    "lessonId": "3-5",
                                    "miniAppId": "knowledge-graph-1",
                                    "componentName": "KnowledgeGraphBuilder",
                                    "route": "/module/3",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language.",
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/KnowledgeGraphBuilder.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-1",
                            "lessonId": "3-6",
                            "title": "3.6 The \"Research Assistant\" Workflow (Web to Wisdom)",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-1",
                                    "lessonId": "3-6",
                                    "miniAppId": "research-assistant-1",
                                    "componentName": "ResearchAssistantWorkflow",
                                    "route": "/module/3",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language.",
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/ResearchAssistantWorkflow.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-1",
                            "lessonId": "3-7",
                            "title": "3.7 Email & Communication Automation (Your Voice, Scaled)",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-1",
                                    "lessonId": "3-7",
                                    "miniAppId": "email-writer-1",
                                    "componentName": "ProfessionalEmailWriter",
                                    "route": "/module/3",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/ProfessionalEmailWriter.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-1",
                            "lessonId": "3-8",
                            "title": "3.8 Security & Privacy in Personal AI",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-1",
                                    "lessonId": "3-8",
                                    "miniAppId": "privacy-dashboard-1",
                                    "componentName": "PrivacyLensDashboard",
                                    "route": "/module/3",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/PrivacyLensDashboard.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-1",
                            "lessonId": "3-9",
                            "title": "3.9 Capstone 1 Scenario: The \"Crisis at 8 AM\"",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-1",
                                    "lessonId": "3-9",
                                    "miniAppId": "meeting-summarizer-1",
                                    "componentName": "MeetingSummarizer",
                                    "route": "/module/3",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/MeetingSummarizer.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-1",
                            "lessonId": "3-10",
                            "title": "3.10 Preparing for Deployment (The Food Truck Analogy 2.0)",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-1",
                                    "lessonId": "3-10",
                                    "miniAppId": "deployment-quiz-1",
                                    "componentName": "DockerCommandQuiz",
                                    "route": "/module/3",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/DockerCommandQuiz.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-1",
                            "lessonId": "3-11",
                            "title": "3.11 Build The Omni Studio (Implementation)",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "content-only-lesson",
                            "completionMode": "manual",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "needs-binding",
                            "issues": [
                                "No lesson-bound mini-app discovered in curriculumData for this lesson."
                            ],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-1",
                                    "lessonId": "3-11",
                                    "miniAppId": "vanguard-module-3-3-11-manual-artifact-gate",
                                    "componentName": "ManualArtifactGatePlaceholder",
                                    "route": "/module/3",
                                    "runtimeType": "static",
                                    "artifactType": "manual-artifact-gate",
                                    "completionMode": "manual",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Manifest-level placeholder only. Bind to the existing artifact/submission pattern before treating as an interactive mini-app."
                                    ],
                                    "sourceFile": null
                                }
                            ]
                        }
                    ],
                    "miniApps": []
                },
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-3",
                    "sectionId": "part-2",
                    "title": "PART 2: Cognitive Leverage & Decision Systems",
                    "route": "/module/3",
                    "runtimeType": "static",
                    "artifactType": "canonical-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": true,
                    "isWrapperContent": false,
                    "readiness": "ready",
                    "issues": [],
                    "lessons": [
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-2",
                            "lessonId": "3-12",
                            "title": "3.12 Decision Fatigue & The Executive Function Gap",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-2",
                                    "lessonId": "3-12",
                                    "miniAppId": "decision-fatigue-1",
                                    "componentName": "DecisionFatigueMeter",
                                    "route": "/module/3",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/DecisionFatigueMeter.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-2",
                            "lessonId": "3-13",
                            "title": "3.13 The Weighted Decision Matrix (Mathematizing Choice)",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-2",
                                    "lessonId": "3-13",
                                    "miniAppId": "decision-matrix-1",
                                    "componentName": "DecisionMatrixCalculator",
                                    "route": "/module/3",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language.",
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/DecisionMatrixCalculator.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-2",
                            "lessonId": "3-14",
                            "title": "3.14 Simulation Theory (Predicting the Future)",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-2",
                                    "lessonId": "3-14",
                                    "miniAppId": "scenario-simulator-1",
                                    "componentName": "ScenarioSimulator",
                                    "route": "/module/3",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language.",
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/ScenarioSimulator.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-2",
                            "lessonId": "3-15",
                            "title": "3.15 Automating the \"Trivial Many\" (Workflow Automation)",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-2",
                                    "lessonId": "3-15",
                                    "miniAppId": "schedule-planner-1",
                                    "componentName": "SchedulePlanner",
                                    "route": "/module/3",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/SchedulePlanner.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-2",
                            "lessonId": "3-16",
                            "title": "3.16 Bias Detection in Decision Making",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-2",
                                    "lessonId": "3-16",
                                    "miniAppId": "bias-detector-1",
                                    "componentName": "CognitiveBiasDetector",
                                    "route": "/module/3",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/CognitiveBiasDetector.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-2",
                            "lessonId": "3-17",
                            "title": "3.17 The \"Executive Brief\" Protocol (Communication Strategy)",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-2",
                                    "lessonId": "3-17",
                                    "miniAppId": "executive-brief-1",
                                    "componentName": "ExecutiveBriefBuilder",
                                    "route": "/module/3",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Source contains prototype or placeholder language.",
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/ExecutiveBriefBuilder.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-2",
                            "lessonId": "3-18",
                            "title": "3.18 Ethics of Automated Choice (The Human in the Loop Redux)",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-2",
                                    "lessonId": "3-18",
                                    "miniAppId": "ethics-simulator-1",
                                    "componentName": "EthicalDilemmaSimulator",
                                    "route": "/module/3",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/EthicalDilemmaSimulator.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-2",
                            "lessonId": "3-19",
                            "title": "3.19 Advanced Prompt Engineering for Strategy",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-2",
                                    "lessonId": "3-19",
                                    "miniAppId": "prompt-architect-1",
                                    "componentName": "PromptArchitectWorkbench",
                                    "route": "/module/3",
                                    "runtimeType": "webllm",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [
                                        "WebLLM path is device- and browser-dependent and falls back when WebGPU or local model init fails."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/PromptArchitectWorkbench.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-2",
                            "lessonId": "3-20",
                            "title": "3.20 Capstone 2 Scenario: The \"Billion Dollar Pivot\"",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-2",
                                    "lessonId": "3-20",
                                    "miniAppId": "pitch-builder-1",
                                    "componentName": "PitchBuilder",
                                    "route": "/module/3",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/PitchBuilder.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-2",
                            "lessonId": "3-21",
                            "title": "3.21 Deployment 2: The Logic Engine",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-2",
                                    "lessonId": "3-21",
                                    "miniAppId": "deployment-quiz-2",
                                    "componentName": "DockerCommandQuiz",
                                    "route": "/module/3",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module3/components/interactive/DockerCommandQuiz.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-3",
                            "sectionId": "part-2",
                            "lessonId": "3-22",
                            "title": "3.22 Build The Decision Nexus (Implementation)",
                            "route": "/module/3",
                            "runtimeType": "static",
                            "artifactType": "content-only-lesson",
                            "completionMode": "manual",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "needs-binding",
                            "issues": [
                                "No lesson-bound mini-app discovered in curriculumData for this lesson."
                            ],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-3",
                                    "sectionId": "part-2",
                                    "lessonId": "3-22",
                                    "miniAppId": "vanguard-module-3-3-22-manual-artifact-gate",
                                    "componentName": "ManualArtifactGatePlaceholder",
                                    "route": "/module/3",
                                    "runtimeType": "static",
                                    "artifactType": "manual-artifact-gate",
                                    "completionMode": "manual",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "Manifest-level placeholder only. Bind to the existing artifact/submission pattern before treating as an interactive mini-app."
                                    ],
                                    "sourceFile": null
                                }
                            ]
                        }
                    ],
                    "miniApps": []
                }
            ],
            "issues": [
                "Contains 1 top-level content blocks outside the target two-section structure: overview.",
                "Configured progress total (40) does not match discovered trackable section count (25)."
            ]
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "moduleNumber": 4,
            "title": "AI Systems Mastery & Professional Integration",
            "route": "/module/4",
            "trackableTotal": 24,
            "sections": [
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-4",
                    "sectionId": "part-1",
                    "title": "Section 1 — Systems Engineering & Operational Excellence",
                    "route": "/module/4",
                    "runtimeType": "static",
                    "artifactType": "canonical-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": true,
                    "isWrapperContent": false,
                    "readiness": "ready",
                    "issues": [],
                    "lessons": [
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-1",
                            "lessonId": "1-1",
                            "title": "1.1 Systems Synthesis Lab",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-1",
                                    "miniAppId": "blueprint-visualizer-1",
                                    "componentName": "AiSystemsBlueprintVisualizer",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/AiSystemsBlueprintVisualizer.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-1",
                                    "miniAppId": "skytower-architect-1",
                                    "componentName": "SkytowerArchitect",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/SkytowerArchitect.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-1",
                                    "miniAppId": "quiz-4-1",
                                    "componentName": "SectionQuiz",
                                    "route": "/module/4",
                                    "runtimeType": "static",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/SectionQuiz.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-1",
                            "lessonId": "1-2",
                            "title": "1.2 Prompt Systems & Control Flow Optimization",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-2",
                                    "miniAppId": "prompt-health-dashboard-1",
                                    "componentName": "PromptHealthDashboard",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/PromptHealthDashboard.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-2",
                                    "miniAppId": "prompt-mutation-studio-1",
                                    "componentName": "PromptMutationStudio",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/PromptMutationStudio.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-2",
                                    "miniAppId": "quiz-4-2",
                                    "componentName": "SectionQuiz",
                                    "route": "/module/4",
                                    "runtimeType": "static",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/SectionQuiz.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-1",
                            "lessonId": "1-3",
                            "title": "1.3 Agent Framework Comparative Study",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-3",
                                    "miniAppId": "framework-arena-1",
                                    "componentName": "MultiAgentChatSandbox",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/MultiAgentChatSandbox.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-3",
                                    "miniAppId": "agent-system-designer-1",
                                    "componentName": "AgentSystemDesigner",
                                    "route": "/module/4",
                                    "runtimeType": "webllm",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [
                                        "WebLLM path is device- and browser-dependent and falls back when WebGPU or local model init fails."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/AgentSystemDesigner.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-1",
                            "lessonId": "1-4",
                            "title": "1.4 Advanced Memory Design & Semantic Caching",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-4",
                                    "miniAppId": "memory-recall-tuner-1",
                                    "componentName": "MemoryRecallTuner",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/MemoryRecallTuner.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-4",
                                    "miniAppId": "rag-builder-1",
                                    "componentName": "RagBuilder",
                                    "route": "/module/4",
                                    "runtimeType": "simulated-ai",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/RagBuilder.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-4",
                                    "miniAppId": "context-window-explorer-1",
                                    "componentName": "ContextWindowExplorer",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/ContextWindowExplorer.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-4",
                                    "miniAppId": "memory-decay-lab-1",
                                    "componentName": "MemoryDecayLab",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/MemoryDecayLab.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-1",
                            "lessonId": "1-5",
                            "title": "1.5 Data Pipeline Engineering",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-5",
                                    "miniAppId": "pipeline-constructor-1",
                                    "componentName": "DataDecisionFlowchartBuilder",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/DataDecisionFlowchartBuilder.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-5",
                                    "miniAppId": "data-sanity-scanner-1",
                                    "componentName": "DataVisualizer",
                                    "route": "/module/4",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/DataVisualizer.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-1",
                            "lessonId": "1-6",
                            "title": "1.6 Testing & Evaluation Frameworks",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-6",
                                    "miniAppId": "eval-lab-dashboard-1",
                                    "componentName": "RlhfTrainerGame",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/RlhfTrainerGame.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-6",
                                    "miniAppId": "stochasticity-simulator-1",
                                    "componentName": "LossLandscapeNavigator",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/LossLandscapeNavigator.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-6",
                                    "miniAppId": "adversarial-simulator-1",
                                    "componentName": "AdversarialAttackSimulator",
                                    "route": "/module/4",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/AdversarialAttackSimulator.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-1",
                            "lessonId": "1-7",
                            "title": "1.7 Observability & Telemetry",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-7",
                                    "miniAppId": "live-ops-console-1",
                                    "componentName": "FundingPulseTicker",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/FundingPulseTicker.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-7",
                                    "miniAppId": "correlation-explorer-1",
                                    "componentName": "SimplePredictiveModel",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/SimplePredictiveModel.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-1",
                            "lessonId": "1-8",
                            "title": "1.8 Security & Secrets Operations",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-8",
                                    "miniAppId": "breach-drill-simulator-1",
                                    "componentName": "EthicalDilemmaSimulator",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/EthicalDilemmaSimulator.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-8",
                                    "miniAppId": "access-visualizer-1",
                                    "componentName": "LangGraphVisualizer",
                                    "route": "/module/4",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/LangGraphVisualizer.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-8",
                                    "miniAppId": "security-debugger-1",
                                    "componentName": "CodeDebugger",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/CodeDebugger.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-1",
                            "lessonId": "1-9",
                            "title": "1.9 Human-in-the-Loop Governance",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-9",
                                    "miniAppId": "reviewer-queue-sim-1",
                                    "componentName": "RlhfTrainerGame",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/RlhfTrainerGame.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-9",
                                    "miniAppId": "feedback-loop-trainer-1",
                                    "componentName": "PersonalizationSimulator",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/PersonalizationSimulator.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-1",
                            "lessonId": "1-10",
                            "title": "1.10 Incident Response & SLA Engineering",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-10",
                                    "miniAppId": "sla-commander-1",
                                    "componentName": "DockerCommandQuiz",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/DockerCommandQuiz.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-10",
                                    "miniAppId": "post-mortem-generator-1",
                                    "componentName": "MeetingSummarizer",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/MeetingSummarizer.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-1",
                            "lessonId": "1-11",
                            "title": "1.11 Building Activity",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-1",
                                    "lessonId": "1-11",
                                    "miniAppId": "sop-builder-submission",
                                    "componentName": "ProjectSubmission",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/ProjectSubmission.tsx"
                                }
                            ]
                        }
                    ],
                    "miniApps": []
                },
                {
                    "programId": "vanguard",
                    "moduleId": "vanguard-module-4",
                    "sectionId": "part-2",
                    "title": "Section 2 — Governance, Analytics & Future Strategy",
                    "route": "/module/4",
                    "runtimeType": "static",
                    "artifactType": "canonical-section",
                    "completionMode": "section-scroll",
                    "canonicalSection": true,
                    "isWrapperContent": false,
                    "readiness": "ready",
                    "issues": [],
                    "lessons": [
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-2",
                            "lessonId": "2-1",
                            "title": "2.1 Data Analytics & Storytelling",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-1",
                                    "miniAppId": "insight-composer-1",
                                    "componentName": "ExplainabilityPanel",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/ExplainabilityPanel.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-1",
                                    "miniAppId": "insight-sorter-1",
                                    "componentName": "BenefitSorter",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/BenefitSorter.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-2",
                            "lessonId": "2-2",
                            "title": "2.2 Anomaly & Drift Detection",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-2",
                                    "miniAppId": "data-drift-risk-lens-1",
                                    "componentName": "DataDriftRiskLens",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/DataDriftRiskLens.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-2",
                                    "miniAppId": "outlier-detector-1",
                                    "componentName": "AlgorithmVisualizer",
                                    "route": "/module/4",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/AlgorithmVisualizer.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-2",
                            "lessonId": "2-3",
                            "title": "2.3 Cost & Efficiency Optimization",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-3",
                                    "miniAppId": "token-tactician-1",
                                    "componentName": "TokenEconomySimulator",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/TokenEconomySimulator.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-3",
                                    "miniAppId": "energy-tracker-1",
                                    "componentName": "EnergyCarbonTracker",
                                    "route": "/module/4",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "ready",
                                    "issues": [],
                                    "sourceFile": "src/modules/module4/components/interactive/EnergyCarbonTracker.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-2",
                            "lessonId": "2-4",
                            "title": "2.4 Ethics & Bias Audit Lab",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-4",
                                    "miniAppId": "bias-mirror-1",
                                    "componentName": "EthicalBiasMirror",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/EthicalBiasMirror.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-4",
                                    "miniAppId": "style-inspector-1",
                                    "componentName": "EthicalStyleInspector",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/EthicalStyleInspector.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-4",
                                    "miniAppId": "alignment-tuner-1",
                                    "componentName": "AiAlignmentTuner",
                                    "route": "/module/4",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/AiAlignmentTuner.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-2",
                            "lessonId": "2-5",
                            "title": "2.5 Legal & Intellectual Property Workshop",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-5",
                                    "miniAppId": "license-lens-1",
                                    "componentName": "LivePatentRadar",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/LivePatentRadar.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-5",
                                    "miniAppId": "smart-contract-1",
                                    "componentName": "SmartContractEventListener",
                                    "route": "/module/4",
                                    "runtimeType": "local-logic",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "needs-binding",
                                    "issues": [
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/SmartContractEventListener.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-2",
                            "lessonId": "2-6",
                            "title": "2.6 AI Policy & Regulatory Frameworks",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-6",
                                    "miniAppId": "global-policy-atlas-1",
                                    "componentName": "AiEthicsTracker",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/AiEthicsTracker.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-6",
                                    "miniAppId": "privacy-lens-1",
                                    "componentName": "PrivacyLensDashboard",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/PrivacyLensDashboard.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-2",
                            "lessonId": "2-7",
                            "title": "2.7 Governance Pack Assembly",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-7",
                                    "miniAppId": "governance-forge-1",
                                    "componentName": "PitchBuilder",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/PitchBuilder.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-7",
                                    "miniAppId": "business-model-1",
                                    "componentName": "BusinessModelCanvas",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/BusinessModelCanvas.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-2",
                            "lessonId": "2-8",
                            "title": "2.8 Crisis Simulation & Compliance Drill",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-8",
                                    "miniAppId": "crisis-command-center-1",
                                    "componentName": "EthicalDilemmaSimulator",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/EthicalDilemmaSimulator.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-2",
                            "lessonId": "2-9",
                            "title": "2.9 Future-of-Work & Human Role Seminar",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-9",
                                    "miniAppId": "job-shift-visualizer-1",
                                    "componentName": "JobImpactSimulator",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/JobImpactSimulator.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-9",
                                    "miniAppId": "future-poll-1",
                                    "componentName": "FutureScenarioPoll",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/FutureScenarioPoll.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-9",
                                    "miniAppId": "debates-1",
                                    "componentName": "InteractiveDebates",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/InteractiveDebates.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-9",
                                    "miniAppId": "sdg-matcher-1",
                                    "componentName": "SdgMatcher",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "section-scroll",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "No explicit interactive completion hook detected in the component source."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/SdgMatcher.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-9",
                                    "miniAppId": "orbital-habitat-designer-1",
                                    "componentName": "OrbitalHabitatDesigner",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/OrbitalHabitatDesigner.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-2",
                            "lessonId": "2-10",
                            "title": "2.10 Capstone Integration & Credentialing",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-10",
                                    "miniAppId": "governance-card-generator-1",
                                    "componentName": "AiGovernanceCardGenerator",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/AiGovernanceCardGenerator.tsx"
                                },
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-10",
                                    "miniAppId": "chronicle-1",
                                    "componentName": "NeuralEvolutionChronicle",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/NeuralEvolutionChronicle.tsx"
                                }
                            ]
                        },
                        {
                            "programId": "vanguard",
                            "moduleId": "vanguard-module-4",
                            "sectionId": "part-2",
                            "lessonId": "2-11",
                            "title": "2.11 Building Activity",
                            "route": "/module/4",
                            "runtimeType": "static",
                            "artifactType": "lesson",
                            "completionMode": "section-scroll",
                            "canonicalSection": true,
                            "isWrapperContent": false,
                            "readiness": "ready",
                            "issues": [],
                            "miniApps": [
                                {
                                    "programId": "vanguard",
                                    "moduleId": "vanguard-module-4",
                                    "sectionId": "part-2",
                                    "lessonId": "2-11",
                                    "miniAppId": "insight-brief-builder-submission",
                                    "componentName": "ProjectSubmission",
                                    "route": "/module/4",
                                    "runtimeType": "api",
                                    "artifactType": "lesson-mini-app",
                                    "completionMode": "interactive-hook",
                                    "canonicalSection": true,
                                    "isWrapperContent": false,
                                    "readiness": "review",
                                    "issues": [
                                        "Depends on the local API proxy and server-side model credentials to produce live output.",
                                        "Source contains prototype or placeholder language."
                                    ],
                                    "sourceFile": "src/modules/module4/components/interactive/ProjectSubmission.tsx"
                                }
                            ]
                        }
                    ],
                    "miniApps": []
                }
            ],
            "issues": [
                "Configured progress total (60) does not match discovered trackable section count (24)."
            ]
        }
    ],
    "miniApps": [
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "overview",
            "lessonId": "vanguard-module-1-overview-wrapper-content",
            "miniAppId": "hero-intro",
            "componentName": "HeroIntro",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/HeroIntro.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "overview",
            "lessonId": "vanguard-module-1-overview-wrapper-content",
            "miniAppId": "homeschool-roadmap",
            "componentName": "HomeschoolKitRoadmap",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/HomeschoolKitRoadmap.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "overview",
            "lessonId": "vanguard-module-1-overview-wrapper-content",
            "miniAppId": "concept-matrix",
            "componentName": "CourseConceptMatrix",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/CourseConceptMatrix.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "overview",
            "lessonId": "vanguard-module-1-overview-wrapper-content",
            "miniAppId": "paradigm-shift-1",
            "componentName": "ParadigmShiftExplorer",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/ParadigmShiftExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "overview",
            "lessonId": "vanguard-module-1-overview-wrapper-content",
            "miniAppId": "agentic-loop-viz",
            "componentName": "AgenticWorkflowViz",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/AgenticWorkflowViz.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "overview",
            "lessonId": "vanguard-module-1-overview-wrapper-content",
            "miniAppId": "overview-visualizer",
            "componentName": "AiSystemVisualizer",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/AiSystemVisualizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "ai-foundations",
            "lessonId": "vanguard-module-1-ai-foundations-wrapper-content",
            "miniAppId": "neural-playground-1",
            "componentName": "NeuralNetworkPlayground",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/NeuralNetworkPlayground.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "ai-foundations",
            "lessonId": "vanguard-module-1-ai-foundations-wrapper-content",
            "miniAppId": "foundations-chat",
            "componentName": "InteractiveChatbot",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/InteractiveChatbot.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "ai-foundations",
            "lessonId": "vanguard-module-1-ai-foundations-wrapper-content",
            "miniAppId": "foundations-token-viz",
            "componentName": "TokenVisualizer",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/TokenVisualizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "ai-foundations",
            "lessonId": "vanguard-module-1-ai-foundations-wrapper-content",
            "miniAppId": "foundations-probability",
            "componentName": "ProbabilitySelector",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/ProbabilitySelector.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "ai-foundations",
            "lessonId": "vanguard-module-1-ai-foundations-wrapper-content",
            "miniAppId": "foundations-predict",
            "componentName": "SimplePredictiveModel",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/SimplePredictiveModel.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "ai-foundations",
            "lessonId": "vanguard-module-1-ai-foundations-wrapper-content",
            "miniAppId": "foundations-email",
            "componentName": "ProfessionalEmailWriter",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/ProfessionalEmailWriter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "ai-foundations",
            "lessonId": "vanguard-module-1-ai-foundations-wrapper-content",
            "miniAppId": "foundations-poll",
            "componentName": "FutureScenarioPoll",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/FutureScenarioPoll.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "ai-magic-demo",
            "lessonId": "vanguard-module-1-ai-magic-demo-wrapper-content",
            "miniAppId": "magic-demo-image",
            "componentName": "BeginnerImageGen",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/BeginnerImageGen.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "ai-magic-demo",
            "lessonId": "vanguard-module-1-ai-magic-demo-wrapper-content",
            "miniAppId": "magic-demo-app",
            "componentName": "TextToAppGenerator",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/TextToAppGenerator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "ai-models",
            "lessonId": "vanguard-module-1-ai-models-wrapper-content",
            "miniAppId": "model-explorer-1",
            "componentName": "ModelExplorer",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module1/components/interactive/ModelExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-1",
            "miniAppId": "neural-evolution-1",
            "componentName": "NeuralEvolutionChronicle",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/NeuralEvolutionChronicle.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-1",
            "miniAppId": "arms-race-1",
            "componentName": "ModelArmsRaceTimeline",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/ModelArmsRaceTimeline.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-1",
            "miniAppId": "param-universe-1",
            "componentName": "ParameterUniverseExplorer",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module1/components/interactive/ParameterUniverseExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-1",
            "miniAppId": "arch-builder-1",
            "componentName": "ArchitectureBuilderSandbox",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module1/components/interactive/ArchitectureBuilderSandbox.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-1",
            "miniAppId": "api-key-sim-1",
            "componentName": "ApiKeyChatSimulator",
            "route": "/module/1",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module1/components/interactive/ApiKeyChatSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-1",
            "miniAppId": "beginner-chat-1",
            "componentName": "InteractiveChatbot",
            "route": "/module/1",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language.",
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/InteractiveChatbot.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-1",
            "miniAppId": "quiz-1-1",
            "componentName": "SectionQuiz",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/SectionQuiz.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-2",
            "miniAppId": "simple-model-1",
            "componentName": "SimplePredictiveModel",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/SimplePredictiveModel.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-2",
            "miniAppId": "loss-landscape-1",
            "componentName": "LossLandscapeNavigator",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module1/components/interactive/LossLandscapeNavigator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-2",
            "miniAppId": "quiz-1-2",
            "componentName": "SectionQuiz",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/SectionQuiz.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-3",
            "miniAppId": "dilemma-sim-1",
            "componentName": "EthicalDilemmaSimulator",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module1/components/interactive/EthicalDilemmaSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-4",
            "miniAppId": "data-viz-1",
            "componentName": "DataVisualizer",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module1/components/interactive/DataVisualizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-4",
            "miniAppId": "beginner-voice-1",
            "componentName": "VoiceMorphStudio",
            "route": "/module/1",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module1/components/interactive/VoiceMorphStudio.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-5",
            "miniAppId": "adversarial-sim-1",
            "componentName": "AdversarialAttackSimulator",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module1/components/interactive/AdversarialAttackSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-5",
            "miniAppId": "prompt-injection-1",
            "componentName": "PromptInjectionGame",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module1/components/interactive/PromptInjectionGame.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-6",
            "miniAppId": "context-window-1",
            "componentName": "ContextWindowExplorer",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module1/components/interactive/ContextWindowExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-6",
            "miniAppId": "memory-decay-1",
            "componentName": "MemoryDecayLab",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module1/components/interactive/MemoryDecayLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-7",
            "miniAppId": "xai-panel-1",
            "componentName": "ExplainabilityPanel",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module1/components/interactive/ExplainabilityPanel.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-7",
            "miniAppId": "bias-mirror-1",
            "componentName": "EthicalBiasMirror",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module1/components/interactive/EthicalBiasMirror.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-8",
            "miniAppId": "beginner-sum-1",
            "componentName": "MeetingSummarizer",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module1/components/interactive/MeetingSummarizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-9",
            "miniAppId": "energy-tracker-1",
            "componentName": "EnergyCarbonTracker",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module1/components/interactive/EnergyCarbonTracker.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-9",
            "miniAppId": "beginner-priv-1",
            "componentName": "PrivacyLensDashboard",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module1/components/interactive/PrivacyLensDashboard.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-10",
            "miniAppId": "beginner-proj-1",
            "componentName": "PromptMutationStudio",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module1/components/interactive/PromptMutationStudio.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-10",
            "miniAppId": "mastery-check-1-10",
            "componentName": "MasteryCheckGate",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language.",
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/MasteryCheckGate.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-11",
            "miniAppId": "temp-playground-1",
            "componentName": "TemperaturePlayground",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/TemperaturePlayground.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-12",
            "miniAppId": "token-receipt-1",
            "componentName": "TokenReceiptPrinter",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language.",
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/TokenReceiptPrinter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-13",
            "miniAppId": "json-surgeon-1",
            "componentName": "JsonSurgeon",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language.",
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/JsonSurgeon.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-14",
            "miniAppId": "agent-sim-1",
            "componentName": "MiniAgentSimulator",
            "route": "/module/1",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/MiniAgentSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-15",
            "miniAppId": "semantic-search-1",
            "componentName": "SemanticSearchLab",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language.",
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/SemanticSearchLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-16",
            "miniAppId": "approach-tree-1",
            "componentName": "ApproachDecisionTree",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language.",
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/ApproachDecisionTree.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-17",
            "miniAppId": "red-team-1",
            "componentName": "RedTeamBot",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language.",
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/RedTeamBot.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-18",
            "miniAppId": "prompt-tester-1",
            "componentName": "PromptUnitTester",
            "route": "/module/1",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/PromptUnitTester.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-19",
            "miniAppId": "model-picker-1",
            "componentName": "ModelPickerLab",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/ModelPickerLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-20",
            "miniAppId": "credential-mint-1",
            "componentName": "CredentialMintPreview",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/CredentialMintPreview.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-21",
            "miniAppId": "vanguard-module-1-1-21-manual-artifact-gate",
            "componentName": "ManualArtifactGatePlaceholder",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "manual-artifact-gate",
            "completionMode": "manual",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Manifest-level placeholder only. Bind to the existing artifact/submission pattern before treating as an interactive mini-app."
            ],
            "sourceFile": null
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-22",
            "miniAppId": "quiz-1-exit",
            "componentName": "SectionQuiz",
            "route": "/module/1",
            "runtimeType": "static",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/SectionQuiz.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-1",
            "miniAppId": "diffusion-explorer-1",
            "componentName": "DiffusionFieldExplorer",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module1/components/interactive/DiffusionFieldExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-1",
            "miniAppId": "int-prompt-2",
            "componentName": "PromptArchitectWorkbench",
            "route": "/module/1",
            "runtimeType": "webllm",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [
                "WebLLM path is device- and browser-dependent and falls back when WebGPU or local model init fails."
            ],
            "sourceFile": "src/modules/module1/components/interactive/PromptArchitectWorkbench.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-2",
            "miniAppId": "prompt-architect-1",
            "componentName": "PromptArchitectWorkbench",
            "route": "/module/1",
            "runtimeType": "webllm",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [
                "WebLLM path is device- and browser-dependent and falls back when WebGPU or local model init fails."
            ],
            "sourceFile": "src/modules/module1/components/interactive/PromptArchitectWorkbench.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-2",
            "miniAppId": "int-model-2",
            "componentName": "ModelExplorer",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module1/components/interactive/ModelExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-3",
            "miniAppId": "compositor-canvas-1",
            "componentName": "CompositorCanvasPro",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module1/components/interactive/CompositorCanvasPro.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-3",
            "miniAppId": "scene-director-1",
            "componentName": "SceneDirectorXR",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module1/components/interactive/SceneDirectorXR.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-3",
            "miniAppId": "pattern-synth-1",
            "componentName": "PatternGenomeSynthesizer",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module1/components/interactive/PatternGenomeSynthesizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-3",
            "miniAppId": "lighting-lab-1",
            "componentName": "LightingPhysicsLab",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module1/components/interactive/LightingPhysicsLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-3",
            "miniAppId": "style-inspector-1",
            "componentName": "EthicalStyleInspector",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module1/components/interactive/EthicalStyleInspector.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-3",
            "miniAppId": "int-flow-2",
            "componentName": "DataDecisionFlowchartBuilder",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module1/components/interactive/DataDecisionFlowchartBuilder.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-4",
            "miniAppId": "melody-maker-1",
            "componentName": "MelodyMakerAI",
            "route": "/module/1",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module1/components/interactive/MelodyMakerAI.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-4",
            "miniAppId": "voice-morph-1",
            "componentName": "VoiceMorphStudio",
            "route": "/module/1",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module1/components/interactive/VoiceMorphStudio.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-4",
            "miniAppId": "ambient-architect-1",
            "componentName": "AmbientArchitect",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module1/components/interactive/AmbientArchitect.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-4",
            "miniAppId": "speech-analyzer-1",
            "componentName": "SpeechEmotionAnalyzer",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module1/components/interactive/SpeechEmotionAnalyzer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-4",
            "miniAppId": "av-sync-lab-1",
            "componentName": "AudioVisualSyncLab",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module1/components/interactive/AudioVisualSyncLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-4",
            "miniAppId": "int-doc-2",
            "componentName": "ContextWindowExplorer",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module1/components/interactive/ContextWindowExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-5",
            "miniAppId": "storyboard-forge-1",
            "componentName": "StoryboardForgePlus",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module1/components/interactive/StoryboardForgePlus.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-5",
            "miniAppId": "motion-physics-1",
            "componentName": "MotionPhysicsPlayground",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module1/components/interactive/MotionPhysicsPlayground.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-5",
            "miniAppId": "prompt-sequencer-1",
            "componentName": "CinematicPromptSequencer",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module1/components/interactive/CinematicPromptSequencer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-5",
            "miniAppId": "gesture-animator-1",
            "componentName": "GestureAnimator",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module1/components/interactive/GestureAnimator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-5",
            "miniAppId": "voice-editor-1",
            "componentName": "VoiceDrivenEditingDesk",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module1/components/interactive/VoiceDrivenEditingDesk.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-5",
            "miniAppId": "int-light-2",
            "componentName": "LightingPhysicsLab",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module1/components/interactive/LightingPhysicsLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-6",
            "miniAppId": "dreamspace-1",
            "componentName": "DreamspaceConstructor",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module1/components/interactive/DreamspaceConstructor.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-6",
            "miniAppId": "soundfield-composer-1",
            "componentName": "SoundfieldComposer",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module1/components/interactive/SoundfieldComposer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-7",
            "miniAppId": "interactive-debates-1",
            "componentName": "InteractiveDebates",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module1/components/interactive/InteractiveDebates.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-8",
            "miniAppId": "int-graph-2",
            "componentName": "LangGraphVisualizer",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/LangGraphVisualizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-9",
            "miniAppId": "int-pitch-2",
            "componentName": "PitchBuilder",
            "route": "/module/1",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module1/components/interactive/PitchBuilder.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-10",
            "miniAppId": "future-poll-2",
            "componentName": "FutureScenarioPoll",
            "route": "/module/1",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module1/components/interactive/FutureScenarioPoll.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "overview",
            "lessonId": "vanguard-module-2-overview-wrapper-content",
            "miniAppId": "hero-intro-mod2",
            "componentName": "HeroIntroMod2",
            "route": "/module/2",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module2/components/interactive/HeroIntroMod2.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-1",
            "lessonId": "1-1",
            "miniAppId": "agent-anatomy-1",
            "componentName": "AgentSystemDesigner",
            "route": "/module/2",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module2/components/interactive/AgentSystemDesigner.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-1",
            "lessonId": "1-2",
            "miniAppId": "plan-graph-simulator-1",
            "componentName": "LangGraphVisualizer",
            "route": "/module/2",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module2/components/interactive/LangGraphVisualizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-1",
            "lessonId": "1-3",
            "miniAppId": "memory-vault-xr-1",
            "componentName": "MemoryVaultXR",
            "route": "/module/2",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module2/components/interactive/MemoryVaultXR.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-1",
            "lessonId": "1-3",
            "miniAppId": "memory-decay-lab-1",
            "componentName": "MemoryDecayLab",
            "route": "/module/2",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module2/components/interactive/MemoryDecayLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-1",
            "lessonId": "1-4",
            "miniAppId": "tool-call-dashboard-1",
            "componentName": "ToolCallDashboard",
            "route": "/module/2",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module2/components/interactive/ToolCallDashboard.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-1",
            "lessonId": "1-5",
            "miniAppId": "goal-forge-1",
            "componentName": "SchedulePlanner",
            "route": "/module/2",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module2/components/interactive/SchedulePlanner.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-1",
            "lessonId": "1-6",
            "miniAppId": "team-matrix-1",
            "componentName": "MultiAgentChatSandbox",
            "route": "/module/2",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module2/components/interactive/MultiAgentChatSandbox.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-1",
            "lessonId": "1-7",
            "miniAppId": "feedback-trainer-1",
            "componentName": "RlhfTrainerGame",
            "route": "/module/2",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module2/components/interactive/RlhfTrainerGame.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-1",
            "lessonId": "1-8",
            "miniAppId": "red-team-lab-1",
            "componentName": "AdversarialAttackSimulator",
            "route": "/module/2",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module2/components/interactive/AdversarialAttackSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-1",
            "lessonId": "1-9",
            "miniAppId": "ci-cd-pipeline-1",
            "componentName": "AgentCiCdPipeline",
            "route": "/module/2",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module2/components/interactive/AgentCiCdPipeline.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-1",
            "lessonId": "1-10",
            "miniAppId": "capstone-1-agent",
            "componentName": "CapstoneAgentBuilder",
            "route": "/module/2",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module2/components/interactive/CapstoneAgentBuilder.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-1",
            "lessonId": "1-11",
            "miniAppId": "hf-guide-1-11",
            "componentName": "HuggingFaceGuide",
            "route": "/module/2",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module2/components/interactive/HuggingFaceGuide.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-1",
            "miniAppId": "orchestration-canvas-1",
            "componentName": "DataDecisionFlowchartBuilder",
            "route": "/module/2",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module2/components/interactive/DataDecisionFlowchartBuilder.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-1",
            "miniAppId": "quiz-2-1",
            "componentName": "SectionQuiz",
            "route": "/module/2",
            "runtimeType": "static",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module2/components/interactive/SectionQuiz.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-2",
            "miniAppId": "rag-builder-pro-1",
            "componentName": "RagBuilder",
            "route": "/module/2",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module2/components/interactive/RagBuilder.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-2",
            "miniAppId": "quiz-2-2",
            "componentName": "SectionQuiz",
            "route": "/module/2",
            "runtimeType": "static",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module2/components/interactive/SectionQuiz.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-3",
            "miniAppId": "multi-modal-lab-1",
            "componentName": "AudioVisualSyncLab",
            "route": "/module/2",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module2/components/interactive/AudioVisualSyncLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-3",
            "miniAppId": "video-analyst-1",
            "componentName": "VideoAnalystPro",
            "route": "/module/2",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module2/components/interactive/VideoAnalystPro.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-4",
            "miniAppId": "event-ops-lab-1",
            "componentName": "EventOpsLab",
            "route": "/module/2",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module2/components/interactive/EventOpsLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-5",
            "miniAppId": "hitl-lab-1",
            "componentName": "HitlLab",
            "route": "/module/2",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module2/components/interactive/HitlLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-5",
            "miniAppId": "hitl-rag-1",
            "componentName": "HitlRagSimulator",
            "route": "/module/2",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module2/components/interactive/HitlRagSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-6",
            "miniAppId": "gov-decision-1",
            "componentName": "GovernanceDecisionSimulator",
            "route": "/module/2",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module2/components/interactive/GovernanceDecisionSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-6",
            "miniAppId": "transparency-score-1",
            "componentName": "TransparencyScorecard",
            "route": "/module/2",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module2/components/interactive/TransparencyScorecard.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-6",
            "miniAppId": "audit-log-1",
            "componentName": "DecisionAuditLog",
            "route": "/module/2",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module2/components/interactive/DecisionAuditLog.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-6",
            "miniAppId": "privacy-lens-1",
            "componentName": "PrivacyLensDashboard",
            "route": "/module/2",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module2/components/interactive/PrivacyLensDashboard.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-7",
            "miniAppId": "token-economy-2",
            "componentName": "TokenEconomySimulator",
            "route": "/module/2",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module2/components/interactive/TokenEconomySimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-8",
            "miniAppId": "jurisdiction-rag-1",
            "componentName": "JurisdictionAwareRag",
            "route": "/module/2",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module2/components/interactive/JurisdictionAwareRag.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-8",
            "miniAppId": "global-policy-map-1",
            "componentName": "GlobalPolicyMap",
            "route": "/module/2",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module2/components/interactive/GlobalPolicyMap.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-8",
            "miniAppId": "patent-radar-1",
            "componentName": "LivePatentRadar",
            "route": "/module/2",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module2/components/interactive/LivePatentRadar.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-9",
            "miniAppId": "symbolic-logic-1",
            "componentName": "AlgorithmVisualizer",
            "route": "/module/2",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module2/components/interactive/AlgorithmVisualizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-9",
            "miniAppId": "future-tech-lab-1",
            "componentName": "NeuroSymbolicQuantumLab",
            "route": "/module/2",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module2/components/interactive/NeuroSymbolicQuantumLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-10",
            "miniAppId": "capstone-2-architect",
            "componentName": "CapstoneOrgArchitect",
            "route": "/module/2",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module2/components/interactive/CapstoneOrgArchitect.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-11",
            "miniAppId": "hf-guide-1",
            "componentName": "HuggingFaceGuide",
            "route": "/module/2",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module2/components/interactive/HuggingFaceGuide.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-11",
            "miniAppId": "fuel-orbs-1",
            "componentName": "FuelOrbs",
            "route": "/module/2",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module2/components/interactive/FuelOrbs.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "overview",
            "lessonId": "vanguard-module-3-overview-wrapper-content",
            "miniAppId": "hero-intro-mod3",
            "componentName": "HeroIntroMod3",
            "route": "/module/3",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module3/components/interactive/HeroIntroMod3.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "overview",
            "lessonId": "vanguard-module-3-overview-wrapper-content",
            "miniAppId": "fact-of-the-day",
            "componentName": "FactOfTheDay",
            "route": "/module/3",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module3/components/interactive/FactOfTheDay.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "overview",
            "lessonId": "vanguard-module-3-overview-wrapper-content",
            "miniAppId": "ai-puzzle-challenge",
            "componentName": "AIPuzzle",
            "route": "/module/3",
            "runtimeType": "static",
            "artifactType": "wrapper-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": false,
            "isWrapperContent": true,
            "readiness": "review",
            "issues": [
                "Wrapper mini-app lives outside the canonical 4x2 Arsenal ingestion structure; preserve in Vanguard until explicitly rebound or retired."
            ],
            "sourceFile": "src/modules/module3/components/interactive/AIPuzzle.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-1",
            "miniAppId": "memory-decay-lab-1",
            "componentName": "MemoryDecayLab",
            "route": "/module/3",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module3/components/interactive/MemoryDecayLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-1",
            "miniAppId": "quiz-3-1",
            "componentName": "SectionQuiz",
            "route": "/module/3",
            "runtimeType": "static",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module3/components/interactive/SectionQuiz.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-2",
            "miniAppId": "digital-janitor-lab-1",
            "componentName": "DigitalJanitorLab",
            "route": "/module/3",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language.",
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module3/components/interactive/DigitalJanitorLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-2",
            "miniAppId": "quiz-3-2",
            "componentName": "SectionQuiz",
            "route": "/module/3",
            "runtimeType": "static",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module3/components/interactive/SectionQuiz.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-3",
            "miniAppId": "rag-builder-1",
            "componentName": "RagBuilder",
            "route": "/module/3",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module3/components/interactive/RagBuilder.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-4",
            "miniAppId": "fact-checker-1",
            "componentName": "FactCheckerSimulator",
            "route": "/module/3",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module3/components/interactive/FactCheckerSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-5",
            "miniAppId": "knowledge-graph-1",
            "componentName": "KnowledgeGraphBuilder",
            "route": "/module/3",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language.",
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module3/components/interactive/KnowledgeGraphBuilder.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-6",
            "miniAppId": "research-assistant-1",
            "componentName": "ResearchAssistantWorkflow",
            "route": "/module/3",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language.",
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module3/components/interactive/ResearchAssistantWorkflow.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-7",
            "miniAppId": "email-writer-1",
            "componentName": "ProfessionalEmailWriter",
            "route": "/module/3",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module3/components/interactive/ProfessionalEmailWriter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-8",
            "miniAppId": "privacy-dashboard-1",
            "componentName": "PrivacyLensDashboard",
            "route": "/module/3",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module3/components/interactive/PrivacyLensDashboard.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-9",
            "miniAppId": "meeting-summarizer-1",
            "componentName": "MeetingSummarizer",
            "route": "/module/3",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module3/components/interactive/MeetingSummarizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-10",
            "miniAppId": "deployment-quiz-1",
            "componentName": "DockerCommandQuiz",
            "route": "/module/3",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module3/components/interactive/DockerCommandQuiz.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-11",
            "miniAppId": "vanguard-module-3-3-11-manual-artifact-gate",
            "componentName": "ManualArtifactGatePlaceholder",
            "route": "/module/3",
            "runtimeType": "static",
            "artifactType": "manual-artifact-gate",
            "completionMode": "manual",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Manifest-level placeholder only. Bind to the existing artifact/submission pattern before treating as an interactive mini-app."
            ],
            "sourceFile": null
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-12",
            "miniAppId": "decision-fatigue-1",
            "componentName": "DecisionFatigueMeter",
            "route": "/module/3",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module3/components/interactive/DecisionFatigueMeter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-13",
            "miniAppId": "decision-matrix-1",
            "componentName": "DecisionMatrixCalculator",
            "route": "/module/3",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language.",
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module3/components/interactive/DecisionMatrixCalculator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-14",
            "miniAppId": "scenario-simulator-1",
            "componentName": "ScenarioSimulator",
            "route": "/module/3",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language.",
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module3/components/interactive/ScenarioSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-15",
            "miniAppId": "schedule-planner-1",
            "componentName": "SchedulePlanner",
            "route": "/module/3",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module3/components/interactive/SchedulePlanner.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-16",
            "miniAppId": "bias-detector-1",
            "componentName": "CognitiveBiasDetector",
            "route": "/module/3",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module3/components/interactive/CognitiveBiasDetector.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-17",
            "miniAppId": "executive-brief-1",
            "componentName": "ExecutiveBriefBuilder",
            "route": "/module/3",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Source contains prototype or placeholder language.",
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module3/components/interactive/ExecutiveBriefBuilder.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-18",
            "miniAppId": "ethics-simulator-1",
            "componentName": "EthicalDilemmaSimulator",
            "route": "/module/3",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module3/components/interactive/EthicalDilemmaSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-19",
            "miniAppId": "prompt-architect-1",
            "componentName": "PromptArchitectWorkbench",
            "route": "/module/3",
            "runtimeType": "webllm",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [
                "WebLLM path is device- and browser-dependent and falls back when WebGPU or local model init fails."
            ],
            "sourceFile": "src/modules/module3/components/interactive/PromptArchitectWorkbench.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-20",
            "miniAppId": "pitch-builder-1",
            "componentName": "PitchBuilder",
            "route": "/module/3",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module3/components/interactive/PitchBuilder.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-21",
            "miniAppId": "deployment-quiz-2",
            "componentName": "DockerCommandQuiz",
            "route": "/module/3",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module3/components/interactive/DockerCommandQuiz.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-22",
            "miniAppId": "vanguard-module-3-3-22-manual-artifact-gate",
            "componentName": "ManualArtifactGatePlaceholder",
            "route": "/module/3",
            "runtimeType": "static",
            "artifactType": "manual-artifact-gate",
            "completionMode": "manual",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "Manifest-level placeholder only. Bind to the existing artifact/submission pattern before treating as an interactive mini-app."
            ],
            "sourceFile": null
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-1",
            "miniAppId": "blueprint-visualizer-1",
            "componentName": "AiSystemsBlueprintVisualizer",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module4/components/interactive/AiSystemsBlueprintVisualizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-1",
            "miniAppId": "skytower-architect-1",
            "componentName": "SkytowerArchitect",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/SkytowerArchitect.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-1",
            "miniAppId": "quiz-4-1",
            "componentName": "SectionQuiz",
            "route": "/module/4",
            "runtimeType": "static",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module4/components/interactive/SectionQuiz.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-2",
            "miniAppId": "prompt-health-dashboard-1",
            "componentName": "PromptHealthDashboard",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/PromptHealthDashboard.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-2",
            "miniAppId": "prompt-mutation-studio-1",
            "componentName": "PromptMutationStudio",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module4/components/interactive/PromptMutationStudio.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-2",
            "miniAppId": "quiz-4-2",
            "componentName": "SectionQuiz",
            "route": "/module/4",
            "runtimeType": "static",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module4/components/interactive/SectionQuiz.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-3",
            "miniAppId": "framework-arena-1",
            "componentName": "MultiAgentChatSandbox",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module4/components/interactive/MultiAgentChatSandbox.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-3",
            "miniAppId": "agent-system-designer-1",
            "componentName": "AgentSystemDesigner",
            "route": "/module/4",
            "runtimeType": "webllm",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [
                "WebLLM path is device- and browser-dependent and falls back when WebGPU or local model init fails."
            ],
            "sourceFile": "src/modules/module4/components/interactive/AgentSystemDesigner.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-4",
            "miniAppId": "memory-recall-tuner-1",
            "componentName": "MemoryRecallTuner",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/MemoryRecallTuner.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-4",
            "miniAppId": "rag-builder-1",
            "componentName": "RagBuilder",
            "route": "/module/4",
            "runtimeType": "simulated-ai",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module4/components/interactive/RagBuilder.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-4",
            "miniAppId": "context-window-explorer-1",
            "componentName": "ContextWindowExplorer",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module4/components/interactive/ContextWindowExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-4",
            "miniAppId": "memory-decay-lab-1",
            "componentName": "MemoryDecayLab",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module4/components/interactive/MemoryDecayLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-5",
            "miniAppId": "pipeline-constructor-1",
            "componentName": "DataDecisionFlowchartBuilder",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/DataDecisionFlowchartBuilder.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-5",
            "miniAppId": "data-sanity-scanner-1",
            "componentName": "DataVisualizer",
            "route": "/module/4",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module4/components/interactive/DataVisualizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-6",
            "miniAppId": "eval-lab-dashboard-1",
            "componentName": "RlhfTrainerGame",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/RlhfTrainerGame.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-6",
            "miniAppId": "stochasticity-simulator-1",
            "componentName": "LossLandscapeNavigator",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/LossLandscapeNavigator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-6",
            "miniAppId": "adversarial-simulator-1",
            "componentName": "AdversarialAttackSimulator",
            "route": "/module/4",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module4/components/interactive/AdversarialAttackSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-7",
            "miniAppId": "live-ops-console-1",
            "componentName": "FundingPulseTicker",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/FundingPulseTicker.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-7",
            "miniAppId": "correlation-explorer-1",
            "componentName": "SimplePredictiveModel",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module4/components/interactive/SimplePredictiveModel.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-8",
            "miniAppId": "breach-drill-simulator-1",
            "componentName": "EthicalDilemmaSimulator",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/EthicalDilemmaSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-8",
            "miniAppId": "access-visualizer-1",
            "componentName": "LangGraphVisualizer",
            "route": "/module/4",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module4/components/interactive/LangGraphVisualizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-8",
            "miniAppId": "security-debugger-1",
            "componentName": "CodeDebugger",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/CodeDebugger.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-9",
            "miniAppId": "reviewer-queue-sim-1",
            "componentName": "RlhfTrainerGame",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/RlhfTrainerGame.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-9",
            "miniAppId": "feedback-loop-trainer-1",
            "componentName": "PersonalizationSimulator",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/PersonalizationSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-10",
            "miniAppId": "sla-commander-1",
            "componentName": "DockerCommandQuiz",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/DockerCommandQuiz.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-10",
            "miniAppId": "post-mortem-generator-1",
            "componentName": "MeetingSummarizer",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module4/components/interactive/MeetingSummarizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-11",
            "miniAppId": "sop-builder-submission",
            "componentName": "ProjectSubmission",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module4/components/interactive/ProjectSubmission.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-1",
            "miniAppId": "insight-composer-1",
            "componentName": "ExplainabilityPanel",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module4/components/interactive/ExplainabilityPanel.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-1",
            "miniAppId": "insight-sorter-1",
            "componentName": "BenefitSorter",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/BenefitSorter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-2",
            "miniAppId": "data-drift-risk-lens-1",
            "componentName": "DataDriftRiskLens",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/DataDriftRiskLens.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-2",
            "miniAppId": "outlier-detector-1",
            "componentName": "AlgorithmVisualizer",
            "route": "/module/4",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module4/components/interactive/AlgorithmVisualizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-3",
            "miniAppId": "token-tactician-1",
            "componentName": "TokenEconomySimulator",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/TokenEconomySimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-3",
            "miniAppId": "energy-tracker-1",
            "componentName": "EnergyCarbonTracker",
            "route": "/module/4",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "ready",
            "issues": [],
            "sourceFile": "src/modules/module4/components/interactive/EnergyCarbonTracker.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-4",
            "miniAppId": "bias-mirror-1",
            "componentName": "EthicalBiasMirror",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module4/components/interactive/EthicalBiasMirror.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-4",
            "miniAppId": "style-inspector-1",
            "componentName": "EthicalStyleInspector",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/EthicalStyleInspector.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-4",
            "miniAppId": "alignment-tuner-1",
            "componentName": "AiAlignmentTuner",
            "route": "/module/4",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module4/components/interactive/AiAlignmentTuner.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-5",
            "miniAppId": "license-lens-1",
            "componentName": "LivePatentRadar",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/LivePatentRadar.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-5",
            "miniAppId": "smart-contract-1",
            "componentName": "SmartContractEventListener",
            "route": "/module/4",
            "runtimeType": "local-logic",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "needs-binding",
            "issues": [
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module4/components/interactive/SmartContractEventListener.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-6",
            "miniAppId": "global-policy-atlas-1",
            "componentName": "AiEthicsTracker",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/AiEthicsTracker.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-6",
            "miniAppId": "privacy-lens-1",
            "componentName": "PrivacyLensDashboard",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module4/components/interactive/PrivacyLensDashboard.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-7",
            "miniAppId": "governance-forge-1",
            "componentName": "PitchBuilder",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module4/components/interactive/PitchBuilder.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-7",
            "miniAppId": "business-model-1",
            "componentName": "BusinessModelCanvas",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module4/components/interactive/BusinessModelCanvas.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-8",
            "miniAppId": "crisis-command-center-1",
            "componentName": "EthicalDilemmaSimulator",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/EthicalDilemmaSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-9",
            "miniAppId": "job-shift-visualizer-1",
            "componentName": "JobImpactSimulator",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/JobImpactSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-9",
            "miniAppId": "future-poll-1",
            "componentName": "FutureScenarioPoll",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/FutureScenarioPoll.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-9",
            "miniAppId": "debates-1",
            "componentName": "InteractiveDebates",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/InteractiveDebates.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-9",
            "miniAppId": "sdg-matcher-1",
            "componentName": "SdgMatcher",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "section-scroll",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "No explicit interactive completion hook detected in the component source."
            ],
            "sourceFile": "src/modules/module4/components/interactive/SdgMatcher.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-9",
            "miniAppId": "orbital-habitat-designer-1",
            "componentName": "OrbitalHabitatDesigner",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/OrbitalHabitatDesigner.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-10",
            "miniAppId": "governance-card-generator-1",
            "componentName": "AiGovernanceCardGenerator",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/AiGovernanceCardGenerator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-10",
            "miniAppId": "chronicle-1",
            "componentName": "NeuralEvolutionChronicle",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output."
            ],
            "sourceFile": "src/modules/module4/components/interactive/NeuralEvolutionChronicle.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-11",
            "miniAppId": "insight-brief-builder-submission",
            "componentName": "ProjectSubmission",
            "route": "/module/4",
            "runtimeType": "api",
            "artifactType": "lesson-mini-app",
            "completionMode": "interactive-hook",
            "canonicalSection": true,
            "isWrapperContent": false,
            "readiness": "review",
            "issues": [
                "Depends on the local API proxy and server-side model credentials to produce live output.",
                "Source contains prototype or placeholder language."
            ],
            "sourceFile": "src/modules/module4/components/interactive/ProjectSubmission.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-agentsystemdesigner",
            "componentName": "AgentSystemDesigner",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/AgentSystemDesigner.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-aialignmenttuner",
            "componentName": "AiAlignmentTuner",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/AiAlignmentTuner.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-aiethicstracker",
            "componentName": "AiEthicsTracker",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/AiEthicsTracker.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-aipalettesynthesizer",
            "componentName": "AiPaletteSynthesizer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/AiPaletteSynthesizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-algorithmvisualizer",
            "componentName": "AlgorithmVisualizer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/AlgorithmVisualizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-benefitsorter",
            "componentName": "BenefitSorter",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/BenefitSorter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-blockchainexplorer",
            "componentName": "BlockchainExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/BlockchainExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-businessmodelcanvas",
            "componentName": "BusinessModelCanvas",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/BusinessModelCanvas.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-codedebugger",
            "componentName": "CodeDebugger",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/CodeDebugger.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-dockercommandquiz",
            "componentName": "DockerCommandQuiz",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/DockerCommandQuiz.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-emotionblendmixer",
            "componentName": "EmotionBlendMixer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/EmotionBlendMixer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-featureexplorer",
            "componentName": "FeatureExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/FeatureExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-fundingpulseticker",
            "componentName": "FundingPulseTicker",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/FundingPulseTicker.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-generativesculptor3d",
            "componentName": "GenerativeSculptor3D",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/GenerativeSculptor3D.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-imagepromptenhancer",
            "componentName": "ImagePromptEnhancer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/ImagePromptEnhancer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-jobimpactsimulator",
            "componentName": "JobImpactSimulator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/JobImpactSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-livepatentradar",
            "componentName": "LivePatentRadar",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/LivePatentRadar.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-multiagentchatsandbox",
            "componentName": "MultiAgentChatSandbox",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/MultiAgentChatSandbox.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-pedagogymatcher",
            "componentName": "PedagogyMatcher",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/PedagogyMatcher.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-personalizationsimulator",
            "componentName": "PersonalizationSimulator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/PersonalizationSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-physicspainter",
            "componentName": "PhysicsPainter",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/PhysicsPainter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-poeticfusiongenerator",
            "componentName": "PoeticFusionGenerator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/PoeticFusionGenerator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-ragbuilder",
            "componentName": "RagBuilder",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/RagBuilder.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-rlhftrainergame",
            "componentName": "RlhfTrainerGame",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/RlhfTrainerGame.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-robotsimulator",
            "componentName": "RobotSimulator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/RobotSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-scheduleplanner",
            "componentName": "SchedulePlanner",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/SchedulePlanner.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-sdgmatcher",
            "componentName": "SdgMatcher",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/SdgMatcher.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-sensordatainterpreter",
            "componentName": "SensorDataInterpreter",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/SensorDataInterpreter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-smartcontracteventlistener",
            "componentName": "SmartContractEventListener",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/SmartContractEventListener.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-spatialnarrativeengine",
            "componentName": "SpatialNarrativeEngine",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/SpatialNarrativeEngine.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-texturealchemylab",
            "componentName": "TextureAlchemyLab",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/TextureAlchemyLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-tokeneconomysimulator",
            "componentName": "TokenEconomySimulator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/TokenEconomySimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-uifeedback",
            "componentName": "UiFeedback",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/UiFeedback.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-1",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module1-vocabularylockin",
            "componentName": "VocabularyLockIn",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module1/components/interactive/VocabularyLockIn.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-aialignmenttuner",
            "componentName": "AiAlignmentTuner",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/AiAlignmentTuner.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-aiethicstracker",
            "componentName": "AiEthicsTracker",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/AiEthicsTracker.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-aipalettesynthesizer",
            "componentName": "AiPaletteSynthesizer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/AiPaletteSynthesizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-ambientarchitect",
            "componentName": "AmbientArchitect",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/AmbientArchitect.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-architecturebuildersandbox",
            "componentName": "ArchitectureBuilderSandbox",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/ArchitectureBuilderSandbox.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-benefitsorter",
            "componentName": "BenefitSorter",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/BenefitSorter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-blockchainexplorer",
            "componentName": "BlockchainExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/BlockchainExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-businessmodelcanvas",
            "componentName": "BusinessModelCanvas",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/BusinessModelCanvas.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-cinematicpromptsequencer",
            "componentName": "CinematicPromptSequencer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/CinematicPromptSequencer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-codedebugger",
            "componentName": "CodeDebugger",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/CodeDebugger.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-compositorcanvaspro",
            "componentName": "CompositorCanvasPro",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/CompositorCanvasPro.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-contextwindowexplorer",
            "componentName": "ContextWindowExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/ContextWindowExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-datavisualizer",
            "componentName": "DataVisualizer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/DataVisualizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-diffusionfieldexplorer",
            "componentName": "DiffusionFieldExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/DiffusionFieldExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-dockercommandquiz",
            "componentName": "DockerCommandQuiz",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/DockerCommandQuiz.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-dreamspaceconstructor",
            "componentName": "DreamspaceConstructor",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/DreamspaceConstructor.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-emotionblendmixer",
            "componentName": "EmotionBlendMixer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/EmotionBlendMixer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-energycarbontracker",
            "componentName": "EnergyCarbonTracker",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/EnergyCarbonTracker.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-ethicalbiasmirror",
            "componentName": "EthicalBiasMirror",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/EthicalBiasMirror.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-ethicaldilemmasimulator",
            "componentName": "EthicalDilemmaSimulator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/EthicalDilemmaSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-ethicalstyleinspector",
            "componentName": "EthicalStyleInspector",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/EthicalStyleInspector.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-explainabilitypanel",
            "componentName": "ExplainabilityPanel",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/ExplainabilityPanel.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-featureexplorer",
            "componentName": "FeatureExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/FeatureExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-fundingpulseticker",
            "componentName": "FundingPulseTicker",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/FundingPulseTicker.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-futurescenariopoll",
            "componentName": "FutureScenarioPoll",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/FutureScenarioPoll.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-generativesculptor3d",
            "componentName": "GenerativeSculptor3D",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/GenerativeSculptor3D.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-gestureanimator",
            "componentName": "GestureAnimator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/GestureAnimator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-imagepromptenhancer",
            "componentName": "ImagePromptEnhancer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/ImagePromptEnhancer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-interactivechatbot",
            "componentName": "InteractiveChatbot",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/InteractiveChatbot.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-interactivedebates",
            "componentName": "InteractiveDebates",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/InteractiveDebates.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-jobimpactsimulator",
            "componentName": "JobImpactSimulator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/JobImpactSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-lightingphysicslab",
            "componentName": "LightingPhysicsLab",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/LightingPhysicsLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-losslandscapenavigator",
            "componentName": "LossLandscapeNavigator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/LossLandscapeNavigator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-meetingsummarizer",
            "componentName": "MeetingSummarizer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/MeetingSummarizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-melodymakerai",
            "componentName": "MelodyMakerAI",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/MelodyMakerAI.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-modelarmsracetimeline",
            "componentName": "ModelArmsRaceTimeline",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/ModelArmsRaceTimeline.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-motionphysicsplayground",
            "componentName": "MotionPhysicsPlayground",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/MotionPhysicsPlayground.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-neuralevolutionchronicle",
            "componentName": "NeuralEvolutionChronicle",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/NeuralEvolutionChronicle.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-parameteruniverseexplorer",
            "componentName": "ParameterUniverseExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/ParameterUniverseExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-patterngenomesynthesizer",
            "componentName": "PatternGenomeSynthesizer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/PatternGenomeSynthesizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-pedagogymatcher",
            "componentName": "PedagogyMatcher",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/PedagogyMatcher.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-personalizationsimulator",
            "componentName": "PersonalizationSimulator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/PersonalizationSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-physicspainter",
            "componentName": "PhysicsPainter",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/PhysicsPainter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-pitchbuilder",
            "componentName": "PitchBuilder",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/PitchBuilder.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-poeticfusiongenerator",
            "componentName": "PoeticFusionGenerator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/PoeticFusionGenerator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-professionalemailwriter",
            "componentName": "ProfessionalEmailWriter",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/ProfessionalEmailWriter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-promptarchitectworkbench",
            "componentName": "PromptArchitectWorkbench",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/PromptArchitectWorkbench.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-promptmutationstudio",
            "componentName": "PromptMutationStudio",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/PromptMutationStudio.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-robotsimulator",
            "componentName": "RobotSimulator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/RobotSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-scenedirectorxr",
            "componentName": "SceneDirectorXR",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/SceneDirectorXR.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-sdgmatcher",
            "componentName": "SdgMatcher",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/SdgMatcher.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-sensordatainterpreter",
            "componentName": "SensorDataInterpreter",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/SensorDataInterpreter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-simplepredictivemodel",
            "componentName": "SimplePredictiveModel",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/SimplePredictiveModel.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-smartcontracteventlistener",
            "componentName": "SmartContractEventListener",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/SmartContractEventListener.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-soundfieldcomposer",
            "componentName": "SoundfieldComposer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/SoundfieldComposer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-spatialnarrativeengine",
            "componentName": "SpatialNarrativeEngine",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/SpatialNarrativeEngine.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-speechemotionanalyzer",
            "componentName": "SpeechEmotionAnalyzer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/SpeechEmotionAnalyzer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-storyboardforgeplus",
            "componentName": "StoryboardForgePlus",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/StoryboardForgePlus.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-texturealchemylab",
            "componentName": "TextureAlchemyLab",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/TextureAlchemyLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-uifeedback",
            "componentName": "UiFeedback",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/UiFeedback.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-voicedriveneditingdesk",
            "componentName": "VoiceDrivenEditingDesk",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/VoiceDrivenEditingDesk.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-2",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module2-voicemorphstudio",
            "componentName": "VoiceMorphStudio",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module2/components/interactive/VoiceMorphStudio.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-adversarialattacksimulator",
            "componentName": "AdversarialAttackSimulator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/AdversarialAttackSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-agentsystemdesigner",
            "componentName": "AgentSystemDesigner",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/AgentSystemDesigner.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-aialignmenttuner",
            "componentName": "AiAlignmentTuner",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/AiAlignmentTuner.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-aiethicstracker",
            "componentName": "AiEthicsTracker",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/AiEthicsTracker.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-aipalettesynthesizer",
            "componentName": "AiPaletteSynthesizer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/AiPaletteSynthesizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-algorithmvisualizer",
            "componentName": "AlgorithmVisualizer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/AlgorithmVisualizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-ambientarchitect",
            "componentName": "AmbientArchitect",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/AmbientArchitect.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-architecturebuildersandbox",
            "componentName": "ArchitectureBuilderSandbox",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/ArchitectureBuilderSandbox.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-audiovisualsynclab",
            "componentName": "AudioVisualSyncLab",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/AudioVisualSyncLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-benefitsorter",
            "componentName": "BenefitSorter",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/BenefitSorter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-blockchainexplorer",
            "componentName": "BlockchainExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/BlockchainExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-businessmodelcanvas",
            "componentName": "BusinessModelCanvas",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/BusinessModelCanvas.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-cinematicpromptsequencer",
            "componentName": "CinematicPromptSequencer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/CinematicPromptSequencer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-codedebugger",
            "componentName": "CodeDebugger",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/CodeDebugger.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-compositorcanvaspro",
            "componentName": "CompositorCanvasPro",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/CompositorCanvasPro.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-contextwindowexplorer",
            "componentName": "ContextWindowExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/ContextWindowExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-datadecisionflowchartbuilder",
            "componentName": "DataDecisionFlowchartBuilder",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/DataDecisionFlowchartBuilder.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-datavisualizer",
            "componentName": "DataVisualizer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/DataVisualizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-diffusionfieldexplorer",
            "componentName": "DiffusionFieldExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/DiffusionFieldExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-dreamspaceconstructor",
            "componentName": "DreamspaceConstructor",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/DreamspaceConstructor.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-emotionblendmixer",
            "componentName": "EmotionBlendMixer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/EmotionBlendMixer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-energycarbontracker",
            "componentName": "EnergyCarbonTracker",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/EnergyCarbonTracker.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-ethicalbiasmirror",
            "componentName": "EthicalBiasMirror",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/EthicalBiasMirror.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-ethicalstyleinspector",
            "componentName": "EthicalStyleInspector",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/EthicalStyleInspector.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-explainabilitypanel",
            "componentName": "ExplainabilityPanel",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/ExplainabilityPanel.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-featureexplorer",
            "componentName": "FeatureExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/FeatureExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-fundingpulseticker",
            "componentName": "FundingPulseTicker",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/FundingPulseTicker.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-futurescenariopoll",
            "componentName": "FutureScenarioPoll",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/FutureScenarioPoll.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-generativesculptor3d",
            "componentName": "GenerativeSculptor3D",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/GenerativeSculptor3D.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-gestureanimator",
            "componentName": "GestureAnimator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/GestureAnimator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-imagepromptenhancer",
            "componentName": "ImagePromptEnhancer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/ImagePromptEnhancer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-interactivechatbot",
            "componentName": "InteractiveChatbot",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/InteractiveChatbot.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-interactivedebates",
            "componentName": "InteractiveDebates",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/InteractiveDebates.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-jobimpactsimulator",
            "componentName": "JobImpactSimulator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/JobImpactSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-langgraphvisualizer",
            "componentName": "LangGraphVisualizer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/LangGraphVisualizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-lightingphysicslab",
            "componentName": "LightingPhysicsLab",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/LightingPhysicsLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-livepatentradar",
            "componentName": "LivePatentRadar",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/LivePatentRadar.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-losslandscapenavigator",
            "componentName": "LossLandscapeNavigator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/LossLandscapeNavigator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-melodymakerai",
            "componentName": "MelodyMakerAI",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/MelodyMakerAI.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-modelarmsracetimeline",
            "componentName": "ModelArmsRaceTimeline",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/ModelArmsRaceTimeline.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-motionphysicsplayground",
            "componentName": "MotionPhysicsPlayground",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/MotionPhysicsPlayground.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-multiagentchatsandbox",
            "componentName": "MultiAgentChatSandbox",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/MultiAgentChatSandbox.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-neuralevolutionchronicle",
            "componentName": "NeuralEvolutionChronicle",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/NeuralEvolutionChronicle.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-parameteruniverseexplorer",
            "componentName": "ParameterUniverseExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/ParameterUniverseExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-patterngenomesynthesizer",
            "componentName": "PatternGenomeSynthesizer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/PatternGenomeSynthesizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-pedagogymatcher",
            "componentName": "PedagogyMatcher",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/PedagogyMatcher.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-personalizationsimulator",
            "componentName": "PersonalizationSimulator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/PersonalizationSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-physicspainter",
            "componentName": "PhysicsPainter",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/PhysicsPainter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-poeticfusiongenerator",
            "componentName": "PoeticFusionGenerator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/PoeticFusionGenerator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-promptmutationstudio",
            "componentName": "PromptMutationStudio",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/PromptMutationStudio.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-rlhftrainergame",
            "componentName": "RlhfTrainerGame",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/RlhfTrainerGame.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-robotsimulator",
            "componentName": "RobotSimulator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/RobotSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-scenedirectorxr",
            "componentName": "SceneDirectorXR",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/SceneDirectorXR.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-sdgmatcher",
            "componentName": "SdgMatcher",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/SdgMatcher.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-sensordatainterpreter",
            "componentName": "SensorDataInterpreter",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/SensorDataInterpreter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-simplepredictivemodel",
            "componentName": "SimplePredictiveModel",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/SimplePredictiveModel.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-smartcontracteventlistener",
            "componentName": "SmartContractEventListener",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/SmartContractEventListener.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-soundfieldcomposer",
            "componentName": "SoundfieldComposer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/SoundfieldComposer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-spatialnarrativeengine",
            "componentName": "SpatialNarrativeEngine",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/SpatialNarrativeEngine.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-speechemotionanalyzer",
            "componentName": "SpeechEmotionAnalyzer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/SpeechEmotionAnalyzer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-storyboardforgeplus",
            "componentName": "StoryboardForgePlus",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/StoryboardForgePlus.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-texturealchemylab",
            "componentName": "TextureAlchemyLab",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/TextureAlchemyLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-tokeneconomysimulator",
            "componentName": "TokenEconomySimulator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/TokenEconomySimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-uifeedback",
            "componentName": "UiFeedback",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/UiFeedback.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-voicedriveneditingdesk",
            "componentName": "VoiceDrivenEditingDesk",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/VoiceDrivenEditingDesk.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-3",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module3-voicemorphstudio",
            "componentName": "VoiceMorphStudio",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module3/components/interactive/VoiceMorphStudio.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-aipalettesynthesizer",
            "componentName": "AiPaletteSynthesizer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/AiPaletteSynthesizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-ambientarchitect",
            "componentName": "AmbientArchitect",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/AmbientArchitect.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-architecturebuildersandbox",
            "componentName": "ArchitectureBuilderSandbox",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/ArchitectureBuilderSandbox.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-audiovisualsynclab",
            "componentName": "AudioVisualSyncLab",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/AudioVisualSyncLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-blockchainexplorer",
            "componentName": "BlockchainExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/BlockchainExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-cinematicpromptsequencer",
            "componentName": "CinematicPromptSequencer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/CinematicPromptSequencer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-compositorcanvaspro",
            "componentName": "CompositorCanvasPro",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/CompositorCanvasPro.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-diffusionfieldexplorer",
            "componentName": "DiffusionFieldExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/DiffusionFieldExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-dreamspaceconstructor",
            "componentName": "DreamspaceConstructor",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/DreamspaceConstructor.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-emotionblendmixer",
            "componentName": "EmotionBlendMixer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/EmotionBlendMixer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-featureexplorer",
            "componentName": "FeatureExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/FeatureExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-generativesculptor3d",
            "componentName": "GenerativeSculptor3D",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/GenerativeSculptor3D.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-gestureanimator",
            "componentName": "GestureAnimator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/GestureAnimator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-imagepromptenhancer",
            "componentName": "ImagePromptEnhancer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/ImagePromptEnhancer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-interactivechatbot",
            "componentName": "InteractiveChatbot",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/InteractiveChatbot.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-lightingphysicslab",
            "componentName": "LightingPhysicsLab",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/LightingPhysicsLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-melodymakerai",
            "componentName": "MelodyMakerAI",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/MelodyMakerAI.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-modelarmsracetimeline",
            "componentName": "ModelArmsRaceTimeline",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/ModelArmsRaceTimeline.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-motionphysicsplayground",
            "componentName": "MotionPhysicsPlayground",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/MotionPhysicsPlayground.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-parameteruniverseexplorer",
            "componentName": "ParameterUniverseExplorer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/ParameterUniverseExplorer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-patterngenomesynthesizer",
            "componentName": "PatternGenomeSynthesizer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/PatternGenomeSynthesizer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-pedagogymatcher",
            "componentName": "PedagogyMatcher",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/PedagogyMatcher.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-physicspainter",
            "componentName": "PhysicsPainter",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/PhysicsPainter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-poeticfusiongenerator",
            "componentName": "PoeticFusionGenerator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/PoeticFusionGenerator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-professionalemailwriter",
            "componentName": "ProfessionalEmailWriter",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/ProfessionalEmailWriter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-promptarchitectworkbench",
            "componentName": "PromptArchitectWorkbench",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/PromptArchitectWorkbench.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-robotsimulator",
            "componentName": "RobotSimulator",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/RobotSimulator.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-scenedirectorxr",
            "componentName": "SceneDirectorXR",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/SceneDirectorXR.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-scheduleplanner",
            "componentName": "SchedulePlanner",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/SchedulePlanner.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-sensordatainterpreter",
            "componentName": "SensorDataInterpreter",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/SensorDataInterpreter.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-soundfieldcomposer",
            "componentName": "SoundfieldComposer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/SoundfieldComposer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-spatialnarrativeengine",
            "componentName": "SpatialNarrativeEngine",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/SpatialNarrativeEngine.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-speechemotionanalyzer",
            "componentName": "SpeechEmotionAnalyzer",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/SpeechEmotionAnalyzer.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-storyboardforgeplus",
            "componentName": "StoryboardForgePlus",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/StoryboardForgePlus.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-texturealchemylab",
            "componentName": "TextureAlchemyLab",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/TextureAlchemyLab.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-uifeedback",
            "componentName": "UiFeedback",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/UiFeedback.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-voicedriveneditingdesk",
            "componentName": "VoiceDrivenEditingDesk",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/VoiceDrivenEditingDesk.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-module-4",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "module4-voicemorphstudio",
            "componentName": "VoiceMorphStudio",
            "route": "",
            "runtimeType": "static",
            "artifactType": "orphaned-component",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Component file exists in the owning module but no curriculumData reference was found.",
                "Runtime type was unknown in audit and is normalized to static until bound."
            ],
            "sourceFile": "src/modules/module4/components/interactive/VoiceMorphStudio.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-global",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "creds",
            "componentName": "CREDS",
            "route": "/creds",
            "runtimeType": "static",
            "artifactType": "route-tool",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Standalone dry-run credential attestation route. README explicitly states mock metadata and no production integrations yet."
            ],
            "sourceFile": "src/components/creds/CredsWorkbench.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-global",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "docs-copilot",
            "componentName": "Documentation Copilot",
            "route": "/docs",
            "runtimeType": "api",
            "artifactType": "route-tool",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Repo-owned docs assistant, not lesson-bound. Uses API proxy rather than a curriculum mapping layer."
            ],
            "sourceFile": "src/pages/DocumentationPage.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-global",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "profile-notebook",
            "componentName": "Notebook",
            "route": "/profile",
            "runtimeType": "local-logic",
            "artifactType": "route-tool",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Profile notebook persists to localStorage under pioneer_* keys and is not linked to lesson artifacts."
            ],
            "sourceFile": "src/components/notebook/Notebook.tsx"
        },
        {
            "programId": "vanguard",
            "moduleId": "vanguard-global",
            "sectionId": "orphaned",
            "lessonId": "orphaned",
            "miniAppId": "onboarding-chat",
            "componentName": "OnboardingChat",
            "route": "global-layout-overlay",
            "runtimeType": "simulated-ai",
            "artifactType": "route-tool",
            "completionMode": "none",
            "canonicalSection": false,
            "isWrapperContent": false,
            "readiness": "orphaned",
            "issues": [
                "Global onboarding flow is not connected to module, section, or lesson IDs."
            ],
            "sourceFile": "src/components/onboarding/OnboardingChat.tsx"
        }
    ],
    "completionHookTodos": [
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-1",
            "miniAppId": "neural-evolution-1",
            "componentName": "NeuralEvolutionChronicle",
            "sourceFile": "src/modules/module1/components/interactive/NeuralEvolutionChronicle.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-1",
            "miniAppId": "arms-race-1",
            "componentName": "ModelArmsRaceTimeline",
            "sourceFile": "src/modules/module1/components/interactive/ModelArmsRaceTimeline.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-1",
            "miniAppId": "beginner-chat-1",
            "componentName": "InteractiveChatbot",
            "sourceFile": "src/modules/module1/components/interactive/InteractiveChatbot.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-1",
            "miniAppId": "quiz-1-1",
            "componentName": "SectionQuiz",
            "sourceFile": "src/modules/module1/components/interactive/SectionQuiz.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-2",
            "miniAppId": "simple-model-1",
            "componentName": "SimplePredictiveModel",
            "sourceFile": "src/modules/module1/components/interactive/SimplePredictiveModel.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-2",
            "miniAppId": "quiz-1-2",
            "componentName": "SectionQuiz",
            "sourceFile": "src/modules/module1/components/interactive/SectionQuiz.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-10",
            "miniAppId": "mastery-check-1-10",
            "componentName": "MasteryCheckGate",
            "sourceFile": "src/modules/module1/components/interactive/MasteryCheckGate.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-11",
            "miniAppId": "temp-playground-1",
            "componentName": "TemperaturePlayground",
            "sourceFile": "src/modules/module1/components/interactive/TemperaturePlayground.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-12",
            "miniAppId": "token-receipt-1",
            "componentName": "TokenReceiptPrinter",
            "sourceFile": "src/modules/module1/components/interactive/TokenReceiptPrinter.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-13",
            "miniAppId": "json-surgeon-1",
            "componentName": "JsonSurgeon",
            "sourceFile": "src/modules/module1/components/interactive/JsonSurgeon.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-14",
            "miniAppId": "agent-sim-1",
            "componentName": "MiniAgentSimulator",
            "sourceFile": "src/modules/module1/components/interactive/MiniAgentSimulator.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-15",
            "miniAppId": "semantic-search-1",
            "componentName": "SemanticSearchLab",
            "sourceFile": "src/modules/module1/components/interactive/SemanticSearchLab.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-16",
            "miniAppId": "approach-tree-1",
            "componentName": "ApproachDecisionTree",
            "sourceFile": "src/modules/module1/components/interactive/ApproachDecisionTree.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-17",
            "miniAppId": "red-team-1",
            "componentName": "RedTeamBot",
            "sourceFile": "src/modules/module1/components/interactive/RedTeamBot.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-18",
            "miniAppId": "prompt-tester-1",
            "componentName": "PromptUnitTester",
            "sourceFile": "src/modules/module1/components/interactive/PromptUnitTester.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-19",
            "miniAppId": "model-picker-1",
            "componentName": "ModelPickerLab",
            "sourceFile": "src/modules/module1/components/interactive/ModelPickerLab.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-20",
            "miniAppId": "credential-mint-1",
            "componentName": "CredentialMintPreview",
            "sourceFile": "src/modules/module1/components/interactive/CredentialMintPreview.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-1",
            "lessonId": "1-22",
            "miniAppId": "quiz-1-exit",
            "componentName": "SectionQuiz",
            "sourceFile": "src/modules/module1/components/interactive/SectionQuiz.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-8",
            "miniAppId": "int-graph-2",
            "componentName": "LangGraphVisualizer",
            "sourceFile": "src/modules/module1/components/interactive/LangGraphVisualizer.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-1",
            "sectionId": "module-2",
            "lessonId": "2-10",
            "miniAppId": "future-poll-2",
            "componentName": "FutureScenarioPoll",
            "sourceFile": "src/modules/module1/components/interactive/FutureScenarioPoll.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-1",
            "miniAppId": "quiz-2-1",
            "componentName": "SectionQuiz",
            "sourceFile": "src/modules/module2/components/interactive/SectionQuiz.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-2",
            "sectionId": "part-2",
            "lessonId": "2-2",
            "miniAppId": "quiz-2-2",
            "componentName": "SectionQuiz",
            "sourceFile": "src/modules/module2/components/interactive/SectionQuiz.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-1",
            "miniAppId": "quiz-3-1",
            "componentName": "SectionQuiz",
            "sourceFile": "src/modules/module3/components/interactive/SectionQuiz.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-2",
            "miniAppId": "digital-janitor-lab-1",
            "componentName": "DigitalJanitorLab",
            "sourceFile": "src/modules/module3/components/interactive/DigitalJanitorLab.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-2",
            "miniAppId": "quiz-3-2",
            "componentName": "SectionQuiz",
            "sourceFile": "src/modules/module3/components/interactive/SectionQuiz.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-3",
            "miniAppId": "rag-builder-1",
            "componentName": "RagBuilder",
            "sourceFile": "src/modules/module3/components/interactive/RagBuilder.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-4",
            "miniAppId": "fact-checker-1",
            "componentName": "FactCheckerSimulator",
            "sourceFile": "src/modules/module3/components/interactive/FactCheckerSimulator.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-5",
            "miniAppId": "knowledge-graph-1",
            "componentName": "KnowledgeGraphBuilder",
            "sourceFile": "src/modules/module3/components/interactive/KnowledgeGraphBuilder.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-3",
            "sectionId": "part-1",
            "lessonId": "3-6",
            "miniAppId": "research-assistant-1",
            "componentName": "ResearchAssistantWorkflow",
            "sourceFile": "src/modules/module3/components/interactive/ResearchAssistantWorkflow.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-12",
            "miniAppId": "decision-fatigue-1",
            "componentName": "DecisionFatigueMeter",
            "sourceFile": "src/modules/module3/components/interactive/DecisionFatigueMeter.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-13",
            "miniAppId": "decision-matrix-1",
            "componentName": "DecisionMatrixCalculator",
            "sourceFile": "src/modules/module3/components/interactive/DecisionMatrixCalculator.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-14",
            "miniAppId": "scenario-simulator-1",
            "componentName": "ScenarioSimulator",
            "sourceFile": "src/modules/module3/components/interactive/ScenarioSimulator.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-15",
            "miniAppId": "schedule-planner-1",
            "componentName": "SchedulePlanner",
            "sourceFile": "src/modules/module3/components/interactive/SchedulePlanner.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-16",
            "miniAppId": "bias-detector-1",
            "componentName": "CognitiveBiasDetector",
            "sourceFile": "src/modules/module3/components/interactive/CognitiveBiasDetector.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-3",
            "sectionId": "part-2",
            "lessonId": "3-17",
            "miniAppId": "executive-brief-1",
            "componentName": "ExecutiveBriefBuilder",
            "sourceFile": "src/modules/module3/components/interactive/ExecutiveBriefBuilder.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-1",
            "miniAppId": "quiz-4-1",
            "componentName": "SectionQuiz",
            "sourceFile": "src/modules/module4/components/interactive/SectionQuiz.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-2",
            "miniAppId": "quiz-4-2",
            "componentName": "SectionQuiz",
            "sourceFile": "src/modules/module4/components/interactive/SectionQuiz.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-4",
            "miniAppId": "rag-builder-1",
            "componentName": "RagBuilder",
            "sourceFile": "src/modules/module4/components/interactive/RagBuilder.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-5",
            "miniAppId": "data-sanity-scanner-1",
            "componentName": "DataVisualizer",
            "sourceFile": "src/modules/module4/components/interactive/DataVisualizer.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-6",
            "miniAppId": "adversarial-simulator-1",
            "componentName": "AdversarialAttackSimulator",
            "sourceFile": "src/modules/module4/components/interactive/AdversarialAttackSimulator.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-7",
            "miniAppId": "correlation-explorer-1",
            "componentName": "SimplePredictiveModel",
            "sourceFile": "src/modules/module4/components/interactive/SimplePredictiveModel.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-4",
            "sectionId": "part-1",
            "lessonId": "1-8",
            "miniAppId": "access-visualizer-1",
            "componentName": "LangGraphVisualizer",
            "sourceFile": "src/modules/module4/components/interactive/LangGraphVisualizer.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-2",
            "miniAppId": "outlier-detector-1",
            "componentName": "AlgorithmVisualizer",
            "sourceFile": "src/modules/module4/components/interactive/AlgorithmVisualizer.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-4",
            "miniAppId": "alignment-tuner-1",
            "componentName": "AiAlignmentTuner",
            "sourceFile": "src/modules/module4/components/interactive/AiAlignmentTuner.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-5",
            "miniAppId": "smart-contract-1",
            "componentName": "SmartContractEventListener",
            "sourceFile": "src/modules/module4/components/interactive/SmartContractEventListener.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        },
        {
            "moduleId": "vanguard-module-4",
            "sectionId": "part-2",
            "lessonId": "2-9",
            "miniAppId": "sdg-matcher-1",
            "componentName": "SdgMatcher",
            "sourceFile": "src/modules/module4/components/interactive/SdgMatcher.tsx",
            "currentCompletionMode": "section-scroll",
            "recommendedAction": "Add an interactive completion hook that calls updateModuleProgress(moduleId, interactiveId, \"interactive\") after meaningful learner action."
        }
    ],
    "crossModuleDependencies": [
        {
            "componentName": "HitlRagSimulator",
            "importingModuleId": "vanguard-module-4",
            "importingFile": "src/modules/module4/components/SectionRenderer.tsx",
            "sourceFile": "src/modules/module2/components/interactive/HitlRagSimulator.tsx",
            "recommendedAction": "promote-to-shared",
            "reason": "Module 4 lazy-loads the Module 2 implementation instead of owning or importing through a shared interactive layer."
        },
        {
            "componentName": "HuggingFaceGuide",
            "importingModuleId": "vanguard-module-4",
            "importingFile": "src/modules/module4/components/SectionRenderer.tsx",
            "sourceFile": "src/modules/module2/components/interactive/HuggingFaceGuide.tsx",
            "recommendedAction": "promote-to-shared",
            "reason": "Module 4 lazy-loads the Module 2 implementation instead of owning or importing through a shared interactive layer."
        }
    ],
    "mergeBlockers": [
        "Curriculum structure is not normalized to a clean 4-module x 2-section model. Modules 1-3 include extra top-level wrappers outside the target section map.",
        "No Notion sync or mapping layer exists in repo. All discovered Vanguard lesson copy remains hardcoded in curriculumData.ts files.",
        "Progress math is inconsistent. Dashboard totals use configured counts (50/40/40/60) while actual trackable section counts are 38/27/25/24.",
        "The repo ships a large orphan surface: 200 unused module-specific interactive file entries across 75 unique names, plus standalone tools not tied to lessons.",
        "AI runtime ownership is split across WebLLM, template fallbacks, and an API proxy without a lesson-to-runtime manifest.",
        "CREDS is still a dry-run credential attestation workbench and is not merge-ready as live credential evidence infrastructure.",
        "Module 4 SectionRenderer borrows interactive components from Module 2 for some experiences, which weakens ownership boundaries for an Arsenal merge.",
        "Vanguard profile and notebook surfaces still carry Pioneer naming/storage conventions, indicating program-boundary drift."
    ]
} satisfies VanguardManifest;

export const VANGUARD_PROGRAM_ID = vanguardManifest.programId;
export const VANGUARD_MODULE_TOTALS = vanguardManifest.trackableTotals;
export const vanguardCanonicalSections = vanguardManifest.modules.flatMap((module) => module.sections.filter((section) => section.canonicalSection));
export const vanguardWrapperSections = vanguardManifest.modules.flatMap((module) => module.sections.filter((section) => section.isWrapperContent));
export const vanguardMiniApps = vanguardManifest.miniApps;
export const vanguardCompletionHookTodos = vanguardManifest.completionHookTodos;
export const vanguardCrossModuleDependencies = vanguardManifest.crossModuleDependencies;
