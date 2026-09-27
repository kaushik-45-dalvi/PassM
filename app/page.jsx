'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StepsSection from './components/StepsSection';
import SecuritySection from './components/SecuritySection';
import TrustedBy from './components/TrustedBy';
import Testimonials from './components/Testimonials';
import WhyMyPass from './components/WhyMyPass';
import FaqSection from './components/FaqSection';
import CtaBanner from './components/CtaBanner';
import Footer from './components/Footer';
import DemoModal from './components/DemoModal';

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToastState] = useState(false);

  const triggerToast = useCallback((msg) => {
    setToastMessage(msg);
    setShowToastState(true);
    setTimeout(() => {
      setShowToastState(false);
    }, 2400);
  }, []);

  const handleOpenVault = (accountOrEvent) => {
    if (accountOrEvent && accountOrEvent.preventDefault) accountOrEvent.preventDefault();
    if (isSignedIn) {
      router.push('/dashboard');
    } else {
      openSignIn({ forceRedirectUrl: '/dashboard' });
    }
  };

  const handleOpenDemo = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsDemoOpen(true);
  };

  const handleCloseDemo = () => {
    setIsDemoOpen(false);
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDemoOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main>
      <Navbar onOpenVault={() => handleOpenVault()} onOpenDemo={handleOpenDemo} />
      <Hero onOpenVault={() => handleOpenVault()} onOpenDemo={handleOpenDemo} showToast={triggerToast} />
      <StepsSection />
      <SecuritySection onOpenVault={handleOpenVault} />
      <TrustedBy />
      <Testimonials onOpenVault={() => handleOpenVault()} />
      <WhyMyPass onOpenVault={() => handleOpenVault()} />
      <FaqSection />
      <CtaBanner onOpenDemo={handleOpenDemo} />
      <Footer />

      <DemoModal
        isOpen={isDemoOpen}
        onClose={handleCloseDemo}
        onOpenVault={handleOpenVault}
      />

      <div className={`toast ${showToast ? 'show' : ''}`} id="toast">
        {toastMessage}
      </div>
    </main>
  );
}
