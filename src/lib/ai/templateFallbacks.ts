export type ProgramAITaskType =
    | 'prompt_coach'
    | 'glossary_explainer'
    | 'concept_explainer'
    | 'quiz_feedback'
    | 'project_idea_generator'
    | 'reflection_helper'
    | 'agent_builder_helper'
    | 'final_project_mentor'
    | 'automation_mapper'
    | 'resume_bullet_rewriter'
    | 'sop_generator'
    | 'business_use_case_generator'
    | 'workflow_explainer'
    | 'agent_spec_generator'
    | 'client_proposal_helper'
    | string;

const cleanInput = (userInput?: string) => userInput?.trim() || 'the learner input';

export function getTemplateFallback(taskType: ProgramAITaskType, userInput?: string, moduleId?: string) {
    const input = cleanInput(userInput);
    const moduleLabel = moduleId ? `Module ${moduleId}` : 'this activity';

    switch (taskType) {
        case 'prompt_coach':
            return [
                'Improved prompt:',
                `"Act as a practical AI assistant. Help me with: ${input}. Ask one clarifying question if needed, then give a concise answer with steps and examples."`,
                '',
                'Why this is stronger:',
                '- It gives the AI a role.',
                '- It states the goal clearly.',
                '- It asks for useful structure instead of a vague answer.',
            ].join('\n');
        case 'glossary_explainer':
        case 'concept_explainer':
            return `Plain-language explanation for ${input}: This concept is about turning a complicated idea into a repeatable pattern you can use. Example: if the topic is prompting, the pattern is goal + context + constraints + output format.`;
        case 'quiz_feedback':
            return `Feedback: Your answer shows a starting understanding. Tighten it by naming the key concept, explaining why it matters, and adding one example from ${moduleLabel}.`;
        case 'project_idea_generator':
            return [
                'Project idea:',
                `Build a simple AI helper around "${input}".`,
                'Scope: one input form, one generated output, one saved example.',
                'Proof: screenshot the input, output, and a short reflection about what improved.',
            ].join('\n');
        case 'reflection_helper':
            return `Reflection draft: In ${moduleLabel}, I learned how ${input} connects to real AI use. The biggest insight was that good AI work depends on clear goals, useful constraints, and testing the result instead of trusting it blindly.`;
        case 'agent_builder_helper':
        case 'agent_spec_generator':
            return [
                'Agent spec:',
                `Purpose: Help with ${input}.`,
                'Inputs: user goal, constraints, source material.',
                'Steps: clarify, plan, execute, check, summarize.',
                'Outputs: final answer, next action, confidence notes.',
                'Guardrails: do not invent facts; ask when requirements are missing.',
            ].join('\n');
        case 'automation_mapper':
            return [
                'Automation map:',
                `Trigger: ${input}`,
                'Inputs: requester, source data, deadline, required format.',
                'Steps: collect, classify, route, generate, review, deliver.',
                'Tools: form, document store, AI draft, approval checklist.',
                'Outputs: completed draft, audit note, next owner.',
            ].join('\n');
        case 'resume_bullet_rewriter':
            return `Stronger bullet: Improved ${input} by clarifying the action, business result, and measurable impact without adding unsupported claims.`;
        case 'sop_generator':
            return [
                'SOP draft:',
                `Purpose: Standardize ${input}.`,
                'Owner: Process lead.',
                'Steps: intake request, verify inputs, complete work, quality check, handoff.',
                'Checks: missing data, approval needed, completion evidence.',
                'Handoff: send final output and log status.',
            ].join('\n');
        case 'business_use_case_generator':
            return `Use case: Apply AI to ${input} by reducing manual drafting, summarizing repeated information, and routing next actions. Start with one low-risk workflow and measure time saved.`;
        case 'workflow_explainer':
            return `Workflow explanation: ${input} can be treated as a sequence of trigger, input, decision, action, output, and review. Improving one step at a time makes the system easier to automate.`;
        case 'client_proposal_helper':
            return [
                'Proposal outline:',
                `Goal: Help the client with ${input}.`,
                'Approach: map the workflow, identify automation opportunities, prototype one AI-assisted step.',
                'Deliverables: workflow map, prototype, adoption notes.',
                'Success metric: time saved or quality improved.',
            ].join('\n');
        default:
            return `Guided fallback: Start by clarifying the goal for "${input}", add context, define the output format, and test the result against one concrete success criterion.`;
    }
}

