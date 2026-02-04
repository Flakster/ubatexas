'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthRecoveryDetector() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const detectRecovery = async () => {
            const code = searchParams.get('code');

            // Only proceed if there's a code parameter
            if (!code) return;

            console.log('=== Recovery Detector ===');
            console.log('Code found in URL:', code);
            console.log('Full hash:', window.location.hash);

            try {
                // Exchange the code for a session
                const { data, error } = await supabase.auth.exchangeCodeForSession(code);

                if (error) {
                    console.error('Error exchanging code:', error);
                    return;
                }

                console.log('Session data:', data);

                // Check the hash for recovery type
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const type = hashParams.get('type');

                console.log('Type from hash:', type);

                if (type === 'recovery' || window.location.hash.includes('type=recovery')) {
                    console.log('✅ Recovery flow detected, redirecting to reset password');
                    router.push('/auth/reset-password');
                } else {
                    console.log('Regular auth flow, cleaning URL');
                    // Clean the URL but stay on homepage
                    router.replace('/');
                }
            } catch (err) {
                console.error('Recovery detection error:', err);
            }
        };

        detectRecovery();
    }, [router, searchParams]);

    return null; // This component doesn't render anything
}
