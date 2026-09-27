'use client';

import { ShieldCheck, Globe, Check, X, Lock, Zap, Laptop, KeyRound, Users, ShieldAlert } from 'lucide-react';

export default function WhyMyPass({ onOpenVault }) {
  return (
    <section className="why-mypass-sec" id="why">
      <div className="why-mypass-container">
        {/* Left Mint Green Card */}
        <div className="why-green-block">
          <span className="why-tag">WHY VAULTSYNC</span>
          <h2 className="why-heading">More security.<br />Less effort.</h2>
          <p className="why-desc">
            VaultSync makes it easy to create, store, and use strong passwords—so you can focus on what matters most.
          </p>
          <button suppressHydrationWarning className="btn-pill-black" onClick={onOpenVault}>Explore Features</button>
        </div>

        {/* Right 2x3 Grid of 6 Rounded Cards on Cream */}
        <div className="why-cards-grid">
          {/* Card 1: Secure Vault */}
          <div className="why-feature-card">
            <div className="w-card-icon">
              <Lock size={26} strokeWidth={2.2} />
            </div>
            <h3>Secure Vault</h3>
            <p>Store unlimited passwords.</p>
          </div>

          {/* Card 2: Auto-Fill */}
          <div className="why-feature-card">
            <div className="w-card-icon">
              <Zap size={26} strokeWidth={2.2} />
            </div>
            <h3>Auto-Fill</h3>
            <p>Log in with one click.</p>
          </div>

          {/* Card 3: Cross-Device Sync */}
          <div className="why-feature-card">
            <div className="w-card-icon">
              <Laptop size={26} strokeWidth={2.2} />
            </div>
            <h3>Cross-Device Sync</h3>
            <p>Access on all your devices.</p>
          </div>

          {/* Card 4: Password Generator */}
          <div className="why-feature-card">
            <div className="w-card-icon">
              <KeyRound size={26} strokeWidth={2.2} />
            </div>
            <h3>Password Generator</h3>
            <p>Create strong, unique passwords.</p>
          </div>

          {/* Card 5: Family & Teams */}
          <div className="why-feature-card">
            <div className="w-card-icon">
              <Users size={26} strokeWidth={2.2} />
            </div>
            <h3>Family & Teams</h3>
            <p>Share securely with others.</p>
          </div>

          {/* Card 6: Breach Alerts */}
          <div className="why-feature-card">
            <div className="w-card-icon">
              <ShieldAlert size={26} strokeWidth={2.2} />
            </div>
            <h3>Breach Alerts</h3>
            <p>Get notified if your data is at risk.</p>
          </div>
        </div>
      </div>

      {/* VAULTSYNC VS GOOGLE CHROME COMPARISON TABLE */}
      <div style={{ maxWidth: 1240, margin: '64px auto 0', padding: '0 24px' }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '2.5px solid #000000',
            borderRadius: 28,
            padding: '44px 40px',
            boxShadow: '5px 5px 0 #000000'
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 36px' }}>
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
                marginBottom: 12
              }}
            >
              Head-to-Head Comparison
            </span>
            <h3
              style={{
                fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
                fontWeight: 900,
                color: '#000000',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: 12
              }}
            >
              Why VaultSync is Undeniably Better and Safer Than Google Chrome
            </h3>
            <p style={{ fontSize: '0.94rem', color: '#475569', lineHeight: 1.6 }}>
              Default browser managers prioritize Google ecosystem convenience over cryptographic isolation.
              VaultSync delivers sovereign Zero-Knowledge architecture with proactive memory scrubbing.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: '0 8px',
                minWidth: 640
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.86rem', fontWeight: 800, color: '#64748B' }}>
                    Security Dimension
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px 18px',
                      fontSize: '0.96rem',
                      fontWeight: 900,
                      color: '#000000',
                      background: '#DCFCE7',
                      border: '2px solid #16A34A',
                      borderRadius: '12px 12px 0 0',
                      width: '42%'
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                      <ShieldCheck size={18} color="#16A34A" strokeWidth={2.5} />
                      <span>VaultSync</span>
                    </span>
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px 18px',
                      fontSize: '0.90rem',
                      fontWeight: 800,
                      color: '#475569',
                      width: '38%'
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                      <Globe size={18} color="#64748B" strokeWidth={2.2} />
                      <span>Google Chrome Password Manager</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: 'Zero-Knowledge Cryptography',
                    vs: 'Client-side PBKDF2 (100,000 rounds) + AES-256-GCM. Master key never touches servers.',
                    chrome: 'Tied to Google profile & OS session. Accessible by malware running in user context.'
                  },
                  {
                    feature: 'Built-in 2FA / TOTP Authenticator',
                    vs: 'Live RFC 6238 TOTP engine with 30s circular countdown & 1-click copy (replaces Google Authenticator).',
                    chrome: 'No desktop TOTP generator; requires pulling out your phone every time.'
                  },
                  {
                    feature: 'Active Clipboard Memory Scrubber',
                    vs: 'Floating memory guard actively purges OS clipboard after 30s to block scrapers.',
                    chrome: 'Copied passwords sit indefinitely in OS clipboard history until overwritten.'
                  },
                  {
                    feature: 'Security Health Command Center',
                    vs: 'Continuous audit of weak passwords & reused clusters with 1-Click 20-char high entropy upgrade.',
                    chrome: 'Basic breach flag list; requires navigating external websites manually.'
                  },
                  {
                    feature: 'Printable Emergency Recovery Kit',
                    vs: 'Offline printable confidential recovery sheet for bank-grade physical safekeeping.',
                    chrome: 'None. If Google account recovery fails, credentials are lost forever.'
                  },
                  {
                    feature: 'Password Version History & Rollback',
                    vs: 'Preserves encrypted history of previous passwords so changes can be undone.',
                    chrome: 'Destructive overwrite. Updated passwords instantly erase previous entries.'
                  },
                  {
                    feature: '1-Click Direct Chrome Migration',
                    vs: 'Instant client-side CSV & JSON import with automatic batch AES-256 encryption.',
                    chrome: 'Export only; locked into Chrome ecosystem for primary autofill.'
                  }
                ].map((row, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#FAF7EE' : '#FFFFFF' }}>
                    <td
                      style={{
                        padding: '14px 18px',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        color: '#000000',
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10
                      }}
                    >
                      {row.feature}
                    </td>
                    <td
                      style={{
                        padding: '14px 18px',
                        fontSize: '0.86rem',
                        color: '#064E3B',
                        fontWeight: 700,
                        background: '#F0FDF4',
                        borderLeft: '2px solid #16A34A',
                        borderRight: '2px solid #16A34A',
                        lineHeight: 1.45
                      }}
                    >
                      <Check size={14} color="#16A34A" strokeWidth={3} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                      {row.vs}
                    </td>
                    <td
                      style={{
                        padding: '14px 18px',
                        fontSize: '0.84rem',
                        color: '#64748B',
                        lineHeight: 1.45,
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10
                      }}
                    >
                      <X size={14} color="#DC2626" strokeWidth={3} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                      {row.chrome}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <button
              suppressHydrationWarning
              className="btn-pill-black"
              onClick={onOpenVault}
              style={{ padding: '14px 34px', fontSize: '0.96rem' }}
            >
              Switch from Chrome to VaultSync Now &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
