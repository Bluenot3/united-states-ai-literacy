import { useCallback, useEffect, useState } from 'react';
import { generateWithWebLLM, getWebLLMStatus, initializeWebLLM, unloadWebLLM, type WebLLMMessage } from '../lib/ai/webllmProvider';
import type { ProgramAITaskType } from '../lib/ai/templateFallbacks';

export function useWebLLMProvider() {
    const [status, setStatus] = useState(() => getWebLLMStatus());

    const refresh = useCallback(() => {
        setStatus(getWebLLMStatus());
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const initialize = useCallback(async () => {
        setStatus(await initializeWebLLM());
    }, []);

    const generate = useCallback(async (input: {
        messages: WebLLMMessage[];
        taskType: ProgramAITaskType;
        moduleId?: string;
        maxTokens?: number;
        temperature?: number;
    }) => {
        const response = await generateWithWebLLM(input);
        refresh();
        return response;
    }, [refresh]);

    const reset = useCallback(() => {
        refresh();
    }, [refresh]);

    const unload = useCallback(async () => {
        await unloadWebLLM();
        refresh();
    }, [refresh]);

    return {
        supported: status.supported,
        initialized: status.initialized,
        initializing: status.initializing,
        progress: status.progress,
        error: status.error,
        currentModel: status.currentModel,
        progressText: status.progressText,
        initialize,
        generate,
        reset,
        unload,
    };
}

