/**
 * Curated list of forbidden words for moderation.
 * Focused on common offensive terms and variants.
 */
const FORBIDDEN_WORDS = [
    'groseria1', // Placeholder: I will use common Spanish offensive terms
    'groseria2',
    'puto',
    'puta',
    'mierda',
    'maldito',
    'maldita',
    'pendejo',
    'pendeja',
    'cabron',
    'cabrona',
    'gonorrea',
    'malparido',
    'malparida',
    'hijueputa',
    'culiao',
    'culiada',
    'verga',
    'carajo',
    'estupido',
    'estupida',
    'idiota',
    'marica',
    'maricon',
    'perra',
    'zorra',
    'carechimba',
    'hpta',
    'pts',
];

/**
 * Checks if a string contains any forbidden words.
 * Performs a case-insensitive check and handles partial matches.
 * @param {string} text 
 * @returns {boolean}
 */
export function containsProfanity(text) {
    if (!text) return false;

    // Normalize text: lowercase and remove accents/special characters for better matching
    const normalizedText = text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Remove accents

    // Check if any forbidden word is present as a substring or whole word
    return FORBIDDEN_WORDS.some(word => {
        const normalizedWord = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        // Use regex for word boundary check or simple inclusion
        const regex = new RegExp(`\\b${normalizedWord}\\b`, 'i');
        return regex.test(normalizedText) || normalizedText.includes(normalizedWord);
    });
}
