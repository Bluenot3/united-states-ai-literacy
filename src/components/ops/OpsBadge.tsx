import React from 'react';

interface OpsBadgeProps {
    children: React.ReactNode;
    variant?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
    size?: 'sm' | 'md';
    dot?: boolean;
    className?: string;
}

/**
 * OpsBadge - Status and label badges
 */
const OpsBadge: React.FC<OpsBadgeProps> = ({
    children,
    variant = 'neutral',
    size = 'md',
    dot = false,
    className = '',
}) => {
    const variantClasses = {
        info: 'ops-badge-info',
        success: 'ops-badge-success',
        warning: 'ops-badge-warning',
        danger: 'ops-badge-danger',
        neutral: 'bg-[var(--ops-surface-3)] text-[var(--ops-text-secondary)] border border-[var(--ops-border)]',
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-3 py-1 text-xs',
    };

    const dotColors = {
        info: 'bg-[var(--ops-info)]',
        success: 'bg-[var(--ops-success)]',
        warning: 'bg-[var(--ops-warning)]',
        danger: 'bg-[var(--ops-danger)]',
        neutral: 'bg-[var(--ops-text-muted)]',
    };

    return (
        <span
            className={`
        ops-badge 
        ${variantClasses[variant]} 
        ${sizeClasses[size]}
        ${className}
      `}
        >
            {dot && (
                <span
                    className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}
                />
            )}
            {children}
        </span>
    );
};

export default OpsBadge;
