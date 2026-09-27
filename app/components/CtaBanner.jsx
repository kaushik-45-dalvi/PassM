'use client';

export default function CtaBanner({ onOpenDemo }) {
  return (
    <section className="cta-banner-sec">
      <div className="cta-mint-banner">
        {/* Left wavy lines deco */}
        <div className="cta-wavy-deco">
          <svg width="74" height="34" viewBox="0 0 74 34" fill="none">
            <path d="M2 7C14 7 17 2 29 2C41 2 44 7 56 7C68 7 71 2 73 2" stroke="#1F2937" strokeWidth="2.4" strokeLinecap="round"/>
            <path d="M2 17C14 17 17 12 29 12C41 12 44 17 56 17C68 17 71 12 73 12" stroke="#1F2937" strokeWidth="2.4" strokeLinecap="round"/>
            <path d="M2 27C14 27 17 22 29 22C41 22 44 27 56 27C68 27 71 22 73 22" stroke="#1F2937" strokeWidth="2.4" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="cta-text-wrap">
          <span className="cta-green-tag">GET STARTED TODAY</span>
          <h2 className="cta-banner-heading">Take control of your digital life</h2>
          <p className="cta-banner-sub">Create stronger habits with one encrypted vault for your important logins.</p>
        </div>

        <div className="cta-button-wrap">
          <button suppressHydrationWarning className="btn-demo-large" onClick={onOpenDemo}>Book a Demo</button>
          <span className="cta-subnote">No credit card required</span>
        </div>
      </div>
    </section>
  );
}
