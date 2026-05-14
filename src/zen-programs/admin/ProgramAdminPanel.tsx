import React, { useEffect, useState } from 'react';
import {
    getProgramCatalog,
    type ProgramCatalogItem,
    type ProgramKey,
    type ProgramStatus,
    type RegistrationStatus,
    type UserProgramState,
} from '../programIntegrationContract';
import { programRegistrationAdapter } from '../programRegistrationAdapter';
import { getArsenalProgramBridgeCatalog } from '../arsenalProgramBridge';

const registrationStatuses: RegistrationStatus[] = ['waitlisted', 'invited', 'enrolled', 'cancelled'];
const programStatuses: ProgramStatus[] = ['draft', 'waitlist', 'preview', 'open', 'live', 'archived'];

const createRegistrationUrl = (program: ProgramCatalogItem) => `${window.location.origin}/programs/${program.slug}/register`;

export const ProgramRegistrationStats: React.FC<{ registrations: UserProgramState[] }> = ({ registrations }) => {
    const counts = registrationStatuses.map((status) => ({
        status,
        count: registrations.filter((registration) => registration.registrationStatus === status).length,
    }));

    return (
        <div className="grid gap-3 sm:grid-cols-4">
            {counts.map((item) => (
                <article key={item.status} className="rounded-[1.2rem] border border-zen-gold/10 bg-zen-navy/55 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zen-gold/60">{item.status}</p>
                    <p className="mt-2 text-2xl font-black text-white">{item.count}</p>
                </article>
            ))}
        </div>
    );
};

export const ProgramStatusControls: React.FC<{
    program: ProgramCatalogItem;
    status: ProgramStatus;
    onChange: (status: ProgramStatus) => void;
}> = ({ program, status, onChange }) => (
    <div className="rounded-[1.2rem] border border-zen-gold/10 bg-zen-navy/55 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
                <p className="font-bold text-white">{program.title}</p>
                <p className="mt-1 text-xs text-slate-500">{program.programKey}</p>
            </div>
            <select
                value={status}
                onChange={(event) => onChange(event.target.value as ProgramStatus)}
                className="rounded-xl border border-zen-gold/10 bg-[#07101f] px-3 py-2 text-sm text-white outline-none"
            >
                {programStatuses.map((programStatus) => (
                    <option key={programStatus} value={programStatus}>{programStatus}</option>
                ))}
            </select>
        </div>
    </div>
);

