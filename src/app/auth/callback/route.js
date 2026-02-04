import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET(request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') ?? '/';
    const type = requestUrl.searchParams.get('type');

    if (code) {
        const supabase = await createClient();

        // Exchange the code for a session (this verifies the email in Supabase)
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // If this is a password recovery flow, redirect to reset password page
            if (type === 'recovery') {
                return NextResponse.redirect(new URL('/auth/reset-password', request.url));
            }

            // Otherwise, redirect to the page the user was trying to access
            return NextResponse.redirect(new URL(next, request.url));
        } else {
            console.error('Auth verification error:', error);
        }
    }

    // if the code exchange fails or there's no code, redirect to login with an error
    return NextResponse.redirect(new URL('/login?error=verification_failed', request.url));
}
