import { supabase } from './supabase';

export async function getPhotos(supabaseClient) {
    const client = supabaseClient || supabase;
    const { data, error } = await client
        .from('photos')
        .select(`
            *,
            likes:photo_likes(count)
        `)
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
        date: new Date(photo.created_at).toLocaleDateString('es-CO'),
        likes: photo.likes ? photo.likes[0].count : 0,
        user_id: photo.user_id, // Ensure we have this for ownership check

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

export async function toggleLike(photoId, userId, supabaseClient) {
    const client = supabaseClient || supabase;

    // First check if already liked
    const { data: existingLike, error: checkError } = await client
        .from('photo_likes')
        .select('id')
        .eq('photo_id', photoId)
        .eq('user_id', userId)
        .maybeSingle();

    if (checkError) {
        console.error('Check error:', checkError);
        throw new Error(checkError.message);
    }

    if (existingLike) {
        // Unlike
        const { error } = await client
            .from('photo_likes')
            .delete()
            .eq('id', existingLike.id);

        if (error) throw new Error(error.message);
        return { liked: false };
    } else {
        // Like
        const { error } = await client
            .from('photo_likes')
            .insert([{ photo_id: photoId, user_id: userId }]);

        if (error) throw new Error(error.message);
        return { liked: true };
    }
}

export async function getPhotoLikes(photoId, supabaseClient) {
    const client = supabaseClient || supabase;

    // 1. Get user IDs who liked the photo
    const { data: likes, error: likesError } = await client
        .from('photo_likes')
        .select('user_id')
        .eq('photo_id', photoId);

    if (likesError) {
        console.error('Error fetching likes:', likesError);
        return [];
    }

    if (!likes || likes.length === 0) return [];

    const userIds = likes.map(l => l.user_id);

    // 2. Fetch profiles for these users
    // Assuming 'profiles' table has 'id' matching 'auth.users.id' and 'display_name'
    const { data: profiles, error: profilesError } = await client
        .from('profiles')
        .select('display_name')
        .in('id', userIds);

    if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return [];
    }

    return profiles.map(p => p.display_name).filter(Boolean);
}

export async function getUserLikedPhotoIds(userId, supabaseClient) {
    const client = supabaseClient || supabase;
    const { data, error } = await client
        .from('photo_likes')
        .select('photo_id')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching user likes:', error);
        return [];
    }
    return data.map(item => item.photo_id);
}

