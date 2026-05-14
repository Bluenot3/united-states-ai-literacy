import { supabase } from '../lib/supabase';
import type { ActivityEvent, Certificate, ModuleProgress, SessionRecord, Student, User, UserBadge } from '../types';

// ============================================================
// HELPERS
// ============================================================

const createDefaultModuleProgress = (): ModuleProgress => ({
    completedSections: [],
    completedInteractives: [],
    points: 0,
    startedAt: null,
    completedAt: null,
    lastViewedSection: 'overview',
    certificateId: null,
    certificateHash: null,
});

function rowToModuleProgress(row: Record<string, unknown> | null): ModuleProgress {
    if (!row) return createDefaultModuleProgress();
    return {
        completedSections: (row.completed_sections as string[]) ?? [],
        completedInteractives: (row.completed_interactives as string[]) ?? [],
        points: (row.points as number) ?? 0,
        startedAt: (row.started_at as string) ?? null,
        completedAt: (row.completed_at as string) ?? null,
        lastViewedSection: (row.last_viewed_section as string) ?? 'overview',
        certificateId: (row.certificate_id as string) ?? null,
        certificateHash: (row.certificate_hash as string) ?? null,
    };
}

function rowToBadge(row: Record<string, unknown>): UserBadge {
    return {
        id: row.badge_id as string,
        title: row.title as string,
        description: row.description as string,
        kind: row.kind as UserBadge['kind'],
        moduleId: row.module_id ? (row.module_id as UserBadge['moduleId']) : undefined,
        earnedAt: row.earned_at as string,
    };
}

function rowToCertificate(row: Record<string, unknown>): Certificate {
    return {
        id: row.id as string,
        type: row.type as Certificate['type'],
        moduleNumber: row.module_number as Certificate['moduleNumber'],
        userName: row.user_name as string,
        userEmail: row.user_email as string,
        issuedAt: row.issued_at as string,
        performance: (row.performance as Certificate['performance']) ?? {
            sectionsCompleted: 0,
            totalSections: 0,
            interactivesCompleted: 0,
            pointsEarned: 0,
            completionPercentage: 0,
        },
        sha256Hash: row.sha256_hash as string,
        blockNumber: row.block_number as number,
        previousHash: row.previous_hash as string,
        artifactUrl: row.artifact_url as string | undefined,
        badgeId: row.badge_id as string | undefined,
    };
}

function isMissingTableError(error: unknown) {
    return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === '42P01';
}

function warnMissingSchema(tableName: string, error: unknown) {
    if (isMissingTableError(error)) {
        console.warn(`Supabase table "${tableName}" is missing. Apply supabase/migrations/001_vanguard_progress.sql before production launch.`);
        return true;
    }

    return false;
}

// ============================================================
// LOAD FULL USER FROM DATABASE
// ============================================================

async function loadFullUser(supabaseUser: { id: string; email?: string }): Promise<User | null> {
    const [profileResult, progressResult, sessionsResult, badgesResult] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('id', supabaseUser.id).single(),
        supabase.from('module_progress').select('*').eq('user_id', supabaseUser.id),
        supabase
            .from('session_history')
            .select('*')
            .eq('user_id', supabaseUser.id)
            .order('created_at', { ascending: false })
            .limit(50),
        supabase
            .from('user_badges')
            .select('*')
            .eq('user_id', supabaseUser.id)
            .order('earned_at', { ascending: false }),
    ]);

    const profile = profileResult.data;
    const progressRows = progressResult.data ?? [];
    const sessionRows = sessionsResult.data ?? [];
    const badgeRows = badgesResult.data ?? [];

    // If no profile yet, create one (first login/signup)
    if (!profile) {
        const email = supabaseUser.email ?? '';
        const newProfile = {
            id: supabaseUser.id,
            email,
            name: email.split('@')[0] ?? 'Vanguard Learner',
            picture: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
            total_points: 0,
            final_certification_id: null,
            final_certification_hash: null,
        };

        const { error } = await supabase.from('user_profiles').insert(newProfile);
        if (error) {
            console.error('Error creating user profile:', error);
            return null;
        }

        return {
            id: newProfile.id,
            email: newProfile.email,
            name: newProfile.name,
            picture: newProfile.picture,
            createdAt: new Date().toISOString(),
            totalPoints: 0,
            modules: {
                1: createDefaultModuleProgress(),
                2: createDefaultModuleProgress(),
                3: createDefaultModuleProgress(),
                4: createDefaultModuleProgress(),
            },
            sessionHistory: [],
            badges: [],
            finalCertificationId: null,
            finalCertificationHash: null,
        };
    }

    const modules: User['modules'] = {
        1: createDefaultModuleProgress(),
        2: createDefaultModuleProgress(),
        3: createDefaultModuleProgress(),
        4: createDefaultModuleProgress(),
    };

    for (const row of progressRows) {
        const moduleId = row.module_id as 1 | 2 | 3 | 4;
        if (moduleId >= 1 && moduleId <= 4) {
            modules[moduleId] = rowToModuleProgress(row);
        }
    }

    const sessionHistory: SessionRecord[] = sessionRows.map((row) => ({
        startedAt: row.started_at as string,
        endedAt: row.ended_at as string,
        moduleId: row.module_id as number,
        sectionsViewed: (row.sections_viewed as string[]) ?? [],
    }));

    return {
        id: supabaseUser.id,
        email: profile.email as string,
        name: profile.name as string,
        picture: profile.picture as string,
        createdAt: profile.created_at as string,
        totalPoints: profile.total_points as number,
        modules,
        sessionHistory,
        badges: badgeRows.map(rowToBadge),
        finalCertificationId: profile.final_certification_id as string | null,
        finalCertificationHash: profile.final_certification_hash as string | null,
    };
}

