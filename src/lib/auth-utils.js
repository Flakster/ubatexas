/**
 * Centralized list of admin emails for the Ubatexas platform.
 */
export const ADMIN_EMAILS = [
    'carlos.santamaria+ubatexas@gmail.com',
];

/**
 * Checks if a user object corresponds to an administrator.
 * @param {object} user - The user object from Supabase Auth.
 * @returns {boolean}
 */
export function isAdmin(user) {
    if (!user || !user.email) return false;
    return ADMIN_EMAILS.includes(user.email);
}
