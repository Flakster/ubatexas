import Link from 'next/link';
import { getEvents } from '@/lib/events';
import { createClient } from '@/lib/supabaseServer';
import { isAdmin } from '@/lib/auth-utils';
import AgendaList from '@/components/agenda/AgendaList';

export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Agenda 2026',
    description: 'Consulta los próximos eventos y actividades en la provincia de Ubaté.',
    alternates: {
        canonical: '/agenda',
    },
};

export default async function AgendaPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isUserAdmin = isAdmin(user);

    // If admin, include pending events
    const events = await getEvents(isUserAdmin, supabase);

    return (
        <div className="container">
            <div style={{ padding: '4rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--color-primary)', margin: 0 }}>Agenda Ubatexas</h1>
                    <Link href="/agenda/nuevo" className="btn btn-accent">
                        {isUserAdmin ? '+ Nuevo Evento' : '+ Sugerir Evento'}
                    </Link>
                </div>

                <AgendaList initialEvents={events} isAdmin={isUserAdmin} />
            </div>
        </div>
    );
}
