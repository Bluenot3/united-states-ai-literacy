import type { BadgeKind, ModuleProgress, User, UserBadge } from '../types';

export const VANGUARD_MODULE_TOTALS: Record<1 | 2 | 3 | 4, number> = {
    1: 50,
    2: 40,
    3: 40,
    4: 60,
};

export const VANGUARD_MODULE_NAMES: Record<1 | 2 | 3 | 4, string> = {
    1: 'AI Foundations',
    2: 'Agents & Automation Frameworks',
    3: 'Personal Intelligence & Cognitive Systems',
    4: 'AI Systems Mastery & Professional Integration',
};

type BadgeRule = {
    id: string;
    title: string;
    description: string;
    kind: BadgeKind;
    moduleId?: 1 | 2 | 3 | 4;
    isEarned: (user: User) => boolean;
};

const getModuleCompletionRatio = (progress: ModuleProgress, moduleId: 1 | 2 | 3 | 4) => {
    const total = VANGUARD_MODULE_TOTALS[moduleId];
    return total === 0 ? 0 : Math.min(1, progress.completedSections.length / total);
};

const moduleBadgeRules = ([1, 2, 3, 4] as const).flatMap((moduleId) => {
    const moduleName = VANGUARD_MODULE_NAMES[moduleId];
    return [
        {
            id: `module-${moduleId}-ignition`,
            title: `Module ${moduleId} Ignition`,
            description: `Started ${moduleName} and created the first durable progress record.`,
            kind: 'section' as const,
            moduleId,
            isEarned: (user: User) => user.modules[moduleId].completedSections.length >= 1,
        },
        {
            id: `module-${moduleId}-operator`,
            title: `Module ${moduleId} Operator`,
            description: `Completed at least 50% of ${moduleName}.`,
            kind: 'section' as const,
            moduleId,
            isEarned: (user: User) => getModuleCompletionRatio(user.modules[moduleId], moduleId) >= 0.5,
        },
        {
            id: `module-${moduleId}-architect`,
            title: `Module ${moduleId} Architect`,
            description: `Completed the full ${moduleName} track.`,
            kind: 'module' as const,
            moduleId,
            isEarned: (user: User) => getModuleCompletionRatio(user.modules[moduleId], moduleId) >= 1,
        },
    ];
});

const badgeRules: BadgeRule[] = [
    {
        id: 'vanguard-first-action',
        title: 'First Vanguard Action',
        description: 'Completed the first tracked section in the ZEN Vanguard operating layer.',
        kind: 'section',
        isEarned: (user) => Object.values(user.modules).some((progress) => progress.completedSections.length > 0),
    },
    {
        id: 'vanguard-1000-xp',
        title: '1K XP Operator',
        description: 'Earned 1,000 durable XP across the Vanguard program.',
        kind: 'streak',
        isEarned: (user) => user.totalPoints >= 1000,
    },
    ...moduleBadgeRules,
    {
        id: 'vanguard-intelligence-architect',
        title: 'Vanguard Intelligence Architect',
        description: 'Completed all four modules and unlocked final ZEN Vanguard certification eligibility.',
        kind: 'credential',
        isEarned: (user) => ([1, 2, 3, 4] as const).every((moduleId) => getModuleCompletionRatio(user.modules[moduleId], moduleId) >= 1),
    },
];

const createBadge = (rule: BadgeRule, earnedAt: string): UserBadge => ({
    id: rule.id,
    title: rule.title,
    description: rule.description,
    kind: rule.kind,
    moduleId: rule.moduleId,
    earnedAt,
});

export const getModuleCompletionPercent = (progress: ModuleProgress, moduleId: 1 | 2 | 3 | 4) => (
    Math.min(100, Math.round(getModuleCompletionRatio(progress, moduleId) * 100))
);

export const getEarnedBadges = (user: User, issuedAt = new Date().toISOString()): UserBadge[] => {
    const existingBadges = user.badges ?? [];
    const existingById = new Map(existingBadges.map((badge) => [badge.id, badge]));

    return badgeRules
        .filter((rule) => rule.isEarned(user))
        .map((rule) => existingById.get(rule.id) ?? createBadge(rule, issuedAt));
};

export const reconcileUserProgress = (user: User): User => {
    const modules = { ...user.modules };

    ([1, 2, 3, 4] as const).forEach((moduleId) => {
        const progress = modules[moduleId];
        const isComplete = getModuleCompletionPercent(progress, moduleId) >= 100;

        if (isComplete && !progress.completedAt) {
            modules[moduleId] = {
                ...progress,
                completedAt: new Date().toISOString(),
            };
        }
    });

    const normalizedUser = {
        ...user,
        modules,
        badges: user.badges ?? [],
    };

    return {
        ...normalizedUser,
        badges: getEarnedBadges(normalizedUser),
    };
};

export const getVanguardProgressSummary = (user: User | null) => {
    if (!user) {
        return {
            completedSections: 0,
            totalSections: Object.values(VANGUARD_MODULE_TOTALS).reduce((sum, value) => sum + value, 0),
            completedModules: 0,
            totalModules: 4,
            completionPercent: 0,
            badgesEarned: 0,
            certificatesEarned: 0,
        };
    }

    const moduleIds = [1, 2, 3, 4] as const;
    const completedSections = moduleIds.reduce((sum, moduleId) => sum + user.modules[moduleId].completedSections.length, 0);
    const totalSections = moduleIds.reduce((sum, moduleId) => sum + VANGUARD_MODULE_TOTALS[moduleId], 0);
    const completedModules = moduleIds.filter((moduleId) => getModuleCompletionPercent(user.modules[moduleId], moduleId) >= 100).length;
    const certificatesEarned = moduleIds.filter((moduleId) => Boolean(user.modules[moduleId].certificateId)).length + (user.finalCertificationId ? 1 : 0);

    return {
        completedSections,
        totalSections,
        completedModules,
        totalModules: 4,
        completionPercent: totalSections === 0 ? 0 : Math.min(100, Math.round((completedSections / totalSections) * 100)),
        badgesEarned: user.badges?.length ?? 0,
        certificatesEarned,
    };
};
