import { supabase } from './supabase';

export async function getPhotos(supabaseClient) {
    const client = supabaseClient || supabase;
    const { data, error } = await client
        .from('photos')
        .select('*')
        .eq('status', 'approved') // Only show approved photos
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching photos:', error);
        return [];
    }

    // Transform data to match component expectations if needed
    return data.map(photo => ({
        id: photo.id,
        imageUrl: photo.image_url,
        caption: photo.caption,
        eventTag: photo.event_tag,
        author: photo.author,
        date: new Date(photo.created_at).toLocaleDateString('es-CO')
    }));
}

export async function addPhoto(photo, supabaseClient) {
    const client = supabaseClient || supabase;
    const { error } = await client
        .from('photos')
        .insert([
            {
                image_url: photo.imageUrl,
                caption: photo.caption,
                event_tag: photo.eventTag,
                author: photo.author,
                user_id: photo.user_id,
                status: 'pending' // Default to pending for moderation
            }
        ]);

    if (error) {
        throw new Error(error.message);
    }
    return { success: true };
}

export async function getPendingPhotos(supabaseClient) {
    const client = supabaseClient || supabase;
    const { data, error } = await client
        .from('photos')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching pending photos:', error);
        return [];
    }

    return data.map(photo => ({
        id: photo.id,
        imageUrl: photo.image_url,
        caption: photo.caption,
        eventTag: photo.event_tag,
        author: photo.author,
        date: new Date(photo.created_at).toLocaleDateString('es-CO')
    }));
}

export async function updatePhotoStatus(id, status, supabaseClient) {
    const client = supabaseClient || supabase;
    const { data, error } = await client
        .from('photos')
        .update({ status })
        .eq('id', id)
        .select();

    if (error) {
        throw new Error(error.message);
    }
    return data[0];
}

export async function deletePhoto(id, supabaseClient) {
    const client = supabaseClient || supabase;
    const { data, error } = await client
        .from('photos')
        .delete()
        .eq('id', id)
        .select();

    if (error) {
        throw new Error(error.message);
    }
    return data[0];
}
