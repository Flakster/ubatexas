import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Suspense } from 'react';

export const metadata = {
    title: 'Restablecer Contraseña | Ubatexas',
    description: 'Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.',
};

export default function ResetPasswordPage() {
    return (
        <main className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Suspense fallback={<div className="spinner">Cargando...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </main>

    );
}
