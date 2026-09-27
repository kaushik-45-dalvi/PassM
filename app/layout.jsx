import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Plus_Jakarta_Sans, Caveat } from 'next/font/google';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'VaultSync',
  title: {
    default: 'VaultSync — Secure Password Manager',
    template: '%s | VaultSync',
  },
  description: 'VaultSync helps you generate, store, and organize strong passwords in a client-side encrypted vault.',
  keywords: ['password manager', 'password generator', 'encrypted vault', 'secure passwords', 'password security'],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'VaultSync',
    title: 'VaultSync — Secure Password Manager',
    description: 'Create strong passwords and keep your vault organized with client-side encryption.',
  },
  twitter: {
    card: 'summary',
    title: 'VaultSync — Secure Password Manager',
    description: 'Create strong passwords and keep your vault organized with client-side encryption.',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

const defaultPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_cmVuZXdpbmctc3R1cmdlb24tMjQ3MC5jbGVyay5hY2NvdW50cy5kZXYk';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={defaultPublishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en" suppressHydrationWarning className={`${plusJakartaSans.variable} ${caveat.variable} ${plusJakartaSans.className}`}>
        <body suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
