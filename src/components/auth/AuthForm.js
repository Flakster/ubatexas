'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './AuthForm.module.css';

export default function AuthForm() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/login`,
                    },
                });
                if (error) throw error;
                setMessage({ type: 'success', text: '¡Registro exitoso! Por favor verifica tu email.' });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{isSignUp ? 'Únete a Ubatexas' : 'Bienvenido de nuevo'}</h2>
            <form onSubmit={handleAuth} className={styles.form}>
                <div className={styles.group}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.group}>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {message && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}

                <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Entrar'}
                </button>
            </form>

            <p className={styles.toggle}>
                {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                {' '}
                <button onClick={() => setIsSignUp(!isSignUp)} className={styles.linkBtn}>
                    {isSignUp ? 'Inicia sesión' : 'Regístrate aquí'}
                </button>
            </p>
        </div>
    );
}
