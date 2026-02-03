import { supabase } from './supabase';

export async function getEvents() {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

    if (error) {
        console.error('Error fetching events:', error);
        return [];
    }
    return data;
}

export async function addEvent(event) {
    const { data, error } = await supabase
        .from('events')
        .insert([
            {
                title: event.title,
                date: event.date,
                location: event.location,
                category: event.category,
                description: event.description
            }
        ])
        .select();

    if (error) {
        throw new Error(error.message);
    }
    return data[0];
}
