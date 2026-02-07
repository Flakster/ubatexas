'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugBanner() {
    const [debugInfo, setDebugInfo] = useState({ hash: '', search: '', lastEvent: null });

    useEffect(() => {
        setDebugInfo({
            hash: typeof window !== 'undefined' ? window.location.hash : '',
            search: typeof window !== 'undefined' ? window.location.search : '',
            lastEvent: null
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Home Auth Event:', event);
            setDebugInfo(prev => ({ ...prev, lastEvent: event }));

            if (event === 'PASSWORD_RECOVERY') {
                window.location.href = '/auth/reset-password';
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    if (!debugInfo.hash && !debugInfo.search && !debugInfo.lastEvent) return null;

    return (
        <div style={{ background: '#000', color: '#0f0', padding: '10px', fontSize: '12px', fontFamily: 'monospace', zIndex: 9999, position: 'relative' }}>
            <p><strong>DEBUG BANNER</strong></p>
            <p>Hash: {debugInfo.hash || '(none)'}</p>
            <p>Search: {debugInfo.search || '(none)'}</p>
            <p>Last Event: {debugInfo.lastEvent || '(waiting)'}</p>
        </div>
    );
}
