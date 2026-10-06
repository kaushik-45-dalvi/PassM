import Link from 'next/link';
import { Shield, ShieldCheck, Lock, Key, CheckCircle2, AlertTriangle, ArrowLeft, Download, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VaultSyncLogo from '../components/VaultSyncLogo';

export const metadata = {
  title: 'Terms and Conditions | VaultSync Zero-Knowledge Protection',
  description: 'VaultSync Terms and Conditions. Our mathematical guarantee: We do NOT have, store, or possess your passwords. True Zero-Knowledge client-side encryption.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
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
        {/* Eyebrow & Title */}
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
            Zero-Knowledge Legal Commitment
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
            Terms and Conditions of Service
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', maxWidth: 640, margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
            Effective Date: September 2026 • Built on the fundamental principle that <strong>you own your data</strong> and <strong>we never possess your passwords</strong>.
          </p>
        </div>

        {/* TRUST BANNER: ZERO-KNOWLEDGE PROMISE */}
        <div
          style={{
            background: '#FFFFFF',
            border: '3px solid #000000',
            borderRadius: 24,
            padding: '36px 32px',
            marginBottom: 36,
            boxShadow: '5px 5px 0 #000000'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#B5F2B7',
                border: '2.5px solid #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '2px 2px 0 #000000'
              }}
            >
              <ShieldCheck size={32} color="#000000" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#000000', margin: 0 }}>
                Our Plain-English Safety Guarantee: We Do Not Have Your Passwords
              </h2>
              <span style={{ fontSize: '0.88rem', color: '#15803D', fontWeight: 800 }}>
                Mathematical Zero-Knowledge Privacy • Cryptographically Enforced Trust
              </span>
            </div>
          </div>

          <div
            style={{
              background: '#FEF9C3',
              border: '2px solid #000000',
              borderRadius: 16,
              padding: '18px 22px',
              marginBottom: 24,
              boxShadow: '2px 2px 0 #000000'
            }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Lock size={22} color="#854D0E" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: '0.94rem', color: '#713F12', lineHeight: 1.6 }}>
                <strong>Why You Can Trust VaultSync With 100% Confidence:</strong> When you store passwords in VaultSync, you are not trusting a company or an employee. You are trusting <strong>unbreakable mathematics</strong>. Your master password never leaves your browser. All encryption happens on your machine using <strong>AES-256-GCM</strong>. Even if a court issues a subpoena or our databases are compromised, nobody can decrypt your vault because <strong>we do not possess your key</strong>.
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.94rem', color: '#1E293B', lineHeight: 1.7, marginBottom: 20 }}>
            Unlike standard web applications or legacy browser managers, <strong>VaultSync is built as a true Zero-Knowledge cryptographic vault</strong>. All encryption and decryption operations take place locally on your computer or phone using client-side <strong>AES-256-GCM</strong> with <strong>PBKDF2 key derivation (100,000 rounds)</strong>. 
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 16,
              background: '#FAF7EE',
              border: '2px solid #000000',
              borderRadius: 16,
              padding: 20,
              marginBottom: 24
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: '#000000', fontWeight: 800 }}>
                  We Don't Have Your Master Password
                </strong>
                <span style={{ fontSize: '0.80rem', color: '#475569', lineHeight: 1.4, display: 'block', marginTop: 2 }}>
                  Your Master Password is never sent across the internet and never stored on any server.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: '#000000', fontWeight: 800 }}>
                  We Cannot Decrypt Your Secrets
                </strong>
                <span style={{ fontSize: '0.80rem', color: '#475569', lineHeight: 1.4, display: 'block', marginTop: 2 }}>
                  Our database only ever stores high-entropy encrypted ciphertext. We cannot read your passwords even if we wanted to.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: '#000000', fontWeight: 800 }}>
                  Subpoena & Breach Resistant
                </strong>
                <span style={{ fontSize: '0.80rem', color: '#475569', lineHeight: 1.4, display: 'block', marginTop: 2 }}>
                  Even in the event of a database compromise or government subpoena, attackers only obtain undecipherable binary noise.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: '#000000', fontWeight: 800 }}>
                  100% User Data Ownership
                </strong>
                <span style={{ fontSize: '0.80rem', color: '#475569', lineHeight: 1.4, display: 'block', marginTop: 2 }}>
                  You retain complete ownership. Export your credentials as JSON/CSV or wipe your vault permanently at any moment.
                </span>
              </div>
            </div>
          </div>

          {/* Visual Trust Table */}
          <div style={{ border: '2px solid #000000', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#000000', color: '#FFFFFF' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 800 }}>Trust Dimension</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 800 }}>Chrome / Browser Managers</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 800, background: '#16A34A', color: '#FFFFFF' }}>VaultSync Zero-Knowledge</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>Master Password</td>
                  <td style={{ padding: '10px 14px', color: '#64748B' }}>Tied to browser account; readily exposed</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#15803D' }}>NEVER transmitted or stored anywhere</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>Decryption Location</td>
                  <td style={{ padding: '10px 14px', color: '#64748B' }}>Browser memory / Google Cloud sync</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#15803D' }}>Client-Side only (PBKDF2 100k rounds)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>Can VaultSync Read Passwords?</td>
                  <td style={{ padding: '10px 14px', color: '#DC2626' }}>Cloud providers hold decryption capability</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#15803D' }}>IMPOSSIBLE. Zero-Knowledge architecture</td>
                </tr>
                <tr style={{ background: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>Custom or Generated Passwords</td>
                  <td style={{ padding: '10px 14px', color: '#64748B' }}>Limited generator settings</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#15803D' }}>Full freedom: create custom or generate with live entropy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION BY SECTION TERMS CONTENT */}
        <div
          style={{
            background: '#FFFFFF',
            border: '2.5px solid #000000',
            borderRadius: 24,
            padding: '40px 36px',
            boxShadow: '4px 4px 0 #000000',
            display: 'flex',
            flexDirection: 'column',
            gap: 32
          }}
        >
          {/* Section 1 */}
          <section>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#000000', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>1. Agreement & Acceptance</span>
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>
              By accessing, creating an account with, or utilizing VaultSync ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree with any provision of these terms, you must discontinue using the Service immediately. VaultSync is provided solely for lawful credential management and personal or organizational password security.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1.5px solid #E2E8F0', margin: 0 }} />

          {/* Section 2 */}
          <section>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#000000', marginBottom: 10 }}>
              2. Zero-Knowledge Cryptography & Absolute Privacy
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, marginBottom: 12 }}>
              VaultSync is engineered from the ground up to uphold the highest level of cryptographic sovereignty:
            </p>
            <ul style={{ paddingLeft: 20, fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>
                <strong>Client-Side Encryption:</strong> Your master password derives an AES-256 cryptographic key on your device using PBKDF2 with 100,000 hashing rounds and SHA-256. Passwords, secret notes, 2FA authenticator seeds, and history entries are encrypted before transmission.
              </li>
              <li>
                <strong>No Server-Side Plaintext:</strong> VaultSync servers, database administrators, and automated background jobs NEVER receive, inspect, log, or store your master password or unencrypted vault contents.
              </li>
              <li>
                <strong>Third-Party Disclosures:</strong> Because VaultSync does not possess the cryptographic keys needed to unlock your vault, we cannot disclose your plaintext records to any third party, regulatory body, or law enforcement agency.
              </li>
            </ul>
          </section>

          <hr style={{ border: 'none', borderTop: '1.5px solid #E2E8F0', margin: 0 }} />

          {/* Section 3 */}
          <section>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#000000', marginBottom: 10 }}>
              3. Master Password Responsibility & Account Recovery
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, marginBottom: 14 }}>
              Because VaultSync operates with strict Zero-Knowledge security, <strong>we cannot reset or recover your master password if you lose it</strong>. You explicitly acknowledge and agree that:
            </p>
            <div
              style={{
                background: '#FEF3C7',
                border: '1.5px solid #D97706',
                borderRadius: 14,
                padding: 16,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12
              }}
            >
              <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: '0.88rem', color: '#78350F', lineHeight: 1.6 }}>
                <strong>Essential User Responsibility:</strong> You are exclusively responsible for memorizing or securely storing your Master Password. We strongly recommend generating and printing the offline <strong>Emergency Recovery Access Sheet</strong> provided in your dashboard and locking it in a physical safe.
              </div>
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '1.5px solid #E2E8F0', margin: 0 }} />

          {/* Section 4 */}
          <section>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#000000', marginBottom: 10 }}>
              4. Built-in Security Tools (2FA TOTP & Active Clipboard Guard)
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>
              VaultSync provides an integrated RFC 6238 two-factor authentication (TOTP) generator and an active 30-second operating system clipboard memory scrubber. While these mechanisms are engineered according to industry best practices, you are responsible for maintaining device-level security, including keeping your operating system and web browser free of malware, keyloggers, and unauthorized browser extensions.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1.5px solid #E2E8F0', margin: 0 }} />

          {/* Section 5 */}
          <section>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#000000', marginBottom: 10 }}>
              5. Ownership and Portability of Your Data
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>
              You retain all right, title, and interest in and to any credentials and information you store in VaultSync. We do not claim any ownership over your content. You may export your decrypted credentials at any time in standardized formats (such as encrypted backup or plain JSON/CSV), or delete individual items or your entire account with immediate, irrevocable effect.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1.5px solid #E2E8F0', margin: 0 }} />

          {/* Section 6 */}
          <section>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#000000', marginBottom: 10 }}>
              6. Limitation of Liability & Warranties
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>
              The Service is provided on an "as-is" and "as-available" basis without warranties of any kind, whether express or implied. To the maximum extent permitted by applicable law, VaultSync and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or credentials resulting from user error, forgotten master passwords, or compromised client devices.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1.5px solid #E2E8F0', margin: 0 }} />

          {/* Section 7 */}
          <section>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#000000', marginBottom: 10 }}>
              7. Contact and Security Inquiries
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>
              For legal inquiries, terms clarification, or responsible vulnerability disclosure, please reach out to our team at <strong>security@vaultsync.app</strong>.
            </p>
          </section>
        </div>

        {/* Bottom CTA Banner */}
        <div
          style={{
            marginTop: 40,
            background: '#B5F2B7',
            border: '2.5px solid #000000',
            borderRadius: 20,
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            boxShadow: '3px 3px 0 #000000'
          }}
        >
          <div>
            <strong style={{ fontSize: '1.05rem', color: '#000000', display: 'block', fontWeight: 900 }}>
              Ready to protect your digital identity?
            </strong>
            <span style={{ fontSize: '0.86rem', color: '#064E3B', fontWeight: 600 }}>
              Zero-knowledge client-side encryption. Completely free to start.
            </span>
          </div>
          <Link
            href="/dashboard"
            style={{
              background: '#000000',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 30,
              padding: '12px 26px',
              fontSize: '0.92rem',
              fontWeight: 800,
              textDecoration: 'none',
              cursor: 'pointer',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.2)'
            }}
          >
            Launch Your Vault &rarr;
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
