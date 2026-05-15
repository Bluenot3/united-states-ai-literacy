export const ADMIN_EMAILS = ['royaltokens@gmail.com'] as const;

const ADMIN_EMAIL_SET = new Set<string>(ADMIN_EMAILS);

export function normalizeAdminEmail(email?: string | null) {
    return email?.trim().toLowerCase() ?? '';
}

export function isAdminEmail(email?: string | null) {
    return ADMIN_EMAIL_SET.has(normalizeAdminEmail(email));
}
