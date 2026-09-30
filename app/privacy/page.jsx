import Link from 'next/link';
import { Shield, ShieldCheck, Lock, CheckCircle2, ArrowLeft, EyeOff, Database, Server } from 'lucide-react';
import Footer from '../components/Footer';
import VaultSyncLogo from '../components/VaultSyncLogo';

export const metadata = {
  title: 'Privacy Policy | VaultSync Zero-Knowledge Protection',
  description: 'VaultSync Privacy Policy. Your privacy is protected by mathematics: we never see, log, or store your passwords.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div style={{ background: '#FAF7EE', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <header
        style={{
          background: '#FFFFFF',
          borderBottom: '2.5px solid #000000',
          padding: '16px 28px',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <VaultSyncLogo size={32} fontSize="1.25rem" href="/" />

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link
              href="/"
              prefetch={true}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.86rem',
                fontWeight: 800,
                color: '#000000',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: 20,
                border: '1.5px solid #000000',
                background: '#FFFFFF',
                boxShadow: '1.5px 1.5px 0 #000000'
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
            <Link
              href="/dashboard"
              prefetch={true}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.86rem',
                fontWeight: 800,
                color: '#000000',
                textDecoration: 'none',
                padding: '7px 16px',
                borderRadius: 20,
                border: '1.5px solid #000000',
                background: '#B5F2B7',
                boxShadow: '2px 2px 0 #000000'
              }}
            >
              <span>Open Vault &rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: 960, width: '100%', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
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
            Zero-Knowledge Privacy Standard
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
            Privacy Policy
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
            Your privacy is not just a promise; it is guaranteed by mathematics. We do not have your passwords, we cannot view your vault, and we never sell your data.
          </p>
        </div>

        {/* SUMMARY COMPARISON CARDS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            marginBottom: 36
          }}
        >
          <div
            style={{
              background: '#DCFCE7',
              border: '2px solid #16A34A',
              borderRadius: 20,
              padding: 24,
              boxShadow: '3px 3px 0 #000000'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <ShieldCheck size={24} color="#16A34A" />
              <strong style={{ fontSize: '1.05rem', color: '#064E3B', fontWeight: 900 }}>What We Store</strong>
            </div>
            <ul style={{ paddingLeft: 18, fontSize: '0.86rem', color: '#14532D', lineHeight: 1.6, margin: 0 }}>
              <li>Your authenticated account email (via Clerk)</li>
              <li>Encrypted ciphertext of your passwords (AES-256-GCM)</li>
              <li>Initialization vectors (IVs) required for decryption</li>
              <li>Account metadata (service name, website URL, category)</li>
            </ul>
          </div>

          <div
            style={{
              background: '#FEE2E2',
              border: '2px solid #DC2626',
              borderRadius: 20,
              padding: 24,
              boxShadow: '3px 3px 0 #000000'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <EyeOff size={24} color="#DC2626" />
              <strong style={{ fontSize: '1.05rem', color: '#7F1D1D', fontWeight: 900 }}>What We NEVER Have</strong>
            </div>
            <ul style={{ paddingLeft: 18, fontSize: '0.86rem', color: '#991B1B', lineHeight: 1.6, margin: 0 }}>
              <li><strong>Your Master Password</strong> (never sent or saved)</li>
              <li><strong>Your Plaintext Passwords</strong> (decrypted locally only)</li>
              <li><strong>Your Secret Notes or 2FA Seeds</strong> (fully encrypted)</li>
              <li>Browsing activity, trackers, or behavioral profiling</li>
            </ul>
          </div>
        </div>

        {/* DETAILED PRIVACY PROVISIONS */}
        <div
          style={{
            background: '#FFFFFF',
            border: '2.5px solid #000000',
            borderRadius: 24,
            padding: '40px 36px',
            boxShadow: '4px 4px 0 #000000',
            display: 'flex',
            flexDirection: 'column',
            gap: 28
          }}
        >
          <section>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#000000', marginBottom: 10 }}>
              1. Mathematical Zero-Knowledge Architecture
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>
              VaultSync uses client-side encryption powered by the standardized Web Cryptography API. When you create or update a password, your device encrypts the payload using an AES-256-GCM key derived from your master password with PBKDF2 (100,000 iterations). Only the resulting ciphertext and a unique initialization vector are transmitted to the vault API. VaultSync administrators, developers, and infrastructure partners cannot view or decrypt your records.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1.5px solid #E2E8F0', margin: 0 }} />

          <section>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#000000', marginBottom: 10 }}>
              2. Authentication & Account Management
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>
              We partner with Clerk to manage account creation, social login, and multi-factor session authentication. Clerk processes your login credentials and email address in accordance with strict SOC 2 and GDPR privacy frameworks. Your master encryption key is completely separate from your Clerk login and is never accessible to Clerk.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1.5px solid #E2E8F0', margin: 0 }} />

          <section>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#000000', marginBottom: 10 }}>
              3. Data Sharing & Third Parties
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>
              We do not sell, rent, monetize, or trade your personal data. We do not integrate advertising SDKs, tracking pixels, or third-party behavioral analytics. Encrypted vault payloads are transmitted exclusively over secure TLS 1.3 connections, verified with Clerk session tokens, and protected against unauthorized access.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1.5px solid #E2E8F0', margin: 0 }} />

          <section>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#000000', marginBottom: 10 }}>
              4. Data Retention & Permanent Deletion
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>
              You have the right to request permanent deletion of your account and all associated encrypted vault records at any time. When you click "Reset Vault" or request account deletion, all records are permanently purged from active production databases.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