export const ProgramRegistrationTable: React.FC<{
    registrations: UserProgramState[];
    onStatusChange: (registration: UserProgramState, status: RegistrationStatus) => void;
}> = ({ registrations, onStatusChange }) => (
    <div className="overflow-hidden rounded-[1.4rem] border border-zen-gold/10">
        <table className="w-full min-w-[760px] border-collapse bg-zen-navy/55 text-left text-sm">
            <thead className="bg-zen-gold/[0.06] text-[10px] uppercase tracking-[0.2em] text-zen-gold/70">
                <tr>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Program</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Updated</th>
                    <th className="px-4 py-3">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-zen-gold/8 text-slate-300">
                {registrations.map((registration) => (
                    <tr key={`${registration.userId}-${registration.programKey}`}>
                        <td className="px-4 py-3">{registration.email ?? registration.userId}</td>
                        <td className="px-4 py-3">{registration.programKey}</td>
                        <td className="px-4 py-3">{registration.registrationStatus}</td>
                        <td className="px-4 py-3">{registration.source ?? 'direct'}</td>
                        <td className="px-4 py-3">{registration.lastActivityAt ?? '-'}</td>
                        <td className="px-4 py-3">
                            <select
                                value={registration.registrationStatus === 'none' ? 'waitlisted' : registration.registrationStatus}
                                onChange={(event) => onStatusChange(registration, event.target.value as RegistrationStatus)}
                                className="rounded-xl border border-zen-gold/10 bg-[#07101f] px-3 py-2 text-sm text-white outline-none"
                            >
                                {registrationStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const ProgramAccessGrantPanel: React.FC<{
    programKey: ProgramKey;
    onGrant: (userId: string, programKey: ProgramKey) => void;
}> = ({ programKey, onGrant }) => {
    const [userId, setUserId] = useState('');

    return (
        <div className="rounded-[1.4rem] border border-zen-gold/10 bg-zen-navy/55 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/60">Grant access</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    placeholder="Arsenal auth.users.id"
                    className="min-w-0 flex-1 rounded-xl border border-zen-gold/10 bg-[#07101f] px-3 py-2 text-sm text-white outline-none"
                />
                <button
                    type="button"
                    onClick={() => {
                        if (userId) onGrant(userId, programKey);
                    }}
                    className="rounded-xl bg-zen-gold px-4 py-2 text-sm font-semibold text-zen-navy"
                >
                    Grant enrolled
                </button>
            </div>
        </div>
    );
};

const toCsv = (registrations: UserProgramState[]) => {
    const rows = [
        ['user_id', 'email', 'program_key', 'registration_status', 'access_level', 'source', 'last_activity_at'],
        ...registrations.map((registration) => [
            registration.userId,
            registration.email ?? '',
            registration.programKey,
            registration.registrationStatus,
            registration.accessLevel,
            registration.source ?? '',
            registration.lastActivityAt ?? '',
        ]),
    ];

    return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
};

export const ProgramAdminPanel: React.FC = () => {
    const catalog = getProgramCatalog();
    const bridgeCatalog = getArsenalProgramBridgeCatalog({ isAuthenticated: true, isAdmin: true });
    const [registrations, setRegistrations] = useState<UserProgramState[]>([]);
    const [programKeyFilter, setProgramKeyFilter] = useState<ProgramKey | ''>('');
    const [emailFilter, setEmailFilter] = useState('');
    const [localStatuses, setLocalStatuses] = useState<Record<ProgramKey, ProgramStatus>>(() => (
        Object.fromEntries(catalog.map((program) => [program.programKey, program.status])) as Record<ProgramKey, ProgramStatus>
    ));

    const reload = async () => {
        setRegistrations(await programRegistrationAdapter.adminListRegistrations({
            programKey: programKeyFilter || undefined,
            email: emailFilter || undefined,
        }));
    };

    useEffect(() => {
        void reload().catch((error) => console.warn('Unable to load program registrations.', error));
    }, [programKeyFilter, emailFilter]);

    const selectedProgramKey = programKeyFilter || catalog[0]?.programKey;
    const selectedProgram = catalog.find((program) => program.programKey === selectedProgramKey) ?? catalog[0];

    const copyUrl = async (program: ProgramCatalogItem) => {
        const url = createRegistrationUrl(program);
        await navigator.clipboard?.writeText(url);
    };

    const exportCsv = () => {
        const blob = new Blob([toCsv(registrations)], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'program-registrations.csv';
        anchor.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-zen-navy px-5 py-8 text-white sm:px-8">
            <div className="mx-auto max-w-7xl">
                <section className="rounded-[2rem] border border-zen-gold/12 bg-zen-surface/70 p-6 shadow-zen-card backdrop-blur-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-zen-gold/70">Program admin</p>
                            <h1 className="mt-2 text-3xl font-black tracking-tight">Adapter-backed registration ops</h1>
                            <p className="mt-2 text-sm text-slate-400">Mode: {programRegistrationAdapter.mode}. Arsenal can replace the adapter without changing the UI contract.</p>
                        </div>
                        <button type="button" onClick={exportCsv} className="rounded-full border border-zen-gold/20 bg-zen-gold/[0.08] px-5 py-3 text-sm font-semibold text-zen-gold">
                            Export CSV
                        </button>
                    </div>
                </section>

                <section className="mt-5">
                    <ProgramRegistrationStats registrations={registrations} />
                </section>

                <section className="mt-5 grid gap-4 lg:grid-cols-2">
                    {bridgeCatalog.filter((bridge) => bridge.programKey === 'vanguard' || bridge.programKey === 'ai-pioneer').map((bridge) => (
                        <article key={bridge.programKey} className="rounded-[1.6rem] border border-zen-gold/10 bg-zen-surface/60 p-5 shadow-zen-card">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold/60">Arsenal bridge</p>
                                    <h2 className="mt-2 text-xl font-black text-white">{bridge.title}</h2>
                                </div>
                                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
                                    {bridge.status}
                                </span>
                            </div>
                            <p className="mt-3 text-sm leading-7 text-slate-300">{bridge.roleInArsenal}</p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-[1.1rem] border border-white/10 bg-zen-navy/55 p-4">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Arsenal owns</p>
                                    <p className="mt-2 text-sm text-slate-200">{bridge.arsenalOwns.slice(0, 4).join(', ')}</p>
                                </div>
                                <div className="rounded-[1.1rem] border border-white/10 bg-zen-navy/55 p-4">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Program owns</p>
                                    <p className="mt-2 text-sm text-slate-200">{bridge.ecosystemOwns.join(', ')}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>

                <section className="mt-5 grid gap-4 lg:grid-cols-2">
                    {catalog.map((program) => (
                        <ProgramStatusControls
                            key={program.programKey}
                            program={program}
                            status={localStatuses[program.programKey]}
                            onChange={(status) => setLocalStatuses((previous) => ({ ...previous, [program.programKey]: status }))}
                        />
                    ))}
                </section>

                <section className="mt-5 rounded-[1.6rem] border border-zen-gold/10 bg-zen-surface/60 p-5 shadow-zen-card">
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={programKeyFilter}
                            onChange={(event) => setProgramKeyFilter(event.target.value as ProgramKey | '')}
                            className="rounded-xl border border-zen-gold/10 bg-[#07101f] px-3 py-2 text-sm text-white outline-none"
                        >
                            <option value="">All programs</option>
                            {catalog.map((program) => <option key={program.programKey} value={program.programKey}>{program.title}</option>)}
                        </select>
                        <input
                            value={emailFilter}
                            onChange={(event) => setEmailFilter(event.target.value)}
                            placeholder="Search email"
                            className="rounded-xl border border-zen-gold/10 bg-[#07101f] px-3 py-2 text-sm text-white outline-none"
                        />
                        {selectedProgram && (
                            <button type="button" onClick={() => void copyUrl(selectedProgram)} className="rounded-xl border border-zen-gold/20 bg-zen-gold/[0.08] px-4 py-2 text-sm font-semibold text-zen-gold">
                                Copy registration URL
                            </button>
                        )}
                    </div>

                    {selectedProgram && (
                        <div className="mt-5">
                            <ProgramAccessGrantPanel
                                programKey={selectedProgram.programKey}
                                onGrant={(userId, programKey) => {
                                    void programRegistrationAdapter.adminGrantProgramAccess({
                                        userId,
                                        programKey,
                                        accessLevel: 'enrolled',
                                        reason: 'Granted from adapter-backed admin panel',
                                    }).then(reload);
                                }}
                            />
                        </div>
                    )}
                </section>

                <section className="mt-5 overflow-x-auto">
                    <ProgramRegistrationTable
                        registrations={registrations}
                        onStatusChange={(registration, status) => {
                            if (status === 'none') return;
                            void programRegistrationAdapter.adminUpdateRegistrationStatus({
                                userId: registration.userId,
                                programKey: registration.programKey,
                                status,
                            }).then(reload);
                        }}
                    />
                </section>
            </div>
        </div>
    );
};

export default ProgramAdminPanel;
