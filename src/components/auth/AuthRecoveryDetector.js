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
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'PASSWORD_RECOVERY') {
                    console.log('PASSWORD_RECOVERY event -> Redirecting');
                    router.push('/auth/reset-password');
                } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                    // Check if this sign-in is from a recovery link
                    if (session?.user?.recovery_sent_at) {
                        const recoveryTime = new Date(session.user.recovery_sent_at).getTime();
                        const signInTime = session.user.last_sign_in_at ? new Date(session.user.last_sign_in_at).getTime() : Date.now();

                        // If recovery was sent recently (e.g. within last 2 minutes) AND
                        // sign in happened AFTER recovery sent (or very close)
                        const timeDiff = Math.abs(signInTime - recoveryTime);

                        console.log('Recovery check:', { recoveryTime, signInTime, timeDiff });

                        // 2 minutes window (120000ms)
                        // This handles the case where the user clicks the link immediately
                        if (timeDiff < 120000) {
                            console.log('Likely recovery flow detected by timestamp -> Redirecting');
                            // Only redirect if NOT already on the reset password page
                            if (window.location.pathname !== '/auth/reset-password') {
                                router.push('/auth/reset-password');
                            }
                        }
                    }
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

