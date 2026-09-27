import { createClient } from '@supabase/supabase-js';

/**
 * Creates the server-only database client. Never expose the service-role key
 * in NEXT_PUBLIC_* variables or import this module from a client component.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    !url ||
    !serviceRoleKey ||
    !url.startsWith('https://') ||
    url.includes('your-project-id') ||
    serviceRoleKey.includes('YOUR_') ||
    serviceRoleKey.length < 20
  ) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
