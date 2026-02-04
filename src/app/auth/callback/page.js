import { Suspense } from 'react';
import AuthCallbackHandler from '@/components/auth/AuthCallbackHandler';

export default function CallbackPage() {
    return (
        <Suspense fallback={
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <p>Cargando...</p>
            </div>
        }>
            <AuthCallbackHandler />
        </Suspense>
    );
}
