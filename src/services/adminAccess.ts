// Single source of truth for ZEN admin accounts.
// Any account on this list gets: free access to every program (see
// services/programAccess.ts) AND the Admin Command Center at /admin
// (see contexts/AdminContext.tsx). Add new admins here only.
export const ADMIN_EMAILS = [
    'royaltokens@gmail.com',
    'admin@zenvanguard.com',
    'alexleschik@bgcgw.org',
    'testadmin@zenai.co',
    'alex1leschik@gmail.com',
    'huxley@zenai.biz',
] as const;

const ADMIN_EMAIL_SET = new Set<string>(ADMIN_EMAILS);

export function normalizeAdminEmail(email?: string | null) {
    return email?.trim().toLowerCase() ?? '';
}

export function isAdminEmail(email?: string | null) {
    return ADMIN_EMAIL_SET.has(normalizeAdminEmail(email));
}
