'use client';

import { useState } from 'react';
import { getCompanyLogoUrl, getCompanyInitial } from '../../lib/utils/logoFetcher';

// Instant local vector assets for common initial accounts
const LOCAL_BRAND_ICONS = {
  google: '/brand-logos/google-g.png',
  netflix: '/brand-logos/netflix.svg',
  spotify: '/brand-logos/spotify-icon.svg',
  slack: '/brand-logos/slack-icon.svg',
  notion: '/brand-logos/notion.svg',
  amazon: '/brand-logos/amazon-hero.png',
};

export default function CompanyLogo({ name, size = 42, className = '' }) {
  const cleanKey = (name || '').trim().toLowerCase();
  const localIcon = LOCAL_BRAND_ICONS[cleanKey];
  const cdnUrl = getCompanyLogoUrl(name);
  const initial = getCompanyInitial(name);

  // 'local' → try local icon first, 'cdn' → try CDN, 'fallback' → letter
  const [stage, setStage] = useState(localIcon ? 'local' : 'cdn');
  const [prevKey, setPrevKey] = useState(cleanKey);

  if (prevKey !== cleanKey) {
    setPrevKey(cleanKey);
    setStage(localIcon ? 'local' : 'cdn');
  }

  const currentSrc = stage === 'local' ? localIcon : cdnUrl;

  return (
    <div 
      className={`dash-company-logo-wrap ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
      }}
    >
      {stage !== 'fallback' ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentSrc}
          alt={`${name} logo`}
          className="dash-company-logo-img"
          onError={() => {
            if (stage === 'local') {
              // Local icon failed → try CDN
              setStage('cdn');
            } else {
              // CDN also failed → show letter initial
              setStage('fallback');
            }
          }}
        />
      ) : (
        <span className="dash-company-logo-fallback">
          {initial}
        </span>
      )}
    </div>
  );
}
