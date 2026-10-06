'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignInButton, Show, UserButton } from '@clerk/nextjs';
import VaultSyncLogo from './VaultSyncLogo';

export default function Navbar({ onOpenVault, onOpenDemo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Proactively prefetch all primary routes immediately on mount for 0ms instant transitions
  useEffect(() => {
    const routes = ['/features', '/security', '/faq', '/terms', '/privacy', '/dashboard', '/sign-in'];
    routes.forEach((route) => {
      try {
        router.prefetch(route);
      } catch (_) {}
    });
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Dismiss on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'menu-open' : ''}`} id="navbar">
        <div className="nav-inner">
          <VaultSyncLogo size={32} fontSize="1.3rem" href="/" />
          
          {/* Desktop Nav Links */}
          <ul className="nav-menu" id="nav-menu">
            <li><Link href="/features" prefetch={true}>Features</Link></li>
            <li><Link href="/security" prefetch={true}>Security</Link></li>
            <li><Link href="/faq" prefetch={true}>FAQ</Link></li>
          </ul>

          {/* Desktop Nav Actions */}
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Show when="signed-out">
              <Link href="/sign-in" prefetch={true} className="btn-signin">
                Sign In
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard" prefetch={true} className="btn-signin">
                Open Vault &rarr;
              </Link>
              <UserButton afterSignOutUrl="/" />
            </Show>
            <button suppressHydrationWarning className="btn-demo" onClick={onOpenDemo}>Book a Demo</button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            suppressHydrationWarning
            type="button"
            className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
            id="hamburger"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>

        {/* Mobile Dropdown Drawer Menu */}
        <div className={`nav-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`} id="mobile-drawer" role="dialog" aria-modal="true">
          <ul className="nav-mobile-links">
            <li><Link href="/features" prefetch={true} onClick={() => setMobileMenuOpen(false)}>Features</Link></li>
            <li><Link href="/security" prefetch={true} onClick={() => setMobileMenuOpen(false)}>Security</Link></li>
            <li><Link href="/faq" prefetch={true} onClick={() => setMobileMenuOpen(false)}>FAQ</Link></li>
          </ul>
          <div className="nav-mobile-actions">
            <Show when="signed-out">
              <Link
                href="/sign-in"
                prefetch={true}
                className="btn-signin-mobile"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                prefetch={true}
                className="btn-signin-mobile"
                onClick={() => setMobileMenuOpen(false)}
              >
                Open Vault &rarr;
              </Link>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
                <UserButton afterSignOutUrl="/" />
              </div>
            </Show>
            <button
              suppressHydrationWarning
              type="button"
              className="btn-demo-mobile"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
            >
              Book a Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop overlay for dismissing mobile drawer */}
      <div
        className={`nav-mobile-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
