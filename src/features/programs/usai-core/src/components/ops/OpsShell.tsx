import React from 'react';
import { useOpsThemeSafe } from '../../theme/OpsThemeContext';

interface OpsShellProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * OpsShell - Global wrapper that applies the ZEN OS aesthetic
 * Wraps the entire application when Ops Mode is enabled
 */
const OpsShell: React.FC<OpsShellProps> = ({ children, className = '' }) => {
    const opsTheme = useOpsThemeSafe();
    const isOpsMode = opsTheme?.isOpsMode ?? false;

    if (!isOpsMode) {
        // When ops mode is off, just render children without any wrapper styling
        return <>{children}</>;
    }

    return (
        <div className={`ops-shell ops-grid-bg ops-noise min-h-screen ${className}`}>
            {/* Ambient glow effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Top-left glow */}
                <div
                    className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                    }}
                />
                {/* Bottom-right glow */}
                <div
                    className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
                    }}
                />
            </div>

            {/* Main content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default OpsShell;
