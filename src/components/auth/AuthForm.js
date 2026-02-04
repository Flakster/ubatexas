'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './AuthForm.module.css';

export default function AuthForm() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [isSignUp, setIsSignUp] = useState(false);

    const checkUsername = async (name) => {
        if (!name) return true;
        const cleanName = name.trim();
        const { data, error } = await supabase
            .from('profiles')
            .select('display_name')
            .ilike('display_name', cleanName)
            .maybeSingle();

        if (error) {
            console.error('Error al verificar disponibilidad:', error);
            return true;
        }
        return !data;
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        console.log('--- Intentando Autenticación (v2.1) ---');

        try {
            const cleanDisplayName = displayName.trim();
            const cleanEmail = email.trim();

            if (isSignUp) {
                // 1. Verificación proactiva
                const isAvailable = await checkUsername(cleanDisplayName);
                if (!isAvailable) {
                    throw new Error('Lo sentimos, este nombre de usuario ya está registrado. Por favor intenta con otro.');
                }

                // 2. Registro en Supabase Auth
                const { error: signUpError } = await supabase.auth.signUp({
                    email: cleanEmail,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                        data: {
                            display_name: cleanDisplayName
                        }
                    },
                });

                if (signUpError) {
                    console.log('Error detectado en signUp:', signUpError);
                    // Capturar cualquier error que mencione "database error" o "saving new user"
                    const msg = signUpError.message.toLowerCase();
                    if (msg.includes('database') || msg.includes('saving new user') || msg.includes('unique constraint')) {
                        throw new Error('Ese nombre de usuario ya está en uso. Por favor elige otro.');
                    }
                    throw signUpError;
                }

                setMessage({ type: 'success', text: '¡Registro exitoso! Por favor verifica tu email para activar tu cuenta.' });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: cleanEmail,
                    password,
                });
                if (error) throw error;
            }
        } catch (error) {
            console.error('Captura de error en handleAuth:', error);
            let userFriendlyMessage = error.message;

            // Traducciones amigables
            const msg = error.message.toLowerCase();
            if (msg.includes('invalid login credentials')) {
                userFriendlyMessage = 'Email o contraseña incorrectos.';
            } else if (msg.includes('user already registered')) {
                userFriendlyMessage = 'Este email ya tiene una cuenta asociada.';
            } else if (msg.includes('database error') || msg.includes('saving new user')) {
                userFriendlyMessage = 'Ese nombre de usuario ya está registrado. Elige otro.';
            }

            setMessage({ type: 'error', text: userFriendlyMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{isSignUp ? 'Únete a Ubatexas' : 'Bienvenido de nuevo'}</h2>
            <form onSubmit={handleAuth} className={styles.form}>
                {isSignUp && (
                    <div className={styles.group}>
                        <label htmlFor="displayName">¿Cómo te llamas?</label>
                        <input
                            id="displayName"
                            type="text"
                            placeholder="Ej: Carlos Ubaté"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                        />
                    </div>
                )}
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
