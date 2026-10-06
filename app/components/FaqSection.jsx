'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'Is VaultSync free to use?',
    a: 'Yes, VaultSync is 100% free to use. You can generate unlimited strong passwords, encrypt and store your credentials, and sync seamlessly across your devices.',
  },
  {
    q: 'How secure is VaultSync?',
    a: 'VaultSyncc is built on a Zero-Knowledge architecture. Your passwords and private notes are encrypted directly in your browser with AES-256-GCM and PBKDF2 (100,000 rounds) before they are sent to the cloud. Only you have the key.',
  },
  {
    q: 'Can I use VaultSync on multiple devices?',
    a: 'Yes! You can sign in to your VaultSync account from any desktop or mobile browser. Simply enter your Master Password to decrypt and access your passwords anywhere.',
  },
  {
    q: 'What happens if I forget my master password?',
    a: 'Because VaultSyncc is zero-knowledge, your master password is never stored or transmitted to our servers. Keep it memorized or written down in a safe location: without it, your encrypted secrets cannot be decrypted by anyone.',
  },
  {
    q: 'Can I export or backup my passwords?',
    a: 'Yes! VaultSync lets you export your encrypted credentials anytime into an encrypted JSON backup file right from your dashboard settings.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="faq-sec" id="faq">
      <div className="faq-container">
        {/* Left text block */}
        <div className="faq-left">
          <span className="section-tag-green">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="faq-heading">Got questions?<br />We've got answers.</h2>
        </div>

        {/* Right Accordion Pill Cards */}
        <div className="faq-accordion-col">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-pill-item ${openIndex === i ? 'active' : ''}`}>
              <button suppressHydrationWarning className="faq-pill-header" onClick={() => toggleIndex(i)}>
                <span>{faq.q}</span>
                <svg className="faq-chevron-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              <div className="faq-pill-body">
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
