import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('--- Seeding Events ---');
    const events = JSON.parse(fs.readFileSync('src/data/events.json', 'utf8'));
    for (const event of events) {
        const { id, ...eventData } = event; // remove old numeric ID to let DB generate one
        const { error } = await supabase.from('events').insert([eventData]);
        if (error) console.error('Error event:', error.message);
        else console.log('Added event:', event.title);
    }

    console.log('\n--- Seeding Photos (Gente) ---');
    const photos = JSON.parse(fs.readFileSync('src/data/galleries.json', 'utf8'));
    for (const photo of photos) {
        const { id, ...photoData } = photo;
        // Map JSON field names to DB field names
        const dbPhoto = {
            image_url: photoData.imageUrl,
            caption: photoData.caption,
            event_tag: photoData.eventTag,
            author: photoData.author,
            status: 'approved',
            created_at: photoData.date ? new Date(photoData.date).toISOString() : new Date().toISOString()
        };
        const { error } = await supabase.from('photos').insert([dbPhoto]);
        if (error) console.error('Error photo:', error.message);
        else console.log('Added photo:', photo.caption);
    }

    console.log('\n--- Seeding Places (Territorio) ---');
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

    console.log('\nDone!');
}

seed();
