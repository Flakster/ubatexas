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

    // Pass true to include pending events and use the server client
    const allEvents = await getEvents(true, supabase);
    const pendingEvents = allEvents.filter(e => e.status === 'pending' || !e.status);
    const approvedEvents = allEvents.filter(e => e.status === 'approved');

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-primary)',
                marginBottom: '1rem'
            }}>
                Administración de Agenda
            </h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                Gestiona las sugerencias pendientes y los eventos ya publicados.
            </p>

            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Sugerencias Pendientes ({pendingEvents.length})
                </h2>
                <EventModerationList initialEvents={pendingEvents} />
            </section>

            <section>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Eventos Publicados ({approvedEvents.length})
                </h2>
                <EventModerationList initialEvents={approvedEvents} mode="approved" />
            </section>
        </div>
    );
}
