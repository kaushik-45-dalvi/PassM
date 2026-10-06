export default function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#FAF7EE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        pointerEvents: 'none'
      }}
    >
      {/* Top progress line */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'rgba(0, 0, 0, 0.06)'
        }}
      >
        <div
          style={{
            height: '100%',
            background: '#16A34A',
            width: '100%',
            animation: 'vaultsync-progress 0.7s ease-in-out infinite'
          }}
        />
      </div>

      {/* Pulsing Shield Logo */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: '#B5F2B7',
          border: '2.5px solid #000000',
          boxShadow: '3px 3px 0 #000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'vaultsync-pulse 1.2s ease-in-out infinite'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>

      <div
        style={{
          fontSize: '0.90rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#000000',
          opacity: 0.75
        }}
      >
        VaultSync
      </div>

      <style>{`
        @keyframes vaultsync-progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes vaultsync-pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
