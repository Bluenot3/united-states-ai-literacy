import { WEBLLM_CONFIG, WEBLLM_FLAGS } from './webllmConfig';
import { generateWithWebLLM, getWebLLMStatus, isWebLLMSupported, type WebLLMMessage } from './webllmProvider';
import { getTemplateFallback, type ProgramAITaskType } from './templateFallbacks';

export interface RunProgramAIInput {
    taskType: ProgramAITaskType;
    moduleId?: string;
    messages?: WebLLMMessage[];
    userInput?: string;
    preferredProvider?: 'auto' | 'webllm' | 'template';
    maxTokens?: number;
    temperature?: number;
}

export interface RunProgramAIResponse {
    text: string;
    provider: 'webllm' | 'template';
    model?: string;
    fallbackUsed: boolean;
    taskType: string;
    moduleId?: string;
    error?: string | null;
}

const SYSTEM_PROMPTS: Record<string, string> = {
    prompt_coach: 'You are the local AI prompt coach for ZEN AI Pioneer Program. Help the learner improve their prompt. Keep feedback concise, practical, and beginner-friendly. Explain what changed and why.',
    glossary_explainer: 'You are the local AI glossary assistant for ZEN AI literacy curriculum. Explain technical concepts in clear language with one simple example.',
    concept_explainer: 'You are the local AI mentor for ZEN Programs. Explain the concept clearly, practically, and briefly. Use beginner-friendly language and one useful example.',
    quiz_feedback: 'You are the local AI quiz feedback coach. Give constructive feedback based on the learner answer. Help them understand the concept without overexplaining.',
    project_idea_generator: 'You are the local AI project mentor. Generate practical AI project ideas that a learner can actually build. Keep ideas realistic, exciting, and scoped.',
    reflection_helper: 'You are the local AI reflection coach. Help the learner turn their experience into a clear reflection with insight and practical next steps.',
    agent_builder_helper: 'You are the local AI agent builder helper for ZEN Programs. Help the learner reason through agent roles, workflow order, tools, outputs, and simple guardrails.',
    final_project_mentor: 'You are the local AI final project mentor for ZEN Programs. Help the learner scope, improve, and explain a realistic final project without doing the work for them.',
    automation_mapper: 'You are the local AI automation mapper for ZEN Vanguard. Convert the user process into trigger, inputs, steps, tools, outputs, and automation opportunities.',
    resume_bullet_rewriter: 'You are the local AI career assistant. Rewrite resume bullets to be clearer, stronger, measurable, and professional without inventing fake facts.',
    sop_generator: 'You are the local AI operations assistant. Turn the user rough process into a clean SOP with steps, owners, tools, checks, and handoffs.',
    business_use_case_generator: 'You are the local AI business use case assistant for ZEN Vanguard. Turn the user context into a practical AI use case with problem, workflow, value, risk, and next step.',
    workflow_explainer: 'You are the local AI workflow explainer for ZEN Vanguard. Explain workflows clearly in terms of trigger, actors, data, tools, decision points, and outputs.',
    agent_spec_generator: 'You are the local AI agent specification builder. Turn the user idea into a clear agent spec with purpose, inputs, tools, steps, outputs, and guardrails.',
    client_proposal_helper: 'You are the local AI client proposal helper for ZEN Vanguard. Convert a rough client need into a concise proposal outline with scope, deliverables, timeline, assumptions, and proof points.',
};

const fallbackResponse = (input: RunProgramAIInput, error?: string | null): RunProgramAIResponse => ({
    text: WEBLLM_FLAGS.enableTemplateFallback
        ? getTemplateFallback(input.taskType, input.userInput, input.moduleId)
        : 'Template fallback is disabled.',
    provider: 'template',
    fallbackUsed: true,
    taskType: input.taskType,
    moduleId: input.moduleId,
    error: error ?? null,
});

const normalizeMessages = (input: RunProgramAIInput): WebLLMMessage[] => {
    const hasSystemMessage = input.messages?.some((message) => message.role === 'system');
    const baseMessages = input.messages?.length
        ? input.messages
        : [{ role: 'user' as const, content: input.userInput ?? '' }];

    if (hasSystemMessage) {
        return baseMessages;
    }

    return [
        {
            role: 'system',
            content: SYSTEM_PROMPTS[input.taskType] ?? SYSTEM_PROMPTS.concept_explainer,
        },
        ...baseMessages,
    ];
};

export async function runProgramAI(input: RunProgramAIInput): Promise<RunProgramAIResponse> {
    const preferredProvider = input.preferredProvider ?? 'auto';

    if (preferredProvider === 'template') {
        return fallbackResponse(input);
    }

    if (preferredProvider === 'auto' && !WEBLLM_FLAGS.enableAutoRoute) {
        return fallbackResponse(input, 'WebLLM auto routing is disabled.');
    }

    if (!isWebLLMSupported()) {
        return fallbackResponse(input, getWebLLMStatus().error);
    }

    if (!getWebLLMStatus().initialized) {
        return fallbackResponse(input, 'WebLLM is supported but not initialized.');
    }

    const allInput = [
        input.userInput ?? '',
        ...(input.messages ?? []).map((message) => message.content),
    ].join('\n');

    if (allInput.length > WEBLLM_CONFIG.maxInputChars) {
        return fallbackResponse(input, `Input exceeds ${WEBLLM_CONFIG.maxInputChars} characters.`);
    }

    try {
        const result = await generateWithWebLLM({
            messages: normalizeMessages(input),
            taskType: input.taskType,
            moduleId: input.moduleId,
            maxTokens: input.maxTokens,
            temperature: input.temperature,
        });

        return {
            text: result.text,
            provider: 'webllm',
            model: result.model,
            fallbackUsed: false,
            taskType: input.taskType,
            moduleId: input.moduleId,
            error: null,
        };
    } catch (error) {
        return fallbackResponse(input, error instanceof Error ? error.message : 'WebLLM generation failed.');
    }
}
