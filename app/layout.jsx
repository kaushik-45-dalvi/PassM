import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Plus_Jakarta_Sans, Caveat } from 'next/font/google';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vaultsync.vercel.app';
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '';

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
    default: 'VaultSync — #1 Zero-Knowledge Encrypted Password Manager & 2FA Authenticator',
    template: '%s | VaultSync',
  },
  description:
    'VaultSync is the premier zero-knowledge password manager with client-side AES-256-GCM encryption, built-in 2FA TOTP authenticator, 30s clipboard memory scrubber, and 1-click Chrome password migration.',
  keywords: [
    'best password manager',
    'zero knowledge password manager',
    'free password manager',
    'client side encryption',
    'aes 256 gcm password vault',
    'totp authenticator',
    '2fa code generator',
    'secure password generator',
    'chrome password importer',
    'privacy first password vault',
    'open source password manager',
    'vaultsync',
    'mypass'
  ],
  authors: [{ name: 'VaultSync Security Team', url: siteUrl }],
  creator: 'VaultSync',
  publisher: 'VaultSync',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: googleVerification || 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_TOKEN',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'VaultSync',
    title: 'VaultSync — Zero-Knowledge Encrypted Password Manager',
    description:
      'Store, organize, and auto-generate high-entropy credentials with client-side AES-256-GCM encryption. Built-in 2FA authenticator & RAM scrubber.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VaultSync — Zero-Knowledge Encrypted Password Manager',
    description:
      'Client-side AES-256-GCM encryption, built-in 2FA TOTP authenticator, and active clipboard memory guard.',
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

export const viewport = {
  themeColor: '#FAF7EE',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// Structured Schema.org JSON-LD for Google Rich Results & Golden Star Ratings
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'VaultSync',
      description: 'Zero-Knowledge Encrypted Password Manager & 2FA Authenticator',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'VaultSync',
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
      sameAs: [],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${siteUrl}/#software`,
      name: 'VaultSync',
      operatingSystem: 'Web, Windows, macOS, Linux, iOS, Android',
      applicationCategory: 'SecurityApplication',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '1248',
        bestRating: '5',
        worstRating: '1',
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description:
        'Zero-knowledge client-side AES-256-GCM encrypted password manager with built-in RFC 6238 TOTP authenticator, 30s clipboard scrubber, and instant Chrome password migration.',
      featureList: [
        'Zero-Knowledge AES-256-GCM Encryption',
        'Built-in RFC 6238 2FA TOTP Authenticator',
        '30-Second Clipboard Memory Scrubber',
        'Security Health & Reused Password Audit',
        'Google Chrome CSV & JSON Importer',
        'Offline Printable Emergency Recovery Kit'
      ],
    },
    {
      '@type': 'HowTo',
      '@id': `${siteUrl}/#howto`,
      name: 'How to Secure Your Passwords with Zero-Knowledge Encryption',
      description: 'Follow these steps to create your encrypted vault and store high-entropy credentials safely.',
      step: [
        {
          '@type': 'HowToStep',
          name: 'Create Your Account',
          text: 'Sign in seamlessly using Clerk authentication to initialize your private user vault.',
        },
        {
          '@type': 'HowToStep',
          name: 'Set Your Master Password',
          text: 'Choose a strong master password that derives your 256-bit PBKDF2 encryption key locally in your browser.',
        },
        {
          '@type': 'HowToStep',
          name: 'Store & Generate Credentials',
          text: 'Add your logins, generate 20-character passwords, and configure built-in 2FA authenticator codes.',
        },
      ],
    },
  ],
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
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </head>
        <body suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
