'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from './AuthForm.module.css';

export default function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [checkingSession, setCheckingSession] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();


    // Check if user has an active session and listen for changes
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // No session, redirect to login
                router.push('/login');
                return;
            }

            setCheckingSession(false);
        };

        checkSession();

        // Listen for auth state changes (like logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                // User signed out, redirect to login
                router.push('/login');
            }
        });

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
            return;
        }

        if (password.length < 6) {
            setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) {
                // Handle specific error cases
                if (error.message.includes('session')) {
                    setMessage({ type: 'error', text: 'Tu sesión ha expirado. Por favor solicita un nuevo enlace de recuperación.' });
                    setTimeout(() => router.push('/login'), 3000);
                } else {
                    throw error;
                }
                return;
            }

            setMessage({ type: 'success', text: '¡Contraseña actualizada con éxito! Redirigiendo...' });

            // Redirect to home after a few seconds
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (error) {
            console.error('Error updating password:', error);
            setMessage({ type: 'error', text: error.message || 'Error al actualizar la contraseña.' });
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while checking session
    if (checkingSession) {
        return (
            <div className={styles.container}>
                <p style={{ textAlign: 'center' }}>Verificando sesión...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Nueva Contraseña</h2>
            <form onSubmit={handleUpdatePassword} className={styles.form}>
                <div className={styles.group}>
                    <label htmlFor="password">Nueva contraseña</label>
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.group}>
                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <input
                            type="checkbox"
                            id="showResetPassword"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                            style={{ width: 'auto', margin: 0 }}
                        />
                        <label htmlFor="showResetPassword" style={{ margin: 0, fontWeight: 'normal', cursor: 'pointer' }}>Mostrar contraseñas</label>
                    </div>
                </div>


                {message && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}

                <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
            </form>
        </div>
    );
}
