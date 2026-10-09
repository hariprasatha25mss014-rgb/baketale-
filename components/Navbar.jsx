'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './Cart';
import { INSTAGRAM_URL } from '../lib/data';

export default function Navbar() {
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="bt-nav">
        <Link href="/" className="bt-logo">
          BAKETALE<span>™</span>
        </Link>

        {/* Center Nav Links */}
        <nav className="bt-nav-links">
          <Link href="/menu" className={`bt-nav-link ${pathname === '/menu' ? 'is-active' : ''}`}>
            MENU
          </Link>
          <Link href="/reviews" className={`bt-nav-link ${pathname === '/reviews' ? 'is-active' : ''}`}>
            FEEDBACK
          </Link>
        </nav>

        {/* Right Side Action Area */}
        <div className="bt-nav-right">
          <Link href="/reviews?write=true" className="bt-nav-highlight">
            WRITE A REVIEW
          </Link>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bt-nav-insta-icon"
            title="Follow on Instagram @baketalee"
            aria-label="Instagram"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>

          <button
            className="bt-cart"
            onClick={() => setOpen(true)}
            aria-label={`Open shopping bag, ${count} items`}
          >
            BAG <span className="bt-cart-count">{String(count).padStart(2, '0')}</span>
          </button>

          <button
            className="bt-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="bt-mobile-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="bt-mobile-drawer"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bt-mobile-drawer__head">
                <span className="bt-logo">BAKETALE<span>™</span></span>
                <button
                  className="bt-mobile-close"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <nav className="bt-mobile-drawer__links">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <span>01</span> HOME
                </Link>
                <Link href="/menu" onClick={() => setMobileOpen(false)}>
                  <span>02</span> MENU
                </Link>
                <Link href="/reviews" onClick={() => setMobileOpen(false)}>
                  <span>03</span> FEEDBACK
                </Link>
                <Link href="/reviews?write=true" onClick={() => setMobileOpen(false)}>
                  <span>04</span> WRITE A REVIEW ✦
                </Link>
              </nav>

              <div className="bt-mobile-drawer__foot">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bt-pill bt-pill--insta"
                  onClick={() => setMobileOpen(false)}
                >
                  Order on Instagram @baketalee ↗
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
