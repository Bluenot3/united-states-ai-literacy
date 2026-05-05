
import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../icons/SparklesIcon';

type Region = 'EU' | 'US' | 'CN' | 'GLOBAL';
type Action = 'PROCESS_DATA' | 'DEPLOY_MODEL' | 'GENERATE_CONTENT';

interface PolicyDoc {
    id: string;
    title: string;
    snippet: string;
    severity: 'BLOCKING' | 'WARNING' | 'INFO';
}

const POLICY_DB: Record<Region, PolicyDoc[]> = {
    EU: [
        { id: 'GDPR-Art-44', title: 'GDPR Data Transfer', snippet: 'Personal data transfer to non-adequate third countries is restricted.', severity: 'BLOCKING' },
        { id: 'EU-AI-Act', title: 'EU AI Act (High Risk)', snippet: 'Systems evaluating credit/health must have human oversight.', severity: 'WARNING' }
    ],
    US: [
        { id: 'CCPA-OptOut', title: 'CCPA/CPRA', snippet: 'Consumer right to opt-out of data sale must be respected.', severity: 'WARNING' },
        { id: 'HIPAA-Sec', title: 'HIPAA Security Rule', snippet: 'PHI requires encryption at rest and in transit.', severity: 'BLOCKING' }
    ],
    CN: [
        { id: 'DSL-Art-31', title: 'Data Security Law', snippet: 'Critical data gathered in territory must be stored locally.', severity: 'BLOCKING' },
        { id: 'GenAI-Regs', title: 'Generative AI Measures', snippet: 'Content must reflect core socialist values.', severity: 'BLOCKING' }
    ],
    GLOBAL: [
        { id: 'Corp-Ethic', title: 'Global Ethics Policy', snippet: 'Do not generate hate speech or discriminatory content.', severity: 'BLOCKING' }
    ]
};

const JurisdictionAwareRag: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [region, setRegion] = useState<Region>('EU');
    const [action, setAction] = useState<Action>('PROCESS_DATA');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ decision: string; retrieved: PolicyDoc[] } | null>(null);

    const handleRun = () => {
        setIsProcessing(true);
        setResult(null);

        setTimeout(() => {
            // Retrieve relevant policies (Regional + Global)
            const regionalDocs = POLICY_DB[region] || [];
            const globalDocs = POLICY_DB.GLOBAL;
            const retrieved = [...regionalDocs, ...globalDocs];

            // Simple decision logic based on policies and action
            let decision = "APPROVED";
            let reason = "Compliance checks passed.";

            if (action === 'PROCESS_DATA') {
                if (region === 'EU') { decision = "CONDITIONAL"; reason = "Requires Standard Contractual Clauses (GDPR)."; }
                if (region === 'CN') { decision = "BLOCKED"; reason = "Data must be stored locally (DSL Art 31)."; }
            }
            if (action === 'GENERATE_CONTENT') {
                if (region === 'CN') { decision = "REVIEW_REQUIRED"; reason = "Content alignment check needed."; }
            }

            setResult({ decision, retrieved });
            setIsProcessing(false);

            if (user && !user.progress.completedInteractives.includes(interactiveId)) {
                addPoints(20);
                updateProgress(interactiveId, 'interactive');
            }
        }, 1200);
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out border border-gray-100">
            <h4 className="font-bold text-lg text-brand-text mb-2 text-center">Jurisdiction-Aware Policy Engine</h4>
            <p className="text-center text-sm text-brand-text-light mb-6">Select a region and action to see how RAG retrieves different compliance rules dynamically.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Controls */}
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Operating Region</label>
                        <select 
                            value={region} 
                            onChange={(e) => setRegion(e.target.value as Region)}
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-brand-text focus:ring-2 focus:ring-brand-primary/50 outline-none"
                        >
                            <option value="EU">European Union (EU)</option>
                            <option value="US">United States (US)</option>
                            <option value="CN">China (CN)</option>
                        </select>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Agent Action</label>
                        <select 
                            value={action} 
                            onChange={(e) => setAction(e.target.value as Action)}
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-brand-text focus:ring-2 focus:ring-brand-primary/50 outline-none"
                        >
                            <option value="PROCESS_DATA">Process User Data</option>
                            <option value="DEPLOY_MODEL">Deploy Model Endpoint</option>
                            <option value="GENERATE_CONTENT">Generate Public Content</option>
                        </select>
                    </div>

                    <button 
                        onClick={handleRun}
                        disabled={isProcessing}
                        className="w-full py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                    >
                        {isProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <SparklesIcon />}
                        Evaluate Compliance
                    </button>
                </div>

                {/* Output */}
                <div className="md:col-span-2 bg-slate-900 rounded-xl p-5 text-white flex flex-col h-full min-h-[300px]">
                    <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-3">
                        <span className="text-xs font-mono text-slate-400">POLICY_RAG_SYSTEM_V2</span>
                        {result && (
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                                result.decision === 'APPROVED' ? 'bg-green-500/20 text-green-400' : 
                                result.decision === 'BLOCKED' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                                STATUS: {result.decision}
                            </span>
                        )}
                    </div>

                    <div className="flex-grow space-y-3 overflow-y-auto liquid-scrollbar pr-2">
                        {isProcessing ? (
                            <div className="flex flex-col gap-2 animate-pulse">
                                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                                <div className="h-16 bg-slate-800 rounded w-full"></div>
                                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                            </div>
                        ) : result ? (
                            <>
                                <div className="text-sm font-mono text-blue-300 mb-2">
                                    &gt; Retrieving policies for context: {region} + {action}...
                                </div>
                                {result.retrieved.map((doc, i) => (
                                    <div key={i} className="bg-slate-800 p-3 rounded border-l-2 border-slate-600 hover:border-brand-primary transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-slate-300">{doc.id}</span>
                                            {doc.severity === 'BLOCKING' && <span className="text-[10px] bg-red-500 text-white px-1.5 rounded">BLOCKER</span>}
                                        </div>
                                        <p className="text-xs text-slate-400 italic">"{doc.snippet}"</p>
                                    </div>
                                ))}
                                <div className="mt-4 pt-3 border-t border-slate-700">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Decision Rationale</span>
                                    <p className="text-sm text-white mt-1">
                                        {result.decision === 'APPROVED' ? '✅ ' : result.decision === 'BLOCKED' ? '❌ ' : '⚠️ '}
                                        {result.decision === 'APPROVED' ? 'Action compliant with all retrieved policies.' : 
                                         result.decision === 'BLOCKED' ? 'Action violates critical local regulations.' : 
                                         'Action requires additional safeguards or human review.'}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-slate-600 mt-10">
                                <div className="text-2xl mb-2">🌐</div>
                                System ready. Initiate evaluation.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JurisdictionAwareRag;
