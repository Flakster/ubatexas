import { getPhotos } from '@/lib/galleries';

// Mock Supabase client
jest.mock('@/lib/supabase', () => {
    const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
    };

    return {
        supabase: {
            from: jest.fn(() => mockChain),
        },
    };
});

describe('Galleries Library', () => {
    it('should fetch photos and transform them correctly', async () => {
        const mockData = [
            {
                id: 1,
                image_url: 'test.jpg',
                caption: 'Test',
                event_tag: 'Tag',
                author: '@Author',
                created_at: '2026-01-01T00:00:00Z',
            },
        ];

        const { supabase } = require('@/lib/supabase');
        // Ensure the last call in the chain 'order' returns the data
        supabase.from().order.mockResolvedValueOnce({ data: mockData, error: null });

        const photos = await getPhotos();

        expect(photos).toHaveLength(1);
        expect(photos[0]).toMatchObject({
            id: 1,
            imageUrl: 'test.jpg',
            caption: 'Test',
            author: '@Author',
        });
    });

    it('should return an empty array on error', async () => {
        const { supabase } = require('@/lib/supabase');
        supabase.from().order.mockResolvedValueOnce({ data: null, error: { message: 'Error' } });

        const photos = await getPhotos();
        expect(photos).toEqual([]);
    });
});
