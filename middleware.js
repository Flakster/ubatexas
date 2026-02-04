import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return request.cookies.get(name)?.value;
                },
                set(name, value, options) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name, options) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();

    // If user is logged in, check if they're in a recovery session
    if (session && session.user) {
        // Check if this is a recovery session
        // The session will have recovery_sent_at when password reset was initiated
        // After successful password update, Supabase clears this field
        const recoveryTime = session.user.recovery_sent_at;
        const lastSignIn = session.user.last_sign_in_at;

        // User is in recovery mode if:
        // 1. recovery_sent_at exists
        // 2. AND it's more recent than the last sign in (meaning password hasn't been updated yet)
        const isRecoverySession = recoveryTime && lastSignIn &&
            new Date(recoveryTime) > new Date(lastSignIn);

        // If in recovery session and NOT on the reset password page, redirect there
        if (isRecoverySession && !request.nextUrl.pathname.startsWith('/auth/reset-password')) {
            const resetPasswordUrl = new URL('/auth/reset-password', request.url);
            return NextResponse.redirect(resetPasswordUrl);
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
