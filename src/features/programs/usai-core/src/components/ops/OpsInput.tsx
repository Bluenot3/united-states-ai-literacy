import React from 'react';

interface OpsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

/**
 * OpsInput - Styled text input with label and error states
 */
const OpsInput: React.FC<OpsInputProps> = ({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || `ops-input-${Math.random().toString(36).slice(2, 9)}`;

    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium ops-text-secondary mb-1.5"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 ops-text-muted">
                        {leftIcon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={`
            ops-input
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-[var(--ops-danger)] focus:border-[var(--ops-danger)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]' : ''}
          `}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 ops-text-muted">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1.5 text-xs ops-text-danger">{error}</p>
            )}
            {hint && !error && (
                <p className="mt-1.5 text-xs ops-text-muted">{hint}</p>
            )}
        </div>
    );
};

export default OpsInput;
