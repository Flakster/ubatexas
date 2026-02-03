'use client';

import { uploadPhotoAction } from '@/app/actions';
import UploadForm from '@/components/gente/UploadForm';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function NuevaFotoPage() {
    const { user, loading } = useAuth();

    if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Cargando...</div>;

    if (!user) {
        return (
            <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Sube tu estilo a Ubatexas</h2>
                <p style={{ marginBottom: '2rem' }}>Debes estar registrado para compartir tus fotos.</p>
                <Link href="/login" className="btn btn-primary">Entrar o Registrarse</Link>
            </div>
        );
    }

    if (!user.email_confirmed_at) {
        return (
            <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Verifica tu cuenta</h2>
                <p style={{ marginBottom: '2rem' }}>Hemos enviado un correo de confirmación a <strong>{user.email}</strong>.<br />Por favor verifica tu cuenta para poder subir fotos.</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--color-primary)' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📷</span>
                Subir Foto
            </h1>
            <p style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                Comparte tu estilo, tu momento en el evento o ese paisaje increíble.
            </p>
            <UploadForm onSubmit={uploadPhotoAction} />
        </div>
    );
}
