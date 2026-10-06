import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
  Lock,
  Key,
  Clock,
  Zap,
  Upload,
  Printer,
  History,
  CheckCircle2,
  ArrowLeft,
  Sliders,
  Check
} from 'lucide-react';
import Footer from '../components/Footer';
import VaultSyncLogo from '../components/VaultSyncLogo';

export const metadata = {
  title: 'Features | VaultSync Zero-Knowledge Password Security',
  description: 'Explore VaultSync features: Zero-Knowledge AES-256 encryption, built-in 2FA TOTP authenticator, active clipboard scrubber, Chrome CSV migration, and security health audits.',
  alternates: { canonical: '/features' },
};

export default function FeaturesPage() {
  const featuresList = [
    {
      icon: <ShieldCheck size={26} color="#15803D" />,
      tag: 'Cryptographic Core',
      title: 'Zero-Knowledge AES-256-GCM',
      desc: 'All encryption and decryption happen strictly in your browser using PBKDF2 (100,000 rounds) and AES-256-GCM. We mathematically cannot access or view your passwords.'
    },
    {
      icon: <Clock size={26} color="#2563EB" />,
      tag: '2FA Authenticator',
      title: 'Built-in RFC 6238 TOTP Engine',
      desc: 'Replaces Google Authenticator right on your desktop. Generates real-time 6-digit rolling 2FA codes with 30-second live circular countdowns and 1-click clipboard copy.'
    },
    {
      icon: <Zap size={26} color="#DC2626" />,
      tag: 'Active RAM Guard',
      title: '30-Second Clipboard Memory Scrubber',
      desc: 'Operating systems preserve copied credentials in clipboard history indefinitely. VaultSync actively purges passwords and 2FA tokens from memory after 30 seconds.'
    },
    {
      icon: <Upload size={26} color="#000000" />,
      tag: '1-Click Migration',
      title: 'Google Chrome CSV & JSON Importer',
      desc: 'Migrate your existing passwords from Google Chrome, 1Password, or Bitwarden with 1 click. Features preview tables and batch client-side AES-256 encryption.'
    },
    {
      icon: <Shield size={26} color="#D97706" />,
      tag: 'Command Center',
      title: 'Security Health Audit & 1-Click Upgrade',
      desc: 'Audits weak passwords and reused credential clusters. Upgrade compromised or duplicate passwords to 20-character high-entropy keys with a single click.'
    },
    {
      icon: <Printer size={26} color="#475569" />,
      tag: 'Offline Recovery',
      title: 'Printable Emergency Recovery Sheet',
      desc: 'Generate a high-security physical recovery sheet for safe, offline bank-grade storage so your loved ones or emergency contacts can access credentials if needed.'
    },
    {
      icon: <History size={26} color="#7C3AED" />,
      tag: 'Version Control',
      title: 'Encrypted Password History & Rollback',
      desc: 'Accidentally update a password? VaultSync cryptographically preserves previous password versions so you can restore prior credentials anytime.'
    },
    {
      icon: <Sliders size={26} color="#059669" />,
      tag: 'Customizable Keys',
      title: 'Dual-Mode Password Creation',
      desc: 'Freely create and customize your own passwords with real-time entropy feedback, or tap into VaultSync’s pure Web Crypto random password generator.'
    }
  ];

  return (
    <div style={{ background: '#FAF7EE', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="subpage-header">
        <div className="subpage-header-inner">
          <VaultSyncLogo size={32} fontSize="1.25rem" href="/" />

          <div className="subpage-header-actions">
            <Link
              href="/"
              prefetch={true}
              className="subpage-btn-back"
              title="Back to Home"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
            <Link
              href="/dashboard"
              prefetch={true}
              className="subpage-btn-vault"
            >
              <span>Open Vault &rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: 1100, width: '100%', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 44, textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              background: '#B5F2B7',
              border: '1.5px solid #000000',
              borderRadius: 20,
              padding: '4px 14px',
              fontSize: '0.78rem',
              fontWeight: 900,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 12,
              boxShadow: '1.5px 1.5px 0 #000000'
            }}
          >
            Engineered for Absolute Sovereignty
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: 900,
              color: '#000000',
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              marginBottom: 14
            }}
          >
            Built to Outperform Every Browser Password Manager
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: 720, margin: '0 auto', lineHeight: 1.6 }}>
            Browser password managers were designed for convenience, not zero-knowledge defense. VaultSync merges bank-grade client-side encryption with built-in 2FA authenticators and active memory scrubbing.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 22,
            marginBottom: 48
          }}
        >
          {featuresList.map((feat, idx) => (
            <div
              key={idx}
              style={{
                background: '#FFFFFF',
                border: '2.5px solid #000000',
                borderRadius: 22,
                padding: '28px 26px',
                boxShadow: '4px 4px 0 #000000',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: '#FAF7EE',
                      border: '2px solid #000000',
                      borderRadius: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '2px 2px 0 #000000'
                    }}
                  >
                    {feat.icon}
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      borderRadius: 12,
                      padding: '3px 9px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#475569'
                    }}
                  >
                    {feat.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.18rem', fontWeight: 900, color: '#000000', marginBottom: 8, lineHeight: 1.25 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM CTA */}
        <div
          style={{
            background: '#FFFFFF',
            border: '3px solid #000000',
            borderRadius: 28,
            padding: '40px 36px',
            textAlign: 'center',
            boxShadow: '5px 5px 0 #000000'
          }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#000000', marginBottom: 10 }}>
            Experience Zero-Knowledge Security Today
          </h2>
          <p style={{ fontSize: '0.94rem', color: '#475569', maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Set up your encrypted vault in seconds. Import from Google Chrome with 1 click and enjoy pure mathematical privacy.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/dashboard"
              style={{
                background: '#000000',
                color: '#FFFFFF',
                borderRadius: 40,
                padding: '14px 34px',
                fontSize: '0.96rem',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '3px 3px 0 #B5F2B7'
              }}
            >
              Get Started for Free &rarr;
            </Link>
            <Link
              href="/terms"
              style={{
                background: '#FFFFFF',
                color: '#000000',
                borderRadius: 40,
                padding: '14px 28px',
                fontSize: '0.96rem',
                fontWeight: 800,
                textDecoration: 'none',
                border: '2px solid #000000'
              }}
            >
              Read Zero-Knowledge Terms
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
