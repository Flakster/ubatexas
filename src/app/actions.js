'use server';

import { addPhoto } from '@/lib/galleries';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function uploadPhotoAction(formData) {
    const file = formData.get('file');
    const caption = formData.get('caption');
    const eventTag = formData.get('eventTag');
    const author = formData.get('author');

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
        author
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
    const { updatePhotoStatus } = await import('@/lib/galleries');
    await updatePhotoStatus(id, 'rejected');
    revalidatePath('/admin/moderacion');
}
