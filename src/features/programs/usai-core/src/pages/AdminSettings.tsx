import React from 'react';
import { useAdmin } from '../contexts/AdminContext';

const AdminSettings: React.FC = () => {
    const { stats } = useAdmin();

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white">Settings</h1>
                <p className="text-slate-400 mt-1">Manage program configuration and preferences</p>
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
