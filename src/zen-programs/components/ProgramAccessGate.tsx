import React from 'react';
import { Link } from 'react-router-dom';
import {
    getProgramAccessDecision,
    type ProgramCatalogItem,
    type ProgramKey,
    type UserProgramState,
} from '../programIntegrationContract';

export interface ProgramAccessGateProps {
    program: ProgramCatalogItem;
    userProgramState?: UserProgramState | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    mode: 'overview' | 'preview' | 'full';
    children?: React.ReactNode;
}

const requiredCapabilityByMode: Record<ProgramAccessGateProps['mode'], keyof ReturnType<typeof getProgramAccessDecision>> = {
    overview: 'canViewOverview',
    preview: 'canViewPreview',
    full: 'canLaunchFullProgram',
};

const registrationPath = (program: ProgramCatalogItem) => `/programs/${program.slug}/register`;

export const ProgramAccessGate: React.FC<ProgramAccessGateProps> = ({
    program,
    userProgramState,
    isAuthenticated,
    isAdmin,
    mode,
    children,
}) => {
    const decision = getProgramAccessDecision({
        program,
        userState: userProgramState,
        isAuthenticated,
        isAdmin,
    });
    const requiredCapability = requiredCapabilityByMode[mode];
    const allowed = Boolean(decision[requiredCapability]);

    if (allowed) {
        return <>{children}</>;
    }

    const isRegistered = userProgramState?.registrationStatus === 'waitlisted' || userProgramState?.registrationStatus === 'invited';
    const title = isRegistered ? 'You are on the list.' : mode === 'full' ? 'Full program access is gated.' : 'Program access is gated.';
    const body = isRegistered
        ? "We'll notify you when enrollment opens."
        : decision.reason;
    const cta = decision.canRegister ? (
        <Link
            to={registrationPath(program)}
            className="inline-flex rounded-full bg-gradient-to-r from-zen-gold to-zen-gold-light px-5 py-3 text-sm font-semibold text-zen-navy transition hover:-translate-y-0.5"
        >
            {isAuthenticated ? 'Join waitlist' : 'Register interest'}
        </Link>
    ) : (
        <Link
            to="/programs"
            className="inline-flex rounded-full border border-zen-gold/20 bg-zen-gold/[0.08] px-5 py-3 text-sm font-semibold text-zen-gold transition hover:bg-zen-gold/[0.12]"
        >
            View programs
        </Link>
    );

    return (
        <section className="rounded-[1.9rem] border border-zen-gold/12 bg-[linear-gradient(135deg,rgba(8,13,29,0.94),rgba(15,23,42,0.82))] p-6 text-white shadow-zen-card backdrop-blur-xl sm:p-8">
            <span className="inline-flex rounded-full border border-zen-gold/20 bg-zen-gold/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-gold-light">
                {decision.badgeLabel}
            </span>
            <h2 className="mt-4 text-2xl font-black tracking-tight">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{body}</p>
            <div className="mt-5 flex flex-wrap gap-3">
                {cta}
                <Link
                    to={program.embeddedRoute}
                    className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
                >
                    Continue preview
                </Link>
            </div>
        </section>
    );
};

export const getSyntheticStandaloneUserId = (email?: string | null) => (
    email ? `standalone-preview:${email.toLowerCase()}` : 'standalone-preview:anonymous'
);

export const isProgramKey = (value: string): value is ProgramKey => (
    value === 'ai-pioneer'
    || value === 'vanguard'
    || value === 'homeschool-kit'
    || value === 'web3-literacy'
    || value === 'train-a-trainer'
);

export default ProgramAccessGate;
