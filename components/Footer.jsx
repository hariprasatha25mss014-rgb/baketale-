'use client';

import { INSTAGRAM_URL } from '../lib/data';

export default function Footer() {
  return (
    <footer className="atelier-footer">
      <div className="atelier-footer__top">
        <div className="atelier-footer__brand">
          <a href="#top" className="atelier-footer__logo">BAKETALE<span>™</span></a>
          <p className="atelier-footer__tagline">A story in every bite.</p>
          <p className="atelier-footer__desc">
            Handcrafted homemade brownies, bento cakes &amp; artisanal gift boxes. Baked in small batches with premium couverture chocolate and pure butter.
          </p>
        </div>

        <div className="atelier-footer__col">
          <h4>EXPLORE</h4>
          <nav>
            <a href="/menu">Flavours Menu</a>
            <a href="/#story">Our Story</a>
            <a href="/#box">Build a Box (₹150)</a>
            <a href="/menu">Specials &amp; Cakes</a>
            <a href="/reviews">Polaroid Reviews</a>
          </nav>
        </div>

        <div className="atelier-footer__col">
          <h4>ORDER &amp; CARE</h4>
          <nav>
            <span>Shipping Across India 📦</span>
            <span>Bespoke &amp; Bulk Event Orders</span>
            <span>Fresh Small-Batch Baking</span>
            <span>Temperature-Controlled Packaging</span>
          </nav>
        </div>

        <div className="atelier-footer__col atelier-footer__col--insta">
          <h4>INSTAGRAM DM</h4>
          <p>Add items to your bag, open receipt, and tap below to confirm your delivery slot.</p>
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Order on Instagram"
              className="bt-footer-insta-icon"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                color: '#ffffff',
                boxShadow: '0 6px 20px rgba(220, 39, 67, 0.4)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                textDecoration: 'none'
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="atelier-footer__bottom">
        <span>© {new Date().getFullYear()} Baketale Atelier. All rights reserved. Handcrafted with love. ♡</span>
        <a href="#top" className="atelier-footer__back-top">Back to top ↑</a>
      </div>
    </footer>
  );
}
