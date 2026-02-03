import { getPlaces } from '@/lib/places';

// Mock Supabase client
jest.mock('@/lib/supabase', () => {
    const mockChain = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
    };

    return {
        supabase: {
            from: jest.fn(() => mockChain),
        },
    };
});

describe('Places Library', () => {
    it('should fetch places correctly', async () => {
        const mockData = [
            {
                id: 1,
                title: 'Test Place',
                description: 'Description',
                image_url: 'place.jpg',
                vibe: 'Chill',
                price_level: '$$',
                location: 'Ubaté',
            },
        ];

        const { supabase } = require('@/lib/supabase');
        supabase.from().order.mockResolvedValueOnce({ data: mockData, error: null });

        const places = await getPlaces();

        expect(places).toHaveLength(1);
        expect(places[0]).toMatchObject({
            id: 1,
            title: 'Test Place',
            vibe: 'Chill',
        });
    });

    it('should return an empty array on database error', async () => {
        const { supabase } = require('@/lib/supabase');
        supabase.from().order.mockResolvedValueOnce({ data: null, error: { message: 'DB Error' } });

        const places = await getPlaces();
        expect(places).toEqual([]);
    });
});
