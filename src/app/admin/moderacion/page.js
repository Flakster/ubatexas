import { getPendingPhotos } from '@/lib/galleries';
import ModerationList from '@/components/admin/ModerationList';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Whitelist of admin emails
const ADMIN_EMAILS = [
    'carlos.santamaria+ubatexas@gmail.com', // Example - User should confirm
    // Add other admin emails here
];

export default async function ModeracionPage() {
    // 1. Get current session server-side
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    // 2. Check if user is in whitelist
    if (!ADMIN_EMAILS.includes(session.user.email)) {
        redirect('/');
    }

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
                Aquí puedes autorizar o borrar definitivamente las fotografías enviadas por la gente.
            </p>

            <ModerationList initialPhotos={photos} />
        </div>
    );
}
