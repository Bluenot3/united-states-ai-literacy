import React from 'react';

interface OpsCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'elevated' | 'glass';
    hover?: boolean;
    onClick?: () => void;
}

/**
 * OpsCard - Premium card component with glass/elevated variants
 */
const OpsCard: React.FC<OpsCardProps> = ({
    children,
    className = '',
    variant = 'default',
    hover = true,
    onClick
}) => {
    const baseClasses = 'rounded-2xl p-6 transition-all duration-300';

    const variantClasses = {
        default: 'ops-card',
        elevated: 'ops-card ops-card-elevated',
        glass: 'ops-glass',
    };

    const hoverClasses = hover ? 'ops-hover-lift cursor-pointer' : '';
    const clickableClasses = onClick ? 'cursor-pointer' : '';

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${clickableClasses} ${className}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {children}
        </div>
    );
};

export default OpsCard;
