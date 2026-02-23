
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugEvents() {
    const { data, error } = await supabase
        .from('events')
        .select('*');

    if (error) {
        console.error('Error fetching events:', error);
        return;
    }

    console.log('Events in database:');
    data.forEach(event => {
        console.log(`ID: ${event.id}, Title: ${event.title}, Status: ${event.status}, Created At: ${event.created_at}`);
    });
}

debugEvents();
