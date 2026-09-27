'use client';

import { ShieldCheck, Cloud, KeyRound, Search, Sparkles, Activity, User } from 'lucide-react';

export default function SecuritySection({ onOpenVault }) {
  return (
    <section className="security-first-sec" id="security">
      <div className="security-first-container">
        {/* Left Column: Text & CTA */}
        <div className="security-first-left">
          <span className="section-tag-green">SECURITY FIRST</span>
          <h2 className="security-first-heading">A safer way to browse the web</h2>
          <p className="security-first-desc">
            Passwords and notes are encrypted in your browser before storage, while your master password stays out of browser storage.
          </p>
          <button suppressHydrationWarning className="btn-pill-black" onClick={onOpenVault}>Create your vault</button>
        </div>

        {/* Right Column: Features Left + Phone Mockup + Features Right */}
        <div className="security-first-right">
          {/* 3 Badges Left */}
          <div className="features-badge-col">
            {/* 1. End-to-end encryption */}
            <div className="green-feature-item">
              <div className="green-circle-icon">
                <ShieldCheck size={20} strokeWidth={2.2} />
              </div>
              <div className="feature-label-text">
                <strong>Client-side</strong>
                <span>encryption</span>
              </div>
            </div>

            {/* 2. Sync across all devices */}
            <div className="green-feature-item">
              <div className="green-circle-icon">
                <Cloud size={20} strokeWidth={2.2} />
              </div>
              <div className="feature-label-text">
                <strong>Cloud-backed</strong>
                <span>vault storage</span>
              </div>
            </div>

            {/* 3. Zero-knowledge architecture */}
            <div className="green-feature-item">
              <div className="green-circle-icon">
                <KeyRound size={20} strokeWidth={2.2} />
              </div>
              <div className="feature-label-text">
                <strong>Master password</strong>
                <span>not stored</span>
              </div>
            </div>
          </div>

          {/* Phone Mockup (Center) */}
          <div className="phone-mockup-frame">
            <div className="phone-screen">
              <div className="phone-header-row">
                <span className="phone-brand-title">VaultSync</span>
                <div className="phone-avatar-icon">
                  <User size={18} strokeWidth={2.2} />
                </div>
              </div>

              <div className="phone-search-bar">
                <Search size={15} strokeWidth={2.2} color="#64748B" />
                <span>Search your vault...</span>
              </div>

              <div className="phone-items-list">
                {/* Google */}
                <div className="phone-item-row" onClick={() => onOpenVault('Google')}>
                  <div className="p-item-logo">
                    <svg width="26" height="26" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <div className="p-item-details">
                    <strong>Google</strong>
                    <span>alex@mypass.com</span>
                  </div>
                </div>

                {/* Netflix */}
                <div className="phone-item-row" onClick={() => onOpenVault('Netflix')}>
                  <div className="p-item-logo p-logo-black">
                    <svg width="16" height="20" viewBox="0 0 16 24" fill="none">
                      <path d="M0 0h4.5v24H0V0z" fill="#E50914"/>
                      <path d="M11.5 0h4.5v24h-4.5V0z" fill="#E50914"/>
                      <path d="M0 0l11.5 24h4.5L4.5 0H0z" fill="#B81D24"/>
                    </svg>
                  </div>
                  <div className="p-item-details">
                    <strong>Netflix</strong>
                    <span>alex@mypass.com</span>
                  </div>
                </div>

                {/* Spotify */}
                <div className="phone-item-row" onClick={() => onOpenVault('Spotify')}>
                  <div className="p-item-logo">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="12" fill="#1ED760"/>
                      <path d="M17.4 16.5c-.2.3-.5.4-.8.2-2.3-1.4-5.2-1.7-8.6-1-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 3.7-.8 6.9-.5 9.5 1.1.3.2.4.6.3.9zm1.1-2.5c-.3.4-.7.5-1.1.3-2.6-1.6-6.6-2.1-9.7-1.1-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 3.5-1.1 7.9-.5 10.9 1.3.4.2.5.7.4 1zm.1-2.7C15.4 9.4 10.3 9.2 7.3 10.1c-.5.2-1-.1-1.2-.6-.2-.5.1-1 .6-1.2 3.5-1.1 9.2-.8 12.8 1.3.4.3.6.8.3 1.3-.2.4-.7.6-1.2.4z" fill="#FFFFFF"/>
                    </svg>
                  </div>
                  <div className="p-item-details">
                    <strong>Spotify</strong>
                    <span>alex@mypass.com</span>
                  </div>
                </div>

                {/* Slack */}
                <div className="phone-item-row" onClick={() => onOpenVault('Slack')}>
                  <div className="p-item-logo">
                    <svg width="26" height="26" viewBox="0 0 24 24">
                      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
                      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
                      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D"/>
                      <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E"/>
                    </svg>
                  </div>
                  <div className="p-item-details">
                    <strong>Slack</strong>
                    <span>alex@mypass.com</span>
                  </div>
                </div>

                {/* Notion */}
                <div className="phone-item-row" onClick={() => onOpenVault('Notion')}>
                  <div className="p-item-logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000">
                      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
                    </svg>
                  </div>
                  <div className="p-item-details">
                    <strong>Notion</strong>
                    <span>alex@mypass.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Badges Right */}
          <div className="features-badge-col">
            {/* 1. Auto-fill made simple */}
            <div className="green-feature-item">
              <div className="green-circle-icon">
                <Search size={20} strokeWidth={2.2} />
              </div>
              <div className="feature-label-text">
                <strong>Quick search</strong>
                <span>and copy</span>
              </div>
            </div>

            {/* 2. Strong password generator */}
            <div className="green-feature-item">
              <div className="green-circle-icon">
                <Sparkles size={20} strokeWidth={2.2} />
              </div>
              <div className="feature-label-text">
                <strong>Strong</strong>
                <span>password generator</span>
              </div>
            </div>

            {/* 3. Local vault health */}
            <div className="green-feature-item">
              <div className="green-circle-icon">
                <Activity size={20} strokeWidth={2.2} />
              </div>
              <div className="feature-label-text">
                <strong>Vault health</strong>
                <span>at a glance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
