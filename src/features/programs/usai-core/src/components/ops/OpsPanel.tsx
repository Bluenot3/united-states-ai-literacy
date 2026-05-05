import React from 'react';

interface OpsPanelProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    headerRight?: React.ReactNode;
    variant?: 'default' | 'glass' | 'bordered';
    noPadding?: boolean;
}

/**
 * OpsPanel - Container panel with optional header section
 */
const OpsPanel: React.FC<OpsPanelProps> = ({
    children,
    className = '',
    title,
    subtitle,
    headerRight,
    variant = 'default',
    noPadding = false,
}) => {
    const variantClasses = {
        default: 'ops-surface-1 border border-[var(--ops-border)]',
        glass: 'ops-glass',
        bordered: 'ops-surface-1 border-2 border-[var(--ops-border-accent)]',
    };

    const hasHeader = title || subtitle || headerRight;

    return (
        <div
            className={`
        rounded-2xl overflow-hidden transition-all duration-300
        ${variantClasses[variant]}
        ${className}
      `}
        >
            {hasHeader && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--ops-border)]">
                    <div>
                        {title && (
                            <h3 className="text-lg font-semibold ops-text-primary">{title}</h3>
                        )}
                        {subtitle && (
                            <p className="text-sm ops-text-muted mt-0.5">{subtitle}</p>
                        )}
                    </div>
                    {headerRight && (
                        <div className="flex items-center gap-2">
                            {headerRight}
                        </div>
                    )}
                </div>
            )}
            <div className={noPadding ? '' : 'p-6'}>
                {children}
            </div>
        </div>
    );
};

export default OpsPanel;
