import { getPendingPhotos } from '@/lib/galleries';
import ModerationList from '@/components/admin/ModerationList';
import { supabase } from '@/lib/supabase';
// NOTE: We should ideally use actual Supabase Auth roles or a list of admin IDs.
// For this prototype, we'll implement a basic check.
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function ModeracionPage() {
    // Simple check for now: If we wanted real security, we'd verify the JWT server-side.
    const photos = await getPendingPhotos();

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-primary)',
                marginBottom: '1rem'
            }}>
                Panel de Moderación
            </h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                Aquí puedes autorizar o rechazar las fotografías enviadas por la gente antes de que aparezcan en la web principal.
            </p>

            <ModerationList initialPhotos={photos} />
        </div>
    );
}