// ============================================================
// MODULE-LEVEL CACHE FOR CURRENT USER ID
// ============================================================

let _currentUserId: string | null = null;

// Initialize from current session
// @ts-expect-error - Type definition clash with local node_modules
void supabase.auth.getSession().then(({ data: { session } }) => {
    _currentUserId = session?.user?.id ?? null;
});

// Listen for auth changes
// @ts-expect-error - Type definition clash with local node_modules
supabase.auth.onAuthStateChange((_, session) => {
    _currentUserId = session?.user?.id ?? null;
});

// ============================================================
// DATA ACCESS LAYER
// ============================================================

export const dal = {
    auth: {
        /**
         * Listen for auth state changes and load full user data.
         * Fires immediately with INITIAL_SESSION, then on every login/logout.
         * @returns unsubscribe function
         */
        onAuthStateChanged(callback: (user: User | null) => void): () => void {
            let initialResolved = false;

            // Safety valve: if Supabase doesn't respond within 6 s (e.g. project still waking up),
            // treat as unauthenticated so the login page renders immediately instead of hanging.
            const safetyTimeout = setTimeout(() => {
                if (!initialResolved) {
                    initialResolved = true;
                    callback(null);
                }
            }, 6000);

            // @ts-expect-error - Type definition clash with local node_modules
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                // First event proves Supabase is responsive — clear the safety timeout
                if (!initialResolved) {
                    initialResolved = true;
                    clearTimeout(safetyTimeout);
                }

                if (session?.user) {
                    const user = await loadFullUser(session.user);
                    callback(user);
                } else {
                    callback(null);
                }
            });

            return () => {
                clearTimeout(safetyTimeout);
                subscription?.unsubscribe();
            };
        },

        /**
         * Sign in with email and password
         */
        async login(email: string, password: string): Promise<void> {
            // @ts-expect-error - Type definition clash
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw new Error(error.message);
        },

        /**
         * Sign up with email and password.
         * Returns whether email confirmation is required before the user can sign in.
         */
        async signup(email: string, password: string): Promise<{ requiresConfirmation: boolean }> {
            // @ts-expect-error - Type definition clash
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) throw new Error(error.message);
            // If Supabase returned a session immediately, confirmation is disabled
            return { requiresConfirmation: !data.session };
        },

        /**
         * Send a password reset email
         */
        async resetPassword(email: string): Promise<void> {
            // @ts-expect-error - Type definition clash
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw new Error(error.message);
        },

        /**
         * Set a new password (called after user lands on /reset-password with a valid token)
         */
        async updatePassword(newPassword: string): Promise<void> {
            // @ts-expect-error - Type definition clash
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw new Error(error.message);
        },

        /**
         * Sign out
         */
        async logout(): Promise<void> {
            // @ts-expect-error - Type definition clash
            const { error } = await supabase.auth.signOut();
            if (error) throw new Error(error.message);
        },

        /**
         * Get the current authenticated user ID
         */
        getUserId(): string | null {
            return _currentUserId;
        },
    },

    user: {
        /**
         * Update user profile and module progress
         */
        async updateUser(userId: string, user: User): Promise<void> {
            // Update user_profiles
            const { error: profileError } = await supabase.from('user_profiles').upsert({
                id: userId,
                email: user.email,
                name: user.name,
                picture: user.picture,
                total_points: user.totalPoints,
                final_certification_id: user.finalCertificationId,
                final_certification_hash: user.finalCertificationHash,
                updated_at: new Date().toISOString(),
            });

            if (profileError) {
                console.error('Error updating user profile:', profileError);
                throw profileError;
            }

            // Upsert module progress for modules that have data
            const progressRows = ([1, 2, 3, 4] as const)
                .map((moduleId) => {
                    const mp = user.modules[moduleId];
                    return {
                        user_id: userId,
                        module_id: moduleId,
                        completed_sections: mp.completedSections,
                        completed_interactives: mp.completedInteractives,
                        points: mp.points,
                        started_at: mp.startedAt,
                        completed_at: mp.completedAt,
                        last_viewed_section: mp.lastViewedSection,
                        certificate_id: mp.certificateId,
                        certificate_hash: mp.certificateHash,
                        updated_at: new Date().toISOString(),
                    };
                })
                .filter(
                    (row) =>
                        row.started_at !== null ||
                        row.completed_sections.length > 0 ||
                        row.completed_interactives.length > 0 ||
                        row.points > 0
                );

            if (progressRows.length > 0) {
                const { error: progressError } = await supabase.from('module_progress').upsert(progressRows, {
                    onConflict: 'user_id,module_id',
                });

                if (progressError) {
                    console.error('Error updating module progress:', progressError);
                    throw progressError;
                }
            }

            if (user.badges?.length) {
                const badgeRows = user.badges.map((badge) => ({
                    user_id: userId,
                    badge_id: badge.id,
                    title: badge.title,
                    description: badge.description,
                    kind: badge.kind,
                    module_id: badge.moduleId ?? null,
                    earned_at: badge.earnedAt,
                }));

                const { error: badgeError } = await supabase.from('user_badges').upsert(badgeRows, {
                    onConflict: 'user_id,badge_id',
                });

                if (badgeError && !warnMissingSchema('user_badges', badgeError)) {
                    console.error('Error updating user badges:', badgeError);
                    throw badgeError;
                }
            }
        },

        /**
         * Admin: Load all students' profiles, module progress, and session history.
         * Requires the current user to be authenticated as an admin email (see RLS policies).
         */
        async getAllStudents(): Promise<Student[]> {
            const [profilesResult, progressResult, sessionsResult, badgesResult, certificatesResult] = await Promise.all([
                supabase.from('user_profiles').select('*').order('created_at', { ascending: false }),
                supabase.from('module_progress').select('*'),
                supabase.from('session_history').select('*').order('created_at', { ascending: false }),
                supabase.from('user_badges').select('*').order('earned_at', { ascending: false }),
                supabase.from('certificates').select('*').order('issued_at', { ascending: false }),
            ]);

            const profiles = profilesResult.data ?? [];
            const allProgress = progressResult.data ?? [];
            const allSessions = sessionsResult.data ?? [];
            const allBadges = badgesResult.data ?? [];
            const allCertificates = certificatesResult.data ?? [];

            const now = Date.now();
            const twoDaysAgo = now - 48 * 60 * 60 * 1000;
            const oneDayAgo = now - 24 * 60 * 60 * 1000;

            return profiles.map((profile) => {
                const userId = profile.id as string;
                const userProgress = allProgress.filter((p) => p.user_id === userId);
                const userSessions = allSessions.filter((s) => s.user_id === userId);
                const userBadges = allBadges.filter((b) => b.user_id === userId).map(rowToBadge);
                const userCertificates = allCertificates
                    .filter((c) => String(c.user_email).toLowerCase() === String(profile.email).toLowerCase())
                    .map(rowToCertificate);

                const moduleProgress: Student['moduleProgress'] = {};
                for (const row of userProgress) {
                    const moduleId = row.module_id as number;
                    moduleProgress[moduleId] = rowToModuleProgress(row);
                }
                // Fill in missing modules with defaults
                for (const mId of [1, 2, 3, 4]) {
                    if (!moduleProgress[mId]) moduleProgress[mId] = createDefaultModuleProgress();
                }

                const sessionHistory: SessionRecord[] = userSessions.map((row) => ({
                    startedAt: row.started_at as string,
                    endedAt: row.ended_at as string,
                    moduleId: row.module_id as number,
                    sectionsViewed: (row.sections_viewed as string[]) ?? [],
                }));

                // Determine status
                const latestSession = userSessions[0];
                const lastActiveTime = latestSession
                    ? new Date(latestSession.created_at as string).getTime()
                    : new Date(profile.created_at as string).getTime();

                let status: 'active' | 'inactive' | 'at-risk' = 'inactive';
                if (lastActiveTime > oneDayAgo) status = 'active';
                else if (lastActiveTime < twoDaysAgo) status = 'at-risk';

                return {
                    id: userId,
                    email: profile.email as string,
                    name: profile.name as string,
                    avatar: profile.picture as string,
                    enrolledAt: profile.created_at as string,
                    lastActive: latestSession
                        ? (latestSession.created_at as string)
                        : (profile.created_at as string),
                    totalPoints: profile.total_points as number,
                    moduleProgress,
                    assignments: [],
                    status,
                    sessionHistory,
                    badges: userBadges,
                    certificates: userCertificates,
                    finalCertificationId: (profile.final_certification_id as string | null) ?? null,
                    finalCertificationHash: (profile.final_certification_hash as string | null) ?? null,
                };
            });
        },
    },

    admin: {
        async getActivityEvents(): Promise<ActivityEvent[]> {
            const [eventsResult, profilesResult] = await Promise.all([
                supabase
                    .from('user_activity_events')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(500),
                supabase.from('user_profiles').select('id,email,name'),
            ]);

            if (eventsResult.error && !warnMissingSchema('user_activity_events', eventsResult.error)) {
                console.error('Error loading admin activity events:', eventsResult.error);
                throw eventsResult.error;
            }

            if (profilesResult.error && !warnMissingSchema('user_profiles', profilesResult.error)) {
                console.error('Error loading admin activity profiles:', profilesResult.error);
                throw profilesResult.error;
            }

            const profilesById = new Map(
                (profilesResult.data ?? []).map((profile) => [
                    profile.id as string,
                    {
                        name: profile.name as string,
                        email: profile.email as string,
                    },
                ]),
            );

            return (eventsResult.data ?? []).map((row) => {
                const studentId = row.user_id as string;
                const profile = profilesById.get(studentId);
                return {
                    id: String(row.id),
                    studentId,
                    studentName: profile?.name || profile?.email || 'Unknown learner',
                    type: row.type as ActivityEvent['type'],
                    description: row.description as string,
                    timestamp: row.created_at as string,
                    moduleId: (row.module_id as number | null) ?? undefined,
                    points: (row.points as number | null) ?? undefined,
                };
            });
        },
    },

    sessions: {
        async insert(userId: string, session: SessionRecord): Promise<void> {
            const { error } = await supabase.from('session_history').insert({
                user_id: userId,
                started_at: session.startedAt,
                ended_at: session.endedAt,
                module_id: session.moduleId,
                sections_viewed: session.sectionsViewed,
            });

            if (error && !warnMissingSchema('session_history', error)) {
                console.error('Error inserting session history:', error);
                throw error;
            }
        },
    },

    activity: {
        async trackEvent(
            userId: string,
            event: {
                type: ActivityEvent['type'];
                description: string;
                moduleId?: number;
                points?: number;
                metadata?: Record<string, unknown>;
            },
        ): Promise<void> {
            const { error } = await supabase.from('user_activity_events').insert({
                user_id: userId,
                type: event.type,
                description: event.description,
                module_id: event.moduleId ?? null,
                points: event.points ?? null,
                metadata: event.metadata ?? {},
            });

            if (error && !warnMissingSchema('user_activity_events', error)) {
                console.error('Error inserting activity event:', error);
                throw error;
            }
        },
    },

    certificates: {
        async upsert(certificate: Certificate): Promise<void> {
            const { error } = await supabase.from('certificates').upsert({
                id: certificate.id,
                type: certificate.type,
                module_number: certificate.moduleNumber ?? null,
                user_name: certificate.userName,
                user_email: certificate.userEmail.toLowerCase(),
                issued_at: certificate.issuedAt,
                performance: certificate.performance,
                sha256_hash: certificate.sha256Hash,
                block_number: certificate.blockNumber,
                previous_hash: certificate.previousHash,
                artifact_url: certificate.artifactUrl ?? null,
                badge_id: certificate.badgeId ?? null,
            });

            if (error && !warnMissingSchema('certificates', error)) {
                console.error('Error upserting certificate:', error);
                throw error;
            }
        },

        async getById(certificateId: string): Promise<Certificate | null> {
            const { data, error } = await supabase
                .from('certificates')
                .select('*')
                .eq('id', certificateId)
                .maybeSingle();

            if (error) {
                if (warnMissingSchema('certificates', error)) {
                    return null;
                }

                console.error('Error loading certificate:', error);
                throw error;
            }

            return data ? rowToCertificate(data) : null;
        },

        async getByUserEmail(userEmail: string): Promise<Certificate[]> {
            const { data, error } = await supabase
                .from('certificates')
                .select('*')
                .eq('user_email', userEmail.toLowerCase())
                .order('issued_at', { ascending: false });

            if (error) {
                if (warnMissingSchema('certificates', error)) {
                    return [];
                }

                console.error('Error loading certificates by user:', error);
                throw error;
            }

            return (data ?? []).map(rowToCertificate);
        },
    },
};
