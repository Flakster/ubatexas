import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Reglas de limpieza:
// 1. Fotos > 7 días con 0 likes -> Archivar (is_archived = true)
// 2. Fotos > 30 días con < 5 likes -> Borrar físicamente (Storage + DB)

export async function GET(request) {
    // Protección simple con clave secreta (Configurar CRON_SECRET en Vercel)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
        return new Response('Unauthorized', { status: 401 });
    }

    // Usamos SERVICE_ROLE_KEY para saltar RLS y poder borrar archivos de otros usuarios
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const results = { archived: 0, deleted: 0, errors: [] };

    try {
        // --- REGLA 1: Archivar fotos > 7 días con 0 likes ---
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: toArchive, error: archiveError } = await supabase
            .from('photos')
            .select('id, likes:photo_likes(count)')
            .lt('created_at', sevenDaysAgo.toISOString())
            .eq('is_archived', false);

        if (archiveError) throw archiveError;

        const idsToArchive = toArchive
            .filter(p => !p.likes || p.likes[0].count === 0)
            .map(p => p.id);

        if (idsToArchive.length > 0) {
            const { error: updateError } = await supabase
                .from('photos')
                .update({ is_archived: true })
                .in('id', idsToArchive);

            if (updateError) results.errors.push(`Archive update error: ${updateError.message}`);
            else results.archived = idsToArchive.length;
        }

        // --- REGLA 2: Borrado físico > 30 días con < 5 likes ---
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: toDelete, error: fetchDeleteError } = await supabase
            .from('photos')
            .select('id, image_url, likes:photo_likes(count)')
            .lt('created_at', thirtyDaysAgo.toISOString());

        if (fetchDeleteError) throw fetchDeleteError;

        const photosToDelete = toDelete.filter(p => {
            const likesCount = p.likes ? p.likes[0].count : 0;
            return likesCount < 5;
        });

        for (const photo of photosToDelete) {
            try {
                // 1. Borrar del Storage
                if (photo.image_url) {
                    const urlParts = photo.image_url.split('/people/');
                    if (urlParts.length > 1) {
                        const fileName = urlParts[1];
                        await supabase.storage
                            .from('ubatexas-public')
                            .remove([`people/${fileName}`]);
                    }
                }

                // 2. Borrar de la DB
                await supabase.from('photos').delete().eq('id', photo.id);
                results.deleted++;
            } catch (err) {
                results.errors.push(`Error deleting photo ${photo.id}: ${err.message}`);
            }
        }

        return NextResponse.json({ success: true, ...results });
    } catch (error) {
        console.error('Cron Cleanup Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
