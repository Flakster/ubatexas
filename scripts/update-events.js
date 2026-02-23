
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateEvents(ids, status) {
    console.log(`Attempting to update events with IDs: ${ids.join(', ')} to status: ${status}`);
    const { data, error } = await supabase
        .from('events')
        .update({ status })
        .in('id', ids)
        .select();

    if (error) {
        console.error('Error updating events:', error);
        return;
    }

    console.log('Successfully updated events:');
    if (data && data.length > 0) {
        data.forEach(event => {
            console.log(`ID: ${event.id}, Title: ${event.title}, New Status: ${event.status}`);
        });
    } else {
        console.log('No events updated. Possibly due to RLS or IDs not matching.');
    }
}

updateEvents([1, 2, 3, 4, 5], 'rejected');
