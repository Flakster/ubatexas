import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedPlaces() {
    console.log('--- Seeding Places (Territorio) ---');
    const places = JSON.parse(fs.readFileSync('src/data/places.json', 'utf8'));
    for (const place of places) {
        const { id, ...placeData } = place;
        const dbPlace = {
            title: placeData.title,
            description: placeData.description,
            image_url: placeData.imageUrl,
            vibe: placeData.vibe,
            price_level: placeData.priceLevel,
            location: placeData.location
        };
        const { error } = await supabase.from('places').insert([dbPlace]);
        if (error) console.error('Error place:', error.message);
        else console.log('Added place:', place.title);
    }
    console.log('Done!');
}

seedPlaces();
