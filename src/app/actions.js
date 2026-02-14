'use server';

import { addPhoto, updatePhotoStatus, deletePhoto, getPendingPhotosCount } from '@/lib/galleries';
import { addEvent, updateEventStatus, getPendingEventsCount } from '@/lib/events';
import { createClient } from '@/lib/supabaseServer';
import { revalidatePath } from 'next/cache';
import { containsProfanity } from '@/lib/moderation';

export async function uploadPhotoAction(formData) {
    try {
        const supabase = await createClient();
        const file = formData.get('file');
        const caption = formData.get('caption');
        const eventTag = formData.get('eventTag');

        if (!file) {
            return { error: 'No se recibió ninguna foto.' };
        }

        if (containsProfanity(caption) || containsProfanity(eventTag)) {
            return { error: 'Contenido no permitido detectado. Por favor usa un lenguaje respetuoso.' };
        }

        // 1. Verify user server-side (getUser is more reliable than getSession for RLS)
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('Auth Error:', authError);
            return { error: 'No se detectó una sesión válida. Por favor, sal e inicia sesión de nuevo.' };
        }

        const userId = user.id;
        const authorName = user.user_metadata?.display_name || user.email.split('@')[0];

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

        const { error: uploadError } = await supabase.storage
            .from('ubatexas-public')
            .upload(`people/${fileName}`, file);

        if (uploadError) {
            console.error('Supabase Storage Error:', uploadError);
            return { error: `Error subiendo imagen a Storage: ${uploadError.message}` };
        }

        const { data: { publicUrl } } = supabase.storage
            .from('ubatexas-public')
            .getPublicUrl(`people/${fileName}`);

        try {
            await addPhoto({
                imageUrl: publicUrl,
                caption,
                eventTag,
                author: `@${authorName}`,
                user_id: userId
            }, supabase);
        } catch (dbError) {
            console.error('Database Error detail:', dbError);
            return { error: `Error en base de datos (RLS?): ${dbError.message}` };
        }

        revalidatePath('/gente');
        return { success: true };
    } catch (error) {
        console.error('Unexpected Action Error:', error);
        return { error: error.message || 'Error inesperado en el servidor' };
    }
}

export async function approvePhotoAction(id) {
    const supabase = await createClient();
    await updatePhotoStatus(id, 'approved', supabase);
    revalidatePath('/gente');
    revalidatePath('/admin/moderacion');
}

export async function rejectPhotoAction(id) {
    const supabase = await createClient();
    const photo = await deletePhoto(id, supabase);

    if (photo && photo.image_url) {
        const urlParts = photo.image_url.split('/people/');
        if (urlParts.length > 1) {
            const fileName = urlParts[1];
            const { error: storageError } = await supabase.storage
                .from('ubatexas-public')
                .remove([`people/${fileName}`]);

            if (storageError) {
                console.error('Error deleting from storage:', storageError);
            }
        }
    }

    revalidatePath('/admin/moderacion');
}
export async function approveEventAction(id) {
    const supabase = await createClient();
    await updateEventStatus(id, 'approved', supabase);
    revalidatePath('/agenda');
    revalidatePath('/admin/agenda');
}

export async function rejectEventAction(id) {
    const supabase = await createClient();
    // For rejection, we can just set status to 'rejected' or delete it. 
    // Usually better to just change status to avoid data loss if it was a mistake.
    await updateEventStatus(id, 'rejected', supabase);
    revalidatePath('/admin/agenda');
}

export async function createEventAction(formData, userId, isAdmin) {
    const supabase = await createClient();

    const { title, description, location, category, date } = formData;

    if (containsProfanity(title) || containsProfanity(description) || containsProfanity(location)) {
        throw new Error('Contenido no permitido detectado. Por favor usa un lenguaje respetuoso.');
    }

    // Fetch user again to get display name for author_name column
    const { data: { user } } = await supabase.auth.getUser();
    const authorName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Anónimo';

    const data = await addEvent({
        title,
        description,
        location,
        category,
        date,
        authorName
    }, userId, isAdmin, supabase);

    revalidatePath('/agenda');
    if (isAdmin) revalidatePath('/admin/agenda');

    return { success: true, data };
}
