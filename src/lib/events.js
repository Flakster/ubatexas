import { supabase as defaultSupabase } from './supabase';

export async function getEvents(includePending = false, supabaseClient = defaultSupabase) {
    let query = supabaseClient
        .from('events')
        .select('*')
        .order('date', { ascending: true });

    if (!includePending) {
        query = query.eq('status', 'approved');
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching events:', error);
        return [];
    }

    return data.map(event => ({
        ...event,
        authorName: event.author_name || 'Anónimo'
    }));
}

export async function addEvent(event, userId = null, isAdmin = false, supabaseClient = defaultSupabase) {
    const { data, error } = await supabaseClient
        .from('events')
        .insert([
            {
                title: event.title,
                date: event.date,
                location: event.location,
                category: event.category,
                description: event.description,
                user_id: userId,
                author_name: event.authorName, // New column
                status: isAdmin ? 'approved' : 'pending'
            }
        ])
        .select();

    if (error) {
        console.error('Database error in addEvent:', error);
        throw new Error(error.message);
    }
    return data[0];
}

export async function updateEventStatus(id, status, supabaseClient = defaultSupabase) {
    const { data, error } = await supabaseClient
        .from('events')
        .update({ status })
        .eq('id', id)
        .select();

    if (error) {
        throw new Error(error.message);
    }
    return data[0];
}

export async function getPendingEventsCount(supabaseClient = defaultSupabase) {
    const { count, error } = await supabaseClient
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

    if (error) {
        console.error('Error fetching pending events count:', error);
        return 0;
    }
    return count || 0;
}
