'use client';

import { useState } from 'react';
import { Eye, EyeOff, Copy, Check, X, ArrowRight, ShieldCheck, Layers, Key, Film, Briefcase } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

const DEMO_ITEMS = [
  {
    id: 'demo-1',
    name: 'Netflix',
    username: 'alex@vaultsync.app',
    password: 'pW*9xK#mQ2vL$8tR',
    category: 'Entertainment',
    url: 'netflix.com',
  },
  {
    id: 'demo-2',
    name: 'Spotify',
    username: 'alex.sound@gmail.com',
    password: 'mU$1c_Tr4ck$99!',
    category: 'Entertainment',
    url: 'spotify.com',
  },
  {
    id: 'demo-3',
    name: 'GitHub',
    username: 'alex-developer',
    password: 'ghp_9284750293847529',
    category: 'Work',
    url: 'github.com',
  },
  {
    id: 'demo-4',
    name: 'Google',
    username: 'alex@vaultsync.app',
    password: 'G00gle_S3cur3!99',
    category: 'Logins',
    url: 'google.com',
  },
];

export default function DemoModal({ isOpen, onClose, onOpenVault }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [revealedIds, setRevealedIds] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const categories = ['All', 'Logins', 'Entertainment', 'Work'];

  const filteredItems = DEMO_ITEMS.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.username.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (id, text, e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const toggleReveal = (id, e) => {
    e.stopPropagation();
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="vault-modal-backdrop active" role="presentation" onClick={onClose}>
      <section
        className="demo-modal-window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-title"
        onClick={(event) => event.stopPropagation()}
        style={{ maxWidth: '620px', width: '92%', borderRadius: '24px', padding: '28px 24px' }}
      >
        <div className="demo-modal-header" style={{ marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="demo-tag" style={{ margin: 0 }}>LIVE INTERACTIVE PREVIEW</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', background: '#DCFCE7', color: '#16A34A', padding: '2px 8px', borderRadius: '12px', fontWeight: '800' }}>
                <ShieldCheck size={12} strokeWidth={2.5} />
                <span>Zero-Knowledge AES-256</span>
              </span>
            </div>
            <h2 id="demo-title" style={{ fontSize: '1.45rem', fontWeight: '900', margin: '4px 0 2px' }}>
              Experience VaultSync in Action
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
              Try searching, revealing, and copying simulated credentials below.
            </p>
          </div>
          <button className="v-close-btn" onClick={onClose} aria-label="Close preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Demo Search & Category Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search demo vault items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid #000000',
                borderRadius: '12px',
                fontSize: '0.88rem',
                outline: 'none',
                background: '#FAF7EE'
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 2
                }}
              >
                <X size={15} strokeWidth={2.5} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '5px 14px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  border: '1.8px solid #000',
                  background: activeCategory === cat ? '#000000' : '#FFFFFF',
                  color: activeCategory === cat ? '#FFFFFF' : '#000000',
                  boxShadow: activeCategory === cat ? '2px 2px 0 #B5F2B7' : '2px 2px 0 #000000',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {cat === 'All' && <Layers size={13} strokeWidth={2.4} />}
                {cat === 'Logins' && <Key size={13} strokeWidth={2.4} />}
                {cat === 'Entertainment' && <Film size={13} strokeWidth={2.4} />}
                {cat === 'Work' && <Briefcase size={13} strokeWidth={2.4} />}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Demo Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto', marginBottom: '16px' }}>
          {filteredItems.map((item) => {
            const isRevealed = Boolean(revealedIds[item.id]);
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="demo-item-row"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <CompanyLogo name={item.name} size={32} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.username}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <code className="demo-password-code">
                    {isRevealed ? item.password : '••••••••••••'}
                  </code>

                  <button
                    type="button"
                    onClick={(e) => toggleReveal(item.id, e)}
                    title={isRevealed ? 'Hide password' : 'Show password'}
                    aria-label={isRevealed ? 'Hide password' : 'Show password'}
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #000',
                      borderRadius: '8px',
                      padding: '5px 7px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000000',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isRevealed ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleCopy(item.id, item.password, e)}
                    title="Copy Password"
                    aria-label="Copy Password"
                    style={{
                      background: isCopied ? '#22C55E' : '#FFFFFF',
                      color: isCopied ? '#FFF' : '#000',
                      border: '1.5px solid #000',
                      borderRadius: '8px',
                      padding: '5px 8px',
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isCopied ? (
                      <>
                        <Check size={12} strokeWidth={2.5} />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} strokeWidth={2} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Call to Action */}
        <div className="demo-cta-bottom">
          <div>
            <div style={{ fontWeight: '900', fontSize: '0.92rem', color: '#000' }}>Ready to create your secure vault?</div>
            <div style={{ fontSize: '0.76rem', color: '#15803D' }}>100% Free · Client-side encryption · Instant setup</div>
          </div>
          <button
            type="button"
            className="demo-cta-btn"
            onClick={onOpenVault}
          >
            <span>Create Vault</span>
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </section>
    </div>
  );
}
