// ZEN OS Design Tokens
// Palantir-style operator console aesthetic

export const opsTokens = {
    // === COLORS ===
    colors: {
        // Surfaces (dark to light)
        base: '#0a0e17',           // Deepest background
        surface1: '#111827',       // Primary surface
        surface2: '#1f2937',       // Elevated surface
        surface3: '#374151',       // Highest elevation

        // Borders
        border: 'rgba(75, 85, 99, 0.4)',
        borderHover: 'rgba(107, 114, 128, 0.6)',
        borderAccent: 'rgba(139, 92, 246, 0.5)',

        // Text
        textPrimary: '#f9fafb',
        textSecondary: '#9ca3af',
        textMuted: '#6b7280',

        // Semantic colors
        info: '#38bdf8',           // Cyan
        primary: '#8b5cf6',        // Violet
        success: '#22c55e',        // Green
        warning: '#f59e0b',        // Amber
        danger: '#ef4444',         // Red

        // Glow colors
        glowPrimary: 'rgba(139, 92, 246, 0.15)',
        glowInfo: 'rgba(56, 189, 248, 0.15)',
        glowSuccess: 'rgba(34, 197, 94, 0.15)',
    },

    // === SPACING ===
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
    },

    // === RADII ===
    radii: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
    },

    // === SHADOWS ===
    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
        md: '0 4px 6px rgba(0, 0, 0, 0.4)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.6)',
        glow: '0 0 20px rgba(139, 92, 246, 0.3)',
        glowLg: '0 0 40px rgba(139, 92, 246, 0.4)',
        inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
    },

    // === BLUR ===
    blur: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
    },

    // === TYPOGRAPHY ===
    fonts: {
        sans: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, ui-monospace, monospace',
    },

    fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
    },

    // === TRANSITIONS ===
    transitions: {
        fast: '150ms ease',
        normal: '250ms ease',
        slow: '400ms ease',
        spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
} as const;

// CSS variable mapping for Tailwind
export const opsCssVars = {
    '--ops-base': opsTokens.colors.base,
    '--ops-surface-1': opsTokens.colors.surface1,
    '--ops-surface-2': opsTokens.colors.surface2,
    '--ops-surface-3': opsTokens.colors.surface3,
    '--ops-border': opsTokens.colors.border,
    '--ops-border-hover': opsTokens.colors.borderHover,
    '--ops-border-accent': opsTokens.colors.borderAccent,
    '--ops-text-primary': opsTokens.colors.textPrimary,
    '--ops-text-secondary': opsTokens.colors.textSecondary,
    '--ops-text-muted': opsTokens.colors.textMuted,
    '--ops-info': opsTokens.colors.info,
    '--ops-primary': opsTokens.colors.primary,
    '--ops-success': opsTokens.colors.success,
    '--ops-warning': opsTokens.colors.warning,
    '--ops-danger': opsTokens.colors.danger,
    '--ops-glow-primary': opsTokens.colors.glowPrimary,
    '--ops-glow-info': opsTokens.colors.glowInfo,
    '--ops-glow-success': opsTokens.colors.glowSuccess,
} as const;

export type OpsTokens = typeof opsTokens;
export type OpsCssVars = typeof opsCssVars;
