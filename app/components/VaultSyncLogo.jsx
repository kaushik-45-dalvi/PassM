'use client';

import React from 'react';
import Link from 'next/link';

export function VaultSyncLogoIcon({ size = 32, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', ...style }}
      aria-label="VaultSync Symbol"
    >
      {/* Neo-brutalist offset hard black shadow */}
      <rect x="14" y="14" width="76" height="76" rx="22" fill="#000000" />
      {/* Mint green rounded squircle body with bold black border */}
      <rect
        x="8"
        y="8"
        width="76"
        height="76"
        rx="22"
        fill="#A7F3D0"
        stroke="#000000"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      {/* Precision shield outline */}
      <path
        d="M 46 29 C 39 32 31 34 31 38 C 31 53 38 64 46 70 C 54 64 61 53 61 38 C 61 34 53 32 46 29 Z"
        stroke="#000000"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
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
        gap: size > 32 ? '12px' : '9px',
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
