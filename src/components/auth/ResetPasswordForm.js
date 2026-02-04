'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from './AuthForm.module.css';

export default function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const router = useRouter();

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

            if (error) throw error;

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

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Nueva Contraseña</h2>
            <form onSubmit={handleUpdatePassword} className={styles.form}>
                <div className={styles.group}>
                    <label htmlFor="password">Nueva contraseña</label>
                    <input
                        id="password"
                        type="password"
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
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
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
