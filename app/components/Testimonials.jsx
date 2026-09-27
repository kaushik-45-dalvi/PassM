'use client';

import { Star } from 'lucide-react';

function StarRating() {
  return (
    <div className="testi-stars" style={{ display: 'flex', gap: '3px', margin: '12px 0 16px' }}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} fill="#F59E0B" stroke="#D97706" />
      ))}
    </div>
  );
}

export default function Testimonials({ onOpenVault }) {
  return (
    <section className="testimonials-sec">
      <div className="testimonials-container">
        {/* Left text block */}
        <div className="testimonials-left">
          <span className="section-tag-green">WHAT OUR USERS SAY</span>
          <h2 className="testimonials-heading">
            Real people.<br />
            Real peace of mind.
          </h2>
          <p className="testimonials-subtext">
            Join thousands who trust VaultSync to keep their digital lives secure.
          </p>
          <button suppressHydrationWarning className="btn-pill-black" onClick={onOpenVault}>See More Reviews</button>
        </div>

        {/* Right 3 Testimonial Cards */}
        <div className="testimonials-cards-row">
          {/* Card 1: Founder */}
          <div className="testi-card-mint">
            <p className="testi-quote">
              &ldquo;VaultSync has made managing my passwords so easy. I feel so much safer online!&rdquo;
            </p>
            <StarRating />
            <div className="testi-author-row">
              <img
                className="testi-avatar-img"
                src="/avatars/founder.png"
                alt="Kaushik Dalvi"
                style={{ objectFit: 'cover', objectPosition: 'center 12%' }}
              />
              <div className="testi-author-info">
                <strong>Kaushik Dalvi</strong>
                <span>Founder &amp; Creator</span>
              </div>
            </div>
          </div>

          {/* Card 2: Dhairya Darji */}
          <div className="testi-card-mint">
            <p className="testi-quote">
              &ldquo;The auto-fill is a game changer. I save so much time every day.&rdquo;
            </p>
            <StarRating />
            <div className="testi-author-row">
              <img
                className="testi-avatar-img"
                src="/avatars/dhairya-darji.png"
                alt="Dhairya Darji"
                style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
              />
              <div className="testi-author-info">
                <strong>Dhairya Darji</strong>
                <span>Founder of SyncClip</span>
              </div>
            </div>
          </div>

          {/* Card 3: Emily R. */}
          <div className="testi-card-mint">
            <p className="testi-quote">
              &ldquo;Finally a password manager that&rsquo;s simple, secure and works everywhere.&rdquo;
            </p>
            <StarRating />
            <div className="testi-author-row">
              <img
                className="testi-avatar-img"
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80"
                alt="Emily R."
              />
              <div className="testi-author-info">
                <strong>Emily R.</strong>
                <span>Product Manager</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

