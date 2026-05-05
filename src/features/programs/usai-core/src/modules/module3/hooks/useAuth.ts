// Re-export useAuth from the main hooks directory with module-specific wrappers
import { useAuth as useAuthMain } from '../../../hooks/useAuth';

const MODULE_ID = 3 as const;

export const useAuth = () => {
    const auth = useAuthMain();

    return {
        ...auth,
        // Override addPoints to include module ID automatically for module 3 components
        addPoints: (amount: number) => auth.addPoints(MODULE_ID, amount),
        // Override updateProgress to use the correct method signature
        updateProgress: (interactiveId: string, type: 'section' | 'interactive') =>
            auth.updateModuleProgress(MODULE_ID, interactiveId, type),
        // Also expose resetProgress for the header
        resetProgress: () => auth.resetModuleProgress(MODULE_ID),
        // Provide legacy compatibility for components that expect user.progress
        get user() {
            const originalUser = auth.user;
            if (!originalUser) return null;
            return {
                ...originalUser,
                // Legacy compatibility: expose module3 progress as "progress"
                points: originalUser.modules[MODULE_ID].points,
                progress: {
                    completedSections: originalUser.modules[MODULE_ID].completedSections,
                    completedInteractives: originalUser.modules[MODULE_ID].completedInteractives,
                },
            };
        },
    };
};
