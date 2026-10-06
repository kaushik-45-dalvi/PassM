import Link from 'next/link';
import { Shield, ShieldCheck, Lock, Key, Cpu, Zap, Clock, Terminal, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';
import VaultSyncLogo from '../components/VaultSyncLogo';

export const metadata = {
  title: 'Security Architecture | VaultSync Zero-Knowledge',
  description: 'Technical security specifications: PBKDF2 100,000 rounds, AES-256-GCM encryption, RFC 6238 TOTP authenticator, and active OS clipboard protection.',
  alternates: { canonical: '/security' },
};

export default function SecurityPage() {
  return (
    <div style={{ background: '#FAF7EE', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
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
      <main style={{ flex: 1, maxWidth: 960, width: '100%', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 36, textAlign: 'center' }}>
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
            Cryptographic Architecture
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 900,
              color: '#000000',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: 12
            }}
          >
            Security is Our Architecture, Not an Afterthought
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', maxWidth: 680, margin: '0 auto', lineHeight: 1.6 }}>
            VaultSync enforces a strict mathematical separation between your private decryption keys and our cloud database. Here is how your credentials are protected under the hood.
          </p>
        </div>

        {/* 4 CORE SECURITY LAYERS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            marginBottom: 44
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: 20,
              padding: 24,
              boxShadow: '3px 3px 0 #000000'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: '#DCFCE7', border: '1.5px solid #000000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={20} color="#15803D" />
              </div>
              <strong style={{ fontSize: '1.05rem', color: '#000000', fontWeight: 900 }}>PBKDF2 Key Derivation</strong>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              Master passwords are processed through <strong>100,000 rounds of PBKDF2</strong> with SHA-256 and account-unique salts. This eliminates brute-force and dictionary attacks before key generation.
            </p>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: 20,
              padding: 24,
              boxShadow: '3px 3px 0 #000000'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: '#FEF3C7', border: '1.5px solid #000000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={20} color="#D97706" />
              </div>
              <strong style={{ fontSize: '1.05rem', color: '#000000', fontWeight: 900 }}>AES-256-GCM Encryption</strong>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              Every secret is encrypted with authenticated <strong>AES-256 Galois/Counter Mode</strong>. Each individual entry uses a cryptographically random 96-bit initialization vector (IV) to prevent ciphertext patterns.
            </p>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: 20,
              padding: 24,
              boxShadow: '3px 3px 0 #000000'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: '#DBEAFE', border: '1.5px solid #000000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} color="#2563EB" />
              </div>
              <strong style={{ fontSize: '1.05rem', color: '#000000', fontWeight: 900 }}>RFC 6238 TOTP Engine</strong>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              Two-factor authenticator verification codes are calculated directly inside your browser using pure Web Crypto HMAC-SHA1. Seeds remain zero-knowledge encrypted at rest.
            </p>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: 20,
              padding: 24,
              boxShadow: '3px 3px 0 #000000'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: '#FEE2E2', border: '1.5px solid #000000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={20} color="#DC2626" />
              </div>
              <strong style={{ fontSize: '1.05rem', color: '#000000', fontWeight: 900 }}>Clipboard Memory Scrubber</strong>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              Operating systems persist copied credentials in clipboard history. VaultSync activates an automated 30-second scrubber to wipe plaintext passwords and 2FA tokens from RAM.
            </p>
          </div>
        </div>

        {/* DETAILED CRYPTOGRAPHIC FLOW */}
        <div
          style={{
            background: '#FFFFFF',
            border: '2.5px solid #000000',
            borderRadius: 24,
            padding: '36px 32px',
            boxShadow: '4px 4px 0 #000000',
            marginBottom: 40
          }}
        >
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#000000', marginBottom: 16 }}>
            The Zero-Knowledge Lifecycle: From Browser to Cloud
          </h2>
          <ol style={{ paddingLeft: 22, fontSize: '0.92rem', color: '#334155', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <li>
              <strong>Key Derivation:</strong> When you enter your master password, your device executes `crypto.subtle.deriveKey()` with PBKDF2 (100,000 iterations). The resulting `CryptoKey` object is non-extractable and held only in volatile browser memory.
            </li>
            <li>
              <strong>Canary Verifier:</strong> To ensure you entered the correct master password without ever storing the password itself, VaultSync verifies a canary ciphertext (`VAULTSYNC_KEY_VERIFIED`). If it decrypts cleanly, the key is confirmed; if not, decryption halts locally.
            </li>
            <li>
              <strong>Payload Encryption:</strong> Plaintext passwords, 2FA secret keys, and encrypted history items are packaged into a JSON payload and encrypted with AES-256-GCM.
            </li>
            <li>
              <strong>Encrypted Sync:</strong> Only the random IV and ciphertext are sent over HTTPS to our encrypted vault storage. Server logs and infrastructure administrators cannot read your credentials.
            </li>
          </ol>
        </div>
      </main>

      <Footer />
    </div>
  );
}
