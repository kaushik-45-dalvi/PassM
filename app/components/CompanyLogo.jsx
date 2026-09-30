'use client';

import { useState } from 'react';
import { getCompanyLogoUrl, getCompanyLogoUrlFallback, getCompanyInitial, resolveCompanyDomain } from '../../lib/utils/logoFetcher';

// Instant local vector assets for common initial accounts
const LOCAL_BRAND_ICONS = {
  google: '/brand-logos/google-g.png',
  netflix: '/brand-logos/netflix.svg',
  spotify: '/brand-logos/spotify-icon.svg',
  slack: '/brand-logos/slack-icon.svg',
  notion: '/brand-logos/notion.svg',
  amazon: '/brand-logos/amazon-hero.png',
};

export default function CompanyLogo({ name = '', url = '', size = 42, className = '' }) {
  // Use URL if provided, otherwise use Name
  const targetDomainInput = (url || name || '').trim();
  const cleanKey = (name || '').trim().toLowerCase();
  const localIcon = LOCAL_BRAND_ICONS[cleanKey];
  const cdnUrl = getCompanyLogoUrl(targetDomainInput || name);
  const fallbackCdnUrl = getCompanyLogoUrlFallback(targetDomainInput || name);
  const initial = getCompanyInitial(name || targetDomainInput);

  // 'local' → 'cdn' → 'cdn_fallback' → 'fallback'
  const initialStage = localIcon ? 'local' : 'cdn';
  const [stage, setStage] = useState(initialStage);
  const [prevInput, setPrevInput] = useState(`${cleanKey}_${url}`);

  const currentKey = `${cleanKey}_${url}`;
  if (prevInput !== currentKey) {
    setPrevInput(currentKey);
    setStage(localIcon ? 'local' : 'cdn');
  }

  let currentSrc = cdnUrl;
  if (stage === 'local') currentSrc = localIcon;
  else if (stage === 'cdn') currentSrc = cdnUrl;
  else if (stage === 'cdn_fallback') currentSrc = fallbackCdnUrl;

  return (
    <div 
      className={`dash-company-logo-wrap ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        overflow: 'hidden',
        background: stage === 'fallback' ? '#F1F5F9' : '#FFFFFF',
        border: '1.5px solid #000000',
        boxShadow: '1.5px 1.5px 0 #000000',
        flexShrink: 0
      }}
    >
      {stage !== 'fallback' ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentSrc}
          alt={`${name || 'Service'} logo`}
          className="dash-company-logo-img"
          style={{
            width: `${Math.round(size * 0.72)}px`,
            height: `${Math.round(size * 0.72)}px`,
            objectFit: 'contain',
            display: 'block'
          }}
          onError={() => {
            if (stage === 'local') {
              setStage('cdn');
            } else if (stage === 'cdn') {
              setStage('cdn_fallback');
            } else {
              setStage('fallback');
            }
          }}
        />
      ) : (
        <span
          className="dash-company-logo-fallback"
          style={{
            fontWeight: 900,
            fontSize: `${Math.max(11, Math.round(size * 0.44))}px`,
            color: '#000000',
            lineHeight: 1
          }}
        >
          {initial}
        </span>
      )}
    </div>
  );
}
