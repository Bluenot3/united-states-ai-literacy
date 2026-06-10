import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
    adminGrantProgramAccess,
    adminRevokeProgramAccess,
    PROGRAM_KEYS,
    type ProgramEntitlement,
    type ProgramKey,
} from '../services/programAccess';

interface Row extends ProgramEntitlement {
    email?: string | null;
    name?: string | null;
}

const AdminEntitlements: React.FC = () => {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | ProgramKey>('all');
    const [busy, setBusy] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // Grant form
    const [grantUserId, setGrantUserId] = useState('');
    const [grantProgram, setGrantProgram] = useState<ProgramKey>('pioneer');
    const [grantSource, setGrantSource] = useState('admin');
    const [grantNote, setGrantNote] = useState('');
    const [grantEndsAt, setGrantEndsAt] = useState('');

    async function refresh() {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('program_entitlements')
                .select('*')
                .order('updated_at', { ascending: false })
                .limit(500);

            // Best-effort join to profiles for email/name display.
            const userIds = Array.from(new Set((data ?? []).map((r: ProgramEntitlement) => r.user_id)));
            let profileMap: Record<string, { email?: string; name?: string }> = {};
            if (userIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('user_profiles')
                    .select('id,email,name')
                    .in('id', userIds);
                profileMap = Object.fromEntries(
                    (profiles ?? []).map((p: { id: string; email?: string; name?: string }) =>
                        [p.id, { email: p.email, name: p.name }]),
                );
            }
            setRows((data ?? []).map((r: ProgramEntitlement) => ({
                ...r,
                email: profileMap[r.user_id]?.email ?? null,
                name: profileMap[r.user_id]?.name ?? null,
            })));
        } catch (e) {
            console.warn(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { void refresh(); }, []);

    async function handleGrant(e: React.FormEvent) {
        e.preventDefault();
        if (!grantUserId.trim()) { setMessage('User ID is required.'); return; }
        setBusy('grant');
        setMessage(null);
        try {
            const { error } = await adminGrantProgramAccess({
                userId: grantUserId.trim(),
                programKey: grantProgram,
                source: grantSource || 'admin',
                accessEndsAt: grantEndsAt ? new Date(grantEndsAt).toISOString() : null,
                note: grantNote || null,
            });
            if (error) setMessage(`Grant failed: ${error.message}`);
            else {
                setMessage(`Granted ${grantProgram} access.`);
                setGrantUserId(''); setGrantNote(''); setGrantEndsAt('');
                await refresh();
            }
        } finally { setBusy(null); }
    }

    async function handleRevoke(row: Row) {
        const note = window.prompt('Reason for revoking (optional)?') ?? '';
        setBusy(row.id);
        try {
            const { error } = await adminRevokeProgramAccess({
                userId: row.user_id, programKey: row.program_key as ProgramKey, note,
            });
            if (error) setMessage(`Revoke failed: ${error.message}`);
            else { setMessage(`Revoked ${row.program_key} for ${row.email ?? row.user_id}.`); await refresh(); }
        } finally { setBusy(null); }
    }

    const visibleRows = filter === 'all' ? rows : rows.filter(r => r.program_key === filter);

    return (
        <div className="min-h-screen bg-zen-navy text-white">
            <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
                <header>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zen-gold">Admin · Access Control</p>
                    <h1 className="mt-2 text-3xl font-black">Program Entitlements</h1>
                    <p className="mt-2 text-sm text-slate-300 max-w-2xl">
                        Grant, revoke, and audit per-program access. Stripe webhook writes are the
                        source of truth for paid access; use the grant form for scholarship,
                        contract, partner, or cohort members.
                    </p>
                </header>

                {message && (
                    <div className="rounded-xl border border-zen-gold/30 bg-zen-gold/10 px-4 py-3 text-sm">
                        {message}
                    </div>
                )}

                <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                    <h2 className="text-lg font-bold">Grant manual access</h2>
                    <p className="mt-1 text-xs text-slate-400">
                        Use the user&apos;s Supabase <code>auth.users.id</code> (UUID). Get it from the
                        Users panel or <code>user_profiles.id</code>.
                    </p>
                    <form onSubmit={handleGrant} className="mt-4 grid gap-3 sm:grid-cols-2">
                        <input
                            value={grantUserId}
                            onChange={(e) => setGrantUserId(e.target.value)}
                            placeholder="user_id (uuid)"
                            className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
                            required
                        />
                        <select
                            value={grantProgram}
                            onChange={(e) => setGrantProgram(e.target.value as ProgramKey)}
                            className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
                        >
                            {PROGRAM_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                        <input
                            value={grantSource}
                            onChange={(e) => setGrantSource(e.target.value)}
                            placeholder="source (admin / partner / cohort / scholarship)"
                            className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
                        />
                        <input
                            type="date"
                            value={grantEndsAt}
                            onChange={(e) => setGrantEndsAt(e.target.value)}
                            placeholder="access_ends_at (optional)"
                            className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
                        />
                        <input
                            value={grantNote}
                            onChange={(e) => setGrantNote(e.target.value)}
                            placeholder="internal note (optional)"
                            className="sm:col-span-2 rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
                        />
                        <button
                            type="submit"
                            disabled={busy === 'grant'}
                            className="sm:col-span-2 rounded-full bg-zen-gold text-zen-navy font-semibold py-2.5 text-sm disabled:opacity-50"
                        >
                            {busy === 'grant' ? 'Granting…' : 'Grant access'}
                        </button>
                    </form>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold">Entitlement records</h2>
                        <div className="flex gap-2 text-xs">
                            {(['all', ...PROGRAM_KEYS] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`rounded-full px-3 py-1 border ${filter === f ? 'border-zen-gold text-zen-gold' : 'border-white/10 text-slate-300'}`}
                                >{f}</button>
                            ))}
                            <button onClick={() => void refresh()} className="rounded-full px-3 py-1 border border-white/10 text-slate-300">
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-white/10">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Program</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Source</th>
                                    <th className="px-4 py-3">Window</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">Loading…</td></tr>
                                )}
                                {!loading && visibleRows.length === 0 && (
                                    <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">No entitlement records yet.</td></tr>
                                )}
                                {visibleRows.map(r => (
                                    <tr key={r.id} className="border-t border-white/5">
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{r.name || r.email || '—'}</div>
                                            <div className="text-[11px] text-slate-500 font-mono">{r.user_id}</div>
                                        </td>
                                        <td className="px-4 py-3">{r.program_key}</td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full px-2 py-0.5 text-[11px] ${
                                                r.status === 'active' || r.status === 'trialing'
                                                    ? 'bg-emerald-500/20 text-emerald-300'
                                                    : r.status === 'revoked' || r.status === 'canceled' || r.status === 'expired'
                                                        ? 'bg-rose-500/20 text-rose-300'
                                                        : 'bg-amber-500/20 text-amber-300'
                                            }`}>{r.status}</span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-300">{r.source}</td>
                                        <td className="px-4 py-3 text-[11px] text-slate-400">
                                            {r.access_starts_at ? new Date(r.access_starts_at).toLocaleDateString() : '—'}
                                            {' → '}
                                            {r.access_ends_at ? new Date(r.access_ends_at).toLocaleDateString() : '∞'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {(r.status === 'active' || r.status === 'trialing') && (
                                                <button
                                                    onClick={() => handleRevoke(r)}
                                                    disabled={busy === r.id}
                                                    className="rounded-full border border-rose-400/40 text-rose-300 px-3 py-1 text-xs disabled:opacity-50"
                                                >Revoke</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminEntitlements;
