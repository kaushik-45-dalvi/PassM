import { redirect } from 'next/navigation';

// Keep legacy links working while using Clerk as the single authentication
// authority. Redirects cleanly to Clerk sign-in.
export default function LegacySignInPage() {
  redirect('/sign-in');
}
