'use client';

import { useState } from 'react';
import { approveEventAction, deleteEventAction } from '@/app/actions';

export default function AgendaList({ initialEvents, isAdmin }) {
    const [events, setEvents] = useState(initialEvents);
    const [processingId, setProcessingId] = useState(null);
    const [isFutureExpanded, setIsFutureExpanded] = useState(false);
    const [isPastExpanded, setIsPastExpanded] = useState(false);

    const handleApprove = async (id) => {
        setProcessingId(id);
        try {
            await approveEventAction(id);
            // After approval, keep it in the list but update its local status if we were showing pending
            setEvents(events.map(e => e.id === id ? { ...e, status: 'approved' } : e));
        } catch (error) {
            alert('Error al aprobar: ' + error.message);
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (id) => {
        const isPending = events.find(e => e.id === id)?.status === 'pending';
        const confirmMsg = isPending
            ? '¿Seguro que quieres rechazar esta sugerencia?'
            : '¿Seguro que quieres eliminar este evento permanentemente?';

        if (!confirm(confirmMsg)) return;

        setProcessingId(id);
        try {
            await deleteEventAction(id);
            setEvents(events.filter(e => e.id !== id));
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        } finally {
            setProcessingId(null);
        }
    };

    if (events.length === 0) {
        return <p>No hay eventos programados.</p>;
    }

    // Date categorization logic
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayTime = today.getTime();

    const thirtyDaysTime = todayTime + (30 * 24 * 60 * 60 * 1000);

    const parseToTime = (dateStr) => {
        if (!dateStr) return 0;
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            // Local date parsing
            const y = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10) - 1;
            const d = parseInt(parts[2], 10);
            return new Date(y, m, d).getTime();
        }
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? 0 : d.getTime();
    };

    const pendingEvents = isAdmin ? events.filter(e => e.status === 'pending' || !e.status) : [];
    const approvedEventsRaw = events.filter(e => e.status === 'approved');

    const upcomingEvents = approvedEventsRaw.filter(e => {
        const eventTime = parseToTime(e.date);
        return eventTime >= todayTime && eventTime < thirtyDaysTime;
    }).sort((a, b) => parseToTime(a.date) - parseToTime(b.date));

    const farFutureEvents = approvedEventsRaw.filter(e => {
        const eventTime = parseToTime(e.date);
        return eventTime >= thirtyDaysTime;
    }).sort((a, b) => parseToTime(a.date) - parseToTime(b.date));

    const pastEvents = approvedEventsRaw.filter(e => {
        const eventTime = parseToTime(e.date);
        return eventTime < todayTime;
    }).sort((a, b) => parseToTime(b.date) - parseToTime(a.date));

    const renderEvent = (event) => {
        const eventTime = parseToTime(event.date);
        const isPast = eventTime < todayTime;

        return (
            <div key={event.id} style={{
                background: 'white',
                border: '1px solid var(--color-border)',
                padding: '2rem',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                opacity: processingId === event.id ? 0.7 : (event.status !== 'approved' || isPast ? 0.8 : 1),
                position: 'relative'
            }}>
                {event.status === 'pending' && (
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'var(--color-accent)',
                        color: 'white',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }}>
                        Pendiente
                    </div>
                )}
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

                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>{event.title}</h3>
                <p style={{ fontWeight: 500, color: 'var(--color-accent)', margin: 0 }}>📍 {event.location}</p>
                <p style={{ lineHeight: 1.6, margin: '0.5rem 0 1.5rem 0' }}>{event.description}</p>

                {isAdmin && (
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        marginTop: 'auto',
                        paddingTop: '1rem',
                        borderTop: '1px dashed var(--color-border)'
                    }}>
                        {event.status === 'pending' && (
                            <button
                                onClick={() => handleApprove(event.id)}
                                className="btn btn-primary"
                                style={{ flex: 1, padding: '0.5rem' }}
                                disabled={processingId === event.id}
                            >
                                Aprobar
                            </button>
                        )}
                        <button
                            onClick={() => handleDelete(event.id)}
                            className="btn"
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                border: `1px solid ${event.status === 'pending' ? 'var(--color-border)' : '#ff4d4d'}`,
                                color: event.status === 'pending' ? 'var(--color-text-muted)' : '#ff4d4d',
                                background: 'transparent',
                                fontSize: '0.85rem'
                            }}
                            disabled={processingId === event.id}
                        >
                            {event.status === 'pending' ? 'Rechazar' : 'Eliminar'}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ display: 'grid', gap: '2rem' }}>
            {isAdmin && pendingEvents.length > 0 && (
                <>
                    <h2 style={{ fontSize: '1.1rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Sugerencias Pendientes ({pendingEvents.length})
                    </h2>
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {pendingEvents.map(renderEvent)}
                    </div>
                    <hr style={{ width: '100%', border: 'none', borderTop: '1px solid var(--color-border)', margin: '1rem 0' }} />
                </>
            )}

            {/* Próximos Eventos */}
            <div>
                <h2 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Próximos Eventos
                </h2>
                {upcomingEvents.length > 0 ? (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {upcomingEvents.map(renderEvent)}
                    </div>
                ) : (
                    <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '1rem', background: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
                        No hay eventos próximos programados.
                    </p>
                )}
            </div>

            {farFutureEvents.length > 0 && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                        <h2 style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Eventos futuros
                        </h2>
                        <button
                            onClick={() => setIsFutureExpanded(!isFutureExpanded)}
                            className="btn"
                            style={{
                                padding: '0.4rem 1rem',
                                fontSize: '0.8rem',
                                background: '#f1f1f1',
                                color: 'var(--color-primary)',
                                border: '1px solid var(--color-border)'
                            }}
                        >
                            {isFutureExpanded ? '↑ Ocultar' : `↓ Ver ${farFutureEvents.length} eventos`}
                        </button>
                    </div>
                    {isFutureExpanded && (
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            {farFutureEvents.map(renderEvent)}
                        </div>
                    )}
                </>
            )}

            {pastEvents.length > 0 && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                        <h2 style={{ fontSize: '1rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>
                            Eventos anteriores
                        </h2>
                        <button
                            onClick={() => setIsPastExpanded(!isPastExpanded)}
                            className="btn"
                            style={{
                                padding: '0.4rem 1rem',
                                fontSize: '0.8rem',
                                background: '#f1f1f1',
                                color: 'var(--color-text-muted)',
                                border: '1px solid var(--color-border)'
                            }}
                        >
                            {isPastExpanded ? '↑ Ocultar' : `↓ Ver ${pastEvents.length} anteriores`}
                        </button>
                    </div>
                    {isPastExpanded && (
                        <div style={{ display: 'grid', gap: '2rem', opacity: 0.9 }}>
                            {pastEvents.map(renderEvent)}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
