'use server';

import { addPhoto } from '@/lib/galleries';
import { createClient } from '@/lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function uploadPhotoAction(formData) {
    try {
        const supabase = await createClient();
        const file = formData.get('file');
        const caption = formData.get('caption');
        const eventTag = formData.get('eventTag');

        if (!file) {
            return { error: 'No se recibió ninguna foto.' };
        }

        // 1. Verify session server-side for security
        // Now it uses the server client which HAS access to cookies
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            return { error: `Error de sesión en el servidor: ${sessionError.message}` };
        }

        if (!session) {
            return { error: 'No se detectó una sesión activa en el servidor. Prueba cerrando sesión y volviendo a entrar para refrescar las cookies.' };
        }

        const user = session.user;
        if (!user) return { error: 'Usuario no encontrado en la sesión del servidor.' };
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

        await addPhoto({
            imageUrl: publicUrl,
            caption,
            eventTag,
            author: `@${authorName}`,
            user_id: userId
        }, supabase); // PASS THE AUTHENTICATED CLIENT

        revalidatePath('/gente');
        return { success: true };
    } catch (error) {
        console.error('Action Error:', error);
        return { error: error.message || 'Error inesperado en el servidor' };
    }
}

export async function approvePhotoAction(id) {
    const { updatePhotoStatus } = await import('@/lib/galleries');
    const supabase = await createClient(); // Create server client
    await updatePhotoStatus(id, 'approved', supabase); // Pass it
    revalidatePath('/gente');
    revalidatePath('/admin/moderacion');
}

export async function rejectPhotoAction(id) {
    const { deletePhoto } = await import('@/lib/galleries');
    const supabase = await createClient(); // Create server client

    // 1. Delete from DB and get the record to find the image path
    const photo = await deletePhoto(id, supabase); // Pass it

    if (photo && photo.image_url) {
        // 2. Extract path from public URL
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
