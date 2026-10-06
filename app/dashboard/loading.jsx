export default function DashboardLoading() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7EE', display: 'flex', flexDirection: 'column' }}>
      {/* Top progress bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          height: '3px',
          background: '#FAF7EE'
        }}
      >
        <div
          style={{
            height: '100%',
            background: '#16A34A',
            width: '100%',
            animation: 'vaultsync-progress 0.8s ease-in-out infinite'
          }}
        />
      </div>

      {/* Vault Navbar Skeleton */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 70,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '2px solid #000000',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Brand Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#B5F2B7',
              border: '2px solid #000000',
              boxShadow: '1.5px 1.5px 0 #000000'
            }}
          />
          <div
            style={{
              width: 90,
              height: 20,
              borderRadius: 6,
              background: '#E2E8F0',
              animation: 'dashSkeletonPulse 1.2s ease-in-out infinite'
            }}
          />
        </div>

        {/* Search bar skeleton */}
        <div
          style={{
            flex: 1,
            maxWidth: 420,
            height: 38,
            borderRadius: 50,
            background: '#FFFFFF',
            border: '2px solid #000000',
            boxShadow: '2.5px 2.5px 0 #000000',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px'
          }}
        >
          <div
            style={{
              width: 140,
              height: 14,
              borderRadius: 4,
              background: '#E2E8F0',
              animation: 'dashSkeletonPulse 1.2s ease-in-out infinite'
            }}
          />
        </div>

        {/* Action buttons skeleton */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: 90,
              height: 36,
              borderRadius: 50,
              background: '#000000',
              boxShadow: '2px 2px 0 #000000'
            }}
          />
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0 #000000'
            }}
          />
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#B5F2B7',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0 #000000'
            }}
          />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main style={{ flex: 1, maxWidth: 1240, width: '100%', margin: '0 auto', padding: '28px 20px 80px' }}>
        {/* Metric Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '28px'
          }}
        >
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              style={{
                background: '#FFFFFF',
                border: '2.5px solid #000000',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: '4px 4px 0 #000000',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div
                style={{
                  width: '40%',
                  height: 14,
                  borderRadius: 6,
                  background: '#E2E8F0',
                  animation: 'dashSkeletonPulse 1.2s ease-in-out infinite'
                }}
              />
              <div
                style={{
                  width: '60%',
                  height: 28,
                  borderRadius: 6,
                  background: '#CBD5E1',
                  animation: 'dashSkeletonPulse 1.2s ease-in-out infinite'
                }}
              />
            </div>
          ))}
        </div>

        {/* Vault Items Skeleton List */}
        <div
          style={{
            background: '#FFFFFF',
            border: '2.5px solid #000000',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '4px 4px 0 #000000',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div
              style={{
                width: 140,
                height: 20,
                borderRadius: 6,
                background: '#000000'
              }}
            />
            <div
              style={{
                width: 80,
                height: 16,
                borderRadius: 6,
                background: '#E2E8F0',
                animation: 'dashSkeletonPulse 1.2s ease-in-out infinite'
              }}
            />
          </div>

          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '16px',
                border: '1.5px solid #E2E8F0',
                background: '#FAFAFA',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#E2E8F0',
                    animation: 'dashSkeletonPulse 1.2s ease-in-out infinite'
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                  <div
                    style={{
                      width: '35%',
                      height: 14,
                      borderRadius: 4,
                      background: '#CBD5E1',
                      animation: 'dashSkeletonPulse 1.2s ease-in-out infinite'
                    }}
                  />
                  <div
                    style={{
                      width: '20%',
                      height: 12,
                      borderRadius: 4,
                      background: '#E2E8F0',
                      animation: 'dashSkeletonPulse 1.2s ease-in-out infinite'
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  width: 70,
                  height: 28,
                  borderRadius: 20,
                  background: '#E2E8F0',
                  animation: 'dashSkeletonPulse 1.2s ease-in-out infinite'
                }}
              />
            </div>
          ))}
        </div>
      </main>

      <style>{`
        @keyframes dashSkeletonPulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.95; }
        }
        @keyframes vaultsync-progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
