import Link from 'next/link';
import { getEvents } from '@/lib/events';

export const dynamic = 'force-dynamic'; // To ensure we see new events immediately in dev

export default async function AgendaPage() {
    const events = await getEvents();

    return (
        <div className="container">
            <div style={{ padding: '4rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--color-primary)', margin: 0 }}>Agenda Ubatexas</h1>
                    <Link href="/agenda/nuevo" className="btn btn-accent">
                        + Nuevo Evento
                    </Link>
                </div>

                {events.length === 0 ? (
                    <p>No hay eventos programados.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {events.map((event) => (
                            <div key={event.id} style={{
                                background: 'white',
                                border: '1px solid var(--color-border)',
                                padding: '2rem',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid var(--color-border)',
                                    paddingBottom: '1rem',
                                    marginBottom: '1rem'
                                }}>
                                    <span style={{
                                        background: 'var(--color-primary)',
                                        color: 'white',
                                        padding: '0.2rem 0.8rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        textTransform: 'uppercase'
                                    }}>
                                        {event.category || 'Evento'}
                                    </span>
                                    <span style={{ color: 'var(--color-text-muted)' }}>
                                        {event.date}
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                                <p style={{ fontWeight: 500, color: 'var(--color-accent)' }}>📍 {event.location}</p>
                                <p style={{ lineHeight: 1.6 }}>{event.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
