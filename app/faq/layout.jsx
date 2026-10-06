const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vaultsyncc.vercel.app';

export const metadata = {
  title: 'Frequently Asked Questions (FAQ) | VaultSyncc Zero-Knowledge Password Vault',
  description: 'Common questions about VaultSync: Zero-Knowledge encryption, master passwords, Chrome password import, built-in 2FA authenticator, and emergency recovery sheets.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'VaultSync FAQ — Zero-Knowledge Architecture & Security',
    description: 'Learn how VaultSync protects your passwords with client-side AES-256-GCM encryption and built-in 2FA.',
    url: `${siteUrl}/faq`,
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does VaultSync or anyone on your team have access to my passwords?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. VaultSyncc is built strictly on a mathematical Zero-Knowledge architecture. Your master password derives a 256-bit encryption key on your device using PBKDF2 (100,000 iterations). All passwords, notes, and 2FA seeds are encrypted with AES-256-GCM locally in your browser before being stored. We never receive or store your master password or unencrypted credentials.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I create and use my own passwords, or do I have to use generated ones?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can do both. VaultSync gives you full flexibility: type your own custom password and see real-time entropy metrics, or use our built-in high-entropy generator with customizable length, symbols, and numbers.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if VaultSync is ever breached?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because encryption and decryption occur exclusively client-side in your browser, any database compromise only yields unreadable AES-256-GCM ciphertext blocks. Without your master password, attackers cannot decrypt your credentials.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is VaultSync safer than Google Chrome’s built-in password manager?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Google Chrome stores credentials accessible to anyone with physical device access or rogue extensions. VaultSyncc enforces master key authentication, auto-lock timeouts, client-side AES-256-GCM encryption, built-in 2FA TOTP authenticator, and an active 30-second OS clipboard memory scrubber.',
      },
    },
  ],
};

export default function FAQLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
