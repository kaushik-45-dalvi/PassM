import { redirect } from 'next/navigation';

// Legacy authentication callback route. Redirects cleanly to Clerk sign-in.
export async function GET() {
  redirect('/sign-in');
}
