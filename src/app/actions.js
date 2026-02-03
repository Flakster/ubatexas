'use server';

import { addPhoto } from '@/lib/galleries';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function uploadPhotoAction(formData) {
    const file = formData.get('file');
    const caption = formData.get('caption');
    const eventTag = formData.get('eventTag');

    // 1. Verify session server-side for security
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
        throw new Error(`Error de sesión en el servidor: ${sessionError.message}`);
    }

    if (!session) {
        // Diagnostic: check if the cookie even exists (we can't easily here without next/headers, but let's be descriptive)
        throw new Error('No se detectó una sesión activa en el servidor. Prueba cerrando sesión y volviendo a entrar.');
    }

    const user = session.user;
    if (!user) throw new Error('Usuario no encontrado en la sesión del servidor.');
    const userId = user.id;
    // Get named from metadata or fallback to email prefix
    const authorName = user.user_metadata?.display_name || user.email.split('@')[0];

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const { error: uploadError } = await supabase.storage
        .from('ubatexas-public')
        .upload(`people/${fileName}`, file);

    if (uploadError) {
        console.error('Supabase Storage Error:', uploadError);
        throw new Error(`Error uploading image: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
        .from('ubatexas-public')
        .getPublicUrl(`people/${fileName}`);

    await addPhoto({
        imageUrl: publicUrl,
        caption,
        eventTag,
        author: `@${authorName}`,
        user_id: userId
    });

    revalidatePath('/gente');
}

export async function approvePhotoAction(id) {
    const { updatePhotoStatus } = await import('@/lib/galleries');
    await updatePhotoStatus(id, 'approved');
    revalidatePath('/gente');
    revalidatePath('/admin/moderacion');
}

export async function rejectPhotoAction(id) {
    const { deletePhoto } = await import('@/lib/galleries');

    // 1. Delete from DB and get the record to find the image path
    const photo = await deletePhoto(id);

    if (photo && photo.image_url) {
        // 2. Extract path from public URL
        // Public URL format: https://.../storage/v1/object/public/ubatexas-public/people/filename.jpg
        const urlParts = photo.image_url.split('/people/');
        if (urlParts.length > 1) {
            const fileName = urlParts[1];

            // 3. Delete from Storage
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
