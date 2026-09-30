'use client';

import { useState } from 'react';
import { getCompanyLogoUrl, getCompanyLogoUrlFallback, getCompanyInitial, resolveCompanyDomain } from '../../lib/utils/logoFetcher';

// Instant local / high-res vector assets for prominent brands
const LOCAL_BRAND_ICONS = {
  google: '/brand-logos/google-g.png',
  netflix: '/brand-logos/netflix.svg',
  spotify: '/brand-logos/spotify-icon.svg',
  slack: '/brand-logos/slack-icon.svg',
  notion: '/brand-logos/notion.svg',
  amazon: '/brand-logos/amazon-hero.png',
  supabase: 'https://raw.githubusercontent.com/supabase/supabase/master/apps/www/public/favicon/favicon-196x196.png',
  supabse: 'https://raw.githubusercontent.com/supabase/supabase/master/apps/www/public/favicon/favicon-196x196.png',
};

export default function CompanyLogo({ name = '', url = '', size = 42, className = '' }) {
  const targetDomainInput = (url || name || '').trim();
  const cleanKey = (name || '').trim().toLowerCase();
  const domain = resolveCompanyDomain(targetDomainInput || name);
  const isGeneric = !domain || domain === 'generic.com' || (targetDomainInput.length < 2 && !['x'].includes(cleanKey));

  const localIcon = LOCAL_BRAND_ICONS[cleanKey];
  const cdnUrl = isGeneric ? '' : getCompanyLogoUrl(domain);
  const fallbackCdnUrl = isGeneric ? '' : getCompanyLogoUrlFallback(domain);
  const initial = getCompanyInitial(name || targetDomainInput);

  // If generic, show initial immediately without loading generic globe
  const initialStage = localIcon ? 'local' : isGeneric ? 'fallback' : 'cdn';
  const [stage, setStage] = useState(initialStage);
  const [prevKey, setPrevKey] = useState(`${cleanKey}_${domain}`);

  const currentKey = `${cleanKey}_${domain}`;
  if (prevKey !== currentKey) {
    setPrevKey(currentKey);
    setStage(localIcon ? 'local' : isGeneric ? 'fallback' : 'cdn');
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
        borderRadius: '8px',
        overflow: 'hidden',
        background: stage === 'fallback' ? '#FAF7EE' : '#FFFFFF',
        border: '1.5px solid #000000',
        boxShadow: '1px 1px 0 #000000',
        flexShrink: 0
      }}
    >
      {stage !== 'fallback' && currentSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentSrc}
          alt={`${name || 'Service'} logo`}
          className="dash-company-logo-img"
          style={{
            width: `${Math.round(size * 0.75)}px`,
            height: `${Math.round(size * 0.75)}px`,
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
            fontSize: `${Math.max(11, Math.round(size * 0.50))}px`,
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
