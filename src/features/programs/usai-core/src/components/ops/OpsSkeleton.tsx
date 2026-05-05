import React from 'react';

interface OpsSkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    lines?: number;
}

/**
 * OpsSkeleton - Loading placeholder with shimmer animation
 */
const OpsSkeleton: React.FC<OpsSkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width,
    height,
    lines = 1,
}) => {
    const baseClasses = 'ops-skeleton';

    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    const style: React.CSSProperties = {
        width: width ?? (variant === 'circular' ? height : '100%'),
        height: height ?? (variant === 'text' ? 16 : variant === 'circular' ? width : 100),
    };

    if (variant === 'text' && lines > 1) {
        return (
            <div className={`space-y-2 ${className}`}>
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={`${baseClasses} ${variantClasses.text}`}
                        style={{
                            ...style,
                            width: i === lines - 1 ? '75%' : '100%'
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
};

/**
 * OpsSkeletonCard - Pre-composed card skeleton
 */
export const OpsSkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`ops-card p-6 ${className}`}>
        <div className="flex items-start gap-4">
            <OpsSkeleton variant="circular" width={48} height={48} />
            <div className="flex-1 space-y-2">
                <OpsSkeleton variant="text" width="60%" />
                <OpsSkeleton variant="text" width="40%" />
            </div>
        </div>
        <div className="mt-4">
            <OpsSkeleton variant="text" lines={3} />
        </div>
    </div>
);

export default OpsSkeleton;
