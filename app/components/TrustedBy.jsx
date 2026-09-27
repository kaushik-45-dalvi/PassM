'use client';

export default function TrustedBy() {
  return (
    <section className="trusted-brands-sec">
      <div className="trusted-card-banner">
        <p className="trusted-title-green">TRUSTED BY INDIVIDUALS AND TEAMS AT</p>
        <div className="trusted-brand-row">
          {/* Google */}
          <div className="brand-item">
            <img 
              src="/brand-logos/google.svg" 
              alt="Google" 
              style={{ height: '30px', width: 'auto', display: 'block' }} 
            />
          </div>

          {/* Microsoft */}
          <div className="brand-item">
            <img 
              src="/brand-logos/microsoft.svg" 
              alt="Microsoft" 
              style={{ height: '24px', width: 'auto', display: 'block' }} 
            />
          </div>

          {/* Amazon */}
          <div className="brand-item">
            <img 
              src="/brand-logos/amazon.svg" 
              alt="Amazon" 
              style={{ height: '27px', width: 'auto', display: 'block' }} 
            />
          </div>

          {/* Netflix */}
          <div className="brand-item">
            <img 
              src="/brand-logos/netflix.svg" 
              alt="Netflix" 
              style={{ height: '24px', width: 'auto', display: 'block' }} 
            />
          </div>

          {/* Spotify */}
          <div className="brand-item">
            <img 
              src="/brand-logos/spotify.svg" 
              alt="Spotify" 
              style={{ height: '27px', width: 'auto', display: 'block' }} 
            />
          </div>

          {/* Slack */}
          <div className="brand-item">
            <img 
              src="/brand-logos/slack.svg" 
              alt="Slack" 
              style={{ height: '26px', width: 'auto', display: 'block' }} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}


