import React, { useEffect, useMemo, useState } from 'react';
import {
    adminListLiveSessions,
    adminSaveLiveSession,
    type ProgramLiveSession,
} from '../liveSessions';
import type { ProgramCatalogItem, ProgramKey } from '../programIntegrationContract';

const localTimeValue = (date: Date) => {
    const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return shifted.toISOString().slice(0, 16);
};

const LiveSessionsAdminPanel: React.FC<{ catalog: ProgramCatalogItem[] }> = ({ catalog }) => {
    const defaultProgram = catalog[0]?.programKey ?? 'ai-pioneer';
    const defaultStart = useMemo(() => new Date(Date.now() + 7 * 86_400_000), []);
    const [sessions, setSessions] = useState<ProgramLiveSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [programKey, setProgramKey] = useState<ProgramKey>(defaultProgram);
    const [title, setTitle] = useState('AI Pioneer Live Lab');
    const [description, setDescription] = useState('Optional guided build session with a ZEN facilitator.');
    const [startsAt, setStartsAt] = useState(localTimeValue(defaultStart));
    const [endsAt, setEndsAt] = useState(localTimeValue(new Date(defaultStart.getTime() + 60 * 60_000)));
    const [meetingUrl, setMeetingUrl] = useState('');
    const [capacity, setCapacity] = useState('30');
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

    const refresh = async () => {
        setLoading(true);
        try {
            setSessions(await adminListLiveSessions());
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Unable to load live sessions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void refresh();
    }, []);

    const createSession = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await adminSaveLiveSession({
                programKey,
                title: title.trim(),
                description: description.trim() || null,
                startsAt: new Date(startsAt).toISOString(),
                endsAt: new Date(endsAt).toISOString(),
                timezone,
                meetingUrl: meetingUrl.trim() || null,
                capacity: capacity ? Math.max(1, Number(capacity)) : null,
            });
            setMessage('Live session published. Students can register without changing their self-paced access.');
            await refresh();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Unable to create the live session.');
        } finally {
            setSaving(false);
        }
    };

    const cancelSession = async (session: ProgramLiveSession) => {
        await adminSaveLiveSession({
            id: session.id,
            programKey: session.programKey,
            title: session.title,
            description: session.description,
            startsAt: session.startsAt,
            endsAt: session.endsAt,
            timezone: session.timezone,
            meetingUrl: session.meetingUrl,
            capacity: session.capacity,
            status: 'cancelled',
        });
        setMessage('Session cancelled. Self-paced enrollment and progress were not changed.');
        await refresh();
    };

    return (
        <section className="mt-5 rounded-[1.6rem] border border-cyan-200/15 bg-[#07101f] p-5">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-200">Live delivery</p>
                <h2 className="mt-2 text-2xl font-black">Schedule guided sessions</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">Optional sessions group learners around a date and facilitator link. Every course remains independently self-paced.</p>
            </div>
            {message && <p className="mt-4 rounded-xl border border-cyan-200/15 bg-cyan-300/[0.08] px-4 py-3 text-sm text-cyan-100">{message}</p>}
            <form onSubmit={createSession} className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <select value={programKey} onChange={(event) => setProgramKey(event.target.value as ProgramKey)} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm">
                    {catalog.map((program) => <option key={program.programKey} value={program.programKey}>{program.title}</option>)}
                </select>
                <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Session title" className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm" />
                <input required type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm" />
                <input required type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm" />
                <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" className="min-h-20 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm md:col-span-2" />
                <input value={meetingUrl} onChange={(event) => setMeetingUrl(event.target.value)} placeholder="Meeting URL (revealed after registration)" className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm" />
                <div className="flex gap-2">
                    <input type="number" min="1" value={capacity} onChange={(event) => setCapacity(event.target.value)} placeholder="Capacity" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm" />
                    <button disabled={saving} className="rounded-xl bg-cyan-200 px-4 py-2 text-sm font-black text-slate-950 disabled:opacity-50">{saving ? 'Saving…' : 'Schedule'}</button>
                </div>
            </form>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
                {loading ? <p className="text-sm text-slate-400">Loading sessions…</p> : sessions.map((session) => (
                    <article key={session.id} className="rounded-xl border border-white/10 bg-black/25 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="font-black text-white">{session.title}</p>
                                <p className="mt-1 text-xs text-slate-400">{new Date(session.startsAt).toLocaleString()} · {session.registeredCount} registered</p>
                            </div>
                            <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-300">{session.status}</span>
                        </div>
                        {session.status === 'scheduled' && <button type="button" onClick={() => void cancelSession(session)} className="mt-3 text-xs font-bold text-red-300 hover:underline">Cancel session</button>}
                    </article>
                ))}
            </div>
        </section>
    );
};

export default LiveSessionsAdminPanel;
