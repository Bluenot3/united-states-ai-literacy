import React from 'react';

interface OpsProgressProps {
    value: number; // 0-100
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'info';
    showLabel?: boolean;
    className?: string;
}

/**
 * OpsProgress - Progress bar with gradient fill
 */
const OpsProgress: React.FC<OpsProgressProps> = ({
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showLabel = false,
    className = '',
}) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizeClasses = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
    };

    const gradients = {
        default: 'bg-gradient-to-r from-[var(--ops-primary)] to-[var(--ops-info)]',
        success: 'bg-gradient-to-r from-emerald-500 to-green-400',
        warning: 'bg-gradient-to-r from-amber-500 to-yellow-400',
        info: 'bg-gradient-to-r from-cyan-500 to-blue-400',
    };

    return (
        <div className={`${className}`}>
            {showLabel && (
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs ops-text-muted">Progress</span>
                    <span className="text-xs font-medium ops-mono ops-text-secondary">
                        {Math.round(percentage)}%
                    </span>
                </div>
            )}
            <div
                className={`
          ops-progress
          ${sizeClasses[size]}
        `}
            >
                <div
                    className={`
            h-full rounded-full transition-all duration-500 ease-out
            ${gradients[variant]}
          `}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default OpsProgress;
