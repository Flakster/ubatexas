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
            console.log('Full URL:', window.location.href);

            // Check the hash for recovery type FIRST
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const typeFromHash = hashParams.get('type');

            console.log('Type from hash:', typeFromHash);

            // If hash indicates recovery, redirect immediately without code exchange
            if (typeFromHash === 'recovery' || window.location.hash.includes('type=recovery')) {
                console.log('✅ Recovery flow detected from hash, redirecting to reset password');
                router.push('/auth/reset-password');
                return;
            }

            // For non-recovery flows, try to exchange the code
            try {
                const { data, error } = await supabase.auth.exchangeCodeForSession(code);

                if (error) {
                    console.error('Error exchanging code:', error);
                    // If it's a PKCE error, it might be a recovery flow that didn't have the hash
                    if (error.message.includes('PKCE') || error.message.includes('code verifier')) {
                        console.log('PKCE error detected, checking if this might be recovery...');
                        // Redirect to reset password as a fallback
                        router.push('/auth/reset-password');
                        return;
                    }
                    return;
                }

                console.log('Session exchanged successfully');
                console.log('Regular auth flow, cleaning URL');
                // Clean the URL but stay on homepage
                router.replace('/');
            } catch (err) {
                console.error('Recovery detection error:', err);
            }
        };

        detectRecovery();
    }, [router, searchParams]);

    return null; // This component doesn't render anything
}
