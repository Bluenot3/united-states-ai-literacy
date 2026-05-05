export function repairText(value: string): string {
    if (!value || !/[ÃÂâð]/.test(value)) {
        return value;
    }

    try {
        const bytes = new Uint8Array(Array.from(value).map((char) => char.charCodeAt(0) & 0xff));
        const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes).replace(/\uFFFD/g, '');

        if (decoded.trim().length > 0) {
            return decoded;
        }
    } catch {
        // Fall back to the raw value if decoding fails.
    }

    return value
        .replace(/â€”/g, '-')
        .replace(/â€“/g, '-')
        .replace(/â€˜/g, "'")
        .replace(/â€™/g, "'")
        .replace(/â€œ/g, '"')
        .replace(/â€�/g, '"')
        .replace(/â€¢/g, '-')
        .replace(/Â©/g, '(c)')
        .replace(/Â/g, '')
        .trim();
}

export function repairContent(value: string | string[]): string | string[] {
    if (Array.isArray(value)) {
        return value.map(repairText);
    }

    return repairText(value);
}
