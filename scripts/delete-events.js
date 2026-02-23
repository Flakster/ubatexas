
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteEvents(ids) {
    console.log(`Attempting to delete events with IDs: ${ids.join(', ')}`);
    const { data, error } = await supabase
        .from('events')
        .delete()
        .in('id', ids)
        .select();

    if (error) {
        console.error('Error deleting events:', error);
        return;
    }

    console.log('Successfully deleted events:');
    data.forEach(event => {
        console.log(`ID: ${event.id}, Title: ${event.title}`);
    });
}

// Deleting IDs 1, 2, 3, 4, 5 as identified test data
deleteEvents([1, 2, 3, 4, 5]);
