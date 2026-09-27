import { redirect } from 'next/navigation';

// Legacy Supabase OAuth callback route. VaultSync now uses Clerk for all
// authentication, so any requests that still hit this endpoint should be
// redirected to the Clerk sign-in page.
export async function GET() {
  redirect('/sign-in');
}
