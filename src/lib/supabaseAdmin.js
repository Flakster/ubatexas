import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client with the service role key.
 * THIS SHOULD ONLY BE USED IN SERVER-SIDE CODE (SERVER ACTIONS, API ROUTES).
 * It bypasses all RLS (Row Level Security) policies.
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Missing Supabase admin environment variables');
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
