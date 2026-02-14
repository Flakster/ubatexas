import { createClient } from '@/lib/supabaseServer';
import { isAdmin } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import NuevoEventoClient from './NuevoEventoClient';

export default async function NuevoEventoPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const isUserAdmin = isAdmin(user);

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 style={{ marginBottom: '1rem', textAlign: 'center', color: 'var(--color-primary)' }}>
                {isUserAdmin ? 'Crear Nuevo Evento' : 'Sugerir un Evento'}
            </h1>

            <NuevoEventoClient userId={user.id} isAdmin={isUserAdmin} />
        </div>
    );
}
