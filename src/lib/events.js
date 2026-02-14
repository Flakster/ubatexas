import { supabase } from './supabase';

export async function getEvents(includePending = false) {
    let query = supabase
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
    return data;
}

export async function addEvent(event, userId = null, isAdmin = false) {
    const { data, error } = await supabase
        .from('events')
        .insert([
            {
                title: event.title,
                date: event.date,
                location: event.location,
                category: event.category,
                description: event.description,
                user_id: userId,
                status: isAdmin ? 'approved' : 'pending'
            }
        ])
        .select();

    if (error) {
        throw new Error(error.message);
    }
    return data[0];
}

export async function updateEventStatus(id, status) {
    const { data, error } = await supabase
        .from('events')
        .update({ status })
        .eq('id', id)
        .select();

    if (error) {
        throw new Error(error.message);
    }
    return data[0];
}

export async function getPendingEventsCount() {
    const { count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

    if (error) {
        console.error('Error fetching pending events count:', error);
        return 0;
    }
    return count || 0;
}
