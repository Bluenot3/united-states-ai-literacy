import { useCallback, useMemo } from 'react';
import { useAuth as useMainAuth } from '../../../hooks/useAuth';

/**
 * Module 2 adapter for useAuth
 * This provides backwards-compatible API for the many interactive components
 * that use the old API (addPoints, updateProgress, user.progress)
 */
export const useAuth = () => {
  const mainAuth = useMainAuth();

  // Create a backwards-compatible user object with `.progress` property
  const user = useMemo(() => {
    if (!mainAuth.user) return null;

    const moduleProgress = mainAuth.getModuleProgress(2);

    return {
      ...mainAuth.user,
      // Legacy API - provide progress at top level for backwards compatibility
      progress: {
        completedSections: moduleProgress.completedSections,
        completedInteractives: moduleProgress.completedInteractives,
      },
      // Legacy points - use module 2 specific points
      points: moduleProgress.points,
    };
  }, [mainAuth.user, mainAuth.getModuleProgress]);

  // Adapter for addPoints - forward to module 2
  const addPoints = useCallback((amount: number) => {
    mainAuth.addPoints(2, amount);
  }, [mainAuth.addPoints]);

  // Adapter for updateProgress - forward to module 2
  const updateProgress = useCallback((id: string, type: 'section' | 'interactive') => {
    mainAuth.updateModuleProgress(2, id, type);
  }, [mainAuth.updateModuleProgress]);

  // Adapter for resetProgress - forward to module 2
  const resetProgress = useCallback(() => {
    mainAuth.resetModuleProgress(2);
  }, [mainAuth.resetModuleProgress]);

  return {
    user,
    loading: mainAuth.loading,
    addPoints,
    updateProgress,
    resetProgress,
    isResetting: false, // Legacy property - not used in new auth
    // Also expose new API for components that want to use it
    getModuleProgress: mainAuth.getModuleProgress,
    resetModuleProgress: mainAuth.resetModuleProgress,
  };
};
