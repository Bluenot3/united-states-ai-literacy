import React from 'react';

interface OpsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

/**
 * OpsButton - Premium button with multiple variants and states
 */
const OpsButton: React.FC<OpsButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    ...props
}) => {
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-7 py-3.5 text-base',
    };

    const variantClasses = {
        primary: 'ops-btn-primary',
        secondary: 'ops-btn-secondary',
        ghost: 'ops-btn-ghost',
        danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    };

    const isDisabled = disabled || loading;

    return (
        <button
            className={`
        ops-btn 
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
            disabled={isDisabled}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            ) : leftIcon}
            {children}
            {!loading && rightIcon}
        </button>
    );
};

export default OpsButton;
