import { containsProfanity } from '../moderation';

describe('Moderation Utility', () => {
    test('should return false for clean text', () => {
        expect(containsProfanity('Un día hermoso en Ubaté')).toBe(false);
        expect(containsProfanity('Fiestas de San Roque')).toBe(false);
    });

    test('should return true for forbidden words', () => {
        expect(containsProfanity('Esa es una mierda')).toBe(true);
        expect(containsProfanity('Que pendejo eres')).toBe(true);
    });

    test('should be case insensitive', () => {
        expect(containsProfanity('MIERDA')).toBe(true);
        expect(containsProfanity('PenDeJo')).toBe(true);
    });

    test('should handle accented characters', () => {
        expect(containsProfanity('estúpido')).toBe(true);
        expect(containsProfanity('maricón')).toBe(true);
    });

    test('should detect forbidden words within other words/sentences', () => {
        expect(containsProfanity('esto es una carechimba')).toBe(true);
    });

    test('should return false for empty or null input', () => {
        expect(containsProfanity('')).toBe(false);
        expect(containsProfanity(null)).toBe(false);
    });
});
