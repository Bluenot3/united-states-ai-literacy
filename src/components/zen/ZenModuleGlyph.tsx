import React from 'react';

export type ZenGlyphName =
    | 'dashboard'
    | 'research'
    | 'guide'
    | 'programs'
    | 'profile'
    | 'identity'
    | 'telemetry'
    | 'progress'
    | 'readiness'
    | 'network'
    | 'integrity'
    | 'module1'
    | 'module2'
    | 'module3'
    | 'module4'
    | 'ship'
    | 'learn'
    | 'verify'
    | 'resources'
    | 'submit'
    | 'certificate';

interface ZenModuleGlyphProps {
    name: ZenGlyphName;
    className?: string;
    framed?: boolean;
}

const glyphs: Record<ZenGlyphName, React.ReactNode> = {
    dashboard: (
        <>
            <rect x="4" y="4" width="16" height="16" rx="4" />
            <path d="M8 9h8M8 12h5M8 15h8" />
            <circle cx="16.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </>
    ),
    research: (
        <>
            <path d="M6.5 5.5h8a2 2 0 0 1 2 2v11l-4-2-4 2-4-2-4 2v-11a2 2 0 0 1 2-2h4" transform="translate(2 0)" />
            <path d="M10 5.5v11" />
        </>
    ),
    guide: (
        <>
            <path d="M6 5.5h11a1.5 1.5 0 0 1 1.5 1.5v10.5L14 15l-4.5 2.5V7A1.5 1.5 0 0 0 8 5.5H6Z" />
            <path d="M6 5.5a2 2 0 0 0-2 2v9.5" />
        </>
    ),
    programs: (
        <>
            <path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0-14 0Z" />
            <path d="M9 12l2 2 4-4" />
        </>
    ),
    profile: (
        <>
            <circle cx="12" cy="8.5" r="3.25" />
            <path d="M5.5 18c1.75-3.5 4-5 6.5-5s4.75 1.5 6.5 5" />
        </>
    ),
    identity: (
        <>
            <rect x="4" y="5" width="16" height="14" rx="3" />
            <circle cx="9" cy="11" r="2.25" />
            <path d="M13 10h4M13 13h4M7 16h10" />
        </>
    ),
    telemetry: (
        <>
            <path d="M5 16l3-4 3 2 4-6 4 4" />
            <path d="M5 19h14" />
            <circle cx="8" cy="12" r="1" fill="currentColor" stroke="none" />
            <circle cx="11" cy="14" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="8" r="1" fill="currentColor" stroke="none" />
        </>
    ),
    progress: (
        <>
            <path d="M12 5a7 7 0 1 1-7 7" />
            <path d="M12 5v7l4 2" />
        </>
    ),
    readiness: (
        <>
            <path d="M5 15a7 7 0 0 1 14 0" />
            <path d="M12 8v7" />
            <circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none" />
        </>
    ),
    network: (
        <>
            <circle cx="12" cy="6.5" r="2" />
            <circle cx="6.5" cy="15.5" r="2" />
            <circle cx="17.5" cy="15.5" r="2" />
            <path d="M10.5 8.2 7.8 13.7M13.5 8.2 16.2 13.7M8.4 15.5h7.2" />
        </>
    ),
    integrity: (
        <>
            <path d="M12 4.8 18 7v4.8c0 3.4-2.2 6.1-6 7.4-3.8-1.3-6-4-6-7.4V7l6-2.2Z" />
            <path d="m9.5 12 1.8 1.8 3.5-3.8" />
        </>
    ),
    module1: (
        <>
            <path d="M7 6h10v12H7Z" />
            <path d="M9.5 9.5h5M9.5 12h5M9.5 14.5h3.5" />
        </>
    ),
    module2: (
        <>
            <rect x="4.5" y="9" width="4" height="6" rx="1.5" />
            <rect x="15.5" y="9" width="4" height="6" rx="1.5" />
            <path d="M8.5 12h7M12 8v8" />
            <circle cx="12" cy="12" r="2" />
        </>
    ),
    module3: (
        <>
            <path d="M12 5c3 0 5.5 2.5 5.5 5.5S15 16 12 16s-5.5-2.5-5.5-5.5S9 5 12 5Z" />
            <path d="M12 9.5v3M12 15.5v.01M8.8 10.4h6.4" />
        </>
    ),
    module4: (
        <>
            <rect x="6" y="6" width="12" height="12" rx="2.5" />
            <path d="M9 9h6v6H9ZM12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2" />
        </>
    ),
    ship: (
        <>
            <path d="M12 4.5v10.5" />
            <path d="m7.5 9.5 4.5-5 4.5 5" />
            <path d="M5 18.5h14" />
        </>
    ),
    learn: (
        <>
            <path d="M4.5 7.5c2-.8 4-.8 6 0 2-.8 4-.8 6 0v9c-2-.8-4-.8-6 0-2-.8-4-.8-6 0Z" />
            <path d="M10.5 7.5v9" />
        </>
    ),
    verify: (
        <>
            <circle cx="12" cy="12" r="7" />
            <path d="m9.5 12 1.8 1.8 3.5-3.8" />
        </>
    ),
    resources: (
        <>
            <path d="M6 6.5h9a2 2 0 0 1 2 2v9l-4-2.2-4 2.2-4-2.2-4 2.2v-9a2 2 0 0 1 2-2h3" transform="translate(2 0)" />
            <path d="M9 9.5h6M9 12.5h6" />
        </>
    ),
    submit: (
        <>
            <path d="M12 4.5v10" />
            <path d="m7.8 8.8 4.2-4.3 4.2 4.3" />
            <rect x="5.5" y="14" width="13" height="5" rx="1.7" />
        </>
    ),
    certificate: (
        <>
            <rect x="5" y="5" width="14" height="10" rx="2.5" />
            <path d="M8 9.5h8M8 12h5" />
            <path d="m10 15 2 4 2-4" />
        </>
    ),
};

const ZenModuleGlyph: React.FC<ZenModuleGlyphProps> = ({ name, className = 'h-5 w-5', framed = false }) => {
    const icon = (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {glyphs[name]}
        </svg>
    );

    if (!framed) {
        return icon;
    }

    return (
        <span className="zen-glyph-frame">
            {icon}
        </span>
    );
};

export default ZenModuleGlyph;
