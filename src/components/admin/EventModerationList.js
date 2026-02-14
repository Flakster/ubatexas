'use client';

import { useState } from 'react';
import { approveEventAction, rejectEventAction } from '@/app/actions';
import styles from './ModerationList.module.css'; // Reusing styles from photos for consistency

export default function EventModerationList({ initialEvents }) {
    const [events, setEvents] = useState(initialEvents);
    const [processingId, setProcessingId] = useState(null);

    const handleApprove = async (id) => {
        setProcessingId(id);
        try {
            await approveEventAction(id);
            setEvents(events.filter(e => e.id !== id));
        } catch (error) {
            alert('Error al aprobar: ' + error.message);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        if (!confirm('¿Seguro que quieres borrar este evento?')) return;
        setProcessingId(id);
        try {
            await rejectEventAction(id);
            setEvents(events.filter(e => e.id !== id));
        } catch (error) {
            alert('Error al rechazar: ' + error.message);
        } finally {
            setProcessingId(null);
        }
    };

    if (events.length === 0) {
        return (
            <div className={styles.empty}>
                <p>No hay eventos pendientes de moderación. 🎉</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gap: '1.5rem', width: '100%', maxWidth: '800px' }}>
            {events.map(event => (
                <div key={event.id} style={{
                    background: 'white',
                    border: '1px solid var(--color-border)',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{
                            background: 'var(--color-accent)',
                            color: 'white',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                        }}>
                            {event.category}
                        </span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            {event.date}
                        </span>
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text-muted)' }}>📍 {event.location}</p>
                    <p style={{ margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>{event.description}</p>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => handleApprove(event.id)}
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '0.5rem' }}
                            disabled={processingId === event.id}
                        >
                            {processingId === event.id ? '...' : 'Aprobar'}
                        </button>
                        <button
                            onClick={() => handleReject(event.id)}
                            className="btn"
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-muted)'
                            }}
                            disabled={processingId === event.id}
                        >
                            {processingId === event.id ? '...' : 'Rechazar'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
