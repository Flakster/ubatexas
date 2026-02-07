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
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


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
            const cleanEmail = email.trim(); // Moved this line up to be consistent

            if (isSignUp) {
                const rawDisplayName = displayName.trim();

                // 1. Validaciones de formato
                // - Empieza por letra
                // - Solo letras y números
                // - Entre 3 y 20 caracteres
                const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,19}$/;

                if (!rawDisplayName) {
                    throw new Error('Por favor ingresa un nombre de usuario.');
                }

                if (rawDisplayName.length < 3) {
                    throw new Error('El nombre de usuario debe tener al menos 3 caracteres.');
                }

                if (rawDisplayName.length > 20) {
                    throw new Error('El nombre de usuario no puede tener más de 20 caracteres.');
                }

                if (!/^[a-zA-Z]/.test(rawDisplayName)) {
                    throw new Error('El nombre de usuario debe empezar por una letra.');
                }

                if (!usernameRegex.test(rawDisplayName)) {
                    throw new Error('El nombre de usuario solo puede contener letras y números, sin espacios ni caracteres especiales.');
                }

                const cleanDisplayName = rawDisplayName.toUpperCase();

                // 2. Verificación proactiva de disponibilidad
                const isAvailable = await checkUsername(cleanDisplayName);
                if (!isAvailable) {
                    throw new Error('Lo sentimos, este nombre de usuario ya está registrado. Por favor intenta con otro.');
                }

                // 3. Registro en Supabase Auth
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

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
            });
            if (error) throw error;
            setMessage({ type: 'success', text: 'Se ha enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.' });
        } catch (error) {
            console.error('Error in handleResetPassword:', error);
            setMessage({ type: 'error', text: error.message || 'Error al enviar el correo de recuperación.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                {isForgotPassword ? 'Recuperar contraseña' : (isSignUp ? 'Únete a Ubatexas' : 'Bienvenido de nuevo')}
            </h2>
            <form onSubmit={isForgotPassword ? handleResetPassword : handleAuth} className={styles.form}>
                {isSignUp && (
                    <div className={styles.group}>
                        <label htmlFor="displayName">Nombre de usuario</label>
                        <input
                            id="displayName"
                            type="text"
                            placeholder="Ej: Lucas"
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
                {!isForgotPassword && (
                    <div className={styles.group}>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)}
                                style={{ width: 'auto', margin: 0 }}
                            />
                            <label htmlFor="showPassword" style={{ margin: 0, fontWeight: 'normal', cursor: 'pointer' }}>Mostrar contraseña</label>
                        </div>
                    </div>
                )}


                {!isSignUp && !isForgotPassword && (
                    <div className={styles.forgotAction}>
                        <button
                            type="button"
                            onClick={() => { setIsForgotPassword(true); setMessage(null); }}
                            className={styles.linkBtn}
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                )}

                {message && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}

                <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Cargando...' : (isForgotPassword ? 'Enviar enlace' : (isSignUp ? 'Registrarse' : 'Entrar'))}
                </button>
            </form>

            <p className={styles.toggle}>
                {isForgotPassword ? (
                    <button onClick={() => { setIsForgotPassword(false); setMessage(null); }} className={styles.linkBtn}>
                        Volver al inicio de sesión
                    </button>
                ) : (
                    <>
                        {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                        {' '}
                        <button onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }} className={styles.linkBtn}>
                            {isSignUp ? 'Inicia sesión' : 'Regístrate aquí'}
                        </button>
                    </>
                )}
            </p>
        </div>
    );
}
