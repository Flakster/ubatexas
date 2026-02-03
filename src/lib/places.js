import { supabase } from './supabase';

export async function getPlaces() {
    const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching places:', error);
        return [];
    }

    // Transform if needed
    return data.map(place => ({
        ...place,
        imageUrl: place.image_url,
        priceLevel: place.price_level
    }));
}
