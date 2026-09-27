export default function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        height: '4px',
        background: '#FAF7EE'
      }}
    >
      <div
        style={{
          height: '100%',
          background: '#16A34A',
          width: '100%',
          animation: 'vaultsync-progress 0.6s ease-in-out infinite'
        }}
      />
      <style>{`
        @keyframes vaultsync-progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
