/**
 * Formats a username (stored in uppercase) to Title Case for display.
 * Example: "NELLY" -> "Nelly"
 * @param {string} username 
 * @returns {string}
 */
export function formatUsername(username) {
    if (!username) return '';
    // Remove @ if present (sometimes it's stored with @ or added in the UI)
    const cleanName = username.startsWith('@') ? username.slice(1) : username;
    if (!cleanName) return '';

    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
}
