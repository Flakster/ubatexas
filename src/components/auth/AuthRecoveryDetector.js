'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthRecoveryDetector() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const detectRecovery = async () => {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const type = searchParams.get('type') || hashParams.get('type');
            const next = searchParams.get('next');
            const code = searchParams.get('code');

            console.log('Global Recovery Detector:', { type, next, code, path: window.location.pathname });

            // 1. Check for explicit recovery type
            if (type === 'recovery') {
                console.log('Recovery type detected -> Redirecting to reset password');
                router.push('/auth/reset-password?code=' + (code || ''));
                return;
            }

            // 2. Check for explicit next param pointing to reset password
            if (next && next.includes('/auth/reset-password')) {
                console.log('Next param is reset password -> Redirecting');
                router.push(next + (code ? `?code=${code}` : ''));
                return;
            }

            // 3. Listen for Supabase event (fallback)
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'PASSWORD_RECOVERY') {
                    console.log('PASSWORD_RECOVERY event -> Redirecting');
                    router.push('/auth/reset-password');
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        };

        detectRecovery();
    }, [router, searchParams]);

    return null;
}

