import React, { useCallback, useEffect, useState } from 'react';
import type { ProgramKey } from '../programIntegrationContract';
import {
    cancelLiveSessionRegistration,
    listProgramLiveSessions,
    registerForLiveSession,
    type ProgramLiveSession,
} from '../liveSessions';

const formatSessionStart = (session: ProgramLiveSession) => {
    const startsAt = new Date(session.startsAt);

    try {
        return startsAt.toLocaleString([], {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: session.timezone,
        });
    } catch {
        return startsAt.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    }
};

const ProgramLiveSessions: React.FC<{ programKey: ProgramKey }> = ({ programKey }) => {
    const [sessions, setSessions] = useState<ProgramLiveSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            setSessions(await listProgramLiveSessions(programKey));
        } catch (error) {
            console.warn('Live sessions could not be loaded.', error);
            setMessage('Live-session schedule is temporarily unavailable. Self-paced access is unaffected.');
        } finally {
            setLoading(false);
        }
    }, [programKey]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    const toggleRegistration = async (session: ProgramLiveSession) => {
        setBusyId(session.id);
        setMessage(null);
        try {
            if (session.isRegistered) {
                await cancelLiveSessionRegistration(session.id);
                setMessage('Live-session registration cancelled. Your self-paced course remains available.');
            } else {
                await registerForLiveSession(session.id);
                setMessage('You are registered. The session link is now available below.');
            }
            await refresh();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Unable to update live-session registration.');
        } finally {
            setBusyId(null);
        }
    };

    if (!loading && sessions.length === 0) return null;

    return (
        <section className="mt-6 rounded-[1.8rem] border border-cyan-200/15 bg-slate-950/65 p-6 shadow-zen-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-200">Optional guided delivery</p>
                    <h2 className="mt-2 text-2xl font-black text-white">Join a live session</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                        Register for guided time with a ZEN facilitator, or continue the complete program at your own pace.
                    </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">Self-paced stays on</span>
            </div>

            {message && <p className="mt-4 rounded-xl border border-cyan-200/15 bg-cyan-300/[0.08] px-4 py-3 text-sm text-cyan-100">{message}</p>}
            {loading ? (
                <p className="mt-5 text-sm text-slate-400">Loading live sessions…</p>
            ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {sessions.map((session) => {
                        const remaining = session.capacity == null
                            ? null
                            : Math.max(0, session.capacity - session.registeredCount);
                        const registrationClosed = !session.registrationOpen;
                        const registrationUnavailable = registrationClosed
                            || (!session.isRegistered && remaining === 0);
                        const registrationLabel = busyId === session.id
                            ? 'Saving…'
                            : registrationClosed
                                ? 'Registration closed'
                                : session.isRegistered
                                    ? 'Cancel registration'
                                    : remaining === 0
                                        ? 'Session full'
                                        : 'Register for session';
                        return (
                            <article key={session.id} className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="rounded-full bg-cyan-200 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-950">Live</span>
                                    {remaining != null && <span className="text-xs font-semibold text-slate-400">{remaining} seat{remaining === 1 ? '' : 's'} left</span>}
                                </div>
                                <h3 className="mt-4 text-lg font-black text-white">{session.title}</h3>
                                {session.description && <p className="mt-2 text-sm leading-6 text-slate-300">{session.description}</p>}
                                <p className="mt-4 text-sm font-bold text-cyan-100">
                                    {formatSessionStart(session)}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">Timezone: {session.timezone}</p>
                                <div className="mt-5 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => void toggleRegistration(session)}
                                        disabled={busyId === session.id || registrationUnavailable}
                                        className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
                                    >
                                        {registrationLabel}
                                    </button>
                                    {session.isRegistered && session.meetingUrl && (
                                        <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-cyan-200/25 bg-cyan-300/[0.10] px-4 py-2 text-xs font-black text-cyan-100">
                                            Open meeting link
                                        </a>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default ProgramLiveSessions;
