'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');

            if (!code) {
                setError('No se encontró código de verificación');
                setTimeout(() => router.push('/login'), 2000);
                return;
            }

            try {
                // Exchange the code for a session
                const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

                if (exchangeError) {
                    console.error('Error exchanging code:', exchangeError);
                    setError('Error al verificar el enlace');
                    setTimeout(() => router.push('/login'), 2000);
                    return;
                }

                // Check if this is a password recovery flow
                // Supabase adds a hash fragment with type=recovery for password resets
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const type = hashParams.get('type');

                if (type === 'recovery') {
                    // This is a password recovery, redirect to reset password page
                    router.push('/auth/reset-password');
                } else {
                    // Regular email verification, redirect to home
                    router.push('/');
                }
            } catch (err) {
                console.error('Callback error:', err);
                setError('Error inesperado');
                setTimeout(() => router.push('/login'), 2000);
            }
        };

        handleCallback();
    }, [router, searchParams]);

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                flexDirection: 'column',
                gap: '1rem',
                color: 'var(--color-error, #991b1b)'
            }}>
                <p>{error}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    Redirigiendo...
                </p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div className="spinner" style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid var(--color-accent)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite'
            }}></div>
            <p>Verificando...</p>
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
