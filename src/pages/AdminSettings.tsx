import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { calculateTrackableItems } from '../zen-programs/programsRegistry';
import {
    updateProgramPublishSetting,
    useProgramPublishSettings,
    type ProgramPublishUpdate,
} from '../zen-programs/useProgramPublishSettings';
import type { ArsenalReadyStatus, ProgramAvailabilityStatus, ProgramManifest } from '../zen-programs/types';

const availabilityOptions: ProgramAvailabilityStatus[] = ['available', 'private-beta', 'coming-soon', 'draft', 'unavailable'];
const readinessOptions: ArsenalReadyStatus[] = ['not-started', 'staging', 'merge-ready', 'merged'];

const createDraftFromProgram = (program: ProgramManifest): ProgramPublishUpdate => ({
    availabilityStatus: program.availability.availabilityStatus,
    published: program.availability.published,
    adminPreviewEnabled: program.availability.adminPreviewEnabled,
    publicLabel: program.availability.publicLabel,
    adminLabel: program.availability.adminLabel,
    arsenalReadyStatus: program.availability.arsenalReadyStatus,
    arsenalMergeNotes: program.availability.arsenalMergeNotes.join('\n'),
    metadata: { source: 'admin-settings' },
});

const AdminSettings: React.FC = () => {
    const { stats } = useAdmin();
    const { programManifests, loading, error, reload, usingRegistryFallback } = useProgramPublishSettings(true);
    const [selectedProgramId, setSelectedProgramId] = React.useState('ai-pioneer');
    const selectedProgram = React.useMemo(() => (
        programManifests.find((program) => program.programId === selectedProgramId) ?? programManifests[0]
    ), [programManifests, selectedProgramId]);
    const [draft, setDraft] = React.useState<ProgramPublishUpdate | null>(null);
    const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [saveError, setSaveError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (selectedProgram) {
            setDraft(createDraftFromProgram(selectedProgram));
            setSaveStatus('idle');
            setSaveError(null);
        }
    }, [selectedProgram]);

    const updateDraft = (updates: Partial<ProgramPublishUpdate>) => {
        setDraft((currentDraft) => currentDraft ? { ...currentDraft, ...updates } : currentDraft);
        setSaveStatus('idle');
        setSaveError(null);
    };

    const handleSave = async () => {
        if (!selectedProgram || !draft) {
            return;
        }

        setSaveStatus('saving');
        setSaveError(null);

        try {
            await updateProgramPublishSetting(selectedProgram.programId, draft);
            await reload();
            setSaveStatus('saved');
        } catch (requestError) {
            setSaveStatus('error');
            setSaveError(requestError instanceof Error ? requestError.message : 'Unable to save program publishing settings.');
        }
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white">Settings</h1>
                <p className="text-slate-400 mt-1">Manage program configuration and preferences</p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-5">
                    <div>
                        <h3 className="text-lg font-bold text-white">Program Publishing</h3>
                        <p className="text-sm text-slate-400">Persist public availability settings in Supabase. Registry metadata remains the fallback if the backend is unavailable.</p>
                    </div>
                    <span className={`self-start rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${usingRegistryFallback ? 'border-amber-400/30 bg-amber-400/10 text-amber-200' : 'border-green-400/30 bg-green-400/10 text-green-200'}`}>
                        {usingRegistryFallback ? 'Registry fallback' : 'Supabase-backed'}
                    </span>
                </div>

                {error && (
                    <div className="mb-5 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">
                        {error}
                    </div>
                )}

                <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
                    <div className="space-y-2">
                        {programManifests.map((program) => (
                            <button
                                key={program.programId}
                                type="button"
                                onClick={() => setSelectedProgramId(program.programId)}
                                className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${selectedProgram?.programId === program.programId ? 'border-zen-gold/30 bg-zen-gold/[0.08]' : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600'}`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <span className="font-semibold text-white">{program.name}</span>
                                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${program.availability.published ? 'bg-green-400/10 text-green-300' : 'bg-slate-700/70 text-slate-300'}`}>
                                        {program.availability.published ? 'Published' : 'Unpublished'}
                                    </span>
                                </div>
                                <div className="mt-1 text-xs text-slate-500">{program.route.primary}</div>
                            </button>
                        ))}
                    </div>

                    {selectedProgram && draft && (
                        <div className="rounded-xl border border-slate-700/50 bg-slate-900/30 p-5">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h4 className="text-xl font-bold text-white">{selectedProgram.name}</h4>
                                    <p className="mt-1 text-sm text-slate-400">{selectedProgram.description}</p>
                                </div>
                                {loading && <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Loading</span>}
                            </div>

                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <label className="block">
                                    <span className="block text-sm font-bold text-slate-400 mb-2">Availability Status</span>
                                    <select
                                        value={draft.availabilityStatus}
                                        onChange={(event) => updateDraft({ availabilityStatus: event.target.value as ProgramAvailabilityStatus })}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                                    >
                                        {availabilityOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="block text-sm font-bold text-slate-400 mb-2">Arsenal Readiness</span>
                                    <select
                                        value={draft.arsenalReadyStatus}
                                        onChange={(event) => updateDraft({ arsenalReadyStatus: event.target.value as ArsenalReadyStatus })}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                                    >
                                        {readinessOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="block text-sm font-bold text-slate-400 mb-2">Public Label</span>
                                    <input
                                        type="text"
                                        value={draft.publicLabel}
                                        onChange={(event) => updateDraft({ publicLabel: event.target.value })}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="block text-sm font-bold text-slate-400 mb-2">Admin Label</span>
                                    <input
                                        type="text"
                                        value={draft.adminLabel}
                                        onChange={(event) => updateDraft({ adminLabel: event.target.value })}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                                    />
                                </label>
                            </div>

                            <div className="mt-5 grid gap-3 md:grid-cols-2">
                                <label className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-950/40 px-4 py-3">
                                    <span>
                                        <span className="block font-semibold text-white">Published</span>
                                        <span className="block text-xs text-slate-500">Normal users can open public content when availability allows it.</span>
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={draft.published}
                                        onChange={(event) => updateDraft({ published: event.target.checked })}
                                        className="h-5 w-5 accent-brand-primary"
                                    />
                                </label>

                                <label className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-950/40 px-4 py-3">
                                    <span>
                                        <span className="block font-semibold text-white">Admin Preview</span>
                                        <span className="block text-xs text-slate-500">Admins can open staged content without publishing.</span>
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={draft.adminPreviewEnabled}
                                        onChange={(event) => updateDraft({ adminPreviewEnabled: event.target.checked })}
                                        className="h-5 w-5 accent-brand-primary"
                                    />
                                </label>
                            </div>

                            <label className="mt-5 block">
                                <span className="block text-sm font-bold text-slate-400 mb-2">Arsenal Merge Notes</span>
                                <textarea
                                    value={draft.arsenalMergeNotes}
                                    onChange={(event) => updateDraft({ arsenalMergeNotes: event.target.value })}
                                    rows={5}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                                />
                            </label>

                            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-sm">
                                    {saveStatus === 'saved' && <span className="text-green-300">Saved to Supabase.</span>}
                                    {saveStatus === 'error' && <span className="text-red-300">{saveError}</span>}
                                    {saveStatus === 'idle' && <span className="text-slate-500">Changes are not saved until you click Save.</span>}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saveStatus === 'saving'}
                                    className="rounded-xl bg-brand-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saveStatus === 'saving' ? 'Saving...' : 'Save Publishing Settings'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-bold text-white mb-2">Arsenal Readiness</h3>
                <p className="text-sm text-slate-400 mb-5">Staging summary for future Arsenal ingestion. This does not merge or rename the app.</p>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {programManifests.map((program) => (
                        <div key={program.programId} className="rounded-xl border border-slate-700/50 bg-slate-900/30 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className="font-bold text-white">{program.name}</h4>
                                <span className="rounded-full bg-blue-400/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-blue-200">
                                    {program.availability.arsenalReadyStatus}
                                </span>
                            </div>
                            <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                                <div>
                                    <dt className="text-xs uppercase tracking-wide text-slate-500">Content</dt>
                                    <dd className="text-slate-300">{program.arsenalReadiness.contentStatus}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs uppercase tracking-wide text-slate-500">Entitlements</dt>
                                    <dd className="text-slate-300">{program.arsenalReadiness.entitlementStatus}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs uppercase tracking-wide text-slate-500">Billing</dt>
                                    <dd className="text-slate-300">{program.arsenalReadiness.billingStatus}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs uppercase tracking-wide text-slate-500">Route</dt>
                                    <dd className="text-slate-300">{program.arsenalReadiness.routeStatus}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs uppercase tracking-wide text-slate-500">Trackable Items</dt>
                                    <dd className="text-slate-300">{calculateTrackableItems(program)}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs uppercase tracking-wide text-slate-500">Public Availability</dt>
                                    <dd className="text-slate-300">{program.arsenalReadiness.publicAvailability}</dd>
                                </div>
                            </dl>
                            <ul className="mt-4 space-y-1 text-sm text-slate-400">
                                {program.arsenalReadiness.mergeReadinessNotes.map((note) => (
                                    <li key={note}>- {note}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Program Settings */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Program Settings</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Program Name</label>
                            <input
                                type="text"
                                defaultValue="ZEN Vanguard AI Professionals Program"
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Max Students</label>
                            <input
                                type="number"
                                defaultValue={500}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-primary"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Open Enrollment</p>
                                <p className="text-slate-500 text-sm">Allow new student registrations</p>
                            </div>
                            <button className="w-12 h-6 bg-brand-primary rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Certificate Generation</p>
                                <p className="text-slate-500 text-sm">Auto-generate on module completion</p>
                            </div>
                            <button className="w-12 h-6 bg-brand-primary rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Notifications</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'New student enrollments', enabled: true },
                            { label: 'Certificate completions', enabled: true },
                            { label: 'At-risk student alerts', enabled: true },
                            { label: 'Weekly summary reports', enabled: false },
                            { label: 'Student messages', enabled: true },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl">
                                <span className="text-slate-300">{item.label}</span>
                                <button className={`w-10 h-5 rounded-full relative transition-colors ${item.enabled ? 'bg-brand-primary' : 'bg-slate-600'}`}>
                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${item.enabled ? 'right-0.5' : 'left-0.5'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-bold text-white mb-6">System Information</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-900/30 rounded-xl">
                            <span className="text-slate-400">Version</span>
                            <span className="text-white font-mono">v2.4.1</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-900/30 rounded-xl">
                            <span className="text-slate-400">Total Students</span>
                            <span className="text-white font-bold">{stats.totalStudents}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-900/30 rounded-xl">
                            <span className="text-slate-400">Active Modules</span>
                            <span className="text-white font-bold">4</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-900/30 rounded-xl">
                            <span className="text-slate-400">Database Status</span>
                            <span className="text-green-400 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                Connected
                            </span>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl border border-red-500/30 p-6">
                    <h3 className="text-lg font-bold text-red-400 mb-6">Danger Zone</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-white font-medium">Reset All Progress</p>
                                <p className="text-red-300/70 text-sm">Clear all student progress data</p>
                            </div>
                            <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-colors">
                                Reset
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-white font-medium">Export All Data</p>
                                <p className="text-slate-500 text-sm">Download complete database backup</p>
                            </div>
                            <button className="px-4 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors">
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
