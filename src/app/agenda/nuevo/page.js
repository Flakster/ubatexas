import { addEvent } from '@/lib/events';
import EventForm from '@/components/agenda/EventForm';

export default function NuevoEventoPage() {
    async function createEvent(data) {
        'use server';
        await addEvent(data);
    }

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--color-primary)' }}>
                Nuevo Evento
            </h1>
            <EventForm onSubmit={createEvent} />
        </div>
    );
}
