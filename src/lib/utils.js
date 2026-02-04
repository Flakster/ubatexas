/**
 * Formats a username (stored in uppercase) to Title Case for display with a leading @.
 * Example: "NELLY" -> "@Nelly"
 * @param {string} username 
 * @returns {string}
 */
export function formatUsername(username) {
    if (!username) return '';
    let name = username.trim();

    // Remove all leading @ symbols to prevent duplicates
    while (name.startsWith('@')) {
        name = name.slice(1);
    }

    if (!name) return '';

    const formatted = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return `@${formatted}`;
}
