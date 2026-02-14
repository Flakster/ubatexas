import { getEvents } from '@/lib/events';
import EventModerationList from '@/components/admin/EventModerationList';
import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import { ADMIN_EMAILS } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

export default async function AdminAgendaPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
        redirect('/');
    }

    // Pass true to include pending events and filter them manually or adjust getEvents
    const allEvents = await getEvents(true);
    const pendingEvents = allEvents.filter(e => e.status === 'pending');

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-primary)',
                marginBottom: '1rem'
            }}>
                Moderación de Agenda
            </h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                Revisa las sugerencias de eventos antes de que se publiquen.
            </p>

            <EventModerationList initialEvents={pendingEvents} />
        </div>
    );
}
