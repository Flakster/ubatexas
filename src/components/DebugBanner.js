'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugBanner() {
    const [debugInfo, setDebugInfo] = useState({ hash: '', search: '', lastEvent: null });
    const [session, setSession] = useState(null);

    useEffect(() => {
        setDebugInfo({
            hash: typeof window !== 'undefined' ? window.location.hash : '',
            search: typeof window !== 'undefined' ? window.location.search : '',
            lastEvent: null
        });

        // Get initial session
        const getSession = async () => {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            setSession(currentSession);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Home Auth Event:', event);
            setDebugInfo(prev => ({ ...prev, lastEvent: event }));
            setSession(session);

            if (event === 'PASSWORD_RECOVERY') {
                window.location.href = '/auth/reset-password';
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    if (!debugInfo.hash && !debugInfo.search && !debugInfo.lastEvent && !session) return null;

    return (
        <div style={{ background: '#000', color: '#0f0', padding: '10px', fontSize: '12px', fontFamily: 'monospace', zIndex: 9999, position: 'relative' }}>
            <p><strong>DEBUG BANNER v2</strong></p>
            <p>Hash: {debugInfo.hash || '(none)'}</p>
            <p>Search: {debugInfo.search || '(none)'}</p>
            <p>Last Event: {debugInfo.lastEvent || '(waiting)'}</p>
            <hr style={{ borderColor: '#333', margin: '5px 0' }} />
            <p>User: {session?.user?.email || '(no user)'}</p>
            <p>Recovery Sent At: {session?.user?.recovery_sent_at || '(none)'}</p>
            <p>Last Sign In: {session?.user?.last_sign_in_at || '(none)'}</p>
        </div>
    );
}
