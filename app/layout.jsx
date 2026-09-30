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
          borderRadius: '16px',
          fontFamily: 'var(--font-plus-jakarta-sans), system-ui, -apple-system, sans-serif',
        },
        elements: {
          rootBox: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          },
          cardBox: {
            boxShadow: 'none',
            width: '100%',
            maxWidth: '440px',
          },
          card: {
            boxShadow: '6px 6px 0px #000000',
            border: '2.5px solid #000000',
            borderRadius: '24px',
            backgroundColor: '#FFFFFF',
            padding: '28px 24px',
          },
          modalContent: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            border: 'none',
            padding: 0,
            margin: 'auto',
          },
          modalBackdrop: {
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
          },
          headerTitle: {
            fontWeight: '900',
            fontSize: '1.4rem',
            color: '#000000',
            letterSpacing: '-0.02em',
          },
          headerSubtitle: {
            color: '#64748B',
            fontSize: '0.88rem',
            fontWeight: '600',
          },
          formFieldInput: {
            borderRadius: '12px',
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            padding: '10px 14px',
            fontSize: '0.92rem',
            fontWeight: '600',
          },
          formButtonPrimary: {
            backgroundColor: '#000000',
            color: '#FFFFFF',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0px #000000',
            borderRadius: '50px',
            fontWeight: '800',
            fontSize: '0.95rem',
            padding: '12px',
          },
          socialButtonsBlockButton: {
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            borderRadius: '12px',
            fontWeight: '700',
            backgroundColor: '#FFFFFF',
            padding: '10px 14px',
          },
          footer: {
            background: 'transparent',
            borderTop: 'none',
          },
          footerActionLink: {
            color: '#16A34A',
            fontWeight: '800',
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
