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
    const routes = ['/features', '/security', '/faq', '/terms', '/privacy', '/dashboard'];
    routes.forEach((route) => {
      try {
        router.prefetch(route);
      } catch (_) {}
    });
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
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
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button suppressHydrationWarning className="btn-signin" style={{ cursor: 'pointer' }}>
                Sign In
              </button>
            </SignInButton>
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
          className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
          id="hamburger"
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Mobile Dropdown Drawer Menu */}
      <div className={`nav-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`} id="mobile-drawer">
        <ul className="nav-mobile-links">
          <li><Link href="/features" prefetch={true} onClick={() => setMobileMenuOpen(false)}>Features</Link></li>
          <li><Link href="/security" prefetch={true} onClick={() => setMobileMenuOpen(false)}>Security</Link></li>
          <li><Link href="/faq" prefetch={true} onClick={() => setMobileMenuOpen(false)}>FAQ</Link></li>
        </ul>
        <div className="nav-mobile-actions">
          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button
                suppressHydrationWarning
                className="btn-signin-mobile"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </button>
            </SignInButton>
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
  );
}
