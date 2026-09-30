import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'VaultSync — Zero-Knowledge Password Manager';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#FAF7EE',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          padding: '60px',
        }}
      >
        {/* Decorative Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: '#B5F2B7',
            border: '3px solid #000000',
            borderRadius: '50px',
            padding: '10px 24px',
            boxShadow: '4px 4px 0 #000000',
            marginBottom: '28px',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span style={{ fontSize: '20px', fontWeight: 900, color: '#000000', letterSpacing: '-0.02em' }}>
            VAULTSYNC • ZERO-KNOWLEDGE AES-256
          </span>
        </div>

        {/* Big Catchy Title */}
        <div
          style={{
            fontSize: '68px',
            fontWeight: 900,
            color: '#000000',
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            marginBottom: '20px',
          }}
        >
          Secure Password Management<br />
          Built on Mathematics.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '26px',
            color: '#475569',
            textAlign: 'center',
            maxWidth: '850px',
            lineHeight: 1.4,
            marginBottom: '36px',
          }}
        >
          Client-side AES-256-GCM encryption, built-in 2FA TOTP authenticator, and active 30s clipboard memory scrubber.
        </div>

        {/* Feature Pills */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {['100% Zero-Knowledge', 'Built-in 2FA Authenticator', 'RAM Memory Guard', 'Free Forever'].map((pill, idx) => (
            <div
              key={idx}
              style={{
                background: '#FFFFFF',
                border: '2.5px solid #000000',
                borderRadius: '30px',
                padding: '8px 20px',
                fontSize: '18px',
                fontWeight: 800,
                color: '#000000',
                boxShadow: '3px 3px 0 #000000',
              }}
            >
              {pill}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
