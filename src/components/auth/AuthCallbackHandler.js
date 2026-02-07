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

            // Setup listener for recovery event
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                console.log('Auth state change in callback:', event);
                if (event === 'PASSWORD_RECOVERY') {
                    console.log('🔒 Password recovery event detected!');
                    router.push('/auth/reset-password');
                }
            });

            if (!code) {
                // If no code, maybe we're already logged in or implicit flow?
                // Check hash for error
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                if (hashParams.get('error')) {
                    setError(hashParams.get('error_description') || 'Error en autenticación');
                    return;
                }
                // If nothing, check hash for type without code (implicit)
                const type = hashParams.get('type');
                if (type === 'recovery') {
                    router.push('/auth/reset-password');
                    return;
                }

                if (!searchParams.toString() && !window.location.hash) {
                    // Only error if completely empty URL
                    // setError('Enlace inválido o expirado');
                    // setTimeout(() => router.push('/login'), 2000);
                    // return;

                    // Actually, just let it pass to render loading state or catch via listener
                }
            }

            if (code) {
                try {
                    // Pre-check params
                    const hashParams = new URLSearchParams(window.location.hash.substring(1));
                    const type = searchParams.get('type') || hashParams.get('type');

                    // Exchange code
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

                    if (exchangeError) {
                        console.error('Exchange error:', exchangeError);
                        // If we failed but it looked like recovery, try checking session anyway
                        if (type === 'recovery') {
                            const { data: { session } } = await supabase.auth.getSession();
                            if (session) {
                                router.push('/auth/reset-password');
                                return;
                            }
                        }
                        setError('Error al procesar el código');
                        setTimeout(() => router.push('/login'), 2000);
                        return;
                    }

                    // Success!
                    // If the event listener above didn't catch it yet (race condition?), check type manually
                    if (type === 'recovery') {
                        router.push('/auth/reset-password');
                    } else {
                        // Allow a small delay for the event to fire if it's going to
                        setTimeout(() => {
                            // detailed check if we are still on this page
                            router.push('/');
                        }, 500);
                    }
                } catch (err) {
                    console.error('Callback process error:', err);
                    setError('Error interno');
                }
            }

            return () => {
                subscription.unsubscribe();
            };
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
