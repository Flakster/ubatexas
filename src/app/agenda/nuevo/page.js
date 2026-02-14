import { addEvent } from '@/lib/events';
import EventForm from '@/components/agenda/EventForm';
import { createClient } from '@/lib/supabaseServer';
import { isAdmin } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';

export default async function NuevoEventoPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const isUserAdmin = isAdmin(user);

    async function createEvent(data) {
        'use server';
        await addEvent(data, user.id, isUserAdmin);
    }

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 style={{ marginBottom: '1rem', textAlign: 'center', color: 'var(--color-primary)' }}>
                {isUserAdmin ? 'Crear Nuevo Evento' : 'Sugerir un Evento'}
            </h1>
            {!isUserAdmin && (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    Tu evento será revisado por los moderadores antes de aparecer en la agenda pública.
                </p>
            )}
            <EventForm onSubmit={createEvent} />
        </div>
    );
}
