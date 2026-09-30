'use client';

import React from 'react';
import Link from 'next/link';

export function VaultSyncLogoIcon({ size = 32, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', ...style }}
      aria-label="VaultSync Shield Padlock Symbol"
    >
      {/* Outer Mint Shield / Badge Body with Bold Black Border */}
      <path
        d="M 256,36 C 375,36 445,82 445,190 C 445,325 325,420 256,478 C 187,420 67,325 67,190 C 67,82 137,36 256,36 Z"
        fill="#B5F2B7"
        stroke="#000000"
        strokeWidth="26"
        strokeLinejoin="round"
      />

      {/* Inner Vault Padlock Shackle Loop */}
      <path
        d="M 184,242 L 184,180 C 184,140 216,108 256,108 C 296,108 328,140 328,180 L 328,242"
        fill="none"
        stroke="#000000"
        strokeWidth="32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Padlock Base Body in Crisp White with Black Border */}
      <rect
        x="148"
        y="236"
        width="216"
        height="160"
        rx="28"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="26"
        strokeLinejoin="round"
      />

      {/* Padlock Top Rim Accent Line */}
      <line
        x1="162"
        y1="258"
        x2="350"
        y2="258"
        stroke="#000000"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Center Keyhole */}
      <circle cx="256" cy="310" r="20" fill="#000000" />
      <polygon points="245,316 267,316 272,356 240,356" fill="#000000" />
    </svg>
  );
}

export default function VaultSyncLogo({
  size = 32,
  fontSize = '1.25rem',
  href = '/',
  showText = true,
  className = '',
  textColor = '#000000',
  style = {}
}) {
  const content = (
    <div
      className={`vaultsync-brand-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size > 32 ? '11px' : '9px',
        textDecoration: 'none',
        userSelect: 'none',
        ...style
      }}
    >
      <VaultSyncLogoIcon size={size} />
      {showText && (
        <span
          className="vaultsync-brand-text"
          style={{
            fontWeight: 900,
            fontSize: fontSize,
            letterSpacing: '-0.03em',
            color: textColor,
            fontFamily: 'inherit',
            lineHeight: 1
          }}
        >
          VaultSync
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'inline-flex' }}>
        {content}
      </Link>
    );
  }

  return content;
}
