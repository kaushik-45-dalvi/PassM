import Link from 'next/link';
import VaultSyncLogo from './VaultSyncLogo';

export default function Footer() {
  return (
    <footer className="footer-sec">
      <div className="footer-top-row">
        <div className="footer-col-brand">
          <VaultSyncLogo size={28} fontSize="1.2rem" href="/" />
          <p className="footer-brand-sub" style={{ marginTop: 10 }}>A calmer, safer way to manage your digital life.</p>
        </div>
        <div className="footer-links-col">
          <h4>Product</h4>
          <ul>
            <li><Link href="/features" prefetch={true}>Features</Link></li>
            <li><Link href="/security" prefetch={true}>Security</Link></li>
            <li><Link href="/dashboard" prefetch={true}>Open vault</Link></li>
          </ul>
        </div>
        <div className="footer-links-col">
          <h4>Resources</h4>
          <ul>
            <li><Link href="/faq" prefetch={true}>FAQ</Link></li>
            <li><Link href="/security" prefetch={true}>Security overview</Link></li>
            <li><Link href="/privacy" prefetch={true}>Privacy</Link></li>
          </ul>
        </div>
        <div className="footer-links-col">
          <h4>Legal</h4>
          <ul>
            <li><Link href="/terms" prefetch={true}>Terms of service</Link></li>
            <li><Link href="/privacy" prefetch={true}>Privacy policy</Link></li>
          </ul>
        </div>
        <div className="footer-subscribe-col">
          <h4>Build safer habits</h4>
          <p className="footer-brand-sub">Generate a unique password for every account and review your vault regularly.</p>
        </div>
      </div>
      <div className="footer-bottom-row">
        <span>© {new Date().getFullYear()} VaultSync. All rights reserved.</span>
        <div className="footer-legal-links">
          <Link href="/privacy" prefetch={true}>Privacy Policy</Link>
          <Link href="/terms" prefetch={true}>Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
