clea'use server';

import { addPhoto } from '@/lib/galleries';
import { createClient } from '@/lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function uploadPhotoAction(formData) {
    try {
        console.log('--- Iniciando uploadPhotoAction ---');
        const supabase = await createClient();
        const file = formData.get('file');
        const caption = formData.get('caption');
        const eventTag = formData.get('eventTag');

        if (!file) {
            return { error: 'No se recibió ninguna foto.' };
        }

        // 1. Verify user server-side (getUser is more reliable than getSession for RLS)
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('Auth Error:', authError);
            return { error: 'No se detectó una sesión válida. Por favor, sal e inicia sesión de nuevo.' };
        }

        console.log('Usuario detectado:', user.id, user.email);
        const userId = user.id;
        const authorName = user.user_metadata?.display_name || user.email.split('@')[0];

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

        console.log('Subiendo a storage...');
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

        console.log('Insertando en DB con user_id:', userId);

        try {
            await addPhoto({
                imageUrl: publicUrl,
                caption,
                eventTag,
                author: `@${authorName}`,
                user_id: userId
            }, supabase);
            console.log('Inserción exitosa');
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
    const { updatePhotoStatus } = await import('@/lib/galleries');
    const supabase = await createClient();
    await updatePhotoStatus(id, 'approved', supabase);
    revalidatePath('/gente');
    revalidatePath('/admin/moderacion');
}

export async function rejectPhotoAction(id) {
    const { deletePhoto } = await import('@/lib/galleries');
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
