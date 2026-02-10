import { getPendingPhotos } from '@/lib/galleries';
import ModerationList from '@/components/admin/ModerationList';
import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import { ADMIN_EMAILS } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

export default async function ModeracionPage() {
    // 1. Get current session server-side with SSR client
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    // 2. Check if user is in whitelist
    if (!ADMIN_EMAILS.includes(session.user.email)) {
        redirect('/');
    }

    const photos = await getPendingPhotos(supabase); // PASS THE CLIENT

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
