'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  Lock,
  Key,
  Zap,
  CheckCircle2,
  ArrowLeft,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import Footer from '../components/Footer';
import VaultSyncLogo from '../components/VaultSyncLogo';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Does VaultSync or anyone on your team have access to my passwords?',
      a: 'Absolutely not. VaultSync is built strictly on a mathematical Zero-Knowledge architecture. Your master password derives a 256-bit encryption key on your device using PBKDF2 (100,000 iterations). All passwords, notes, and 2FA seeds are encrypted with AES-256-GCM locally in your browser before being transmitted to our database. We never receive, log, or store your master password or unencrypted passwords.'
    },
    {
      q: 'Can I create and use my own passwords, or do I have to use generated ones?',
      a: 'You can do both! VaultSync gives you 100% control. When adding or updating credentials, you can type your own custom password and view real-time cryptographic entropy, strength scores, and crack-time estimates. Alternatively, you can use our built-in cryptographically secure generator with customizable length, symbols, numbers, and memorable passphrase options.'
    },
    {
      q: 'What happens if VaultSync is ever breached or subpoenaed?',
      a: 'Even in the worst-case scenario of a complete database compromise or a government subpoena, attackers only obtain high-entropy encrypted ciphertext and initialization vectors. Because decryption keys never leave your physical device, your data remains mathematically impossible to read without your master password.'
    },
    {
      q: 'What if I forget my Master Password? Can support reset it for me?',
      a: 'Because we operate on a strict Zero-Knowledge model, we do not know your master password and have no backdoor to reset it. To protect you against accidental lockout, VaultSync provides a printable offline Emergency Recovery Sheet in your dashboard. Print it out or write it down, and store it in a secure physical location (such as a home safe).'
    },
    {
      q: 'Why is VaultSync safer than Google Chrome’s built-in password manager?',
      a: 'Google Chrome stores your credentials tied directly to your active Google profile session. Anyone with physical access to your laptop, or any rogue browser extension with broad permissions, can inspect your saved passwords in clear text. VaultSync enforces dedicated master key protection, auto-lock timeouts, client-side AES-256-GCM encryption, a built-in 2FA TOTP generator, and an active 30-second OS clipboard memory scrubber.'
    },
    {
      q: 'Can I migrate my passwords from Google Chrome, 1Password, or Bitwarden?',
      a: 'Yes! VaultSync includes a 1-click Chrome CSV and JSON import wizard. You simply export your passwords from Chrome or your existing manager, drag-and-drop the file into VaultSync, preview the entries, and click import. Every single credential is encrypted client-side on your device before syncing.'
    },
    {
      q: 'Do I retain ownership of my data? Can I export it anytime?',
      a: 'Yes, you retain 100% sovereignty over your data. You can export your entire vault as a decrypted JSON or CSV backup at any time. You can also permanently wipe your vault or delete your account with immediate, irrevocable effect.'
    },
    {
      q: 'How does the 30-second Clipboard Memory Scrubber work?',
      a: 'Whenever you copy a password or 2FA code to your clipboard, operating systems (Windows, macOS, Linux) often store it in clipboard history where background apps could inspect it. VaultSync triggers an automated 30-second timer to overwrite your clipboard memory with blank data, minimizing credential exposure.'
    }
  ];

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

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
      <main style={{ flex: 1, maxWidth: 900, width: '100%', margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Eyebrow & Title */}
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
            Clear Answers & Transparency
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
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
            Everything you need to know about VaultSync's zero-knowledge cryptography, password creation, safety guarantees, and account privacy.
          </p>
        </div>

        {/* TRUST HIGHLIGHT CALLOUT */}
        <div
          style={{
            background: '#FFFFFF',
            border: '2.5px solid #000000',
            borderRadius: 20,
            padding: '24px 28px',
            marginBottom: 36,
            boxShadow: '4px 4px 0 #000000',
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#DCFCE7',
              border: '2px solid #16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={28} color="#16A34A" />
          </div>
          <div>
            <strong style={{ fontSize: '1.05rem', color: '#000000', display: 'block', fontWeight: 900 }}>
              The Golden Rule of VaultSync
            </strong>
            <span style={{ fontSize: '0.90rem', color: '#334155', lineHeight: 1.5, display: 'block', marginTop: 3 }}>
              We do not know your master password, we cannot decrypt your secrets, and we have zero access to your stored credentials. Your privacy is guaranteed by mathematics.
            </span>
          </div>
        </div>

        {/* ACCORDION FAQ LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: '2px solid #000000',
                  borderRadius: 18,
                  boxShadow: isOpen ? '4px 4px 0 #000000' : '2px 2px 0 #000000',
                  transition: 'all 0.15s ease',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '20px 24px',
                    background: isOpen ? '#FAF7EE' : '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'background 0.15s ease'
                  }}
                  aria-expanded={isOpen}
                >
                  <span style={{ fontSize: '1.02rem', fontWeight: 800, color: '#000000', lineHeight: 1.35 }}>
                    {faq.q}
                  </span>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: isOpen ? '#B5F2B7' : '#F1F5F9',
                      border: '1.5px solid #000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '16px 24px 22px',
                      borderTop: '1.5px solid #000000',
                      background: '#FFFFFF',
                      fontSize: '0.92rem',
                      color: '#334155',
                      lineHeight: 1.7
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BOTTOM HELP BANNER */}
        <div
          style={{
            marginTop: 44,
            background: '#FFFFFF',
            border: '2.5px solid #000000',
            borderRadius: 22,
            padding: '30px 28px',
            textAlign: 'center',
            boxShadow: '4px 4px 0 #000000'
          }}
        >
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#000000', marginBottom: 8 }}>
            Still have questions?
          </h3>
          <p style={{ fontSize: '0.90rem', color: '#475569', marginBottom: 20 }}>
            Read our in-depth cryptographic overview or inspect our Zero-Knowledge Terms of Service.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/security"
              style={{
                background: '#B5F2B7',
                color: '#000000',
                border: '2px solid #000000',
                borderRadius: 24,
                padding: '10px 22px',
                fontSize: '0.88rem',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '2px 2px 0 #000000'
              }}
            >
              Security Architecture &rarr;
            </Link>
            <Link
              href="/terms"
              style={{
                background: '#FFFFFF',
                color: '#000000',
                border: '2px solid #000000',
                borderRadius: 24,
                padding: '10px 22px',
                fontSize: '0.88rem',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '2px 2px 0 #000000'
              }}
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
