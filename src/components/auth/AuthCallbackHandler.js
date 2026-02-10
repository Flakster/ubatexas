'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('Verificando...');
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const next = searchParams.get('next');
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const typeParam = searchParams.get('type') || hashParams.get('type');

            // Flag to track if we've handled the redirect
            let handled = false;

            console.log('Callback params:', { code, next, typeParam });

            // Setup listener for recovery event - DO THIS FIRST
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                console.log('Auth event:', event);
                if (event === 'PASSWORD_RECOVERY') {
                    console.log('🔒 RECOVERY EVENT! Redirecting to reset...');
                    handled = true;
                    router.push('/auth/reset-password');
                }
            });

            if (!code) {
                // Implicit flow or error check
                if (hashParams.get('error')) {
                    setError(hashParams.get('error_description') || 'Error en autenticación');
                    return;
                }

                // Implicit recovery type check
                if (typeParam === 'recovery') {
                    handled = true;
                    router.push('/auth/reset-password');
                    return;
                }
            }

            if (code) {
                try {
                    // Exchange code
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

                    if (exchangeError) {
                        console.error('Exchange error:', exchangeError);
                        // Fallback: check session anyway
                        const { data: { session } } = await supabase.auth.getSession();
                        if (session && typeParam === 'recovery') {
                            handled = true;
                            router.push('/auth/reset-password');
                            return;
                        }
                        setError('Enlace expirado o inválido');
                        setTimeout(() => router.push('/login'), 3000);
                        return;
                    }

                    // Success handling
                    if (next) {
                        console.log('Next param detected -> Redirecting to:', next);
                        handled = true;
                        router.push(next);
                        return;
                    }

                    if (typeParam === 'recovery') {
                        console.log('Type param is recovery -> Reset Password');
                        handled = true;
                        router.push('/auth/reset-password');
                        return;
                    }


                    // If no explicit type, STOP REDIRECTING to home automatically
                    // Let the user see the debug info
                    setStatus('Esperando detección manual o evento...');

                    // console.log('No recovery detected after wait -> Home');
                    // router.push('/');


                } catch (err) {
                    console.error('Process error:', err);
                    setError('Error interno procesando la solicitud');
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
            gap: '1rem',
            padding: '2rem',
            maxWidth: '600px',
            margin: '0 auto',
            wordBreak: 'break-all'
        }}>
            <div className="spinner" style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid var(--color-accent)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{status}</p>

            {/* Debug Info Section */}
            <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#f5f5f5',
                borderRadius: '8px',
                fontSize: '0.8rem',
                width: '100%',
                color: '#333'
            }}>
                <p><strong>Debug Info:</strong></p>
                <p>URL: {typeof window !== 'undefined' ? window.location.pathname + window.location.search : ''}</p>
                <p>Hash: {typeof window !== 'undefined' ? window.location.hash : ''}</p>
                <p>Params: {JSON.stringify(Object.fromEntries(searchParams.entries()))}</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => router.push('/auth/reset-password')} style={{ padding: '0.5rem 1rem', background: '#333', color: 'white', borderRadius: '4px' }}>
                    Ir a Reset Password
                </button>
                <button onClick={() => router.push('/')} style={{ padding: '0.5rem 1rem', border: '1px solid #333', borderRadius: '4px' }}>
                    Ir a Home
                </button>
            </div>

            <style jsx>{`

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
