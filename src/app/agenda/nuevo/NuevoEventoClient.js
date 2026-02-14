'use client';

import { useState } from 'react';
import EventForm from '@/components/agenda/EventForm';
import { createEventAction } from '@/app/actions';

export default function NuevoEventoClient({ userId, isAdmin }) {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (formData) => {
        try {
            await createEventAction(formData, userId, isAdmin);
            setSubmitted(true);
        } catch (error) {
            throw error; // Rethrow to let EventForm handle the alert
        }
    };

    if (submitted) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                    {isAdmin ? '¡Evento Publicado!' : '¡Sugerencia Enviada!'}
                </h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    {isAdmin
                        ? 'El evento ya está visible en la agenda pública.'
                        : 'Gracias por tu aporte. Los moderadores revisarán tu evento pronto.'}
                </p>
                <button
                    onClick={() => window.location.href = '/agenda'}
                    className="btn btn-primary"
                >
                    Volver a la Agenda
                </button>
            </div>
        );
    }

    return (
        <>
            {!isAdmin && (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    Tu evento será revisado por los moderadores antes de aparecer en la agenda pública.
                </p>
            )}
            <EventForm onSubmit={handleSubmit} isAdmin={isAdmin} />
        </>
    );
}
