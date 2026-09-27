import { redirect } from 'next/navigation';

// Keep legacy links working while using Clerk as the single authentication
// authority. The previous page created a separate Supabase identity that could
// not unlock the Clerk-protected vault.
export default function LegacySignInPage() {
  redirect('/sign-in');
}
