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
      appearance={{
        variables: {
          colorPrimary: '#16A34A',
          colorText: '#000000',
          colorTextSecondary: '#475569',
          colorBackground: '#FFFFFF',
          colorInputBackground: '#FFFFFF',
          colorInputText: '#000000',
          borderRadius: '14px',
          fontFamily: 'var(--font-plus-jakarta-sans), system-ui, -apple-system, sans-serif',
        },
        elements: {
          card: {
            boxShadow: '6px 6px 0px #000000',
            border: '2.5px solid #000000',
            borderRadius: '20px',
          },
          formButtonPrimary: {
            backgroundColor: '#000000',
            color: '#FFFFFF',
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            fontWeight: '800',
          },
          socialButtonsBlockButton: {
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            borderRadius: '12px',
            fontWeight: '700',
          },
          footerActionLink: {
            color: '#16A34A',
            fontWeight: '700',
          },
        },
      }}
    >
      <html lang="en" suppressHydrationWarning className={`${plusJakartaSans.variable} ${caveat.variable} ${plusJakartaSans.className}`}>
        <body suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
