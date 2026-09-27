'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, Plus, Copy, Lock, RefreshCw } from 'lucide-react';

function genRandomPassword(len = 10, useSymbols = true) {
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const symbols = '*$#@!%&?+-=';
  const chars = useSymbols ? base + symbols : base;
  const random = new Uint32Array(len);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(random);
  }
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(random[i] % chars.length);
  }
  return result;
}

export default function Hero({ onOpenVault, onOpenDemo, showToast }) {
  const [password, setPassword] = useState('wV*VrtYuin');
  const [length, setLength] = useState(12);
  const [useSymbols, setUseSymbols] = useState(true);
  const [timeLeft, setTimeLeft] = useState(58);
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const handleGenerate = useCallback(() => {
    setIsRotating(true);
    const newPass = genRandomPassword(length, useSymbols);
    setPassword(newPass);
    setTimeLeft(60);
    showToast?.('New high-entropy password generated!');
    setTimeout(() => setIsRotating(false), 350);
  }, [length, useSymbols, showToast]);

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setLength(val);
    const newPass = genRandomPassword(val, useSymbols);
    setPassword(newPass);
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(password).then(() => {
        setCopied(true);
        showToast?.('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        setCopied(true);
        showToast?.('Password copied!');
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      setCopied(true);
      showToast?.('Password copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 60-second countdown cycle - pure state update without side-effects
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Silently regenerate password when 60s countdown completes
  useEffect(() => {
    if (timeLeft === 60) {
      setPassword(genRandomPassword(length));
    }
  }, [timeLeft, length]);

  // Calculate dynamic slider track fill
  const min = 8;
  const max = 24;
  const pct = ((length - min) / (max - min)) * 100;
  const sliderStyle = {
    background: `linear-gradient(to right, #4ADE80 0%, #4ADE80 ${pct}%, #CBD5E1 ${pct}%, #CBD5E1 100%)`,
  };

  // Calculate dynamic font size based on password length so it never overflows
  const getPasswordFontSize = (len) => {
    if (len <= 10) return '1.55rem';
    if (len <= 12) return '1.32rem';
    if (len <= 14) return '1.14rem';
    if (len <= 16) return '1.02rem';
    if (len <= 18) return '0.92rem';
    if (len <= 20) return '0.84rem';
    return '0.74rem';
  };

  return (
    <section className="hero-split">
      {/* Background Organic Green Wave Shape spanning from top navbar down through hero */}
      <div className="hero-green-bg-container">
        <svg viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none" className="hero-green-bg-svg">
          <defs>
            <linearGradient id="heroLeftBgGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="7.5%" stopColor="#FFFFFF" />
              <stop offset="11.5%" stopColor="#FAF7EE" />
              <stop offset="100%" stopColor="#FAF7EE" />
            </linearGradient>
          </defs>
          {/* Base background: Pure white behind navbar till green wave, soft cream below */}
          <rect x="0" y="0" width="1440" height="900" fill="url(#heroLeftBgGradient)" />

          {/* Mint-green organic wave on the right */}
          <path d="M 1440 0 L 895 0 C 865 40, 785 90, 680 160 C 600 230, 600 340, 615 430 C 635 530, 675 630, 730 730 C 775 810, 820 870, 860 900 L 1440 900 Z" fill="#B8F5BD"/>
        </svg>
      </div>

      {/* Hero Left: Cream background content */}
      <div className="hero-left-panel">
        <div className="hero-content">
          <div className="hero-badge">
            <span>Security starts here</span>
          </div>
          <h1 className="hero-title">
            Password<br />
            Management from<br />
            Anywhere
          </h1>
          <p className="hero-subtext">
            Life happens online. VaultSync helps you create strong passwords and keep your digital life organized, simply and securely.
          </p>
          <div className="hero-cta-group">
            <button suppressHydrationWarning className="btn-pill-black" onClick={onOpenVault}>
              Create your vault <span className="btn-arrow">&rarr;</span>
            </button>
            <button suppressHydrationWarning className="btn-pill-white" onClick={onOpenDemo || onOpenVault}>
              Explore demo <span className="btn-arrow">&rarr;</span>
            </button>
          </div>
          <div className="hero-trust-row">
            <span className="trust-stat">Client-side encrypted passwords · Strong password generator</span>
          </div>
        </div>
      </div>

      {/* Hero Right: Stacked cards & user-provided handwritten accents */}
      <div className="hero-right-panel">
        <div className="cards-canvas">
          {/* Center-left handwritten accent: User asset "Secure today brighter tomorrow" with arrow pointing to Amazon card */}
          <div className="hero-center-accent">
            <img
              src="/brand-logos/secure-today-accent.png"
              alt="Secure today brighter tomorrow"
              className="hero-center-accent-img"
            />
          </div>

          {/* Top-left radiating green burst accent */}
          <div className="hero-burst-lines">
            <img
              src="/brand-logos/hero-green-burst.png"
              alt="radiating burst"
              className="hero-burst-img"
            />
          </div>

          {/* Offset card outline backdrop behind Amazon card */}
          <div className="card-offset-outline"></div>

          {/* Card 1: Two-tier Login badge (top right, tucked behind Amazon) */}
          <div className="card-login-stack">
            <div className="login-tier-top">
              <div className="login-dots-capsule">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
            <div className="login-tier-bottom">
              <span className="login-card-title">Login</span>
              <div className="login-card-row">
                <Lock size={14} strokeWidth={2.4} style={{ color: '#000000', flexShrink: 0 }} />
                <div className="login-bars-col">
                  <div className="login-bar-top"></div>
                  <div className="login-bar-bottom"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Main Amazon Password Card */}
          <div className="card-amazon-main">
            <div className="card-amazon-header">
              <div className="brand-badge-amazon">
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <img
                    src="/brand-logos/amazon-hero.png"
                    alt="Amazon"
                    width="30"
                    height="31"
                    style={{ objectFit: 'contain', display: 'block' }}
                  />
                  <span className="amazon-title">Amazon</span>
                </div>
              </div>
              <div className="timer-badge">
                <span className="timer-text" id="countdownSec">{timeLeft} sec left</span>
                <div className="timer-donut">
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" fill="none" stroke="#E2E8F0" strokeWidth="2.4"/>
                    <circle cx="12" cy="12" r="9" fill="none" stroke="#22C55E" strokeWidth="2.4" strokeDasharray="40 56" strokeLinecap="round" transform="rotate(-90 12 12)"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Grey Rounded Container for Password & Email */}
            <div className="card-password-box">
              <div className="password-display-row">
                <span 
                  className="password-code" 
                  id="heroPasswordDisplay"
                  style={{ fontSize: getPasswordFontSize(password.length) }}
                >
                  {password}
                </span>
                <button 
                  suppressHydrationWarning 
                  className="btn-copy-icon" 
                  id="heroCopyBtn" 
                  title={copied ? "Copied!" : "Copy password"} 
                  onClick={handleCopy}
                  style={copied ? { background: '#22C55E', color: '#FFFFFF', borderColor: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' } : { display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {copied ? (
                    <Check size={18} strokeWidth={2.8} />
                  ) : (
                    <Copy size={18} strokeWidth={2.2} />
                  )}
                </button>
              </div>
              <div className="account-email-subtext">alex@vaultsync.app</div>
            </div>

            <button 
              suppressHydrationWarning 
              className="btn-generate-full" 
              id="heroGenBtn" 
              onClick={handleGenerate}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <RefreshCw 
                size={16} 
                strokeWidth={2.5}
                style={{ 
                  transform: isRotating ? 'rotate(180deg)' : 'none', 
                  transition: 'transform 0.35s ease' 
                }}
              />
              <span>Generate New</span>
            </button>
          </div>

          {/* Card 3: Length Slider Card docked directly below overlapping bottom-left */}
          <div className="card-slider-docked">
            <div className="slider-row">
              <span className="slider-title">Length</span>
              <span className="slider-number" id="heroPassLen">{length}</span>
            </div>
            <div className="slider-track-wrap">
              <input
                suppressHydrationWarning
                type="range"
                className="custom-range-slider"
                id="heroSlider"
                min="8"
                max="24"
                value={length}
                style={sliderStyle}
                onChange={handleSliderChange}
              />
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => {
                  setUseSymbols(!useSymbols);
                  setPassword(genRandomPassword(length, !useSymbols));
                }}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '3px 9px',
                  borderRadius: '12px',
                  border: '1.5px solid #000',
                  background: useSymbols ? '#B5F2B7' : '#FFFFFF',
                  color: '#000',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {useSymbols ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={12} strokeWidth={2.8} />
                    <span>Symbols (!@#)</span>
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={12} strokeWidth={2.8} />
                    <span>Add Symbols</span>
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Bottom-right handwritten note: User asset "One Password A Safer You" */}
          <div className="hero-bottom-right-accent">
            <img
              src="/brand-logos/one-password-accent.png"
              alt="One Password A Safer You"
              className="hero-bottom-right-accent-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
