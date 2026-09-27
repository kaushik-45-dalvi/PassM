'use client';

export default function StepsSection() {
  return (
    <section className="steps-wrapper">
      <div className="steps-black-card">
        <span className="steps-tag">IN FEW STEPS</span>
        <h2 className="steps-heading">Build safer password habits with VaultSync</h2>

        <div className="steps-track">
          {/* Step 1 */}
          <div className="step-card">
            <div className="step-circle step-white">1</div>
            <h3 className="step-label">Add to browser</h3>
            <p className="step-desc">Install the extension in seconds.</p>
          </div>

          {/* Curved Arrow 1 -> 2 */}
          <div className="step-curved-arrow">
            <svg width="68" height="24" viewBox="0 0 68 24" fill="none">
              <path d="M 6 18 C 22 4, 46 4, 60 14" stroke="#475569" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M 52 13 L 61 14 L 58 7" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Step 2 */}
          <div className="step-card">
            <div className="step-circle step-white">2</div>
            <h3 className="step-label">Create account</h3>
            <p className="step-desc">Set up your secure VaultSync account.</p>
          </div>

          {/* Curved Arrow 2 -> 3 */}
          <div className="step-curved-arrow">
            <svg width="68" height="24" viewBox="0 0 68 24" fill="none">
              <path d="M 6 18 C 22 4, 46 4, 60 14" stroke="#475569" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M 52 13 L 61 14 L 58 7" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Step 3 (Highlighted Mint Green with 3 green radiating lines on top) */}
          <div className="step-card">
            <div className="step-active-wrap">
              <div className="step-radiating-lines">
                <svg width="34" height="20" viewBox="0 0 34 20" fill="none">
                  <line x1="8" y1="18" x2="2" y2="6" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="17" y1="15" x2="17" y2="2" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="26" y1="18" x2="32" y2="6" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="step-circle step-green-active">3</div>
            </div>
            <h3 className="step-label">Save passwords</h3>
            <p className="step-desc">Let VaultSync do the heavy lifting.</p>
          </div>

          {/* Curved Arrow 3 -> 4 */}
          <div className="step-curved-arrow">
            <svg width="68" height="24" viewBox="0 0 68 24" fill="none">
              <path d="M 6 18 C 22 4, 46 4, 60 14" stroke="#475569" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M 52 13 L 61 14 L 58 7" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Step 4 */}
          <div className="step-card">
            <div className="step-circle step-white">4</div>
            <h3 className="step-label">Access anywhere</h3>
            <p className="step-desc">Your passwords, anytime, anywhere.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
